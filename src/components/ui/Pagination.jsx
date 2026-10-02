"use client";

import * as React from "react";
import { cn } from "@/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Button from "./Button.jsx";

function PaginationItem({ isActive, className, children, ...props }) {
  return (
    <button
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border text-sm font-medium transition-all",
        isActive
          ? "bg-primary-600 text-white border-primary-600 shadow-sm z-10"
          : "bg-white text-dark-700 border-dark-200 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50",
        "disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const getPageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const delta = 1;
  const range = [];
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }
  if (currentPage - delta > 2) pages.push("start-ellipsis");
  pages.push(...range);
  if (currentPage + delta < totalPages - 1) pages.push("end-ellipsis");
  return pages;
};

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  showInfo = true,
  infoText,
  className,
  totalItems,
  pageSize,
}) => {
  const goTo = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };
  const pages = getPageNumbers(currentPage, totalPages);
  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 w-full", className)}>
      {showInfo && totalItems && (
        <div className="text-sm text-dark-500 order-2 sm:order-1">
          {infoText || `Showing ${startItem}–${endItem} of ${totalItems} results`}
        </div>
      )}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center gap-1.5 order-1 sm:order-2"
        >
          {showFirstLast && (
            <PaginationItem onClick={() => goTo(1)} disabled={currentPage <= 1}>
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </PaginationItem>
          )}
          {showPrevNext && (
            <PaginationItem onClick={() => goTo(currentPage - 1)} disabled={currentPage <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </PaginationItem>
          )}
          <PaginationItem isActive={currentPage === 1} onClick={() => goTo(1)}>
            1
          </PaginationItem>
          {pages.map((page, idx) => {
            if (typeof page === "string") {
              return (
                <div key={`${page}-${idx}`} className="px-1">
                  <MoreHorizontal className="h-4 w-4 text-dark-400" />
                </div>
              );
            }
            return (
              <PaginationItem
                key={page}
                isActive={page === currentPage}
                onClick={() => goTo(page)}
              >
                {page}
              </PaginationItem>
            );
          })}
          {totalPages > 1 && (
            <PaginationItem
              isActive={currentPage === totalPages}
              onClick={() => goTo(totalPages)}
            >
              {totalPages}
            </PaginationItem>
          )}
          {showPrevNext && (
            <PaginationItem
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </PaginationItem>
          )}
          {showFirstLast && (
            <PaginationItem
              onClick={() => goTo(totalPages)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4 -mr-2" />
              <ChevronRight className="h-4 w-4" />
            </PaginationItem>
          )}
        </nav>
      )}
    </div>
  );
};

export default Pagination;
