import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, Home, BookOpen } from "lucide-react";
import { COURSES } from "@/constants/courses.js";
import CourseHero from "@/components/courses/CourseHero.jsx";
import CourseLearningOutcomes from "@/components/courses/CourseLearningOutcomes.jsx";
import CourseRequirements from "@/components/courses/CourseRequirements.jsx";
import CourseDescription from "@/components/courses/CourseDescription.jsx";
import CourseCurriculum from "@/components/courses/CourseCurriculum.jsx";
import CourseInstructor from "@/components/courses/CourseInstructor.jsx";
import CourseReviews from "@/components/courses/CourseReviews.jsx";
import RelatedCourses from "@/components/courses/RelatedCourses.jsx";
import CourseEnrollmentCard from "@/components/courses/CourseEnrollmentCard.jsx";
import { cn } from "@/utils";

function findCourse(slug) {
  if (!slug) return null;
  const normalized = String(slug);
  return (
    COURSES.find(
      (c) =>
        c.slug === normalized ||
        (c._id && c._id === normalized) ||
        (c.id && c.id === normalized)
    ) || null
  );
}

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  const course = findCourse(slug);

  const title = course ? `${course.title} | EduLearn` : "Course Not Found | EduLearn";
  const description = course
    ? course.shortDescription ||
      (Array.isArray(course.description) && course.description[0]) ||
      `Learn ${course.title} on EduLearn.`
    : "This course could not be found on EduLearn.";

  const thumbnail = course?.thumbnail;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "en_US",
      siteName: "EduLearn",
      url: `/courses/${slug}`,
      images: thumbnail
        ? [{ url: thumbnail, width: 1200, height: 630, alt: course.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: thumbnail ? [thumbnail] : undefined,
    },
  };
}

export default async function CourseDetailPage({ params }) {
  const slug = params?.slug;
  const course = findCourse(slug);

  if (!course) {
    notFound();
  }

  const categoryName = course.categoryId?.name || course.category;

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">
        <Breadcrumbs courseTitle={course.title} categoryName={categoryName} />

        <div className="grid grid-cols-1 gap-6 lg:gap-8 items-start">
          <div className="space-y-6 lg:space-y-8">
            <CourseHero course={course} />
            <CoursePreviewThumbnail course={course} />
          </div>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-6 lg:gap-8 items-start",
            "lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]"
          )}
        >
          <div className="min-w-0 space-y-8 sm:space-y-10 order-2 lg:order-1">
            <CourseLearningOutcomes outcomes={course.learningOutcomes} />
            <CourseRequirements requirements={course.requirements} />
            <CourseDescription description={course.description} />
            <CourseCurriculum curriculum={course.curriculum} />
            <CourseInstructor course={course} />
            <CourseReviews course={course} />
            <div className="pt-2">
              <RelatedCourses currentCourse={course} allCourses={COURSES} limit={3} />
            </div>
          </div>

          <div className="order-1 lg:order-2 w-full lg:sticky lg:top-24 lg:z-10">
            <CourseEnrollmentCard course={course} />
          </div>
        </div>
      </div>
    </main>
  );
}

function Breadcrumbs({ courseTitle, categoryName }) {
  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol
        role="list"
        className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[#64748B]"
      >
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-[#2563EB] transition-colors"
          >
            <Home className="h-3.5 w-3.5" aria-hidden />
            <span>Home</span>
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="h-3.5 w-3.5 text-[#CBD5E1]" />
        </li>
        <li>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 hover:text-[#2563EB] transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            <span>Courses</span>
          </Link>
        </li>
        {categoryName ? (
          <>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5 text-[#CBD5E1]" />
            </li>
            <li aria-current="false" className="text-[#475569]">
              {categoryName}
            </li>
          </>
        ) : null}
        <li aria-hidden>
          <ChevronRight className="h-3.5 w-3.5 text-[#CBD5E1]" />
        </li>
        <li aria-current="page" className="text-[#0F2F5F] font-medium line-clamp-1 max-w-[60vw]">
          {courseTitle}
        </li>
      </ol>
    </nav>
  );
}

function CoursePreviewThumbnail({ course }) {
  if (!course) return null;
  return (
    <div
      className={cn(
        "w-full rounded-2xl overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0]",
        "shadow-[0_10px_30px_-15px_rgba(15,47,95,0.25)]"
      )}
    >
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={`${course.title} — course preview`}
            fill
            sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 100vw, 1280px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#EFF6FF] via-white to-[#F8FAFC]">
            <BookOpen className="h-16 w-16 text-[#BFDBFE]" />
          </div>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-[#0F2F5F]/60 via-[#0F2F5F]/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
