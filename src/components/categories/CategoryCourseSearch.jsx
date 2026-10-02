"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import CourseCard from "@/components/courses/CourseCard.jsx";
import CategoryCard from "@/components/categories/CategoryCard.jsx";
import { categories as allCategories } from "@/constants/categories.js";

const PAGE_SIZE = 6;

function parseDurationMinutes(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.includes(":")) {
    const [hours, minutes] = value.split(":").map(Number);
    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      return hours * 60 + minutes;
    }
  }
  return Number(value) || 0;
}

export default function CategoryCourseSearch({ category, courses = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const search = params.get("search") || "";
  const level = params.get("level") || "";
  const price = params.get("price") || "";
  const rating = params.get("rating") || "";
  const duration = params.get("duration") || "";
  const sort = params.get("sort") || "popular";
  const page = Number(params.get("page") || "1");

  const activeFilters = [
    level ? { key: "level", value: level, label: level } : null,
    price ? { key: "price", value: price, label: price === "free" ? "Free" : "Paid" } : null,
    rating ? { key: "rating", value: rating, label: `${rating}+ Rating` } : null,
    duration ? { key: "duration", value: duration, label: duration === "under-5" ? "Under 5 hours" : duration === "5-10" ? "5–10 hours" : "10+ hours" } : null,
  ].filter(Boolean);

  const filteredCourses = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    let result = [...courses];

    if (normalizedQuery) {
      result = result.filter((course) => {
        const searchable = [
          course.title,
          course.instructor,
          course.shortDescription,
          course.description?.join(" "),
          course.category,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      });
    }

    if (level) {
      result = result.filter((course) => course.level === level);
    }

    if (price) {
      if (price === "free") {
        result = result.filter((course) => Number(course.effectivePrice ?? course.price ?? 0) === 0);
      } else {
        result = result.filter((course) => Number(course.effectivePrice ?? course.price ?? 0) > 0);
      }
    }

    if (rating) {
      result = result.filter((course) => Number(course.rating || 0) >= Number(rating));
    }

    if (duration) {
      result = result.filter((course) => {
        const minutes = parseDurationMinutes(course.duration);

        if (duration === "under-5") return minutes <= 300;
        if (duration === "5-10") return minutes > 300 && minutes <= 600;
        return minutes > 600;
      });
    }

    switch (sort) {
      case "newest":
        result.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        break;
      case "rating":
        result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      case "price_low":
        result.sort((a, b) => Number(a.effectivePrice ?? a.price ?? 0) - Number(b.effectivePrice ?? b.price ?? 0));
        break;
      case "price_high":
        result.sort((a, b) => Number(b.effectivePrice ?? b.price ?? 0) - Number(a.effectivePrice ?? a.price ?? 0));
        break;
      case "popular":
      default:
        result.sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0));
        break;
    }

    return result;
  }, [courses, duration, level, price, rating, search, sort]);

  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedCourses = filteredCourses.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const updateQuery = (updates) => {
    const query = new URLSearchParams(params.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        query.delete(key);
        return;
      }

      query.set(key, String(value));
    });

    query.delete("page");

    const nextUrl = query.toString() ? `${pathname}?${query.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const clearAllFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  const removeFilter = (key) => {
    const query = new URLSearchParams(params.toString());
    query.delete(key);
    query.delete("page");
    const nextUrl = query.toString() ? `${pathname}?${query.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const renderFilterSidebar = () => (
    <aside className="w-full lg:w-72 lg:flex-shrink-0">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 text-slate-900">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span className="font-semibold">Filters</span>
          </div>
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm font-medium text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
          >
            Clear all
          </button>
        </div>

        <div className="space-y-5 pt-4">
          <div>
            <label htmlFor="category-level" className="mb-2 block text-sm font-medium text-slate-700">Level</label>
            <select
              id="category-level"
              value={level}
              onChange={(event) => updateQuery({ level: event.target.value })}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
            >
              <option value="">All levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label htmlFor="category-price" className="mb-2 block text-sm font-medium text-slate-700">Price</label>
            <select
              id="category-price"
              value={price}
              onChange={(event) => updateQuery({ price: event.target.value })}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
            >
              <option value="">Any price</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label htmlFor="category-rating" className="mb-2 block text-sm font-medium text-slate-700">Rating</label>
            <select
              id="category-rating"
              value={rating}
              onChange={(event) => updateQuery({ rating: event.target.value })}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
            >
              <option value="">Any rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>

          <div>
            <label htmlFor="category-duration" className="mb-2 block text-sm font-medium text-slate-700">Duration</label>
            <select
              id="category-duration"
              value={duration}
              onChange={(event) => updateQuery({ duration: event.target.value })}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
            >
              <option value="">Any duration</option>
              <option value="under-5">Under 5 hours</option>
              <option value="5-10">5–10 hours</option>
              <option value="10-plus">10+ hours</option>
            </select>
          </div>

          <div>
            <label htmlFor="category-sort" className="mb-2 block text-sm font-medium text-slate-700">Sort by</label>
            <select
              id="category-sort"
              value={sort}
              onChange={(event) => updateQuery({ sort: event.target.value })}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );

  const renderMobileDrawer = () => (
    <div className="lg:hidden">
      <div className="mb-4 flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setMobileFiltersOpen(true)}
          className="h-11 flex-1 rounded-xl border-slate-200 bg-white text-slate-800"
          leftIcon={<Filter className="h-4 w-4" aria-hidden="true" />}
        >
          Filters
        </Button>

        <select
          value={sort}
          onChange={(event) => updateQuery({ sort: event.target.value })}
          className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
          aria-label="Sort courses"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40" aria-hidden="true">
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-5 pt-4">
              <div>
                <label htmlFor="mobile-level" className="mb-2 block text-sm font-medium text-slate-700">Level</label>
                <select
                  id="mobile-level"
                  value={level}
                  onChange={(event) => updateQuery({ level: event.target.value })}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900"
                >
                  <option value="">All levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label htmlFor="mobile-price" className="mb-2 block text-sm font-medium text-slate-700">Price</label>
                <select
                  id="mobile-price"
                  value={price}
                  onChange={(event) => updateQuery({ price: event.target.value })}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900"
                >
                  <option value="">Any price</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div>
                <label htmlFor="mobile-rating" className="mb-2 block text-sm font-medium text-slate-700">Rating</label>
                <select
                  id="mobile-rating"
                  value={rating}
                  onChange={(event) => updateQuery({ rating: event.target.value })}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900"
                >
                  <option value="">Any rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>

              <div>
                <label htmlFor="mobile-duration" className="mb-2 block text-sm font-medium text-slate-700">Duration</label>
                <select
                  id="mobile-duration"
                  value={duration}
                  onChange={(event) => updateQuery({ duration: event.target.value })}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900"
                >
                  <option value="">Any duration</option>
                  <option value="under-5">Under 5 hours</option>
                  <option value="5-10">5–10 hours</option>
                  <option value="10-plus">10+ hours</option>
                </select>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={clearAllFilters}
                className="h-11 rounded-xl border-slate-200 bg-white"
              >
                Clear filters
              </Button>
              <Button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]"
              >
                Apply filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="mt-10 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-6 lg:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Browse courses</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{category.name} Courses</h2>
        </div>
        <div className="text-sm text-slate-500">Showing {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"}</div>
      </div>

      <div className="mt-6">
        <label htmlFor="course-search" className="mb-2 block text-sm font-medium text-slate-700">Search courses</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="course-search"
            type="search"
            value={search}
            onChange={(event) => updateQuery({ search: event.target.value })}
            placeholder={`Search courses in ${category.name}...`}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
            aria-label={`Search ${category.name} courses`}
          />
        </div>
      </div>

      {renderMobileDrawer()}

      {activeFilters.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Active filters:</span>
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => removeFilter(filter.key)}
              className="inline-flex items-center gap-1 rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-2.5 py-1.5 text-xs font-medium text-[#1D4ED8] transition-colors hover:bg-[#DBEAFE]"
              aria-label={`Remove ${filter.label} filter`}
            >
              {filter.label}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
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

      <div className="mt-6 hidden lg:block">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-sm font-medium text-slate-700">Filter and sort</div>
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm font-medium text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
          >
            Reset all
          </button>
        </div>
        <div className="flex gap-6">
          {renderFilterSidebar()}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-sm text-slate-500">Sorted by {sort === "popular" ? "Most Popular" : sort === "newest" ? "Newest" : sort === "rating" ? "Highest Rated" : sort === "price_low" ? "Price: Low to High" : "Price: High to Low"}</div>
              <select
                value={sort}
                onChange={(event) => updateQuery({ sort: event.target.value })}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
                aria-label="Sort courses"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <h3 className="text-xl font-semibold text-slate-900">No courses found</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">We couldn&apos;t find courses matching your current filters.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Button type="button" onClick={clearAllFilters} className="h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]">
                    Clear Filters
                  </Button>
                  <Button asChild variant="outline" className="h-11 rounded-xl border-slate-200 bg-white text-slate-900">
                    <Link href="/courses">Browse All Courses</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedCourses.map((course) => (
                    <CourseCard key={course._id || course.slug} course={course} variant="home" showWishlist={false} showInstructor />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav aria-label="Course pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="h-10 rounded-lg border-slate-200 bg-white"
                      disabled={safePage === 1}
                    >
                      <Link
                        href={{
                          pathname,
                          query: { ...Object.fromEntries(params.entries()), page: String(Math.max(1, safePage - 1)) },
                        }}
                        className={safePage === 1 ? "pointer-events-none opacity-50" : ""}
                      >
                        <span className="inline-flex items-center gap-1"><ChevronLeft className="h-4 w-4" aria-hidden="true" />Previous</span>
                      </Link>
                    </Button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => {
                      const isCurrent = pageNumber === safePage;
                      const buttonQuery = { ...Object.fromEntries(params.entries()), page: String(pageNumber) };

                      return (
                        <Button
                          key={pageNumber}
                          asChild
                          variant={isCurrent ? "default" : "outline"}
                          className={isCurrent ? "h-10 w-10 rounded-lg p-0" : "h-10 w-10 rounded-lg border-slate-200 bg-white p-0"}
                        >
                          <Link href={{ pathname, query: buttonQuery }}>{pageNumber}</Link>
                        </Button>
                      );
                    })}

                    <Button
                      asChild
                      variant="outline"
                      className="h-10 rounded-lg border-slate-200 bg-white"
                      disabled={safePage === totalPages}
                    >
                      <Link
                        href={{
                          pathname,
                          query: { ...Object.fromEntries(params.entries()), page: String(Math.min(totalPages, safePage + 1)) },
                        }}
                        className={safePage === totalPages ? "pointer-events-none opacity-50" : ""}
                      >
                        <span className="inline-flex items-center gap-1">Next<ChevronRight className="h-4 w-4" aria-hidden="true" /></span>
                      </Link>
                    </Button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {!filteredCourses.length && (
        <div className="mt-6 lg:hidden rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <h3 className="text-xl font-semibold text-slate-900">No courses found</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">We couldn&apos;t find courses matching your current filters.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={clearAllFilters} className="h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]">Clear Filters</Button>
            <Button asChild variant="outline" className="h-11 rounded-xl border-slate-200 bg-white text-slate-900">
              <Link href="/courses">Browse All Courses</Link>
            </Button>
          </div>
        </div>
      )}

      {filteredCourses.length > 0 && (
        <div className="mt-8 lg:hidden">
          <div className="grid gap-5 md:grid-cols-2">
            {paginatedCourses.map((course) => (
              <CourseCard key={course._id || course.slug} course={course} variant="home" showWishlist={false} showInstructor />
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Course pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <Button asChild variant="outline" className="h-10 rounded-lg border-slate-200 bg-white" disabled={safePage === 1}>
                <Link href={{ pathname, query: { ...Object.fromEntries(params.entries()), page: String(Math.max(1, safePage - 1)) } }} className={safePage === 1 ? "pointer-events-none opacity-50" : ""}>
                  <span className="inline-flex items-center gap-1"><ChevronLeft className="h-4 w-4" aria-hidden="true" />Previous</span>
                </Link>
              </Button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => {
                const isCurrent = pageNumber === safePage;
                const linkQuery = { ...Object.fromEntries(params.entries()), page: String(pageNumber) };

                return (
                  <Button
                    key={pageNumber}
                    asChild
                    variant={isCurrent ? "default" : "outline"}
                    className={isCurrent ? "h-10 w-10 rounded-lg p-0" : "h-10 w-10 rounded-lg border-slate-200 bg-white p-0"}
                  >
                    <Link href={{ pathname, query: linkQuery }}>{pageNumber}</Link>
                  </Button>
                );
              })}

              <Button asChild variant="outline" className="h-10 rounded-lg border-slate-200 bg-white" disabled={safePage === totalPages}>
                <Link href={{ pathname, query: { ...Object.fromEntries(params.entries()), page: String(Math.min(totalPages, safePage + 1)) } }} className={safePage === totalPages ? "pointer-events-none opacity-50" : ""}>
                  <span className="inline-flex items-center gap-1">Next<ChevronRight className="h-4 w-4" aria-hidden="true" /></span>
                </Link>
              </Button>
            </nav>
          )}
        </div>
      )}

      <div className="mt-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">Explore Other Categories</h3>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {allCategories
            .filter((item) => item.slug !== category.slug)
            .slice(0, 4)
            .map((relatedCategory) => (
              <CategoryCard key={relatedCategory.slug} category={relatedCategory} />
            ))}
        </div>
      </div>
    </section>
  );
}
