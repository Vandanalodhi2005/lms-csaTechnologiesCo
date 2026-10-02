import CourseManagementClient from "@/components/admin/courses/CourseManagementClient.jsx";

export const metadata = {
  title: "Course Management | EduLearn Admin",
  description: "Manage EduLearn courses, instructors, students, publishing status, and course content.",
};

export default function AdminCoursesPage() {
  return <CourseManagementClient />;
}
