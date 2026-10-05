import COURSES from "@/constants/courses.js";
import { instructors } from "@/constants/instructors.js";
import { courseLessons } from "@/constants/lessons.js";

const enrollmentSeeds = [
  { courseIndex: 0, completedLessons: 4, totalLessons: 7, enrolledAt: "2026-08-10", lastAccessedAt: "2026-10-05T09:30:00", lastLessonIndex: 3 },
  { courseIndex: 1, completedLessons: 42, totalLessons: 42, enrolledAt: "2026-07-19", lastAccessedAt: "2026-10-04T17:10:00" },
  { courseIndex: 2, completedLessons: 0, totalLessons: 36, enrolledAt: "2026-09-28", lastAccessedAt: null },
  { courseIndex: 3, completedLessons: 29, totalLessons: 35, enrolledAt: "2026-08-26", lastAccessedAt: "2026-10-03T14:20:00" },
  { courseIndex: 4, completedLessons: 20, totalLessons: 20, enrolledAt: "2026-06-14", lastAccessedAt: "2026-09-30T11:05:00" },
  { courseIndex: 5, completedLessons: 16, totalLessons: 38, enrolledAt: "2026-09-03", lastAccessedAt: "2026-10-01T18:45:00" },
  { courseIndex: 6, completedLessons: 0, totalLessons: 24, enrolledAt: "2026-09-29", lastAccessedAt: null },
  { courseIndex: 7, completedLessons: 25, totalLessons: 33, enrolledAt: "2026-07-02", lastAccessedAt: "2026-10-02T08:15:00" },
  { courseIndex: 8, completedLessons: 13, totalLessons: 29, enrolledAt: "2026-08-07", lastAccessedAt: "2026-09-27T16:40:00" },
  { courseIndex: 9, completedLessons: 8, totalLessons: 32, enrolledAt: "2026-09-12", lastAccessedAt: "2026-09-28T10:10:00" },
  { courseIndex: 10, completedLessons: 0, totalLessons: 28, enrolledAt: "2026-10-01", lastAccessedAt: null },
  { courseIndex: 11, completedLessons: 15, totalLessons: 30, enrolledAt: "2026-08-18", lastAccessedAt: "2026-10-04T12:00:00" },
];

const playerCourseSlug = "react-nextjs-complete-course";
const playerLessons = courseLessons[playerCourseSlug]?.sections.flatMap((section) => section.lessons) || [];

export const studentCourses = enrollmentSeeds.flatMap((seed, enrollmentIndex) => {
  const course = COURSES[seed.courseIndex];
  if (!course) return [];

  const progress = Math.round((seed.completedLessons / seed.totalLessons) * 100);
  const status = progress === 0 ? "Not Started" : progress === 100 ? "Completed" : "In Progress";
  const instructor = instructors.find((item) => item.slug === course.instructorId?.slug);
  const hasPlayerRoute = enrollmentIndex === 0 && playerLessons.length > 0;
  const playerLesson = hasPlayerRoute
    ? playerLessons[Math.min(seed.lastLessonIndex ?? 0, playerLessons.length - 1)]
    : null;

  return [{
    id: `ENR-${String(1001 + enrollmentIndex)}`,
    courseId: course.id,
    slug: course.slug,
    learningSlug: hasPlayerRoute ? playerCourseSlug : null,
    title: course.title,
    shortDescription: course.shortDescription,
    category: course.category,
    level: course.level,
    instructor: {
      id: course.instructorId?._id || instructor?.id,
      name: instructor?.name || course.instructor,
      avatar: instructor?.avatar || course.instructorAvatar,
    },
    thumbnail: course.thumbnail,
    rating: course.rating,
    reviewCount: course.reviewCount,
    enrolledAt: seed.enrolledAt,
    completedLessons: seed.completedLessons,
    totalLessons: seed.totalLessons,
    progress,
    status,
    lastAccessedAt: seed.lastAccessedAt,
    lastAccessedLesson: seed.lastAccessedAt
      ? {
          id: playerLesson?.id || `mock-lesson-${enrollmentIndex + 1}`,
          title: playerLesson?.title || [
            "Building a practical project",
            "Applying core concepts",
            "Putting the workflow together",
            "Reviewing key techniques",
          ][enrollmentIndex % 4],
        }
      : null,
  }];
});