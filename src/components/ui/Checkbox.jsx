"use client";

import * as React from "react";
import { cn } from "@/utils";
import { Check, X } from "lucide-react";

const Checkbox = React.forwardRef(function Checkbox(
  { className, checked, onCheckedChange, label, error, ...props },
  ref
) {
  const handleChange = (e) => {
    if (onCheckedChange) onCheckedChange(e.target.checked);
    if (props.onChange) props.onChange(e);
  };
  return (
    <label className={cn("inline-flex items-start gap-2.5 cursor-pointer group", className)}>
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          ref={ref}
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 rounded border-2 transition-all duration-200",
            "peer-checked:bg-primary-600 peer-checked:border-primary-600",
            "peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-1",
            error ? "border-danger bg-danger/5" : "border-dark-300 bg-white group-hover:border-primary-400",
            props.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Check
            className={cn(
              "h-full w-full p-0.5 text-white transition-all duration-200",
              checked ? "opacity-100 scale-100" : "opacity-0 scale-50"
            )}
            strokeWidth={3.5}
          />
        </div>
      </div>
      {label && (
        <span
          className={cn(
            "text-sm leading-tight select-none",
            props.disabled ? "text-dark-400" : "text-dark-700"
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
});

const Switch = React.forwardRef(function Switch(
  { className, checked = false, onCheckedChange, label, disabled, ...props },
  ref
) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        ref={ref}
        onClick={() => !disabled && onCheckedChange?.(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          checked ? "bg-primary-600" : "bg-dark-200"
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      {label && <span className="text-sm font-medium text-dark-700">{label}</span>}
    </label>
  );
});

export { Checkbox, Switch };
export default Checkbox;
