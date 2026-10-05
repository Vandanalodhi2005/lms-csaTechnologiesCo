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
import { getCourseQuizPerformance, getQuizPerformance, getQuizStatusCounts, quizDemoDate, studentQuizzes } from "@/constants/studentQuizzes.js";
import { cn } from "@/utils";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileQuestion,
  FilterX,
  Search,
  Star,
  Target,
  X,
} from "lucide-react";

const PAGE_SIZE = 8;
const DEMO_DATE = quizDemoDate.slice(0, 10);

const tabs = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest Score" },
  { value: "lowest", label: "Lowest Score" },
  { value: "name", label: "Quiz Name" },
  { value: "due", label: "Due Date" },
];

const statusLabels = {
  available: "Available",
  "in-progress": "In Progress",
  completed: "Completed",
  passed: "Passed",
  failed: "Failed",
  overdue: "Overdue",
};

const statusVariants = {
  available: "info",
  "in-progress": "warning",
  completed: "secondary",
  passed: "success",
  failed: "danger",
  overdue: "danger",
};

const DEMO_COURSE_ACTIONS = {
  available: "Start Quiz",
  "in-progress": "Continue Quiz",
  completed: "Review Result",
  passed: "Review Result",
  failed: "Retry Quiz",
  overdue: "Review Quiz",
};

function dateKey(value) {
  return value?.slice(0, 10) || "";
}

function dayDistance(fromKey, toKey) {
  const from = new Date(`${fromKey}T00:00:00Z`);
  const to = new Date(`${toKey}T00:00:00Z`);
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

function formatQuizDate(dateValue, options = {}) {
  if (!dateValue) return "--";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    ...options,
  }).format(new Date(dateValue));
}

function getDueLabel(quiz) {
  if (quiz.status === "overdue") {
    const days = Math.max(1, Math.abs(dayDistance(DEMO_DATE, dateKey(quiz.dueDate))));
    return `Overdue by ${days} ${days === 1 ? "day" : "days"}`;
  }
  const days = dayDistance(DEMO_DATE, dateKey(quiz.dueDate));
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days < 0) return `Due ${formatQuizDate(quiz.dueDate)}`;
  return `Due in ${days} days`;
}

function quizRoute(quiz) {
  if (!quiz.routeAvailable || !quiz.routeQuizId) return null;
  return `/learn/${quiz.course.slug}/quiz/${quiz.routeQuizId}`;
}

function quizActionLabel(quiz) {
  return DEMO_COURSE_ACTIONS[quiz.status] || "View Quiz";
}

function statusMatchesTab(quiz, tab) {
  if (tab === "all") return true;
  if (tab === "completed") return ["completed", "passed", "failed"].includes(quiz.status);
  return quiz.status === tab;
}

function matchesScore(quiz, filter) {
  if (filter === "all") return true;
  if (typeof quiz.bestScore !== "number") return false;
  if (filter === "90") return quiz.bestScore >= 90;
  if (filter === "80") return quiz.bestScore >= 80 && quiz.bestScore <= 89;
  if (filter === "70") return quiz.bestScore >= 70 && quiz.bestScore <= 79;
  if (filter === "below70") return quiz.bestScore < 70;
  return true;
}

function QuizStatus({ status }) {
  const Icon = status === "passed" ? CheckCircle2 : status === "failed" || status === "overdue" ? AlertCircle : status === "available" ? PlayIcon : Clock3;
  return <Badge variant={statusVariants[status] || "secondary"}><Icon className="h-3.5 w-3.5" aria-hidden="true" />{statusLabels[status] || "Available"}</Badge>;
}

function PlayIcon(props) {
  return <CircleHelp {...props} />;
}

function SummaryCard({ label, value, detail, icon: Icon, tone }) {
  const toneClass = tone === "amber" ? "bg-amber-50 text-amber-700" : tone === "green" ? "bg-emerald-50 text-emerald-700" : tone === "sky" ? "bg-sky-50 text-sky-700" : "bg-blue-50 text-blue-700";
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{value}</p></div><span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneClass)}><Icon className="h-5 w-5" aria-hidden="true" /></span></div>
      <p className="mt-3 text-xs text-slate-500">{detail}</p>
    </article>
  );
}

