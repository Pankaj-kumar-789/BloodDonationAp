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
    <div className="space-y-6 max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Stay updated with alerts and requests</p>
        </div>
        <button 
          onClick={handleMarkAsRead} 
          disabled={loading} 
          className="text-sm font-bold text-primary-red hover:text-red-700 dark:hover:text-red-400 transition-colors disabled:opacity-50"
        >
          {loading ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-3xl overflow-hidden shadow-sm backdrop-blur-xl">
        <motion.div 
          className="divide-y divide-gray-50 dark:divide-gray-700/50"
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
                className={`p-5 flex gap-4 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer relative ${!notif.isRead ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}
              >
                {!notif.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-red shadow-[0_0_10px_rgba(255,42,42,0.6)]"></div>
                )}
                <div className={`w-12 h-12 rounded-full ${style.bg} ${style.color} flex items-center justify-center flex-shrink-0 shadow-inner`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-bold ${!notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{notif.title}</h4>
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap ml-4">{formatTime(notif.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notif.body}</p>
                </div>
              </motion.div>
            );
          }) : (
            <motion.div variants={itemVariants} className="p-16 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">All caught up!</h3>
              <p>You have no notifications yet.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
