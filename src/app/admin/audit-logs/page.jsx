import AuditLogManagementClient from "@/components/admin/audit/AuditLogManagementClient.jsx";

export const metadata = {
  title: "Audit Logs | EduLearn Admin",
  description: "Review administrative and system activity across the EduLearn platform.",
};

export default function AdminAuditLogsPage() {
  return <AuditLogManagementClient />;
}
