"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { logoutAction } from "@/app/actions/auth";
import { useTheme } from "next-themes";

import logo from "@/assets/logo.png";
import NotificationBell from "@/components/NotificationBell";

export default function Navbar({ session, unreadCount = 0 }: { session: any, unreadCount?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
  const isSidebarVisible = !(pathname === "/" || isAuthPage);
  const isDark = mounted && resolvedTheme === "dark";
  
  if (isAuthPage || !mounted) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors shrink-0">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 md:h-24">
          <div className="flex items-center">
            {/* Logo - visible on mobile, or on desktop if Sidebar is NOT visible */}
            <Link href="/" className={`${isSidebarVisible ? 'md:hidden ' : ''}flex items-center group`}>
              <img 
                src={logo.src} 
                alt="RaktaSetu Logo" 
                className={`h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm ${isDark ? '' : 'mix-blend-multiply'}`}
                style={isDark ? { filter: 'invert(1) hue-rotate(180deg)', mixBlendMode: 'screen' } : {}}
              />
            </Link>
          </div>

          {/* Desktop Menu - Only visible if Sidebar is NOT visible */}
          {!isSidebarVisible && (
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link href="/search" className="text-gray-600 dark:text-gray-300 hover:text-primary-red dark:hover:text-primary-red font-medium transition-colors">
                Find Donors
              </Link>
              <Link href="/emergency" className="text-gray-600 dark:text-gray-300 hover:text-primary-red dark:hover:text-primary-red font-medium transition-colors">
                Emergency Request
              </Link>
              
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {session ? (
                <div className="flex items-center gap-4 ml-2">
                  <NotificationBell initialUnreadCount={unreadCount} />
                  <Link href="/dashboard" className="text-gray-900 dark:text-white font-medium hover:text-primary-red">
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => logoutAction()}
                    className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 ml-2">
                  <Link href="/login" className="text-gray-900 dark:text-white font-medium hover:text-primary-red">
                    Log in
                  </Link>
                  <Link href="/register" className="bg-primary-red hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-red-200 dark:shadow-none">
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Desktop Right Side (Icons only) - Visible only if Sidebar IS visible */}
          {isSidebarVisible && (
            <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {session && (
              <div className="flex items-center">
                <NotificationBell initialUnreadCount={unreadCount} />
              </div>
            )}
          </div>
          )}

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <Link href="/search" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
            Find Donors
          </Link>
          <Link href="/emergency" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
            Emergency Request
          </Link>
          {session ? (
             <>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                Dashboard
              </Link>
              {session.user?.role === "ADMIN" && (
                <Link href="/dashboard/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                  Admin Panel
                </Link>
              )}
              <Link href="/dashboard/settings" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                Settings
              </Link>
              <button onClick={() => { setIsOpen(false); logoutAction(); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                Log out
              </button>
             </>
          ) : (
            <>
              <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                Log in
              </Link>
              <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-primary-red hover:bg-red-50 mt-2">
                Join Now
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
