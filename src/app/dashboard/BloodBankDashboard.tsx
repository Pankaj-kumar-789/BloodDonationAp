import { Droplet, Search, Settings, ShieldCheck, Activity, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import BloodBankChart from "./BloodBankChart";

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

  // Mock data for the new UI to match the mockup exactly
  const mockRecentRequests = [
    { id: 1, group: "A+", units: 2, patient: "Thalassemia Patient", hospital: "PGIMER, Chandigarh", time: "10 min ago" },
    { id: 2, group: "O-", units: 1, patient: "Accident Case", hospital: "GMCH, Sector 32", time: "30 min ago" },
    { id: 3, group: "B+", units: 3, patient: "Surgery", hospital: "Fortis Hospital", time: "1 hr ago" },
  ];

  return (
    <div className="space-y-6 pb-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Row 1: Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Stat 1: Total Blood Units */}
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-red-50 text-[#C62121] flex items-center justify-center shrink-0">
            <Droplet className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Blood Units</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">1,256</h3>
          </div>
        </div>

        {/* Stat 2: Available Units */}
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Droplet className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Available Units</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">842</h3>
          </div>
        </div>

        {/* Stat 3: Expiring Soon */}
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Expiring Soon</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">56</h3>
          </div>
        </div>

        {/* Stat 4: Requests Today */}
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-red-50 text-[#C62121] flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Requests Today</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">18</h3>
          </div>
        </div>
      </div>

      {/* Row 2: Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Blood Inventory List */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-gray-900">Blood Inventory</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <Search className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {currentInventory.length > 0 ? (
              currentInventory.map((item, index) => (
                <div key={item.group} className={`flex justify-between items-center py-3 ${index !== currentInventory.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <span className="font-black text-base text-[#C62121] w-12">{item.label}</span>
                  <span className="font-bold text-sm text-gray-900">{item.units} <span className="text-gray-500 font-medium">Units</span></span>
                </div>
              ))
            ) : (
              // Mock items to match UI if empty
              <>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="font-black text-base text-[#C62121] w-12">A+</span>
                  <span className="font-bold text-sm text-gray-900">186 <span className="text-gray-500 font-medium">Units</span></span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="font-black text-base text-[#C62121] w-12">A-</span>
                  <span className="font-bold text-sm text-gray-900">92 <span className="text-gray-500 font-medium">Units</span></span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="font-black text-base text-[#C62121] w-12">B+</span>
                  <span className="font-bold text-sm text-gray-900">210 <span className="text-gray-500 font-medium">Units</span></span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="font-black text-base text-[#C62121] w-12">B-</span>
                  <span className="font-bold text-sm text-gray-900">64 <span className="text-gray-500 font-medium">Units</span></span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="font-black text-base text-[#C62121] w-12">O+</span>
                  <span className="font-bold text-sm text-gray-900">218 <span className="text-gray-500 font-medium">Units</span></span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-black text-base text-[#C62121] w-12">O-</span>
                  <span className="font-bold text-sm text-gray-900">72 <span className="text-gray-500 font-medium">Units</span></span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Recent Requests List */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-gray-900">Recent Requests</h2>
            <Link href="/dashboard/requests" className="text-xs font-bold text-[#C62121] hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {mockRecentRequests.map((req) => (
              <div key={req.id} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C62121] font-black flex items-center justify-center shrink-0 text-lg border border-red-100">
                  {req.group}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-gray-900 shrink-0">{req.units} {req.units === 1 ? 'Unit' : 'Units'}</span>
                    <span className="text-sm font-bold text-gray-900 truncate">{req.patient}</span>
                    {req.id === 1 && <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>}
                  </div>
                  <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{req.hospital}</p>
                </div>
                <div className="text-[11px] font-bold text-gray-400 shrink-0">
                  {req.time}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Bottom Analytics and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-6">
        
        {/* Left: Chart */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-black text-gray-900">Donations Today</h2>
            <button className="text-xs font-bold text-[#C62121] bg-red-50 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-red-100 transition-colors">
              View Report <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 w-full min-h-[250px]">
            <BloodBankChart />
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full">
          <h2 className="text-lg font-black text-gray-900 mb-6">Quick Actions</h2>
          <div className="flex flex-col gap-4 mt-auto">
            <button className="w-full bg-[#C62121] hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-[0_4px_14px_0_rgb(198,33,33,0.39)] hover:shadow-[0_6px_20px_rgba(198,33,33,0.23)] hover:-translate-y-0.5 transition-all">
              <Droplet className="w-5 h-5 fill-current" />
              Add Blood Unit
            </button>
            <button className="w-full bg-[#C62121] hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-[0_4px_14px_0_rgb(198,33,33,0.39)] hover:shadow-[0_6px_20px_rgba(198,33,33,0.23)] hover:-translate-y-0.5 transition-all">
              <Activity className="w-5 h-5" />
              Issue Blood
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
