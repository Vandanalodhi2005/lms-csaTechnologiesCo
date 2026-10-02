"use client";

import { useMemo, useState } from "react";
import { BookOpen, FolderOpen } from "lucide-react";
import StudentCourseCard from "@/components/dashboard/StudentCourseCard.jsx";

const tabs = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "not-started", label: "Not Started" },
];

export default function StudentCourseTabs({ courses = [] }) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredCourses = useMemo(() => {
    if (activeTab === "all") return courses;
    return courses.filter((course) => course.status === activeTab);
  }, [activeTab, courses]);

  return (
    <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Course library</p>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">My Courses</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                  : "border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] hover:border-[#CBD5E1] hover:text-[#0F172A]"
              }`}
              aria-pressed={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
            <FolderOpen className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="mt-4 text-lg font-semibold text-[#0F172A]">No courses in this category yet.</p>
          <p className="mt-2 text-sm text-[#64748B]">Explore new courses and start building your learning path.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          {filteredCourses.map((course) => (
            <StudentCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
