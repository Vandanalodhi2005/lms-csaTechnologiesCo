"use client";

import * as React from "react";
import { ClipboardList, Plus, Search, Filter, CheckCircle2, Clock } from "lucide-react";

export default function AdminAssignmentsPage() {
  const assignments = [
    {
      id: 1,
      title: "React Hooks Exercise",
      course: "Full Stack Web Development",
      submissions: "142 / 180",
      dueDate: "Tomorrow, 11:59 PM",
      status: "Active",
    },
    {
      id: 2,
      title: "Data Cleaning with Pandas",
      course: "Data Science & AI",
      submissions: "98 / 120",
      dueDate: "Oct 24, 2026",
      status: "Active",
    },
    {
      id: 3,
      title: "Mobile App Wireframing",
      course: "UI/UX Design Masterclass",
      submissions: "75 / 80",
      dueDate: "Oct 28, 2026",
      status: "Reviewing",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assignments</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage course assignments, student submissions, and grading schedules.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all">
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
        <div className="divide-y divide-slate-100">
          {assignments.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.course}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {item.submissions} submissions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Due {item.dueDate}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
