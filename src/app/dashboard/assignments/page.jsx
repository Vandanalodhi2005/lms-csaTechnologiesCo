import StudentAssignmentsClient from "@/components/student/assignments/StudentAssignmentsClient.jsx";

export const metadata = {
  title: "My Assignments | EduLearn",
  description: "View and track your assignments, submissions, deadlines, and grades on EduLearn.",
  robots: { index: false, follow: false },
};

export default function StudentAssignmentsPage() {
  return <StudentAssignmentsClient />;
}