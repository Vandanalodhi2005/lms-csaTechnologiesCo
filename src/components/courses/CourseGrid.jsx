"use client";

import CourseCard from "./CourseCard.jsx";
import { cn } from "@/utils";
import EmptyState from "@/components/ui/EmptyState.jsx";
import Link from "next/link";
import Button from "@/components/ui/Button.jsx";
import { BookOpen } from "lucide-react";

export default function CourseGrid({
  courses = [],
  variant = "default",
  columns = 3,
  showWishlist = true,
  wishlistedIds = [],
  onToggleWishlist,
  progressByCourseId = {},
  className,
  compact = false,
  emptyTitle = "No courses found",
  emptyDescription = "Check back soon for new courses, or try adjusting your filters.",
  emptyAction,
  showEnrollProgress = false,
}) {
  if (!courses.length) {
    return (
      <EmptyState
        icon="empty"
        title={emptyTitle}
        description={emptyDescription}
        action={
          emptyAction || (
            <Link href="/courses">
              <Button>Browse All Courses</Button>
            </Link>
          )
        }
      />
    );
  }

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  };

  return (
    <div
      className={cn(
        "grid gap-5 sm:gap-6 w-full",
        gridCols[columns] || gridCols[3],
        className
      )}
    >
      {courses.map((course) => {
        const cid = typeof course._id === "object" ? course._id.toString() : course._id;
        const progress = progressByCourseId[cid] || {};
        return (
          <CourseCard
            key={cid}
            course={course}
            variant={variant}
            compact={compact}
            showWishlist={showWishlist}
            wishlisted={wishlistedIds.includes(cid)}
            onToggleWishlist={onToggleWishlist}
            progressPercent={showEnrollProgress ? progress.progress : undefined}
            progress={progress}
            lastLessonId={progress.lastLessonId}
          />
        );
      })}
    </div>
  );
}
