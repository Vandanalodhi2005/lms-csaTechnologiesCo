import { notFound } from "next/navigation";
import StudentCourseLearningClient from "@/components/student/course/StudentCourseLearningClient.jsx";
import { getStudentCourseLearning } from "@/constants/studentCourseLearning.js";
import COURSES from "@/constants/courses.js";

export async function generateMetadata({ params }) {
  const course = getStudentCourseLearning(params?.courseSlug);
  if (!course) {
    return {
      title: "Course Not Found | EduLearn",
      description: "This course could not be found in your learning library.",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${course.title} | EduLearn`,
    description: course.description,
    robots: { index: false, follow: false },
  };
}

export default function StudentCourseLearningPage({ params }) {
  const course = getStudentCourseLearning(params?.courseSlug);
  if (!course) notFound();

  const recommendedCourses = COURSES
    .filter((item) => item.category === course.category && item.slug !== "javascript-fundamentals-from-zero-to-hero")
    .slice(0, 3);

  return <StudentCourseLearningClient course={course} recommendedCourses={recommendedCourses} />;
}