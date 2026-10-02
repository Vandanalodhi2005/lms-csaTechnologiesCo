"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Inbox, AlertTriangle } from "lucide-react";
import CourseSearch from "@/components/courses/CourseSearch.jsx";
import CourseFilters from "@/components/courses/CourseFilters.jsx";
import MobileCourseFilters from "@/components/courses/MobileCourseFilters.jsx";
import CourseSort from "@/components/courses/CourseSort.jsx";
import CourseGrid from "@/components/courses/CourseGrid.jsx";
import CoursePagination, { ActiveFilterBadges } from "@/components/courses/CoursePagination.jsx";
import { CourseGridSkeleton } from "@/components/courses/CourseCardSkeleton.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import Alert from "@/components/ui/Alert.jsx";
import Button from "@/components/ui/Button.jsx";
import COURSES from "@/constants/courses.js";

const PAGE_SIZE = 9;

function applyFilters(courses, { search, category, level, price, rating, sort }) {
  let result = [...courses];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter((c) => {
      return (
        c.title.toLowerCase().includes(q) ||
        (c.category || "").toLowerCase().includes(q) ||
        (c.instructor || "").toLowerCase().includes(q) ||
        (c.shortDescription || "").toLowerCase().includes(q)
      );
    });
  }

  if (category && category.length) {
    const set = new Set(category.split(",").filter(Boolean));
    result = result.filter((c) => set.has(c.category));
  }

  if (level) {
    result = result.filter((c) => (c.level || "").toLowerCase() === level.toLowerCase());
  }

  if (price) {
    if (price === "free") result = result.filter((c) => !!c.isFree || c.effectivePrice === 0 || c.price === 0);
    else if (price === "paid") result = result.filter((c) => !(c.isFree) && c.effectivePrice > 0 && c.price > 0);
  }

  if (rating) {
    const min = Number(rating);
    if (!Number.isNaN(min)) {
      result = result.filter((c) => (c.rating || 0) >= min);
    }
  }

  switch (sort) {
    case "newest":
      result.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      break;
    case "rating":
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0));
      break;
    case "price_low":
      result.sort((a, b) => (a.effectivePrice ?? a.price) - (b.effectivePrice ?? b.price));
      break;
    case "price_high":
      result.sort((a, b) => (b.effectivePrice ?? b.price) - (a.effectivePrice ?? a.price));
      break;
    case "popular":
    default:
      result.sort((a, b) => (b.popularity || b.enrollmentCount || 0) - (a.popularity || a.enrollmentCount || 0));
  }

  return result;
}

function CourseListingInner() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const level = searchParams.get("level") || "";
  const price = searchParams.get("price") || "";
  const rating = searchParams.get("rating") || "";
  const sort = searchParams.get("sort") || "popular";
  const pageRaw = Number(searchParams.get("page") || "1");
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setError(null);
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(t);
  }, [search, category, level, price, rating, sort, page]);

  const all = React.useMemo(
    () => applyFilters(COURSES, { search, category, level, price, rating, sort }),
    [search, category, level, price, rating, sort]
  );

  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = loading
    ? []
    : all.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-6 md:space-y-8 w-full">
      <section aria-labelledby="courses-heading" className="space-y-5">
        <div className="space-y-2">
          <h1
            id="courses-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight"
          >
            Browse Our Courses
          </h1>
          <p className="text-[#64748B] text-sm md:text-base max-w-3xl leading-relaxed">
            Discover expert-led courses designed to help you learn new skills, build
            confidence, and grow your career.
          </p>
        </div>

        <div className="w-full">
          <CourseSearch />
        </div>
      </section>

      <ActiveFilterBadges />

      <section className="grid lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-5 lg:gap-8 items-start">
        <div className="hidden lg:block w-full">
          <CourseFilters />
        </div>

        <div className="w-full space-y-5 md:space-y-6 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="sm:hidden">
                <MobileCourseFilters />
              </div>
              <div className="flex-1 sm:flex-none min-w-0">
                <CourseSort />
              </div>
            </div>
            <div className="text-sm text-[#64748B] sm:text-right">
              Showing{" "}
              <span className="font-semibold text-[#0F172A] tabular-nums">
                {loading ? "…" : all.length}
              </span>{" "}
              {all.length === 1 ? "course" : "courses"}
            </div>
          </div>

          {error && (
            <Alert
              variant="danger"
              title="Unable to Load Courses"
              description={
                typeof error === "string" && error.length < 200
                  ? error
                  : "Something went wrong while loading courses. Please try again."
              }
              className="rounded-2xl"
            />
          )}

          {loading ? (
            <CourseGridSkeleton count={9} />
          ) : all.length === 0 ? (
            <EmptyState
              icon="search"
              title="No Courses Found"
              description="We couldn't find courses matching your current filters. Try adjusting your search or clearing filters."
              compact={false}
              action={
                <Link href="/courses">
                  <Button
                    size="lg"
                    className="h-11 rounded-xl shadow-sm"
                    leftIcon={<Inbox className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />}
                  >
                    Clear Filters
                  </Button>
                </Link>
              }
            />
          ) : (
            <>
              <CourseGrid
                courses={slice}
                variant="home"
                columns={3}
                showWishlist={false}
              />
              <CoursePagination
                currentPage={safePage}
                totalPages={totalPages}
                totalItems={all.length}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function CourseListing() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 md:space-y-8 w-full">
          <div className="space-y-4">
            <div className="h-10 w-64 bg-[#E2E8F0] rounded-lg animate-pulse" />
            <div className="h-5 w-full max-w-2xl bg-[#E2E8F0] rounded animate-pulse" />
            <div className="h-12 w-full bg-[#E2E8F0] rounded-xl animate-pulse" />
          </div>
          <CourseGridSkeleton count={9} />
        </div>
      }
    >
      <CourseListingInner />
    </Suspense>
  );
}
