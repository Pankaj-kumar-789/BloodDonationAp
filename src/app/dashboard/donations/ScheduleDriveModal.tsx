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
    <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800 transition-colors">
          <h2 className="text-xl font-black text-gray-900 dark:text-white transition-colors">Schedule Drive</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 text-[#C62121] dark:text-red-400 text-sm font-bold p-4 rounded-xl border border-red-100 dark:border-red-900/30 transition-colors">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Drive Name / Title</label>
            <input 
              name="name"
              required
              placeholder="e.g. Community Summer Blood Drive"
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl focus:ring-[#C62121] focus:border-[#C62121] p-3 outline-none transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Date</label>
              <input 
                name="date"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl focus:ring-[#C62121] focus:border-[#C62121] p-3 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Expected Donors</label>
              <input 
                name="expectedDonors"
                type="number"
                min="1"
                placeholder="50"
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl focus:ring-[#C62121] focus:border-[#C62121] p-3 outline-none transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Location Address</label>
            <textarea 
              name="location"
              required
              rows={2}
              placeholder="Full address of the drive location"
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl focus:ring-[#C62121] focus:border-[#C62121] p-3 outline-none resize-none transition-colors"
            />
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 transition-colors">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
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
