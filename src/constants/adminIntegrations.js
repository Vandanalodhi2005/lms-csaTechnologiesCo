// Demo integration catalog for the EduLearn admin area.
//
// SECURITY NOTE: This file contains NO real credentials, API keys, tokens, or secrets.
// Everything here is mock configuration used only to render the demo UI.
// Production integrations must be configured server-side using secure environment
// variables or a dedicated secrets manager. Frontend configuration is not security.

export const integrationCategoryOptions = [
  "All",
  "Payments",
  "Email",
  "Video",
  "Storage",
  "Analytics",
  "Authentication",
  "Communication",
  "Other",
];

export const integrationStatusOptions = [
  { value: "all", label: "All Status" },
  { value: "Connected", label: "Connected" },
  { value: "Not Connected", label: "Not Connected" },
  { value: "Demo", label: "Demo" },
  { value: "Disabled", label: "Disabled" },
  { value: "Error", label: "Error" },
];

export const integrationEnvironmentOptions = ["Demo", "Test", "Production"];

// Field definitions per category. `type: "password"` fields are treated as sensitive:
// they render as password inputs and are never stored, transmitted, or displayed.
export const integrationFieldLibrary = {
  Payments: [
    { name: "keyId", label: "API Key (Key ID)", type: "text" },
    { name: "secretKey", label: "Secret Key", type: "password" },
    { name: "webhookSecret", label: "Webhook Secret", type: "password" },
  ],
  Email: [
    { name: "apiKey", label: "API Key", type: "password" },
    { name: "senderEmail", label: "Sender Email", type: "email" },
    { name: "senderName", label: "Sender Name", type: "text" },
  ],
  Video: [
    { name: "playbackConfig", label: "Playback Configuration", type: "text" },
    { name: "signingKey", label: "Signing Key", type: "password" },
  ],
  Storage: [
    { name: "bucketName", label: "Bucket Name", type: "text" },
    { name: "region", label: "Region", type: "text" },
    { name: "accessConfig", label: "Access Configuration", type: "password" },
  ],
  Analytics: [
    { name: "measurementId", label: "Measurement ID", type: "text" },
    { name: "propertyName", label: "Property Name", type: "text" },
  ],
  Authentication: [
    { name: "clientId", label: "Client ID", type: "text" },
    { name: "clientSecret", label: "Client Secret", type: "password" },
    { name: "issuerUrl", label: "Issuer URL", type: "text" },
  ],
  Communication: [
    { name: "accountSid", label: "Account SID", type: "text" },
    { name: "authToken", label: "Auth Token", type: "password" },
    { name: "senderNumber", label: "Sender Number", type: "text" },
  ],
  Other: [
    { name: "endpointBaseUrl", label: "Endpoint Base URL", type: "text" },
    { name: "signingSecret", label: "Signing Secret", type: "password" },
  ],
};

export function getConfigFieldsForCategory(category) {
  return integrationFieldLibrary[category] || integrationFieldLibrary.Other;
}

export function formatIntegrationDate(value) {
  if (!value || value === "Never") return "Never";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsed);
}

export function calculateIntegrationStats(integrations = [], webhooks = []) {
  return {
    total: integrations.length,
    connected: integrations.filter((item) => item.status === "Connected").length,
    notConnected: integrations.filter((item) => item.status === "Not Connected").length,
    webhooks: webhooks.length,
  };
}

