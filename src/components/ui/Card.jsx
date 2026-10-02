import * as React from "react";
import { cn } from "@/utils";

export const Card = React.forwardRef(function Card(
  { className, hoverable = false, as: Component = "div", ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={cn(
        "rounded-2xl border border-dark-100 bg-white shadow-card",
        hoverable &&
          "transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      {...props}
    />
  );
});

const CardHeader = React.forwardRef(function CardHeader(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
      {...props}
    />
  );
});

const CardTitle = React.forwardRef(function CardTitle(
  { className, ...props },
  ref
) {
  return (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-dark-900", className)}
      {...props}
    />
  );
});

const CardDescription = React.forwardRef(function CardDescription(
  { className, ...props },
  ref
) {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-dark-500", className)}
      {...props}
    />
  );
});

const CardContent = React.forwardRef(function CardContent(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-2", className)}
      {...props}
    />
  );
});

const CardFooter = React.forwardRef(function CardFooter(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-4 gap-2", className)}
      {...props}
    />
  );
});

export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
