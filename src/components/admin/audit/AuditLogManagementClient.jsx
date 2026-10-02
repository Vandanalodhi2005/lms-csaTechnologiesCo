"use client";

import * as React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button.jsx";
import Badge from "@/components/ui/Badge.jsx";
import { cn } from "@/utils";
import { adminAuditLogs, auditActionLabels, auditActionTypeOptions, auditActorOptions, auditStatusOptions, auditTargetTypeOptions } from "@/constants/adminAuditLogs.js";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  Eye,
  FileText,
  Filter,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  X,
  RefreshCcw,
} from "lucide-react";

const tabs = [
  { id: "all", label: "All Activity" },
  { id: "adminActions", label: "Admin Actions" },
  { id: "userActivity", label: "User Activity" },
  { id: "courseActivity", label: "Course Activity" },
  { id: "security", label: "Security" },
  { id: "system", label: "System" },
];

const actionTypeOptions = [
  { value: "all", label: "All Actions" },
  { value: "created", label: "Created" },
  { value: "updated", label: "Updated" },
  { value: "deleted", label: "Deleted" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
  { value: "activated", label: "Activated" },
  { value: "published", label: "Published" },
  { value: "unpublished", label: "Unpublished" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
  { value: "viewed", label: "Viewed" },
  { value: "exported", label: "Exported" },
  { value: "settings_changed", label: "Settings Changed" },
  { value: "failed", label: "Failed" },
];

const actorFilterOptions = [
  { value: "all", label: "All Admins" },
  { value: "Super Admin", label: "Super Admin" },
  { value: "Admin", label: "Admin" },
  { value: "Moderator", label: "Moderator" },
];

const targetTypeOptions = [
  { value: "all", label: "All" },
  { value: "User", label: "User" },
  { value: "Student", label: "Student" },
  { value: "Instructor", label: "Instructor" },
  { value: "Course", label: "Course" },
  { value: "Category", label: "Category" },
  { value: "Enrollment", label: "Enrollment" },
  { value: "Payment", label: "Payment" },
  { value: "Certificate", label: "Certificate" },
  { value: "Review", label: "Review" },
  { value: "Notification", label: "Notification" },
  { value: "Settings", label: "Settings" },
  { value: "System", label: "System" },
];

const dateFilterOptions = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7", label: "Last 7 Days" },
  { value: "last30", label: "Last 30 Days" },
  { value: "custom", label: "Custom" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

const pageSize = 10;

const formatSelectionText = (value) => {
  if (!value) return "";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatAuditTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const formatAuditDateTime = (timestamp) => {
  const parsed = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(parsed);
};

const formatAuditLongDate = (timestamp) => {
  const parsed = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(parsed);
};

const formatStatusText = (status) => {
  if (status === "success") return "Success";
  if (status === "warning") return "Warning";
  if (status === "failed") return "Failed";
  return status;
};

const formatActionType = (type) => {
  return auditActionLabels[type] || formatSelectionText(type);
};

const isSameDay = (dateOne, dateTwo) => {
  const first = new Date(dateOne);
  const second = new Date(dateTwo);
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

const removeFromBlobUrl = (url) => {
  if (url) {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      // no-op
    }
  }
};

const escapeCsvValue = (value) => {
  const stringValue = String(value ?? "");
  const escapedValue = stringValue.replace(/"/g, '""');
  if (escapedValue.includes(",") || escapedValue.includes('"') || escapedValue.includes("\n") || escapedValue.includes("\r")) {
    return `"${escapedValue}"`;
  }
  return escapedValue;
};

const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "AD";

const matchesSearch = (log, term) => {
  if (!term) return true;
  const normalizedTerm = term.toLowerCase();
  const searchableText = [
    log.actor.name,
    log.actor.email,
    log.action,
    log.targetName,
    log.targetId,
    log.description,
    log.id,
    log.targetType,
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedTerm);
};

const matchesTab = (log, tab) => {
  if (tab === "all") return true;
  if (tab === "adminActions") {
    return [
      "created",
      "updated",
      "deleted",
      "approved",
      "rejected",
      "suspended",
      "activated",
      "published",
      "unpublished",
      "login",
      "logout",
      "viewed",
      "exported",
      "settings_changed",
      "failed",
    ].includes(log.actionType);
  }
  if (tab === "userActivity") {
    return ["User", "Student"].includes(log.targetType) || log.actor.role.includes("Admin");
  }
  if (tab === "courseActivity") {
    return ["Course", "Category", "Enrollment", "Certificate", "Review"].includes(log.targetType);
  }
  if (tab === "security") {
    return log.securityEvent || log.status === "failed";
  }
  if (tab === "system") {
    return log.targetType === "System" || log.actionType === "settings_changed";
  }
  return true;
};

const matchesDateRange = (timestamp, selectedDatePreset, customStart, customEnd) => {
  const date = new Date(timestamp);
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(dayStart);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastSeven = new Date(dayStart);
  lastSeven.setDate(lastSeven.getDate() - 6);
  const lastThirty = new Date(dayStart);
  lastThirty.setDate(lastThirty.getDate() - 29);

  if (selectedDatePreset === "today") return isSameDay(date, dayStart);
  if (selectedDatePreset === "yesterday") return isSameDay(date, yesterday);
  if (selectedDatePreset === "last7") return date >= lastSeven && date <= now;
  if (selectedDatePreset === "last30") return date >= lastThirty && date <= now;
  if (selectedDatePreset === "custom") {
    if (!customStart && !customEnd) return true;
    const startValue = customStart ? new Date(customStart) : null;
    const endValue = customEnd ? new Date(customEnd) : null;
    if (startValue && endValue && endValue < startValue) return false;
    if (startValue && date < startValue) return false;
    if (endValue) {
      const endBoundary = new Date(endValue);
      endBoundary.setHours(23, 59, 59, 999);
      if (date > endBoundary) return false;
    }
    return true;
  }
  return true;
};

function StatusBadge({ status }) {
  const config = {
    success: { variant: "success", label: "Success" },
    warning: { variant: "warning", label: "Warning" },
    failed: { variant: "danger", label: "Failed" },
  };
  const current = config[status] || { variant: "secondary", label: formatStatusText(status) };
  return <Badge variant={current.variant}>{current.label}</Badge>;
}

function SecurityBadge({ value }) {
  if (!value) {
    return <Badge variant="secondary">No</Badge>;
  }
  return <Badge variant="warning">Security</Badge>;
}

function ActionBadge({ type }) {
  const actionMap = {
    created: "default",
    updated: "info",
    deleted: "secondary",
    approved: "success",
    rejected: "warning",
    suspended: "warning",
    activated: "success",
    published: "success",
    unpublished: "secondary",
    login: "default",
    logout: "secondary",
    viewed: "info",
    exported: "default",
    settings_changed: "purple",
    failed: "danger",
  };
  const variant = actionMap[type] || "default";
  return <Badge variant={variant}>{formatActionType(type)}</Badge>;
}

function AuditLogDetailsModal({ log, open, onClose }) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !log) return null;

  const handleCopyEvent = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(log.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      } else {
        setCopied(false);
      }
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4">
      <div className="h-full w-full overflow-y-auto rounded-t-[28px] border border-slate-200 bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:w-full sm:max-w-2xl sm:rounded-[28px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Event Details</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{log.id}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close event details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Actor</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                  {log.actor.initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{log.actor.name}</p>
                  <p className="text-xs text-slate-500">{log.actor.role}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">{log.actor.email}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Status</p>
              <div className="mt-3 flex items-center gap-2">
                <StatusBadge status={log.status} />
                {log.securityEvent ? <Badge variant="warning">Security</Badge> : null}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Action</p>
              <p className="font-semibold text-slate-900">{log.action}</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Target Type</p>
              <p className="font-semibold text-slate-900">{log.targetType}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Target</p>
              <p className="font-semibold text-slate-900">{log.targetName}</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Target ID</p>
              <p className="font-semibold text-slate-900">{log.targetId}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Description</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{log.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Timestamp</p>
              <p className="font-medium text-slate-900">{formatAuditLongDate(log.timestamp)}</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">IP Address</p>
              <p className="font-medium text-slate-900">{log.ipAddress}</p>
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">User Agent</p>
            <p className="font-medium text-slate-900">{log.userAgent}</p>
          </div>

          {log.securityEvent ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-700" />
                <p className="text-sm font-semibold text-amber-800">Security Event</p>
                <Badge variant="warning">Yes</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-amber-800">Reason: {log.securityReason}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slate-600" />
                <p className="text-sm font-semibold text-slate-800">Security Event</p>
                <Badge variant="secondary">No</Badge>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Event Timeline</p>
            <div className="mt-4 space-y-3">
              <div className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Event Created</p>
                  <p className="text-xs text-slate-500">{log.actor.name} performed {log.action.toLowerCase()} on {log.targetName}.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Target Affected</p>
                  <p className="text-xs text-slate-500">{log.targetType} record {log.targetId} was impacted by this activity.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">System Recorded</p>
                  <p className="text-xs text-slate-500">Demo audit data captured at {formatAuditTimestamp(log.timestamp)}.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleCopyEvent} leftIcon={<Copy className="h-4 w-4" />}>
              {copied ? "Event ID copied." : "Copy Event ID"}
            </Button>
            <Button type="button" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuditLogManagementClient() {
  const [activeTab, setActiveTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [actionType, setActionType] = React.useState("all");
  const [actorFilter, setActorFilter] = React.useState("all");
  const [targetTypeFilter, setTargetTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("all");
  const [customStartDate, setCustomStartDate] = React.useState("");
  const [customEndDate, setCustomEndDate] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("newest");
  const [selectedLog, setSelectedLog] = React.useState(null);
  const [canLoadLogs, setCanLoadLogs] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dateError, setDateError] = React.useState("");

  const summaryCards = React.useMemo(() => {
    const totalEvents = adminAuditLogs.length;
    const todayEvents = adminAuditLogs.filter((log) => isSameDay(log.timestamp, new Date())).length;
    const adminActions = adminAuditLogs.filter((log) => ["Super Admin", "Admin"].includes(log.actor.role)).length;
    const securityEvents = adminAuditLogs.filter((log) => log.securityEvent).length;

    return [
      { key: "total", title: "Total Events", value: totalEvents.toLocaleString(), helper: "All recorded demo events", icon: Activity },
      { key: "today", title: "Today's Events", value: todayEvents.toLocaleString(), helper: "Events logged today", icon: Clock3 },
      { key: "admin", title: "Admin Actions", value: adminActions.toLocaleString(), helper: "Action records from admins", icon: UserRound },
      { key: "security", title: "Security Events", value: securityEvents.toLocaleString(), helper: "Detected security-related actions", icon: ShieldAlert },
    ];
  }, []);

  const activityOverview = React.useMemo(() => {
    const todayCount = adminAuditLogs.filter((log) => isSameDay(log.timestamp, new Date())).length;
    const weekCount = adminAuditLogs.filter((log) => {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 6);
      return new Date(log.timestamp) >= weekStart;
    }).length;
    const monthCount = adminAuditLogs.length;
    const maxValue = Math.max(todayCount, weekCount, monthCount, 1);

    return [
      { label: "Today", value: todayCount, percentage: (todayCount / maxValue) * 100 },
      { label: "This Week", value: weekCount, percentage: (weekCount / maxValue) * 100 },
      { label: "This Month", value: monthCount, percentage: (monthCount / maxValue) * 100 },
    ];
  }, []);

  const filteredLogs = React.useMemo(() => {
    let results = adminAuditLogs.filter((log) => matchesTab(log, activeTab));
    results = results.filter((log) => matchesSearch(log, search));
    results = results.filter((log) => (actionType === "all" ? true : log.actionType === actionType));
    results = results.filter((log) => (actorFilter === "all" ? true : log.actor.role === actorFilter));
    results = results.filter((log) => (targetTypeFilter === "all" ? true : log.targetType === targetTypeFilter));
    results = results.filter((log) => (statusFilter === "all" ? true : log.status === statusFilter));
    results = results.filter((log) => matchesDateRange(log.timestamp, dateFilter, customStartDate, customEndDate));

    results = results.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

    return results;
  }, [search, activeTab, actionType, actorFilter, targetTypeFilter, statusFilter, dateFilter, customStartDate, customEndDate, sortOrder]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab, actionType, actorFilter, targetTypeFilter, statusFilter, dateFilter, customStartDate, customEndDate, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const clearFilters = () => {
    setSearch("");
    setActionType("all");
    setActorFilter("all");
    setTargetTypeFilter("all");
    setStatusFilter("all");
    setDateFilter("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setSortOrder("newest");
    setDateError("");
    setCurrentPage(1);
  };

  const handleCustomDateChange = (startValue, endValue) => {
    setCustomStartDate(startValue);
    setCustomEndDate(endValue);

    if (startValue && endValue && new Date(endValue) < new Date(startValue)) {
      setDateError("End date must be on or after the start date.");
      return;
    }
    setDateError("");
  };

  const exportCsv = () => {
    if (!filteredLogs.length) return;

    const headers = ["Event ID", "Actor", "Role", "Action", "Target Type", "Target", "Description", "Status", "Timestamp"];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.actor.name,
      log.actor.role,
      log.action,
      log.targetType,
      log.targetName,
      log.description,
      formatStatusText(log.status),
      log.timestamp,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "edulearn-audit-logs.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    removeFromBlobUrl(url);
  };

  const handleRetry = () => {
    setCanLoadLogs(true);
  };

  if (!canLoadLogs) {
    return (
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Unable to load audit logs.</h3>
              <p className="mt-2 text-sm text-slate-600">The local demo data could not be processed.</p>
            </div>
            <Button type="button" onClick={handleRetry}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/admin/dashboard" className="hover:text-primary-600">Admin</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-slate-900">Audit Logs</span>
        </nav>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Admin / Audit Logs</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Audit Logs</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">Track administrative actions and important activity across the EduLearn platform.</p>
          </div>

          <Button type="button" onClick={exportCsv} leftIcon={<Download className="h-4 w-4" />} disabled={!filteredLogs.length}>
            Export Logs
          </Button>
        </div>

        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
          Audit logs are currently displayed from demo data. Production logging will be handled server-side.
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.key} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">{card.helper}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">Activity Overview</p>
          </div>
          <Badge variant="secondary">Demo audit data</Badge>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {activityOverview.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-600">{item.label}</p>
                <span className="text-sm font-semibold text-slate-900">{item.value} events</span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-primary-500" style={{ width: `${Math.max(item.percentage, 8)}%` }} aria-label={`${item.label} activity`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition",
                  activeTab === tab.id
                    ? "border-primary-200 bg-primary-50 text-primary-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full max-w-md">
            <label htmlFor="audit-search" className="sr-only">
              Search audit logs
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="audit-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by admin, action, target, ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Action Type</label>
            <select value={actionType} onChange={(event) => setActionType(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary-500 focus:bg-white">
              {actionTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Actor</label>
            <select value={actorFilter} onChange={(event) => setActorFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary-500 focus:bg-white">
              {actorFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Target Type</label>
            <select value={targetTypeFilter} onChange={(event) => setTargetTypeFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary-500 focus:bg-white">
              {targetTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Status</label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary-500 focus:bg-white">
              {auditStatusOptions.map((option) => (
                <option key={option} value={option}>{option === "all" ? "All" : formatStatusText(option)}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Date</label>
            <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary-500 focus:bg-white">
              {dateFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Sort</label>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary-500 focus:bg-white">
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {dateFilter === "custom" ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(event) => handleCustomDateChange(event.target.value, customEndDate)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(event) => handleCustomDateChange(customStartDate, event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>
        ) : null}

        {dateError ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{dateError}</div> : null}

        <div className="mt-5 flex justify-end">
          <Button type="button" variant="outline" onClick={clearFilters} leftIcon={<RefreshCcw className="h-4 w-4" />}>
            Reset Filters
          </Button>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="mt-8 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">No audit events found</h3>
            <p className="mt-2 text-sm text-slate-600">Try changing your search or filters.</p>
            <div className="mt-5">
              <Button type="button" onClick={clearFilters}>Clear Filters</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 hidden overflow-hidden rounded-[24px] border border-slate-200 lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Event ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Actor</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Target</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {paginatedLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">{log.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                              {log.actor.initials}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{log.actor.name}</p>
                              <p className="text-xs text-slate-500">{log.actor.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <ActionBadge type={log.actionType} />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          <div>
                            <p className="font-medium text-slate-900">{log.targetType}</p>
                            <p className="text-xs text-slate-500">{log.targetName}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{log.description}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{formatAuditTimestamp(log.timestamp)}</td>
                        <td className="px-4 py-3"><StatusBadge status={log.status} /></td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setSelectedLog(log)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 space-y-4 lg:hidden">
              {paginatedLogs.map((log) => (
                <div key={log.id} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{log.id}</p>
                    </div>
                    <StatusBadge status={log.status} />
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-slate-700">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Actor</p>
                      <p className="mt-1 font-medium text-slate-900">{log.actor.name}</p>
                      <p className="text-xs text-slate-500">{log.actor.role}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Action</p>
                      <div className="mt-1"><ActionBadge type={log.actionType} /></div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Target</p>
                      <p className="mt-1 font-medium text-slate-900">{log.targetType}</p>
                      <p className="text-xs text-slate-500">{log.targetName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Date / Time</p>
                      <p className="mt-1 font-medium text-slate-900">{formatAuditLongDate(log.timestamp)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button type="button" variant="outline" onClick={() => setSelectedLog(log)} leftIcon={<Eye className="h-4 w-4" />}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-600">Showing {filteredLogs.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length} events</p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={cn(
                      "h-9 w-9 rounded-lg border text-sm font-medium",
                      currentPage === pageNumber ? "border-primary-500 bg-primary-500 text-white" : "border-slate-200 bg-white text-slate-700"
                    )}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AuditLogDetailsModal
        log={selectedLog}
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
