"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  BarChart3,
  ClipboardList,
  Users,
  UserCircle,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import BrandLogo from "./BrandLogo.jsx";
import Badge from "@/components/ui/Badge.jsx";
import InstructorSidebar from "./InstructorSidebar.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import { useAuth } from "@/lib/auth-client.jsx";
import { toast } from "sonner";

export function InstructorDashboardShell({ children, user }) {
  return (
    <GenericDashboardShell user={user} Sidebar={InstructorSidebar}>
      {children}
    </GenericDashboardShell>
  );
}

export function AdminDashboardShell({ children, user }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = React.useState(false);
  const quickCreateRef = React.useRef(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClick = (e) => {
      if (quickCreateRef.current && !quickCreateRef.current.contains(e.target)) {
        setQuickCreateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getPageTitle = () => {
    if (!pathname || pathname === "/admin/dashboard" || pathname === "/admin") return "Dashboard";
    const segment = pathname.split("/")[2] || "Dashboard";
    return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl z-10 flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
              <span className="font-bold text-lg text-slate-900">Lurni</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AdminSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header matching reference image */}
        <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center px-4 sm:px-8 justify-between gap-4">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-9 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-400 transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Quick Create Button */}
          <div className="relative flex items-center gap-2" ref={quickCreateRef}>
            <button
              onClick={() => setQuickCreateOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95"
            >
              <span className="text-base leading-none font-bold">+</span>
              <span>Quick Create</span>
            </button>

            {quickCreateOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Create New
                </div>
                <Link
                  href="/admin/courses?action=new"
                  onClick={() => setQuickCreateOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>New Course</span>
                </Link>
                <Link
                  href="/admin/assignments?action=new"
                  onClick={() => setQuickCreateOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ClipboardList className="w-4 h-4 text-slate-400" />
                  <span>New Assignment</span>
                </Link>
                <Link
                  href="/admin/quizzes?action=new"
                  onClick={() => setQuickCreateOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <span>New Quiz</span>
                </Link>
                <Link
                  href="/admin/students?action=new"
                  onClick={() => setQuickCreateOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Add Student</span>
                </Link>
                <Link
                  href="/admin/notifications?action=new"
                  onClick={() => setQuickCreateOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Bell className="w-4 h-4 text-slate-400" />
                  <span>Send Announcement</span>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-[#F8FAFC]">
          <div className="max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function GenericDashboardShell({ children, user, Sidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      toast.success("Logged out");
      router.push("/auth/login");
    } else {
      toast.error(res.message || "Logout failed");
    }
    setMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">
          <div
            className="absolute inset-0 bg-dark-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white border-r border-dark-100 shadow-2xl overflow-y-auto">
            <div className="h-16 flex items-center justify-between px-5 border-b border-dark-100">
              <Link href="/" className="flex items-center gap-2" aria-label="EduLearn Home">
                <BrandLogo />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-dark-700 hover:bg-dark-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-white/90 border-b border-dark-100 backdrop-blur sticky top-0 z-30 flex items-center px-4 sm:px-6 gap-3 justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-dark-700 hover:bg-dark-100 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Badge variant="primary" size="sm" className="hidden sm:inline-flex capitalize">
              {pathname?.split("/")[1]}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/" target="_blank" className="hidden md:block">
              <Button variant="ghost" size="icon" aria-label="View site">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger flex" />
            </Button>
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full p-0.5 hover:bg-dark-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <Avatar src={user?.avatar} name={user?.name} size="sm" ring />
                <div className="hidden sm:flex items-center gap-2 mr-1 text-left">
                  <div className="min-w-0 hidden md:block">
                    <p className="text-sm font-semibold text-dark-900 truncate leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs text-dark-500 truncate capitalize leading-none mt-0.5">
                      {user?.role}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-dark-500" />
                </div>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-dark-100 shadow-lg py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-dark-100 mb-1">
                    <div className="flex items-center gap-3">
                      <Avatar src={user?.avatar} name={user?.name} size="md" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-dark-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-dark-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/${user?.role}/profile`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-dark-700 hover:bg-dark-50"
                  >
                    <UserCircle className="h-4 w-4 text-dark-500" />
                    Profile
                  </Link>
                  <Link
                    href={`/${user?.role}/settings`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-dark-700 hover:bg-dark-50"
                  >
                    <Settings className="h-4 w-4 text-dark-500" />
                    Settings
                  </Link>
                  <div className="border-t border-dark-100 my-1.5" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-danger hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="container-page py-6 sm:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
