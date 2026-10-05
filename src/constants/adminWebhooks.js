// Demo webhook catalog for the EduLearn admin area.
//
// Endpoints use the reserved ".local" demo domain and are NOT real.
// No request is ever sent from this page. No signing secrets are stored here.

export const webhookEventOptions = [
  "user.created",
  "user.updated",
  "course.created",
  "course.updated",
  "course.published",
  "enrollment.created",
  "payment.completed",
  "certificate.issued",
  "review.created",
];

export const webhookStatusOptions = ["Not Connected", "Demo", "Disabled", "Error"];

export const adminWebhooks = [
  {
    id: "WH-2001",
    event: "enrollment.created",
    endpoint: "https://demo.edulearn.local/webhooks/enrollment",
    description: "Notifies downstream services when a learner enrolls in a course.",
    status: "Demo",
    createdAt: "2026-09-12",
    lastTriggered: "2026-10-02",
    retryCount: 0,
  },
  {
    id: "WH-2002",
    event: "payment.completed",
    endpoint: "https://demo.edulearn.local/webhooks/payments",
    description: "Placeholder endpoint for future server-side payment confirmations.",
    status: "Not Connected",
    createdAt: "2026-09-14",
    lastTriggered: "Never",
    retryCount: 0,
  },
  {
    id: "WH-2003",
    event: "course.published",
    endpoint: "https://demo.edulearn.local/webhooks/courses",
    description: "Notifies the catalog service when a course becomes published.",
    status: "Disabled",
    createdAt: "2026-09-08",
    lastTriggered: "2026-09-20",
    retryCount: 0,
  },
  {
    id: "WH-2004",
    event: "user.created",
    endpoint: "https://demo.edulearn.local/webhooks/users",
    description: "Demo endpoint for future user provisioning workflows.",
    status: "Not Connected",
    createdAt: "2026-09-19",
    lastTriggered: "Never",
    retryCount: 0,
  },
  {
    id: "WH-2005",
    event: "certificate.issued",
    endpoint: "https://demo.edulearn.local/webhooks/certificates",
    description: "Notifies the certificate service when a learner completes a course.",
    status: "Error",
    createdAt: "2026-09-02",
    lastTriggered: "2026-09-28",
    retryCount: 3,
  },
];

export function formatWebhookDate(value) {
  if (!value || value === "Never") return "Never";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsed);
}
