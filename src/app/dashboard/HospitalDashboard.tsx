import { Activity, Search, Clock, MapPin, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import PageTransition from "@/components/PageTransition";
import HospitalActiveRequests from "@/components/HospitalActiveRequests";
export default async function HospitalDashboard({ session }: { session: any }) {
  // Fetch hospital profile
  const profile = await prisma.hospitalProfile.findUnique({
    where: { userId: session.user.id }
  });

  // Fetch active requests made by this hospital
  const activeRequests = await prisma.bloodRequest.findMany({
    where: { creatorId: session.user.id },
    include: {
      acceptedBy: {
        include: {
          donorProfile: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{session.user.name} Dashboard</h1>
          <p className="text-gray-500">Manage patient blood requests and find local donors.</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {profile?.isVerified ? (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Verified Hospital
            </span>
          ) : (
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
              Pending Verification
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-50 text-primary-red rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Emergency</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Broadcast Request</h3>
            <p className="text-sm text-gray-500 mb-4">Create an urgent blood request that will instantly notify donors in your area.</p>
            <Link href="/emergency" className="text-primary-red font-medium text-sm hover:underline flex items-center gap-1">
              Create Request &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Database</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Donor Directory</h3>
            <p className="text-sm text-gray-500 mb-4">Search our verified database of local blood donors for specific blood types.</p>
            <Link href="/search" className="text-blue-500 font-medium text-sm hover:underline flex items-center gap-1">
              Search Donors &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-xl font-bold text-gray-900">Active Patient Requests</h2>
        <Link href="/dashboard/history" className="text-sm font-medium text-gray-500 hover:text-gray-900">View All</Link>
      </div>
      
      <HospitalActiveRequests activeRequests={activeRequests} />
    </PageTransition>
  );
}
