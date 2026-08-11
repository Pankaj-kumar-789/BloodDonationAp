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
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-colors shrink-0">
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
              <Link href="/" className="text-gray-900 hover:text-primary-red font-bold transition-colors border-b-2 border-primary-red pb-1">
                Home
              </Link>
              <Link href="/donors" className="text-gray-600 hover:text-primary-red font-medium transition-colors">
                Donors
              </Link>
              <Link href="/blood-banks" className="text-gray-600 hover:text-primary-red font-medium transition-colors">
                Blood Banks
              </Link>
              <Link href="/hospitals" className="text-gray-600 hover:text-primary-red font-medium transition-colors">
                Hospitals
              </Link>
              <Link href="/requests" className="text-gray-600 hover:text-primary-red font-medium transition-colors">
                Requests
              </Link>
              <Link href="/events" className="text-gray-600 hover:text-primary-red font-medium transition-colors">
                Events
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary-red font-medium transition-colors">
                About Us
              </Link>

              {session ? (
                <div className="flex items-center gap-4 ml-4">
                  <NotificationBell initialUnreadCount={unreadCount} />
                  <Link href="/dashboard" className="text-gray-900 font-medium hover:text-primary-red">
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => logoutAction()}
                    className="bg-gray-100 hover:bg-gray-200:bg-gray-700 text-gray-800 px-4 py-2 rounded-lg font-bold transition-colors"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 ml-4">
                  <Link href="/login" className="text-primary-red font-bold border border-primary-red px-5 py-2 rounded-lg hover:bg-red-50:bg-red-900/20 transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="bg-primary-red hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold transition-colors shadow-sm">
                    Register
                  </Link>
                </div>
              )}
              
              
            </div>
          )}

          {/* Desktop Right Side (Icons only) - Visible only if Sidebar IS visible */}
          {isSidebarVisible && (
            <div className="hidden md:flex md:items-center md:space-x-4">
            

            {session && (
              <div className="flex items-center">
                <NotificationBell initialUnreadCount={unreadCount} />
              </div>
            )}
          </div>
          )}

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-3">
            {session && (
              <NotificationBell initialUnreadCount={unreadCount} />
            )}
            
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
              {session.user?.role === "USER" && (
                <>
                  <Link href="/dashboard/requests" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    My Requests
                  </Link>
                  <Link href="/dashboard/blood-banks" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    Blood Banks
                  </Link>
                  <Link href="/dashboard/hospitals" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    Hospitals
                  </Link>
                </>
              )}
              {session.user?.role === "DONOR" && (
                <>
                  <Link href="/dashboard/donations" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    My Donations
                  </Link>
                  <Link href="/dashboard/appointments" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    My Appointments
                  </Link>
                  <Link href="/dashboard/certificates" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    My Certificates
                  </Link>
                  <Link href="/dashboard/requests" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    Requests
                  </Link>
                </>
              )}
              {session.user?.role === "BLOOD_BANK" && (
                <>
                  <Link href="/dashboard/requests" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    Manage Requests
                  </Link>
                  <Link href="/dashboard/donors" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    Donor Management
                  </Link>
                  <Link href="/dashboard/inventory" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    Blood Inventory
                  </Link>
                  <Link href="/dashboard/donations" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    Donations
                  </Link>
                  <Link href="/dashboard/reports" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    Reports
                  </Link>
                </>
              )}
              {session.user?.role === "HOSPITAL" && (
                <>

                  <Link href="/dashboard/requests" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    My Requests
                  </Link>
                  <Link href="/dashboard/inventory" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    Blood Inventory
                  </Link>
                  <Link href="/dashboard/donors" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    Donor Management
                  </Link>
                  <Link href="/dashboard/reports" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-red hover:bg-gray-50">
                    Reports
                  </Link>
                </>
              )}
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
