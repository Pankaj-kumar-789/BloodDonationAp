"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(
  userId: string,
  role: string,
  formData: FormData
) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    // 1. Update basic user details
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone: phone || null,
      },
    });

    // 2. Update Role-specific profile details
    if (role === "DONOR") {
      const bloodGroup = formData.get("bloodGroup") as string;
      const city = formData.get("city") as string;
      const state = formData.get("state") as string;
      const isAvailableStr = formData.get("isAvailable") as string;
      const isAvailable = isAvailableStr === "true";

      const updateData: any = { isAvailable };
      if (bloodGroup) updateData.bloodGroup = bloodGroup;
      if (city) updateData.city = city;
      if (state) updateData.state = state;

      // Ensure we have defaults if we are creating
      const createData: any = {
        userId,
        bloodGroup: bloodGroup || "A_POS", // fallback
        city: city || "Unknown",
        state: state || "Unknown",
        isAvailable,
      };

      await prisma.donorProfile.upsert({
        where: { userId },
        update: updateData,
        create: createData,
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    
    return { success: true, message: "Profile updated successfully." };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { success: false, message: error.message || "Failed to update profile." };
  }
}
