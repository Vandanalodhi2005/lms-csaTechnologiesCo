"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  PlayCircle,
  Award,
  Clock,
  Flame,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Calendar,
  User,
  Star,
  FileText,
} from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-blue-500/10">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to EduLearn</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to continue learning, Alex?
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            You've completed 78% of your Full Stack Web Development course. Keep up the 14-day study streak!
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/student/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm shadow-md hover:bg-blue-50 transition-all"
            >
              <User className="w-4 h-4" />
              <span>View Profile & Transcripts</span>
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-all"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">3</p>
          <p className="text-xs text-slate-500 mt-0.5">Active Courses</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 tracking-tight">2</p>
          <p className="text-xs text-slate-500 mt-0.5">Completed Courses</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 tracking-tight">14 Days</p>
          <p className="text-xs text-slate-500 mt-0.5">Current Streak</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-purple-600 tracking-tight">3</p>
          <p className="text-xs text-slate-500 mt-0.5">Certificates Earned</p>
        </div>
      </div>

      {/* Main Grid: In-progress courses & Upcoming events */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): In Progress Courses */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  In Progress Courses
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick up right where you left off.
                </p>
              </div>
              <Link href="/student/profile?tab=courses" className="text-xs font-semibold text-blue-600 hover:underline">
                View all →
              </Link>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    Web Development
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Full Stack Web Development Masterclass
                  </h3>
                  <p className="text-xs text-slate-500">Next: React Server Components & Suspense</p>
                  <div className="w-48 h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: "78%" }} />
                  </div>
                </div>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-950 hover:bg-black text-white rounded-xl text-xs font-semibold shrink-0">
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    Data Science
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Python & Data Science Bootcamp
                  </h3>
                  <p className="text-xs text-slate-500">Next: Data Cleaning with Pandas</p>
                  <div className="w-48 h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-950 hover:bg-black text-white rounded-xl text-xs font-semibold shrink-0">
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Deadlines & Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Upcoming Deadlines
            </h2>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-3">
                <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-slate-900">React Hooks Exercise</p>
                  <p className="text-slate-500">Due Tomorrow, 11:59 PM</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-3">
                <FileText className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-slate-900">Data Cleaning Quiz</p>
                  <p className="text-slate-500">Due Oct 24, 2026</p>
                </div>
              </div>
            </div>

            <Link
              href="/student/profile"
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors block text-center"
            >
              <span>Manage Student Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
