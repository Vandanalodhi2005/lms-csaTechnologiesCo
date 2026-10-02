import * as React from "react";
import { cn } from "@/utils";

const Label = React.forwardRef(function Label(
  { className, required, children, ...props },
  ref
) {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-dark-700 mb-1.5 inline-flex items-center gap-1",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-danger font-semibold">*</span>}
    </label>
  );
});

const HelperText = ({ error, success, className, children }) => {
  if (error) {
    return (
      <p className={cn("mt-1.5 text-xs text-danger flex items-center gap-1", className)}>
        {children}
      </p>
    );
  }
  if (success) {
    return (
      <p className={cn("mt-1.5 text-xs text-success flex items-center gap-1", className)}>
        {children}
      </p>
    );
  }
  return (
    <p className={cn("mt-1.5 text-xs text-dark-500", className)}>{children}</p>
  );
};

const FormField = ({ label, required, error, hint, success, children, className }) => {
  return (
    <div className={cn("w-full space-y-0", className)}>
      {label && (
        <Label required={required}>{label}</Label>
      )}
      {children}
      {(error || hint || success) && (
        <HelperText error={error} success={success}>
          {error || success || hint}
        </HelperText>
      )}
    </div>
  );
};

export { Label, HelperText, FormField };
export default Label;
