import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import IntegrationStatusBadge from "./IntegrationStatusBadge.jsx";
import { formatIntegrationDate } from "@/constants/adminIntegrations.js";
import {
  BarChart3,
  CalendarDays,
  CreditCard,
  Eye,
  HardDrive,
  Mail,
  MessageSquare,
  PlugZap,
  Power,
  PowerOff,
  Settings2,
  ShieldCheck,
  Video,
  Webhook,
} from "lucide-react";

export const integrationCategoryIcons = {
  Payments: CreditCard,
  Email: Mail,
  Video: Video,
  Storage: HardDrive,
  Analytics: BarChart3,
  Authentication: ShieldCheck,
  Communication: MessageSquare,
  Other: Webhook,
};

export function getCategoryIcon(category) {
  return integrationCategoryIcons[category] || Webhook;
}

export default function IntegrationCard({
  integration,
  testState,
  onView,
  onConfigure,
  onToggle,
  onTest,
}) {
  const Icon = getCategoryIcon(integration.category);
  const isTesting = testState?.status === "checking";

  return (
    <article
      className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      aria-label={`${integration.name} integration`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">{integration.name}</h3>
            <p className="truncate text-xs text-slate-500">{integration.provider}</p>
          </div>
        </div>
        <IntegrationStatusBadge status={integration.status} size="sm" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline" size="sm" className="border-slate-200 text-slate-600">
          {integration.category}
        </Badge>
        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
          <CalendarDays className="h-3 w-3" aria-hidden="true" />
          Updated {formatIntegrationDate(integration.lastUpdated)}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-600">{integration.description}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
        <div>
          <dt className="text-slate-500">Configuration</dt>
          <dd className="mt-0.5 font-medium text-slate-800">
            {integration.enabled ? "Enabled" : "Disabled"}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Environment</dt>
          <dd className="mt-0.5 font-medium text-slate-800">{integration.environment}</dd>
        </div>
      </dl>

      {testState && testState.status !== "idle" ? (
        <p
          role="status"
          aria-live="polite"
          className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
        >
          {testState.message}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Eye className="h-3.5 w-3.5" aria-hidden="true" />}
          onClick={() => onView(integration)}
        >
          View
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Settings2 className="h-3.5 w-3.5" aria-hidden="true" />}
          onClick={() => onConfigure(integration)}
        >
          Configure
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={isTesting}
          disabled={isTesting}
          leftIcon={!isTesting ? <PlugZap className="h-3.5 w-3.5" aria-hidden="true" /> : undefined}
          onClick={() => onTest(integration)}
        >
          {isTesting ? "Testing..." : "Test Connection"}
        </Button>
        {integration.enabled ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<PowerOff className="h-3.5 w-3.5" aria-hidden="true" />}
            onClick={() => onToggle(integration)}
          >
            Disable
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            leftIcon={<Power className="h-3.5 w-3.5" aria-hidden="true" />}
            onClick={() => onToggle(integration)}
          >
            Enable
          </Button>
        )}
      </div>
    </article>
  );
}
