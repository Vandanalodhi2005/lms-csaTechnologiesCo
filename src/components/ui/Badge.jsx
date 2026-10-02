import * as React from "react";
import { cn } from "@/utils";

const badgeVariants = {
  default: "bg-primary-50 text-primary-700 border-primary-200",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
  secondary: "bg-dark-100 text-dark-700 border-dark-200",
  outline: "bg-transparent text-dark-700 border-dark-200",
  purple: "bg-violet-50 text-violet-700 border-violet-200",
};

const badgeSizes = {
  sm: "px-2 py-0.5 text-[10px]",
  default: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1 text-sm",
};

const dotColors = {
  default: "bg-primary-600",
  success: "bg-green-600",
  warning: "bg-amber-500",
  danger: "bg-red-600",
  info: "bg-sky-600",
  secondary: "bg-dark-500",
  purple: "bg-violet-600",
};

export const Badge = ({
  variant = "default",
  size = "default",
  className,
  dot = false,
  children,
  rounded = "full",
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border font-medium transition-colors",
        rounded === "full" ? "rounded-full" : "rounded-md",
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant])} />}
      {children}
    </span>
  );
};

export default Badge;
