"use client";

import * as React from "react";
import { cn } from "@/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = {
  default: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
  destructive: "bg-danger text-white hover:bg-danger/90 shadow-sm",
  outline:
    "border border-dark-200 bg-white text-dark-900 hover:bg-dark-50 hover:border-dark-300",
  secondary:
    "bg-dark-100 text-dark-900 hover:bg-dark-200 border border-dark-200",
  ghost: "text-dark-700 hover:bg-dark-100 hover:text-dark-900",
  link: "text-primary-600 underline-offset-4 hover:underline p-0 h-auto",
  success: "bg-success text-white hover:bg-success/90 shadow-sm",
  warning: "bg-warning text-white hover:bg-warning/90 shadow-sm",
};

const buttonSizes = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs rounded-md",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-base",
  icon: "h-10 w-10",
  "icon-sm": "h-8 w-8",
};

export const Button = React.forwardRef(function Button(
  {
    className,
    variant = "default",
    size = "default",
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    children,
    asChild = false,
    ...props
  },
  ref
) {
  const baseClasses = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    buttonVariants[variant],
    buttonSizes[size],
    loading && "opacity-70 cursor-not-allowed",
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      className: cn(baseClasses, children.props.className),
      ...props,
      ...(disabled || loading ? { "data-disabled": true, "aria-disabled": true } : {}),
    });
  }

  const Comp = props.href ? "a" : "button";

  return (
    <Comp
      ref={ref}
      type={Comp === "button" ? props.type || "button" : undefined}
      disabled={disabled || loading}
      className={baseClasses}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </Comp>
  );
});

export default Button;
