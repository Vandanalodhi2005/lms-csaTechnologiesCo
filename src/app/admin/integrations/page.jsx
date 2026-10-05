import IntegrationsManagementClient from "@/components/admin/integrations/IntegrationsManagementClient.jsx";

export const metadata = {
  title: "API & Integrations | EduLearn Admin",
  description: "Manage EduLearn API integrations, external services, and webhook configurations.",
};

export default function AdminIntegrationsPage() {
  return <IntegrationsManagementClient />;
}
