"use client";

import * as React from "react";
import Link from "next/link";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/utils";
import { toast } from "sonner";

const QUIZZES = [
  {
    id: "quiz-next-deep-dive",
    title: "Next.js 14 App Router & RSC Deep Dive",
    course: "Full Stack Web Development Masterclass",
    questionsCount: 15,
    durationMinutes: 20,
    passingScore: 80,
    status: "pending",
    dueDate: "Oct 24, 2026",
    attemptsLeft: 2,
    difficulty: "Intermediate",
    sampleQuestions: [
      {
        question: "Which of the following is true regarding React Server Components (RSC) in Next.js 14?",
        options: [
          "They increase client-side JavaScript bundle size proportionally.",
          "They execute solely on the server and stream lightweight HTML to the client.",
          "They cannot fetch data directly from databases without API endpoints.",
          "They require the 'use client' directive at the top of the file.",
        ],
        correctIndex: 1,
      },
      {
        question: "What is the primary function of the 'loading.jsx' convention in Next.js?",
        options: [
          "Automatically wrap the page route in a React Suspense boundary with fallback.",
          "Preload all CSS styling before JavaScript parses.",
          "Log network performance metrics to server analytics.",
          "Redirect unauthenticated users to a splash screen.",
        ],
        correctIndex: 0,
      },
      {
        question: "When should you use the 'use client' directive in Next.js 14 App Router?",
        options: [
          "Only when using Node.js filesystem modules.",
          "When using interactive browser hooks like useState, useEffect, or onClick handlers.",
          "On every single component file across the application.",
          "Only in the root layout file.",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "quiz-pandas-analysis",
    title: "Data Wrangling & Pandas Aggregation",
    course: "Python & Data Science Bootcamp",
    questionsCount: 12,
    durationMinutes: 15,
    passingScore: 75,
    status: "pending",
    dueDate: "Oct 26, 2026",
    attemptsLeft: 3,
    difficulty: "Advanced",
    sampleQuestions: [
      {
        question: "Which Pandas method is most optimal for combining two DataFrames along a particular axis?",
        options: ["pd.concat()", "pd.append()", "df.combine_first()", "pd.stitch()"],
        correctIndex: 0,
      },
      {
        question: "How do you drop all rows containing NaN values from a DataFrame named 'df'?",
        options: ["df.remove_nan()", "df.dropna()", "df.clean()", "df.filter_null()"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "quiz-async-mastery",
    title: "Async JavaScript & Promises Mastery",
    course: "Full Stack Web Development Masterclass",
    questionsCount: 15,
    durationMinutes: 20,
    passingScore: 80,
    status: "completed",
    score: 93,
    attemptsUsed: 1,
    passedDate: "Oct 10, 2026",
    difficulty: "Intermediate",
  },
  {
    id: "quiz-react-hooks",
    title: "React Hooks, Context & Zustand Architecture",
    course: "Full Stack Web Development Masterclass",
    questionsCount: 20,
    durationMinutes: 25,
    passingScore: 80,
    status: "completed",
    score: 95,
    attemptsUsed: 1,
    passedDate: "Oct 04, 2026",
    difficulty: "Intermediate",
  },
  {
    id: "quiz-python-basics",
    title: "Python Data Structures & List Comprehensions",
    course: "Python & Data Science Bootcamp",
    questionsCount: 10,
    durationMinutes: 15,
    passingScore: 70,
    status: "completed",
    score: 90,
    attemptsUsed: 2,
    passedDate: "Sep 22, 2026",
    difficulty: "Beginner",
  },
  {
    id: "quiz-figma-tokens",
    title: "Figma Design Tokens & Auto-layout Pro",
    course: "Advanced UI/UX Design System with Figma 2026",
    questionsCount: 10,
    durationMinutes: 15,
    passingScore: 80,
    status: "completed",
    score: 100,
    attemptsUsed: 1,
    passedDate: "Sep 18, 2026",
    difficulty: "Intermediate",
  },
];

export default function StudentQuizzesPage() {
  const [tab, setTab] = React.useState("pending"); // "pending" | "completed"
  const [activeQuiz, setActiveQuiz] = React.useState(null);
  const [currentQIndex, setCurrentQIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState({});
  const [quizResult, setQuizResult] = React.useState(null);

  const pendingQuizzes = QUIZZES.filter((q) => q.status === "pending");
  const completedQuizzes = QUIZZES.filter((q) => q.status === "completed");

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setQuizResult(null);
  };

  const handleSelectOption = (qIdx, optIdx) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    const questions = activeQuiz.sampleQuestions || [];
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });

    const percent = Math.round((correct / questions.length) * 100);
    const passed = percent >= activeQuiz.passingScore;

    setQuizResult({
      score: percent,
      correctCount: correct,
      totalCount: questions.length,
      passed,
    });

    if (passed) {
      toast.success(`Congratulations! You passed with ${percent}%`);
    } else {
      toast.error(`Score: ${percent}%. Minimum required is ${activeQuiz.passingScore}%.`);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Assessments & Tests</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quizzes & Knowledge Checks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Test your comprehension after each module, earn honor points, and qualify for graduation certificates.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Score</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-600 mt-2">94.5%</p>
          <p className="text-[11px] text-slate-500 mt-1">Across 6 completed exams</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Quizzes Passed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">6 / 8</p>
          <p className="text-[11px] text-slate-500 mt-1">75% of degree quizzes done</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Tests</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">2 Due</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Requires completion this week</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Honor XP</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-600 mt-2">1,450 XP</p>
          <p className="text-[11px] text-slate-500 mt-1">Top 5% student rank</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60">
        <button
          onClick={() => setTab("pending")}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold transition-all",
            tab === "pending"
              ? "bg-white text-blue-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          Upcoming & Pending ({pendingQuizzes.length})
        </button>
        <button
          onClick={() => setTab("completed")}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold transition-all",
            tab === "completed"
              ? "bg-white text-emerald-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          Completed & Graded ({completedQuizzes.length})
        </button>
      </div>

      {/* Quiz Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {(tab === "pending" ? pendingQuizzes : completedQuizzes).map((quiz) => {
          const isCompleted = quiz.status === "completed";

          return (
            <div
              key={quiz.id}
              className="bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 p-6 shadow-2xs transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {quiz.course}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2.5 py-0.5 rounded-full",
                      quiz.difficulty === "Advanced"
                        ? "bg-purple-50 text-purple-700"
                        : quiz.difficulty === "Intermediate"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    )}
                  >
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{quiz.title}</h3>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Questions
                    </span>
                    <span className="font-bold text-slate-800">{quiz.questionsCount} Qs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Duration
                    </span>
                    <span className="font-bold text-slate-800">{quiz.durationMinutes} Mins</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Passing
                    </span>
                    <span className="font-bold text-slate-800">{quiz.passingScore}%</span>
                  </div>
                </div>

                {isCompleted ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-emerald-900">
                        Passed on {quiz.passedDate}
                      </span>
                    </div>
                    <span className="font-extrabold text-emerald-700 text-sm">
                      {quiz.score}% Score
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                      <Clock className="w-3.5 h-3.5" /> Due by {quiz.dueDate}
                    </span>
                    <span>{quiz.attemptsLeft} attempts remaining</span>
                  </div>
                )}
              </div>

              <div>
                {isCompleted ? (
                  <button
                    onClick={() => {
                      toast.info(`Reviewing previous answers for: ${quiz.title}`);
                    }}
                    className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                    <span>Review Answers & Explanations</span>
                  </button>
                ) : (
                  <button
                    onClick={() => startQuiz(quiz)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-500/20"
                  >
                    <span>Start Quiz Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Quiz Taking Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {activeQuiz.course}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{activeQuiz.title}</h3>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {!quizResult ? (
                <>
                  {/* Progress & Timer */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-800">
                      Question {currentQIndex + 1} of {activeQuiz.sampleQuestions.length}
                    </span>
                    <span className="flex items-center gap-1 font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Clock className="w-3.5 h-3.5" /> 18:42 remaining
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <div className="space-y-4">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {activeQuiz.sampleQuestions[currentQIndex]?.question}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2.5">
                      {activeQuiz.sampleQuestions[currentQIndex]?.options.map((option, optIdx) => {
                        const isSelected = selectedAnswers[currentQIndex] === optIdx;

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(currentQIndex, optIdx)}
                            className={cn(
                              "p-3.5 rounded-2xl border text-xs sm:text-sm font-medium cursor-pointer transition-all flex items-center gap-3",
                              isSelected
                                ? "bg-blue-50 border-blue-500 text-blue-900 shadow-2xs"
                                : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                            )}
                          >
                            <div
                              className={cn(
                                "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold",
                                isSelected
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "border-slate-300 text-slate-400"
                              )}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span className="leading-snug">{option}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* Result Screen */
                <div className="py-6 text-center space-y-4">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full mx-auto flex items-center justify-center",
                      quizResult.passed ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                    )}
                  >
                    {quizResult.passed ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <AlertCircle className="w-8 h-8" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900">
                      {quizResult.passed ? "Test Passed Successfully!" : "Test Not Passed"}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {quizResult.passed
                        ? "Great work! This module has been marked as verified on your transcript."
                        : `You scored below the ${activeQuiz.passingScore}% passing threshold. You have 1 attempt remaining.`}
                    </p>
                  </div>

                  <div className="inline-block p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Your Score</span>
                    <p
                      className={cn(
                        "text-3xl font-black mt-0.5",
                        quizResult.passed ? "text-emerald-600" : "text-red-600"
                      )}
                    >
                      {quizResult.score}%
                    </p>
                    <span className="text-xs text-slate-500 mt-1 block">
                      {quizResult.correctCount} out of {quizResult.totalCount} correct
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              {!quizResult ? (
                <>
                  <button
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex((i) => Math.max(0, i - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {currentQIndex < activeQuiz.sampleQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQIndex((i) => i + 1)}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm shadow-emerald-500/20"
                    >
                      Submit Exam
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full flex justify-end">
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Done & Return to Quizzes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
