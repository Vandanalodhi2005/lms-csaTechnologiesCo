"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Briefcase, GraduationCap } from "lucide-react";
import { registerSchema } from "@/validations/auth.validation.js";
import { ROLES } from "@/constants";
import Button from "@/components/ui/Button.jsx";
import FormInput from "@/components/forms/FormInput.jsx";
import PasswordInput from "@/components/forms/PasswordInput.jsx";

const ROLE_OPTIONS = [
  { value: ROLES.STUDENT, label: "Student", description: "I want to learn new skills", icon: GraduationCap },
  { value: ROLES.INSTRUCTOR, label: "Instructor", description: "I want to teach and create courses", icon: Briefcase },
];

export default function RegisterForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: ROLES.STUDENT },
    mode: "onTouched",
  });

  const selectedRole = watch("role") || ROLES.STUDENT;

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
    <form onSubmit={onSubmit} noValidate className="space-y-4.5">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A]">Create Your Account</h2>
        <p className="text-[#64748B] text-sm md:text-base">
          Start your learning journey today.
        </p>
      </div>

      <FormInput
        label="Full Name"
        required
        placeholder="Enter your full name"
        autoComplete="name"
        leftIcon={<User className="text-[#64748B]" />}
        error={errors.name?.message}
        {...register("name")}
      />

      <FormInput
        label="Email Address"
        required
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
        leftIcon={<Mail className="text-[#64748B]" />}
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <PasswordInput
          label="Password"
          required
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordInput
          label="Confirm Password"
          required
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-[#0F172A]/80 mb-2">
          I want to join as
        </p>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          role="radiogroup"
          aria-label="Select account type"
        >
          {ROLE_OPTIONS.map(({ value, label, description, icon: Icon }) => {
            const selected = selectedRole === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setValue("role", value, { shouldValidate: true })}
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all text-left focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                  selected
                    ? "border-[#2563EB] bg-[#EFF6FF] shadow-sm"
                    : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    selected ? "bg-[#2563EB] text-white" : "bg-[#EFF6FF] text-[#2563EB]"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
                </span>
                <span className="min-w-0">
                  <span className={`block text-sm font-semibold ${selected ? "text-[#0F2F5F]" : "text-[#0F172A]"}`}>
                    {label}
                  </span>
                  <span className="block text-xs text-[#64748B] mt-0.5">{description}</span>
                </span>
              </button>
            );
          })}
        </div>
        <input type="hidden" {...register("role")} />
        {errors.role?.message && (
          <p className="mt-1.5 text-xs text-red-600">{errors.role.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-12 rounded-xl shadow-sm"
        loading={loading || isSubmitting}
      >
        {loading || isSubmitting ? "Creating account…" : "Create Account"}
      </Button>

      <p className="text-center text-xs text-[#64748B] leading-relaxed px-1">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="font-medium text-[#2563EB] hover:underline">
          Terms &amp; Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="font-medium text-[#2563EB] hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="text-center text-sm text-[#64748B] pt-0.5">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => switchMode("login")}
          className="font-semibold text-[#2563EB] hover:text-[#1d4ed8] hover:underline"
        >
          Login
        </button>
      </p>
    </form>
  );
}
