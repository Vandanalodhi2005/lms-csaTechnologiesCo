import Link from "next/link";
import { getAuthUser } from "@/lib/auth";

export default async function AuthLayout({ children }) {
  const user = await getAuthUser();
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC]">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-primary-500/10 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full min-h-screen">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span className="font-bold text-2xl tracking-tight text-dark-900">
              Learn<span className="text-primary-600">Hub</span>
            </span>
          </Link>
          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-dark-900 leading-tight">
              Unlock your potential with expert-led courses
            </h1>
            <p className="text-lg text-dark-600 leading-relaxed">
              Join thousands of learners building skills, earning certifications, and advancing their careers.
            </p>
            <div className="space-y-4 pt-4">
              {[
                { title: "Expert Instructors", desc: "Learn from industry professionals" },
                { title: "Verified Certificates", desc: "Earn credentials employers recognize" },
                { title: "Lifetime Access", desc: "Revisit courses anytime, anywhere" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-dark-900">{item.title}</p>
                    <p className="text-sm text-dark-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-dark-500">
            © {new Date().getFullYear()} LearnHub. Empowering learners worldwide.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12 min-h-screen">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span className="font-bold text-xl">
              Learn<span className="text-primary-600">Hub</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
