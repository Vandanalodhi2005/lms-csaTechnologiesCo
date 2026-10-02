"use client";

import * as React from "react";
import { cn } from "@/utils";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import { adminInstructors, adminInstructorsSummary } from "@/constants/adminInstructors.js";
import {
  AlertTriangle,
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
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";

const INSTRUCTORS_PER_PAGE = 8;

const tabs = [
  { key: "all", label: "All Instructors" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending Approval" },
  { key: "suspended", label: "Suspended" },
  { key: "top-rated", label: "Top Rated" },
  { key: "new", label: "New Instructors" },
];

const ratingOptions = [
  { value: "all", label: "All Ratings" },
  { value: "4.5", label: "4.5+" },
  { value: "4.0", label: "4.0+" },
  { value: "3.0", label: "3.0+" },
  { value: "below-3.0", label: "Below 3.0" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

const verificationOptions = [
  { value: "all", label: "All" },
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Unverified" },
  { value: "pending", label: "Pending" },
  { value: "verification pending", label: "Verification Pending" },
];

const courseFilterOptions = [
  { value: "all", label: "All" },
  { value: "1+", label: "1+" },
  { value: "5+", label: "5+" },
  { value: "10+", label: "10+" },
  { value: "20+", label: "20+" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "rating-desc", label: "Highest Rating" },
  { value: "courses-desc", label: "Most Courses" },
  { value: "students-desc", label: "Most Students" },
];

const statusVariantMap = {
  active: "success",
  inactive: "secondary",
  pending: "warning",
  suspended: "danger",
};

const verificationVariantMap = {
  verified: "success",
  unverified: "secondary",
  pending: "warning",
  "verification pending": "warning",
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatJoinedDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function getStatusLabel(status) {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
}

function getVerificationLabel(verification) {
  if (!verification) return "Unverified";
  return verification.charAt(0).toUpperCase() + verification.slice(1);
}

function getDateValue(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function renderStars(rating) {
  const filled = Math.round(rating);
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={cn("h-3.5 w-3.5", index < filled ? "fill-amber-400 text-amber-400" : "text-slate-300")}
      aria-hidden="true"
    />
  ));
}

function expertisePreview(expertise = []) {
  if (!expertise.length) return "General";
  const visible = expertise.slice(0, 2);
  const extra = expertise.length - visible.length;
  return extra > 0 ? `${visible.join(", ")} +${extra} more` : visible.join(", ");
}

function getInstructorActions(instructor) {
  const actions = [
    { label: "View Instructor", type: "view" },
    { label: "Edit Instructor", type: "edit" },
    { label: "View Courses", type: "courses" },
    { label: "Review Profile", type: "review" },
  ];

  if (instructor.status === "pending") {
    actions.push({ label: "Approve Instructor", type: "approve" });
  }

  if (instructor.status === "active") {
    actions.push({ label: "Suspend Instructor", type: "suspend" });
  }

  if (instructor.status === "inactive" || instructor.status === "suspended") {
    actions.push({ label: "Activate Instructor", type: "activate" });
  }

  actions.push({ label: "Delete Instructor", type: "delete" });
  return actions;
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
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
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

function InstructorStats() {
  const summaryItems = [
    { label: "Total Instructors", value: formatNumber(adminInstructorsSummary.totalInstructors), detail: "Registered instructors", icon: Users },
    { label: "Active Instructors", value: formatNumber(adminInstructorsSummary.activeInstructors), detail: "Currently active", icon: CheckCircle2 },
    { label: "Pending Approval", value: formatNumber(adminInstructorsSummary.pendingApproval), detail: "Awaiting review", icon: Clock3 },
    { label: "Average Rating", value: `${adminInstructorsSummary.averageRating} / 5`, detail: "Platform instructor rating", icon: Star },
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

function InstructorFilters({
  search,
  status,
  verification,
  rating,
  courses,
  sortBy,
  onSearchChange,
  onStatusChange,
  onVerificationChange,
  onRatingChange,
  onCourseChange,
  onSortChange,
  onReset,
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        <div className="flex-1">
          <label htmlFor="instructor-search" className="mb-2 block text-sm font-medium text-slate-700">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="instructor-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search instructors by name or email..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6 xl:flex-1">
          <div>
            <label htmlFor="status-filter" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <div className="relative">
              <select
                id="status-filter"
                value={status}
                onChange={(event) => onStatusChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="verification-filter" className="mb-2 block text-sm font-medium text-slate-700">Verification</label>
            <div className="relative">
              <select
                id="verification-filter"
                value={verification}
                onChange={(event) => onVerificationChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {verificationOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="rating-filter" className="mb-2 block text-sm font-medium text-slate-700">Rating</label>
            <div className="relative">
              <select
                id="rating-filter"
                value={rating}
                onChange={(event) => onRatingChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {ratingOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="courses-filter" className="mb-2 block text-sm font-medium text-slate-700">Courses</label>
            <div className="relative">
              <select
                id="courses-filter"
                value={courses}
                onChange={(event) => onCourseChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {courseFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
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

function InstructorTabs({ activeTab, onChange }) {
  return (
    <div className="border-b border-slate-200">
      <nav aria-label="Instructor tabs" className="flex flex-wrap gap-2">
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

function InstructorTable({ instructors, onView, onEdit, onCourses, onReview, onToggleStatus, onApprove, onDelete, openActionInstructorId, onOpenActions }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            <th className="px-4 py-3">Instructor</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Expertise</th>
            <th className="px-4 py-3">Courses</th>
            <th className="px-4 py-3">Students</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Verification</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor) => (
            <tr key={instructor.id} className="border-t border-slate-200 align-middle text-sm text-slate-700">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={instructor.name} size="md" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{instructor.name}</p>
                    <p className="truncate text-xs text-slate-500">{instructor.id}</p>
                  </div>
                </div>
              </td>
              <td className="max-w-[220px] px-4 py-4">
                <span className="block truncate">{instructor.email}</span>
              </td>
              <td className="px-4 py-4">
                <div className="max-w-[185px] text-sm text-slate-600">{expertisePreview(instructor.expertise)}</div>
              </td>
              <td className="px-4 py-4 text-center">{instructor.courses}</td>
              <td className="px-4 py-4 text-center">{formatNumber(instructor.students)}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1" aria-label={`${instructor.rating} out of 5 stars`}>{renderStars(instructor.rating)}</div>
                  <span className="font-medium text-slate-900">{instructor.rating.toFixed(1)}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{formatNumber(instructor.reviews)} reviews</p>
              </td>
              <td className="px-4 py-4">
                <Badge variant={verificationVariantMap[instructor.verification] || "secondary"} size="sm" className="capitalize">{getVerificationLabel(instructor.verification)}</Badge>
              </td>
              <td className="px-4 py-4">
                <Badge variant={statusVariantMap[instructor.status] || "secondary"} size="sm" className="capitalize">{getStatusLabel(instructor.status)}</Badge>
              </td>
              <td className="px-4 py-4">{formatJoinedDate(instructor.joinedAt)}</td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button type="button" aria-label={`View ${instructor.name}`} onClick={() => onView(instructor)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><Eye className="h-4 w-4" aria-hidden="true" /></button>
                  <button type="button" aria-label={`Edit ${instructor.name}`} onClick={() => onEdit(instructor)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><Pencil className="h-4 w-4" aria-hidden="true" /></button>
                  <div className="relative">
                    <button type="button" aria-label={`Open actions for ${instructor.name}`} onClick={() => onOpenActions(instructor.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></button>
                    {instructor.id === openActionInstructorId && (
                      <div role="menu" className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                        {getInstructorActions(instructor).map((action) => (
                          <button
                            key={action.type}
                            type="button"
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                            onClick={() => {
                              if (action.type === "view") onView(instructor);
                              if (action.type === "edit") onEdit(instructor);
                              if (action.type === "courses") onCourses(instructor);
                              if (action.type === "review") onReview(instructor);
                              if (action.type === "approve") onApprove(instructor);
                              if (action.type === "suspend" || action.type === "activate") onToggleStatus(instructor);
                              if (action.type === "delete") onDelete(instructor);
                                onOpenActions(null);
                            }}
                          >
                            {action.type === "view" && <Eye className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "edit" && <Pencil className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "courses" && <BookOpen className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "review" && <ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "approve" && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "suspend" && <Ban className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "activate" && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "delete" && <Trash2 className="h-4 w-4" aria-hidden="true" />}
                            {action.label}
                          </button>
                        ))}
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

function InstructorMobileCard({ instructor, onView, onEdit, onCourses, onReview, onToggleStatus, onApprove, onDelete, openActionInstructorId, onOpenActions }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={instructor.name} size="md" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{instructor.name}</p>
            <p className="truncate text-xs text-slate-500">{instructor.id}</p>
          </div>
        </div>
        <div className="relative">
          <button type="button" aria-label={`Open actions for ${instructor.name}`} onClick={() => onOpenActions(instructor.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></button>
          {instructor.id === openActionInstructorId && (
            <div role="menu" className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              {getInstructorActions(instructor).map((action) => (
                <button
                  key={action.type}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    if (action.type === "view") onView(instructor);
                    if (action.type === "edit") onEdit(instructor);
                    if (action.type === "courses") onCourses(instructor);
                    if (action.type === "review") onReview(instructor);
                    if (action.type === "approve") onApprove(instructor);
                    if (action.type === "suspend" || action.type === "activate") onToggleStatus(instructor);
                    if (action.type === "delete") onDelete(instructor);
                    onOpenActions(null);
                  }}
                >
                  {action.type === "view" && <Eye className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "edit" && <Pencil className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "courses" && <BookOpen className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "review" && <ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "approve" && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "suspend" && <Ban className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "activate" && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "delete" && <Trash2 className="h-4 w-4" aria-hidden="true" />}
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Email</span><span className="truncate text-right">{instructor.email}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Expertise</span><span className="text-right">{expertisePreview(instructor.expertise)}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Courses</span><span>{instructor.courses}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Students</span><span>{formatNumber(instructor.students)}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Rating</span><span>{instructor.rating.toFixed(1)} / 5</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Verification</span><Badge variant={verificationVariantMap[instructor.verification] || "secondary"} size="sm" className="capitalize">{getVerificationLabel(instructor.verification)}</Badge></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Status</span><Badge variant={statusVariantMap[instructor.status] || "secondary"} size="sm" className="capitalize">{getStatusLabel(instructor.status)}</Badge></div>
      </div>
    </div>
  );
}

function InstructorPagination({ currentPage, totalPages, totalInstructors, onPageChange }) {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * INSTRUCTORS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * INSTRUCTORS_PER_PAGE, totalInstructors);
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-4 rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">Showing <span className="font-semibold text-slate-900">{startIndex}–{endIndex}</span> of <span className="font-semibold text-slate-900">{formatNumber(totalInstructors)}</span> instructors</p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" aria-hidden="true" /></button>
        {pages.map((page) => (
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

export default function InstructorManagementClient() {
  const [instructors, setInstructors] = React.useState(adminInstructors);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [verification, setVerification] = React.useState("all");
  const [rating, setRating] = React.useState("all");
  const [courses, setCourses] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");
  const [activeTab, setActiveTab] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [openActionInstructorId, setOpenActionInstructorId] = React.useState(null);
  const [viewInstructor, setViewInstructor] = React.useState(null);
  const [editInstructor, setEditInstructor] = React.useState(null);
  const [reviewInstructor, setReviewInstructor] = React.useState(null);
  const [coursesInstructor, setCoursesInstructor] = React.useState(null);
  const [approveInstructor, setApproveInstructor] = React.useState(null);
  const [deleteInstructor, setDeleteInstructor] = React.useState(null);
  const [toggleInstructor, setToggleInstructor] = React.useState(null);
  const [isAddInstructorOpen, setIsAddInstructorOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    name: "",
    email: "",
    expertise: "",
    bio: "",
    status: "active",
    verification: "verified",
    phone: "",
    country: "",
    experience: "",
  });
  const [formErrors, setFormErrors] = React.useState({});

  React.useEffect(() => {
    setOpenActionInstructorId(null);
  }, [search, status, verification, rating, courses, sortBy, activeTab, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, status, verification, rating, courses, activeTab]);

  React.useEffect(() => {
    if (!statusMessage) return undefined;
    const timer = window.setTimeout(() => setStatusMessage(""), 2400);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  const filteredInstructors = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    let nextInstructors = [...instructors];

    if (term) {
      nextInstructors = nextInstructors.filter((instructor) => {
        const haystack = `${instructor.name} ${instructor.email} ${instructor.id}`.toLowerCase();
        return haystack.includes(term);
      });
    }

    if (status !== "all") {
      nextInstructors = nextInstructors.filter((instructor) => instructor.status === status);
    }

    if (verification !== "all") {
      nextInstructors = nextInstructors.filter((instructor) => instructor.verification === verification);
    }

    if (rating !== "all") {
      if (rating === "4.5") nextInstructors = nextInstructors.filter((instructor) => instructor.rating >= 4.5);
      if (rating === "4.0") nextInstructors = nextInstructors.filter((instructor) => instructor.rating >= 4.0);
      if (rating === "3.0") nextInstructors = nextInstructors.filter((instructor) => instructor.rating >= 3.0);
      if (rating === "below-3.0") nextInstructors = nextInstructors.filter((instructor) => instructor.rating < 3.0);
    }

    if (courses !== "all") {
      const minCourses = Number.parseInt(courses, 10);
      nextInstructors = nextInstructors.filter((instructor) => instructor.courses >= minCourses);
    }

    if (activeTab !== "all") {
      if (activeTab === "active") nextInstructors = nextInstructors.filter((instructor) => instructor.status === "active");
      if (activeTab === "pending") nextInstructors = nextInstructors.filter((instructor) => instructor.status === "pending");
      if (activeTab === "suspended") nextInstructors = nextInstructors.filter((instructor) => instructor.status === "suspended");
      if (activeTab === "top-rated") nextInstructors = nextInstructors.filter((instructor) => instructor.rating >= 4.8);
      if (activeTab === "new") {
        const today = new Date();
        nextInstructors = nextInstructors.filter((instructor) => {
          const joinDate = new Date(`${instructor.joinedAt}T00:00:00`);
          const diffDays = Math.floor((today.getTime() - joinDate.getTime()) / 86400000);
          return diffDays <= 30;
        });
      }
    }

    switch (sortBy) {
      case "newest":
        nextInstructors.sort((a, b) => getDateValue(b.joinedAt) - getDateValue(a.joinedAt));
        break;
      case "oldest":
        nextInstructors.sort((a, b) => getDateValue(a.joinedAt) - getDateValue(b.joinedAt));
        break;
      case "name-asc":
        nextInstructors.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        nextInstructors.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating-desc":
        nextInstructors.sort((a, b) => b.rating - a.rating);
        break;
      case "courses-desc":
        nextInstructors.sort((a, b) => b.courses - a.courses);
        break;
      case "students-desc":
        nextInstructors.sort((a, b) => b.students - a.students);
        break;
      default:
        break;
    }

    return nextInstructors;
  }, [instructors, search, status, verification, rating, courses, activeTab, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredInstructors.length / INSTRUCTORS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedInstructors = filteredInstructors.slice((safeCurrentPage - 1) * INSTRUCTORS_PER_PAGE, safeCurrentPage * INSTRUCTORS_PER_PAGE);

  React.useEffect(() => {
    if (safeCurrentPage !== currentPage) setCurrentPage(safeCurrentPage);
  }, [safeCurrentPage, currentPage]);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setVerification("all");
    setRating("all");
    setCourses("all");
    setSortBy("newest");
    setActiveTab("all");
  };

  const handleAddInstructor = () => {
    const errors = {};
    if (!formValues.name.trim()) errors.name = "Name is required.";
    if (!formValues.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) errors.email = "Valid email is required.";
    if (!formValues.expertise.trim()) errors.expertise = "Expertise is required.";
    if (!formValues.bio.trim()) errors.bio = "Bio is required.";
    if (!formValues.status) errors.status = "Status is required.";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newInstructor = {
      id: `INS-${1000 + instructors.length + 1}`,
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      expertise: formValues.expertise.split(",").map((value) => value.trim()).filter(Boolean),
      status: formValues.status,
      verification: formValues.verification,
      joinedAt: new Date().toISOString().slice(0, 10),
      courses: 0,
      students: 0,
      rating: 0,
      reviews: 0,
      completionRate: 0,
      teachingHours: 0,
      bio: formValues.bio.trim(),
      profileComplete: 70,
      phone: formValues.phone.trim() || "Not provided",
      country: formValues.country.trim() || "Unknown",
      experience: formValues.experience.trim() || "New instructor",
      coursesList: [],
    };

    setInstructors((current) => [newInstructor, ...current]);
    setFormValues({ name: "", email: "", expertise: "", bio: "", status: "active", verification: "verified", phone: "", country: "", experience: "" });
    setFormErrors({});
    setIsAddInstructorOpen(false);
    setStatusMessage("Instructor created successfully.");
  };

  const handleSaveInstructor = () => {
    if (!editInstructor) return;
    setInstructors((current) => current.map((instructor) => instructor.id === editInstructor.id ? {
      ...instructor,
      name: editInstructor.name,
      email: editInstructor.email,
      expertise: typeof editInstructor.expertise === "string" ? editInstructor.expertise.split(",").map((value) => value.trim()).filter(Boolean) : editInstructor.expertise,
      status: editInstructor.status,
      verification: editInstructor.verification,
      bio: editInstructor.bio,
      phone: editInstructor.phone || "Not provided",
      country: editInstructor.country || "Unknown",
      experience: editInstructor.experience || "New instructor",
    } : instructor));
    setEditInstructor(null);
    setStatusMessage("Instructor updated successfully.");
  };

  const handleApproval = () => {
    if (!approveInstructor) return;
    setInstructors((current) => current.map((instructor) => instructor.id === approveInstructor.id ? { ...instructor, status: "active", verification: "verified" } : instructor));
    setApproveInstructor(null);
    setStatusMessage("Instructor approved successfully.");
  };

  const handleToggleStatus = (instructor) => {
    const nextStatus = instructor.status === "active" ? "suspended" : "active";
    setToggleInstructor({ ...instructor, nextStatus });
  };

  const confirmToggleStatus = () => {
    if (!toggleInstructor) return;
    setInstructors((current) => current.map((instructor) => instructor.id === toggleInstructor.id ? { ...instructor, status: toggleInstructor.nextStatus } : instructor));
    setToggleInstructor(null);
    setStatusMessage(toggleInstructor.nextStatus === "suspended" ? "Instructor suspended successfully." : "Instructor activated successfully.");
  };

  const handleDeleteInstructor = () => {
    if (!deleteInstructor) return;
    setInstructors((current) => current.filter((instructor) => instructor.id !== deleteInstructor.id));
    setDeleteInstructor(null);
    setStatusMessage("Instructor deleted from the demo dataset.");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[role='menu']") && !event.target.closest('[aria-label*="Open actions"]')) {
        setOpenActionInstructorId(null);
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
          <span className="font-medium text-slate-900">Instructors</span>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Faculty management</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Instructor Management</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">Manage EduLearn instructors, course activity, ratings, approvals, and account status.</p>
          </div>

          <Button type="button" variant="default" size="default" leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />} onClick={() => setIsAddInstructorOpen(true)}>Add Instructor</Button>
        </div>
      </div>

      {statusMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">{statusMessage}</div> : null}

      <InstructorStats />

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600"><UserCheck className="h-4 w-4" aria-hidden="true" /><span className="text-sm font-medium">Instructor Directory</span></div>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 sm:flex"><ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />Live demo data</div>
        </div>

        <InstructorFilters
          search={search}
          status={status}
          verification={verification}
          rating={rating}
          courses={courses}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onVerificationChange={setVerification}
          onRatingChange={setRating}
          onCourseChange={setCourses}
          onSortChange={setSortBy}
          onReset={handleResetFilters}
        />

        <div className="mt-5"><InstructorTabs activeTab={activeTab} onChange={setActiveTab} /></div>
      </div>

      <section className="space-y-4">
        {filteredInstructors.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Search className="h-6 w-6" aria-hidden="true" /></div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">No instructors found</h3>
            <p className="mt-2 text-sm text-slate-600">Try adjusting your search or filter criteria.</p>
            <div className="mt-5 flex justify-center"><Button type="button" variant="outline" onClick={handleResetFilters}>Reset Filters</Button></div>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <InstructorTable
                instructors={paginatedInstructors}
                onView={setViewInstructor}
                onEdit={setEditInstructor}
                onCourses={setCoursesInstructor}
                onReview={setReviewInstructor}
                onToggleStatus={handleToggleStatus}
                onApprove={setApproveInstructor}
                onDelete={setDeleteInstructor}
                openActionInstructorId={openActionInstructorId}
                onOpenActions={setOpenActionInstructorId}
              />

              {paginatedInstructors.map((instructor) => (
                <div key={instructor.id} className="md:hidden">
                  <InstructorMobileCard
                    instructor={instructor}
                    onView={setViewInstructor}
                    onEdit={setEditInstructor}
                    onCourses={setCoursesInstructor}
                    onReview={setReviewInstructor}
                    onToggleStatus={handleToggleStatus}
                    onApprove={setApproveInstructor}
                    onDelete={setDeleteInstructor}
                    openActionInstructorId={openActionInstructorId}
                    onOpenActions={setOpenActionInstructorId}
                  />
                </div>
              ))}
            </div>

            <InstructorPagination currentPage={safeCurrentPage} totalPages={totalPages} totalInstructors={filteredInstructors.length} onPageChange={handlePageChange} />
          </>
        )}
      </section>

      <ModalShell open={Boolean(isAddInstructorOpen)} title="Add Instructor" onClose={() => setIsAddInstructorOpen(false)} width="max-w-2xl">
        <div className="space-y-4">
          <div>
            <label htmlFor="add-instructor-name" className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
            <input id="add-instructor-name" value={formValues.name} onChange={(event) => setFormValues((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            {formErrors.name ? <p className="mt-1 text-xs text-red-600">{formErrors.name}</p> : null}
          </div>

          <div>
            <label htmlFor="add-instructor-email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input id="add-instructor-email" type="email" value={formValues.email} onChange={(event) => setFormValues((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            {formErrors.email ? <p className="mt-1 text-xs text-red-600">{formErrors.email}</p> : null}
          </div>

          <div>
            <label htmlFor="add-instructor-expertise" className="mb-2 block text-sm font-medium text-slate-700">Expertise</label>
            <input id="add-instructor-expertise" value={formValues.expertise} onChange={(event) => setFormValues((current) => ({ ...current, expertise: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="React, Next.js, JavaScript" />
            {formErrors.expertise ? <p className="mt-1 text-xs text-red-600">{formErrors.expertise}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="add-instructor-phone" className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
              <input id="add-instructor-phone" value={formValues.phone} onChange={(event) => setFormValues((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>
            <div>
              <label htmlFor="add-instructor-country" className="mb-2 block text-sm font-medium text-slate-700">Country</label>
              <input id="add-instructor-country" value={formValues.country} onChange={(event) => setFormValues((current) => ({ ...current, country: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="add-instructor-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select id="add-instructor-status" value={formValues.status} onChange={(event) => setFormValues((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              {formErrors.status ? <p className="mt-1 text-xs text-red-600">{formErrors.status}</p> : null}
            </div>
            <div>
              <label htmlFor="add-instructor-verification" className="mb-2 block text-sm font-medium text-slate-700">Verification</label>
              <select id="add-instructor-verification" value={formValues.verification} onChange={(event) => setFormValues((current) => ({ ...current, verification: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
                <option value="pending">Pending</option>
                <option value="verification pending">Verification Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="add-instructor-experience" className="mb-2 block text-sm font-medium text-slate-700">Experience</label>
            <input id="add-instructor-experience" value={formValues.experience} onChange={(event) => setFormValues((current) => ({ ...current, experience: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="8 years" />
          </div>

          <div>
            <label htmlFor="add-instructor-bio" className="mb-2 block text-sm font-medium text-slate-700">Bio</label>
            <textarea id="add-instructor-bio" value={formValues.bio} onChange={(event) => setFormValues((current) => ({ ...current, bio: event.target.value }))} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            {formErrors.bio ? <p className="mt-1 text-xs text-red-600">{formErrors.bio}</p> : null}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddInstructorOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleAddInstructor}>Create Instructor</Button>
          </div>
        </div>
      </ModalShell>

      <ModalShell open={Boolean(editInstructor)} title="Edit Instructor" onClose={() => setEditInstructor(null)} width="max-w-2xl">
        {editInstructor ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-instructor-name" className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input id="edit-instructor-name" value={editInstructor.name} onChange={(event) => setEditInstructor((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>
            <div>
              <label htmlFor="edit-instructor-email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input id="edit-instructor-email" type="email" value={editInstructor.email} onChange={(event) => setEditInstructor((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>
            <div>
              <label htmlFor="edit-instructor-expertise" className="mb-2 block text-sm font-medium text-slate-700">Expertise</label>
              <input id="edit-instructor-expertise" value={Array.isArray(editInstructor.expertise) ? editInstructor.expertise.join(", ") : editInstructor.expertise} onChange={(event) => setEditInstructor((current) => ({ ...current, expertise: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-instructor-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
                <select id="edit-instructor-status" value={editInstructor.status} onChange={(event) => setEditInstructor((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-instructor-verification" className="mb-2 block text-sm font-medium text-slate-700">Verification</label>
                <select id="edit-instructor-verification" value={editInstructor.verification} onChange={(event) => setEditInstructor((current) => ({ ...current, verification: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                  <option value="pending">Pending</option>
                  <option value="verification pending">Verification Pending</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-instructor-phone" className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
                <input id="edit-instructor-phone" value={editInstructor.phone || ""} onChange={(event) => setEditInstructor((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
              </div>
              <div>
                <label htmlFor="edit-instructor-country" className="mb-2 block text-sm font-medium text-slate-700">Country</label>
                <input id="edit-instructor-country" value={editInstructor.country || ""} onChange={(event) => setEditInstructor((current) => ({ ...current, country: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
              </div>
            </div>
            <div>
              <label htmlFor="edit-instructor-experience" className="mb-2 block text-sm font-medium text-slate-700">Experience</label>
              <input id="edit-instructor-experience" value={editInstructor.experience || ""} onChange={(event) => setEditInstructor((current) => ({ ...current, experience: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>
            <div>
              <label htmlFor="edit-instructor-bio" className="mb-2 block text-sm font-medium text-slate-700">Bio</label>
              <textarea id="edit-instructor-bio" value={editInstructor.bio || ""} onChange={(event) => setEditInstructor((current) => ({ ...current, bio: event.target.value }))} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditInstructor(null)}>Cancel</Button>
              <Button type="button" onClick={handleSaveInstructor}>Save Changes</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(viewInstructor)} title="Instructor Details" onClose={() => setViewInstructor(null)} width="max-w-4xl">
        {viewInstructor ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
              <Avatar name={viewInstructor.name} size="xl" />
              <div>
                <h4 className="text-2xl font-bold text-slate-900">{viewInstructor.name}</h4>
                <p className="text-sm text-slate-500">Instructor ID: {viewInstructor.id}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant={verificationVariantMap[viewInstructor.verification] || "secondary"} size="sm" className="capitalize">{getVerificationLabel(viewInstructor.verification)}</Badge>
                  <Badge variant={statusVariantMap[viewInstructor.status] || "secondary"} size="sm" className="capitalize">{getStatusLabel(viewInstructor.status)}</Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Email</p><p className="mt-2 break-all text-sm font-medium text-slate-900">{viewInstructor.email}</p></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Joined</p><p className="mt-2 text-sm font-medium text-slate-900">{formatJoinedDate(viewInstructor.joinedAt)}</p></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Teaching Hours</p><p className="mt-2 text-sm font-medium text-slate-900">{viewInstructor.teachingHours}h</p></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Rating</p><p className="mt-2 text-sm font-medium text-slate-900">{viewInstructor.rating.toFixed(1)} / 5</p></div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Expertise</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{viewInstructor.expertise?.join(", ") || "General"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Bio</p>
                <p className="mt-2 text-sm text-slate-700">{viewInstructor.bio}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-700"><GraduationCap className="h-4 w-4" aria-hidden="true" /><span className="font-semibold">Instructor Performance</span></div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Total Courses</p><p className="mt-2 text-2xl font-bold text-slate-900">{viewInstructor.courses}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Published Courses</p><p className="mt-2 text-2xl font-bold text-slate-900">{viewInstructor.coursesList.filter((course) => course.status === "published").length}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Draft Courses</p><p className="mt-2 text-2xl font-bold text-slate-900">{viewInstructor.coursesList.filter((course) => course.status === "draft").length}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Total Students</p><p className="mt-2 text-2xl font-bold text-slate-900">{formatNumber(viewInstructor.students)}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Average Rating</p><p className="mt-2 text-2xl font-bold text-slate-900">{viewInstructor.rating.toFixed(1)}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Completion Rate</p><p className="mt-2 text-2xl font-bold text-slate-900">{viewInstructor.completionRate}%</p></div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-700"><BookOpen className="h-4 w-4" aria-hidden="true" /><span className="font-semibold">Instructor Courses</span></div>
              <div className="space-y-3">
                {viewInstructor.coursesList?.length ? viewInstructor.coursesList.map((course) => (
                  <div key={course.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{course.title}</p>
                        <p className="text-xs text-slate-500">{course.category}</p>
                      </div>
                      <Badge variant={course.status === "published" ? "success" : course.status === "draft" ? "secondary" : "warning"} size="sm" className="capitalize">{course.status}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span>{formatNumber(course.students)} students</span>
                      <span>{course.rating ? `${course.rating.toFixed(1)} rating` : "No rating yet"}</span>
                      <span>{formatJoinedDate(course.createdAt)}</span>
                    </div>
                  </div>
                )) : <p className="text-sm text-slate-600">No course data yet.</p>}
              </div>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(coursesInstructor)} title={`${coursesInstructor?.name || "Instructor"} Courses`} onClose={() => setCoursesInstructor(null)} width="max-w-2xl">
        {coursesInstructor ? (
          <div className="space-y-4">
            {coursesInstructor.coursesList?.length ? coursesInstructor.coursesList.map((course) => (
              <div key={course.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{course.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{course.category}</p>
                  </div>
                  <Badge variant={course.status === "published" ? "success" : course.status === "draft" ? "secondary" : "warning"} size="sm" className="capitalize">{course.status}</Badge>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Students</p><p className="mt-1 text-sm font-medium text-slate-800">{formatNumber(course.students)}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Rating</p><p className="mt-1 text-sm font-medium text-slate-800">{course.rating ? course.rating.toFixed(1) : "N/A"}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Created</p><p className="mt-1 text-sm font-medium text-slate-800">{formatJoinedDate(course.createdAt)}</p></div>
                </div>
              </div>
            )) : <p className="text-sm text-slate-600">No courses created yet.</p>}
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(reviewInstructor)} title="Review Profile" onClose={() => setReviewInstructor(null)} width="max-w-2xl">
        {reviewInstructor ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="text-lg font-semibold text-slate-900">{reviewInstructor.name}</h4>
              <p className="mt-1 text-sm text-slate-600">Profile completeness: {reviewInstructor.profileComplete}%</p>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-primary-600" style={{ width: `${reviewInstructor.profileComplete}%` }} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-3"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /><span className="font-medium text-slate-800">Basic Information</span></div></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /><span className="font-medium text-slate-800">Profile Image</span></div></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /><span className="font-medium text-slate-800">Bio</span></div></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /><span className="font-medium text-slate-800">Expertise</span></div></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /><span className="font-medium text-slate-800">Teaching Experience</span></div></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /><span className="font-medium text-slate-800">Course Information</span></div></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:col-span-2"><div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" /><span className="font-medium text-slate-800">Verification Documents</span><span className="text-sm text-slate-500">Pending</span></div></div>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(approveInstructor)} title="Approve Instructor?" onClose={() => setApproveInstructor(null)} width="max-w-md">
        {approveInstructor ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Are you sure you want to approve {approveInstructor.name} as an EduLearn instructor?</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setApproveInstructor(null)}>Cancel</Button>
              <Button type="button" onClick={handleApproval}>Approve</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(toggleInstructor)} title={toggleInstructor?.status === "active" ? "Suspend Instructor?" : "Activate Instructor?"} onClose={() => setToggleInstructor(null)} width="max-w-md">
        {toggleInstructor ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Are you sure you want to {toggleInstructor.nextStatus === "suspended" ? "suspend" : "activate"} this instructor?</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setToggleInstructor(null)}>Cancel</Button>
              <Button type="button" variant={toggleInstructor.nextStatus === "suspended" ? "destructive" : "success"} onClick={confirmToggleStatus}>{toggleInstructor.nextStatus === "suspended" ? "Suspend" : "Activate"}</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(deleteInstructor)} title="Delete Instructor?" onClose={() => setDeleteInstructor(null)} width="max-w-md">
        {deleteInstructor ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">This will remove the instructor from the current demo dataset.</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDeleteInstructor(null)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDeleteInstructor}>Delete Instructor</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      {/* TODO: verify authenticated admin role and instructor-management permission before production rollout. */}
    </div>
  );
}
