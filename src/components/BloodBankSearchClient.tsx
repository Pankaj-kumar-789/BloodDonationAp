"use client";

import { useState } from "react";
import { Search, MapPin, Droplet, Building2, Phone, Mail, SearchX } from "lucide-react";
import { motion, Variants } from "framer-motion";
import EmptyState from "./EmptyState";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function BloodBankSearchClient({ bloodBanks }: { bloodBanks: any[] }) {
  const [bloodGroupFilter, setBloodGroupFilter] = useState("A_POS");
  const [donationTypeFilter, setDonationTypeFilter] = useState("BLOOD");
  const [searchQuery, setSearchQuery] = useState("");

  const bgOptions = [
    { value: "A_POS", label: "A+" },
    { value: "A_NEG", label: "A-" },
    { value: "B_POS", label: "B+" },
    { value: "B_NEG", label: "B-" },
    { value: "AB_POS", label: "AB+" },
    { value: "AB_NEG", label: "AB-" },
    { value: "O_POS", label: "O+" },
    { value: "O_NEG", label: "O-" },
  ];

  const filteredBanks = bloodBanks.filter((bank) => {
    const city = bank.city || "";
    const name = bank.user?.name || "";
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      if (!name.toLowerCase().includes(query) && !city.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    return true; 
  }).sort((a, b) => {
    const aUnits = a.inventory.find((i: any) => i.bloodGroup === bloodGroupFilter && i.donationType === donationTypeFilter)?.units || 0;
    const bUnits = b.inventory.find((i: any) => i.bloodGroup === bloodGroupFilter && i.donationType === donationTypeFilter)?.units || 0;
    return bUnits - aUnits;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 overflow-y-auto transition-colors">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">Blood Bank Inventory</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium transition-colors">Search live stock across registered blood banks.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select 
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white font-bold rounded-xl focus:ring-primary-red focus:border-primary-red block p-3 outline-none shadow-sm transition-colors"
              value={bloodGroupFilter}
              onChange={(e) => setBloodGroupFilter(e.target.value)}
            >
              {bgOptions.map(bg => <option key={bg.value} value={bg.value}>{bg.label}</option>)}
            </select>
            <select 
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white font-bold rounded-xl focus:ring-primary-red focus:border-primary-red block p-3 outline-none shadow-sm transition-colors"
              value={donationTypeFilter}
              onChange={(e) => setDonationTypeFilter(e.target.value)}
            >
              <option value="BLOOD">Whole Blood</option>
              <option value="PLATELETS">Platelets</option>
              <option value="PLASMA">Plasma</option>
            </select>
            
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-primary-red focus:border-primary-red block w-full ps-10 p-3 outline-none shadow-sm transition-colors" 
                placeholder="Search city or hospital name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredBanks.length === 0 ? (
            <div className="col-span-full">
              <EmptyState 
                icon={<SearchX className="w-10 h-10" strokeWidth={1.5} />} 
                title="No Blood Banks Found" 
                description="We couldn't find any blood banks matching your criteria. Try adjusting your filters or search city."
                action={{
                  label: "Clear Filters",
                  onClick: () => {
                    setSearchQuery("");
                    setBloodGroupFilter("Blood Group");
                    setDonationTypeFilter("Donation Type");
                  }
                }}
              />
            </div>
          ) : (
            filteredBanks.map((bank) => {
              const totalUnits = bank.inventory.reduce((sum: number, item: any) => sum + (item.units || 0), 0);
              const hasStock = totalUnits > 0;

              return (
                <motion.div variants={itemVariants} key={bank.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <div className={`p-6 border-b transition-colors ${hasStock ? 'bg-red-50/30 dark:bg-red-950/20 border-red-50 dark:border-red-900/30' : 'bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors ${hasStock ? 'bg-white dark:bg-slate-900 text-primary-red dark:text-red-400 border-red-100 dark:border-red-900/50 shadow-sm' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-slate-700'}`}>
                          <Droplet className={`w-7 h-7 ${hasStock ? 'fill-current' : ''}`} />
                        </div>
                        <div>
                          <div className={`text-4xl font-black transition-colors ${hasStock ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>{totalUnits}</div>
                          <div className={`text-xs font-bold uppercase tracking-wider transition-colors ${hasStock ? 'text-primary-red dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>Total Units</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 truncate transition-colors">{bank.user?.name || "Unknown Blood Bank"}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1.5 mb-5 transition-colors">
                      <MapPin className="w-4 h-4 text-primary-red" /> {bank.city || "Unknown City"} {bank.state ? `, ${bank.state}` : ""}
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800 transition-colors">
                      <div className="flex justify-between items-center text-sm bg-gray-50 dark:bg-slate-800/50 p-2.5 rounded-lg transition-colors group cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30">
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Phone className="w-4 h-4 group-hover:text-primary-red transition-colors" /> Call Now</span>
                        {bank.user?.phone ? (
                          <a href={`tel:${bank.user?.phone}`} className="font-bold text-primary-red dark:text-red-400 underline decoration-primary-red/40 underline-offset-2 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors">
                            {bank.user.phone}
                          </a>
                        ) : (
                          <span className="font-bold text-gray-900 dark:text-white">N/A</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-sm bg-gray-50 dark:bg-slate-800/50 p-2.5 rounded-lg transition-colors">
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                        <span className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]" title={bank.user?.email}>{bank.user?.email}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 transition-colors">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Available Inventory</div>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                        {bank.inventory.filter((i: any) => i.units > 0).length > 0 ? (
                          bank.inventory.filter((i: any) => i.units > 0).map((inv: any, idx: number) => (
                            <div key={idx} className="bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-primary-red dark:text-red-400 px-2.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors">
                              <span>{inv.bloodGroup.replace("_POS", "+").replace("_NEG", "-")}</span>
                              <span className="text-gray-400 dark:text-red-900/50">•</span>
                              <span className="text-gray-700 dark:text-red-300">{inv.donationType === "BLOOD" ? "Blood" : inv.donationType === "PLATELETS" ? "Platelets" : "Plasma"}</span>
                              <span className="bg-white dark:bg-red-900/30 text-gray-900 dark:text-white px-2 py-0.5 rounded shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] ml-0.5">{inv.units}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm font-medium text-gray-400 dark:text-gray-500">No stock available</div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
