"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormField } from "@/components/ui/Label.jsx";
import { cn } from "@/utils";

export const PasswordInput = React.forwardRef(function PasswordInput(
  { label, required, error, hint, success, id, className, wrapperClassName, placeholder = "Enter your password", ...props },
  ref
) {
  const [show, setShow] = React.useState(false);
  const autoId = React.useId();
  const inputId = id || `password-${autoId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const toggleId = `${inputId}-toggle`;
  return (
    <FormField label={label} required={required} error={error} hint={hint} success={success} className={wrapperClassName}>
      <div className={cn("relative w-full", wrapperClassName)}>
        <input
          id={inputId}
          ref={ref}
          type={show ? "text" : "password"}
          aria-invalid={!!error}
          aria-describedby={error ? `${errorId} ${toggleId}` : toggleId}
          placeholder={placeholder}
          className={cn(
            "flex h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 pr-11 py-2 text-sm text-[#0F172A] placeholder:text-[#64748B]/70 transition-all",
            "focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <button
          id={toggleId}
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#64748B] hover:text-[#0F2F5F] focus:outline-none focus:ring-2 focus:ring-[#2563EB] rounded-md"
          tabIndex={0}
        >
          {show ? <EyeOff className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} /> : <Eye className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />}
        </button>
      </div>
    </FormField>
  );
});

export default PasswordInput;
