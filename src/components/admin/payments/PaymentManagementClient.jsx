"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/utils";
import Button from "@/components/ui/Button.jsx";
import Badge from "@/components/ui/Badge.jsx";
import { adminPayments, adminPaymentsSummary } from "@/constants/adminPayments.js";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CalendarRange,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CreditCard,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User2,
  X,
} from "lucide-react";

const PAYMENT_PAGE_SIZE = 10;
const PENDING_TAB = "pending";

const tabOptions = [
  { key: "all", label: "All Payments" },
  { key: "successful", label: "Successful" },
  { key: PENDING_TAB, label: "Pending" },
  { key: "failed", label: "Failed" },
  { key: "refunded", label: "Refunded" },
  { key: "cancelled", label: "Cancelled" },
];

const statusOptions = [
  { value: "all", label: "All" },
  { value: "successful", label: "Successful" },
  { value: PENDING_TAB, label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
  { value: "cancelled", label: "Cancelled" },
];

const methodOptions = [
  { value: "all", label: "All" },
  { value: "Card", label: "Card" },
  { value: "UPI", label: "UPI" },
  { value: "Net Banking", label: "Net Banking" },
  { value: "Wallet", label: "Wallet" },
  { value: "Free Enrollment", label: "Free Enrollment" },
  { value: "Manual", label: "Manual" },
];

const dateRangeOptions = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "month", label: "This Month" },
];

const amountRangeOptions = [
  { value: "all", label: "All" },
  { value: "under-500", label: "Under ₹500" },
  { value: "500-1000", label: "₹500–₹1,000" },
  { value: "1000-5000", label: "₹1,000–₹5,000" },
  { value: "above-5000", label: "Above ₹5,000" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "amount-desc", label: "Highest Amount" },
  { value: "amount-asc", label: "Lowest Amount" },
  { value: "student-asc", label: "Student Name" },
  { value: "course-asc", label: "Course Name" },
];

const statusVariantMap = {
  successful: "success",
  pending: "warning",
  failed: "danger",
  refunded: "secondary",
  cancelled: "secondary",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value || 0));
}

