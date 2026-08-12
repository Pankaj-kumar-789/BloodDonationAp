import { auth } from "@/auth";
import UserDashboard from "./UserDashboard";
import DonorDashboard from "./DonorDashboard";
import HospitalDashboard from "./HospitalDashboard";
import BloodBankDashboard from "./BloodBankDashboard";

export default async function DashboardPage() {
  const session = await auth();
  const role = session?.user?.role;
  
  if (role === "ADMIN") {
    const { redirect } = await import("next/navigation");
    redirect("/dashboard/admin");
  }
  
  if (role === "DONOR") return <DonorDashboard session={session} />;
  if (role === "HOSPITAL") return <HospitalDashboard session={session} />;
  if (role === "BLOOD_BANK") return <BloodBankDashboard session={session} />;
  
  return <UserDashboard session={session} />;
}
