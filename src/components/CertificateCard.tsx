"use client";

import { useRef, useState } from "react";
import { Award, Download, Calendar, MapPin, Loader2 } from "lucide-react";
import * as htmlToImage from "html-to-image";

export default function CertificateCard({ 
  donation 
}: { 
  donation: { 
    id: string; 
    date: Date; 
    hospital: string; 
    donorName: string;
  } 
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      setIsDownloading(true);
      
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
        }
      });
      
      const link = document.createElement("a");
      link.download = `RaktaSetu_Certificate_${new Date(donation.date).toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate certificate", err);
      alert("Failed to generate the certificate image.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* The actual certificate UI that will be captured */}
      <div 
        ref={cardRef}
        className="relative bg-gradient-to-br from-red-50 to-white dark:from-slate-800 dark:to-slate-900/50 border border-red-100 dark:border-slate-700 rounded-3xl p-6 shadow-sm overflow-hidden flex-1 flex flex-col"
      >
        {/* Decorative background element */}
        <div className="absolute -right-6 -top-6 text-red-500/[0.03] dark:text-white/[0.02] transform rotate-12 pointer-events-none">
          <Award className="w-40 h-40" />
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center border border-red-50 dark:border-slate-700 shrink-0">
              <Award className="w-7 h-7 text-orange-500" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 dark:text-white text-lg">Life Saver</h3>
              <p className="text-xs font-bold text-primary-red dark:text-red-400 uppercase tracking-wider">Certificate of Honor</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4 flex-1">
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-4">
              Proudly presented to <span className="font-bold text-gray-900 dark:text-white">{donation.donorName}</span> for their selfless act of blood donation.
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400 font-medium bg-white/50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-white dark:border-slate-700/50">
              <Calendar className="w-4 h-4 text-gray-400" />
              {new Date(donation.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400 font-medium bg-white/50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-white dark:border-slate-700/50">
              <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
              <span className="truncate">{donation.hospital}</span>
            </div>
          </div>
          
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center mt-2">
            RaktaSetu Official Record
          </div>
        </div>
      </div>
      
      {/* The download button is kept outside the capture area */}
      <button 
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-primary-red/50 dark:hover:border-red-500/50 hover:shadow-sm text-gray-900 dark:text-white font-bold py-3.5 px-4 rounded-xl text-[14px] transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50"
      >
        {isDownloading ? (
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
        ) : (
          <Download className="w-4 h-4 text-gray-400 group-hover/btn:text-primary-red transition-colors" />
        )}
        {isDownloading ? "Generating..." : "Download Certificate"}
      </button>
    </div>
  );
}
