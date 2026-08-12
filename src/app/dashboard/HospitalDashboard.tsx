import { Activity, CalendarCheck, Droplet, Building2, Plus, ArrowDownToLine, Droplets } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageTransition from "@/components/PageTransition";

export default async function HospitalDashboard({ session }: { session: any }) {
  // Fetch active requests made by this hospital user
  const activeRequests = await prisma.bloodRequest.findMany({
    where: { 
      creatorId: session.user.id,
      status: "PENDING"
    },
    orderBy: { createdAt: "desc" },
    take: 4
  });

  // Fetch fulfilled requests count
  const fulfilledCount = await prisma.bloodRequest.count({
    where: { 
      creatorId: session.user.id,
      status: { in: ["COMPLETED", "ACCEPTED"] }
    }
  });

  // Fetch recent donors (people who accepted requests from this hospital)
  const recentDonors = await prisma.bloodRequest.findMany({
    where: {
      creatorId: session.user.id,
      acceptedById: { not: null }
    },
    include: {
      acceptedBy: {
        include: {
          donorProfile: true
        }
      }
    },
    orderBy: { updatedAt: "desc" },
    take: 3
  });

  // Helper to format numbers
  const pad = (num: number) => num.toString().padStart(2, '0');

  // Fetch actual inventory data for the hospital
  const profile = await prisma.hospitalProfile.findUnique({
    where: { userId: session.user.id },
    include: { inventory: true }
  });

  const bloodGroupsList = ["A_POS", "A_NEG", "B_POS", "B_NEG", "O_POS", "O_NEG", "AB_POS", "AB_NEG"];
  const colorMap: Record<string, string> = {
    "A_POS": "#ef4444", "A_NEG": "#dc2626",
    "B_POS": "#fbbf24", "B_NEG": "#f59e0b",
    "O_POS": "#3b82f6", "O_NEG": "#2563eb",
    "AB_POS": "#8b5cf6", "AB_NEG": "#6d28d9"
  };

  let totalUnits = 0;
  const inventoryData = bloodGroupsList.map(bg => {
    // We filter by BLOOD donationType for the donut chart to keep it simple, or sum them all up. Let's sum for the specific blood group.
    const items = profile?.inventory.filter(i => i.bloodGroup === bg) || [];
    const units = items.reduce((sum, item) => sum + item.units, 0);
    totalUnits += units;
    return {
      group: bg.replace("_POS", "+").replace("_NEG", "-"),
      units: units,
      color: colorMap[bg]
    };
  });

  // SVG Donut Chart logic
  let cumulativePercent = 0;
  const donutSegments = inventoryData.map(item => {
    const percent = item.units / totalUnits;
    const startAngle = cumulativePercent * 360;
    cumulativePercent += percent;
    const endAngle = cumulativePercent * 360;
    
    // SVG arc coordinates
    const start = {
      x: Math.cos((startAngle - 90) * Math.PI / 180) * 40,
      y: Math.sin((startAngle - 90) * Math.PI / 180) * 40
    };
    const end = {
      x: Math.cos((endAngle - 90) * Math.PI / 180) * 40,
      y: Math.sin((endAngle - 90) * Math.PI / 180) * 40
    };
    const largeArcFlag = percent > 0.5 ? 1 : 0;
    
    return {
      ...item,
      path: `M ${start.x} ${start.y} A 40 40 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
    };
  });

  return (
    <PageTransition className="max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2">
            Welcome, {session.user.name} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-gray-500 font-medium">Manage blood requests and inventory seamlessly.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100/50">
            <Activity className="w-6 h-6 text-primary-red" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Active Requests</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{pad(activeRequests.length)}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50">
            <CalendarCheck className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Fulfilled Requests</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{pad(fulfilledCount)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100/50">
            <Droplets className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Blood Units in Stock</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{totalUnits}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100/50">
            <Building2 className="w-6 h-6 text-primary-red" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Departments</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">12</h3>
          </div>
        </div>
      </div>

      {/* Main Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Active Requests */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-gray-900">Active Requests</h2>
            <Link href="/dashboard/requests" className="text-[13px] font-bold text-primary-red hover:underline">
              View All
            </Link>
          </div>
          
          <div className="flex-1">
            {activeRequests.length > 0 ? (
              <div className="space-y-4">
                {activeRequests.map((req) => {
                  const bgDisplay = req.bloodGroup.replace("_POS", "+").replace("_NEG", "-");
                  // Simple time ago calculation
                  const minsAgo = Math.floor((new Date().getTime() - new Date(req.createdAt).getTime()) / 60000);
                  const timeStr = minsAgo < 60 ? `${minsAgo} min ago` : `${Math.floor(minsAgo/60)} hr ago`;
                  
                  return (
                    <div key={req.id} className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-primary-red font-black text-[15px] flex items-center justify-center shrink-0 border border-red-100">
                          {bgDisplay}
                        </div>
                        <p className="font-bold text-[14px] text-gray-900">{req.units} Units</p>
                      </div>
                      
                      <div className="flex-1 text-center hidden sm:block">
                        <p className="text-[13px] font-medium text-gray-500 truncate max-w-[200px] mx-auto">
                          {req.patientName} - {req.isEmergency ? 'Emergency' : 'Standard'}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                         <p className="text-[12px] font-medium text-gray-400">{timeStr}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-8">
                <p className="text-gray-400 font-medium mb-4">No active requests.</p>
                <Link href="/emergency" className="text-sm font-bold text-primary-red">Raise a request</Link>
              </div>
            )}
          </div>
        </div>

        {/* Blood Inventory (Donut Chart) */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full">
          <h2 className="text-lg font-black text-gray-900 mb-6">Blood Inventory</h2>
          
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 lg:gap-12 py-4">
            {/* Chart */}
            <div className="relative w-48 h-48">
              <svg viewBox="-50 -50 100 100" className="w-full h-full transform -rotate-90">
                {donutSegments.map((segment, idx) => (
                  <path
                    key={segment.group}
                    d={segment.path}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="16"
                    className="transition-all duration-300 hover:stroke-[18px] cursor-pointer"
                  />
                ))}
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
                <span className="text-2xl font-black text-gray-900 leading-none my-1">{totalUnits}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Units</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {inventoryData.map(item => (
                <div key={item.group} className="flex items-center justify-between gap-4 w-24">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-[13px] font-bold text-gray-700">{item.group}</span>
                  </div>
                  <span className="text-[13px] font-bold text-gray-900">{item.units}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Donors */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-full">
           <h2 className="text-lg font-black text-gray-900 mb-6">Recent Donors</h2>
           <div className="space-y-4">
             {recentDonors.length > 0 ? (
               recentDonors.map((req) => {
                 if (!req.acceptedBy) return null;
                 const bg = req.acceptedBy.donorProfile?.bloodGroup?.replace("_POS", "+").replace("_NEG", "-") || "-";
                 return (
                   <div key={req.id} className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        {req.acceptedBy.image ? (
                          <img src={req.acceptedBy.image} alt={req.acceptedBy.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-black flex items-center justify-center shrink-0">
                            {req.acceptedBy.name?.charAt(0) || "D"}
                          </div>
                        )}
                        <p className="font-bold text-[14px] text-gray-900">{req.acceptedBy.name}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gray-50 font-bold text-gray-700 flex items-center justify-center text-sm shrink-0">
                         {bg}
                      </div>
                      <p className="text-[12px] font-medium text-gray-400 text-right min-w-[80px]">
                        {new Date(req.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                   </div>
                 )
               })
             ) : (
               <div className="flex flex-col items-center justify-center py-6">
                 <p className="text-gray-400 font-medium text-sm">No recent donors.</p>
               </div>
             )}
           </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-full">
           <h2 className="text-lg font-black text-gray-900 mb-6">Quick Actions</h2>
           
           <div className="flex flex-col gap-4">
             <Link href="/emergency" className="bg-[#C62121] hover:bg-red-800 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-sm w-full group">
               <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                 <Droplet className="w-4 h-4 fill-white" />
               </div>
               Raise New Request
             </Link>
             
             <Link href="/dashboard/blood-banks" className="bg-[#C62121] hover:bg-red-800 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-sm w-full group">
               <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                 <ArrowDownToLine className="w-4 h-4" />
               </div>
               Request from Blood Bank
             </Link>
           </div>
        </div>

      </div>
    </PageTransition>
  );
}
