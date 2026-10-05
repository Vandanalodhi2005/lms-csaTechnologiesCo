import RolesPermissionsClient from "@/components/admin/roles/RolesPermissionsClient.jsx";

export const metadata = {
  title: "Roles & Permissions | EduLearn Admin",
  description: "Manage EduLearn administrator roles and platform permissions.",
};

export default function AdminRolesPermissionsPage() {
  return <RolesPermissionsClient />;
}
