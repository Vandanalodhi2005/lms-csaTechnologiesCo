"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { loginSchema } from "@/validations/auth.validation.js";
import Button from "@/components/ui/Button.jsx";
import FormInput from "@/components/forms/FormInput.jsx";
import PasswordInput from "@/components/forms/PasswordInput.jsx";
import OAuthButtons from "@/components/auth/OAuthButtons.jsx";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-client.jsx";
import { ROLES } from "@/constants";

export default function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { login } = useAuth();

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

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const res = await login(data);
      if (res?.success) {
        const user = res.data;
        toast.success(`Welcome back, ${user?.name || "User"}!`);

        const redirectParam = searchParams.get("redirect");
        if (redirectParam) {
          router.push(redirectParam);
        } else if (user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN) {
          router.push("/admin/dashboard");
        } else if (user?.role === ROLES.INSTRUCTOR) {
          router.push("/instructor/dashboard");
        } else {
          router.push("/student/dashboard");
        }
      } else {
        const errMsg = res?.message || "Invalid email or password";
        toast.error(errMsg);
        setError("password", { message: errMsg });
      }
    } catch (err) {
      toast.error(err?.message || "Sign in failed. Please check your credentials.");
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

      <OAuthButtons />

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
