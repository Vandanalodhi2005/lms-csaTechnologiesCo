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
} from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";
import StudentSidebar from "./StudentSidebar.jsx";
import { useAuth } from "@/lib/auth-client.jsx";
import { toast } from "sonner";

function buildSidebar(RoleSidebar) {
  return function DashboardShell({ children, user }) {
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

    const sidebarProps = RoleSidebar === StudentSidebar
      ? { collapsed, onToggle: () => setCollapsed((v) => !v) }
      : { collapsed, onToggle: () => setCollapsed((v) => !v) };

    return (
      <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
        <div className="hidden lg:flex">
          <RoleSidebar {...sidebarProps} />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">
            <div
              className="absolute inset-0 bg-dark-900/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white border-r border-dark-100 shadow-2xl overflow-y-auto">
              <div className="h-16 flex items-center justify-between px-5 border-b border-dark-100">
                <Link href="/" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold">LearnHub</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-dark-700 hover:bg-dark-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="py-2">
                <RoleSidebar />
              </div>
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
              <div className="flex items-center gap-2.5">
                <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
                  {pathname?.split("/")[1]?.toUpperCase()}
                </Badge>
              </div>
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
  };
}

export const StudentDashboardShell = buildSidebar(StudentSidebar);
export default StudentDashboardShell;
