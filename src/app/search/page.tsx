import { prisma } from "@/lib/prisma";
import SearchTabsClient from "@/components/SearchTabsClient";
import { auth } from "@/auth";

export default async function SearchPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // Fetch real donors from the database
  const donors = await prisma.user.findMany({
    where: { role: "DONOR" },
    include: { donorProfile: true },
    orderBy: { createdAt: "desc" }
  });

  // Fetch blood banks from the database
  const bloodBanks = await prisma.bloodBankProfile.findMany({
    include: { 
      user: true,
      inventory: true 
    },
    orderBy: { createdAt: "desc" }
  });

  // Fetch which donors the current user has unlocked
  let unlockedDonorIds: string[] = [];
  if (userId) {
    const unlocks = await prisma.contactUnlock.findMany({
      where: { userId: userId },
      select: { donorId: true } // This is the DonorProfile.id
    });
    
    const unlockedProfileIds = unlocks.map(u => u.donorId);
    
    // Map the unlocked DonorProfile IDs back to the main User IDs
    unlockedDonorIds = donors
      .filter(d => d.donorProfile && unlockedProfileIds.includes(d.donorProfile.id))
      .map(d => d.id);
  }

  return (
    <SearchTabsClient 
      initialDonors={donors} 
      unlockedDonorIds={unlockedDonorIds} 
      bloodBanks={bloodBanks} 
    />
  );
}
