import Link from "next/link";
import {
  Mic,
  TrendingUp,
  DollarSign,
  Users,
  Video,
  CheckCircle,
  Star,
  ArrowRight,
  BookOpen,
  Award,
  Globe2,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Become an Instructor | EduLearn",
  description:
    "Share your knowledge and earn money by teaching on EduLearn. Join 500+ instructors reaching 50,000+ students worldwide.",
};

const STEPS = [
  {
    num: "01",
    title: "Apply & Get Approved",
    desc: "Submit your application with your expertise and teaching experience. Our team reviews all applications within 3–5 business days.",
  },
  {
    num: "02",
    title: "Create Your Course",
    desc: "Use our intuitive course builder to create high-quality video lessons, quizzes, assignments, and resources.",
  },
  {
    num: "03",
    title: "Publish & Promote",
    desc: "Launch your course to our audience of 50,000+ active learners. We handle SEO, marketing, and student support.",
  },
  {
    num: "04",
    title: "Earn & Grow",
    desc: "Earn 70% of every enrollment. Track analytics, respond to students, and build your reputation as an expert.",
  },
];

const BENEFITS = [
  {
    icon: DollarSign,
    title: "Earn 70% Revenue Share",
    desc: "Keep 70% of every course sale. Top instructors earn $5,000–$50,000+ per month on EduLearn.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Users,
    title: "Reach 50,000+ Students",
    desc: "Instantly reach a global audience of motivated learners across 120+ countries.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Brand",
    desc: "Build credibility, gain reviews, and establish yourself as a thought leader in your field.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Video,
    title: "Easy Course Creation",
    desc: "Our intuitive platform makes it easy to upload videos, create quizzes, and manage your students.",
    color: "from-orange-500 to-red-500",
  },
];

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    role: "Full-Stack Developer",
    avatar: "RK",
    rating: 5,
    quote:
      "I started teaching on EduLearn 18 months ago with zero students. Today, I have 12,000 enrolled students and earn $8,000/month passively. It's completely changed my life.",
    stats: "12,000 students · $8K/month",
  },
  {
    name: "Priya Sharma",
    role: "UX Designer",
    avatar: "PS",
    rating: 5,
    quote:
      "The course creation tools are incredibly intuitive. I published my first course in 2 weeks and had 500 students within the first month. EduLearn's marketing is truly powerful.",
    stats: "8,500 students · $5K/month",
  },
  {
    name: "Ahmed Hassan",
    role: "Data Scientist",
    avatar: "AH",
    rating: 5,
    quote:
      "What I love most is the student engagement. The Q&A section and assignments keep students motivated. My courses have a 94% completion rate — best in the industry.",
    stats: "15,000 students · $11K/month",
  },
];

const REQUIREMENTS = [
  "Expertise in your subject area (no formal qualifications required)",
  "Ability to explain concepts clearly and engagingly",
  "Access to a computer with a decent microphone for audio",
  "Commitment to creating at least 60 minutes of video content",
  "Responsiveness to student questions and feedback",
];

export default function BecomeInstructorPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 py-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=60&auto=format&fit=crop')] bg-cover bg-center opacity-8" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Join 500+ Expert Instructors
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
              Teach What You Know.{" "}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Earn What You Deserve.
              </span>
            </h1>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Share your expertise with 50,000+ learners across the globe. Build passive income,
              grow your personal brand, and make a real impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/register?role=instructor"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold px-7 py-3.5 rounded-2xl shadow-lg shadow-violet-500/30 hover:opacity-90 transition"
              >
                Start Teaching Today <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-2xl border border-white/20 transition"
              >
                See How It Works
              </a>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-4">
            {[
              { label: "Active Students", value: "50K+", icon: Users },
              { label: "Avg Monthly Earnings", value: "$4,200", icon: DollarSign },
              { label: "Courses Published", value: "2,500+", icon: BookOpen },
              { label: "Countries Reached", value: "120+", icon: Globe2 },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
                <item.icon className="w-6 h-6 text-violet-300 mx-auto mb-2" />
                <p className="text-2xl font-extrabold text-white">{item.value}</p>
                <p className="text-slate-400 text-xs mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Why Teach on EduLearn?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Join a community of educators who are building sustainable income while changing lives.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {BENEFITS.map((b, i) => (
              <div key={i} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex gap-5 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center flex-shrink-0`}>
                  <b.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{b.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-500">From application to earning — here&apos;s the journey</p>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 to-blue-500 hidden md:block" />
            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30 z-10">
                    <span className="text-white text-xs font-bold">{step.num}</span>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-2xl p-6 flex-1 border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 to-indigo-950">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Hear From Our Instructors</h2>
            <p className="text-slate-400">Real stories from real instructors who transformed their careers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-violet-300 font-medium">
                  {t.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What You Need to Get Started</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              You don&apos;t need a degree or formal teaching experience. What you do need is expertise
              and a passion for sharing knowledge.
            </p>
            <ul className="space-y-4">
              {REQUIREMENTS.map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">{req}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-3xl p-8 border border-violet-100">
            <Mic className="w-10 h-10 text-violet-500 mb-5" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Ready to Apply?</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Join our growing community of instructors. Applications are reviewed within 3–5
              business days. We&apos;ll set up a welcome call to help you get started.
            </p>
            <Link
              href="/auth/register?role=instructor"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-violet-500/30 hover:opacity-90 transition"
            >
              Apply to Teach <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-slate-400 text-xs text-center mt-4">Free to apply · No obligations</p>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-violet-600 to-blue-600">
        <div className="mx-auto max-w-3xl text-center">
          <Award className="w-10 h-10 text-white/70 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">
            Start Teaching on EduLearn Today
          </h2>
          <p className="text-violet-200 mb-8">
            Join 500+ instructors and start building your passive income stream.
          </p>
          <Link
            href="/auth/register?role=instructor"
            className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-violet-50 transition shadow-xl"
          >
            Get Started — It&apos;s Free <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
