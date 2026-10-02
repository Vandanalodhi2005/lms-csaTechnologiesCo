import Link from "next/link";
import { BookOpen, Home as HomeIcon } from "lucide-react";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel.jsx";
import AuthCard from "@/components/auth/AuthCard.jsx";

export const metadata = {
  title: "Login or Register | EduLearn",
  description:
    "Sign in or create your EduLearn account and start learning from expert-led online courses.",
  keywords:
    "EduLearn login, EduLearn register, EduLearn sign in, create account, online learning account",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: { canonical: "/auth" },
  openGraph: {
    title: "Login or Register | EduLearn",
    description:
      "Sign in or create your EduLearn account and start learning from expert-led online courses.",
    type: "website",
    url: "/auth",
    siteName: "EduLearn",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "EduLearn Login" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Login or Register | EduLearn",
    description:
      "Sign in or create your EduLearn account and start learning from expert-led online courses.",
    images: ["/og-image.jpg"],
  },
  robots: { index: false, follow: true },
};

function SimpleHeader() {
  return (
    <header className="w-full border-b border-[#E2E8F0]/70 bg-white/90 backdrop-blur">
      <div className="container-page h-16 flex items-center justify-between gap-3">
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
    <footer className="container-page py-6 md:py-8 text-center sm:text-left">
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

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <SimpleHeader />

      <main className="flex-1 w-full">
        <div className="container-page py-8 md:py-12 xl:py-16">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            <div className="lg:col-span-7 xl:col-span-7 lg:min-h-[640px]">
              <AuthBrandPanel />

              <div className="lg:hidden mt-6">
                <AuthCard />
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-5 hidden lg:flex items-center justify-center py-6">
              <AuthCard />
            </div>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}
