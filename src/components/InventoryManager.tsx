"use client";

import { useState } from "react";
import { Plus, Minus, Droplet, Loader2, Save } from "lucide-react";
import { updateInventoryAction } from "@/app/actions/inventory";

interface InventoryItem {
  group: string;
  label: string;
  units: number;
  type: string;
}

export default function InventoryManager({ initialInventory }: { initialInventory: InventoryItem[] }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [loading, setLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("BLOOD");

  const handleUpdate = async (group: string, newUnits: number, type: string) => {
    if (newUnits < 0) return;
    
    // Optimistic update
    setInventory(prev => prev.map(item => (item.group === group && item.type === type) ? { ...item, units: newUnits } : item));
    setLoading(`${group}-${type}`);

    const res = await updateInventoryAction(group, newUnits, type as any);
    
    if (res.error) {
      // Revert if error
      setInventory(initialInventory);
      alert(res.error);
    }
    
    setLoading(null);
  };

  return (
    <div>
      <div className="flex gap-2 mb-8 bg-gray-100 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
        {["BLOOD", "PLATELETS", "PLASMA"].map(t => (
          <button 
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === t ? "bg-white dark:bg-slate-900 text-primary-red shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"}`}
          >
            {t === "BLOOD" ? "Whole Blood" : t === "PLATELETS" ? "Platelets" : "Plasma"}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventory.filter(i => i.type === activeTab).map(item => (
          <div key={item.group} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center relative overflow-hidden group hover:border-red-200 dark:hover:border-red-900/50 hover:-translate-y-1 hover:shadow-lg transition-all">
            {loading === `${item.group}-${item.type}` && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary-red animate-spin" />
            </div>
          )}
          
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/50 text-primary-red flex items-center justify-center font-bold text-2xl mb-4 border-4 border-white dark:border-slate-900 shadow-sm">
            {item.label}
          </div>
          
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Available Units</div>
          <div className="text-4xl font-black text-gray-900 dark:text-white mb-6">{item.units}</div>
          
          <div className="flex items-center gap-3 w-full">
            <button 
              onClick={() => handleUpdate(item.group, item.units - 1, item.type)}
              disabled={item.units === 0}
              className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 py-3 rounded-xl flex justify-center transition-all hover:-translate-y-0.5 hover:shadow-sm"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleUpdate(item.group, item.units + 1, item.type)}
              className="flex-1 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-primary-red py-3 rounded-xl flex justify-center transition-all hover:-translate-y-0.5 hover:shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
