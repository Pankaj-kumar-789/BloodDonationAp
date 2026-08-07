"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateInventoryAction(bloodGroup: string, units: number) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "BLOOD_BANK") {
      return { error: "Unauthorized" };
    }

    // Ensure blood bank profile exists
    const profile = await prisma.bloodBankProfile.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id, city: "", state: "" }
    });

    // Upsert the specific blood group inventory
    await prisma.bloodInventory.upsert({
      where: {
        bloodBankId_bloodGroup: {
          bloodBankId: profile.id,
          bloodGroup: bloodGroup as any,
        }
      },
      update: {
        units: Math.max(0, units)
      },
      create: {
        bloodBankId: profile.id,
        bloodGroup: bloodGroup as any,
        units: Math.max(0, units)
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error: any) {
    console.error("Inventory update error:", error);
    return { error: error.message || "Failed to update inventory" };
  }
}
