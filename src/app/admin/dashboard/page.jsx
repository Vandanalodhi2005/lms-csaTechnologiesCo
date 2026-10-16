"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Clock,
  ScreenShare,
  TrendingUp,
  TrendingDown,
  Sparkles,
  FileText,
  Star,
  ChevronDown,
  ArrowUpDown,
  Layers,
  HelpCircle,
  Award,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar.jsx";

// Initial engagement data
const initialEngagementData = [
  { course: "Web Development", enrollments: 450, completionRate: 75, avgQuizScore: 85 },
  { course: "Data Science", enrollments: 350, completionRate: 68, avgQuizScore: 85 },
  { course: "Mobile App Development", enrollments: 280, completionRate: 82, avgQuizScore: 90 },
  { course: "Machine Learning", enrollments: 500, completionRate: 90, avgQuizScore: 92 },
  { course: "UI/UX Design", enrollments: 600, completionRate: 76, avgQuizScore: 88 },
  { course: "Cloud Computing", enrollments: 720, completionRate: 85, avgQuizScore: 76 },
  { course: "Cybersecurity", enrollments: 430, completionRate: 63, avgQuizScore: 95 },
  { course: "Game Development", enrollments: 390, completionRate: 79, avgQuizScore: 89 },
];

const chartBars = [
  { label: "Web Development", value: 270, heightPercent: 45, enrollment: 270 },
  { label: "Data Science", value: 240, heightPercent: 40, enrollment: 240 },
  { label: "UX Design", value: 485, heightPercent: 81, enrollment: 485, isHighlighted: true },
  { label: "Python Basics", value: 300, heightPercent: 50, enrollment: 300 },
  { label: "Digital Marketing", value: 360, heightPercent: 60, enrollment: 360 },
];

