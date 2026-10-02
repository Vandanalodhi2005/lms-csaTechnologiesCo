"use client";

import * as React from "react";
import { cn } from "@/utils";
import { Star, StarHalf } from "lucide-react";

export const Rating = React.forwardRef(function Rating(
  {
    value = 0,
    max = 5,
    size = "md",
    allowHalf = true,
    readOnly = true,
    onChange,
    showValue = false,
    showCount,
    className,
    color = "warning",
    ...props
  },
  ref
) {
  const [hoverValue, setHoverValue] = React.useState(null);
  const displayValue = hoverValue !== null ? hoverValue : value;

  const sizeClass = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-7 w-7",
  }[size];

  const fillColor = {
    warning: "text-amber-500",
    primary: "text-primary-600",
    success: "text-success",
  }[color];

  return (
    <div
      ref={ref}
      className={cn("inline-flex items-center gap-1.5 group", className)}
      {...props}
    >
      <div className={cn(
        "relative flex items-center",
        !readOnly && "cursor-pointer"
      )}>
        <div className="flex items-center gap-0.5 relative">
          {Array.from({ length: max }).map((_, i) => {
            const starValue = i + 1;
            const filled = displayValue >= starValue;
            const half = allowHalf && !filled && displayValue >= starValue - 0.5 && displayValue < starValue;
            return (
              <button
                key={i}
                type="button"
                role={!readOnly ? "radio" : undefined}
                aria-label={`${starValue} star${starValue > 1 ? "s" : ""} out of ${max}`}
                disabled={readOnly}
                className={cn(
                  "relative transition-transform",
                  !readOnly && "hover:scale-110 active:scale-95",
                  readOnly && "cursor-default pointer-events-none"
                )}
                onMouseEnter={() => !readOnly && setHoverValue(starValue)}
                onMouseLeave={() => !readOnly && setHoverValue(null)}
                onClick={() => !readOnly && onChange?.(starValue)}
              >
                <Star
                  className={cn(
                    sizeClass,
                    "stroke-current flex-shrink-0",
                    filled || half ? fillColor : "text-dark-200"
                  )}
                  fill={filled ? "currentColor" : half ? "url(#half)" : "none"}
                  strokeLinejoin="round"
                />
                {half && (
                  <StarHalf
                    className={cn(
                      sizeClass,
                      "absolute inset-0",
                      fillColor
                    )}
                  />
                )}
              </button>
            );
          })}
          <svg className="absolute w-0 h-0" aria-hidden>
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-dark-700 tabular-nums">
          {Number(value).toFixed(1)}
        </span>
      )}
      {typeof showCount !== "undefined" && (
        <span className="text-xs text-dark-500">({showCount})</span>
      )}
    </div>
  );
});

export default Rating;
