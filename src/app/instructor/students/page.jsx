"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Mail,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  Download,
  Send,
  X,
  BookOpen,
  Award,
  Sparkles,
} from "lucide-react";
import { cn } from "@/utils";
import Avatar from "@/components/ui/Avatar.jsx";
import { toast } from "sonner";

const INITIAL_STUDENTS = [
  {
    id: "stu-1",
    name: "Alex Morgan",
    email: "alex.morgan@edulearn.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    course: "Full Stack Web Development Masterclass",
    progress: 78,
    quizzesCompleted: "5/6",
    assignmentsSubmitted: "3/4",
    lastActive: "2 hours ago",
    status: "active",
    joinedDate: "Sep 10, 2026",
  },
  {
    id: "stu-2",
    name: "David Kim",
    email: "david.kim@techcorp.io",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    course: "Python & Data Science Bootcamp",
    progress: 92,
    quizzesCompleted: "8/8",
    assignmentsSubmitted: "5/5",
    lastActive: "15 mins ago",
    status: "active",
    joinedDate: "Aug 15, 2026",
  },
  {
    id: "stu-3",
    name: "Sophie Chen",
    email: "sophie.chen@designlab.org",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    course: "Advanced UI/UX Design System with Figma 2026",
    progress: 100,
    quizzesCompleted: "6/6",
    assignmentsSubmitted: "4/4",
    lastActive: "Yesterday",
    status: "completed",
    joinedDate: "Jul 20, 2026",
  },
  {
    id: "stu-4",
    name: "James Wilson",
    email: "james.wilson@university.edu",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    course: "Python & Data Science Bootcamp",
    progress: 18,
    quizzesCompleted: "1/8",
    assignmentsSubmitted: "0/5",
    lastActive: "12 days ago",
    status: "at-risk",
    joinedDate: "Sep 25, 2026",
  },
  {
    id: "stu-5",
    name: "Emily Rodriguez",
    email: "emily.r@cloudscale.net",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    course: "Full Stack Web Development Masterclass",
    progress: 64,
    quizzesCompleted: "4/6",
    assignmentsSubmitted: "2/4",
    lastActive: "3 hours ago",
    status: "active",
    joinedDate: "Sep 01, 2026",
  },
  {
    id: "stu-6",
    name: "Lucas Bennett",
    email: "lucas.bennett@startup.dev",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    course: "Advanced UI/UX Design System with Figma 2026",
    progress: 100,
    quizzesCompleted: "6/6",
    assignmentsSubmitted: "4/4",
    lastActive: "4 days ago",
    status: "completed",
    joinedDate: "Aug 02, 2026",
  },
];

export default function InstructorStudentsPage() {
  const [students] = React.useState(INITIAL_STUDENTS);
  const [search, setSearch] = React.useState("");
  const [selectedCourse, setSelectedCourse] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all"); // "all" | "active" | "completed" | "at-risk"
  const [messageTarget, setMessageTarget] = React.useState(null);
  const [messageText, setMessageText] = React.useState("");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());
    const matchesCourse =
      selectedCourse === "all" ? true : student.course === selectedCourse;
    const matchesStatus =
      selectedStatus === "all" ? true : student.status === selectedStatus;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    toast.success(`Direct message dispatched to ${messageTarget.name}!`);
    setMessageTarget(null);
    setMessageText("");
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Classroom Roster</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Management & Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor student completion velocity, identify at-risk learners, and send direct academic feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.success("Exporting active roster to CSV...")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Roster CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Enrolled</span>
          <p className="text-2xl font-black text-slate-900 mt-2">1,248</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">+142 this month</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Active Learners</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">842</p>
          <p className="text-[11px] text-slate-500 mt-1">Studied in last 7 days</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">At-Risk Learners</span>
          <p className="text-2xl font-black text-amber-600 mt-2">24</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Inactive &gt; 10 days</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Graduates</span>
          <p className="text-2xl font-black text-purple-600 mt-2">312</p>
          <p className="text-[11px] text-purple-700 font-medium mt-1">100% Course completed</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter pills */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60 text-xs">
            {["all", "active", "completed", "at-risk"].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold capitalize transition-all",
                  selectedStatus === s
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {s === "all" ? "All Students" : s}
              </button>
            ))}
          </div>

          {/* Course dropdown */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Courses</option>
            <option value="Full Stack Web Development Masterclass">Full Stack Web Dev</option>
            <option value="Python & Data Science Bootcamp">Python & Data Science</option>
            <option value="Advanced UI/UX Design System with Figma 2026">UI/UX Design System</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Enrolled Course</th>
                <th className="py-3.5 px-4">Progress</th>
                <th className="py-3.5 px-4">Quizzes</th>
                <th className="py-3.5 px-4">Assignments</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Student profile */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={student.avatar} name={student.name} size="sm" />
                      <div>
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">{student.name}</p>
                        <p className="text-[11px] text-slate-400">{student.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]">
                      {student.course}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Enrolled: {student.joinedDate}
                    </span>
                  </td>

                  {/* Progress bar */}
                  <td className="py-3.5 px-4 min-w-[130px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{student.progress}%</span>
                        <span
                          className={cn(
                            "font-bold uppercase text-[9px]",
                            student.status === "completed"
                              ? "text-emerald-600"
                              : student.status === "at-risk"
                              ? "text-amber-600"
                              : "text-blue-600"
                          )}
                        >
                          {student.status}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            student.status === "completed"
                              ? "bg-emerald-500"
                              : student.status === "at-risk"
                              ? "bg-amber-500"
                              : "bg-blue-600"
                          )}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Quizzes */}
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {student.quizzesCompleted}
                  </td>

                  {/* Assignments */}
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {student.assignmentsSubmitted}
                  </td>

                  {/* Last Active */}
                  <td className="py-3.5 px-4 text-slate-500">
                    {student.lastActive}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setMessageTarget(student)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Message Modal */}
      {messageTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Avatar src={messageTarget.avatar} name={messageTarget.name} size="sm" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Message {messageTarget.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">{messageTarget.email}</p>
                </div>
              </div>
              <button
                onClick={() => setMessageTarget(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Regarding Course
                </label>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {messageTarget.course}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Hi Alex, I noticed you've been making great progress on Module 3..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMessageTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
