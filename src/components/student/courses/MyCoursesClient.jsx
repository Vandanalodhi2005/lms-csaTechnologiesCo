"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import StudentMobileNav from "@/components/dashboard/StudentMobileNav.jsx";
import StudentSidebar from "@/components/dashboard/StudentSidebar.jsx";
import { student } from "@/constants/studentDashboard.js";
import { studentCourses } from "@/constants/studentCourses.js";
import { cn } from "@/utils";
import {
  ArrowDownWideNarrow,
  ArrowRight,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GraduationCap,
  MoreHorizontal,
  Play,
  Search,
  Star,
  X,
} from "lucide-react";

const PAGE_SIZE = 6;

const courseTabs = [
  { id: "all", label: "All Courses" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "not-started", label: "Not Started" },
];

const progressOptions = [
  { value: "all", label: "All Progress" },
  { value: "not-started", label: "Not Started" },
  { value: "1-25", label: "1-25%" },
  { value: "26-50", label: "26-50%" },
  { value: "51-75", label: "51-75%" },
  { value: "76-99", label: "76-99%" },
  { value: "100", label: "100%" },
];

const levelOptions = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const sortOptions = [
  { value: "recent", label: "Recently Accessed" },
  { value: "newest", label: "Newest Enrolled" },
  { value: "oldest", label: "Oldest Enrolled" },
  { value: "progress-asc", label: "Progress: Low to High" },
  { value: "progress-desc", label: "Progress: High to Low" },
  { value: "name-asc", label: "Course Name A-Z" },
  { value: "name-desc", label: "Course Name Z-A" },
];

const statIcons = {
  total: BookOpen,
  progress: Play,
  completed: CheckCircle2,
  notStarted: GraduationCap,
};

function getStatusVariant(status) {
  if (status === "Completed") return "success";
  if (status === "In Progress") return "info";
  return "secondary";
}

