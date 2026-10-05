import StudentProgressClient from "@/components/student/progress/StudentProgressClient.jsx";

export const metadata = {
  title: "My Learning Progress | EduLearn",
  description: "Track your learning progress, course completion, activity, and performance with EduLearn.",
  robots: { index: false, follow: false },
};

export default function StudentProgressPage() {
  return <StudentProgressClient />;
}