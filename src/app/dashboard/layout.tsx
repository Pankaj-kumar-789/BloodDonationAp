import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex-1 bg-gray-50/50 dark:bg-transparent transition-colors">
      <main className="p-4 pb-12 md:p-8 md:pb-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
