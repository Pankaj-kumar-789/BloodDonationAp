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
    
    try {
      // 1. Ask our backend to create a Razorpay Order
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId })
      });
      
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON Response:", text);
        throw new Error("Server returned an invalid response. Did you restart the dev server after installing Razorpay?");
      }
  
      if (!res.ok) throw new Error(data.message || "Failed to create order");
  
      // 2. Open the Razorpay Checkout Popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount, 
        currency: data.currency,
        name: "RaktaSetu",
        description: "Secure Contact Unlock Fee",
        image: "/brand-logo.png", // Adds your logo to the popup
        order_id: data.orderId,
        handler: async function (response: any) {
          setIsUnlocking(prev => ({ ...prev, [donorId]: true }));
          
          try {
            // Verify payment on our backend
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donorId: donorId
              })
            });
            
            if (!verifyRes.ok) throw new Error("Payment verification failed");
            
            // Refresh UI to show unlocked contact
            router.refresh();
          } catch (err) {
            setError("Payment successful, but failed to unlock contact. Please contact support.");
          } finally {
            setIsUnlocking(prev => ({ ...prev, [donorId]: false }));
          }
        },
        theme: { color: "#C62121" },
        modal: {
          ondismiss: function() {
            setIsUnlocking(prev => ({ ...prev, [donorId]: false }));
          }
        }
      };
  
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        setError("Payment failed. Please try again.");
      });
      rzp.open();
      
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment");
      setIsUnlocking(prev => ({ ...prev, [donorId]: false }));
    }
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
    <div className="flex flex-col flex-1 h-full bg-gray-50/50 dark:bg-slate-950 transition-colors">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filters & Results */}
        <div className="w-full md:w-[400px] lg:w-[450px] bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex flex-col h-full overflow-hidden shrink-0 transition-colors">
          {/* Filters Header */}
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10 transition-colors">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Find Donors</h1>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <select 
                  className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white font-medium text-sm rounded-lg focus:ring-primary-red focus:border-primary-red block w-full p-2.5 outline-none transition-colors"
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
                  className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white font-medium text-sm rounded-lg focus:ring-primary-red focus:border-primary-red block w-full p-2.5 outline-none transition-colors"
                  value={donationTypeFilter}
                  onChange={(e) => setDonationTypeFilter(e.target.value)}
                >
                  <option value="Donation Type">Donation Type</option>
                  <option value="BLOOD">Whole Blood</option>
                  <option value="PLATELETS">Platelets</option>
                  <option value="PLASMA">Plasma</option>
                </select>
                <select 
                  className="col-span-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white font-medium text-sm rounded-lg focus:ring-primary-red focus:border-primary-red block w-full p-2.5 outline-none transition-colors"
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
                  <MapPin className="w-4 h-4 text-gray-500" />
                </div>
                <input 
                  type="text" 
                  className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary-red focus:border-primary-red block w-full ps-10 p-2.5 outline-none transition-colors" 
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
                icon={<SearchX className="w-10 h-10" strokeWidth={1.5} />} 
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
                        ${isSelected ? 'border-primary-red ring-1 ring-primary-red bg-red-50/50 dark:bg-red-950/40' : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800'} 
                        ${!isAvailable ? 'opacity-75 grayscale-[20%]' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* User Avatar */}
                          <div className="relative shrink-0">
                            {donor.image ? (
                              <img src={donor.image} alt={donor.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-slate-700" />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200 dark:border-slate-700">
                                <UserIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap sm:flex-nowrap">
                              <h3 className="font-bold text-gray-900 dark:text-white truncate">{donor.name}</h3>
                              <span className="bg-gradient-to-r from-primary-red to-rose-600 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md shadow-sm shrink-0 flex items-center gap-1">
                                <Droplet className="w-3 h-3 fill-white" /> {bloodGroup}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1 mt-0.5 font-medium truncate">
                              <MapPin className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{city} • 2.4 KM</span>
                            </div>
                          </div>
                        </div>
                        <div className={`flex px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold items-center gap-1.5 shrink-0 ${isAvailable ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-500'}`}></span> 
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 mt-4 font-medium">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-bold text-gray-700 dark:text-gray-300">{rating}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-700"></div>
                        <div>Last Donated: New Donor</div>
                      </div>

                      <div className="md:hidden">
                        {isAvailable ? (
                          isUnlocked ? (
                            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-xl flex flex-col gap-2">
                              {donor.phone ? (
                                <a href={`tel:${donor.phone}`} className="flex items-center justify-center gap-2 font-bold text-sm bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 py-2.5 px-4 rounded-xl transition-all w-full shadow-sm shadow-green-500/20">
                                  <Phone className="w-4 h-4" /> Tap to Call: <span className="underline decoration-white/60 underline-offset-2">{donor.phone}</span>
                                </a>
                              ) : (
                                <div className="flex items-center gap-2 font-bold text-sm px-2 text-green-700/70 dark:text-green-400/70"><Phone className="w-4 h-4" /> No phone added</div>
                              )}
                              <div className="flex items-center gap-2 text-xs font-medium px-2"><Mail className="w-4 h-4" /> {donor.email}</div>
                            </div>
                          ) : (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUnlock(donor.id); }}
                              disabled={loading}
                              className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-slate-900 text-sm font-bold py-2.5 rounded-xl transition-colors"
                            >
                              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unlock Contact • ₹20"}
                            </button>
                          )
                        ) : (
                          <button disabled className="w-full bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 text-sm font-bold py-2.5 rounded-xl cursor-not-allowed">
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
        <div className="hidden md:flex flex-1 bg-gray-50 dark:bg-slate-950 relative flex-col overflow-y-auto transition-colors">
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold shadow-sm z-50 animate-in slide-in-from-top-4 border border-red-200">
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
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
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
                          <img src={selectedDonor.image} alt={selectedDonor.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-8 border-white dark:border-slate-900 shadow-xl bg-white dark:bg-slate-900" />
                        ) : (
                          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gray-50 dark:bg-slate-800 border-8 border-white dark:border-slate-900 shadow-xl flex items-center justify-center text-gray-300 dark:text-gray-600 shrink-0">
                            <UserIcon className="w-16 h-16" />
                          </div>
                        )}
                        <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 ${selectedDonor.donorProfile?.isAvailable ?? true ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      </div>
                      <div className="mb-1 sm:mb-2 xl:mb-4 flex-1 min-w-0">
                        <h2 className="text-2xl sm:text-3xl xl:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight transition-colors">{selectedDonor.name}</h2>
                        <div className="flex items-center text-gray-500 gap-2 mt-1 sm:mt-2 font-medium text-base sm:text-lg">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-red shrink-0" /> 
                          <span className="truncate">{selectedDonor.donorProfile?.city || "Chandigarh"}, {selectedDonor.donorProfile?.state || "India"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full xl:w-auto shrink-0 mt-2 xl:mt-0">
                      {selectedDonor.donorProfile?.isAvailable ?? true ? (
                         isSelectedUnlocked ? (
                           <div className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-6 py-3.5 rounded-2xl border border-green-200 dark:border-green-900/30 flex items-center justify-center md:justify-start gap-2 font-bold shadow-sm text-lg w-full transition-colors">
                             <CheckCircle2 className="w-6 h-6" />
                             Contact Unlocked
                           </div>
                         ) : (
                           <button 
                             onClick={() => handleUnlock(selectedDonor.id)}
                             disabled={isUnlocking[selectedDonor.id]}
                             className="w-full bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-slate-900 font-bold py-3.5 px-8 rounded-2xl transition-all shadow-xl flex items-center justify-center md:justify-start gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-2xl hover:-translate-y-0.5 text-lg"
                           >
                             {isUnlocking[selectedDonor.id] ? (
                               <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
                             ) : (
                               <><ShieldCheck className="w-6 h-6" /> Unlock Contact • ₹20</>
                             )}
                           </button>
                         )
                      ) : (
                        <button disabled className="w-full bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 font-bold py-3.5 px-8 rounded-2xl cursor-not-allowed text-lg border border-gray-200 dark:border-slate-700 transition-colors">
                          Currently Unavailable
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col 2xl:flex-row gap-8">
                    {/* Left Column */}
                    <div className="flex-1 min-w-0 space-y-8">
                      {/* Contact Details (if unlocked) */}
                      <AnimatePresence>
                        {isSelectedUnlocked && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm transition-colors"
                          >
                            <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2 text-lg transition-colors"><ShieldCheck className="w-6 h-6 text-green-500" /> Secure Contact Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {selectedDonor.phone ? (
                                <a href={`tel:${selectedDonor.phone}`} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-primary-red/30 transition-all group cursor-pointer">
                                  <div className="w-12 h-12 bg-red-50 dark:bg-red-950/40 text-primary-red dark:text-red-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <Phone className="w-6 h-6" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1 transition-colors">Call Donor</div>
                                    <div className="font-black text-gray-900 dark:text-white text-lg truncate transition-colors group-hover:text-primary-red">{selectedDonor.phone}</div>
                                  </div>
                                </a>
                              ) : (
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all group opacity-70">
                                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 rounded-xl flex items-center justify-center shrink-0">
                                    <Phone className="w-6 h-6" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1 transition-colors">Phone Number</div>
                                    <div className="font-black text-gray-900 dark:text-white text-lg truncate transition-colors">Not provided</div>
                                  </div>
                                </div>
                              )}
                              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group">
                                <div className="w-12 h-12 bg-red-50 dark:bg-red-950/40 text-primary-red dark:text-red-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                  <Mail className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1 transition-colors">Email Address</div>
                                  <div className="font-black text-gray-900 dark:text-white text-lg truncate transition-colors" title={selectedDonor.email}>{selectedDonor.email}</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-4 transition-colors">About the Donor</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium text-lg transition-colors">
                          {selectedDonor.name} is a verified blood donor on RaktaSetu, committed to saving lives. 
                          They are currently marked as available for donations in the <strong className="text-gray-900 dark:text-white">{selectedDonor.donorProfile?.city || "Chandigarh"}</strong> area. 
                          Contact them securely through our platform to discuss your emergency requirements.
                        </p>
                      </div>

                      {/* Donation Preferences */}
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-4 transition-colors">Willing to Donate</h3>
                        <div className="flex flex-wrap gap-3">
                          {["BLOOD", "PLATELETS", "PLASMA"].map((type) => {
                            const isWilling = selectedDonor.donorProfile?.donationTypes?.includes(type) || (type === "BLOOD" && !selectedDonor.donorProfile?.donationTypes);
                            return (
                              <div key={type} className={`px-5 py-2.5 rounded-xl text-sm font-bold border flex items-center gap-2 transition-colors ${isWilling ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-primary-red dark:text-red-400' : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-400 dark:text-gray-500'}`}>
                                <CheckCircle2 className={`w-4 h-4 ${isWilling ? 'opacity-100' : 'opacity-0 hidden'}`} />
                                {type === "BLOOD" ? "Whole Blood" : type === "PLATELETS" ? "Platelets" : "Plasma"}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Stats */}
                    <div className="w-full 2xl:w-72 shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-1 gap-4">
                      <div className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-5 border border-gray-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 transition-colors truncate">Donor Rating</div>
                          <div className="font-black text-gray-900 dark:text-white text-3xl flex items-center gap-2 transition-colors">
                            {selectedDonor.donorProfile?.rating || "4.9"}
                            <Star className="w-6 h-6 text-yellow-500 fill-current" />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium transition-colors">Based on previous donations</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-5 border border-gray-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 transition-colors truncate">Total Donations</div>
                          <div className="font-black text-gray-900 dark:text-white text-3xl transition-colors">
                            0
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium transition-colors">Lives saved through RaktaSetu</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-5 border border-gray-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1 2xl:col-span-1">
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 transition-colors truncate">Last Active</div>
                          <div className="font-black text-gray-900 dark:text-white text-2xl flex items-center gap-2 transition-colors">
                            <Clock className="w-5 h-5 text-primary-red" /> Today
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col relative overflow-y-auto p-6 md:p-12">
              {/* Decorative Backgrounds */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-red-500/10 via-red-500/5 to-transparent rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent rounded-full blur-3xl -z-10"></div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl w-full mx-auto flex flex-col z-10 mt-4 md:mt-12"
              >
                <div className="flex flex-col xl:flex-row items-center gap-6 xl:gap-8 mb-12 xl:mb-16">
                  <div className="w-20 h-20 xl:w-28 xl:h-28 bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-800 dark:to-slate-800 text-primary-red dark:text-red-400 rounded-2xl xl:rounded-[2rem] flex items-center justify-center shrink-0 shadow-xl border border-white dark:border-slate-700 rotate-3 transition-transform duration-300">
                    <Search className="w-10 h-10 xl:w-14 xl:h-14" />
                  </div>
                  <div className="text-center xl:text-left flex-1">
                    <h2 className="text-3xl xl:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-3 xl:mb-4 transition-colors">Discover Heroes</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-base xl:text-lg leading-relaxed max-w-2xl mx-auto xl:mx-0 transition-colors">
                      Select a donor from the list to view their complete profile, check their real-time availability, and securely unlock their contact details for emergency needs.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg xl:text-xl font-bold text-gray-900 dark:text-white mb-6 text-center xl:text-left transition-colors">How it works</h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 w-full mb-12">
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 xl:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 hover:-translate-y-1 transition-transform">
                    <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4 xl:mb-6 text-gray-900 dark:text-white font-black text-lg xl:text-xl">1</div>
                    <h4 className="text-base xl:text-lg font-bold text-gray-900 dark:text-white mb-2">Search & Filter</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">Use the sidebar to filter donors by blood group, donation type, or distance to find the perfect match.</p>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 xl:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 hover:-translate-y-1 transition-transform">
                    <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4 xl:mb-6 text-gray-900 dark:text-white font-black text-lg xl:text-xl">2</div>
                    <h4 className="text-base xl:text-lg font-bold text-gray-900 dark:text-white mb-2">Review Profile</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">Check their rating, past donations, and current availability status to ensure they are ready to help.</p>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 xl:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 hover:-translate-y-1 transition-transform xl:col-span-2 2xl:col-span-1">
                    <div className="w-10 h-10 xl:w-12 xl:h-12 bg-red-50 dark:bg-red-950/30 rounded-xl flex items-center justify-center mb-4 xl:mb-6 text-primary-red dark:text-red-400 font-black text-lg xl:text-xl">3</div>
                    <h4 className="text-base xl:text-lg font-bold text-gray-900 dark:text-white mb-2">Unlock Contact</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">Securely unlock their phone number and email to coordinate the life-saving donation immediately.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-6 w-full max-w-xl mx-auto xl:mx-0">
                  <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-5 xl:p-6 rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="text-3xl xl:text-4xl font-black text-gray-900 dark:text-white transition-colors">{initialDonors.length}</div>
                    <div className="text-xs xl:text-sm font-bold uppercase tracking-wider text-primary-red leading-tight">Total<br/>Donors</div>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-5 xl:p-6 rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="text-3xl xl:text-4xl font-black text-gray-900 dark:text-white transition-colors">100<span className="text-xl xl:text-2xl">%</span></div>
                    <div className="text-xs xl:text-sm font-bold uppercase tracking-wider text-green-500 leading-tight">Verified<br/>Users</div>
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
