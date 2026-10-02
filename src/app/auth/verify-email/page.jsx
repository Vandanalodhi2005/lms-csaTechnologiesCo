import Link from "next/link";
import { BookOpen, Home as HomeIcon } from "lucide-react";
import { Suspense } from "react";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm.jsx";

export const metadata = {
  title: "Email Verification | EduLearn",
  description: "Verify your email address and activate your EduLearn learning account.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: { canonical: "/auth/verify-email" },
  openGraph: {
    title: "Email Verification | EduLearn",
    description: "Verify your email address and activate your EduLearn learning account.",
    type: "website",
    url: "/auth/verify-email",
    siteName: "EduLearn",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "EduLearn Email Verification" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Email Verification | EduLearn",
    description: "Verify your email address and activate your EduLearn learning account.",
    images: ["/og-image.jpg"],
  },
  robots: { index: false, follow: true },
};

function SimpleHeader() {
  return (
    <header className="w-full border-b border-[#E2E8F0]/70 bg-white/90 backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <Link href="/" aria-label="EduLearn home" className="inline-flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F2F5F] text-white">
            <BookOpen className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} strokeWidth={2.2} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-[#0F172A]">
            Edu<span className="text-[#2563EB]">Learn</span>
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
        >
          <HomeIcon className="h-4 w-4 text-[#64748B]" />
          <span className="sm:inline hidden">Back to Home</span>
          <span className="sm:hidden inline">Home</span>
        </Link>
      </div>
    </header>
  );
}

function SimpleFooter() {
  return (
    <footer className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm text-[#64748B]">
        <p>© 2026 EduLearn. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link href="/privacy-policy" className="hover:text-[#2563EB] hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[#2563EB] hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

function LoadingFallback() {
  return (
    <div className="space-y-5">
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF6FF] border border-[#BFDBFE] animate-pulse" />
        <div className="mx-auto h-8 w-56 bg-[#E2E8F0] rounded-lg animate-pulse" />
        <div className="mx-auto h-5 w-80 bg-[#E2E8F0] rounded animate-pulse mt-3" />
      </div>
      <div className="h-12 w-full rounded-xl bg-[#E2E8F0] animate-pulse" />
      <div className="h-12 w-full rounded-xl bg-[#E2E8F0] animate-pulse" />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <SimpleHeader />

      <main className="flex-1 w-full flex items-center justify-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 xl:py-16">
          <div className="mx-auto w-full max-w-[500px] bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_10px_30px_-15px_rgba(15,47,95,0.2)] p-6 sm:p-8 md:p-10">
            <Suspense fallback={<LoadingFallback />}>
              <VerifyEmailForm />
            </Suspense>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}
