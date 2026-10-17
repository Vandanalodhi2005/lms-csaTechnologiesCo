"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Award,
  Sparkles,
  ArrowRight,
  MoreVertical,
  Star,
  ExternalLink,
  ChevronRight,
  Download,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/utils";
import Avatar from "@/components/ui/Avatar.jsx";
import { toast } from "sonner";

const INITIAL_COURSES = [
  {
    id: "fs-web-dev",
    title: "Full Stack Web Development Masterclass",
    category: "Web Development",
    instructor: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    progress: 78,
    totalLessons: 48,
    completedLessons: 37,
    currentLesson: "React Server Components & Suspense in Next.js",
    duration: "42 Hours",
    status: "in-progress",
    rating: 4.9,
    lastAccessed: "2 hours ago",
  },
  {
    id: "python-ds",
    title: "Python & Data Science Bootcamp: From Zero to Hero",
    category: "Data Science",
    instructor: {
      name: "Dr. Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    progress: 42,
    totalLessons: 60,
    completedLessons: 25,
    currentLesson: "Data Wrangling & Statistical Analysis with Pandas",
    duration: "56 Hours",
    status: "in-progress",
    rating: 4.8,
    lastAccessed: "Yesterday",
  },
  {
    id: "ui-ux-pro",
    title: "Advanced UI/UX Design System with Figma 2026",
    category: "UI/UX Design",
    instructor: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
    progress: 15,
    totalLessons: 32,
    completedLessons: 5,
    currentLesson: "Micro-interactions & Tokenized Color Scales",
    duration: "28 Hours",
    status: "in-progress",
    rating: 4.95,
    lastAccessed: "3 days ago",
  },
  {
    id: "ts-deep-dive",
    title: "Modern TypeScript & Enterprise Architecture",
    category: "Web Development",
    instructor: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1516116211227-bbc04f1227ff?w=600&auto=format&fit=crop&q=80",
    progress: 100,
    totalLessons: 36,
    completedLessons: 36,
    currentLesson: "Course Completed! Final Capstone Verified",
    duration: "30 Hours",
    status: "completed",
    rating: 5.0,
    completedDate: "Oct 12, 2026",
    certificateId: "EDU-TS-89412",
  },
  {
    id: "react-native-app",
    title: "React Native & Expo: Build iOS & Android Apps",
    category: "Mobile Development",
    instructor: {
      name: "Liam O'Connor",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
    progress: 100,
    totalLessons: 40,
    completedLessons: 40,
    currentLesson: "Course Completed! App Store Deployment",
    duration: "34 Hours",
    status: "completed",
    rating: 4.88,
    completedDate: "Sep 28, 2026",
    certificateId: "EDU-RN-77301",
  },
];

export default function StudentCoursesPage() {
  const [courses] = React.useState(INITIAL_COURSES);
  const [tab, setTab] = React.useState("all"); // "all" | "in-progress" | "completed"
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  const categories = ["all", "Web Development", "Data Science", "UI/UX Design", "Mobile Development"];

  const filteredCourses = courses.filter((course) => {
    const matchesTab =
      tab === "all" ? true : course.status === tab;
    const matchesCategory =
      selectedCategory === "all" ? true : course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  const inProgressCount = courses.filter((c) => c.status === "in-progress").length;
  const completedCount = courses.filter((c) => c.status === "completed").length;

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learning Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your course curriculum, stream lectures, and monitor your degree progress.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
          >
            <span>Explore More Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{inProgressCount}</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Ongoing active courses</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{completedCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">100% Curriculum finished</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Hours</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-600 mt-2">148 Hrs</p>
          <p className="text-[11px] text-slate-500 mt-1">Time spent learning</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Certificates</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">2 Earned</p>
          <p className="text-[11px] text-slate-500 mt-1">Verified credentials</p>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60 self-start">
            <button
              onClick={() => setTab("all")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                tab === "all"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              All Courses ({courses.length})
            </button>
            <button
              onClick={() => setTab("in-progress")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                tab === "in-progress"
                  ? "bg-white text-blue-600 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setTab("completed")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                tab === "completed"
                  ? "bg-white text-emerald-600 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search enrolled courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pt-1">
          <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all",
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              )}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No courses found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any courses matching your search or filters. Try clearing your search term.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setTab("all");
            }}
            className="px-4 py-2 text-xs font-semibold bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isCompleted = course.status === "completed";

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200/80 hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Thumbnail image with overlay badge */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur text-slate-800 shadow-2xs">
                      {course.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-sm">
                        <Clock className="w-3 h-3" />
                        <span>{course.progress}% done</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Avatar
                          src={course.instructor.avatar}
                          name={course.instructor.name}
                          size="xs"
                        />
                        <span className="font-medium text-slate-700">{course.instructor.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Next Lesson or Completion status */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                        {isCompleted ? "Course Finished" : "Next up:"}
                      </p>
                      <p className="font-medium text-slate-800 truncate mt-0.5">
                        {course.currentLesson}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="text-[11px] font-medium text-slate-500">
                        {course.completedLessons} of {course.totalLessons} lessons
                      </span>
                      <span className="text-[11px] font-bold text-slate-900">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isCompleted ? "bg-emerald-500" : "bg-blue-600"
                        )}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    {isCompleted ? (
                      <>
                        <Link
                          href={`/student/learning?course=${course.id}`}
                          className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <PlayCircle className="w-4 h-4 text-slate-500" />
                          <span>Review</span>
                        </Link>
                        <Link
                          href={`/student/certificates?id=${course.certificateId}`}
                          className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Award className="w-4 h-4 text-emerald-600" />
                          <span>Certificate</span>
                        </Link>
                      </>
                    ) : (
                      <Link
                        href={`/student/learning?course=${course.id}`}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-500/20"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Continue Learning</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Motivational Bottom Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Accelerate Your Career</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Earn your Professional Capstone Credential
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Completing 100% of your course modules and final assessments unlocks an industry-recognized certificate shareable on LinkedIn and verified by EduLearn.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Link
            href="/student/certificates"
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Award className="w-4 h-4 text-blue-600" />
            <span>View Earned Certificates</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
