import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MapPin, Clock, ShieldCheck, Activity, Droplet } from "lucide-react";

export default async function EmergencyRequestsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch all pending requests, order by newest first
  const requests = await prisma.bloodRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100/80 text-primary-red font-semibold text-xs uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5" /> Live Updates
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Emergency Board</h1>
            <p className="text-gray-500 text-lg">Real-time feed of urgent blood requirements in your area.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
             <span className="font-semibold text-gray-700">{requests.length} Active Emergencies</span>
          </div>
        </div>

        {requests.length > 0 ? (
          <div className="space-y-6">
            {requests.map(req => (
              <div key={req.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 transform hover:-translate-y-1 p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                  
                  <div className="flex gap-6 flex-1 items-start">
                    <div className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 text-primary-red flex-shrink-0 border border-red-200 shadow-inner relative overflow-hidden">
                      <Droplet className="absolute -bottom-2 -right-2 w-16 h-16 text-red-200 opacity-50" />
                      <span className="text-3xl font-black relative z-10">{req.bloodGroup.replace("_POS", "+").replace("_NEG", "-")}</span>
                    </div>
                    
                    <div className="flex flex-col justify-center pt-1">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h2 className="text-2xl font-bold text-gray-900">{req.patientName}</h2>
                        <span className="bg-red-500 text-white px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm shadow-red-200">
                          Urgent
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center text-gray-500 gap-2 sm:gap-5 text-sm mt-2">
                        <div className="flex items-center gap-2 font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          <MapPin className="w-4 h-4 text-primary-red" /> {req.hospital}, {req.city}
                        </div>
                        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 text-orange-700 font-medium">
                          <Clock className="w-4 h-4" /> Before {new Date(req.requiredBefore).toLocaleString([], { dateStyle: 'short', timeStyle: 'short'})}
                        </div>
                      </div>
                      {req.description && (
                        <p className="mt-4 text-sm text-gray-600 leading-relaxed border-l-2 border-red-200 pl-3 italic">"{req.description}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 min-w-[220px]">
                    <div className="text-center md:text-right mb-6 w-full">
                      <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Required</div>
                      <div className="text-4xl font-black text-gray-900">{req.units} <span className="text-xl font-bold text-gray-400">Units</span></div>
                    </div>
                    
                    {session.user.role === "DONOR" ? (
                      <button className="w-full bg-gradient-to-r from-primary-red to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-red-200 transform hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2">
                        <ShieldCheck className="w-5 h-5" /> I Can Donate
                      </button>
                    ) : (
                      <div className="w-full text-center text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-200 py-3 rounded-xl flex justify-center items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Donor Access Only
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center shadow-xl shadow-gray-200/40 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-60"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative z-10">
              <ShieldCheck className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 relative z-10 tracking-tight">No Active Emergencies</h2>
            <p className="text-gray-500 max-w-md mx-auto text-lg relative z-10 leading-relaxed">
              There are currently no pending emergency blood requests. Your city is safe. We will automatically notify you when someone needs help.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
