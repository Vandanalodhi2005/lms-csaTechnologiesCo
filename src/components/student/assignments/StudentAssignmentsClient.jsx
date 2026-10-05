"use client";

import * as React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import StudentMobileNav from "@/components/dashboard/StudentMobileNav.jsx";
import StudentSidebar from "@/components/dashboard/StudentSidebar.jsx";
import { student } from "@/constants/studentDashboard.js";
import { assignmentDemoDate, getAssignmentPerformance, getAssignmentStatusCounts, studentAssignments } from "@/constants/studentAssignments.js";
import { cn } from "@/utils";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  FilterX,
  Hourglass,
  Search,
  Send,
  X,
} from "lucide-react";

const PAGE_SIZE = 8;
const DEMO_DATE = assignmentDemoDate.slice(0, 10);

const tabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "submitted", label: "Submitted" },
  { value: "graded", label: "Graded" },
  { value: "overdue", label: "Overdue" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "due", label: "Due Date" },
  { value: "high-score", label: "Highest Score" },
  { value: "low-score", label: "Lowest Score" },
  { value: "course", label: "Course Name" },
];

const statusLabels = {
  pending: "Pending",
  submitted: "Submitted",
  graded: "Graded",
  overdue: "Overdue",
};

const statusVariants = {
  pending: "warning",
  submitted: "info",
  graded: "success",
  overdue: "danger",
};

const statIcons = {
  total: BookOpen,
  pending: Hourglass,
  submitted: Send,
  graded: Award,
};

function dateKey(value) {
  return value?.slice(0, 10) || "";
}

function dayDistance(fromKey, toKey) {
  const from = new Date(`${fromKey}T00:00:00Z`);
  const to = new Date(`${toKey}T00:00:00Z`);
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

function formatAssignmentDate(dateValue, options = {}) {
  if (!dateValue) return "--";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    ...options,
  }).format(new Date(dateValue));
}

function getDueLabel(assignment) {
  const distance = dayDistance(DEMO_DATE, dateKey(assignment.dueDate));
  if (assignment.status === "overdue") {
    const days = Math.abs(distance);
    return `Overdue by ${days} ${days === 1 ? "day" : "days"}`;
  }
  if (distance < 0) return `Due ${formatAssignmentDate(assignment.dueDate)}`;
  if (distance === 0) return "Due today";
  if (distance === 1) return "Due tomorrow";
  return `Due in ${distance} days`;
}

function getStatusVariant(status) {
  return statusVariants[status] || "secondary";
}

function matchesDueFilter(assignment, filter) {
  const due = dateKey(assignment.dueDate);
  const distance = dayDistance(DEMO_DATE, due);
  if (filter === "today") return distance === 0;
  if (filter === "week") return distance >= 0 && distance <= 6;
  if (filter === "next7") return distance >= 0 && distance <= 7;
  if (filter === "past") return assignment.status === "overdue" || (assignment.status === "pending" && distance < 0);
  return true;
}

function matchesScoreFilter(assignment, filter) {
  if (filter === "all") return true;
  if (typeof assignment.score !== "number") return false;
  if (filter === "90") return assignment.score >= 90;
  if (filter === "80") return assignment.score >= 80 && assignment.score <= 89;
  if (filter === "70") return assignment.score >= 70 && assignment.score <= 79;
  if (filter === "below70") return assignment.score < 70;
  return true;
}

function assignmentActionLabel(status) {
  if (status === "pending") return "Continue Assignment";
  if (status === "submitted") return "View Submission";
  if (status === "graded") return "View Result";
  return "Review Assignment";
}

function getAssignmentRoute(assignment) {
  if (assignment.submissionRoute) return assignment.submissionRoute;
  return `/courses/${assignment.course.slug}`;
}

