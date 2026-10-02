"use client";

import * as React from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import { cn } from "@/utils";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Database,
  Download,
  HardDrive,
  Lock,
  MonitorCog,
  RefreshCcw,
  Server,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import {
  calculateOverallStatus,
  calculateHealthStats,
  formatHealthDate,
  formatHealthTimestamp,
  getPerformanceData,
  systemHealthData,
} from "@/constants/adminSystemHealth.js";

const timeRangeOptions = [
  { value: "last1h", label: "Last 1 Hour" },
  { value: "last6h", label: "Last 6 Hours" },
  { value: "last24h", label: "Last 24 Hours" },
  { value: "last7d", label: "Last 7 Days" },
  { value: "last30d", label: "Last 30 Days" },
];

const serviceIcons = {
  web: MonitorCog,
  api: Server,
  database: Database,
  auth: Lock,
  storage: HardDrive,
  payments: Download,
  email: Bell,
  notifications: Activity,
};

const statusColors = {
  operational: {
    ring: "bg-emerald-500",
    soft: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  degraded: {
    ring: "bg-amber-500",
    soft: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  unavailable: {
    ring: "bg-red-500",
    soft: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  demo: {
    ring: "bg-slate-500",
    soft: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
  },
  resolved: {
    ring: "bg-emerald-500",
    soft: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  investigating: {
    ring: "bg-sky-500",
    soft: "bg-sky-50 text-sky-700 border-sky-200",
    dot: "bg-sky-500",
  },
  monitoring: {
    ring: "bg-amber-500",
    soft: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  scheduled: {
    ring: "bg-slate-500",
    soft: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
  },
};

function SystemHealthBadge({ status, label, size = "default" }) {
  const normalizedStatus = status?.toLowerCase?.() || "operational";
  const normalizedLabel = label || normalizedStatus;
  const palette = statusColors[normalizedStatus] || statusColors.operational;

  return (
    <Badge variant={normalizedStatus === "operational" ? "success" : normalizedStatus === "degraded" ? "warning" : normalizedStatus === "unavailable" ? "danger" : normalizedStatus === "demo" ? "secondary" : normalizedStatus === "resolved" ? "success" : normalizedStatus === "investigating" || normalizedStatus === "monitoring" ? "info" : "secondary"} size={size} className="border">
      <span className={cn("h-1.5 w-1.5 rounded-full", palette.dot)} />
      {normalizedLabel}
    </Badge>
  );
}

function ProgressBar({ value, max = 100, colorClass = "bg-primary-500", label, suffix = "%" }) {
  const safeValue = Math.min(Math.max(value, 0), max);
  const percentage = (safeValue / max) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-semibold text-slate-900">{value}{suffix}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200" aria-label={`${label} usage`}>
        <div
          className={cn("h-full rounded-full transition-all duration-300", colorClass)}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

function HealthDetailsModal({ incident, open, onClose }) {
  React.useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !incident) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" aria-hidden={!open}>
      <div className="h-full w-full overflow-y-auto rounded-t-[28px] border border-slate-200 bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:w-full sm:max-w-2xl sm:rounded-[28px]" role="dialog" aria-modal="true" aria-labelledby="incident-modal-title">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Incident Details</p>
            <h2 id="incident-modal-title" className="mt-1 text-xl font-bold text-slate-900">{incident.id}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close incident details"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Title</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{incident.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{incident.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Severity</p>
              <div className="mt-2"><SystemHealthBadge status={incident.severity.toLowerCase()} label={incident.severity} /></div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Status</p>
              <div className="mt-2"><SystemHealthBadge status={incident.status.toLowerCase()} label={incident.status} /></div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Started At</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{formatHealthTimestamp(incident.startedAt)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Resolved At</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{formatHealthTimestamp(incident.resolvedAt)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Duration</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{incident.duration}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Affected Services</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {incident.affectedServices.map((service) => (
                <span key={service} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">Resolution Summary</p>
            <p className="mt-2 text-sm leading-6 text-amber-900">{incident.resolutionSummary}</p>
            <p className="mt-3 text-xs font-medium text-amber-700">Demo data only.</p>
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-4">
            <Button type="button" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SystemHealthClient() {
  const [data, setData] = React.useState(systemHealthData);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedRange, setSelectedRange] = React.useState("last24h");
  const [selectedIncident, setSelectedIncident] = React.useState(null);
  const [dataError, setDataError] = React.useState(false);

  const overallStatus = React.useMemo(() => calculateOverallStatus(data.services), [data.services]);
  const stats = React.useMemo(() => calculateHealthStats(data.services), [data.services]);
  const chartData = React.useMemo(() => getPerformanceData(selectedRange), [selectedRange]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const adjustedAverage = Math.min(94, Math.max(60, data.performance.averageResponseTime + (Math.random() > 0.5 ? 6 : -4)));
      const adjustedPeak = Math.min(210, Math.max(150, data.performance.peakResponseTime + (Math.random() > 0.5 ? 14 : -10)));
      const adjustedCpu = Math.min(90, Math.max(32, data.performance.cpu + (Math.random() > 0.5 ? 5 : -3)));
      const adjustedMemory = Math.min(82, Math.max(45, data.performance.memory + (Math.random() > 0.5 ? 4 : -3)));

      setData((prev) => ({
        ...prev,
        overall: {
          ...prev.overall,
          lastChecked: new Date().toISOString(),
        },
        services: prev.services.map((service) =>
          service.status === "operational"
            ? { ...service, lastChecked: "just now" }
            : service
        ),
        performance: {
          ...prev.performance,
          averageResponseTime: Math.round(adjustedAverage),
          peakResponseTime: Math.round(adjustedPeak),
          cpu: Math.round(adjustedCpu),
          memory: Math.round(adjustedMemory),
        },
      }));
      setIsRefreshing(false);
    }, 900);
  };

  const handleRetry = () => {
    setDataError(false);
    setData(systemHealthData);
  };

  const chartPoints = React.useMemo(() => {
    if (!chartData.length) return "";
    const width = 520;
    const height = 180;
    const maxValue = Math.max(...chartData.map((item) => item.value), 100);
    const minValue = Math.min(...chartData.map((item) => item.value), 10);
    const stepX = width / (chartData.length - 1);

    return chartData
      .map((entry, index) => {
        const x = index * stepX;
        const normalized = (entry.value - minValue) / Math.max(maxValue - minValue, 1);
        const y = height - normalized * height;
        return `${x},${y}`;
      })
      .join(" ");
  }, [chartData]);

  const chartSummary =
    "Average response time remained between 60ms and 90ms during the selected period.";

  if (dataError) {
    return (
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Unable to load system health data.</h3>
            <Button type="button" onClick={handleRetry}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  const overallBadge = overallStatus.status === "major-incident" ? "Major Incident" : overallStatus.status === "degraded" ? "Degraded" : "Operational";

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/admin/dashboard" className="hover:text-primary-600">Admin</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-slate-900">System Health</span>
        </nav>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Admin / System Health</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">System Health</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">Monitor the health, availability, and performance of the EduLearn platform.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" onClick={handleRefresh} loading={isRefreshing} leftIcon={<RefreshCcw className="h-4 w-4" />}>
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Link href="/admin/audit-logs" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
              View Audit Logs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-primary-200 bg-primary-50 p-3 text-sm text-primary-700">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold">Demo Monitoring</span>
          </div>
          <p className="mt-1 text-sm text-primary-800">
            System health metrics shown on this page are simulated demo data and are not connected to live production monitoring.
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">System Status</p>
              <div className="mt-3 flex items-center gap-3">
                <SystemHealthBadge status={overallStatus.status} label={overallBadge} size="lg" />
              </div>
            </div>
            <div className="rounded-full bg-primary-50 p-3 text-primary-600">
              <Activity className="h-6 w-6" />
            </div>
          </div>

          <p className="mt-4 text-base text-slate-700">{data.overall.message}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Last checked</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{formatHealthTimestamp(data.overall.lastChecked)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Demo Uptime</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{data.overall.uptime}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2 text-blue-800">
              <CircleDashed className="h-4 w-4" />
              <span className="text-sm font-semibold">Demo Monitoring</span>
            </div>
            <p className="mt-2 text-sm text-blue-700">System health is simulated for design and workflow validation only.</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">Healthy Services</p>
            <Badge variant="success">{stats.operationalCount} online</Badge>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-600">Operational</span>
                <span className="text-sm font-bold text-slate-900">{stats.operationalCount}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-600">Degraded</span>
                <span className="text-sm font-bold text-slate-900">{stats.degradedCount}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-600">Demo Mode</span>
                <span className="text-sm font-bold text-slate-900">{stats.demoCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Service Status</p>
          </div>
          <Badge variant="secondary">Demo Services</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {data.services.map((service) => {
            const Icon = serviceIcons[service.id] || Activity;
            const isDemo = service.status === "demo";
            return (
              <div key={service.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <SystemHealthBadge status={service.status} label={isDemo ? "Demo Mode" : service.status === "operational" ? "Operational" : service.status === "degraded" ? "Degraded" : "Unavailable"} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">{service.name}</h3>

                {service.status === "demo" ? (
                  <div className="mt-4 space-y-3 text-sm text-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Provider</span>
                      <span className="font-semibold text-slate-900">{service.provider}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Response Time</span>
                      <span className="font-semibold text-slate-900">--</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Last checked</span>
                      <span className="font-semibold text-slate-900">{service.lastChecked}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3 text-sm text-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Response Time</span>
                      <span className="font-semibold text-slate-900">{service.responseTime} ms</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Availability</span>
                      <span className="font-semibold text-slate-900">{service.availability}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Last checked</span>
                      <span className="font-semibold text-slate-900">{service.lastChecked}</span>
                    </div>
                    {service.version ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">Version</span>
                        <span className="font-semibold text-slate-900">{service.version}</span>
                      </div>
                    ) : null}
                    {service.requestsPerMinute ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">Requests/min</span>
                        <span className="font-semibold text-slate-900">{service.requestsPerMinute.toLocaleString()}</span>
                      </div>
                    ) : null}
                    {service.errors !== undefined ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">Errors</span>
                        <span className="font-semibold text-slate-900">{service.errors}</span>
                      </div>
                    ) : null}
                    {service.connections ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">Connections</span>
                        <span className="font-semibold text-slate-900">{service.connections}</span>
                      </div>
                    ) : null}
                    {service.storage ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">Storage</span>
                        <span className="font-semibold text-slate-900">{service.storage}</span>
                      </div>
                    ) : null}
                    {service.loginSuccess ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">Login Success</span>
                        <span className="font-semibold text-slate-900">{service.loginSuccess}</span>
                      </div>
                    ) : null}
                    {service.failedAttempts !== undefined ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">Failed Attempts</span>
                        <span className="font-semibold text-slate-900">{service.failedAttempts}</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Performance Overview</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Demo Performance Metrics</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {timeRangeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedRange(option.value)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition",
                    selectedRange === option.value
                      ? "border-primary-200 bg-primary-50 text-primary-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Average Response Time</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{data.performance.averageResponseTime} ms</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Peak Response Time</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{data.performance.peakResponseTime} ms</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Requests Per Minute</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{data.performance.requestsPerMinute.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Error Rate</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{data.performance.errorRate}%</p>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Response Time</p>
                <p className="text-xs text-slate-500">Last 24 hours</p>
              </div>
              <Badge variant="secondary">24h window</Badge>
            </div>

            <svg viewBox="0 0 520 180" role="img" aria-labelledby="chart-title chart-description" className="h-48 w-full rounded-xl bg-white p-2">
              <title id="chart-title">Response time chart</title>
              <desc id="chart-description">{chartSummary}</desc>
              <defs>
                <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={`M 0 160 L ${chartPoints} L 520 160 Z`} fill="url(#chartFill)" opacity="0.8" />
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={chartPoints}
              />
              {chartData.map((entry, index) => {
                const width = 520;
                const height = 180;
                const maxValue = Math.max(...chartData.map((item) => item.value), 100);
                const minValue = Math.min(...chartData.map((item) => item.value), 10);
                const stepX = width / (chartData.length - 1);
                const x = index * stepX;
                const normalized = (entry.value - minValue) / Math.max(maxValue - minValue, 1);
                const y = height - normalized * height;
                return (
                  <g key={`${entry.label}-${index}`}>
                    <circle cx={x} cy={y} r="4" fill="#2563eb" />
                    <text x={x} y="175" textAnchor="middle" fontSize="10" fill="#64748b">{entry.label}</text>
                  </g>
                );
              })}
            </svg>

            <p className="mt-4 text-sm leading-6 text-slate-600">{chartSummary}</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">Alerts</p>
            <Badge variant="secondary">{data.alerts.length ? `${data.alerts.length} active` : "None"}</Badge>
          </div>

          {data.alerts.length > 0 ? (
            <div className="mt-5 space-y-3">
              {data.alerts.map((alert) => (
                <div key={alert.id || alert.title} className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-amber-800">{alert.title}</p>
                      <p className="mt-1 text-sm text-amber-700">{alert.message}</p>
                    </div>
                    <SystemHealthBadge status={alert.level === "warning" ? "degraded" : "operational"} label={alert.level} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">No Active Alerts</h3>
              <p className="mt-2 text-sm text-slate-600">No system alerts are currently displayed.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">Resource Usage</p>
            <Badge variant="secondary">Demo Capacity</Badge>
          </div>

          <div className="mt-5 space-y-5">
            <ProgressBar value={data.performance.cpu} max={100} label="CPU" colorClass="bg-blue-500" />
            <ProgressBar value={data.performance.memory} max={100} label="Memory" colorClass="bg-violet-500" />
            <ProgressBar value={data.performance.storage} max={100} label="Storage" colorClass="bg-emerald-500" />
            <ProgressBar value={data.performance.databaseConnections} max={100} label="Database Connections" colorClass="bg-amber-500" />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">Maintenance Status</p>
            <Wrench className="h-4 w-4 text-slate-500" />
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Current status</p>
              <div className="mt-2"><SystemHealthBadge status="operational" label={data.maintenance.status} /></div>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Last Maintenance</span>
                <span className="font-semibold text-slate-900">{data.maintenance.lastMaintenance}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Duration</span>
                <span className="font-semibold text-slate-900">{data.maintenance.duration}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Next scheduled</span>
                <span className="font-semibold text-slate-900">{data.maintenance.nextMaintenance}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Recent Incidents</p>
            <Badge variant="secondary">{data.incidents.length} incidents</Badge>
          </div>

          {data.incidents.length > 0 ? (
            <div className="mt-5 space-y-4">
              {data.incidents.map((incident) => (
                <div key={incident.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{incident.id}</span>
                        <TriangleAlert className="h-4 w-4 text-amber-500" />
                      </div>
                      <p className="mt-2 text-base font-semibold text-slate-900">{incident.title}</p>
                    </div>
                    <SystemHealthBadge status={incident.status.toLowerCase()} label={incident.status} />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Severity</p>
                      <div className="mt-2"><SystemHealthBadge status={incident.severity.toLowerCase()} label={incident.severity} /></div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Duration</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{incident.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Date</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{formatHealthDate(incident.startedAt)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedIncident(incident)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      View Incident
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <h3 className="text-lg font-bold text-slate-900">No Active Incidents</h3>
              <p className="mt-2 text-sm text-slate-600">All monitored demo services are operating normally.</p>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">Recent System Events</p>
            <Badge variant="secondary">Live feed</Badge>
          </div>

          {data.events.length > 0 ? (
            <div className="mt-5 space-y-4">
              {data.events.map((event) => (
                <div key={event.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                    {event.icon === "check" ? <CheckCircle2 className="h-4 w-4" /> : event.icon === "activity" ? <Activity className="h-4 w-4" /> : event.icon === "database" ? <Database className="h-4 w-4" /> : event.icon === "calendar" ? <TimerReset className="h-4 w-4" /> : event.icon === "package" ? <Server className="h-4 w-4" /> : <HardDrive className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                      <SystemHealthBadge status={event.status.toLowerCase()} label={event.status} size="sm" />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{event.description}</p>
                    <p className="mt-2 text-xs text-slate-500">{formatHealthTimestamp(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <h3 className="text-lg font-bold text-slate-900">No Recent Events</h3>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">Security Status</p>
            <ShieldCheck className="h-4 w-4 text-primary-600" />
          </div>

          <div className="mt-5 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-600">Authentication</span>
              <span className="font-semibold text-slate-900">{data.security.authentication}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-600">SSL</span>
              <span className="font-semibold text-slate-900">{data.security.ssl}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-600">Firewall</span>
              <span className="font-semibold text-slate-900">{data.security.firewall}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-600">Suspicious Activity</span>
              <span className="font-semibold text-slate-900">{data.security.suspiciousActivity}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-600">Last Security Check</span>
              <span className="font-semibold text-slate-900">{data.security.lastCheck}</span>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
            Demo Security Indicators
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">System Information</p>
            <Server className="h-4 w-4 text-slate-500" />
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-700">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Application</span>
              <span className="font-semibold text-slate-900">{data.systemInfo.application}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Version</span>
              <span className="font-semibold text-slate-900">{data.systemInfo.version}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Environment</span>
              <span className="font-semibold text-slate-900">{data.systemInfo.environment}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Framework</span>
              <span className="font-semibold text-slate-900">{data.systemInfo.framework}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Runtime</span>
              <span className="font-semibold text-slate-900">{data.systemInfo.runtime}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Last Deployment</span>
              <span className="font-semibold text-slate-900">{data.systemInfo.lastDeployment}</span>
            </div>
          </div>

          <div className="mt-5">
            <Link href="/admin/settings" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
              Open Settings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <HealthDetailsModal incident={selectedIncident} open={Boolean(selectedIncident)} onClose={() => setSelectedIncident(null)} />
    </div>
  );
}
