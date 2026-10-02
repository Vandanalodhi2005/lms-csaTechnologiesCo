"use client";

import * as React from "react";
import { cn } from "@/utils";

export const Tabs = ({ defaultValue, value, onValueChange, className, children, ...props }) => {
  const [active, setActive] = React.useState(value || defaultValue || "");
  const currentValue = value !== undefined ? value : active;

  const handleChange = (val) => {
    if (value === undefined) setActive(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsContext = React.createContext(null);

function useTabs() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within Tabs");
  return ctx;
}

const TabsList = React.forwardRef(function TabsList(
  { className, children, variant = "default", ...props },
  ref
) {
  const variants = {
    default:
      "inline-flex h-11 items-center justify-center rounded-xl bg-dark-100/70 p-1 gap-1 text-dark-600",
    line: "inline-flex h-11 items-center justify-center border-b border-dark-200 w-full gap-6 text-dark-500",
    pills: "inline-flex items-center justify-center gap-2 flex-wrap",
  };
  return (
    <div
      ref={ref}
      role="tablist"
      data-variant={variant}
      className={cn(variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
});

const TabsTrigger = React.forwardRef(function TabsTrigger(
  { value, className, children, variant = "default", disabled, ...props },
  ref
) {
  const { value: active, onChange } = useTabs();
  const isActive = active === value;
  const baseClass = {
    default: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all",
      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
      "disabled:pointer-events-none disabled:opacity-50",
      isActive
        ? "bg-white text-primary-700 shadow-sm ring-1 ring-dark-200"
        : "text-dark-600 hover:text-dark-900 hover:bg-white/60"
    ),
    line: cn(
      "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all -mb-px h-full border-b-2 px-1",
      "focus:outline-none",
      isActive
        ? "border-primary-600 text-primary-700"
        : "border-transparent text-dark-500 hover:text-dark-800 hover:border-dark-300"
    ),
    pills: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all",
      "focus:outline-none focus:ring-2 focus:ring-primary-500",
      "disabled:pointer-events-none disabled:opacity-50",
      isActive
        ? "bg-primary-600 text-white shadow-sm"
        : "bg-white border border-dark-200 text-dark-700 hover:bg-dark-50"
    ),
  };
  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => onChange(value)}
      className={cn(baseClass[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
});

const TabsContent = React.forwardRef(function TabsContent(
  { value, className, children, forceMount = false, ...props },
  ref
) {
  const { value: active } = useTabs();
  if (!forceMount && active !== value) return null;
  return (
    <div
      ref={ref}
      role="tabpanel"
      hidden={active !== value}
      className={cn("mt-6 focus:outline-none animate-fadeIn", className)}
      {...props}
    >
      {children}
    </div>
  );
});

export { TabsList, TabsTrigger, TabsContent };
export default Tabs;
