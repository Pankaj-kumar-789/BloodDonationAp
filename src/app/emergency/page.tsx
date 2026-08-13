"use client";

import { useState } from "react";
import { AlertCircle, Activity, MapPin, Loader2 } from "lucide-react";
import { createEmergencyRequestAction } from "@/app/actions/emergency";
import Link from "next/link";

export default function EmergencyPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await createEmergencyRequestAction(formData);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        <div className="bg-primary-red dark:bg-red-950/60 dark:border dark:border-red-900/50 p-6 rounded-t-2xl text-white flex flex-col items-center text-center transition-colors">
          <AlertCircle className="w-12 h-12 mb-3" />
          <h1 className="text-2xl font-bold uppercase tracking-wide">Emergency Blood Request</h1>
          <p className="mt-2 text-red-100 max-w-lg text-sm">
            Fill this form only for verified medical emergencies. Nearby donors will receive instant push notifications.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-b-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 transition-colors">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 text-primary-red dark:text-red-400 rounded-xl font-medium text-center transition-colors">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Request Broadcasted</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">Your emergency request has been successfully recorded and sent to nearby donors.</p>
              <div className="flex justify-center gap-4">
                <Link href="/dashboard" className="px-6 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-white rounded-lg font-medium transition-colors">
                  Go to Dashboard
                </Link>
                <button onClick={() => setSuccess(false)} className="px-6 py-2 bg-primary-red hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                  Create another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Patient Name</label>
                  <input type="text" name="patientName" required className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors" placeholder="Full name of patient" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Blood Group Required</label>
                  <select name="bloodGroup" required className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors">
                    <option value="">Select Blood Group</option>
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option>
                    <option>AB+</option><option>AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Requirement Type</label>
                  <select name="donationType" required className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors">
                    <option value="BLOOD">Whole Blood</option>
                    <option value="PLATELETS">Platelets</option>
                    <option value="PLASMA">Plasma</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Units Required</label>
                  <input type="number" name="units" min="1" required className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors" placeholder="E.g., 2" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Required Before</label>
                  <input type="datetime-local" name="requiredBefore" required className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Hospital Name & City</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <input type="text" name="hospitalCity" required className="w-full ps-10 px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors" placeholder="E.g. Apollo Hospital, New Delhi" />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Contact Number</label>
                  <input type="tel" name="contactNumber" required className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors" placeholder="10-digit mobile number" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Additional Description</label>
                  <textarea name="description" rows={3} className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors" placeholder="Any specific requirements or medical conditions..."></textarea>
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="w-full bg-primary-red hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-red-200 mt-8 flex justify-center items-center gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> BROADCASTING...</> : "POST EMERGENCY REQUEST"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
