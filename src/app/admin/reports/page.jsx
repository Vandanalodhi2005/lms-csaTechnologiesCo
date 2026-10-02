import ReportsManagementClient from "@/components/admin/reports/ReportsManagementClient.jsx";

export const metadata = {
  title: "Reports & Analytics | EduLearn Admin",
  description: "Monitor EduLearn platform performance, learner activity, courses, enrollments, and revenue.",
};

export default function AdminReportsPage() {
  return <ReportsManagementClient />;
}
