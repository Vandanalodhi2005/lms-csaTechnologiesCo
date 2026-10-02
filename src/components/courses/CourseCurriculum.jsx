"use client";

import * as React from "react";
import {
  ChevronDown,
  Play,
  Lock,
  Clock,
  FileText,
} from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card.jsx";
import { cn } from "@/utils";

function parseLessonDuration(total) {
  const lessons = total || [];
  let minutes = 0;
  lessons.forEach((l) => {
    if (!l?.duration) return;
    const parts = String(l.duration).split(":");
    if (parts.length === 2) {
      minutes += (parseInt(parts[0], 10) || 0) * 1;
      minutes += (parseInt(parts[1], 10) || 0) / 60;
    } else if (parts.length === 3) {
      minutes += (parseInt(parts[0], 10) || 0) * 60;
      minutes += (parseInt(parts[1], 10) || 0) * 1;
      minutes += (parseInt(parts[2], 10) || 0) / 60;
    }
  });
  const rounded = Math.round(minutes);
  const hr = Math.floor(rounded / 60);
  const mn = rounded % 60;
  if (hr > 0) return `${hr}hr ${mn}min`;
  return `${mn}min`;
}

export default function CourseCurriculum({ curriculum = [] }) {
  const sections = Array.isArray(curriculum) ? curriculum : [];
  const [expanded, setExpanded] = React.useState(() => {
    const s = {};
    if (sections[0]?.id) s[sections[0].id] = true;
    return s;
  });

  const toggle = React.useCallback((id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const totalLessons = sections.reduce(
    (sum, s) => sum + (Array.isArray(s.lessons) ? s.lessons.length : 0),
    0
  );
  const totalDurationLessons = sections.flatMap((s) => s.lessons || []);

  if (sections.length === 0) {
    return (
      <section aria-labelledby="curriculum-heading" id="curriculum" className="space-y-4">
        <h2
          id="curriculum-heading"
          className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F2F5F]"
        >
          Course Curriculum
        </h2>
        <Card className="border-[#E2E8F0]">
          <CardContent className="p-8 text-center space-y-2">
            <div className="text-base font-semibold text-[#0F2F5F]">
              Curriculum coming soon
            </div>
            <p className="text-sm text-[#64748B]">
              Detailed lessons and sections are being prepared for this course.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section aria-labelledby="curriculum-heading" id="curriculum" className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="curriculum-heading"
          className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F2F5F]"
        >
          Course Curriculum
        </h2>
        <div className="text-xs sm:text-sm text-[#64748B] flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            {sections.length} section{sections.length === 1 ? "" : "s"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {totalLessons} lesson{totalLessons === 1 ? "" : "s"}
          </span>
          <span aria-hidden>•</span>
          <span>{parseLessonDuration(totalDurationLessons)} total</span>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section, sIdx) => {
          const lessons = Array.isArray(section.lessons) ? section.lessons : [];
          const isOpen = !!expanded[section.id];
          const sectionDuration = parseLessonDuration(lessons);
          const headerId = `curriculum-header-${section.id}`;
          const panelId = `curriculum-panel-${section.id}`;

          return (
            <Card
              key={section.id}
              className={cn(
                "border-[#E2E8F0] overflow-hidden transition-all",
                isOpen && "border-[#2563EB]/40"
              )}
            >
              <div>
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(section.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 text-left hover:bg-[#F8FAFC] transition-colors focus:outline-none focus:bg-[#EFF6FF] focus:ring-1 focus:ring-inset focus:ring-[#2563EB]"
                >
                  <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="inline-flex items-center justify-center h-7 w-7 shrink-0 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold tabular-nums">
                      {sIdx + 1}
                    </span>
                    <span className="font-semibold text-[#0F172A] text-sm sm:text-base truncate">
                      {section.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="hidden sm:inline-flex items-center gap-3 text-xs text-[#64748B]">
                      <span className="tabular-nums">
                        {lessons.length} lesson{lessons.length === 1 ? "" : "s"}
                      </span>
                      <span aria-hidden>•</span>
                      <span>{sectionDuration}</span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[#64748B] shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                      aria-hidden
                    />
                  </div>
                </button>
              </div>

              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className={cn(
                  "overflow-hidden transition-[max-height,opacity] duration-300",
                  isOpen
                    ? "max-h-[4000px] opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                <ul
                  role="list"
                  className="border-t border-[#E2E8F0] divide-y divide-[#F1F5F9]"
                >
                  {lessons.map((lesson, lIdx) => {
                    const isPreview = !!lesson.isPreview;
                    return (
                      <li
                        key={lesson.id || `${sIdx}-${lIdx}`}
                        className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-[#F8FAFC]/70 transition-colors"
                      >
                        <button
                          type="button"
                          disabled={!isPreview}
                          aria-label={
                            isPreview
                              ? `Preview lesson: ${lesson.title}`
                              : `Locked lesson: ${lesson.title}`
                          }
                          className={cn(
                            "inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                            isPreview
                              ? "bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                              : "bg-[#F1F5F9] text-[#64748B] cursor-not-allowed"
                          )}
                        >
                          {isPreview ? (
                            <Play
                              className="h-4 w-4 sm:h-4.5 sm:w-4.5 translate-x-0.5"
                              fill="currentColor"
                              aria-hidden
                            />
                          ) : (
                            <Lock className="h-4 w-4" aria-hidden />
                          )}
                        </button>

                        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "text-sm truncate",
                              isPreview ? "text-[#0F172A] font-medium" : "text-[#334155]"
                            )}
                          >
                            {lesson.title}
                          </span>
                          {isPreview ? (
                            <span className="inline-flex items-center rounded-full border border-[#2563EB]/30 bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#2563EB]">
                              Preview
                            </span>
                          ) : null}
                        </div>

                        <span className="text-xs sm:text-sm text-[#64748B] tabular-nums shrink-0">
                          {lesson.duration || ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
