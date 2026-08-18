"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { RequestStatus } from "@prisma/client";

export async function updateRequestStatusAction(requestId: string, status: RequestStatus) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const request = await prisma.bloodRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      return { error: "Request not found" };
    }

    await prisma.bloodRequest.update({
      where: { id: requestId },
      data: { 
        status,
        ...(status === "ACCEPTED" ? { acceptedById: session.user.id } : {})
      }
    });

    if (status === "ACCEPTED") {
      // Notify the User who created the request
      await prisma.notification.create({
        data: {
          userId: request.creatorId,
          title: "A Donor is ready!",
          body: `${session.user?.name || "A donor"} has accepted your emergency request for ${request.patientName}. Pay ₹20 to view their contact details.`,
          link: `/dashboard/requests/${request.id}`
        }
      });
    }

    revalidatePath("/dashboard/requests");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating request status:", error);
    return { error: error.message || "Failed to update request" };
  }
}
