"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Inbox,
  ShieldCheck,
  Send,
} from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Alert from "@/components/ui/Alert.jsx";

const COOLDOWN_SECONDS = 60;

function maskEmail(email) {
  if (!email || typeof email !== "string") return null;
  const at = email.lastIndexOf("@");
  if (at < 0) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at);
  const keep = Math.min(2, local.length);
  const stars = Math.max(2, local.length - keep >= 2 ? local.length - keep : 2);
  return `${local.slice(0, keep)}${"*".repeat(stars)}${domain}`;
}

function IconBadge({ variant = "blue", children }) {
  const variants = {
    blue: "bg-[#EFF6FF] border-[#BFDBFE]",
    green: "bg-green-50 border-green-100",
    amber: "bg-amber-50 border-amber-100",
    navy: "bg-[#0F2F5F]/5 border-[#0F2F5F]/10",
  };
  return (
    <div
      className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border ${variants[variant]}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

function VerificationSuccessState() {
  return (
    <div className="space-y-6 text-center">
      <IconBadge variant="green">
        <CheckCircle2 className="h-7 w-7 text-green-600" strokeWidth={2.2} />
      </IconBadge>

      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A]">
          Email Verified!
        </h2>
        <p className="text-[#64748B] text-sm md:text-base leading-relaxed">
          Your email has been verified successfully. Your EduLearn account is now
          active.
        </p>
      </div>

      <div className="pt-2 space-y-3">
        <Link
          href="/auth?mode=login"
          className="inline-flex w-full items-center justify-center gap-2 h-12 rounded-xl bg-[#2563EB] px-6 text-base font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
        >
          <ShieldCheck className="h-5 w-5" />
          Go to Login
        </Link>
      </div>
    </div>
  );
}

function AlreadyVerifiedState() {
  return (
    <div className="space-y-6 text-center">
      <IconBadge variant="navy">
        <ShieldCheck className="h-7 w-7 text-[#0F2F5F]" strokeWidth={2.2} />
      </IconBadge>

      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A]">
          Email Already Verified
        </h2>
        <p className="text-[#64748B] text-sm md:text-base leading-relaxed">
          Your EduLearn account has already been verified. You can log in now.
        </p>
      </div>

      <div className="pt-2 space-y-3">
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

function InvalidTokenState({ onResend, resendLoading, cooldownRemaining }) {
  return (
    <div className="space-y-6 text-center">
      <IconBadge variant="amber">
        <AlertTriangle className="h-7 w-7 text-amber-600" strokeWidth={2.2} />
      </IconBadge>

      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A]">
          Link Expired
        </h2>
        <p className="text-[#64748B] text-sm md:text-base leading-relaxed">
          This verification link is invalid or has expired. Request a new
          verification email to continue.
        </p>
      </div>

      <div className="pt-2 space-y-3">
        <Button
          type="button"
          size="lg"
          className="w-full h-12 rounded-xl shadow-sm"
          loading={resendLoading}
          disabled={resendLoading || cooldownRemaining > 0}
          leftIcon={<Send className="h-5 w-5" />}
          onClick={onResend}
        >
          {resendLoading
            ? "Sending..."
            : cooldownRemaining > 0
              ? `Resend available in ${cooldownRemaining}s`
              : "Resend Verification Email"}
        </Button>

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

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const displayedEmail = React.useMemo(
    () => maskEmail(emailParam) || "your registered email address",
    [emailParam]
  );

  const [state, setState] = React.useState("idle");
  const [resendLoading, setResendLoading] = React.useState(false);
  const [resendSuccess, setResendSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState("");
  const [cooldownRemaining, setCooldownRemaining] = React.useState(0);

  const hasToken = typeof token === "string" && token.length > 0;

  React.useEffect(() => {
    let cancelled = false;
    async function verify() {
      if (!hasToken) return;
      try {
        setState("verifying");
        setServerError("");
        await new Promise((r) => setTimeout(r, 900));
        if (cancelled) return;
        const mock = token.toLowerCase();
        if (mock.startsWith("expired") || mock.startsWith("bad")) {
          setState("invalid");
        } else if (mock.startsWith("already")) {
          setState("already-verified");
        } else {
          setState("verified");
        }
      } catch {
        if (cancelled) return;
        setState("error");
        setServerError(
          "We couldn't complete email verification. Please request a new verification link and try again."
        );
      }
    }
    verify();
    return () => {
      cancelled = true;
    };
  }, [hasToken, token]);

  React.useEffect(() => {
    if (cooldownRemaining <= 0) return undefined;
    const t = window.setInterval(() => {
      setCooldownRemaining((n) => (n <= 1 ? 0 : n - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [cooldownRemaining]);

  const handleResend = React.useCallback(async () => {
    if (resendLoading || cooldownRemaining > 0) return;
    try {
      setResendSuccess(false);
      setServerError("");
      setResendLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      setResendSuccess(true);
      setCooldownRemaining(COOLDOWN_SECONDS);
      window.setTimeout(() => setResendSuccess(false), 4000);
    } catch {
      setServerError(
        "We couldn't send the verification email. Please try again in a moment."
      );
    } finally {
      setResendLoading(false);
    }
  }, [resendLoading, cooldownRemaining]);

  if (state === "verified") {
    return <VerificationSuccessState />;
  }
  if (state === "already-verified") {
    return <AlreadyVerifiedState />;
  }
  if (state === "invalid") {
    return (
      <InvalidTokenState
        onResend={handleResend}
        resendLoading={resendLoading}
        cooldownRemaining={cooldownRemaining}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-1">
          <IconBadge variant="blue">
            <Mail className="h-6 w-6 text-[#2563EB]" strokeWidth={2.2} />
          </IconBadge>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A]">
          Verify Your Email
        </h2>
        <p className="text-[#64748B] text-sm md:text-base leading-relaxed">
          We&apos;ve sent a verification link to your email address. Please check
          your inbox and click the link to activate your EduLearn account.
        </p>
      </div>

      <div className="rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] px-4 py-3 text-center">
        <p className="text-sm font-semibold text-[#0F2F5F] break-all">
          {displayedEmail}
        </p>
      </div>

      {state === "verifying" && (
        <Alert
          variant="info"
          title="Verifying your email..."
          description="This only takes a moment."
          className="rounded-xl"
        />
      )}

      {state === "error" && serverError && (
        <Alert
          variant="danger"
          title="Verification failed"
          description={serverError}
          className="rounded-xl"
        />
      )}

      {resendSuccess && (
        <div role="status" aria-live="polite">
          <Alert
            variant="success"
            title="Verification email sent"
            description="Verification email sent successfully. Please check your inbox and spam folder."
            className="rounded-xl"
          />
        </div>
      )}

      <div className="flex items-start gap-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] p-4 text-left">
        <Inbox className="h-5 w-5 text-[#2563EB] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#1E40AF]">
            Didn&apos;t receive the email?
          </p>
          <p className="text-sm text-[#1E40AF]/80 leading-relaxed mt-0.5">
            Check your spam or junk folder. If you still can&apos;t find it, you
            can request another verification email.
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        <Button
          type="button"
          size="lg"
          className="w-full h-12 rounded-xl shadow-sm"
          loading={resendLoading || state === "verifying"}
          disabled={
            resendLoading ||
            cooldownRemaining > 0 ||
            state === "verifying"
          }
          leftIcon={<Send className="h-5 w-5" />}
          onClick={handleResend}
        >
          {resendLoading
            ? "Sending..."
            : cooldownRemaining > 0
              ? `Resend available in ${cooldownRemaining}s`
              : "Resend Verification Email"}
        </Button>

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
