"use client";

import * as React from "react";
import Link from "next/link";
import {
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  ThumbsUp,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  User,
} from "lucide-react";
import { cn } from "@/utils";
import Avatar from "@/components/ui/Avatar.jsx";
import { toast } from "sonner";

const INITIAL_THREADS = [
  {
    id: "qna-1",
    student: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    course: "Python & Data Science Bootcamp",
    lesson: "Lesson 4.3: Pandas Resample & Time Series Offsets",
    timestamp: "45 minutes ago",
    status: "unanswered",
    title: "How to handle missing timestamp intervals when resampling daily stock data to hourly?",
    question:
      "When running df.resample('1H').mean(), days where the exchange was closed create long blocks of NaN values. Should we use forward-fill (ffill) or interpolation for financial metrics?",
    replies: [],
  },
  {
    id: "qna-2",
    student: {
      name: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    course: "Full Stack Web Development Masterclass",
    lesson: "Lesson 3.2: Streaming with Suspense in Next.js 14",
    timestamp: "2 hours ago",
    status: "unanswered",
    title: "Can Suspense boundaries be nested within parallel slot routes?",
    question:
      "I have a modal route @modal that also streams user comments. If the modal takes 1 second to fetch, does it delay the parent page layout from rendering?",
    replies: [],
  },
  {
    id: "qna-3",
    student: {
      name: "Sophie Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    course: "Advanced UI/UX Design System with Figma 2026",
    lesson: "Lesson 2.1: Figma Variables & Semantic Color Tokens",
    timestamp: "Yesterday",
    status: "answered",
    title: "What is the recommended hierarchy for dark mode variable aliasing?",
    question:
      "Should we create a dedicated 'Surface' collection or alias light/dark modes directly on the Primitive colors?",
    replies: [
      {
        author: "Dr. Marcus Chen",
        isInstructor: true,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        timestamp: "Yesterday at 06:15 PM",
        text: "Always decouple primitives from semantics! Define Primitive Colors (e.g. Slate-900) first, then create Semantic Tokens (e.g. bg-surface-primary = light: white, dark: Slate-900). This keeps your component library clean.",
      },
    ],
  },
];

export default function InstructorQnAPage() {
  const [threads, setThreads] = React.useState(INITIAL_THREADS);
  const [filter, setFilter] = React.useState("unanswered"); // "unanswered" | "all"
  const [replyInputs, setReplyInputs] = React.useState({});

  const filteredThreads = threads.filter((t) => {
    if (filter === "unanswered") return t.status === "unanswered";
    return true;
  });

  const handleReplyChange = (id, val) => {
    setReplyInputs((prev) => ({ ...prev, [id]: val }));
  };

  const handlePostReply = (threadId) => {
    const text = replyInputs[threadId];
    if (!text?.trim()) return;

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            status: "answered",
            replies: [
              ...t.replies,
              {
                author: "Dr. Marcus Chen",
                isInstructor: true,
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
                timestamp: "Just now",
                text: text.trim(),
              },
            ],
          };
        }
        return t;
      })
    );

    setReplyInputs((prev) => ({ ...prev, [threadId]: "" }));
    toast.success("Instructor response published to student discussion!");
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Community Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Course Q&A & Support Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Resolve student blockers, clarify technical concepts, and build strong community rapport.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Unanswered</span>
          <p className="text-2xl font-black text-amber-600 mt-2">2 Questions</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Needs teacher reply</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Resolved Total</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">142 Threads</p>
          <p className="text-[11px] text-slate-500 mt-1">Across all your courses</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Avg Response Time</span>
          <p className="text-2xl font-black text-blue-600 mt-2">2.4 Hrs</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Top 5% speed badge</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Student Satisfaction</span>
          <p className="text-2xl font-black text-purple-600 mt-2">99%</p>
          <p className="text-[11px] text-purple-700 font-medium mt-1">Helpful answers rating</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60">
        <button
          onClick={() => setFilter("unanswered")}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold transition-all",
            filter === "unanswered"
              ? "bg-white text-amber-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          Unanswered ({threads.filter((t) => t.status === "unanswered").length})
        </button>
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold transition-all",
            filter === "all"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          All Discussions ({threads.length})
        </button>
      </div>

      {/* Threads List */}
      <div className="space-y-6">
        {filteredThreads.map((thread) => (
          <div
            key={thread.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Avatar src={thread.student.avatar} name={thread.student.name} size="sm" />
                <div>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    {thread.student.name}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {thread.course} • <span className="text-blue-600">{thread.lesson}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400 font-medium">{thread.timestamp}</span>
                {thread.status === "unanswered" ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Awaiting Reply
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Resolved
                  </span>
                )}
              </div>
            </div>

            {/* Question body */}
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                {thread.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {thread.question}
              </p>
            </div>

            {/* Previous Replies */}
            {thread.replies.length > 0 && (
              <div className="space-y-3 pt-2">
                {thread.replies.map((reply, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100/80 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar src={reply.avatar} name={reply.author} size="xs" />
                        <span className="font-bold text-blue-950">{reply.author}</span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[9px] uppercase">
                          Instructor
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{reply.timestamp}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{reply.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Box */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <textarea
                rows={2}
                value={replyInputs[thread.id] || ""}
                onChange={(e) => handleReplyChange(thread.id, e.target.value)}
                placeholder="Write your official instructor answer here..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => handlePostReply(thread.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-blue-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Instructor Reply</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
