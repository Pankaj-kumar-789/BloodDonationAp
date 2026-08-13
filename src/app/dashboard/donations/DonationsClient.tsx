"use client";

import { useState } from "react";
import { ArrowLeft, History, Calendar, Activity, Clock, MapPin, Search } from "lucide-react";
import Link from "next/link";
import ScheduleDriveModal from "./ScheduleDriveModal";
import { DriveStatus } from "@prisma/client";

export default function DonationsClient({ 
  drives, 
  totalDrives, 
  totalUnits, 
  upcomingDrives 
}: { 
  drives: any[],
  totalDrives: number,
  totalUnits: number,
  upcomingDrives: number
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 transition-colors">Donations</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg transition-colors">Track recent blood donations and organize upcoming donation drives.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#C62121] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-200 dark:shadow-none"
          >
            Schedule Drive
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl p-6 border border-red-100 dark:border-red-900/30 transition-colors">
            <Activity className="w-6 h-6 text-[#C62121] mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-gray-200 mb-1 transition-colors">Total Drives</h3>
            <p className="text-3xl font-black text-[#C62121]">{totalDrives}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 rounded-2xl p-6 border border-green-100 dark:border-green-900/30 transition-colors">
            <History className="w-6 h-6 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-gray-200 mb-1 transition-colors">Total Units Collected</h3>
            <p className="text-3xl font-black text-green-600">{totalUnits}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-2xl p-6 border border-orange-100 dark:border-orange-900/30 transition-colors">
            <Calendar className="w-6 h-6 text-orange-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-gray-200 mb-1 transition-colors">Upcoming Drives</h3>
            <p className="text-3xl font-black text-orange-500">{upcomingDrives}</p>
          </div>
        </div>

        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 transition-colors">Donation Drives Activity</h2>
        
        {drives.length > 0 ? (
          <div className="space-y-4">
            {drives.map((drive) => (
              <div key={drive.id} className="p-5 border border-gray-100 dark:border-slate-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 transition-colors">{drive.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#C62121]" /> {new Date(drive.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {drive.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase transition-colors">Expected Donors</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white transition-colors">{drive.expectedDonors || "-"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase transition-colors">Units Collected</p>
                    <p className="text-lg font-black text-[#C62121]">{drive.unitsCollected}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    drive.status === "UPCOMING" ? "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400" :
                    drive.status === "ACTIVE" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" :
                    drive.status === "COMPLETED" ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400" :
                    "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
                  }`}>
                    {drive.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 transition-colors">
            <History className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-4 transition-colors" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 transition-colors">No recent drives</h3>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Schedule your first blood donation drive to start tracking activity.</p>
          </div>
        )}
      </div>

      <ScheduleDriveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
