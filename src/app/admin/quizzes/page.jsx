"use client";

import * as React from "react";
import { Lightbulb, Plus, CheckCircle2, Clock } from "lucide-react";

export default function AdminQuizzesPage() {
  const quizzes = [
    {
      id: 1,
      title: "JavaScript Fundamentals & ES6",
      course: "Full Stack Web Development",
      attempts: 420,
      passingRate: "88%",
      questions: 25,
      status: "Published",
    },
    {
      id: 2,
      title: "Data Visualization Quiz",
      course: "Data Science & AI",
      attempts: 310,
      passingRate: "82%",
      questions: 15,
      status: "Published",
    },
    {
      id: 3,
      title: "Figma Prototyping Assessment",
      course: "UI/UX Design Masterclass",
      attempts: 195,
      passingRate: "91%",
      questions: 20,
      status: "Draft",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quizzes & Assessments</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor quiz engagement, review questions, passing rates, and student results.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all">
          <Plus className="w-4 h-4" />
          <span>New Quiz</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
        <div className="divide-y divide-slate-100">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{quiz.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{quiz.course}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    {quiz.attempts} student attempts
                  </span>
                  <span>•</span>
                  <span>Pass Rate: {quiz.passingRate}</span>
                  <span>•</span>
                  <span>{quiz.questions} Questions</span>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                quiz.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
              }`}>
                {quiz.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
