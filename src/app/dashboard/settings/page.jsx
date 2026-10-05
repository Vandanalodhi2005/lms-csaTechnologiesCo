import StudentSettingsClient from "@/components/student/settings/StudentSettingsClient.jsx";

export const metadata = {
  title: "Settings | EduLearn",
  description: "Manage your EduLearn account preferences, notifications, learning preferences, and privacy settings.",
  robots: { index: false, follow: false },
};

export default function StudentSettingsPage() {
  return <StudentSettingsClient />;
}