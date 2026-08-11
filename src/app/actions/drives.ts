"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function scheduleDriveAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const bloodBank = await prisma.bloodBankProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!bloodBank) {
      return { error: "Blood Bank profile not found" };
    }

    const name = formData.get("name") as string;
    const dateString = formData.get("date") as string;
    const location = formData.get("location") as string;
    const expectedDonorsStr = formData.get("expectedDonors") as string;

    if (!name || !dateString || !location) {
      return { error: "Missing required fields" };
    }

    const date = new Date(dateString);
    const expectedDonors = expectedDonorsStr ? parseInt(expectedDonorsStr) : null;

    const drive = await prisma.donationDrive.create({
      data: {
        bloodBankId: bloodBank.id,
        name,
        date,
        location,
        city: bloodBank.city,
        expectedDonors,
      }
    });

    revalidatePath("/dashboard/donations");
    return { success: true, drive };
  } catch (error: any) {
    console.error("Error scheduling drive:", error);
    return { error: error.message || "Failed to schedule drive" };
  }
}
