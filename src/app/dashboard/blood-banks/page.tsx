import { Building2, ArrowLeft, MapPin, Phone, ShieldCheck, Search } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageTransition from "@/components/PageTransition";

export default async function BloodBanksPage() {
  const bloodBanks = await prisma.bloodBankProfile.findMany({
    include: {
      user: {
        select: { name: true, phone: true, image: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <PageTransition className="max-w-6xl mx-auto space-y-6 mt-4 pb-10">
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-[2rem] font-black text-gray-900 mb-2 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#C62121]" />
              Blood Banks
            </h1>
            <p className="text-gray-500 font-medium text-[15px]">Find and contact registered blood banks near you.</p>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by city..." 
              className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red w-full md:w-64 transition-all"
            />
          </div>
        </div>

        {bloodBanks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bloodBanks.map((bank) => (
              <div key={bank.id} className="p-6 border border-gray-100 rounded-3xl hover:border-red-200 hover:shadow-md transition-all group bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100/50 group-hover:bg-primary-red transition-colors">
                      <Building2 className="w-7 h-7 text-primary-red group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        {bank.user.name}
                        {bank.isVerified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                      </h3>
                      <p className="text-[13px] font-medium text-gray-500 mt-0.5">{bank.user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
                      <p className="text-[13px] font-bold text-gray-900">{bank.city}, {bank.state}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact</p>
                      <p className="text-[13px] font-bold text-gray-900">{bank.user.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>
                
                {bank.user.phone && (
                  <a href={`tel:${bank.user.phone}`} className="mt-4 w-full bg-red-50 hover:bg-red-100 text-primary-red font-bold py-3 px-4 rounded-xl text-[14px] transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> Call Blood Bank
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
              <Building2 className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Blood Banks Found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto font-medium leading-relaxed">
              There are currently no blood banks registered on the platform. Please check back later.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
