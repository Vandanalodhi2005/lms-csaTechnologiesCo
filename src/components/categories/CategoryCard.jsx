import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Camera,
  Code2,
  Database,
  Megaphone,
  Palette,
  Users,
} from "lucide-react";
import { formatCompactNumber } from "@/constants/categories.js";

const iconMap = {
  Code2,
  Palette,
  BriefcaseBusiness,
  Megaphone,
  Camera,
  Database,
};

export default function CategoryCard({ category }) {
  if (!category) {
    return null;
  }

  const Icon = iconMap[category.icon] || Code2;
  const courseCount = Number(category.courseCount || 0);
  const studentCount = Number(category.studentCount || 0);

  return (
    <Link href={`/courses/categories/${category.slug}`} className="group block h-full">
      <article className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-lg focus-within:ring-2 focus-within:ring-[#2563EB] focus-within:ring-offset-2">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-slate-900">{category.name || "Category"}</h3>

        <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-600">
          {category.description || "Explore practical learning paths and build meaningful skills."}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>{courseCount} Courses</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>{formatCompactNumber(studentCount)} Students</span>
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-semibold text-[#2563EB]">Explore Courses</span>
          <ArrowRight className="h-4 w-4 text-[#2563EB] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </article>
    </Link>
  );
}
