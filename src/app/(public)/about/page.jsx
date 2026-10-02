import Link from "next/link";
import {
  Target,
  Lightbulb,
  Users,
  Heart,
  Rocket,
  BookOpen,
  Award,
  Globe2,
  ArrowRight,
  Linkedin,
  Twitter,
  Github,
  ShieldCheck,
  Sparkles,
  Handshake,
} from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Avatar, AvatarFallback } from "@/components/ui";

const STATS = [
  { value: "50K+", label: "Students Worldwide", icon: Users },
  { value: "500+", label: "Expert Instructors", icon: Award },
  { value: "2,500+", label: "Courses Available", icon: BookOpen },
  { value: "120+", label: "Countries Reached", icon: Globe2 },
];

const STORY = [
  {
    year: "2020",
    title: "The Beginning",
    description:
      "LearnHub started with a simple idea — that quality education should be accessible to everyone, everywhere. Three friends came together to build a platform that would break down barriers to learning.",
  },
  {
    year: "2021",
    title: "First 10,000 Students",
    description:
      "Within a year, we grew to serve 10,000 students across 40 countries. We partnered with industry professionals to launch our first batch of 100+ courses in tech, design, and business.",
  },
  {
    year: "2023",
    title: "Enterprise & Certifications",
    description:
      "We launched verified certificates and enterprise learning solutions. Fortune 500 companies started using LearnHub to upskill their teams, and we became a trusted name in corporate training.",
  },
  {
    year: "2025",
    title: "Global Impact",
    description:
      "Today, LearnHub is a thriving community of 50,000+ learners and 500+ instructors. We continue to innovate with AI-powered learning paths, hands-on labs, and personalized mentorship.",
  },
];

const VALUES = [
  {
    icon: Sparkles,
    title: "Innovation First",
    description:
      "We embrace new technologies and pedagogies to deliver the most effective learning experience possible. Our platform evolves as fast as the skills you need.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description:
      "Every course is rigorously vetted and updated. We work only with verified industry experts so you learn current, practical skills that matter in the real world.",
  },
  {
    icon: Users,
    title: "Learner Community",
    description:
      "Learning is better together. We foster a supportive global community where students collaborate, share, and grow alongside peers and instructors.",
  },
  {
    icon: Handshake,
    title: "Accessible for All",
    description:
      "From scholarships to affordable pricing, we're committed to removing financial barriers. Everyone deserves the chance to build the career of their dreams.",
  },
];

const TEAM = [
  {
    name: "Sarah Mitchell",
    title: "Chief Executive Officer",
    bio: "Former VP of Learning at a Fortune 500. 15+ years building educational products that scale. Passionate about lifelong learning.",
    avatar: "SM",
    socials: [
      { icon: Linkedin, href: "#" },
      { icon: Twitter, href: "#" },
    ],
  },
  {
    name: "David Okafor",
    title: "Chief Technology Officer",
    bio: "Previously led platform engineering at a unicorn edtech. Built systems serving millions. Believes in building what learners actually need.",
    avatar: "DO",
    socials: [
      { icon: Linkedin, href: "#" },
      { icon: Github, href: "#" },
      { icon: Twitter, href: "#" },
    ],
  },
  {
    name: "Dr. Elena Rodriguez",
    title: "Head of Education",
    bio: "PhD in Educational Psychology. Designed curricula used by 200+ universities. Obsessed with the science of how people learn best.",
    avatar: "ER",
    socials: [
      { icon: Linkedin, href: "#" },
      { icon: Twitter, href: "#" },
    ],
  },
];

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata = {
  title: "About Us",
  description:
    "LearnHub is on a mission to make world-class education accessible to everyone. Meet the team, learn our story, and discover the values that drive us.",
  keywords:
    "about learnhub, our story, learning platform, education mission, meet the team, edtech company",
  openGraph: {
    title: "About Us | LearnHub",
    description:
      "LearnHub is on a mission to make world-class education accessible to everyone. Learn our story and meet the team.",
    url: `${baseUrl}/about`,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "About LearnHub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | LearnHub",
    description:
      "LearnHub is on a mission to make world-class education accessible to everyone.",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: `${baseUrl}/about` },
};

