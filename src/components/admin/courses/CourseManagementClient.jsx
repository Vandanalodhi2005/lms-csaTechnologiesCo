"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/utils";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import { adminCourses, adminCoursesSummary } from "@/constants/adminCourses.js";
import {
  Archive,
  Ban,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  Layers3,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";

const COURSES_PER_PAGE = 8;

const tabs = [
  { key: "all", label: "All Courses" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "pending", label: "Pending Review" },
  { key: "rejected", label: "Rejected" },
  { key: "archived", label: "Archived" },
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "Web Development", label: "Web Development" },
  { value: "Programming", label: "Programming" },
  { value: "Data Science", label: "Data Science" },
  { value: "Design", label: "Design" },
  { value: "Business", label: "Business" },
  { value: "Marketing", label: "Marketing" },
  { value: "Cloud & DevOps", label: "Cloud & DevOps" },
  { value: "Other", label: "Other" },
];

const levelOptions = [
  { value: "all", label: "All Levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending Review" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

const priceOptions = [
  { value: "all", label: "All Prices" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
  { value: "under-1000", label: "Under ₹1,000" },
  { value: "1000-5000", label: "₹1,000–₹5,000" },
  { value: "above-5000", label: "Above ₹5,000" },
];

const ratingOptions = [
  { value: "all", label: "All Ratings" },
  { value: "4.5", label: "4.5+" },
  { value: "4.0", label: "4.0+" },
  { value: "3.0", label: "3.0+" },
  { value: "below-3.0", label: "Below 3.0" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "rating-desc", label: "Highest Rating" },
  { value: "students-desc", label: "Most Students" },
  { value: "price-desc", label: "Highest Price" },
];

const statusVariantMap = {
  published: "success",
  draft: "secondary",
  pending: "warning",
  rejected: "danger",
  archived: "info",
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value || 0));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatUpdatedLabel(rawDate) {
  if (!rawDate) return "Recently";
  const date = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return rawDate;

  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 24) {
    if (diffHours <= 1) return "Today";
    if (diffHours <= 3) return `${diffHours} hours ago`;
    return `${diffHours} hours ago`;
  }

  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getDateValue(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function renderStars(rating) {
  const filled = Math.round(rating || 0);
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={`${rating}-${index}`}
      className={cn("h-3.5 w-3.5", index < filled ? "fill-amber-400 text-amber-400" : "text-slate-300")}
      aria-hidden="true"
    />
  ));
}

function getCourseActions(course) {
  const actions = [{ label: "View Course", type: "view" }, { label: "Edit Course", type: "edit" }];

  if (course.status === "pending") {
    actions.push(
      { label: "Review Course", type: "review" },
      { label: "Approve Course", type: "approve" },
      { label: "Reject Course", type: "reject" }
    );
  }

  if (course.status === "draft") {
    actions.push(
      { label: "Review Course", type: "review" },
      { label: "Publish Course", type: "publish" },
      { label: "Delete Course", type: "delete" }
    );
  }

  if (course.status === "published") {
    actions.push(
      { label: "Review Course", type: "review" },
      { label: "Unpublish Course", type: "unpublish" },
      { label: "Archive Course", type: "archive" }
    );
  }

  if (course.status === "rejected") {
    actions.push(
      { label: "Review Course", type: "review" },
      { label: "Publish Course", type: "publish" }
    );
  }

  if (course.status === "archived") {
    actions.push({ label: "Restore Course", type: "restore" });
  }

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

function CourseStats() {
  const summaryItems = [
    { label: "Total Courses", value: formatNumber(adminCoursesSummary.totalCourses), detail: "All active catalog items", icon: BookOpen },
    { label: "Published Courses", value: formatNumber(adminCoursesSummary.publishedCourses), detail: "Live on the platform", icon: CheckCircle2 },
    { label: "Pending Review", value: formatNumber(adminCoursesSummary.pendingReview), detail: "Awaiting moderation", icon: Clock3 },
    { label: "Draft Courses", value: formatNumber(adminCoursesSummary.draftCourses), detail: "Recently created drafts", icon: FileText },
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

function CourseFilters({
  search,
  category,
  level,
  status,
  instructor,
  price,
  rating,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onLevelChange,
  onStatusChange,
  onInstructorChange,
  onPriceChange,
  onRatingChange,
  onSortChange,
  onReset,
  instructorOptions,
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        <div className="flex-1">
          <label htmlFor="course-search" className="mb-2 block text-sm font-medium text-slate-700">Search courses</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="course-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search courses by title, instructor, or course ID..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7 xl:flex-[1.6]">
          <div>
            <label htmlFor="category-filter" className="mb-2 block text-sm font-medium text-slate-700">Category</label>
            <div className="relative">
              <select id="category-filter" value={category} onChange={(event) => onCategoryChange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="level-filter" className="mb-2 block text-sm font-medium text-slate-700">Level</label>
            <div className="relative">
              <select id="level-filter" value={level} onChange={(event) => onLevelChange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {levelOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="status-filter" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <div className="relative">
              <select id="status-filter" value={status} onChange={(event) => onStatusChange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="instructor-filter" className="mb-2 block text-sm font-medium text-slate-700">Instructor</label>
            <div className="relative">
              <select id="instructor-filter" value={instructor} onChange={(event) => onInstructorChange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                <option value="all">All Instructors</option>
                {instructorOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="price-filter" className="mb-2 block text-sm font-medium text-slate-700">Price</label>
            <div className="relative">
              <select id="price-filter" value={price} onChange={(event) => onPriceChange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {priceOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="rating-filter" className="mb-2 block text-sm font-medium text-slate-700">Rating</label>
            <div className="relative">
              <select id="rating-filter" value={rating} onChange={(event) => onRatingChange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {ratingOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="sort-filter" className="mb-2 block text-sm font-medium text-slate-700">Sort</label>
            <div className="relative">
              <select id="sort-filter" value={sortBy} onChange={(event) => onSortChange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="button" variant="outline" onClick={onReset} leftIcon={<Filter className="h-4 w-4" aria-hidden="true" />}>
          Reset Filters
        </Button>
      </div>
    </section>
  );
}

function CourseTabs({ activeTab, onChange }) {
  return (
    <div className="border-b border-slate-200">
      <nav aria-label="Course tabs" className="flex flex-wrap gap-2">
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

function CourseStatusBadge({ status }) {
  return (
    <Badge variant={statusVariantMap[status] || "secondary"} size="sm" className="capitalize">
      {status === "pending" ? "Pending Review" : status === "rejected" ? "Rejected" : status === "archived" ? "Archived" : status}
    </Badge>
  );
}

function CourseTable({
  courses,
  onView,
  onReview,
  onEdit,
  onAction,
  openActionCourseId,
  onOpenActions,
}) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Instructor</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Students</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Updated</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-t border-slate-200 align-middle text-sm text-slate-700">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-primary-100 to-slate-100 text-sm font-bold text-primary-700">
                    {course.thumbnail ? (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 via-slate-100 to-primary-50 text-xs font-bold tracking-[0.1em] text-primary-700">
                        {course.title.slice(0, 2).toUpperCase()}
                      </div>
                    ) : (
                      course.title.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{course.title}</p>
                    <p className="truncate text-xs text-slate-500">{course.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <Avatar name={course.instructor.name} size="sm" />
                  <span className="font-medium text-slate-700">{course.instructor.name}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="max-w-[170px]">
                  <p className="font-medium text-slate-700">{course.category}</p>
                  {course.subcategory ? <p className="text-xs text-slate-500">{course.subcategory}</p> : null}
                </div>
              </td>
              <td className="px-4 py-4">{formatNumber(course.students)}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1" aria-label={`${course.rating || 0} out of 5 stars`}>{renderStars(course.rating)}</div>
                  <span className="font-medium text-slate-900">{course.rating ? course.rating.toFixed(1) : "0.0"}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{formatNumber(course.reviews)} reviews</p>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-1">
                  {course.price === 0 ? (
                    <span className="font-semibold text-slate-800">Free</span>
                  ) : (
                    <>
                      <span className="font-semibold text-slate-900">{formatCurrency(course.price)}</span>
                      {course.originalPrice && course.originalPrice > course.price ? (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="line-through">{formatCurrency(course.originalPrice)}</span>
                          <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                            {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off
                          </span>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </td>
              <td className="px-4 py-4"><CourseStatusBadge status={course.status} /></td>
              <td className="px-4 py-4 text-slate-600">{formatUpdatedLabel(course.updatedAt)}</td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button type="button" aria-label={`View ${course.title}`} onClick={() => onView(course)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><Eye className="h-4 w-4" aria-hidden="true" /></button>
                  <button type="button" aria-label={`Edit ${course.title}`} onClick={() => onEdit(course)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><Pencil className="h-4 w-4" aria-hidden="true" /></button>
                  <div className="relative">
                    <button type="button" aria-label={`Open actions for ${course.title}`} onClick={() => onOpenActions(course.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></button>
                    {course.id === openActionCourseId && (
                      <div role="menu" aria-label={`Actions for ${course.title}`} className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                        {getCourseActions(course).map((action) => (
                          <button
                            key={action.type}
                            type="button"
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                            onClick={() => {
                              if (action.type === "view") onView(course);
                              if (action.type === "edit") onEdit(course);
                              if (action.type === "review") onReview(course);
                              if (action.type === "approve") onAction(course, "approve");
                              if (action.type === "reject") onAction(course, "reject");
                              if (action.type === "publish") onAction(course, "publish");
                              if (action.type === "unpublish") onAction(course, "unpublish");
                              if (action.type === "archive") onAction(course, "archive");
                              if (action.type === "restore") onAction(course, "restore");
                              if (action.type === "delete") onAction(course, "delete");
                              onOpenActions(null);
                            }}
                          >
                            {action.type === "view" && <Eye className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "edit" && <Pencil className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "review" && <FileText className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "approve" && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "reject" && <Ban className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "publish" && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "unpublish" && <Clock3 className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "archive" && <Archive className="h-4 w-4" aria-hidden="true" />}
                            {action.type === "restore" && <RotateCcw className="h-4 w-4" aria-hidden="true" />}
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

function CourseMobileCard({
  course,
  onView,
  onReview,
  onEdit,
  onAction,
  openActionCourseId,
  onOpenActions,
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-primary-100 to-slate-100 text-sm font-bold text-primary-700">
            {course.thumbnail ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 via-slate-100 to-primary-50 text-xs font-bold tracking-[0.1em] text-primary-700">
                {course.title.slice(0, 2).toUpperCase()}
              </div>
            ) : (
              course.title.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{course.title}</p>
            <p className="truncate text-xs text-slate-500">{course.id}</p>
          </div>
        </div>
        <div className="relative">
          <button type="button" aria-label={`Open actions for ${course.title}`} onClick={() => onOpenActions(course.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></button>
          {course.id === openActionCourseId && (
            <div role="menu" aria-label={`Actions for ${course.title}`} className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              {getCourseActions(course).map((action) => (
                <button
                  key={action.type}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    if (action.type === "view") onView(course);
                    if (action.type === "edit") onEdit(course);
                    if (action.type === "review") onReview(course);
                    if (action.type === "approve") onAction(course, "approve");
                    if (action.type === "reject") onAction(course, "reject");
                    if (action.type === "publish") onAction(course, "publish");
                    if (action.type === "unpublish") onAction(course, "unpublish");
                    if (action.type === "archive") onAction(course, "archive");
                    if (action.type === "restore") onAction(course, "restore");
                    if (action.type === "delete") onAction(course, "delete");
                    onOpenActions(null);
                  }}
                >
                  {action.type === "view" && <Eye className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "edit" && <Pencil className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "review" && <FileText className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "approve" && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "reject" && <Ban className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "publish" && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "unpublish" && <Clock3 className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "archive" && <Archive className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "restore" && <RotateCcw className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "delete" && <Trash2 className="h-4 w-4" aria-hidden="true" />}
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Instructor</span><span className="text-right">{course.instructor.name}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Category</span><span className="text-right">{course.category}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Students</span><span>{formatNumber(course.students)}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Rating</span><span>{course.rating ? `${course.rating.toFixed(1)} / 5` : "N/A"}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Price</span><span>{course.price === 0 ? "Free" : formatCurrency(course.price)}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Status</span><CourseStatusBadge status={course.status} /></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Updated</span><span>{formatUpdatedLabel(course.updatedAt)}</span></div>
      </div>
    </div>
  );
}

function CoursePagination({ currentPage, totalPages, totalCourses, onPageChange }) {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * COURSES_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * COURSES_PER_PAGE, totalCourses);

  return (
    <div className="flex flex-col gap-4 rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">Showing <span className="font-semibold text-slate-900">{startIndex}–{endIndex}</span> of <span className="font-semibold text-slate-900">{formatNumber(totalCourses)}</span> courses</p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" aria-hidden="true" /></button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1).map((page) => (
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

export default function CourseManagementClient() {
  const router = useRouter();
  const [courses, setCourses] = React.useState(adminCourses);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [level, setLevel] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [instructor, setInstructor] = React.useState("all");
  const [price, setPrice] = React.useState("all");
  const [rating, setRating] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");
  const [activeTab, setActiveTab] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [openActionCourseId, setOpenActionCourseId] = React.useState(null);
  const [viewCourse, setViewCourse] = React.useState(null);
  const [reviewCourse, setReviewCourse] = React.useState(null);
  const [reviewNote, setReviewNote] = React.useState("");
  const [approveCourse, setApproveCourse] = React.useState(null);
  const [publishCourse, setPublishCourse] = React.useState(null);
  const [unpublishCourse, setUnpublishCourse] = React.useState(null);
  const [archiveCourse, setArchiveCourse] = React.useState(null);
  const [restoreCourse, setRestoreCourse] = React.useState(null);
  const [rejectCourse, setRejectCourse] = React.useState(null);
  const [rejectReason, setRejectReason] = React.useState("");
  const [rejectError, setRejectError] = React.useState("");
  const [deleteCourse, setDeleteCourse] = React.useState(null);

  const instructorOptions = React.useMemo(
    () => [...new Set(courses.map((course) => course.instructor.name))].sort((a, b) => a.localeCompare(b)),
    [courses]
  );

  React.useEffect(() => {
    setOpenActionCourseId(null);
  }, [search, category, level, status, instructor, price, rating, sortBy, activeTab, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, category, level, status, instructor, price, rating, activeTab]);

  React.useEffect(() => {
    if (!statusMessage) return undefined;
    const timer = window.setTimeout(() => setStatusMessage(""), 2400);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[role='menu']") && !event.target.closest('[aria-label*="Open actions"]')) {
        setOpenActionCourseId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredCourses = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    let nextCourses = [...courses];

    if (term) {
      nextCourses = nextCourses.filter((course) => {
        const haystack = `${course.title} ${course.instructor.name} ${course.id}`.toLowerCase();
        return haystack.includes(term);
      });
    }

    if (category !== "all") {
      nextCourses = nextCourses.filter((course) => course.category === category);
    }

    if (level !== "all") {
      nextCourses = nextCourses.filter((course) => course.level === level);
    }

    if (status !== "all") {
      nextCourses = nextCourses.filter((course) => course.status === status);
    }

    if (instructor !== "all") {
      nextCourses = nextCourses.filter((course) => course.instructor.name === instructor);
    }

    if (price !== "all") {
      if (price === "free") nextCourses = nextCourses.filter((course) => course.price === 0);
      if (price === "paid") nextCourses = nextCourses.filter((course) => course.price > 0);
      if (price === "under-1000") nextCourses = nextCourses.filter((course) => course.price > 0 && course.price < 1000);
      if (price === "1000-5000") nextCourses = nextCourses.filter((course) => course.price >= 1000 && course.price <= 5000);
      if (price === "above-5000") nextCourses = nextCourses.filter((course) => course.price > 5000);
    }

    if (rating !== "all") {
      if (rating === "4.5") nextCourses = nextCourses.filter((course) => (course.rating || 0) >= 4.5);
      if (rating === "4.0") nextCourses = nextCourses.filter((course) => (course.rating || 0) >= 4.0);
      if (rating === "3.0") nextCourses = nextCourses.filter((course) => (course.rating || 0) >= 3.0);
      if (rating === "below-3.0") nextCourses = nextCourses.filter((course) => (course.rating || 0) < 3.0);
    }

    if (activeTab !== "all") {
      nextCourses = nextCourses.filter((course) => course.status === activeTab);
    }

    switch (sortBy) {
      case "newest":
        nextCourses.sort((a, b) => getDateValue(b.updatedAt) - getDateValue(a.updatedAt));
        break;
      case "oldest":
        nextCourses.sort((a, b) => getDateValue(a.updatedAt) - getDateValue(b.updatedAt));
        break;
      case "title-asc":
        nextCourses.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        nextCourses.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating-desc":
        nextCourses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "students-desc":
        nextCourses.sort((a, b) => b.students - a.students);
        break;
      case "price-desc":
        nextCourses.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return nextCourses;
  }, [courses, search, category, level, status, instructor, price, rating, activeTab, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / COURSES_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCourses = filteredCourses.slice((safeCurrentPage - 1) * COURSES_PER_PAGE, safeCurrentPage * COURSES_PER_PAGE);

  React.useEffect(() => {
    if (safeCurrentPage !== currentPage) setCurrentPage(safeCurrentPage);
  }, [safeCurrentPage, currentPage]);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("all");
    setLevel("all");
    setStatus("all");
    setInstructor("all");
    setPrice("all");
    setRating("all");
    setSortBy("newest");
    setActiveTab("all");
    setCurrentPage(1);
  };

  const handleAction = (course, action) => {
    if (action === "approve") setApproveCourse(course);
    if (action === "publish") setPublishCourse(course);
    if (action === "unpublish") setUnpublishCourse(course);
    if (action === "archive") setArchiveCourse(course);
    if (action === "restore") setRestoreCourse(course);
    if (action === "reject") setRejectCourse(course);
    if (action === "delete") setDeleteCourse(course);
  };

  const confirmApprove = () => {
    if (!approveCourse) return;
    setCourses((current) => current.map((course) => course.id === approveCourse.id ? { ...course, status: "published" } : course));
    setApproveCourse(null);
    setStatusMessage("Course approved successfully.");
  };

  const confirmPublish = () => {
    if (!publishCourse) return;
    setCourses((current) => current.map((course) => course.id === publishCourse.id ? { ...course, status: "published" } : course));
    setPublishCourse(null);
    setStatusMessage("Course published successfully.");
  };

  const confirmUnpublish = () => {
    if (!unpublishCourse) return;
    setCourses((current) => current.map((course) => course.id === unpublishCourse.id ? { ...course, status: "draft" } : course));
    setUnpublishCourse(null);
    setStatusMessage("Course moved back to draft.");
  };

  const confirmArchive = () => {
    if (!archiveCourse) return;
    setCourses((current) => current.map((course) => course.id === archiveCourse.id ? { ...course, status: "archived" } : course));
    setArchiveCourse(null);
    setStatusMessage("Course archived successfully.");
  };

  const confirmRestore = () => {
    if (!restoreCourse) return;
    setCourses((current) => current.map((course) => course.id === restoreCourse.id ? { ...course, status: "draft" } : course));
    setRestoreCourse(null);
    setStatusMessage("Course restored successfully.");
  };

  const confirmReject = () => {
    if (!rejectCourse) return;
    if (!rejectReason.trim()) {
      setRejectError("Reason is required.");
      return;
    }
    setCourses((current) => current.map((course) => course.id === rejectCourse.id ? { ...course, status: "rejected" } : course));
    setRejectCourse(null);
    setRejectReason("");
    setRejectError("");
    setStatusMessage("Course rejected successfully.");
  };

  const handleDelete = () => {
    if (!deleteCourse) return;
    setCourses((current) => current.filter((course) => course.id !== deleteCourse.id));
    setDeleteCourse(null);
    setStatusMessage("Course deleted from the demo dataset.");
  };

  const handleEditCourse = (course) => {
    if (course) {
      router.push("/instructor/courses/create");
    }
  };

  const handleReviewSubmit = (action) => {
    if (!reviewCourse) return;
    if (action === "approve") {
      setCourses((current) => current.map((course) => course.id === reviewCourse.id ? { ...course, status: "published" } : course));
      setStatusMessage("Course approved successfully.");
    }
    if (action === "reject") {
      setCourses((current) => current.map((course) => course.id === reviewCourse.id ? { ...course, status: "rejected" } : course));
      setStatusMessage("Course rejected successfully.");
    }
    setReviewCourse(null);
    setReviewNote("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/admin/dashboard" className="hover:text-primary-600">Admin</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-slate-900">Courses</span>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Course oversight</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Course Management</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">Manage, review, approve, publish, and monitor all courses available on the EduLearn platform.</p>
          </div>

          <Link href="/instructor/courses/create">
            <Button type="button" variant="default" leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}>Add Course</Button>
          </Link>
        </div>
      </div>

      {statusMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">{statusMessage}</div> : null}

      <CourseStats />

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600"><Layers3 className="h-4 w-4" aria-hidden="true" /><span className="text-sm font-medium">Course Directory</span></div>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 sm:flex"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />Live demo catalog</div>
        </div>

        <CourseFilters
          search={search}
          category={category}
          level={level}
          status={status}
          instructor={instructor}
          price={price}
          rating={rating}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onLevelChange={setLevel}
          onStatusChange={setStatus}
          onInstructorChange={setInstructor}
          onPriceChange={setPrice}
          onRatingChange={setRating}
          onSortChange={setSortBy}
          onReset={handleResetFilters}
          instructorOptions={instructorOptions}
        />

        <div className="mt-5"><CourseTabs activeTab={activeTab} onChange={setActiveTab} /></div>
      </div>

      <section className="space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Search className="h-6 w-6" aria-hidden="true" /></div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">No courses found</h3>
            <p className="mt-2 text-sm text-slate-600">Try changing your search or filter criteria.</p>
            <div className="mt-5 flex justify-center"><Button type="button" variant="outline" onClick={handleResetFilters}>Reset Filters</Button></div>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <CourseTable
                courses={paginatedCourses}
                onView={setViewCourse}
                onReview={setReviewCourse}
                onEdit={handleEditCourse}
                onAction={handleAction}
                openActionCourseId={openActionCourseId}
                onOpenActions={setOpenActionCourseId}
              />

              {paginatedCourses.map((course) => (
                <CourseMobileCard
                  key={course.id}
                  course={course}
                  onView={setViewCourse}
                  onReview={setReviewCourse}
                  onEdit={handleEditCourse}
                  onAction={handleAction}
                  openActionCourseId={openActionCourseId}
                  onOpenActions={setOpenActionCourseId}
                />
              ))}
            </div>

            <CoursePagination currentPage={safeCurrentPage} totalPages={totalPages} totalCourses={filteredCourses.length} onPageChange={(page) => setCurrentPage(page)} />
          </>
        )}
      </section>

      <ModalShell open={Boolean(viewCourse)} title="Course Details" onClose={() => setViewCourse(null)} width="max-w-5xl">
        {viewCourse ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[20px] border border-slate-200 bg-gradient-to-br from-primary-100 to-slate-100 text-xl font-bold text-primary-700">
                {viewCourse.thumbnail ? (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 via-slate-100 to-primary-50 text-lg font-bold tracking-[0.1em] text-primary-700">
                    {viewCourse.title.slice(0, 2).toUpperCase()}
                  </div>
                ) : (
                  viewCourse.title.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-slate-900">{viewCourse.title}</h4>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span>{viewCourse.id}</span>
                  <span className="text-slate-300">•</span>
                  <span>{viewCourse.category}</span>
                  <span className="text-slate-300">•</span>
                  <span>{viewCourse.level}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={statusVariantMap[viewCourse.status] || "secondary"} size="sm" className="capitalize">{viewCourse.status === "pending" ? "Pending Review" : viewCourse.status}</Badge>
                  <span className="text-sm text-slate-500">{viewCourse.language}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Instructor</p><p className="mt-2 text-sm font-medium text-slate-900">{viewCourse.instructor.name}</p></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Students</p><p className="mt-2 text-sm font-medium text-slate-900">{formatNumber(viewCourse.students)}</p></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Rating</p><p className="mt-2 text-sm font-medium text-slate-900">{viewCourse.rating.toFixed(1)} / 5</p></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Price</p><p className="mt-2 text-sm font-medium text-slate-900">{viewCourse.price === 0 ? "Free" : formatCurrency(viewCourse.price)}</p></div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h5 className="mb-3 text-lg font-semibold text-slate-900">Course Overview</h5>
                <p className="text-sm leading-6 text-slate-600">{viewCourse.description}</p>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Learning Objectives</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-600">
                      {viewCourse.objectives.map((objective) => <li key={objective} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" /><span>{objective}</span></li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Requirements</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                      {viewCourse.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Target Audience</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                      {viewCourse.audience.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Skills Students Gain</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {viewCourse.skills.map((skill) => <Badge key={skill} variant="default" size="sm">{skill}</Badge>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h5 className="mb-3 text-lg font-semibold text-slate-900">Course Structure</h5>
                  <div className="space-y-3">
                    {viewCourse.curriculum.map((section, index) => (
                      <div key={section.title} className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-slate-800">{String(index + 1).padStart(2, "0")} . {section.title}</p>
                          <span className="text-xs text-slate-500">{section.duration}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">{section.lessons} lessons</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h5 className="mb-3 text-lg font-semibold text-slate-900">Course Performance</h5>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Total Students</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(viewCourse.students)}</p></div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Completion Rate</p><p className="mt-2 text-xl font-bold text-slate-900">{viewCourse.completionRate}%</p></div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Average Rating</p><p className="mt-2 text-xl font-bold text-slate-900">{viewCourse.rating.toFixed(1)}</p></div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Reviews</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(viewCourse.reviews)}</p></div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Total Lessons</p><p className="mt-2 text-xl font-bold text-slate-900">{viewCourse.lessons}</p></div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Course Duration</p><p className="mt-2 text-xl font-bold text-slate-900">{viewCourse.duration}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(reviewCourse)} title="Review Course" onClose={() => setReviewCourse(null)} width="max-w-3xl">
        {reviewCourse ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-primary-100 to-slate-100 text-sm font-bold text-primary-700">
                  {reviewCourse.thumbnail ? (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 via-slate-100 to-primary-50 text-xs font-bold tracking-[0.1em] text-primary-700">
                      {reviewCourse.title.slice(0, 2).toUpperCase()}
                    </div>
                  ) : (
                    reviewCourse.title.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{reviewCourse.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{reviewCourse.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{reviewCourse.instructor.name}</span>
                    <span>•</span>
                    <span>{reviewCourse.category}</span>
                    <span>•</span>
                    <span>{reviewCourse.level}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-700"><BookOpen className="h-4 w-4" aria-hidden="true" /><span className="font-semibold">Publication Checklist</span></div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /><span>Course thumbnail</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /><span>Title and description</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /><span>Instructor and category</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /><span>Curriculum and learning objectives</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" /><span>Requirements and pricing</span></div>
              </div>
            </div>

            <div>
              <label htmlFor="review-notes" className="mb-2 block text-sm font-medium text-slate-700">Review Notes</label>
              <textarea
                id="review-notes"
                value={reviewNote}
                onChange={(event) => setReviewNote(event.target.value)}
                rows={5}
                placeholder="Add review notes for the instructor..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setReviewCourse(null)}>Cancel</Button>
              <Button type="button" variant="default" onClick={() => handleReviewSubmit("approve")}>Approve</Button>
              <Button type="button" variant="destructive" onClick={() => handleReviewSubmit("reject")}>Reject</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(approveCourse)} title="Approve Course?" onClose={() => setApproveCourse(null)} width="max-w-md">
        {approveCourse ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Are you sure you want to approve <span className="font-semibold text-slate-900">{approveCourse.title}</span> for publication?</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setApproveCourse(null)}>Cancel</Button>
              <Button type="button" onClick={confirmApprove}>Approve</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(rejectCourse)} title="Reject Course" onClose={() => { setRejectCourse(null); setRejectReason(""); setRejectError(""); }} width="max-w-md">
        {rejectCourse ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="reject-reason" className="mb-2 block text-sm font-medium text-slate-700">Reason for rejection</label>
              <textarea id="reject-reason" value={rejectReason} onChange={(event) => { setRejectReason(event.target.value); if (event.target.value.trim()) setRejectError(""); }} rows={4} placeholder="Reason for rejection" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
              {rejectError ? <p className="mt-1 text-xs text-red-600">{rejectError}</p> : null}
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => { setRejectCourse(null); setRejectReason(""); setRejectError(""); }}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={confirmReject}>Reject Course</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(publishCourse)} title="Publish Course?" onClose={() => setPublishCourse(null)} width="max-w-md">
        {publishCourse ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Are you sure you want to publish <span className="font-semibold text-slate-900">{publishCourse.title}</span>?</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setPublishCourse(null)}>Cancel</Button>
              <Button type="button" onClick={confirmPublish}>Publish</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(unpublishCourse)} title="Unpublish Course?" onClose={() => setUnpublishCourse(null)} width="max-w-md">
        {unpublishCourse ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">This will remove the course from the public course listing in the demo state.</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setUnpublishCourse(null)}>Cancel</Button>
              <Button type="button" variant="secondary" onClick={confirmUnpublish}>Unpublish</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(archiveCourse)} title="Archive Course?" onClose={() => setArchiveCourse(null)} width="max-w-md">
        {archiveCourse ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Are you sure you want to archive <span className="font-semibold text-slate-900">{archiveCourse.title}</span>?</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setArchiveCourse(null)}>Cancel</Button>
              <Button type="button" variant="secondary" onClick={confirmArchive}>Archive</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(restoreCourse)} title="Restore Course?" onClose={() => setRestoreCourse(null)} width="max-w-md">
        {restoreCourse ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Are you sure you want to restore <span className="font-semibold text-slate-900">{restoreCourse.title}</span> to draft status?</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setRestoreCourse(null)}>Cancel</Button>
              <Button type="button" onClick={confirmRestore}>Restore</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(deleteCourse)} title="Delete Course?" onClose={() => setDeleteCourse(null)} width="max-w-md">
        {deleteCourse ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">This will remove the course from the current demo dataset.</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDeleteCourse(null)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDelete}>Delete Course</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>
    </div>
  );
}
