import StudentQuizzesClient from "@/components/student/quizzes/StudentQuizzesClient.jsx";

export const metadata = {
  title: "My Quizzes | EduLearn",
  description: "View, complete, and track your quizzes and assessment performance on EduLearn.",
  robots: { index: false, follow: false },
};

export default function StudentQuizzesPage() {
  return <StudentQuizzesClient />;
}