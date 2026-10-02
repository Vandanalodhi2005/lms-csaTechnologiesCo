"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/utils";
import Button from "@/components/ui/Button.jsx";
import Badge from "@/components/ui/Badge.jsx";
import { reportDataByRange } from "@/constants/adminReports.js";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  BookCopy,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Clock3,
  Download,
  Filter,
  GraduationCap,
  Layers3,
  MessageSquareText,
  Star,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";

const dateRangeOptions = [
  { value: "today", label: "Today" },
  { value: "last7Days", label: "Last 7 Days" },
  { value: "last30Days", label: "Last 30 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "last3Months", label: "Last 3 Months" },
  { value: "thisYear", label: "This Year" },
  { value: "custom", label: "Custom Range" },
];

const metricCardConfig = [
  { key: "totalUsers", label: "Total Users", icon: Users, tone: "primary" },
  { key: "activeStudents", label: "Active Students", icon: GraduationCap, tone: "success" },
  { key: "totalInstructors", label: "Total Instructors", icon: UserPlus, tone: "info" },
  { key: "totalCourses", label: "Total Courses", icon: BookOpen, tone: "secondary" },
  { key: "totalEnrollments", label: "Total Enrollments", icon: Layers3, tone: "warning" },
  { key: "totalRevenue", label: "Total Revenue", icon: Wallet, tone: "danger" },
];

const chartColors = {
  primary: "#1d4ed8",
  secondary: "#0ea5e9",
  accent: "#22c55e",
  amber: "#f59e0b",
  rose: "#ef4444",
  slate: "#cbd5e1",
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

function formatCompactCurrency(value) {
  const amount = Number(value || 0);
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(1)}L`;
  }
  return formatCurrency(amount);
}

function getPercentBadge(value) {
  const signed = Number(value || 0);
  return signed >= 0 ? `+${signed.toFixed(1)}%` : `${signed.toFixed(1)}%`;
}

function getArrayByRangeValue(rangeKey) {
  if (rangeKey in reportDataByRange) return reportDataByRange[rangeKey];
  return reportDataByRange.thisMonth;
}

function buildSvgPath(values, width, height, padding) {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = (width - padding * 2) / Math.max(values.length - 1, 1);

  return values
    .map((value, index) => {
      const x = padding + index * stepX;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

function buildAreaPath(values, width, height, padding) {
  const linePath = buildSvgPath(values, width, height, padding);
  if (!linePath) return "";
  const lastX = width - padding;
  const firstX = padding;
  const baseline = height - padding;
  return `${linePath} L ${lastX},${baseline} L ${firstX},${baseline} Z`;
}

function getTrendSummary(data, exampleLabel, formatter) {
  if (!data || data.length < 2) return `${exampleLabel} is available in the demo dataset.`;
  const first = data[0];
  const last = data[data.length - 1];
  const firstValue = first.value ?? first.revenue ?? first.totalUsers ?? 0;
  const lastValue = last.value ?? last.revenue ?? last.totalUsers ?? 0;
  return `${exampleLabel} increased from ${formatter(firstValue)} in ${first.month || "April"} to ${formatter(lastValue)} in ${last.month || "October"} in the demo dataset.`;
}

function DemoNotice({ visible, onDismiss }) {
  if (!visible) return null;

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
      <div>
        <p className="font-semibold">Demo analytics</p>
        <p className="mt-1 text-blue-700">These reports currently use sample data and are not connected to production analytics.</p>
      </div>
      <button
        type="button"
        aria-label="Dismiss demo analytics notice"
        onClick={onDismiss}
        className="rounded-full p-1 text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function StatCard({ label, value, change, comparison, icon: Icon, tone }) {
  const toneMap = {
    primary: "bg-primary-50 text-primary-700",
    success: "bg-emerald-50 text-emerald-700",
    info: "bg-cyan-50 text-cyan-700",
    secondary: "bg-slate-100 text-slate-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
  };

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
        </div>
        <div className={cn("rounded-xl p-2.5", toneMap[tone] || toneMap.primary)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          {change}
        </span>
        <span className="text-slate-500">{comparison}</span>
      </div>
    </article>
  );
}

function RangeSelector({ value, onChange, onCustomOpen }) {
  return (
    <div className="relative">
      <label htmlFor="report-range" className="sr-only">
        Select report date range
      </label>
      <select
        id="report-range"
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (nextValue === "custom") {
            onCustomOpen();
          }
          onChange(nextValue);
        }}
        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
      >
        {dateRangeOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
    </div>
  );
}

function MiniLineChart({ data, field, color = chartColors.primary, label }) {
  const values = data.map((item) => Number(item[field] ?? 0));
  const width = 420;
  const height = 140;
  const padding = 18;
  const linePath = buildSvgPath(values, width, height, padding);
  const areaPath = buildAreaPath(values, width, height, padding);
  const labels = data.map((item) => item.month || item.label || "");

  if (!data.length) {
    return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No data available</div>;
  }

  return (
    <div className="space-y-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-40 w-full overflow-hidden"
        role="img"
        aria-label={label}
      >
        <defs>
          <linearGradient id={`area-${field}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.04" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1={padding}
            x2={width - padding}
            y1={padding + line * 28}
            y2={padding + line * 28}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
        ))}
        {areaPath ? <path d={areaPath} fill={`url(#area-${field})`} /> : null}
        {linePath ? <path d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> : null}
      </svg>
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
        {labels.map((labelItem) => (
          <span key={labelItem} className="truncate">{labelItem}</span>
        ))}
      </div>
    </div>
  );
}

