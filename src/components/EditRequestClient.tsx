"use client";

import { useState } from "react";
import { updateEmergencyRequestAction, deleteEmergencyRequestAction } from "@/app/actions/emergency";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, CheckCircle2, Loader2, AlertCircle, Lock, Unlock, Phone, Mail, MapPin } from "lucide-react";
import { unlockDonorContactAction } from "@/app/actions/payment";
import { completeEmergencyRequestAction } from "@/app/actions/emergency";
import Link from "next/link";
import ReviewModalClient from "./ReviewModalClient";

export default function EditRequestClient({ request }: { request: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState(request.status);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [donorIdToReview, setDonorIdToReview] = useState<string | null>(null);

  const handleUnlock = async () => {
    setUnlocking(true);
    setError("");
    const res = await unlockDonorContactAction(request.id);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Payment successful! Donor contact details unlocked.");
      router.refresh();
    }
    setUnlocking(false);
  };

  const handleComplete = async () => {
    if (!confirm("Are you sure you want to mark this donation as completed?")) return;
    setCompleting(true);
    setError("");
    
    const res = await completeEmergencyRequestAction(request.id);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Request marked as completed successfully!");
      setStatus("COMPLETED");
      if (res.donorUserId) {
        setDonorIdToReview(res.donorUserId);
        setShowReviewModal(true);
      }
      router.refresh();
    }
    setCompleting(false);
  };

  const bgOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const formattedBg = request.bloodGroup.replace("_POS", "+").replace("_NEG", "-");

  // Format date for datetime-local input
  const dateObj = new Date(request.requiredBefore);
  const formattedDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    formData.append("status", status); // ensure status is sent
    
    const res = await updateEmergencyRequestAction(request.id, formData);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Request updated successfully.");
      router.refresh();
    }
    setLoading(false);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    setLoading(true);
    const res = await deleteEmergencyRequestAction(request.id);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 relative">
      <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Manage Request</h1>
            <p className="text-gray-400 mt-1">Update patient details, change status, or remove request.</p>
          </div>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => setStatus("PENDING")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${status === "PENDING" ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'}`}
            >
              PENDING
            </button>
            <button 
              type="button"
              onClick={() => setStatus("COMPLETED")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${status === "COMPLETED" ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'}`}
            >
              COMPLETED
            </button>
          </div>
        </div>

        {/* Accepted Donor Section */}
        {request.status === "ACCEPTED" && request.acceptedBy && (
          <div className="bg-red-50/50 border-b border-red-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" /> Donor Found!
            </h2>
            
            {!request.isContactUnlocked ? (
              <div className="bg-white rounded-2xl p-6 border border-red-100 text-center shadow-sm max-w-lg mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{request.acceptedBy.name} has volunteered!</h3>
                <p className="text-gray-500 text-sm mb-6">Pay a small platform fee of ₹20 to securely unlock the donor's contact details and connect immediately.</p>
                <button 
                  onClick={handleUnlock}
                  disabled={unlocking}
                  type="button"
                  className="w-full bg-primary-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {unlocking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Unlock className="w-5 h-5" />}
                  Pay ₹20 to Unlock Contact
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm shadow-green-100 max-w-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-4 w-full">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{request.acceptedBy.name}</h3>
                      <p className="text-sm text-green-600 font-medium">Verified Volunteer</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {request.acceptedBy.phone && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{request.acceptedBy.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{request.acceptedBy.email}</span>
                      </div>
                      {request.acceptedBy.donorProfile?.city && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl sm:col-span-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{request.acceptedBy.donorProfile.city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {status !== "COMPLETED" && (
                  <div className="mt-6 pt-6 border-t border-green-100 flex justify-end">
                    <button
                      onClick={handleComplete}
                      disabled={completing}
                      type="button"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-emerald-200 flex items-center gap-2 disabled:opacity-70"
                    >
                      {completing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                      Mark Donation as Completed
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleUpdate} className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl font-medium flex items-center gap-2 border border-green-100">
              <CheckCircle2 className="w-5 h-5" /> {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient Name</label>
              <input type="text" name="patientName" defaultValue={request.patientName} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-colors" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group Required</label>
              <select name="bloodGroup" defaultValue={formattedBg} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-colors">
                {bgOptions.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Units Required</label>
              <input type="number" name="units" min="1" defaultValue={request.units} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-colors" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Required Before</label>
              <input type="datetime-local" name="requiredBefore" defaultValue={formattedDate} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-colors" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital Name & City</label>
              <input type="text" name="hospitalCity" defaultValue={`${request.hospital}, ${request.city}`} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-colors" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
              <input type="tel" name="contactNumber" defaultValue={request.contactNumber} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-colors" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Description</label>
              <textarea name="description" rows={3} defaultValue={request.description || ""} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-colors"></textarea>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Delete Request
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-gray-900/20 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Custom Delete Modal Overlay */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-100">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-center text-gray-900 mb-2">Delete Request?</h2>
            <p className="text-center text-gray-500 mb-8 font-medium">This action cannot be undone. Are you sure you want to permanently delete this blood request?</p>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-primary-red hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && donorIdToReview && request.acceptedBy && (
        <ReviewModalClient
          donorId={donorIdToReview}
          donorName={request.acceptedBy.name}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
}
