"use client";

import * as React from "react";
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";
import Label from "@/components/ui/Label.jsx";
import Select from "@/components/ui/Select.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog.jsx";
import { integrationEnvironmentOptions } from "@/constants/adminIntegrations.js";
import { ShieldAlert, TriangleAlert } from "lucide-react";

// SECURITY: Values entered here are held in component state only and are discarded on
// close/save. They are never logged, transmitted, or written to localStorage/sessionStorage.
export default function IntegrationConfigModal({ integration, open, onOpenChange, onSave }) {
  const [values, setValues] = React.useState({});
  const [environment, setEnvironment] = React.useState("Demo");

  React.useEffect(() => {
    if (open && integration) {
      setValues({});
      setEnvironment(integration.environment || "Demo");
    }
  }, [open, integration]);

  if (!integration) return null;

  const isProduction = environment === "Production";

  const handleSave = () => {
    if (isProduction) return;
    // Deliberately drop the entered values. Nothing is stored, logged, or sent anywhere.
    setValues({});
    onSave?.({ environment });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClose={() => onOpenChange(false)}
        className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
        aria-labelledby="integration-config-title"
      >
        <DialogHeader>
          <DialogTitle id="integration-config-title">Configure Integration</DialogTitle>
          <DialogDescription>
            {integration.name} · {integration.provider}. Fields are demo placeholders only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {integration.configurationFields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={`config-${field.name}`}>{field.label}</Label>
              <Input
                id={`config-${field.name}`}
                name={field.name}
                type={field.type === "password" ? "password" : field.type === "email" ? "email" : "text"}
                value={values[field.name] || ""}
                autoComplete="off"
                placeholder={
                  field.type === "password"
                    ? "Enter value (never stored in this demo)"
                    : "Enter value"
                }
                onChange={(event) =>
                  setValues((current) => ({ ...current, [field.name]: event.target.value }))
                }
              />
            </div>
          ))}

          <div>
            <Label htmlFor="config-environment">Environment</Label>
            <Select
              id="config-environment"
              value={environment}
              onChange={(event) => setEnvironment(event.target.value)}
            >
              {integrationEnvironmentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            {isProduction ? (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-amber-700">
                <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                Production mode is currently unavailable in this demo implementation.
              </p>
            ) : null}
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-semibold">Security notice</p>
              <p>
                Never store production API secrets in client-side code, localStorage, public
                environment variables, or browser state.
              </p>
              <p>
                Production credentials must be handled server-side using secure environment
                variables or a secrets manager.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-slate-200 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={isProduction} onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
