"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Star, X } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox.jsx";
import Button from "@/components/ui/Button.jsx";
import { cn } from "@/utils";
import {
  CATEGORIES,
  COURSE_LEVELS_LIST,
  PRICE_OPTIONS,
  RATING_OPTIONS,
} from "@/constants/courses.js";

const SECTION = "mb-7 last:mb-0";
const SECTION_TITLE = "block text-sm font-semibold text-[#0F172A] mb-3 tracking-tight";

function useFilterState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categories = React.useMemo(
    () => (searchParams.get("category") || "").split(",").filter(Boolean),
    [searchParams]
  );
  const level = searchParams.get("level") || "";
  const price = searchParams.get("price") || "";
  const rating = searchParams.get("rating") || "";

  const toggleCategory = (cat) => {
    const next = categories.includes(cat)
      ? categories.filter((c) => c !== cat)
      : [...categories, cat];
    updateParams({ category: next.join(",") || undefined });
  };

  const setLevel = (v) => updateParams({ level: v || undefined });
  const setPrice = (v) => updateParams({ price: v || undefined });
  const setRating = (v) => updateParams({ rating: v || undefined });

  const updateParams = (patch) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === "") params.delete(k);
      else params.set(k, v);
    });
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const hasFilters =
    categories.length > 0 || !!level || !!price || !!rating;

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["category", "level", "price", "rating"].forEach((k) => params.delete(k));
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return {
    categories,
    level,
    price,
    rating,
    toggleCategory,
    setLevel,
    setPrice,
    setRating,
    hasFilters,
    clearAll,
    updateParams,
  };
}

function LevelRadio({ value, current, onChange, children }) {
  const id = React.useId();
  const checked = current === value;
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 cursor-pointer transition-all",
        checked
          ? "bg-[#EFF6FF] border-[#2563EB] text-[#0F172A] shadow-sm"
          : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
      )}
    >
      <input
        id={id}
        type="radio"
        className="sr-only peer"
        checked={checked}
        onChange={() => onChange(checked ? "" : value)}
      />
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          checked
            ? "border-[#2563EB]"
            : "border-[#CBD5E1]"
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-[#2563EB]" />}
      </span>
      <span className="text-sm font-medium">{children}</span>
    </label>
  );
}

export function CourseFilters({ className, mobile = false, onClose }) {
  const {
    categories,
    level,
    price,
    rating,
    toggleCategory,
    setLevel,
    setPrice,
    setRating,
    hasFilters,
    clearAll,
  } = useFilterState();

  return (
    <aside
      aria-label="Course filters"
      className={cn(
        "bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 w-full",
        !mobile && "sticky top-20",
        className
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold tracking-tight text-[#0F172A]">
          Filters
        </h2>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#2563EB] hover:bg-[#EFF6FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      <section className={SECTION}>
        <h3 className={SECTION_TITLE}>Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <Checkbox
              key={cat}
              label={cat}
              checked={categories.includes(cat)}
              onCheckedChange={() => toggleCategory(cat)}
              name="category"
              value={cat.toLowerCase()}
            />
          ))}
        </div>
      </section>

      <section className={SECTION}>
        <h3 className={SECTION_TITLE}>Level</h3>
        <div className="space-y-2">
          {COURSE_LEVELS_LIST.map((lv) => (
            <LevelRadio
              key={lv}
              value={lv.toLowerCase()}
              current={level}
              onChange={setLevel}
            >
              {lv}
            </LevelRadio>
          ))}
        </div>
      </section>

      <section className={SECTION}>
        <h3 className={SECTION_TITLE}>Price</h3>
        <div className="space-y-2">
          {PRICE_OPTIONS.map((opt) => (
            <LevelRadio
              key={opt}
              value={opt.toLowerCase()}
              current={price}
              onChange={setPrice}
            >
              {opt}
            </LevelRadio>
          ))}
        </div>
      </section>

      <section className={SECTION}>
        <h3 className={SECTION_TITLE}>Rating</h3>
        <div className="space-y-2">
          {RATING_OPTIONS.map((opt) => {
            const checked = rating === String(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  checked ? setRating("") : setRating(String(opt.value))
                }
                aria-pressed={checked}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB]",
                  checked
                    ? "bg-[#EFF6FF] border-[#2563EB] text-[#0F172A] shadow-sm"
                    : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  {Array.from({ length: Math.floor(opt.value) }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]"
                    />
                  ))}
                  <span className="ml-1">{opt.label}</span>
                </span>
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    checked ? "border-[#2563EB]" : "border-[#CBD5E1]"
                  )}
                >
                  {checked && (
                    <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {mobile && (
        <div className="pt-5 border-t border-[#E2E8F0] mt-6">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 rounded-xl"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 h-11 rounded-xl shadow-sm"
              onClick={onClose}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}

export default CourseFilters;
