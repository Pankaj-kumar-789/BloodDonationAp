"use client";

import { useState } from "react";
import { Plus, Minus, Droplet, Loader2, Save } from "lucide-react";
import { updateInventoryAction } from "@/app/actions/inventory";

interface InventoryItem {
  group: string;
  label: string;
  units: number;
}

export default function InventoryManager({ initialInventory }: { initialInventory: InventoryItem[] }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdate = async (group: string, newUnits: number) => {
    if (newUnits < 0) return;
    
    // Optimistic update
    setInventory(prev => prev.map(item => item.group === group ? { ...item, units: newUnits } : item));
    setLoading(group);

    const res = await updateInventoryAction(group, newUnits);
    
    if (res.error) {
      // Revert if error
      setInventory(initialInventory);
      alert(res.error);
    }
    
    setLoading(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {inventory.map(item => (
        <div key={item.group} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col items-center relative overflow-hidden group hover:border-red-200 transition-colors">
          {loading === item.group && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary-red animate-spin" />
            </div>
          )}
          
          <div className="w-16 h-16 rounded-full bg-red-50 text-primary-red flex items-center justify-center font-bold text-2xl mb-4 border-4 border-white shadow-sm">
            {item.label}
          </div>
          
          <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Available Units</div>
          <div className="text-4xl font-black text-gray-900 mb-6">{item.units}</div>
          
          <div className="flex items-center gap-3 w-full">
            <button 
              onClick={() => handleUpdate(item.group, item.units - 1)}
              disabled={item.units === 0}
              className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 py-3 rounded-xl flex justify-center transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleUpdate(item.group, item.units + 1)}
              className="flex-1 bg-red-50 hover:bg-red-100 text-primary-red py-3 rounded-xl flex justify-center transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
