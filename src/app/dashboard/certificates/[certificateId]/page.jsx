import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, ChevronRight, GraduationCap, Home } from "lucide-react";
import Header from "@/components/layout/Header.jsx";
import StudentSidebar from "@/components/dashboard/StudentSidebar.jsx";
import StudentMobileNav from "@/components/dashboard/StudentMobileNav.jsx";
import CertificatePreview from "@/components/certificates/CertificatePreview.jsx";
import CertificateActions from "@/components/certificates/CertificateActions.jsx";
import CertificateInfo from "@/components/certificates/CertificateInfo.jsx";
import CertificateVerification from "@/components/certificates/CertificateVerification.jsx";
import CertificateCourseSummary from "@/components/certificates/CertificateCourseSummary.jsx";
import { certificates } from "@/constants/certificates.js";

export async function generateMetadata({ params }) {
  const certificate = certificates.find((item) => item.id === params?.certificateId);

  if (!certificate) {
    return {
      title: "Certificate Not Found | EduLearn",
      description: "This certificate could not be found on EduLearn.",
    };
  }

  return {
    title: "Certificate of Completion | EduLearn",
    description: `Certificate for ${certificate.course?.title || "course completion"}.`,
  };
}

export default function CertificateDetailPage({ params }) {
  const certificate = certificates.find((item) => item.id === params?.certificateId);

  if (!certificate) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <div className="container-page py-6 md:py-8 xl:py-10">
        <div className="flex gap-6">
          <aside className="hidden w-72 shrink-0 lg:block">
            <StudentSidebar currentPath="/dashboard/certificates" />
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
              <StudentMobileNav currentPath="/dashboard/certificates" />
            </div>

            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] sm:text-sm">
                <li>
                  <Link href="/dashboard" className="inline-flex items-center gap-1.5 hover:text-[#2563EB]">
                    <Home className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3.5 w-3.5 text-[#94A3B8]" />
                </li>
                <li>
                  <Link href="/dashboard/certificates" className="hover:text-[#2563EB]">
                    Certificates
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3.5 w-3.5 text-[#94A3B8]" />
                </li>
                <li aria-current="page" className="font-medium text-[#0F172A]">
                  Certificate
                </li>
              </ol>
            </nav>

            <header className="mb-6 rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    <GraduationCap className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">Certificate</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] md:text-4xl">Certificate of Completion</h1>
                    <p className="mt-2 text-sm leading-6 text-[#475569] md:text-base">
                      Congratulations on successfully completing your course.
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#D5E7FF] bg-[#EFF6FF] px-3 py-2 text-sm font-medium text-[#1D4ED8]">
                  <Award className="h-4 w-4" aria-hidden="true" />
                  {certificate.status === "verified" ? "Verified" : "Issued"}
                </div>
              </div>
            </header>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] xl:items-start">
              <div className="space-y-6">
                <CertificatePreview certificate={certificate} />
                <CertificateActions certificate={certificate} />
                <CertificateInfo certificate={certificate} />
              </div>

              <div className="space-y-6">
                <CertificateVerification certificate={certificate} />
                <CertificateCourseSummary certificate={certificate} />

                <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
                  <Link
                    href="/dashboard/certificates"
                    className="inline-flex items-center justify-center w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                  >
                    Back to Certificates
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
