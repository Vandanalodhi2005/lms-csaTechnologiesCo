"use client";

import * as React from "react";
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";
import Label from "@/components/ui/Label.jsx";
import Select from "@/components/ui/Select.jsx";
import Textarea from "@/components/ui/Textarea.jsx";
import IntegrationStatusBadge from "./IntegrationStatusBadge.jsx";
import {
  ConfirmDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog.jsx";
import {
  formatWebhookDate,
  webhookEventOptions,
  webhookStatusOptions,
} from "@/constants/adminWebhooks.js";
import { toast } from "sonner";
import { Eye, Pencil, Plus, PlugZap, Power, PowerOff, Trash2 } from "lucide-react";

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function emptyForm() {
  return {
    event: webhookEventOptions[0],
    endpoint: "",
    description: "",
    status: "Not Connected",
  };
}

function DetailItem({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

export default function WebhookSection({ webhooks = [], onCreate, onUpdate, onDelete }) {
  const [detailsHook, setDetailsHook] = React.useState(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState("add");
  const [editingId, setEditingId] = React.useState(null);
  const [formValues, setFormValues] = React.useState(emptyForm);
  const [formErrors, setFormErrors] = React.useState({});
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  function openAdd() {
    setFormMode("add");
    setEditingId(null);
    setFormValues(emptyForm());
    setFormErrors({});
    setFormOpen(true);
  }

  function openEdit(hook) {
    setFormMode("edit");
    setEditingId(hook.id);
    setFormValues({
      event: hook.event,
      endpoint: hook.endpoint,
      description: hook.description || "",
      status: hook.status,
    });
    setFormErrors({});
    setFormOpen(true);
  }

  function validate(values) {
    const errors = {};
    if (!values.event) errors.event = "Event is required.";
    if (!values.endpoint.trim()) {
      errors.endpoint = "Endpoint is required.";
    } else if (!isValidUrl(values.endpoint.trim())) {
      errors.endpoint = "Enter a valid URL starting with http:// or https://.";
    } else if (values.endpoint.trim().length > 500) {
      errors.endpoint = "Endpoint cannot exceed 500 characters.";
    }
    if (!values.status) errors.status = "Status is required.";
    return errors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = {
      event: formValues.event,
      endpoint: formValues.endpoint.trim(),
      description: formValues.description.trim(),
      status: formValues.status,
    };

    if (formMode === "edit" && editingId) {
      onUpdate?.(editingId, payload);
      toast.success("Webhook updated in demo configuration.");
    } else {
      onCreate?.(payload);
      toast.success("Webhook added in demo configuration.");
    }
    setFormOpen(false);
  }

  function toggleHookStatus(hook, enabled) {
    const nextStatus = enabled ? "Demo" : "Disabled";
    onUpdate?.(hook.id, { status: nextStatus });
    setDetailsHook((current) => (current && current.id === hook.id ? { ...current, status: nextStatus } : current));
    toast.success(enabled ? "Webhook enabled in demo mode." : "Webhook disabled in demo mode.");
  }

  function testHook() {
    toast.success("Webhook test simulated locally. No request was sent.");
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    onDelete?.(deleteTarget.id);
    setDetailsHook((current) => (current && current.id === deleteTarget.id ? null : current));
    setDeleteTarget(null);
    toast.success("Webhook deleted from demo configuration.");
  }

  return (
    <>
      <section
        className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        aria-labelledby="webhooks-heading"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="webhooks-heading" className="text-lg font-semibold text-slate-900">
              Webhooks
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Demo webhook endpoints. No request is ever sent from this page.
            </p>
          </div>
          <Button
            type="button"
            leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}
            onClick={openAdd}
          >
            Add Webhook
          </Button>
        </div>

        {webhooks.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
            No webhook endpoints configured.
          </p>
        ) : (
          <>
            <div className="mt-5 hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <caption className="sr-only">Configured demo webhook endpoints</caption>
                  <thead className="bg-slate-100">
                    <tr>
                      {["Webhook ID", "Event", "Endpoint", "Status", "Last Triggered", "Actions"].map(
                        (header) => (
                          <th
                            key={header}
                            scope="col"
                            className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {webhooks.map((hook) => (
                      <tr key={hook.id} className="border-t border-slate-200 bg-white hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-xs text-slate-700">{hook.id}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-700">{hook.event}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          <span className="block max-w-[16rem] truncate" title={hook.endpoint}>
                            {hook.endpoint}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <IntegrationStatusBadge status={hook.status} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {formatWebhookDate(hook.lastTriggered)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              aria-label={`View webhook ${hook.id}`}
                              onClick={() => setDetailsHook(hook)}
                            >
                              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              aria-label={`Edit webhook ${hook.id}`}
                              onClick={() => openEdit(hook)}
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              aria-label={`Delete webhook ${hook.id}`}
                              onClick={() => setDeleteTarget(hook)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-5 grid gap-3 lg:hidden">
              {webhooks.map((hook) => (
                <div key={hook.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-slate-500">{hook.id}</p>
                      <p className="mt-0.5 font-mono text-sm text-slate-800">{hook.event}</p>
                    </div>
                    <IntegrationStatusBadge status={hook.status} size="sm" />
                  </div>
                  <p className="mt-2 break-all font-mono text-xs text-slate-600">{hook.endpoint}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Last triggered: {formatWebhookDate(hook.lastTriggered)} · Retries {hook.retryCount}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setDetailsHook(hook)}>
                      View
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => openEdit(hook)}>
                      Edit
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setDeleteTarget(hook)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent
          onClose={() => setFormOpen(false)}
          className="max-h-[90vh] overflow-y-auto sm:max-w-xl"
          aria-labelledby="webhook-form-title"
        >
          <DialogHeader>
            <DialogTitle id="webhook-form-title">
              {formMode === "edit" ? "Edit Webhook" : "Add Webhook"}
            </DialogTitle>
            <DialogDescription>
              Demo configuration only. No request is sent and nothing is stored server-side.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="webhook-event" required>
                Event
              </Label>
              <Select
                id="webhook-event"
                value={formValues.event}
                onChange={(event) => setFormValues((current) => ({ ...current, event: event.target.value }))}
              >
                {webhookEventOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              {formErrors.event ? <p className="mt-1 text-xs text-red-600">{formErrors.event}</p> : null}
            </div>

            <div>
              <Label htmlFor="webhook-endpoint" required>
                Endpoint
              </Label>
              <Input
                id="webhook-endpoint"
                type="url"
                inputMode="url"
                value={formValues.endpoint}
                placeholder="https://demo.edulearn.local/webhooks/example"
                maxLength={500}
                onChange={(event) => setFormValues((current) => ({ ...current, endpoint: event.target.value }))}
              />
              {formErrors.endpoint ? (
                <p className="mt-1 text-xs text-red-600">{formErrors.endpoint}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="webhook-description">Description</Label>
              <Textarea
                id="webhook-description"
                rows={3}
                maxLength={200}
                value={formValues.description}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, description: event.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="webhook-status" required>
                Status
              </Label>
              <Select
                id="webhook-status"
                value={formValues.status}
                onChange={(event) => setFormValues((current) => ({ ...current, status: event.target.value }))}
              >
                {webhookStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>

            <DialogFooter className="border-t border-slate-200 pt-4">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{formMode === "edit" ? "Save Webhook" : "Add Webhook"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(detailsHook)}
        onOpenChange={(next) => {
          if (!next) setDetailsHook(null);
        }}
      >
        <DialogContent
          onClose={() => setDetailsHook(null)}
          className="max-h-[90vh] overflow-y-auto sm:max-w-xl"
          aria-labelledby="webhook-details-title"
        >
          <DialogHeader>
            <DialogTitle id="webhook-details-title">Webhook Details</DialogTitle>
            <DialogDescription>
              Demo webhook configuration. No requests are sent from this page.
            </DialogDescription>
          </DialogHeader>

          {detailsHook ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="min-w-0">
                  <p className="font-mono text-sm text-slate-800">{detailsHook.id}</p>
                  <p className="font-mono text-xs text-slate-500">{detailsHook.event}</p>
                </div>
                <IntegrationStatusBadge status={detailsHook.status} />
              </div>

              <dl className="grid gap-2 sm:grid-cols-2">
                <DetailItem label="Webhook ID" value={detailsHook.id} />
                <DetailItem label="Event" value={detailsHook.event} />
                <DetailItem label="Status" value={detailsHook.status} />
                <DetailItem label="Created" value={formatWebhookDate(detailsHook.createdAt)} />
                <DetailItem label="Last Triggered" value={formatWebhookDate(detailsHook.lastTriggered)} />
                <DetailItem label="Retry Count" value={detailsHook.retryCount} />
              </dl>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Endpoint</p>
                <p className="mt-1 break-all font-mono text-xs text-slate-700">{detailsHook.endpoint}</p>
              </div>

              {detailsHook.description ? (
                <p className="text-sm text-slate-600">{detailsHook.description}</p>
              ) : null}
            </div>
          ) : null}

          <DialogFooter className="border-t border-slate-200 pt-4">
            <Button type="button" variant="outline" onClick={() => setDetailsHook(null)}>
              Close
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!detailsHook}
              leftIcon={<PlugZap className="h-4 w-4" aria-hidden="true" />}
              onClick={testHook}
            >
              Test
            </Button>
            {detailsHook && detailsHook.status !== "Disabled" ? (
              <Button
                type="button"
                variant="secondary"
                leftIcon={<PowerOff className="h-4 w-4" aria-hidden="true" />}
                onClick={() => toggleHookStatus(detailsHook, false)}
              >
                Disable
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!detailsHook}
                leftIcon={<Power className="h-4 w-4" aria-hidden="true" />}
                onClick={() => toggleHookStatus(detailsHook, true)}
              >
                Enable
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(next) => {
          if (!next) setDeleteTarget(null);
        }}
        title="Delete Webhook?"
        description="Delete this demo webhook configuration?"
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />

    </>
  );
}