export default function AboutPage() {
  return (
    <div className="w-full">
      <section className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 via-transparent to-[#16A34A]/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#2563EB]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#F59E0B]/10 rounded-full blur-3xl" />

        <div className="relative container-page py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-5 px-4 py-1.5">
              <Heart className="h-3.5 w-3.5 mr-1.5 text-[#DC2626]" />
              About LearnHub
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F172A] leading-[1.1]">
              Empowering learners to
              <span className="block text-[#2563EB] mt-2">change their lives.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#0F172A]/70 mt-6 max-w-2xl mx-auto leading-relaxed">
              We&apos;re building the most trusted learning platform for in-demand skills.
              Our mission is simple: deliver extraordinary education that actually transforms careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button asChild size="lg" className="h-12 px-8 bg-[#2563EB] hover:bg-[#2563EB]/90">
                <Link href="/courses">
                  Browse Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 border-[#0F172A]/20">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="container-page py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center flex flex-col items-center">
                <div className="h-14 w-14 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center mb-4">
                  <s.icon className="h-7 w-7 text-[#2563EB]" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-[#0F172A]">{s.value}</p>
                <p className="text-sm md:text-base text-[#0F172A]/60 mt-2 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <Rocket className="h-3.5 w-3.5 mr-1.5 text-[#16A34A]" />
              Our Story
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
              From small idea to global community
            </h2>
            <p className="text-[#0F172A]/60 mt-4 text-lg">
              Four years of relentless focus on what matters most — our learners.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2563EB] via-[#16A34A] to-[#F59E0B]" />

            <div className="space-y-12">
              {STORY.map((item, idx) => (
                <div
                  key={item.year}
                  className={`relative flex gap-6 md:gap-12 items-start ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white border-4 border-[#2563EB] shadow-lg z-10">
                    <span className="text-xs font-bold text-[#2563EB]">{idx + 1}</span>
                  </div>

                  <div className={`ml-16 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <Card className="border-[#0F172A]/10 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <Badge variant="secondary" className="mb-3">
                          {item.year}
                        </Badge>
                        <h3 className="text-xl font-bold text-[#0F172A] mb-2">{item.title}</h3>
                        <p className="text-[#0F172A]/65 leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50 border-y border-gray-200">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <Target className="h-3.5 w-3.5 mr-1.5 text-[#F59E0B]" />
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
              Principles that guide everything
            </h2>
            <p className="text-[#0F172A]/60 mt-4 text-lg">
              The values that shape every decision, from course curation to customer support.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <Card key={v.title} hoverable className="h-full border-[#0F172A]/10">
                <CardHeader>
                  <div className="h-14 w-14 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center mb-2">
                    <v.icon className="h-7 w-7 text-[#2563EB]" />
                  </div>
                  <CardTitle className="text-xl text-[#0F172A]">{v.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#0F172A]/65 leading-relaxed text-base">{v.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <Users className="h-3.5 w-3.5 mr-1.5 text-[#DC2626]" />
              Leadership Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
              The people behind LearnHub
            </h2>
            <p className="text-[#0F172A]/60 mt-4 text-lg">
              Meet the leaders building the future of education, one course at a time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TEAM.map((m) => (
              <Card key={m.name} className="h-full border-[#0F172A]/10 overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-[#2563EB]/20 via-[#16A34A]/10 to-[#F59E0B]/20" />
                <CardContent className="pt-0 -mt-12">
                  <div className="flex items-end gap-4 mb-4">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                      <AvatarFallback className="text-2xl font-bold bg-[#2563EB] text-white">
                        {m.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2 pb-2">
                      {m.socials.map((s, i) => (
                        <a
                          key={i}
                          href={s.href}
                          className="h-9 w-9 rounded-lg border border-[#0F172A]/10 flex items-center justify-center text-[#0F172A]/50 hover:text-[#2563EB] hover:border-[#2563EB]/30 transition-colors"
                        >
                          <s.icon className="h-4 w-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A]">{m.name}</h3>
                  <p className="text-sm font-medium text-[#2563EB] mt-1">{m.title}</p>
                  <p className="text-[#0F172A]/60 mt-4 leading-relaxed">{m.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2563EB] via-blue-700 to-indigo-800 p-10 md:p-16 shadow-2xl shadow-[#2563EB]/30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F59E0B]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                Join us on this journey
              </h2>
              <p className="text-white/85 text-lg mt-5 max-w-xl mx-auto">
                Whether you&apos;re here to learn, teach, or partner with us — we&apos;d love to have you.
                Create your free account and see what LearnHub can do for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 text-base bg-white text-[#2563EB] hover:bg-white/90 font-semibold shadow-lg"
                >
                  <Link href="/auth/register">
                    Create free account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base border-white/40 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/contact">Contact us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
