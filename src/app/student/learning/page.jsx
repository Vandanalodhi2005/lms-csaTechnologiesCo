"use client";

import * as React from "react";
import Link from "next/link";
import {
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  MessageSquare,
  BookOpen,
  Settings,
  Maximize2,
  Volume2,
  VolumeX,
  Share2,
  Save,
  Clock,
  Code,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  Send,
  Lock,
  ArrowLeft,
  Award,
} from "lucide-react";
import { cn } from "@/utils";
import Avatar from "@/components/ui/Avatar.jsx";
import { toast } from "sonner";

const CURRICULUM_MODULES = [
  {
    id: "mod-1",
    title: "Module 1: Modern JavaScript & Async Paradigms",
    completedCount: 5,
    totalCount: 5,
    lessons: [
      { id: "1.1", title: "ES6+ Deep Dive: Closures & Prototypes", duration: "18:40", completed: true },
      { id: "1.2", title: "Asynchronous JavaScript: Promises & Microtasks", duration: "24:15", completed: true },
      { id: "1.3", title: "TypeScript Essentials for Web Developers", duration: "32:00", completed: true },
      { id: "1.4", title: "Generics & Advanced Utility Types", duration: "27:10", completed: true },
      { id: "1.5", title: "Module 1 Assessment: Async Mastery", duration: "Quiz • 15 Qs", completed: true, isQuiz: true },
    ],
  },
  {
    id: "mod-2",
    title: "Module 2: React Core & State Architecture",
    completedCount: 6,
    totalCount: 6,
    lessons: [
      { id: "2.1", title: "Component Lifecycle & Reconciliation Algorithm", duration: "21:30", completed: true },
      { id: "2.2", title: "Custom Hooks & Composition Patterns", duration: "35:10", completed: true },
      { id: "2.3", title: "State Management: Context vs Zustand", duration: "29:45", completed: true },
      { id: "2.4", title: "Performance Profiling with React DevTools", duration: "22:50", completed: true },
      { id: "2.5", title: "Building accessible UI Components", duration: "19:20", completed: true },
      { id: "2.6", title: "Mid-Term Project: Task Management App", duration: "Project Submission", completed: true, isProject: true },
    ],
  },
  {
    id: "mod-3",
    title: "Module 3: Next.js 14 App Router & Streaming SSR",
    completedCount: 2,
    totalCount: 5,
    lessons: [
      { id: "3.1", title: "Understanding React Server Components (RSC)", duration: "25:40", completed: true },
      { id: "3.2", title: "Streaming with Suspense & Loading Skeletons", duration: "28:10", completed: false, isCurrent: true },
      { id: "3.3", title: "Server Actions, Revalidation & Mutations", duration: "31:25", completed: false },
      { id: "3.4", title: "Parallel Routes & Intercepting Modals", duration: "22:15", completed: false },
      { id: "3.5", title: "Module 3 Quiz: Next.js Deep Dive", duration: "Quiz • 20 Qs", completed: false, isQuiz: true },
    ],
  },
  {
    id: "mod-4",
    title: "Module 4: Enterprise Full Stack Capstone",
    completedCount: 0,
    totalCount: 4,
    lessons: [
      { id: "4.1", title: "Architecting Microservices with Node.js & Docker", duration: "38:00", completed: false, locked: true },
      { id: "4.2", title: "PostgreSQL Prisma ORM & Database Indexing", duration: "42:15", completed: false, locked: true },
      { id: "4.3", title: "Production CI/CD Pipelines & AWS Deployment", duration: "45:00", completed: false, locked: true },
      { id: "4.4", title: "Final Capstone Presentation & Code Review", duration: "Capstone Project", completed: false, locked: true, isProject: true },
    ],
  },
];

