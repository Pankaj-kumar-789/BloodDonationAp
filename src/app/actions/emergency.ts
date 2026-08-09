"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DonationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createEmergencyRequestAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const patientName = formData.get("patientName") as string;
    const bloodGroupRaw = formData.get("bloodGroup") as string;
    const donationType = (formData.get("donationType") as DonationType) || "BLOOD";
    const units = parseInt(formData.get("units") as string, 10);
    const requiredBefore = new Date(formData.get("requiredBefore") as string);
    const hospitalCity = formData.get("hospitalCity") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const description = formData.get("description") as string;

    // Convert 'A+' to 'A_POS'
    const bgMap: Record<string, any> = {
      "A+": "A_POS", "A-": "A_NEG",
      "B+": "B_POS", "B-": "B_NEG",
      "AB+": "AB_POS", "AB-": "AB_NEG",
      "O+": "O_POS", "O-": "O_NEG"
    };
    
    const bloodGroup = bgMap[bloodGroupRaw];
    if (!bloodGroup) return { error: "Invalid blood group" };
    
    // Parse hospital and city (e.g. "Apollo Hospital, Delhi")
    let hospital = hospitalCity;
    let city = "";
    if (hospitalCity.includes(",")) {
      const parts = hospitalCity.split(",");
      hospital = parts[0].trim();
      city = parts.slice(1).join(",").trim();
    }

    // Fallback: If no city was provided in the comma-separated format, fetch it from their profile
    if (!city) {
      if (session.user.role === "HOSPITAL") {
        const profile = await prisma.hospitalProfile.findUnique({ where: { userId: session.user.id } });
        city = profile?.city || "";
      } else if (session.user.role === "DONOR") {
        const profile = await prisma.donorProfile.findUnique({ where: { userId: session.user.id } });
        city = profile?.city || "";
      } else if (session.user.role === "BLOOD_BANK") {
        const profile = await prisma.bloodBankProfile.findUnique({ where: { userId: session.user.id } });
        city = profile?.city || "";
      }
    }

    // Ensure we have a valid city string even if profiles fail
    city = city || "Unknown";

    const request = await prisma.bloodRequest.create({
      data: {
        patientName,
        bloodGroup,
        units,
        requiredBefore,
        hospital,
        city,
        contactNumber,
        description,
        donationType,
        creatorId: session.user.id,
        status: "PENDING"
      }
    });

    // Broadcast notification to all local donors
    const localDonors = await prisma.donorProfile.findMany({
      where: { city: { equals: city, mode: "insensitive" }, isAvailable: true },
      select: { userId: true }
    });

    if (localDonors.length > 0) {
      await prisma.notification.createMany({
        data: localDonors.map(d => ({
          userId: d.userId,
          title: "Urgent Request Nearby!",
          body: `A patient at ${hospital} urgently needs ${bloodGroup.replace('_POS', '+').replace('_NEG', '-')} ${donationType.toLowerCase()}. Can you help?`,
          link: "/emergency"
        }))
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/requests");
    return { success: true };
  } catch (error: any) {
    console.error("Emergency request error:", error);
    return { error: error.message || "Failed to create emergency request" };
  }
}

export async function acceptEmergencyRequestAction(requestId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const request = await prisma.bloodRequest.findUnique({ where: { id: requestId } });
    if (!request) return { error: "Request not found" };
    if (request.status !== "PENDING") return { error: "Request is no longer available" };

    await prisma.bloodRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED", acceptedById: session.user.id }
    });

    // Notify the Hospital/User who created the request
    await prisma.notification.create({
      data: {
        userId: request.creatorId,
        title: "A Donor is ready!",
        body: `${session.user.name} has accepted your emergency request for ${request.patientName}. Pay ₹20 to view their contact details.`,
        link: `/dashboard/requests/${request.id}`
      }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to accept request" };
  }
}

export async function updateEmergencyRequestAction(id: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const patientName = formData.get("patientName") as string;
    const bloodGroupRaw = formData.get("bloodGroup") as string;
    const donationType = formData.get("donationType") as DonationType;
    const units = parseInt(formData.get("units") as string, 10);
    const requiredBefore = new Date(formData.get("requiredBefore") as string);
    const hospitalCity = formData.get("hospitalCity") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as any;

    const bgMap: Record<string, any> = {
      "A+": "A_POS", "A-": "A_NEG",
      "B+": "B_POS", "B-": "B_NEG",
      "AB+": "AB_POS", "AB-": "AB_NEG",
      "O+": "O_POS", "O-": "O_NEG"
    };
    const bloodGroup = bgMap[bloodGroupRaw] || bloodGroupRaw;

    let hospital = hospitalCity;
    let city = "";
    if (hospitalCity.includes(",")) {
      const parts = hospitalCity.split(",");
      hospital = parts[0].trim();
      city = parts.slice(1).join(",").trim();
    }

    const existing = await prisma.bloodRequest.findUnique({ where: { id } });
    if (!existing || existing.creatorId !== session.user.id) {
      return { error: "Unauthorized or not found" };
    }

    await prisma.bloodRequest.update({
      where: { id },
      data: {
        ...(patientName && { patientName }),
        ...(bloodGroup && { bloodGroup }),
        ...(units && !isNaN(units) && { units }),
        ...(requiredBefore && { requiredBefore }),
        ...(hospital && { hospital }),
        ...(city && { city }),
        ...(contactNumber && { contactNumber }),
        ...(description !== undefined && { description }),
        ...(donationType && { donationType }),
        ...(status && { status }),
      }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/requests/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Emergency request update error:", error);
    return { error: error.message || "Failed to update request" };
  }
}

export async function deleteEmergencyRequestAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const existing = await prisma.bloodRequest.findUnique({ where: { id } });
    if (!existing || existing.creatorId !== session.user.id) {
      return { error: "Unauthorized or not found" };
    }

    await prisma.bloodRequest.delete({ where: { id } });
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error: any) {
    console.error("Delete request error:", error);
    return { error: "Failed to delete request" };
  }
}

export async function completeEmergencyRequestAction(requestId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const request = await prisma.bloodRequest.findUnique({
      where: { id: requestId },
      include: {
        acceptedBy: {
          include: { donorProfile: true }
        }
      }
    });

    if (!request) return { error: "Request not found" };
    if (request.creatorId !== session.user.id) return { error: "Unauthorized" };
    if (request.status === "COMPLETED") return { success: true }; // Already completed

    // Update the request status
    await prisma.bloodRequest.update({
      where: { id: requestId },
      data: { status: "COMPLETED" }
    });

    // If it was accepted by a donor, log it in their DonationHistory
    const donorProfile = request.acceptedBy?.donorProfile;
    if (donorProfile) {
      await prisma.donationHistory.create({
        data: {
          donorId: donorProfile.id,
          date: new Date(),
          hospital: request.hospital || "Unknown",
          units: request.units || 1,
          donationType: request.donationType,
        }
      });
      
      // Update donor's lastDonation date
      await prisma.donorProfile.update({
        where: { id: donorProfile.id },
        data: { lastDonation: new Date() }
      });
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/requests/${requestId}`);

    return { success: true, donorUserId: request.acceptedBy?.id };
  } catch (error: any) {
    console.error("Complete request error:", error);
    return { error: "Failed to mark request as completed" };
  }
}
