"use client";

import Link from "next/link";
import { ArrowRight, Heart, Shield, Activity, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-sans transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-[#FAFAFA] dark:from-red-950/20 dark:to-slate-950 pointer-events-none -z-10 transition-colors"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-100/40 dark:bg-red-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10 transition-colors"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-red-100 dark:bg-red-900/30 text-primary-red font-semibold text-sm mb-6 transition-colors">
            Our Mission
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 transition-colors">
            Bridging the gap between <span className="text-primary-red">hope</span> and <span className="text-primary-red">help.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 transition-colors">
            RaktaSetu is a modern, unified platform designed to connect blood donors, hospitals, and patients in real-time, eliminating the critical delays that cost lives during medical emergencies.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-primary-red hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-200 dark:shadow-none flex items-center justify-center gap-2">
              Join as a Donor <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/emergency" className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold transition-colors">
              Request Blood Now
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">Why RaktaSetu?</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors">Every drop counts. We leverage technology to make the blood donation process safer, faster, and completely transparent.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 dark:bg-slate-950 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 text-center transition-colors hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-primary-red rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">Save Lives</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">A single donation can save up to three lives. We make it easy to find those who need it most.</p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-950 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 text-center transition-colors hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">Real-Time</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">Broadcast emergency alerts to verified donors in your immediate vicinity instantly.</p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-950 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 text-center transition-colors hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">100% Verified</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">We partner directly with registered hospitals and blood banks to ensure authenticity.</p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-950 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 text-center transition-colors hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">Community</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">Join a network of thousands of selfless volunteers dedicated to making a difference.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 to-slate-900 dark:from-slate-900 dark:to-slate-950 rounded-[3rem] p-8 md:p-16 overflow-hidden relative border border-gray-800 transition-colors">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-red/20 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">How it all started.</h2>
                <div className="space-y-4 text-gray-300 font-medium">
                  <p>
                    RaktaSetu was born out of a critical realization: despite having millions of willing blood donors, people still struggle to find blood during emergencies due to a lack of coordination and real-time connectivity.
                  </p>
                  <p>
                    Our platform was designed to solve this fragmentation. By bringing individual donors, hospitals, and blood banks onto a single unified dashboard, we eliminate the panic of finding the right blood group at the right time.
                  </p>
                  <p>
                    Whether you are scheduling a routine donation, searching for live blood inventory, or broadcasting an emergency request, RaktaSetu ensures that help is always just a click away.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                  <div className="text-4xl font-black text-white mb-2">10K+</div>
                  <div className="text-gray-400 text-sm font-medium">Registered Donors</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md translate-y-8">
                  <div className="text-4xl font-black text-white mb-2">500+</div>
                  <div className="text-gray-400 text-sm font-medium">Partner Hospitals</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                  <div className="text-4xl font-black text-white mb-2">24/7</div>
                  <div className="text-gray-400 text-sm font-medium">Emergency Support</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md translate-y-8">
                  <div className="text-4xl font-black text-white mb-2">15K+</div>
                  <div className="text-gray-400 text-sm font-medium">Lives Impacted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
