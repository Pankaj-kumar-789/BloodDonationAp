import { Award, ArrowLeft, Download, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CertificatesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const donorProfile = await prisma.donorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      donationHistory: {
        orderBy: { date: 'desc' }
      }
    }
  });

  const donations = donorProfile?.donationHistory || [];

  return (
    <PageTransition className="max-w-5xl mx-auto space-y-6 mt-4 pb-10">
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors">
        <div className="mb-8">
          <h1 className="text-3xl md:text-[2rem] font-black text-gray-900 dark:text-white mb-2 transition-colors">My Certificates</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg font-medium text-[15px] transition-colors">View and download your blood donation appreciation certificates.</p>
        </div>

        {donations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <div key={donation.id} className="relative bg-gradient-to-br from-red-50 to-white dark:from-slate-800 dark:to-slate-900/50 border border-red-100 dark:border-slate-700 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -right-6 -top-6 text-red-500/[0.03] dark:text-white/[0.02] transform rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                  <Award className="w-40 h-40" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center border border-red-50 dark:border-slate-700 shrink-0">
                      <Award className="w-7 h-7 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 dark:text-white text-lg">Life Saver</h3>
                      <p className="text-xs font-bold text-primary-red dark:text-red-400 uppercase tracking-wider">Certificate of Honor</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400 font-medium bg-white/50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-white dark:border-slate-700/50">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {donation.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400 font-medium bg-white/50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-white dark:border-slate-700/50">
                      <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                      <span className="truncate">{donation.hospital}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-primary-red/50 dark:hover:border-red-500/50 hover:shadow-sm text-gray-900 dark:text-white font-bold py-3.5 px-4 rounded-xl text-[14px] transition-all flex items-center justify-center gap-2 group/btn">
                    <Download className="w-4 h-4 text-gray-400 group-hover/btn:text-primary-red transition-colors" /> Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 transition-colors">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100 dark:border-slate-700 relative transition-colors">
              <Award className="w-10 h-10 text-orange-400 drop-shadow-sm" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center animate-pulse transition-colors">
                 <div className="w-3 h-3 bg-primary-red dark:bg-red-500 rounded-full transition-colors"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">No Certificates Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto font-medium leading-relaxed transition-colors">
              Certificates are awarded as a token of gratitude after you complete a blood donation. 
              Keep donating to unlock your digital hero certificates!
            </p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link href="/dashboard/donations" className="inline-block bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-700 dark:text-gray-300 font-bold py-3 px-8 rounded-xl text-[14px] transition-colors shadow-sm">
                 View Donations
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
