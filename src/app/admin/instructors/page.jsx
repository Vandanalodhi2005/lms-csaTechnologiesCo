import InstructorManagementClient from "@/components/admin/instructors/InstructorManagementClient.jsx";

export const metadata = {
  title: "Instructor Management | EduLearn Admin",
  description: "Manage EduLearn instructors, profiles, courses, ratings, and account status.",
};

export default function AdminInstructorsPage() {
  return <InstructorManagementClient />;
}