const initialActivities = [
  {
    id: 1,
    type: "course_update",
    title: "Updated Course",
    actor: "Dr. Robert Chen",
    target: "Advanced Data Structures",
    time: "10 min ago",
    starred: false,
    avatarSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    type: "submission",
    title: "Submitted Assignment",
    actor: "Raki Johnson",
    target: "React Hooks Exercise",
    extra: "Submission score: 92/100",
    time: "30 min ago",
    starred: false,
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    type: "enrollment",
    title: "Enrolled in",
    isNew: true,
    actor: "Tim Baker",
    target: "Python for Beginners",
    time: "4 hours ago",
    starred: true,
    avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
];

export default function AdminDashboardPage() {
  const [activeBar, setActiveBar] = React.useState("UX Design");
  const [selectedPeriod, setSelectedPeriod] = React.useState("This Month");
  const [periodDropdownOpen, setPeriodDropdownOpen] = React.useState(false);
  const [activityTab, setActivityTab] = React.useState("All");
  const [activities, setActivities] = React.useState(initialActivities);

  // Sorting state for table
  const [sortField, setSortField] = React.useState(null);
  const [sortAsc, setSortAsc] = React.useState(true);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedEngagementData = React.useMemo(() => {
    if (!sortField) return initialEngagementData;
    return [...initialEngagementData].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [sortField, sortAsc]);

  const toggleStar = (id) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, starred: !act.starred } : act))
    );
  };

  const filteredActivities = React.useMemo(() => {
    if (activityTab === "All") return activities;
    if (activityTab === "Enrollments") return activities.filter((a) => a.type === "enrollment");
    if (activityTab === "Submissions") return activities.filter((a) => a.type === "submission");
    if (activityTab === "Course Updates") return activities.filter((a) => a.type === "course_update");
    return activities;
  }, [activityTab, activities]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Welcome Greeting */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">
          Welcome back, Chelsea
        </h1>
      </div>

      {/* Top 4 Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Instructors */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex items-center gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-sm">
            <ScreenShare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Instructors</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5 tracking-tight">
              128
            </p>
          </div>
        </div>

        {/* Card 2: Active Students */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex items-center gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#22C55E] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Active Students</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5 tracking-tight">
              4,532
            </p>
          </div>
        </div>

        {/* Card 3: Courses Published */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex items-center gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Courses Published</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5 tracking-tight">
              67
            </p>
          </div>
        </div>

        {/* Card 4: Pending Submissions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex items-center gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#F87171] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Pending Submissions</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5 tracking-tight">
              152
            </p>
          </div>
        </div>
      </section>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (approx 62%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Top Engaged Courses */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Top Engaged Courses
              </h2>

              <div className="relative">
                <button
                  onClick={() => setPeriodDropdownOpen((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors"
                >
                  <span>{selectedPeriod}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {periodDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 animate-fadeIn">
                    {["This Month", "Last Month", "This Year"].map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setSelectedPeriod(period);
                          setPeriodDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bar Chart Area */}
            <div className="relative pt-12 pb-6">
              {/* Y-axis guidelines */}
              <div className="absolute inset-x-0 top-12 bottom-12 flex flex-col justify-between pointer-events-none">
                {[600, 450, 300, 150, 0].map((val) => (
                  <div key={val} className="relative flex items-center">
                    <span className="w-9 text-right text-[11px] font-medium text-slate-400 select-none pr-3">
                      {val}
                    </span>
                    <div className="flex-1 border-b border-dashed border-slate-100" />
                  </div>
                ))}
              </div>

              {/* Bars container */}
              <div className="relative ml-10 h-64 flex items-end justify-around pt-6">
                {chartBars.map((bar) => {
                  const isSelected = activeBar === bar.label;
                  return (
                    <div
                      key={bar.label}
                      onClick={() => setActiveBar(bar.label)}
                      className="group relative flex flex-col items-center cursor-pointer h-full justify-end px-2"
                    >
                      {/* Floating Tooltip if selected */}
                      {isSelected && (
                        <div className="absolute bottom-[83%] z-20 flex flex-col items-center animate-fadeIn pointer-events-none mb-1">
                          <div className="bg-white rounded-xl shadow-xl border border-slate-100 px-3 py-2 text-center whitespace-nowrap min-w-[100px]">
                            <p className="text-[11px] font-semibold text-slate-800">
                              {bar.label}
                            </p>
                            <span className="inline-block mt-1 bg-[#0284C7] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              Enrollment: {bar.enrollment}
                            </span>
                          </div>
                          {/* Triangle pointer */}
                          <div className="w-2.5 h-2.5 bg-white border-r border-b border-slate-100 rotate-45 -mt-1.5 shadow-xs" />
                        </div>
                      )}

                      {/* Bar Pillar */}
                      <div
                        style={{ height: `${bar.heightPercent}%` }}
                        className={`w-11 sm:w-14 rounded-t-xl transition-all duration-300 relative ${
                          isSelected
                            ? "bg-gradient-to-t from-[#0284C7] to-[#38BDF8] shadow-[0_4px_12px_rgba(2,132,199,0.3)] ring-2 ring-[#0284C7]/20"
                            : "bg-[#E0F2FE] hover:bg-[#BAE6FD]"
                        }`}
                      />

                      {/* X-axis label */}
                      <span className="mt-3 text-[11px] sm:text-xs font-medium text-slate-500 whitespace-nowrap text-center">
                        {bar.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Amount & Trend */}
            <div className="pt-2 border-t border-slate-100/80">
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                $750,000
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-[#16A34A]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>10.3% Last 30 Days</span>
              </div>
            </div>
          </div>

          {/* Card 2: Engagement Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h2 className="text-base font-bold text-slate-900 tracking-tight mb-4">
              Engagement Breakdown
            </h2>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left border-collapse min-w-[560px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 select-none">
                    <th
                      onClick={() => handleSort("course")}
                      className="pb-3 pr-4 cursor-pointer hover:text-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Course</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-300" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("enrollments")}
                      className="pb-3 px-4 cursor-pointer hover:text-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Enrollments</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-300" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("completionRate")}
                      className="pb-3 px-4 cursor-pointer hover:text-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Completion Rate</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-300" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("avgQuizScore")}
                      className="pb-3 pl-4 cursor-pointer hover:text-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Avg Quiz Score</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-300" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 text-xs sm:text-sm">
                  {sortedEngagementData.map((row) => (
                    <tr
                      key={row.course}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-3.5 pr-4 font-medium text-slate-800 whitespace-nowrap">
                        {row.course}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {row.enrollments}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {row.completionRate}%
                      </td>
                      <td className="py-3.5 pl-4 text-slate-600 whitespace-nowrap font-medium">
                        {row.avgQuizScore} / 100
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (approx 38%) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Activity
            </h2>

            {/* AI Summary Banner */}
            <div className="mt-2.5 flex items-start gap-1.5 text-xs text-[#2563EB] font-medium leading-relaxed">
              <Sparkles className="w-4 h-4 shrink-0 text-[#2563EB] mt-0.5" />
              <span>
                <strong className="font-semibold">AI Summary:</strong> 2 submissions, 1 new student, 2 course updates
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-4 border-b border-slate-100 mt-4 overflow-x-auto scrollbar-none text-xs font-semibold text-slate-400">
              {["All", "Enrollments", "Submissions", "Course Updates"].map((tab) => {
                const isActive = activityTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActivityTab(tab)}
                    className={`pb-2.5 whitespace-nowrap transition-colors relative ${
                      isActive
                        ? "text-slate-900 font-bold border-b-2 border-blue-600"
                        : "hover:text-slate-700"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Activity List */}
            <div className="mt-4 divide-y divide-slate-100/70">
              {filteredActivities.map((act) => (
                <div key={act.id} className="py-3.5 first:pt-1 last:pb-1 flex items-start gap-3">
                  <Avatar
                    src={act.avatarSrc}
                    name={act.actor}
                    size="md"
                    className="shrink-0 mt-0.5 rounded-full"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {act.title}
                      </p>
                      {act.isNew && (
                        <span className="text-[10px] font-semibold text-blue-600 border border-blue-200 px-1.5 py-0.2 rounded">
                          ☆ New
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      <span>{act.actor} → </span>
                      <span className="text-[#10B981] font-semibold hover:underline cursor-pointer">
                        {act.target}
                      </span>
                    </p>

                    {act.extra && (
                      <p className="text-xs text-slate-400 mt-0.5">{act.extra}</p>
                    )}

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{act.time}</span>
                    </div>
                  </div>

                  {/* Actions on right */}
                  <div className="flex items-center gap-1 text-slate-400 shrink-0 self-center">
                    <button
                      className="p-1 hover:text-slate-600 hover:bg-slate-50 rounded"
                      title="View file"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleStar(act.id)}
                      className="p-1 hover:text-amber-500 rounded transition-colors"
                      title={act.starred ? "Unstar" : "Star"}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          act.starred
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 hover:text-slate-500"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Assignment & Quiz Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h2 className="text-base font-bold text-slate-900 tracking-tight mb-5">
              Assignment & Quiz Overview
            </h2>

            <div className="space-y-5">
              {/* Metric 1: Total Assignments */}
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Total Assignments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">243 / 300</span>
                    <span className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      10.3% +12 this week
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                    style={{ width: `${(243 / 300) * 100}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: Quiz Engagement */}
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <span>Quiz Engagement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">1872 / 4532</span>
                    <span className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      10.3%
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#3B82F6] rounded-full transition-all duration-500"
                    style={{ width: `${(1872 / 4532) * 100}%` }}
                  />
                </div>
              </div>

              {/* Metric 3: Pending Grading */}
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Pending Grading</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">57 / 243</span>
                    <span className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      10.3%
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#F97316] rounded-full transition-all duration-500"
                    style={{ width: `${(57 / 243) * 100}%` }}
                  />
                </div>
              </div>

              {/* Metric 4: Average Score */}
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span>Average Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">78.5%</span>
                    <span className="text-[11px] font-semibold text-[#EF4444] flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" />
                      N/A -2% this week
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#EF4444] rounded-full transition-all duration-500"
                    style={{ width: "78.5%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
