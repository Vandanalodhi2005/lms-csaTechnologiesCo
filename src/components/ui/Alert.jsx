import * as React from "react";
import { cn } from "@/utils";
import { Check, X, Info, AlertTriangle, AlertCircle } from "lucide-react";

const alertVariants = {
  default: "bg-primary-50 border-primary-200 text-primary-800",
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  danger: "bg-red-50 border-red-200 text-red-800",
  info: "bg-sky-50 border-sky-200 text-sky-800",
  muted: "bg-dark-50 border-dark-200 text-dark-800",
};

const alertIcons = {
  default: Info,
  success: Check,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
  muted: Info,
};

export const Alert = ({ variant = "default", className, title, description, dismissible, onDismiss, icon, children }) => {
  const Icon = alertIcons[variant];
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-xl border p-4 shadow-sm",
        alertVariants[variant],
        className
      )}
    >
      <div className="flex gap-3">
        {icon !== false && (
          <div className="flex-shrink-0 pt-0.5">
            {icon || React.createElement(Icon, { className: "h-5 w-5 flex-shrink-0" })}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && <div className="font-semibold leading-6 mb-0.5">{title}</div>}
          {(description || children) && (
            <div className="text-sm opacity-90 leading-relaxed">
              {description || children}
            </div>
          )}
        </div>
        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
