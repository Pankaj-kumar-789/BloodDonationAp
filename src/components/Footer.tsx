"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Mail, Heart, Globe, MessageCircle, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto relative overflow-hidden">
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-primary-red to-red-900"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-12 lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center group mb-6">
              <img 
                src={logo.src} 
                alt="RaktaSetu Logo" 
                className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-multiply" 
              />
            </Link>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-sm">
              RaktaSetu is a modern, trusted platform bridging the gap between blood donors and people in medical emergencies. Quick, secure, and reliable.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 shadow-sm">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 shadow-sm">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-sky-50 hover:text-sky-500 transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 shadow-sm">
                <Phone className="w-4 h-4" />
              </a>
              <a href="mailto:support@raktasetu.com" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-primary-red transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 shadow-sm">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-4 lg:col-span-2 lg:col-start-6">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Platform</h3>
            <ul className="space-y-4">
              <li><Link href="/search" className="text-gray-500 hover:text-primary-red font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary-red transition-colors"></span>Find Donors</Link></li>
              <li><Link href="/emergency" className="text-gray-500 hover:text-primary-red font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary-red transition-colors"></span>Emergency Request</Link></li>
              <li><Link href="/register" className="text-gray-500 hover:text-primary-red font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary-red transition-colors"></span>Become a Donor</Link></li>
              <li><Link href="/dashboard" className="text-gray-500 hover:text-primary-red font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary-red transition-colors"></span>Hospital Portal</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Support</h3>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-gray-500 hover:text-primary-red font-medium transition-colors">Help Center / FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-primary-red font-medium transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-primary-red font-medium transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-500 hover:text-primary-red font-medium transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          {/* Emergency Card */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="bg-gradient-to-b from-red-50 to-white p-6 rounded-2xl border border-red-100 shadow-sm shadow-red-50 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              <h3 className="font-bold text-gray-900 mb-2 relative z-10 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-red animate-pulse" />
                Need blood urgently?
              </h3>
              <p className="text-sm text-gray-600 mb-5 relative z-10 leading-relaxed">
                Create an emergency request and notify nearby donors and hospitals instantly.
              </p>
              <Link href="/emergency" className="relative z-10 block w-full text-center bg-primary-red hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-red-200 transform hover:-translate-y-0.5">
                Create Request
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} RaktaSetu. All rights reserved.
          </p>
          <div className="flex items-center text-sm font-medium text-gray-400">
            Made with <Heart className="w-4 h-4 text-primary-red mx-1.5 fill-primary-red" /> to save lives.
          </div>
        </div>
      </div>
    </footer>
  );
}
