"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal, X, RefreshCw } from "lucide-react";
import { cn } from "@/utils";
import Pagination from "@/components/ui/Pagination.jsx";
import Button from "@/components/ui/Button.jsx";
import { CATEGORIES, COURSE_LEVELS_LIST, PRICE_OPTIONS, RATING_OPTIONS } from "@/constants/courses.js";

function removeParam(router, pathname, searchParams, key) {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("page");
  params.delete(key);
  const qs = params.toString();
  router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
}

const humanLevel = (v) =>
  COURSE_LEVELS_LIST.find((x) => x.toLowerCase() === v) || v;
const humanPrice = (v) =>
  PRICE_OPTIONS.find((x) => x.toLowerCase() === v) || v;
const humanRating = (v) =>
  RATING_OPTIONS.find((x) => String(x.value) === String(v))?.label || `${v}+ Stars`;

export function ActiveFilterBadges({ className }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const cats = (searchParams.get("category") || "").split(",").filter(Boolean);
  const level = searchParams.get("level");
  const price = searchParams.get("price");
  const rating = searchParams.get("rating");

  const badges = [];
  cats.forEach((c) =>
    badges.push({
      key: `cat-${c}`,
      label: c,
      onRemove: () => {
        const next = cats.filter((x) => x !== c).join(",");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("page");
        if (next) params.set("category", next);
        else params.delete("category");
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      },
    })
  );
  if (level) {
    badges.push({
      key: "level",
      label: humanLevel(level),
      onRemove: () => removeParam(router, pathname, searchParams, "level"),
    });
  }
  if (price) {
    badges.push({
      key: "price",
      label: humanPrice(price),
      onRemove: () => removeParam(router, pathname, searchParams, "price"),
    });
  }
  if (rating) {
    badges.push({
      key: "rating",
      label: humanRating(rating),
      onRemove: () => removeParam(router, pathname, searchParams, "rating"),
    });
  }

  if (badges.length === 0) return null;

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["category", "level", "price", "rating"].forEach((k) => params.delete(k));
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        className
      )}
    >
      <span className="text-xs uppercase font-bold tracking-wider text-[#64748B]">
        Active
      </span>
      {badges.map((b) => (
        <span
          key={b.key}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 text-xs font-semibold text-[#1E40AF]"
        >
          {b.label}
          <button
            type="button"
            onClick={b.onRemove}
            aria-label={`Remove ${b.label} filter`}
            className="rounded-md p-0.5 hover:bg-[#BFDBFE] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#DC2626] transition-colors rounded-md px-2 py-1 hover:bg-[#FEF2F2] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Clear all
      </button>
    </div>
  );
}

function PaginationItem({ isActive, className, children, ...props }) {
  return (
    <button
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl border text-sm font-medium transition-all",
        isActive
          ? "bg-[#2563EB] text-white border-[#2563EB] shadow-sm z-10"
          : "bg-white text-[#475569] border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#EFF6FF]",
        "disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1",
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

export function CoursePagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goTo = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete("page");
    else params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: true });
  };

  const pages = getPageNumbers(currentPage, totalPages || 1);
  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-2">
      {totalItems ? (
        <div className="text-sm text-[#64748B] order-2 sm:order-1">
          Showing <span className="font-semibold text-[#0F172A]">{startItem}</span>
          {"–"}
          <span className="font-semibold text-[#0F172A]"> {endItem}</span> of{" "}
          <span className="font-semibold text-[#0F172A]">{totalItems}</span> courses
        </div>
      ) : (
        <div className="order-2 sm:order-1" />
      )}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center gap-1.5 order-1 sm:order-2"
        >
          <PaginationItem
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationItem>
          <PaginationItem isActive={currentPage === 1} onClick={() => goTo(1)}>
            1
          </PaginationItem>
          {pages.map((page, idx) => {
            if (typeof page === "string") {
              return (
                <div key={`${page}-${idx}`} className="px-1" aria-hidden="true">
                  <MoreHorizontal className="h-4 w-4 text-[#94A3B8]" />
                </div>
              );
            }
            return (
              <PaginationItem
                key={page}
                isActive={page === currentPage}
                onClick={() => goTo(page)}
                aria-label={`Page ${page}`}
              >
                {page}
              </PaginationItem>
            );
          })}
          {totalPages > 1 && (
            <PaginationItem
              isActive={currentPage === totalPages}
              onClick={() => goTo(totalPages)}
              aria-label={`Page ${totalPages}`}
            >
              {totalPages}
            </PaginationItem>
          )}
          <PaginationItem
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationItem>
        </nav>
      )}
    </div>
  );
}

export default CoursePagination;
