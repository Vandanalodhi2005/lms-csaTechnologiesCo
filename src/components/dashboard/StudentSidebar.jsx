import Link from "next/link";
import { BarChart3, BookOpen, Award, ClipboardCheck, FileText, Heart, Home, Settings, User } from "lucide-react";
import { cn } from "@/utils";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: Home, exact: true },
  { label: "My Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "Learning Progress", href: "/dashboard/progress", icon: BarChart3 },
  { label: "Assignments", href: "/dashboard/assignments", icon: FileText },
  { label: "Quizzes", href: "/courses", icon: ClipboardCheck },
  { label: "Certificates", href: "/dashboard/certificates", icon: Award },
  { label: "Wishlist", href: "/courses", icon: Heart },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function StudentSidebar({ currentPath = "/dashboard" }) {
  return (
    <aside className="h-full w-full rounded-[28px] border border-[#E2E8F0] bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#E2E8F0] px-3 pb-4 pt-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F2F5F] text-white shadow-sm">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Student</p>
          <p className="text-lg font-bold tracking-tight text-[#0F172A]">Dashboard</p>
        </div>
      </div>

      <nav className="mt-4 space-y-1" aria-label="Student dashboard navigation">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? currentPath === item.href : currentPath.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#EFF6FF] text-[#2563EB] shadow-sm"
                  : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
