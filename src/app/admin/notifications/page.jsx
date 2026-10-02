import NotificationManagementClient from "@/components/admin/notifications/NotificationManagementClient.jsx";

export const metadata = {
  title: "Notification Management | EduLearn Admin",
  description: "Manage EduLearn platform notifications, announcements, and notification activity.",
};

export default function AdminNotificationsPage() {
  return <NotificationManagementClient />;
}
