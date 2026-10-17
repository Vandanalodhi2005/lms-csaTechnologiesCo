"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileCheck,
  UploadCloud,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  Github,
  MessageSquare,
  Award,
  Calendar,
  X,
  FileCode,
  Download,
  Star,
} from "lucide-react";
import { cn } from "@/utils";
import Avatar from "@/components/ui/Avatar.jsx";
import { toast } from "sonner";

const ASSIGNMENTS = [
  {
    id: "assign-capstone",
    title: "Next.js 14 Full Stack E-Commerce & Stripe Capstone",
    course: "Full Stack Web Development Masterclass",
    instructor: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    dueDate: "Oct 28, 2026",
    status: "pending-submission", // "pending-submission" | "under-review" | "graded"
    points: "100 Pts",
    description:
      "Build a production-grade e-commerce application using Next.js App Router, Server Actions, PostgreSQL with Prisma ORM, and integrated Stripe checkout webhooks.",
    starterFile: "ecommerce-capstone-rubric.pdf",
  },
  {
    id: "assign-pandas-pipeline",
    title: "Automated Financial Analysis Pipeline with Pandas",
    course: "Python & Data Science Bootcamp",
    instructor: {
      name: "Dr. Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    submittedDate: "Oct 16, 2026",
    status: "under-review",
    points: "50 Pts",
    description:
      "Clean raw S&P 500 stock dataset, handle missing ticker symbols, compute 30-day moving averages, and export clean metrics to PostgreSQL.",
    submittedRepo: "https://github.com/alexmorgan/pandas-financial-pipeline",
  },
  {
    id: "assign-react-tasks",
    title: "Interactive Task Kanban with Drag-and-Drop & Zustand",
    course: "Full Stack Web Development Masterclass",
    instructor: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    submittedDate: "Oct 05, 2026",
    status: "graded",
    grade: "98/100 (A+)",
    points: "100 Pts",
    feedback:
      "Outstanding work on the drag animation mechanics and optimistic state updates! Great accessibility tags on column drops. Code structure is clean and modular.",
    submittedRepo: "https://github.com/alexmorgan/kanban-react-zustand",
    demoUrl: "https://kanban-board-demo.vercel.app",
  },
  {
    id: "assign-figma-tokens",
    title: "Multi-Brand Design Tokens & Figma Variables System",
    course: "Advanced UI/UX Design System with Figma 2026",
    instructor: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    submittedDate: "Sep 25, 2026",
    status: "graded",
    grade: "95/100 (A)",
    points: "50 Pts",
    feedback:
      "Excellent token hierarchy for spacing, typography, and dark mode semantic colors. Well documented component variants.",
    demoUrl: "https://figma.com/@alexmorgan/design-tokens-v2",
  },
];

export default function StudentAssignmentsPage() {
  const [tab, setTab] = React.useState("all"); // "all" | "pending" | "under-review" | "graded"
  const [selectedAssignment, setSelectedAssignment] = React.useState(null);
  const [repoUrl, setRepoUrl] = React.useState("");
  const [demoUrl, setDemoUrl] = React.useState("");
  const [studentNotes, setStudentNotes] = React.useState("");
  const [uploadedFile, setUploadedFile] = React.useState(null);

  const filteredAssignments = ASSIGNMENTS.filter((item) => {
    if (tab === "all") return true;
    if (tab === "pending") return item.status === "pending-submission";
    if (tab === "under-review") return item.status === "under-review";
    if (tab === "graded") return item.status === "graded";
    return true;
  });

  const handleSubmitSolution = (e) => {
    e.preventDefault();
    if (!repoUrl && !uploadedFile) {
      toast.error("Please provide a repository link or upload a solution file.");
      return;
    }
    toast.success(`Solution for "${selectedAssignment.title}" submitted successfully!`);
    setSelectedAssignment(null);
    setRepoUrl("");
    setDemoUrl("");
    setStudentNotes("");
    setUploadedFile(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Coursework & Capstones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assignments & Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Submit your practical programming assignments, track review progress, and read instructor feedback.
          </p>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Projects</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">4</p>
          <p className="text-[11px] text-slate-500 mt-1">Required course assignments</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Needs Submission</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">1</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Due in 5 days</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Under Review</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-600 mt-2">1</p>
          <p className="text-[11px] text-slate-500 mt-1">Instructor reviewing code</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Grade</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">96.5%</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Grade A (Distinction)</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60">
        <button
          onClick={() => setTab("all")}
          className={cn(
            "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
            tab === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          All ({ASSIGNMENTS.length})
        </button>
        <button
          onClick={() => setTab("pending")}
          className={cn(
            "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
            tab === "pending" ? "bg-white text-amber-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Needs Submission (1)
        </button>
        <button
          onClick={() => setTab("under-review")}
          className={cn(
            "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
            tab === "under-review" ? "bg-white text-purple-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Under Review (1)
        </button>
        <button
          onClick={() => setTab("graded")}
          className={cn(
            "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
            tab === "graded" ? "bg-white text-emerald-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Graded (2)
        </button>
      </div>

      {/* Assignment Cards List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const isPending = assignment.status === "pending-submission";
          const isUnderReview = assignment.status === "under-review";
          const isGraded = assignment.status === "graded";

          return (
            <div
              key={assignment.id}
              className="bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 p-6 shadow-2xs transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {assignment.course}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-500">
                      Weight: {assignment.points}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {assignment.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {assignment.description}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due {assignment.dueDate}</span>
                    </span>
                  )}
                  {isUnderReview && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Under Review</span>
                    </span>
                  )}
                  {isGraded && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Graded: {assignment.grade}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Graded Feedback or Starter File */}
              {isGraded && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Avatar
                      src={assignment.instructor.avatar}
                      name={assignment.instructor.name}
                      size="xs"
                    />
                    <span>Instructor Feedback ({assignment.instructor.name})</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic">
                    "{assignment.feedback}"
                  </p>
                  <div className="flex items-center gap-4 pt-1 text-slate-500">
                    {assignment.submittedRepo && (
                      <a
                        href={assignment.submittedRepo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Submitted Code</span>
                      </a>
                    )}
                    {assignment.demoUrl && (
                      <a
                        href={assignment.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  {assignment.starterFile && (
                    <button
                      onClick={() => toast.success(`Downloading ${assignment.starterFile}`)}
                      className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Project Brief ({assignment.starterFile})</span>
                    </button>
                  )}
                  {isUnderReview && (
                    <span className="text-slate-400">
                      Submitted on {assignment.submittedDate} • Review pending
                    </span>
                  )}
                </div>

                <div>
                  {isPending ? (
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Submit Solution</span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        toast.info(`Viewing submission history for: ${assignment.title}`)
                      }
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                    >
                      View Submission Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Assignment Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Submit Assignment
                </span>
                <h3 className="text-base font-bold text-slate-900 truncate max-w-sm mt-0.5">
                  {selectedAssignment.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSolution} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  GitHub Repository URL *
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://github.com/username/project-repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Live Hosted URL (Vercel, Netlify, Render)
                </label>
                <div className="relative">
                  <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://my-app.vercel.app"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Attach Solution ZIP Archive (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700">
                    {uploadedFile ? uploadedFile.name : "Click or drag archive to attach (.zip, .tar, .pdf)"}
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setUploadedFile(e.target.files[0]);
                        toast.success("File attached: " + e.target.files[0].name);
                      }
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    className="text-[11px] text-blue-600 hover:underline font-bold mt-1 inline-block cursor-pointer"
                  >
                    Browse Local File
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Notes for Instructor / Reviewer
                </label>
                <textarea
                  rows={3}
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="Mention any bonus features implemented or instructions to test database..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
                >
                  Submit Final Solution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
