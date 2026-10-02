export const performanceSeries = {
  last1h: [
    { label: "10 AM", value: 72 },
    { label: "10:15 AM", value: 69 },
    { label: "10:30 AM", value: 78 },
    { label: "10:45 AM", value: 76 },
    { label: "11 AM", value: 74 },
    { label: "11:15 AM", value: 68 },
    { label: "11:30 AM", value: 70 },
    { label: "11:45 AM", value: 82 },
  ],
  last6h: [
    { label: "10 AM", value: 76 },
    { label: "12 PM", value: 82 },
    { label: "2 PM", value: 74 },
    { label: "4 PM", value: 91 },
    { label: "6 PM", value: 70 },
    { label: "8 PM", value: 68 },
    { label: "10 PM", value: 79 },
    { label: "12 AM", value: 72 },
  ],
  last24h: [
    { label: "10 AM", value: 66 },
    { label: "12 PM", value: 74 },
    { label: "2 PM", value: 82 },
    { label: "4 PM", value: 70 },
    { label: "6 PM", value: 88 },
    { label: "8 PM", value: 84 },
    { label: "10 PM", value: 79 },
    { label: "12 AM", value: 71 },
    { label: "2 AM", value: 62 },
    { label: "4 AM", value: 68 },
  ],
  last7d: [
    { label: "Mon", value: 84 },
    { label: "Tue", value: 79 },
    { label: "Wed", value: 88 },
    { label: "Thu", value: 74 },
    { label: "Fri", value: 81 },
    { label: "Sat", value: 69 },
    { label: "Sun", value: 72 },
  ],
  last30d: [
    { label: "W1", value: 86 },
    { label: "W2", value: 74 },
    { label: "W3", value: 82 },
    { label: "W4", value: 72 },
    { label: "W5", value: 69 },
    { label: "W6", value: 78 },
  ],
};

