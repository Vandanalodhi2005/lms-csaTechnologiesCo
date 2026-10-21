"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-client.jsx";
import { ROLES } from "@/constants";
import BrandLogo from "@/components/layout/BrandLogo.jsx";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setLoginError("Enter your administrator email and password.");
      return;
    }

    setLoginError("");
    setLoading(true);
    try {
      const res = await login({ email, password, rememberMe });
      if (res?.success) {
        const user = res.data;
        if (user?.role !== ROLES.ADMIN && user?.role !== ROLES.SUPER_ADMIN) {
          await logout();
          setLoginError("This account does not have administrator access.");
          return;
        }

        toast.success(`Welcome back, Administrator ${user?.name || ""}!`);
        router.push("/admin/dashboard");
      } else {
        setLoginError(res?.message || "Unable to sign in. Check your credentials and try again.");
      }
    } catch (err) {
      setLoginError(err?.message || "The login service could not be reached. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 h-16 border-b border-slate-800/80 bg-[#0B1324]/80 backdrop-blur px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo />
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
            Staff Only
          </span>
        </div>

        <Link
          href="/auth"
          className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>Student / Instructor Login</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#0C1527]/90 backdrop-blur-xl p-7 sm:p-9 shadow-2xl shadow-black/60 relative">
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                Security Gateway Active
              </span>
            </div>

            <div className="space-y-2 mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Admin Console
              </h1>
              <p className="text-sm text-slate-400">
                Restricted administrative portal. Authorized personnel only.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setLoginError("");
                    }}
                    placeholder="admin@edulearn.com"
                    className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 px-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Secret Key / Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError("");
                    }}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 px-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                >
                  {loginError}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                  />
                  <span>Keep session alive</span>
                </label>
                <span className="text-slate-500">256-Bit SSL Encrypted</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 px-4 text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials…</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    <span>Authenticate & Access Console</span>
                  </>
                )}
              </button>
            </form>

            {/* Notice */}
            <div className="mt-5 rounded-xl bg-slate-900/60 border border-slate-800 p-3 text-[11px] text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
              <p>
                <strong>No Registration:</strong> Administrator accounts cannot be created publicly. New staff accounts must be created from inside the Admin Panel.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>© 2026 EduLearn Internal Infrastructure. All access attempts are recorded.</p>
      </footer>
    </div>
  );
}
