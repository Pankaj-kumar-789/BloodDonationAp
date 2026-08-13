"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px] w-full"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full blur-xl opacity-60 scale-150 animate-pulse transition-colors"></div>
        <div className="relative w-20 h-20 bg-white dark:bg-slate-900 border border-red-50 dark:border-red-900/30 rounded-3xl shadow-sm flex items-center justify-center text-[#C62121] dark:text-red-500 transform rotate-3 hover:rotate-0 transition-all duration-300">
          {icon}
        </div>
      </div>
      
      <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight transition-colors">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto mb-8 transition-colors">
        {description}
      </p>

      {action && (
        action.href ? (
          <Link 
            href={action.href}
            className="bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold py-3 px-8 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2"
          >
            {action.label}
          </Link>
        ) : (
          <button 
            onClick={action.onClick}
            className="bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold py-3 px-8 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2"
          >
            {action.label}
          </button>
        )
      )}
    </motion.div>
  );
}
