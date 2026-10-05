import StudentCertificatesClient from "@/components/student/certificates/StudentCertificatesClient.jsx";

export const metadata = {
  title: "My Certificates | EduLearn",
  description: "View your earned EduLearn course certificates and completion records.",
  robots: { index: false, follow: false },
};

export default function StudentCertificatesPage() {
  return <StudentCertificatesClient />;
}