export default function StudentLearningPage() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [playbackSpeed, setPlaybackSpeed] = React.useState("1x");
  const [activeTab, setActiveTab] = React.useState("overview"); // "overview" | "notes" | "resources" | "qa"
  const [openModules, setOpenModules] = React.useState({ "mod-3": true });
  const [isLessonCompleted, setIsLessonCompleted] = React.useState(false);
  const [currentLesson, setCurrentLesson] = React.useState({
    id: "3.2",
    title: "Streaming with Suspense & Loading Skeletons",
    module: "Module 3: Next.js 14 App Router & Streaming SSR",
    duration: "28:10",
  });

  // Notes state
  const [notes, setNotes] = React.useState([
    {
      id: 1,
      time: "04:18",
      text: "React Server Components run only on the server, zero bundle impact on the client browser.",
    },
    {
      id: 2,
      time: "12:45",
      text: "Wrap slow data-fetching components with <Suspense fallback={<Skeleton />}> to unblock immediate HTML stream.",
    },
  ]);
  const [newNote, setNewNote] = React.useState("");

  // Discussion state
  const [discussions, setDiscussions] = React.useState([
    {
      id: 1,
      author: "David Miller",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      time: "2 days ago",
      question: "Can we use React Suspense with client-side useEffect fetching, or is it strictly for Server Components?",
      answersCount: 3,
      upvotes: 7,
      instructorReplied: true,
    },
    {
      id: 2,
      author: "Sophie Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      time: "Yesterday",
      question: "What is the best way to handle error boundaries when an individual streaming chunk fails?",
      answersCount: 2,
      upvotes: 4,
      instructorReplied: true,
    },
  ]);
  const [newQuestion, setNewQuestion] = React.useState("");

  const toggleModule = (modId) => {
    setOpenModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleToggleComplete = () => {
    setIsLessonCompleted(!isLessonCompleted);
    if (!isLessonCompleted) {
      toast.success("Lesson marked as completed! +50 XP");
    } else {
      toast.info("Lesson marked as incomplete");
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([
      ...notes,
      {
        id: Date.now(),
        time: "15:20",
        text: newNote.trim(),
      },
    ]);
    setNewNote("");
    toast.success("Note saved at timestamp 15:20");
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setDiscussions([
      {
        id: Date.now(),
        author: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        time: "Just now",
        question: newQuestion.trim(),
        answersCount: 0,
        upvotes: 1,
        instructorReplied: false,
      },
      ...discussions,
    ]);
    setNewQuestion("");
    toast.success("Question posted to classroom discussion!");
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/student/courses"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Back to Courses"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Full Stack Web Dev
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                {currentLesson.module}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate mt-0.5">
              {currentLesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={handleToggleComplete}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all",
              isLessonCompleted
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            )}
          >
            <CheckCircle2
              className={cn("w-4 h-4", isLessonCompleted ? "text-emerald-600 fill-emerald-100" : "text-slate-400")}
            />
            <span>{isLessonCompleted ? "Completed" : "Mark as Complete"}</span>
          </button>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-2 sm:pl-3">
            <button
              onClick={() => toast.info("Navigating to previous lesson")}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Previous lesson"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast.info("Navigating to next lesson")}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Next lesson"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Classroom Layout: Player + Curriculum Sidebar */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Video Player & Tabs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player Canvas */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-xl border border-slate-800 flex flex-col justify-between group">
            {/* Ambient Background Gradient for video */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/80" />

            {/* Video Placeholder Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 transition-all duration-300"
              >
                {isPlaying ? (
                  <PauseCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                ) : (
                  <PlayCircle className="w-8 h-8 sm:w-10 sm:h-10 ml-1" />
                )}
              </div>
              <p className="text-white font-bold text-sm sm:text-base mt-4 drop-shadow">
                {currentLesson.title}
              </p>
              <p className="text-xs text-blue-200/80 mt-1">
                Instructor: Sarah Jenkins • Next.js 14 Streaming Engine
              </p>
            </div>

            {/* Video Controls Bar */}
            <div className="relative z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-4 space-y-2">
              {/* Scrubber */}
              <div className="w-full h-1.5 bg-slate-700/60 hover:h-2.5 rounded-full cursor-pointer relative overflow-hidden transition-all group/scrubber">
                <div className="h-full bg-blue-500 rounded-full w-[45%]" />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-white transition-colors"
                  >
                    {isPlaying ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="text-[11px] font-mono text-slate-400">
                    12:45 / {currentLesson.duration}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Speed toggle */}
                  <div className="relative inline-block">
                    <button
                      onClick={() => {
                        const speeds = ["1x", "1.25x", "1.5x", "2x"];
                        const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                        setPlaybackSpeed(next);
                        toast.info(`Playback speed set to ${next}`);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] font-bold text-slate-200 transition-colors"
                    >
                      {playbackSpeed}
                    </button>
                  </div>

                  <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300">
                    1080p HD
                  </span>

                  <button
                    onClick={() => toast.info("Fullscreen activated")}
                    className="hover:text-white transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Classroom Tabs: Overview | Notes | Resources | Discussion */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-200 flex items-center gap-6 overflow-x-auto scrollbar-thin">
              <button
                onClick={() => setActiveTab("overview")}
                className={cn(
                  "pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap",
                  activeTab === "overview"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <BookOpen className="w-4 h-4" />
                <span>Overview & Objectives</span>
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                className={cn(
                  "pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap",
                  activeTab === "notes"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <FileText className="w-4 h-4" />
                <span>My Notes ({notes.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("resources")}
                className={cn(
                  "pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap",
                  activeTab === "resources"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Download className="w-4 h-4" />
                <span>Resources (3)</span>
              </button>

              <button
                onClick={() => setActiveTab("qa")}
                className={cn(
                  "pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap",
                  activeTab === "qa"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Discussion & Q&A ({discussions.length})</span>
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">About this Lesson</h3>
                  <p>
                    In this session, we investigate how React 18 Suspense boundaries work in conjunction with Next.js App Router streaming SSR. By breaking down your page into parallel chunks, users perceive lightning-fast First Contentful Paint (FCP) while heavy database queries stream down asynchronously without stalling the rest of the application layout.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-600">
                    What You'll Learn
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-600 text-xs">
                    <li>How to wrap server components in Suspense with graceful animated skeleton fallbacks.</li>
                    <li>Handling granular error boundaries per section with <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">error.jsx</code>.</li>
                    <li>Optimizing server fetch waterfalls using concurrent <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">Promise.all()</code>.</li>
                    <li>Analyzing waterfall diagrams inside Google Chrome Network devtools.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                    Instructor Code Sample
                  </h4>
                  <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto">
                    <pre>{`// app/dashboard/page.jsx
import { Suspense } from "react";
import RevenueChart from "@/components/RevenueChart";
import RevenueSkeleton from "@/components/skeletons/RevenueSkeleton";

export default async function DashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Financial Overview</h1>
      <Suspense fallback={<RevenueSkeleton />}>
        <RevenueChart />
      </Suspense>
    </main>
  );
}`}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Notes */}
            {activeTab === "notes" && (
              <div className="space-y-5">
                <form onSubmit={handleAddNote} className="space-y-3">
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a timestamped note at current video time (15:20)..."
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" /> Stamp: 15:20
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Note</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-3 pt-2">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 hover:border-slate-300 transition-all"
                    >
                      <button
                        onClick={() => toast.info(`Jumping video to ${note.time}`)}
                        className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold hover:bg-blue-200 transition-colors shrink-0"
                      >
                        {note.time}
                      </button>
                      <div className="flex-1 text-xs text-slate-700">
                        <p>{note.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Resources */}
            {activeTab === "resources" && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-200 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        Streaming_SSR_Architecture_Slides.pdf
                      </h4>
                      <p className="text-[11px] text-slate-400">PDF Document • 4.2 MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success("Downloading slides PDF")}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-200 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        next14-streaming-starter-kit.zip
                      </h4>
                      <p className="text-[11px] text-slate-400">Source Code Repository • 12.8 MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success("Downloading starter code archive")}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-200 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        Next.js 14 App Router Cheat Sheet
                      </h4>
                      <p className="text-[11px] text-slate-400">Curated Reference Guide • 1.1 MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success("Downloading cheat sheet")}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Q&A */}
            {activeTab === "qa" && (
              <div className="space-y-5">
                <form onSubmit={handleAddQuestion} className="space-y-3">
                  <textarea
                    rows={2}
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ask a question about this lesson or request clarification..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Question</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-4 pt-2">
                  {discussions.map((qa) => (
                    <div
                      key={qa.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar src={qa.avatar} name={qa.author} size="xs" />
                          <span className="text-xs font-bold text-slate-900">{qa.author}</span>
                          <span className="text-[11px] text-slate-400">• {qa.time}</span>
                        </div>
                        {qa.instructorReplied && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Instructor Replied
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{qa.question}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                        <button
                          onClick={() => toast.success("Upvoted discussion")}
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{qa.upvotes} Upvotes</span>
                        </button>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{qa.answersCount} Answers</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Course Syllabus & Progress */}
        <div className="lg:col-span-4 space-y-5">
          {/* Progress Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Course Progress</span>
              <span className="font-bold text-blue-600">78%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: "78%" }} />
            </div>
            <p className="text-[11px] text-slate-500">
              37 of 48 curriculum milestones completed. 11 remaining.
            </p>
          </div>

          {/* Curriculum Syllabus Accordion */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Course Curriculum</h3>
                <p className="text-[11px] text-slate-500">4 Modules • 20 Lessons</p>
              </div>
              <span className="text-xs font-semibold text-blue-600">Expand All</span>
            </div>

            <div className="divide-y divide-slate-100">
              {CURRICULUM_MODULES.map((mod) => {
                const isOpen = openModules[mod.id];

                return (
                  <div key={mod.id} className="transition-colors">
                    {/* Module Accordion Header */}
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="space-y-0.5 pr-2">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {mod.title}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {mod.completedCount} / {mod.totalCount} completed
                        </p>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {/* Module Lessons List */}
                    {isOpen && (
                      <div className="bg-slate-50/50 py-1 border-t border-slate-100 divide-y divide-slate-100/80">
                        {mod.lessons.map((lesson) => {
                          const isCurrent = lesson.id === currentLesson.id;

                          return (
                            <button
                              key={lesson.id}
                              disabled={lesson.locked}
                              onClick={() => {
                                if (lesson.locked) {
                                  toast.error("Complete previous lessons to unlock this session.");
                                  return;
                                }
                                setCurrentLesson({
                                  id: lesson.id,
                                  title: lesson.title,
                                  module: mod.title,
                                  duration: lesson.duration,
                                });
                                toast.success(`Switched to: ${lesson.title}`);
                              }}
                              className={cn(
                                "w-full px-4 py-3 flex items-start gap-3 text-left transition-colors",
                                isCurrent
                                  ? "bg-blue-50/80 border-l-4 border-blue-600 text-blue-900"
                                  : lesson.locked
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:bg-slate-100/70"
                              )}
                            >
                              <div className="mt-0.5 shrink-0">
                                {lesson.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                                ) : lesson.locked ? (
                                  <Lock className="w-4 h-4 text-slate-400" />
                                ) : isCurrent ? (
                                  <PlayCircle className="w-4 h-4 text-blue-600 fill-blue-100" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    "text-xs font-medium leading-snug line-clamp-2",
                                    isCurrent ? "font-bold text-blue-900" : "text-slate-800"
                                  )}
                                >
                                  {lesson.title}
                                </p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {lesson.duration}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
