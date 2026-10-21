import Link from "next/link";
import { FileText, Users, BookOpen, CreditCard, AlertTriangle, Scale, Mail, ChevronRight, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Terms of Service | EduLearn",
  description: "Read EduLearn's Terms of Service — the legal agreement governing your use of our platform and services.",
};

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: FileText,
    content: "By accessing or using the EduLearn platform (the 'Platform'), you agree to be bound by these Terms of Service ('Terms'). If you do not agree to these Terms, you may not access or use the Platform. These Terms constitute a legally binding agreement between you and EduLearn Technologies Pvt. Ltd. ('EduLearn', 'we', 'us', or 'our').",
  },
  {
    id: "account",
    title: "2. Account Registration & Responsibilities",
    icon: Users,
    bullets: [
      "You must be at least 16 years old to create an account. Users under 18 require parental/guardian consent.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You must provide accurate, complete, and current registration information.",
      "You are responsible for all activities that occur under your account.",
      "You must notify us immediately of any unauthorized use of your account at security@edulearn.com.",
      "One person may not maintain more than one free account.",
    ],
  },
  {
    id: "courses",
    title: "3. Course Enrollment & Content",
    icon: BookOpen,
    content: "When you enroll in a course, EduLearn grants you a limited, non-exclusive, non-transferable license to access and view the course content for personal, non-commercial purposes. Course access is tied to your account and cannot be shared, transferred, or resold. EduLearn reserves the right to update, modify, or remove course content at any time.",
    bullets: [
      "You may not reproduce, redistribute, or share course materials without explicit written permission.",
      "Downloading course content is permitted only through our official app for Pro/Enterprise subscribers.",
      "AI-generated or automated access to course content is strictly prohibited.",
      "Screen recording or capturing of video content is not permitted.",
    ],
  },
  {
    id: "payments",
    title: "4. Payments, Refunds & Subscriptions",
    icon: CreditCard,
    content: "All prices are displayed in USD unless otherwise stated. By making a purchase, you agree to our pricing and refund policies.",
    bullets: [
      "30-Day Money-Back Guarantee: If you're not satisfied with a course, contact us within 30 days of purchase for a full refund.",
      "Subscriptions auto-renew unless cancelled before the renewal date.",
      "You can cancel your subscription at any time; access continues until the end of the billing period.",
      "Refunds are not available for partially completed courses after 30 days.",
      "EduLearn reserves the right to change pricing with 30 days' notice to subscribers.",
    ],
  },
  {
    id: "conduct",
    title: "5. User Conduct & Prohibited Activities",
    icon: AlertTriangle,
    content: "You agree not to use the Platform in any way that:",
    bullets: [
      "Violates any applicable local, national, or international law or regulation.",
      "Is fraudulent, deceptive, or harmful to other users or EduLearn.",
      "Infringes upon the intellectual property rights of EduLearn or any third party.",
      "Involves sharing account credentials, pirating course content, or circumventing payment.",
      "Involves uploading malware, spam, or engaging in phishing activities.",
      "Harasses, threatens, or abuses other users or instructors.",
      "Involves creating fake reviews or manipulating course ratings.",
      "Uses the platform for any commercial purpose without prior written consent.",
    ],
  },
  {
    id: "intellectual-property",
    title: "6. Intellectual Property",
    icon: Scale,
    content: "All content on the EduLearn Platform — including course videos, text, graphics, logos, software, and trademarks — is the intellectual property of EduLearn or its content providers and is protected by copyright, trademark, and other applicable laws. Instructors retain ownership of their course content but grant EduLearn a worldwide, royalty-free license to host, distribute, and display their content on the Platform.",
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    icon: ShieldAlert,
    content: "To the maximum extent permitted by law, EduLearn shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including but not limited to loss of profits, data, or goodwill. EduLearn's total liability to you for all claims shall not exceed the amount paid by you to EduLearn in the 12 months preceding the claim. The Platform is provided on an 'as-is' and 'as-available' basis without warranties of any kind.",
  },
  {
    id: "termination",
    title: "8. Termination",
    icon: AlertTriangle,
    content: "EduLearn reserves the right to suspend or terminate your account at any time, with or without notice, for any violation of these Terms. Upon termination, your right to access the Platform ceases immediately. You may also delete your account at any time from your Account Settings. Provisions of these Terms that by their nature should survive termination shall do so.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="w-14 h-14 bg-violet-500/20 border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FileText className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400 mb-4">
            Please read these Terms carefully before using the EduLearn platform. By using our services, you agree to these terms.
          </p>
          <p className="text-slate-500 text-sm">Effective Date: October 1, 2025 · Last Updated: October 15, 2025</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar TOC */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <p className="text-slate-800 font-bold text-sm mb-4">Contents</p>
            <ul className="space-y-2">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex items-center gap-2 text-slate-500 hover:text-violet-600 text-xs font-medium transition-colors py-1 group"
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
        <main className="lg:col-span-3 space-y-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-800 text-sm leading-relaxed">
            <strong>⚠️ Important:</strong> These Terms of Service govern your use of EduLearn. By using our platform, you agree to these terms. If you have any questions, please contact our legal team before using the platform.
          </div>

          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} id={section.id} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm scroll-mt-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-violet-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
                </div>

                {section.content && (
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{section.content}</p>
                )}

                {section.bullets && (
                  <ul className="space-y-2.5">
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0 mt-2" />
                        <span className="text-slate-600 text-sm leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}

          {/* Governing Law */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">9. Governing Law</h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts located in Bengaluru, Karnataka, India. For users outside India, local mandatory consumer protection laws may apply.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-7 text-white">
            <Mail className="w-8 h-8 text-white/70 mb-4" />
            <h2 className="text-xl font-bold mb-2">Questions About These Terms?</h2>
            <p className="text-violet-200 text-sm mb-5">
              If you have any questions or concerns about these Terms of Service, please contact our legal team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-violet-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-50 transition text-sm"
              >
                Contact Legal Team
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/20 transition text-sm"
              >
                Read Privacy Policy
              </Link>
            </div>
            <p className="text-violet-300 text-xs mt-4">legal@edulearn.com</p>
          </div>
        </main>
      </div>
    </div>
  );
}
