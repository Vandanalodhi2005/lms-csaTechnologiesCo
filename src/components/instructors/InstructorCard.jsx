import Link from "next/link";
import { Star, Users, BookOpen, ArrowRight } from "lucide-react";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";

export default function InstructorCard({ instructor }) {
  if (!instructor) return null;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <Avatar
            src={instructor.avatar}
            alt={`${instructor.name} profile photo`}
            name={instructor.name}
            size="xl"
            className="ring-4 ring-[#EFF6FF]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="truncate text-lg font-semibold text-[#0F172A]">{instructor.name}</h3>
            <Badge variant="outline" size="sm" className="text-[10px] uppercase tracking-[0.14em]">
              {instructor.category}
            </Badge>
          </div>
          <p className="text-sm font-medium text-[#2563EB]">{instructor.role}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {instructor.expertise.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="secondary" size="sm" className="rounded-full border-[#E2E8F0] bg-[#F8FAFC]">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-[#F59E0B]">
        <Star className="h-4 w-4 fill-current" />
        <span className="text-sm font-semibold text-[#0F172A]">{instructor.rating.toFixed(1)}</span>
        <span className="text-sm text-[#64748B]">({instructor.reviewCount} Reviews)</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#E2E8F0] pt-4 text-sm text-[#475569]">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#2563EB]" />
          <span>{formatStudentCount(instructor.studentCount)} Students</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#2563EB]" />
          <span>{instructor.courseCount} Courses</span>
        </div>
      </div>

      <div className="mt-5 pt-4">
        <Link
          href={`/instructors/${instructor.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
        >
          View Profile
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function formatStudentCount(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, "")}K`;
  return value.toString();
}
