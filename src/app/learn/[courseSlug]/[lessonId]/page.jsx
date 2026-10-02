import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, Clock3, Home, Lock, Video } from "lucide-react";
import { instructors } from "@/constants/instructors.js";
import { courseLessons } from "@/constants/lessons.js";
import LearningCurriculum from "@/components/learning/LearningCurriculum.jsx";
import MarkLessonComplete from "@/components/learning/MarkLessonComplete.jsx";

function flattenLessons(sections) {
  return sections.flatMap((section) =>
    section.lessons.map((lesson) => ({
      ...lesson,
      sectionId: section.sectionId,
      sectionTitle: section.sectionTitle,
    }))
  );
}

function getCourseData(courseSlug) {
  if (!courseSlug) return null;
  return courseLessons[courseSlug] ?? null;
}

export async function generateMetadata({ params }) {
  const courseSlug = params?.courseSlug;
  const lessonId = params?.lessonId;
  const courseData = getCourseData(courseSlug);

  if (!courseData) {
    return {
      title: "Lesson Not Found | EduLearn",
      description: "This learning lesson could not be found.",
    };
  }

  const flatLessons = flattenLessons(courseData.sections);
  const lesson = flatLessons.find((item) => item.id === lessonId) ?? flatLessons[0];

  return {
    title: `${lesson?.title ?? "Lesson"} | ${courseData.course.title} | EduLearn`,
    description: `Continue learning ${courseData.course.title} with this EduLearn lesson.`,
  };
}

export default async function LearningLessonPage({ params }) {
  const { courseSlug, lessonId } = params || {};
  const courseData = getCourseData(courseSlug);

  if (!courseData) {
    notFound();
  }

  const flatLessons = flattenLessons(courseData.sections);
  const currentLesson = flatLessons.find((lesson) => lesson.id === lessonId);

  if (!currentLesson) {
    notFound();
  }

  const currentIndex = flatLessons.findIndex((lesson) => lesson.id === currentLesson.id);
  const previousLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;
  const completedCount = flatLessons.filter((lesson) => lesson.isCompleted).length;
  const progress = Math.round((completedCount / flatLessons.length) * 100);

  const instructor = instructors.find((person) => person.slug === courseData.course.instructorSlug) || null;
  const sectionTitle = currentLesson.sectionTitle ?? "Course Overview";
  const lessonHasVideo = Boolean(currentLesson.videoUrl && currentLesson.videoUrl.trim());

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-[#0F2F5F]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F2F5F] text-sm font-bold text-white">
                E
              </div>
              <span className="text-base font-semibold tracking-tight">EduLearn</span>
            </Link>
            <span className="hidden h-4 w-px bg-slate-300 sm:block" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-600">{courseData.course.title}</p>
            </div>
          </div>

          <Link
            href={`/courses/${courseData.course.slug}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Course</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <li>
              <Link href="/" className="inline-flex items-center gap-1.5 hover:text-blue-600">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Home</span>
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li>
              <Link href="/courses" className="hover:text-blue-600">
                Courses
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li>
              <Link href={`/courses/${courseData.course.slug}`} className="hover:text-blue-600">
                {courseData.course.title}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li aria-current="page" className="max-w-[220px] truncate font-medium text-slate-700">
              {currentLesson.title}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)] lg:items-start">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-video w-full bg-slate-200">
                {lessonHasVideo ? (
                  <video
                    key={currentLesson.id}
                    controls
                    playsInline
                    preload="metadata"
                    poster={currentLesson.poster}
                    className="h-full w-full object-cover"
                  >
                    <source src={currentLesson.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 text-slate-500">
                    <div className="flex flex-col items-center gap-3 text-center px-6">
                      <Video className="h-12 w-12 text-slate-400" aria-hidden="true" />
                      <div>
                        <p className="text-lg font-semibold text-slate-700">Video unavailable</p>
                        <p className="mt-1 max-w-xs text-sm text-slate-500">
                          This lesson does not currently have a video available.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {currentLesson.title}
                </h1>
                <p className="text-sm text-slate-500">
                  {sectionTitle}
                  {currentLesson.duration ? <span className="ml-2">• {currentLesson.duration}</span> : null}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  <span>{currentLesson.duration}</span>
                </div>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {courseData.course.level}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  Video Lesson
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">About This Lesson</h2>
                <p className="leading-7 text-slate-600">
                  {currentLesson.description || "No description available for this lesson."}
                </p>
              </div>

              {currentLesson.isLocked ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <div className="flex items-start gap-3">
                    <Lock className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold">This lesson is locked.</p>
                      <p className="mt-1 text-amber-700">Complete the previous lessons to continue.</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {previousLesson ? (
                  <Link
                    href={`/learn/${courseSlug}/${previousLesson.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Previous Lesson
                  </Link>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-400">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Previous Lesson
                  </span>
                )}

                {nextLesson ? (
                  <Link
                    href={`/learn/${courseSlug}/${nextLesson.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Next Lesson
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-400">
                    Next Lesson
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <MarkLessonComplete
                initialCompleted={Boolean(currentLesson.isCompleted)}
                initialCompletedCount={completedCount}
                totalLessons={flatLessons.length}
                lessonTitle={currentLesson.title}
              />

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    <span className="font-semibold text-slate-800">Course</span>
                  </div>
                  <Link
                    href={`/courses/${courseData.course.slug}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View Course
                  </Link>
                </div>

                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-700">Course:</span> {courseData.course.title}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Instructor:</span> {courseData.course.instructorName}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Level:</span> {courseData.course.level}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Lessons:</span> {flatLessons.length}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Duration:</span> {courseData.course.durationLabel}
                  </p>
                </div>
              </div>
            </div>

            {instructor ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                      <Image
                        src={instructor.avatar}
                        alt={instructor.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{instructor.name}</p>
                      <p className="text-sm text-slate-500">{instructor.role}</p>
                    </div>
                  </div>
                  <Link
                    href={`/instructors/${instructor.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    View Instructor
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          <div className="lg:pt-2">
            <div className="lg:hidden">
              <LearningCurriculum
                sections={courseData.sections}
                currentLessonId={currentLesson.id}
                courseSlug={courseData.course.slug}
              />
            </div>

            <div className="hidden lg:block">
              <LearningCurriculum
                sections={courseData.sections}
                currentLessonId={currentLesson.id}
                courseSlug={courseData.course.slug}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
