import * as React from "react";
import { cn } from "@/utils";

export const ProgressBar = React.forwardRef(function ProgressBar(
  { value = 0, max = 100, size = "md", color = "primary", showLabel = false, labelPosition = "right", className, labelFormatter, ...props },
  ref
) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const heightClass = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
    xl: "h-4",
  }[size];
  const colorClass = {
    primary: "bg-primary-600",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    info: "bg-sky-600",
    secondary: "bg-dark-500",
  }[color];

  const label = labelFormatter ? labelFormatter(value, max, percent) : `${percent}%`;

  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      <div
        className={cn(
          "flex items-center w-full gap-3",
          labelPosition === "inside" ? "relative" : ""
        )}
      >
        <div
          className={cn(
            "relative flex-1 w-full overflow-hidden rounded-full bg-dark-100",
            heightClass
          )}
        >
          <div
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              colorClass
            )}
            style={{ width: `${percent}%` }}
          />
          {labelPosition === "inside" && showLabel && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-dark-900 drop-shadow-sm">
                {label}
              </span>
            </div>
          )}
        </div>
        {labelPosition === "right" && showLabel && (
          <span className="shrink-0 text-xs font-semibold text-dark-600 tabular-nums w-10 text-right">
            {label}
          </span>
        )}
      </div>
    </div>
  );
});

export default ProgressBar;
