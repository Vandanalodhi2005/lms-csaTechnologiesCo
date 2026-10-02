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
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/student/dashboard",
    icon: Home,
    exact: true,
  },
  {
    label: "My Courses",
    href: "/student/courses",
    icon: BookOpen,
  },
  {
    label: "Continue Learning",
    href: "/student/learning",
    icon: PlayCircle,
  },
  {
    label: "Quizzes",
    href: "/student/quizzes",
    icon: FileCheck,
  },
  {
    label: "Assignments",
    href: "/student/assignments",
    icon: ClipboardList,
  },
  {
    label: "Certificates",
    href: "/student/certificates",
    icon: Award,
  },
  {
    label: "Wishlist",
    href: "/student/wishlist",
    icon: Heart,
  },
  {
    label: "Notifications",
    href: "/student/notifications",
    icon: Bell,
  },
  {
    type: "divider",
  },
  {
    label: "Profile",
    href: "/student/profile",
    icon: UserCircle,
  },
  {
    label: "Settings",
    href: "/student/settings",
    icon: Settings,
  },
];

export default function StudentSidebar({ collapsed = false, onToggle }) {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-dark-100 bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn("flex items-center h-16 border-b border-dark-100 px-4", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <Link href="/student/dashboard" className="font-bold text-lg">
            Student<span className="text-primary-600">Panel</span>
          </Link>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2.5 space-y-0.5">
        {navItems.map((item, idx) => {
          if (item.type === "divider") {
            return <div key={idx} className={cn("my-2 border-t border-dark-100", collapsed ? "mx-2" : "")} />;
          }
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "sidebar-link",
                isActive && "sidebar-link-active bg-primary-50 text-primary-700",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      {onToggle && (
        <div className="border-t border-dark-100 p-2 hidden md:block">
          <button
            onClick={onToggle}
            className="w-full sidebar-link"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn("h-5 w-5 transition-transform", collapsed ? "rotate-180" : "")}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!collapsed && <span className="ml-auto text-xs">Collapse</span>}
          </button>
        </div>
      )}
    </aside>
  );
}
