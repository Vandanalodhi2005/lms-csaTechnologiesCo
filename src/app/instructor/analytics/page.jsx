"use client";

import * as React from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Users,
  PlayCircle,
  Clock,
  Award,
  Calendar,
  Download,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Filter,
} from "lucide-react";
import { cn } from "@/utils";
import { toast } from "sonner";

export default function InstructorAnalyticsPage() {
  const [timeframe, setTimeframe] = React.useState("6m"); // "30d" | "3m" | "6m" | "1y"

  const monthlyEnrollments = [
    { month: "May", count: 180, revenue: 142000 },
    { month: "Jun", count: 240, revenue: 188000 },
    { month: "Jul", count: 310, revenue: 245000 },
    { month: "Aug", count: 280, revenue: 220000 },
    { month: "Sep", count: 390, revenue: 310000 },
    { month: "Oct", count: 480, revenue: 382000 },
  ];

  const maxEnroll = Math.max(...monthlyEnrollments.map((m) => m.count));

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Telemetry & Insights</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Teaching & Enrollment Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Measure lecture completion funnels, monthly revenue velocity, and learner retention rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-bold">
            {["30d", "3m", "6m", "1y"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={cn(
                  "px-3 py-1 rounded-lg uppercase transition-all",
                  timeframe === t ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => toast.success("Exporting full analytics report PDF...")}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Download Report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Enrollments</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">2,548</p>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +23.8% vs last period
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Hours Streamed</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-600 mt-2">18,420 Hrs</p>
          <p className="text-[11px] text-slate-500 mt-1">Total student watch time</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg Completion</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">78.4%</p>
          <p className="text-[11px] text-slate-500 mt-1">Industry avg is 38%</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Net Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-600 mt-2">₹14,87,000</p>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% this quarter
          </p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Monthly Enrollment Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Enrollment & Revenue Growth Trend
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                New students enrolling per month across all your active courses.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Strong Trajectory
            </span>
          </div>

          {/* Bar visualization */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-slate-100">
            {monthlyEnrollments.map((item) => {
              const heightPercent = Math.round((item.count / maxEnroll) * 100);

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                    {item.count}
                  </div>
                  <div className="w-full bg-slate-100 rounded-t-xl h-44 flex items-end overflow-hidden p-1">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-sky-500 rounded-t-lg group-hover:from-blue-700 group-hover:to-sky-400 transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 mt-1">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Peak Month</span>
              <span className="font-extrabold text-slate-900 text-sm">October (480)</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Avg / Month</span>
              <span className="font-extrabold text-slate-900 text-sm">313 Students</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Conversion Rate</span>
              <span className="font-extrabold text-emerald-600 text-sm">8.2% Visit-to-Enroll</span>
            </div>
          </div>
        </div>

        {/* Student Completion Funnel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Student Completion Funnel</h3>
            <p className="text-xs text-slate-500 mt-0.5">Where students succeed or drop off.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800">1. Enrolled & Opened Course</span>
                <span className="font-bold text-blue-600">100%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800">2. Completed Module 1</span>
                <span className="font-bold text-indigo-600">94%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-[94%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800">3. Passed Midterm Quiz</span>
                <span className="font-bold text-purple-600">81%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full w-[81%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800">4. Submitted Final Capstone</span>
                <span className="font-bold text-emerald-600">68%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full w-[68%]" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 space-y-1">
            <span className="font-bold">Insight: High Retention</span>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Your 68% graduation rate is nearly 3x higher than industry average (22%). Students stay engaged through Module 3.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
