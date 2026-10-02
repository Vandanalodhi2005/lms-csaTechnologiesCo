"use client";

import * as React from "react";
import { cn } from "@/utils";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import { adminStudents, adminStudentsSummary } from "@/constants/adminStudents.js";
import {
  ArrowUpDown,
  Ban,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  GraduationCap,
  Layers3,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

const STUDENTS_PER_PAGE = 10;
const tabs = [
  { key: "all", label: "All Students" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "suspended", label: "Suspended" },
  { key: "new", label: "New Students" },
  { key: "completed", label: "Completed Learners" },
];

const courseOptions = [
  "All Courses",
  "React Fundamentals",
  "JavaScript Mastery",
  "Next.js Complete Guide",
  "MERN Stack Development",
  "UI/UX Design",
];

const enrollmentStatusOptions = [
  { value: "all", label: "All" },
  { value: "enrolled", label: "Enrolled" },
  { value: "not-enrolled", label: "Not Enrolled" },
];

const accountStatusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

const learningStatusOptions = [
  { value: "all", label: "All" },
  { value: "not-started", label: "Not Started" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "progress-desc", label: "Highest Progress" },
  { value: "progress-asc", label: "Lowest Progress" },
];

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatJoinedDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function toSentenceCase(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

function getStatusVariant(status) {
  const normalized = status?.toLowerCase();
  if (normalized === "active") return "success";
  if (normalized === "inactive") return "secondary";
  if (normalized === "suspended") return "danger";
  return "default";
}

function getLearningStatus(student) {
  if (student.overallProgress >= 100) return "completed";
  if (student.overallProgress > 0) return "in-progress";
  return "not-started";
}

function getDateValue(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function ModalShell({ open, title, onClose, children, width = "max-w-2xl" }) {
  React.useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <div className={cn("w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6", width)} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 id="modal-title" className="text-xl font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StudentStats() {
  const summaryItems = [
    { label: "Total Students", value: formatNumber(adminStudentsSummary.totalStudents), detail: "Registered students", icon: Users },
    { label: "Active Students", value: formatNumber(adminStudentsSummary.activeStudents), detail: "Currently active", icon: CheckCircle2 },
    { label: "New Students", value: formatNumber(adminStudentsSummary.newStudents), detail: "Joined this month", icon: Plus },
    { label: "Completed Learners", value: formatNumber(adminStudentsSummary.completedLearners), detail: "Completed at least one course", icon: GraduationCap },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map(({ label, value, detail, icon: Icon }) => (
        <article key={label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">{label}</p>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
            </div>
            <div className="rounded-xl bg-primary-50 p-2.5 text-primary-600">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">{detail}</p>
        </article>
      ))}
    </section>
  );
}

function StudentFilters({
  search,
  enrollmentStatus,
  accountStatus,
  learningStatus,
  selectedCourse,
  sortBy,
  onSearchChange,
  onEnrollmentChange,
  onAccountStatusChange,
  onLearningStatusChange,
  onCourseChange,
  onSortChange,
  onReset,
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        <div className="flex-1">
          <label htmlFor="student-search" className="mb-2 block text-sm font-medium text-slate-700">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="student-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search students by name or email..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6 xl:flex-1">
          <div>
            <label htmlFor="enrollment-filter" className="mb-2 block text-sm font-medium text-slate-700">Enrollment Status</label>
            <div className="relative">
              <select
                id="enrollment-filter"
                value={enrollmentStatus}
                onChange={(event) => onEnrollmentChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {enrollmentStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="account-status-filter" className="mb-2 block text-sm font-medium text-slate-700">Account Status</label>
            <div className="relative">
              <select
                id="account-status-filter"
                value={accountStatus}
                onChange={(event) => onAccountStatusChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {accountStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="learning-status-filter" className="mb-2 block text-sm font-medium text-slate-700">Learning Status</label>
            <div className="relative">
              <select
                id="learning-status-filter"
                value={learningStatus}
                onChange={(event) => onLearningStatusChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {learningStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="course-filter" className="mb-2 block text-sm font-medium text-slate-700">Course</label>
            <div className="relative">
              <select
                id="course-filter"
                value={selectedCourse}
                onChange={(event) => onCourseChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {courseOptions.map((course) => (
                  <option key={course} value={course === "All Courses" ? "all" : course}>{course}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="sort-filter" className="mb-2 block text-sm font-medium text-slate-700">Sort</label>
            <div className="relative">
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div className="flex items-end">
            <Button type="button" variant="outline" className="w-full" onClick={onReset} leftIcon={<Filter className="h-4 w-4" aria-hidden="true" />}>
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StudentTabs({ activeTab, onChange }) {
  return (
    <div className="border-b border-slate-200">
      <nav aria-label="Student tabs" className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={cn(
              "rounded-full px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500/20",
              activeTab === tab.key ? "bg-primary-50 text-primary-700 ring-1 ring-primary-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            )}
            onClick={() => onChange(tab.key)}
            aria-pressed={activeTab === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function StudentTable({ students, onView, onEdit, onProgress, onToggleStatus, onDelete, openActionStudentId, onOpenActions }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Enrolled Courses</th>
            <th className="px-4 py-3">Progress</th>
            <th className="px-4 py-3">Completed</th>
            <th className="px-4 py-3">Certificates</th>
            <th className="px-4 py-3">Last Active</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-t border-slate-200 align-middle text-sm text-slate-700">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={student.name} size="md" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{student.name}</p>
                    <p className="truncate text-xs text-slate-500">{student.id}</p>
                  </div>
                </div>
              </td>
              <td className="max-w-[220px] px-4 py-4">
                <span className="block truncate">{student.email}</span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <span>{student.enrolledCourses} {student.enrolledCourses === 1 ? "course" : "courses"}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="min-w-[120px]">
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                    <span>{student.overallProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-primary-600" style={{ width: `${student.overallProgress}%` }} />
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">{student.completedCourses} {student.completedCourses === 1 ? "completed" : "completed"}</td>
              <td className="px-4 py-4">{student.certificates}</td>
              <td className="px-4 py-4">{student.lastActive}</td>
              <td className="px-4 py-4">
                <Badge variant={getStatusVariant(student.status)} size="sm" className="capitalize">{student.status}</Badge>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button type="button" onClick={() => onView(student)} aria-label={`View ${student.name}`} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => onEdit(student)} aria-label={`Edit ${student.name}`} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <div className="relative">
                    <button type="button" onClick={() => onOpenActions(student.id)} aria-label={`Open actions for ${student.name}`} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </button>
                    {student.id === openActionStudentId && (
                      <div role="menu" className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                        <button type="button" onClick={() => onView(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"><Eye className="h-4 w-4" aria-hidden="true" /> View Student</button>
                        <button type="button" onClick={() => onEdit(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"><Pencil className="h-4 w-4" aria-hidden="true" /> Edit Student</button>
                        <button type="button" onClick={() => onProgress(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"><Layers3 className="h-4 w-4" aria-hidden="true" /> View Progress</button>
                        <button type="button" onClick={() => onToggleStatus(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">{student.status === "active" ? <Ban className="h-4 w-4" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />} {student.status === "active" ? "Suspend Student" : "Activate Student"}</button>
                        <button type="button" onClick={() => onDelete(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" aria-hidden="true" /> Delete Student</button>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StudentMobileCard({ student, onView, onEdit, onProgress, onToggleStatus, onDelete, openActionStudentId, onOpenActions }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={student.name} size="md" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{student.name}</p>
            <p className="truncate text-xs text-slate-500">{student.id}</p>
          </div>
        </div>
        <div className="relative">
          <button type="button" aria-label={`Open actions for ${student.name}`} onClick={() => onOpenActions(student.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
          {student.id === openActionStudentId && (
            <div role="menu" className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              <button type="button" onClick={() => onView(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"><Eye className="h-4 w-4" aria-hidden="true" /> View Student</button>
              <button type="button" onClick={() => onEdit(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"><Pencil className="h-4 w-4" aria-hidden="true" /> Edit Student</button>
              <button type="button" onClick={() => onProgress(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"><Layers3 className="h-4 w-4" aria-hidden="true" /> View Progress</button>
              <button type="button" onClick={() => onToggleStatus(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">{student.status === "active" ? <Ban className="h-4 w-4" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />} {student.status === "active" ? "Suspend Student" : "Activate Student"}</button>
              <button type="button" onClick={() => onDelete(student)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" aria-hidden="true" /> Delete Student</button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Email</span><span className="truncate text-right">{student.email}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Progress</span><span>{student.overallProgress}%</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Courses</span><span>{student.enrolledCourses}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Certificates</span><span>{student.certificates}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Status</span><Badge variant={getStatusVariant(student.status)} size="sm" className="capitalize">{student.status}</Badge></div>
      </div>
    </div>
  );
}

function StudentPagination({ currentPage, totalPages, totalStudents, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * STUDENTS_PER_PAGE, totalStudents);

  return (
    <div className="flex flex-col gap-4 rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">Showing <span className="font-semibold text-slate-900">{startIndex}–{endIndex}</span> of <span className="font-semibold text-slate-900">{formatNumber(totalStudents)}</span> students</p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" aria-hidden="true" /></button>
        {pages.slice(0, 5).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500",
              currentPage === page ? "bg-primary-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
            )}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ))}
        <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
      </div>
    </div>
  );
}

export default function StudentManagementClient() {
  const [students, setStudents] = React.useState(adminStudents);
  const [search, setSearch] = React.useState("");
  const [enrollmentStatus, setEnrollmentStatus] = React.useState("all");
  const [accountStatus, setAccountStatus] = React.useState("all");
  const [learningStatus, setLearningStatus] = React.useState("all");
  const [selectedCourse, setSelectedCourse] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");
  const [activeTab, setActiveTab] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [openActionStudentId, setOpenActionStudentId] = React.useState(null);
  const [viewStudent, setViewStudent] = React.useState(null);
  const [progressStudent, setProgressStudent] = React.useState(null);
  const [editStudent, setEditStudent] = React.useState(null);
  const [deleteStudent, setDeleteStudent] = React.useState(null);
  const [toggleStudent, setToggleStudent] = React.useState(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState({ name: "", email: "", status: "active", phone: "", country: "" });
  const [formErrors, setFormErrors] = React.useState({});

  React.useEffect(() => {
    setOpenActionStudentId(null);
  }, [search, enrollmentStatus, accountStatus, learningStatus, selectedCourse, sortBy, activeTab, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, enrollmentStatus, accountStatus, learningStatus, selectedCourse, activeTab]);

  React.useEffect(() => {
    if (!statusMessage) return undefined;
    const timer = window.setTimeout(() => setStatusMessage(""), 2500);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  const filteredStudents = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    let nextStudents = [...students];

    if (term) {
      nextStudents = nextStudents.filter((student) => student.name.toLowerCase().includes(term) || student.email.toLowerCase().includes(term));
    }

    if (enrollmentStatus !== "all") {
      nextStudents = nextStudents.filter((student) => (enrollmentStatus === "enrolled" ? student.enrolledCourses > 0 : student.enrolledCourses === 0));
    }

    if (accountStatus !== "all") {
      nextStudents = nextStudents.filter((student) => student.status === accountStatus);
    }

    if (learningStatus !== "all") {
      nextStudents = nextStudents.filter((student) => getLearningStatus(student) === learningStatus);
    }

    if (selectedCourse !== "all") {
      nextStudents = nextStudents.filter((student) => student.currentCourse === selectedCourse || student.courses.some((course) => course.title === selectedCourse));
    }

    if (activeTab !== "all") {
      if (activeTab === "active") {
        nextStudents = nextStudents.filter((student) => student.status === "active");
      } else if (activeTab === "inactive") {
        nextStudents = nextStudents.filter((student) => student.status === "inactive");
      } else if (activeTab === "suspended") {
        nextStudents = nextStudents.filter((student) => student.status === "suspended");
      } else if (activeTab === "new") {
        const now = new Date();
        nextStudents = nextStudents.filter((student) => {
          const joined = new Date(`${student.joinedAt}T00:00:00`);
          const diffDays = Math.floor((now.getTime() - joined.getTime()) / 86400000);
          return diffDays <= 30;
        });
      } else if (activeTab === "completed") {
        nextStudents = nextStudents.filter((student) => student.completedCourses > 0);
      }
    }

    if (sortBy === "newest") {
      nextStudents.sort((a, b) => getDateValue(b.joinedAt) - getDateValue(a.joinedAt));
    } else if (sortBy === "oldest") {
      nextStudents.sort((a, b) => getDateValue(a.joinedAt) - getDateValue(b.joinedAt));
    } else if (sortBy === "name-asc") {
      nextStudents.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      nextStudents.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "progress-desc") {
      nextStudents.sort((a, b) => b.overallProgress - a.overallProgress);
    } else if (sortBy === "progress-asc") {
      nextStudents.sort((a, b) => a.overallProgress - b.overallProgress);
    }

    return nextStudents;
  }, [students, search, enrollmentStatus, accountStatus, learningStatus, selectedCourse, activeTab, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedStudents = filteredStudents.slice((safeCurrentPage - 1) * STUDENTS_PER_PAGE, safeCurrentPage * STUDENTS_PER_PAGE);

  React.useEffect(() => {
    if (safeCurrentPage !== currentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [safeCurrentPage, currentPage]);

  const handleResetFilters = () => {
    setSearch("");
    setEnrollmentStatus("all");
    setAccountStatus("all");
    setLearningStatus("all");
    setSelectedCourse("all");
    setSortBy("newest");
    setActiveTab("all");
  };

  const handleAddStudent = () => {
    const errors = {};
    if (!formValues.name.trim()) errors.name = "Name is required.";
    if (!formValues.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) errors.email = "Valid email is required.";
    if (!formValues.status) errors.status = "Status is required.";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newId = `STU-${1000 + students.length + 1}`;
    const newStudent = {
      id: newId,
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim() || "Not provided",
      country: formValues.country.trim() || "Unknown",
      status: formValues.status,
      joinedAt: new Date().toISOString().slice(0, 10),
      lastActive: "Just now",
      enrolledCourses: 0,
      completedCourses: 0,
      certificates: 0,
      overallProgress: 0,
      learningHours: 0,
      weeklyGoal: { current: 0, target: 6 },
      currentCourse: "Not enrolled",
      courses: [],
      activities: [{ type: "Enrolled", detail: "New student account created", time: "Just now" }],
      progressBreakdown: [],
    };

    setStudents((current) => [newStudent, ...current]);
    setIsAddStudentOpen(false);
    setFormValues({ name: "", email: "", status: "active", phone: "", country: "" });
    setFormErrors({});
    setStatusMessage("Student created successfully.");
  };

  const handleSaveStudent = () => {
    if (!editStudent) return;
    setStudents((current) => current.map((student) => student.id === editStudent.id ? { ...student, name: editStudent.name, email: editStudent.email, status: editStudent.status, phone: editStudent.phone || "Not provided", country: editStudent.country || "Unknown" } : student));
    setEditStudent(null);
    setStatusMessage("Student updated successfully.");
  };

  const handleToggleStatus = (student) => {
    const nextStatus = student.status === "active" ? "suspended" : "active";
    setToggleStudent({ ...student, nextStatus });
  };

  const confirmToggleStatus = () => {
    if (!toggleStudent) return;
    setStudents((current) => current.map((student) => student.id === toggleStudent.id ? { ...student, status: toggleStudent.nextStatus, lastActive: "Just now" } : student));
    setToggleStudent(null);
    setStatusMessage(toggleStudent.nextStatus === "suspended" ? "Student suspended successfully." : "Student activated successfully.");
  };

  const handleDeleteStudent = () => {
    if (!deleteStudent) return;
    setStudents((current) => current.filter((student) => student.id !== deleteStudent.id));
    setDeleteStudent(null);
    setStatusMessage("Student deleted from the demo dataset.");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[role='menu']") && !event.target.closest('[aria-label*="Open actions"]')) {
        setOpenActionStudentId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <span>Admin</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-slate-900">Students</span>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Learner oversight</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Student Management</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">Monitor student activity, enrollment progress, course completion, and account status across EduLearn.</p>
          </div>

          <Button type="button" variant="default" size="default" leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />} onClick={() => setIsAddStudentOpen(true)}>Add Student</Button>
        </div>
      </div>

      {statusMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">{statusMessage}</div> : null}

      <StudentStats />

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600"><Users className="h-4 w-4" aria-hidden="true" /><span className="text-sm font-medium">Student Directory</span></div>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 sm:flex"><ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />Live demo data</div>
        </div>

        <StudentFilters
          search={search}
          enrollmentStatus={enrollmentStatus}
          accountStatus={accountStatus}
          learningStatus={learningStatus}
          selectedCourse={selectedCourse}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onEnrollmentChange={setEnrollmentStatus}
          onAccountStatusChange={setAccountStatus}
          onLearningStatusChange={setLearningStatus}
          onCourseChange={setSelectedCourse}
          onSortChange={setSortBy}
          onReset={handleResetFilters}
        />

        <div className="mt-5"><StudentTabs activeTab={activeTab} onChange={setActiveTab} /></div>
      </div>

      <section className="space-y-4">
        {filteredStudents.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Search className="h-6 w-6" aria-hidden="true" /></div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">No students found</h3>
            <p className="mt-2 text-sm text-slate-600">Try adjusting your search or filter criteria.</p>
            <div className="mt-5 flex justify-center"><Button type="button" variant="outline" onClick={handleResetFilters}>Reset Filters</Button></div>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <StudentTable
                students={paginatedStudents}
                onView={setViewStudent}
                onEdit={setEditStudent}
                onProgress={setProgressStudent}
                onToggleStatus={handleToggleStatus}
                onDelete={setDeleteStudent}
                openActionStudentId={openActionStudentId}
                onOpenActions={setOpenActionStudentId}
              />

              {paginatedStudents.map((student) => (
                <div key={student.id} className="md:hidden">
                  <StudentMobileCard
                    student={student}
                    onView={setViewStudent}
                    onEdit={setEditStudent}
                    onProgress={setProgressStudent}
                    onToggleStatus={handleToggleStatus}
                    onDelete={setDeleteStudent}
                    openActionStudentId={openActionStudentId}
                    onOpenActions={setOpenActionStudentId}
                  />
                </div>
              ))}
            </div>

            <StudentPagination currentPage={safeCurrentPage} totalPages={totalPages} totalStudents={filteredStudents.length} onPageChange={handlePageChange} />
          </>
        )}
      </section>

      <ModalShell open={Boolean(isAddStudentOpen)} title="Add Student" onClose={() => setIsAddStudentOpen(false)} width="max-w-xl">
        <div className="space-y-4">
          <div>
            <label htmlFor="add-student-name" className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
            <input id="add-student-name" value={formValues.name} onChange={(event) => setFormValues((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            {formErrors.name ? <p className="mt-1 text-xs text-red-600">{formErrors.name}</p> : null}
          </div>

          <div>
            <label htmlFor="add-student-email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input id="add-student-email" type="email" value={formValues.email} onChange={(event) => setFormValues((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            {formErrors.email ? <p className="mt-1 text-xs text-red-600">{formErrors.email}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="add-student-phone" className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
              <input id="add-student-phone" value={formValues.phone} onChange={(event) => setFormValues((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>
            <div>
              <label htmlFor="add-student-country" className="mb-2 block text-sm font-medium text-slate-700">Country</label>
              <input id="add-student-country" value={formValues.country} onChange={(event) => setFormValues((current) => ({ ...current, country: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>
          </div>

          <div>
            <label htmlFor="add-student-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <select id="add-student-status" value={formValues.status} onChange={(event) => setFormValues((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            {formErrors.status ? <p className="mt-1 text-xs text-red-600">{formErrors.status}</p> : null}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleAddStudent}>Create Student</Button>
          </div>
        </div>
      </ModalShell>

      <ModalShell open={Boolean(editStudent)} title="Edit Student" onClose={() => setEditStudent(null)} width="max-w-xl">
        {editStudent ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-student-name" className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input id="edit-student-name" value={editStudent.name} onChange={(event) => setEditStudent((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>
            <div>
              <label htmlFor="edit-student-email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input id="edit-student-email" type="email" value={editStudent.email} onChange={(event) => setEditStudent((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-student-phone" className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
                <input id="edit-student-phone" value={editStudent.phone || ""} onChange={(event) => setEditStudent((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
              </div>
              <div>
                <label htmlFor="edit-student-country" className="mb-2 block text-sm font-medium text-slate-700">Country</label>
                <input id="edit-student-country" value={editStudent.country || ""} onChange={(event) => setEditStudent((current) => ({ ...current, country: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
              </div>
            </div>
            <div>
              <label htmlFor="edit-student-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select id="edit-student-status" value={editStudent.status} onChange={(event) => setEditStudent((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditStudent(null)}>Cancel</Button>
              <Button type="button" onClick={handleSaveStudent}>Save Changes</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(viewStudent)} title="Student Details" onClose={() => setViewStudent(null)} width="max-w-3xl">
        {viewStudent ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
              <Avatar name={viewStudent.name} size="xl" />
              <div>
                <h4 className="text-2xl font-bold text-slate-900">{viewStudent.name}</h4>
                <p className="text-sm text-slate-500">Student ID: {viewStudent.id}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Email</p><p className="mt-2 break-all text-sm font-medium text-slate-900">{viewStudent.email}</p></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Registration Date</p><p className="mt-2 text-sm font-medium text-slate-900">{formatJoinedDate(viewStudent.joinedAt)}</p></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Account Status</p><div className="mt-2"><Badge variant={getStatusVariant(viewStudent.status)} size="sm" className="capitalize">{viewStudent.status}</Badge></div></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Last Active</p><p className="mt-2 text-sm font-medium text-slate-900">{viewStudent.lastActive}</p></div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-700"><ShieldCheck className="h-4 w-4" aria-hidden="true" /><span className="font-semibold">Student Profile Summary</span></div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Courses</p><p className="mt-2 text-2xl font-bold text-slate-900">{viewStudent.enrolledCourses}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Completed</p><p className="mt-2 text-2xl font-bold text-slate-900">{viewStudent.completedCourses}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Certificates</p><p className="mt-2 text-2xl font-bold text-slate-900">{viewStudent.certificates}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Overall Progress</p><p className="mt-2 text-2xl font-bold text-slate-900">{viewStudent.overallProgress}%</p></div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-700"><BookOpen className="h-4 w-4" aria-hidden="true" /><span className="font-semibold">Current Learning</span></div>
              <div className="space-y-3">
                {viewStudent.courses?.length ? viewStudent.courses.map((course) => (
                  <div key={course.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{course.title}</p>
                        <p className="text-xs text-slate-500">Instructor: {course.instructor}</p>
                      </div>
                      <button type="button" className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white">Continue</button>
                    </div>
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-500"><span>Progress</span><span>{course.progress}%</span></div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-primary-600" style={{ width: `${course.progress}%` }} /></div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Last lesson: {course.lastActivity}</p>
                  </div>
                )) : <p className="text-sm text-slate-600">No active learning courses yet.</p>}
              </div>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(progressStudent)} title="Student Progress" onClose={() => setProgressStudent(null)} width="max-w-2xl">
        {progressStudent ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Overall Progress</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{progressStudent.overallProgress}%</p>
                </div>
                <Badge variant="default" size="sm">{progressStudent.completedCourses} completed</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="mb-3 text-base font-semibold text-slate-900">Course Progress</h4>
                {progressStudent.progressBreakdown.length ? progressStudent.progressBreakdown.map((item) => (
                  <div key={item.course} className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-2 flex items-center justify-between text-sm"><span className="font-medium text-slate-800">{item.course}</span><span className="text-slate-600">{item.progress}%</span></div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-primary-600" style={{ width: `${item.progress}%` }} /></div>
                  </div>
                )) : <p>No course progress recorded.</p>}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Completed Courses</p><p className="mt-2 text-xl font-bold text-slate-900">{progressStudent.completedCourses}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Remaining Courses</p><p className="mt-2 text-xl font-bold text-slate-900">{Math.max(progressStudent.enrolledCourses - progressStudent.completedCourses, 0)}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Learning Hours</p><p className="mt-2 text-xl font-bold text-slate-900">{progressStudent.learningHours}h</p></div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">Weekly Learning Goal</span>
                  <span className="text-slate-600">{progressStudent.weeklyGoal.current}h / {progressStudent.weeklyGoal.target}h</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min((progressStudent.weeklyGoal.current / progressStudent.weeklyGoal.target) * 100, 100)}%` }} />
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-base font-semibold text-slate-900">Recent Activity</h4>
                <div className="space-y-2">
                  {progressStudent.activities?.map((activity, index) => (
                    <div key={`${activity.detail}-${index}`} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="mt-0.5 rounded-full bg-primary-50 p-2 text-primary-600"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-800"><span className="font-medium">{activity.type}:</span> {activity.detail}</p>
                        <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(toggleStudent)} title={toggleStudent?.status === "active" ? "Suspend Student?" : "Activate Student?"} onClose={() => setToggleStudent(null)} width="max-w-md">
        {toggleStudent ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Are you sure you want to {toggleStudent.nextStatus === "suspended" ? "suspend" : "activate"} {toggleStudent.name}?</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setToggleStudent(null)}>Cancel</Button>
              <Button type="button" variant={toggleStudent.nextStatus === "suspended" ? "destructive" : "success"} onClick={confirmToggleStatus}>{toggleStudent.nextStatus === "suspended" ? "Confirm Suspension" : "Confirm"}</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(deleteStudent)} title="Delete Student?" onClose={() => setDeleteStudent(null)} width="max-w-md">
        {deleteStudent ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">This will remove the student from the current demo dataset.</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDeleteStudent(null)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDeleteStudent}>Delete Student</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      {/* TODO: enforce server-side admin authorization before exposing this page in production. */}
    </div>
  );
}
