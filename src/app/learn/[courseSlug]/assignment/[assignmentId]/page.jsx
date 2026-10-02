import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Home,
  User,
} from "lucide-react";
import { courseLessons } from "@/constants/lessons.js";
import { assignments } from "@/constants/assignments.js";
import { instructors } from "@/constants/instructors.js";
import AssignmentSubmission from "@/components/assignment/AssignmentSubmission.jsx";

function getCourseForSlug(courseSlug) {
  if (!courseSlug) return null;
  return courseLessons[courseSlug] ?? null;
}

function getAssignmentForCourse(courseSlug, assignmentId) {
  if (!courseSlug || !assignmentId) return null;
  return (
    assignments.find(
      (assignment) => assignment.courseSlug === String(courseSlug) && assignment.id === String(assignmentId)
    ) || null
  );
}

export async function generateMetadata({ params }) {
  const course = getCourseForSlug(params?.courseSlug);
  const assignment = getAssignmentForCourse(params?.courseSlug, params?.assignmentId);

  if (!course || !assignment) {
    return {
      title: "Assignment Not Found | EduLearn",
      description: "This assignment could not be found on EduLearn.",
    };
  }

  return {
    title: `${assignment.title} | Assignment | EduLearn`,
    description: `Complete your EduLearn assignment for the ${course.course.title} course.`,
  };
}

export default async function AssignmentPage({ params }) {
  const courseSlug = params?.courseSlug;
  const assignmentId = params?.assignmentId;
  const courseData = getCourseForSlug(courseSlug);
  const assignment = getAssignmentForCourse(courseSlug, assignmentId);

  if (!courseData || !assignment) {
    notFound();
  }

  const course = courseData.course;
  const instructor = instructors.find((person) => person.slug === course.instructorSlug) || null;
  const assignmentStatus = assignment.status === "graded" ? "Graded" : assignment.status === "submitted" ? "Submitted" : assignment.deadlineStatus || "Upcoming";

  const lessonHref = assignment.lessonId ? `/learn/${course.slug}/${assignment.lessonId}` : `/courses/${course.slug}`;
  const backLabel = assignment.lessonId ? "Back to Lesson" : "Back to Course";

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
              <p className="truncate text-sm font-medium text-slate-600">{course.title}</p>
            </div>
          </div>

          <Link
            href={lessonHref}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel}
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
              <Link href={`/courses/${course.slug}`} className="hover:text-blue-600">
                {course.title}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li aria-current="page" className="font-medium text-slate-700">
              Assignments
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li aria-current="page" className="max-w-[220px] truncate font-medium text-slate-700">
              {assignment.title}
            </li>
          </ol>
        </nav>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(290px,0.9fr)] xl:items-start">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Assignment</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {assignment.title}
              </h1>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoStat label="Course" value={course.title} icon={BookOpen} />
                <InfoStat label="Section" value={assignment.sectionTitle} icon={FileText} />
                <InfoStat label="Assignment Type" value={assignment.type ? assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1) : "Project"} icon={Award} />
                <InfoStat label="Status" value={assignmentStatus} icon={CheckCircle2} />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetaCard label="Due" value={assignment.dueDateLabel || "October 20, 2026"} />
                <MetaCard label="Maximum" value={`${assignment.maxMarks} Marks`} />
                <MetaCard label="Estimated Time" value={assignment.estimatedTime || "4 hours"} />
                <MetaCard label="Attempts" value={`${assignment.attemptsUsed || 0} of ${assignment.attemptsAllowed || 2} used`} />
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Assignment Overview</h2>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">Assignment</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{assignment.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{assignment.description}</p>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="flex justify-between gap-3">
                    <span>Due</span>
                    <span className="font-medium text-slate-800">{assignment.dueDateLabel || "October 20, 2026"}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Maximum Marks</span>
                    <span className="font-medium text-slate-800">{assignment.maxMarks} Marks</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Attempts</span>
                    <span className="font-medium text-slate-800">{assignment.attemptsAllowed || 2}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Submission</span>
                    <span className="font-medium text-slate-800">{assignment.submissionType || "Project File + Description"}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-2xl font-bold text-slate-900">About This Assignment</h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                {assignment.instructions ||
                  "This assignment is designed to help you apply your new skills in a realistic, project-based workflow."}
              </p>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-2xl font-bold text-slate-900">Requirements</h2>
              <ul className="mt-5 space-y-3">
                {(assignment.requirements || ["No additional requirements provided."]).map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-600">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-2xl font-bold text-slate-900">Learning Objectives</h2>
              <ul className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-slate-600">
                {(assignment.objectives || ["No learning objectives provided."]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-2xl font-bold text-slate-900">Reference Materials</h2>
              <div className="mt-5 space-y-3">
                {(assignment.resources && assignment.resources.length > 0 ? assignment.resources : [{ label: "No reference materials available." }]).map((resource) => (
                  resource.url ? (
                    <a
                      key={resource.label}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                      <span>{resource.label}</span>
                      <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
                    </a>
                  ) : (
                    <div key={resource.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                      {resource.label}
                    </div>
                  )
                ))}
              </div>
            </section>

            <AssignmentSubmission assignment={assignment} course={course} />
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-bold text-slate-900">Assignment Summary</h2>
              <dl className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-3">
                  <dt>Due Date</dt>
                  <dd className="font-medium text-slate-800">{assignment.dueDateLabel || "October 20, 2026"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Marks</dt>
                  <dd className="font-medium text-slate-800">{assignment.maxMarks}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Attempts</dt>
                  <dd className="font-medium text-slate-800">{assignment.attemptsUsed || 0} / {assignment.attemptsAllowed || 2}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Submission</dt>
                  <dd className="font-medium text-slate-800">{assignment.submissionType || "Project File + Description"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Status</dt>
                  <dd className="font-medium text-slate-800">{assignmentStatus}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-bold text-slate-900">Course Progress</h2>
              <div className="mt-5">
                <div className="flex items-end justify-between gap-3">
                  <span className="text-3xl font-bold text-slate-900">68%</span>
                  <span className="text-sm text-slate-500">34 / 50 Lessons</span>
                </div>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                  <div className="h-full w-[68%] rounded-full bg-blue-600" />
                </div>
              </div>

              <Link
                href={`/learn/${course.slug}/lesson-07`}
                className="mt-5 inline-flex items-center justify-center w-full rounded-xl bg-[#0F2F5F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#153c7f]"
              >
                Continue Learning
              </Link>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-bold text-slate-900">Instructor</h2>
              <div className="mt-5 flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  {instructor?.avatar ? (
                    <Image
                      src={instructor.avatar}
                      alt={instructor.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-500">
                      <User className="h-6 w-6" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">{instructor?.name || "Sarah Johnson"}</p>
                  <p className="text-sm text-slate-600">{instructor?.role || "Senior Full Stack Engineer"}</p>
                </div>
              </div>

              <Link
                href={instructor ? `/instructors/${instructor.slug}` : "/instructors"}
                className="mt-5 inline-flex items-center justify-center w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View Instructor
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
      <div className="flex items-center gap-2 text-slate-600">
        <Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-[0.14em]">{label}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function MetaCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-800">{value}</p>
    </div>
  );
}
