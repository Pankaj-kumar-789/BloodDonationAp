"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import logo from "@/assets/logo.png";
import banner from "@/assets/hero-banner.png";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("An unexpected error occurred.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to the server.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAFA] font-sans">
      {/* Top/Left side - Banner Image */}
      <div className="flex h-48 lg:h-auto lg:w-1/2 relative bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100 shrink-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-100 to-white opacity-20 pointer-events-none z-10"></div>
        <div className="absolute inset-0 p-6 lg:p-12 flex flex-col justify-between z-20">
          <div className="hidden lg:block">
            <Link href="/">
              <img src={logo.src} alt="RaktaSetu Logo" className="h-12 w-auto object-contain mix-blend-multiply" />
            </Link>
          </div>
          <div className="mt-auto lg:mt-0">
            <h2 className="text-2xl lg:text-5xl font-extrabold text-white lg:text-gray-900 mb-2 lg:mb-4 drop-shadow-lg tracking-tight">Save Lives Today.</h2>
            <p className="text-sm lg:text-xl text-white lg:text-gray-600 max-w-md font-medium drop-shadow-lg hidden sm:block leading-relaxed">Join thousands of donors and hospitals connecting instantly to save lives in critical moments.</p>
          </div>
        </div>
        <img 
          src={banner.src} 
          alt="Blood Donation Banner" 
          className="w-full h-full object-cover object-center brightness-75 lg:brightness-100"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-0 relative">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="flex flex-col items-center mb-10">
              <div className="mb-6 h-16 w-auto flex items-center justify-center">
                <Link href="/" className="h-full">
                  <img 
                    src={logo.src} 
                    alt="RaktaSetu Logo" 
                    className="h-full w-auto object-contain mix-blend-multiply"
                  />
                </Link>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
              <p className="text-gray-500 text-sm font-medium mt-2">Log in to RaktaSetu</p>
            </div>

            {error && (
              <div className="bg-red-50 text-[#C62121] p-4 rounded-xl text-sm mb-6 text-center border border-red-100 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C62121]/20 focus:border-[#C62121] transition-all font-medium"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-900">Password</label>
                  <Link href="/forgot-password" className="text-sm font-bold text-[#C62121] hover:text-red-800 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C62121]/20 focus:border-[#C62121] transition-all font-medium pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C62121] hover:bg-red-800 text-white font-bold py-4 rounded-xl transition-all shadow-[0_8px_20px_rgb(198,33,33,0.3)] hover:-translate-y-0.5 mt-2 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? "Signing in..." : "Log In"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500 font-medium">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#C62121] font-bold hover:text-red-800 transition-colors ml-1">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

