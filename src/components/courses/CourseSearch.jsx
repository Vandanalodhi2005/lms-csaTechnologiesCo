"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";
import Button from "@/components/ui/Button.jsx";

export default function CourseSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = React.useState(searchParams.get("search") || "");

  const createQuery = React.useCallback(
    (next) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      if (next) {
        params.set("search", next);
      } else {
        params.delete("search");
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const qs = createQuery(value.trim());
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const clear = () => {
    setValue("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="w-full">
      <label htmlFor="course-search" className="sr-only">
        Search courses
      </label>
      <div className="flex items-stretch gap-2 sm:gap-3 w-full">
        <div className="relative flex-1 min-w-0">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
          <input
            id="course-search"
            name="search"
            type="search"
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search courses by title, topic, or instructor..."
            className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white pl-11 pr-10 text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
          />
          {value && (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 px-5 sm:px-6 shrink-0 rounded-xl shadow-sm"
          leftIcon={<SearchIcon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />}
        >
          <span className="sm:inline hidden">Search</span>
        </Button>
      </div>
    </form>
  );
}
