"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import { cn, formatCurrency, formatDuration } from "@/utils";
import { instructorCourseActivity, instructorCourseSeed, instructorCourses } from "@/constants/instructorCourses.js";
import {
  AlertCircle,
  Archive,
  ArrowRight,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  FileText,
  Layers,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  Star,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

const PAGE_SIZE = 6;

const tabs = [
  { value: "all", label: "All Courses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
  { value: "pending-review", label: "Pending Review" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

const ratingFilters = [
  { value: "all", label: "All Ratings" },
  { value: "4.5", label: "4.5+" },
  { value: "4", label: "4+" },
  { value: "3", label: "3+" },
  { value: "below3", label: "Below 3" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "students", label: "Most Students" },
  { value: "rating", label: "Highest Rating" },
  { value: "rating-low", label: "Lowest Rating" },
  { value: "revenue", label: "Highest Revenue" },
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
];

const statusLabels = {
  published: "Published",
  draft: "Draft",
  "pending-review": "Pending Review",
  rejected: "Rejected",
  archived: "Archived",
};

const statusVariants = {
  published: "success",
  draft: "secondary",
  "pending-review": "warning",
  rejected: "danger",
  archived: "outline",
};

function formatDate(dateValue) {
  if (!dateValue) return "--";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${dateValue}T00:00:00Z`));
}

function relativeUpdate(dateValue) {
  if (!dateValue) return "Not updated";
  const days = Math.max(0, Math.floor((Date.now() - new Date(`${dateValue}T00:00:00Z`).getTime()) / 86400000));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function matchesRating(course, filter) {
  if (filter === "all") return true;
  if (filter === "below3") return course.rating < 3;
  return course.rating >= Number(filter);
}

function StatusBadge({ status }) {
  const Icon = status === "published" ? CheckCircle2 : status === "pending-review" ? Clock3 : status === "rejected" ? AlertCircle : status === "archived" ? Archive : FileText;
  return <Badge variant={statusVariants[status] || "secondary"}><Icon className="h-3.5 w-3.5" aria-hidden="true" />{statusLabels[status] || "Draft"}</Badge>;
}

function StatCard({ label, value, hint, icon: Icon, tone = "blue" }) {
  const toneClass = tone === "green" ? "bg-emerald-50 text-emerald-700" : tone === "amber" ? "bg-amber-50 text-amber-700" : tone === "neutral" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700";
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{value}</p></div><span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneClass)}><Icon className="h-5 w-5" aria-hidden="true" /></span></div><p className="mt-3 text-xs text-slate-500">{hint}</p></article>;
}

function CourseDialog({ course, mode, onClose, onChangeMode, onEdit }) {
  const dialogRef = React.useRef(null);
  const closeRef = React.useRef(null);

  React.useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll("a[href], button:not([disabled])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); previousFocus?.focus?.(); };
  }, [onClose]);

  const heading = mode === "feedback" ? "Review Feedback" : mode === "curriculum" ? "Curriculum Preview" : mode === "preview" ? "Course Preview" : course.status === "pending-review" ? "Submission Details" : "Course Details";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="instructor-course-dialog-title" onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); onClose(); } }} className="max-h-[94vh] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-4xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Demo course data</p><h2 id="instructor-course-dialog-title" className="mt-1 text-xl font-bold text-slate-900">{heading}</h2></div><button ref={closeRef} type="button" onClick={onClose} aria-label="Close course dialog" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500"><X className="h-4 w-4" aria-hidden="true" /></button></div>
        <div className="space-y-5 p-4 sm:p-6">
          {mode === "feedback" ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><StatusBadge status="rejected" /><p className="mt-3 text-sm leading-6 text-amber-950">{course.rejectionReason || "No rejection feedback was added to this demo course."}</p><Button type="button" className="mt-4" onClick={() => onEdit(course)}>Edit Course</Button></div> : mode === "curriculum" ? <div><div className="flex items-center justify-between gap-3"><div><h3 className="text-lg font-bold text-slate-900">{course.title}</h3><p className="mt-1 text-sm text-slate-500">Curriculum preview · {course.sections.length} sections</p></div><Button type="button" variant="outline" size="sm" onClick={() => onChangeMode("details")}>Back to Details</Button></div><div className="mt-4 space-y-3">{course.sections.map((section, index) => <section key={section.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><h3 className="font-semibold text-slate-900">Section {index + 1}: {section.title}</h3><ul className="mt-2 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">{section.lessons.map((lesson) => <li key={lesson} className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />{lesson}</li>)}</ul></section>)}</div></div> : <>
            <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"><div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100">{course.thumbnail ? <Image src={course.thumbnail} alt={`${course.title} thumbnail`} fill sizes="(max-width: 1023px) 100vw, 40vw" className="object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400"><BookOpen className="h-12 w-12" aria-hidden="true" /></div>}</div><div className="min-w-0"><div className="flex flex-wrap gap-2"><Badge variant="default">{course.category}</Badge><Badge variant="secondary">{course.level}</Badge><StatusBadge status={course.status} /></div><h3 className="mt-3 text-2xl font-bold text-slate-900">{course.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{course.description}</p><div className="mt-4 flex items-center gap-3"><Avatar src={course.instructor.avatar} alt={course.instructor.name} name={course.instructor.name} size="sm" /><div><p className="text-sm font-semibold text-slate-900">{course.instructor.name}</p><p className="text-xs text-slate-500">Instructor</p></div></div></div></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"><CourseMetric label="Students" value={course.students.toLocaleString("en-IN")} icon={Users} /><CourseMetric label="Rating" value={course.students ? `${course.rating.toFixed(1)} / 5` : "No ratings"} icon={Star} /><CourseMetric label="Completion Rate" value={`${course.completionRate}%`} icon={CheckCircle2} /><CourseMetric label="Total Lessons" value={course.totalLessons} icon={BookOpen} /><CourseMetric label="Course Duration" value={formatDuration(course.duration)} icon={Clock3} /><CourseMetric label="Price" value={course.price ? formatCurrency(course.price) : "Free"} icon={Layers} /><CourseMetric label="Estimated Revenue" value={formatCurrency(course.revenue)} icon={BarChart3} /><CourseMetric label="Course ID" value={course.courseId} icon={FileText} /></div>
            <div className="grid gap-4 sm:grid-cols-2"><CourseMetric label="Created Date" value={formatDate(course.createdAt)} /><CourseMetric label="Last Updated" value={formatDate(course.updatedAt)} /></div>
            {course.status === "pending-review" ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-semibold text-amber-950">Pending Review</p><p className="mt-1 text-sm text-amber-900">Submitted {relativeDate(course.submittedAt)} · Expected review: Demo status</p><p className="mt-2 text-xs text-amber-800">This is a simulated workflow state.</p></div> : null}
            {course.status === "rejected" ? <div className="rounded-xl border border-red-200 bg-red-50 p-4"><p className="text-sm font-semibold text-red-900">Rejection Reason</p><p className="mt-1 text-sm leading-6 text-red-800">{course.rejectionReason}</p></div> : null}
            <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4"><Button type="button" variant="outline" onClick={() => onChangeMode("curriculum")}>View Full Curriculum</Button>{course.status !== "archived" ? <Button type="button" onClick={() => onEdit(course)}><Pencil className="mr-2 h-4 w-4" aria-hidden="true" />Edit Course</Button> : null}<Link href={`/courses/${course.slug}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500">Open Course Page<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
          </>}
        </div>
      </section>
    </div>
  );
}

function CourseMetric({ label, value, icon: Icon }) {
  return <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="flex items-center gap-2 text-slate-500">{Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}<span className="text-xs font-medium">{label}</span></div><p className="mt-2 break-words text-sm font-semibold text-slate-900">{value}</p></div>;
}

function ConfirmActionDialog({ action, course, onCancel, onConfirm }) {
  const dialogRef = React.useRef(null);
  const cancelRef = React.useRef(null);
  React.useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") { event.preventDefault(); onCancel(); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll("button:not([disabled])"));
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable[focusable.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) { event.preventDefault(); focusable[0].focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); previousFocus?.focus?.(); };
  }, [onCancel]);

  const messages = {
    duplicate: { title: "Duplicate course?", message: "Create a duplicate draft from this course?", confirm: "Duplicate Course" },
    archive: { title: "Archive course?", message: "Are you sure you want to archive this course?", confirm: "Archive Course" },
    delete: { title: "Delete draft course?", message: "This demo action will remove the course from the current session only.", confirm: "Delete Course" },
    restore: { title: "Restore course?", message: "Restore this archived course for the current session?", confirm: "Restore Course" },
    withdraw: { title: "Withdraw review?", message: "Withdraw this course from review in the current demo session?", confirm: "Withdraw Review" },
    resubmit: { title: "Resubmit course?", message: "Mark this course as pending review for the current demo session?", confirm: "Resubmit Course" },
  };
  const text = messages[action] || messages.duplicate;

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}><section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="course-action-title" className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"><h2 id="course-action-title" className="text-xl font-bold text-slate-900">{text.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text.message}</p><p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">{course.title}</p><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button ref={cancelRef} type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="button" variant={action === "delete" ? "destructive" : "default"} onClick={onConfirm}>{text.confirm}</Button></div></section></div>;
}

