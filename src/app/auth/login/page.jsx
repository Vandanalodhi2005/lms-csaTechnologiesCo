"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  Star,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-client.jsx";
import OAuthButtons from "@/components/auth/OAuthButtons.jsx";
import BrandLogo from "@/components/layout/BrandLogo.jsx";

function StudentLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/student/profile";
  const { login } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await login({ email, password, rememberMe });
      if (res?.success) {
        const user = res.data;
        toast.success(`Welcome back, ${user?.name || "User"}!`);
        if (user?.role === "admin" || user?.role === "super_admin") {
          router.push("/admin/dashboard");
        } else if (user?.role === "instructor") {
          router.push("/instructor/dashboard");
        } else {
          router.push(redirectUrl || "/student/dashboard");
        }
      } else {
        toast.error(res?.message || "Invalid email or password");
      }
    } catch (err) {
      toast.error(err?.message || "An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoStudentLogin = () => {
    setEmail("student.alex@edulearn.com");
    setPassword("StudentPass123!");
    toast.info("Demo credentials loaded! Click Sign In to continue.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandLogo />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/admin"
            aria-label="Admin login"
            title="Admin login"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
          >
            <Lock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Admin Login</span>
          </Link>
          <span className="text-xs sm:text-sm text-slate-500 hidden sm:inline">
            Don&apos;t have an account?
          </span>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>Register Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden grid lg:grid-cols-12 items-stretch">
          
          {/* Left Hero Panel (Visual & Testimonial) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background glowing orbs */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-xs font-semibold text-blue-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Learning Portal</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  Welcome back to your learning space
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Continue your courses, track your quiz scores, submit assignments, and earn verified certificates.
                </p>
              </div>

              {/* Learning stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
                  <p className="text-2xl font-bold text-white tracking-tight">680+</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Top-rated courses</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
                  <p className="text-2xl font-bold text-white tracking-tight">45,000+</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Active students</p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="relative z-10 pt-8 mt-8 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                &quot;EduLearn made it incredibly easy to learn React and UI Design. I completed my certification and landed my first internship!&quot;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center font-bold text-xs text-white">
                  AM
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Alex Morgan</p>
                  <p className="text-[10px] text-slate-400">Web Development Student</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full space-y-6">
              
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Student Sign In
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Access Your Student Portal
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Enter your credentials to manage your learning and profile.
                </p>
              </div>

              {/* 1-Click Demo Login Banner */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-950">Quick Student Preview</p>
                    <p className="text-[11px] text-blue-700">Pre-fill demo student credentials</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDemoStudentLogin}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
                >
                  Load Demo
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600 font-medium">Remember me for 30 days</span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-98"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Student Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <OAuthButtons />

              {/* Bottom security assurance */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SSL Secured & 256-bit encrypted authentication</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Simple Footer */}
      <footer className="h-14 border-t border-slate-200/80 bg-white/50 px-4 sm:px-8 flex items-center justify-between text-xs text-slate-500">
        <p>© 2026 EduLearn Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <StudentLoginForm />
    </React.Suspense>
  );
}
