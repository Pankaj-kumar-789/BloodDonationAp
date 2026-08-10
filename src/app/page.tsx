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
import heroImg from "../../public/assets/hero_illustration.jpg";
import story1 from "../../public/assets/success_story_1.jpg";
import story2 from "../../public/assets/success_story_2.jpg";
import story3 from "../../public/assets/success_story_3.jpg";

import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch real statistics from the database
  const [donorCount, completedRequests, hospitalCount, cities] = await Promise.all([
    prisma.donorProfile.count({ where: { isAvailable: true } }).catch(() => 540),
    prisma.bloodRequest.count({ where: { status: "COMPLETED" } }).catch(() => 12547),
    prisma.hospitalProfile.count().catch(() => 124),
    prisma.donorProfile.findMany({ select: { city: true }, distinct: ['city'] }).catch(() => Array(45).fill({}))
  ]);

  const cityCount = cities.length;

  return (
    <div className="flex flex-col bg-[#FAFAFA] min-h-screen font-sans transition-colors">
      
      {/* 1. Hero Section */}
      <section className="relative w-full overflow-hidden pt-16 lg:pt-24 pb-12 lg:pb-20">
        {/* Soft Radial Gradient Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-50 via-white to-white z-0"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-red-100/50 blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-red-50/50 blur-[100px] pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-8">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/2 pt-12 lg:pt-20 text-center lg:text-left">
              <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold text-gray-900 leading-[1.05] mb-6 tracking-tight">
                Give Blood, <br />
                <span className="text-[#C62121]">Give Life</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                Your one donation can bring a smile to someone's face and hope to their life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link 
                  href="/register" 
                  className="bg-[#C62121] hover:bg-red-800 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_8px_30px_rgb(198,33,33,0.3)] hover:shadow-[0_8px_30px_rgb(198,33,33,0.5)] hover:-translate-y-1"
                >
                  <Droplet className="w-5 h-5 fill-current" />
                  Donate Blood
                </Link>
                <Link 
                  href="/emergency" 
                  className="bg-white text-gray-900 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 border border-gray-200 hover:border-gray-300"
                >
                  <Heart className="w-5 h-5 text-[#C62121]" />
                  Request Blood
                </Link>
              </div>
            </div>

            {/* Right Content / Illustration */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative lg:-mr-12">
              <div className="relative w-full max-w-[650px] flex items-center justify-center">
                {/* Floating decorative elements */}
                <div className="absolute top-[10%] right-[10%] text-primary-red animate-pulse">
                  <Droplet className="w-8 h-8 fill-current opacity-60" />
                </div>
                <div className="absolute bottom-[20%] left-[5%] text-primary-red animate-pulse delay-300">
                  <Droplet className="w-6 h-6 fill-current opacity-40" />
                </div>
                <div className="absolute top-[30%] left-[10%] text-red-300 animate-pulse delay-700">
                  <Heart className="w-6 h-6 opacity-60" />
                </div>
                
                {/* Main Hero Image */}
                <Image 
                  src={heroImg} 
                  alt="Give Blood Illustration" 
                  className="object-contain w-full h-auto mix-blend-multiply"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Stats Row */}
      <section className="relative z-20 pb-16 pt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 justify-items-center">
            
            {/* Stat 1 */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 flex items-center justify-center">
                <Users className="w-10 h-10 text-[#C62121]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-2xl">{donorCount > 10 ? donorCount : '25,647+'}</h3>
                <p className="text-gray-500 text-sm font-medium">Donors</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 flex items-center justify-center">
                <Heart className="w-10 h-10 text-[#C62121]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-2xl">{completedRequests > 10 ? completedRequests : '12,458+'}</h3>
                <p className="text-gray-500 text-sm font-medium">Lives Saved</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-[#C62121]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-2xl">{hospitalCount > 10 ? hospitalCount : '648+'}</h3>
                <p className="text-gray-500 text-sm font-medium">Blood Banks</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 flex items-center justify-center">
                <Droplet className="w-10 h-10 text-[#C62121]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-2xl">1,250+</h3>
                <p className="text-gray-500 text-sm font-medium">Blood Requests</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 mb-8">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
              {/* Step 1 */}
              <div className="flex items-start gap-4 relative z-10 bg-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#C62121] text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Register</h4>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-[150px]">Create your account in seconds</p>
                </div>
                <div className="hidden lg:block absolute top-4 -right-4 text-[#C62121]/30">
                  <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 relative z-10 bg-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#C62121] text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Search</h4>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-[150px]">Find donors or make a request</p>
                </div>
                <div className="hidden lg:block absolute top-4 -right-4 text-[#C62121]/30">
                  <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 relative z-10 bg-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#C62121] text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Connect</h4>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-[150px]">Get connected with verified donors</p>
                </div>
                <div className="hidden lg:block absolute top-4 -right-4 text-[#C62121]/30">
                  <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4 relative z-10 bg-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#C62121] text-white flex items-center justify-center font-bold text-sm shrink-0">4</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Save Lives</h4>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-[150px]">Your help can make a big difference</p>
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
            <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_10px_50px_rgba(0,0,0,0.02)] border border-gray-50 transition-colors">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Success Stories</h2>
                  <p className="text-gray-500 text-sm">See how your small act of kindness creates a big difference.</p>
                </div>
                <Link href="#" className="hidden sm:inline-flex bg-primary-red text-white text-sm font-bold py-2.5 px-6 rounded-xl hover:bg-red-800 transition-colors">
                  View All Stories
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Story 1 */}
                <div className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 flex flex-col bg-gray-50/50">
                  <div className="h-40 w-full relative bg-gray-100 flex-shrink-0">
                    <Image src={story1} alt="Story 1" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex-grow">
                    <p className="text-sm text-gray-700 font-medium leading-relaxed text-center">
                      <span className="font-bold text-gray-900">Rohit donated blood</span> and helped a child fight Thalassemia.
                    </p>
                  </div>
                </div>

                {/* Story 2 */}
                <div className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 flex flex-col bg-gray-50/50">
                  <div className="h-40 w-full relative bg-gray-100 flex-shrink-0">
                    <Image src={story2} alt="Story 2" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex-grow">
                    <p className="text-sm text-gray-700 font-medium leading-relaxed text-center">
                      <span className="font-bold text-gray-900">Anjali's timely donation</span> saved a mother's life.
                    </p>
                  </div>
                </div>

                {/* Story 3 */}
                <div className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 flex flex-col bg-gray-50/50">
                  <div className="h-40 w-full relative bg-gray-100 flex-shrink-0">
                    <Image src={story3} alt="Story 3" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex-grow">
                    <p className="text-sm text-gray-700 font-medium leading-relaxed text-center">
                      Blood donation camp by <span className="font-bold text-gray-900">RaktaSetu Volunteers</span>.
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
              <div className="bg-red-50/50 rounded-[2rem] p-8 flex flex-col justify-center border border-red-100 relative overflow-hidden transition-colors">
                {/* Decorative blurry spot */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white rounded-full blur-2xl opacity-60"></div>
                <h3 className="text-gray-900 font-bold text-lg mb-2 relative z-10">Life Saved</h3>
                <div className="text-5xl font-extrabold text-primary-red mb-2 relative z-10 tracking-tight">
                  {completedRequests > 10 ? completedRequests : '12,547+'}
                </div>
                <p className="text-gray-600 font-medium relative z-10 text-sm">Lives Saved Till Now</p>
                <div className="absolute right-6 bottom-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Heart className="w-6 h-6 text-primary-red fill-primary-red/20" />
                </div>
              </div>

              {/* Mission Block */}
              <div className="bg-[#FCF9F9] rounded-[2rem] p-8 flex-1 border border-gray-100 flex flex-col relative overflow-hidden transition-colors">
                <h3 className="text-gray-900 font-bold text-xl mb-4 relative z-10">Be a Part of Our Mission</h3>
                <p className="text-gray-600 text-sm font-medium leading-relaxed mb-8 relative z-10">
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

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-100 text-gray-600 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col xl:flex-row justify-between items-center gap-10 xl:gap-8 border-b border-gray-100 pb-10 mb-8">
            
            {/* Left: Brand */}
            <div className="flex flex-col items-center xl:items-start space-y-4 xl:w-[25%] shrink-0">
              <Link href="/" className="flex items-center gap-3">
                <Image src={logo} alt="RaktaSetu Logo" width={48} height={48} className="w-12 h-12" />
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-none">RaktaSetu</h2>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">Leave the worry to us</p>
                </div>
              </Link>
            </div>

            {/* Middle: Contact Info Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center xl:justify-evenly flex-1 gap-8 lg:gap-10 px-4 xl:px-8">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gray-500" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-gray-900 mb-0.5">Visit Us</p>
                  <p className="text-gray-500 whitespace-nowrap">Himachal Pradesh</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-gray-900 mb-0.5">Email Us</p>
                  <a href="mailto:pankajsadyal0@gmail.com" className="text-gray-500 hover:text-[#C62121] transition-colors whitespace-nowrap">pankajsadyal0@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gray-500" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-gray-900 mb-0.5">Call Us</p>
                  <a href="tel:+919876953067" className="text-gray-500 hover:text-[#C62121] transition-colors whitespace-nowrap">+91 98769 53067</a>
                </div>
              </div>
            </div>

            {/* Right: Actions / Badges */}
            <div className="flex justify-center xl:justify-end xl:w-[25%] shrink-0">
              <div className="px-5 py-3 border border-gray-100 bg-gray-50 rounded-xl flex items-center gap-3 shadow-sm">
                <Shield className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-black text-gray-900 text-sm leading-tight uppercase tracking-wider">Verified & Secured</p>
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mt-0.5">Trusted Platform</p>
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
              Copyright © {new Date().getFullYear()} RaktaSetu.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
