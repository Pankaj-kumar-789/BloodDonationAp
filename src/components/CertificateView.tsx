"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { Download, Link as LinkIcon, Heart, Share2, CheckCircle2, Droplet } from "lucide-react";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";

interface CertificateProps {
  id: string;
  donorName: string;
  hospitalName: string;
  date: string;
  bloodGroup: string;
  units: number;
}

export default function CertificateView({ donorName, hospitalName, date, bloodGroup, units, id }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [scale, setScale] = useState(1);
  const [certHeight, setCertHeight] = useState(600);
  
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && certificateRef.current) {
        // Read actual height so we never crop it
        const actualHeight = certificateRef.current.offsetHeight;
        setCertHeight(actualHeight > 0 ? actualHeight : 600);

        // Calculate the available width (minus some padding)
        const availableWidth = containerRef.current.offsetWidth - 32; 
        if (availableWidth < 850) {
          setScale(availableWidth / 850);
        } else {
          setScale(1);
        }
      }
    };
    
    // Initial check (delay slightly to ensure DOM is painted for offsetHeight)
    setTimeout(handleResize, 50);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fire confetti when they first see it!
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
    
    return () => clearInterval(interval);
  }, []);

  const downloadCertificate = useCallback(() => {
    if (certificateRef.current === null) return;
    
    // We override the inline transform scale back to 1 temporarily just for the export,
    // though html-to-image usually captures the raw node.
    toPng(certificateRef.current, { 
      cacheBust: true, 
      pixelRatio: 2, 
      backgroundColor: '#ffffff',
      style: { transform: 'scale(1)' } 
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `raktasetu-certificate-${id}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Oops, something went wrong!", err);
      });
  }, [id]);

  const [shareUrl, setShareUrl] = useState(`https://raktasetu.com/certificate/${id}`);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const shareText = `I just donated blood at ${hospitalName} through RaktaSetu! ❤️🩸 Join me in saving lives.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4 relative">
      
      {/* Custom Toast Notification */}
      <div className={`fixed top-6 right-6 sm:top-10 sm:right-10 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-medium transition-all duration-300 ease-out transform ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}>
        <CheckCircle2 className="w-5 h-5 text-green-400" />
        Certificate link copied!
      </div>

      {/* The Certificate Wrapper for Scaling */}
      <div ref={containerRef} className="w-full flex justify-center overflow-hidden" style={{ height: scale < 1 ? certHeight * scale : certHeight }}>
        <div 
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
          className="w-[850px] shrink-0"
        >
          <div 
            ref={certificateRef}
            className="relative bg-white w-[850px] min-h-[600px] shrink-0 p-5 flex flex-col items-center shadow-2xl"
          >
          {/* Faint Watermark Logo in Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Heart className="w-80 h-80 fill-primary-red text-primary-red" />
          </div>

          {/* Double Border System */}
          <div className="absolute inset-0 border-[6px] border-[#0a192f] m-3 pointer-events-none z-10"></div>
          <div className="absolute inset-0 border-[2px] border-primary-red m-4 pointer-events-none z-10"></div>
          
          {/* Corner Red Blood Drops */}
          <div className="absolute top-5 left-5 w-7 h-7 bg-white z-20 flex items-center justify-center rounded-br-full">
            <Droplet className="w-4 h-4 text-primary-red fill-primary-red" />
          </div>
          <div className="absolute top-5 right-5 w-7 h-7 bg-white z-20 flex items-center justify-center rounded-bl-full">
            <Droplet className="w-4 h-4 text-primary-red fill-primary-red" />
          </div>
          <div className="absolute bottom-5 left-5 w-7 h-7 bg-white z-20 flex items-center justify-center rounded-tr-full">
            <Droplet className="w-4 h-4 text-primary-red fill-primary-red" />
          </div>
          <div className="absolute bottom-5 right-5 w-7 h-7 bg-white z-20 flex items-center justify-center rounded-tl-full">
            <Droplet className="w-4 h-4 text-primary-red fill-primary-red" />
          </div>

          <div className="relative z-20 flex flex-col items-center w-full h-full px-10 pt-5 pb-3">
            
            {/* Header / Logo */}
            <div className="flex flex-col items-center mb-4">
              <div className="flex items-center gap-2.5">
                <Heart className="w-8 h-8 text-primary-red fill-primary-red" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[#0a192f] leading-none tracking-tight">RaktaSetu</span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1">Connecting Lives</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black text-[#0a192f] uppercase tracking-widest font-serif text-center leading-tight mb-2">
              Certificate <br />
              <span className="text-3xl">Of Appreciation</span>
            </h1>

            {/* Subtitle */}
            <div className="flex items-center gap-3 w-full justify-center mb-3">
              <div className="h-px bg-gray-300 w-20"></div>
              <Heart className="w-2.5 h-2.5 text-primary-red fill-primary-red" />
              <div className="h-px bg-gray-300 w-20"></div>
            </div>
            
            <p className="text-lg text-primary-red italic font-serif mb-2">For Your Life-Saving Contribution</p>
            <p className="text-base text-gray-600 mb-3 font-medium">This certificate is proudly presented to</p>

            {/* Recipient Name */}
            <h2 className="text-5xl text-primary-red mb-5" style={{ fontFamily: "'Brush Script MT', 'Great Vibes', cursive", fontWeight: 500 }}>
              {donorName}
            </h2>

            {/* Stats Pill */}
            <div className="flex items-center bg-white border border-red-200 rounded-full px-6 py-2.5 mb-5 shadow-sm">
              <div className="flex items-center gap-3 pr-6 border-r border-red-200">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                  <Droplet className="w-4 h-4 text-primary-red fill-primary-red" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-lg font-bold text-primary-red leading-none">{units} UNITS</span>
                  <span className="text-[9px] font-bold text-[#0a192f] uppercase tracking-wider mt-1">Donated</span>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-6">
                <div className="w-8 h-8 rounded-full bg-primary-red flex items-center justify-center text-white font-bold text-xs">
                  {bloodGroup.replace('_POS', '+').replace('_NEG', '-')}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-lg font-bold text-primary-red leading-none">{bloodGroup.replace('_POS', '+').replace('_NEG', '-')} BLOOD</span>
                  <span className="text-[9px] font-bold text-[#0a192f] uppercase tracking-wider mt-1">Donated</span>
                </div>
              </div>
            </div>

            {/* Main Text */}
            <p className="text-gray-700 text-center max-w-xl leading-relaxed text-base mb-5">
              In recognition of your selfless act of donating <span className="font-bold text-[#0a192f]">{units} unit(s)</span> of <span className="font-bold text-[#0a192f]">{bloodGroup.replace('_POS', '+').replace('_NEG', '-')} blood</span><br />
              at <span className="font-bold text-[#0a192f]">{hospitalName}</span> on <span className="font-bold text-[#0a192f]">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>.
            </p>

            {/* Footer Quote */}
            <div className="flex items-center gap-2.5 mb-auto">
              <span className="text-primary-red text-lg">🌿</span>
              <p className="text-lg text-primary-red italic font-serif">Your generosity has helped save lives.</p>
              <span className="text-primary-red text-lg scale-x-[-1]">🌿</span>
            </div>

            {/* Bottom Section Layout */}
            <div className="w-full flex justify-between items-end px-2 mt-auto pt-5">
              
              {/* Badge & Certificate ID Left Side */}
              <div className="flex items-center gap-3">
                {/* Custom CSS Badge */}
                <div className="w-20 h-20 rounded-full border-[2.5px] border-primary-red border-dashed flex flex-col items-center justify-center relative bg-red-50">
                  <div className="absolute -top-2 w-full text-center text-[6px] font-bold text-primary-red uppercase tracking-widest bg-white px-1">Raktasetu</div>
                  <Heart className="w-6 h-6 text-primary-red fill-primary-red mb-1" />
                  <span className="text-[7px] font-bold text-primary-red uppercase tracking-widest">Life Saver</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#0a192f]">Certificate ID</span>
                  <span className="text-xs font-bold text-primary-red">RS-{new Date(date).getFullYear()}-{id.substring(0,6).toUpperCase()}</span>
                  <span className="text-[9px] text-gray-500 mt-1">raktasetu.com/verify</span>
                </div>
              </div>

              {/* Date */}
              <div className="flex flex-col items-center mb-1">
                <div className="border-b border-gray-400 w-28 mb-1.5 pb-1 text-center">
                  <span className="text-xs font-bold text-[#0a192f]">{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Date</span>
              </div>

              {/* Signature */}
              <div className="flex flex-col items-center mb-1">
                <div className="font-serif text-2xl text-[#0a192f] -mb-1" style={{ fontFamily: "'Brush Script MT', cursive" }}>RaktaSetu Admin</div>
                <div className="border-b border-gray-400 w-40 mb-1.5"></div>
                <span className="text-xs font-bold text-primary-red">RaktaSetu Administration</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Authorized Signature</span>
              </div>

            </div>

            {/* Bottom Edge Footer */}
            <div className="w-full flex items-center justify-center gap-3 mt-4">
              <Heart className="w-2.5 h-2.5 text-primary-red fill-primary-red" />
              <span className="text-[10px] font-bold text-[#0a192f] uppercase tracking-[0.3em]">Thank You For Being A Hero</span>
              <Heart className="w-2.5 h-2.5 text-primary-red fill-primary-red" />
            </div>

          </div>
        </div>
      </div>
      </div>

      {/* Actions & Sharing */}
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Share Your Achievement</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Inspire your friends and family to donate blood by sharing this certificate.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:mt-0 justify-end">
          <button 
            onClick={downloadCertificate}
            className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-bold py-2.5 px-5 rounded-xl transition-colors shrink-0"
          >
            <Download className="w-4 h-4" /> Download Image
          </button>
          
          <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-800 mx-1"></div>
          
          <div className="flex items-center gap-2 shrink-0">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 flex items-center justify-center transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2]/20 flex items-center justify-center transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 flex items-center justify-center transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            
            <button 
              onClick={copyToClipboard}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            >
              <LinkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
