"use client";

import { useState } from "react";
import { Search, MapPin, Star, User as UserIcon, Droplet, Clock, ShieldCheck, Phone, Mail, Loader2, CheckCircle2, SearchX } from "lucide-react";
import EmptyState from "./EmptyState";
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
  const [donationTypeFilter, setDonationTypeFilter] = useState("Donation Type");
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
    const donorDonationTypes = donor.donorProfile?.donationTypes || ["BLOOD"];
    
    if (bloodGroupFilter !== "Blood Group" && donorBloodGroup !== bloodGroupFilter) {
      return false;
    }

    if (donationTypeFilter !== "Donation Type" && !donorDonationTypes.includes(donationTypeFilter)) {
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
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] bg-gray-50/50  transition-colors">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filters & Results */}
        <div className="w-full md:w-[400px] lg:w-[450px] bg-white  border-r border-gray-100  flex flex-col h-full overflow-hidden shrink-0 transition-colors">
          {/* Filters Header */}
          <div className="p-4 border-b border-gray-100  sticky top-0 bg-white  z-10 transition-colors">
            <h1 className="text-xl font-bold text-gray-900  mb-4">Find Donors</h1>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <select 
                  className="bg-gray-50  border border-gray-200  text-gray-900  font-medium text-sm rounded-lg focus:ring-primary-red focus:border-primary-red block w-full p-2.5 outline-none transition-colors"
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
                  className="bg-gray-50  border border-gray-200  text-gray-900  font-medium text-sm rounded-lg focus:ring-primary-red focus:border-primary-red block w-full p-2.5 outline-none transition-colors"
                  value={donationTypeFilter}
                  onChange={(e) => setDonationTypeFilter(e.target.value)}
                >
                  <option value="Donation Type">Donation Type</option>
                  <option value="BLOOD">Whole Blood</option>
                  <option value="PLATELETS">Platelets</option>
                  <option value="PLASMA">Plasma</option>
                </select>
                <select 
                  className="col-span-2 bg-gray-50  border border-gray-200  text-gray-900  font-medium text-sm rounded-lg focus:ring-primary-red focus:border-primary-red block w-full p-2.5 outline-none transition-colors"
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
                  <MapPin className="w-4 h-4 text-gray-500 " />
                </div>
                <input 
                  type="text" 
                  className="bg-gray-50  border border-gray-200  text-gray-900  text-sm rounded-lg focus:ring-primary-red focus:border-primary-red block w-full ps-10 p-2.5 outline-none transition-colors" 
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
              <EmptyState 
                icon={SearchX} 
                title="No Donors Found" 
                description="We couldn't find any donors matching your criteria. Try adjusting your filters or search radius."
                action={{
                  label: "Clear Filters",
                  onClick: () => {
                    setSearchQuery("");
                    setBloodGroupFilter("Blood Group");
                    setDonationTypeFilter("Donation Type");
                    setDistanceFilter("Distance");
                  }
                }}
              />
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
                      className={`border rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer 
                        ${isSelected ? 'border-primary-red ring-1 ring-primary-red bg-red-50/50 ' : 'bg-white  border-gray-100 '} 
                        ${!isAvailable ? 'opacity-75 grayscale-[20%]' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {/* User Avatar */}
                          <div className="relative">
                            {donor.image ? (
                              <img src={donor.image} alt={donor.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200 " />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100  rounded-xl flex items-center justify-center text-gray-400 border border-gray-200 ">
                                <UserIcon className="w-6 h-6" />
                              </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 bg-red-50  text-primary-red border border-white  text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                              {bloodGroup}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-bold text-gray-900  line-clamp-1">{donor.name}</h3>
                            <div className="flex items-center text-sm text-gray-500  gap-1 mt-0.5 font-medium">
                              <MapPin className="w-3.5 h-3.5" /> {city} • 2.4 KM
                            </div>
                          </div>
                        </div>
                        <div className={`flex px-2 py-1 rounded-md text-xs font-bold items-center gap-1.5 ${isAvailable ? 'bg-green-50  text-green-700 ' : 'bg-gray-100  text-gray-600 '}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></span> 
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600  mb-4 mt-4 font-medium">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-bold text-gray-700 ">{rating}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300 "></div>
                        <div>Last Donated: New Donor</div>
                      </div>

                      <div className="md:hidden">
                        {isAvailable ? (
                          isUnlocked ? (
                            <div className="bg-green-50  border border-green-200  text-green-700  p-3 rounded-xl">
                              <div className="flex items-center gap-2 font-bold text-sm mb-1"><Phone className="w-4 h-4" /> {donor.phone || "No phone added"}</div>
                              <div className="flex items-center gap-2 text-xs font-medium"><Mail className="w-4 h-4" /> {donor.email}</div>
                            </div>
                          ) : (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUnlock(donor.id); }}
                              disabled={loading}
                              className="w-full flex items-center justify-center gap-2 bg-gray-900  hover:bg-black  text-white  text-sm font-bold py-2.5 rounded-xl transition-colors"
                            >
                              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unlock Contact • ₹20"}
                            </button>
                          )
                        ) : (
                          <button disabled className="w-full bg-gray-100  text-gray-400  text-sm font-bold py-2.5 rounded-xl cursor-not-allowed">
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
        <div className="hidden md:flex flex-1 bg-gray-50  relative flex-col overflow-y-auto transition-colors">
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-50  text-red-600  px-4 py-2 rounded-lg font-bold shadow-sm z-50 animate-in slide-in-from-top-4 border border-red-200 ">
              {error}
            </div>
          )}
          
          {selectedDonor ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={selectedDonor.id}
              className="p-6 md:p-8 max-w-5xl w-full mx-auto pb-20"
            >
              <div className="bg-white  rounded-[2.5rem] shadow-xl border border-gray-100  overflow-hidden transition-colors">
                {/* Banner */}
                <div className="h-48 bg-gradient-to-br from-red-500 via-primary-red to-rose-700 relative overflow-hidden">
                  <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
                  
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-white/30 shadow-lg">
                    <Droplet className="w-5 h-5 fill-current" />
                    <span className="text-lg">{selectedDonor.donorProfile?.bloodGroup?.replace("_POS", "+").replace("_NEG", "-") || "A+"}</span>
                  </div>
                </div>

                <div className="px-6 md:px-10 pb-10">
                  <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end relative z-10 mb-8 -mt-16 sm:-mt-20 gap-6 w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-6 flex-1 min-w-0 w-full">
                      <div className="relative shrink-0">
                        {selectedDonor.image ? (
                          <img src={selectedDonor.image} alt={selectedDonor.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-8 border-white  shadow-xl bg-white " />
                        ) : (
                          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gray-50  border-8 border-white  shadow-xl flex items-center justify-center text-gray-300  shrink-0">
                            <UserIcon className="w-16 h-16" />
                          </div>
                        )}
                        <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white  ${selectedDonor.donorProfile?.isAvailable ?? true ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      </div>
                      <div className="mb-1 sm:mb-2 xl:mb-4 flex-1 min-w-0">
                        <h2 className="text-2xl sm:text-3xl xl:text-4xl font-black text-gray-900 tracking-tight leading-tight">{selectedDonor.name}</h2>
                        <div className="flex items-center text-gray-500 gap-2 mt-1 sm:mt-2 font-medium text-base sm:text-lg">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-red shrink-0" /> 
                          <span className="truncate">{selectedDonor.donorProfile?.city || "Chandigarh"}, {selectedDonor.donorProfile?.state || "India"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full xl:w-auto shrink-0 mt-2 xl:mt-0">
                      {selectedDonor.donorProfile?.isAvailable ?? true ? (
                         isSelectedUnlocked ? (
                           <div className="bg-green-50  text-green-700  px-6 py-3.5 rounded-2xl border border-green-200  flex items-center justify-center md:justify-start gap-2 font-bold shadow-sm text-lg w-full">
                             <CheckCircle2 className="w-6 h-6" />
                             Contact Unlocked
                           </div>
                         ) : (
                           <button 
                             onClick={() => handleUnlock(selectedDonor.id)}
                             disabled={isUnlocking[selectedDonor.id]}
                             className="w-full bg-gray-900  hover:bg-black  text-white  font-bold py-3.5 px-8 rounded-2xl transition-all shadow-xl flex items-center justify-center md:justify-start gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-2xl hover:-translate-y-0.5 text-lg"
                           >
                             {isUnlocking[selectedDonor.id] ? (
                               <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
                             ) : (
                               <><ShieldCheck className="w-6 h-6" /> Unlock Contact • ₹20</>
                             )}
                           </button>
                         )
                      ) : (
                        <button disabled className="w-full bg-gray-100  text-gray-400  font-bold py-3.5 px-8 rounded-2xl cursor-not-allowed text-lg border border-gray-200 ">
                          Currently Unavailable
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Contact Details (if unlocked) */}
                      <AnimatePresence>
                        {isSelectedUnlocked && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-6 bg-gradient-to-br from-gray-50 to-white   border border-gray-200  rounded-3xl overflow-hidden shadow-sm"
                          >
                            <h3 className="font-bold text-gray-900  mb-5 flex items-center gap-2 text-lg"><ShieldCheck className="w-6 h-6 text-green-500" /> Secure Contact Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-white  p-5 rounded-2xl border border-gray-100  shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 bg-red-50  text-primary-red rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                  <Phone className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs text-gray-500  font-bold uppercase tracking-wider mb-1">Phone Number</div>
                                  <div className="font-black text-gray-900  text-lg truncate">{selectedDonor.phone || "Not provided"}</div>
                                </div>
                              </div>
                              <div className="bg-white  p-5 rounded-2xl border border-gray-100  shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 bg-red-50  text-primary-red rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                  <Mail className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs text-gray-500  font-bold uppercase tracking-wider mb-1">Email Address</div>
                                  <div className="font-black text-gray-900  text-lg truncate" title={selectedDonor.email}>{selectedDonor.email}</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div>
                        <h3 className="font-bold text-gray-900  text-xl mb-4">About the Donor</h3>
                        <p className="text-gray-600  leading-relaxed font-medium text-lg">
                          {selectedDonor.name} is a verified blood donor on RaktaSetu, committed to saving lives. 
                          They are currently marked as available for donations in the <strong className="text-gray-900 ">{selectedDonor.donorProfile?.city || "Chandigarh"}</strong> area. 
                          Contact them securely through our platform to discuss your emergency requirements.
                        </p>
                      </div>

                      {/* Donation Preferences */}
                      <div>
                        <h3 className="font-bold text-gray-900  text-xl mb-4">Willing to Donate</h3>
                        <div className="flex flex-wrap gap-3">
                          {["BLOOD", "PLATELETS", "PLASMA"].map((type) => {
                            const isWilling = selectedDonor.donorProfile?.donationTypes?.includes(type) || (type === "BLOOD" && !selectedDonor.donorProfile?.donationTypes);
                            return (
                              <div key={type} className={`px-5 py-2.5 rounded-xl text-sm font-bold border flex items-center gap-2 ${isWilling ? 'bg-red-50  border-red-200  text-primary-red' : 'bg-gray-50  border-gray-200  text-gray-400 '}`}>
                                <CheckCircle2 className={`w-4 h-4 ${isWilling ? 'opacity-100' : 'opacity-0 hidden'}`} />
                                {type === "BLOOD" ? "Whole Blood" : type === "PLATELETS" ? "Platelets" : "Plasma"}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Stats */}
                    <div className="space-y-4">
                      <div className="bg-gray-50  rounded-3xl p-6 border border-gray-100  hover:bg-white  transition-colors shadow-sm">
                        <div className="text-gray-500  text-sm font-bold uppercase tracking-wider mb-2">Donor Rating</div>
                        <div className="font-black text-gray-900  text-4xl flex items-center gap-2">
                          {selectedDonor.donorProfile?.rating || "4.9"}
                          <Star className="w-8 h-8 text-yellow-500 fill-current" />
                        </div>
                        <div className="text-sm text-gray-500  mt-2 font-medium">Based on previous donations</div>
                      </div>
                      <div className="bg-gray-50  rounded-3xl p-6 border border-gray-100  hover:bg-white  transition-colors shadow-sm">
                        <div className="text-gray-500  text-sm font-bold uppercase tracking-wider mb-2">Total Donations</div>
                        <div className="font-black text-gray-900  text-4xl">
                          0
                        </div>
                        <div className="text-sm text-gray-500  mt-2 font-medium">Lives saved through RaktaSetu</div>
                      </div>
                      <div className="bg-gray-50  rounded-3xl p-6 border border-gray-100  hover:bg-white  transition-colors shadow-sm">
                        <div className="text-gray-500  text-sm font-bold uppercase tracking-wider mb-2">Last Active</div>
                        <div className="font-black text-gray-900  text-3xl flex items-center gap-2">
                          <Clock className="w-6 h-6 text-primary-red" /> Today
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-red-500/5 via-red-500/10 to-transparent   rounded-full blur-3xl -z-10"></div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full flex flex-col items-center z-10"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-red-50 to-red-100   text-primary-red rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl border border-white  rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Search className="w-14 h-14" />
                </div>
                <h2 className="text-4xl font-black text-gray-900  tracking-tight mb-4">Discover Heroes</h2>
                <p className="text-gray-500  font-medium text-lg leading-relaxed mb-10">
                  Select a donor from the list to view their complete profile, check their availability, and unlock their contact details for emergency needs.
                </p>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-white/80  backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100  hover:scale-105 transition-transform cursor-default">
                    <div className="text-4xl font-black text-gray-900  mb-2">{initialDonors.length}</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-primary-red">Total Donors</div>
                  </div>
                  <div className="bg-white/80  backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100  hover:scale-105 transition-transform cursor-default">
                    <div className="text-4xl font-black text-gray-900  mb-2">100%</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-green-500">Verified</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
