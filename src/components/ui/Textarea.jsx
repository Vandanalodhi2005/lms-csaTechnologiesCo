"use client";

import * as React from "react";
import { cn } from "@/utils";

export const Textarea = React.forwardRef(function Textarea(
  { className, rows = 4, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-dark-200 bg-white px-3 py-2 text-sm text-dark-900 placeholder:text-dark-400 resize-y transition-all",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

export default Textarea;
