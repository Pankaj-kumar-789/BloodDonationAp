"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import logo from "@/assets/logo.png";
import banner from "@/assets/hero-banner.png";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("redirectTo", "/dashboard"); // We'll have a role-based redirect later, for now /dashboard
    
    const result = await loginAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // If successful, NextAuth will automatically redirect
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left side - Banner Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-50 border-r border-gray-100 dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-light-red to-white dark:to-gray-900 opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 p-12 flex flex-col justify-between">
          <div>
            <img src={logo.src} alt="RaktaSetu Logo" className="h-12 w-auto object-contain mix-blend-multiply" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-md">Save Lives Today.</h2>
            <p className="text-lg text-gray-800 dark:text-gray-200 max-w-md font-medium drop-shadow-md">Join thousands of donors and hospitals connecting instantly to save lives in critical moments.</p>
          </div>
        </div>
        <img 
          src={banner.src} 
          alt="Blood Donation Banner" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col items-center mb-8">
              <div className="mb-6 h-16 w-auto flex items-center justify-center">
                <img 
                  src={logo.src} 
                  alt="RaktaSetu Logo" 
                  className={`h-full w-auto object-contain ${isDark ? '' : 'mix-blend-multiply'}`}
                  style={isDark ? { filter: 'invert(1) hue-rotate(180deg)', mixBlendMode: 'screen' } : {}}
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base mt-2">Log in to RaktaSetu</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-primary-red dark:text-red-400 p-4 rounded-xl text-sm mb-6 text-center border border-red-100 dark:border-red-800/50 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                  <Link href="/forgot-password" className="text-sm font-medium text-primary-red hover:text-red-700 dark:hover:text-red-400 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-red hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-red-200 dark:shadow-none mt-4 disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Log In"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary-red font-bold hover:text-red-700 dark:hover:text-red-400 ml-1">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