function AssignmentStatus({ status }) {
  const Icon = status === "graded" ? CheckCircle2 : status === "overdue" ? AlertCircle : status === "submitted" ? Send : Clock3;
  return (
    <Badge variant={getStatusVariant(status)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {statusLabels[status] || "Pending"}
    </Badge>
  );
}

function StatCard({ label, value, detail, icon: Icon, tone }) {
  const toneClass = tone === "amber" ? "bg-amber-50 text-amber-700" : tone === "green" ? "bg-emerald-50 text-emerald-700" : tone === "sky" ? "bg-sky-50 text-sky-700" : "bg-blue-50 text-blue-700";
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{value}</p>
        </div>
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneClass)}><Icon className="h-5 w-5" aria-hidden="true" /></span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{detail}</p>
    </article>
  );
}

function AssignmentDetailsDialog({ assignment, onClose }) {
  const dialogRef = React.useRef(null);
  const closeRef = React.useRef(null);

  React.useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll("a[href], button:not([disabled])"));
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
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const status = statusLabels[assignment.status] || "Pending";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="assignment-details-title" onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); onClose(); } }} className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl">
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Assignment Details</p>
            <h2 id="assignment-details-title" className="mt-1 text-xl font-bold text-slate-900">{assignment.title}</h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close assignment details" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2"><AssignmentStatus status={assignment.status} /><Badge variant="secondary">{assignment.type}</Badge><Badge variant="outline">{assignment.assignmentId}</Badge></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Course" value={assignment.course.title} />
            <DetailField label="Instructor" value={assignment.instructor.name} />
            <DetailField label="Due Date" value={formatAssignmentDate(assignment.dueDate, { month: "long" })} />
            <DetailField label="Maximum Marks" value={`${assignment.maxMarks} marks`} />
            <DetailField label="Attempts" value={`${assignment.attemptsUsed} / ${assignment.attemptsAllowed}`} />
            <DetailField label="Submission Status" value={status} />
            {assignment.score !== null ? <DetailField label="Score" value={`${assignment.score} / ${assignment.maxMarks}`} /> : null}
            {assignment.submittedAt ? <DetailField label="Submitted" value={formatAssignmentDate(assignment.submittedAt, { month: "long" })} /> : null}
            {assignment.gradedAt ? <DetailField label="Graded" value={formatAssignmentDate(assignment.gradedAt, { month: "long" })} /> : null}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Description</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{assignment.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Instructions</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{assignment.instructions}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Objectives</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
              {assignment.objectives.map((objective) => <li key={objective}>{objective}</li>)}
            </ul>
          </div>

          {assignment.feedback ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="text-sm font-semibold text-emerald-900">Instructor Feedback</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-800">{assignment.feedback}</p>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
            {assignment.routeAvailable ? (
              <Button asChild leftIcon={<ArrowRight className="h-4 w-4" />}>
                <Link href={getAssignmentRoute(assignment)}>{assignmentActionLabel(assignment.status)}</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" leftIcon={<BookOpen className="h-4 w-4" />}>
                <Link href={`/courses/${assignment.course.slug}`}>View Course</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function DetailField({ label, value }) {
  return <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-900">{value}</p></div>;
}

function AssignmentAction({ assignment, onView }) {
  if (!assignment.routeAvailable) {
    return <Button type="button" variant="outline" size="sm" onClick={() => onView(assignment)}>View</Button>;
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" size="sm" onClick={() => onView(assignment)}>View</Button>
      <Link href={getAssignmentRoute(assignment)} className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg bg-[#0F2F5F] px-3 text-xs font-semibold text-white hover:bg-[#143A72] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
        {assignmentActionLabel(assignment.status)}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

function UpcomingAssignments({ items, onView }) {
  return (
    <section className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="upcoming-heading">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Deadlines ahead</p><h2 id="upcoming-heading" className="mt-1 text-xl font-bold text-slate-900">Upcoming Assignments</h2></div>
        <CalendarClock className="h-5 w-5 text-primary-700" aria-hidden="true" />
      </div>
      {items.length ? (
        <ul className="mt-4 divide-y divide-slate-100">
          {items.map((assignment) => (
            <li key={assignment.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <button type="button" onClick={() => onView(assignment)} className="text-left text-sm font-semibold text-slate-900 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">{assignment.title}</button>
                <p className="mt-1 truncate text-xs text-slate-500">{assignment.course.title} · {assignment.course.category}</p>
                <p className="mt-1 text-xs text-slate-600">{getDueLabel(assignment)} · {formatAssignmentDate(assignment.dueDate, { month: "long" })}</p>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                <AssignmentStatus status={assignment.status} />
                {assignment.routeAvailable ? (
                  <Link href={getAssignmentRoute(assignment)} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-primary-500">Continue Assignment<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
                ) : <Button type="button" variant="outline" size="sm" onClick={() => onView(assignment)}>View Details</Button>}
              </div>
            </li>
          ))}
        </ul>
      ) : <EmptyState icon="empty" title="No upcoming assignments" description="You're all caught up for now." compact />}
    </section>
  );
}

export default function StudentAssignmentsClient() {
  const [activeTab, setActiveTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dueFilter, setDueFilter] = React.useState("all");
  const [scoreFilter, setScoreFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("due");
  const [page, setPage] = React.useState(1);
  const [selectedAssignment, setSelectedAssignment] = React.useState(null);

  const counts = React.useMemo(() => getAssignmentStatusCounts(), []);
  const performance = React.useMemo(() => getAssignmentPerformance(), []);
  const courseOptions = React.useMemo(() => [...new Map(studentAssignments.map((item) => [item.course.slug, item.course])).values()].sort((a, b) => a.title.localeCompare(b.title)), []);

  const filteredAssignments = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const results = studentAssignments.filter((assignment) => {
      const tabMatches = activeTab === "all" || assignment.status === activeTab;
      const searchMatches = !query || [assignment.title, assignment.course.title, assignment.instructor.name, assignment.assignmentId].some((value) => value.toLowerCase().includes(query));
      const courseMatches = courseFilter === "all" || assignment.course.slug === courseFilter;
      const statusMatches = statusFilter === "all" || assignment.status === statusFilter;
      return tabMatches && searchMatches && courseMatches && statusMatches && matchesDueFilter(assignment, dueFilter) && matchesScoreFilter(assignment, scoreFilter);
    });

    return results.sort((first, second) => {
      if (sortBy === "newest") return new Date(second.lastUpdatedAt) - new Date(first.lastUpdatedAt);
      if (sortBy === "oldest") return new Date(first.lastUpdatedAt) - new Date(second.lastUpdatedAt);
      if (sortBy === "high-score") return (second.score ?? -1) - (first.score ?? -1);
      if (sortBy === "low-score") return (first.score ?? 101) - (second.score ?? 101);
      if (sortBy === "course") return first.course.title.localeCompare(second.course.title);
      return new Date(first.dueDate) - new Date(second.dueDate);
    });
  }, [activeTab, search, courseFilter, statusFilter, dueFilter, scoreFilter, sortBy]);

  React.useEffect(() => setPage(1), [activeTab, search, courseFilter, statusFilter, dueFilter, scoreFilter, sortBy]);

  const upcomingAssignments = React.useMemo(() => studentAssignments
    .filter((assignment) => ["pending", "overdue"].includes(assignment.status) && dayDistance(DEMO_DATE, dateKey(assignment.dueDate)) >= 0)
    .sort((first, second) => new Date(first.dueDate) - new Date(second.dueDate))
    .slice(0, 4), []);

  const recentSubmissions = React.useMemo(() => studentAssignments
    .filter((assignment) => assignment.submittedAt)
    .sort((first, second) => new Date(second.submittedAt) - new Date(first.submittedAt))
    .slice(0, 5), []);

  const totalPages = Math.max(1, Math.ceil(filteredAssignments.length / PAGE_SIZE));
  const visibleAssignments = filteredAssignments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const stats = [
    { key: "total", label: "Total Assignments", value: counts.all, detail: `${counts.overdue} overdue`, icon: statIcons.total, tone: "blue" },
    { key: "pending", label: "Pending", value: counts.pending, detail: "Need your attention", icon: statIcons.pending, tone: "amber" },
    { key: "submitted", label: "Submitted", value: counts.submitted + counts.graded, detail: "Awaiting or received", icon: statIcons.submitted, tone: "sky" },
    { key: "graded", label: "Graded", value: counts.graded, detail: "Ready to review", icon: statIcons.graded, tone: "green" },
  ];

  const resetFilters = () => {
    setActiveTab("all");
    setSearch("");
    setCourseFilter("all");
    setStatusFilter("all");
    setDueFilter("all");
    setScoreFilter("all");
    setSortBy("due");
    setPage(1);
  };

  const selectClass = "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <div className="container-page py-6 md:py-8 xl:py-10">
        <div className="flex min-w-0 gap-6">
          <aside className="hidden w-72 shrink-0 lg:block"><StudentSidebar currentPath="/dashboard/assignments" /></aside>
          <main className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
              <StudentMobileNav currentPath="/dashboard/assignments" />
              <Avatar src={student.avatar} alt={student.name} name={student.name} size="sm" />
            </div>

            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
              <Link href="/dashboard" className="hover:text-primary-600">Dashboard</Link>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <span aria-current="page" className="font-medium text-slate-900">Assignments</span>
            </nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Coursework</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">My Assignments</h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">View, manage, and track your course assignments.</p>
              </div>
              <Link href="/dashboard/courses" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0F2F5F] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#143A72] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                Browse My Courses<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4 sm:gap-4">
              {stats.map((item) => (
                <StatCard
                  key={item.key}
                  label={item.label}
                  value={item.value}
                  detail={item.detail}
                  icon={item.icon}
                  tone={item.tone}
                />
              ))}
            </div>

            <div className="mb-6 grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <UpcomingAssignments items={upcomingAssignments} onView={setSelectedAssignment} />
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="performance-heading">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Your results</p><h2 id="performance-heading" className="mt-1 text-xl font-bold text-slate-900">Assignment Performance</h2></div>
                  <Award className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <PerformanceMetric label="Submitted" value={performance.submitted} />
                  <PerformanceMetric label="Graded" value={performance.graded} />
                  <PerformanceMetric label="Average Score" value={`${performance.averageScore}%`} />
                  <PerformanceMetric label="Highest Score" value={`${performance.highestScore}%`} />
                  <PerformanceMetric label="Pending" value={performance.pending} />
                  <PerformanceMetric label="Overdue" value={performance.overdue} />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="w-24 text-xs font-medium text-slate-500">Average</span>
                  <div className="flex-1" role="progressbar" aria-label="Average assignment score" aria-valuenow={performance.averageScore} aria-valuemin={0} aria-valuemax={100}>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600" style={{ width: `${performance.averageScore}%` }} /></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{performance.averageScore}%</span>
                </div>
              </section>
            </div>

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-labelledby="assignment-list-heading">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Coursework overview</p><h2 id="assignment-list-heading" className="mt-1 text-xl font-bold text-slate-900">Assignments</h2></div>
                <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-[620px] xl:grid-cols-3">
                  <div className="relative sm:col-span-2 xl:col-span-1">
                    <label htmlFor="assignment-search" className="sr-only">Search assignments</label>
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input id="assignment-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search assignments..." className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/15" />
                    {search ? <button type="button" aria-label="Clear search" onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"><X className="h-4 w-4" aria-hidden="true" /></button> : null}
                  </div>
                  <div><label htmlFor="assignment-course" className="sr-only">Course</label><select id="assignment-course" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className={selectClass}><option value="all">All Courses</option>{courseOptions.map((course) => <option key={course.slug} value={course.slug}>{course.title}</option>)}</select></div>
                  <div><label htmlFor="assignment-status" className="sr-only">Status</label><select id="assignment-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={selectClass}><option value="all">All Status</option>{tabs.slice(1).map((tab) => <option key={tab.value} value={tab.value}>{tab.label}</option>)}</select></div>
                  <div><label htmlFor="assignment-due" className="sr-only">Due Date</label><select id="assignment-due" value={dueFilter} onChange={(event) => setDueFilter(event.target.value)} className={selectClass}><option value="all">All Due Dates</option><option value="today">Today</option><option value="week">This Week</option><option value="next7">Next 7 Days</option><option value="past">Past Due</option></select></div>
                  <div><label htmlFor="assignment-score" className="sr-only">Score</label><select id="assignment-score" value={scoreFilter} onChange={(event) => setScoreFilter(event.target.value)} className={selectClass}><option value="all">All Scores</option><option value="90">90-100%</option><option value="80">80-89%</option><option value="70">70-79%</option><option value="below70">Below 70%</option></select></div>
                  <div><label htmlFor="assignment-sort" className="sr-only">Sort By</label><select id="assignment-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={selectClass}>{sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter assignments by status">
                  {tabs.map((tab) => (
                    <button key={tab.value} type="button" role="tab" aria-selected={activeTab === tab.value} aria-current={activeTab === tab.value ? "true" : undefined} onClick={() => setActiveTab(tab.value)} className={cn("min-h-10 rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500", activeTab === tab.value ? "border-blue-200 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>
                      {tab.label}<span className={cn("ml-1.5 tabular-nums", activeTab === tab.value ? "text-blue-900" : "text-slate-500")}>{counts[tab.value]}</span>
                    </button>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={resetFilters} leftIcon={<FilterX className="h-4 w-4" />}>Reset Filters</Button>
              </div>

              <div className="mt-4">
                {studentAssignments.length === 0 ? (
                  <EmptyState icon="empty" title="You don't have any assignments yet." description="Assignments from your enrolled courses will appear here." action={<Link href="/dashboard/courses" className="inline-flex min-h-10 items-center rounded-lg bg-[#0F2F5F] px-4 text-sm font-semibold text-white hover:bg-[#143A72]">Browse My Courses</Link>} />
                ) : filteredAssignments.length === 0 ? (
                  <EmptyState icon="search" title={search ? "No assignments match your search." : activeTab === "pending" ? "You're all caught up." : activeTab === "graded" ? "No graded assignments yet." : "No assignments found."} description="Try changing your search or filters." action={<Button type="button" variant="outline" onClick={resetFilters}>Reset Filters</Button>} compact />
                ) : (
                  <>
                    <p className="mb-3 text-sm text-slate-500">Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredAssignments.length)} of {filteredAssignments.length} assignments</p>
                    <div className="hidden overflow-x-auto 2xl:block">
                      <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left">
                        <thead><tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          <th scope="col" className="border-b border-slate-200 px-3 py-3">Assignment</th>
                          <th scope="col" className="border-b border-slate-200 px-3 py-3">Course</th>
                          <th scope="col" className="border-b border-slate-200 px-3 py-3">Due Date</th>
                          <th scope="col" className="border-b border-slate-200 px-3 py-3">Status</th>
                          <th scope="col" className="border-b border-slate-200 px-3 py-3">Score</th>
                          <th scope="col" className="border-b border-slate-200 px-3 py-3">Attempts</th>
                          <th scope="col" className="border-b border-slate-200 px-3 py-3">Last Updated</th>
                          <th scope="col" className="border-b border-slate-200 px-3 py-3"><span className="sr-only">Actions</span></th>
                        </tr></thead>
                        <tbody>
                          {visibleAssignments.map((assignment) => (
                            <tr key={assignment.id} className="hover:bg-slate-50/80">
                              <th scope="row" className="border-b border-slate-100 px-3 py-4 font-normal">
                                <button type="button" onClick={() => setSelectedAssignment(assignment)} className="block max-w-56 text-left focus:outline-none focus:ring-2 focus:ring-primary-500"><span className="block text-sm font-semibold text-slate-900">{assignment.title}</span><span className="mt-1 block text-xs text-slate-500">{assignment.assignmentId} · {assignment.type}</span></button>
                              </th>
                              <td className="border-b border-slate-100 px-3 py-4"><p className="max-w-44 truncate text-sm font-medium text-slate-800">{assignment.course.title}</p><p className="mt-1 text-xs text-slate-500">{assignment.course.category} · {assignment.instructor.name}</p></td>
                              <td className="border-b border-slate-100 px-3 py-4"><p className="text-sm text-slate-800">{formatAssignmentDate(assignment.dueDate)}</p><p className="mt-1 text-xs text-slate-500">{getDueLabel(assignment)}</p></td>
                              <td className="border-b border-slate-100 px-3 py-4"><AssignmentStatus status={assignment.status} /></td>
                              <td className="border-b border-slate-100 px-3 py-4 text-sm font-semibold tabular-nums text-slate-800">{assignment.score === null ? "--" : `${assignment.score}/${assignment.maxMarks}`}</td>
                              <td className="border-b border-slate-100 px-3 py-4 text-sm tabular-nums text-slate-700">{assignment.attemptsUsed}/{assignment.attemptsAllowed}</td>
                              <td className="border-b border-slate-100 px-3 py-4 text-sm text-slate-600">{formatAssignmentDate(assignment.lastUpdatedAt)}</td>
                              <td className="border-b border-slate-100 px-3 py-4"><AssignmentAction assignment={assignment} onView={setSelectedAssignment} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="space-y-3 2xl:hidden">
                      {visibleAssignments.map((assignment) => (
                        <article key={assignment.id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
                          <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{assignment.assignmentId} · {assignment.type}</p><button type="button" onClick={() => setSelectedAssignment(assignment)} className="mt-1 line-clamp-2 text-left text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500">{assignment.title}</button></div><AssignmentStatus status={assignment.status} /></div>
                          <p className="mt-2 truncate text-xs text-slate-500">{assignment.course.title} · {assignment.course.category}</p>
                          <div className="mt-3 grid grid-cols-2 gap-3 text-xs"><div><p className="text-slate-500">Due</p><p className="mt-1 font-medium text-slate-800">{formatAssignmentDate(assignment.dueDate)} · {getDueLabel(assignment)}</p></div><div><p className="text-slate-500">Score · Attempts</p><p className="mt-1 font-medium text-slate-800">{assignment.score === null ? "--" : `${assignment.score}/${assignment.maxMarks}`} · {assignment.attemptsUsed}/{assignment.attemptsAllowed}</p></div></div>
                          <div className="mt-3 flex items-center justify-between gap-2"><p className="text-xs text-slate-500">Updated {formatAssignmentDate(assignment.lastUpdatedAt)}</p><AssignmentAction assignment={assignment} onView={setSelectedAssignment} /></div>
                        </article>
                      ))}
                    </div>

                    {totalPages > 1 ? (
                      <nav aria-label="Assignment pagination" className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 disabled:opacity-50"><ChevronLeft className="h-4 w-4" aria-hidden="true" />Previous</button>
                          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} aria-current={page === pageNumber ? "page" : undefined} className={cn("h-10 w-10 rounded-lg border text-sm font-semibold", page === pageNumber ? "border-primary-600 bg-primary-600 text-white" : "border-slate-200 bg-white text-slate-700")}>{pageNumber}</button>)}
                          <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 disabled:opacity-50">Next<ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
                        </div>
                      </nav>
                    ) : null}
                  </>
                )}
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="recent-submissions-heading">
              <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Latest work</p><h2 id="recent-submissions-heading" className="mt-1 text-xl font-bold text-slate-900">Recent Submissions</h2></div><Badge variant="secondary">Demo records</Badge></div>
              {recentSubmissions.length ? <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">{recentSubmissions.map((assignment) => <button key={assignment.id} type="button" onClick={() => setSelectedAssignment(assignment)} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"><span className="block truncate text-sm font-semibold text-slate-900">{assignment.title}</span><span className="mt-1 block truncate text-xs text-slate-500">{assignment.course.title}</span><span className="mt-3 flex items-center justify-between gap-2 text-xs"><span className="text-slate-500">Submitted {formatAssignmentDate(assignment.submittedAt)}</span><span className="font-semibold text-slate-900">{assignment.score === null ? "Pending grade" : `${assignment.score}/${assignment.maxMarks}`}</span></span></button>)}</div> : <EmptyState icon="empty" title="No submissions yet" description="Submitted assignments will appear here." compact />}
            </section>
          </main>
        </div>
      </div>

      {selectedAssignment ? <AssignmentDetailsDialog assignment={selectedAssignment} onClose={() => setSelectedAssignment(null)} /> : null}
    </div>
  );
}

function PerformanceMetric({ label, value }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-lg font-bold tabular-nums text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>;
}