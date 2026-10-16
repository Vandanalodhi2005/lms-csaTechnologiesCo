"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import {
  Home,
  BookOpen,
  PlayCircle,
  ClipboardList,
  Award,
  Heart,
  Bell,
  UserCircle,
  Settings,
  FileCheck,
  GraduationCap,
  Sparkles,
  PanelLeftClose,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar.jsx";

const navItems = [
  {
    label: "Dashboard",
    href: "/student/dashboard",
    icon: Home,
    exact: true,
  },
  {
    label: "My Courses",
    href: "/student/profile?tab=courses",
    icon: BookOpen,
  },
  {
    label: "Continue Learning",
    href: "/student/profile?tab=courses",
    icon: PlayCircle,
  },
  {
    label: "Certificates",
    href: "/student/profile?tab=certificates",
    icon: Award,
  },
  {
    label: "Honors & Badges",
    href: "/student/profile?tab=badges",
    icon: Sparkles,
  },
  {
    type: "divider",
  },
  {
    label: "Student Profile",
    href: "/student/profile",
    icon: UserCircle,
  },
  {
    label: "Account Security",
    href: "/student/profile?tab=security",
    icon: Settings,
  },
];

export default function StudentSidebar({ collapsed = false, onToggle }) {
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
          <Link href="/student/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Edu<span className="text-blue-600">Learn</span>
            </span>
          </Link>
        ) : (
          <div className="mx-auto">
            <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-4 h-4 text-blue-400" />
            </div>
          </div>
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

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
        {navItems.map((item, idx) => {
          if (item.type === "divider") {
            return (
              <div
                key={idx}
                className={cn("my-3 border-t border-slate-100", collapsed ? "mx-1" : "")}
              />
            );
          }
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || (pathname?.startsWith("/student/profile") && item.href === "/student/profile");

          return (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors",
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
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Student Profile Footer in Sidebar */}
      <div className="p-3 border-t border-slate-100">
        <Link
          href="/student/profile"
          className={cn(
            "flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 transition-colors",
            collapsed && "justify-center p-1.5"
          )}
        >
          <Avatar
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            name="Alex Morgan"
            size="sm"
            className="ring-1 ring-slate-200"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">Alex Morgan</p>
              <p className="text-[10px] text-blue-600 font-medium truncate">Active Student</p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
