"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  HeartPulse, 
  LayoutDashboard, 
  LogOut, 
  Settings,
  LogIn,
  UserPlus,
  ShieldCheck,
  User as UserIcon
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export default function Sidebar({ session }: { session: any }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-collapse on small screens
    if (window.innerWidth < 1024) {
      setIsExpanded(false);
    }
  }, []);

  // Don't show sidebar on auth pages or homepage
  if (pathname === "/" || pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") return null;
  if (!mounted) return null;

  const menuItems: Array<{name: string, icon: any, path: string, exact?: boolean, badge?: number}> = [
    { name: "Find Donors", icon: <Search className="w-5 h-5" />, path: "/search" },
    { name: "Emergency Request", icon: <HeartPulse className="w-5 h-5" />, path: "/emergency" },
  ];

  if (session) {
    if (session.user.role !== "ADMIN") {
      menuItems.push({ name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/dashboard", exact: true });
    }
    
    if (session.user.role === "DONOR") {
      menuItems.push(
        { name: "My Donations", icon: <HeartPulse className="w-5 h-5" />, path: "/dashboard/donations" },
        { name: "My Appointments", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, path: "/dashboard/appointments" },
        { name: "My Certificates", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15v5s3-1.5 5-2.5 5-1.5 5-1.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.5 2 1.5 4 2.5S12 20 12 20Z"/><circle cx="12" cy="11" r="3"/></svg>, path: "/dashboard/certificates" },
        { name: "Requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M8.2 16.5A5.5 5.5 0 0 1 15 13.5"/></svg>, path: "/dashboard/requests" },
        { name: "Notifications", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>, path: "/dashboard/notifications" }
      );
    } else if (session.user.role === "BLOOD_BANK") {
      menuItems.push(
        { name: "Manage Requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>, path: "/dashboard/requests" },
        { name: "Donor Management", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, path: "/dashboard/donors" },
        { name: "Blood Inventory", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>, path: "/dashboard/inventory" },
        { name: "Donations", icon: <HeartPulse className="w-5 h-5" />, path: "/dashboard/donations" },
        { name: "Reports", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>, path: "/dashboard/reports" },
        { name: "Notifications", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>, path: "/dashboard/notifications" }
      );
    } else if (session.user.role === "USER") {
      menuItems.push(
        { name: "My Requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M8.2 16.5A5.5 5.5 0 0 1 15 13.5"/></svg>, path: "/dashboard/requests" },
        { name: "Blood Banks", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>, path: "/dashboard/blood-banks" },
        { name: "Hospitals", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h6"/><path d="M12 12v6"/></svg>, path: "/dashboard/hospitals" },
        { name: "Notifications", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>, path: "/dashboard/notifications" }
      );
    } else if (session.user.role === "HOSPITAL") {
      menuItems.push(

        { name: "My Requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M8.2 16.5A5.5 5.5 0 0 1 15 13.5"/></svg>, path: "/dashboard/requests" },
        { name: "Blood Inventory", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>, path: "/dashboard/inventory" },
        { name: "Donor Management", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, path: "/dashboard/donors" },
        { name: "Reports", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>, path: "/dashboard/reports" },
        { name: "Notifications", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>, path: "/dashboard/notifications" }
      );
    } else if (session.user.role === "ADMIN") {
      menuItems.push({ name: "Admin Panel", icon: <ShieldCheck className="w-5 h-5" />, path: "/dashboard/admin" });
    }
    
    menuItems.push({ name: "Settings", icon: <Settings className="w-5 h-5" />, path: "/dashboard/settings" });
  }

  return (
    <motion.div 
      initial={false}
      animate={{ width: isExpanded ? 260 : 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="hidden md:flex flex-col bg-white border-r border-gray-100 h-screen sticky top-0 shrink-0 z-40 transition-colors shadow-sm"
    >
      <div className="h-20 md:h-24 flex items-center justify-between px-6 border-b border-gray-100">
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 font-black text-xl text-[#C62121] truncate"
          >
            <div className="w-8 h-8 rounded-full bg-red-50 text-[#C62121] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
            </div>
            RaktaSetu
          </motion.div>
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#C62121] transition-colors ${!isExpanded ? 'mx-auto' : ''}`}
        >
          {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.path 
            : (pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path + '/')));
            
          return (
            <Link key={item.name} href={item.path}>
              <div 
                className={`flex items-center justify-between py-3.5 px-4 rounded-xl cursor-pointer transition-all mb-1 ${
                  isActive 
                    ? 'bg-[#C62121] text-white font-bold shadow-md shadow-red-200' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'
                }`}
                title={!isExpanded ? item.name : ""}
              >
                <div className="flex items-center">
                  <div className={`shrink-0 ${!isExpanded ? 'mx-auto' : ''} ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {item.icon}
                  </div>
                  {isExpanded && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-4 text-[13px] tracking-wide"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </div>
                {isExpanded && item.badge && (
                  <div className="w-5 h-5 rounded-full bg-[#C62121] text-white text-[10px] font-black flex items-center justify-center">
                    {item.badge}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 mt-auto">
        {session ? (
          <div className="flex flex-col gap-2">
            {isExpanded && (
              <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-gray-50 rounded-xl border border-gray-100">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-100 text-[#C62121] flex items-center justify-center font-black shrink-0 text-lg">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{session.user.name}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate">{session.user.role.replace("_", " ")}</p>
                </div>
              </div>
            )}
            <button 
              onClick={() => logoutAction()}
              className={`w-full flex items-center py-3.5 px-4 rounded-xl cursor-pointer text-gray-500 hover:bg-red-50 hover:text-[#C62121] font-semibold transition-all`}
              title={!isExpanded ? "Logout" : ""}
            >
              <div className={`shrink-0 ${!isExpanded ? 'mx-auto' : ''}`}>
                <LogOut className="w-5 h-5" />
              </div>
              {isExpanded && <span className="ml-4 text-[13px] tracking-wide truncate">Logout</span>}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link href="/login">
              <div 
                className={`flex items-center py-3 px-3 rounded-xl cursor-pointer text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-all`}
                title={!isExpanded ? "Log in" : ""}
              >
                <div className={`shrink-0 ${!isExpanded ? 'mx-auto' : ''}`}>
                  <LogIn className="w-5 h-5" />
                </div>
                {isExpanded && <span className="ml-4 text-[13px] tracking-wide truncate">Log in</span>}
              </div>
            </Link>
            <Link href="/register">
              <div 
                className={`flex items-center py-3 px-3 rounded-xl cursor-pointer bg-[#C62121] text-white hover:bg-red-700 font-bold transition-all shadow-md shadow-red-200`}
                title={!isExpanded ? "Join Now" : ""}
              >
                <div className={`shrink-0 ${!isExpanded ? 'mx-auto' : ''}`}>
                  <UserPlus className="w-5 h-5" />
                </div>
                {isExpanded && <span className="ml-4 text-[13px] tracking-wide truncate">Join Now</span>}
              </div>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
