import { 
  Heart, 
  Calendar, 
  Droplet, 
  Shield, 
  MapPin, 
  ChevronDown
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageTransition from "@/components/PageTransition";
import promoImg from "../../../public/assets/donor_promo.jpg";

export default async function DonorDashboard({ session }: { session: any }) {
  const profile = await prisma.donorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      donationHistory: {
        orderBy: { date: "desc" },
        take: 3
      }
    }
  });

  const city = profile?.city || "";
  
  const localRequests = await prisma.bloodRequest.findMany({
    where: { status: "PENDING", city: city },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  // Calculate stats
  // Wait, the real DB might not have many donations. Let's make sure it defaults gracefully.
  const totalDonations = profile?.donationHistory.length || 0;
  const livesImpacted = totalDonations * 3;
  
  let nextEligibleDateStr = "Eligible Now";
  if (profile?.lastDonation) {
    const nextDate = new Date(profile.lastDonation);
    nextDate.setDate(nextDate.getDate() + 90);
    if (nextDate > new Date()) {
      nextEligibleDateStr = nextDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }

  const bloodGroupStr = profile?.bloodGroup?.replace("_POS", "+").replace("_NEG", "-") || "Not Set";

  // Badges logic
  const hasLifeSaver = totalDonations >= 1;
  const hasRegularDonor = totalDonations >= 3;
  const hasHeroDonor = totalDonations >= 10;
  
  // Upcoming Drive (using DonationDrive as a proxy for Appointments since we don't have Appointments yet)
  const upcomingDrive = await prisma.donationDrive.findFirst({
    where: { city: city, status: "UPCOMING" },
    orderBy: { date: "asc" }
  });

  return (
    <PageTransition className="space-y-6 max-w-7xl mx-auto pb-10 mt-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
        <div>
           <h1 className="text-3xl md:text-[2rem] font-bold text-gray-900 mb-2">Welcome, {session.user.name} <span className="inline-block animate-wave">👋</span></h1>
           <p className="text-gray-500 font-medium text-[15px]">Thank you for being a hero. Every drop counts!</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         {/* Total Donations */}
         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100/50">
               <Droplet className="w-6 h-6 text-primary-red fill-primary-red/10" strokeWidth={2} />
            </div>
            <div>
               <p className="text-[13px] font-bold text-gray-400 mb-1">Total Donations</p>
               <h3 className="text-2xl font-black text-gray-900 leading-none">{totalDonations.toString().padStart(2, '0')}</h3>
            </div>
         </div>
         
         {/* Lives Impacted */}
         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100/50">
               <Heart className="w-6 h-6 text-primary-red fill-primary-red" />
            </div>
            <div>
               <p className="text-[13px] font-bold text-gray-400 mb-1">Lives Impacted</p>
               <h3 className="text-2xl font-black text-gray-900 leading-none">{livesImpacted}+</h3>
            </div>
         </div>
         
         {/* Next Eligible Date */}
         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-full bg-blue-50/50 flex items-center justify-center shrink-0 border border-blue-100/50">
               <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
               <p className="text-[13px] font-bold text-gray-400 mb-1">Next Eligible Date</p>
               <h3 className="text-[20px] font-black text-gray-900 leading-none whitespace-nowrap">{nextEligibleDateStr}</h3>
            </div>
         </div>
         
         {/* Blood Group */}
         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100/50">
               <Droplet className="w-6 h-6 text-primary-red fill-primary-red/10" strokeWidth={2} />
            </div>
            <div>
               <p className="text-[13px] font-bold text-gray-400 mb-1">Blood Group</p>
               <h3 className="text-2xl font-black text-gray-900 leading-none">{bloodGroupStr}</h3>
            </div>
         </div>
      </div>

      {/* Grid Row 1 (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Appointment / Drive */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h3 className="text-[17px] font-bold text-gray-900 mb-6">Upcoming Drive Near You</h3>
          {upcomingDrive ? (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <h4 className="font-bold text-gray-900 text-lg mb-1">{upcomingDrive.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</h4>
                     <p className="text-sm text-gray-500 font-medium truncate max-w-[150px]">{upcomingDrive.location}</p>
                  </div>
                  <div className="text-right">
                     <h4 className="font-bold text-gray-900 text-lg">{upcomingDrive.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h4>
                  </div>
               </div>
               <div className="flex gap-4 mt-8">
                  <Link href={`/dashboard/donations`} className="flex-1 bg-white border border-red-100 text-primary-red text-center font-bold py-3 rounded-2xl hover:bg-red-50 transition-colors text-[13px] shadow-sm">View Details</Link>
               </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-3xl p-6 text-center border border-gray-100 border-dashed h-[180px] flex flex-col items-center justify-center">
              <p className="text-gray-400 font-medium text-sm">No upcoming drives in your city.</p>
            </div>
          )}
        </div>
        
        {/* Donation History */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-[17px] font-bold text-gray-900">Donation History</h3>
             <Link href="/dashboard/history" className="text-gray-300 hover:text-gray-600 transition-colors"><ChevronDown className="w-5 h-5"/></Link>
          </div>
          
          <div className="flex-1 flex flex-col justify-center space-y-5 py-2">
             {profile?.donationHistory && profile.donationHistory.length > 0 ? (
               profile.donationHistory.map((history, idx) => (
                 <div key={history.id}>
                   <div className="flex items-center gap-5">
                      <div className="w-[42px] h-[42px] rounded-2xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100/50">
                         <Droplet className="w-5 h-5 text-primary-red fill-primary-red/10" strokeWidth={2} />
                      </div>
                      <div className="min-w-0 flex-1">
                         <h4 className="font-bold text-gray-900 text-[14px] mb-0.5">{history.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</h4>
                         <p className="text-[12px] font-medium text-gray-500 truncate">{history.hospital}</p>
                      </div>
                   </div>
                   {idx < profile.donationHistory.length - 1 && <hr className="border-gray-50 mt-5" />}
                 </div>
               ))
             ) : (
               <div className="text-center py-4">
                 <p className="text-gray-400 font-medium text-sm">No donations recorded yet.</p>
               </div>
             )}
          </div>
        </div>
        
        {/* My Badges */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h3 className="text-[17px] font-bold text-gray-900 mb-8">My Badges</h3>
          <div className="flex justify-between items-center h-full pb-10 px-2">
             {/* Badge 1 */}
             <div className="flex flex-col items-center">
                <div className={`w-[72px] h-[72px] flex items-center justify-center relative mb-4 transition-all duration-500 ${hasLifeSaver ? '' : 'grayscale opacity-30 blur-[1px]'}`}>
                   <Shield className="w-[60px] h-[60px] text-orange-500 fill-orange-500 absolute drop-shadow-md" strokeWidth={1} />
                   <Shield className="w-[46px] h-[46px] text-[#C62121] fill-[#C62121] absolute z-10" strokeWidth={1} />
                   <Droplet className="w-[20px] h-[20px] text-white fill-white absolute z-20" strokeWidth={1} />
                </div>
                <p className="font-bold text-gray-900 text-[13px] mb-1">Life Saver</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">(1+ Donations)</p>
             </div>
             
             {/* Badge 2 */}
             <div className="flex flex-col items-center">
                <div className={`w-[72px] h-[72px] flex items-center justify-center relative mb-4 transition-all duration-500 ${hasRegularDonor ? '' : 'grayscale opacity-30 blur-[1px]'}`}>
                   <Shield className="w-[60px] h-[60px] text-orange-500 fill-orange-500 absolute drop-shadow-md" strokeWidth={1} />
                   <Shield className="w-[46px] h-[46px] text-[#C62121] fill-[#C62121] absolute z-10" strokeWidth={1} />
                   <Droplet className="w-[20px] h-[20px] text-white fill-white absolute z-20" strokeWidth={1} />
                </div>
                <p className="font-bold text-gray-900 text-[13px] mb-1">Regular Donor</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">(3+ Donations)</p>
             </div>
             
             {/* Badge 3 */}
             <div className="flex flex-col items-center">
                <div className={`w-[72px] h-[72px] flex items-center justify-center relative mb-4 transition-all duration-500 ${hasHeroDonor ? '' : 'grayscale opacity-30 blur-[1px]'}`}>
                   <Shield className="w-[60px] h-[60px] text-orange-500 fill-orange-500 absolute drop-shadow-md" strokeWidth={1} />
                   <Shield className="w-[46px] h-[46px] text-[#C62121] fill-[#C62121] absolute z-10" strokeWidth={1} />
                   <Droplet className="w-[20px] h-[20px] text-white fill-white absolute z-20" strokeWidth={1} />
                </div>
                <p className="font-bold text-gray-900 text-[13px] mb-1">Hero Donor</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">(10+ Donations)</p>
             </div>
          </div>
        </div>
        
      </div>

      {/* Grid Row 2 (2 Columns: Requests 2/3, Promo 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Blood Requests Near You */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-[17px] font-bold text-gray-900">Blood Requests Near You</h3>
             <Link href="/dashboard/requests" className="text-sm font-bold text-primary-red hover:text-red-800">View All</Link>
          </div>
          
          <div className="space-y-2">
             {localRequests.length > 0 ? (
               localRequests.map((req, idx) => (
                 <div key={req.id}>
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100 gap-4">
                      <div className="flex items-center gap-6 min-w-0">
                         <div className="w-[46px] h-[46px] bg-red-50 text-primary-red font-black flex items-center justify-center rounded-2xl text-[17px] shrink-0 border border-red-100/50">
                            {req.bloodGroup.replace("_POS", "+").replace("_NEG", "-")}
                         </div>
                         <div className="w-16 shrink-0">
                            <p className="font-bold text-gray-900 text-[14px]">{req.units} {req.units === 1 ? 'Unit' : 'Units'}</p>
                         </div>
                         <div className="w-56 shrink-0">
                            <p className="font-bold text-gray-900 text-[14px] truncate mb-0.5">{req.patientName}</p>
                            <p className="text-[12px] text-gray-500 font-medium truncate">{req.hospital}</p>
                         </div>
                         <div className="hidden md:flex items-center gap-1.5 text-gray-400 text-[12px] font-bold shrink-0">
                            <MapPin className="w-3.5 h-3.5" /> {req.city}
                         </div>
                      </div>
                      <Link href={`/dashboard/requests`} className="bg-primary-red hover:bg-red-800 text-white font-bold py-2.5 px-8 rounded-xl text-[13px] transition-colors shadow-sm text-center shrink-0">
                         Help Now
                      </Link>
                   </div>
                   {idx < localRequests.length - 1 && <hr className="border-gray-50 mx-4" />}
                 </div>
               ))
             ) : (
               <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 border-dashed">
                  <p className="text-gray-400 font-medium text-sm">No active emergency requests in your area.</p>
               </div>
             )}
          </div>
        </div>
        
        {/* Promotional Box */}
        <div className="bg-red-50/40 rounded-[2rem] p-8 border border-red-100/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col items-center text-center">
          <h3 className="text-[20px] font-black text-gray-900 mb-4 relative z-10 leading-tight">Keep Donating, Keep Inspiring!</h3>
          <p className="text-[14px] font-medium text-gray-600 mb-1 relative z-10 leading-relaxed">Your donation can save up to 3 lives.</p>
          <p className="text-[14px] font-medium text-gray-600 relative z-10 leading-relaxed">Be a reason for someone's heartbeat.</p>
          
          <div className="mt-8 relative z-10 mix-blend-multiply w-[200px] h-[180px]">
             <Image src={promoImg} alt="Keep Donating" fill className="object-contain" priority />
          </div>
        </div>
        
      </div>
    </PageTransition>
  );
}
