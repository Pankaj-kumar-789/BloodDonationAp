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
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Donations</h1>
            <p className="text-gray-500 max-w-lg">Track recent blood donations and organize upcoming donation drives.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#C62121] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-200"
          >
            Schedule Drive
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
            <Activity className="w-6 h-6 text-[#C62121] mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Total Drives</h3>
            <p className="text-3xl font-black text-[#C62121]">{totalDrives}</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
            <History className="w-6 h-6 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Total Units Collected</h3>
            <p className="text-3xl font-black text-green-600">{totalUnits}</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
            <Calendar className="w-6 h-6 text-orange-500 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Upcoming Drives</h3>
            <p className="text-3xl font-black text-orange-500">{upcomingDrives}</p>
          </div>
        </div>

        <h2 className="text-lg font-black text-gray-900 mb-4">Donation Drives Activity</h2>
        
        {drives.length > 0 ? (
          <div className="space-y-4">
            {drives.map((drive) => (
              <div key={drive.id} className="p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{drive.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#C62121]" /> {new Date(drive.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {drive.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase">Expected Donors</p>
                    <p className="text-lg font-black text-gray-900">{drive.expectedDonors || "-"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase">Units Collected</p>
                    <p className="text-lg font-black text-[#C62121]">{drive.unitsCollected}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                    drive.status === "UPCOMING" ? "bg-orange-50 text-orange-600" :
                    drive.status === "ACTIVE" ? "bg-blue-50 text-blue-600" :
                    drive.status === "COMPLETED" ? "bg-green-50 text-green-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {drive.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <History className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No recent drives</h3>
            <p className="text-gray-500">Schedule your first blood donation drive to start tracking activity.</p>
          </div>
        )}
      </div>

      <ScheduleDriveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
