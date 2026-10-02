"use client";

import Link from "next/link";
import { Check, ChevronDown, ChevronRight, Lock, Play } from "lucide-react";
import { useState } from "react";

export default function LearningCurriculum({ sections, currentLessonId, courseSlug }) {
  const [openSections, setOpenSections] = useState(() => {
    const initial = {};
    sections.forEach((section, index) => {
      initial[section.sectionId] = index === 0;
    });
    return initial;
  });

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
        <h2 className="text-lg font-semibold text-slate-900">Course Content</h2>
      </div>

      <div className="max-h-[620px] overflow-y-auto">
        {sections.map((section, sectionIndex) => {
          const isOpen = openSections[section.sectionId] ?? sectionIndex === 0;

          return (
            <div key={section.sectionId} className="border-b border-slate-200 last:border-b-0">
              <button
                type="button"
                onClick={() => toggleSection(section.sectionId)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50 sm:px-5"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-slate-700">
                  {String(sectionIndex + 1).padStart(2, "0")} . {section.sectionTitle}
                </span>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
                )}
              </button>

              {isOpen && (
                <div className="space-y-1 px-2 pb-3 sm:px-3">
                  {section.lessons.map((lesson) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const isCompleted = Boolean(lesson.isCompleted);
                    const isLocked = Boolean(lesson.isLocked);

                    const statusIcon = isLocked ? (
                      <Lock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    ) : isCompleted ? (
                      <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    ) : isCurrent ? (
                      <Play className="h-4 w-4 text-blue-600" aria-hidden="true" />
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full border border-slate-300 bg-white" aria-hidden="true" />
                    );

                    const lessonContent = (
                      <div
                        className={[
                          "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition",
                          isCurrent
                            ? "bg-blue-50 ring-1 ring-blue-100"
                            : "hover:bg-slate-50",
                          isLocked ? "cursor-not-allowed opacity-80" : "",
                        ].join(" ")}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="mt-0.5 flex-shrink-0">{statusIcon}</div>
                          <div className="min-w-0">
                            <p
                              className={[
                                "truncate text-sm font-medium",
                                isCurrent ? "text-blue-700" : "text-slate-700",
                              ].join(" ")}
                            >
                              {lesson.title}
                            </p>
                            <p className="text-xs text-slate-500">{lesson.duration}</p>
                          </div>
                        </div>

                        {isLocked ? (
                          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
                            Locked
                          </span>
                        ) : isCompleted ? (
                          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-emerald-600">
                            Complete
                          </span>
                        ) : isCurrent ? (
                          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-blue-600">
                            Playing
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
                            Open
                          </span>
                        )}
                      </div>
                    );

                    if (isLocked) {
                      return (
                        <div
                          key={lesson.id}
                          className="pointer-events-none"
                          aria-disabled="true"
                          aria-label={`${lesson.title} locked`}
                        >
                          {lessonContent}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={lesson.id}
                        href={`/learn/${courseSlug}/${lesson.id}`}
                        className="block"
                        aria-current={isCurrent ? "page" : undefined}
                        aria-label={`Open lesson ${lesson.title}`}
                      >
                        {lessonContent}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
