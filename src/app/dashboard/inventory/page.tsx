import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import InventoryManager from "@/components/InventoryManager";
import Link from "next/link";
import { ArrowLeft, Droplet } from "lucide-react";

export default async function InventoryPage() {
  const session = await auth();
  
  if (session?.user?.role !== "BLOOD_BANK" && session?.user?.role !== "HOSPITAL") {
    redirect("/dashboard");
  }

  const isHospital = session.user.role === "HOSPITAL";

  const bloodGroups = ["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"];
  const donationTypes = ["BLOOD", "PLATELETS", "PLASMA"];
  
  let currentInventory: { group: string, label: string, units: number, type: string }[] = [];

  if (isHospital) {
    const profile = await prisma.hospitalProfile.findUnique({
      where: { userId: session.user.id },
      include: { inventory: true }
    });

    for (const type of donationTypes) {
      for (const bg of bloodGroups) {
        const item = profile?.inventory.find(i => i.bloodGroup === bg && i.donationType === type);
        currentInventory.push({
          group: bg,
          label: bg.replace("_POS", "+").replace("_NEG", "-"),
          units: item?.units || 0,
          type: type
        });
      }
    }
  } else {
    // Fetch blood bank profile and inventory
    const profile = await prisma.bloodBankProfile.findUnique({
      where: { userId: session.user.id },
      include: { inventory: true }
    });

    for (const type of donationTypes) {
      for (const bg of bloodGroups) {
        const item = profile?.inventory.find(i => i.bloodGroup === bg && i.donationType === type);
        currentInventory.push({
          group: bg,
          label: bg.replace("_POS", "+").replace("_NEG", "-"),
          units: item?.units || 0,
          type: type
        });
      }
    }
  }

  const totalUnits = currentInventory.reduce((acc, curr) => acc + curr.units, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {isHospital ? "Hospital Blood Inventory" : "Live Inventory Manager"}
          </h1>
          <p className="text-gray-500 max-w-lg">
            {isHospital 
              ? "Keep your hospital's blood stock up to date. This ensures accurate internal tracking."
              : "Keep your blood stock up to date. This information is visible in real-time to hospitals and patients in your area searching for blood."}
          </p>
        </div>
        <div className="bg-red-50 text-[#C62121] p-5 rounded-2xl border border-red-100 text-center min-w-[160px] shadow-sm">
          <div className="text-[12px] font-bold uppercase tracking-wider mb-1">Total Stock</div>
          <div className="text-4xl font-black flex items-center justify-center gap-2">
            <Droplet className="w-7 h-7 fill-current" /> {totalUnits}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <InventoryManager initialInventory={currentInventory} />
      </div>
    </div>
  );
}
