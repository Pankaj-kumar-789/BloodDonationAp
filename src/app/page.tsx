import Image from "next/image";
import Link from "next/link";
import { 
  Droplet, 
  Heart, 
  ShieldCheck, 
  Users, 
  Clock, 
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Shield
} from "lucide-react";
import logo from "@/assets/logo.png";

// Import images directly to prevent 404s on dev server without restart
import heroImg from "../../public/assets/new_hero_illustration.jpg";
import story1 from "../../public/assets/success_story_1.jpg";
import story2 from "../../public/assets/success_story_2.jpg";
import story3 from "../../public/assets/success_story_3.jpg";
import founderImg from "../../public/founder.jpg";
import pmImg from "../../public/pm.jpg";
import teamleadImg from "../../public/teamlead.jpg";

import { prisma } from "@/lib/prisma";
import TeamSlider from "@/components/TeamSlider";

export default async function Home() {
  // Fetch real statistics from the database
  const [donorCount, totalRequests, bloodBankCount, completedRequests] = await Promise.all([
    prisma.donorProfile.count({ where: { isAvailable: true } }).catch(() => 0),
    prisma.bloodRequest.count().catch(() => 0),
    prisma.bloodBankProfile.count().catch(() => 0),
    prisma.bloodRequest.count({ where: { status: { in: ["COMPLETED", "ACCEPTED"] } } }).catch(() => 0)
  ]);

  // Optionally multiply completed requests by 3 for "Lives Saved", but let's just use the exact number for now or a small multiplier.
  const livesSaved = completedRequests * 3;

  return (
    <div className="flex flex-col bg-background min-h-screen font-sans transition-colors">
      
      {/* 1. Hero Section */}
      <section className="relative w-full overflow-hidden pt-16 lg:pt-28 pb-32">
        {/* Background Swoosh */}
        <div className="absolute bottom-0 left-0 w-full h-[300px] pointer-events-none z-0">
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full preserve-3d" preserveAspectRatio="none">
            <path fill="#fef2f2" fillOpacity="1" d="M0,256L48,229.3C96,203,192,149,288,144C384,139,480,181,576,197.3C672,213,768,203,864,176C960,149,1056,107,1152,106.7C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path fill="#C62121" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,234.7C672,235,768,213,864,197.3C960,181,1056,171,1152,181.3C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            
            {/* Left Content */}
            <div className="w-full lg:w-[45%] text-center lg:text-left pt-10">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
                Give Blood, <br />
                <span className="text-[#C62121] dark:text-red-500">Give Life</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                Your one donation can bring a smile to someone's face and hope to their life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16">
                <Link 
                  href="/register" 
                  className="bg-[#C62121] text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-red-800 shadow-[0_8px_20px_rgb(198,33,33,0.3)] hover:-translate-y-0.5"
                >
                  <Droplet className="w-5 h-5 fill-current" />
                  Donate Blood
                </Link>
                <Link 
                  href="/emergency" 
                  className="bg-white text-gray-900 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-gray-50 shadow-sm border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5"
                >
                  <Heart className="w-5 h-5 text-[#C62121]" />
                  Request Blood
                </Link>
              </div>

              {/* Four Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/50 flex items-center justify-center mb-3">
                    <Droplet className="w-6 h-6 fill-[#C62121] text-[#C62121]" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm whitespace-nowrap">Save Lives</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Every drop counts</p>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/50 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-6 h-6 text-[#C62121]" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm whitespace-nowrap">Safe & Secure</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">100% safe process</p>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/50 flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 fill-[#C62121] text-[#C62121]" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm whitespace-nowrap">Verified Donors</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Trusted & verified</p>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/50 flex items-center justify-center mb-3">
                    <Heart className="w-6 h-6 fill-[#C62121] text-[#C62121]" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm whitespace-nowrap">Be a Hero</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Make a difference</p>
                </div>
              </div>
            </div>

            {/* Right Content / Illustration */}
            <div className="w-full lg:w-[55%] relative flex justify-center mt-10 lg:mt-0">
              
              <div className="relative w-full max-w-[800px] h-[500px]">
                {/* Floating Badges */}
                <div className="absolute top-10 left-10 z-20 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center gap-3 animate-[float_4s_ease-in-out_infinite]">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#C62121] flex items-center justify-center"><Users className="w-5 h-5 fill-current" /></div>
                  <div><p className="font-black text-gray-900 dark:text-white text-sm leading-tight">Donors</p><p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">Be the reason someone lives</p></div>
                </div>

                <div className="absolute top-10 right-10 z-20 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center gap-3 animate-[float_5s_ease-in-out_infinite_reverse]">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#C62121] flex items-center justify-center"><Users className="w-5 h-5 fill-current" /></div>
                  <div><p className="font-black text-gray-900 dark:text-white text-sm leading-tight">Users</p><p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">We connect. You heal.</p></div>
                </div>

                <div className="absolute bottom-20 left-0 z-20 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center gap-3 animate-[float_4.5s_ease-in-out_infinite]">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#C62121] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                  </div>
                  <div><p className="font-black text-gray-900 dark:text-white text-sm leading-tight">Blood Banks</p><p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">We store hope, We deliver life</p></div>
                </div>

                <div className="absolute bottom-20 right-0 z-20 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center gap-3 animate-[float_5.5s_ease-in-out_infinite_reverse]">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#C62121] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                  </div>
                  <div><p className="font-black text-gray-900 dark:text-white text-sm leading-tight">Hospitals</p><p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">Timely care saves lives</p></div>
                </div>
                
                {/* Main Hero Image */}
                <Image 
                  src={heroImg} 
                  alt="Give Blood Illustration" 
                  fill
                  className="object-contain mix-blend-multiply z-10"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Stats Floating Bar */}
      <section className="relative z-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-16">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-red-50 dark:border-slate-800 flex flex-wrap justify-around items-center gap-6">
          
          {/* Stat 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-4 min-w-[150px]">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center shadow-inner">
              <Users className="w-7 h-7 text-[#C62121] fill-current" />
            </div>
            <div className="text-center lg:text-left">
              <h3 className="font-black text-gray-900 dark:text-white text-3xl leading-none">{donorCount}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-[13px] font-bold mt-1">Donors</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-16 bg-gray-100 dark:bg-slate-800"></div>

          {/* Stat 2 */}
          <div className="flex flex-col lg:flex-row items-center gap-4 min-w-[150px]">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center shadow-inner">
              <Heart className="w-7 h-7 text-[#C62121] fill-current" />
            </div>
            <div className="text-center lg:text-left">
              <h3 className="font-black text-gray-900 dark:text-white text-3xl leading-none">{livesSaved}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-[13px] font-bold mt-1">Lives Saved</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-16 bg-gray-100 dark:bg-slate-800"></div>

          {/* Stat 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-4 min-w-[150px]">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-7 h-7 text-[#C62121]" strokeWidth={2.5} />
            </div>
            <div className="text-center lg:text-left">
              <h3 className="font-black text-gray-900 dark:text-white text-3xl leading-none">{bloodBankCount}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-[13px] font-bold mt-1">Blood Banks</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-16 bg-gray-100 dark:bg-slate-800"></div>

          {/* Stat 4 */}
          <div className="flex flex-col lg:flex-row items-center gap-4 min-w-[150px]">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center shadow-inner">
              <Droplet className="w-7 h-7 text-[#C62121] fill-current" />
            </div>
            <div className="text-center lg:text-left">
              <h3 className="font-black text-gray-900 dark:text-white text-3xl leading-none">{totalRequests}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-[13px] font-bold mt-1">Blood Requests</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. How It Works */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-10 border border-gray-100 dark:border-slate-800 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
              {/* Step 1 */}
              <div className="flex items-start gap-4 relative z-10 bg-transparent transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#C62121] text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Register</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-[150px]">Create your account in seconds</p>
                </div>
                <div className="hidden lg:block absolute top-4 -right-4 text-[#C62121]/30">
                  <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 relative z-10 bg-transparent transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#C62121] text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Search</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-[150px]">Find donors or make a request</p>
                </div>
                <div className="hidden lg:block absolute top-4 -right-4 text-[#C62121]/30">
                  <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 relative z-10 bg-transparent transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#C62121] text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Connect</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-[150px]">Get connected with verified donors</p>
                </div>
                <div className="hidden lg:block absolute top-4 -right-4 text-[#C62121]/30">
                  <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4 relative z-10 bg-transparent transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#C62121] text-white flex items-center justify-center font-bold text-sm shrink-0">4</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Save Lives</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-[150px]">Your help can make a big difference</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Bottom Grid (Stories, Stats, Mission) */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Success Stories (Left - spans 2 columns) */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-8 lg:p-10 shadow-[0_10px_50px_rgba(0,0,0,0.02)] border border-gray-50 dark:border-slate-800 transition-colors">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recent Success Stories</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">See how your small act of kindness creates a big difference.</p>
                </div>
                <Link href="#" className="hidden sm:inline-flex bg-primary-red text-white text-sm font-bold py-2.5 px-6 rounded-xl hover:bg-red-800 transition-colors">
                  View All Stories
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Story 1 */}
                <div className="group border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col bg-gray-50/50 dark:bg-slate-950">
                  <div className="h-40 w-full relative bg-gray-100 dark:bg-slate-800 flex-shrink-0">
                    <Image src={story1} alt="Story 1" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex-grow">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed text-center">
                      <span className="font-bold text-gray-900 dark:text-white">Rohit donated blood</span> and helped a child fight Thalassemia.
                    </p>
                  </div>
                </div>

                {/* Story 2 */}
                <div className="group border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col bg-gray-50/50 dark:bg-slate-950">
                  <div className="h-40 w-full relative bg-gray-100 dark:bg-slate-800 flex-shrink-0">
                    <Image src={story2} alt="Story 2" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex-grow">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed text-center">
                      <span className="font-bold text-gray-900 dark:text-white">Anjali's timely donation</span> saved a mother's life.
                    </p>
                  </div>
                </div>

                {/* Story 3 */}
                <div className="group border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col bg-gray-50/50 dark:bg-slate-950">
                  <div className="h-40 w-full relative bg-gray-100 dark:bg-slate-800 flex-shrink-0">
                    <Image src={story3} alt="Story 3" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex-grow">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed text-center">
                      Blood donation camp by <span className="font-bold text-gray-900 dark:text-white">RaktaSetu Volunteers</span>.
                    </p>
                  </div>
                </div>
              </div>
              <Link href="#" className="sm:hidden mt-6 bg-primary-red text-white text-sm font-bold py-3 w-full rounded-xl flex justify-center hover:bg-red-800 transition-colors">
                View All Stories
              </Link>
            </div>

            {/* Right Column (Stats & Mission) */}
            <div className="flex flex-col gap-8">
              
              {/* Life Saved Block */}
              <div className="bg-red-50/50 dark:bg-red-950/30 rounded-[2rem] p-8 flex flex-col justify-center border border-red-100 dark:border-red-900/50 relative overflow-hidden transition-colors">
                {/* Decorative blurry spot */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white dark:bg-red-500/10 rounded-full blur-2xl opacity-60"></div>
                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2 relative z-10">Life Saved</h3>
                <div className="text-5xl font-extrabold text-primary-red mb-2 relative z-10 tracking-tight">
                  {livesSaved}
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium relative z-10 text-sm">Lives Saved Till Now</p>
                <div className="absolute right-6 bottom-6 w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm">
                  <Heart className="w-6 h-6 text-primary-red fill-primary-red/20" />
                </div>
              </div>

              {/* Mission Block */}
              <div className="bg-[#FCF9F9] dark:bg-slate-900 rounded-[2rem] p-8 flex-1 border border-gray-100 dark:border-slate-800 flex flex-col relative overflow-hidden transition-colors">
                <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-4 relative z-10">Be a Part of Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed mb-8 relative z-10">
                  Join thousands of donors who are making a difference every day.
                </p>
                
                <div className="mt-auto relative z-10">
                  <Link href="/register" className="inline-flex bg-primary-red hover:bg-red-800 text-white font-bold py-3.5 px-8 rounded-xl transition-colors shadow-lg shadow-red-200">
                    Join Us Today
                  </Link>
                </div>
                
                <div className="absolute right-0 bottom-0 w-32 h-32 opacity-80 mix-blend-multiply translate-x-4 translate-y-4">
                     <Image src={heroImg} alt="Hands holding heart" className="object-cover w-full h-full" />
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. Meet the Team */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TeamSlider members={[
            {
              name: "Pankaj Sadiyal",
              role: "Founder & CEO",
              image: founderImg,
              bio: "\"I started RaktaSetu with a simple vision: no life should be lost due to a lack of blood availability. By bridging the gap between willing donors and those in critical need, we're building a community where saving a life is as simple as a click.\"",
              linkedin: "https://www.linkedin.com/in/pankaj-sadyal-49572a87",
              instagram: "https://www.instagram.com/pankajsadyal?igsi=MXV0NTE2MXcyMndl",
              facebook: "https://www.facebook.com/share/1DQ5pb9jP7/?mibextid=wwXIfr"
            },
            {
              name: "Project Manager",
              role: "Head of Operations",
              image: pmImg,
              bio: "\"Executing our vision takes precision and dedication. I ensure that every aspect of RaktaSetu runs smoothly, bridging the gap between our development teams and the end-users. When lives are on the line, our platform's reliability is absolutely critical.\"",
              linkedin: "#",
              instagram: "#",
              facebook: "#"
            },
            {
              name: "Team Lead",
              role: "Technical Lead",
              image: teamleadImg,
              bio: "\"Building a seamless, lightning-fast platform is my core mission. Every piece of code we write is optimized to connect donors with receivers in the blink of an eye, because every single second matters in an emergency.\"",
              linkedin: "#",
              instagram: "#",
              facebook: "#"
            }
          ]} />
        </div>
      </section>

      {/* 6. Company Banner */}
      <section className="py-16 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#1C1C1C] rounded-[2rem] p-8 md:p-10 text-gray-900 dark:text-white relative overflow-hidden shadow-2xl border border-gray-100 dark:border-[#333] transition-colors">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-1">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                <h2 className="text-2xl font-bold tracking-tight">ParamSetu Innovations</h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 text-[13px] transition-colors">Building intelligent software solutions that bridge ideas with innovation.</p>
              
              <div className="w-full h-px bg-gray-100 dark:bg-white/10 mb-8 transition-colors"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-[#242424] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Software & AI</span>
                </div>
                <div className="bg-gray-50 dark:bg-[#242424] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Scalable Company</span>
                </div>
                <div className="bg-gray-50 dark:bg-[#242424] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Future-Ready Brand</span>
                </div>
              </div>
              
              <div className="w-full h-px bg-gray-100 dark:bg-white/10 mb-8 transition-colors"></div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-[18px] h-[18px] text-gray-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors"><span className="font-bold text-gray-900 dark:text-white">Founder:</span> Pankaj Sadiyal</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-[18px] h-[18px] text-gray-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors"><span className="font-bold text-gray-900 dark:text-white">Vision:</span> Creating innovative software products that solve real-world problems.</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-[18px] h-[18px] text-gray-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors"><span className="font-bold text-gray-900 dark:text-white">Current Product:</span> RaktaSetu – Blood Donation Platform</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-[18px] h-[18px] text-gray-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors"><span className="font-bold text-gray-900 dark:text-white">Future Focus:</span> AI • SaaS • Web • Mobile • Cloud Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col xl:flex-row justify-between items-center gap-10 xl:gap-8 border-b border-gray-100 dark:border-slate-800 pb-10 mb-8">
            
            {/* Left: Brand */}
            <div className="flex flex-col items-center xl:items-start space-y-4 xl:w-[25%] shrink-0">
              <Link href="/" className="flex items-center gap-3">
                <Image src={logo} alt="RaktaSetu Logo" width={48} height={48} className="w-12 h-12" />
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-none">RaktaSetu</h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase mt-1">Leave the worry to us</p>
                </div>
              </Link>
            </div>

            {/* Middle: Contact Info Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center xl:justify-evenly flex-1 gap-8 lg:gap-10 px-4 xl:px-8">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-gray-900 dark:text-white mb-0.5">Visit Us</p>
                  <p className="text-gray-500 dark:text-gray-400 whitespace-nowrap">Himachal Pradesh</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-gray-900 dark:text-white mb-0.5">Email Us</p>
                  <a href="mailto:pankajsadyal0@gmail.com" className="text-gray-500 dark:text-gray-400 hover:text-[#C62121] transition-colors whitespace-nowrap">pankajsadyal0@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-gray-900 dark:text-white mb-0.5">Call Us</p>
                  <a href="tel:+919876953067" className="text-gray-500 dark:text-gray-400 hover:text-[#C62121] transition-colors whitespace-nowrap">+91 98769 53067</a>
                </div>
              </div>
            </div>

            {/* Right: Actions / Badges */}
            <div className="flex justify-center xl:justify-end xl:w-[25%] shrink-0">
              <div className="px-5 py-3 border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center gap-3 shadow-sm">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-500" />
                <div>
                  <p className="font-black text-gray-900 dark:text-white text-sm leading-tight uppercase tracking-wider">Verified & Secured</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-widest mt-0.5">Trusted Platform</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166FE5] hover:scale-110 transition-all shadow-md shadow-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white flex items-center justify-center hover:scale-110 transition-all shadow-md shadow-pink-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
              <a href="#" className="hover:text-[#C62121] transition-colors">Security Policy</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="hover:text-[#C62121] transition-colors">Privacy Policy</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="hover:text-[#C62121] transition-colors">Terms of Use</a>
            </div>

            <div className="text-sm text-gray-400 font-medium">
              Copyright © {new Date().getFullYear()} RaktaSetu. <br className="sm:hidden" />
              <span className="text-gray-500">A product of <span className="font-bold text-gray-600 dark:text-gray-300">ParamSetu Innovations</span></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
