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
import CertificatePreview from "@/components/certificates/CertificatePreview.jsx";
import { student } from "@/constants/studentDashboard.js";
import { calculateCertificateStats, studentCertificates } from "@/constants/studentCertificates.js";
import { cn } from "@/utils";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Copy,
  FilterX,
  GraduationCap,
  Printer,
  Search,
  Share2,
  X,
} from "lucide-react";

function formatDate(dateValue, options = {}) {
  if (!dateValue) return "--";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC", ...options }).format(new Date(`${dateValue}T00:00:00Z`));
}

function CertificateStat({ label, value, description, icon: Icon, tone }) {
  const toneClass = tone === "green" ? "bg-emerald-50 text-emerald-700" : tone === "amber" ? "bg-amber-50 text-amber-700" : tone === "navy" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700";
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 truncate text-2xl font-bold text-slate-900">{value}</p></div><span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", toneClass)}><Icon className="h-5 w-5" aria-hidden="true" /></span></div><p className="mt-3 text-xs text-slate-500">{description}</p></article>;
}

function CertificateMiniature({ certificate }) {
  return (
    <div className="relative aspect-[1.42/1] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 sm:p-3" aria-label={`Preview of ${certificate.title} for ${certificate.course.title}`}>
      {certificate.course.thumbnail ? <Image src={certificate.course.thumbnail} alt="" fill sizes="(max-width: 639px) 100vw, 33vw" className="object-cover opacity-[0.08]" /> : null}
      <div className="relative flex h-full flex-col items-center justify-between border border-[#B7C9E1] bg-white/95 px-3 py-3 text-center sm:px-5 sm:py-4">
        <div className="flex w-full items-center justify-between gap-2 border-b border-slate-100 pb-2"><span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0F2F5F] sm:text-xs"><span className="flex h-5 w-5 items-center justify-center rounded bg-[#0F2F5F] text-[10px] text-white">E</span>EduLearn</span><span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[9px] font-semibold text-blue-800">Demo Certificate</span></div>
        <div className="min-w-0 py-2"><p className="text-[9px] uppercase tracking-[0.18em] text-slate-500 sm:text-[10px]">Certificate of Completion</p><p className="mt-2 line-clamp-1 text-sm font-bold text-slate-900 sm:text-lg">{certificate.course.title}</p><p className="mt-1 text-[10px] text-slate-500 sm:text-xs">Presented to {certificate.student.name}</p></div>
        <div className="w-full border-t border-slate-100 pt-2 text-[9px] text-slate-500 sm:text-[10px]">Issued {formatDate(certificate.issueDate)} · {certificate.certificateId}</div>
      </div>
    </div>
  );
}