function formatDateLabel(dateString) {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
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

function PaymentStatusBadge({ status }) {
  const labelMap = {
    successful: "Successful",
    pending: "Pending",
    failed: "Failed",
    refunded: "Refunded",
    cancelled: "Cancelled",
  };

  return (
    <Badge variant={statusVariantMap[status] || "secondary"} size="sm" className="capitalize">
      {labelMap[status] || status}
    </Badge>
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

function DrawerShell({ open, title, onClose, children }) {
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
    <div className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px]">
      <div className="ml-auto flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close panel" className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function PaymentStats({ payments }) {
  const summaryItems = [
    {
      label: "Total Revenue",
      value: formatCurrency(payments.filter((item) => item.status === "successful").reduce((sum, item) => sum + item.amount, 0)),
      detail: "+12.8% this month",
      icon: Banknote,
      tone: "primary",
    },
    {
      label: "Successful Payments",
      value: formatNumber(payments.filter((item) => item.status === "successful").length),
      detail: "+8.4% this month",
      icon: ArrowUpRight,
      tone: "success",
    },
    {
      label: "Pending Payments",
      value: formatNumber(payments.filter((item) => item.status === PENDING_TAB).length),
      detail: "4 requiring attention",
      icon: CircleAlert,
      tone: "warning",
    },
    {
      label: "Refunded Amount",
      value: formatCurrency(payments.filter((item) => item.status === "refunded").reduce((sum, item) => sum + item.amount, 0)),
      detail: "6 refunds this month",
      icon: ArrowDownLeft,
      tone: "secondary",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map(({ label, value, detail, icon: Icon, tone }) => (
        <article key={label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">{label}</p>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
            </div>
            <div className={cn("rounded-xl p-2.5", tone === "primary" && "bg-primary-50 text-primary-600", tone === "success" && "bg-emerald-50 text-emerald-600", tone === "warning" && "bg-amber-50 text-amber-600", tone === "secondary" && "bg-slate-100 text-slate-700") }>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">{detail}</p>
        </article>
      ))}
    </section>
  );
}

function RevenueOverview({ payments }) {
  const months = [
    { label: "Apr", revenue: 195000, txns: 160, refunds: 9000 },
    { label: "May", revenue: 216500, txns: 182, refunds: 11000 },
    { label: "Jun", revenue: 225000, txns: 199, refunds: 12300 },
    { label: "Jul", revenue: 248000, txns: 232, refunds: 14600 },
    { label: "Aug", revenue: 264000, txns: 242, refunds: 16500 },
    { label: "Sep", revenue: 284500, txns: 286, refunds: 18500 },
    { label: "Oct", revenue: 298000, txns: 310, refunds: 17200 },
  ];

  const chartMax = Math.max(...months.map((month) => month.revenue));
  const chartPoints = months
    .map((month, index) => {
      const x = 18 + index * 58;
      const y = 150 - (month.revenue / chartMax) * 110;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Revenue overview</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Payment performance</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary-500" aria-hidden="true" /> Revenue</span>
          <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" /> Transactions</span>
          <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden="true" /> Refunds</span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Current month</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(284500)}</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">+12.7%</div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
            <svg viewBox="0 0 360 170" preserveAspectRatio="none" className="h-48 w-full" aria-label="Revenue chart">
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.04" />
                </linearGradient>
              </defs>
              <path d={`M 18 150 L ${months.map((__, index) => `${18 + index * 58},${150 - (months[index].revenue / chartMax) * 110}`).join(' L ')} L 330 150 Z`} fill="url(#revenueFill)" opacity="0.8" />
              <polyline points={chartPoints} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {months.map((month, index) => {
                const x = 18 + index * 58;
                const y = 150 - (month.revenue / chartMax) * 110;
                return (
                  <g key={month.label}>
                    <circle cx={x} cy={y} r="4.5" fill="#2563eb" />
                    <text x={x} y="165" textAnchor="middle" fontSize="10" fill="#64748b">{month.label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Transactions</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">286</p>
            <p className="mt-2 text-xs text-emerald-600">+9.2% versus last month</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Refunds</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{formatCurrency(18500)}</p>
            <p className="mt-2 text-xs text-amber-600">3 high-priority refund reviews</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Current trend</p>
            <div className="mt-3 flex items-end gap-2">
              {months.slice(-4).map((month, index) => (
                <div key={month.label} className="flex w-full flex-col items-center gap-2">
                  <div className="w-full rounded-t-lg bg-primary-100" style={{ height: `${Math.max(30, (month.revenue / 320000) * 100)}px` }} />
                  <span className="text-[10px] text-slate-500">{month.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaymentTable({ payments, onView, onDelete, onRefund, onOpenMenu, openActionId }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            <th className="px-4 py-3">Transaction ID</th>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Instructor</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Method</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Enrollment</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-t border-slate-200 align-middle text-sm text-slate-700">
              <td className="px-4 py-4 font-medium text-slate-900">{payment.transactionId}</td>
              <td className="px-4 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{payment.studentName}</p>
                  <p className="truncate text-xs text-slate-500">{payment.studentEmail}</p>
                </div>
              </td>
              <td className="px-4 py-4 text-slate-700">{payment.courseName}</td>
              <td className="px-4 py-4 text-slate-700">{payment.instructorName}</td>
              <td className="px-4 py-4 font-semibold text-slate-900">{formatCurrency(payment.amount)}</td>
              <td className="px-4 py-4 text-slate-700">{payment.paymentMethod}</td>
              <td className="px-4 py-4 text-slate-700">{formatDateLabel(payment.paymentDate)}</td>
              <td className="px-4 py-4"><PaymentStatusBadge status={payment.status} /></td>
              <td className="px-4 py-4">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 capitalize">{payment.enrollmentStatus}</span>
              </td>
              <td className="px-4 py-4">
                <div className="relative flex justify-end gap-2">
                  <button type="button" aria-label={`View ${payment.transactionId}`} onClick={() => onView(payment)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><Eye className="h-4 w-4" aria-hidden="true" /></button>
                  <button type="button" aria-label={`Open actions for ${payment.transactionId}`} onClick={() => onOpenMenu(payment.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></button>
                  {openActionId === payment.id && (
                    <div role="menu" aria-label={`Actions for ${payment.transactionId}`} className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                      <button type="button" onClick={() => onView(payment)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">View</button>
                      <button type="button" onClick={() => onView(payment)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">View Student</button>
                      <button type="button" onClick={() => onView(payment)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">View Course</button>
                      <button type="button" onClick={() => onRefund(payment)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Refund</button>
                      <button type="button" onClick={() => onDelete(payment)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">Delete Record</button>
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

function PaymentMobileCard({ payment, onView, onDelete, onRefund, onOpenMenu, openActionId }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{payment.transactionId}</p>
          <p className="mt-1 text-sm text-slate-600">{payment.studentName}</p>
        </div>
        <div className="relative">
          <button type="button" aria-label={`Open actions for ${payment.transactionId}`} onClick={() => onOpenMenu(payment.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></button>
          {openActionId === payment.id && (
            <div role="menu" aria-label={`Actions for ${payment.transactionId}`} className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              <button type="button" onClick={() => onView(payment)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">View Payment</button>
              <button type="button" onClick={() => onRefund(payment)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Refund</button>
              <button type="button" onClick={() => onDelete(payment)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">Delete</button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Course</span><span className="text-right font-medium text-slate-800">{payment.courseName}</span></div>
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Amount</span><span className="font-semibold text-slate-900">{formatCurrency(payment.amount)}</span></div>
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Method</span><span>{payment.paymentMethod}</span></div>
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Date</span><span>{formatDateLabel(payment.paymentDate)}</span></div>
        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Status</span><PaymentStatusBadge status={payment.status} /></div>
      </div>

      <div className="mt-4">
        <Button type="button" variant="outline" className="w-full" onClick={() => onView(payment)}>View Payment</Button>
      </div>
    </div>
  );
}

function PaymentPagination({ currentPage, totalPages, totalPayments, onPageChange }) {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * PAYMENT_PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAYMENT_PAGE_SIZE, totalPayments);

  return (
    <div className="flex flex-col gap-4 rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">Showing <span className="font-semibold text-slate-900">{startIndex}–{endIndex}</span> of <span className="font-semibold text-slate-900">{formatNumber(totalPayments)}</span> payments</p>
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

function PaymentEmptyState({ onReset }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Search className="h-6 w-6" aria-hidden="true" /></div>
      <h3 className="mt-5 text-xl font-bold text-slate-900">No payments found</h3>
      <p className="mt-2 text-sm text-slate-600">Try adjusting your search or filters.</p>
      <div className="mt-5 flex justify-center"><Button type="button" variant="outline" onClick={onReset}>Reset Filters</Button></div>
    </div>
  );
}

function PaymentManagementClient() {
  const [payments, setPayments] = React.useState(adminPayments);
  const [search, setSearch] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [methodFilter, setMethodFilter] = React.useState("all");
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [instructorFilter, setInstructorFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("all");
  const [amountRange, setAmountRange] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedPayment, setSelectedPayment] = React.useState(null);
  const [paymentToRefund, setPaymentToRefund] = React.useState(null);
  const [paymentToDelete, setPaymentToDelete] = React.useState(null);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = React.useState(false);
  const [openActionId, setOpenActionId] = React.useState(null);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [newPaymentForm, setNewPaymentForm] = React.useState({
    student: "",
    course: "",
    amount: "",
    paymentMethod: "Card",
    paymentDate: new Date().toISOString().slice(0, 10),
    status: "successful",
    transactionId: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = React.useState({});

  const refundReasonOptions = [
    "Student Request",
    "Duplicate Payment",
    "Course Cancelled",
    "Technical Issue",
    "Other",
  ];

  const [refundForm, setRefundForm] = React.useState({
    reason: "Student Request",
    confirmation: false,
  });

  React.useEffect(() => {
    setOpenActionId(null);
  }, [search, activeTab, statusFilter, methodFilter, courseFilter, instructorFilter, dateRange, amountRange, sortBy, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab, statusFilter, methodFilter, courseFilter, instructorFilter, dateRange, amountRange]);

  React.useEffect(() => {
    if (!statusMessage) return undefined;
    const timer = window.setTimeout(() => setStatusMessage(""), 2600);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[role='menu']") && !event.target.closest('[aria-label*="Open actions"]')) {
        setOpenActionId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const courseOptions = React.useMemo(() => {
    return [...new Map(payments.map((item) => [item.courseName, item.courseName])).values()];
  }, [payments]);

  const instructorOptions = React.useMemo(() => {
    return [...new Map(payments.map((item) => [item.instructorName, item.instructorName])).values()];
  }, [payments]);

  const filteredPayments = React.useMemo(() => {
    const term = search.trim().toLowerCase();

    let results = [...payments];

    if (activeTab !== "all") {
      results = results.filter((payment) => payment.status === activeTab);
    }

    if (statusFilter !== "all") {
      results = results.filter((payment) => payment.status === statusFilter);
    }

    if (methodFilter !== "all") {
      results = results.filter((payment) => payment.paymentMethod === methodFilter);
    }

    if (courseFilter !== "all") {
      results = results.filter((payment) => payment.courseName === courseFilter);
    }

    if (instructorFilter !== "all") {
      results = results.filter((payment) => payment.instructorName === instructorFilter);
    }

    if (term) {
      results = results.filter((payment) => {
        const searchableText = [
          payment.transactionId,
          payment.studentName,
          payment.studentEmail,
          payment.courseName,
        ]
          .join(" ")
          .toLowerCase();
        return searchableText.includes(term);
      });
    }

    if (dateRange !== "all") {
      const today = new Date();
      results = results.filter((payment) => {
        const paymentDate = new Date(`${payment.paymentDate}T00:00:00`);
        const diffDays = Math.max(0, (today - paymentDate) / (1000 * 60 * 60 * 24));
        if (dateRange === "today") return diffDays === 0;
        if (dateRange === "7") return diffDays <= 7;
        if (dateRange === "30") return diffDays <= 30;
        if (dateRange === "month") return paymentDate.getMonth() === today.getMonth() && paymentDate.getFullYear() === today.getFullYear();
        return true;
      });
    }

    if (amountRange !== "all") {
      results = results.filter((payment) => {
        if (amountRange === "under-500") return payment.amount < 500;
        if (amountRange === "500-1000") return payment.amount >= 500 && payment.amount <= 1000;
        if (amountRange === "1000-5000") return payment.amount > 1000 && payment.amount <= 5000;
        if (amountRange === "above-5000") return payment.amount > 5000;
        return true;
      });
    }

    switch (sortBy) {
      case "newest":
        results.sort((a, b) => getDateValue(b.paymentDate) - getDateValue(a.paymentDate));
        break;
      case "oldest":
        results.sort((a, b) => getDateValue(a.paymentDate) - getDateValue(b.paymentDate));
        break;
      case "amount-desc":
        results.sort((a, b) => b.amount - a.amount);
        break;
      case "amount-asc":
        results.sort((a, b) => a.amount - b.amount);
        break;
      case "student-asc":
        results.sort((a, b) => a.studentName.localeCompare(b.studentName));
        break;
      case "course-asc":
        results.sort((a, b) => a.courseName.localeCompare(b.courseName));
        break;
      default:
        break;
    }

    return results;
  }, [payments, search, activeTab, statusFilter, methodFilter, courseFilter, instructorFilter, dateRange, amountRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PAYMENT_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPayments = filteredPayments.slice((safePage - 1) * PAYMENT_PAGE_SIZE, safePage * PAYMENT_PAGE_SIZE);

  React.useEffect(() => {
    if (safePage !== currentPage) setCurrentPage(safePage);
  }, [safePage, currentPage]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setMethodFilter("all");
    setCourseFilter("all");
    setInstructorFilter("all");
    setDateRange("all");
    setAmountRange("all");
    setSortBy("newest");
    setActiveTab("all");
    setCurrentPage(1);
  };

  const handleExportCsv = () => {
    const csvRows = [
      ["Transaction ID", "Student", "Email", "Course", "Instructor", "Amount", "Method", "Date", "Status", "Enrollment ID"],
      ...filteredPayments.map((payment) => [
        payment.transactionId,
        payment.studentName,
        payment.studentEmail,
        payment.courseName,
        payment.instructorName,
        payment.amount,
        payment.paymentMethod,
        payment.paymentDate,
        payment.status,
        payment.enrollmentId,
      ]),
    ];

    const csvContent = csvRows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "admin-payments.csv";
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Payments exported in CSV format.");
  };

  const openPaymentDetails = (payment) => setSelectedPayment(payment);

  const handleAddPaymentSubmit = () => {
    const errors = {};
    if (!newPaymentForm.student.trim()) errors.student = "Student is required.";
    if (!newPaymentForm.course.trim()) errors.course = "Course is required.";
    const amountValue = Number(newPaymentForm.amount);
    if (!amountValue || amountValue <= 0) errors.amount = "Amount must be greater than 0.";
    if (!newPaymentForm.paymentMethod) errors.paymentMethod = "Payment method is required.";
    if (!newPaymentForm.status) errors.status = "Status is required.";
    if (!newPaymentForm.transactionId.trim()) errors.transactionId = "Transaction ID is required.";
    if (payments.some((payment) => payment.transactionId.toLowerCase() === newPaymentForm.transactionId.trim().toLowerCase())) {
      errors.transactionId = "Transaction ID must be unique.";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const instructorName = payments.find((payment) => payment.courseName === newPaymentForm.course)?.instructorName || "Assigned Instructor";
    const createdPayment = {
      id: `pay-${String(payments.length + 1).padStart(3, "0")}`,
      transactionId: newPaymentForm.transactionId.trim(),
      studentId: `stu-${String(payments.length + 1).padStart(3, "0")}`,
      studentName: newPaymentForm.student.trim(),
      studentEmail: `${newPaymentForm.student.trim().toLowerCase().replace(/\s+/g, ".")}@example.com`,
      courseId: `course-${String(payments.length + 1).padStart(3, "0")}`,
      courseName: newPaymentForm.course.trim(),
      instructorId: `inst-${String(payments.length + 1).padStart(3, "0")}`,
      instructorName,
      amount: Number(newPaymentForm.amount),
      currency: "INR",
      paymentMethod: newPaymentForm.paymentMethod,
      status: newPaymentForm.status,
      paymentDate: newPaymentForm.paymentDate,
      paymentTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }),
      enrollmentId: `ENR-${newPaymentForm.paymentDate.replace(/-/g, "")}-${String(payments.length + 1).padStart(5, "0")}`,
      enrollmentStatus: newPaymentForm.status === "successful" ? "active" : "pending",
      progress: newPaymentForm.status === "successful" ? 15 : 0,
      paymentReference: `REF-${String(Date.now()).slice(-6)}`,
      gatewayReference: `MOCK-GW-${String(Date.now()).slice(-6)}`,
      invoiceNumber: `INV-${newPaymentForm.paymentDate.replace(/-/g, "")}-${String(payments.length + 1).padStart(5, "0")}`,
      refund: null,
      failureReason: newPaymentForm.status === "failed" ? "Manual review required" : null,
      paymentAttempt: 1,
      lastAttemptDate: newPaymentForm.paymentDate,
      enrollmentDate: newPaymentForm.paymentDate,
      certificateStatus: "Not Issued",
      notes: newPaymentForm.notes.trim() || "Manual payment record added in demo environment.",
    };

    setPayments((current) => [createdPayment, ...current]);
    setIsAddPaymentOpen(false);
    setNewPaymentForm({
      student: "",
      course: "",
      amount: "",
      paymentMethod: "Card",
      paymentDate: new Date().toISOString().slice(0, 10),
      status: "successful",
      transactionId: "",
      notes: "",
    });
    setFormErrors({});
    setStatusMessage("Payment added to the demo environment.");
  };

  const handleRefundSubmit = () => {
    if (!paymentToRefund || !refundForm.confirmation) return;

    setPayments((current) =>
      current.map((payment) => {
        if (payment.id !== paymentToRefund.id) return payment;
        return {
          ...payment,
          status: "refunded",
          refund: {
            refundId: `RFND-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Date.now()).slice(-4)}`,
            amount: payment.amount,
            date: new Date().toISOString().slice(0, 10),
            reason: refundForm.reason,
            status: "processed",
          },
          enrollmentStatus: "cancelled",
          progress: 0,
        };
      })
    );

    setPaymentToRefund(null);
    setRefundForm({ reason: "Student Request", confirmation: false });
    setStatusMessage("Payment marked as refunded in the demo environment.");
  };

  const handleDelete = () => {
    if (!paymentToDelete) return;
    setPayments((current) => current.filter((payment) => payment.id !== paymentToDelete.id));
    setPaymentToDelete(null);
    setStatusMessage("Payment record deleted from the demo environment.");
  };

  const handleStatusToggle = () => {
    if (!paymentToRefund) return;
    setPaymentToRefund(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/admin/dashboard" className="hover:text-primary-600">Admin</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-slate-900">Payments</span>
        </nav>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Transactions</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Payment Management</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">Manage course payments, transactions, refunds, payment status, and payment records from one place.</p>
          </div>

          <Button type="button" variant="outline" onClick={handleExportCsv} leftIcon={<Download className="h-4 w-4" aria-hidden="true" />}>
            Export Payments
          </Button>
        </div>
      </div>

      {statusMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">{statusMessage}</div> : null}

      <PaymentStats payments={payments} />

      <RevenueOverview payments={payments} />

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600"><CreditCard className="h-4 w-4" aria-hidden="true" /><span className="text-sm font-medium">Payment records</span></div>
          <Button type="button" variant="default" onClick={() => setIsAddPaymentOpen(true)} leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}>
            Add Payment
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
            <div className="flex-1">
              <label htmlFor="payment-search" className="mb-2 block text-sm font-medium text-slate-700">Search payments</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input id="payment-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by transaction ID, student, course..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={resetFilters} leftIcon={<Filter className="h-4 w-4" aria-hidden="true" />}>Reset Filters</Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            <div>
              <label htmlFor="statusFilter" className="mb-2 block text-sm font-medium text-slate-700">Payment Status</label>
              <div className="relative">
                <select id="statusFilter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>

            <div>
              <label htmlFor="methodFilter" className="mb-2 block text-sm font-medium text-slate-700">Payment Method</label>
              <div className="relative">
                <select id="methodFilter" value={methodFilter} onChange={(event) => setMethodFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {methodOptions.map((option) => (
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
              <label htmlFor="dateRange" className="mb-2 block text-sm font-medium text-slate-700">Date Range</label>
              <div className="relative">
                <select id="dateRange" value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {dateRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>

            <div>
              <label htmlFor="amountRange" className="mb-2 block text-sm font-medium text-slate-700">Amount</label>
              <div className="relative">
                <select id="amountRange" value={amountRange} onChange={(event) => setAmountRange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {amountRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="min-w-[180px]">
              <label htmlFor="sortBy" className="mb-2 block text-sm font-medium text-slate-700">Sort</label>
              <div className="relative">
                <select id="sortBy" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5"><div className="border-b border-slate-200" />
          <nav aria-label="Payment tabs" className="mt-4 flex flex-wrap gap-2">
            {tabOptions.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                aria-pressed={activeTab === tab.key}
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

      <section className="space-y-4">
        {filteredPayments.length === 0 ? (
          <PaymentEmptyState onReset={resetFilters} />
        ) : (
          <>
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <PaymentTable
                payments={paginatedPayments}
                onView={openPaymentDetails}
                onDelete={setPaymentToDelete}
                onRefund={setPaymentToRefund}
                onOpenMenu={setOpenActionId}
                openActionId={openActionId}
              />

              {paginatedPayments.map((payment) => (
                <PaymentMobileCard
                  key={payment.id}
                  payment={payment}
                  onView={openPaymentDetails}
                  onDelete={setPaymentToDelete}
                  onRefund={setPaymentToRefund}
                  onOpenMenu={setOpenActionId}
                  openActionId={openActionId}
                />
              ))}
            </div>

            <PaymentPagination currentPage={safePage} totalPages={totalPages} totalPayments={filteredPayments.length} onPageChange={setCurrentPage} />
          </>
        )}
      </section>

      <ModalShell open={Boolean(selectedPayment)} title="Payment Details" onClose={() => setSelectedPayment(null)} width="max-w-5xl">
        {selectedPayment ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Transaction</p>
                <h4 className="mt-2 text-2xl font-bold text-slate-900">{selectedPayment.transactionId}</h4>
              </div>
              <PaymentStatusBadge status={selectedPayment.status} />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-4 text-lg font-semibold text-slate-900">Payment Information</h5>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Transaction ID</dt><dd className="font-medium text-slate-900">{selectedPayment.transactionId}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Payment Date</dt><dd className="font-medium text-slate-900">{formatDateLabel(selectedPayment.paymentDate)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Payment Time</dt><dd className="font-medium text-slate-900">{selectedPayment.paymentTime}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Amount</dt><dd className="font-medium text-slate-900">{formatCurrency(selectedPayment.amount)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Currency</dt><dd className="font-medium text-slate-900">{selectedPayment.currency}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Payment Method</dt><dd className="font-medium text-slate-900">{selectedPayment.paymentMethod}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Payment Status</dt><dd className="font-medium text-slate-900"><PaymentStatusBadge status={selectedPayment.status} /></dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Payment Reference</dt><dd className="font-medium text-slate-900">{selectedPayment.paymentReference}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Gateway Reference</dt><dd className="font-medium text-slate-900">{selectedPayment.gatewayReference}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Invoice Number</dt><dd className="font-medium text-slate-900">{selectedPayment.invoiceNumber}</dd></div>
                </dl>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-4 text-lg font-semibold text-slate-900">Student Information</h5>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Student Name</dt><dd className="font-medium text-slate-900">{selectedPayment.studentName}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-900">{selectedPayment.studentEmail}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Student ID</dt><dd className="font-medium text-slate-900">{selectedPayment.studentId}</dd></div>
                </dl>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-4 text-lg font-semibold text-slate-900">Course Information</h5>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Course Name</dt><dd className="font-medium text-slate-900">{selectedPayment.courseName}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Course ID</dt><dd className="font-medium text-slate-900">{selectedPayment.courseId}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Instructor</dt><dd className="font-medium text-slate-900">{selectedPayment.instructorName}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Course Price</dt><dd className="font-medium text-slate-900">{formatCurrency(selectedPayment.amount)}</dd></div>
                </dl>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-4 text-lg font-semibold text-slate-900">Enrollment Information</h5>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Enrollment ID</dt><dd className="font-medium text-slate-900">{selectedPayment.enrollmentId}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Enrollment Date</dt><dd className="font-medium text-slate-900">{formatDateLabel(selectedPayment.enrollmentDate)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Current Status</dt><dd className="font-medium text-slate-900 capitalize">{selectedPayment.enrollmentStatus}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Course Progress</dt><dd className="font-medium text-slate-900">{selectedPayment.progress}%</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Certificate</dt><dd className="font-medium text-slate-900">{selectedPayment.certificateStatus}</dd></div>
                </dl>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h5 className="mb-4 text-lg font-semibold text-slate-900">Refund Information</h5>
              {selectedPayment.refund ? (
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Refund ID</dt><dd className="font-medium text-slate-900">{selectedPayment.refund.refundId}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Refund Amount</dt><dd className="font-medium text-slate-900">{formatCurrency(selectedPayment.refund.amount)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Refund Date</dt><dd className="font-medium text-slate-900">{formatDateLabel(selectedPayment.refund.date)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Refund Reason</dt><dd className="font-medium text-slate-900">{selectedPayment.refund.reason}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Refund Status</dt><dd className="font-medium text-slate-900">{selectedPayment.refund.status}</dd></div>
                </dl>
              ) : (
                <p className="text-sm text-slate-600">No refund has been issued.</p>
              )}
            </div>

            {selectedPayment.status === "failed" && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <h5 className="mb-3 text-lg font-semibold text-red-900">Failure Information</h5>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-red-700">Failure Reason</dt><dd className="font-medium text-red-900">{selectedPayment.failureReason}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-red-700">Attempt</dt><dd className="font-medium text-red-900">{selectedPayment.paymentAttempt} of 3</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-red-700">Last Attempted Date</dt><dd className="font-medium text-red-900">{formatDateLabel(selectedPayment.lastAttemptDate)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-red-700">Payment Method</dt><dd className="font-medium text-red-900">{selectedPayment.paymentMethod}</dd></div>
                </dl>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setSelectedPayment(null)}>Close</Button>
              <Link href="/admin/enrollments" className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20">View Enrollment</Link>
              <Link href="/admin/students" className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20">View Student</Link>
              <Link href={`/courses/${selectedPayment.courseName.toLowerCase().replace(/\s+/g, "-")}`} className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20">View Course</Link>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(paymentToRefund)} title="Refund Payment" onClose={() => setPaymentToRefund(null)} width="max-w-xl">
        {paymentToRefund ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Transaction ID</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{paymentToRefund.transactionId}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Original Amount</p>
                <p className="mt-2 text-xl font-bold text-slate-900">{formatCurrency(paymentToRefund.amount)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Refund Amount</p>
                <p className="mt-2 text-xl font-bold text-slate-900">{formatCurrency(paymentToRefund.amount)}</p>
              </div>
            </div>

            <div>
              <label htmlFor="refundReason" className="mb-2 block text-sm font-medium text-slate-700">Refund Reason</label>
              <select id="refundReason" value={refundForm.reason} onChange={(event) => setRefundForm((current) => ({ ...current, reason: event.target.value }))} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {refundReasonOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <input type="checkbox" checked={refundForm.confirmation} onChange={(event) => setRefundForm((current) => ({ ...current, confirmation: event.target.checked }))} className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <span>I confirm that this refund action is intentional.</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setPaymentToRefund(null)}>Cancel</Button>
              <Button type="button" variant="default" onClick={handleRefundSubmit} disabled={!refundForm.confirmation}>Process Refund</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={isAddPaymentOpen} title="Add Payment" onClose={() => { setIsAddPaymentOpen(false); setFormErrors({}); }} width="max-w-2xl">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="student" className="mb-2 block text-sm font-medium text-slate-700">Student</label>
              <input id="student" value={newPaymentForm.student} onChange={(event) => { setNewPaymentForm((current) => ({ ...current, student: event.target.value })); if (formErrors.student) setFormErrors((current) => ({ ...current, student: "" })); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Student name" />
              {formErrors.student ? <p className="mt-1 text-xs text-red-600">{formErrors.student}</p> : null}
            </div>

            <div>
              <label htmlFor="course" className="mb-2 block text-sm font-medium text-slate-700">Course</label>
              <input id="course" value={newPaymentForm.course} onChange={(event) => { setNewPaymentForm((current) => ({ ...current, course: event.target.value })); if (formErrors.course) setFormErrors((current) => ({ ...current, course: "" })); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Course name" />
              {formErrors.course ? <p className="mt-1 text-xs text-red-600">{formErrors.course}</p> : null}
            </div>

            <div>
              <label htmlFor="amount" className="mb-2 block text-sm font-medium text-slate-700">Amount</label>
              <input id="amount" type="number" min="1" value={newPaymentForm.amount} onChange={(event) => { setNewPaymentForm((current) => ({ ...current, amount: event.target.value })); if (formErrors.amount) setFormErrors((current) => ({ ...current, amount: "" })); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="e.g. 4999" />
              {formErrors.amount ? <p className="mt-1 text-xs text-red-600">{formErrors.amount}</p> : null}
            </div>

            <div>
              <label htmlFor="newPaymentMethod" className="mb-2 block text-sm font-medium text-slate-700">Payment Method</label>
              <select id="newPaymentMethod" value={newPaymentForm.paymentMethod} onChange={(event) => { setNewPaymentForm((current) => ({ ...current, paymentMethod: event.target.value })); if (formErrors.paymentMethod) setFormErrors((current) => ({ ...current, paymentMethod: "" })); }} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {methodOptions.filter((option) => option.value !== "all").map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {formErrors.paymentMethod ? <p className="mt-1 text-xs text-red-600">{formErrors.paymentMethod}</p> : null}
            </div>

            <div>
              <label htmlFor="paymentDate" className="mb-2 block text-sm font-medium text-slate-700">Payment Date</label>
              <input id="paymentDate" type="date" value={newPaymentForm.paymentDate} onChange={(event) => setNewPaymentForm((current) => ({ ...current, paymentDate: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>

            <div>
              <label htmlFor="newPaymentStatus" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select id="newPaymentStatus" value={newPaymentForm.status} onChange={(event) => { setNewPaymentForm((current) => ({ ...current, status: event.target.value })); if (formErrors.status) setFormErrors((current) => ({ ...current, status: "" })); }} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              {formErrors.status ? <p className="mt-1 text-xs text-red-600">{formErrors.status}</p> : null}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="transactionId" className="mb-2 block text-sm font-medium text-slate-700">Transaction ID</label>
              <input id="transactionId" value={newPaymentForm.transactionId} onChange={(event) => { setNewPaymentForm((current) => ({ ...current, transactionId: event.target.value })); if (formErrors.transactionId) setFormErrors((current) => ({ ...current, transactionId: "" })); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="TXN-EDU-20001" />
              {formErrors.transactionId ? <p className="mt-1 text-xs text-red-600">{formErrors.transactionId}</p> : null}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="paymentNotes" className="mb-2 block text-sm font-medium text-slate-700">Notes</label>
              <textarea id="paymentNotes" value={newPaymentForm.notes} onChange={(event) => setNewPaymentForm((current) => ({ ...current, notes: event.target.value }))} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Optional notes" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => { setIsAddPaymentOpen(false); setFormErrors({}); }}>Cancel</Button>
            <Button type="button" onClick={handleAddPaymentSubmit}>Add Payment</Button>
          </div>
        </div>
      </ModalShell>

      <ModalShell open={Boolean(paymentToDelete)} title="Delete Payment Record?" onClose={() => setPaymentToDelete(null)} width="max-w-md">
        {paymentToDelete ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">This removes the payment record from the current demo data only. It does not reverse or modify a real transaction.</p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Transaction</p>
              <p className="mt-2 font-semibold text-slate-900">{paymentToDelete.transactionId}</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setPaymentToDelete(null)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDelete}>Delete Record</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>
    </div>
  );
}

export default PaymentManagementClient;