function QuizDetailsDialog({ quiz, onClose }) {
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
      previousFocus?.focus?.();
    };
  }, [onClose]);

  const route = quizRoute(quiz);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="quiz-details-title" onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); onClose(); } }} className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl">
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Quiz Details</p><h2 id="quiz-details-title" className="mt-1 text-xl font-bold text-slate-900">{quiz.title}</h2></div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close quiz details" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500"><X className="h-4 w-4" aria-hidden="true" /></button>
        </div>
        <div className="space-y-5 p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2"><QuizStatus status={quiz.status} /><Badge variant="secondary">{quiz.difficulty}</Badge><Badge variant="outline">{quiz.quizId}</Badge></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <QuizDetail label="Course" value={quiz.course.title} />
            <QuizDetail label="Instructor" value={quiz.instructor.name} />
            <QuizDetail label="Questions" value={`${quiz.questions} questions`} />
            <QuizDetail label="Duration" value={`${quiz.duration} minutes`} />
            <QuizDetail label="Passing Score" value={`${quiz.passingScore}%`} />
            <QuizDetail label="Attempts Allowed" value={`${quiz.attemptsAllowed}`} />
            <QuizDetail label="Attempts Used" value={`${quiz.attemptsUsed} / ${quiz.attemptsAllowed}`} />
            <QuizDetail label="Due Date" value={formatQuizDate(quiz.dueDate, { month: "long" })} />
            <QuizDetail label="Status" value={statusLabels[quiz.status]} />
            <QuizDetail label="Best Score" value={quiz.bestScore === null ? "Not attempted" : `${quiz.bestScore}%`} />
          </div>
          <div className="rounded-xl bg-slate-50 p-4"><h3 className="text-sm font-semibold text-slate-900">About this quiz</h3><p className="mt-2 text-sm leading-6 text-slate-600">{quiz.description}</p><p className="mt-3 text-xs text-slate-500">Quiz attempts and scores shown here are simulated demo data.</p></div>
          <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
            {route ? <Button asChild leftIcon={<ArrowRight className="h-4 w-4" />}><Link href={route}>{quizActionLabel(quiz)}</Link></Button> : <Button asChild variant="outline" leftIcon={<BookOpen className="h-4 w-4" />}><Link href={`/courses/${quiz.course.slug}`}>View Course</Link></Button>}
          </div>
        </div>
      </section>
    </div>
  );
}

function QuizDetail({ label, value }) {
  return <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-900">{value}</p></div>;
}

