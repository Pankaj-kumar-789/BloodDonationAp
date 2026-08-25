import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, CheckCircle2, XCircle } from "lucide-react";
import RequestActionButtons from "./RequestActionButtons";
import PageTransition from "@/components/PageTransition";
import EmptyState from "@/components/EmptyState";

export default async function ManageRequestsPage() {
  const session = await auth();
  if (!session) return null;

  // Fetch pending and accepted requests
  const requests = await prisma.bloodRequest.findMany({
    where: { status: { in: ["PENDING", "ACCEPTED"] } },
    orderBy: { createdAt: "desc" },
    include: { creator: true, acceptedBy: true }
  });

  const pendingCount = requests.filter(r => r.status === "PENDING").length;

  return (
    <PageTransition className="max-w-6xl mx-auto space-y-6">
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 transition-colors">Manage Blood Requests</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg transition-colors">Review and respond to incoming blood requests from hospitals and patients in your area.</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 text-[#C62121] dark:text-red-400 px-6 py-3 rounded-xl border border-red-100 dark:border-red-900/30 font-bold flex items-center gap-2 transition-colors">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            {pendingCount} Pending
          </div>
        </div>

        <div className="space-y-4">
          {requests.length > 0 ? requests.map((req) => (
            <div key={req.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between">
              
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 text-[#C62121] dark:text-red-400 font-black flex items-center justify-center text-xl border border-red-100 dark:border-red-900/30 shadow-inner shrink-0 transition-colors">
                  {req.bloodGroup.replace("_POS", "+").replace("_NEG", "-")}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">{req.patientName}</h3>
                    {req.isEmergency && (
                      <span className="bg-red-500 text-white text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full">Emergency</span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors mt-2 sm:mt-0">
                    <span className="flex items-start sm:items-center gap-1.5">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" /> 
                      <span className="line-clamp-2">{req.hospital}, {req.city}</span>
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <Clock className="w-4 h-4" /> {req.units} Units Needed
                    </span>
                  </div>
                </div>
              </div>

              {req.status === "PENDING" ? (
                <RequestActionButtons requestId={req.id} />
              ) : (
                <div className="flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 font-bold border border-green-100 dark:border-green-900/30 rounded-xl md:w-auto w-full md:mt-0 mt-4 justify-center transition-colors">
                  <CheckCircle2 className="w-5 h-5" /> Accepted {req.acceptedBy?.id === session.user.id ? "by You" : ""}
                </div>
              )}
            </div>
          )) : (
            <div className="col-span-full">
              <EmptyState 
                icon={<CheckCircle2 className="w-10 h-10" strokeWidth={1.5} />} 
                title="All caught up!" 
                description="There are no pending blood requests at the moment."
              />
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
