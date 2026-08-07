import { getAdminStatsAction } from "@/app/actions/admin";
import AdminDashboardClient from "@/components/AdminDashboardClient";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const statsRes = await getAdminStatsAction();

  if (statsRes.error || !statsRes.stats) {
    // If unauthorized or error, redirect to main dashboard
    redirect("/dashboard");
  }

  return <AdminDashboardClient stats={statsRes.stats} />;
}
