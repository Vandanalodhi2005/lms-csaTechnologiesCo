"use client";

import * as React from "react";
import Button from "@/components/ui/Button.jsx";
import IntegrationStatusBadge from "./IntegrationStatusBadge.jsx";
import { getCategoryIcon } from "./IntegrationCard.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog.jsx";
import { formatIntegrationDate } from "@/constants/adminIntegrations.js";
import { PlugZap, Power, PowerOff, ShieldAlert } from "lucide-react";

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

export default function IntegrationDetailsModal({
  integration,
  open,
  onOpenChange,
  webhooks = [],
  activity = [],
  testState,
  onTest,
  onToggle,
}) {
  if (!integration) return null;

  const Icon = getCategoryIcon(integration.category);
  const isTesting = testState?.status === "checking";
  const relatedActivity = activity.filter((item) => item.integration === integration.name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClose={() => onOpenChange(false)}
        className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"
        aria-labelledby="integration-details-title"
      >
        <DialogHeader>
          <DialogTitle id="integration-details-title">Integration Details</DialogTitle>
          <DialogDescription>
            Read-only demo view. No external service is connected.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-lg font-semibold text-slate-900">{integration.name}</h4>
              <p className="truncate text-sm text-slate-500">
                {integration.provider} · {integration.category}
              </p>
            </div>
          </div>
          <IntegrationStatusBadge status={integration.status} />
        </div>

        <section className="space-y-3" aria-label="Overview">
          <h5 className="text-sm font-semibold text-slate-900">Overview</h5>
          <dl className="grid gap-2 sm:grid-cols-2">
            <DetailRow label="Integration ID" value={integration.id} />
            <DetailRow label="Provider" value={integration.provider} />
            <DetailRow label="Category" value={integration.category} />
            <DetailRow label="Environment" value={integration.environment} />
            <DetailRow label="Enabled" value={integration.enabled ? "Yes" : "No"} />
            <DetailRow label="Last Updated" value={formatIntegrationDate(integration.lastUpdated)} />
            <DetailRow label="Webhook Count" value={integration.webhookCount} />
          </dl>
        </section>

        <section className="space-y-3" aria-label="Configuration">
          <h5 className="text-sm font-semibold text-slate-900">Configuration</h5>
          <div className="space-y-2">
            {integration.configurationFields.map((field) => (
              <div
                key={field.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <span className="text-sm text-slate-600">{field.label}</span>
                <span className="font-mono text-sm text-slate-500">
                  {field.type === "password" ? "••••••••••••" : "Not configured"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Masked placeholders only. No real credentials are stored in this demo.
          </p>
        </section>

        <section className="space-y-3" aria-label="Webhooks">
          <h5 className="text-sm font-semibold text-slate-900">Webhooks</h5>
          {webhooks.length === 0 ? (
            <p className="text-sm text-slate-500">No webhook endpoints configured.</p>
          ) : (
            <ul className="space-y-2">
              {webhooks.map((hook) => (
                <li
                  key={hook.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-slate-700">{hook.event}</p>
                    <p className="truncate text-xs text-slate-500">{hook.endpoint}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <IntegrationStatusBadge status={hook.status} size="sm" withIcon={false} />
                    <span className="text-xs text-slate-500">Retries {hook.retryCount}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3" aria-label="Activity">
          <h5 className="text-sm font-semibold text-slate-900">Activity</h5>
          {relatedActivity.length === 0 ? (
            <p className="text-sm text-slate-500">No recent activity for this integration.</p>
          ) : (
            <ul className="space-y-2">
              {relatedActivity.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary-600" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-slate-800">{item.action}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>Demo view only. No credentials were transmitted, stored, or displayed.</p>
        </div>

        {testState && testState.status !== "idle" ? (
          <p
            role="status"
            aria-live="polite"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
          >
            {testState.message}
          </p>
        ) : null}

        <DialogFooter className="border-t border-slate-200 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            type="button"
            variant="outline"
            loading={isTesting}
            disabled={isTesting}
            leftIcon={!isTesting ? <PlugZap className="h-4 w-4" aria-hidden="true" /> : undefined}
            onClick={() => onTest(integration)}
          >
            {isTesting ? "Testing..." : "Test Connection"}
          </Button>
          {integration.enabled ? (
            <Button
              type="button"
              variant="secondary"
              leftIcon={<PowerOff className="h-4 w-4" aria-hidden="true" />}
              onClick={() => onToggle(integration)}
            >
              Disable
            </Button>
          ) : (
            <Button
              type="button"
              leftIcon={<Power className="h-4 w-4" aria-hidden="true" />}
              onClick={() => onToggle(integration)}
            >
              Enable
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
