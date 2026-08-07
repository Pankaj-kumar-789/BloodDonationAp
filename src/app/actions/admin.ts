"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdminStatsAction() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const totalUsers = await prisma.user.count();
    
    // Total donors registered
    const totalDonors = await prisma.user.count({ where: { role: "DONOR" } }); 
    
    // Verified Blood Banks
    const verifiedBloodBanks = await prisma.bloodBankProfile.count({ where: { isVerified: true } });
    
    // Registered Hospitals
    const registeredHospitals = await prisma.hospitalProfile.count();

    const livesSaved = await prisma.bloodRequest.count({ where: { status: "COMPLETED" } });
    
    const totalUnlocks = await prisma.contactUnlock.count();
    const totalRevenue = totalUnlocks * 20;

    // Combine unverified blood banks and hospitals
    const pendingBanks = await prisma.bloodBankProfile.findMany({
      where: { isVerified: false },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 10
    });
    
    const pendingHospitals = await prisma.hospitalProfile.findMany({
      where: { isVerified: false },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 10
    });

    const pendingVerifications = [
      ...pendingBanks.map(b => ({ ...b, type: 'BLOOD_BANK' })),
      ...pendingHospitals.map(h => ({ ...h, type: 'HOSPITAL' }))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);

    // Chart 1: Blood Group Demographics
    const donorProfiles = await prisma.donorProfile.findMany({
      select: { bloodGroup: true }
    });
    
    const bloodGroupCounts: Record<string, number> = {};
    donorProfiles.forEach(profile => {
      const bg = profile.bloodGroup;
      bloodGroupCounts[bg] = (bloodGroupCounts[bg] || 0) + 1;
    });
    
    const bloodGroupData = Object.entries(bloodGroupCounts).map(([name, value]) => ({
      name: name.replace("_POS", "+").replace("_NEG", "-"),
      value
    }));

    // Chart 2: User Growth (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentUsers = await prisma.user.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, role: true }
    });

    // Initialize the last 7 days with 0 counts
    const growthDataMap: Record<string, { date: string, donors: number, banks: number, hospitals: number }> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      growthDataMap[dateStr] = { date: dateStr, donors: 0, banks: 0, hospitals: 0 };
    }

    recentUsers.forEach(u => {
      const dateStr = u.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (growthDataMap[dateStr]) {
        if (u.role === 'DONOR') growthDataMap[dateStr].donors++;
        else if (u.role === 'BLOOD_BANK') growthDataMap[dateStr].banks++;
        else if (u.role === 'HOSPITAL') growthDataMap[dateStr].hospitals++;
      }
    });

    const userGrowthData = Object.values(growthDataMap);

    return {
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        verifiedBloodBanks,
        registeredHospitals,
        livesSaved,
        totalRevenue,
        pendingVerifications,
        bloodGroupData,
        userGrowthData
      }
    };
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return { error: "Failed to load admin statistics" };
  }
}

export async function verifyOrganizationAction(orgId: string, type: 'HOSPITAL' | 'BLOOD_BANK') {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    if (type === 'BLOOD_BANK') {
      await prisma.bloodBankProfile.update({
        where: { id: orgId },
        data: { isVerified: true }
      });
    } else if (type === 'HOSPITAL') {
      await prisma.hospitalProfile.update({
        where: { id: orgId },
        data: { isVerified: true }
      });
    }
    
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Verification error:", error);
    return { error: "Failed to verify organization" };
  }
}
