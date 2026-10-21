"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Zap,
  Star,
  Crown,
  ArrowRight,
  Sparkles,
  Users,
  BookOpen,
  Award,
  Shield,
  Headphones,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    icon: BookOpen,
    price: { monthly: 0, yearly: 0 },
    color: "from-slate-500 to-slate-600",
    badge: null,
    description: "Perfect for exploring and getting started with online learning.",
    features: [
      { text: "Access to 50+ free courses", included: true },
      { text: "Basic course player", included: true },
      { text: "Community forum access", included: true },
      { text: "Mobile app access", included: true },
      { text: "Course certificates", included: false },
      { text: "Downloadable resources", included: false },
      { text: "Offline viewing", included: false },
      { text: "Priority support", included: false },
      { text: "Live Q&A sessions", included: false },
      { text: "Mentorship access", included: false },
    ],
    cta: "Get Started Free",
    ctaHref: "/auth/register",
  },
  {
    id: "pro",
    name: "Pro",
    icon: Zap,
    price: { monthly: 29, yearly: 19 },
    color: "from-blue-500 to-indigo-600",
    badge: "Most Popular",
    description: "Ideal for dedicated learners who want full access to quality content.",
    features: [
      { text: "Unlimited course access", included: true },
      { text: "Advanced course player", included: true },
      { text: "Community forum access", included: true },
      { text: "Mobile app access", included: true },
      { text: "Course certificates", included: true },
      { text: "Downloadable resources", included: true },
      { text: "Offline viewing", included: true },
      { text: "Priority support", included: true },
      { text: "Live Q&A sessions", included: false },
      { text: "Mentorship access", included: false },
    ],
    cta: "Start Pro Trial",
    ctaHref: "/auth/register?plan=pro",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Crown,
    price: { monthly: 79, yearly: 59 },
    color: "from-violet-500 to-purple-600",
    badge: "Best Value",
    description: "The complete learning experience with mentorship and live sessions.",
    features: [
      { text: "Unlimited course access", included: true },
      { text: "Advanced course player", included: true },
      { text: "Community forum access", included: true },
      { text: "Mobile app access", included: true },
      { text: "Course certificates", included: true },
      { text: "Downloadable resources", included: true },
      { text: "Offline viewing", included: true },
      { text: "Priority support", included: true },
      { text: "Live Q&A sessions", included: true },
      { text: "Mentorship access", included: true },
    ],
    cta: "Start Enterprise Trial",
    ctaHref: "/auth/register?plan=enterprise",
  },
];

const FAQS = [
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel your subscription at any time. Your access will continue until the end of the billing period, and you won't be charged again.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes! Both Pro and Enterprise plans come with a 7-day free trial. No credit card required to start.",
  },
  {
    q: "Do I get a certificate for every course?",
    a: "Certificates are available for Pro and Enterprise subscribers. You'll receive a verified digital certificate upon completing any course.",
  },
  {
    q: "Can I switch plans later?",
    a: "Absolutely. You can upgrade or downgrade your plan at any time. If you upgrade mid-cycle, you'll only pay the difference.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, MasterCard, Amex), UPI, Net Banking, and PayPal.",
  },
  {
    q: "Is there a student discount?",
    a: "Yes! Students with a valid .edu email address or student ID get 50% off all paid plans. Contact support to claim the discount.",
  },
];

const COMPARISON_FEATURES = [
  { name: "Free Courses", free: "50+", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Certificates", free: "—", pro: "✓", enterprise: "✓" },
  { name: "Offline Access", free: "—", pro: "✓", enterprise: "✓" },
  { name: "Downloads", free: "—", pro: "✓", enterprise: "✓" },
  { name: "Live Q&A", free: "—", pro: "—", enterprise: "✓" },
  { name: "Mentorship", free: "—", pro: "—", enterprise: "✓" },
  { name: "Support", free: "Community", pro: "Priority", enterprise: "Dedicated" },
  { name: "Team Features", free: "—", pro: "—", enterprise: "✓" },
];

function FAQAccordion({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-800">{faq.q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed bg-white border-t border-slate-100">
          <p className="pt-3">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 pt-20 pb-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=60&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight">
            Invest in Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Future
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Choose a plan that works for your learning goals. Start free, upgrade when ready.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-1.5">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                !isYearly ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                isYearly ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                Save 35%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="relative -mt-10 pb-20 px-4">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const price = isYearly ? plan.price.yearly : plan.price.monthly;
            const isPro = plan.id === "pro";
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl shadow-xl border-2 p-8 flex flex-col transition-transform hover:-translate-y-1 ${
                  isPro ? "border-blue-500 ring-4 ring-blue-500/10" : "border-slate-200"
                }`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.color} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-5`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h2>
                <p className="text-slate-500 text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-slate-900">
                    {price === 0 ? "Free" : `$${price}`}
                  </span>
                  {price > 0 && (
                    <span className="text-slate-400 text-sm ml-2">
                      / {isYearly ? "mo, billed yearly" : "month"}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {f.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${f.included ? "text-slate-700" : "text-slate-400"}`}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`w-full text-center py-3.5 rounded-2xl font-semibold text-sm transition-all ${
                    isPro
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-blue-500/30"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Compare Plans</h2>
            <p className="text-slate-500">See exactly what you get with each plan</p>
          </div>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.id} className="py-4 px-6 font-semibold text-slate-700 text-center">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="py-3.5 px-6 text-slate-700 font-medium">{row.name}</td>
                    <td className="py-3.5 px-6 text-center text-slate-500">{row.free}</td>
                    <td className="py-3.5 px-6 text-center text-blue-600 font-medium">{row.pro}</td>
                    <td className="py-3.5 px-6 text-center text-violet-600 font-medium">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Why Students Love EduLearn</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "50,000+", desc: "Active Learners" },
              { icon: BookOpen, title: "2,500+", desc: "Courses Available" },
              { icon: Award, title: "98%", desc: "Completion Rate" },
              { icon: Star, title: "4.9/5", desc: "Average Rating" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-white">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900">{item.title}</p>
                <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-500">Got questions? We&apos;ve got answers.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQAccordion key={i} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 to-blue-950">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Join 50,000+ students already growing with EduLearn. No commitment required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors shadow-lg shadow-blue-500/30"
            >
              Start for Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-2xl border border-white/20 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-5">
            <Shield className="w-4 h-4 inline mr-1" />
            7-day free trial · No credit card required · Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
