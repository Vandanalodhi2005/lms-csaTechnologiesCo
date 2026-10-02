"use client";

import * as React from "react";
import Input from "@/components/ui/Input.jsx";
import { FormField } from "@/components/ui/Label.jsx";
import { cn } from "@/utils";

export const FormInput = React.forwardRef(function FormInput(
  { label, required, error, hint, success, id, className, wrapperClassName, ...props },
  ref
) {
  const autoId = React.useId();
  const inputId = id || `field-${autoId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <FormField label={label} required={required} error={error} hint={hint} success={success} className={wrapperClassName}>
      <Input
        id={inputId}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={cn("h-11 rounded-xl", className)}
        wrapperClassName="w-full"
        {...props}
      />
    </FormField>
  );
});

export default FormInput;
