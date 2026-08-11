import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DonationsClient from "./DonationsClient";
import DonorDonationsClient from "./DonorDonationsClient";

export default async function DonationsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  if (session.user.role === "DONOR") {
    const profile = await prisma.donorProfile.findUnique({
      where: { userId: session.user.id },
      include: { donationHistory: { orderBy: { date: "desc" } } }
    });

    if (!profile) return null;

    const donations = profile.donationHistory || [];
    const totalDonations = donations.length;
    const livesImpacted = totalDonations * 3;

    return (
      <DonorDonationsClient 
        donations={donations}
        totalDonations={totalDonations}
        livesImpacted={livesImpacted}
      />
    );
  }

  if (session.user.role === "BLOOD_BANK") {
    const bloodBank = await prisma.bloodBankProfile.findUnique({
      where: { userId: session.user.id },
      include: { donationDrives: { orderBy: { date: "asc" } } }
    });

    if (!bloodBank) return null;

    const drives = bloodBank.donationDrives || [];
    
    const totalDrives = drives.length;
    const totalUnits = drives.reduce((sum, drive) => sum + drive.unitsCollected, 0);
    const upcomingDrives = drives.filter(d => d.status === "UPCOMING").length;

    return (
      <DonationsClient 
        drives={drives}
        totalDrives={totalDrives}
        totalUnits={totalUnits}
        upcomingDrives={upcomingDrives}
      />
    );
  }

  // Fallback for other roles or if profile doesn't exist
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500 font-medium">You do not have access to this page.</p>
    </div>
  );
}
