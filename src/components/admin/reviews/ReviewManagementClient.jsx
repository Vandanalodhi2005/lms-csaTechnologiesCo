"use client";

import * as React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button.jsx";
import Badge from "@/components/ui/Badge.jsx";
import { cn } from "@/utils";
import { adminReviews } from "@/constants/adminReviews.js";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Flag,
  MessageSquareText,
  MoreHorizontal,
  Search,
  ShieldAlert,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

const PAGE_SIZE = 10;
const REVIEW_TABS = [
  { key: "all", label: "All Reviews" },
  { key: "published", label: "Published" },
  { key: "pending", label: "Pending" },
  { key: "reported", label: "Reported" },
  { key: "hidden", label: "Hidden" },
  { key: "rejected", label: "Rejected" },
];

const RATING_OPTIONS = [
  { value: "all", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "pending", label: "Pending" },
  { value: "reported", label: "Reported" },
  { value: "hidden", label: "Hidden" },
  { value: "rejected", label: "Rejected" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "course", label: "Course Review" },
  { value: "instructor", label: "Instructor Review" },
];

const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "month", label: "This Month" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "rating-high", label: "Highest Rating" },
  { value: "rating-low", label: "Lowest Rating" },
  { value: "helpful", label: "Most Helpful" },
];

const HIDE_REASONS = [
  "Inappropriate content",
  "Spam",
  "Duplicate",
  "Off-topic",
  "Other",
];

const REJECTION_REASONS = [
  "Spam",
  "Offensive Content",
  "Irrelevant",
  "Fake Review",
  "Duplicate",
  "Policy Violation",
  "Other",
];

const REPORT_REASONS = [
  "Offensive content",
  "Spam",
  "Misleading",
  "Personal information",
  "Other",
];

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatFullDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function clampText(text, max = 120) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function getDateValue(dateString) {
  const date = new Date(`${dateString || "1970-01-01"}T00:00:00`);
  const time = date.getTime();
  return Number.isNaN(time) ? 0 : time;
}

function getReviewSummary(reviews) {
  const total = reviews.length;
  const average = total
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / total).toFixed(1)
    : "0.0";
  const pending = reviews.filter((review) => review.status === "pending").length;
  const reported = reviews.filter((review) => review.status === "reported" || review.reportCount > 0).length;
  return { total, average, pending, reported };
}

function getRatingDistribution(reviews) {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    if (dist[review.rating] !== undefined) dist[review.rating] += 1;
  });
  const total = reviews.length || 1;
  return {
    5: Math.round((dist[5] / total) * 100),
    4: Math.round((dist[4] / total) * 100),
    3: Math.round((dist[3] / total) * 100),
    2: Math.round((dist[2] / total) * 100),
    1: Math.round((dist[1] / total) * 100),
  };
}

function ReviewStatusBadge({ status }) {
  const map = {
    published: { variant: "success", label: "Published" },
    pending: { variant: "warning", label: "Pending" },
    reported: { variant: "danger", label: "Reported" },
    hidden: { variant: "secondary", label: "Hidden" },
    rejected: { variant: "danger", label: "Rejected" },
  };
  const item = map[status] || { variant: "secondary", label: "Unknown" };

  return (
    <Badge variant={item.variant} size="sm" className="capitalize">
      {item.label}
    </Badge>
  );
}

function ReviewRating({ value, showValue = true }) {
  const filledCount = Math.floor(value);
  const hasHalf = value - filledCount >= 0.5;
  const stars = Array.from({ length: 5 }, (_, index) => {
    if (index < filledCount) return "★";
    if (index === filledCount && hasHalf) return "½";
    return "☆";
  }).join("");

  return (
    <span className="inline-flex items-center gap-2" aria-label={`Rated ${value} out of 5 stars`}>
      <span className="text-base tracking-[0.14em] text-amber-500">{stars}</span>
      {showValue ? <span className="text-sm font-semibold text-slate-800">{Number(value).toFixed(1)}</span> : null}
    </span>
  );
}

