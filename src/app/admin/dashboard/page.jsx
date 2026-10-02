import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import { adminDashboardData } from "@/constants/adminDashboard.js";

export const metadata = {
  title: "Admin Dashboard | EduLearn",
  description: "Overview of platform growth, course performance, payments, users, and platform health.",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

const statIcons = {
  users: Users,
  students: GraduationCapIcon,
  instructors: UserCheck,
  courses: BookOpen,
  published: CheckCircle2,
  approvals: AlertTriangle,
  enrollments: BriefcaseBusiness,
  revenue: CreditCard,
};

function formatCurrency(value) {
  const amount = Number(value || 0);
  return currencyFormatter.format(amount);
}

function formatNumber(value) {
  const number = Number(value || 0);
  return numberFormatter.format(number);
}

function statusBadgeVariant(status) {
  const normalized = status?.toLowerCase();
  if (normalized === "active" || normalized === "published" || normalized === "completed" || normalized === "operational") return "success";
  if (normalized === "pending" || normalized === "pending review" || normalized === "mock mode") return "warning";
  if (normalized === "suspended" || normalized === "draft") return "secondary";
  return "default";
}

function getActivityIcon(type) {
  if (type === "user") return UserCheck;
  if (type === "course") return BookOpen;
  if (type === "enrollment") return BriefcaseBusiness;
  if (type === "review") return Star;
  return ShieldCheck;
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "AD";
}

function RevenueChart() {
  const { months, values } = adminDashboardData.revenue;
  const chartHeight = 190;
  const chartWidth = 560;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * chartWidth;
      const y = chartHeight - ((value - min) / range) * (chartHeight - 25) - 8;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Sales overview</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">Platform Revenue</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#475569]">
          <TrendingUp className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />
          +8.4% vs last month
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]">This Month</p>
          <p className="mt-2 text-2xl font-bold text-[#0F172A]">{formatCurrency(adminDashboardData.revenue.summary.thisMonth)}</p>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]">This Year</p>
          <p className="mt-2 text-2xl font-bold text-[#0F172A]">{formatCurrency(adminDashboardData.revenue.summary.thisYear)}</p>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]">Previous Month</p>
          <p className="mt-2 text-2xl font-bold text-[#0F172A]">{formatCurrency(adminDashboardData.revenue.summary.previousMonth)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-52 w-full" role="img" aria-label="Revenue chart for Apr to Sep showing values from ₹3,20,000 to ₹4,85,000.">
          {[0, 1, 2, 3].map((row) => {
            const y = 18 + row * 42;
            return <line key={row} x1="0" x2={chartWidth} y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="4 6" />;
          })}
          <polyline
            fill="none"
            stroke="#2563EB"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
          {values.map((value, index) => {
            const x = (index / (values.length - 1)) * chartWidth;
            const y = chartHeight - ((value - min) / range) * (chartHeight - 25) - 8;
            return (
              <g key={months[index]}>
                <circle cx={x} cy={y} r="4.5" fill="#2563EB" />
                <text x={x} y={chartHeight - 2} textAnchor="middle" fontSize="11" fill="#64748B">{months[index]}</text>
                <title>{`${months[index]} revenue: ${formatCurrency(value)}`}</title>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function UserGrowthChart() {
  const { labels, students, instructors } = adminDashboardData.userGrowth;
  const width = 520;
  const height = 210;
  const padding = { top: 15, right: 15, bottom: 30, left: 25 };

  const buildLine = (values) => {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = Math.max(max - min, 1);

    return values
      .map((value, index) => {
        const x = padding.left + (index / (values.length - 1)) * (width - padding.left - padding.right);
        const y = height - padding.bottom - ((value - min) / range) * (height - padding.top - padding.bottom);
        return `${x},${y}`;
      })
      .join(" ");
  };

  return (
    <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Growth</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">User Growth</h2>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />Students</div>
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#0EA5E9]" />Instructors</div>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-52 w-full" role="img" aria-label="User growth chart for students and instructors from April to September.">
        {[0, 1, 2, 3].map((row) => (
          <line key={row} x1={padding.left} x2={width - padding.right} y1={padding.top + row * 40} y2={padding.top + row * 40} stroke="#E2E8F0" strokeDasharray="4 6" />
        ))}
        <polyline fill="none" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" points={buildLine(students)} />
        <polyline fill="none" stroke="#0EA5E9" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" points={buildLine(instructors)} />
        {labels.map((label, index) => {
          const x = padding.left + (index / (labels.length - 1)) * (width - padding.left - padding.right);
          return <text key={label} x={x} y={height - 6} textAnchor="middle" fontSize="11" fill="#64748B">{label}</text>;
        })}
      </svg>
    </div>
  );
}

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Users", value: formatNumber(adminDashboardData.stats.totalUsers), icon: statIcons.users, change: "+8.4% this month" },
    { label: "Total Students", value: formatNumber(adminDashboardData.stats.totalStudents), icon: statIcons.students, change: "+7.1% this month" },
    { label: "Total Instructors", value: formatNumber(adminDashboardData.stats.totalInstructors), icon: statIcons.instructors, change: "+3.2% this month" },
    { label: "Total Courses", value: formatNumber(adminDashboardData.stats.totalCourses), icon: statIcons.courses, change: "+2.6% this month" },
    { label: "Published Courses", value: formatNumber(adminDashboardData.stats.publishedCourses), icon: statIcons.published, change: "+5.1% this month" },
    { label: "Pending Approvals", value: formatNumber(adminDashboardData.stats.pendingApprovals), icon: statIcons.approvals, change: "Needs review" },
    { label: "Total Enrollments", value: formatNumber(adminDashboardData.stats.enrollments), icon: statIcons.enrollments, change: "+9.8% this month" },
    { label: "Platform Revenue", value: formatCurrency(adminDashboardData.stats.revenue), icon: statIcons.revenue, change: "+12.5% this month" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-[#64748B]">
          <Link href="/admin/dashboard" className="hover:text-[#2563EB]">Admin</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-[#0F172A]">Dashboard</span>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Admin overview</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] md:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 text-sm leading-6 text-[#475569] md:text-base">Monitor EduLearn activity, courses, users, and platform performance.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="default" leftIcon={<Search className="h-4 w-4" aria-hidden="true" />} className="hidden md:inline-flex">
              Quick Search
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative border border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9]">
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#2563EB]" aria-hidden="true" />
            </Button>
            <div className="flex items-center gap-3 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
              <Avatar name={adminDashboardData.admin.name} size="sm" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-[#0F172A]">{adminDashboardData.admin.name}</p>
                <p className="text-[11px] text-[#64748B]">{adminDashboardData.admin.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[#64748B]">{stat.label}</p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A]">{stat.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#16A34A]">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{stat.change}</span>
              </div>
            </article>
          );
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <RevenueChart />

        <aside className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Profile</p>
              <h2 className="mt-1 text-xl font-bold text-[#0F172A]">Admin User</h2>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4 rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <Avatar name={adminDashboardData.admin.name} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-[#0F172A]">{adminDashboardData.admin.name}</p>
              <p className="text-sm text-[#64748B]">{adminDashboardData.admin.role}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[#475569]">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <span>Last login</span>
              <span className="font-semibold text-[#0F172A]">Today</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <span>Active users</span>
              <span className="font-semibold text-[#0F172A]">{formatNumber(13420)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <span>Review queue</span>
              <span className="font-semibold text-[#0F172A]">{adminDashboardData.stats.pendingApprovals}</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <UserGrowthChart />

        <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#16A34A]">
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Overview</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Course Overview</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <p className="text-sm text-[#64748B]">Total Courses</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{formatNumber(adminDashboardData.courseOverview.total)}</p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <p className="text-sm text-[#64748B]">Published</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{formatNumber(adminDashboardData.courseOverview.published)}</p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <p className="text-sm text-[#64748B]">Draft</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{formatNumber(adminDashboardData.courseOverview.draft)}</p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <p className="text-sm text-[#64748B]">Pending Review</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{formatNumber(adminDashboardData.courseOverview.pending)}</p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:col-span-2">
              <p className="text-sm text-[#64748B]">Archived</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{formatNumber(adminDashboardData.courseOverview.archived)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Approvals</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">Pending Approvals</h2>
            </div>
            <Link href="/admin/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
              Review all
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-4">
            {adminDashboardData.pendingApprovals.map((course) => (
              <div key={course.id} className="flex flex-col gap-4 rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-[#0F172A]">{course.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#64748B]">
                    <span>{course.instructor}</span>
                    <span className="hidden md:inline">•</span>
                    <span>{course.submitted}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="warning" size="sm">{course.status}</Badge>
                  <Button href="/admin/courses" variant="outline" size="sm">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Members</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Recent Users</h2>
            </div>
          </div>

          <div className="space-y-3">
            {adminDashboardData.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-3 rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={user.name} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0F172A]">{user.name}</p>
                    <p className="truncate text-xs text-[#64748B]">{user.email}</p>
                  </div>
                </div>
                <div className="hidden text-right xl:block">
                  <p className="text-xs text-[#64748B]">{user.role}</p>
                  <p className="text-xs text-[#64748B]">{user.joined}</p>
                </div>
                <Badge variant={statusBadgeVariant(user.status)} size="sm">{user.status}</Badge>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Catalog</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">Recent Courses</h2>
            </div>
            <Link href="/admin/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
              View all
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-3">
            {adminDashboardData.recentCourses.map((course) => (
              <div key={course.id} className="grid gap-3 rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 md:grid-cols-[1.5fr_1fr_0.7fr_0.7fr_0.8fr] md:items-center">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{course.title}</p>
                  <p className="mt-1 text-xs text-[#64748B]">{course.instructor}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#64748B]">Category</p>
                  <p className="mt-1 text-sm text-[#475569]">{course.category}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#64748B]">Students</p>
                  <p className="mt-1 text-sm text-[#475569]">{formatNumber(course.students)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#64748B]">Status</p>
                  <div className="mt-1">
                    <Badge variant={statusBadgeVariant(course.status)} size="sm">{course.status}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#64748B]">Created</p>
                  <p className="mt-1 text-sm text-[#475569]">{course.created}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#16A34A]">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Monitoring</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">System Status</h2>
              </div>
            </div>

            <div className="space-y-3">
              {adminDashboardData.systemStatus.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-3 rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <span className="text-sm font-medium text-[#0F172A]">{item.name}</span>
                  <Badge variant={statusBadgeVariant(item.status)} size="sm">{item.status}</Badge>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#EA580C]">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Notifications</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Admin Alerts</h2>
              </div>
            </div>

            <div className="space-y-3">
              {adminDashboardData.alerts.map((alert) => (
                <div key={alert.id} className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <p className="text-sm text-[#475569]">{alert.text}</p>
                  <Link href={alert.href} className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
                    View details
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Orders</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">Recent Enrollments</h2>
            </div>
            <Link href="/admin/enrollments" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
              View all
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-3">
            {adminDashboardData.recentEnrollments.map((entry) => (
              <div key={entry.id} className="grid gap-3 rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 md:grid-cols-[1.1fr_1fr_0.8fr_0.7fr_0.7fr] md:items-center">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{entry.student}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#64748B]">Course</p>
                  <p className="mt-1 text-sm text-[#475569]">{entry.course}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#64748B]">Date</p>
                  <p className="mt-1 text-sm text-[#475569]">{entry.date}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#64748B]">Amount</p>
                  <p className="mt-1 text-sm text-[#475569]">{formatCurrency(entry.amount)}</p>
                </div>
                <div>
                  <Badge variant={statusBadgeVariant(entry.status)} size="sm">{entry.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
              <Star className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Feedback</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Platform Rating</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold tracking-tight text-[#0F172A]">{adminDashboardData.rating.average.toFixed(1)}</span>
            <div className="flex items-center gap-1 text-[#F59E0B]" aria-label="Average rating 4.8 out of 5 stars">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className={`h-4 w-4 ${index < Math.round(adminDashboardData.rating.average) ? "fill-current" : "text-[#CBD5E1] fill-none"}`} aria-hidden="true" />
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm text-[#64748B]">Average Platform Rating</p>
          <p className="mt-2 text-sm text-[#475569]">Total Reviews: {formatNumber(adminDashboardData.rating.totalReviews)}</p>

          <div className="mt-6 space-y-3">
            {adminDashboardData.rating.distribution.map((item) => (
              <div key={item.label} className="grid grid-cols-[70px_1fr_40px] items-center gap-3 text-sm text-[#475569]">
                <span>{item.label}</span>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#E2E8F0]">
                  <div className="h-full rounded-full bg-[#F59E0B]" style={{ width: `${item.percent}%` }} />
                </div>
                <span className="text-right font-medium text-[#0F172A]">{item.percent}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Activity</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Recent Activity</h2>
          </div>
        </div>

        <div className="space-y-4">
          {adminDashboardData.recentActivity.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start gap-3 rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#0F172A]">{activity.text}</p>
                  <p className="mt-1 text-xs text-[#64748B]">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Operations</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">Quick Actions</h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {adminDashboardData.quickActions.map((action) => (
            <Link key={action.label} href={action.href} className="flex items-center justify-between gap-3 rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-left transition hover:border-[#CBD5E1] hover:bg-[#F1F5F9]">
              <span className="text-sm font-medium text-[#0F172A]">{action.label}</span>
              <ArrowRight className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function GraduationCapIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props} aria-hidden="true">
      <path d="M12 3 2.5 8l9.5 5 9.5-5L12 3Z" />
      <path d="M6.5 10.2V15c0 1.8 2.5 3.5 5.5 3.5s5.5-1.7 5.5-3.5v-4.8" />
      <path d="M21.5 8v7" />
    </svg>
  );
}
