"use client";

import { Activity, Clock, ShieldCheck, Users, MessageSquare, Star, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getOrCreateChatRoomAction } from "@/app/actions/chat";
import { useRouter } from "next/navigation";
import ReviewModal from "./ReviewModal";

export default function HospitalActiveRequests({ activeRequests }: { activeRequests: any[] }) {
  const router = useRouter();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [reviewingDonor, setReviewingDonor] = useState<{ id: string, name: string } | null>(null);

  const handleMessageDonor = async (donorId: string) => {
    setIsCreatingChat(true);
    const res = await getOrCreateChatRoomAction(donorId);
    if (res.success && res.roomId) {
      router.push(`/dashboard/messages`);
    } else {
      alert("Failed to create chat room.");
      setIsCreatingChat(false);
    }
  };

  if (activeRequests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No active requests</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Your hospital doesn't have any pending emergency requests at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeRequests.map((req) => (
        <div key={req.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-400 to-primary-red opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex flex-col items-center justify-center border border-red-100 dark:border-red-900/50 shrink-0 shadow-sm">
                <span className="text-primary-red dark:text-red-400 font-black text-lg leading-none">{req.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-900 dark:text-white font-bold text-lg">{req.patientName}</span>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    req.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50' : 
                    req.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50'
                  }`}>
                    {req.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-gray-400" /> {req.units} Units required</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> By {new Date(req.requiredBefore).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800 shrink-0">
              <Link href={`/dashboard/requests/${req.id}`} className="w-full md:w-auto flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-xl transition-all shadow-sm">
                Manage Request <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Show accepted donor if applicable */}
          {(req.status === 'ACCEPTED' || req.status === 'COMPLETED') && req.acceptedBy && (
            <div className="mt-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {req.status === 'COMPLETED' ? 'Donation Completed By' : 'Donor En Route'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">
                    {req.acceptedBy.name} ({req.acceptedBy.donorProfile?.bloodGroup.replace('_POS', '+').replace('_NEG', '-')})
                    {req.acceptedBy.donorProfile?.rating > 0 && ` • ★ ${req.acceptedBy.donorProfile.rating.toFixed(1)}`}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {req.isContactUnlocked && req.acceptedBy.phone && (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {req.acceptedBy.phone}
                  </div>
                )}
                <button 
                  onClick={() => handleMessageDonor(req.acceptedBy.id)}
                  disabled={isCreatingChat}
                  className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> Message
                </button>
                {req.status === 'COMPLETED' && (
                  <button 
                    onClick={() => setReviewingDonor({ id: req.acceptedBy.id, name: req.acceptedBy.name })}
                    className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Star className="w-4 h-4" /> Rate Donor
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {reviewingDonor && (
        <ReviewModal
          reviewedUserId={reviewingDonor.id}
          reviewedUserName={reviewingDonor.name}
          onClose={() => setReviewingDonor(null)}
          onSuccess={() => {
            setReviewingDonor(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