function CertificatePreviewDialog({ certificate, onClose, onCopy }) {
  const dialogRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const [feedback, setFeedback] = React.useState("");

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

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/dashboard/certificates/${certificate.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: certificate.title, text: certificate.description, url });
        setFeedback("Share sheet opened.");
      } else {
        await navigator.clipboard.writeText(url);
        setFeedback("Certificate link copied.");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setFeedback("Certificate link copied.");
      } catch {
        setFeedback("Unable to share right now.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="certificate-dialog-title" onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); onClose(); } }} className="max-h-[94vh] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-6xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Certificate Preview</p><h2 id="certificate-dialog-title" className="mt-1 text-lg font-bold text-slate-900">{certificate.course.title}</h2></div><button ref={closeRef} type="button" onClick={onClose} aria-label="Close certificate preview" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500"><X className="h-4 w-4" aria-hidden="true" /></button></div>
        <div className="grid min-w-0 gap-5 p-3 sm:p-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
          <div className="certificate-print-preview min-w-0"><CertificatePreview certificate={certificate} /></div>
          <aside className="min-w-0 space-y-4">
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-4"><h3 className="text-sm font-semibold text-slate-900">Certificate Information</h3><dl className="mt-3 space-y-3 text-sm"><InfoRow label="Certificate ID" value={certificate.certificateId} /><InfoRow label="Verification Code" value={certificate.verificationCode} /><InfoRow label="Course" value={certificate.course.title} /><InfoRow label="Instructor" value={certificate.instructor.name} /><InfoRow label="Completion Date" value={formatDate(certificate.completionDate, { month: "long" })} /><InfoRow label="Issue Date" value={formatDate(certificate.issueDate, { month: "long" })} /><InfoRow label="Final Score" value={`${certificate.score}%`} /><InfoRow label="Course Duration" value={certificate.course.duration} /></dl></section>
            <section className="rounded-xl border border-blue-200 bg-blue-50 p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold text-blue-950">Certificate Verification</h3><Badge variant="secondary">Demo Record</Badge></div><p className="mt-2 break-all text-sm font-semibold text-blue-900">{certificate.verificationCode}</p><p className="mt-2 text-xs leading-5 text-blue-800">For demonstration only. No live or cryptographic verification is performed.</p></section>
            <div className="flex flex-col gap-2"><Button type="button" leftIcon={<Printer className="h-4 w-4" />} onClick={handlePrint}>Print Certificate</Button><Button type="button" variant="outline" leftIcon={<Share2 className="h-4 w-4" />} onClick={handleShare}>Share Certificate</Button><Button type="button" variant="outline" leftIcon={<Copy className="h-4 w-4" />} onClick={() => onCopy(certificate, setFeedback)}>Copy Verification Code</Button><Link href={`/dashboard/certificates/${certificate.id}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-primary-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary-500">Open Certificate Details<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
            {feedback ? <p role="status" className="text-sm text-emerald-700">{feedback}</p> : null}
          </aside>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, value }) {
  return <div className="flex flex-col gap-1 border-b border-slate-200 pb-2 last:border-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-3"><dt className="text-xs text-slate-500">{label}</dt><dd className="break-all text-sm font-medium text-slate-900 sm:text-right">{value}</dd></div>;
}

export default function StudentCertificatesClient() {
  const [search, setSearch] = React.useState("");
  const [yearFilter, setYearFilter] = React.useState("all");
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [instructorFilter, setInstructorFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");
  const [selectedCertificate, setSelectedCertificate] = React.useState(null);
  const [toastMessage, setToastMessage] = React.useState("");

  const stats = React.useMemo(() => calculateCertificateStats(studentCertificates), []);
  const years = React.useMemo(() => [...new Set(studentCertificates.map((certificate) => certificate.issueDate.slice(0, 4)))].sort((a, b) => Number(b) - Number(a)), []);
  const courses = React.useMemo(() => [...new Map(studentCertificates.map((certificate) => [certificate.course.slug, certificate.course])).values()].sort((a, b) => a.title.localeCompare(b.title)), []);
  const instructors = React.useMemo(() => [...new Set(studentCertificates.map((certificate) => certificate.instructor.name))].sort(), []);

  const filteredCertificates = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = studentCertificates.filter((certificate) => {
      const searchMatch = !query || [certificate.title, certificate.course.title, certificate.certificateId, certificate.instructor.name].some((value) => value.toLowerCase().includes(query));
      return searchMatch && (yearFilter === "all" || certificate.issueDate.slice(0, 4) === yearFilter) && (courseFilter === "all" || certificate.course.slug === courseFilter) && (instructorFilter === "all" || certificate.instructor.name === instructorFilter);
    });
    return filtered.sort((first, second) => {
      if (sortBy === "oldest") return new Date(first.issueDate) - new Date(second.issueDate);
      if (sortBy === "course") return first.course.title.localeCompare(second.course.title);
      if (sortBy === "id") return first.certificateId.localeCompare(second.certificateId);
      return new Date(second.issueDate) - new Date(first.issueDate);
    });
  }, [search, yearFilter, courseFilter, instructorFilter, sortBy]);

  const recentActivity = React.useMemo(() => [...studentCertificates].sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate)).slice(0, 4), []);
  const latestCertificate = stats.latestCertificate;
  const summaryCards = [
    { label: "Certificates Earned", value: stats.total, description: "Demo course completions", icon: Award, tone: "blue" },
    { label: "Courses Completed", value: stats.coursesCompleted, description: "Unique courses completed", icon: BookOpen, tone: "green" },
    { label: "Certificates This Year", value: stats.thisYear, description: "Issued during the current year", icon: CheckCircle2, tone: "amber" },
    { label: "Latest Certificate", value: latestCertificate ? formatDate(latestCertificate.issueDate) : "--", description: latestCertificate?.course.title || "No certificates yet", icon: GraduationCap, tone: "navy" },
  ];

  React.useEffect(() => {
    if (!toastMessage) return undefined;
    const timeout = window.setTimeout(() => setToastMessage(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const handleCopy = async (certificate, setDialogFeedback) => {
    try {
      await navigator.clipboard.writeText(certificate.verificationCode);
      if (setDialogFeedback) setDialogFeedback("Verification code copied.");
      else setToastMessage("Verification code copied.");
    } catch {
      if (setDialogFeedback) setDialogFeedback("Clipboard access is unavailable.");
      else setToastMessage("Clipboard access is unavailable.");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setYearFilter("all");
    setCourseFilter("all");
    setInstructorFilter("all");
    setSortBy("newest");
  };

  const selectClass = "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15";

  return (
    <div className="certificate-dashboard-shell min-h-screen bg-[#F8FAFC]">
      <Header />
      <div className="container-page py-6 md:py-8 xl:py-10">
        <div className="flex min-w-0 gap-6">
          <aside className="hidden w-72 shrink-0 lg:block"><StudentSidebar currentPath="/dashboard/certificates" /></aside>
          <main className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between gap-3 lg:hidden"><StudentMobileNav currentPath="/dashboard/certificates" /><Avatar src={student.avatar} alt={student.name} name={student.name} size="sm" /></div>
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500"><Link href="/dashboard" className="hover:text-primary-600">Dashboard</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page" className="font-medium text-slate-900">Certificates</span></nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Learning milestones</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">My Certificates</h1><p className="mt-2 text-sm leading-6 text-slate-600">View and manage the certificates you have earned from completed courses.</p></div><Link href="/courses" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0F2F5F] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#143A72] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">Browse Courses<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>

            <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4 sm:gap-4">{summaryCards.map((card) => <CertificateStat key={card.label} {...card} />)}</div>

            {toastMessage ? <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{toastMessage}</div> : null}

            <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-label="Certificate filters"><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(260px,1.4fr)_repeat(4,minmax(140px,1fr))]">
              <div className="relative"><label htmlFor="certificate-search" className="sr-only">Search certificates</label><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input id="certificate-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search certificates..." className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/15" />{search ? <button type="button" aria-label="Clear search" onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"><X className="h-4 w-4" aria-hidden="true" /></button> : null}</div>
              <div><label htmlFor="certificate-year" className="sr-only">Year</label><select id="certificate-year" value={yearFilter} onChange={(event) => setYearFilter(event.target.value)} className={selectClass}><option value="all">All Years</option>{years.map((year) => <option key={year} value={year}>{year}</option>)}</select></div>
              <div><label htmlFor="certificate-course" className="sr-only">Course</label><select id="certificate-course" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className={selectClass}><option value="all">All Courses</option>{courses.map((course) => <option key={course.slug} value={course.slug}>{course.title}</option>)}</select></div>
              <div><label htmlFor="certificate-instructor" className="sr-only">Instructor</label><select id="certificate-instructor" value={instructorFilter} onChange={(event) => setInstructorFilter(event.target.value)} className={selectClass}><option value="all">All Instructors</option>{instructors.map((name) => <option key={name} value={name}>{name}</option>)}</select></div>
              <div><label htmlFor="certificate-sort" className="sr-only">Sort By</label><select id="certificate-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={selectClass}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="course">Course Name</option><option value="id">Certificate ID</option></select></div>
            </div><div className="mt-3 flex justify-end"><Button type="button" variant="outline" size="sm" onClick={resetFilters} leftIcon={<FilterX className="h-4 w-4" />}>Reset Filters</Button></div></section>

            <section aria-labelledby="certificate-grid-heading"><div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Your achievements</p><h2 id="certificate-grid-heading" className="mt-1 text-xl font-bold text-slate-900">Earned Certificates</h2></div><span className="text-sm text-slate-500">{filteredCertificates.length} certificates</span></div>
              {studentCertificates.length === 0 ? <EmptyState icon="empty" title="You haven&apos;t earned any certificates yet." description="Complete a course to earn your first certificate." action={<Link href="/courses" className="inline-flex min-h-10 items-center rounded-lg bg-[#0F2F5F] px-4 text-sm font-semibold text-white">Browse Courses</Link>} /> : filteredCertificates.length === 0 ? <EmptyState icon="search" title="No certificates match your search." description="No certificates match the selected filters." action={<Button type="button" variant="outline" onClick={resetFilters}>Reset Filters</Button>} compact /> : <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">{filteredCertificates.map((certificate) => <article key={certificate.id} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><button type="button" onClick={() => setSelectedCertificate(certificate)} className="block w-full p-3 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"><CertificateMiniature certificate={certificate} /></button><div className="p-4 pt-1"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className="line-clamp-1 text-sm font-bold text-slate-900">{certificate.course.title}</h3><p className="mt-1 text-xs text-slate-500">{certificate.instructor.name}</p></div><Badge variant="secondary">Demo Record</Badge></div><div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-slate-500"><span>Issued {formatDate(certificate.issueDate)}</span><span className="font-medium text-slate-700">{certificate.certificateId}</span></div><div className="mt-4 grid grid-cols-2 gap-2"><Link href={`/dashboard/certificates/${certificate.id}`} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-[#0F2F5F] px-3 text-xs font-semibold text-white hover:bg-[#143A72] focus:outline-none focus:ring-2 focus:ring-primary-500">View Certificate<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link><button type="button" onClick={() => setSelectedCertificate(certificate)} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500"><Award className="h-3.5 w-3.5" aria-hidden="true" />Preview</button></div><div className="mt-2 grid grid-cols-3 gap-1"><button type="button" onClick={() => { setSelectedCertificate(certificate); window.setTimeout(() => window.print(), 0); }} aria-label={`Print ${certificate.course.title} certificate`} className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"><Printer className="h-3.5 w-3.5" aria-hidden="true" />Print</button><button type="button" onClick={async () => { const url = `${window.location.origin}/dashboard/certificates/${certificate.id}`; try { if (navigator.share) await navigator.share({ title: certificate.title, text: certificate.description, url }); else await navigator.clipboard.writeText(url); setToastMessage(navigator.share ? "Share sheet opened." : "Certificate link copied."); } catch { try { await navigator.clipboard.writeText(url); setToastMessage("Certificate link copied."); } catch { setToastMessage("Unable to share right now."); } } }} aria-label={`Share ${certificate.course.title} certificate`} className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"><Share2 className="h-3.5 w-3.5" aria-hidden="true" />Share</button><button type="button" onClick={() => handleCopy(certificate)} aria-label={`Copy verification code for ${certificate.course.title}`} className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"><Copy className="h-3.5 w-3.5" aria-hidden="true" />Copy</button></div></div></article>)}</div>}
            </section>

            <div className="mt-8 grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="completion-summary-heading"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Course milestone</p><h2 id="completion-summary-heading" className="mt-1 text-xl font-bold text-slate-900">Course Completion Summary</h2></div><GraduationCap className="h-5 w-5 text-slate-400" aria-hidden="true" /></div>{latestCertificate ? <><div className="mt-4 flex items-start justify-between gap-3"><div><p className="text-lg font-bold text-slate-900">{latestCertificate.course.title}</p><p className="mt-1 text-sm text-slate-500">Course completed {formatDate(latestCertificate.completionDate, { month: "long" })}</p></div><Badge variant="success">100% Complete</Badge></div><div className="mt-4" role="progressbar" aria-label={`${latestCertificate.course.title} completion`} aria-valuenow={latestCertificate.course.lessonsCompleted / latestCertificate.course.totalLessons * 100} aria-valuemin={0} aria-valuemax={100}><div className="h-2.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${latestCertificate.course.lessonsCompleted / latestCertificate.course.totalLessons * 100}%` }} /></div></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"><CompletionMetric label="Lessons" value={`${latestCertificate.course.lessonsCompleted}/${latestCertificate.course.totalLessons}`} /><CompletionMetric label="Quizzes" value={`${latestCertificate.course.quizzesCompleted}/${latestCertificate.course.totalQuizzes}`} /><CompletionMetric label="Assignments" value={`${latestCertificate.course.assignmentsCompleted}/${latestCertificate.course.totalAssignments}`} /><CompletionMetric label="Final Score" value={`${latestCertificate.score}%`} /><CompletionMetric label="Learning Hours" value={latestCertificate.course.duration} /><CompletionMetric label="Completion" value="100%" /></div><Link href="/dashboard/courses/javascript-masterclass" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500">View Course<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></> : <EmptyState icon="empty" title="No course completions yet" description="Complete a course to see your progress summary." compact />}</section>

              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="certificate-activity-heading"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Milestones</p><h2 id="certificate-activity-heading" className="mt-1 text-xl font-bold text-slate-900">Recent Certificate Activity</h2></div><ClipboardCheck className="h-5 w-5 text-slate-400" aria-hidden="true" /></div>{recentActivity.length ? <ol className="mt-4 space-y-3">{recentActivity.map((certificate) => <li key={certificate.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Check className="h-4 w-4" aria-hidden="true" /></span><div className="min-w-0"><p className="text-sm font-semibold text-slate-900">Certificate earned</p><p className="mt-1 truncate text-sm text-slate-700">{certificate.course.title}</p><time className="mt-1 block text-xs text-slate-500">{formatDate(certificate.issueDate, { month: "long" })}</time></div></li>)}</ol> : <EmptyState icon="empty" title="No certificate activity yet" description="Certificate milestones will appear here." compact />}</section>
            </div>
          </main>
        </div>
      </div>
      {selectedCertificate ? <CertificatePreviewDialog certificate={selectedCertificate} onClose={() => setSelectedCertificate(null)} onCopy={handleCopy} /> : null}
      <style jsx global>{`@media print { @page { size: landscape; margin: 12mm; } body * { visibility: hidden !important; } .certificate-print-preview, .certificate-print-preview * { visibility: visible !important; } .certificate-print-preview { position: fixed !important; inset: 0 !important; z-index: 99999 !important; display: flex !important; align-items: center !important; justify-content: center !important; overflow: visible !important; background: #fff !important; padding: 0 !important; } .certificate-print-preview > div { width: 100% !important; max-width: 1100px !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; padding: 0 !important; } }`}</style>
    </div>
  );
}

function CompletionMetric({ label, value }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-sm font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>;
}