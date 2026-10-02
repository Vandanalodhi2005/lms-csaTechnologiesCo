import UserManagementClient from "@/components/admin/users/UserManagementClient.jsx";

export const metadata = {
  title: "User Management | EduLearn Admin",
  description: "Manage EduLearn platform users.",
};

export default function AdminUsersPage() {
  return <UserManagementClient />;
}
