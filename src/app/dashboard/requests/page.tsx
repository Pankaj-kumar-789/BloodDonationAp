import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, CheckCircle2, XCircle } from "lucide-react";
import RequestActionButtons from "./RequestActionButtons";

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
    <div className="max-w-6xl mx-auto space-y-6">
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Manage Blood Requests</h1>
            <p className="text-gray-500 max-w-lg">Review and respond to incoming blood requests from hospitals and patients in your area.</p>
          </div>
          <div className="bg-red-50 text-[#C62121] px-6 py-3 rounded-xl border border-red-100 font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            {pendingCount} Pending
          </div>
        </div>

        <div className="space-y-4">
          {requests.length > 0 ? requests.map((req) => (
            <div key={req.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between">
              
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#C62121] font-black flex items-center justify-center text-xl border border-red-100 shadow-inner shrink-0">
                  {req.bloodGroup.replace("_POS", "+").replace("_NEG", "-")}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{req.patientName}</h3>
                    {req.isEmergency && (
                      <span className="bg-red-500 text-white text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full">Emergency</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {req.hospital}, {req.city}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {req.units} Units Needed</span>
                  </div>
                </div>
              </div>

              {req.status === "PENDING" ? (
                <RequestActionButtons requestId={req.id} />
              ) : (
                <div className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 font-bold border border-green-100 rounded-xl md:w-auto w-full md:mt-0 mt-4 justify-center">
                  <CheckCircle2 className="w-5 h-5" /> Accepted {req.acceptedBy?.id === session.user.id ? "by You" : ""}
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">All caught up!</h3>
              <p className="text-gray-500">There are no pending blood requests at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
