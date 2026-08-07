"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getChatRoomsAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const rooms = await prisma.chatRoom.findMany({
      where: {
        users: { some: { id: session.user.id } }
      },
      include: {
        users: {
          where: { id: { not: session.user.id } },
          select: { id: true, name: true, image: true, role: true }
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return { success: true, rooms };
  } catch (error: any) {
    console.error("Failed to fetch chat rooms:", error);
    return { error: "Failed to fetch chat rooms" };
  }
}

export async function getMessagesAction(roomId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    // Verify user is in this room
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        users: { some: { id: session.user.id } }
      }
    });

    if (!room) return { error: "Unauthorized or room not found" };

    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, name: true } }
      }
    });

    return { success: true, messages };
  } catch (error: any) {
    console.error("Failed to fetch messages:", error);
    return { error: "Failed to fetch messages" };
  }
}

export async function sendMessageAction(roomId: string, content: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };
    if (!content.trim()) return { error: "Message cannot be empty" };

    // Verify user is in this room
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        users: { some: { id: session.user.id } }
      }
    });

    if (!room) return { error: "Unauthorized or room not found" };

    const message = await prisma.message.create({
      data: {
        roomId,
        senderId: session.user.id,
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, name: true } }
      }
    });

    // Update the room's updatedAt timestamp
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() }
    });

    return { success: true, message };
  } catch (error: any) {
    console.error("Failed to send message:", error);
    return { error: "Failed to send message" };
  }
}

export async function markMessagesReadAction(roomId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await prisma.message.updateMany({
      where: {
        roomId,
        senderId: { not: session.user.id },
        isRead: false
      },
      data: { isRead: true }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to mark messages as read:", error);
    return { error: "Failed to mark messages as read" };
  }
}

export async function getOrCreateChatRoomAction(targetUserId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };
    if (session.user.id === targetUserId) return { error: "Cannot chat with yourself" };

    // Check if room already exists with both users
    let room = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          { users: { some: { id: session.user.id } } },
          { users: { some: { id: targetUserId } } }
        ]
      }
    });

    if (!room) {
      room = await prisma.chatRoom.create({
        data: {
          users: {
            connect: [{ id: session.user.id }, { id: targetUserId }]
          }
        }
      });
    }

    return { success: true, roomId: room.id };
  } catch (error: any) {
    console.error("Failed to create chat room:", error);
    return { error: "Failed to create chat room" };
  }
}
