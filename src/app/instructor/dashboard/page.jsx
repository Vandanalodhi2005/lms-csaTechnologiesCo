import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  DollarSign,
  FileText,
  MessageSquareText,
  Plus,
  Star,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar.jsx";
import { instructorDashboard } from "@/constants/instructorDashboard.js";

export const metadata = {
  title: "Instructor Dashboard | EduLearn",
  description: "Monitor course performance, student engagement, revenue, and key teaching activity.",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const statusStyles = {
  Published: "border border-[#BBF7D0] bg-[#ECFDF5] text-[#166534]",
  Draft: "border border-[#E2E8F0] bg-[#F8FAFC] text-[#475569]",
  Archived: "border border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]",
};

const iconMap = {
  users: Users,
  assignment: ClipboardList,
  check: CheckCircle2,
  star: Star,
};

const actionIcons = {
  plus: Plus,
  book: BookOpen,
  users: Users,
  clipboard: ClipboardList,
  chart: BarChart3,
  star: Star,
};

export default function InstructorDashboardPage() {
  const { instructor, stats, revenue, courses, recentEnrollments, recentActivity, upcomingTasks, pendingAssignments, studentOverview, ratingSummary, quickActions } = instructorDashboard;

  const statCards = [
    { label: "Total Courses", value: stats.totalCourses, change: "+2 this month", icon: BookOpen },
    { label: "Total Students", value: stats.totalStudents.toLocaleString("en-IN"), change: "+12.5% this month", icon: Users },
    { label: "Total Earnings", value: formatCurrency(stats.totalEarnings), change: "+8.4% this month", icon: Wallet },
    { label: "Average Rating", value: `${stats.averageRating.toFixed(1)}`, change: "4.9/5 from reviews", icon: Star },
  ];

  return (
    <div className="space-y-6">
      <header className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Avatar src={instructor.avatar} alt={instructor.name} name={instructor.name} size="xl" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Instructor dashboard</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] md:text-4xl">
                Good morning, {instructor.name.split(" ")[0]} 👋
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475569] md:text-base">
                Manage your courses, students, and teaching activity from one place.
              </p>
            </div>
          </div>

          <Link
            href="/instructor/courses/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2F5F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#143A72]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create New Course
          </Link>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Profile</p>
              <h2 className="mt-1 text-xl font-bold text-[#0F172A]">Instructor Summary</h2>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <Avatar src={instructor.avatar} alt={instructor.name} name={instructor.name} size="2xl" />
            <div className="min-w-0">
              <p className="truncate text-xl font-bold text-[#0F172A]">{instructor.name}</p>
              <p className="mt-1 text-sm text-[#64748B]">{instructor.title}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-sm text-[#475569]">
                <Star className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                Rating
              </span>
              <span className="text-base font-bold text-[#0F172A]">{instructor.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-sm text-[#475569]">
                <Users className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                Total Students
              </span>
              <span className="text-base font-bold text-[#0F172A]">{instructor.students.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-sm text-[#475569]">
                <BookOpen className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                Total Courses
              </span>
              <span className="text-base font-bold text-[#0F172A]">{instructor.courses}</span>
            </div>
          </div>
        </aside>

        <div className="grid gap-4 sm:grid-cols-2">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-[#64748B]">{stat.label}</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A]">{stat.value}</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-[#0F172A]">{stat.change}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#22C55E]">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Revenue</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Revenue Overview</h2>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <p className="text-sm text-[#64748B]">This Month</p>
              <p className="mt-2 text-3xl font-bold text-[#0F172A]">{formatCurrency(48500)}</p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <p className="text-sm text-[#64748B]">This Year</p>
              <p className="mt-2 text-3xl font-bold text-[#0F172A]">{formatCurrency(482000)}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex h-40 items-end gap-3" role="img" aria-label="Monthly revenue chart from April to September">
              {revenue.monthly.map((value, index) => {
                const max = Math.max(...revenue.monthly);
                const height = `${Math.max((value / max) * 100, 18)}%`;

                return (
                  <div key={revenue.labels[index]} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-full w-full items-end justify-center">
                      <span
                        className="block w-full rounded-t-xl bg-gradient-to-t from-[#2563EB] to-[#60A5FA]"
                        style={{ height }}
                        aria-label={`${revenue.labels[index]} revenue ${formatCurrency(value)}`}
                        title={`${revenue.labels[index]}: ${formatCurrency(value)}`}
                      />
                    </div>
                    <span className="text-xs font-medium text-[#64748B]">{revenue.labels[index]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
              <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Quick access</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Quick Actions</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {quickActions.map((action) => {
              const Icon = actionIcons[action.icon] || BookOpen;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-sm font-medium text-[#0F172A] transition hover:border-[#D5E7FF] hover:bg-[#F3F8FF]"
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {action.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Performance</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Course Performance</h2>
            </div>
            <Link href="/instructor/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
              View all
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {courses.map((course) => (
              <article key={course.name} className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#0F172A]">{course.name}</h3>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#475569]">
                      <span>{course.students.toLocaleString("en-IN")} students</span>
                      <span>★ {course.rating.toFixed(1)}</span>
                      <span>{course.completion}% completion</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <p className="text-sm font-semibold text-[#0F172A]">{formatCurrency(course.revenue)}</p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[course.status] || statusStyles.Draft}`}>
                      {course.status}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#16A34A]">
                <Users className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Students</p>
                <h2 className="mt-1 text-xl font-bold text-[#0F172A]">Student Overview</h2>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-sm text-[#64748B]">Total Students</p>
                <p className="mt-2 text-3xl font-bold text-[#0F172A]">{studentOverview.totalStudents.toLocaleString("en-IN")}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="text-sm text-[#64748B]">Active Learners</p>
                  <p className="mt-2 text-2xl font-bold text-[#0F172A]">{studentOverview.activeLearners.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="text-sm text-[#64748B]">Completed Courses</p>
                  <p className="mt-2 text-2xl font-bold text-[#0F172A]">{studentOverview.completedCourses.toLocaleString("en-IN")}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-sm text-[#64748B]">Average Completion</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-2xl font-bold text-[#0F172A]">{studentOverview.averageCompletion}%</span>
                  <span className="text-sm font-medium text-[#2563EB]">Strong</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFFBEB] text-[#D97706]">
                <Star className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Reviews</p>
                <h2 className="mt-1 text-xl font-bold text-[#0F172A]">Student Reviews</h2>
              </div>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <span className="text-4xl font-bold tracking-tight text-[#0F172A]">{ratingSummary.average.toFixed(1)}</span>
              <span className="pb-2 text-sm text-[#64748B]">Average Rating</span>
            </div>

            <div className="mt-3 flex items-center gap-1 text-[#F59E0B]" aria-label="4.9 out of 5 stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-current" aria-hidden="true" />
              ))}
            </div>

            <p className="mt-3 text-sm text-[#64748B]">Total Reviews: {ratingSummary.totalReviews}</p>

            <div className="mt-5 space-y-3">
              {ratingSummary.distribution.map((entry) => (
                <div key={entry.label} className="grid grid-cols-[72px_minmax(0,1fr)_42px] items-center gap-3 text-sm text-[#475569]">
                  <span>{entry.label}</span>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#E2E8F0]">
                    <div className="h-full rounded-full bg-[#F59E0B]" style={{ width: `${entry.count}%` }} />
                  </div>
                  <span className="text-right font-medium text-[#0F172A]">{entry.count}%</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Enrollments</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Recent Enrollments</h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {recentEnrollments.map((student) => (
              <div key={student.id} className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <Avatar src={student.avatar} alt={student.name} name={student.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#0F172A]">{student.name}</p>
                  <p className="truncate text-xs text-[#64748B]">{student.course}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#64748B]">Enrolled</p>
                  <p className="text-xs font-medium text-[#0F172A]">{student.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F4F6] text-[#475569]">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Tasks</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Upcoming Tasks</h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {upcomingTasks.map((task) => (
              <Link
                key={task.id}
                href={task.href}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 transition hover:border-[#D5E7FF] hover:bg-[#F3F8FF]"
              >
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{task.title}</p>
                  <p className="mt-1 text-xs text-[#64748B]">{task.count} pending</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
              <MessageSquareText className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Updates</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Recent Activity</h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {recentActivity.map((activity) => {
              const Icon = iconMap[activity.icon] || Users;
              return (
                <div key={activity.id} className="flex items-start gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-6 text-[#0F172A]">{activity.text}</p>
                    <p className="mt-1 text-xs text-[#64748B]">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#16A34A]">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Assignments</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Pending Assignments</h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {pendingAssignments.map((assignment) => (
              <div key={assignment.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{assignment.name}</p>
                    <p className="mt-1 text-xs text-[#64748B]">{assignment.course}</p>
                  </div>
                  <span className="rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#475569]">
                    {assignment.submissions} submissions
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[#64748B]">
                  <span>Due {assignment.dueDate}</span>
                  <Link href="/instructor/assignments" className="font-semibold text-[#2563EB]">
                    View Assignments
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
