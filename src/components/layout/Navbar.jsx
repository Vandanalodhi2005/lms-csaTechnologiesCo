"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils";
import {
  Search,
  Menu,
  X,
  GraduationCap,
  ShoppingCart,
  Bell,
  Heart,
  User as UserIcon,
  LogOut,
  BookOpen,
  BarChart3,
  Settings,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import { useAuth } from "@/lib/auth-client.jsx";
import { ROLES } from "@/constants";
import { toast } from "sonner";

const navLinks = [
  { label: "Courses", href: "/courses" },
  { label: "Categories", href: "/categories" },
  { label: "Instructors", href: "/instructors" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
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
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } else {
      toast.error(res.message || "Logout failed");
    }
    setMenuOpen(false);
  };

  const dashboardUrl =
    user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN
      ? "/admin/dashboard"
      : user?.role === ROLES.INSTRUCTOR
      ? "/instructor/dashboard"
      : "/student/dashboard";

  const isHome = pathname === "/";
  const onPublicAuth = pathname?.startsWith("/auth");

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b backdrop-blur",
        isHome || onPublicAuth
          ? "bg-white/90 border-dark-100"
          : "bg-white/95 border-dark-100"
      )}
    >
      <div className="container-page h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-dark-900 group-hover:text-primary-700 transition-colors">
            Learn<span className="text-primary-600">Hub</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 flex-1 max-w-2xl">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active =
                pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors rounded-md",
                    active
                      ? "text-primary-700 bg-primary-50"
                      : "text-dark-600 hover:text-dark-900 hover:bg-dark-50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <form
            className="flex-1 max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              const q = e.target.q.value;
              if (q) router.push(`/courses?q=${encodeURIComponent(q)}`);
            }}
          >
            <Input
              name="q"
              placeholder="Search courses, instructors..."
              leftIcon={<Search />}
              className="h-9 bg-dark-50/70 border-dark-100"
            />
          </form>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {searchOpen ? (
            <div className="w-64 mr-2 animate-fadeIn">
              <Input
                leftIcon={<Search />}
                placeholder="Search courses..."
                autoFocus
                className="h-9"
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-dark-600"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          {user ? (
            <>
              <Link href="/student/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-dark-600 relative"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/student/notifications">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-dark-600 relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger flex" />
                </Button>
              </Link>
              <Link href="/student/courses" className="ml-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-dark-600"
                  aria-label="My Courses"
                >
                  <BookOpen className="h-5 w-5" />
                </Button>
              </Link>
              <div className="relative ml-1" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full p-0.5 hover:bg-dark-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <Avatar src={user.avatar} name={user.name} size="sm" ring />
                  <ChevronDown className="h-4 w-4 text-dark-500 hidden sm:block" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-dark-100 shadow-lg py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-dark-100 mb-1">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} name={user.name} size="md" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-dark-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-dark-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={dashboardUrl}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-dark-700 hover:bg-dark-50"
                    >
                      <BarChart3 className="h-4 w-4 text-dark-500" />
                      Dashboard
                    </Link>
                    <Link
                      href="/student/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-dark-700 hover:bg-dark-50"
                    >
                      <UserIcon className="h-4 w-4 text-dark-500" />
                      My Profile
                    </Link>
                    <Link
                      href="/student/settings"
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
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" leftIcon={<LogIn className="h-4 w-4" />}>
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="lg:hidden p-2 -mr-2 text-dark-700 hover:bg-dark-100 rounded-lg transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fadeIn">
          <div className="absolute inset-0 bg-dark-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white border-l border-dark-100 shadow-2xl flex flex-col">
            <div className="h-16 flex items-center justify-between px-5 border-b border-dark-100">
              <span className="font-bold text-lg">
                Learn<span className="text-primary-600">Hub</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-dark-700 hover:bg-dark-100 rounded-lg"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 border-b border-dark-100">
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
                <Input
                  name="q"
                  placeholder="Search courses..."
                  leftIcon={<Search />}
                />
              </form>
            </div>
            <nav className="p-3 space-y-1 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-dark-700 hover:bg-primary-50 hover:text-primary-700"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-dark-100 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2 mb-2">
                    <Avatar src={user.avatar} name={user.name} size="md" ring />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-dark-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-dark-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link href={dashboardUrl} onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full" leftIcon={<BarChart3 className="h-4 w-4" />}>
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full text-danger border-danger/20 hover:bg-danger/5"
                    onClick={handleLogout}
                    leftIcon={<LogOut className="h-4 w-4" />}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full" leftIcon={<LogIn className="h-4 w-4" />}>
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" leftIcon={<UserPlus className="h-4 w-4" />}>
                      Create Account
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
