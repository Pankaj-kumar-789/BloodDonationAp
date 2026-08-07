"use client";

import { useState } from "react";
import { Search, MapPin, Star, User as UserIcon, Droplet, Clock, ShieldCheck, Phone, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { unlockContactAction } from "@/app/actions/payment";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DonorSearchClient({ initialDonors, unlockedDonorIds = [] }: { initialDonors: any[], unlockedDonorIds?: string[] }) {
  const [selectedDonorId, setSelectedDonorId] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  
  // Filter states
  const [bloodGroupFilter, setBloodGroupFilter] = useState("Blood Group");
  const [distanceFilter, setDistanceFilter] = useState("Distance");
  const [searchQuery, setSearchQuery] = useState("");
  
  const router = useRouter();

  const selectedDonor = initialDonors.find(d => d.id === selectedDonorId);
  const isSelectedUnlocked = selectedDonor ? unlockedDonorIds.includes(selectedDonor.id) : false;

  const handleUnlock = async (donorId: string) => {
    setError("");
    setIsUnlocking(prev => ({ ...prev, [donorId]: true }));
    
    const result = await unlockContactAction(donorId);
    
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh(); 
    }
    
    setIsUnlocking(prev => ({ ...prev, [donorId]: false }));
  };

  const filteredDonors = initialDonors.filter((donor) => {
    const donorBloodGroup = donor.donorProfile?.bloodGroup?.replace("_POS", "+").replace("_NEG", "-") || "A+";
    const donorCity = donor.donorProfile?.city || "Chandigarh";
    const donorName = donor.name || "";
    
    if (bloodGroupFilter !== "Blood Group" && donorBloodGroup !== bloodGroupFilter) {
      return false;
    }
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      if (!donorName.toLowerCase().includes(query) && !donorCity.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] bg-gray-50/50 dark:bg-transparent transition-colors">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filters & Results */}
        <div className="w-full md:w-[400px] lg:w-[450px] bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col h-full overflow-hidden shrink-0 transition-colors">
          {/* Filters Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10 transition-colors">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Find Donors</h1>
            <div className="space-y-3">
              <div className="flex gap-2">
                <select 
                  className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium text-sm rounded-lg focus:ring-primary-red focus:border-primary-red block w-full p-2.5 outline-none transition-colors"
                  value={bloodGroupFilter}
                  onChange={(e) => setBloodGroupFilter(e.target.value)}
                >
                  <option value="Blood Group">Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                <select 
                  className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium text-sm rounded-lg focus:ring-primary-red focus:border-primary-red block w-full p-2.5 outline-none transition-colors"
                  value={distanceFilter}
                  onChange={(e) => setDistanceFilter(e.target.value)}
                >
                  <option value="Distance">Distance</option>
                  <option value="5">Within 5 KM</option>
                  <option value="10">Within 10 KM</option>
                  <option value="20">Within 20 KM</option>
                  <option value="50">Within 50 KM</option>
                </select>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary-red focus:border-primary-red block w-full ps-10 p-2.5 outline-none transition-colors" 
                  placeholder="Enter city or donor name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredDonors.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10 font-medium">
                No donors found matching your criteria.
              </div>
            ) : (
              <motion.div 
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {filteredDonors.map((donor) => {
                  const bloodGroup = donor.donorProfile?.bloodGroup?.replace("_POS", "+").replace("_NEG", "-") || "A+";
                  const city = donor.donorProfile?.city || "Chandigarh";
                  const isAvailable = donor.donorProfile?.isAvailable ?? true;
                  const rating = donor.donorProfile?.rating || 4.9;
                  const isSelected = selectedDonorId === donor.id;
                  const isUnlocked = unlockedDonorIds.includes(donor.id);
                  const loading = isUnlocking[donor.id];

                  return (
                    <motion.div 
                      variants={itemVariants}
                      key={donor.id} 
                      onClick={() => setSelectedDonorId(donor.id)}
                      className={`border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer 
                        ${isSelected ? 'border-primary-red ring-1 ring-primary-red bg-red-50/50 dark:bg-red-900/10' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'} 
                        ${!isAvailable ? 'opacity-75 grayscale-[20%]' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {/* User Avatar */}
                          <div className="relative">
                            {donor.image ? (
                              <img src={donor.image} alt={donor.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-gray-700" />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-700">
                                <UserIcon className="w-6 h-6" />
                              </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 bg-red-50 dark:bg-gray-900 text-primary-red border border-white dark:border-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                              {bloodGroup}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{donor.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1 mt-0.5 font-medium">
                              <MapPin className="w-3.5 h-3.5" /> {city} • 2.4 KM
                            </div>
                          </div>
                        </div>
                        <div className={`flex px-2 py-1 rounded-md text-xs font-bold items-center gap-1.5 ${isAvailable ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></span> 
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 mt-4 font-medium">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-bold text-gray-700 dark:text-gray-300">{rating}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                        <div>Last Donated: New Donor</div>
                      </div>

                      <div className="md:hidden">
                        {isAvailable ? (
                          isUnlocked ? (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-3 rounded-xl">
                              <div className="flex items-center gap-2 font-bold text-sm mb-1"><Phone className="w-4 h-4" /> {donor.phone || "No phone added"}</div>
                              <div className="flex items-center gap-2 text-xs font-medium"><Mail className="w-4 h-4" /> {donor.email}</div>
                            </div>
                          ) : (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUnlock(donor.id); }}
                              disabled={loading}
                              className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-gray-900 text-sm font-bold py-2.5 rounded-xl transition-colors"
                            >
                              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unlock Contact • ₹20"}
                            </button>
                          )
                        ) : (
                          <button disabled className="w-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-sm font-bold py-2.5 rounded-xl cursor-not-allowed">
                            Currently Unavailable
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Dashboard Profile View (Replaces Map) */}
        <div className="hidden md:flex flex-1 bg-gray-50 dark:bg-[#0f1115] relative flex-col overflow-y-auto transition-colors">
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg font-bold shadow-sm z-50 animate-in slide-in-from-top-4 border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          
          {selectedDonor ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={selectedDonor.id}
              className="p-8 max-w-2xl w-full mx-auto pb-20"
            >
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-red-500 to-primary-red relative">
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 border border-white/30 shadow-sm">
                    <Droplet className="w-4 h-4 fill-current" />
                    {selectedDonor.donorProfile?.bloodGroup?.replace("_POS", "+").replace("_NEG", "-") || "A+"}
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <div className="flex justify-between items-start relative z-10 mb-4">
                    <div className="-mt-12">
                      {selectedDonor.image ? (
                        <img src={selectedDonor.image} alt={selectedDonor.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-gray-900 shadow-md bg-white dark:bg-gray-800" />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-900 shadow-md flex items-center justify-center text-gray-300 dark:text-gray-600 shrink-0">
                          <UserIcon className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 shrink-0">
                      {selectedDonor.donorProfile?.isAvailable ?? true ? (
                         isSelectedUnlocked ? (
                           <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-800 flex items-center gap-2 font-bold shadow-sm">
                             <CheckCircle2 className="w-5 h-5" />
                             Contact Unlocked
                           </div>
                         ) : (
                           <button 
                             onClick={() => handleUnlock(selectedDonor.id)}
                             disabled={isUnlocking[selectedDonor.id]}
                             className="bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold py-2.5 px-5 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg"
                           >
                             {isUnlocking[selectedDonor.id] ? (
                               <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                             ) : (
                               <><ShieldCheck className="w-5 h-5" /> Unlock Contact • ₹20</>
                             )}
                           </button>
                         )
                      ) : (
                        <button disabled className="bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-bold py-2.5 px-5 rounded-xl cursor-not-allowed">
                          Unavailable
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{selectedDonor.name}</h2>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 gap-2 mt-1 font-medium">
                      <MapPin className="w-4 h-4 text-primary-red" /> 
                      {selectedDonor.donorProfile?.city || "Chandigarh"}, {selectedDonor.donorProfile?.state || "India"}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isSelectedUnlocked && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden"
                      >
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" /> Secure Contact Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-red-50 dark:bg-gray-900 text-primary-red rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,42,42,0.1)]">
                              <Phone className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5">Phone Number</div>
                              <div className="font-black text-gray-900 dark:text-white truncate">{selectedDonor.phone || "Not provided"}</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-red-50 dark:bg-gray-900 text-primary-red rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,42,42,0.1)]">
                              <Mail className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5">Email Address</div>
                              <div className="font-black text-gray-900 dark:text-white truncate" title={selectedDonor.email}>{selectedDonor.email}</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 text-center hover:bg-white dark:hover:bg-gray-800 transition-colors">
                      <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Rating</div>
                      <div className="font-black text-gray-900 dark:text-white text-lg flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        {selectedDonor.donorProfile?.rating || "4.9"}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 text-center hover:bg-white dark:hover:bg-gray-800 transition-colors">
                      <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Donations</div>
                      <div className="font-black text-gray-900 dark:text-white text-lg">0 Times</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 text-center hover:bg-white dark:hover:bg-gray-800 transition-colors">
                      <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Last Active</div>
                      <div className="font-black text-gray-900 dark:text-white text-lg flex items-center justify-center gap-1">
                        <Clock className="w-5 h-5 text-primary-red" />
                        Today
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3">About the Donor</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                      {selectedDonor.name} is a registered blood donor on RaktaSetu, committed to saving lives. 
                      They are currently marked as available for donations in the <strong className="text-gray-900 dark:text-white">{selectedDonor.donorProfile?.city || "Chandigarh"}</strong> area. 
                      Contact them securely through our platform for emergency requirements.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[url('https://res.cloudinary.com/demo/image/upload/v1642683935/pattern-bg.png')] dark:opacity-10 opacity-80 mix-blend-multiply dark:mix-blend-screen transition-opacity">
              <div className="w-24 h-24 bg-red-50 dark:bg-gray-900 text-primary-red rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,42,42,0.15)]">
                <Search className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Select a Donor</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-3 font-medium text-lg leading-relaxed">Click on any donor card from the list to view their full profile, donation history, and contact details.</p>
              
              <div className="grid grid-cols-2 gap-6 mt-12 w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="text-4xl font-black text-gray-900 dark:text-white mb-2">{initialDonors.length}</div>
                  <div className="text-sm font-bold uppercase tracking-wider text-primary-red">Available Donors</div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="text-4xl font-black text-gray-900 dark:text-white mb-2">100%</div>
                  <div className="text-sm font-bold uppercase tracking-wider text-green-500">Verified Profiles</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
