import { Activity, Clock, Search, MapPin } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import PageTransition from "@/components/PageTransition";

export default async function UserDashboard({ session }: { session: any }) {
  // Fetch user's active requests and unlocked contacts
  const unlockedCount = await prisma.contactUnlock.count({
    where: { userId: session.user.id }
  });

  const activeRequests = await prisma.bloodRequest.findMany({
    where: { creatorId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {session.user.name}</h1>
          <p className="text-gray-500">Here is your quick overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-50 text-primary-red rounded-full flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Find Help</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Search Donors</h3>
            <p className="text-sm text-gray-500 mb-4">Find available blood donors nearby and securely unlock their contact details.</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">{unlockedCount} Donors Unlocked</span>
              <Link href="/search" className="text-primary-red font-medium text-sm hover:underline flex items-center gap-1">
                Search Now &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Urgent Needs</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Emergency Request</h3>
            <p className="text-sm text-gray-500 mb-4">Broadcast an emergency blood requirement directly to hospitals and donors.</p>
            <Link href="/emergency" className="text-primary-red font-medium text-sm hover:underline flex items-center gap-1">
              Create Request &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">My Recent Requests</h2>
      {activeRequests.length > 0 ? (
        <div className="space-y-4">
          {activeRequests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex justify-between items-center shadow-sm">
              <div>
                <h4 className="font-bold text-gray-900">{req.bloodGroup} Blood Required</h4>
                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {req.hospital}, {req.city}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
                {req.status}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active requests</h3>
          <p className="text-gray-500 max-w-sm mx-auto">You haven't made any emergency blood requests recently.</p>
        </div>
      )}
    </PageTransition>
  );
}
