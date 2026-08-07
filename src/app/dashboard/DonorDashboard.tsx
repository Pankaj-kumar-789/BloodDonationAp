import { Activity, Clock, ShieldCheck, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import AcceptRequestButton from "@/components/AcceptRequestButton";
import AvailabilityToggleClient from "@/components/AvailabilityToggleClient";
import PageTransition from "@/components/PageTransition";

export default async function DonorDashboard({ session }: { session: any }) {
  // Fetch donor's profile
  const profile = await prisma.donorProfile.findUnique({
    where: { userId: session.user.id }
  });

  // Fetch all pending emergency requests nationwide
  const city = profile?.city || "";
  
  // We fetch all pending requests and sort them in JS/Prisma so local ones appear first
  const allRequests = await prisma.bloodRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    take: 10 // Increased limit to show more nationwide activity
  });

  // Sort locally: Donor's city first, then by date
  const localRequests = allRequests.sort((a, b) => {
    const aIsLocal = a.city.toLowerCase() === city.toLowerCase();
    const bIsLocal = b.city.toLowerCase() === city.toLowerCase();
    if (aIsLocal && !bIsLocal) return -1;
    if (!aIsLocal && bIsLocal) return 1;
    return 0; // If both are local or both are not, keep the original date sort
  }).slice(0, 5); // Take top 5 for the dashboard

  return (
    <PageTransition className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-900 text-white p-8 md:p-10 rounded-[2rem] shadow-xl relative overflow-hidden gap-6 border border-gray-800">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-red/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Donation Control Center</h1>
          <p className="text-gray-400 text-base md:text-lg font-medium">Manage your availability and help save lives in your area.</p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-sm relative z-10 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">My Availability</span>
          <AvailabilityToggleClient initialIsAvailable={profile?.isAvailable ?? true} />
        </div>
      </div>

      {/* Main Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`text-white border-0 shadow-xl rounded-[2rem] overflow-hidden relative group transition-all duration-500 hover:-translate-y-1 ${profile?.isAvailable ? 'bg-gradient-to-br from-primary-red to-red-700 shadow-red-200/50' : 'bg-gradient-to-br from-gray-800 to-gray-900 shadow-gray-200/50'}`}>
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/demo/image/upload/v1642683935/pattern-bg.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
          
          <CardContent className="p-8 md:p-10 relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-10">
                <div className={`w-16 h-16 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner border ${profile?.isAvailable ? 'bg-white/20 border-white/30' : 'bg-white/10 border-white/10'}`}>
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="text-xs text-white/70 font-bold uppercase tracking-widest mb-1">Blood Group</div>
                  <div className="text-5xl font-black tracking-tighter drop-shadow-md flex items-center gap-3">
                    {profile?.bloodGroup?.replace("_POS", "+").replace("_NEG", "-") || "Not Set"}
                  </div>
                  {profile && profile.rating > 0 && (
                    <div className="mt-2 flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-bold text-white">{profile.rating.toFixed(1)} Rating</span>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-2xl md:text-3xl mb-3 tracking-tight">
                {profile?.isAvailable ? "Ready to Donate?" : "Currently Unavailable"}
              </h3>
              <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-sm font-medium">
                {profile?.isAvailable 
                  ? "Your profile is active. Local hospitals can contact you during critical emergencies to save lives."
                  : "You are marked as unavailable. Hospitals will not be able to contact you for emergency donations."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-500 transform hover:-translate-y-1 bg-white">
          <CardContent className="p-8 md:p-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-10">
                <div className="w-16 h-16 bg-gray-50 text-gray-700 rounded-2xl flex items-center justify-center shadow-inner border border-gray-100">
                  <Activity className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">History</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">My Donations</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Track your donation history and see the real-world impact you've made in your community.
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/history" className="flex-1 inline-flex items-center justify-center bg-gray-900 hover:bg-black text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg group">
                View History <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <Link href="/dashboard/messages" className="flex-1 inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold py-4 px-6 rounded-xl transition-all shadow-sm hover:shadow-md group">
                Messages
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Requests Section */}
      <div className="pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Emergency Requests</h2>
          <div className="flex items-center gap-2 text-sm font-bold text-primary-red bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl shadow-sm">
            <MapPin className="w-4 h-4" /> {city || "Your Area"}
          </div>
        </div>
        
        {localRequests.length > 0 ? (
          <div className="space-y-5">
            {localRequests.map(req => (
              <div key={req.id} className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col lg:flex-row justify-between gap-6">
                <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-red-400 to-primary-red opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-start gap-5 md:gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 rounded-2xl flex flex-col items-center justify-center border border-red-100 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <span className="text-primary-red font-black text-2xl md:text-3xl leading-none">{req.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-gray-900 font-black text-xl md:text-2xl tracking-tight">{req.patientName}</h3>
                      {req.isEmergency && (
                        <span className="px-2.5 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-widest bg-red-100 text-red-700 border border-red-200 shadow-sm">Emergency</span>
                      )}
                    </div>
                    <div className="text-base text-gray-700 mb-5 font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary-red" /> {req.hospital}, {req.city}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 font-medium">
                      <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Activity className="w-4 h-4 text-gray-400" /> {req.units} Units Needed
                      </span>
                      <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Calendar className="w-4 h-4 text-gray-400" /> Needed by: {new Date(req.requiredBefore).toLocaleDateString()}
                      </span>
                    </div>
                    {req.description && (
                      <div className="mt-5 text-sm text-gray-700 bg-orange-50/50 p-4 md:p-5 rounded-2xl border border-orange-100/50 leading-relaxed italic font-medium">
                        "{req.description}"
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col justify-center shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8 mt-4 lg:mt-0">
                  <AcceptRequestButton requestId={req.id} />
                  <div className="text-center mt-3 text-xs text-gray-400 font-medium tracking-wide leading-relaxed">
                    Your contact details<br/>will be securely shared
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200 p-12 md:p-20 text-center shadow-sm">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
              <ShieldCheck className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 tracking-tight">No Urgent Requests</h3>
            <p className="text-gray-500 max-w-md mx-auto font-medium leading-relaxed">
              There are currently no pending emergency requests nationwide. Rest assured, we'll notify you the moment someone needs your help locally.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
