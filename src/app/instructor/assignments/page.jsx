"use client";

import * as React from "react";
import Link from "next/link";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Github,
  ExternalLink,
  Download,
  Award,
  Sparkles,
  MessageSquare,
  X,
  Send,
  FileCode,
  Check,
} from "lucide-react";
import { cn } from "@/utils";
import Avatar from "@/components/ui/Avatar.jsx";
import { toast } from "sonner";

const INITIAL_SUBMISSIONS = [
  {
    id: "sub-1",
    student: {
      name: "Alex Morgan",
      email: "alex.morgan@edulearn.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    title: "Next.js 14 Full Stack E-Commerce & Stripe Capstone",
    course: "Full Stack Web Development Masterclass",
    submittedAt: "Today at 10:45 AM",
    status: "pending",
    repoUrl: "https://github.com/alexmorgan/ecommerce-next14",
    demoUrl: "https://alex-ecommerce.vercel.app",
    studentNotes: "Configured webhook signing with Stripe CLI. Tested concurrent order placement with Prisma transactions.",
    maxPoints: 100,
  },
  {
    id: "sub-2",
    student: {
      name: "David Kim",
      email: "david.kim@techcorp.io",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    title: "Automated Financial Analysis Pipeline with Pandas",
    course: "Python & Data Science Bootcamp",
    submittedAt: "Yesterday at 04:20 PM",
    status: "pending",
    repoUrl: "https://github.com/davidkim/pandas-financial-pipeline",
    demoUrl: "https://finance-dashboard.streamlit.app",
    studentNotes: "Includes moving averages and Bollinger Bands visualizer using Plotly and Pandas resample.",
    maxPoints: 100,
  },
  {
    id: "sub-3",
    student: {
      name: "Sophie Chen",
      email: "sophie.chen@designlab.org",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    title: "Interactive Task Kanban with Drag-and-Drop & Zustand",
    course: "Full Stack Web Development Masterclass",
    submittedAt: "Oct 14, 2026",
    status: "graded",
    score: 98,
    grade: "A+",
    feedback: "Exceptional drag-and-drop mechanics with optimistic updates. Well-structured state store.",
    maxPoints: 100,
  },
  {
    id: "sub-4",
    student: {
      name: "Lucas Bennett",
      email: "lucas.bennett@startup.dev",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    },
    title: "Multi-Brand Design Tokens & Figma Variables System",
    course: "Advanced UI/UX Design System with Figma 2026",
    submittedAt: "Oct 12, 2026",
    status: "graded",
    score: 95,
    grade: "A",
    feedback: "Very thorough color mode mapping and typography scale. Accessible contrast ratios respected.",
    maxPoints: 100,
  },
];

export default function InstructorAssignmentsPage() {
  const [submissions, setSubmissions] = React.useState(INITIAL_SUBMISSIONS);
  const [tab, setTab] = React.useState("pending"); // "pending" | "graded"
  const [gradingTarget, setGradingTarget] = React.useState(null);

  // Rubric fields
  const [codeScore, setCodeScore] = React.useState(28); // max 30
  const [featuresScore, setFeaturesScore] = React.useState(38); // max 40
  const [uiScore, setUiScore] = React.useState(28); // max 30
  const [feedback, setFeedback] = React.useState("");

  const pendingList = submissions.filter((s) => s.status === "pending");
  const gradedList = submissions.filter((s) => s.status === "graded");

  const totalScore = Number(codeScore) + Number(featuresScore) + Number(uiScore);

  const openGradingModal = (item) => {
    setGradingTarget(item);
    setCodeScore(28);
    setFeaturesScore(38);
    setUiScore(28);
    setFeedback(`Great job on ${item.title}! Clean architecture and well documented.`);
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === gradingTarget.id
          ? {
              ...s,
              status: "graded",
              score: totalScore,
              grade: totalScore >= 95 ? "A+" : totalScore >= 85 ? "A" : "B",
              feedback,
            }
          : s
      )
    );
    toast.success(`Published grade (${totalScore}/100) for ${gradingTarget.student.name}!`);
    setGradingTarget(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Evaluation Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assignment & Capstone Grading
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review student code submissions, test live demos, and award weighted rubric points.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Pending Review</span>
          <p className="text-2xl font-black text-amber-600 mt-2">{pendingList.length} Due</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Awaiting instructor evaluation</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Graded Submissions</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">{gradedList.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Reviewed & published</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Average Score</span>
          <p className="text-2xl font-black text-blue-600 mt-2">96.5%</p>
          <p className="text-[11px] text-slate-500 mt-1">Grade A average</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Avg Turnaround</span>
          <p className="text-2xl font-black text-purple-600 mt-2">18 Hrs</p>
          <p className="text-[11px] text-slate-500 mt-1">Fast feedback badge</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60">
        <button
          onClick={() => setTab("pending")}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold transition-all",
            tab === "pending"
              ? "bg-white text-amber-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          Pending Review ({pendingList.length})
        </button>
        <button
          onClick={() => setTab("graded")}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold transition-all",
            tab === "graded"
              ? "bg-white text-emerald-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          Graded Submissions ({gradedList.length})
        </button>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {(tab === "pending" ? pendingList : gradedList).map((sub) => {
          const isPending = sub.status === "pending";

          return (
            <div
              key={sub.id}
              className="bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 p-6 shadow-2xs transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <Avatar src={sub.student.avatar} name={sub.student.name} size="md" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{sub.student.name}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                        {sub.course}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base">{sub.title}</h3>

                    <p className="text-xs text-slate-400">
                      Submitted: {sub.submittedAt}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isPending ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Needs Review</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Score: {sub.score}/100 ({sub.grade})</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Student notes if any */}
              {sub.studentNotes && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Student Implementation Notes
                  </span>
                  <p>{sub.studentNotes}</p>
                </div>
              )}

              {/* Graded feedback if any */}
              {!isPending && sub.feedback && (
                <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-xs text-slate-800">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-1">
                    Your Published Feedback
                  </span>
                  <p className="italic">"{sub.feedback}"</p>
                </div>
              )}

              {/* Actions & Links Bar */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  {sub.repoUrl && (
                    <a
                      href={sub.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-blue-600 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>Inspect Repository</span>
                    </a>
                  )}
                  {sub.demoUrl && (
                    <a
                      href={sub.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Launch Live Demo</span>
                    </a>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => openGradingModal(sub)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm",
                      isPending
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    )}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{isPending ? "Grade Submission" : "Re-evaluate Grade"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rubric Grading Modal */}
      {gradingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Avatar
                  src={gradingTarget.student.avatar}
                  name={gradingTarget.student.name}
                  size="sm"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Grading: {gradingTarget.student.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-sm">
                    {gradingTarget.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGradingTarget(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Computed Score Banner */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Calculated Overall Score
                  </span>
                  <p className="text-2xl font-black text-blue-900 mt-0.5">
                    {totalScore} <span className="text-sm font-normal text-blue-600">/ 100 Pts</span>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-sm">
                  {totalScore >= 95 ? "Grade A+" : totalScore >= 85 ? "Grade A" : totalScore >= 75 ? "Grade B" : "Grade C"}
                </span>
              </div>

              {/* Rubric Criteria 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label className="font-bold text-slate-800">
                    1. Code Quality, Modularity & Best Practices
                  </label>
                  <span className="font-bold text-blue-600">{codeScore} / 30 Pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={codeScore}
                  onChange={(e) => setCodeScore(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Rubric Criteria 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label className="font-bold text-slate-800">
                    2. Feature Completeness, Architecture & Tests
                  </label>
                  <span className="font-bold text-blue-600">{featuresScore} / 40 Pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={featuresScore}
                  onChange={(e) => setFeaturesScore(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Rubric Criteria 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label className="font-bold text-slate-800">
                    3. UI/UX Polishing, Responsiveness & Accessibility
                  </label>
                  <span className="font-bold text-blue-600">{uiScore} / 30 Pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={uiScore}
                  onChange={(e) => setUiScore(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Instructor Written Feedback */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Written Feedback & Recommendations *
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Leave actionable constructive feedback for the student..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGradingTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Publish Grade & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
