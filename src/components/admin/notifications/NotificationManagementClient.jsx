"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/utils";
import Button from "@/components/ui/Button.jsx";
import Badge from "@/components/ui/Badge.jsx";
import {
  adminNotifications,
  notificationPriorityConfig,
  notificationTypeConfig,
} from "@/constants/adminNotifications.js";
import {
  AlertTriangle,
  Award,
  Bell,
  BookOpen,
  CalendarClock,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  Copy,
  CreditCard,
  Eye,
  FileText,
  Filter,
  Inbox,
  Megaphone,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Send,
  ShieldAlert,
  Star,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";

const tabs = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
  { key: "scheduled", label: "Scheduled" },
  { key: "sent", label: "Sent" },
  { key: "drafts", label: "Drafts" },
];

const typeOptions = [
  { value: "all", label: "All" },
  { value: "course", label: "Course" },
  { value: "enrollment", label: "Enrollment" },
  { value: "payment", label: "Payment" },
  { value: "certificate", label: "Certificate" },
  { value: "assignment", label: "Assignment" },
  { value: "quiz", label: "Quiz" },
  { value: "review", label: "Review" },
  { value: "system", label: "System" },
  { value: "announcement", label: "Announcement" },
];

const recipientOptions = [
  { value: "all", label: "All" },
  { value: "students", label: "Students" },
  { value: "instructors", label: "Instructors" },
  { value: "admins", label: "Admins" },
  { value: "specific-user", label: "Specific User" },
];

const statusOptions = [
  { value: "all", label: "All" },
  { value: "read", label: "Read" },
  { value: "unread", label: "Unread" },
  { value: "scheduled", label: "Scheduled" },
  { value: "sent", label: "Sent" },
  { value: "draft", label: "Draft" },
];

const priorityOptions = [
  { value: "all", label: "All" },
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const dateOptions = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "month", label: "This Month" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "priority-high", label: "Highest Priority" },
  { value: "priority-low", label: "Lowest Priority" },
];

const deliveryChannelOptions = [
  "In-App",
  "Email",
  "SMS",
  "Push",
];

const PAGE_SIZE = 10;

