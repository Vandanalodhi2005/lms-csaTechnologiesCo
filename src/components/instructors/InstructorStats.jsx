import { formatCompactNumber } from "@/constants/categories.js";

export default function InstructorStats({ instructors = [] }) {
  const totalStudents = instructors.reduce((sum, instructor) => sum + (instructor.studentCount || 0), 0);
  const totalCourses = instructors.reduce((sum, instructor) => sum + (instructor.courseCount || 0), 0);
  const averageRating =
    instructors.length > 0
      ? (instructors.reduce((sum, instructor) => sum + (instructor.rating || 0), 0) / instructors.length).toFixed(1)
      : "0.0";

  const stats = [
    { value: `${instructors.length}+`, label: "Expert Instructors" },
    { value: `${formatCompactNumber(totalStudents)}+`, label: "Students" },
    { value: `${totalCourses}+`, label: "Courses" },
    { value: averageRating, label: "Average Instructor Rating" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="text-3xl font-extrabold tracking-tight text-[#0F172A]">{stat.value}</div>
          <p className="mt-2 text-sm text-[#475569]">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