function formatDate(dateValue) {
  if (!dateValue) return "--";
  const date = new Date(dateValue.includes("T") ? dateValue : `${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatLastAccessed(dateValue) {
  if (!dateValue) return "Not started yet";
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(dateValue).getTime()) / 60000));
  if (minutes < 60) return `${Math.max(1, minutes)} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(dateValue);
}

function courseActionHref(course) {
  if (!course.learningSlug) return `/courses/${course.slug}`;
  const lessonId = course.status === "Not Started"
    ? "lesson-01"
    : course.status === "Completed"
      ? "lesson-07"
      : course.lastAccessedLesson?.id || "lesson-01";
  return `/learn/${course.learningSlug}/${lessonId}`;
}

function matchesProgress(course, filter) {
  if (filter === "all") return true;
  if (filter === "not-started") return course.progress === 0;
  if (filter === "1-25") return course.progress >= 1 && course.progress <= 25;
  if (filter === "26-50") return course.progress >= 26 && course.progress <= 50;
  if (filter === "51-75") return course.progress >= 51 && course.progress <= 75;
  if (filter === "76-99") return course.progress >= 76 && course.progress <= 99;
  if (filter === "100") return course.progress === 100;
  return true;
}

function matchesLastAccess(course, filter) {
  if (filter === "all") return true;
  if (filter === "never") return !course.lastAccessedAt;
  if (!course.lastAccessedAt) return false;

  const accessDate = new Date(course.lastAccessedAt);
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysAgo = (now.getTime() - accessDate.getTime()) / 86400000;

  if (filter === "today") return accessDate >= dayStart;
  if (filter === "7days") return daysAgo <= 7;
  if (filter === "30days") return daysAgo <= 30;
  return true;
}

function ConfirmationDialog({ course, onCancel, onConfirm }) {
  const dialogRef = React.useRef(null);
  const cancelRef = React.useRef(null);

  React.useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll("button:not([disabled])"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="remove-course-title" className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="remove-course-title" className="text-lg font-bold text-slate-900">Remove course?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Remove this course from your demo course list?</p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close confirmation" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">{course.title}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button ref={cancelRef} type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>Remove Course</Button>
        </div>
      </section>
    </div>
  );
}

function StudentCourseCard({ course, onRemove }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const actionHref = courseActionHref(course);
  const actionLabel = course.status === "Not Started"
    ? "Start Course"
    : course.status === "Completed"
      ? "Review Course"
      : "Continue Learning";

  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <Image
          src={course.thumbnail}
          alt={`${course.title} course thumbnail`}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge variant="default" className="bg-white/95 text-slate-700">{course.category}</Badge>
          <Badge variant="secondary" className="bg-white/95">{course.level}</Badge>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-2 min-h-12 text-lg font-bold leading-6 text-slate-900">{course.title}</h2>
            <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">{course.shortDescription}</p>
          </div>
          <details className="relative shrink-0" open={menuOpen} onToggle={(event) => setMenuOpen(event.currentTarget.open)}>
            <summary aria-label={`More actions for ${course.title}`} className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 [&::-webkit-details-marker]:hidden">
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            </summary>
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
              <Link href={`/courses/${course.slug}`} className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">View Course</Link>
              <button type="button" onClick={() => onRemove(course)} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">Remove from My Courses</button>
            </div>
          </details>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar src={course.instructor.avatar} name={course.instructor.name} alt={course.instructor.name} size="sm" />
            <span className="truncate text-sm font-medium text-slate-700">{course.instructor.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm" aria-label={`Rating ${course.rating} out of 5, ${course.reviewCount.toLocaleString()} reviews`}>
            <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden="true" />
            <span className="font-semibold text-slate-900">{course.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-500">({course.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>Enrolled {formatDate(course.enrolledAt)}</span>
          <Badge variant={getStatusVariant(course.status)}>{course.status}</Badge>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-700">Course Progress</span>
            <span className="text-sm font-semibold text-slate-900">{course.progress}% Complete</span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
            role="progressbar"
            aria-label={`${course.title} progress`}
            aria-valuenow={course.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={cn("h-full rounded-full transition-[width] motion-reduce:transition-none", course.status === "Completed" ? "bg-emerald-600" : "bg-primary-600")}
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>{course.completedLessons} / {course.totalLessons} lessons completed</span>
            <span className="shrink-0">{formatLastAccessed(course.lastAccessedAt)}</span>
          </div>
        </div>

        <div className="mt-4 flex min-w-0 items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
          <p className="min-w-0 text-sm leading-5 text-slate-600">
            {course.status === "Not Started" ? "Not started yet" : course.status === "Completed" ? "Course completed" : <>Continue from <span className="font-medium text-slate-800">{course.lastAccessedLesson?.title}</span></>}
          </p>
        </div>

        <Link href={actionHref} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0F2F5F] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#143A72] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2">
          {actionLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function MyCoursesClient() {
  const [courses, setCourses] = React.useState(studentCourses);
  const [activeTab, setActiveTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [progressFilter, setProgressFilter] = React.useState("all");
  const [level, setLevel] = React.useState("All Levels");
  const [lastActive, setLastActive] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("recent");
  const [page, setPage] = React.useState(1);
  const [removingCourse, setRemovingCourse] = React.useState(null);
  const [statusMessage, setStatusMessage] = React.useState("");

  const categories = React.useMemo(() => [...new Set(courses.map((course) => course.category))].sort(), [courses]);

  const filteredCourses = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const results = courses.filter((course) => {
      const tabMatches = activeTab === "all" || course.status.toLowerCase().replace(" ", "-") === activeTab;
      const queryMatches = !query || [course.title, course.instructor.name, course.category, course.courseId]
        .some((field) => field.toLowerCase().includes(query));
      return tabMatches && queryMatches && (category === "all" || course.category === category) && matchesProgress(course, progressFilter) && (level === "All Levels" || course.level === level) && matchesLastAccess(course, lastActive);
    });

    return results.sort((first, second) => {
      if (sortBy === "newest") return new Date(second.enrolledAt) - new Date(first.enrolledAt);
      if (sortBy === "oldest") return new Date(first.enrolledAt) - new Date(second.enrolledAt);
      if (sortBy === "progress-asc") return first.progress - second.progress;
      if (sortBy === "progress-desc") return second.progress - first.progress;
      if (sortBy === "name-asc") return first.title.localeCompare(second.title);
      if (sortBy === "name-desc") return second.title.localeCompare(first.title);
      return new Date(second.lastAccessedAt || 0) - new Date(first.lastAccessedAt || 0);
    });
  }, [courses, activeTab, search, category, progressFilter, level, lastActive, sortBy]);

  React.useEffect(() => {
    setPage(1);
  }, [activeTab, search, category, progressFilter, level, lastActive, sortBy]);

  const totalPages = Math.ceil(filteredCourses.length / PAGE_SIZE);
  const visibleCourses = filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const stats = [
    { id: "total", label: "Total Courses", count: courses.length, helper: "Enrolled in your library" },
    { id: "progress", label: "In Progress", count: courses.filter((course) => course.status === "In Progress").length, helper: "Ready to continue" },
    { id: "completed", label: "Completed", count: courses.filter((course) => course.status === "Completed").length, helper: "Finished courses" },
    { id: "notStarted", label: "Not Started", count: courses.filter((course) => course.status === "Not Started").length, helper: "Waiting for you" },
  ];

  const resetFilters = () => {
    setActiveTab("all");
    setSearch("");
    setCategory("all");
    setProgressFilter("all");
    setLevel("All Levels");
    setLastActive("all");
    setSortBy("recent");
    setPage(1);
  };

  const confirmRemoval = () => {
    if (!removingCourse) return;
    setCourses((current) => current.filter((course) => course.id !== removingCourse.id));
    setStatusMessage(`${removingCourse.title} was removed from your demo course list.`);
    setRemovingCourse(null);
  };

  const selectClass = "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <div className="container-page py-6 md:py-8 xl:py-10">
        <div className="flex min-w-0 gap-6">
          <aside className="hidden w-72 shrink-0 lg:block">
            <StudentSidebar currentPath="/dashboard/courses" />
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
              <StudentMobileNav currentPath="/dashboard/courses" />
              <Avatar src={student.avatar} alt={student.name} name={student.name} size="sm" />
            </div>

            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
              <Link href="/dashboard" className="hover:text-primary-600">Dashboard</Link>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <span aria-current="page" className="font-medium text-slate-900">My Courses</span>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Courses</h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">Continue learning, track your progress, and manage your enrolled courses.</p>
              </div>
              <Link href="/courses" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0F2F5F] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#143A72] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2">
                Browse Courses
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = statIcons[stat.id];
                return (
                  <article key={stat.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500">{stat.label}</p>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{stat.count}</p>
                      </div>
                      <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">{stat.helper}</p>
                  </article>
                );
              })}
            </div>

            {statusMessage ? (
              <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <span>{statusMessage}</span>
                <button type="button" aria-label="Dismiss message" onClick={() => setStatusMessage("")} className="rounded p-1 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : null}

            <section aria-label="Course library" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter courses by status">
                  {courseTabs.map((tab) => (
                    <button
                      key={tab.id}
                      id={`course-tab-${tab.id}`}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      aria-controls="course-results"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "min-h-10 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500",
                        activeTab === tab.id
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:max-w-sm">
                  <label htmlFor="course-search" className="sr-only">Search your courses</label>
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    id="course-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search your courses..."
                    className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/15"
                  />
                </div>
              </div>

              <div className="grid gap-3 border-b border-slate-200 py-4 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label htmlFor="course-category" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
                  <select id="course-category" value={category} onChange={(event) => setCategory(event.target.value)} className={selectClass}>
                    <option value="all">All Categories</option>
                    {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="course-progress" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Progress</label>
                  <select id="course-progress" value={progressFilter} onChange={(event) => setProgressFilter(event.target.value)} className={selectClass}>
                    {progressOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="course-level" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Level</label>
                  <select id="course-level" value={level} onChange={(event) => setLevel(event.target.value)} className={selectClass}>
                    {levelOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="course-last-active" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Last Active</label>
                  <select id="course-last-active" value={lastActive} onChange={(event) => setLastActive(event.target.value)} className={selectClass}>
                    <option value="all">Any Time</option>
                    <option value="today">Today</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div className="sm:col-span-2 xl:col-span-3">
                  <label htmlFor="course-sort" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sort By</label>
                  <select id="course-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={selectClass}>
                    {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button type="button" variant="outline" onClick={resetFilters} leftIcon={<ArrowUpDown className="h-4 w-4" />} className="min-h-11 w-full">
                    Reset Filters
                  </Button>
                </div>
              </div>

              <div id="course-results" role="tabpanel" aria-labelledby={`course-tab-${activeTab}`} className="pt-5">
                {courses.length === 0 ? (
                  <EmptyState
                    icon="empty"
                    title="You haven't enrolled in any courses yet."
                    description="Explore our courses and start your learning journey."
                    action={<Link href="/courses" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0F2F5F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#143A72] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2">Browse Courses <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
                  />
                ) : filteredCourses.length === 0 ? (
                  <EmptyState
                    icon="search"
                    title="No courses found"
                    description="Try changing your search or filters."
                    action={<Button type="button" variant="outline" onClick={resetFilters}>Reset Filters</Button>}
                  />
                ) : (
                  <>
                    <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500">
                      <p>Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredCourses.length)} of {filteredCourses.length} courses</p>
                      <span className="hidden items-center gap-1 sm:inline-flex"><ArrowDownWideNarrow className="h-4 w-4" aria-hidden="true" /> Sorted by {sortOptions.find((item) => item.value === sortBy)?.label}</span>
                    </div>
                    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                      {visibleCourses.map((course) => <StudentCourseCard key={course.id} course={course} onRemove={setRemovingCourse} />)}
                    </div>
                    {totalPages > 1 ? (
                      <nav aria-label="Course pagination" className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
                          </button>
                          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                            <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} aria-current={page === pageNumber ? "page" : undefined} aria-label={`Page ${pageNumber}`} className={cn("h-10 w-10 rounded-lg border text-sm font-semibold", page === pageNumber ? "border-primary-600 bg-primary-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}>
                              {pageNumber}
                            </button>
                          ))}
                          <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                            Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </nav>
                    ) : null}
                  </>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {removingCourse ? <ConfirmationDialog course={removingCourse} onCancel={() => setRemovingCourse(null)} onConfirm={confirmRemoval} /> : null}
    </div>
  );
}