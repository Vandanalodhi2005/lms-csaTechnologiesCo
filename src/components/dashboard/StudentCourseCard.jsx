import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, PlayCircle, Star } from "lucide-react";
import Button from "@/components/ui/Button.jsx";

const statusColors = {
  "in-progress": "bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]",
  completed: "bg-[#ECFDF5] text-[#15803D] border-[#BBF7D0]",
  "not-started": "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]",
};

function formatStatus(status) {
  if (status === "in-progress") return "In Progress";
  if (status === "completed") return "Completed";
  return "Not Started";
}

export default function StudentCourseCard({ course }) {
  const progress = Math.min(100, Math.max(0, Number(course.progress || 0)));

  return (
    <article className="group overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F8FAFC]">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">{course.category}</span>
          <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusColors[course.status] || statusColors["not-started"]}`}>
            {formatStatus(course.status)}
          </span>
        </div>

        <Link href={`/courses/${course.slug}`} className="mt-3 block">
          <h3 className="text-lg font-semibold leading-snug text-[#0F172A] transition-colors hover:text-[#2563EB]">
            {course.title}
          </h3>
        </Link>

        <div className="mt-3 flex items-center gap-2 text-sm text-[#64748B]">
          <BookOpen className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
          <span>{course.instructor}</span>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-[#64748B]">
          <span className="inline-flex items-center gap-1.5">
            <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {course.completedLessons} / {course.totalLessons} lessons
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#0F172A]">
            <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
            {progress}%
          </span>
        </div>

        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#E2E8F0]" aria-label={`${course.title} progress`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
          <div className="inline-flex items-center gap-1.5 text-sm text-[#475569]">
            <Clock3 className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            {course.status === "completed" ? "Completed" : course.status === "not-started" ? "Ready to begin" : "Continue learning"}
          </div>

          <Link href={`/courses/${course.slug}`}>
            <Button size="sm" className="h-9 rounded-lg bg-[#0F2F5F] text-white hover:bg-[#143A72]">
              {course.status === "completed" ? "Review" : "Continue"}
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
