"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import CourseCard from "@/components/courses/CourseCard.jsx";
import StudentMobileNav from "@/components/dashboard/StudentMobileNav.jsx";
import StudentSidebar from "@/components/dashboard/StudentSidebar.jsx";
import { student } from "@/constants/studentDashboard.js";
import { cn } from "@/utils";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock3,
  Download,
  FileText,
  LockKeyhole,
  Play,
  PlayCircle,
  Star,
  Video,
} from "lucide-react";

const typeIcons = {
  video: Video,
  article: FileText,
  quiz: CircleHelp,
  assignment: ClipboardList,
};

function ProgressTrack({ value, label, color = "bg-primary-600" }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
    >
      <div className={cn("h-full rounded-full transition-[width] motion-reduce:transition-none", color)} style={{ width: `${value}%` }} />
    </div>
  );
}

function LessonStatusIcon({ lesson }) {
  if (lesson.completed) return <CheckCircle2 className="h-5 w-5 text-emerald-700" aria-hidden="true" />;
  if (lesson.current) return <PlayCircle className="h-5 w-5 text-primary-700" aria-hidden="true" />;
  if (lesson.locked) return <LockKeyhole className="h-4 w-4 text-slate-400" aria-hidden="true" />;
  const TypeIcon = typeIcons[lesson.type] || BookOpen;
  return <TypeIcon className="h-4 w-4 text-slate-500" aria-hidden="true" />;
}

function LessonRow({ lesson, courseSlug, onLocked }) {
  const rowClass = cn(
    "flex min-w-0 items-center gap-3 rounded-xl border px-3 py-3 transition-colors sm:px-4",
    lesson.current ? "border-blue-200 bg-blue-50" : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50",
    lesson.locked && "text-slate-500"
  );
  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
        <LessonStatusIcon lesson={lesson} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={cn("text-sm font-medium", lesson.current ? "text-primary-800" : "text-slate-800")}>{lesson.title}</span>
          {lesson.current ? <Badge variant="info" size="sm">Current lesson</Badge> : null}
          {lesson.completed ? <span className="sr-only">Completed</span> : null}
          {lesson.locked ? <span className="sr-only">Locked</span> : null}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
          <span>{lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}</span>
          <span aria-hidden="true">·</span>
          <span>{lesson.duration}</span>
        </span>
      </span>
      {lesson.completed ? <span className="hidden items-center gap-1 text-xs font-medium text-emerald-700 sm:inline-flex"><Check className="h-4 w-4" aria-hidden="true" /> Completed</span> : null}
      {!lesson.locked ? <Play className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" /> : null}
    </>
  );

  if (lesson.locked) {
    return (
      <button type="button" className={cn(rowClass, "w-full cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary-500")} aria-disabled="true" onClick={() => onLocked(lesson)}>
        {content}
      </button>
    );
  }

  return (
    <Link href={`/learn/${courseSlug}/${lesson.id}`} className={cn(rowClass, "focus:outline-none focus:ring-2 focus:ring-primary-500")} aria-current={lesson.current ? "step" : undefined}>
      {content}
    </Link>
  );
}

