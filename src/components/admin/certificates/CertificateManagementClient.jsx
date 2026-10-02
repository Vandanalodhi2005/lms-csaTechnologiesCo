"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/utils";
import Button from "@/components/ui/Button.jsx";
import Badge from "@/components/ui/Badge.jsx";
import { adminCertificates } from "@/constants/adminCertificates.js";
import {
  AlertTriangle,
  Award,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Printer,
  Search,
  ShieldCheck,
  ShieldX,
  Trash2,
  User2,
  X,
} from "lucide-react";

const PAGE_SIZE = 10;
const TAB_OPTIONS = [
  { key: "all", label: "All" },
  { key: "issued", label: "Issued" },
  { key: "pending", label: "Pending" },
  { key: "revoked", label: "Revoked" },
  { key: "expired", label: "Expired" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "issued", label: "Issued" },
  { value: "pending", label: "Pending" },
  { value: "revoked", label: "Revoked" },
  { value: "expired", label: "Expired" },
];

const CERTIFICATE_TYPES = [
  "Course Completion",
  "Achievement",
  "Professional Certificate",
];

const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "month", label: "This Month" },
];

const SCORE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "below-50", label: "Below 50%" },
  { value: "50-70", label: "50–70%" },
  { value: "70-90", label: "70–90%" },
  { value: "90-plus", label: "90%+" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "student", label: "Student Name" },
  { value: "course", label: "Course Name" },
  { value: "score", label: "Highest Score" },
];

const REVOKE_REASONS = [
  "Incorrect information",
  "Duplicate certificate",
  "Academic issue",
  "Student request",
  "Administrative correction",
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

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value || 0));
}

