import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  BarChart,
} from "lucide-react";
import Badge from "@/components/ui/Badge.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import { formatDuration } from "@/utils";

const levelBadgeVariant = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "danger",
};

export default function CourseHero({ course }) {
  if (!course) return null;

  const instructor = course.instructorId || {
    name: course.instructor,
    avatar: course.instructorAvatar,
  };

  const categoryName = course.categoryId?.name || course.category;
  const levelVariant = levelBadgeVariant[course.level] || "default";

  return (
    <section className="relative">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" size="default">
            {categoryName}
          </Badge>
          <Badge variant={levelVariant} size="default" dot>
            {course.level}
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] leading-tight">
          {course.title}
        </h1>

        <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-3xl">
          {course.shortDescription}
        </p>

        <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-sm text-[#475569]">
          <Link
            href={`/instructors/${instructor.slug || instructor._id || ""}`}
            className="inline-flex items-center gap-2 hover:text-[#2563EB] transition-colors group"
          >
            <Avatar
              src={instructor.avatar || course.instructorAvatar}
              name={instructor.name || course.instructor}
              size="sm"
            />
            <span className="font-medium text-[#0F172A] group-hover:text-[#2563EB]">
              {instructor.name || course.instructor}
            </span>
          </Link>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 text-[#F59E0B]">
              <Star className="h-4 w-4 fill-[#F59E0B]" />
              <span className="font-semibold text-[#0F172A] tabular-nums">
                {(course.rating || 0).toFixed(1)}
              </span>
            </div>
            {typeof course.reviewCount === "number" && (
              <span className="text-[#64748B]">
                ({course.reviewCount.toLocaleString()} reviews)
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
          <Stat
            icon={Users}
            value={typeof course.students === "number" ? course.students.toLocaleString() : (course.enrollmentCount || 0).toLocaleString()}
            label="students"
          />
          <Divider />
          <Stat
            icon={Clock}
            value={formatDuration(course.duration)}
            label="total length"
          />
          <Divider />
          <Stat
            icon={BookOpen}
            value={`${course.lessons || 0}`}
            label="lessons"
          />
          <Divider />
          <Stat
            icon={BarChart}
            value={course.level}
            label="level"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="inline-flex items-center gap-2 text-[#475569]">
      <Icon className="h-4 w-4 text-[#2563EB]" aria-hidden />
      <span className="font-semibold text-[#0F172A] tabular-nums">{value}</span>
      <span className="hidden sm:inline text-xs text-[#64748B]">{label}</span>
    </div>
  );
}

function Divider() {
  return <span className="hidden sm:block h-4 w-px bg-[#E2E8F0]" aria-hidden />;
}
