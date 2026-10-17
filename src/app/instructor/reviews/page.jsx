"use client";

import * as React from "react";
import Link from "next/link";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Filter,
  Search,
  CheckCircle2,
  Share2,
  X,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/utils";
import Avatar from "@/components/ui/Avatar.jsx";
import { toast } from "sonner";

const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    student: {
      name: "Lucas Bennett",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    },
    course: "Python & Data Science Bootcamp",
    rating: 5,
    date: "2 days ago",
    title: "Best data science course on the platform by far!",
    content:
      "Dr. Marcus explains complex pandas aggregations and time-series concepts in a way that just clicks. The real-world stock analysis capstone was directly relevant to my job interviews.",
    reply: "Thanks Lucas! Really proud of your final project presentation and wishing you the best with your interviews!",
    replyDate: "Yesterday",
  },
  {
    id: "rev-2",
    student: {
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    },
    course: "Full Stack Web Development Masterclass",
    rating: 5,
    date: "4 days ago",
    title: "In-depth explanations of React 18 and Next.js 14",
    content:
      "The coverage of server components vs client boundaries cleared up all confusion I had previously. Highly recommend to any aspiring full stack developer.",
    reply: null,
  },
  {
    id: "rev-3",
    student: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    course: "Python & Data Science Bootcamp",
    rating: 4,
    date: "1 week ago",
    title: "Comprehensive curriculum, slightly fast pace in module 4",
    content:
      "Loved the statistics and data cleaning modules. Module 4 on machine learning models moves very fast, so definitely rewatch the lectures twice.",
    reply: "Great feedback David! I'm preparing an extra bonus module on ML hyperparameters to bridge that gap.",
    replyDate: "6 days ago",
  },
];

export default function InstructorReviewsPage() {
  const [reviews, setReviews] = React.useState(INITIAL_REVIEWS);
  const [selectedCourse, setSelectedCourse] = React.useState("all");
  const [replyTarget, setReplyTarget] = React.useState(null);
  const [replyText, setReplyText] = React.useState("");

  const filteredReviews = reviews.filter((r) => {
    if (selectedCourse === "all") return true;
    return r.course === selectedCourse;
  });

  const handlePostReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === replyTarget.id
          ? { ...r, reply: replyText.trim(), replyDate: "Just now" }
          : r
      )
    );
    toast.success(`Public reply posted to ${replyTarget.student.name}'s review!`);
    setReplyTarget(null);
    setReplyText("");
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Ratings & Testimonials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Reviews & Course Feedback
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor course reputation, learn from student suggestions, and engage via public instructor responses.
          </p>
        </div>
      </div>

      {/* Rating Breakdown & Summary Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Rating Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4 text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Overall Instructor Rating
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl font-black text-slate-900">4.9</span>
            <div className="text-left">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Based on 1,842 reviews</p>
            </div>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-left">
            <div className="flex items-center gap-3">
              <span className="w-12 font-semibold text-slate-600">5 Stars</span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: "92%" }} />
              </div>
              <span className="w-8 text-right font-bold text-slate-900">92%</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-12 font-semibold text-slate-600">4 Stars</span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: "6%" }} />
              </div>
              <span className="w-8 text-right font-bold text-slate-900">6%</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-12 font-semibold text-slate-600">3 Stars</span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: "2%" }} />
              </div>
              <span className="w-8 text-right font-bold text-slate-900">2%</span>
            </div>
          </div>
        </div>

        {/* Reviews Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Course Filter */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Filter by Course:</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Courses (3)</option>
              <option value="Python & Data Science Bootcamp">Python & Data Science Bootcamp</option>
              <option value="Full Stack Web Development Masterclass">Full Stack Web Development</option>
            </select>
          </div>

          {/* List */}
          <div className="space-y-4">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={rev.student.avatar} name={rev.student.name} size="sm" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{rev.student.name}</h4>
                      <p className="text-[11px] text-blue-600 font-semibold">{rev.course}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{rev.date}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h5 className="font-bold text-slate-900 text-sm">{rev.title}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.content}</p>
                </div>

                {/* Existing Reply */}
                {rev.reply && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-700">Dr. Marcus Chen (Instructor)</span>
                      <span className="text-[10px] text-slate-400">{rev.replyDate}</span>
                    </div>
                    <p className="text-slate-700 italic">"{rev.reply}"</p>
                  </div>
                )}

                {/* Action button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setReplyTarget(rev);
                      setReplyText(rev.reply || "");
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>{rev.reply ? "Edit Reply" : "Reply to Review"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {replyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Reply to {replyTarget.student.name}
              </h3>
              <button
                onClick={() => setReplyTarget(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostReply} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 italic">
                "{replyTarget.content}"
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Public Instructor Response *
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank the student and address any specific questions raised..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Publish Public Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
