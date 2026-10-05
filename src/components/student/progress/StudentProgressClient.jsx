"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import StudentMobileNav from "@/components/dashboard/StudentMobileNav.jsx";
import StudentSidebar from "@/components/dashboard/StudentSidebar.jsx";
import { student } from "@/constants/studentDashboard.js";
import { studentProgress } from "@/constants/studentProgress.js";
import { cn } from "@/utils";
import {
  ArrowDownWideNarrow,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flame,
  GraduationCap,
  ListChecks,
  PlayCircle,
  Search,
  Star,
  Target,
  Trophy,
  Video,
} from "lucide-react";

const dateRanges = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "Last 3 Months" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

const statusTabs = [
  { value: "all", label: "All" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Not Started", label: "Not Started" },
];

const sortOptions = [
  { value: "recent", label: "Recently Active" },
  { value: "high", label: "Highest Progress" },
  { value: "low", label: "Lowest Progress" },
  { value: "name", label: "Course Name" },
];

const statusVariant = {
  "In Progress": "info",
  Completed: "success",
  "Not Started": "secondary",
};

function ProgressTrack({ value, label, color = "bg-primary-600" }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
      role="progressbar"
      aria-label={label}
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={cn("h-full rounded-full transition-[width] motion-reduce:transition-none", color)} style={{ width: `${safeValue}%` }} />
    </div>
  );
}

function SummaryCard({ label, value, supporting, icon: Icon, tone = "blue" }) {
  const iconTone = tone === "green" ? "bg-emerald-50 text-emerald-700" : tone === "amber" ? "bg-amber-50 text-amber-700" : tone === "navy" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700";
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-slate-900">{value}</p>
        </div>
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", iconTone)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{supporting}</p>
    </article>
  );
}

