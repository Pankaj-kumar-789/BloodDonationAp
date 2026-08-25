import { History, Calendar, Droplet, CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
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
  const totalUnits = donations.reduce((sum, item) => sum + item.units, 0);
  const livesSaved = totalUnits * 3; // Fun fact: 1 unit of blood can save up to 3 lives

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDonationType = (type: string) => {
    if (type === 'BLOOD') return 'Whole Blood';
    if (type === 'PLATELETS') return 'Platelets';
    if (type === 'PLASMA') return 'Plasma';
    return type;
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Donation History</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Track your past donations and requests</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-sm transition-colors">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-50 dark:border-slate-800 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 text-primary-red dark:text-red-400 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/50 transition-colors">
            <Droplet className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-xl sm:text-2xl transition-colors">Total Donations</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors">
              {totalUnits > 0 
                ? `You have donated ${totalUnits} units and helped save up to ${livesSaved} lives!` 
                : "You haven't made any donations yet."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {donations.length > 0 ? (
            donations.map((donation) => (
              <div key={donation.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-50 dark:border-slate-800 hover:border-red-100 dark:hover:border-red-900/50 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all group cursor-default gap-4 bg-gray-50/50 dark:bg-slate-800/30">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 border border-green-100 dark:border-green-900/30 transition-colors">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg transition-colors">{donation.hospital}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium transition-colors">
                      <Calendar className="w-4 h-4" /> {formatDate(donation.date)}
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col justify-between sm:justify-center items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-gray-100 dark:border-slate-800 pt-3 sm:pt-0 mt-1 sm:mt-0 transition-colors">
                  <div className="font-bold text-gray-900 dark:text-white text-lg transition-colors">{donation.units} {donation.units === 1 ? 'Unit' : 'Units'}</div>
                  <div className="text-sm text-primary-red dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full mt-1 transition-colors">{formatDonationType(donation.donationType)}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-slate-700">
                <History className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No History Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Your past donations will appear here once you log them.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
