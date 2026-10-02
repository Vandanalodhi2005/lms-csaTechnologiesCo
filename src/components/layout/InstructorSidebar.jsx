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
  MessageSquare,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/instructor/dashboard", icon: LayoutDashboard, exact: true },
  { label: "My Courses", href: "/instructor/courses", icon: BookOpen },
  { label: "Create Course", href: "/instructor/courses/create", icon: PlusCircle },
  {
    type: "divider",
  },
  { label: "Students", href: "/instructor/students", icon: Users },
  { label: "Assignments", href: "/instructor/assignments", icon: ClipboardList },
  { label: "Reviews", href: "/instructor/reviews", icon: MessageSquare },
  { label: "Analytics", href: "/instructor/analytics", icon: BarChart3 },
  {
    type: "divider",
  },
  { label: "Profile", href: "/instructor/profile", icon: UserCircle },
  { label: "Settings", href: "/instructor/settings", icon: Settings },
];

export default function InstructorSidebar({ collapsed = false }) {
  const pathname = usePathname();
  return (
    <div
      className={cn(
        "flex flex-col h-full w-full",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn("flex items-center h-16 border-b border-dark-100 px-4", collapsed && "justify-center")}>
        {!collapsed ? (
          <Link href="/instructor/dashboard" className="font-bold text-lg">
            Instructor<span className="text-primary-600">Panel</span>
          </Link>
        ) : null}
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2.5 space-y-0.5">
        {navItems.map((item, idx) => {
          if (item.type === "divider") {
            return <div key={idx} className={cn("my-2 border-t border-dark-100")} />;
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
    </div>
  );
}
