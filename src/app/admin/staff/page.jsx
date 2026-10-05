import StaffManagementClient from "@/components/admin/staff/StaffManagementClient.jsx";

export const metadata = {
  title: "Staff Management | EduLearn Admin",
  description: "Manage EduLearn administrative staff accounts, roles, invitations, and access.",
};

export default function AdminStaffPage() {
  return <StaffManagementClient />;
}
