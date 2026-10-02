"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Button from "@/components/ui/Button.jsx";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const q = (query || "").trim();
    if (q) {
      router.push(`/courses?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/courses");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-xl rounded-2xl border border-white/15 bg-white/95 backdrop-blur shadow-2xl p-2 sm:p-2.5 flex items-center gap-2"
      role="search"
    >
      <label htmlFor="hero-search" className="sr-only">
        Search for courses
      </label>
      <div className="flex items-center flex-1 gap-2 pl-3">
        <Search className="h-5 w-5 text-[#64748B] shrink-0" aria-hidden="true" />
        <input
          id="hero-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for courses..."
          className="w-full h-11 sm:h-12 rounded-lg bg-transparent text-sm sm:text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="h-11 sm:h-12 px-5 sm:px-7 rounded-xl text-sm sm:text-base"
      >
        Search
      </Button>
    </form>
  );
}
