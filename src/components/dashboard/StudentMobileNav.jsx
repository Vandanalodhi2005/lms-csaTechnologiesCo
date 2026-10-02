"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, BarChart3, BookOpen, Award, ClipboardCheck, FileText, Heart, Home, Settings, User } from "lucide-react";
import { cn } from "@/utils";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: Home, exact: true },
  { label: "My Courses", href: "/courses", icon: BookOpen },
  { label: "Learning Progress", href: "/dashboard/progress", icon: BarChart3 },
  { label: "Assignments", href: "/courses", icon: FileText },
  { label: "Quizzes", href: "/courses", icon: ClipboardCheck },
  { label: "Certificates", href: "/dashboard/certificates", icon: Award },
  { label: "Wishlist", href: "/courses", icon: Heart },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function StudentMobileNav({ currentPath = "/dashboard" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        aria-label="Open mobile dashboard navigation"
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
        Menu
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-sm" aria-hidden="true" onClick={() => setOpen(false)}>
          <div
            className="absolute inset-y-0 left-0 w-[85%] max-w-xs overflow-y-auto border-r border-[#E2E8F0] bg-white p-4 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Student dashboard navigation"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F2F5F] text-white">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">EduLearn</p>
                  <p className="text-sm font-bold text-[#0F172A]">Student Dashboard</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-[#475569] hover:bg-[#F8FAFC]"
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <nav className="space-y-1" aria-label="Student dashboard navigation list">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact ? currentPath === item.href : currentPath.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive ? "bg-[#EFF6FF] text-[#2563EB]" : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
