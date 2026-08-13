"use client";

import { ArrowLeft, History, Droplet, Heart } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

export default function DonorDonationsClient({ 
  donations, 
  totalDonations, 
  livesImpacted 
}: { 
  donations: any[],
  totalDonations: number,
  livesImpacted: number
}) {
  return (
    <PageTransition className="max-w-5xl mx-auto space-y-6">
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors">
        <div className="mb-8">
          <h1 className="text-3xl md:text-[2rem] font-black text-gray-900 dark:text-white mb-2 transition-colors">My Donations</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg font-medium text-[15px] transition-colors">Keep track of your incredible life-saving journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-red-50 dark:bg-red-950/30 rounded-3xl p-6 border border-red-100/50 dark:border-red-900/30 flex items-center gap-5 transition-colors">
            <div className="w-[52px] h-[52px] rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-sm border border-red-100 dark:border-red-900/50 transition-colors">
               <Droplet className="w-6 h-6 text-primary-red fill-primary-red/10" strokeWidth={2} />
            </div>
            <div>
               <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide transition-colors">Total Donations</p>
               <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none transition-colors">{totalDonations}</h3>
            </div>
          </div>
          <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-3xl p-6 border border-orange-100/50 dark:border-orange-900/30 flex items-center gap-5 transition-colors">
            <div className="w-[52px] h-[52px] rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-sm border border-orange-100 dark:border-orange-900/50 transition-colors">
               <Heart className="w-6 h-6 text-orange-500 fill-orange-500" />
            </div>
            <div>
               <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide transition-colors">Lives Impacted</p>
               <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none transition-colors">{livesImpacted}+</h3>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 transition-colors">Donation History</h2>
        
        {donations.length > 0 ? (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div key={donation.id} className="p-5 border border-gray-100 dark:border-slate-800 rounded-3xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm">
                <div className="flex items-center gap-5">
                   <div className="w-[48px] h-[48px] rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0 border border-red-100/50 dark:border-red-900/30 transition-colors">
                      <Droplet className="w-6 h-6 text-primary-red fill-primary-red/10" strokeWidth={2} />
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900 dark:text-white text-[16px] mb-1 transition-colors">{donation.hospital}</h3>
                     <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium transition-colors">{new Date(donation.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                   </div>
                </div>
                <div className="flex items-center gap-8 md:gap-12 pl-[68px] md:pl-0">
                  <div className="text-left md:text-center">
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-0.5 transition-colors">Donation Type</p>
                    <p className="text-[15px] font-black text-gray-900 dark:text-white transition-colors">{donation.donationType}</p>
                  </div>
                  <div className="text-left md:text-center">
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-0.5 transition-colors">Units</p>
                    <p className="text-[15px] font-black text-primary-red">{donation.units}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 transition-colors">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <History className="w-8 h-8 text-gray-300 dark:text-gray-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors">No donations recorded yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto font-medium transition-colors">Your donation history will appear here once you complete a donation.</p>
            <Link href="/dashboard/requests" className="mt-6 inline-block bg-primary-red hover:bg-red-800 text-white font-bold py-2.5 px-8 rounded-xl text-[13px] transition-colors shadow-sm">
               Find Someone to Help
            </Link>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
