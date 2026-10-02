import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight, Clock3, FileQuestion, Target } from "lucide-react";
import { COURSES } from "@/constants/courses.js";
import { quizzes } from "@/constants/quizzes.js";
import QuizPlayer from "@/components/quiz/QuizPlayer.jsx";

function findCourse(slug) {
  if (!slug) return null;
  return COURSES.find((course) => course.slug === String(slug)) || null;
}

function findQuiz(courseSlug, quizId) {
  if (!courseSlug || !quizId) return null;
  const match = quizzes.find((quiz) => {
    const idMatch = quiz.id === String(quizId) || quiz.slug === String(quizId);
    const courseMatch = quiz.courseSlug === String(courseSlug);
    return idMatch && courseMatch;
  });
  return match || null;
}

export async function generateMetadata({ params }) {
  const course = findCourse(params?.courseSlug);
  const quiz = findQuiz(params?.courseSlug, params?.quizId);

  if (!course || !quiz) {
    return {
      title: "Quiz Not Found | EduLearn",
      description: "This quiz could not be found on EduLearn.",
    };
  }

  return {
    title: `${quiz.title} | EduLearn`,
    description: `Test your knowledge with the ${quiz.title} quiz on EduLearn.`,
  };
}

export default async function QuizPage({ params }) {
  const course = findCourse(params?.courseSlug);
  const quiz = findQuiz(params?.courseSlug, params?.quizId);

  if (!course || !quiz) {
    notFound();
  }

  let lessonHref = null;
  if (quiz.lessonId) {
    lessonHref = `/learn/${course.slug}/${quiz.lessonId}`;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-[#0F2F5F]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F2F5F] text-sm font-bold text-white">
                E
              </div>
              <span className="text-base font-semibold tracking-tight">EduLearn</span>
            </Link>
            <span className="hidden h-4 w-px bg-slate-300 sm:block" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-600">{course.title}</p>
            </div>
          </div>

          {lessonHref ? (
            <Link
              href={lessonHref}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Lesson
            </Link>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <li>
              <Link href="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li>
              <Link href="/courses" className="hover:text-blue-600">Courses</Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li>
              <Link href={`/courses/${course.slug}`} className="hover:text-blue-600">
                {course.title}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li aria-current="page" className="font-medium text-slate-700">
              {quiz.title}
            </li>
          </ol>
        </nav>

        <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Quiz</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{quiz.title}</h1>
            </div>
            <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <FileQuestion className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span>{quiz.questions?.length || 0} Questions</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Clock3 className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span>{quiz.timeLimit} Minutes</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Target className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span>{quiz.passingScore}% Passing</span>
              </div>
            </div>
          </div>
        </div>

        <QuizPlayer
          quiz={quiz}
          course={course}
          lessonHref={lessonHref}
        />
      </div>
    </main>
  );
}
