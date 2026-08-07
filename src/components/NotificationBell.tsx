"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Heart, AlertCircle, CheckCircle2, Info } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUnreadNotificationCountAction, getRecentNotificationsAction, toggleNotificationReadStatusAction } from "@/app/actions/notifications";

export default function NotificationBell({ initialUnreadCount = 0 }: { initialUnreadCount?: number }) {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const fetchStats = async () => {
    // Only fetch if we're not currently syncing from a fresh server prop,
    // though the interval will just quietly keep it updated.
    const count = await getUnreadNotificationCountAction();
    setUnreadCount(count);
    if (isOpen) {
      const recent = await getRecentNotificationsAction();
      setNotifications(recent);
    }
  };

  // Sync state with server prop when router.refresh() happens
  useEffect(() => {
    setUnreadCount(initialUnreadCount);
  }, [initialUnreadCount]);

  // Close dropdown and fetch latest stats when navigating to a new page
  useEffect(() => {
    setIsOpen(false);
    fetchStats();
  }, [pathname]);

  useEffect(() => {
    // Fetch count initially just in case, and start polling
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (id: string, currentIsRead: boolean, link: string | null) => {
    if (!currentIsRead) {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      await toggleNotificationReadStatusAction(id, true);
    }
    
    if (link) {
      router.push(link);
    } else {
      router.push("/dashboard/notifications");
    }
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes("urgent") || title.toLowerCase().includes("emergency")) return { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" };
    if (title.toLowerCase().includes("donor") || title.toLowerCase().includes("thank") || title.toLowerCase().includes("ready")) return { icon: Heart, color: "text-pink-600", bg: "bg-pink-50" };
    if (title.toLowerCase().includes("verif")) return { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" };
    return { icon: Info, color: "text-blue-600", bg: "bg-blue-50" };
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-primary-red transition-colors group focus:outline-none"
      >
        <Bell className="w-6 h-6 transition-transform group-hover:scale-110" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 translate-x-1/2 -translate-y-1/2 bg-primary-red text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-in zoom-in">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-3 flex justify-between items-center">
            <h3 className="font-bold text-white">Notifications</h3>
            {unreadCount > 0 && <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium">{unreadCount} unread</span>}
          </div>
          
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {notifications.length > 0 ? notifications.map(notif => {
              const style = getIcon(notif.title);
              const Icon = style.icon;
              return (
                <div 
                  key={notif.id} 
                  onClick={() => handleNotificationClick(notif.id, notif.isRead, notif.link)}
                  className={`p-4 flex gap-3 transition-colors hover:bg-gray-50 cursor-pointer ${!notif.isRead ? 'bg-red-50/20' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full ${style.bg} ${style.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className={`font-bold text-sm truncate pr-2 ${!notif.isRead ? 'text-gray-900' : 'text-gray-700'}`}>{notif.title}</h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{formatTime(notif.createdAt)}</span>
                    </div>
                    <p className={`text-xs line-clamp-2 ${!notif.isRead ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>{notif.body}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center pl-2">
                    {!notif.isRead ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-red shadow-sm shadow-red-200"></div>
                    ) : (
                      <div className="w-2 h-2 rounded-full border border-gray-300"></div>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="p-8 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No notifications</p>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
            <Link 
              href="/dashboard/notifications" 
              className="text-sm font-bold text-primary-red hover:text-red-700 transition-colors"
            >
              View all notifications &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
