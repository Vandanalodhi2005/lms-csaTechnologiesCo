import Link from "next/link";
import { BookOpen, Mail, Phone } from "lucide-react";

const footerLinks = {
  learn: {
    title: "Learn",
    items: [
      { label: "Courses", href: "/courses" },
      { label: "Categories", href: "/categories" },
      { label: "Instructors", href: "/instructors" },
    ],
  },
  company: {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  legal: {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
};

export default function Footer() {
  const year = 2026;
  return (
    <footer className="bg-[#0F2F5F] text-white mt-20">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          <div className="col-span-2 md:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                Edu<span className="text-[#60A5FA]">Learn</span>
              </span>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed">
              Learn practical skills with expert-led online courses. Build your future, one course at a time.
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <a href="mailto:hello@edulearn.com" className="hover:text-white transition-colors">
                  hello@edulearn.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <a href="tel:+18001234567" className="hover:text-white transition-colors">
                  +1 (800) 123-4567
                </a>
              </div>
            </div>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © {year} EduLearn. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-400">
            <span>Secure Payments</span>
            <span className="text-white/20">•</span>
            <span>SSL Secured</span>
            <span className="text-white/20">•</span>
            <span>30-Day Refund</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
