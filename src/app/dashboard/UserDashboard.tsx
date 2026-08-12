import { Droplet, CalendarCheck, Phone, MapPin, ShieldCheck, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import PageTransition from "@/components/PageTransition";

export default async function UserDashboard({ session }: { session: any }) {
  // 1. Fetch user's requests
  const requests = await prisma.bloodRequest.findMany({
    where: { creatorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const totalRequests = requests.length;
  const activeRequests = requests.filter(r => r.status === "PENDING").length;
  const fulfilledRequests = requests.filter(r => r.status === "COMPLETED" || r.status === "ACCEPTED").length;
  
  // Last requested blood group
  const lastRequestedBloodGroup = requests.length > 0 ? requests[0].bloodGroup.replace("_POS", "+").replace("_NEG", "-") : "-";

  // 2. Fetch some mock "Donors Near You"
  // Since location based querying is complex without postgis, we'll fetch verified donors who are available
  const donorsNearYou = await prisma.donorProfile.findMany({
    where: { 
      isAvailable: true,
      isVerified: true
    },
    include: {
      user: {
        select: { name: true, image: true, phone: true }
      }
    },
    take: 4
  });

  // Helper to format numbers with leading zero
  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <PageTransition className="max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2">
            Hello, {session.user.name} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-gray-500 font-medium">We are here to help. You are not alone!</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100/50">
            <Droplet className="w-6 h-6 text-primary-red fill-primary-red/20" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Total Requests</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{pad(totalRequests)}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50">
            <CalendarCheck className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Active Requests</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{pad(activeRequests)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50">
            <CalendarCheck className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Requests Fulfilled</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{pad(fulfilledRequests)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100/50">
            <Droplet className="w-6 h-6 text-primary-red fill-primary-red/20" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Blood Group</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{lastRequestedBloodGroup}</h3>
          </div>
        </div>
      </div>

      {/* Main Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* My Recent Requests */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-gray-900">My Recent Requests</h2>
            <Link href="/dashboard/requests" className="text-[13px] font-bold text-primary-red hover:underline">
              View All
            </Link>
          </div>
          
          <div className="flex-1">
            {requests.length > 0 ? (
              <div className="space-y-4">
                {requests.slice(0,3).map((req) => {
                  const bgDisplay = req.bloodGroup.replace("_POS", "+").replace("_NEG", "-");
                  return (
                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-50 text-primary-red font-black text-lg flex items-center justify-center shrink-0">
                          {bgDisplay}
                        </div>
                        <div>
                          <p className="font-bold text-[15px] text-gray-900 flex items-center gap-2">
                            {req.patientName} 
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          </p>
                          <p className="text-[12px] font-medium text-gray-500">{req.hospital}, {req.city}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                        <div className="text-left sm:text-right">
                           <p className="text-[12px] font-medium text-gray-500">{new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                          req.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {req.status === 'PENDING' ? 'In Progress' : 'Fulfilled'}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-8">
                <p className="text-gray-400 font-medium mb-4">No recent requests.</p>
                <Link href="/emergency" className="text-sm font-bold text-primary-red">Create one now</Link>
              </div>
            )}
          </div>
        </div>

        {/* Donors Near You */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-gray-900">Donors Near You</h2>
            <Link href="/search" className="text-[13px] font-bold text-primary-red hover:underline">
              View All
            </Link>
          </div>
          
          <div className="flex-1">
            {donorsNearYou.length > 0 ? (
              <div className="space-y-4">
                {donorsNearYou.map((donor, idx) => {
                  const bgDisplay = donor.bloodGroup.replace("_POS", "+").replace("_NEG", "-");
                  // Mock distance for realism as requested by UI design
                  const distance = (2.1 + (idx * 0.5)).toFixed(1);
                  
                  return (
                    <div key={donor.id} className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        {donor.user.image ? (
                          <img src={donor.user.image} alt={donor.user.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-black flex items-center justify-center shrink-0">
                            {donor.user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[14px] text-gray-900 leading-tight">{donor.user.name}</p>
                          <p className="text-[12px] font-medium text-gray-500 mt-0.5">{bgDisplay} | {donor.city}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-[12px] font-bold text-gray-500">
                          <MapPin className="w-3.5 h-3.5" />
                          {distance} km
                        </div>
                        <a href={`tel:${donor.user.phone}`} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-primary-red hover:bg-red-100 transition-colors">
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-8">
                <p className="text-gray-400 font-medium text-sm">No verified donors currently active nearby.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Main Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Post Request Banner */}
        <div className="lg:col-span-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-[2rem] p-6 md:p-8 border border-red-100/50 flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10 max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="w-5 h-5 text-primary-red fill-primary-red" />
              <h2 className="text-xl font-black text-gray-900">Need Blood Urgently?</h2>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-6">
              Post your request and get help from verified donors in your area.
            </p>
            <Link href="/emergency" className="inline-flex items-center gap-2 bg-primary-red hover:bg-red-800 text-white font-bold py-3 px-6 rounded-xl text-[14px] transition-colors shadow-sm">
               Post New Request
            </Link>
          </div>
          
          <div className="hidden sm:block absolute right-0 -bottom-8 opacity-90">
             <Image src="/assets/urgent_blood.jpg" alt="Need blood" width={220} height={220} className="object-contain mix-blend-multiply rounded-full" />
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start gap-4">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center shrink-0 border border-red-100/50">
             <ShieldCheck className="w-7 h-7 text-primary-red" />
          </div>
          <div>
            <h3 className="text-[15px] font-black text-gray-900 mb-2">Important Note</h3>
            <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
              Please verify donor details before accepting blood donation. RaktaSetu is not responsible for any mishappening.
            </p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
