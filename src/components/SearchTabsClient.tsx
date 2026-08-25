"use client";

import { useState } from "react";
import DonorSearchClient from "./DonorSearchClient";
import BloodBankSearchClient from "./BloodBankSearchClient";
import { User, Building2 } from "lucide-react";

export default function SearchTabsClient({ 
  initialDonors, 
  unlockedDonorIds, 
  bloodBanks 
}: { 
  initialDonors: any[], 
  unlockedDonorIds: string[], 
  bloodBanks: any[] 
}) {
  const [activeTab, setActiveTab] = useState<"donors" | "banks">("donors");

  return (
    <div className="flex flex-col flex-1 h-full bg-gray-50/50 dark:bg-slate-900 transition-colors">
      {/* Tabs Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-4 md:px-8 py-4 shrink-0 flex justify-center transition-colors">
        <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1 w-full max-w-md transition-colors">
          <button
            onClick={() => setActiveTab("donors")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "donors" 
                ? "bg-white dark:bg-slate-700 text-primary-red dark:text-red-400 shadow-sm" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-slate-700/50"
            }`}
          >
            <User className="w-4 h-4" /> Individual Donors
          </button>
          <button
            onClick={() => setActiveTab("banks")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "banks" 
                ? "bg-white dark:bg-slate-700 text-primary-red dark:text-red-400 shadow-sm" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-slate-700/50"
            }`}
          >
            <Building2 className="w-4 h-4" /> Blood Banks
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "donors" ? (
          <DonorSearchClient initialDonors={initialDonors} unlockedDonorIds={unlockedDonorIds} />
        ) : (
          <BloodBankSearchClient bloodBanks={bloodBanks} />
        )}
      </div>
    </div>
  );
}
