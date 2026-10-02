"use client";

import * as React from "react";
import { cn } from "@/utils";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import Button from "./Button.jsx";

export const Dialog = ({
  open,
  onOpenChange,
  children,
  className,
  ...props
}) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onOpenChange?.(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const content = (
    <div
      aria-modal="true"
      role="dialog"
      className={cn("fixed inset-0 z-50 flex items-end sm:items-center justify-center", className)}
      {...props}
    >
      <div
        className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-10 w-full max-w-lg mx-4 mb-4 sm:mb-0 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 ease-out">
        {children}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
};

const DialogContent = React.forwardRef(function DialogContent(
  { className, children, showClose = true, onClose, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full flex-col gap-4 rounded-2xl border border-dark-100 bg-white p-6 shadow-2xl sm:p-8",
        className
      )}
      {...props}
    >
      {children}
      {showClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-dark-400 opacity-70 hover:bg-dark-100 hover:text-dark-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
});

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);

const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0", className)} {...props} />
);

const DialogTitle = React.forwardRef(function DialogTitle(
  { className, ...props },
  ref
) {
  return (
    <h2
      ref={ref}
      className={cn("text-xl font-semibold leading-none tracking-tight text-dark-900", className)}
      {...props}
    />
  );
});

const DialogDescription = React.forwardRef(function DialogDescription(
  { className, ...props },
  ref
) {
  return (
    <p ref={ref} className={cn("text-sm text-dark-500", className)} {...props} />
  );
});

const ConfirmDialog = ({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
  loading,
  confirmButtonProps,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent onClose={() => onOpenChange?.(false)} className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <DialogFooter className="mt-4">
        <Button
          variant="outline"
          onClick={() => onOpenChange?.(false)}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant={variant === "destructive" ? "destructive" : variant}
          onClick={onConfirm}
          loading={loading}
          {...confirmButtonProps}
        >
          {confirmText}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export {
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  ConfirmDialog,
};

export default Dialog;
