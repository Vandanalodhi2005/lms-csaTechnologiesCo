import * as React from "react";
import { cn } from "@/utils";

export const Table = React.forwardRef(function Table(
  { className, containerClassName, ...props },
  ref
) {
  return (
    <div className={cn("w-full overflow-auto scrollbar-thin rounded-xl border border-dark-100", containerClassName)}>
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
});

const TableHeader = React.forwardRef(function TableHeader(
  { className, sticky = false, ...props },
  ref
) {
  return (
    <thead
      ref={ref}
      className={cn(
        "[&_tr]:border-b border-dark-100 bg-dark-50/60",
        sticky && "sticky top-0 z-10 backdrop-blur",
        className
      )}
      {...props}
    />
  );
});

const TableBody = React.forwardRef(function TableBody(
  { className, ...props },
  ref
) {
  return (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
});

const TableFooter = React.forwardRef(function TableFooter(
  { className, ...props },
  ref
) {
  return (
    <tfoot
      ref={ref}
      className={cn("border-t border-dark-100 bg-dark-50/50 font-medium", className)}
      {...props}
    />
  );
});

const TableRow = React.forwardRef(function TableRow(
  { className, hoverable = true, ...props },
  ref
) {
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b border-dark-100 transition-colors",
        hoverable && "hover:bg-primary-50/30",
        className
      )}
      {...props}
    />
  );
});

const TableHead = React.forwardRef(function TableHead(
  { className, align = "left", ...props },
  ref
) {
  const alignClass = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  }[align];
  return (
    <th
      ref={ref}
      className={cn(
        "h-11 px-4 text-xs font-semibold uppercase tracking-wider text-dark-500 whitespace-nowrap",
        alignClass,
        className
      )}
      {...props}
    />
  );
});

const TableCell = React.forwardRef(function TableCell(
  { className, align = "left", ...props },
  ref
) {
  const alignClass = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  }[align];
  return (
    <td
      ref={ref}
      className={cn(
        "px-4 py-3 align-middle whitespace-nowrap text-dark-700",
        alignClass,
        className
      )}
      {...props}
    />
  );
});

const TableCaption = React.forwardRef(function TableCaption(
  { className, ...props },
  ref
) {
  return (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-dark-500", className)}
      {...props}
    />
  );
});

const EmptyRow = ({ colSpan, children, className }) => (
  <TableRow hoverable={false}>
    <TableCell colSpan={colSpan} className={cn("py-12", className)}>
      {children}
    </TableCell>
  </TableRow>
);

export {
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  EmptyRow,
};

export default Table;
