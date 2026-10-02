import * as React from "react";
import { cn } from "@/utils";
import { FileText, Search, Ban, Inbox, FolderOpen, AlertCircle, ShoppingCart } from "lucide-react";

const icons = {
  default: Inbox,
  empty: FolderOpen,
  search: Search,
  error: AlertCircle,
  noData: FileText,
  blocked: Ban,
  cart: ShoppingCart,
};

export const EmptyState = ({
  icon = "default",
  title,
  description,
  action,
  secondaryAction,
  className,
  compact = false,
}) => {
  const Icon = icons[icon] || icons.default;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center w-full",
        compact ? "py-8 px-4" : "py-16 px-6",
        className
      )}
    >
      <div className={cn(
        "rounded-full bg-dark-50 flex items-center justify-center mb-5 border border-dark-100",
        compact ? "h-14 w-14" : "h-20 w-20"
      )}>
        <Icon className={cn(
          "text-dark-400",
          compact ? "h-7 w-7" : "h-10 w-10"
        )} />
      </div>
      <div className="space-y-1.5 max-w-sm mb-6">
        <h3 className={cn(
          "font-semibold text-dark-900 tracking-tight",
          compact ? "text-base" : "text-lg"
        )}>
          {title || "Nothing here yet"}
        </h3>
        {description && (
          <p className="text-sm text-dark-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
