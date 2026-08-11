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
    <div className="flex flex-col h-full bg-gray-50/50  p-4 sm:p-6 lg:p-8 overflow-y-auto transition-colors">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900  tracking-tight">Blood Bank Inventory</h1>
            <p className="text-gray-500  mt-1 font-medium">Search live stock across registered blood banks.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select 
              className="bg-white  border border-gray-200  text-gray-900  font-bold rounded-xl focus:ring-primary-red focus:border-primary-red block p-3 outline-none shadow-sm"
              value={bloodGroupFilter}
              onChange={(e) => setBloodGroupFilter(e.target.value)}
            >
              {bgOptions.map(bg => <option key={bg.value} value={bg.value}>{bg.label}</option>)}
            </select>
            <select 
              className="bg-white  border border-gray-200  text-gray-900  font-bold rounded-xl focus:ring-primary-red focus:border-primary-red block p-3 outline-none shadow-sm"
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
                className="bg-white  border border-gray-200  text-gray-900  text-sm rounded-xl focus:ring-primary-red focus:border-primary-red block w-full ps-10 p-3 outline-none shadow-sm" 
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
              <Building2 className="w-16 h-16 text-gray-300  mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 ">No Blood Banks Found</h3>
              <p className="text-gray-500  mt-2">Try adjusting your search criteria.</p>
            </motion.div>
          ) : (
            filteredBanks.map((bank) => {
              const totalUnits = bank.inventory.reduce((sum: number, item: any) => sum + (item.units || 0), 0);
              const hasStock = totalUnits > 0;

              return (
                <motion.div variants={itemVariants} key={bank.id} className="bg-white  rounded-3xl border border-gray-100  shadow-sm overflow-hidden hover:shadow-lg  transition-all transform hover:-translate-y-1">
                  <div className={`p-6 border-b ${hasStock ? 'bg-red-50/30  border-red-50 ' : 'bg-gray-50/50  border-gray-100 '}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${hasStock ? 'bg-white  text-primary-red border-red-100  shadow-sm ' : 'bg-gray-100  text-gray-400 border-gray-200 '}`}>
                          <Droplet className={`w-7 h-7 ${hasStock ? 'fill-current' : ''}`} />
                        </div>
                        <div>
                          <div className={`text-4xl font-black ${hasStock ? 'text-gray-900 ' : 'text-gray-400 '}`}>{totalUnits}</div>
                          <div className={`text-xs font-bold uppercase tracking-wider ${hasStock ? 'text-primary-red' : 'text-gray-400 '}`}>Total Units</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900  text-lg mb-2 truncate">{bank.user?.name || "Unknown Blood Bank"}</h3>
                    <div className="flex items-center text-sm text-gray-500  gap-1.5 mb-5">
                      <MapPin className="w-4 h-4 text-primary-red" /> {bank.city || "Unknown City"} {bank.state ? `, ${bank.state}` : ""}
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-gray-100 ">
                      <div className="flex justify-between items-center text-sm bg-gray-50  p-2.5 rounded-lg">
                        <span className="text-gray-500  flex items-center gap-2"><Phone className="w-4 h-4" /> Contact</span>
                        <span className="font-bold text-gray-900 ">{bank.user?.phone || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm bg-gray-50  p-2.5 rounded-lg">
                        <span className="text-gray-500  flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                        <span className="font-bold text-gray-900  truncate max-w-[150px]" title={bank.user?.email}>{bank.user?.email}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 ">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Available Inventory</div>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                        {bank.inventory.filter((i: any) => i.units > 0).length > 0 ? (
                          bank.inventory.filter((i: any) => i.units > 0).map((inv: any, idx: number) => (
                            <div key={idx} className="bg-red-50  border border-red-100  text-primary-red px-2.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm">
                              <span>{inv.bloodGroup.replace("_POS", "+").replace("_NEG", "-")}</span>
                              <span className="text-gray-400 ">•</span>
                              <span className="text-gray-700 ">{inv.donationType === "BLOOD" ? "Blood" : inv.donationType === "PLATELETS" ? "Platelets" : "Plasma"}</span>
                              <span className="bg-white  text-gray-900  px-2 py-0.5 rounded shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] ml-0.5">{inv.units}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm font-medium text-gray-400 ">No stock available</div>
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
