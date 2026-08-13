import { SquareActivity, ArrowLeft, MapPin, Phone, ShieldCheck, Search } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageTransition from "@/components/PageTransition";

export default async function HospitalsPage() {
  const hospitals = await prisma.hospitalProfile.findMany({
    include: {
      user: {
        select: { name: true, phone: true, image: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <PageTransition className="max-w-6xl mx-auto space-y-6 mt-4 pb-10">
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-[2rem] font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3 transition-colors">
              <SquareActivity className="w-8 h-8 text-blue-500" />
              Hospitals
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-[15px] transition-colors">Find and contact registered hospitals in your area.</p>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by city..." 
              className="pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full md:w-64 transition-all"
            />
          </div>
        </div>

        {hospitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="p-6 border border-gray-100 dark:border-slate-800 rounded-3xl hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-md transition-all group bg-white dark:bg-slate-800/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-900/30 group-hover:bg-blue-500 transition-colors">
                      <SquareActivity className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2 transition-colors">
                        {hospital.user.name}
                        {hospital.isVerified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                      </h3>
                      <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mt-0.5 transition-colors">{hospital.user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3 flex items-center gap-3 transition-colors">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
                      <p className="text-[13px] font-bold text-gray-900 dark:text-white transition-colors">{hospital.city}, {hospital.state}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3 flex items-center gap-3 transition-colors">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact</p>
                      <p className="text-[13px] font-bold text-gray-900 dark:text-white transition-colors">{hospital.user.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>
                
                {hospital.user.phone && (
                  <a href={`tel:${hospital.user.phone}`} className="mt-4 w-full bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold py-3 px-4 rounded-xl text-[14px] transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> Call Hospital
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 transition-colors">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <SquareActivity className="w-10 h-10 text-gray-300 dark:text-gray-600 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">No Hospitals Found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto font-medium leading-relaxed transition-colors">
              There are currently no hospitals registered on the platform. Please check back later.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