// Future integration examples only. No provider is actually connected.
export const adminIntegrations = [
  {
    id: "INT-001",
    name: "Payment Gateway",
    provider: "Razorpay",
    category: "Payments",
    description:
      "Future payment processing integration for paid courses and enrollments.",
    status: "Not Connected",
    enabled: false,
    environment: "Demo",
    lastUpdated: "2026-10-01",
    webhookCount: 0,
    configurationFields: integrationFieldLibrary.Payments,
  },
  {
    id: "INT-002",
    name: "Stripe Checkout",
    provider: "Stripe",
    category: "Payments",
    description:
      "Alternative card checkout provider reserved for a future release.",
    status: "Disabled",
    enabled: false,
    environment: "Demo",
    lastUpdated: "2026-09-24",
    webhookCount: 0,
    configurationFields: integrationFieldLibrary.Payments,
  },
  {
    id: "INT-003",
    name: "Email Service",
    provider: "Brevo",
    category: "Email",
    description:
      "Future transactional email delivery for receipts, reminders, and notifications.",
    status: "Not Connected",
    enabled: false,
    environment: "Demo",
    lastUpdated: "2026-09-30",
    webhookCount: 0,
    configurationFields: integrationFieldLibrary.Email,
  },
  {
    id: "INT-004",
    name: "Video Hosting",
    provider: "Mux",
    category: "Video",
    description: "Future secure video hosting and streaming for course lessons.",
    status: "Demo",
    enabled: false,
    environment: "Demo",
    lastUpdated: "2026-09-18",
    webhookCount: 0,
    configurationFields: integrationFieldLibrary.Video,
  },
  {
    id: "INT-005",
    name: "Cloud Storage",
    provider: "AWS S3",
    category: "Storage",
    description:
      "Future object storage for course assets, certificates, and uploads.",
    status: "Demo",
    enabled: false,
    environment: "Demo",
    lastUpdated: "2026-09-15",
    webhookCount: 0,
    configurationFields: integrationFieldLibrary.Storage,
  },
  {
    id: "INT-006",
    name: "Analytics",
    provider: "Google Analytics",
    category: "Analytics",
    description:
      "Future learning analytics and engagement tracking for admin reporting.",
    status: "Not Connected",
    enabled: false,
    environment: "Demo",
    lastUpdated: "2026-08-29",
    webhookCount: 0,
    configurationFields: integrationFieldLibrary.Analytics,
  },
  {
    id: "INT-007",
    name: "Authentication",
    provider: "Auth Provider",
    category: "Authentication",
    description:
      "Future single sign-on and external identity provider connection.",
    status: "Not Connected",
    enabled: false,
    environment: "Demo",
    lastUpdated: "2026-09-05",
    webhookCount: 0,
    configurationFields: integrationFieldLibrary.Authentication,
  },
  {
    id: "INT-008",
    name: "SMS Gateway",
    provider: "SMS Provider",
    category: "Communication",
    description:
      "Future SMS delivery for verification codes and enrollment alerts.",
    status: "Not Connected",
    enabled: false,
    environment: "Demo",
    lastUpdated: "2026-09-11",
    webhookCount: 0,
    configurationFields: integrationFieldLibrary.Communication,
  },
  {
    id: "INT-009",
    name: "Webhook System",
    provider: "EduLearn Webhooks",
    category: "Other",
    description:
      "Outgoing webhook delivery for platform events such as enrollments and payments.",
    status: "Error",
    enabled: true,
    environment: "Demo",
    lastUpdated: "2026-10-02",
    webhookCount: 5,
    configurationFields: integrationFieldLibrary.Other,
  },
];

export const adminIntegrationActivity = [
  {
    id: "ACT-001",
    integration: "Payment Gateway",
    action: "Payment Gateway configuration viewed",
    actor: "Admin User",
    time: "2 hours ago",
  },
  {
    id: "ACT-002",
    integration: "Webhook System",
    action: "Webhook configuration updated",
    actor: "Admin User",
    time: "Yesterday",
  },
  {
    id: "ACT-003",
    integration: "Email Service",
    action: "Email integration disabled",
    actor: "Admin User",
    time: "2 days ago",
  },
  {
    id: "ACT-004",
    integration: "Video Hosting",
    action: "Connection test simulated",
    actor: "Admin User",
    time: "3 days ago",
  },
  {
    id: "ACT-005",
    integration: "Cloud Storage",
    action: "Cloud storage integration reviewed",
    actor: "Admin User",
    time: "5 days ago",
  },
];

