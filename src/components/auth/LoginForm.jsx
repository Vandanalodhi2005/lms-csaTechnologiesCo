"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Facebook } from "lucide-react";
import { loginSchema } from "@/validations/auth.validation.js";
import Button from "@/components/ui/Button.jsx";
import FormInput from "@/components/forms/FormInput.jsx";
import PasswordInput from "@/components/forms/PasswordInput.jsx";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 24 12c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.3A12 12 0 0 1 12.7 26l-6.6 5A20 20 0 0 0 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.2 5.3C41.3 34.5 44 29.7 44 24c0-1.2-.1-2.4-.4-3.5z"/>
  </svg>
);

export default function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "onTouched",
  });

  const switchMode = (mode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", mode);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const onSubmit = handleSubmit(async (_data) => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 900));
    } finally {
      setLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A]">Welcome Back!</h2>
        <p className="text-[#64748B] text-sm md:text-base">
          Login to continue your learning journey.
        </p>
      </div>

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

      <div>
        <div className="flex items-end justify-between gap-3 mb-1.5">
          <label htmlFor="login-password" className="text-sm font-medium text-[#0F172A]/80 inline-flex items-center gap-1">
            Password
            <span className="text-red-500 font-semibold">*</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-[#2563EB] hover:text-[#1d4ed8] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="login-password"
          required
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-12 rounded-xl shadow-sm"
        loading={loading || isSubmitting}
      >
        {loading || isSubmitting ? "Logging in…" : "Login"}
      </Button>

      <div className="relative py-1" role="separator" aria-orientation="horizontal">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E2E8F0]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-[#64748B]">or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors disabled:cursor-not-allowed disabled:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
          title="Google sign-in coming soon"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors disabled:cursor-not-allowed disabled:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
          title="Facebook sign-in coming soon"
        >
          <Facebook className="h-[18px] w-[18px] text-[#1877F2]" />
          Facebook
        </button>
      </div>

      <p className="text-center text-sm text-[#64748B] pt-1">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => switchMode("register")}
          className="font-semibold text-[#2563EB] hover:text-[#1d4ed8] hover:underline"
        >
          Register
        </button>
      </p>
    </form>
  );
}
