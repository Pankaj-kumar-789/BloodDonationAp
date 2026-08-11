import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NotificationsClient from "@/components/NotificationsClient";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return <NotificationsClient initialNotifications={notifications} />;
}
