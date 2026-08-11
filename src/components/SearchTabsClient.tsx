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
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] bg-gray-50/50  transition-colors">
      {/* Tabs Header */}
      <div className="bg-white  border-b border-gray-100  px-4 md:px-8 py-4 shrink-0 flex justify-center transition-colors">
        <div className="bg-gray-100  p-1 rounded-xl flex gap-1 w-full max-w-md">
          <button
            onClick={() => setActiveTab("donors")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "donors" 
                ? "bg-white  text-primary-red  shadow-sm " 
                : "text-gray-500  hover:text-gray-900  hover:bg-gray-200/50 "
            }`}
          >
            <User className="w-4 h-4" /> Individual Donors
          </button>
          <button
            onClick={() => setActiveTab("banks")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "banks" 
                ? "bg-white  text-primary-red  shadow-sm " 
                : "text-gray-500  hover:text-gray-900  hover:bg-gray-200/50 "
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