export const systemHealthData = {
  overall: {
    status: "operational",
    label: "Operational",
    message: "All monitored demo services are operating normally.",
    uptime: "99.98%",
    lastChecked: "2026-10-02T05:20:00.000Z",
  },
  services: [
    {
      id: "web",
      name: "Web Application",
      status: "operational",
      responseTime: 42,
      availability: "99.99% Demo",
      lastChecked: "1 minute ago",
      version: "EduLearn 1.0.0",
    },
    {
      id: "api",
      name: "API",
      status: "operational",
      responseTime: 85,
      availability: "99.98% Demo",
      lastChecked: "2 minutes ago",
      requestsPerMinute: 1248,
      errors: 3,
    },
    {
      id: "database",
      name: "Database",
      status: "operational",
      responseTime: 18,
      availability: "99.99% Demo",
      lastChecked: "1 minute ago",
      connections: "42 / 100",
      storage: "38%",
    },
    {
      id: "auth",
      name: "Authentication",
      status: "operational",
      responseTime: 64,
      availability: "98.7% Demo",
      lastChecked: "3 minutes ago",
      loginSuccess: "98.7%",
      failedAttempts: 12,
    },
    {
      id: "storage",
      name: "Storage",
      status: "operational",
      responseTime: "--",
      availability: "38% used",
      lastChecked: "5 minutes ago",
      used: "38 GB",
      capacity: "100 GB",
      usage: 38,
    },
    {
      id: "payments",
      name: "Payment System",
      status: "demo",
      responseTime: "--",
      availability: "Demo Configuration",
      lastChecked: "2 minutes ago",
      provider: "Not Connected",
      note: "Demo Mode",
    },
    {
      id: "email",
      name: "Email Service",
      status: "demo",
      responseTime: "--",
      availability: "Demo Configuration",
      lastChecked: "8 minutes ago",
      provider: "Not Connected",
      note: "Demo Mode",
    },
    {
      id: "notifications",
      name: "Notification Service",
      status: "demo",
      responseTime: "--",
      availability: "Demo Configuration",
      lastChecked: "6 minutes ago",
      provider: "Not Connected",
      note: "Demo Mode",
    },
  ],
  performance: {
    averageResponseTime: 72,
    peakResponseTime: 184,
    requestsPerMinute: 1248,
    errorRate: 0.24,
    cpu: 42,
    memory: 58,
    storage: 38,
    databaseConnections: 42,
  },
  incidents: [
    {
      id: "INC-0042",
      title: "API response time increased",
      description: "Response time rose above the expected range during a brief spike in traffic volume.",
      severity: "Medium",
      status: "Resolved",
      startedAt: "2026-10-01T09:40:00.000Z",
      resolvedAt: "2026-10-01T09:52:00.000Z",
      duration: "12 minutes",
      affectedServices: ["API", "Web Application"],
      resolutionSummary: "Demo incident resolved after simulated service recovery.",
    },
    {
      id: "INC-0041",
      title: "Scheduled maintenance simulation",
      description: "Demo maintenance window was used to validate communication flow and cached routing behavior.",
      severity: "Low",
      status: "Resolved",
      startedAt: "2026-10-01T04:15:00.000Z",
      resolvedAt: "2026-10-01T04:27:00.000Z",
      duration: "12 minutes",
      affectedServices: ["Web Application"],
      resolutionSummary: "Scheduled maintenance completed without customer-facing disruption in this demo environment.",
    },
  ],
  events: [
    {
      id: "evt-01",
      title: "System health check completed",
      description: "Demo monitoring checks passed for the application and supporting services.",
      timestamp: "2026-10-02T05:19:00.000Z",
      status: "Operational",
      icon: "check",
    },
    {
      id: "evt-02",
      title: "API status changed",
      description: "API latency recovered after a brief simulated spike in demand.",
      timestamp: "2026-10-02T04:55:00.000Z",
      status: "Monitoring",
      icon: "activity",
    },
    {
      id: "evt-03",
      title: "Database connection check completed",
      description: "Database connectivity and write operations were validated in the demo environment.",
      timestamp: "2026-10-02T04:20:00.000Z",
      status: "Operational",
      icon: "database",
    },
    {
      id: "evt-04",
      title: "Scheduled maintenance updated",
      description: "Demo maintenance window has been confirmed and logged for review.",
      timestamp: "2026-10-01T18:14:00.000Z",
      status: "Scheduled",
      icon: "calendar",
    },
    {
      id: "evt-05",
      title: "Application version updated",
      description: "Demo application information was refreshed for the current release notes.",
      timestamp: "2026-10-01T11:02:00.000Z",
      status: "Operational",
      icon: "package",
    },
    {
      id: "evt-06",
      title: "Storage threshold checked",
      description: "Storage utilization remains within the simulated capacity threshold.",
      timestamp: "2026-10-01T08:33:00.000Z",
      status: "Operational",
      icon: "hard-drive",
    },
  ],
  alerts: [],
  maintenance: {
    status: "No maintenance scheduled",
    lastMaintenance: "Oct 01, 2026",
    duration: "15 minutes",
    nextMaintenance: "Not scheduled",
  },
  security: {
    authentication: "Operational",
    ssl: "Valid",
    firewall: "Enabled",
    suspiciousActivity: "None Detected",
    lastCheck: "Today",
  },
  systemInfo: {
    application: "EduLearn",
    version: "1.0.0",
    environment: "Demo",
    framework: "Next.js",
    runtime: "Node.js",
    lastDeployment: "Oct 02, 2026",
  },
};

export function calculateOverallStatus(services = []) {
  const statuses = services.map((service) => service.status);

  if (statuses.some((status) => status === "unavailable")) {
    return { status: "major-incident", label: "Major Incident" };
  }

  if (statuses.some((status) => status === "degraded")) {
    return { status: "degraded", label: "Degraded" };
  }

  return { status: "operational", label: "Operational" };
}

export function calculateHealthStats(services = []) {
  const operationalCount = services.filter((service) => service.status === "operational").length;
  const degradedCount = services.filter((service) => service.status === "degraded").length;
  const unavailableCount = services.filter((service) => service.status === "unavailable").length;
  const demoCount = services.filter((service) => service.status === "demo").length;

  return {
    operationalCount,
    degradedCount,
    unavailableCount,
    demoCount,
  };
}

export function getPerformanceData(range = "last24h") {
  const dataset = performanceSeries[range] || performanceSeries.last24h;
  return dataset;
}

export function formatHealthTimestamp(timestamp) {
  if (!timestamp) return "--";
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatHealthDate(dateText) {
  if (!dateText) return "--";
  const safeDate = new Date(dateText);
  if (Number.isNaN(safeDate.getTime())) return dateText;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(safeDate);
}
