import Link from "next/link";
import { Home, Search, BookOpen, ArrowLeft, Compass } from "lucide-react";

export const metadata = {
  title: "Page Not Found | EduLearn",
  description: "Oops! The page you were looking for doesn't exist.",
};

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Browse Courses" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center px-4">
      {/* Decorative circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center max-w-2xl w-full">
        {/* 404 display */}
        <div className="relative mb-8">
          <p className="text-[120px] md:text-[160px] font-black text-white/5 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl px-8 py-5">
              <Compass className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <p className="text-2xl md:text-3xl font-extrabold text-white">Page Not Found</p>
            </div>
          </div>
        </div>

        <p className="text-slate-400 text-lg mb-3">
          Oops! The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <p className="text-slate-500 text-sm mb-10">
          Don&apos;t worry — there&apos;s still plenty to explore on EduLearn!
        </p>

        {/* Primary actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-2xl shadow-lg shadow-blue-500/30 transition"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-2xl border border-white/20 transition"
          >
            <BookOpen className="w-4 h-4" /> Browse Courses
          </Link>
        </div>

        {/* Quick links */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <p className="text-slate-400 text-sm font-semibold mb-4 uppercase tracking-wider">Quick Navigation</p>
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-sm font-medium rounded-xl border border-white/10 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
