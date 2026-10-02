"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useMemo, useState } from "react";

export default function MarkLessonComplete({
  initialCompleted,
  initialCompletedCount,
  totalLessons,
  lessonTitle,
}) {
  const [completed, setCompleted] = useState(Boolean(initialCompleted));
  const [completedCount, setCompletedCount] = useState(Number(initialCompletedCount) || 0);

  const progress = useMemo(() => {
    if (!totalLessons) return 0;
    return Math.min(100, Math.max(0, Math.round((completedCount / totalLessons) * 100)));
  }, [completedCount, totalLessons]);

  const handleToggle = () => {
    const nextCompleted = !completed;
    setCompleted(nextCompleted);
    setCompletedCount((previous) => {
      const nextCount = nextCompleted ? previous + 1 : previous - 1;
      return Math.min(totalLessons, Math.max(0, nextCount));
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <button
        type="button"
        onClick={handleToggle}
        className={[
          "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          completed
            ? "bg-emerald-600 text-white hover:bg-emerald-500"
            : "bg-[#0F2F5F] text-white hover:bg-[#163d7a]",
        ].join(" ")}
        aria-pressed={completed}
      >
        {completed ? (
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Circle className="h-4 w-4" aria-hidden="true" />
        )}
        {completed ? "✓ Lesson Completed" : "Mark Lesson Complete"}
      </button>

      <div className="mt-4 space-y-2" aria-label={`${lessonTitle} lesson progress`}>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span className="font-medium text-slate-700">Course Progress</span>
          <span className="font-semibold text-slate-900">{progress}%</span>
        </div>

        <div
          className="h-2.5 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label="Course completion progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-slate-500">
          {completedCount} / {totalLessons} lessons completed
        </p>
      </div>
    </div>
  );
}