function getDateTimeValue(dateString) {
  const date = new Date(`${dateString || "1970-01-01"}T00:00:00`);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function CertificateStatusBadge({ status }) {
  const map = {
    issued: { variant: "success", label: "Issued" },
    pending: { variant: "warning", label: "Pending" },
    revoked: { variant: "danger", label: "Revoked" },
    expired: { variant: "secondary", label: "Expired" },
  };

  const item = map[status] || { variant: "secondary", label: status };

  return (
    <Badge variant={item.variant} size="sm" className="capitalize">
      {item.label}
    </Badge>
  );
}

function VerificationBadge({ value }) {
  const map = {
    verified: { variant: "success", label: "Verified" },
    unverified: { variant: "warning", label: "Unverified" },
    pending: { variant: "warning", label: "Pending" },
    revoked: { variant: "danger", label: "Revoked" },
  };

  const item = map[value] || { variant: "secondary", label: value };

  return (
    <Badge variant={item.variant} size="sm" className="capitalize">
      {item.label}
    </Badge>
  );
}

function StatCard({ title, value, detail, tone, icon: Icon }) {
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

function CertificateOverview({ certificates }) {
  const metrics = [
    { label: "Issued", value: certificates.filter((certificate) => certificate.status === "issued").length },
    { label: "Pending", value: certificates.filter((certificate) => certificate.status === "pending").length },
    { label: "Revoked", value: certificates.filter((certificate) => certificate.status === "revoked").length },
    { label: "Expired", value: certificates.filter((certificate) => certificate.status === "expired").length },
  ];

  const maxValue = Math.max(...metrics.map((item) => item.value), 1);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Certificate overview</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Certificate activity</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-600">{metric.label}</span>
              <span className="text-lg font-bold text-slate-900">{metric.value}</span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className={cn(
                  "h-full rounded-full",
                  metric.label === "Issued" && "bg-emerald-500",
                  metric.label === "Pending" && "bg-amber-500",
                  metric.label === "Revoked" && "bg-red-500",
                  metric.label === "Expired" && "bg-slate-500"
                )}
                style={{ width: `${(metric.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ModalShell({ open, title, onClose, children, width = "max-w-2xl" }) {
  React.useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <div
        className={cn("w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6", width)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 id="modal-title" className="text-xl font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
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

function CertificateTable({ certificates, onView, onVerify, onViewStudent, onViewCourse, onRevoke, onDelete, openActionId, setOpenActionId }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            <th className="px-4 py-3">Certificate ID</th>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Instructor</th>
            <th className="px-4 py-3">Issue Date</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Verification</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((certificate) => (
            <tr key={certificate.id} className="border-t border-slate-200 align-middle text-sm text-slate-700">
              <td className="px-4 py-4 font-medium text-slate-900">{certificate.certificateId}</td>
              <td className="px-4 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{certificate.studentName}</p>
                  <p className="truncate text-xs text-slate-500">{certificate.studentEmail}</p>
                </div>
              </td>
              <td className="px-4 py-4 text-slate-700">{certificate.courseName}</td>
              <td className="px-4 py-4 text-slate-700">{certificate.instructorName}</td>
              <td className="px-4 py-4 text-slate-700">{formatDate(certificate.issueDate)}</td>
              <td className="px-4 py-4 font-semibold text-slate-900">{certificate.score}%</td>
              <td className="px-4 py-4 text-slate-700">{certificate.certificateType}</td>
              <td className="px-4 py-4"><CertificateStatusBadge status={certificate.status} /></td>
              <td className="px-4 py-4"><VerificationBadge value={certificate.verificationStatus} /></td>
              <td className="px-4 py-4">
                <div className="relative flex justify-end gap-2">
                  <button type="button" aria-label={`View ${certificate.certificateId}`} onClick={() => onView(certificate)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" aria-label={`Open actions for ${certificate.certificateId}`} onClick={() => setOpenActionId(openActionId === certificate.id ? null : certificate.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                  </button>
                  {openActionId === certificate.id && (
                    <div role="menu" aria-label={`Actions for ${certificate.certificateId}`} className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                      <button type="button" onClick={() => onView(certificate)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">View</button>
                      <button type="button" onClick={() => onVerify(certificate)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Verify</button>
                      <button type="button" onClick={() => onViewStudent(certificate)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">View Student</button>
                      <button type="button" onClick={() => onViewCourse(certificate)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">View Course</button>
                      <button type="button" onClick={() => onRevoke(certificate)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Revoke</button>
                      <button type="button" onClick={() => onDelete(certificate)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">Delete</button>
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

function CertificateMobileCard({ certificate, onView, onVerify, onViewStudent, onViewCourse, onRevoke, onDelete, openActionId, setOpenActionId }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{certificate.certificateId}</p>
          <p className="mt-1 text-sm text-slate-600">{certificate.studentName}</p>
        </div>
        <div className="relative">
          <button type="button" aria-label={`Open actions for ${certificate.certificateId}`} onClick={() => setOpenActionId(openActionId === certificate.id ? null : certificate.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
          {openActionId === certificate.id && (
            <div role="menu" aria-label={`Actions for ${certificate.certificateId}`} className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              <button type="button" onClick={() => onView(certificate)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">View</button>
              <button type="button" onClick={() => onVerify(certificate)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Verify</button>
              <button type="button" onClick={() => onViewStudent(certificate)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">View Student</button>
              <button type="button" onClick={() => onViewCourse(certificate)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">View Course</button>
              <button type="button" onClick={() => onRevoke(certificate)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Revoke</button>
              <button type="button" onClick={() => onDelete(certificate)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">Delete</button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Course</span><span className="text-right font-medium text-slate-800">{certificate.courseName}</span></div>
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Issue Date</span><span>{formatDate(certificate.issueDate)}</span></div>
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Score</span><span className="font-semibold text-slate-900">{certificate.score}%</span></div>
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Status</span><CertificateStatusBadge status={certificate.status} /></div>
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Verification</span><VerificationBadge value={certificate.verificationStatus} /></div>
      </div>

      <div className="mt-4">
        <Button type="button" variant="outline" className="w-full" onClick={() => onView(certificate)}>View Certificate</Button>
      </div>
    </div>
  );
}

function CertificatePagination({ currentPage, totalPages, totalCount, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(start + PAGE_SIZE - 1, totalCount);

  return (
    <div className="flex flex-col gap-4 rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Showing <span className="font-semibold text-slate-900">{start}–{end}</span> of <span className="font-semibold text-slate-900">{formatNumber(totalCount)}</span> certificates
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
              aria-label={`Go to page ${page}`}
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

function CertificateEmptyState({ onReset }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Search className="h-6 w-6" aria-hidden="true" /></div>
      <h3 className="mt-5 text-xl font-bold text-slate-900">No certificates found</h3>
      <p className="mt-2 text-sm text-slate-600">Try adjusting your search or filters.</p>
      <div className="mt-5 flex justify-center"><Button type="button" variant="outline" onClick={onReset}>Reset Filters</Button></div>
    </div>
  );
}

function CertificateManagementClient() {
  const [certificates, setCertificates] = React.useState(adminCertificates);
  const [search, setSearch] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [instructorFilter, setInstructorFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [scoreFilter, setScoreFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");
  const [page, setPage] = React.useState(1);
  const [selectedCertificate, setSelectedCertificate] = React.useState(null);
  const [previewCertificate, setPreviewCertificate] = React.useState(null);
  const [verificationCertificate, setVerificationCertificate] = React.useState(null);
  const [certificateToRevoke, setCertificateToRevoke] = React.useState(null);
  const [certificateToDelete, setCertificateToDelete] = React.useState(null);
  const [generateModalOpen, setGenerateModalOpen] = React.useState(false);
  const [openActionId, setOpenActionId] = React.useState(null);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [revokeReason, setRevokeReason] = React.useState(REVOKE_REASONS[0]);
  const [revokeNotes, setRevokeNotes] = React.useState("");
  const [revokeConfirmation, setRevokeConfirmation] = React.useState(false);
  const [generateForm, setGenerateForm] = React.useState({
    student: "",
    course: "",
    certificateType: "Course Completion",
    completionDate: "",
    score: "",
    instructor: "",
    issueDate: new Date().toISOString().slice(0, 10),
  });
  const [formErrors, setFormErrors] = React.useState({});

  React.useEffect(() => {
    setOpenActionId(null);
  }, [search, activeTab, statusFilter, courseFilter, instructorFilter, dateFilter, typeFilter, scoreFilter, sortBy, page]);

  React.useEffect(() => {
    setPage(1);
  }, [search, activeTab, statusFilter, courseFilter, instructorFilter, dateFilter, typeFilter, scoreFilter]);

  React.useEffect(() => {
    if (!statusMessage) return undefined;
    const timer = window.setTimeout(() => setStatusMessage(""), 2600);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  React.useEffect(() => {
    const onClick = (event) => {
      if (!event.target.closest("[role='menu']") && !event.target.closest('[aria-label*="Open actions"]')) {
        setOpenActionId(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const courseOptions = React.useMemo(
    () => [...new Map(certificates.map((certificate) => [certificate.courseName, certificate.courseName])).values()],
    [certificates]
  );

  const instructorOptions = React.useMemo(
    () => [...new Map(certificates.map((certificate) => [certificate.instructorName, certificate.instructorName])).values()],
    [certificates]
  );

  const filteredCertificates = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    let result = [...certificates];

    if (activeTab !== "all") {
      result = result.filter((certificate) => certificate.status === activeTab);
    }

    if (statusFilter !== "all") {
      result = result.filter((certificate) => certificate.status === statusFilter);
    }

    if (courseFilter !== "all") {
      result = result.filter((certificate) => certificate.courseName === courseFilter);
    }

    if (instructorFilter !== "all") {
      result = result.filter((certificate) => certificate.instructorName === instructorFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((certificate) => certificate.certificateType === typeFilter);
    }

    if (dateFilter !== "all") {
      const today = new Date();
      result = result.filter((certificate) => {
        const issueDate = new Date(`${certificate.issueDate}T00:00:00`);
        const diffDays = (today - issueDate) / (1000 * 60 * 60 * 24);
        if (dateFilter === "today") return diffDays === 0;
        if (dateFilter === "7") return diffDays <= 7;
        if (dateFilter === "30") return diffDays <= 30;
        if (dateFilter === "month") {
          return issueDate.getMonth() === today.getMonth() && issueDate.getFullYear() === today.getFullYear();
        }
        return true;
      });
    }

    if (scoreFilter !== "all") {
      result = result.filter((certificate) => {
        if (scoreFilter === "below-50") return certificate.score < 50;
        if (scoreFilter === "50-70") return certificate.score >= 50 && certificate.score <= 70;
        if (scoreFilter === "70-90") return certificate.score > 70 && certificate.score <= 90;
        if (scoreFilter === "90-plus") return certificate.score > 90;
        return true;
      });
    }

    if (term) {
      result = result.filter((certificate) => {
        const searchable = [
          certificate.certificateId,
          certificate.verificationCode,
          certificate.studentName,
          certificate.studentEmail,
          certificate.courseName,
        ]
          .join(" ")
          .toLowerCase();
        return searchable.includes(term);
      });
    }

    switch (sortBy) {
      case "oldest":
        result.sort((a, b) => getDateTimeValue(a.issueDate) - getDateTimeValue(b.issueDate));
        break;
      case "student":
        result.sort((a, b) => a.studentName.localeCompare(b.studentName));
        break;
      case "course":
        result.sort((a, b) => a.courseName.localeCompare(b.courseName));
        break;
      case "score":
        result.sort((a, b) => b.score - a.score);
        break;
      case "newest":
      default:
        result.sort((a, b) => getDateTimeValue(b.issueDate) - getDateTimeValue(a.issueDate));
        break;
    }

    return result;
  }, [certificates, search, activeTab, statusFilter, courseFilter, instructorFilter, dateFilter, typeFilter, scoreFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCertificates.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedCertificates = filteredCertificates.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  React.useEffect(() => {
    if (safePage !== page) {
      setPage(safePage);
    }
  }, [safePage, page]);

  const summary = React.useMemo(() => {
    const total = certificates.length;
    const issuedThisMonth = certificates.filter((certificate) => {
      if (!certificate.issueDate) return false;
      const d = new Date(`${certificate.issueDate}T00:00:00`);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const pending = certificates.filter((certificate) => certificate.status === "pending").length;
    const revoked = certificates.filter((certificate) => certificate.status === "revoked").length;
    return { total, issuedThisMonth, pending, revoked };
  }, [certificates]);

  const resetFilters = () => {
    setSearch("");
    setActiveTab("all");
    setStatusFilter("all");
    setCourseFilter("all");
    setInstructorFilter("all");
    setDateFilter("all");
    setTypeFilter("all");
    setScoreFilter("all");
    setSortBy("newest");
    setPage(1);
  };

  const exportCertificates = () => {
    const rows = [
      ["Certificate ID", "Student", "Student Email", "Course", "Instructor", "Issue Date", "Status", "Verification", "Score"],
      ...filteredCertificates.map((certificate) => [
        certificate.certificateId,
        certificate.studentName,
        certificate.studentEmail,
        certificate.courseName,
        certificate.instructorName,
        certificate.issueDate,
        certificate.status,
        certificate.verificationStatus,
        certificate.score,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "admin-certificates.csv";
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Certificates exported in CSV format.");
  };

  const handleGenerateSubmit = () => {
    const validation = {};
    if (!generateForm.student.trim()) validation.student = "Student is required.";
    if (!generateForm.course.trim()) validation.course = "Course is required.";
    if (!generateForm.certificateType) validation.certificateType = "Certificate type is required.";
    if (!generateForm.completionDate) validation.completionDate = "Completion date is required.";
    if (!generateForm.issueDate) validation.issueDate = "Issue date is required.";
    const scoreValue = Number(generateForm.score);
    if (Number.isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
      validation.score = "Score must be between 0 and 100.";
    }

    setFormErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const nextCertificate = {
      id: `cert-${String(certificates.length + 1).padStart(3, "0")}`,
      certificateId: `CERT-EDU-${String(Date.now()).slice(-5)}`,
      verificationCode: `VERIFY-${String(Date.now()).slice(-6)}`,
      verificationStatus: "verified",
      studentId: `stu-${String(certificates.length + 1).padStart(3, "0")}`,
      studentName: generateForm.student.trim(),
      studentEmail: `${toSlug(generateForm.student)}@example.com`,
      courseId: `course-${String(certificates.length + 1).padStart(3, "0")}`,
      courseName: generateForm.course.trim(),
      instructorId: `inst-${String(certificates.length + 1).padStart(3, "0")}`,
      instructorName: generateForm.instructor.trim() || "Assigned Instructor",
      certificateType: generateForm.certificateType,
      issueDate: generateForm.issueDate,
      completionDate: generateForm.completionDate,
      expiryDate: null,
      score: Number(scoreValue),
      completionPercentage: Math.min(100, Number(scoreValue)),
      lessonsCompleted: Math.max(1, Math.round(Number(scoreValue) / 2)),
      totalLessons: 30,
      quizScore: Math.min(100, Math.round(Number(scoreValue) + 4)),
      assignmentScore: Math.max(0, Math.round(Number(scoreValue) - 4)),
      status: "issued",
      issuedBy: "EduLearn Academy",
      certificateTitle: `${generateForm.course.trim()} ${generateForm.certificateType}`,
      courseStatus: "Completed",
      courseProgress: Math.min(100, Number(scoreValue)),
    };

    setCertificates((current) => [nextCertificate, ...current]);
    setGenerateModalOpen(false);
    setGenerateForm({
      student: "",
      course: "",
      certificateType: "Course Completion",
      completionDate: "",
      score: "",
      instructor: "",
      issueDate: new Date().toISOString().slice(0, 10),
    });
    setFormErrors({});
    setStatusMessage("Certificate generated in the demo environment.");
  };

  const handleRevokeCertificate = () => {
    if (!certificateToRevoke) return;
    setCertificates((current) =>
      current.map((certificate) =>
        certificate.id === certificateToRevoke.id
          ? {
              ...certificate,
              status: "revoked",
              verificationStatus: "revoked",
              issueDate: certificate.issueDate || new Date().toISOString().slice(0, 10),
            }
          : certificate
      )
    );
    setCertificateToRevoke(null);
    setRevokeReason(REVOKE_REASONS[0]);
    setRevokeNotes("");
    setRevokeConfirmation(false);
    setStatusMessage("Certificate marked as revoked in the demo environment.");
  };

  const handleDeleteCertificate = () => {
    if (!certificateToDelete) return;
    setCertificates((current) => current.filter((certificate) => certificate.id !== certificateToDelete.id));
    setCertificateToDelete(null);
    setStatusMessage("Certificate record deleted from the demo environment.");
  };

  const onViewStudent = (certificate) => {
    if (certificate?.studentId) {
      window.location.href = "/admin/students";
    }
  };

  const onViewCourse = (certificate) => {
    if (certificate?.courseName) {
      const slug = toSlug(certificate.courseName);
      window.location.href = `/courses/${slug}`;
    }
  };

  const onVerify = (certificate) => setVerificationCertificate(certificate);

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .certificate-print-preview,
          .certificate-print-preview * {
            visibility: visible !important;
          }
          .certificate-print-preview {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            overflow: visible !important;
          }
          [data-print-hide="true"] {
            display: none !important;
          }
        }
      `}</style>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6" data-print-hide="true">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/admin/dashboard" className="hover:text-primary-600">Admin</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-slate-900">Certificates</span>
        </nav>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Certificates</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Certificate Management</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">Manage course completion certificates, verification records, issued certificates, and certificate status.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="default" onClick={() => setGenerateModalOpen(true)} leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}>
              Generate Certificate
            </Button>
            <Button type="button" variant="outline" onClick={exportCertificates} leftIcon={<Download className="h-4 w-4" aria-hidden="true" />}>
              Export Certificates
            </Button>
          </div>
        </div>
      </div>

      {statusMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm" role="status" aria-live="polite">
          {statusMessage}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" data-print-hide="true">
        <StatCard title="Total Certificates" value={formatNumber(summary.total)} detail="+14.2% overall" tone="primary" icon={Award} />
        <StatCard title="Issued This Month" value={formatNumber(summary.issuedThisMonth)} detail="+18 this week" tone="success" icon={CheckCircle2} />
        <StatCard title="Pending Certificates" value={formatNumber(summary.pending)} detail="Requires review" tone="warning" icon={FileText} />
        <StatCard title="Revoked Certificates" value={formatNumber(summary.revoked)} detail="2 this month" tone="danger" icon={ShieldX} />
      </section>

      <CertificateOverview certificates={certificates} />

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5" data-print-hide="true">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600"><FileCheck2 className="h-4 w-4" aria-hidden="true" /><span className="text-sm font-medium">Certificate records</span></div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
            <div className="flex-1">
              <label htmlFor="certificate-search" className="mb-2 block text-sm font-medium text-slate-700">Search certificates</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="certificate-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by certificate ID, student, course..."
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
              <label htmlFor="dateFilter" className="mb-2 block text-sm font-medium text-slate-700">Issue Date</label>
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
              <label htmlFor="typeFilter" className="mb-2 block text-sm font-medium text-slate-700">Certificate Type</label>
              <div className="relative">
                <select id="typeFilter" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  <option value="all">All Types</option>
                  {CERTIFICATE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>

            <div>
              <label htmlFor="scoreFilter" className="mb-2 block text-sm font-medium text-slate-700">Score</label>
              <div className="relative">
                <select id="scoreFilter" value={scoreFilter} onChange={(event) => setScoreFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {SCORE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="min-w-[200px]">
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
          <nav aria-label="Certificate tabs" className="mt-4 flex flex-wrap gap-2">
            {TAB_OPTIONS.map((tab) => (
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
      </div>

      <section className="space-y-4" data-print-hide="true">
        {filteredCertificates.length === 0 ? (
          <CertificateEmptyState onReset={resetFilters} />
        ) : (
          <>
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <CertificateTable
                certificates={paginatedCertificates}
                onView={setSelectedCertificate}
                onVerify={onVerify}
                onViewStudent={onViewStudent}
                onViewCourse={onViewCourse}
                onRevoke={setCertificateToRevoke}
                onDelete={setCertificateToDelete}
                openActionId={openActionId}
                setOpenActionId={setOpenActionId}
              />

              {paginatedCertificates.map((certificate) => (
                <CertificateMobileCard
                  key={certificate.id}
                  certificate={certificate}
                  onView={setSelectedCertificate}
                  onVerify={onVerify}
                  onViewStudent={onViewStudent}
                  onViewCourse={onViewCourse}
                  onRevoke={setCertificateToRevoke}
                  onDelete={setCertificateToDelete}
                  openActionId={openActionId}
                  setOpenActionId={setOpenActionId}
                />
              ))}
            </div>

            <CertificatePagination currentPage={safePage} totalPages={totalPages} totalCount={filteredCertificates.length} onPageChange={setPage} />
          </>
        )}
      </section>

      <ModalShell open={Boolean(selectedCertificate)} title="Certificate Details" onClose={() => setSelectedCertificate(null)} width="max-w-5xl">
        {selectedCertificate && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Certificate</p>
                <h4 className="mt-2 text-2xl font-bold text-slate-900">{selectedCertificate.certificateId}</h4>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <CertificateStatusBadge status={selectedCertificate.status} />
                <VerificationBadge value={selectedCertificate.verificationStatus} />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-4 text-lg font-semibold text-slate-900">Certificate Information</h5>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Certificate ID</dt><dd className="font-medium text-slate-900">{selectedCertificate.certificateId}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Certificate Type</dt><dd className="font-medium text-slate-900">{selectedCertificate.certificateType}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Status</dt><dd className="font-medium text-slate-900"><CertificateStatusBadge status={selectedCertificate.status} /></dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Issue Date</dt><dd className="font-medium text-slate-900">{formatDate(selectedCertificate.issueDate)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Expiry Date</dt><dd className="font-medium text-slate-900">{selectedCertificate.expiryDate ? formatDate(selectedCertificate.expiryDate) : "Never"}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Verification Code</dt><dd className="font-medium text-slate-900">{selectedCertificate.verificationCode}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Verification Status</dt><dd className="font-medium text-slate-900"><VerificationBadge value={selectedCertificate.verificationStatus} /></dd></div>
                </dl>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-4 text-lg font-semibold text-slate-900">Student</h5>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Name</dt><dd className="font-medium text-slate-900">{selectedCertificate.studentName}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-900">{selectedCertificate.studentEmail}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Student ID</dt><dd className="font-medium text-slate-900">{selectedCertificate.studentId}</dd></div>
                </dl>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-4 text-lg font-semibold text-slate-900">Course</h5>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Course Name</dt><dd className="font-medium text-slate-900">{selectedCertificate.courseName}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Course ID</dt><dd className="font-medium text-slate-900">{selectedCertificate.courseId}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Instructor</dt><dd className="font-medium text-slate-900">{selectedCertificate.instructorName}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Completion Date</dt><dd className="font-medium text-slate-900">{formatDate(selectedCertificate.completionDate)}</dd></div>
                </dl>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-4 text-lg font-semibold text-slate-900">Performance</h5>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Final Score</dt><dd className="font-medium text-slate-900">{selectedCertificate.score}%</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Lessons Completed</dt><dd className="font-medium text-slate-900">{selectedCertificate.lessonsCompleted}/{selectedCertificate.totalLessons}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Quiz Score</dt><dd className="font-medium text-slate-900">{selectedCertificate.quizScore}%</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Assignment Score</dt><dd className="font-medium text-slate-900">{selectedCertificate.assignmentScore}%</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Completion Percentage</dt><dd className="font-medium text-slate-900">{selectedCertificate.completionPercentage}%</dd></div>
                </dl>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h5 className="mb-4 text-lg font-semibold text-slate-900">Certificate</h5>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Certificate Title</dt><dd className="font-medium text-slate-900">{selectedCertificate.certificateTitle}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Issued By</dt><dd className="font-medium text-slate-900">{selectedCertificate.issuedBy}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Certificate Number</dt><dd className="font-medium text-slate-900">{selectedCertificate.certificateId}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Verification URL</dt><dd className="font-medium text-slate-900">/verify/{selectedCertificate.certificateId}</dd></div>
              </dl>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setPreviewCertificate(selectedCertificate)}>View Certificate</Button>
              <Button type="button" variant="secondary" onClick={() => setVerificationCertificate(selectedCertificate)}>Verify</Button>
              <Button type="button" variant="destructive" onClick={() => setCertificateToRevoke(selectedCertificate)}>Revoke</Button>
              <Button type="button" variant="outline" onClick={() => setSelectedCertificate(null)}>Close</Button>
            </div>
          </div>
        )}
      </ModalShell>

      <ModalShell open={Boolean(previewCertificate)} title="Certificate Preview" onClose={() => setPreviewCertificate(null)} width="max-w-4xl">
        {previewCertificate && (
          <div className="space-y-6">
            <div className="certificate-print-preview rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="rounded-[28px] border-2 border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-5">
                  <div>
                    <p className="text-2xl font-black tracking-tight text-slate-900">EduLearn</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Certificate of Completion</p>
                  </div>
                  <div className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Verified</div>
                </div>

                <div className="pt-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">This certificate is presented to</p>
                  <h4 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">{previewCertificate.studentName}</h4>
                  <p className="mt-3 text-lg text-slate-600">for successfully completing</p>
                  <p className="mt-2 text-2xl font-bold text-primary-700">{previewCertificate.courseName}</p>
                  <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Instructor</p>
                      <p className="mt-2 font-semibold text-slate-900">{previewCertificate.instructorName}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Completed</p>
                      <p className="mt-2 font-semibold text-slate-900">{formatDate(previewCertificate.completionDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Certificate ID</p>
                    <p className="mt-2 font-medium text-slate-900">{previewCertificate.certificateId}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Verification Code</p>
                    <p className="mt-2 font-medium text-slate-900">{previewCertificate.verificationCode}</p>
                  </div>
                </div>

                <div className="mt-8 flex items-end justify-between gap-6 border-t border-slate-200 pt-5">
                  <div>
                    <div className="h-12 w-36 rounded border-b border-slate-300" aria-hidden="true" />
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">Authorized Signatory</p>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <p className="font-medium text-slate-900">{previewCertificate.issuedBy}</p>
                    <p>Certificate Issuer</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="button" variant="default" onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" aria-hidden="true" />}>
                Print Certificate
              </Button>
              <Button type="button" variant="outline" onClick={() => setPreviewCertificate(null)}>Close</Button>
            </div>
          </div>
        )}
      </ModalShell>

      <ModalShell open={Boolean(verificationCertificate)} title="Verify Certificate" onClose={() => setVerificationCertificate(null)} width="max-w-xl">
        {verificationCertificate && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-emerald-900">Verification status: Verified</p>
                  <p className="mt-1 text-sm text-emerald-800">This verification is based on demo data.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Certificate ID</p>
                <p className="mt-2 font-semibold text-slate-900">{verificationCertificate.certificateId}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Verification Code</p>
                <p className="mt-2 font-semibold text-slate-900">{verificationCertificate.verificationCode}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Course</p>
                <p className="mt-2 font-semibold text-slate-900">{verificationCertificate.courseName}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Student</p>
                <p className="mt-2 font-semibold text-slate-900">{verificationCertificate.studentName}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Issue Date</p>
                <p className="mt-2 font-semibold text-slate-900">{formatDate(verificationCertificate.issueDate)}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setVerificationCertificate(null)}>Close</Button>
            </div>
          </div>
        )}
      </ModalShell>

      <ModalShell open={Boolean(certificateToRevoke)} title="Revoke Certificate?" onClose={() => setCertificateToRevoke(null)} width="max-w-xl">
        {certificateToRevoke && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Revoking this certificate will mark it as invalid in the current demo environment.</p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Certificate</p>
              <p className="mt-2 font-semibold text-slate-900">{certificateToRevoke.certificateId}</p>
            </div>

            <div>
              <label htmlFor="revokeReason" className="mb-2 block text-sm font-medium text-slate-700">Reason</label>
              <select id="revokeReason" value={revokeReason} onChange={(event) => setRevokeReason(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {REVOKE_REASONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="revokeNotes" className="mb-2 block text-sm font-medium text-slate-700">Additional Notes</label>
              <textarea id="revokeNotes" value={revokeNotes} onChange={(event) => setRevokeNotes(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Optional additional notes" />
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <input type="checkbox" checked={revokeConfirmation} onChange={(event) => setRevokeConfirmation(event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <span>I understand this action is only for the current demo environment.</span>
            </label>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setCertificateToRevoke(null)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleRevokeCertificate} disabled={!revokeConfirmation}>Revoke Certificate</Button>
            </div>
          </div>
        )}
      </ModalShell>

      <ModalShell open={generateModalOpen} title="Generate Certificate" onClose={() => { setGenerateModalOpen(false); setFormErrors({}); }} width="max-w-2xl">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="generateStudent" className="mb-2 block text-sm font-medium text-slate-700">Student</label>
              <input id="generateStudent" value={generateForm.student} onChange={(event) => { setGenerateForm((current) => ({ ...current, student: event.target.value })); if (formErrors.student) setFormErrors((current) => ({ ...current, student: "" })); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Student name" />
              {formErrors.student ? <p className="mt-1 text-xs text-red-600">{formErrors.student}</p> : null}
            </div>

            <div>
              <label htmlFor="generateCourse" className="mb-2 block text-sm font-medium text-slate-700">Course</label>
              <input id="generateCourse" value={generateForm.course} onChange={(event) => { setGenerateForm((current) => ({ ...current, course: event.target.value })); if (formErrors.course) setFormErrors((current) => ({ ...current, course: "" })); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Course name" />
              {formErrors.course ? <p className="mt-1 text-xs text-red-600">{formErrors.course}</p> : null}
            </div>

            <div>
              <label htmlFor="generateType" className="mb-2 block text-sm font-medium text-slate-700">Certificate Type</label>
              <select id="generateType" value={generateForm.certificateType} onChange={(event) => { setGenerateForm((current) => ({ ...current, certificateType: event.target.value })); if (formErrors.certificateType) setFormErrors((current) => ({ ...current, certificateType: "" })); }} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {CERTIFICATE_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {formErrors.certificateType ? <p className="mt-1 text-xs text-red-600">{formErrors.certificateType}</p> : null}
            </div>

            <div>
              <label htmlFor="generateInstructor" className="mb-2 block text-sm font-medium text-slate-700">Instructor</label>
              <input id="generateInstructor" value={generateForm.instructor} onChange={(event) => setGenerateForm((current) => ({ ...current, instructor: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Instructor name" />
            </div>

            <div>
              <label htmlFor="generateCompletionDate" className="mb-2 block text-sm font-medium text-slate-700">Completion Date</label>
              <input id="generateCompletionDate" type="date" value={generateForm.completionDate} onChange={(event) => { setGenerateForm((current) => ({ ...current, completionDate: event.target.value })); if (formErrors.completionDate) setFormErrors((current) => ({ ...current, completionDate: "" })); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
              {formErrors.completionDate ? <p className="mt-1 text-xs text-red-600">{formErrors.completionDate}</p> : null}
            </div>

            <div>
              <label htmlFor="generateIssueDate" className="mb-2 block text-sm font-medium text-slate-700">Issue Date</label>
              <input id="generateIssueDate" type="date" value={generateForm.issueDate} onChange={(event) => { setGenerateForm((current) => ({ ...current, issueDate: event.target.value })); if (formErrors.issueDate) setFormErrors((current) => ({ ...current, issueDate: "" })); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
              {formErrors.issueDate ? <p className="mt-1 text-xs text-red-600">{formErrors.issueDate}</p> : null}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="generateScore" className="mb-2 block text-sm font-medium text-slate-700">Score</label>
              <input id="generateScore" type="number" min="0" max="100" value={generateForm.score} onChange={(event) => { setGenerateForm((current) => ({ ...current, score: event.target.value })); if (formErrors.score) setFormErrors((current) => ({ ...current, score: "" })); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="0 to 100" />
              {formErrors.score ? <p className="mt-1 text-xs text-red-600">{formErrors.score}</p> : null}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => { setGenerateModalOpen(false); setFormErrors({}); }}>Cancel</Button>
            <Button type="button" onClick={handleGenerateSubmit}>Generate Certificate</Button>
          </div>
        </div>
      </ModalShell>

      <ModalShell open={Boolean(certificateToDelete)} title="Delete Certificate Record?" onClose={() => setCertificateToDelete(null)} width="max-w-md">
        {certificateToDelete && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">This removes the certificate record from the current demo data only.</p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Certificate</p>
              <p className="mt-2 font-semibold text-slate-900">{certificateToDelete.certificateId}</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setCertificateToDelete(null)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDeleteCertificate}>Delete</Button>
            </div>
          </div>
        )}
      </ModalShell>
    </div>
  );
}

export default CertificateManagementClient;
