"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  ClipboardList,
  Lightbulb,
  Award,
  BarChart3,
  FolderKanban,
  Megaphone,
  Settings,
  ChevronDown,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Presentation,
  Briefcase,
  Video,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar.jsx";
import BrandLogo from "./BrandLogo.jsx";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Instructors", href: "/admin/instructors", icon: GraduationCap },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Assignments", href: "/admin/assignments", icon: ClipboardList },
  { label: "Quizzes", href: "/admin/quizzes", icon: Lightbulb },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Resources", href: "/admin/categories", icon: FolderKanban },
  { label: "Announcements", href: "/admin/notifications", icon: Megaphone, badge: 9 },
];

const teamItems = [
  {
    name: "University Profs.",
    color: "bg-[#2563EB]",
    icon: Presentation,
  },
  {
    name: "Course Sells Agent",
    color: "bg-[#F59E0B]",
    icon: Briefcase,
  },
  {
    name: "Online Class Tutors",
    color: "bg-[#EF4444]",
    icon: Video,
  },
];

export default function AdminSidebar({ collapsed = false, onToggle }) {
  const pathname = usePathname();
  const [teamsOpen, setTeamsOpen] = React.useState(true);

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white border-r border-slate-200/80 transition-all duration-300 select-none z-20",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
        {!collapsed ? (
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <BrandLogo />
          </Link>
        ) : (
          <Link href="/admin/dashboard" className="mx-auto" aria-label="Admin Dashboard">
            <BrandLogo compact />
          </Link>
        )}

        <button
          onClick={onToggle}
          className={cn(
            "p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors",
            collapsed && "hidden"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-6">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname?.startsWith(item.href + "/");

            return (
              <Link
                key={item.label}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-100/90 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
                  collapsed && "justify-center px-0 py-2.5"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-slate-900" : "text-slate-400"
                  )}
                />
                {!collapsed && (
                  <span className="flex-1 truncate tracking-tight">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="w-5 h-5 rounded-full bg-[#EF4444] text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* TEAMS Section */}
        {!collapsed && (
          <div className="pt-2">
            <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <button
                onClick={() => setTeamsOpen((v) => !v)}
                className="flex items-center gap-1.5 hover:text-slate-700 transition-colors"
              >
                <ChevronDown
                  className={cn("w-3.5 h-3.5 transition-transform", !teamsOpen && "-rotate-90")}
                />
                <span>Teams</span>
              </button>
              <button
                className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                title="Add team"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {teamsOpen && (
              <div className="mt-1 space-y-1">
                {teamItems.map((team) => {
                  const Icon = team.icon;
                  return (
                    <button
                      key={team.name}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center text-white shrink-0 shadow-xs",
                          team.color
                        )}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="truncate text-xs font-medium text-slate-700">
                        {team.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <Link
          href="/admin/settings"
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* User Profile */}
        <div
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-100",
            collapsed && "justify-center px-1"
          )}
        >
          <Avatar
            name="Chelsea Nayek"
            size="sm"
            className="ring-1 ring-slate-200"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">Chelsea Nayek</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
