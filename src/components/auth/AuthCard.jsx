"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import LoginForm from "./LoginForm.jsx";
import RegisterForm from "./RegisterForm.jsx";

const TABS = [
  { id: "login", label: "Login" },
  { id: "register", label: "Register" },
];

export default function AuthCard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") === "register" ? "register" : "login";

  const setMode = (next) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full mx-auto max-w-[500px] bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_10px_30px_-15px_rgba(15,47,95,0.2)] p-6 sm:p-8 md:p-9">
      <div
        role="tablist"
        aria-label="Authentication mode"
        className="mb-6 md:mb-7 relative grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
      >
        {TABS.map((t, i) => {
          const active = mode === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setMode(t.id)}
              className={`relative z-10 flex items-center justify-center h-10 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 ${
                active
                  ? "text-white"
                  : "text-[#475569] hover:text-[#0F172A]"
              }`}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-lg bg-[#2563EB] shadow-[0_4px_14px_-4px_rgba(37,99,235,0.5)]"
                />
              )}
              {t.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`panel-${mode}`} aria-labelledby={`tab-${mode}`}>
        {mode === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
