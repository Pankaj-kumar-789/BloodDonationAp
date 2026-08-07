"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAllAsReadAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true }
    });

    revalidatePath("/dashboard/notifications");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getUnreadNotificationCountAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) return 0;

    const count = await prisma.notification.count({
      where: { userId: session.user.id, isRead: false }
    });
    return count;
  } catch (error) {
    return 0;
  }
}

export async function toggleNotificationReadStatusAction(id: string, isRead: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await prisma.notification.update({
      where: { id, userId: session.user.id },
      data: { isRead }
    });

    revalidatePath("/dashboard/notifications");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getRecentNotificationsAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5
    });
    return notifications;
  } catch (error) {
    return [];
  }
}
