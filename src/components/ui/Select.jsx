"use client";

import * as React from "react";
import { cn } from "@/utils";
import { ChevronDown } from "lucide-react";

export const Select = React.forwardRef(function Select(
  { className, children, wrapperClassName, ...props },
  ref
) {
  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full appearance-none rounded-lg border border-dark-200 bg-white px-3 py-2 pr-10 text-sm text-dark-900",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" />
    </div>
  );
});

export const SelectItem = ({ value, children, ...props }) => (
  <option value={value} {...props}>
    {children}
  </option>
);

export default Select;
