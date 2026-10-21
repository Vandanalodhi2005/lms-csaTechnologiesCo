"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  BarChart3,
  ClipboardList,
  Users,
  UserCircle,
  Settings,
  Star,
  DollarSign,
  HelpCircle,
  GraduationCap,
  PanelLeftClose,
  Wallet,
  Sparkles,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar.jsx";
import BrandLogo from "./BrandLogo.jsx";

const navSections = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/instructor/dashboard", icon: LayoutDashboard, exact: true },
      { label: "My Courses", href: "/instructor/courses", icon: BookOpen, badge: "4" },
      { label: "Create Course", href: "/instructor/courses/create", icon: PlusCircle },
    ],
  },
  {
    title: "Teaching & Grading",
    items: [
      { label: "Students", href: "/instructor/students", icon: Users, badge: "1.2k" },
      {
        label: "Assignments",
        href: "/instructor/assignments",
        icon: ClipboardList,
        badge: "7 Due",
        badgeColor: "bg-amber-100 text-amber-700",
      },
      {
        label: "Q&A Discussions",
        href: "/instructor/qna",
        icon: HelpCircle,
        badge: "3 New",
        badgeColor: "bg-blue-100 text-blue-700",
      },
      { label: "Student Reviews", href: "/instructor/reviews", icon: Star, badge: "4.9 ★" },
    ],
  },
  {
    title: "Finance & Reports",
    items: [
      { label: "Analytics", href: "/instructor/analytics", icon: BarChart3 },
      { label: "Payouts & Revenue", href: "/instructor/payouts", icon: Wallet },
    ],
  },
  {
    title: "Preferences",
    items: [
      { label: "Public Profile", href: "/instructor/profile", icon: UserCircle },
      { label: "Settings", href: "/instructor/settings", icon: Settings },
    ],
  },
];

export default function InstructorSidebar({ collapsed = false, onToggle }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-slate-200/80 bg-white transition-all duration-300 select-none",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 border-b border-slate-100 px-4">
        {!collapsed ? (
          <Link href="/instructor/dashboard" className="flex items-center gap-2.5">
            <BrandLogo />
          </Link>
        ) : (
          <Link href="/instructor/dashboard" className="mx-auto" aria-label="Instructor Dashboard">
            <BrandLogo compact />
          </Link>
        )}

        {onToggle && !collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-4">
        {navSections.map((section, sIdx) => (
          <div key={section.title || sIdx} className="space-y-1">
            {!collapsed && section.title && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || (pathname?.startsWith(item.href + "/") && item.href !== "/instructor/courses/create");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-blue-600" : "text-slate-400"
                    )}
                  />
                  {!collapsed && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                            item.badgeColor || "bg-slate-100 text-slate-600"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Instructor Profile Footer */}
      <div className="p-3 border-t border-slate-100">
        <Link
          href="/instructor/profile"
          className={cn(
            "flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 transition-colors",
            collapsed && "justify-center p-1.5"
          )}
        >
          <Avatar
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
            name="Dr. Marcus Chen"
            size="sm"
            className="ring-1 ring-slate-200"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">Dr. Marcus Chen</p>
              <p className="text-[10px] text-blue-600 font-medium truncate">Lead Data Scientist</p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
