"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  BarChart3,
  ClipboardList,
  Award,
  ShoppingCart,
  CreditCard,
  Tag,
  FileText,
  Bell,
  Settings,
  GraduationCap,
  UserCheck,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, exact: true },
  { type: "divider" },
  { label: "All Users", href: "/admin/users", icon: Users },
  { label: "Students", href: "/admin/students", icon: GraduationCap },
  { label: "Instructors", href: "/admin/instructors", icon: UserCheck },
  { type: "divider" },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Enrollments", href: "/admin/enrollments", icon: ClipboardList },
  { type: "divider" },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { type: "divider" },
  { label: "Quizzes", href: "/admin/quizzes", icon: ClipboardList },
  { label: "Assignments", href: "/admin/assignments", icon: FileText },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Reviews", href: "/admin/reviews", icon: Users },
  { type: "divider" },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
  { label: "System Health", href: "/admin/system-health", icon: Activity },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ collapsed = false }) {
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
          <Link href="/admin/dashboard" className="font-bold text-lg">
            Admin<span className="text-primary-600">Panel</span>
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
