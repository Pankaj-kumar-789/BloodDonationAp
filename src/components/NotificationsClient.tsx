"use client";

import { Bell, Heart, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { markAllAsReadAction, toggleNotificationReadStatusAction } from "@/app/actions/notifications";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export default function NotificationsClient({ initialNotifications }: { initialNotifications: any[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMarkAsRead = async () => {
    setLoading(true);
    await markAllAsReadAction();
    router.refresh();
    setLoading(false);
  };

  const handleNotificationClick = async (id: string, currentIsRead: boolean, link: string | null) => {
    if (!currentIsRead) {
      await toggleNotificationReadStatusAction(id, true);
    }
    if (link) {
      router.push(link);
    } else {
      router.refresh();
    }
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} mins ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes("urgent") || title.toLowerCase().includes("emergency")) {
      return { icon: AlertCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/30" };
    }
    if (title.toLowerCase().includes("donor") || title.toLowerCase().includes("thank")) {
      return { icon: Heart, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/30" };
    }
    if (title.toLowerCase().includes("verif")) {
      return { icon: CheckCircle2, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30" };
    }
    return { icon: Info, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" };
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 transition-colors">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors">Stay updated with the latest emergency alerts and requests.</p>
        </div>
        <button 
          onClick={handleMarkAsRead} 
          disabled={loading || initialNotifications.length === 0} 
          className="text-sm font-bold text-primary-red bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden p-2 transition-colors">
        <motion.div 
          className="flex flex-col gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {initialNotifications.length > 0 ? initialNotifications.map((notif) => {
            const style = getIcon(notif.title);
            const Icon = style.icon;
            return (
              <motion.div 
                key={notif.id} 
                variants={itemVariants}
                onClick={() => handleNotificationClick(notif.id, notif.isRead, notif.link)}
                className={`p-5 rounded-2xl flex gap-5 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer relative border ${!notif.isRead ? 'bg-red-50/20 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 shadow-sm' : 'border-transparent dark:border-transparent'}`}
              >
                {!notif.isRead && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary-red rounded-r-full shadow-[0_0_10px_rgba(255,42,42,0.4)]"></div>
                )}
                <div className={`w-14 h-14 rounded-2xl ${style.bg} ${style.color} flex items-center justify-center flex-shrink-0 shadow-inner border border-white/50 dark:border-white/5`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className={`font-black truncate transition-colors ${!notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{notif.title}</h4>
                    <span className={`text-xs font-bold whitespace-nowrap px-2 py-1 rounded-md transition-colors ${!notif.isRead ? 'bg-red-100 dark:bg-red-900/40 text-primary-red dark:text-red-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'}`}>{formatTime(notif.createdAt)}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 transition-colors">{notif.body}</p>
                </div>
              </motion.div>
            );
          }) : (
            <motion.div variants={itemVariants} className="py-20 px-6 text-center flex flex-col items-center justify-center bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 m-4 transition-colors">
              <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 transition-colors">All caught up!</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm font-medium transition-colors">You have no new notifications. When a hospital or donor reaches out, you'll see it here.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
