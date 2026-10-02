import SystemHealthClient from "@/components/admin/system-health/SystemHealthClient.jsx";

export const metadata = {
  title: "System Health | EduLearn Admin",
  description: "Monitor EduLearn platform health and system performance.",
};

export default function AdminSystemHealthPage() {
  return <SystemHealthClient />;
}