function CourseTabCounts({ courses }) {
  return courses.reduce((counts, course) => { counts.all += 1; counts[course.status] += 1; return counts; }, { all: 0, published: 0, draft: 0, "pending-review": 0, rejected: 0, archived: 0 });
}

export default function InstructorCoursesClient() {
  const [courses, setCourses] = React.useState(instructorCourses);
  const [activeTab, setActiveTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [level, setLevel] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [ratingFilter, setRatingFilter] = React.useState("all");
  const [priceFilter, setPriceFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");
  const [page, setPage] = React.useState(1);
  const [selectedCourse, setSelectedCourse] = React.useState(null);
  const [dialog, setDialog] = React.useState(null);
  const [toastMessage, setToastMessage] = React.useState("");

  const counts = React.useMemo(() => CourseTabCounts({ courses }), [courses]);
  const categories = React.useMemo(() => [...new Set(courses.map((course) => course.category))].sort(), [courses]);
  const levels = React.useMemo(() => [...new Set(courses.map((course) => course.level))].sort(), [courses]);
  const summaryStats = [
    { label: "Total Courses", value: counts.all, hint: "In your course library", icon: BookOpen, tone: "blue" },
    { label: "Published", value: counts.published, hint: "Available to learners", icon: CheckCircle2, tone: "green" },
    { label: "Drafts", value: counts.draft, hint: "Still in progress", icon: FileText, tone: "neutral" },
    { label: "Pending Review", value: counts["pending-review"], hint: "Awaiting demo review", icon: Clock3, tone: "amber" },
  ];

  React.useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => setToastMessage(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const filteredCourses = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = courses.filter((course) => {
      const tabMatches = activeTab === "all" || course.status === activeTab;
      const searchMatches = !query || [course.title, course.courseId, course.category, course.instructor.name].some((value) => value.toLowerCase().includes(query));
      const categoryMatches = category === "all" || course.category === category;
      const levelMatches = level === "all" || course.level.toLowerCase() === level;
      const statusMatches = statusFilter === "all" || course.status === statusFilter;
      const priceMatches = priceFilter === "all" || (priceFilter === "free" ? course.price === 0 : course.price > 0);
      return tabMatches && searchMatches && categoryMatches && levelMatches && statusMatches && matchesRating(course, ratingFilter) && priceMatches;
    });

    return filtered.sort((first, second) => {
      if (sortBy === "oldest") return new Date(first.createdAt) - new Date(second.createdAt);
      if (sortBy === "students") return second.students - first.students;
      if (sortBy === "rating") return second.rating - first.rating;
      if (sortBy === "rating-low") return first.rating - second.rating;
      if (sortBy === "revenue") return second.revenue - first.revenue;
      if (sortBy === "az") return first.title.localeCompare(second.title);
      if (sortBy === "za") return second.title.localeCompare(first.title);
      return new Date(second.createdAt) - new Date(first.createdAt);
    });
  }, [courses, activeTab, search, category, level, statusFilter, ratingFilter, priceFilter, sortBy]);

  React.useEffect(() => setPage(1), [activeTab, search, category, level, statusFilter, ratingFilter, priceFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
  const visibleCourses = filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const topCourses = [...courses].filter((course) => course.status === "published").sort((a, b) => b.revenue - a.revenue).slice(0, 3);

  const notify = (message) => setToastMessage(message);
  const handleEdit = (course) => { setSelectedCourse(null); notify("Course editing page will be connected in the next instructor workflow."); };
  const requestAction = (action, course) => { setSelectedCourse(null); setDialog({ action, course }); };

  const confirmAction = () => {
    if (!dialog) return;
    const { action, course } = dialog;
    if (action === "duplicate") {
      const duplicated = { ...course, id: `instructor-course-${Date.now()}`, courseId: `EDU-${Date.now()}`, title: `${course.title} (Copy)`, status: "draft", students: 0, rating: 0, reviewCount: 0, completionRate: 0, revenue: 0, createdAt: "2026-10-06", updatedAt: "2026-10-06", submittedAt: null, rejectionReason: null };
      setCourses((current) => [duplicated, ...current]);
      notify("Duplicate draft created for this session.");
    } else if (action === "archive") {
      setCourses((current) => current.map((item) => item.id === course.id ? { ...item, status: "archived", updatedAt: "2026-10-06" } : item));
      notify("Course archived for this session.");
    } else if (action === "restore") {
      setCourses((current) => current.map((item) => item.id === course.id ? { ...item, status: "draft", updatedAt: "2026-10-06" } : item));
      notify("Course restored for this session.");
    } else if (action === "delete") {
      setCourses((current) => current.filter((item) => item.id !== course.id));
      notify("Course removed for this session.");
    } else if (action === "withdraw") {
      setCourses((current) => current.map((item) => item.id === course.id ? { ...item, status: "draft", submittedAt: null, updatedAt: "2026-10-06" } : item));
      notify("Course review withdrawn for this session.");
    } else if (action === "resubmit") {
      setCourses((current) => current.map((item) => item.id === course.id ? { ...item, status: "pending-review", submittedAt: "2026-10-06", updatedAt: "2026-10-06" } : item));
      notify("Course marked as pending review for this session.");
    }
    setDialog(null);
  };

  const resetFilters = () => { setActiveTab("all"); setSearch(""); setCategory("all"); setLevel("all"); setStatusFilter("all"); setRatingFilter("all"); setPriceFilter("all"); setSortBy("newest"); setPage(1); };
  const selectClass = "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15";

  const renderCourseActions = (course) => {
    const actionItems = [];
    if (["published", "pending-review", "rejected", "archived"].includes(course.status)) actionItems.push({ label: course.status === "pending-review" ? "View Submission" : "View Course", icon: Eye, run: () => { setSelectedCourse(course); setDialogMode(course.status === "pending-review" ? "details" : "details"); } });
    if (["draft", "published", "rejected", "pending-review"].includes(course.status)) actionItems.push({ label: "Edit Course", icon: Pencil, run: () => handleEdit(course) });
    if (course.status !== "archived") actionItems.push({ label: "Preview Course", icon: Eye, run: () => { setSelectedCourse(course); setDialogMode("preview"); } });
    if (["published", "draft"].includes(course.status)) actionItems.push({ label: "Duplicate Course", icon: Copy, run: () => requestAction("duplicate", course) });
    if (course.status === "published") actionItems.push({ label: "Archive Course", icon: Archive, run: () => requestAction("archive", course) });
    if (course.status === "archived") actionItems.push({ label: "Restore Course", icon: RotateCcw, run: () => requestAction("restore", course) });
    if (["draft", "archived"].includes(course.status)) actionItems.push({ label: "Delete Course", icon: Trash2, run: () => requestAction("delete", course) });
    if (course.status === "pending-review") actionItems.push({ label: "Withdraw Review", icon: X, run: () => requestAction("withdraw", course) });
    if (course.status === "rejected") actionItems.push({ label: "Review Feedback", icon: AlertCircle, run: () => { setSelectedCourse(course); setDialogMode("feedback"); } });
    if (course.status === "rejected") actionItems.push({ label: "Resubmit Course", icon: CheckCircle2, run: () => requestAction("resubmit", course) });

    return (
      <details className="relative">
        <summary aria-label={`Actions for ${course.title}`} className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 [&::-webkit-details-marker]:hidden"><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></summary>
        <div className="absolute right-0 z-20 mt-1 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">{actionItems.map((item) => { const Icon = item.icon; return <button key={item.label} type="button" onClick={(event) => { event.currentTarget.closest("details")?.removeAttribute("open"); item.run(); }} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500"><Icon className="h-4 w-4 text-slate-500" aria-hidden="true" />{item.label}</button>; })}</div>
      </details>
    );
  };

  const [dialogMode, setDialogMode] = React.useState("details");
  const openCourseDialog = (course, mode = "details") => { setSelectedCourse(course); setDialogMode(mode); };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-slate-500"><Link href="/instructor/dashboard" className="hover:text-primary-600">Instructor</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page" className="font-medium text-slate-900">Courses</span></nav>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Course workspace</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">My Courses</h1><p className="mt-2 text-sm leading-6 text-slate-600">Create, manage, organize, and monitor your courses from one place.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setActiveTab("published")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500"><BookOpen className="h-4 w-4" aria-hidden="true" />View Published Courses</button><Link href="/instructor/courses/create" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0F2F5F] px-4 text-sm font-semibold text-white hover:bg-[#143A72] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"><Plus className="h-4 w-4" aria-hidden="true" />Create New Course</Link></div></div>
      </header>

      {toastMessage ? <div role="status" className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span>{toastMessage}</span><button type="button" aria-label="Dismiss message" onClick={() => setToastMessage("")} className="rounded p-1 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"><X className="h-4 w-4" aria-hidden="true" /></button></div> : null}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 sm:gap-4">{summaryStats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-label="Instructor courses">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><h2 className="text-xl font-bold text-slate-900">Course Library</h2><p className="mt-1 text-sm text-slate-500">Manage status, content, and course performance.</p></div><div className="grid w-full gap-3 sm:grid-cols-2 xl:w-[720px] xl:grid-cols-3">
          <div className="relative sm:col-span-2 xl:col-span-1"><label htmlFor="instructor-course-search" className="sr-only">Search courses</label><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input id="instructor-course-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses..." className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/15" />{search ? <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"><X className="h-4 w-4" aria-hidden="true" /></button> : null}</div>
          <div><label htmlFor="course-category" className="sr-only">Category</label><select id="course-category" value={category} onChange={(event) => setCategory(event.target.value)} className={selectClass}><option value="all">All Categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
          <div><label htmlFor="course-level" className="sr-only">Level</label><select id="course-level" value={level} onChange={(event) => setLevel(event.target.value)} className={selectClass}><option value="all">All Levels</option>{levels.map((item) => <option key={item} value={item.toLowerCase()}>{item}</option>)}</select></div>
          <div><label htmlFor="course-status" className="sr-only">Status</label><select id="course-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={selectClass}><option value="all">All Status</option>{tabs.slice(1).map((tab) => <option key={tab.value} value={tab.value}>{tab.label}</option>)}</select></div>
          <div><label htmlFor="course-rating" className="sr-only">Rating</label><select id="course-rating" value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)} className={selectClass}>{ratingFilters.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
          <div><label htmlFor="course-price" className="sr-only">Price</label><select id="course-price" value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)} className={selectClass}><option value="all">All Prices</option><option value="free">Free</option><option value="paid">Paid</option></select></div>
          <div className="sm:col-span-2 xl:col-span-1"><label htmlFor="course-sort" className="sr-only">Sort By</label><select id="course-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={selectClass}>{sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
        </div></div>

        <div className="mt-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter courses by status">{tabs.map((tab) => <button key={tab.value} type="button" role="tab" aria-selected={activeTab === tab.value} onClick={() => setActiveTab(tab.value)} className={cn("min-h-10 rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500", activeTab === tab.value ? "border-blue-200 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>{tab.label}<span className="ml-1.5 tabular-nums text-slate-500">{counts[tab.value]}</span></button>)}</div><Button type="button" variant="outline" size="sm" onClick={resetFilters} leftIcon={<RefreshCcw className="h-4 w-4" />}>Reset Filters</Button></div>

        <div className="mt-4">{courses.length === 0 ? <EmptyState icon="empty" title="You haven't created any courses yet." description="Create your first course and start sharing your knowledge with learners." action={<Link href="/instructor/courses/create" className="inline-flex min-h-10 items-center rounded-lg bg-[#0F2F5F] px-4 text-sm font-semibold text-white">Create Your First Course</Link>} /> : filteredCourses.length === 0 ? <EmptyState icon="search" title="No courses found" description="Try changing your search or filters." action={<Button type="button" variant="outline" onClick={resetFilters}>Reset Filters</Button>} compact /> : <>
          <p className="mb-3 text-sm text-slate-500">Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredCourses.length)} of {filteredCourses.length} courses</p>
          <div className="hidden overflow-x-auto 2xl:block"><table className="w-full min-w-[1000px] border-separate border-spacing-0 text-left"><thead><tr className="text-xs font-semibold uppercase tracking-wide text-slate-500"><th scope="col" className="border-b border-slate-200 px-3 py-3">Course</th><th scope="col" className="border-b border-slate-200 px-3 py-3">Category</th><th scope="col" className="border-b border-slate-200 px-3 py-3">Students</th><th scope="col" className="border-b border-slate-200 px-3 py-3">Rating</th><th scope="col" className="border-b border-slate-200 px-3 py-3">Price</th><th scope="col" className="border-b border-slate-200 px-3 py-3">Status</th><th scope="col" className="border-b border-slate-200 px-3 py-3">Updated</th><th scope="col" className="border-b border-slate-200 px-3 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody>{visibleCourses.map((course) => <tr key={course.id} className="hover:bg-slate-50/80"><th scope="row" className="border-b border-slate-100 px-3 py-4 font-normal"><button type="button" onClick={() => openCourseDialog(course)} className="flex min-w-52 items-center gap-3 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-primary-500"><span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">{course.thumbnail ? <Image src={course.thumbnail} alt="" fill sizes="64px" className="object-cover" /> : null}</span><span className="min-w-0"><span className="block line-clamp-2 text-sm font-semibold text-slate-900">{course.title}</span><span className="mt-1 block text-xs text-slate-500">{course.courseId} · {course.level}</span></span></button></th><td className="border-b border-slate-100 px-3 py-4 text-sm text-slate-700">{course.category}</td><td className="border-b border-slate-100 px-3 py-4 text-sm tabular-nums text-slate-700">{course.students.toLocaleString("en-IN")}</td><td className="border-b border-slate-100 px-3 py-4"><span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900"><Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden="true" />{course.rating ? course.rating.toFixed(1) : "--"}</span><span className="ml-1 text-xs text-slate-500">({course.reviewCount})</span></td><td className="border-b border-slate-100 px-3 py-4 text-sm font-semibold text-slate-800">{course.price ? formatCurrency(course.price) : "Free"}</td><td className="border-b border-slate-100 px-3 py-4"><StatusBadge status={course.status} /></td><td className="border-b border-slate-100 px-3 py-4 text-sm text-slate-600">{relativeUpdate(course.updatedAt)}</td><td className="border-b border-slate-100 px-3 py-4"><div className="flex items-center gap-2"><Button type="button" variant="outline" size="sm" onClick={() => openCourseDialog(course)}>View</Button>{renderCourseActions(course)}</div></td></tr>)}</tbody></table></div>
          <div className="space-y-3 2xl:hidden">{visibleCourses.map((course) => <article key={course.id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4"><div className="flex gap-3"><div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">{course.thumbnail ? <Image src={course.thumbnail} alt={`${course.title} thumbnail`} fill sizes="80px" className="object-cover" /> : null}</div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-semibold text-slate-900">{course.title}</p><p className="mt-1 text-xs text-slate-500">{course.courseId} · {course.category} · {course.level}</p><p className="mt-1 text-xs text-slate-500">Instructor: {course.instructor.name}</p></div><StatusBadge status={course.status} /></div><div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4"><CourseMetric label="Students" value={course.students.toLocaleString("en-IN")} /><CourseMetric label="Rating" value={course.rating ? `${course.rating.toFixed(1)} ★ (${course.reviewCount})` : "No ratings"} /><CourseMetric label="Price" value={course.price ? formatCurrency(course.price) : "Free"} /><CourseMetric label="Updated" value={relativeUpdate(course.updatedAt)} /></div><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><Button type="button" variant="outline" size="sm" onClick={() => openCourseDialog(course)}>View Course</Button>{renderCourseActions(course)}</div></article>)}</div>
          {totalPages > 1 ? <nav aria-label="Course pagination" className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-500">Page {page} of {totalPages}</p><div className="flex items-center justify-center gap-2"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 disabled:opacity-50"><ChevronLeft className="h-4 w-4" aria-hidden="true" />Previous</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} aria-current={page === pageNumber ? "page" : undefined} className={cn("h-10 w-10 rounded-lg border text-sm font-semibold", page === pageNumber ? "border-primary-600 bg-primary-600 text-white" : "border-slate-200 bg-white text-slate-700")}>{pageNumber}</button>)}<button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 disabled:opacity-50">Next<ChevronRight className="h-4 w-4" aria-hidden="true" /></button></div></nav> : null}
        </>}</div>
      </section>

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="course-activity-heading"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Recent updates</p><h2 id="course-activity-heading" className="mt-1 text-xl font-bold text-slate-900">Recent Course Activity</h2></div><Clock3 className="h-4 w-4 text-slate-400" aria-hidden="true" /></div><ol className="mt-4 space-y-3">{instructorCourseActivity.map((activity) => <li key={activity.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3"><span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">{activity.type === "review" ? <Star className="h-4 w-4" aria-hidden="true" /> : activity.type === "submitted" ? <Clock3 className="h-4 w-4" aria-hidden="true" /> : activity.type === "milestone" ? <Users className="h-4 w-4" aria-hidden="true" /> : <Pencil className="h-4 w-4" aria-hidden="true" />}</span><div className="min-w-0"><p className="text-sm font-medium text-slate-900">{activity.text}</p><p className="mt-1 text-xs text-slate-500">{activity.time}</p></div></li>)}</ol></section>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="top-courses-heading"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">By enrolled learners</p><h2 id="top-courses-heading" className="mt-1 text-xl font-bold text-slate-900">Top Performing Courses</h2></div><TrendingUp className="h-5 w-5 text-emerald-700" aria-hidden="true" /></div><div className="mt-4 space-y-3">{topCourses.map((course) => <div key={course.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{course.title}</p><p className="mt-1 text-xs text-slate-500">{course.students.toLocaleString("en-IN")} students · {course.rating.toFixed(1)} rating · {course.completionRate}% completion</p></div><p className="text-sm font-bold text-slate-900">{formatCurrency(course.revenue)}</p></div>)}</div></section>
      </div>

      {selectedCourse ? <CourseDialog course={selectedCourse} mode={dialogMode} onClose={() => setSelectedCourse(null)} onChangeMode={setDialogMode} onEdit={handleEdit} /> : null}
      {dialog ? <ConfirmActionDialog action={dialog.action} course={dialog.course} onCancel={() => setDialog(null)} onConfirm={confirmAction} /> : null}
    </div>
  );
}

