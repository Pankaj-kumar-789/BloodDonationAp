import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/SettingsForm";

import PageTransition from "@/components/PageTransition";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { 
      donorProfile: true,
      hospitalProfile: true,
      bloodBankProfile: true
    }
  });

  if (!user) redirect("/login");

  const profile = user.donorProfile || user.hospitalProfile || user.bloodBankProfile;

  return (
    <PageTransition className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile, preferences, and account security</p>
      </div>

      <SettingsForm user={user} profile={profile} />
    </PageTransition>
  );
}
