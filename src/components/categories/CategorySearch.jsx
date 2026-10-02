"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import Badge from "@/components/ui/Badge.jsx";
import CategoryGrid from "@/components/categories/CategoryGrid.jsx";
import { CATEGORY_STATS, popularCategorySlugs } from "@/constants/categories.js";

export default function CategorySearch({ categories = [] }) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) {
      return categories;
    }

    return categories.filter(({ name, description }) => {
      const searchableText = `${name || ""} ${description || ""}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [categories, normalizedQuery]);

  const popularCategories = categories.filter((category) =>
    popularCategorySlugs.includes(category.slug)
  );

  const hasResults = filteredCategories.length > 0;

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:p-10">
        <div className="mb-6 inline-flex items-center rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1D4ED8]">
          Learning paths
        </div>

        <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
          Explore Course Categories
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
          Explore courses across technology, business, design, marketing, data science and other
          in-demand skills.
        </p>

        <div className="mt-6 max-w-2xl">
          <form role="search" onSubmit={(event) => event.preventDefault()} className="w-full">
            <label htmlFor="category-search" className="mb-2 block text-sm font-medium text-slate-700">
              Search categories
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="category-search"
                name="categorySearch"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search categories..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] transition-all"
                aria-label="Search course categories"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {!hasResults ? (
        <EmptyState
          icon="search"
          title="No categories found"
          description="Try searching for another category."
          className="rounded-3xl border border-slate-200 bg-white"
          action={
            <Button type="button" variant="outline" onClick={() => setQuery("")} className="h-11 rounded-xl">
              Clear Search
            </Button>
          }
        />
      ) : (
        <>
          <section aria-labelledby="popular-categories-heading" className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 id="popular-categories-heading" className="text-2xl font-bold tracking-tight text-slate-900">
                Popular Categories
              </h2>
              <Badge variant="secondary">Featured</Badge>
            </div>
            <CategoryGrid categories={popularCategories} />
          </section>

          <section aria-labelledby="all-categories-heading" className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 id="all-categories-heading" className="text-2xl font-bold tracking-tight text-slate-900">
                All Categories
              </h2>
              <span className="text-sm text-slate-500">{filteredCategories.length} results</span>
            </div>
            <CategoryGrid categories={filteredCategories} />
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Category statistics</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Learning at a glance</h2>
              </div>
              <Badge variant="outline">Mock product data</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {CATEGORY_STATS.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                  <div className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] bg-[#0F2F5F] px-6 py-8 text-white shadow-sm md:px-8 md:py-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                  Start learning
                </div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Ready to Start Learning?
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">
                  Choose a category and start building skills that matter for your career.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/courses">
                  <Button type="button" className="h-11 rounded-xl bg-white text-[#0F2F5F] hover:bg-slate-100">
                    Browse All Courses
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