function WeeklyActivityChart({ range }) {
  const chart = studentProgress.activityRanges[range];
  const total = chart.values.reduce((sum, item) => sum + item.hours, 0);
  const average = total / chart.averageDays;
  const maximum = Math.max(...chart.values.map((item) => item.hours), 1);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="weekly-activity-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Study rhythm</p>
          <h2 id="weekly-activity-heading" className="mt-1 text-xl font-bold text-slate-900">Learning Activity</h2>
        </div>
        <Badge variant="secondary">Demo data</Badge>
      </div>

      {chart.values.length ? (
        <>
          <div className="mt-5 flex h-44 items-end gap-2 border-b border-slate-200 px-1 sm:gap-3" role="img" aria-label={`${chart.label}: ${total.toFixed(1)} learning hours in total; average ${average.toFixed(2)} hours per day.`}>
            {chart.values.map((item) => (
              <div key={item.day} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[11px] font-medium tabular-nums text-slate-600">{item.hours}h</span>
                <div className="flex h-[68%] w-full items-end justify-center">
                  <div
                    className="w-full max-w-10 rounded-t-md bg-blue-600 transition-[height] motion-reduce:transition-none"
                    style={{ height: `${Math.max(8, (item.hours / maximum) * 100)}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="mb-2 max-w-full truncate text-[10px] text-slate-500 sm:text-xs">{item.day}</span>
              </div>
            ))}
          </div>
          <table className="sr-only">
            <caption>{chart.label} learning hours</caption>
            <thead><tr><th scope="col">Period</th><th scope="col">Hours</th></tr></thead>
            <tbody>{chart.values.map((item) => <tr key={item.day}><th scope="row">{item.day}</th><td>{item.hours}</td></tr>)}</tbody>
          </table>
          <p className="mt-4 text-sm leading-6 text-slate-600">{chart.label}: <strong className="font-semibold text-slate-900">{total.toFixed(1)} hours</strong> total, averaging <strong className="font-semibold text-slate-900">{average.toFixed(2)} hours/day</strong>.</p>
        </>
      ) : (
        <EmptyState icon="empty" title="No activity for this period" description="Learning activity will appear here as you study." compact />
      )}
    </section>
  );
}

function CourseAction({ course }) {
  if (course.status === "Completed") {
    return <Badge variant="success">Completed</Badge>;
  }

  const href = course.courseSlug === "javascript-masterclass"
    ? `/dashboard/courses/${course.courseSlug}`
    : `/courses/${course.courseSlug}`;
  const label = course.status === "Not Started" ? "Start Course" : "Continue";

  return (
    <Link href={href} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 text-sm font-semibold text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
      {label}<ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

function CourseProgress({ courses, onSort, sortBy }) {
  if (!courses.length) {
    return <EmptyState icon="search" title="No courses found" description="Try another search or progress filter." compact />;
  }

  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[850px] border-separate border-spacing-0 text-left">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th scope="col" className="border-b border-slate-200 px-3 py-3">Course</th>
              <th scope="col" className="border-b border-slate-200 px-3 py-3">Instructor</th>
              <th scope="col" className="border-b border-slate-200 px-3 py-3">Progress</th>
              <th scope="col" className="border-b border-slate-200 px-3 py-3">Lessons</th>
              <th scope="col" className="border-b border-slate-200 px-3 py-3">Last Activity</th>
              <th scope="col" className="border-b border-slate-200 px-3 py-3">Status</th>
              <th scope="col" className="border-b border-slate-200 px-3 py-3"><span className="sr-only">Action</span></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="align-middle hover:bg-slate-50/80">
                <th scope="row" className="border-b border-slate-100 px-3 py-4 font-normal">
                  <Link href={course.courseSlug === "javascript-masterclass" ? `/dashboard/courses/${course.courseSlug}` : `/courses/${course.courseSlug}`} className="flex min-w-48 items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image src={course.thumbnail} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block line-clamp-2 text-sm font-semibold text-slate-900">{course.title}</span>
                      <span className="mt-1 block text-xs text-slate-500">{course.category}</span>
                    </span>
                  </Link>
                </th>
                <td className="border-b border-slate-100 px-3 py-4">
                  <span className="flex min-w-32 items-center gap-2 text-sm text-slate-700">
                    <Avatar src={course.instructorAvatar} name={course.instructor} alt={course.instructor} size="xs" />
                    <span className="truncate">{course.instructor}</span>
                  </span>
                </td>
                <td className="min-w-36 border-b border-slate-100 px-3 py-4">
                  <div className="flex items-center gap-2"><span className="w-9 text-sm font-semibold tabular-nums text-slate-900">{course.progress}%</span><ProgressTrack value={course.progress} label={`${course.title} progress`} color={course.status === "Completed" ? "bg-emerald-600" : undefined} /></div>
                </td>
                <td className="border-b border-slate-100 px-3 py-4 text-sm tabular-nums text-slate-700">{course.completedLessons}/{course.totalLessons}</td>
                <td className="border-b border-slate-100 px-3 py-4 text-sm text-slate-600">{course.lastActivity}</td>
                <td className="border-b border-slate-100 px-3 py-4"><Badge variant={statusVariant[course.status]}>{course.status}</Badge></td>
                <td className="border-b border-slate-100 px-3 py-4"><CourseAction course={course} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="sr-only">Sorted by {sortOptions.find((option) => option.value === sortBy)?.label}</div>
        <button type="button" onClick={onSort} className="sr-only">Change course sort order</button>
      </div>

      <div className="space-y-3 lg:hidden">
        {courses.map((course) => (
          <article key={course.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex gap-3">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <Image src={course.thumbnail} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold text-slate-900">{course.title}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500"><Avatar src={course.instructorAvatar} name={course.instructor} alt={course.instructor} size="2xs" />{course.instructor}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <Badge variant={statusVariant[course.status]}>{course.status}</Badge>
              <span className="text-xs text-slate-500">{course.lastActivity}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-600">
              <span>{course.completedLessons} / {course.totalLessons} lessons</span>
              <span className="font-semibold text-slate-900">{course.progress}%</span>
            </div>
            <div className="mt-2"><ProgressTrack value={course.progress} label={`${course.title} progress`} color={course.status === "Completed" ? "bg-emerald-600" : undefined} /></div>
            <div className="mt-4 flex justify-end"><CourseAction course={course} /></div>
          </article>
        ))}
      </div>
    </>
  );
}

function ScoreRows({ items, label }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3">
          <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{item.title}</span>
          <div className="w-20"><ProgressTrack value={item.score} label={`${item.title} score`} color="bg-blue-600" /></div>
          <span className="w-10 text-right text-sm font-semibold tabular-nums text-slate-900">{item.score}{label === "quiz" ? "%" : "/100"}</span>
        </li>
      ))}
    </ul>
  );
}

export default function StudentProgressClient() {
  const [dateRange, setDateRange] = React.useState("week");
  const [activeStatus, setActiveStatus] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState("recent");

  const summary = studentProgress.summary;
  const overall = studentProgress.overall;
  const passRate = Math.round((studentProgress.quizPerformance.passed / studentProgress.quizPerformance.attempted) * 100);
  const goalProgress = Math.min(100, Math.round((studentProgress.learningGoal.completedHours / studentProgress.learningGoal.weeklyHours) * 100));

  const filteredCourses = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const matching = studentProgress.courseProgress.filter((course) => {
      const statusMatch = activeStatus === "all" || course.status === activeStatus;
      const searchMatch = !query || [course.title, course.instructor, course.category].some((value) => value.toLowerCase().includes(query));
      return statusMatch && searchMatch;
    });

    return matching.sort((first, second) => {
      if (sortBy === "high") return second.progress - first.progress;
      if (sortBy === "low") return first.progress - second.progress;
      if (sortBy === "name") return first.title.localeCompare(second.title);
      return new Date(second.lastActivityAt || 0) - new Date(first.lastActivityAt || 0);
    });
  }, [activeStatus, search, sortBy]);

  const weeklyRange = studentProgress.activityRanges[dateRange];
  const weekHours = studentProgress.activityRanges.week.values.reduce((total, item) => total + item.hours, 0);
  const remainingGoalHours = Math.max(0, studentProgress.learningGoal.weeklyHours - weekHours);

  const summaryCards = [
    { label: "Total Courses", value: summary.totalCourses, supporting: "In your learning library", icon: BookOpen, tone: "blue" },
    { label: "Completed Courses", value: summary.completedCourses, supporting: "Finished learning paths", icon: CheckCircle2, tone: "green" },
    { label: "Lessons Completed", value: summary.lessonsCompleted, supporting: `Across ${summary.totalCourses} courses`, icon: GraduationCap, tone: "navy" },
    { label: "Learning Hours", value: `${summary.learningHours}h`, supporting: "+8.4h this month · demo", icon: Clock3, tone: "amber" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <div className="container-page py-6 md:py-8 xl:py-10">
        <div className="flex min-w-0 gap-6">
          <aside className="hidden w-72 shrink-0 lg:block"><StudentSidebar currentPath="/dashboard/progress" /></aside>
          <main className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
              <StudentMobileNav currentPath="/dashboard/progress" />
              <Avatar src={student.avatar} alt={student.name} name={student.name} size="sm" />
            </div>

            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
              <Link href="/dashboard" className="hover:text-primary-600">Dashboard</Link>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <span aria-current="page" className="font-medium text-slate-900">Progress</span>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Learning overview</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">My Learning Progress</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Track your learning journey, course completion, activity, and overall performance.</p>
              </div>
              <div className="w-full sm:w-48">
                <label htmlFor="progress-date-range" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Activity period</label>
                <select id="progress-date-range" value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15">
                  {dateRanges.map((range) => <option key={range.value} value={range.value}>{range.label}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => <SummaryCard key={card.label} {...card} />)}
            </div>

            <div className="mb-6 grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
              <section className="min-w-0 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="overall-progress-heading">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Across your courses</p>
                    <h2 id="overall-progress-heading" className="mt-1 text-xl font-bold text-slate-900">Overall Learning Progress</h2>
                  </div>
                  <Badge variant="info">Demo metrics</Badge>
                </div>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                  <p className="text-5xl font-bold tracking-tight text-slate-900">{overall.percentage}<span className="text-2xl text-slate-500">%</span></p>
                  <p className="pb-1 text-sm text-slate-600">Overall completion</p>
                </div>
                <div className="mt-4"><ProgressTrack value={overall.percentage} label="Overall learning progress" /></div>
                <p className="mt-2 text-sm tabular-nums text-slate-600">{overall.completedLessons} / {overall.totalLessons} lessons completed</p>
                <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3"><p className="text-lg font-bold text-emerald-800">{overall.completedCourses}</p><p className="mt-1 text-[11px] leading-4 text-emerald-700 sm:text-xs">Completed courses</p></div>
                  <div className="rounded-xl bg-blue-50 p-3"><p className="text-lg font-bold text-blue-800">{overall.inProgressCourses}</p><p className="mt-1 text-[11px] leading-4 text-blue-700 sm:text-xs">In progress</p></div>
                  <div className="rounded-xl bg-slate-100 p-3"><p className="text-lg font-bold text-slate-800">{overall.notStartedCourses}</p><p className="mt-1 text-[11px] leading-4 text-slate-600 sm:text-xs">Not started</p></div>
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-600">You&apos;re making steady progress in this demo learning profile. Keep learning consistently to reach your goals.</p>
              </section>

              <WeeklyActivityChart range={dateRange} />
            </div>

            <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="course-progress-heading">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Course-by-course</p>
                  <h2 id="course-progress-heading" className="mt-1 text-xl font-bold text-slate-900">Course Progress</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:w-[540px]">
                  <div className="relative">
                    <label htmlFor="progress-search" className="sr-only">Search courses</label>
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input id="progress-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses..." className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/15" />
                  </div>
                  <div>
                    <label htmlFor="progress-sort" className="sr-only">Sort courses</label>
                    <select id="progress-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15">
                      {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Filter courses by progress">
                {statusTabs.map((tab) => (
                  <button key={tab.value} type="button" role="tab" aria-selected={activeStatus === tab.value} aria-current={activeStatus === tab.value ? "true" : undefined} onClick={() => setActiveStatus(tab.value)} className={cn("min-h-10 rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500", activeStatus === tab.value ? "border-blue-200 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <CourseProgress courses={filteredCourses} sortBy={sortBy} onSort={() => setSortBy("recent")} />
              </div>
            </section>

            <div className="mb-6 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="streak-heading">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Study rhythm</p><h2 id="streak-heading" className="mt-1 text-xl font-bold text-slate-900">Learning Streak</h2></div>
                  <span className="rounded-xl bg-amber-50 p-2.5 text-amber-700"><Flame className="h-5 w-5" aria-hidden="true" /></span>
                </div>
                <p className="mt-4 text-xs text-slate-500">Simulated activity · demo data</p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div><p className="text-2xl font-bold text-slate-900">{studentProgress.streak.currentDays} days</p><p className="mt-1 text-xs text-slate-500">Current streak</p></div>
                  <div><p className="text-2xl font-bold text-slate-900">{studentProgress.streak.bestDays} days</p><p className="mt-1 text-xs text-slate-500">Best streak</p></div>
                  <div><p className="text-2xl font-bold text-slate-900">{studentProgress.streak.learningDaysThisMonth}</p><p className="mt-1 text-xs text-slate-500">Days this month</p></div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-1 border-t border-slate-100 pt-4">
                  {studentProgress.streak.week.map((day, index) => (
                    <div key={`${day.day}-${index}`} className="flex flex-col items-center gap-2">
                      <span className="text-xs text-slate-500">{day.day}</span>
                      <span className={cn("flex h-7 w-7 items-center justify-center rounded-full border", day.active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-400")} aria-label={`${day.day}: ${day.active ? "learning activity" : "no activity"}`}>
                        {day.active ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <span aria-hidden="true">-</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="goal-heading">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Weekly target</p><h2 id="goal-heading" className="mt-1 text-xl font-bold text-slate-900">Learning Goal</h2></div>
                  <span className="rounded-xl bg-blue-50 p-2.5 text-blue-700"><Target className="h-5 w-5" aria-hidden="true" /></span>
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-900">{studentProgress.learningGoal.weeklyHours} hours <span className="text-sm font-medium text-slate-500">weekly goal</span></p>
                <div className="mt-4 flex items-center justify-between gap-3 text-sm"><span className="text-slate-600">{weekHours.toFixed(1)} / {studentProgress.learningGoal.weeklyHours} hours completed</span><span className="font-semibold text-slate-900">{goalProgress}%</span></div>
                <div className="mt-2"><ProgressTrack value={goalProgress} label="Weekly learning goal progress" /></div>
                <p className="mt-3 text-sm text-slate-600">{remainingGoalHours > 0 ? `${remainingGoalHours.toFixed(1)} hours remaining to reach your weekly goal.` : "Weekly learning goal reached in this demo."}</p>
              </section>
            </div>

            <div className="mb-6 grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="quiz-heading">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Knowledge checks</p><h2 id="quiz-heading" className="mt-1 text-xl font-bold text-slate-900">Quiz Performance</h2></div>
                  <span className="rounded-xl bg-blue-50 p-2.5 text-blue-700"><ListChecks className="h-5 w-5" aria-hidden="true" /></span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-lg font-bold text-slate-900">{studentProgress.quizPerformance.attempted}</p><p className="text-xs text-slate-500">Attempted</p></div>
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-lg font-bold text-slate-900">{studentProgress.quizPerformance.passed}</p><p className="text-xs text-slate-500">Passed</p></div>
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-lg font-bold text-slate-900">{studentProgress.quizPerformance.averageScore}%</p><p className="text-xs text-slate-500">Average</p></div>
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-lg font-bold text-slate-900">{studentProgress.quizPerformance.bestScore}%</p><p className="text-xs text-slate-500">Best score</p></div>
                </div>
                <div className="mt-4 flex items-center gap-3"><span className="w-24 text-xs font-medium text-slate-500">Pass rate</span><div className="flex-1"><ProgressTrack value={passRate} label="Quiz pass rate" /></div><span className="text-sm font-semibold text-slate-900">{passRate}%</span></div>
                {studentProgress.quizPerformance.recentResults.length ? <ScoreRows items={studentProgress.quizPerformance.recentResults} label="quiz" /> : <EmptyState icon="empty" title="No quiz results yet" compact />}
              </section>

              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="assignment-heading">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Submitted work</p><h2 id="assignment-heading" className="mt-1 text-xl font-bold text-slate-900">Assignment Performance</h2></div>
                  <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700"><GraduationCap className="h-5 w-5" aria-hidden="true" /></span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-lg font-bold text-slate-900">{studentProgress.assignmentPerformance.submitted}</p><p className="text-xs text-slate-500">Submitted</p></div>
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-lg font-bold text-slate-900">{studentProgress.assignmentPerformance.graded}</p><p className="text-xs text-slate-500">Graded</p></div>
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-lg font-bold text-slate-900">{studentProgress.assignmentPerformance.averageScore}%</p><p className="text-xs text-slate-500">Average</p></div>
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-lg font-bold text-slate-900">{studentProgress.assignmentPerformance.pending}</p><p className="text-xs text-slate-500">Pending</p></div>
                </div>
                {studentProgress.assignmentPerformance.recent.length ? <ScoreRows items={studentProgress.assignmentPerformance.recent} label="assignment" /> : <EmptyState icon="empty" title="No assignments yet" compact />}
              </section>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="recent-activity-heading">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Your study timeline</p><h2 id="recent-activity-heading" className="mt-1 text-xl font-bold text-slate-900">Recent Learning Activity</h2></div>
                  <Clock3 className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                {studentProgress.recentActivity.length ? (
                  <ol className="mt-5 space-y-4">
                    {studentProgress.recentActivity.map((activity) => (
                      <li key={activity.id} className="flex gap-3">
                        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", activity.icon === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700")}>
                          {activity.icon === "completed" ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <Video className="h-4 w-4" aria-hidden="true" />}
                        </span>
                        <div className="min-w-0 flex-1 border-b border-slate-100 pb-4 last:border-0">
                          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                            <p className="text-sm font-semibold text-slate-900">{activity.type}: {activity.title}</p>
                            <time className="text-xs text-slate-500">{activity.time}</time>
                          </div>
                          <p className="mt-1 truncate text-xs text-slate-500">{activity.course}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : <EmptyState icon="empty" title="No learning activity yet" description="Activity will appear here as you study." compact />}
              </section>

              <div className="min-w-0 space-y-6">
                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="certificate-heading">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Milestones</p><h2 id="certificate-heading" className="mt-1 text-xl font-bold text-slate-900">Certificates Earned</h2></div>
                    <span className="rounded-xl bg-amber-50 p-2.5 text-amber-700"><Award className="h-5 w-5" aria-hidden="true" /></span>
                  </div>
                  {studentProgress.certificates.earned > 0 ? (
                    <>
                      <p className="mt-4 text-4xl font-bold text-slate-900">{studentProgress.certificates.earned}</p>
                      <p className="mt-1 text-xs text-slate-500">Demo certificates in this profile</p>
                      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Latest Certificate</p>
                        <p className="mt-1 font-semibold text-slate-900">{studentProgress.certificates.latestTitle}</p>
                        <p className="mt-1 text-xs text-slate-500">Issued {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${studentProgress.certificates.issuedAt}T00:00:00Z`))}</p>
                      </div>
                      <Button asChild variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />} className="mt-4 w-full"><Link href="/dashboard/certificates">View Certificates</Link></Button>
                    </>
                  ) : <EmptyState icon="empty" title="No certificates yet" description="Earn a course certificate by completing a learning path." compact />}
                </section>

                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="performance-note-heading">
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-blue-50 p-2.5 text-blue-700"><Trophy className="h-5 w-5" aria-hidden="true" /></span>
                    <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Keep your momentum</p><h2 id="performance-note-heading" className="text-lg font-bold text-slate-900">Progress Snapshot</h2></div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">These learning, quiz, and assignment indicators are simulated demo data and are not connected to a live student record.</p>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}