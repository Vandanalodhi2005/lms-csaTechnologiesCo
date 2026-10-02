"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LockKeyhole,
  ArrowLeft,
  CheckCircle2,
  Check,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { resetPasswordSchema } from "@/validations/auth.validation.js";
import Button from "@/components/ui/Button.jsx";
import PasswordInput from "@/components/forms/PasswordInput.jsx";

const REQUIREMENTS = [
  {
    key: "length",
    label: "At least 8 characters",
    test: (pwd) => pwd.length >= 8,
  },
  {
    key: "upper",
    label: "One uppercase letter",
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    key: "lower",
    label: "One lowercase letter",
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    key: "number",
    label: "One number",
    test: (pwd) => /\d/.test(pwd),
  },
];

function getStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  const met = REQUIREMENTS.filter((r) => r.test(password)).length;
  let extra = 0;
  if (password.length >= 12) extra += 1;
  if (/[^A-Za-z0-9]/.test(password)) extra += 1;
  const score = Math.min(4, met + extra >= 6 ? 4 : met + extra >= 4 ? 3 : met >= 2 ? 2 : 1);

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500", text: "text-red-600" };
  if (score === 2) return { score, label: "Medium", color: "bg-amber-500", text: "text-amber-600" };
  if (score === 3) return { score, label: "Good", color: "bg-lime-500", text: "text-lime-600" };
  return { score, label: "Strong", color: "bg-green-600", text: "text-green-700" };
}

function StrengthMeter({ password }) {
  const { score, label, color, text } = getStrength(password);
  if (!password) {
    return (
      <div className="h-2 w-full rounded-full bg-[#E2E8F0]" aria-hidden="true" />
    );
  }
  const pct = (score / 4) * 100;
  return (
    <div aria-live="polite" className="space-y-1.5">
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]" aria-hidden="true">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#64748B]">Password strength</span>
        <span className={`font-semibold ${text}`}>{label}</span>
      </div>
    </div>
  );
}

function RequirementsList({ password }) {
  return (
    <div className="space-y-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
      <p className="text-xs font-semibold text-[#0F172A] uppercase tracking-wide">
        Password must contain
      </p>
      <ul className="space-y-1.5">
        {REQUIREMENTS.map((r) => {
          const ok = password ? r.test(password) : false;
          return (
            <li key={r.key} className="flex items-center gap-2">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                  ok ? "bg-green-100" : "bg-[#E2E8F0]"
                }`}
                aria-hidden="true"
              >
                <Check
                  className={`h-3 w-3 ${ok ? "text-green-600" : "text-[#94A3B8]"}`}
                  strokeWidth={3}
                />
              </span>
              <span
                className={`text-sm transition-colors ${
                  ok ? "text-[#0F172A] font-medium" : "text-[#64748B]"
                }`}
              >
                {r.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function InvalidTokenState() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 border border-amber-100">
        <AlertTriangle className="h-8 w-8 text-amber-600" strokeWidth={2.2} />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A]">
          Reset Link Invalid
        </h2>
        <p className="text-[#64748B] text-sm md:text-base leading-relaxed">
          This password reset link is invalid or has expired.
          Please request a new password reset link.
        </p>
      </div>

      <div className="pt-2 space-y-3">
        <Link
          href="/auth/forgot-password"
          className="inline-flex w-full items-center justify-center gap-2 h-12 rounded-xl bg-[#2563EB] px-6 text-base font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
        >
          <RefreshCw className="h-5 w-5" />
          Request New Reset Link
        </Link>
        <Link
          href="/auth?mode=login"
          className="inline-flex items-center justify-center w-full gap-1.5 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}

function SuccessState() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border border-green-100">
        <CheckCircle2 className="h-8 w-8 text-green-600" strokeWidth={2.2} />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A]">
          Password Reset Successful
        </h2>
        <p className="text-[#64748B] text-sm md:text-base leading-relaxed">
          Your password has been updated successfully. You can now log in
          using your new password.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/auth?mode=login"
          className="inline-flex w-full items-center justify-center gap-2 h-12 rounded-xl bg-[#2563EB] px-6 text-base font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState("");
  const [tokenInvalid, setTokenInvalid] = React.useState(false);

  const hasToken = typeof token === "string" && token.length > 0;

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema.omit({ token: true })),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const password = watch("password") || "";

  React.useEffect(() => {
    if (!hasToken) {
      setTokenInvalid(true);
    }
  }, [hasToken]);

  const onSubmit = handleSubmit(async (_data) => {
    try {
      setServerError("");
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1200));
      setSuccess(true);
    } catch (err) {
      const msg =
        err?.invalidToken || err?.expired
          ? null
          : err?.message && err.message.length < 120
            ? err.message
            : "We couldn't reset your password. Please request a new reset link and try again.";
      if (!msg) {
        setTokenInvalid(true);
      } else {
        setServerError(msg);
      }
    } finally {
      setLoading(false);
    }
  });

  if (tokenInvalid || !hasToken) {
    return <InvalidTokenState />;
  }

  if (success) {
    return <SuccessState />;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
          <LockKeyhole className="h-6 w-6 text-[#2563EB]" strokeWidth={2.2} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A]">
          Create New Password
        </h2>
        <p className="text-[#64748B] text-sm md:text-base leading-relaxed">
          Create a strong new password for your EduLearn account.
        </p>
      </div>

      {serverError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <svg
            className="h-5 w-5 text-red-500 shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-red-700 leading-relaxed">{serverError}</p>
        </div>
      )}

      <div className="space-y-4">
        <PasswordInput
          label="New Password"
          required
          placeholder="Enter your new password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordInput
          label="Confirm Password"
          required
          placeholder="Confirm your new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <StrengthMeter password={password} />

      <RequirementsList password={password} />

      <Button
        type="submit"
        size="lg"
        className="w-full h-12 rounded-xl shadow-sm"
        loading={loading || isSubmitting}
        disabled={loading || isSubmitting}
      >
        {loading || isSubmitting ? "Resetting..." : "Reset Password"}
      </Button>

      <Link
        href="/auth?mode=login"
        className="inline-flex items-center justify-center w-full gap-1.5 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 rounded-lg"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>
    </form>
  );
}
