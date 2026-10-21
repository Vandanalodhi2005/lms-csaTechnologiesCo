import Link from "next/link";
import { Shield, Lock, Eye, Share2, Cookie, Mail, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | EduLearn",
  description: "Read EduLearn's Privacy Policy to understand how we collect, use, and protect your personal data.",
};

const SECTIONS = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    icon: Eye,
    content: [
      {
        subtitle: "Information You Provide",
        text: "When you create an account, enroll in courses, or contact us, we collect information such as your name, email address, password (hashed), billing information, profile photo, and any content you create (reviews, forum posts, assignments).",
      },
      {
        subtitle: "Automatically Collected Information",
        text: "When you use EduLearn, we automatically collect certain technical information including IP address, browser type and version, device information, operating system, pages visited, time spent on pages, and course progress data.",
      },
      {
        subtitle: "Payment Information",
        text: "All payment processing is handled by our trusted payment partners (Stripe, Razorpay). We do not store full credit card numbers on our servers. We receive only non-sensitive transaction identifiers.",
      },
    ],
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    icon: Share2,
    content: [
      {
        subtitle: null,
        text: "We use your information to:",
      },
      {
        subtitle: "Service Delivery",
        text: "Provide access to courses, track your learning progress, issue certificates, process payments, and deliver personalized recommendations.",
      },
      {
        subtitle: "Communication",
        text: "Send you course updates, newsletters (if opted in), promotional offers, security alerts, and support messages. You can opt out of marketing communications at any time.",
      },
      {
        subtitle: "Platform Improvement",
        text: "Analyze usage patterns, fix bugs, improve our recommendation algorithms, and develop new features that better serve our learners.",
      },
      {
        subtitle: "Legal Compliance",
        text: "Comply with applicable laws, respond to legal requests, enforce our Terms of Service, and protect the rights, property, or safety of EduLearn, our users, or the public.",
      },
    ],
  },
  {
    id: "data-sharing",
    title: "3. Data Sharing & Disclosure",
    icon: Share2,
    content: [
      {
        subtitle: "We Do NOT Sell Your Data",
        text: "EduLearn does not sell, rent, or trade your personal information to third parties for their marketing purposes.",
      },
      {
        subtitle: "Service Providers",
        text: "We share data with trusted third-party service providers who assist us in operating our platform (e.g., cloud hosting, payment processing, email delivery, analytics). These providers are contractually obligated to protect your data.",
      },
      {
        subtitle: "Instructors",
        text: "When you enroll in a course, the instructor may see aggregate data about their students (e.g., completion rates) but not your personal contact information without your consent.",
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose your information if required by law, subpoena, or other legal process, or if we have a good-faith belief that disclosure is necessary to protect our rights or the safety of others.",
      },
    ],
  },
  {
    id: "data-security",
    title: "4. Data Security",
    icon: Lock,
    content: [
      {
        subtitle: "Security Measures",
        text: "We implement industry-standard security measures including 256-bit SSL/TLS encryption for data in transit, AES-256 encryption for data at rest, secure password hashing (bcrypt), two-factor authentication support, and regular security audits.",
      },
      {
        subtitle: "Breach Notification",
        text: "In the event of a data breach affecting your personal information, we will notify you as required by applicable law, typically within 72 hours of becoming aware of the breach.",
      },
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies & Tracking",
    icon: Cookie,
    content: [
      {
        subtitle: "Essential Cookies",
        text: "Necessary for the platform to function — keeping you logged in, remembering preferences, and maintaining session security.",
      },
      {
        subtitle: "Analytics Cookies",
        text: "Help us understand how users interact with our platform. We use tools like Google Analytics to improve our service.",
      },
      {
        subtitle: "Your Choices",
        text: "You can control cookies through your browser settings. Blocking essential cookies may affect your ability to use certain features of the platform.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "6. Your Rights",
    icon: Shield,
    content: [
      {
        subtitle: null,
        text: "Depending on your location, you may have the following rights regarding your personal data:",
      },
      {
        subtitle: "Access & Portability",
        text: "Request a copy of the personal data we hold about you in a portable format.",
      },
      {
        subtitle: "Correction",
        text: "Request correction of inaccurate or incomplete personal data.",
      },
      {
        subtitle: "Deletion",
        text: "Request deletion of your personal data (the 'right to be forgotten'), subject to certain legal limitations.",
      },
      {
        subtitle: "Opt-Out",
        text: "Opt out of marketing communications at any time by clicking the 'unsubscribe' link in emails or contacting us directly.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="w-14 h-14 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400 mb-4">
            Your privacy matters to us. This policy explains how EduLearn collects, uses, and protects your personal information.
          </p>
          <p className="text-slate-500 text-sm">Last updated: October 15, 2025</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar TOC */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <p className="text-slate-800 font-bold text-sm mb-4">Table of Contents</p>
            <ul className="space-y-2">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-xs font-medium transition-colors py-1 group"
                  >
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <main className="lg:col-span-3 space-y-10">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-blue-800 text-sm leading-relaxed">
            <strong>Summary:</strong> We collect only what we need, we don&apos;t sell your data, we protect it with industry-standard security, and you have the right to access, correct, or delete your information at any time.
          </div>

          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} id={section.id} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm scroll-mt-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
                </div>
                <div className="space-y-5">
                  {section.content.map((item, i) => (
                    <div key={i}>
                      {item.subtitle && (
                        <h3 className="font-semibold text-slate-800 text-sm mb-1.5">{item.subtitle}</h3>
                      )}
                      <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Contact section */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-7 text-white">
            <Mail className="w-8 h-8 text-white/70 mb-4" />
            <h2 className="text-xl font-bold mb-2">Questions About Your Privacy?</h2>
            <p className="text-blue-200 text-sm mb-5">
              If you have any questions about this Privacy Policy or how we handle your data, please contact our Privacy Team.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition text-sm"
            >
              Contact Privacy Team <ChevronRight className="w-4 h-4" />
            </Link>
            <p className="text-blue-300 text-xs mt-4">privacy@edulearn.com · Response within 48 hours</p>
          </div>
        </main>
      </div>
    </div>
  );
}
