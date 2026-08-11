import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Search, MapPin, Phone, Mail, ShieldCheck, Heart } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DonorManagementPage() {
  const session = await auth();
  
  if (session?.user?.role !== "BLOOD_BANK" && session?.user?.role !== "HOSPITAL") {
    redirect("/dashboard");
  }

  const isHospital = session.user.role === "HOSPITAL";

  let displayDonors: any[] = [];

  if (isHospital) {
    // For Hospitals, show donors who recently accepted their requests
    const recentRequests = await prisma.bloodRequest.findMany({
      where: {
        creatorId: session.user.id,
        acceptedById: { not: null }
      },
      include: {
        acceptedBy: {
          include: {
            donorProfile: true
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    // Extract unique donors from requests
    const uniqueDonorsMap = new Map();
    recentRequests.forEach(req => {
      if (req.acceptedBy && req.acceptedBy.donorProfile) {
        if (!uniqueDonorsMap.has(req.acceptedBy.id)) {
          uniqueDonorsMap.set(req.acceptedBy.id, {
            user: req.acceptedBy,
            profile: req.acceptedBy.donorProfile
          });
        }
      }
    });
    displayDonors = Array.from(uniqueDonorsMap.values());
  } else {
    // For Blood Banks, show unlocked donors
    const unlocks = await prisma.contactUnlock.findMany({
      where: { userId: session.user.id },
      include: {
        donor: {
          include: {
            user: true
          }
        }
      },
      orderBy: { unlockedAt: "desc" }
    });
    
    displayDonors = unlocks.map(u => ({
      user: u.donor.user,
      profile: u.donor
    }));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              {isHospital ? "Hospital Donors" : "Donor Management"}
            </h1>
            <p className="text-gray-500 max-w-lg">
              {isHospital 
                ? "View and contact donors who have accepted blood requests from your hospital." 
                : "Manage and contact your registered and unlocked donors."}
            </p>
          </div>
          <Link href="/search" className="bg-[#C62121] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2">
            <Search className="w-4 h-4" /> Find New Donors
          </Link>
        </div>

        {displayDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayDonors.map(({ user, profile }) => {
              const bloodGroup = profile?.bloodGroup?.replace("_POS", "+").replace("_NEG", "-") || "-";
              
              return (
                <div key={user.id} className="p-6 border border-gray-100 rounded-2xl hover:border-red-100 hover:shadow-md transition-all group bg-gray-50/50 hover:bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#C62121] font-black text-xl border border-red-100 group-hover:bg-[#C62121] group-hover:text-white transition-colors">
                          {bloodGroup}
                        </div>
                        {profile?.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-white">
                            <ShieldCheck className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                        <p className="text-gray-500 text-sm font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {profile?.city || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${profile?.isAvailable ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-500'}`}>
                      {profile?.isAvailable ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-50 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" /> {user.phone || "No phone"}
                      </div>
                      {user.phone && <a href={`tel:${user.phone}`} className="text-[12px] font-bold text-[#C62121] hover:underline uppercase tracking-wide">Call</a>}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-50 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700 truncate max-w-[200px]">
                        <Mail className="w-4 h-4 text-gray-400" /> {user.email}
                      </div>
                      <a href={`mailto:${user.email}`} className="text-[12px] font-bold text-[#C62121] hover:underline uppercase tracking-wide">Email</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
            {isHospital ? (
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            ) : (
              <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isHospital ? "No Donors Found" : "No Donors Managed Yet"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {isHospital 
                ? "No donors have accepted requests from your hospital yet."
                : "You haven't unlocked any donor contacts yet. Search the registry to find and connect with available donors in your area."}
            </p>
            <Link href="/search" className="bg-white text-gray-900 font-bold px-6 py-3 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors inline-block">
              Go to Search
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
