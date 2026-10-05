import InstructorCoursesClient from "@/components/instructor/courses/InstructorCoursesClient.jsx";

export const metadata = {
  title: "My Courses | Instructor | EduLearn",
  description: "Manage your EduLearn courses, drafts, published courses, students, ratings, and course performance.",
  robots: { index: false, follow: false },
};

export default function InstructorCoursesPage() {
  return <InstructorCoursesClient />;
}