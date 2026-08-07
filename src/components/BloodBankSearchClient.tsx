"use client";

import { useState } from "react";
import { Search, MapPin, Droplet, Building2, Phone, Mail } from "lucide-react";
import { motion, Variants } from "framer-motion";

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
    const aUnits = a.inventory.find((i: any) => i.bloodGroup === bloodGroupFilter)?.units || 0;
    const bUnits = b.inventory.find((i: any) => i.bloodGroup === bloodGroupFilter)?.units || 0;
    return bUnits - aUnits;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-transparent p-4 sm:p-6 lg:p-8 overflow-y-auto transition-colors">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Blood Bank Inventory</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Search live stock across registered blood banks.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold rounded-xl focus:ring-primary-red focus:border-primary-red block p-3 outline-none shadow-sm"
              value={bloodGroupFilter}
              onChange={(e) => setBloodGroupFilter(e.target.value)}
            >
              {bgOptions.map(bg => <option key={bg.value} value={bg.value}>{bg.label}</option>)}
            </select>
            
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-primary-red focus:border-primary-red block w-full ps-10 p-3 outline-none shadow-sm" 
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
            <motion.div variants={itemVariants} className="col-span-full text-center py-20">
              <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200">No Blood Banks Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search criteria.</p>
            </motion.div>
          ) : (
            filteredBanks.map((bank) => {
              const units = bank.inventory.find((i: any) => i.bloodGroup === bloodGroupFilter)?.units || 0;
              const hasStock = units > 0;

              return (
                <motion.div variants={itemVariants} key={bank.id} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(255,42,42,0.15)] transition-all transform hover:-translate-y-1">
                  <div className={`p-6 border-b ${hasStock ? 'bg-red-50/30 dark:bg-red-900/20 border-red-50 dark:border-red-900/30' : 'bg-gray-50/50 dark:bg-transparent border-gray-100 dark:border-gray-800'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${hasStock ? 'bg-white dark:bg-gray-900 text-primary-red border-red-100 dark:border-primary-red shadow-sm dark:shadow-[0_0_15px_rgba(255,42,42,0.3)]' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-400 border-gray-200 dark:border-gray-700'}`}>
                          <Droplet className={`w-7 h-7 ${hasStock ? 'fill-current' : ''}`} />
                        </div>
                        <div>
                          <div className={`text-4xl font-black ${hasStock ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>{units}</div>
                          <div className={`text-xs font-bold uppercase tracking-wider ${hasStock ? 'text-primary-red' : 'text-gray-400 dark:text-gray-600'}`}>Units Available</div>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm">
                        {bgOptions.find(b => b.value === bloodGroupFilter)?.label}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2 truncate">{bank.user?.name || "Unknown Blood Bank"}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1.5 mb-5">
                      <MapPin className="w-4 h-4 text-primary-red" /> {bank.city || "Unknown City"} {bank.state ? `, ${bank.state}` : ""}
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-lg">
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Phone className="w-4 h-4" /> Contact</span>
                        <span className="font-bold text-gray-900 dark:text-gray-200">{bank.user?.phone || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-lg">
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                        <span className="font-bold text-gray-900 dark:text-gray-200 truncate max-w-[150px]">{bank.user?.email}</span>
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
