"use client";

import * as React from "react";
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";
import Label from "@/components/ui/Label.jsx";
import Select from "@/components/ui/Select.jsx";
import Textarea from "@/components/ui/Textarea.jsx";
import IntegrationCard from "./IntegrationCard.jsx";
import IntegrationDetailsModal from "./IntegrationDetailsModal.jsx";
import IntegrationConfigModal from "./IntegrationConfigModal.jsx";
import WebhookSection from "./WebhookSection.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog.jsx";
import {
  adminIntegrationActivity,
  adminIntegrations,
  calculateIntegrationStats,
  getConfigFieldsForCategory,
  integrationCategoryOptions,
  integrationEnvironmentOptions,
  integrationStatusOptions,
} from "@/constants/adminIntegrations.js";
import { adminWebhooks } from "@/constants/adminWebhooks.js";
import { cn } from "@/utils";
import { toast } from "sonner";
import {
  Activity,
  CheckCircle2,
  FileText,
  Layers,
  PlugZap,
  Plus,
  RefreshCcw,
  Search,
  ShieldAlert,
  Webhook,
} from "lucide-react";

// SECURITY: This page is a frontend demo only. It never stores, transmits, logs, or
// persists credentials. Real integrations must be configured server-side with secure
// environment variables or a secrets manager. Frontend configuration is not security.

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function emptyAddForm() {
  return {
    name: "",
    provider: "",
    category: "Payments",
    description: "",
    environment: "Demo",
  };
}

