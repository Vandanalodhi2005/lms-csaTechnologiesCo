import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Users,
  GraduationCap,
  BookOpen,
  Star,
  Sparkles,
  PlayCircle,
} from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Badge from "@/components/ui/Badge.jsx";
import StatItem from "@/components/ui/StatItem.jsx";
import CourseCard from "@/components/courses/CourseCard.jsx";
import HeroSearch from "@/components/forms/HeroSearch.jsx";
import { HOME_COURSES, HOME_STATS } from "@/constants/homeCourses";

export const metadata = {
  title: "EduLearn — Learn New Skills With Expert-Led Online Courses",
  description:
    "Learn practical skills with expert-led online courses in development, design, business, marketing, and more.",
  keywords: [
    "online courses",
    "EduLearn",
    "learn coding",
    "online learning platform",
    "skill development",
    "certification",
  ],
  openGraph: {
    title: "EduLearn — Learn New Skills With Expert-Led Online Courses",
    description:
      "Learn practical skills with expert-led online courses in development, design, business, marketing, and more.",
    url: "/",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EduLearn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduLearn — Learn New Skills With Expert-Led Online Courses",
    description:
      "Learn practical skills with expert-led online courses in development, design, business, marketing, and more.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "/" },
};

const HERO_BG =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=2000&q=80&auto=format&fit=crop";

const HERO_PERSON =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&auto=format&fit=crop";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section with background image */}
      <section className="relative overflow-hidden isolate">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage: `url(${HERO_BG})`,
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(15,47,95,0.88) 0%, rgba(15,47,95,0.78) 45%, rgba(20,55,110,0.55) 75%, rgba(37,99,235,0.35) 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -top-40 -right-20 w-[520px] h-[520px] rounded-full bg-[#2563EB]/20 blur-3xl -z-10"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-20 w-[480px] h-[480px] rounded-full bg-emerald-400/15 blur-3xl -z-10"
          aria-hidden="true"
        />

        <div className="container-page py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero text */}
            <div className="space-y-7 order-2 lg:order-1">
              <Badge
                variant="default"
                size="default"
                className="px-4 py-1.5 text-sm font-medium gap-2 bg-white/10 backdrop-blur text-white border-white/20"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                Learn • Build • Grow
              </Badge>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
                  Upgrade Your Skills
                  <br />
                  <span className="text-[#60A5FA]">With Our Online Courses</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-200 max-w-xl leading-relaxed">
                  Get access to high-quality courses from expert instructors and
                  build valuable skills at your own pace.
                </p>
              </div>

              <HeroSearch />

              <div className="flex flex-wrap gap-x-8 gap-y-4 pt-2 text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[#60A5FA]" aria-hidden="true" />
                  <span>Expert-led instruction</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <span>Learn at your own pace</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                  <span>Access from anywhere</span>
                </div>
              </div>
            </div>

            {/* Hero image card */}
            <div className="relative order-1 lg:order-2 mx-auto w-full max-w-lg">
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 w-44 z-10 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] font-medium">Courses</p>
                    <p className="text-xl font-bold text-[#0F172A]">1.2K+</p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                <div className="relative aspect-[4/5] sm:aspect-[5/6] w-full">
                  <Image
                    src={HERO_PERSON}
                    alt="Student learning online with a laptop"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#0F2F5F]/50 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                      <PlayCircle className="h-6 w-6 text-[#2563EB] fill-[#2563EB]/20" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0F172A] truncate">
                        Intro to Learning
                      </p>
                      <p className="text-sm text-[#64748B]">Preview • 3 min</p>
                    </div>
                    <Badge variant="success" size="sm" className="text-xs shrink-0">
                      FREE
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-white rounded-2xl shadow-xl p-4 w-48 z-10 hidden sm:block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] font-medium">Rated</p>
                    <p className="text-xl font-bold text-[#0F172A]">4.8/5</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 text-amber-400 fill-amber-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section aria-label="Platform statistics" className="border-y border-[#E2E8F0] bg-white">
        <div className="container-page py-10 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6">
            {HOME_STATS.map((s) => (
              <StatItem
                key={s.label}
                value={s.value}
                label={s.label}
                icon={
                  s.label === "Active Students"
                    ? Users
                    : s.label === "Expert Instructors"
                    ? GraduationCap
                    : s.label === "Online Courses"
                    ? BookOpen
                    : Star
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section aria-labelledby="popular-courses-heading" className="py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <Badge variant="outline" className="mb-3">
                Trending
              </Badge>
              <h2
                id="popular-courses-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A]"
              >
                Popular Courses
              </h2>
              <p className="text-[#64748B] mt-3 text-base sm:text-lg max-w-xl">
                Hand-picked courses loved by thousands of learners worldwide.
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors shrink-0 self-start sm:self-auto"
            >
              View All
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {HOME_COURSES.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                variant="home"
                showWishlist={false}
                showInstructor
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta-heading">
        <div className="container-page pb-16 sm:pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2F5F] via-[#1e3a8a] to-[#2563EB] p-8 sm:p-12 lg:p-16 shadow-2xl shadow-[#2563EB]/20">
            <div
              className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl"
              aria-hidden="true"
            />

            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <h2
                  id="cta-heading"
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight"
                >
                  Ready to Start Learning?
                </h2>
                <p className="text-base sm:text-lg text-slate-200 max-w-lg leading-relaxed">
                  Explore courses, build new skills, and grow your career.
                  Join thousands of learners already on their journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 px-8 bg-white text-[#0F2F5F] hover:bg-slate-100 font-semibold shadow-lg"
                  >
                    <Link href="/courses">
                      Explore Courses
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link href="/auth/register">Get Started Free</Link>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-md lg:ml-auto">
                {[
                  { icon: BookOpen, label: "1,200+ Courses" },
                  { icon: Users, label: "10,000+ Students" },
                  { icon: GraduationCap, label: "Verified Certs" },
                  { icon: Star, label: "4.8/5 Rated" },
                ].map((it) => (
                  <div
                    key={it.label}
                    className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/15"
                  >
                    <it.icon className="h-8 w-8 text-amber-300 mb-3" aria-hidden="true" />
                    <p className="text-white font-semibold">{it.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
