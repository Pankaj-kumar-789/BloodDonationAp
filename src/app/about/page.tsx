"use client";

import Link from "next/link";
import { ArrowRight, Heart, Shield, Activity, Users } from "lucide-react";
import TeamSlider from "@/components/TeamSlider";
import founderImg from "../../public/founder.jpg";
import pmImg from "../../public/pm.jpg";
import teamleadImg from "../../public/teamlead.jpg";

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
                linkedin: "",
                instagram: "",
                facebook: ""
              },
              {
                name: "Team Lead",
                role: "Technical Lead",
                image: teamleadImg,
                bio: "\"Building a seamless, lightning-fast platform is my core mission. Every piece of code we write is optimized to connect donors with receivers in the blink of an eye, because every single second matters in an emergency.\"",
                linkedin: "",
                instagram: "",
                facebook: ""
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
    </div>
  );
}
