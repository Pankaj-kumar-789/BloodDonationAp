"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type TeamMember = {
  name: string;
  role: string;
  image: StaticImageData | string;
  bio: string;
  linkedin: string;
  instagram: string;
  facebook: string;
};

export default function TeamSlider({ members }: { members: TeamMember[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === members.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? members.length - 1 : prevIndex - 1));
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16 max-w-4xl mx-auto bg-gray-50 dark:bg-slate-950 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors min-h-[400px]">
      {/* Decorative background blob */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-100/50 dark:bg-red-900/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Navigation Buttons (only show if more than 1 member) */}
      {members.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary-red hover:border-primary-red transition-all shadow-md hidden sm:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary-red hover:border-primary-red transition-all shadow-md hidden sm:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col md:flex-row items-center gap-12 lg:gap-16 relative z-10"
        >
          <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 relative rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
            <Image 
              src={members[currentIndex].image} 
              alt={members[currentIndex].name} 
              fill
              className="object-cover object-[center_20%]"
            />
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h2 className="text-sm font-bold tracking-widest text-primary-red uppercase mb-2">Meet The Team</h2>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{members[currentIndex].name}</h3>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4">{members[currentIndex].role}</p>
            
            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-6 italic">
              {members[currentIndex].bio}
            </p>
            
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
              {/* LinkedIn */}
              {members[currentIndex].linkedin && (
                <a href={members[currentIndex].linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0077b5] text-white flex items-center justify-center hover:scale-110 transition-all shadow-md shadow-blue-200 dark:shadow-none group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              )}
              {/* Instagram */}
              {members[currentIndex].instagram && (
                <a href={members[currentIndex].instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white flex items-center justify-center hover:scale-110 transition-all shadow-md shadow-pink-200 dark:shadow-none group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              )}
              {/* Facebook */}
              {members[currentIndex].facebook && (
                <a href={members[currentIndex].facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166FE5] hover:scale-110 transition-all shadow-md shadow-blue-200 dark:shadow-none group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Mobile Dots Navigation */}
      {members.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:hidden z-20">
          {members.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === idx ? "bg-primary-red w-4" : "bg-gray-300 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
