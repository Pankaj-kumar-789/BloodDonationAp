import { Droplet, Search, Settings, ShieldCheck, Activity, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function BloodBankDashboard({ session }: { session: any }) {
  // Fetch blood bank profile and inventory
  const profile = await prisma.bloodBankProfile.findUnique({
    where: { userId: session.user.id },
    include: { inventory: true }
  });

  const bloodGroups = ["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"];
  const donationTypes = ["BLOOD", "PLATELETS", "PLASMA"];

  const currentInventory = [];
  
  for (const type of donationTypes) {
    for (const bg of bloodGroups) {
      const item = profile?.inventory.find(i => i.bloodGroup === bg && i.donationType === type);
      if (item?.units && item.units > 0) {
        currentInventory.push({
          group: `${bg}-${type}`,
          label: bg.replace("_POS", "+").replace("_NEG", "-"),
          units: item.units,
          type: type
        });
      }
    }
  }

  const totalUnits = currentInventory.reduce((acc, curr) => acc + curr.units, 0);

  return (
    <div className="space-y-8 pb-10">
      {(!profile || !profile.isVerified) && (
        <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl shadow-sm mb-6 flex items-start gap-4 transition-colors">
          <div className="bg-yellow-100 p-2 rounded-full mt-0.5 flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-yellow-800 mb-1">Account Pending Verification</h3>
            <p className="text-sm text-yellow-700 font-medium leading-relaxed">Your blood bank account is currently under review by our admin team. Some features may be restricted until you are verified. Please complete your profile in Settings.</p>
          </div>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-br from-[#C62121] to-red-800 p-8 md:p-10 rounded-[2rem] shadow-[0_15px_40px_rgb(198,33,33,0.2)] gap-6 text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">{session.user.name}</h1>
          <p className="text-red-100 font-medium opacity-90 text-sm md:text-base">Manage your blood inventory and coordinate with hospitals.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-md text-white px-6 py-4 rounded-2xl border border-white/20 flex items-center gap-3 shadow-inner w-full sm:w-auto justify-center">
            <Droplet className="w-6 h-6 fill-current text-red-200" />
            <div className="flex flex-col">
              <span className="text-xs text-red-200 uppercase tracking-widest font-bold">Inventory</span>
              <span className="font-black text-lg leading-none">{totalUnits} Units</span>
            </div>
          </div>
          <Link href="/dashboard/inventory" className="bg-white hover:bg-gray-50 text-[#C62121] px-6 py-4 rounded-2xl text-sm font-extrabold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto text-center">
            Update Inventory
          </Link>
        </div>
      </div>

      {/* Inventory Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 px-2">Current Stock</h2>
        {currentInventory.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {currentInventory.map(item => (
              <div key={item.group} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(198,33,33,0.1)] flex flex-col items-center justify-center hover:border-red-100 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 rounded-full bg-red-50 text-[#C62121] flex items-center justify-center font-black text-2xl mb-4 relative z-10 border-4 border-white shadow-sm">
                  {item.label}
                </div>
                <div className="text-center relative z-10">
                  <div className="text-4xl font-black text-gray-900 tracking-tight">{item.units}</div>
                  <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">Units {item.type === "BLOOD" ? "Blood" : item.type === "PLATELETS" ? "Platelets" : "Plasma"}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-100 border-dashed rounded-3xl p-12 text-center">
            <Droplet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Your inventory is empty</h3>
            <p className="text-gray-500 font-medium mb-6">You haven't added any blood units to your stock yet.</p>
            <Link href="/dashboard/inventory" className="text-[#C62121] font-bold hover:underline">
              Add Stock Now &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Search className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">Network</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Find Hospitals</h3>
          <p className="text-sm text-gray-500 mb-8 font-medium leading-relaxed max-w-sm">Connect with local hospitals to fulfill bulk blood requirements and manage supplies.</p>
          <Link href="/search" className="text-blue-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all mt-auto inline-flex">
            Search Directory 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Activity className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">Urgent</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency Board</h3>
          <p className="text-sm text-gray-500 mb-8 font-medium leading-relaxed max-w-sm">View real-time urgent blood requests broadcasted in your city and dispatch instantly.</p>
          <Link href="/requests" className="text-orange-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all mt-auto inline-flex">
            View Emergency Board 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
