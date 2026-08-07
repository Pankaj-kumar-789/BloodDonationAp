"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function unlockContactAction(donorUserId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be logged in to unlock contacts." };
    }

    const userId = session.user.id;

    // You cannot unlock yourself
    if (userId === donorUserId) {
      return { error: "You cannot unlock your own contact details." };
    }

    // 1. Ensure the target donor actually has a DonorProfile 
    // (If they just registered and haven't filled it out, create a blank one so we can link the unlock)
    let profile = await prisma.donorProfile.findUnique({
      where: { userId: donorUserId }
    });

    if (!profile) {
      profile = await prisma.donorProfile.create({
        data: {
          userId: donorUserId,
          bloodGroup: "O_POS",
          city: "Unknown",
          state: "Unknown",
        }
      });
    }

    // 2. Check if already unlocked
    const existingUnlock = await prisma.contactUnlock.findUnique({
      where: {
        userId_donorId: {
          userId: userId,
          donorId: profile.id,
        }
      }
    });

    if (existingUnlock) {
      return { success: true, message: "Contact already unlocked." };
    }

    // 3. Process Mock Payment & Save Unlock Record
    // We use a database transaction to ensure both happen or neither happens
    await prisma.$transaction([
      // Create the payment record
      prisma.transaction.create({
        data: {
          userId: userId,
          amount: 20.0,
          currency: "INR",
          status: "COMPLETED",
          type: "CONTACT_UNLOCK",
        }
      }),
      // Create the unlock record
      prisma.contactUnlock.create({
        data: {
          userId: userId,
          donorId: profile.id,
        }
      })
    ]);

    // 4. Ensure a ChatRoom exists between these two users
    let room = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          { users: { some: { id: userId } } },
          { users: { some: { id: donorUserId } } }
        ]
      }
    });

    if (!room) {
      await prisma.chatRoom.create({
        data: {
          users: {
            connect: [{ id: userId }, { id: donorUserId }]
          }
        }
      });
    }

    revalidatePath("/search");
    revalidatePath("/dashboard/history");
    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/messages");
    
    return { success: true };
  } catch (error: any) {
    console.error("Unlock error:", error);
    return { error: "Failed to process payment and unlock contact." };
  }
}

export async function unlockDonorContactAction(requestId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const request = await prisma.bloodRequest.findUnique({ where: { id: requestId } });
    
    if (!request) return { error: "Request not found" };
    if (request.creatorId !== session.user.id) return { error: "Unauthorized" };
    if (request.status !== "ACCEPTED") return { error: "Request has not been accepted by a donor yet" };
    if (request.isContactUnlocked) return { success: true }; // already unlocked

    // Simulate Payment Processing Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update Request to unlock contact
    await prisma.bloodRequest.update({
      where: { id: requestId },
      data: { isContactUnlocked: true }
    });

    // Create a transaction record
    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount: 20.00,
        currency: "INR",
        status: "COMPLETED",
        type: "CONTACT_UNLOCK",
      }
    });

    // Ensure a ChatRoom exists between the requester and the donor
    if (request.acceptedById) {
      let room = await prisma.chatRoom.findFirst({
        where: {
          AND: [
            { users: { some: { id: session.user.id } } },
            { users: { some: { id: request.acceptedById } } }
          ]
        }
      });

      if (!room) {
        await prisma.chatRoom.create({
          data: {
            users: {
              connect: [{ id: session.user.id }, { id: request.acceptedById }]
            }
          }
        });
      }
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/requests/${requestId}`);
    revalidatePath("/dashboard/messages");
    
    return { success: true };
  } catch (error: any) {
    console.error("Payment error:", error);
    return { error: error.message || "Failed to process payment" };
  }
}
