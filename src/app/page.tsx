import Image from "next/image";
import Link from "next/link";
import { Search, Heart, Shield, Activity, Clock, MapPin, Mail, Phone, CheckCircle2, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import banner from "@/assets/hero-banner.png";

import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch real statistics from the database
  const [donorCount, completedRequests, hospitalCount, cities] = await Promise.all([
    prisma.donorProfile.count({ where: { isAvailable: true } }),
    prisma.bloodRequest.count({ where: { status: "COMPLETED" } }),
    prisma.hospitalProfile.count(),
    prisma.donorProfile.findMany({ select: { city: true }, distinct: ['city'] })
  ]);

  const cityCount = cities.length;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-gray-900 overflow-hidden border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/demo/image/upload/v1642683935/pattern-bg.png')] opacity-5 dark:opacity-10 bg-repeat"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-primary-red dark:text-red-400 text-sm font-medium mb-6">
                <Activity className="w-4 h-4" />
                <span>Save Lives Today</span>
              </div>
              <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 tracking-tight">
                Find Blood Donors <br />
                <span className="text-primary-red dark:text-red-400">Near You, Instantly.</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
                RaktaSetu is a modern, trusted platform that bridges the gap between blood donors and people in medical emergencies. Quick, secure, and reliable.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/search" className="bg-primary-red hover:bg-red-700 text-white font-medium py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 dark:shadow-none">
                  <Search className="w-5 h-5" />
                  Find Donors
                </Link>
                <Link href="/emergency" className="bg-white dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm dark:shadow-none">
                  <Activity className="w-5 h-5 text-primary-red dark:text-red-400" />
                  Emergency Request
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block relative h-[500px] w-full flex items-center justify-center bg-gray-50 rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-light-red to-white opacity-20 group-hover:opacity-40 transition-opacity duration-500 z-20 pointer-events-none"></div>
              <div className="relative z-10 w-full h-full transform transition-transform duration-700 group-hover:scale-105">
                <img 
                  src={banner.src} 
                  alt="Blood Donation Banner" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-gray-900 mb-2">{donorCount}</div>
              <div className="text-gray-500 font-medium">Active Donors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-primary-red mb-2">{completedRequests}</div>
              <div className="text-gray-500 font-medium">Lives Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-gray-900 mb-2">{hospitalCount}</div>
              <div className="text-gray-500 font-medium">Hospitals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-primary-red mb-2">{cityCount}</div>
              <div className="text-gray-500 font-medium">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why choose RaktaSetu?</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Designed for speed, built for trust. Our platform ensures you get the right help when every second counts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary-red dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Verified Donors</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Every donor profile is verified by our admins to ensure complete authenticity and safety.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-primary-red dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Location-Based</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Find donors in your exact vicinity. Integrated with Google Maps for accurate tracking.</p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-primary-red dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Privacy First</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Contact information is hidden by default and only unlocked via transparent payment.</p>
            </div>
            
            {/* Card 4 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-primary-red dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Emergency Ready</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Broadcast urgent requirements instantly to all nearby donors via push notifications.</p>
            </div>

            {/* Card 5 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-primary-red dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Real-time Chat</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Instantly communicate with nearby donors through our secure in-app messaging system.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <footer className="bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col xl:flex-row justify-between items-center gap-10 xl:gap-4 border-b border-gray-200 dark:border-gray-800 pb-12 mb-8 transition-colors">
            
            {/* Left: Brand */}
            <div className="flex flex-col items-center xl:items-start space-y-4 xl:w-1/4">
              <Link href="/" className="flex items-center gap-3">
                <Image src={logo} alt="RaktaSetu Logo" width={48} height={48} className="w-12 h-12" />
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-none">RaktaSetu</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase mt-1">Leave the worry to us</p>
                </div>
              </Link>
            </div>

            {/* Middle: Contact Info Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-8 lg:gap-12 xl:w-2/4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                  <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-gray-900 dark:text-white mb-0.5">Visit Us</p>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-nowrap">Village Chuanl, Hamirpur, H.P.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-gray-900 dark:text-white mb-0.5">Email Us</p>
                  <a href="mailto:pankajsadyal0@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-primary-red dark:hover:text-white transition-colors whitespace-nowrap">pankajsadyal0@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                  <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-gray-900 dark:text-white mb-0.5">Call Us</p>
                  <a href="tel:+919876953067" className="text-gray-600 dark:text-gray-400 hover:text-primary-red dark:hover:text-white transition-colors whitespace-nowrap">+91 98769 53067</a>
                </div>
              </div>
            </div>

            {/* Right: Actions / Badges */}
            <div className="flex justify-center xl:justify-end xl:w-1/4">
              <div className="px-6 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center gap-4 transition-colors">
                <Shield className="w-7 h-7 text-green-600 dark:text-green-500" />
                <div>
                  <p className="font-black text-gray-900 dark:text-white leading-tight uppercase tracking-wide">Verified & Secured</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium">Trusted Platform</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-red dark:hover:text-white transition-colors text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-red dark:hover:text-white transition-colors text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-500">
              <a href="#" className="hover:text-primary-red dark:hover:text-gray-300 transition-colors">Security Policy</a>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <a href="#" className="hover:text-primary-red dark:hover:text-gray-300 transition-colors">Privacy Policy</a>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <a href="#" className="hover:text-primary-red dark:hover:text-gray-300 transition-colors">Terms of Use</a>
            </div>

            <div className="text-sm text-gray-500">
              Copyright © {new Date().getFullYear()} RaktaSetu. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
