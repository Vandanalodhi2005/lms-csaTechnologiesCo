"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, BookOpen, Check, ChevronLeft, ChevronRight, Clock3, FileQuestion, RotateCcw, Target, Zap } from "lucide-react";
import { calculateQuizResult } from "@/lib/quiz.js";

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getOptionLabel(index) {
  return String.fromCharCode(65 + index);
}

export default function QuizPlayer({ quiz, course, lessonHref }) {
  const [phase, setPhase] = useState("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [attemptCount, setAttemptCount] = useState(0);
  const [autoSubmitMessage, setAutoSubmitMessage] = useState("");

  const questions = useMemo(() => quiz.questions || [], [quiz.questions]);
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] || null;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const progress = totalQuestions ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const canRetry = attemptCount < (quiz.attemptsAllowed || 1);

  const submitQuiz = useCallback(
    (autoSubmitted = false) => {
      if (!questions.length || result) return;

      const nextResult = calculateQuizResult(quiz, answers);
      setResult(nextResult);
      setPhase("result");
      setAutoSubmitMessage(
        autoSubmitted ? "Time is up. Your quiz has been submitted." : ""
      );
    },
    [answers, questions.length, quiz, result]
  );

  useEffect(() => {
    if (phase !== "in-progress") return undefined;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          setTimeout(() => submitQuiz(true), 0);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, submitQuiz]);

  useEffect(() => {
    if (phase === "result" && result) {
      window.clearInterval();
    }
  }, [phase, result]);

  const startQuiz = () => {
    setPhase("in-progress");
    setTimeLeft(quiz.timeLimit * 60);
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setReviewOpen(false);
    setAutoSubmitMessage("");
  };

  const handleSelectAnswer = (questionId, optionId) => {
    if (phase !== "in-progress") return;
    setAnswers((previous) => ({
      ...previous,
      [questionId]: optionId,
    }));
  };

  const goToQuestion = (index) => {
    if (phase !== "in-progress") return;
    setCurrentIndex(Math.max(0, Math.min(index, totalQuestions - 1)));
  };

  const nextQuestion = () => {
    if (phase !== "in-progress") return;
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((previous) => previous + 1);
      return;
    }
    setPhase("confirm");
  };

  const previousQuestion = () => {
    if (phase !== "in-progress") return;
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  };

  const tryAgain = () => {
    setAttemptCount((previous) => previous + 1);
    setResult(null);
    setReviewOpen(false);
    setAnswers({});
    setCurrentIndex(0);
    setAutoSubmitMessage("");
    setTimeLeft(quiz.timeLimit * 60);
    setPhase("intro");
  };

  const reviewSummary = useMemo(() => {
    if (!questions.length) return [];

    return questions.map((question) => {
      const selectedAnswer = answers[question.id];
      const optionMap = Object.fromEntries((question.options || []).map((option) => [option.id, option]));
      const selectedOption = selectedAnswer ? optionMap[selectedAnswer] : null;
      const correctOption = optionMap[question.correctAnswer];

      return {
        ...question,
        selectedAnswer,
        selectedOption,
        correctOption,
        isCorrect: selectedAnswer === question.correctAnswer,
        isUnanswered: !selectedAnswer,
      };
    });
  }, [answers, questions]);

  if (!questions.length) {
    return (
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-slate-700">
          <AlertCircle className="h-6 w-6 text-amber-500" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-slate-900">This quiz is not available yet.</h1>
        </div>
      </section>
    );
  }

  const timeLow = timeLeft <= 120;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {phase === "intro" && (
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Quiz</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{quiz.title}</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">{quiz.description}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={FileQuestion} label="Questions" value={`${totalQuestions}`} />
              <StatCard icon={Clock3} label="Time Limit" value={`${quiz.timeLimit} Minutes`} />
              <StatCard icon={Target} label="Passing Score" value={`${quiz.passingScore}%`} />
              <StatCard icon={RotateCcw} label="Attempts" value={`${Math.max(0, quiz.attemptsAllowed - attemptCount)} Remaining`} />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={startQuiz}
                className="inline-flex items-center justify-center rounded-xl bg-[#0F2F5F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#163d7a] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Start Quiz
              </button>
              {lessonHref ? (
                <Link
                  href={lessonHref}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Back to Lesson
                </Link>
              ) : null}
            </div>
          </section>

          <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Course</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">{course?.title || "Course"}</h2>
              </div>
            </div>

            <dl className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between gap-3">
                <dt>Course</dt>
                <dd className="font-medium text-slate-800">{course?.title || "Unknown course"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Section</dt>
                <dd className="font-medium text-slate-800">{quiz.sectionTitle || "JavaScript Basics"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Instructor</dt>
                <dd className="font-medium text-slate-800">{course?.instructor || "John Doe"}</dd>
              </div>
            </dl>
          </aside>
        </div>
      )}

      {phase === "in-progress" && currentQuestion && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_300px]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">{course?.title || "Course"}</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">{quiz.title}</h2>
              </div>
              <div
                className={[
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold",
                  timeLow ? "border-amber-200 bg-amber-50 text-amber-700" : "border-slate-200 bg-slate-50 text-slate-700",
                ].join(" ")}
                aria-label={`Time remaining: ${Math.floor(timeLeft / 60)} minutes ${timeLeft % 60} seconds`}
              >
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-600">
                <span className="font-medium">Question {currentIndex + 1} of {totalQuestions}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                <div className="h-full rounded-full bg-blue-600 transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <fieldset className="space-y-4">
              <legend className="text-xl font-bold leading-8 text-slate-900 sm:text-2xl">
                {currentQuestion.question}
              </legend>

              <div className="mt-5 space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const optionId = option.id;
                  const isSelected = answers[currentQuestion.id] === optionId;

                  return (
                    <label
                      key={optionId}
                      className={[
                        "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition focus-within:ring-2 focus-within:ring-blue-500",
                        isSelected ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={optionId}
                        checked={isSelected}
                        onChange={() => handleSelectAnswer(currentQuestion.id, optionId)}
                        className="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                        aria-label={`Option ${getOptionLabel(index)}: ${option.text}`}
                      />
                      <span className="flex-1">
                        <span className="mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700">
                          {getOptionLabel(index)}
                        </span>
                        <span className="block text-base leading-7 text-slate-700">{option.text}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={previousQuestion}
                disabled={currentIndex === 0}
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition",
                  currentIndex === 0
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </button>

              <button
                type="button"
                onClick={nextQuestion}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2F5F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#153c7f]"
              >
                {currentIndex === totalQuestions - 1 ? "Review & Submit" : "Next"}
                {currentIndex !== totalQuestions - 1 ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : null}
              </button>
            </div>
          </section>

          <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-900">Questions</h3>
              <span className="text-sm text-slate-500">{answeredCount}/{totalQuestions} answered</span>
            </div>

            <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-5 xl:grid-cols-5">
              {questions.map((question, index) => {
                const isCurrent = index === currentIndex;
                const isAnswered = Boolean(answers[question.id]);
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => goToQuestion(index)}
                    className={[
                      "flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition",
                      isCurrent
                        ? "border-blue-600 bg-blue-600 text-white"
                        : isAnswered
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300",
                    ].join(" ")}
                    aria-label={`Jump to question ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Quiz Status</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-600">Answered</span>
                <span className="font-semibold text-slate-900">{answeredCount}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-600">Unanswered</span>
                <span className="font-semibold text-slate-900">{unansweredCount}</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {phase === "result" && result && (
        <section className="mx-auto max-w-5xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Quiz Completed</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Your Result</h1>
            </div>
            {autoSubmitMessage ? (
              <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <Zap className="h-4 w-4" aria-hidden="true" />
                <span>{autoSubmitMessage}</span>
              </div>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ResultStat label="Score" value={`${result.score}%`} accent="blue" />
            <ResultStat label="Correct" value={result.correctAnswers} accent="emerald" />
            <ResultStat label="Incorrect" value={result.incorrectAnswers} accent="rose" />
            <ResultStat label="Unanswered" value={result.unansweredQuestions} accent="slate" />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className={[
                "flex h-12 w-12 items-center justify-center rounded-full",
                result.passed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
              ].join(" ")}>
                {result.passed ? <Check className="h-6 w-6" aria-hidden="true" /> : <Target className="h-6 w-6" aria-hidden="true" />}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{result.passed ? "Passed" : "Not Passed"}</p>
                <p className="text-sm text-slate-600">
                  {result.passed ? "Excellent work — you met the passing score." : "Keep practicing and try again when you’re ready."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setReviewOpen((previous) => !previous)}
              className="inline-flex items-center justify-center rounded-xl bg-[#0F2F5F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#153c7f]"
            >
              {reviewOpen ? "Hide Review" : "Review Answers"}
            </button>
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Course
            </Link>
            {canRetry ? (
              <button
                type="button"
                onClick={tryAgain}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Try Again
              </button>
            ) : (
              <span className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400">
                No attempts remaining
              </span>
            )}
          </div>

          {reviewOpen && (
            <div className="mt-8 space-y-4">
              {reviewSummary.map((question, index) => {
                const status = question.isUnanswered ? "Not Answered" : question.isCorrect ? "✓ Correct" : "✕ Incorrect";
                return (
                  <article key={question.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-base font-semibold text-slate-900">
                        {index + 1}. {question.question}
                      </p>
                      <span
                        className={[
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          question.isUnanswered
                            ? "bg-slate-100 text-slate-700"
                            : question.isCorrect
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700",
                        ].join(" ")}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                      <div>
                        <p className="font-medium text-slate-700">Your answer</p>
                        <p>{question.isUnanswered ? "Not answered" : question.selectedOption?.text || "Not answered"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">Correct answer</p>
                        <p>{question.correctOption?.text || "Unavailable"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">Status</p>
                        <p>{question.isUnanswered ? "Not Answered" : question.isCorrect ? "Correct" : "Incorrect"}</p>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      <span className="font-medium text-slate-800">Explanation:</span> {question.explanation}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {phase === "confirm" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="submit-title" className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 id="submit-title" className="text-2xl font-bold text-slate-900">Submit Quiz?</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {answeredCount === totalQuestions
                ? "You have answered all questions. Are you ready to submit?"
                : `You have answered ${answeredCount} of ${totalQuestions} questions. ${unansweredCount} questions remain unanswered.`}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPhase("in-progress")}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Continue Quiz
              </button>
              <button
                type="button"
                onClick={() => submitQuiz(false)}
                className="inline-flex items-center justify-center rounded-xl bg-[#0F2F5F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#153c7f]"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3 text-slate-700">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ResultStat({ label, value, accent }) {
  const tone = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    rose: "border-rose-100 bg-rose-50 text-rose-700",
    slate: "border-slate-200 bg-slate-100 text-slate-700",
  };

  return (
    <div className={['rounded-2xl border p-4', tone[accent] || tone.slate].join(' ')}>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
