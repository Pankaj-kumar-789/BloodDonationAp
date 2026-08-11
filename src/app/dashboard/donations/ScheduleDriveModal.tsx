"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { scheduleDriveAction } from "@/app/actions/drives";

export default function ScheduleDriveModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await scheduleDriveAction(formData);
    
    setIsSubmitting(false);
    
    if (res.error) {
      setError(res.error);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900">Schedule Drive</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-[#C62121] text-sm font-bold p-4 rounded-xl border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Drive Name / Title</label>
            <input 
              name="name"
              required
              placeholder="e.g. Community Summer Blood Drive"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-[#C62121] focus:border-[#C62121] p-3 outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
              <input 
                name="date"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-[#C62121] focus:border-[#C62121] p-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Expected Donors</label>
              <input 
                name="expectedDonors"
                type="number"
                min="1"
                placeholder="50"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-[#C62121] focus:border-[#C62121] p-3 outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location Address</label>
            <textarea 
              name="location"
              required
              rows={2}
              placeholder="Full address of the drive location"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-[#C62121] focus:border-[#C62121] p-3 outline-none resize-none"
            />
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#C62121] hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Schedule Drive"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