function QuizAction({ quiz, onView }) {
  const route = quizRoute(quiz);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" size="sm" onClick={() => onView(quiz)}>View Details</Button>
      {route ? <Link href={route} className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg bg-[#0F2F5F] px-3 text-xs font-semibold text-white hover:bg-[#143A72] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">{quizActionLabel(quiz)}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link> : null}
    </div>
  );
}

function UpcomingQuizzes({ quizzes: items, onView }) {
  return (
    <section className="min-w-0 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="upcoming-quizzes-heading">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Next up</p><h2 id="upcoming-quizzes-heading" className="mt-1 text-xl font-bold text-slate-900">Upcoming Quizzes</h2></div><Clock3 className="h-5 w-5 text-primary-700" aria-hidden="true" /></div>
      {items.length ? <ul className="mt-4 divide-y divide-slate-100">{items.map((quiz) => <li key={quiz.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><button type="button" onClick={() => onView(quiz)} className="text-left text-sm font-semibold text-slate-900 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">{quiz.title}</button><p className="mt-1 truncate text-xs text-slate-500">{quiz.course.title} · {quiz.questions} questions · {quiz.duration} min</p><p className="mt-1 text-xs text-slate-600">{getDueLabel(quiz)} · {formatQuizDate(quiz.dueDate, { month: "long" })} · {quiz.attemptsUsed}/{quiz.attemptsAllowed} attempts</p></div><div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end"><QuizStatus status={quiz.status} />{quizRoute(quiz) ? <Link href={quizRoute(quiz)} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-primary-500">Start Quiz<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link> : <Button type="button" variant="outline" size="sm" onClick={() => onView(quiz)}>View Details</Button>}</div></li>)}</ul> : <EmptyState icon="empty" title="You're all caught up." description="There are no upcoming quizzes in this demo profile." compact />}
    </section>
  );
}

function Metric({ label, value }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-lg font-bold tabular-nums text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>;
}

export default function StudentQuizzesClient() {
  const [activeTab, setActiveTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [difficultyFilter, setDifficultyFilter] = React.useState("all");
  const [scoreFilter, setScoreFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("due");
  const [page, setPage] = React.useState(1);
  const [selectedQuiz, setSelectedQuiz] = React.useState(null);

  const counts = React.useMemo(() => getQuizStatusCounts(), []);
  const performance = React.useMemo(() => getQuizPerformance(), []);
  const coursePerformance = React.useMemo(() => getCourseQuizPerformance(), []);
  const courses = React.useMemo(() => [...new Map(studentQuizzes.map((quiz) => [quiz.course.slug, quiz.course])).values()].sort((a, b) => a.title.localeCompare(b.title)), []);

  const filteredQuizzes = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const results = studentQuizzes.filter((quiz) => {
      const tabMatch = statusMatchesTab(quiz, activeTab);
      const searchMatch = !query || [quiz.title, quiz.course.title, quiz.instructor.name, quiz.quizId].some((value) => value.toLowerCase().includes(query));
      const courseMatch = courseFilter === "all" || quiz.course.slug === courseFilter;
      const statusMatch = statusFilter === "all" || quiz.status === statusFilter;
      const difficultyMatch = difficultyFilter === "all" || quiz.difficulty.toLowerCase() === difficultyFilter;
      return tabMatch && searchMatch && courseMatch && statusMatch && difficultyMatch && matchesScore(quiz, scoreFilter);
    });

    return results.sort((first, second) => {
      if (sortBy === "oldest") return new Date(first.dueDate) - new Date(second.dueDate);
      if (sortBy === "highest") return (second.bestScore ?? -1) - (first.bestScore ?? -1);
      if (sortBy === "lowest") return (first.bestScore ?? 101) - (second.bestScore ?? 101);
      if (sortBy === "name") return first.title.localeCompare(second.title);
      if (sortBy === "newest") return new Date(second.completedAt || second.dueDate) - new Date(first.completedAt || first.dueDate);
      return new Date(first.dueDate) - new Date(second.dueDate);
    });
  }, [activeTab, search, courseFilter, statusFilter, difficultyFilter, scoreFilter, sortBy]);

  React.useEffect(() => setPage(1), [activeTab, search, courseFilter, statusFilter, difficultyFilter, scoreFilter, sortBy]);

  const upcomingQuizzes = React.useMemo(() => studentQuizzes
    .filter((quiz) => ["available", "in-progress"].includes(quiz.status) && dayDistance(DEMO_DATE, dateKey(quiz.dueDate)) >= 0)
    .sort((first, second) => new Date(first.dueDate) - new Date(second.dueDate))
    .slice(0, 4), []);

  const recentResults = React.useMemo(() => studentQuizzes
    .filter((quiz) => quiz.completedAt && typeof quiz.bestScore === "number")
    .sort((first, second) => new Date(second.completedAt) - new Date(first.completedAt))
    .slice(0, 4), []);

  const totalPages = Math.max(1, Math.ceil(filteredQuizzes.length / PAGE_SIZE));
  const visibleQuizzes = filteredQuizzes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const summaryCards = [
    { key: "total", label: "Total Quizzes", value: counts.all, detail: `${performance.attempted} attempts recorded`, icon: FileQuestion, tone: "blue" },
    { key: "available", label: "Available", value: counts.available, detail: "Ready when you are", icon: CircleHelp, tone: "sky" },
    { key: "completed", label: "Completed", value: counts.completed, detail: `${performance.passed} passed · ${performance.failed} failed`, icon: CheckCircle2, tone: "green" },
    { key: "average", label: "Average Score", value: `${performance.averageScore}%`, detail: `Pass rate ${performance.passRate}%`, icon: Award, tone: "amber" },
  ];

  const resetFilters = () => {
    setActiveTab("all");
    setSearch("");
    setCourseFilter("all");
    setStatusFilter("all");
    setDifficultyFilter("all");
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
          <aside className="hidden w-72 shrink-0 lg:block"><StudentSidebar currentPath="/dashboard/quizzes" /></aside>
          <main className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between gap-3 lg:hidden"><StudentMobileNav currentPath="/dashboard/quizzes" /><Avatar src={student.avatar} alt={student.name} name={student.name} size="sm" /></div>
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500"><Link href="/dashboard" className="hover:text-primary-600">Dashboard</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page" className="font-medium text-slate-900">Quizzes</span></nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Assessments</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">My Quizzes</h1><p className="mt-2 text-sm leading-6 text-slate-600">View your available quizzes, track attempts, and review your quiz performance.</p></div>
              <Link href="/dashboard/courses" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0F2F5F] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#143A72] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">View My Courses<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4 sm:gap-4">
              {summaryCards.map((card) => <SummaryCard key={card.key} label={card.label} value={card.value} detail={card.detail} icon={card.icon} tone={card.tone} />)}
            </div>

            <div className="mb-6 grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <UpcomingQuizzes quizzes={upcomingQuizzes} onView={setSelectedQuiz} />
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="quiz-performance-heading">
                <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Your results</p><h2 id="quiz-performance-heading" className="mt-1 text-xl font-bold text-slate-900">Quiz Performance</h2></div><Target className="h-5 w-5 text-slate-400" aria-hidden="true" /></div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"><Metric label="Quizzes Attempted" value={performance.attempted} /><Metric label="Passed" value={performance.passed} /><Metric label="Failed" value={performance.failed} /><Metric label="Average Score" value={`${performance.averageScore}%`} /><Metric label="Highest Score" value={`${performance.highestScore}%`} /><Metric label="Pass Rate" value={`${performance.passRate}%`} /></div>
                <div className="mt-4" role="img" aria-label={`Quiz pass rate ${performance.passRate} percent, average score ${performance.averageScore} percent.`}><div className="flex items-center justify-between text-xs text-slate-500"><span>Pass rate</span><span>{performance.passRate}%</span></div><div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${performance.passRate}%` }} /></div><div className="sr-only">Average score: {performance.averageScore} percent. Highest score: {performance.highestScore} percent.</div></div>
              </section>
            </div>

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-labelledby="quiz-list-heading">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Assessments overview</p><h2 id="quiz-list-heading" className="mt-1 text-xl font-bold text-slate-900">Quizzes</h2></div><div className="grid w-full gap-3 sm:grid-cols-2 xl:w-[620px] xl:grid-cols-3">
                <div className="relative sm:col-span-2 xl:col-span-1"><label htmlFor="quiz-search" className="sr-only">Search quizzes</label><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input id="quiz-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search quizzes..." className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/15" />{search ? <button type="button" aria-label="Clear search" onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"><X className="h-4 w-4" aria-hidden="true" /></button> : null}</div>
                <div><label htmlFor="quiz-course" className="sr-only">Course</label><select id="quiz-course" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className={selectClass}><option value="all">All Courses</option>{courses.map((course) => <option key={course.slug} value={course.slug}>{course.title}</option>)}</select></div>
                <div><label htmlFor="quiz-status" className="sr-only">Status</label><select id="quiz-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={selectClass}><option value="all">All Status</option>{["available", "in-progress", "completed", "passed", "failed", "overdue"].map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></div>
                <div><label htmlFor="quiz-difficulty" className="sr-only">Difficulty</label><select id="quiz-difficulty" value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)} className={selectClass}><option value="all">All Difficulties</option>{["beginner", "intermediate", "advanced"].map((level) => <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>)}</select></div>
                <div><label htmlFor="quiz-score" className="sr-only">Score</label><select id="quiz-score" value={scoreFilter} onChange={(event) => setScoreFilter(event.target.value)} className={selectClass}><option value="all">All Scores</option><option value="90">90-100</option><option value="80">80-89</option><option value="70">70-79</option><option value="below70">Below 70</option></select></div>
                <div><label htmlFor="quiz-sort" className="sr-only">Sort By</label><select id="quiz-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={selectClass}>{sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
              </div></div>

              <div className="mt-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter quizzes by status">{tabs.map((tab) => <button key={tab.value} type="button" role="tab" aria-selected={activeTab === tab.value} aria-current={activeTab === tab.value ? "true" : undefined} onClick={() => setActiveTab(tab.value)} className={cn("min-h-10 rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500", activeTab === tab.value ? "border-blue-200 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>{tab.label}<span className="ml-1.5 tabular-nums text-slate-500">{counts[tab.value]}</span></button>)}</div><Button type="button" variant="outline" size="sm" onClick={resetFilters} leftIcon={<FilterX className="h-4 w-4" />}>Reset Filters</Button></div>

              <div className="mt-4">{studentQuizzes.length === 0 ? <EmptyState icon="empty" title="You don't have any quizzes yet." description="Available quizzes from your courses will appear here." action={<Link href="/dashboard/courses" className="inline-flex min-h-10 items-center rounded-lg bg-[#0F2F5F] px-4 text-sm font-semibold text-white hover:bg-[#143A72]">View My Courses</Link>} /> : filteredQuizzes.length === 0 ? <EmptyState icon="search" title={search ? "No quizzes match your search." : activeTab === "available" ? "You're all caught up." : activeTab === "failed" ? "No failed quizzes." : activeTab === "completed" ? "You haven't completed any quizzes yet." : "No quizzes found."} description="Try changing your search or filters." action={<Button type="button" variant="outline" onClick={resetFilters}>Reset Filters</Button>} compact /> : <>
                <p className="mb-3 text-sm text-slate-500">Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredQuizzes.length)} of {filteredQuizzes.length} quizzes</p>
                <div className="hidden overflow-x-auto 2xl:block"><table className="w-full min-w-[900px] border-separate border-spacing-0 text-left"><thead><tr className="text-xs font-semibold uppercase tracking-wide text-slate-500"><th scope="col" className="border-b border-slate-200 px-3 py-3">Quiz</th><th scope="col" className="border-b border-slate-200 px-3 py-3">Course</th><th scope="col" className="border-b border-slate-200 px-3 py-3">Questions</th><th scope="col" className="border-b border-slate-200 px-3 py-3">Duration</th><th scope="col" className="border-b border-slate-200 px-3 py-3">Due Date</th><th scope="col" className="border-b border-slate-200 px-3 py-3">Status</th><th scope="col" className="border-b border-slate-200 px-3 py-3">Score</th><th scope="col" className="border-b border-slate-200 px-3 py-3">Attempts</th><th scope="col" className="border-b border-slate-200 px-3 py-3"><span className="sr-only">Action</span></th></tr></thead><tbody>{visibleQuizzes.map((quiz) => <tr key={quiz.id} className="hover:bg-slate-50/80"><th scope="row" className="border-b border-slate-100 px-3 py-4 font-normal"><button type="button" onClick={() => setSelectedQuiz(quiz)} className="block max-w-56 text-left focus:outline-none focus:ring-2 focus:ring-primary-500"><span className="block text-sm font-semibold text-slate-900">{quiz.title}</span><span className="mt-1 block text-xs text-slate-500">{quiz.quizId} · {quiz.difficulty}</span></button></th><td className="border-b border-slate-100 px-3 py-4"><p className="max-w-44 truncate text-sm font-medium text-slate-800">{quiz.course.title}</p><p className="mt-1 text-xs text-slate-500">{quiz.category} · {quiz.instructor.name}</p></td><td className="border-b border-slate-100 px-3 py-4 text-sm text-slate-700">{quiz.questions}</td><td className="border-b border-slate-100 px-3 py-4 text-sm text-slate-700">{quiz.duration} min</td><td className="border-b border-slate-100 px-3 py-4"><p className="text-sm text-slate-800">{formatQuizDate(quiz.dueDate)}</p><p className="mt-1 text-xs text-slate-500">{getDueLabel(quiz)}</p></td><td className="border-b border-slate-100 px-3 py-4"><QuizStatus status={quiz.status} /></td><td className="border-b border-slate-100 px-3 py-4 text-sm font-semibold tabular-nums text-slate-800">{quiz.bestScore === null ? "--" : `${quiz.bestScore}%`}</td><td className="border-b border-slate-100 px-3 py-4 text-sm tabular-nums text-slate-700">{quiz.attemptsUsed}/{quiz.attemptsAllowed}</td><td className="border-b border-slate-100 px-3 py-4"><QuizAction quiz={quiz} onView={setSelectedQuiz} /></td></tr>)}</tbody></table></div>
                <div className="space-y-3 2xl:hidden">{visibleQuizzes.map((quiz) => <article key={quiz.id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{quiz.quizId} · {quiz.difficulty}</p><button type="button" onClick={() => setSelectedQuiz(quiz)} className="mt-1 line-clamp-2 text-left text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500">{quiz.title}</button></div><QuizStatus status={quiz.status} /></div><p className="mt-2 truncate text-xs text-slate-500">{quiz.course.title} · {quiz.category}</p><div className="mt-3 grid grid-cols-2 gap-3 text-xs"><div><p className="text-slate-500">Questions · Duration</p><p className="mt-1 font-medium text-slate-800">{quiz.questions} · {quiz.duration} min</p></div><div><p className="text-slate-500">Score · Attempts</p><p className="mt-1 font-medium text-slate-800">{quiz.bestScore === null ? "--" : `${quiz.bestScore}%`} · {quiz.attemptsUsed}/{quiz.attemptsAllowed}</p></div></div><div className="mt-3 flex items-center justify-between gap-2"><p className="text-xs text-slate-500">{getDueLabel(quiz)} · {formatQuizDate(quiz.dueDate)}</p><QuizAction quiz={quiz} onView={setSelectedQuiz} /></div></article>)}</div>
                {totalPages > 1 ? <nav aria-label="Quiz pagination" className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-500">Page {page} of {totalPages}</p><div className="flex items-center justify-center gap-2"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 disabled:opacity-50"><ChevronLeft className="h-4 w-4" aria-hidden="true" />Previous</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} aria-current={page === pageNumber ? "page" : undefined} className={cn("h-10 w-10 rounded-lg border text-sm font-semibold", page === pageNumber ? "border-primary-600 bg-primary-600 text-white" : "border-slate-200 bg-white text-slate-700")}>{pageNumber}</button>)}<button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 disabled:opacity-50">Next<ChevronRight className="h-4 w-4" aria-hidden="true" /></button></div></nav> : null}
              </>}</div>
            </section>

            <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="recent-quiz-results-heading"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Latest results</p><h2 id="recent-quiz-results-heading" className="mt-1 text-xl font-bold text-slate-900">Recent Quiz Results</h2></div><Badge variant="secondary">Demo records</Badge></div>{recentResults.length ? <div className="mt-4 divide-y divide-slate-100">{recentResults.map((quiz) => <div key={quiz.id} className="flex flex-col gap-3 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{quiz.title}</p><p className="mt-1 truncate text-xs text-slate-500">{quiz.course.title} · {formatQuizDate(quiz.completedAt)}</p></div><div className="flex items-center justify-between gap-3 sm:justify-end"><QuizStatus status={quiz.status} /><span className="text-sm font-bold tabular-nums text-slate-900">{quiz.bestScore}%</span><QuizAction quiz={quiz} onView={setSelectedQuiz} /></div></div>)}</div> : <EmptyState icon="empty" title="No quiz results yet" description="Completed quiz results will appear here." compact />}</section>

              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="course-quiz-performance-heading"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Course comparison</p><h2 id="course-quiz-performance-heading" className="mt-1 text-xl font-bold text-slate-900">Performance by Course</h2></div><Star className="h-5 w-5 text-amber-500" aria-hidden="true" /></div>{coursePerformance.length ? <ul className="mt-4 space-y-4">{coursePerformance.map((course) => <li key={course.slug}><div className="flex items-center justify-between gap-3"><span className="min-w-0 truncate text-sm font-medium text-slate-700">{course.title}</span><span className="shrink-0 text-sm font-semibold tabular-nums text-slate-900">{course.average}%</span></div><div className="mt-2" role="progressbar" aria-label={`${course.title} average score`} aria-valuenow={course.average} aria-valuemin={0} aria-valuemax={100}><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600" style={{ width: `${course.average}%` }} /></div></div></li>)}</ul> : <EmptyState icon="empty" title="No course scores yet" description="Scores will appear here after quizzes are completed." compact />}</section>
            </div>
          </main>
        </div>
      </div>
      {selectedQuiz ? <QuizDetailsDialog quiz={selectedQuiz} onClose={() => setSelectedQuiz(null)} /> : null}
    </div>
  );
}