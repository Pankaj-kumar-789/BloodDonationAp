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

    revalidatePath("/dashboard/requests");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating request status:", error);
    return { error: error.message || "Failed to update request" };
  }
}
