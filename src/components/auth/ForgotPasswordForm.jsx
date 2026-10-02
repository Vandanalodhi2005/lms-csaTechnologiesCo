"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle2, Inbox } from "lucide-react";
import { forgotPasswordSchema } from "@/validations/auth.validation.js";
import Button from "@/components/ui/Button.jsx";
import FormInput from "@/components/forms/FormInput.jsx";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (_data) => {
    try {
      setServerError("");
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1200));
      setSuccess(true);
    } catch (err) {
      setServerError(
        err?.message && err.message.length < 120
          ? err.message
          : "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  });

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border border-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" strokeWidth={2.2} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A]">
            Email Sent
          </h2>
          <p className="text-[#64748B] text-sm md:text-base leading-relaxed">
            If an account exists for this email address, we&apos;ve sent
            instructions to reset your password.
          </p>
        </div>

        <div className="flex items-start justify-center gap-3 p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-left">
          <Inbox className="h-5 w-5 text-[#2563EB] shrink-0 mt-0.5" />
          <p className="text-sm text-[#1E40AF] leading-relaxed">
            Please check your inbox and spam folder. If you don&apos;t receive the email
            within a few minutes, try again.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/auth?mode=login"
            className="inline-flex w-full items-center justify-center gap-2 h-12 rounded-xl bg-[#2563EB] px-6 text-base font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
          >
            Back to Login
          </Link>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setServerError("");
            }}
            className="text-sm font-semibold text-[#2563EB] hover:text-[#1d4ed8] hover:underline"
          >
            Didn&apos;t receive the email? Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
          <Mail className="h-6 w-6 text-[#2563EB]" strokeWidth={2.2} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A]">
          Forgot Your Password?
        </h2>
        <p className="text-[#64748B] text-sm md:text-base leading-relaxed">
          No worries. Enter your registered email address and we&apos;ll send you
          instructions to reset your password.
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

      <FormInput
        label="Email Address"
        required
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
        error={errors.email?.message}
        leftIcon={<Mail className="text-[#64748B]" />}
        {...register("email")}
      />

      <Button
        type="submit"
        size="lg"
        className="w-full h-12 rounded-xl shadow-sm"
        loading={loading || isSubmitting}
        disabled={loading || isSubmitting}
      >
        {loading || isSubmitting ? "Sending..." : "Send Reset Link"}
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
