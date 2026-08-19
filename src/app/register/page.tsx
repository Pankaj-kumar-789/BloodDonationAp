"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import logo from "@/assets/logo.png";
import banner from "@/assets/hero-banner.png";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAFA] dark:bg-slate-950 font-sans transition-colors">
      {/* Top/Left side - Banner Image */}
      <div className="flex h-48 lg:h-auto lg:w-1/2 relative bg-gray-50 dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-slate-800 shrink-0 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-100 to-white dark:from-red-900/40 dark:to-slate-900 opacity-20 pointer-events-none z-10 transition-colors"></div>
        <div className="absolute inset-0 p-6 lg:p-12 flex flex-col justify-between z-20">
          <div className="hidden lg:block">
            <Link href="/">
              <img src={logo.src} alt="RaktaSetu Logo" className="h-12 w-auto object-contain mix-blend-multiply dark:invert dark:hue-rotate-180 dark:mix-blend-screen transition-all" />
            </Link>
          </div>
          <div className="mt-auto lg:mt-0">
            <h2 className="text-2xl lg:text-5xl font-extrabold text-white lg:text-gray-900 dark:lg:text-white mb-2 lg:mb-4 drop-shadow-lg tracking-tight transition-colors">Be a Hero.</h2>
            <p className="text-sm lg:text-xl text-white lg:text-gray-600 dark:lg:text-gray-400 max-w-md font-medium drop-shadow-lg hidden sm:block leading-relaxed transition-colors">Join our growing community and help bridge the gap in medical emergencies.</p>
          </div>
        </div>
        <img 
          src={banner.src} 
          alt="Blood Donation Banner" 
          className="w-full h-full object-cover object-center brightness-75 lg:brightness-100"
        />
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-0 relative">
        <div className="w-full max-w-md relative z-10 flex flex-col">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-4 self-start">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-slate-800 transition-colors">
            <div className="flex flex-col items-center mb-10">
              <div className="mb-6 h-16 w-auto flex items-center justify-center">
                <Link href="/" className="h-full">
                  <img 
                    src={logo.src} 
                    alt="RaktaSetu Logo" 
                    className="h-full w-auto object-contain mix-blend-multiply dark:invert dark:hue-rotate-180 dark:mix-blend-screen transition-all"
                  />
                </Link>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">Join RaktaSetu</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2 transition-colors">Create an account to continue</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/50 text-[#C62121] p-4 rounded-xl text-sm mb-6 text-center border border-red-100 dark:border-red-900/50 font-medium transition-colors">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 transition-colors">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C62121]/20 focus:border-[#C62121] transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 transition-colors">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C62121]/20 focus:border-[#C62121] transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 transition-colors">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C62121]/20 focus:border-[#C62121] transition-all font-medium pr-12"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 transition-colors">I am a...</label>
                <select
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C62121]/20 focus:border-[#C62121] transition-all font-medium appearance-none"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="USER" className="dark:bg-slate-900">User (Need Blood)</option>
                  <option value="DONOR" className="dark:bg-slate-900">Blood Donor</option>
                  <option value="HOSPITAL" className="dark:bg-slate-900">Hospital</option>
                  <option value="BLOOD_BANK" className="dark:bg-slate-900">Blood Bank</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C62121] hover:bg-red-800 text-white font-bold py-4 rounded-xl transition-all shadow-[0_8px_20px_rgb(198,33,33,0.3)] hover:-translate-y-0.5 mt-6 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">
              Already have an account?{" "}
              <Link href="/login" className="text-[#C62121] font-bold hover:text-red-800 transition-colors ml-1">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
