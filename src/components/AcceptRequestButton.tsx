"use client";

import { useState } from "react";
import { Activity, Loader2, CheckCircle2, Heart, AlertCircle } from "lucide-react";
import { acceptEmergencyRequestAction } from "@/app/actions/emergency";
import { useRouter } from "next/navigation";

export default function AcceptRequestButton({ requestId }: { requestId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const confirmAccept = async () => {
    setLoading(true);
    setErrorMsg("");
    const res = await acceptEmergencyRequestAction(requestId);
    if (res.error) {
      setErrorMsg(res.error);
      setLoading(false);
    } else {
      setShowModal(false);
      setSuccess(true);
      router.refresh();
    }
  };

  if (success) {
    return (
      <div className="w-full md:w-auto bg-green-50 text-green-700 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 border border-green-200 animate-in zoom-in duration-300">
        <CheckCircle2 className="w-5 h-5" />
        Accepted!
      </div>
    );
  }

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="w-full md:w-auto bg-primary-red hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md shadow-red-200 flex items-center justify-center gap-2 md:group-hover:scale-105 transform duration-300 disabled:opacity-70 disabled:hover:scale-100"
      >
        <Activity className="w-5 h-5" />
        I Can Donate
      </button>

      {/* Custom Volunteer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-red border border-red-100">
              <Heart className="w-8 h-8 fill-primary-red text-primary-red animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-center text-gray-900 mb-2">Confirm Volunteer?</h2>
            <p className="text-center text-gray-500 mb-6 font-medium">Are you sure you want to volunteer for this request? Your contact details will be shared with the hospital/patient.</p>
            
            {errorMsg && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
              </div>
            )}

            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => { setShowModal(false); setErrorMsg(""); }}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={confirmAccept}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-primary-red hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
