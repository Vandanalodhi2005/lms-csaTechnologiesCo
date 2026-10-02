"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/utils";
import { SORT_OPTIONS } from "@/constants/courses.js";

export default function CourseSort({ className }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get("sort") || SORT_OPTIONS[0].value;

  const onChange = (e) => {
    const next = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (next === SORT_OPTIONS[0].value) params.delete("sort");
    else params.set("sort", next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className={cn("flex items-center gap-2 shrink-0", className)}>
      <label
        htmlFor="course-sort"
        className="text-sm font-medium text-[#475569] whitespace-nowrap hidden sm:inline-flex items-center gap-1.5"
      >
        <ArrowUpDown className="h-4 w-4 text-[#94A3B8]" />
        Sort by
      </label>
      <div className="relative min-w-[180px] sm:min-w-[200px]">
        <select
          id="course-sort"
          value={value}
          onChange={onChange}
          className="h-11 w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white pl-4 pr-10 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
          aria-label="Sort courses"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
      </div>
    </div>
  );
}
