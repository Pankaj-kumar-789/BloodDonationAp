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

  // Fetch recent requests from hospitals or users in the same city (or globally if no city filter)
  const recentRequests = await prisma.bloodRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { creator: true }
  });

  // Calculate requests today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const requestsToday = await prisma.bloodRequest.count({
    where: { createdAt: { gte: startOfDay } }
  });

  // Derived stats
  const totalBloodUnits = currentInventory.filter(i => i.type === "BLOOD").reduce((acc, curr) => acc + curr.units, 0);
  const totalPlateletsUnits = currentInventory.filter(i => i.type === "PLATELETS").reduce((acc, curr) => acc + curr.units, 0);
  const totalPlasmaUnits = currentInventory.filter(i => i.type === "PLASMA").reduce((acc, curr) => acc + curr.units, 0);

  // Format relative time helper
  const getRelativeTime = (date: Date) => {
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 60000); // in minutes
    if (diff < 60) return `${diff} min ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hr ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="space-y-6 pb-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Row 1: Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Stat 1: Total Overall Units */}
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-red-50 text-[#C62121] flex items-center justify-center shrink-0">
            <Droplet className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Overall</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalUnits.toLocaleString()}</h3>
          </div>
        </div>

        {/* Stat 2: Whole Blood */}
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-red-50 text-[#C62121] flex items-center justify-center shrink-0">
            <Droplet className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Whole Blood</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalBloodUnits.toLocaleString()}</h3>
          </div>
        </div>

        {/* Stat 3: Platelets */}
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Platelets</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalPlateletsUnits.toLocaleString()}</h3>
          </div>
        </div>

        {/* Stat 4: Plasma */}
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Plasma</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalPlasmaUnits.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Row 2: Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Blood Inventory List */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-gray-900">Blood Inventory</h2>
            <Link href="/dashboard/inventory" className="text-gray-400 hover:text-[#C62121] transition-colors">
              <Search className="w-4 h-4" />
            </Link>
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
              // Empty State
              <div className="text-center py-10">
                 <p className="text-gray-400 font-medium mb-4">No blood units in inventory.</p>
                 <Link href="/dashboard/inventory" className="text-sm font-bold text-[#C62121] hover:underline">
                   Update Inventory
                 </Link>
              </div>
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
            {recentRequests.length > 0 ? recentRequests.map((req) => (
              <div key={req.id} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C62121] font-black flex items-center justify-center shrink-0 text-lg border border-red-100">
                  {req.bloodGroup.replace("_POS", "+").replace("_NEG", "-")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-gray-900 shrink-0">{req.units} {req.units === 1 ? 'Unit' : 'Units'}</span>
                    <span className="text-sm font-bold text-gray-900 truncate">{req.patientName}</span>
                    {req.isEmergency && <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>}
                  </div>
                  <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{req.hospital}</p>
                </div>
                <div className="text-[11px] font-bold text-gray-400 shrink-0">
                  {getRelativeTime(req.createdAt)}
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-gray-400 font-medium">
                 No pending requests found.
              </div>
            )}
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
            <Link href="/dashboard/inventory" className="w-full bg-[#C62121] hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-[0_4px_14px_0_rgb(198,33,33,0.39)] hover:shadow-[0_6px_20px_rgba(198,33,33,0.23)] hover:-translate-y-0.5 transition-all">
              <Droplet className="w-5 h-5 fill-current" />
              Add Blood Unit
            </Link>
            <Link href="/dashboard/inventory" className="w-full bg-[#C62121] hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-[0_4px_14px_0_rgb(198,33,33,0.39)] hover:shadow-[0_6px_20px_rgba(198,33,33,0.23)] hover:-translate-y-0.5 transition-all">
              <Activity className="w-5 h-5" />
              Issue Blood
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
