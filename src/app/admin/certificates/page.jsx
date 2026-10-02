import CertificateManagementClient from "@/components/admin/certificates/CertificateManagementClient.jsx";

export const metadata = {
  title: "Certificate Management | EduLearn Admin",
  description: "Manage EduLearn course completion certificates and verification records.",
};

export default function AdminCertificatesPage() {
  return <CertificateManagementClient />;
}