function RevenueOverview({ data, totalRevenue, previousRevenue, growth }) {
  const values = data.map((item) => item.revenue);
  const width = 520;
  const height = 200;
  const padding = 24;
  const linePath = buildSvgPath(values, width, height, padding);
  const areaPath = buildAreaPath(values, width, height, padding);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Revenue Overview</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Revenue Overview</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
          {['Daily', 'Weekly', 'Monthly'].map((period) => (
            <button
              key={period}
              type="button"
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition",
                period === 'Monthly' ? "bg-white text-primary-700 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-900"
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
        <div>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Revenue</p>
              <p className="text-3xl font-black tracking-tight text-slate-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-slate-500">Previous Period</p>
              <p className="text-lg font-semibold text-slate-800">{formatCurrency(previousRevenue)}</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-3">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-52 w-full overflow-hidden" role="img" aria-label="Revenue increased from ₹4.2 lakh in April to ₹9.3 lakh in October in the demo dataset.">
              <defs>
                <linearGradient id="revenueArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.04" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((tick) => (
                <line key={tick} x1={padding} x2={width - padding} y1={padding + tick * 35} y2={padding + tick * 35} stroke="#e2e8f0" strokeDasharray="4 4" />
              ))}
              {areaPath ? <path d={areaPath} fill="url(#revenueArea)" /> : null}
              {linePath ? <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> : null}
              {values.map((value, index) => {
                const min = Math.min(...values);
                const max = Math.max(...values);
                const range = max - min || 1;
                const x = padding + index * ((width - padding * 2) / Math.max(values.length - 1, 1));
                const y = height - padding - ((value - min) / range) * (height - padding * 2);
                return <circle key={`${value}-${index}`} cx={x} cy={y} r="4" fill="#2563eb" stroke="#fff" strokeWidth="2" />;
              })}
            </svg>
            <div className="mt-3 grid grid-cols-7 gap-2 text-center text-[11px] text-slate-500">
              {data.map((item) => (
                <span key={item.month}>{item.month}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Growth</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-700">
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              {growth}
            </span>
          </div>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
              <span>April</span>
              <span className="font-semibold text-slate-900">₹4.2L</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
              <span>July</span>
              <span className="font-semibold text-slate-900">₹6.4L</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
              <span>October</span>
              <span className="font-semibold text-slate-900">₹9.3L</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UserGrowthChart({ data }) {
  const values = data.map((item) => Number(item.totalUsers || 0));
  const width = 480;
  const height = 180;
  const padding = 20;
  const linePath = buildSvgPath(values, width, height, padding);
  const areaPath = buildAreaPath(values, width, height, padding);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">User Growth</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">User Growth</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <div>
          <div className="mb-4 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Total Users</p><p className="mt-1 font-semibold text-slate-900">{formatNumber(data[data.length - 1]?.totalUsers || 0)}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">New Users</p><p className="mt-1 font-semibold text-slate-900">{formatNumber(data[data.length - 1]?.newUsers || 0)}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Active Users</p><p className="mt-1 font-semibold text-slate-900">{formatNumber(data[data.length - 1]?.activeUsers || 0)}</p></div>
          </div>
          <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full overflow-hidden" role="img" aria-label="User growth trend increased from 18,200 users in April to 24,580 users in October in the demo dataset.">
            <defs>
              <linearGradient id="userGrowthArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((tick) => (
              <line key={tick} x1={padding} x2={width - padding} y1={padding + tick * 30} y2={padding + tick * 30} stroke="#e2e8f0" strokeDasharray="4 4" />
            ))}
            {areaPath ? <path d={areaPath} fill="url(#userGrowthArea)" /> : null}
            {linePath ? <path d={linePath} fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> : null}
          </svg>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Trend</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {data.map((item) => (
              <li key={item.month} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
                <span>{item.month}</span>
                <span className="font-semibold text-slate-900">{formatNumber(item.totalUsers)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function EnrollmentOverview({ data }) {
  const monthLabels = data.map((item) => item.month);
  const total = data[data.length - 1]?.total || 0;
  const newEnrollments = data[data.length - 1]?.total || 0;
  const completed = data[data.length - 1]?.completed || 0;
  const active = data[data.length - 1]?.active || 0;

  const width = 500;
  const height = 180;
  const padding = 20;
  const values = data.map((item) => item.total);
  const values2 = data.map((item) => item.completed);
  const values3 = data.map((item) => item.active);
  const linePath = buildSvgPath(values, width, height, padding);
  const linePath2 = buildSvgPath(values2, width, height, padding);
  const linePath3 = buildSvgPath(values3, width, height, padding);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Enrollment Overview</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Enrollment Overview</h2>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-3"><p className="text-sm text-slate-500">Total Enrollments</p><p className="mt-1 text-xl font-bold text-slate-900">{formatNumber(total)}</p></div>
        <div className="rounded-2xl bg-slate-50 p-3"><p className="text-sm text-slate-500">New Enrollments</p><p className="mt-1 text-xl font-bold text-slate-900">{formatNumber(newEnrollments)}</p></div>
        <div className="rounded-2xl bg-slate-50 p-3"><p className="text-sm text-slate-500">Completed Courses</p><p className="mt-1 text-xl font-bold text-slate-900">{formatNumber(completed)}</p></div>
        <div className="rounded-2xl bg-slate-50 p-3"><p className="text-sm text-slate-500">Active Learners</p><p className="mt-1 text-xl font-bold text-slate-900">{formatNumber(active)}</p></div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full overflow-hidden" role="img" aria-label="Enrollment trends show monthly enrollments, completed enrollments, and active learner counts in the demo dataset.">
        <defs>
          <linearGradient id="enrollmentMain" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0,1,2,3].map((tick) => (
          <line key={tick} x1={padding} x2={width - padding} y1={padding + tick * 30} y2={padding + tick * 30} stroke="#e2e8f0" strokeDasharray="4 4" />
        ))}
        <path d={buildAreaPath(values, width, height, padding)} fill="url(#enrollmentMain)" opacity="0.8" />
        {linePath ? <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" /> : null}
        {linePath2 ? <path d={linePath2} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" /> : null}
        {linePath3 ? <path d={linePath3} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" /> : null}
      </svg>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary-600" />Monthly Enrollments</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Completed Enrollments</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Active Enrollments</span>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[11px] text-slate-500">
        {monthLabels.map((month) => <span key={month}>{month}</span>)}
      </div>
    </section>
  );
}

function CoursePerformance({ data }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Course Performance</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Course Performance</h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="hidden grid-cols-[minmax(180px,1.6fr)_minmax(110px,1fr)_minmax(90px,0.75fr)_minmax(90px,0.7fr)_minmax(70px,0.5fr)_minmax(90px,0.8fr)] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 md:grid">
          <span>Course</span>
          <span>Instructor</span>
          <span>Enrollments</span>
          <span>Completion</span>
          <span>Rating</span>
          <span>Revenue</span>
        </div>

        {data.map((course) => (
          <div key={course.course} className="grid gap-3 border-t border-slate-200 px-4 py-4 md:grid-cols-[minmax(180px,1.6fr)_minmax(110px,1fr)_minmax(90px,0.75fr)_minmax(90px,0.7fr)_minmax(70px,0.5fr)_minmax(90px,0.8fr)]">
            <div>
              <p className="font-semibold text-slate-900">{course.course}</p>
            </div>
            <div className="text-sm text-slate-600">{course.instructor}</div>
            <div className="text-sm text-slate-700">{formatNumber(course.enrollments)}</div>
            <div className="text-sm text-slate-700">{course.completionRate}%</div>
            <div className="text-sm text-slate-700">{course.rating.toFixed(1)}</div>
            <div className="text-sm font-medium text-slate-900">{formatCurrency(course.revenue)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryPerformance({ data }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Category Performance</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Category Performance</h2>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.category} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{item.category}</h3>
                <p className="mt-1 text-sm text-slate-600">{formatNumber(item.enrollments)} enrollments</p>
              </div>
              <div className="text-sm text-slate-600">{formatCurrency(item.revenue)} revenue</div>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                <span>Completion rate</span>
                <span className="font-medium text-slate-900">{item.completionRate}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-primary-600" style={{ width: `${item.completionRate}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LearnerActivity({ data }) {
  const metrics = [
    { label: "Active Today", value: formatNumber(data.activeToday) },
    { label: "Active This Week", value: formatNumber(data.activeThisWeek) },
    { label: "Active This Month", value: formatNumber(data.activeThisMonth) },
    { label: "Average Learning Hours", value: `${data.averageLearningHours} hrs` },
    { label: "Lessons Completed", value: formatNumber(data.lessonsCompleted) },
    { label: "Quizzes Completed", value: formatNumber(data.quizzesCompleted) },
  ];

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Learner Activity</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Learner Activity</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LearningProgress({ data }) {
  const items = [
    { label: "Not Started", value: data.notStarted, color: "bg-slate-300" },
    { label: "In Progress", value: data.inProgress, color: "bg-primary-500" },
    { label: "Completed", value: data.completed, color: "bg-emerald-500" },
  ];

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Learning Progress</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Learning Progress Overview</h2>
      </div>

      <div className="space-y-4">
        <div className="flex h-4 overflow-hidden rounded-full bg-slate-200">
          {items.map((item) => (
            <div key={item.label} className={cn("h-full", item.color)} style={{ width: `${item.value}%` }} />
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{item.value}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Average Course Completion</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{data.averageCourseCompletion}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Average Quiz Score</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{data.averageQuizScore}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Average Assignment Score</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{data.averageAssignmentScore}%</p>
        </div>
      </div>
    </section>
  );
}

function CertificateAnalytics({ data }) {
  const values = data.byMonth.map((item) => item.value);
  const width = 420;
  const height = 150;
  const padding = 18;
  const linePath = buildSvgPath(values, width, height, padding);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Certificate Overview</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Certificate Overview</h2>
        </div>
        <Link href="/admin/certificates" className="text-sm font-medium text-primary-600 hover:text-primary-700">View Certificates</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-3"><p className="text-sm text-slate-500">Issued</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(data.issued)}</p></div>
            <div className="rounded-2xl bg-slate-50 p-3"><p className="text-sm text-slate-500">Pending</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(data.pending)}</p></div>
            <div className="rounded-2xl bg-slate-50 p-3"><p className="text-sm text-slate-500">Revoked</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(data.revoked)}</p></div>
            <div className="rounded-2xl bg-slate-50 p-3"><p className="text-sm text-slate-500">Expired</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(data.expired)}</p></div>
          </div>
          <svg viewBox={`0 0 ${width} ${height}`} className="h-36 w-full overflow-hidden" role="img" aria-label="Certificates issued by month increased from 110 in April to 390 in October in the demo dataset.">
            <defs>
              <linearGradient id="certificateArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0,1,2,3].map((tick) => (
              <line key={tick} x1={padding} x2={width - padding} y1={padding + tick * 25} y2={padding + tick * 25} stroke="#e2e8f0" strokeDasharray="4 4" />
            ))}
            <path d={buildAreaPath(values, width, height, padding)} fill="url(#certificateArea)" />
            {linePath ? <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" /> : null}
          </svg>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="mb-3 text-slate-500">Certificates by month</p>
          {data.byMonth.map((item) => (
            <div key={item.month} className="mb-2 flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
              <span>{item.month}</span>
              <span className="font-semibold text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewAnalytics({ data }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Review Analytics</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Review & Rating Overview</h2>
        </div>
        <Link href="/admin/reviews" className="text-sm font-medium text-primary-600 hover:text-primary-700">Manage Reviews</Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Average Rating</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">{data.averageRating.toFixed(1)} / 5</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Total Reviews</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(data.totalReviews)}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Pending Reviews</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(data.pendingReviews)}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Reported Reviews</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(data.reportedReviews)}</p></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-4 text-sm text-slate-500">Rating distribution</p>
          <div className="space-y-3">
            {data.ratingDistribution.map((item) => (
              <div key={item.star} className="grid grid-cols-[62px_1fr_40px] items-center gap-3 text-sm text-slate-700">
                <span>{item.star} Stars</span>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${item.percent}%` }} />
                </div>
                <span className="text-right font-medium text-slate-900">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PaymentAnalytics({ data }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Payment Overview</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Payment Overview</h2>
        </div>
        <Link href="/admin/payments" className="text-sm font-medium text-primary-600 hover:text-primary-700">View Payments</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Total Revenue</p><p className="mt-2 text-xl font-bold text-slate-900">{formatCurrency(data.totalRevenue)}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Successful Payments</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(data.successfulPayments)}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Pending Payments</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(data.pendingPayments)}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Refunded</p><p className="mt-2 text-xl font-bold text-slate-900">{formatCurrency(data.refunded)}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Failed</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(data.failed)}</p></div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-4 text-sm text-slate-500">Payment status distribution</p>
        <div className="space-y-3">
          {data.distribution.map((status) => (
            <div key={status.label} className="grid grid-cols-[80px_1fr_40px] items-center gap-3 text-sm text-slate-700">
              <span>{status.label}</span>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-primary-600" style={{ width: `${status.value}%` }} />
              </div>
              <span className="text-right font-medium text-slate-900">{status.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstructorPerformance({ data }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Instructor Performance</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Instructor Performance</h2>
        </div>
        <Link href="/admin/instructors" className="text-sm font-medium text-primary-600 hover:text-primary-700">View Instructors</Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="hidden grid-cols-[minmax(150px,1.4fr)_minmax(80px,0.7fr)_minmax(80px,0.8fr)_minmax(80px,0.7fr)_minmax(80px,0.7fr)_minmax(90px,0.9fr)] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 md:grid">
          <span>Instructor</span>
          <span>Courses</span>
          <span>Students</span>
          <span>Rating</span>
          <span>Completion</span>
          <span>Revenue</span>
        </div>

        {data.map((instructor) => (
          <div key={instructor.instructor} className="grid gap-3 border-t border-slate-200 px-4 py-4 md:grid-cols-[minmax(150px,1.4fr)_minmax(80px,0.7fr)_minmax(80px,0.8fr)_minmax(80px,0.7fr)_minmax(80px,0.7fr)_minmax(90px,0.9fr)]">
            <div className="font-semibold text-slate-900">{instructor.instructor}</div>
            <div className="text-sm text-slate-700">{instructor.courses}</div>
            <div className="text-sm text-slate-700">{formatNumber(instructor.students)}</div>
            <div className="text-sm text-slate-700">{instructor.rating.toFixed(1)}</div>
            <div className="text-sm text-slate-700">{instructor.completionRate}%</div>
            <div className="text-sm font-medium text-slate-900">{formatCurrency(instructor.revenue)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StudentPerformance({ data }) {
  const values = data.completionTrend.map((item) => item.value);
  const width = 400;
  const height = 130;
  const padding = 18;
  const linePath = buildSvgPath(values, width, height, padding);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Student Performance</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Student Learning Performance</h2>
        </div>
        <Link href="/admin/students" className="text-sm font-medium text-primary-600 hover:text-primary-700">View Students</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Active Students</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(data.activeStudents)}</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Average Completion</p><p className="mt-2 text-xl font-bold text-slate-900">{data.averageCompletion}%</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Average Learning Hours</p><p className="mt-2 text-xl font-bold text-slate-900">{data.averageLearningHours} hrs</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Certificates</p><p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(data.certificates)}</p></div>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-sm text-slate-500">Completion trend</p>
          <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full overflow-hidden" role="img" aria-label="Student completion rate trend from 58% in April to 68% in October in the demo dataset.">
            <path d={buildAreaPath(values, width, height, padding)} fill="url(#studentCompletionArea)" />
            {linePath ? <path d={linePath} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" /> : null}
            <defs>
              <linearGradient id="studentCompletionArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}

function RecentActivity({ data }) {
  const iconMap = {
    "user-plus": UserPlus,
    "book-copy": BookCopy,
    users: Users,
    "badge-check": BadgeCheck,
    star: Star,
    wallet: Wallet,
    "check-circle": CheckCircle2,
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Recent Activity</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Recent Platform Activity</h2>
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const Icon = iconMap[item.icon] || Activity;
          return (
            <div key={`${item.text}-${item.time}`} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{item.text}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{item.entity}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function getDynamicReportData(rangeKey, customStart, customEnd) {
  if (rangeKey === "custom") {
    if (!customStart || !customEnd) return getArrayByRangeValue("thisMonth");
    const start = new Date(customStart);
    const end = new Date(customEnd);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return getArrayByRangeValue("thisMonth");
    if (start > end) return getArrayByRangeValue("thisMonth");
    const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    if (diffDays <= 7) return getArrayByRangeValue("today");
    if (diffDays <= 30) return getArrayByRangeValue("last30Days");
    if (diffDays <= 90) return getArrayByRangeValue("last3Months");
    return getArrayByRangeValue("thisYear");
  }
  return getArrayByRangeValue(rangeKey);
}

export default function ReportsManagementClient() {
  const [selectedRange, setSelectedRange] = React.useState("thisMonth");
  const [customStart, setCustomStart] = React.useState("");
  const [customEnd, setCustomEnd] = React.useState("");
  const [customRangeOpen, setCustomRangeOpen] = React.useState(false);
  const [demoNoticeVisible, setDemoNoticeVisible] = React.useState(true);
  const [rangeError, setRangeError] = React.useState("");

  const reportData = React.useMemo(() => {
    const data = getDynamicReportData(selectedRange, customStart, customEnd);
    return data;
  }, [selectedRange, customStart, customEnd]);

  const rangeLabel = React.useMemo(() => {
    const match = dateRangeOptions.find((option) => option.value === selectedRange);
    if (selectedRange === "custom") {
      if (customStart && customEnd) return `${customStart} to ${customEnd}`;
      return "Custom Range";
    }
    return match ? match.label : "This Month";
  }, [selectedRange, customStart, customEnd]);

  const exportReport = () => {
    const rows = [
      ["Metric", "Value", "Change"],
      ["Total Users", reportData.summary.totalUsers, `${reportData.summary.change.totalUsers}%`],
      ["Active Students", reportData.summary.activeStudents, `${reportData.summary.change.activeStudents}%`],
      ["Total Instructors", reportData.summary.totalInstructors, `${reportData.summary.change.totalInstructors}%`],
      ["Total Courses", reportData.summary.totalCourses, `${reportData.summary.change.totalCourses}%`],
      ["Total Enrollments", reportData.summary.totalEnrollments, `${reportData.summary.change.totalEnrollments}%`],
      ["Total Revenue", reportData.summary.totalRevenue, `${reportData.summary.change.totalRevenue}%`],
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `edulearn-report-${selectedRange}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRangeChange = (nextValue) => {
    setSelectedRange(nextValue);
    if (nextValue !== "custom") {
      setCustomRangeOpen(false);
      setRangeError("");
    }
  };

  const handleCustomApply = () => {
    if (!customStart || !customEnd) {
      setRangeError("Start date and end date are required.");
      return;
    }

    const start = new Date(customStart);
    const end = new Date(customEnd);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setRangeError("Please enter valid dates.");
      return;
    }

    if (start > end) {
      setRangeError("Start date cannot be after end date.");
      return;
    }

    setSelectedRange("custom");
    setCustomRangeOpen(false);
    setRangeError("");
  };

  const statCards = metricCardConfig.map((config) => {
    const value = reportData.summary[config.key];
    const change = reportData.summary.change[config.key];
    const formattedValue =
      config.key === "totalRevenue"
        ? formatCurrency(value)
        : config.key === "totalCourses" || config.key === "totalInstructors" || config.key === "totalUsers" || config.key === "activeStudents" || config.key === "totalEnrollments"
          ? formatNumber(value)
          : formatNumber(value);

    return {
      ...config,
      value: formattedValue,
      change: getPercentBadge(change),
      comparison: "vs previous period",
    };
  });

  const revenueGrowth = getPercentBadge(reportData.summary.change.totalRevenue);
  const previousPeriod = reportData.summary.totalRevenue / (1 + reportData.summary.change.totalRevenue / 100);

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          aside, nav, header, .no-print, [role="navigation"], button, select, input, textarea { display: none !important; }
          .print-visible { display: block !important; }
        }
      `}</style>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/admin/dashboard" className="hover:text-primary-600">Admin</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-slate-900">Reports</span>
        </nav>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Reports</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Reports & Analytics</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">Monitor platform performance, learner activity, course performance, revenue, certificates, and review trends.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full min-w-[180px] sm:w-[200px]">
              <RangeSelector value={selectedRange} onChange={handleRangeChange} onCustomOpen={() => setCustomRangeOpen(true)} />
            </div>
            <Button type="button" variant="outline" onClick={exportReport} leftIcon={<Download className="h-4 w-4" aria-hidden="true" />} className="no-print">
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <DemoNotice visible={demoNoticeVisible} onDismiss={() => setDemoNoticeVisible(false)} />

      {customRangeOpen && (
        <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm no-print">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Custom Range</p>
              <p className="text-xs text-slate-500">Select a date range for the demo analytics view.</p>
            </div>
            <button type="button" onClick={() => setCustomRangeOpen(false)} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500" aria-label="Close custom date range panel">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label htmlFor="start-date" className="mb-2 block text-sm font-medium text-slate-700">Start Date</label>
              <input id="start-date" type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>
            <div>
              <label htmlFor="end-date" className="mb-2 block text-sm font-medium text-slate-700">End Date</label>
              <input id="end-date" type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" />
            </div>
          </div>

          {rangeError ? <p className="mt-3 text-sm text-red-600">{rangeError}</p> : null}

          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setCustomRangeOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleCustomApply}>Apply Range</Button>
          </div>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statCards.map((card) => (
          <StatCard key={card.key} label={card.label} value={card.value} change={card.change} comparison={card.comparison} icon={card.icon} tone={card.tone} />
        ))}
      </section>

      <RevenueOverview
        data={reportData.revenue}
        totalRevenue={reportData.summary.totalRevenue}
        previousRevenue={previousPeriod}
        growth={revenueGrowth}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <UserGrowthChart data={reportData.userGrowth} />
        <EnrollmentOverview data={reportData.enrollments} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CoursePerformance data={reportData.coursePerformance} />
        <CategoryPerformance data={reportData.categoryPerformance} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LearnerActivity data={reportData.learnerActivity} />
        <LearningProgress data={reportData.learningProgress} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CertificateAnalytics data={reportData.certificates} />
        <ReviewAnalytics data={reportData.reviews} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PaymentAnalytics data={reportData.payments} />
        <InstructorPerformance data={reportData.instructorPerformance} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <StudentPerformance data={reportData.studentPerformance} />
        <RecentActivity data={reportData.recentActivity} />
      </div>

      <div className="sr-only" aria-live="polite">
        {`Report view for ${rangeLabel}. Revenue increased from ${formatCurrency(reportData.revenue[0]?.revenue || 0)} in ${reportData.revenue[0]?.month || "April"} to ${formatCurrency(reportData.revenue[reportData.revenue.length - 1]?.revenue || 0)} in ${reportData.revenue[reportData.revenue.length - 1]?.month || "October"} in the demo dataset.`}
      </div>
    </div>
  );
}
