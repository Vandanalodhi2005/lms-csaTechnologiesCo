"use client";

import * as React from "react";
import { cn } from "@/utils";

export const Input = React.forwardRef(function Input(
  { className, type = "text", leftIcon, rightIcon, wrapperClassName, ...props },
  ref
) {
  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      {leftIcon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-dark-400">
          {typeof leftIcon === "string" ? (
            <span className="text-sm">{leftIcon}</span>
          ) : (
            React.cloneElement(leftIcon, { className: "h-4 w-4" })
          )}
        </div>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border border-dark-200 bg-white px-3 py-2 text-sm text-dark-900 placeholder:text-dark-400 transition-all",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          leftIcon && "pl-10",
          rightIcon && "pr-10",
          type === "number" && "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
        {...props}
      />
      {rightIcon && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-dark-400">
          {typeof rightIcon === "string" ? (
            <span className="text-sm">{rightIcon}</span>
          ) : (
            React.cloneElement(rightIcon, { className: "h-4 w-4" })
          )}
        </div>
      )}
    </div>
  );
});

export default Input;