function CourseSection({ section, courseSlug, expanded, onToggle, onLocked }) {
  const panelId = `${section.id}-lessons`;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="flex min-h-[76px] w-full items-center gap-3 px-4 py-4 text-left hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:px-5"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">{section.number}</span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-slate-900">{section.title}</span>
            <span className="mt-1 block text-xs text-slate-500">{section.completedLessons} of {section.totalLessons} lessons · {section.progress}% complete</span>
          </span>
          <ChevronDown className={cn("h-5 w-5 shrink-0 text-slate-500 transition-transform motion-reduce:transition-none", expanded && "rotate-180")} aria-hidden="true" />
        </button>
      </h3>
      {expanded ? (
        <div id={panelId} className="border-t border-slate-200 px-3 py-3 sm:px-4">
          <p className="mb-3 px-1 text-sm leading-6 text-slate-600">{section.description}</p>
          <ProgressTrack value={section.progress} label={`${section.title} section progress`} />
          <div className="mt-3 space-y-1">
            {section.lessons.map((lesson) => <LessonRow key={lesson.id} lesson={lesson} courseSlug={courseSlug} onLocked={onLocked} />)}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function StatTile({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-500">
        {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function StudentCourseLearningClient({ course, recommendedCourses }) {
  const currentSection = course.sections.find((section) => section.lessons.some((lesson) => lesson.current));
  const [expandedSections, setExpandedSections] = React.useState(() => new Set(currentSection ? [currentSection.id] : []));
  const [lockedMessage, setLockedMessage] = React.useState("");
  const [resourceMessage, setResourceMessage] = React.useState("");
  const continueHref = `/learn/${course.slug}/${course.lastAccessedLesson.id}`;
  const lessonCount = course.totalLessons;
  const totalSections = course.sections.length;

  const toggleSection = (sectionId) => {
    setExpandedSections((current) => {
      const next = new Set(current);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const handleLockedLesson = (lesson) => {
    setLockedMessage(`${lesson.title} is locked. Complete the previous lessons to continue.`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <div className="container-page py-6 md:py-8 xl:py-10">
        <div className="flex min-w-0 gap-6">
          <aside className="hidden w-72 shrink-0 lg:block">
            <StudentSidebar currentPath={`/dashboard/courses/${course.slug}`} />
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
              <StudentMobileNav currentPath={`/dashboard/courses/${course.slug}`} />
              <Avatar src={student.avatar} alt={student.name} name={student.name} size="sm" />
            </div>

            <nav aria-label="Breadcrumb" className="mb-5 flex min-w-0 flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link href="/dashboard" className="shrink-0 hover:text-primary-600">Dashboard</Link>
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              <Link href="/dashboard/courses" className="shrink-0 hover:text-primary-600">My Courses</Link>
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span aria-current="page" className="min-w-0 truncate font-medium text-slate-900">{course.title}</span>
            </nav>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid min-w-0 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
                <div className="relative aspect-video bg-slate-100 lg:aspect-auto lg:min-h-[300px]">
                  <Image src={course.thumbnail} alt={`${course.title} course thumbnail`} fill priority sizes="(max-width: 1023px) 100vw, 35vw" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-col justify-center p-5 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">{course.category}</Badge>
                    <Badge variant="secondary">{course.level}</Badge>
                    <Badge variant="info">{course.language}</Badge>
                  </div>
                  <h1 className="mt-4 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{course.title}</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{course.description}</p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600">
                    <Link href={`/instructors/${course.instructor.slug}`} className="inline-flex min-w-0 items-center gap-2 hover:text-primary-700">
                      <Avatar src={course.instructor.avatar} name={course.instructor.name} alt={course.instructor.name} size="sm" />
                      <span className="truncate font-medium">{course.instructor.name}</span>
                    </Link>
                    <span className="inline-flex items-center gap-1.5" aria-label={`Rating ${course.rating} out of 5, ${course.reviewCount} reviews`}>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden="true" />
                      <span className="font-semibold text-slate-900">{course.rating.toFixed(1)}</span>
                      <span>({course.reviewCount.toLocaleString()} reviews)</span>
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary-600" aria-hidden="true" />{lessonCount} lessons</span>
                    <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary-600" aria-hidden="true" />{course.totalDuration}</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0 space-y-6">
                <section className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="continue-title">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Continue Learning</p>
                      <h2 id="continue-title" className="mt-2 text-xl font-bold text-slate-900">{course.lastAccessedLesson.title}</h2>
                      <p className="mt-1 text-sm text-slate-600">{currentSection?.title} · Lesson {course.lastAccessedLesson.number} of {lessonCount}</p>
                      <p className="mt-2 text-xs text-slate-500">Last activity: {course.lastActivity}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800">
                      <PlayCircle className="h-5 w-5" aria-hidden="true" />
                      {course.progress}% complete
                    </div>
                  </div>
                  <div className="mt-4">
                    <ProgressTrack value={course.progress} label={`${course.title} overall progress`} />
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button asChild leftIcon={<Play className="h-4 w-4" />}>
                      <Link href={continueHref}>Continue Lesson</Link>
                    </Button>
                    <Button asChild variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      <Link href="#course-curriculum">View Curriculum</Link>
                    </Button>
                  </div>
                </section>

                <section id="course-curriculum" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-labelledby="curriculum-title">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Learning path</p>
                      <h2 id="curriculum-title" className="mt-1 text-2xl font-bold text-slate-900">Course Curriculum</h2>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">{lessonCount} Lessons</span>
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">{totalSections} Sections</span>
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">{course.totalDuration}</span>
                    </div>
                  </div>

                  {lockedMessage ? (
                    <div role="status" className="mt-4 flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
                      <span>{lockedMessage}</span>
                      <button type="button" onClick={() => setLockedMessage("")} aria-label="Dismiss locked lesson message" className="rounded p-1 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                  ) : null}

                  {course.sections.length ? (
                    <div className="mt-5 space-y-3">
                      {course.sections.map((section, index) => (
                        <CourseSection
                          key={section.id}
                          section={{ ...section, number: index + 1 }}
                          courseSlug={course.slug}
                          expanded={expandedSections.has(section.id)}
                          onToggle={() => toggleSection(section.id)}
                          onLocked={handleLockedLesson}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon="empty" title="No curriculum available" description="Course lessons will appear here when they are added." compact />
                  )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="activity-title">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Your learning history</p>
                      <h2 id="activity-title" className="mt-1 text-xl font-bold text-slate-900">Recent Learning Activity</h2>
                    </div>
                    <Clock3 className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  {course.activities.length ? (
                    <ol className="mt-5 space-y-4">
                      {course.activities.map((activity) => (
                        <li key={activity.id} className="flex gap-3">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                            {activity.type === "completed" ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <BookOpen className="h-4 w-4" aria-hidden="true" />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{activity.time} · Lesson {activity.lessonId.replace("lesson-", "")}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <EmptyState icon="empty" title="No learning activity yet" description="Your course activity will appear here as you study." compact />
                  )}
                </section>
              </div>

              <aside className="min-w-0 space-y-5">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="progress-title">
                  <div className="flex items-center justify-between gap-3">
                    <h2 id="progress-title" className="text-lg font-bold text-slate-900">Course Progress</h2>
                    <Badge variant="info">{course.progress}%</Badge>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <p className="text-3xl font-bold tabular-nums text-slate-900">{course.completedLessons}<span className="text-base font-medium text-slate-500"> / {lessonCount}</span></p>
                    <p className="pb-1 text-sm text-slate-500">lessons complete</p>
                  </div>
                  <div className="mt-3"><ProgressTrack value={course.progress} label={`${course.title} progress`} /></div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-emerald-50 p-3"><p className="font-semibold text-emerald-800">{course.completedLessons}</p><p className="mt-1 text-xs text-emerald-700">Completed</p></div>
                    <div className="rounded-xl bg-slate-100 p-3"><p className="font-semibold text-slate-800">{course.remainingLessons}</p><p className="mt-1 text-xs text-slate-600">Remaining</p></div>
                  </div>
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                    <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Learning time</span><span className="font-semibold text-slate-900">{course.learningHours}h</span></div>
                    <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Last activity</span><span className="text-right font-semibold text-slate-900">{course.lastActivity}</span></div>
                  </div>
                  <Button asChild className="mt-4 w-full" leftIcon={<Play className="h-4 w-4" />}>
                    <Link href={continueHref}>Continue Learning</Link>
                  </Button>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="stats-title">
                  <h2 id="stats-title" className="text-lg font-bold text-slate-900">Course Statistics</h2>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <StatTile label="Total Lessons" value={lessonCount} icon={BookOpen} />
                    <StatTile label="Completed" value={course.completedLessons} icon={CheckCircle2} />
                    <StatTile label="Remaining" value={course.remainingLessons} icon={Clock3} />
                    <StatTile label="Learning Hours" value={`${course.learningHours}h`} icon={PlayCircle} />
                    <StatTile label="Completion" value={`${course.progress}%`} icon={Check} />
                    <StatTile label="Certificates" value={course.certificateCount} icon={Star} />
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="instructor-title">
                  <h2 id="instructor-title" className="text-lg font-bold text-slate-900">Your Instructor</h2>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar src={course.instructor.avatar} name={course.instructor.name} alt={course.instructor.name} size="lg" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{course.instructor.name}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{course.instructor.title}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{course.instructor.bio}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <StatTile label="Students" value={`${Math.round(course.instructor.students / 1000)}k+`} />
                    <StatTile label="Courses" value={course.instructor.courses} />
                  </div>
                  <Button asChild variant="outline" className="mt-4 w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    <Link href={`/instructors/${course.instructor.slug}`}>View Instructor</Link>
                  </Button>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="resources-title">
                  <div className="flex items-center justify-between gap-3">
                    <h2 id="resources-title" className="text-lg font-bold text-slate-900">Course Resources</h2>
                    <Download className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </div>
                  {resourceMessage ? <p role="status" className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">{resourceMessage}</p> : null}
                  {course.resources.length ? (
                    <ul className="mt-3 divide-y divide-slate-100">
                      {course.resources.map((resource) => (
                        <li key={resource.id}>
                          <button type="button" onClick={() => setResourceMessage(`${resource.title} is a demo resource and is not available for download.`)} className="flex min-h-12 w-full items-center gap-3 py-2 text-left hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><FileText className="h-4 w-4" aria-hidden="true" /></span>
                            <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-slate-800">{resource.title}</span><span className="mt-0.5 block text-xs text-slate-500">{resource.detail}</span></span>
                            <Download className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState icon="empty" title="No resources yet" description="Course files will appear here when available." compact />
                  )}
                </section>
              </aside>
            </div>

            <section className="mt-8" aria-labelledby="recommended-title">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Keep exploring</p>
                  <h2 id="recommended-title" className="mt-1 text-2xl font-bold text-slate-900">Recommended For You</h2>
                </div>
                <Link href="/courses" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  Browse all courses <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              {recommendedCourses.length ? (
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {recommendedCourses.map((recommendedCourse) => (
                    <CourseCard key={recommendedCourse.id} course={recommendedCourse} variant="home" showWishlist={false} />
                  ))}
                </div>
              ) : (
                <EmptyState icon="empty" title="No recommendations yet" description="New course recommendations will appear here." compact />
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}