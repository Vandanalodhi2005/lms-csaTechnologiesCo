import * as React from "react";
import { cn } from "@/utils";

export function CourseCardSkeleton({ className }) {
  return (
    <div
      className={cn(
        "group rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] shadow-sm flex flex-col animate-pulse",
        className
      )}
      aria-hidden="true"
    >
      <div className="relative block bg-[#F1F5F9] aspect-[16/10] overflow-hidden" />
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        <div className="h-3 w-24 rounded bg-[#E2E8F0]" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-[#E2E8F0]" />
          <div className="h-4 w-4/5 rounded bg-[#E2E8F0]" />
        </div>
        <div className="h-3 w-40 rounded bg-[#E2E8F0]" />
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-10 rounded bg-[#E2E8F0]" />
          <div className="h-3.5 w-14 rounded bg-[#E2E8F0]" />
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#E2E8F0]">
          <div className="h-5 w-16 rounded bg-[#E2E8F0]" />
          <div className="h-8 w-24 rounded-lg bg-[#E2E8F0]" />
        </div>
      </div>
    </div>
  );
}

export function CourseGridSkeleton({ count = 9, className }) {
  return (
    <div
      className={cn(
        "grid gap-5 sm:gap-6 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default CourseCardSkeleton;
