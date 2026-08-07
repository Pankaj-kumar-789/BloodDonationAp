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

  const menuItems: Array<{name: string, icon: any, path: string, exact?: boolean}> = [
    { name: "Find Donors", icon: <Search className="w-5 h-5" />, path: "/search" },
    { name: "Emergency Request", icon: <HeartPulse className="w-5 h-5" />, path: "/emergency" },
  ];

  if (session) {
    menuItems.push({ name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/dashboard", exact: true });
    
    if (session.user.role === "ADMIN") {
      menuItems.push({ name: "Admin Panel", icon: <ShieldCheck className="w-5 h-5" />, path: "/dashboard/admin" });
    }
    
    menuItems.push({ name: "Settings", icon: <Settings className="w-5 h-5" />, path: "/dashboard/settings" });
  }

  return (
    <motion.div 
      initial={false}
      animate={{ width: isExpanded ? 240 : 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 h-screen sticky top-0 shrink-0 z-40 transition-colors shadow-sm"
    >
      <div className="h-20 md:h-24 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-black text-xl text-primary-red ml-2 truncate"
          >
            RaktaSetu
          </motion.div>
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-primary-red transition-colors ${!isExpanded ? 'mx-auto' : ''}`}
        >
          {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.path 
            : (pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path + '/')));
            
          return (
            <Link key={item.name} href={item.path}>
              <div 
                className={`flex items-center py-3 px-3 rounded-xl cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-red-50 dark:bg-red-900/20 text-primary-red font-bold' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white font-medium'
                }`}
                title={!isExpanded ? item.name : ""}
              >
                <div className={`shrink-0 ${!isExpanded ? 'mx-auto' : ''}`}>
                  {item.icon}
                </div>
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-3 truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        {session ? (
          <div className="space-y-2">
            <div className={`flex items-center ${isExpanded ? 'gap-3 px-2 py-2 mb-2' : 'justify-center mb-4'}`}>
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 shrink-0 shadow-sm overflow-hidden" title={!isExpanded ? `${session.user.name} (${session.user.role})` : ""}>
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </div>
              {isExpanded && (
                <div className="min-w-0 flex-1 pr-1">
                  <div className="font-bold text-sm text-gray-900 dark:text-white truncate" title={session.user.name || "User"}>
                    {session.user.name || "User"}
                  </div>
                  <div className="text-[10px] font-black text-primary-red uppercase tracking-wide truncate mt-0.5">
                    {session.user.role || "DONOR"}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => logoutAction()}
              className={`w-full flex items-center py-3 px-3 rounded-xl cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-primary-red font-medium transition-all`}
              title={!isExpanded ? "Log out" : ""}
            >
              <div className={`shrink-0 ${!isExpanded ? 'mx-auto' : ''}`}>
                <LogOut className="w-5 h-5" />
              </div>
              {isExpanded && <span className="ml-3 truncate">Log out</span>}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link href="/login">
              <div 
                className={`flex items-center py-3 px-3 rounded-xl cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white font-medium transition-all`}
                title={!isExpanded ? "Log in" : ""}
              >
                <div className={`shrink-0 ${!isExpanded ? 'mx-auto' : ''}`}>
                  <LogIn className="w-5 h-5" />
                </div>
                {isExpanded && <span className="ml-3 truncate">Log in</span>}
              </div>
            </Link>
            <Link href="/register">
              <div 
                className={`flex items-center py-3 px-3 rounded-xl cursor-pointer bg-primary-red text-white hover:bg-red-700 font-bold transition-all shadow-sm shadow-red-200 dark:shadow-[0_0_15px_rgba(255,42,42,0.3)]`}
                title={!isExpanded ? "Join Now" : ""}
              >
                <div className={`shrink-0 ${!isExpanded ? 'mx-auto' : ''}`}>
                  <UserPlus className="w-5 h-5" />
                </div>
                {isExpanded && <span className="ml-3 truncate">Join Now</span>}
              </div>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
