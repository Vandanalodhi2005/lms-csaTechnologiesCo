import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Bell, BookOpen, BriefcaseBusiness, CalendarDays, ChartColumn, CheckCircle2, Clock3, FileText, Sparkles, Target, Trophy, Users } from "lucide-react";
import Header from "@/components/layout/Header.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import Button from "@/components/ui/Button.jsx";
import StudentMobileNav from "@/components/dashboard/StudentMobileNav.jsx";
import StudentSidebar from "@/components/dashboard/StudentSidebar.jsx";
import StudentCourseTabs from "@/components/dashboard/StudentCourseTabs.jsx";
import { assignmentSummary, dashboardStats, enrolledCourses, learningGoal, recentActivities, student, upcomingActivities, quizSummary } from "@/constants/studentDashboard.js";

export const metadata = {
  title: "Student Dashboard | EduLearn",
  description: "Manage your EduLearn courses, learning progress, assignments, quizzes, and certificates.",
};

export default function DashboardPage() {
  const activeCourses = enrolledCourses.filter((course) => course.status === "in-progress");
  const completedCourses = enrolledCourses.filter((course) => course.status === "completed").length;
  const overallProgress = Math.round(
    enrolledCourses.reduce((total, course) => total + Number(course.progress || 0), 0) / Math.max(enrolledCourses.length, 1)
  );

  const stats = [
    { label: "Courses Enrolled", value: dashboardStats.enrolledCourses, icon: BookOpen },
    { label: "Courses Completed", value: dashboardStats.completedCourses, icon: CheckCircle2 },
    { label: "Learning Hours", value: `${dashboardStats.learningHours}h`, icon: Clock3 },
    { label: "Certificates", value: dashboardStats.certificates, icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <div className="container-page py-6 md:py-8 xl:py-10">
        <div className="flex gap-6">
          <aside className="hidden w-72 shrink-0 lg:block">
            <StudentSidebar currentPath="/dashboard" />
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
              <StudentMobileNav currentPath="/dashboard" />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#475569] shadow-sm hover:text-[#0F172A]"
                >
                  <Bell className="h-4 w-4" aria-hidden="true" />
                </button>
                <Avatar src={student.avatar} alt={student.name} name={student.name} size="sm" />
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Welcome back</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] md:text-4xl">Good Morning, {student.name.split(" ")[0]}! 👋</h1>
                <p className="mt-2 text-sm leading-6 text-[#475569] md:text-base">
                  Continue your learning journey and reach your goals with focused progress this week.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/courses">
                  <Button className="h-11 rounded-xl bg-[#0F2F5F] text-white hover:bg-[#143A72]">Explore Courses</Button>
                </Link>
              </div>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-[#64748B]">{stat.label}</p>
                        <p className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A]">{stat.value}</p>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mb-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Learning now</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">Continue Learning</h2>
                  </div>
                  <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
                    View all
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {activeCourses.slice(0, 2).map((course) => (
                    <article key={course.id} className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <div className="flex gap-3">
                        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[#E2E8F0]">
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#0F172A]">{course.title}</h3>
                          <p className="mt-1 text-xs text-[#64748B]">{course.instructor}</p>
                          <div className="mt-3 flex items-center justify-between gap-2 text-xs text-[#475569]">
                            <span>{course.progress}% Complete</span>
                            <span>{course.completedLessons} / {course.totalLessons} lessons</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                            <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${course.progress}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Link href={`/courses/${course.slug}`}>
                          <Button size="sm" className="h-9 rounded-lg bg-[#0F2F5F] text-white hover:bg-[#143A72]">
                            Continue Learning
                          </Button>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    <Users className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Student profile</p>
                    <h2 className="mt-1 text-xl font-bold text-[#0F172A]">Profile Summary</h2>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <Avatar src={student.avatar} alt={student.name} name={student.name} size="3xl" />
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-[#0F172A]">{student.name}</p>
                    <p className="truncate text-sm text-[#64748B]">{student.email}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 border-t border-[#E2E8F0] pt-4 text-sm text-[#475569]">
                  <div className="flex items-center justify-between gap-2">
                    <span>Enrolled Courses</span>
                    <span className="font-semibold text-[#0F172A]">{dashboardStats.enrolledCourses}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span>Completed</span>
                    <span className="font-semibold text-[#0F172A]">{completedCourses}</span>
                  </div>
                </div>
              </aside>
            </div>

            <div className="mb-8">
              <StudentCourseTabs courses={enrolledCourses} />
            </div>

            <div className="mb-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#16A34A]">
                    <ChartColumn className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Overview</p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Your Learning Progress</h2>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-[#475569]">Overall learning progress</p>
                    <span className="text-3xl font-bold text-[#0F172A]">{overallProgress}%</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#E2E8F0]">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA]" style={{ width: `${overallProgress}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-[#64748B]">You have completed {overallProgress}% of your enrolled learning.</p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <p className="text-sm text-[#64748B]">Completed courses</p>
                    <p className="mt-2 text-2xl font-bold text-[#0F172A]">{completedCourses}</p>
                  </div>
                  <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <p className="text-sm text-[#64748B]">Active courses</p>
                    <p className="mt-2 text-2xl font-bold text-[#0F172A]">{activeCourses.length}</p>
                  </div>
                  <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <p className="text-sm text-[#64748B]">Learning hours</p>
                    <p className="mt-2 text-2xl font-bold text-[#0F172A]">{dashboardStats.learningHours}h</p>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#EA580C]">
                    <Target className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Goal</p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Weekly Learning Goal</h2>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-[#475569]">
                    <span>{learningGoal.current} / {learningGoal.target} hours</span>
                    <span>{learningGoal.percentage}%</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#E2E8F0]">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#FDBA74]" style={{ width: `${learningGoal.percentage}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-[#64748B]">Stay consistent and finish strong this week.</p>
                </div>
              </section>
            </div>

            <div className="mb-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#22C55E]">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Activity</p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Recent Activity</h2>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                        {activity.type === "completed" ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : activity.type === "watched" ? <BookOpen className="h-4 w-4" aria-hidden="true" /> : <Clock3 className="h-4 w-4" aria-hidden="true" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#0F172A]">{activity.title}</p>
                        <p className="mt-1 text-xs text-[#64748B]">{activity.timeLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    <CalendarDays className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Timeline</p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Upcoming Activities</h2>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {upcomingActivities.map((task) => (
                    <div key={task.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-[#0F172A]">{task.title}</p>
                        <span className="rounded-full bg-[#EFF6FF] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2563EB]">{task.date}</span>
                      </div>
                      <p className="mt-2 text-sm text-[#64748B]">{task.detail}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mb-8 grid gap-6 lg:grid-cols-3">
              <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#475569]">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Assignments</p>
                    <h3 className="mt-1 text-xl font-bold text-[#0F172A]">Assignments</h3>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-[#475569]">
                  <div className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] p-3">
                    <span>Pending</span>
                    <span className="font-bold text-[#0F172A]">{assignmentSummary.pending}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] p-3">
                    <span>Completed</span>
                    <span className="font-bold text-[#0F172A]">{assignmentSummary.completed}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#16A34A]">
                    <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Assessments</p>
                    <h3 className="mt-1 text-xl font-bold text-[#0F172A]">Quizzes</h3>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-[#475569]">
                  <div className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] p-3">
                    <span>Pending</span>
                    <span className="font-bold text-[#0F172A]">{quizSummary.pending}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] p-3">
                    <span>Completed</span>
                    <span className="font-bold text-[#0F172A]">{quizSummary.completed}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#EA580C]">
                    <Trophy className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Achievements</p>
                    <h3 className="mt-1 text-xl font-bold text-[#0F172A]">Certificates</h3>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-3xl font-bold tracking-tight text-[#0F172A]">{dashboardStats.certificates}</p>
                  <p className="mt-2 text-sm text-[#64748B]">Certificates earned</p>
                  <Link href="/dashboard/certificates" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
                    View Certificates
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
