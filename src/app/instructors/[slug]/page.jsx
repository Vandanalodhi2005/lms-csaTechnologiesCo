import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Globe2,
  GraduationCap,
  MapPin,
  Quote,
  Star,
  Users,
} from "lucide-react";
import Header from "@/components/layout/Header.jsx";
import Footer from "@/components/layout/Footer.jsx";
import CourseCard from "@/components/courses/CourseCard.jsx";
import InstructorCard from "@/components/instructors/InstructorCard.jsx";
import InstructorShareButton from "@/components/instructors/InstructorShareButton.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import Button from "@/components/ui/Button.jsx";
import { instructors } from "@/constants/instructors.js";
import COURSES from "@/constants/courses.js";

function formatCompactNumber(value) {
  if (!Number.isFinite(value)) return "0";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, "")}K`;
  return value.toString();
}

function findInstructor(slug) {
  if (!slug) return null;

  const normalized = String(slug).trim();

  return (
    instructors.find(
      (instructor) =>
        instructor.slug === normalized ||
        instructor.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalized
    ) || null
  );
}

function findInstructorCourses(instructor) {
  if (!instructor) return [];

  const byName = COURSES.filter(
    (course) =>
      course.instructor === instructor.name ||
      course.instructorId?.name === instructor.name ||
      course.instructorId?.slug === instructor.slug
  );

  if (byName.length > 0) return byName;

  return COURSES.filter((course) => course.category === instructor.category).slice(0, 6);
}

export async function generateMetadata({ params }) {
  const instructor = findInstructor(params?.slug);

  if (!instructor) {
    return {
      title: "Instructor Not Found | EduLearn",
      description: "The requested instructor profile could not be found.",
    };
  }

  return {
    title: `${instructor.name} | EduLearn Instructor`,
    description: `Learn from ${instructor.name}, an expert ${instructor.category.toLowerCase()} instructor on EduLearn.`,
    keywords: [instructor.name, instructor.role, instructor.category, "EduLearn"],
  };
}

export default async function InstructorProfilePage({ params }) {
  const instructor = findInstructor(params?.slug);

  if (!instructor) {
    notFound();
  }

  const instructorCourses = findInstructorCourses(instructor);
  const relatedInstructors = instructors
    .filter((person) => person.slug !== instructor.slug && person.category === instructor.category)
    .slice(0, 3);

  const courseAverageRating =
    instructorCourses.length > 0
      ? (
          instructorCourses.reduce((sum, course) => sum + Number(course.rating || 0), 0) /
          instructorCourses.length
        ).toFixed(1)
      : "0.0";

  const stats = [
    { label: "Students", value: formatCompactNumber(instructor.studentCount), icon: Users },
    { label: "Courses", value: String(instructorCourses.length || instructor.courseCount), icon: BookOpen },
    { label: "Rating", value: `${instructor.rating.toFixed(1)}`, icon: Star },
    { label: "Experience", value: instructor.experience, icon: Clock3 },
  ];

  const reviewCards = instructorCourses
    .flatMap((course) =>
      (course.reviews || []).slice(0, 1).map((review) => ({
        courseTitle: course.title,
        review,
      }))
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="container-page py-8 md:py-10 xl:py-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <li>
              <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-[#2563EB]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/instructors" className="transition-colors hover:text-[#2563EB]">
                Instructors
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-slate-700">
              {instructor.name}
            </li>
          </ol>
        </nav>

        <section className="rounded-[32px] border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <Avatar
                src={instructor.avatar}
                alt={`${instructor.name} profile photo`}
                name={instructor.name}
                size="4xl"
                className="ring-4 ring-[#EFF6FF]"
              />

              <div className="max-w-2xl">
                <div className="inline-flex items-center rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1D4ED8]">
                  {instructor.category}
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0F172A] md:text-4xl">
                  {instructor.name}
                </h1>

                <p className="mt-2 text-lg font-medium text-[#2563EB]">{instructor.role}</p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#475569]">
                  <span className="inline-flex items-center gap-2">
                    <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
                    {instructor.rating.toFixed(1)} Instructor rating
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                    {formatCompactNumber(instructor.studentCount)} students
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                    {instructor.courseCount} courses
                  </span>
                </div>

                <p className="mt-4 max-w-2xl text-base leading-7 text-[#475569]">{instructor.bio}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild size="lg" className="h-11 rounded-xl bg-[#0F2F5F] text-white hover:bg-[#143A72]">
                <Link href="#instructor-courses">View Courses</Link>
              </Button>
              <InstructorShareButton name={instructor.name} slug={instructor.slug} />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <p className="mt-3 text-2xl font-bold tracking-tight text-[#0F172A]">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <Quote className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">About the instructor</h2>
            </div>

            <p className="mt-5 text-base leading-7 text-[#475569]">{instructor.bio}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex items-center gap-3 text-[#0F172A]">
                  <MapPin className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                  <span className="text-sm font-medium">{instructor.location}</span>
                </div>
                <div className="flex items-center gap-3 text-[#0F172A]">
                  <Clock3 className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                  <span className="text-sm font-medium">{instructor.experience} experience</span>
                </div>
                <div className="flex items-center gap-3 text-[#0F172A]">
                  <BookOpen className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                  <span className="text-sm font-medium">{instructor.teachingExperience} teaching experience</span>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex items-center gap-3 text-[#0F172A]">
                  <GraduationCap className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                  <span className="text-sm font-medium">{instructor.education[0]}</span>
                </div>
                <div className="flex items-center gap-3 text-[#0F172A]">
                  <Globe2 className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                  <span className="text-sm font-medium">{instructor.languages.join(" / ")}</span>
                </div>
                <div className="flex items-center gap-3 text-[#0F172A]">
                  <BriefcaseBusiness className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                  <span className="text-sm font-medium">{instructor.company}</span>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">Expertise</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {instructor.expertise.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm font-medium text-[#334155]"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-[#0F2F5F] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Course average</p>
              <div className="mt-3 flex items-center gap-2 text-3xl font-bold tracking-tight">
                <Star className="h-6 w-6 fill-[#FBBF24] text-[#FBBF24]" aria-hidden="true" />
                {courseAverageRating}
              </div>
              <p className="mt-2 text-sm text-slate-200">Across {instructorCourses.length} featured courses</p>
            </div>
          </aside>
        </div>

        <section className="mt-8 rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#16A34A]">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">Why students learn from {instructor.name}</h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {instructor.highlights.map((highlight) => (
              <div key={highlight} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <CheckCircle2 className="h-5 w-5 text-[#16A34A]" aria-hidden="true" />
                <p className="mt-3 text-sm leading-6 text-[#475569]">{highlight}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="instructor-courses" className="mt-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Featured courses</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A]">{instructor.name}&rsquo;s courses</h2>
            </div>

            <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]">
              Browse more courses
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {instructorCourses.slice(0, 6).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Student feedback</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A]">Reviews</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {reviewCards.length > 0 ? (
              reviewCards.map(({ courseTitle, review }) => (
                <article key={`${courseTitle}-${review.id}`} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{courseTitle}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#F59E0B]">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={`${courseTitle}-${index}`}
                          className={`h-4 w-4 ${index < review.rating ? "fill-current" : "text-slate-300"}`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-[#475569]">“{review.comment}”</p>

                  <div className="mt-4 flex items-center justify-between pt-4 text-sm text-[#64748B]">
                    <span>{review.author}</span>
                    <span>{new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-sm text-[#64748B] lg:col-span-2">
                There are no reviews for this instructor yet. Be the first to share your learning experience.
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">More instructors</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A]">Explore similar mentors</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedInstructors.map((person) => (
              <InstructorCard key={person.id} instructor={person} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
