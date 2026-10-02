"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, LogIn, UserPlus, Menu, X, Search } from "lucide-react";
import { cn } from "@/utils";
import Button from "@/components/ui/Button.jsx";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Instructors", href: "/instructors" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0]">
      <div className="container-page h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="h-8 w-8 rounded-lg bg-[#0F2F5F] flex items-center justify-center shadow-sm">
            <BookOpen className="h-4.5 w-4.5 text-white" style={{ height: 18, width: 18 }} />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
            Edu<span className="text-[#2563EB]">Learn</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(link.href + "/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-2 text-sm font-medium transition-colors rounded-md",
                  active
                    ? "text-[#2563EB] bg-[#EFF6FF]"
                    : "text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" leftIcon={<LogIn className="h-4 w-4" />}>
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm" leftIcon={<UserPlus className="h-4 w-4" />}>
              Sign Up
            </Button>
          </Link>
        </div>

        <button
          className="lg:hidden p-2 -mr-2 text-[#334155] hover:bg-[#F1F5F9] rounded-lg transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fadeIn">
          <div
            className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white border-l border-[#E2E8F0] shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="h-16 flex items-center justify-between px-5 border-b border-[#E2E8F0]">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#0F2F5F] flex items-center justify-center">
                  <BookOpen style={{ height: 18, width: 18 }} className="text-white" />
                </div>
                <span className="font-bold text-lg text-[#0F172A]">
                  Edu<span className="text-[#2563EB]">Learn</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[#334155] hover:bg-[#F1F5F9] rounded-lg"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 border-b border-[#E2E8F0]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = e.target.q.value;
                  if (q) {
                    setMobileOpen(false);
                    router.push(`/courses?q=${encodeURIComponent(q)}`);
                  }
                }}
              >
                <label htmlFor="mobile-search" className="sr-only">
                  Search courses
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                  <input
                    id="mobile-search"
                    name="q"
                    type="search"
                    placeholder="Search for courses..."
                    className="w-full h-10 rounded-lg border border-[#E2E8F0] bg-white pl-10 pr-3 text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                  />
                </div>
              </form>
            </div>
            <nav className="p-3 space-y-1 flex-1 overflow-y-auto" aria-label="Primary">
              {navLinks.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/" && pathname?.startsWith(link.href + "/"));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors",
                      active
                        ? "text-[#2563EB] bg-[#EFF6FF]"
                        : "text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-[#E2E8F0] space-y-2">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full" leftIcon={<LogIn className="h-4 w-4" />}>
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" leftIcon={<UserPlus className="h-4 w-4" />}>
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