function SummaryCard({ title, value, detail, tone, icon: Icon }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
        </div>
        <div
          className={cn(
            "rounded-xl p-2.5",
            tone === "primary" && "bg-primary-50 text-primary-600",
            tone === "success" && "bg-emerald-50 text-emerald-600",
            tone === "warning" && "bg-amber-50 text-amber-600",
            tone === "danger" && "bg-red-50 text-red-600",
            tone === "secondary" && "bg-slate-100 text-slate-700"
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">{detail}</p>
    </article>
  );
}

function RatingOverview({ reviews }) {
  const distribution = getRatingDistribution(reviews);
  const average = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Rating overview</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Customer Rating Distribution</h2>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="grid grid-cols-[52px_1fr_42px] items-center gap-3 text-sm text-slate-700">
              <span className="font-medium">{star} Stars</span>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200" aria-label={`${star} star reviews: ${distribution[star]}%`}>
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${distribution[star]}%` }} />
              </div>
              <span className="text-right font-medium text-slate-600">{distribution[star]}%</span>
            </div>
          ))}
        </div>

        <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Average Rating</p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-4xl font-black tracking-tight text-slate-900">{average}</span>
            <span className="pb-1 text-base text-slate-500">/ 5</span>
          </div>
          <div className="mt-4">
            <ReviewRating value={Number(average)} showValue={false} />
          </div>
          <p className="mt-4 text-sm text-slate-600">Total Ratings: {formatNumber(reviews.length)}</p>
        </div>
      </div>
    </section>
  );
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
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ReviewTable({ reviews, onView, onApprove, onHide, onReject, onReport, onDelete, openMenuId, setOpenMenuId }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            <th className="px-4 py-3">Review ID</th>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Instructor</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Review</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Reports</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id} className="border-t border-slate-200 align-middle text-sm text-slate-700">
              <td className="px-4 py-4 font-medium text-slate-900">{review.reviewId}</td>
              <td className="px-4 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{review.studentName}</p>
                  <p className="truncate text-xs text-slate-500">{review.studentEmail}</p>
                </div>
              </td>
              <td className="px-4 py-4 text-slate-700">{review.courseName}</td>
              <td className="px-4 py-4 text-slate-700">{review.instructorName}</td>
              <td className="px-4 py-4"><ReviewRating value={review.rating} /></td>
              <td className="px-4 py-4">
                <div className="max-w-[260px]">
                  <p className="line-clamp-2 text-slate-700">{clampText(review.review, 92)}</p>
                  <button type="button" onClick={() => onView(review)} className="mt-1 text-xs font-medium text-primary-600 hover:text-primary-700">View Full Review</button>
                </div>
              </td>
              <td className="px-4 py-4 text-slate-700">{formatDate(review.createdAt)}</td>
              <td className="px-4 py-4"><ReviewStatusBadge status={review.status} /></td>
              <td className="px-4 py-4 text-slate-700">{review.reportCount || 0} Reports</td>
              <td className="px-4 py-4">
                <div className="relative flex justify-end gap-2">
                  <button type="button" onClick={() => onView(review)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500" aria-label={`View ${review.reviewId}`}>
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => setOpenMenuId(openMenuId === review.id ? null : review.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500" aria-label={`Open actions for ${review.reviewId}`}>
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                  </button>
                  {openMenuId === review.id && (
                    <div role="menu" className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                      <button type="button" onClick={() => onView(review)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">View</button>
                      {review.status === "pending" && (
                        <button type="button" onClick={() => onApprove(review)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Approve</button>
                      )}
                      <button type="button" onClick={() => onHide(review)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Hide</button>
                      <button type="button" onClick={() => onReject(review)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Reject</button>
                      <button type="button" onClick={() => onReport(review)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Report Details</button>
                      <button type="button" onClick={() => onDelete(review)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">Delete</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReviewMobileCard({ review, onView, onApprove, onHide, onReject, onReport, onDelete, openMenuId, setOpenMenuId }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{review.reviewId}</p>
          <p className="mt-1 text-sm text-slate-600">{review.studentName}</p>
        </div>
        <div className="relative">
          <button type="button" onClick={() => setOpenMenuId(openMenuId === review.id ? null : review.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500" aria-label={`Open actions for ${review.reviewId}`}>
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
          {openMenuId === review.id && (
            <div role="menu" className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              <button type="button" onClick={() => onView(review)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">View</button>
              {review.status === "pending" && (
                <button type="button" onClick={() => onApprove(review)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Approve</button>
              )}
              <button type="button" onClick={() => onHide(review)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Hide</button>
              <button type="button" onClick={() => onReject(review)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Reject</button>
              <button type="button" onClick={() => onReport(review)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Report Details</button>
              <button type="button" onClick={() => onDelete(review)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">Delete</button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Course</span><span className="text-right font-medium text-slate-800">{review.courseName}</span></div>
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Rating</span><ReviewRating value={review.rating} showValue={true} /></div>
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Date</span><span>{formatDate(review.createdAt)}</span></div>
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Status</span><ReviewStatusBadge status={review.status} /></div>
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Reports</span><span>Reports: {review.reportCount || 0}</span></div>
      </div>

      <p className="mt-4 text-sm text-slate-700">{clampText(review.review, 105)}</p>

      <div className="mt-4 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => onView(review)}>View Review</Button>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, totalCount, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(start + PAGE_SIZE - 1, totalCount);

  return (
    <div className="flex flex-col gap-4 rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Showing <span className="font-semibold text-slate-900">{start}–{end}</span> of <span className="font-semibold text-slate-900">{formatNumber(totalCount)}</span> reviews
      </p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500",
                currentPage === page ? "bg-primary-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
              )}
            >
              {page}
            </button>
          );
        })}
        <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next page">
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Search className="h-6 w-6" aria-hidden="true" /></div>
      <h3 className="mt-5 text-xl font-bold text-slate-900">No reviews found</h3>
      <p className="mt-2 text-sm text-slate-600">Try adjusting your search or filters.</p>
      <div className="mt-5 flex justify-center"><Button type="button" variant="outline" onClick={onReset}>Reset Filters</Button></div>
    </div>
  );
}

export default function ReviewManagementClient() {
  const [reviews, setReviews] = React.useState(adminReviews);
  const [activeTab, setActiveTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [ratingFilter, setRatingFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [instructorFilter, setInstructorFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");
  const [page, setPage] = React.useState(1);
  const [selectedReview, setSelectedReview] = React.useState(null);
  const [approveReview, setApproveReview] = React.useState(null);
  const [hideReview, setHideReview] = React.useState(null);
  const [rejectReview, setRejectReview] = React.useState(null);
  const [reportReview, setReportReview] = React.useState(null);
  const [deleteReview, setDeleteReview] = React.useState(null);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [responseText, setResponseText] = React.useState("");
  const [hideReason, setHideReason] = React.useState(HIDE_REASONS[0]);
  const [rejectReason, setRejectReason] = React.useState(REJECTION_REASONS[0]);
  const [rejectNotes, setRejectNotes] = React.useState("");
  const [reportReason, setReportReason] = React.useState(REPORT_REASONS[0]);
  const [reportNotes, setReportNotes] = React.useState("");
  const [reportConfirm, setReportConfirm] = React.useState(false);
  const [rejectConfirm, setRejectConfirm] = React.useState(false);
  const [openMenuId, setOpenMenuId] = React.useState(null);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setStatusMessage(""), 2600);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  React.useEffect(() => {
    setOpenMenuId(null);
  }, [search, activeTab, ratingFilter, statusFilter, courseFilter, instructorFilter, dateFilter, typeFilter, sortBy, page]);

  React.useEffect(() => {
    setPage(1);
  }, [search, activeTab, ratingFilter, statusFilter, courseFilter, instructorFilter, dateFilter, typeFilter]);

  React.useEffect(() => {
    const handleClick = (event) => {
      if (!event.target.closest('[role="menu"]') && !event.target.closest('[aria-label*="Open actions"]')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const courseOptions = React.useMemo(
    () => [...new Map(reviews.map((review) => [review.courseName, review.courseName])).values()],
    [reviews]
  );

  const instructorOptions = React.useMemo(
    () => [...new Map(reviews.map((review) => [review.instructorName, review.instructorName])).values()],
    [reviews]
  );

  const filteredReviews = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    let result = [...reviews];

    if (activeTab !== "all") {
      result = result.filter((review) => review.status === activeTab);
    }

    if (ratingFilter !== "all") {
      result = result.filter((review) => String(review.rating) === String(ratingFilter));
    }

    if (statusFilter !== "all") {
      result = result.filter((review) => review.status === statusFilter);
    }

    if (courseFilter !== "all") {
      result = result.filter((review) => review.courseName === courseFilter);
    }

    if (instructorFilter !== "all") {
      result = result.filter((review) => review.instructorName === instructorFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((review) => review.reviewType === typeFilter);
    }

    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter((review) => {
        const reviewDate = new Date(`${review.createdAt}T00:00:00`);
        const diffDays = (now - reviewDate) / (1000 * 60 * 60 * 24);
        if (dateFilter === "today") return diffDays < 1;
        if (dateFilter === "7") return diffDays <= 7;
        if (dateFilter === "30") return diffDays <= 30;
        if (dateFilter === "month") {
          return reviewDate.getMonth() === now.getMonth() && reviewDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    if (term) {
      result = result.filter((review) => {
        const haystack = [
          review.reviewId,
          review.studentName,
          review.studentEmail,
          review.courseName,
          review.instructorName,
          review.review,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      });
    }

    switch (sortBy) {
      case "oldest":
        result.sort((a, b) => getDateValue(a.createdAt) - getDateValue(b.createdAt));
        break;
      case "rating-high":
        result.sort((a, b) => b.rating - a.rating || b.helpfulVotes - a.helpfulVotes);
        break;
      case "rating-low":
        result.sort((a, b) => a.rating - b.rating || a.helpfulVotes - b.helpfulVotes);
        break;
      case "helpful":
        result.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
        break;
      case "newest":
      default:
        result.sort((a, b) => getDateValue(b.createdAt) - getDateValue(a.createdAt));
        break;
    }

    return result;
  }, [reviews, search, activeTab, ratingFilter, statusFilter, courseFilter, instructorFilter, dateFilter, typeFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedReviews = filteredReviews.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  React.useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [safePage, page]);

  const stats = React.useMemo(() => getReviewSummary(reviews), [reviews]);
  const averageRating = stats.average;

  const resetFilters = () => {
    setSearch("");
    setActiveTab("all");
    setRatingFilter("all");
    setStatusFilter("all");
    setCourseFilter("all");
    setInstructorFilter("all");
    setDateFilter("all");
    setTypeFilter("all");
    setSortBy("newest");
    setPage(1);
  };

  const exportReviews = () => {
    const rows = [
      ["Review ID", "Student", "Course", "Instructor", "Rating", "Status", "Reports", "Date"],
      ...filteredReviews.map((review) => [review.reviewId, review.studentName, review.courseName, review.instructorName, review.rating, review.status, review.reportCount, review.createdAt]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "admin-reviews.csv";
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Reviews exported in CSV format.");
  };

  const handleApproveReview = () => {
    if (!approveReview) return;
    setReviews((current) =>
      current.map((review) =>
        review.id === approveReview.id
          ? { ...review, status: "published", moderationReason: null, reviewedBy: "admin-demo", reviewedAt: new Date().toISOString().slice(0, 10) }
          : review
      )
    );
    setApproveReview(null);
    setStatusMessage("Review approved in the demo environment.");
  };

  const handleHideReview = () => {
    if (!hideReview) return;
    setReviews((current) =>
      current.map((review) =>
        review.id === hideReview.id
          ? { ...review, status: "hidden", moderationReason: hideReason, reviewedBy: "admin-demo", reviewedAt: new Date().toISOString().slice(0, 10) }
          : review
      )
    );
    setHideReview(null);
    setHideReason(HIDE_REASONS[0]);
    setStatusMessage("Review hidden in the demo environment.");
  };

  const handleRejectReview = () => {
    if (!rejectReview) return;
    if (!rejectReason.trim()) return;
    setReviews((current) =>
      current.map((review) =>
        review.id === rejectReview.id
          ? { ...review, status: "rejected", moderationReason: rejectReason, reviewedBy: "admin-demo", reviewedAt: new Date().toISOString().slice(0, 10) }
          : review
      )
    );
    setRejectReview(null);
    setRejectReason(REJECTION_REASONS[0]);
    setRejectNotes("");
    setRejectConfirm(false);
    setStatusMessage("Review rejected in the demo environment.");
  };

  const handleReportReview = () => {
    if (!reportReview) return;
    setReviews((current) =>
      current.map((review) =>
        review.id === reportReview.id
          ? { ...review, status: "reported", reportCount: (review.reportCount || 0) + 1, moderationReason: reportReason, reviewedBy: "admin-demo", reviewedAt: new Date().toISOString().slice(0, 10) }
          : review
      )
    );
    setReportReview(null);
    setReportReason(REPORT_REASONS[0]);
    setReportNotes("");
    setReportConfirm(false);
    setStatusMessage("Review marked as reported in the demo environment.");
  };

  const handleDeleteReview = () => {
    if (!deleteReview) return;
    setReviews((current) => current.filter((review) => review.id !== deleteReview.id));
    setDeleteReview(null);
    setStatusMessage("Review deleted from the demo environment.");
  };

  const handleSaveResponse = () => {
    if (!selectedReview) return;
    const trimmed = responseText.trim();
    if (!trimmed) return;
    setReviews((current) =>
      current.map((review) =>
        review.id === selectedReview.id
          ? { ...review, instructorResponse: trimmed, updatedAt: new Date().toISOString().slice(0, 10) }
          : review
      )
    );
    setSelectedReview((current) => (current ? { ...current, instructorResponse: trimmed, updatedAt: new Date().toISOString().slice(0, 10) } : current));
    setResponseText("");
    setStatusMessage("Instructor response saved in the demo environment.");
  };

  const summaryCards = [
    { title: "Total Reviews", value: formatNumber(stats.total), detail: "+14.5% this month", tone: "primary", icon: Award },
    { title: "Average Rating", value: `${averageRating} / 5`, detail: "Based on published reviews", tone: "success", icon: Star },
    { title: "Pending Review", value: formatNumber(stats.pending), detail: "Requires moderation", tone: "warning", icon: AlertTriangle },
    { title: "Reported Reviews", value: formatNumber(stats.reported), detail: "Needs attention", tone: "danger", icon: Flag },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/admin/dashboard" className="hover:text-primary-600">Admin</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-slate-900">Reviews</span>
        </nav>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Reviews</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Review Management</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">Review and manage student feedback, course ratings, instructor feedback, reported reviews, and moderation status.</p>
          </div>

          <Button type="button" variant="outline" onClick={exportReviews} leftIcon={<Download className="h-4 w-4" aria-hidden="true" />}>
            Export Reviews
          </Button>
        </div>
      </div>

      {statusMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm" role="status" aria-live="polite">
          {statusMessage}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} title={card.title} value={card.value} detail={card.detail} tone={card.tone} icon={card.icon} />
        ))}
      </section>

      <RatingOverview reviews={reviews} />

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
            <div className="flex-1">
              <label htmlFor="review-search" className="mb-2 block text-sm font-medium text-slate-700">Search reviews</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="review-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by student, course, instructor, or review..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                />
              </div>
            </div>

            <Button type="button" variant="outline" onClick={resetFilters} leftIcon={<Filter className="h-4 w-4" aria-hidden="true" />}>
              Reset Filters
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            <div>
              <label htmlFor="ratingFilter" className="mb-2 block text-sm font-medium text-slate-700">Rating</label>
              <div className="relative">
                <select id="ratingFilter" value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {RATING_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>

            <div>
              <label htmlFor="statusFilter" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <div className="relative">
                <select id="statusFilter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>

            <div>
              <label htmlFor="courseFilter" className="mb-2 block text-sm font-medium text-slate-700">Course</label>
              <div className="relative">
                <select id="courseFilter" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  <option value="all">All Courses</option>
                  {courseOptions.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>

            <div>
              <label htmlFor="instructorFilter" className="mb-2 block text-sm font-medium text-slate-700">Instructor</label>
              <div className="relative">
                <select id="instructorFilter" value={instructorFilter} onChange={(event) => setInstructorFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  <option value="all">All Instructors</option>
                  {instructorOptions.map((instructor) => (
                    <option key={instructor} value={instructor}>{instructor}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>

            <div>
              <label htmlFor="dateFilter" className="mb-2 block text-sm font-medium text-slate-700">Date</label>
              <div className="relative">
                <select id="dateFilter" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {DATE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>

            <div>
              <label htmlFor="typeFilter" className="mb-2 block text-sm font-medium text-slate-700">Review Type</label>
              <div className="relative">
                <select id="typeFilter" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="min-w-[220px]">
              <label htmlFor="sortBy" className="mb-2 block text-sm font-medium text-slate-700">Sort</label>
              <div className="relative">
                <select id="sortBy" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 border-b border-slate-200">
          <nav aria-label="Review tabs" className="flex flex-wrap gap-2 pt-2">
            {REVIEW_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                aria-pressed={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                  activeTab === tab.key ? "bg-primary-50 text-primary-700 ring-1 ring-primary-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <section className="space-y-4">
        {filteredReviews.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <>
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <ReviewTable
                reviews={paginatedReviews}
                onView={setSelectedReview}
                onApprove={setApproveReview}
                onHide={setHideReview}
                onReject={setRejectReview}
                onReport={setReportReview}
                onDelete={setDeleteReview}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
              />

              {paginatedReviews.map((review) => (
                <ReviewMobileCard
                  key={review.id}
                  review={review}
                  onView={setSelectedReview}
                  onApprove={setApproveReview}
                  onHide={setHideReview}
                  onReject={setRejectReview}
                  onReport={setReportReview}
                  onDelete={setDeleteReview}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                />
              ))}
            </div>

            <Pagination currentPage={safePage} totalPages={totalPages} totalCount={filteredReviews.length} onPageChange={setPage} />
          </>
        )}
      </section>

      <ModalShell open={Boolean(selectedReview)} title="Review Details" onClose={() => setSelectedReview(null)} width="max-w-5xl">
        {selectedReview && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Review</p>
                <h4 className="mt-2 text-2xl font-bold text-slate-900">{selectedReview.reviewId}</h4>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ReviewStatusBadge status={selectedReview.status} />
                <ReviewRating value={selectedReview.rating} showValue={true} />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-4 text-lg font-semibold text-slate-900">Review Information</h5>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Review ID</dt><dd className="font-medium text-slate-900">{selectedReview.reviewId}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Rating</dt><dd className="font-medium text-slate-900"><ReviewRating value={selectedReview.rating} /></dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Review type</dt><dd className="font-medium text-slate-900">{selectedReview.reviewType === "course" ? "Course Review" : "Instructor Review"}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Status</dt><dd className="font-medium text-slate-900"><ReviewStatusBadge status={selectedReview.status} /></dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Created</dt><dd className="font-medium text-slate-900">{formatFullDate(selectedReview.createdAt)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Updated</dt><dd className="font-medium text-slate-900">{formatFullDate(selectedReview.updatedAt)}</dd></div>
                </dl>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-4 text-lg font-semibold text-slate-900">Student</h5>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Name</dt><dd className="font-medium text-slate-900">{selectedReview.studentName}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-900">{selectedReview.studentEmail}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Student ID</dt><dd className="font-medium text-slate-900">{selectedReview.studentId}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Enrollment ID</dt><dd className="font-medium text-slate-900">{selectedReview.enrollmentId}</dd></div>
                </dl>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-4 text-lg font-semibold text-slate-900">Course</h5>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Course</dt><dd className="font-medium text-slate-900">{selectedReview.courseName}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Course ID</dt><dd className="font-medium text-slate-900">{selectedReview.courseId}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Instructor</dt><dd className="font-medium text-slate-900">{selectedReview.instructorName}</dd></div>
                </dl>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-4 text-lg font-semibold text-slate-900">Helpful Information</h5>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Helpful votes</dt><dd className="font-medium text-slate-900">{selectedReview.helpfulVotes}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Not helpful votes</dt><dd className="font-medium text-slate-900">{selectedReview.notHelpfulVotes}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Report count</dt><dd className="font-medium text-slate-900">{selectedReview.reportCount}</dd></div>
                </dl>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h5 className="mb-4 text-lg font-semibold text-slate-900">Review</h5>
              <p className="text-sm leading-7 text-slate-700">{selectedReview.review}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h5 className="mb-4 text-lg font-semibold text-slate-900">Moderation</h5>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Current status</dt><dd className="font-medium text-slate-900"><ReviewStatusBadge status={selectedReview.status} /></dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Moderation reason</dt><dd className="font-medium text-slate-900">{selectedReview.moderationReason || "—"}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Reviewed by</dt><dd className="font-medium text-slate-900">{selectedReview.reviewedBy || "—"}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Reviewed date</dt><dd className="font-medium text-slate-900">{selectedReview.reviewedAt ? formatFullDate(selectedReview.reviewedAt) : "—"}</dd></div>
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h5 className="mb-4 text-lg font-semibold text-slate-900">Course Rating Summary</h5>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between"><span>Course</span><span className="font-medium text-slate-900">{selectedReview.courseName}</span></div>
                <div className="flex items-center justify-between"><span>Average Rating</span><span className="font-medium text-slate-900">4.8</span></div>
                <div className="flex items-center justify-between"><span>Total Reviews</span><span className="font-medium text-slate-900">326</span></div>
                {[{label:"5 Stars", value:78},{label:"4 Stars", value:15},{label:"3 Stars", value:4},{label:"2 Stars", value:2},{label:"1 Star", value:1}].map((item) => (
                  <div key={item.label} className="grid grid-cols-[70px_1fr_40px] items-center gap-3">
                    <span>{item.label}</span>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: `${item.value}%` }} />
                    </div>
                    <span className="text-right font-medium text-slate-700">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h5 className="mb-4 text-lg font-semibold text-slate-900">Instructor Rating Summary</h5>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between"><span>Instructor</span><span className="font-medium text-slate-900">{selectedReview.instructorName}</span></div>
                <div className="flex items-center justify-between"><span>Average Instructor Rating</span><span className="font-medium text-slate-900">4.7</span></div>
                <div className="flex items-center justify-between"><span>Total Reviews</span><span className="font-medium text-slate-900">284</span></div>
                <div className="flex items-center justify-between"><span>Courses</span><span className="font-medium text-slate-900">12</span></div>
                <div className="flex justify-end"><Link href="/instructors" className="text-sm font-medium text-primary-600 hover:text-primary-700">View Instructor</Link></div>
              </div>
            </div>

            {selectedReview.reports && selectedReview.reports.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-4 text-lg font-semibold text-slate-900">Reports</h5>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">{selectedReview.reports.length} total reports</p>
                  {selectedReview.reports.map((report) => (
                    <div key={report.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                      <div className="flex items-center justify-between gap-3"><span className="font-medium text-slate-900">{report.reason}</span><Badge variant={report.status === "open" ? "warning" : "success"} size="sm">{report.status}</Badge></div>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span>{formatDate(report.reportedDate)}</span>
                        <span>{report.reporterType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h5 className="text-lg font-semibold text-slate-900">Instructor Response</h5>
                {selectedReview.instructorResponse ? null : <Button type="button" variant="outline" onClick={() => setResponseText("")}>Add Response</Button>}
              </div>
              {selectedReview.instructorResponse ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">{selectedReview.instructorResponse}</div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No response has been added.</p>
              )}

              <div className="mt-4 space-y-3">
                <textarea value={responseText} onChange={(event) => setResponseText(event.target.value)} rows={4} maxLength={500} placeholder="Write a response..." className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10" />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">{responseText.length} / 500</p>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setResponseText("")}>Cancel</Button>
                    <Button type="button" onClick={handleSaveResponse}>Save Response</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {selectedReview.status === "pending" && <Button type="button" onClick={() => setApproveReview(selectedReview)}>Approve</Button>}
              <Button type="button" variant="outline" onClick={() => setHideReview(selectedReview)}>Hide</Button>
              <Button type="button" variant="outline" onClick={() => setRejectReview(selectedReview)}>Reject</Button>
              <Button type="button" variant="secondary" onClick={() => setReportReview(selectedReview)}>Mark as Reported</Button>
              <Button type="button" variant="destructive" onClick={() => setDeleteReview(selectedReview)}>Delete</Button>
            </div>
          </div>
        )}
      </ModalShell>

      <ModalShell open={Boolean(approveReview)} title="Approve Review?" onClose={() => setApproveReview(null)} width="max-w-xl">
        {approveReview && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">This review will become visible as a published review in the demo environment.</p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Review</p>
              <p className="mt-2 font-semibold text-slate-900">{approveReview.reviewId}</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setApproveReview(null)}>Cancel</Button>
              <Button type="button" onClick={handleApproveReview}>Approve Review</Button>
            </div>
          </div>
        )}
      </ModalShell>

      <ModalShell open={Boolean(hideReview)} title="Hide Review?" onClose={() => setHideReview(null)} width="max-w-xl">
        {hideReview && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">This review will be hidden from the public review list in the demo environment.</p>
            <div>
              <label htmlFor="hide-reason" className="mb-2 block text-sm font-medium text-slate-700">Reason</label>
              <select id="hide-reason" value={hideReason} onChange={(event) => setHideReason(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {HIDE_REASONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setHideReview(null)}>Cancel</Button>
              <Button type="button" variant="secondary" onClick={handleHideReview}>Hide Review</Button>
            </div>
          </div>
        )}
      </ModalShell>

      <ModalShell open={Boolean(rejectReview)} title="Reject Review" onClose={() => setRejectReview(null)} width="max-w-xl">
        {rejectReview && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Reject this review and record the moderation reason.</p>
            <div>
              <label htmlFor="rejectReason" className="mb-2 block text-sm font-medium text-slate-700">Reason</label>
              <select id="rejectReason" value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {REJECTION_REASONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rejectNotes" className="mb-2 block text-sm font-medium text-slate-700">Admin Notes</label>
              <textarea id="rejectNotes" value={rejectNotes} onChange={(event) => setRejectNotes(event.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Optional internal notes" />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setRejectReview(null)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleRejectReview} disabled={!rejectReason}>Reject Review</Button>
            </div>
          </div>
        )}
      </ModalShell>

      <ModalShell open={Boolean(reportReview)} title="Report Review" onClose={() => setReportReview(null)} width="max-w-xl">
        {reportReview && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Flag this review for moderation and track the report in the demo environment.</p>
            <div>
              <label htmlFor="reportReason" className="mb-2 block text-sm font-medium text-slate-700">Reason</label>
              <select id="reportReason" value={reportReason} onChange={(event) => setReportReason(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {REPORT_REASONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="reportNotes" className="mb-2 block text-sm font-medium text-slate-700">Notes</label>
              <textarea id="reportNotes" value={reportNotes} onChange={(event) => setReportNotes(event.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Optional notes" />
            </div>
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <input type="checkbox" checked={reportConfirm} onChange={(event) => setReportConfirm(event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <span>I understand this action only updates the demo environment.</span>
            </label>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setReportReview(null)}>Cancel</Button>
              <Button type="button" variant="secondary" onClick={handleReportReview} disabled={!reportConfirm}>Submit Report</Button>
            </div>
          </div>
        )}
      </ModalShell>

      <ModalShell open={Boolean(deleteReview)} title="Delete Review?" onClose={() => setDeleteReview(null)} width="max-w-md">
        {deleteReview && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">This removes the review from the current demo data only.</p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Review</p>
              <p className="mt-2 font-semibold text-slate-900">{deleteReview.reviewId}</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDeleteReview(null)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDeleteReview}>Delete Review</Button>
            </div>
          </div>
        )}
      </ModalShell>
    </div>
  );
}
