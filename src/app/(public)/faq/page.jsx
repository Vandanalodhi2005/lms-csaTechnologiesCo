"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
  Mail,
  BookOpen,
  Users,
  Zap,
  Search,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "courses", label: "Courses & Content" },
  { id: "account", label: "Account & Profile" },
  { id: "payments", label: "Payments & Billing" },
  { id: "certificates", label: "Certificates" },
  { id: "technical", label: "Technical Support" },
  { id: "instructors", label: "For Instructors" },
];

const FAQS = [
  {
    category: "courses",
    q: "How do I enroll in a course?",
    a: "To enroll in a course, simply visit the course page and click the 'Enroll Now' button. Free courses are instantly accessible. For paid courses, you'll be guided through a secure checkout process. Once enrolled, the course appears in your dashboard under 'My Courses'.",
  },
  {
    category: "courses",
    q: "Can I access course content offline?",
    a: "Pro and Enterprise subscribers can download course videos for offline viewing through our mobile app. Free users can access content only with an internet connection.",
  },
  {
    category: "courses",
    q: "Is there a time limit to complete a course?",
    a: "No! Once you enroll in a course, you have lifetime access to it. Learn at your own pace without any time pressure.",
  },
  {
    category: "courses",
    q: "What languages are the courses available in?",
    a: "Most courses are available in English. We also have a growing library of courses in Hindi, Spanish, French, German, and Mandarin. You can filter courses by language on the browse page.",
  },
  {
    category: "account",
    q: "How do I reset my password?",
    a: "Click the 'Forgot Password' link on the login page, enter your registered email address, and we'll send you a password reset link. The link is valid for 1 hour.",
  },
  {
    category: "account",
    q: "Can I change my email address?",
    a: "Yes. Go to your Profile Settings and update your email under the 'Account Information' section. A confirmation email will be sent to your new address.",
  },
  {
    category: "account",
    q: "How do I delete my account?",
    a: "We're sorry to see you go! You can submit an account deletion request from your Account Settings. Note that this action is irreversible and all your progress and certificates will be permanently deleted.",
  },
  {
    category: "payments",
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, MasterCard, American Express), UPI, Net Banking, PayPal, and digital wallets. All transactions are secured with 256-bit SSL encryption.",
  },
  {
    category: "payments",
    q: "Can I get a refund?",
    a: "Yes, we offer a 30-day money-back guarantee on all paid courses. If you're not satisfied with a course, contact our support team within 30 days of purchase for a full refund.",
  },
  {
    category: "payments",
    q: "Is there a student discount?",
    a: "Yes! Students with a valid .edu email or institutional ID get 50% off all paid plans and courses. Reach out to our support team with your student credentials to claim the discount.",
  },
  {
    category: "certificates",
    q: "How do I earn a certificate?",
    a: "Complete all lessons and pass the final assessment with a score of 70% or higher to earn your course certificate. Certificates are only available for Pro and Enterprise subscribers.",
  },
  {
    category: "certificates",
    q: "Are the certificates verified?",
    a: "Yes! All EduLearn certificates have a unique verification ID and can be verified online through our certificate verification portal. They can also be added to your LinkedIn profile directly.",
  },
  {
    category: "certificates",
    q: "Can I re-download my certificate?",
    a: "Absolutely. All your earned certificates are stored permanently in your Certificates section in the student dashboard. You can download them as PDF at any time.",
  },
  {
    category: "technical",
    q: "Which browsers are supported?",
    a: "EduLearn works best on Chrome, Firefox, Safari, and Edge (latest versions). For the best experience, we recommend keeping your browser updated to the latest version.",
  },
  {
    category: "technical",
    q: "The video isn't playing. What should I do?",
    a: "Try refreshing the page, clearing your browser cache, or switching to a different browser. If the issue persists, disable any ad-blockers or VPN. Contact support if you're still experiencing problems.",
  },
  {
    category: "instructors",
    q: "How do I become an instructor?",
    a: "Visit our 'Become an Instructor' page and submit your application. Our team reviews all applications within 3-5 business days. Once approved, you'll get access to our course creation tools.",
  },
  {
    category: "instructors",
    q: "How much can I earn as an instructor?",
    a: "Instructors earn 70% of revenue from their courses. Top instructors on EduLearn earn $5,000–$50,000+ per month. Your earnings depend on your course quality, marketing, and the number of enrolled students.",
  },
  {
    category: "instructors",
    q: "What equipment do I need to create a course?",
    a: "At minimum, you need a reliable computer, a decent microphone for clear audio, and screen recording software. A webcam is optional but recommended. We provide detailed guidelines in our Instructor Resources section.",
  },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-800 pr-4">{faq.q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-blue-50/30">
          <p className="pt-4">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = FAQS.filter((faq) => {
    const matchCat = activeCategory === "all" || faq.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=60')] bg-cover bg-center opacity-5" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Find quick answers to the most common questions about EduLearn.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search your question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition"
            />
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-5xl">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((faq, i) => (
                <FAQItem key={i} faq={faq} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-medium">No results found</p>
              <p className="text-slate-400 text-sm mt-2">Try different keywords or browse all categories</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="mt-4 text-blue-600 text-sm font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Support options */}
      <section className="py-16 px-4 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-4xl text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Still have questions?</h2>
          <p className="text-slate-500">Our support team is here to help you.</p>
        </div>
        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: MessageSquare,
              title: "Live Chat",
              desc: "Chat with our support team in real-time.",
              cta: "Start Chat",
              href: "#chat",
              color: "bg-green-100 text-green-600",
            },
            {
              icon: Mail,
              title: "Email Support",
              desc: "Send us an email and hear back within 24h.",
              cta: "Send Email",
              href: "/contact",
              color: "bg-blue-100 text-blue-600",
            },
            {
              icon: BookOpen,
              title: "Help Docs",
              desc: "Browse our extensive knowledge base.",
              cta: "Read Docs",
              href: "#docs",
              color: "bg-violet-100 text-violet-600",
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#F8FAFC] rounded-2xl p-6 text-center border border-slate-200">
              <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm mb-4">{item.desc}</p>
              <Link
                href={item.href}
                className="inline-flex items-center text-blue-600 text-sm font-semibold hover:underline"
              >
                {item.cta} <ChevronDown className="w-4 h-4 ml-1 -rotate-90" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