function getTypeMeta(type) {
  const config = notificationTypeConfig[type] || { label: type, icon: "Bell" };
  const iconMap = {
    course: BookOpen,
    enrollment: UserPlus,
    payment: CreditCard,
    certificate: Award,
    assignment: FileText,
    quiz: ClipboardList,
    review: Star,
    system: Bell,
    announcement: Megaphone,
  };
  return { label: config.label, icon: iconMap[type] || Bell };
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeTime(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  const diffMinutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function getPriorityMeta(priority) {
  const meta = {
    low: { label: "Low", variant: "secondary", icon: ChevronDown },
    normal: { label: "Normal", variant: "default", icon: Check },
    high: { label: "High", variant: "warning", icon: AlertTriangle },
    critical: { label: "Critical", variant: "danger", icon: ShieldAlert },
  };
  return meta[priority] || meta.normal;
}

function getStatusMeta(status) {
  const meta = {
    read: { label: "Read", variant: "success" },
    unread: { label: "Unread", variant: "secondary" },
    sent: { label: "Sent", variant: "success" },
    scheduled: { label: "Scheduled", variant: "warning" },
    draft: { label: "Draft", variant: "secondary" },
  };
  return meta[status] || { label: status, variant: "secondary" };
}

function getDateValue(dateValue) {
  const date = new Date(dateValue || "1970-01-01T00:00:00");
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function isWithinRange(dateValue, range) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

  switch (range) {
    case "today":
      return diffDays <= 1;
    case "7":
      return diffDays <= 7;
    case "30":
      return diffDays <= 30;
    case "month":
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    default:
      return true;
  }
}

function NotificationTypeBadge({ type }) {
  const { label, icon: Icon } = getTypeMeta(type);
  return (
    <Badge variant="secondary" className="gap-1.5 capitalize">
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
    </Badge>
  );
}

function NotificationPriorityBadge({ priority }) {
  const meta = getPriorityMeta(priority);
  const Icon = meta.icon;

  return (
    <Badge variant={meta.variant} className="gap-1.5 capitalize">
      <Icon className="h-3 w-3" aria-hidden="true" />
      {meta.label}
    </Badge>
  );
}

function NotificationStatusBadge({ status }) {
  const meta = getStatusMeta(status);
  return (
    <Badge variant={meta.variant} className="capitalize">
      {meta.label}
    </Badge>
  );
}

function StatCard({ title, value, detail, tone, icon: Icon }) {
  const toneClasses = {
    primary: "bg-primary-50 text-primary-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    secondary: "bg-slate-100 text-slate-700",
  };

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
        </div>
        <div className={cn("rounded-xl p-2.5", toneClasses[tone] || toneClasses.primary)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">{detail}</p>
    </article>
  );
}

function formatInitials(name) {
  if (!name) return "NA";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function NotificationFormPreview({ form }) {
  const typeMeta = getTypeMeta(form.type || "system");
  const priorityMeta = getPriorityMeta(form.priority || "normal");
  const Icon = typeMeta.icon;

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">EduLearn</p>
            <p className="text-[11px] text-slate-500">{formatRelativeTime(new Date().toISOString())}</p>
          </div>
        </div>
        <Badge variant={priorityMeta.variant} className="capitalize">
          {priorityMeta.label}
        </Badge>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-semibold text-slate-900">{form.title || "Notification title"}</h3>
        <p className="text-sm leading-6 text-slate-600">{form.message || "Your notification preview will appear here as you type."}</p>
      </div>
    </div>
  );
}

function NotificationDetailsModal({ notification, open, onClose, onMarkRead, onMarkUnread, onEdit, onDuplicate, onDelete }) {
  const typeMeta = getTypeMeta(notification?.type || "system");
  const Icon = typeMeta.icon;

  React.useEffect(() => {
    if (!open || !notification) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, notification, onClose]);

  if (!open || !notification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Notification Information</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{notification.title}</h2>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close notification details"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{notification.notificationId}</Badge>
              <NotificationStatusBadge status={notification.status} />
              <NotificationPriorityBadge priority={notification.priority} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Message</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{notification.message}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Type</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{typeMeta.label}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Priority</p>
                <p className="mt-2 text-sm font-medium capitalize text-slate-900">{notification.priority}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Created Date</p>
                <p className="mt-2 text-sm text-slate-900">{formatDateTime(notification.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Scheduled Date</p>
                <p className="mt-2 text-sm text-slate-900">{notification.scheduledAt ? formatDateTime(notification.scheduledAt) : "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Sent Date</p>
                <p className="mt-2 text-sm text-slate-900">{notification.sentAt ? formatDateTime(notification.sentAt) : "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Read Date</p>
                <p className="mt-2 text-sm text-slate-900">{notification.readAt ? formatDateTime(notification.readAt) : "—"}</p>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Recipient</p>
              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                  {formatInitials(notification.recipientName)}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{notification.recipientName}</p>
                  <p className="text-sm text-slate-500">{notification.recipientEmail}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Recipient Type</p>
                <p className="mt-2 text-sm font-medium capitalize text-slate-900">{notification.recipientType}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Recipient ID</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{notification.recipientId}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Delivery Status</p>
                <p className="mt-2 text-sm font-medium capitalize text-slate-900">{notification.deliveryStatus || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Read Status</p>
                <p className="mt-2 text-sm font-medium capitalize text-slate-900">{notification.read ? "Read" : "Unread"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Delivery Channel</p>
                <p className="mt-2 text-sm font-medium capitalize text-slate-900">{notification.deliveryChannel || notification.channel}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => (notification.read ? onMarkUnread(notification) : onMarkRead(notification))}>
            {notification.read ? "Mark Unread" : "Mark Read"}
          </Button>
          <Button type="button" variant="outline" onClick={() => onDuplicate(notification)}>
            Duplicate
          </Button>
          <Button type="button" variant="outline" onClick={() => onEdit(notification)}>
            Edit
          </Button>
          <Button type="button" variant="destructive" onClick={() => onDelete(notification)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onClose, variant = "default" }) {
  React.useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", variant === "danger" ? "bg-red-50 text-red-600" : "bg-primary-50 text-primary-600")}>
            {variant === "danger" ? <Trash2 className="h-5 w-5" aria-hidden="true" /> : <AlertTriangle className="h-5 w-5" aria-hidden="true" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant={variant === "danger" ? "destructive" : "default"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function NotificationFormModal({ open, mode, notification, onClose, onSubmit }) {
  const initialForm = React.useMemo(
    () => ({
      title: notification?.title || "",
      message: notification?.message || "",
      type: notification?.type || "enrollment",
      recipientType: notification?.recipientType || "student",
      recipient: notification?.recipientName || "",
      priority: notification?.priority || "normal",
      channel: notification?.channel || "in-app",
      status: notification?.status === "draft" ? "draft" : "scheduled",
      scheduleMode: notification?.scheduledAt ? "later" : "now",
      scheduleDate: notification?.scheduledAt ? notification.scheduledAt.slice(0, 10) : "",
      scheduleTime: notification?.scheduledAt ? notification.scheduledAt.slice(11, 16) : "",
    }),
    [notification]
  );

  const [form, setForm] = React.useState(initialForm);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (open) {
      setForm(initialForm);
      setErrors({});
    }
  }, [open, initialForm]);

  React.useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleFieldChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateAndSubmit = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required.";
    if (form.title.trim().length > 100) nextErrors.title = "Title must be 100 characters or fewer.";
    if (!form.message.trim()) nextErrors.message = "Message is required.";
    if (form.message.trim().length > 500) nextErrors.message = "Message must be 500 characters or fewer.";
    if (!form.type) nextErrors.type = "Notification type is required.";
    if (!form.recipientType) nextErrors.recipientType = "Recipient type is required.";
    if (!form.priority) nextErrors.priority = "Priority is required.";
    if (!form.channel) nextErrors.channel = "Delivery channel is required.";

    if (form.scheduleMode === "later") {
      if (!form.scheduleDate) nextErrors.scheduleDate = "Date is required.";
      if (!form.scheduleTime) nextErrors.scheduleTime = "Time is required.";
      if (form.scheduleDate && form.scheduleTime) {
        const selectedDateTime = new Date(`${form.scheduleDate}T${form.scheduleTime}`);
        if (Number.isNaN(selectedDateTime.getTime()) || selectedDateTime <= new Date()) {
          nextErrors.scheduleDate = "Scheduled date and time must be in the future.";
        }
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSubmit({
      ...form,
      title: form.title.trim(),
      message: form.message.trim(),
      status: form.status,
      scheduleMode: form.scheduleMode,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">{mode === "create" ? "Create" : "Edit"} Notification</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{mode === "create" ? "Create Notification" : "Edit Notification"}</h2>
          </div>
          <button type="button" aria-label="Close create notification form" onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="notif-title" className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                <input id="notif-title" value={form.title} maxLength={100} onChange={(event) => handleFieldChange("title", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Enter notification title" />
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{errors.title || ""}</span>
                  <span>{form.title.length}/100</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="notif-message" className="mb-2 block text-sm font-medium text-slate-700">Message</label>
                <textarea id="notif-message" value={form.message} maxLength={500} onChange={(event) => handleFieldChange("message", event.target.value)} className="h-28 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Write the notification message" />
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{errors.message || ""}</span>
                  <span>{form.message.length}/500</span>
                </div>
              </div>

              <div>
                <label htmlFor="notif-type" className="mb-2 block text-sm font-medium text-slate-700">Notification Type</label>
                <select id="notif-type" value={form.type} onChange={(event) => handleFieldChange("type", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {typeOptions.filter((option) => option.value !== "all").map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.type ? <p className="mt-1 text-xs text-red-600">{errors.type}</p> : null}
              </div>

              <div>
                <label htmlFor="notif-recipient-type" className="mb-2 block text-sm font-medium text-slate-700">Recipient Type</label>
                <select id="notif-recipient-type" value={form.recipientType} onChange={(event) => handleFieldChange("recipientType", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                  <option value="all-students">All Students</option>
                  <option value="all-instructors">All Instructors</option>
                  <option value="all-admins">All Admins</option>
                  <option value="specific-user">Specific User</option>
                </select>
              </div>

              <div>
                <label htmlFor="notif-recipient" className="mb-2 block text-sm font-medium text-slate-700">Recipient</label>
                <input id="notif-recipient" value={form.recipient} onChange={(event) => handleFieldChange("recipient", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Recipient name" />
              </div>

              <div>
                <label htmlFor="notif-priority" className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
                <select id="notif-priority" value={form.priority} onChange={(event) => handleFieldChange("priority", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {priorityOptions.filter((option) => option.value !== "all").map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="notif-channel" className="mb-2 block text-sm font-medium text-slate-700">Delivery Channel</label>
                <select id="notif-channel" value={form.channel} onChange={(event) => handleFieldChange("channel", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {deliveryChannelOptions.map((channel) => (
                    <option key={channel} value={channel.toLowerCase().replace(/\s+/g, "-")}>{channel}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="notif-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
                <select id="notif-status" value={form.status} onChange={(event) => handleFieldChange("status", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label htmlFor="notif-schedule-mode" className="mb-2 block text-sm font-medium text-slate-700">Schedule</label>
                <select id="notif-schedule-mode" value={form.scheduleMode} onChange={(event) => handleFieldChange("scheduleMode", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  <option value="now">Send Now</option>
                  <option value="later">Schedule for Later</option>
                </select>
              </div>

              {form.scheduleMode === "later" ? (
                <>
                  <div>
                    <label htmlFor="notif-date" className="mb-2 block text-sm font-medium text-slate-700">Schedule Date</label>
                    <input id="notif-date" type="date" value={form.scheduleDate} onChange={(event) => handleFieldChange("scheduleDate", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
                    {errors.scheduleDate ? <p className="mt-1 text-xs text-red-600">{errors.scheduleDate}</p> : null}
                  </div>
                  <div>
                    <label htmlFor="notif-time" className="mb-2 block text-sm font-medium text-slate-700">Schedule Time</label>
                    <input id="notif-time" type="time" value={form.scheduleTime} onChange={(event) => handleFieldChange("scheduleTime", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
                    {errors.scheduleTime ? <p className="mt-1 text-xs text-red-600">{errors.scheduleTime}</p> : null}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-900">Preview</h3>
              <Badge variant="secondary">Demo</Badge>
            </div>
            <NotificationFormPreview form={form} />
            <p className="text-xs leading-5 text-slate-500">This preview is a UI demonstration only and does not send any notification.</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={validateAndSubmit}>{mode === "create" ? "Create Notification" : "Save Changes"}</Button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationManagementClient() {
  const [notifications, setNotifications] = React.useState(adminNotifications);
  const [activeTab, setActiveTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [recipientFilter, setRecipientFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("all");
  const [sortFilter, setSortFilter] = React.useState("newest");
  const [page, setPage] = React.useState(1);
  const [selectedNotification, setSelectedNotification] = React.useState(null);
  const [formMode, setFormMode] = React.useState("create");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState(null);
  const [isMarkAllOpen, setIsMarkAllOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  const recentActivity = React.useMemo(
    () => [
      { action: "Notification created", title: "Platform Update Announcement", time: "2 mins ago" },
      { action: "Notification scheduled", title: "Course Launch Reminder", time: "18 mins ago" },
      { action: "Notification marked as read", title: "Assignment Feedback Ready", time: "42 mins ago" },
      { action: "Notification deleted", title: "Workshop Registration Opens", time: "1 hour ago" },
      { action: "Announcement drafted", title: "Instructor Webinar Invitation", time: "3 hours ago" },
    ],
    []
  );

  React.useEffect(() => {
    if (!toastMessage) return undefined;
    const timeout = setTimeout(() => setToastMessage(""), 2200);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  const filteredNotifications = React.useMemo(() => {
    let next = [...notifications];

    if (activeTab !== "all") {
      if (activeTab === "unread") next = next.filter((item) => !item.read && item.status !== "draft");
      else if (activeTab === "read") next = next.filter((item) => item.read);
      else if (activeTab === "scheduled") next = next.filter((item) => item.status === "scheduled");
      else if (activeTab === "sent") next = next.filter((item) => item.status === "sent");
      else if (activeTab === "drafts") next = next.filter((item) => item.status === "draft");
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      next = next.filter((item) => {
        const haystack = [
          item.title,
          item.message,
          item.recipientName,
          item.recipientEmail,
          item.notificationId,
          getTypeMeta(item.type).label,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    if (typeFilter !== "all") {
      next = next.filter((item) => item.type === typeFilter);
    }

    if (recipientFilter !== "all") {
      if (recipientFilter === "students") next = next.filter((item) => item.recipientType === "student" || item.recipientType === "all-students");
      if (recipientFilter === "instructors") next = next.filter((item) => item.recipientType === "instructor" || item.recipientType === "all-instructors");
      if (recipientFilter === "admins") next = next.filter((item) => item.recipientType === "admin" || item.recipientType === "all-admins");
      if (recipientFilter === "specific-user") next = next.filter((item) => item.recipientType === "student" || item.recipientType === "instructor" || item.recipientType === "admin");
    }

    if (statusFilter !== "all") {
      if (statusFilter === "read") next = next.filter((item) => item.read);
      else if (statusFilter === "unread") next = next.filter((item) => !item.read);
      else next = next.filter((item) => item.status === statusFilter);
    }

    if (priorityFilter !== "all") next = next.filter((item) => item.priority === priorityFilter);
    if (dateFilter !== "all") next = next.filter((item) => isWithinRange(item.createdAt || item.sentAt || item.scheduledAt, dateFilter));

    next.sort((a, b) => {
      const timeA = getDateValue(a.createdAt || a.sentAt || a.scheduledAt || new Date().toISOString());
      const timeB = getDateValue(b.createdAt || b.sentAt || b.scheduledAt || new Date().toISOString());

      if (sortFilter === "oldest") return timeA - timeB;
      if (sortFilter === "priority-high") return notificationPriorityConfig[b.priority].value - notificationPriorityConfig[a.priority].value;
      if (sortFilter === "priority-low") return notificationPriorityConfig[a.priority].value - notificationPriorityConfig[b.priority].value;
      return timeB - timeA;
    });

    return next;
  }, [activeTab, notifications, search, typeFilter, recipientFilter, statusFilter, priorityFilter, dateFilter, sortFilter]);

  React.useEffect(() => {
    setPage(1);
  }, [activeTab, search, typeFilter, recipientFilter, statusFilter, priorityFilter, dateFilter, sortFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / PAGE_SIZE));
  const paginatedNotifications = filteredNotifications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const summary = React.useMemo(() => {
    const all = notifications.length;
    const unread = notifications.filter((item) => !item.read && item.status !== "draft").length;
    const scheduled = notifications.filter((item) => item.status === "scheduled").length;
    const sentToday = notifications.filter((item) => {
      if (!item.sentAt) return false;
      const sentDate = new Date(item.sentAt);
      const now = new Date();
      return sentDate.toDateString() === now.toDateString();
    }).length;

    return { all, unread, scheduled, sentToday };
  }, [notifications]);

  const deliveryStats = [
    { label: "In-App", value: 82 },
    { label: "Email", value: 10 },
    { label: "Push", value: 6 },
    { label: "SMS", value: 2 },
  ];

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setRecipientFilter("all");
    setStatusFilter("all");
    setPriorityFilter("all");
    setDateFilter("all");
    setSortFilter("newest");
    setActiveTab("all");
    setPage(1);
  };

  const openCreateModal = () => {
    setFormMode("create");
    setSelectedNotification(null);
    setIsFormOpen(true);
  };

  const openEditModal = (notification) => {
    if (notification.status === "sent") {
      setToastMessage("This notification has already been sent and cannot be edited.");
      return;
    }
    setFormMode("edit");
    setSelectedNotification(notification);
    setIsFormOpen(true);
  };

  const openDuplicate = (notification) => {
    const duplicate = {
      ...notification,
      id: `notif-${Date.now()}`,
      notificationId: `NOTIF-EDU-${String(Math.floor(Math.random() * 9000 + 1000))}`,
      title: `${notification.title} Copy`,
      status: "draft",
      read: false,
      scheduledAt: null,
      sentAt: null,
      readAt: null,
      deliveryStatus: "draft",
      createdAt: new Date().toISOString(),
    };

    setSelectedNotification(duplicate);
    setFormMode("duplicate");
    setIsFormOpen(true);
    setToastMessage("Notification duplicated in the demo environment.");
  };

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
  };

  const handleDelete = (notification) => {
    setPendingDelete(notification);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setNotifications((current) => current.filter((item) => item.id !== pendingDelete.id));
    setIsDeleteOpen(false);
    setSelectedNotification(null);
    setToastMessage("Notification deleted from the demo data.");
  };

  const markReadState = (notification, readState) => {
    setNotifications((current) =>
      current.map((item) => {
        if (item.id !== notification.id) return item;
        return {
          ...item,
          read: readState,
          status: readState ? (item.status === "draft" ? "draft" : "sent") : "sent",
          readAt: readState ? new Date().toISOString() : null,
        };
      })
    );
    setToastMessage(readState ? "Notification marked as read." : "Notification marked as unread.");
  };

  const markAllRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true, readAt: item.read ? item.readAt : new Date().toISOString() })));
    setIsMarkAllOpen(false);
    setToastMessage("All notifications marked as read.");
  };

  const cancelSchedule = (notification) => {
    setNotifications((current) =>
      current.map((item) => {
        if (item.id !== notification.id) return item;
        return { ...item, status: "draft", scheduledAt: null, deliveryStatus: "draft" };
      })
    );
    setToastMessage("Notification schedule cancelled in the demo environment.");
  };

  const handleSubmitForm = (formValues) => {
    const normalizedRecipient = formValues.recipient || (formValues.recipientType === "student" ? "Student" : formValues.recipientType === "instructor" ? "Instructor" : "Admin");
    const payload = {
      id: selectedNotification?.id || `notif-${Date.now()}`,
      notificationId: selectedNotification?.notificationId || `NOTIF-EDU-${String(Math.floor(Math.random() * 9000 + 1000))}`,
      title: formValues.title,
      message: formValues.message,
      type: formValues.type,
      recipientType: formValues.recipientType,
      recipientId: selectedNotification?.recipientId || `demo-${Date.now()}`,
      recipientName: normalizedRecipient,
      recipientEmail: selectedNotification?.recipientEmail || `${normalizedRecipient.toLowerCase().replace(/\s+/g, ".")}@demo.com`,
      priority: formValues.priority,
      channel: formValues.channel,
      status:
        formValues.scheduleMode === "later"
          ? formValues.status === "draft"
            ? "draft"
            : "scheduled"
          : formValues.status === "draft"
            ? "draft"
            : "sent",
      read: formValues.scheduleMode === "later" ? false : formValues.status === "draft" ? false : false,
      createdAt: selectedNotification?.createdAt || new Date().toISOString(),
      scheduledAt: formValues.scheduleMode === "later" ? new Date(`${formValues.scheduleDate}T${formValues.scheduleTime}`).toISOString() : null,
      sentAt: formValues.scheduleMode === "now" && formValues.status !== "draft" ? new Date().toISOString() : selectedNotification?.sentAt || null,
      readAt: null,
      deliveryStatus: formValues.scheduleMode === "later" ? "scheduled" : formValues.status === "draft" ? "draft" : "delivered",
      deliveryChannel: formValues.channel === "in-app" ? "In-App" : formValues.channel === "email" ? "Email" : formValues.channel === "sms" ? "SMS" : "Push",
    };

    // TODO: Replace mock notification actions with authenticated
    // server-side notification APIs.

    if (formMode === "edit") {
      setNotifications((current) => current.map((item) => (item.id === selectedNotification.id ? payload : item)));
      setToastMessage("Notification updated in the demo environment.");
    } else {
      setNotifications((current) => [payload, ...current]);
      setToastMessage("Notification created in the demo environment.");
    }

    setIsFormOpen(false);
    setSelectedNotification(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/admin/dashboard" className="hover:text-primary-600">Admin</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-slate-900">Notifications</span>
        </nav>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Notifications</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Notification Management</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">Create, manage, review, and organize platform notifications for students, instructors, and administrators.</p>
          </div>

          <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setIsMarkAllOpen(true)}>
              Mark All as Read
            </Button>
            <Button type="button" onClick={openCreateModal} leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}>
              Create Notification
            </Button>
          </div>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Notifications" value={summary.all.toLocaleString()} detail="All notification records" tone="primary" icon={Bell} />
        <StatCard title="Unread" value={summary.unread.toLocaleString()} detail="Across admin activity" tone="secondary" icon={Inbox} />
        <StatCard title="Scheduled" value={summary.scheduled.toLocaleString()} detail="Upcoming notifications" tone="warning" icon={CalendarClock} />
        <StatCard title="Sent Today" value={summary.sentToday.toLocaleString()} detail="Demo activity" tone="success" icon={Send} />
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Notification categories">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition",
                activeTab === tab.key ? "bg-primary-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
          <div className="relative xl:col-span-1">
            <label htmlFor="notification-search" className="sr-only">Search notifications</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="notification-search"
              type="search"
              value={search}
              placeholder="Search notifications..."
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            />
          </div>

          <div>
            <label htmlFor="filter-type" className="mb-2 block text-sm font-medium text-slate-700">Notification Type</label>
            <select id="filter-type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-recipient" className="mb-2 block text-sm font-medium text-slate-700">Recipient</label>
            <select id="filter-recipient" value={recipientFilter} onChange={(event) => setRecipientFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
              {recipientOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <select id="filter-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-priority" className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
            <select id="filter-priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="filter-date" className="mb-2 block text-sm font-medium text-slate-700">Date</label>
            <select id="filter-date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
              {dateOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-sort" className="mb-2 block text-sm font-medium text-slate-700">Sort</label>
            <select id="filter-sort" value={sortFilter} onChange={(event) => setSortFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button type="button" variant="outline" className="w-full" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Notifications</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Notification List</h2>
          </div>
          <p className="text-sm text-slate-500">Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredNotifications.length)}–{Math.min(page * PAGE_SIZE, filteredNotifications.length)} of {filteredNotifications.length}</p>
        </div>

        {paginatedNotifications.length ? (
          <>
            <div className="hidden overflow-hidden rounded-[24px] border border-slate-200 lg:block">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Notification ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Recipient</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Read</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {paginatedNotifications.map((notification) => (
                    <tr key={notification.id} className="align-top hover:bg-slate-50/80">
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">{notification.notificationId}</td>
                      <td className="px-4 py-4">
                        <div className="min-w-[220px]">
                          <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{notification.message}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{notification.recipientName}</p>
                          <p className="text-xs text-slate-500">{notification.recipientEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4"><NotificationTypeBadge type={notification.type} /></td>
                      <td className="px-4 py-4"><NotificationPriorityBadge priority={notification.priority} /></td>
                      <td className="px-4 py-4 text-sm text-slate-700">{formatDate(notification.sentAt || notification.createdAt)}</td>
                      <td className="px-4 py-4"><NotificationStatusBadge status={notification.status} /></td>
                      <td className="px-4 py-4">
                        <Badge variant={notification.read ? "success" : "secondary"} className="capitalize">
                          {notification.read ? "Read" : "Unread"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button type="button" aria-label={`View notification ${notification.notificationId}`} onClick={() => handleViewNotification(notification)} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          </button>
                          {notification.status === "scheduled" ? (
                            <button type="button" aria-label={`Cancel schedule for ${notification.notificationId}`} onClick={() => cancelSchedule(notification)} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-amber-200 hover:text-amber-700">
                              <CalendarClock className="h-4 w-4" aria-hidden="true" />
                            </button>
                          ) : null}
                          <div className="relative group">
                            <button type="button" aria-label={`Open actions for ${notification.notificationId}`} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
                              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <div className="absolute right-0 z-10 hidden min-w-[150px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg group-hover:block">
                              <button type="button" onClick={() => handleViewNotification(notification)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"> <Eye className="h-4 w-4" /> View </button>
                              <button type="button" onClick={() => markReadState(notification, !notification.read)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"> <CheckCheck className="h-4 w-4" /> {notification.read ? "Mark Unread" : "Mark Read"} </button>
                              <button type="button" onClick={() => openEditModal(notification)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"> <Pencil className="h-4 w-4" /> Edit </button>
                              <button type="button" onClick={() => openDuplicate(notification)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"> <Copy className="h-4 w-4" /> Duplicate </button>
                              <button type="button" onClick={() => handleDelete(notification)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50"> <Trash2 className="h-4 w-4" /> Delete </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 lg:hidden">
              {paginatedNotifications.map((notification) => (
                <article key={notification.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{notification.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                    </div>
                    <NotificationStatusBadge status={notification.status} />
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-between gap-3"><span>Recipient</span><span className="font-medium text-slate-900">{notification.recipientName}</span></div>
                    <div className="flex items-center justify-between gap-3"><span>Type</span><span><NotificationTypeBadge type={notification.type} /></span></div>
                    <div className="flex items-center justify-between gap-3"><span>Priority</span><span><NotificationPriorityBadge priority={notification.priority} /></span></div>
                    <div className="flex items-center justify-between gap-3"><span>Date</span><span className="font-medium text-slate-900">{formatDate(notification.sentAt || notification.createdAt)}</span></div>
                    <div className="flex items-center justify-between gap-3"><span>Read</span><span className="font-medium text-slate-900">{notification.read ? "Read" : "Unread"}</span></div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button type="button" variant="outline" onClick={() => handleViewNotification(notification)} className="flex-1">View Notification</Button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">{filteredNotifications.length ? `Showing ${Math.min((page - 1) * PAGE_SIZE + 1, filteredNotifications.length)}–${Math.min(page * PAGE_SIZE, filteredNotifications.length)} of ${filteredNotifications.length}` : "No notifications found"}</p>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).slice(Math.max(0, page - 2), Math.min(totalPages, page + 1)).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition",
                        page === pageNumber ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
              <Inbox className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">No notifications found</h3>
            <p className="mt-2 text-sm text-slate-600">Try adjusting your search or filters.</p>
            <div className="mt-5 flex justify-center">
              <Button type="button" variant="outline" onClick={resetFilters}>Reset Filters</Button>
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Recent Activity</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Recent Notification Activity</h2>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={`${item.action}-${item.title}`} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.action}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.title}</p>
                </div>
                <span className="text-xs text-slate-500">{item.time}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Delivery Statistics</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Notification Statistics</h2>
          </div>
          <div className="space-y-4">
            {deliveryStats.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
                  <span>{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-primary-500" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedNotification ? (
        <NotificationDetailsModal
          notification={selectedNotification}
          open={Boolean(selectedNotification)}
          onClose={() => setSelectedNotification(null)}
          onMarkRead={(item) => markReadState(item, true)}
          onMarkUnread={(item) => markReadState(item, false)}
          onEdit={(item) => openEditModal(item)}
          onDuplicate={(item) => openDuplicate(item)}
          onDelete={(item) => handleDelete(item)}
        />
      ) : null}

      <NotificationFormModal
        open={isFormOpen}
        mode={formMode}
        notification={selectedNotification}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedNotification(null);
        }}
        onSubmit={handleSubmitForm}
      />

      <ConfirmModal
        open={isDeleteOpen}
        title="Delete Notification?"
        message="This removes the notification from the current demo data only."
        confirmLabel="Delete Notification"
        variant="danger"
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
      />

      <ConfirmModal
        open={isMarkAllOpen}
        title="Mark all notifications as read?"
        message="This will update the current demo notification records."
        confirmLabel="Mark All as Read"
        onClose={() => setIsMarkAllOpen(false)}
        onConfirm={markAllRead}
      />

      {toastMessage ? (
        <div className="fixed bottom-5 right-5 z-[60] rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
