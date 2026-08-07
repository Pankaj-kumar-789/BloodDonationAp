"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { BloodGroup } from "@prisma/client";

export async function updateProfileAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const image = formData.get("image") as File | null;
    
    let imageUrl = undefined;

    // Handle image upload locally
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      const uniqueName = `${session.user.id}-${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      const filePath = path.join(uploadsDir, uniqueName);
      
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${uniqueName}`;
    }

    // Update core User details
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(imageUrl && { image: imageUrl }),
      }
    });

    // If user is a DONOR, upsert their specific Donor Profile
    if (session.user.role === "DONOR") {
      const bloodGroup = formData.get("bloodGroup") as BloodGroup;
      const city = formData.get("city") as string;
      const state = formData.get("state") as string;
      
      const isAvailableRaw = formData.get("isAvailable");
      const isAvailable = isAvailableRaw === "on" || isAvailableRaw === "true";
      
      const contactFeeRaw = formData.get("contactFee");
      const contactFee = contactFeeRaw ? parseFloat(contactFeeRaw.toString()) : undefined;

      if (bloodGroup || city || state || isAvailableRaw !== null || contactFee !== undefined) {
        await prisma.donorProfile.upsert({
          where: { userId: session.user.id },
          update: {
            ...(bloodGroup && { bloodGroup }),
            ...(city && { city }),
            ...(state && { state }),
            ...(isAvailableRaw !== null && { isAvailable }),
            ...(contactFee !== undefined && !isNaN(contactFee) && { contactFee })
          },
          create: {
            userId: session.user.id,
            bloodGroup: bloodGroup || "O_POS",
            city: city || "",
            state: state || "",
            isAvailable: isAvailableRaw !== null ? isAvailable : true,
            contactFee: contactFee !== undefined && !isNaN(contactFee) ? contactFee : 0,
          }
        });
      }
    }

    if (session.user.role === "HOSPITAL") {
      const city = formData.get("city") as string;
      const state = formData.get("state") as string;
      if (city || state) {
        await prisma.hospitalProfile.upsert({
          where: { userId: session.user.id },
          update: { ...(city && { city }), ...(state && { state }) },
          create: { userId: session.user.id, city: city || "", state: state || "" }
        });
      }
    }

    if (session.user.role === "BLOOD_BANK") {
      const city = formData.get("city") as string;
      const state = formData.get("state") as string;
      if (city || state) {
        await prisma.bloodBankProfile.upsert({
          where: { userId: session.user.id },
          update: { ...(city && { city }), ...(state && { state }) },
          create: { userId: session.user.id, city: city || "", state: state || "" }
        });
      }
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Profile update error:", error);
    return { error: error.message || "Failed to update profile" };
  }
}

export async function toggleAvailabilityAction(isAvailable: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await prisma.donorProfile.update({
      where: { userId: session.user.id },
      data: { isAvailable }
    });

    revalidatePath("/dashboard");
    revalidatePath("/search");
    return { success: true };
  } catch (error: any) {
    console.error("Availability toggle error:", error);
    return { error: error.message || "Failed to toggle availability" };
  }
}
