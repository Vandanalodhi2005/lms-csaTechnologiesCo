"use client";

import * as React from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/utils";
import { createPortal } from "react-dom";
import CourseFilters from "./CourseFilters.jsx";

export default function MobileCourseFilters() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted) return null;

  const close = () => setOpen(false);

  const node = (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open filters"
        className="flex items-center gap-2 h-11 px-4 rounded-xl border border-[#E2E8F0] bg-white text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1"
      >
        <SlidersHorizontal className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
        Filters
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Course filters"
            className="fixed inset-0 z-50 flex items-end sm:items-end justify-center"
          >
            <div
              className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={close}
              aria-hidden="true"
            />
            <div
              className={cn(
                "relative z-10 w-full sm:max-w-md mx-0 sm:mx-auto sm:mb-6 rounded-t-3xl sm:rounded-3xl border-t sm:border border-[#E2E8F0] bg-white shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 ease-out"
              )}
            >
              <div className="sticky top-0 z-10 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-[#2563EB]" />
                  <h2 className="text-base font-bold tracking-tight text-[#0F172A]">
                    Filters
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close filters"
                  className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-0 pt-0 pb-0">
                <CourseFilters mobile onClose={close} className="border-0 rounded-none shadow-none p-5 sm:p-6" />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );

  return node;
}
