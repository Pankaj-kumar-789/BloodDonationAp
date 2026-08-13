import { Award, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

export default function CertificatesPage() {
  return (
    <PageTransition className="max-w-5xl mx-auto space-y-6 mt-4 pb-10">
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors">
        <div className="mb-8">
          <h1 className="text-3xl md:text-[2rem] font-black text-gray-900 dark:text-white mb-2 transition-colors">My Certificates</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg font-medium text-[15px] transition-colors">View and download your blood donation appreciation certificates.</p>
        </div>

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
      </div>
    </PageTransition>
  );
}
