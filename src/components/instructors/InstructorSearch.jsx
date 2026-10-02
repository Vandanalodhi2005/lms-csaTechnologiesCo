"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Badge from "@/components/ui/Badge.jsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog.jsx";
import InstructorCard from "@/components/instructors/InstructorCard.jsx";
import InstructorStats from "@/components/instructors/InstructorStats.jsx";
import InstructorCTA from "@/components/instructors/InstructorCTA.jsx";
import {
  instructorCategories,
  instructorExpertiseOptions,
} from "@/constants/instructors.js";
import { cn } from "@/utils";

const PAGE_SIZE = 6;

const ratingOptions = [
  { value: "4", label: "4+ Rating" },
  { value: "3", label: "3+ Rating" },
];

const sortOptions = [
  { value: "students", label: "Most Students" },
  { value: "rating", label: "Highest Rated" },
  { value: "courses", label: "Most Courses" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

export default function InstructorSearch({ instructors = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const search = searchParams.get("search")?.trim() ?? "";
  const category = searchParams.get("category") ?? "";
  const rating = Number(searchParams.get("rating") || 0) || 0;
  const expertise = searchParams.get("expertise") ?? "";
  const sort = searchParams.get("sort") ?? "students";
  const page = Math.max(1, Number(searchParams.get("page") || 1));

  const updateParams = (changes = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(changes).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
        return;
      }
      params.set(key, String(value));
    });

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const activeFilters = useMemo(() => {
    const items = [];

    if (category) {
      items.push({ key: "category", label: category, value: category });
    }
    if (rating) {
      items.push({ key: "rating", label: `${rating}+ Rating`, value: rating });
    }
    if (expertise) {
      items.push({ key: "expertise", label: expertise, value: expertise });
    }
    if (search) {
      items.push({ key: "search", label: `Search: ${search}`, value: search });
    }

    return items;
  }, [category, expertise, rating, search]);

  const filteredInstructors = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    const results = instructors.filter((instructor) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          instructor.name,
          instructor.role,
          instructor.bio,
          instructor.category,
          ...(instructor.expertise || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory = !category || instructor.category === category;
      const matchesRating = !rating || instructor.rating >= rating;
      const matchesExpertise =
        !expertise ||
        (instructor.expertise || []).some(
          (skill) => skill.toLowerCase() === expertise.toLowerCase()
        );

      return matchesSearch && matchesCategory && matchesRating && matchesExpertise;
    });

    const sorted = [...results].sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.rating - a.rating || b.reviewCount - a.reviewCount;
        case "courses":
          return b.courseCount - a.courseCount || b.studentCount - a.studentCount;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "students":
        default:
          return b.studentCount - a.studentCount || b.rating - a.rating;
      }
    });

    return sorted;
  }, [category, expertise, instructors, rating, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredInstructors.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedInstructors = filteredInstructors.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["search", "category", "rating", "expertise", "sort", "page"].forEach((key) => params.delete(key));
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const removeFilter = (key) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    if (key !== "page") params.set("page", "1");
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const renderFilterPanel = (mobile = false) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#0F172A]">
          <Filter className="h-4 w-4 text-[#2563EB]" />
          <h3 className="text-base font-semibold">Filters</h3>
        </div>
        {(category || rating || expertise || search) && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm font-medium text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-semibold text-[#0F172A]">Category</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateParams({ category: undefined, page: 1 })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                !category
                  ? "border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]"
                  : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1]"
              )}
            >
              All
            </button>
            {instructorCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => updateParams({ category: item, page: 1 })}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  category === item
                    ? "border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]"
                    : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1]"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-[#0F172A]">Rating</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => updateParams({ rating: undefined, page: 1 })}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                !rating
                  ? "border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]"
                  : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1]"
              )}
            >
              <span>Any rating</span>
            </button>
            {ratingOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateParams({ rating: option.value, page: 1 })}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                  rating === Number(option.value)
                    ? "border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]"
                    : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1]"
                )}
              >
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-[#0F172A]">Expertise</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateParams({ expertise: undefined, page: 1 })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                !expertise
                  ? "border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]"
                  : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1]"
              )}
            >
              All
            </button>
            {instructorExpertiseOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => updateParams({ expertise: item, page: 1 })}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  expertise === item
                    ? "border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]"
                    : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1]"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mobile && (
        <div className="mt-6 flex flex-col gap-3 border-t border-[#E2E8F0] pt-4">
          <Button type="button" onClick={() => setMobileFiltersOpen(false)} className="w-full">
            Apply Filters
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={clearAllFilters}
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <li>
            <Link href="/" className="transition-colors hover:text-[#2563EB]">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-slate-700">
            Instructors
          </li>
        </ol>
      </nav>

      <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8 lg:p-10">
        <div className="mb-4 inline-flex rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1D4ED8]">
          Expert educators
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] md:text-4xl">
              Learn From Industry Experts
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#475569] md:text-base">
              Learn from experienced instructors who bring real-world knowledge, practical skills, and industry experience to every course.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">
              Meet Our Instructors
            </p>
            <p className="text-sm text-[#475569]">
              Learn from experienced professionals and experts across technology, business, design and more.
            </p>
          </div>
        </div>

        <div className="mt-8 max-w-2xl">
          <form role="search" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="instructor-search" className="mb-2 block text-sm font-medium text-[#0F172A]">
              Search instructors
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" aria-hidden="true" />
              <input
                id="instructor-search"
                name="search"
                type="search"
                value={search}
                onChange={(event) => updateParams({ search: event.target.value.trimStart(), page: 1 })}
                placeholder="Search instructors..."
                className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-12 pr-12 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
                aria-label="Search instructors"
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => updateParams({ search: undefined, page: 1 })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#64748B] transition-colors hover:bg-[#E2E8F0] hover:text-[#0F172A]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <div className="mb-6">
        <InstructorStats instructors={instructors} />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">Browse experts</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">Our Instructors</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm text-[#475569]">Showing</span>
              <span className="text-sm font-semibold text-[#0F172A]">{filteredInstructors.length} instructors</span>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMobileFiltersOpen(true)}
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
                className="h-10 rounded-lg"
              >
                Filters
              </Button>
              <select
                aria-label="Sort instructors"
                value={sort}
                onChange={(event) => updateParams({ sort: event.target.value, page: 1 })}
                className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="border-[#E2E8F0] bg-white px-2.5 py-1 text-sm text-[#0F172A]"
              >
                {filter.label}
                <button
                  type="button"
                  onClick={() => removeFilter(filter.key)}
                  aria-label={`Remove ${filter.label}`}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-sm font-medium text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              {renderFilterPanel(false)}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="hidden items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white p-3 shadow-sm md:flex lg:hidden">
              <div className="flex items-center gap-2 text-[#0F172A]">
                <SlidersHorizontal className="h-4 w-4 text-[#2563EB]" />
                <span className="text-sm font-medium">Filter and sort</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="h-9 rounded-lg"
                >
                  Filters
                </Button>
                <select
                  aria-label="Sort instructors"
                  value={sort}
                  onChange={(event) => updateParams({ sort: event.target.value, page: 1 })}
                  className="h-9 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:justify-between md:rounded-2xl md:border md:border-[#E2E8F0] md:bg-white md:p-3 md:shadow-sm lg:hidden">
              <div className="text-sm font-medium text-[#0F172A]">
                Sorted by {sortOptions.find((option) => option.value === sort)?.label || "Most Students"}
              </div>
            </div>

            <div className="mb-2 flex items-center justify-between gap-3 text-sm text-[#475569]">
              <span>Showing {filteredInstructors.length} instructors</span>
              <select
                aria-label="Sort instructors"
                value={sort}
                onChange={(event) => updateParams({ sort: event.target.value, page: 1 })}
                className="hidden h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] lg:block"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {paginatedInstructors.length === 0 ? (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center shadow-sm">
                <h3 className="text-2xl font-bold text-[#0F172A]">No instructors found</h3>
                <p className="mt-3 text-sm text-[#64748B]">
                  Try adjusting your search or filters.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button type="button" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                  <Link href="/courses">
                    <Button type="button" variant="outline">
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {paginatedInstructors.map((instructor) => (
                  <InstructorCard key={instructor.id} instructor={instructor} />
                ))}
              </div>
            )}

            {filteredInstructors.length > 0 && totalPages > 1 && (
              <nav aria-label="Instructor pagination" className="flex items-center justify-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateParams({ page: Math.max(safePage - 1, 1) })}
                  disabled={safePage === 1}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => updateParams({ page: pageNumber })}
                    className={cn(
                      "h-9 min-w-9 rounded-lg border px-3 text-sm font-medium transition-colors",
                      safePage === pageNumber
                        ? "border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]"
                        : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1]"
                    )}
                    aria-current={safePage === pageNumber ? "page" : undefined}
                  >
                    {pageNumber}
                  </button>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateParams({ page: Math.min(safePage + 1, totalPages) })}
                  disabled={safePage === totalPages}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  Next
                </Button>
              </nav>
            )}
          </div>
        </div>
      </div>

      <InstructorCTA />

      <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DialogContent onClose={() => setMobileFiltersOpen(false)} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>Refine instructors by category, rating, and expertise.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto py-2">{renderFilterPanel(true)}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
