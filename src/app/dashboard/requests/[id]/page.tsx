import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import EditRequestClient from "@/components/EditRequestClient";

export default async function EditRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const request = await prisma.bloodRequest.findUnique({
    where: { id: resolvedParams.id },
    include: {
      acceptedBy: {
        select: {
          name: true,
          phone: true,
          email: true,
          donorProfile: true
        }
      }
    }
  });

  if (!request) {
    notFound();
  }

  // Ensure only the creator can view/edit their request
  if (request.creatorId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <EditRequestClient request={request} />
    </div>
  );
}
