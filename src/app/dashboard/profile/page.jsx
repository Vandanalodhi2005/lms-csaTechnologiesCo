import StudentProfileClient from "@/components/student/profile/StudentProfileClient.jsx";

export const metadata = {
  title: "My Profile | EduLearn",
  description: "Manage your EduLearn student profile and learning information.",
  robots: { index: false, follow: false },
};

export default function StudentProfilePage() {
  return <StudentProfileClient />;
}