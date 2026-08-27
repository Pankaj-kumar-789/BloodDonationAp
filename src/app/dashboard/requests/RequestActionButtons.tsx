"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { updateRequestStatusAction } from "@/app/actions/requests";

export default function RequestActionButtons({ requestId }: { requestId: string }) {
  const [isProcessing, setIsProcessing] = useState<"ACCEPT" | "REJECT" | null>(null);

  const handleAction = async (action: "ACCEPT" | "REJECT") => {
    setIsProcessing(action);
    const status = action === "ACCEPT" ? "ACCEPTED" : "CANCELLED";
    await updateRequestStatusAction(requestId, status);
    setIsProcessing(null);
  };

  return (
    <div className="flex items-center gap-3 md:w-auto w-full md:mt-0 mt-4">
      <button 
        onClick={() => handleAction("REJECT")}
        disabled={isProcessing !== null}
        className="flex-1 md:flex-none px-6 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isProcessing === "REJECT" ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
        Reject
      </button>
      <button 
        onClick={() => handleAction("ACCEPT")}
        disabled={isProcessing !== null}
        className="flex-1 md:flex-none px-6 py-3 bg-[#C62121] text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isProcessing === "ACCEPT" ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
        Accept
      </button>
    </div>
  );
}
