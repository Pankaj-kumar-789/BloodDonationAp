import { Droplet, Search, Settings, ShieldCheck, Activity, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function BloodBankDashboard({ session }: { session: any }) {
  // Fetch blood bank profile and inventory
  const profile = await prisma.bloodBankProfile.findUnique({
    where: { userId: session.user.id },
    include: { inventory: true }
  });

  const bloodGroups = ["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"];

  // Map inventory data or default to 0
  const inventoryMap = new Map(profile?.inventory.map(i => [i.bloodGroup, i.units]));
  const currentInventory = bloodGroups.map(bg => ({
    group: bg,
    label: bg.replace("_POS", "+").replace("_NEG", "-"),
    units: inventoryMap.get(bg as any) || 0
  }));

  const totalUnits = currentInventory.reduce((acc, curr) => acc + curr.units, 0);

  return (
    <div className="space-y-6">
      {(!profile || !profile.isVerified) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded-r-xl shadow-sm mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-500">Account Pending Verification</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">Your blood bank account is currently under review by our admin team. Some features may be restricted until you are verified. Please complete your profile in Settings.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{session.user.name} Dashboard</h1>
          <p className="text-gray-500">Manage your blood inventory and coordinate with hospitals.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-red-50 text-primary-red px-4 py-2 rounded-xl border border-red-100 flex items-center gap-2">
            <Droplet className="w-5 h-5 fill-current" />
            <span className="font-bold">{totalUnits} Total Units</span>
          </div>
          <Link href="/dashboard/inventory" className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            Update Inventory
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
        {currentInventory.map(item => (
          <div key={item.group} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center hover:border-red-200 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-50 to-red-100 text-primary-red flex items-center justify-center font-black text-2xl shadow-inner mb-4 relative z-10 border-4 border-white">
              {item.label}
            </div>
            <div className="text-center relative z-10">
              <div className="text-4xl font-black text-gray-900 tracking-tight">{item.units}</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Units</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Network</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Find Hospitals</h3>
            <p className="text-sm text-gray-500 mb-4">Connect with local hospitals to fulfill bulk blood requirements.</p>
            <Link href="/search" className="text-blue-500 font-medium text-sm hover:underline flex items-center gap-1">
              Search Directory &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Urgent</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Emergency Board</h3>
            <p className="text-sm text-gray-500 mb-4">View real-time urgent blood requests broadcasted in your city.</p>
            <Link href="/requests" className="text-orange-500 font-medium text-sm hover:underline flex items-center gap-1">
              View Emergency Board &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