export default function IntegrationsManagementClient() {
  const [integrations, setIntegrations] = React.useState(adminIntegrations);
  const [webhooks, setWebhooks] = React.useState(adminWebhooks);
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [detailsId, setDetailsId] = React.useState(null);
  const [configId, setConfigId] = React.useState(null);
  const [docsOpen, setDocsOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [addValues, setAddValues] = React.useState(emptyAddForm);
  const [addErrors, setAddErrors] = React.useState({});
  const [testResults, setTestResults] = React.useState({});

  const filteredIntegrations = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return integrations.filter((item) => {
      if (activeCategory !== "All" && item.category !== activeCategory) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (query) {
        const haystack = `${item.name} ${item.provider} ${item.category} ${item.description}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [integrations, activeCategory, statusFilter, search]);

  const stats = React.useMemo(
    () => calculateIntegrationStats(integrations, webhooks),
    [integrations, webhooks]
  );

  const detailsIntegration = integrations.find((item) => item.id === detailsId) || null;
  const configIntegration = integrations.find((item) => item.id === configId) || null;

  function resetFilters() {
    setActiveCategory("All");
    setSearch("");
    setStatusFilter("all");
  }

  function openAddModal() {
    setAddValues(emptyAddForm());
    setAddErrors({});
    setAddOpen(true);
  }

  function handleToggleEnabled(integration) {
    const nextEnabled = !integration.enabled;
    setIntegrations((current) =>
      current.map((item) =>
        item.id === integration.id
          ? {
              ...item,
              enabled: nextEnabled,
              status: nextEnabled ? "Demo" : "Disabled",
              lastUpdated: todayIso(),
            }
          : item
      )
    );
    toast.success(
      nextEnabled ? "Integration enabled in demo mode." : "Integration disabled in demo mode."
    );
  }

  function handleTestConnection(integration) {
    setTestResults((current) => ({
      ...current,
      [integration.id]: { status: "checking", message: "Checking demo connection..." },
    }));

    window.setTimeout(() => {
      const succeeded = Math.random() >= 0.3;
      setTestResults((current) => ({
        ...current,
        [integration.id]: {
          status: succeeded ? "success" : "failed",
          message: succeeded
            ? "Demo Connection Successful. This was a simulated connection test. No external request was made."
            : "Demo Connection Failed. This was a simulated connection test. No external request was made.",
        },
      }));
      if (succeeded) {
        toast.success("Demo connection test succeeded.");
      } else {
        toast.error("Demo connection test failed.");
      }
    }, 900);
  }

  function handleSaveConfig({ environment }) {
    if (!configId) return;
    setIntegrations((current) =>
      current.map((item) =>
        item.id === configId ? { ...item, environment, status: "Demo", lastUpdated: todayIso() } : item
      )
    );
    setConfigId(null);
    toast.success("Configuration saved in demo mode. No credentials were transmitted or stored.");
  }

  function validateAddForm(values) {
    const errors = {};
    if (!values.name.trim()) errors.name = "Integration name is required.";
    else if (values.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
    else if (values.name.trim().length > 80) errors.name = "Name cannot exceed 80 characters.";

    if (!values.provider.trim()) errors.provider = "Provider is required.";
    else if (values.provider.trim().length > 80)
      errors.provider = "Provider cannot exceed 80 characters.";

    if (!values.category) errors.category = "Category is required.";
    if (values.description && values.description.trim().length > 300) {
      errors.description = "Description cannot exceed 300 characters.";
    }
    return errors;
  }

  function handleAddSubmit(event) {
    event.preventDefault();
    const errors = validateAddForm(addValues);
    setAddErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIntegrations((current) => {
      const maxId = current.reduce((max, item) => {
        const numeric = Number.parseInt(item.id.replace(/[^0-9]/g, ""), 10);
        return Number.isNaN(numeric) ? max : Math.max(max, numeric);
      }, 1000);
      const record = {
        id: `INT-${String(maxId + 1).padStart(3, "0")}`,
        name: addValues.name.trim(),
        provider: addValues.provider.trim(),
        category: addValues.category,
        description: addValues.description.trim() || "Future integration placeholder.",
        status: "Not Connected",
        enabled: false,
        environment: addValues.environment || "Demo",
        lastUpdated: todayIso(),
        webhookCount: 0,
        configurationFields: getConfigFieldsForCategory(addValues.category),
      };
      return [record, ...current];
    });

    setAddOpen(false);
    setAddValues(emptyAddForm());
    setAddErrors({});
    toast.success("Integration added in demo mode.");
  }

  function createWebhook(payload) {
    setWebhooks((current) => {
      const maxId = current.reduce((max, item) => {
        const numeric = Number.parseInt(item.id.replace(/[^0-9]/g, ""), 10);
        return Number.isNaN(numeric) ? max : Math.max(max, numeric);
      }, 2000);
      return [
        {
          id: `WH-${maxId + 1}`,
          event: payload.event,
          endpoint: payload.endpoint,
          description: payload.description,
          status: payload.status,
          createdAt: todayIso(),
          lastTriggered: "Never",
          retryCount: 0,
        },
        ...current,
      ];
    });
  }

  function updateWebhook(id, patch) {
    setWebhooks((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function deleteWebhook(id) {
    setWebhooks((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500"
          >
            <span>Admin</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700">Integrations</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">API &amp; Integrations</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage external service connections, API integrations, and webhook configurations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            leftIcon={<FileText className="h-4 w-4" aria-hidden="true" />}
            onClick={() => setDocsOpen(true)}
          >
            View Documentation
          </Button>
          <Button
            type="button"
            leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}
            onClick={openAddModal}
          >
            Add Integration
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-blue-100 p-2 text-blue-700">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold">Demo Integration Management</p>
            <p className="mt-1 text-blue-800/90">
              Integration settings shown here are mock configurations. No external services or API
              credentials are currently connected.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Integrations",
            value: stats.total,
            icon: Layers,
            tone: "bg-primary-50 text-primary-600",
            hint: "Catalog entries",
          },
          {
            label: "Connected",
            value: stats.connected,
            icon: CheckCircle2,
            tone: "bg-emerald-50 text-emerald-600",
            hint: "Live services",
          },
          {
            label: "Not Connected",
            value: stats.notConnected,
            icon: PlugZap,
            tone: "bg-slate-100 text-slate-600",
            hint: "Awaiting setup",
          },
          {
            label: "Webhooks",
            value: stats.webhooks,
            icon: Webhook,
            tone: "bg-sky-50 text-sky-600",
            hint: "Demo endpoints",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
                </div>
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", card.tone)}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {integrationCategoryOptions.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={activeCategory === option}
                onClick={() => setActiveCategory(option)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                  activeCategory === option
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="w-full max-w-md">
            <label htmlFor="integration-search" className="sr-only">
              Search integrations
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                id="integration-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search integrations..."
                className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:max-w-xs">
            <Label htmlFor="status-filter">Status</Label>
            <Select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {integrationStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            leftIcon={<RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {filteredIntegrations.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center shadow-sm">
          <p className="text-xl font-semibold text-slate-900">No integrations found</p>
          <p className="mt-2 text-sm text-slate-600">Try changing your search or filter.</p>
          <Button type="button" variant="outline" className="mt-4" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredIntegrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              testState={testResults[integration.id]}
              onView={(item) => setDetailsId(item.id)}
              onConfigure={(item) => setConfigId(item.id)}
              onToggle={handleToggleEnabled}
              onTest={handleTestConnection}
            />
          ))}
        </div>
      )}

      <WebhookSection
        webhooks={webhooks}
        onCreate={createWebhook}
        onUpdate={updateWebhook}
        onDelete={deleteWebhook}
      />

      <section
        className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        aria-labelledby="integration-activity-heading"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 id="integration-activity-heading" className="text-lg font-semibold text-slate-900">
              Recent Activity
            </h2>
            <p className="mt-1 text-sm text-slate-600">Demo activity log for integration settings.</p>
          </div>
          <Activity className="h-5 w-5 text-slate-500" aria-hidden="true" />
        </div>
        <ul className="mt-4 space-y-2">
          {adminIntegrationActivity.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <span className="mt-1.5 h-2 w-2 rounded-full bg-primary-600" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{item.action}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {item.actor} · {item.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <IntegrationDetailsModal
        integration={detailsIntegration}
        open={Boolean(detailsIntegration)}
        onOpenChange={(next) => {
          if (!next) setDetailsId(null);
        }}
        webhooks={webhooks}
        activity={adminIntegrationActivity}
        testState={detailsIntegration ? testResults[detailsIntegration.id] : undefined}
        onTest={handleTestConnection}
        onToggle={handleToggleEnabled}
      />

      <IntegrationConfigModal
        integration={configIntegration}
        open={Boolean(configIntegration)}
        onOpenChange={(next) => {
          if (!next) setConfigId(null);
        }}
        onSave={handleSaveConfig}
      />

      <Dialog open={docsOpen} onOpenChange={setDocsOpen}>
        <DialogContent
          onClose={() => setDocsOpen(false)}
          className="max-h-[90vh] overflow-y-auto sm:max-w-xl"
          aria-labelledby="integration-docs-title"
        >
          <DialogHeader>
            <DialogTitle id="integration-docs-title">Integration Documentation</DialogTitle>
            <DialogDescription>
              Local placeholder guide. No external documentation is linked.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-slate-600">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Create the provider account and generate API credentials in the provider dashboard.</li>
              <li>Store credentials server-side using secure environment variables or a secrets manager.</li>
              <li>Implement server-side API routes that call the provider and validate responses.</li>
              <li>Verify webhook signatures before trusting any incoming payload.</li>
              <li>Enable the integration in this demo UI to preview the admin experience.</li>
            </ol>
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                Production credentials must be handled server-side. Frontend configuration is not
                security.
              </p>
            </div>
          </div>
          <DialogFooter className="border-t border-slate-200 pt-4">
            <Button type="button" variant="outline" onClick={() => setDocsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent
          onClose={() => setAddOpen(false)}
          className="max-h-[90vh] overflow-y-auto sm:max-w-xl"
          aria-labelledby="integration-add-title"
        >
          <DialogHeader>
            <DialogTitle id="integration-add-title">Add Integration</DialogTitle>
            <DialogDescription>
              Create a mock integration entry. No external connection is made.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="add-name" required>
                Integration Name
              </Label>
              <Input
                id="add-name"
                value={addValues.name}
                maxLength={80}
                placeholder="e.g. Payment Gateway"
                onChange={(event) => setAddValues((current) => ({ ...current, name: event.target.value }))}
              />
              {addErrors.name ? <p className="mt-1 text-xs text-red-600">{addErrors.name}</p> : null}
            </div>

            <div>
              <Label htmlFor="add-provider" required>
                Provider
              </Label>
              <Input
                id="add-provider"
                value={addValues.provider}
                maxLength={80}
                placeholder="e.g. Razorpay"
                onChange={(event) =>
                  setAddValues((current) => ({ ...current, provider: event.target.value }))
                }
              />
              {addErrors.provider ? (
                <p className="mt-1 text-xs text-red-600">{addErrors.provider}</p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="add-category" required>
                  Category
                </Label>
                <Select
                  id="add-category"
                  value={addValues.category}
                  onChange={(event) =>
                    setAddValues((current) => ({ ...current, category: event.target.value }))
                  }
                >
                  {integrationCategoryOptions
                    .filter((option) => option !== "All")
                    .map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </Select>
                {addErrors.category ? (
                  <p className="mt-1 text-xs text-red-600">{addErrors.category}</p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="add-environment">Environment</Label>
                <Select
                  id="add-environment"
                  value={addValues.environment}
                  onChange={(event) =>
                    setAddValues((current) => ({ ...current, environment: event.target.value }))
                  }
                >
                  {integrationEnvironmentOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                rows={3}
                maxLength={300}
                value={addValues.description}
                placeholder="Short description of the future integration."
                onChange={(event) =>
                  setAddValues((current) => ({ ...current, description: event.target.value }))
                }
              />
              {addErrors.description ? (
                <p className="mt-1 text-xs text-red-600">{addErrors.description}</p>
              ) : null}
            </div>

            <DialogFooter className="border-t border-slate-200 pt-4">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Integration</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
