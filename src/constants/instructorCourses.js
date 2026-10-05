import COURSES from "@/constants/courses.js";
import { instructorDashboard } from "@/constants/instructorDashboard.js";

const statusByCourse = [
  "published",
  "published",
  "draft",
  "published",
  "published",
  "draft",
  "published",
  "pending-review",
  "published",
  "rejected",
  "archived",
  "published",
  "draft",
];

const studentCounts = [1248, 820, 380, 290, 612, 164, 536, 0, 408, 0, 112, 276, 38];
const completionRates = [72, 76, 0, 68, 81, 0, 74, 0, 69, 0, 45, 77, 0];
const revenues = [1842000, 1200000, 0, 420000, 910000, 0, 875000, 0, 624000, 0, 126000, 511000, 0];
const reviewCounts = [245, 184, 47, 62, 135, 19, 94, 0, 81, 0, 12, 56, 0];

export const instructorCourseSeed = instructorDashboard.instructor;

export const instructorCourses = COURSES.slice(0, statusByCourse.length).map((course, index) => {
  const status = statusByCourse[index];
  const updatedDate = new Date(Date.UTC(2026, 9, 5 - index * 2));
  const createdDate = new Date(Date.UTC(2026, 1, 12 + index * 9));
  const currency = "INR";
  const price = index % 4 === 2 ? 0 : 1299 + index * 200;
  const sections = [
    { id: `section-${index}-1`, title: "Introduction", lessons: ["Welcome", "Course Overview", "Setup"] },
    { id: `section-${index}-2`, title: "Fundamentals", lessons: ["Core Concepts", "Practical Exercises", "Review"] },
    { id: `section-${index}-3`, title: "Advanced Concepts", lessons: ["Advanced Patterns", "Optimization", "Final Project"] },
  ];

  return {
    id: `instructor-course-${String(index + 1).padStart(3, "0")}`,
    courseId: `EDU-${String(1001 + index)}`,
    slug: course.slug,
    title: course.title,
    shortDescription: course.shortDescription,
    description: Array.isArray(course.description) ? course.description.join(" ") : course.shortDescription,
    category: course.category,
    level: course.level,
    language: "English",
    thumbnail: course.thumbnail,
    status,
    price,
    currency,
    students: studentCounts[index],
    rating: studentCounts[index] ? course.rating : 0,
    reviewCount: reviewCounts[index],
    completionRate: completionRates[index],
    totalLessons: course.lessons,
    duration: course.duration,
    revenue: revenues[index],
    createdAt: createdDate.toISOString().slice(0, 10),
    updatedAt: updatedDate.toISOString().slice(0, 10),
    submittedAt: status === "pending-review" ? "2026-10-04" : null,
    instructor: {
      id: instructorDashboard.instructor.id,
      name: instructorDashboard.instructor.name,
      avatar: instructorDashboard.instructor.avatar,
    },
    rejectionReason: status === "rejected" ? "Course description needs additional detail and the curriculum requires revision." : null,
    sections,
  };
});

export const instructorCourseActivity = [
  { id: "activity-1", text: "React & Next.js Masterclass was updated", time: "Today, 10:20 AM", type: "updated" },
  { id: "activity-2", text: "Node.js API Development received a new review", time: "Yesterday", type: "review" },
  { id: "activity-3", text: "JavaScript Fundamentals reached 1,000 students", time: "Oct 03, 2026", type: "milestone" },
  { id: "activity-4", text: "Next.js Advanced was submitted for review", time: "Oct 02, 2026", type: "submitted" },
];