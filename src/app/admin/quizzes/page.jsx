"use client";

import * as React from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Edit2,
  Eye,
  Lightbulb,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Timer,
  Trash2,
  TrendingUp,
  X,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

/* ── helpers ─────────────────────────────────────────── */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ── API helpers ─────────────────────────────────────── */
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || json.error || "Request failed");
  return json;
}

/* ── Modal Shell ────────────────────────────────────── */
function ModalShell({ open, title, onClose, children, width = "max-w-2xl" }) {
  React.useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/50 p-4 backdrop-blur-sm overflow-y-auto">
      <div
        className={cn(
          "w-full rounded-3xl border border-slate-200 bg-white shadow-2xl my-8",
          width
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ── Toast ──────────────────────────────────────────── */
function Toast({ msg, type, onDismiss }) {
  React.useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl text-sm font-medium",
        type === "error"
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
      )}
    >
      {type === "error" ? (
        <AlertCircle className="h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      )}
      {msg}
      <button onClick={onDismiss} className="ml-1 rounded-full hover:opacity-70">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ── Stat Card ──────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={cn("rounded-xl p-2.5", colorMap[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* ── Status badge ───────────────────────────────────── */
function StatusBadge({ published }) {
  return published ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      <CheckCircle2 className="h-3 w-3" /> Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
      <Clock className="h-3 w-3" /> Draft
    </span>
  );
}

/* ── Create / Edit Quiz Form ────────────────────────── */
function QuizForm({ initial, courses, onSave, onCancel, loading }) {
  const [form, setForm] = React.useState({
    courseId: "",
    title: "",
    description: "",
    instructions: "",
    timeLimit: 30,
    passingPercentage: 60,
    attemptsAllowed: 3,
    randomizeQuestions: false,
    showCorrectAnswers: true,
    shuffleOptions: false,
    isFinal: false,
    isPublished: false,
    ...initial,
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.courseId) return alert("Please select a course");
    if (!form.title.trim()) return alert("Title is required");
    onSave(form);
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10";
  const labelCls = "mb-1.5 block text-sm font-medium text-slate-700";
  const toggleCls = (val) =>
    cn(
      "flex cursor-pointer select-none items-center gap-2 text-sm font-medium",
      val ? "text-violet-700" : "text-slate-600"
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Course */}
      <div>
        <label className={labelCls}>Course *</label>
        <select
          value={form.courseId}
          onChange={(e) => set("courseId", e.target.value)}
          className={inputCls}
          required
        >
          <option value="">Select a course…</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className={labelCls}>Quiz Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. JavaScript Fundamentals Quiz"
          className={inputCls}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          value={form.description || ""}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Brief description of this quiz…"
          rows={3}
          className={cn(inputCls, "resize-none")}
        />
      </div>

      {/* Instructions */}
      <div>
        <label className={labelCls}>Student Instructions</label>
        <textarea
          value={form.instructions || ""}
          onChange={(e) => set("instructions", e.target.value)}
          placeholder="Instructions shown to students before starting…"
          rows={2}
          className={cn(inputCls, "resize-none")}
        />
      </div>

      {/* Number fields */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>
            <span className="flex items-center gap-1">
              <Timer className="h-3.5 w-3.5 text-slate-400" /> Time Limit (min)
            </span>
          </label>
          <input
            type="number"
            min={0}
            value={form.timeLimit}
            onChange={(e) => set("timeLimit", Number(e.target.value))}
            className={inputCls}
          />
          <p className="mt-1 text-xs text-slate-400">0 = no limit</p>
        </div>
        <div>
          <label className={labelCls}>Passing % *</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.passingPercentage}
            onChange={(e) => set("passingPercentage", Number(e.target.value))}
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Max Attempts</label>
          <input
            type="number"
            min={0}
            value={form.attemptsAllowed}
            onChange={(e) => set("attemptsAllowed", Number(e.target.value))}
            className={inputCls}
          />
          <p className="mt-1 text-xs text-slate-400">0 = unlimited</p>
        </div>
      </div>

      {/* Toggles */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Settings</p>
        {[
          ["randomizeQuestions", "Randomize question order"],
          ["shuffleOptions", "Shuffle answer options"],
          ["showCorrectAnswers", "Show correct answers after submission"],
          ["isFinal", "Final exam (counts toward certificate)"],
          ["isPublished", "Publish quiz immediately"],
        ].map(([key, label]) => (
          <label key={key} className={toggleCls(form[key])}>
            <button
              type="button"
              onClick={() => set(key, !form[key])}
              className="relative"
              aria-checked={form[key]}
              role="switch"
            >
              {form[key] ? (
                <ToggleRight className="h-5 w-5 text-violet-600" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-slate-400" />
              )}
            </button>
            {label}
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {initial?._id ? "Update Quiz" : "Create Quiz"}
        </button>
      </div>
    </form>
  );
}

/* ── Add Question Form ─────────────────────────────── */
function QuestionForm({ quizId, onSave, onCancel, loading }) {
  const [form, setForm] = React.useState({
    quizId,
    type: "multiple_choice",
    question: "",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    correctAnswer: 0,
    marks: 1,
    negativeMarks: 0,
    explanation: "",
    difficulty: "medium",
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const setOption = (i, val) => {
    const opts = [...form.options];
    opts[i] = { text: val };
    set("options", opts);
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10";
  const labelCls = "mb-1.5 block text-sm font-medium text-slate-700";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.question.trim()) return alert("Question text is required");
    if (form.type === "multiple_choice") {
      if (form.options.some((o) => !o.text.trim()))
        return alert("All options must be filled");
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Question Type</label>
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            className={inputCls}
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True / False</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Difficulty</label>
          <select
            value={form.difficulty}
            onChange={(e) => set("difficulty", e.target.value)}
            className={inputCls}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Question */}
      <div>
        <label className={labelCls}>Question *</label>
        <textarea
          value={form.question}
          onChange={(e) => set("question", e.target.value)}
          placeholder="Enter the question text…"
          rows={3}
          className={cn(inputCls, "resize-none")}
          required
        />
      </div>

      {/* Options */}
      {form.type === "multiple_choice" ? (
        <div>
          <label className={labelCls}>Answer Options (select correct)</label>
          <div className="space-y-2">
            {form.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => set("correctAnswer", i)}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition",
                    form.correctAnswer === i
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 text-slate-400 hover:border-emerald-400"
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </button>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => setOption(i, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">Click the letter to mark the correct answer</p>
        </div>
      ) : (
        <div>
          <label className={labelCls}>Correct Answer</label>
          <div className="flex gap-3">
            {["true", "false"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => set("correctAnswer", v)}
                className={cn(
                  "flex-1 rounded-xl border-2 py-2.5 text-sm font-semibold transition capitalize",
                  form.correctAnswer === v
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Marks */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Marks</label>
          <input
            type="number"
            min={0}
            value={form.marks}
            onChange={(e) => set("marks", Number(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Negative Marks</label>
          <input
            type="number"
            min={0}
            value={form.negativeMarks}
            onChange={(e) => set("negativeMarks", Number(e.target.value))}
            className={inputCls}
          />
        </div>
      </div>

      {/* Explanation */}
      <div>
        <label className={labelCls}>Explanation (shown after attempt)</label>
        <textarea
          value={form.explanation || ""}
          onChange={(e) => set("explanation", e.target.value)}
          placeholder="Why is this the correct answer?"
          rows={2}
          className={cn(inputCls, "resize-none")}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Add Question
        </button>
      </div>
    </form>
  );
}

/* ── Quiz Detail Modal ─────────────────────────────── */
function QuizDetailModal({ quiz, onClose, onAddQuestion, onTogglePublish, onDeleteQuiz }) {
  const [questions, setQuestions] = React.useState([]);
  const [loadingQ, setLoadingQ] = React.useState(false);
  const [addingQ, setAddingQ] = React.useState(false);
  const [savingQ, setSavingQ] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    if (!quiz?._id) return;
    setLoadingQ(true);
    apiFetch(`/api/quizzes?action=quiz&quizId=${quiz._id}`)
      .then((d) => setQuestions(d.data?.questions || []))
      .catch((e) => setToast({ msg: e.message, type: "error" }))
      .finally(() => setLoadingQ(false));
  }, [quiz?._id]);

  const handleSaveQuestion = async (formData) => {
    setSavingQ(true);
    try {
      await apiFetch("/api/quizzes?action=addQuestion", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setToast({ msg: "Question added!", type: "success" });
      setAddingQ(false);
      // re-fetch questions
      const d = await apiFetch(`/api/quizzes?action=quiz&quizId=${quiz._id}`);
      setQuestions(d.data?.questions || []);
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    } finally {
      setSavingQ(false);
    }
  };

  const diffColor = {
    easy: "bg-emerald-50 text-emerald-700",
    medium: "bg-amber-50 text-amber-700",
    hard: "bg-red-50 text-red-700",
  };

  return (
    <ModalShell open width="max-w-3xl" title={`Quiz: ${quiz.title}`} onClose={onClose}>
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      {/* Quiz info bar */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl bg-violet-50 p-4">
        <StatusBadge published={quiz.isPublished} />
        <span className="text-xs text-slate-500">
          <Timer className="inline h-3.5 w-3.5 mr-1" />
          {quiz.timeLimit ? `${quiz.timeLimit} min` : "No time limit"}
        </span>
        <span className="text-xs text-slate-500">
          Pass: {quiz.passingPercentage}%
        </span>
        <span className="text-xs text-slate-500">
          {quiz.totalQuestions} Q · {quiz.totalMarks} marks
        </span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => onTogglePublish(quiz)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
              quiz.isPublished
                ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            )}
          >
            {quiz.isPublished ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => { onDeleteQuiz(quiz); onClose(); }}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
          >
            Delete Quiz
          </button>
        </div>
      </div>

      {/* Questions section */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-800">
          Questions ({questions.length})
        </h4>
        {!addingQ && (
          <button
            onClick={() => setAddingQ(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 transition"
          >
            <Plus className="h-3.5 w-3.5" /> Add Question
          </button>
        )}
      </div>

      {addingQ && (
        <div className="mb-4 rounded-2xl border border-violet-200 bg-violet-50/50 p-4">
          <QuestionForm
            quizId={quiz._id}
            onSave={handleSaveQuestion}
            onCancel={() => setAddingQ(false)}
            loading={savingQ}
          />
        </div>
      )}

      {loadingQ ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center">
          <HelpCircle className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">No questions yet</p>
          <p className="text-xs text-slate-400">Click "Add Question" to add the first one</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {questions.map((q, i) => (
            <div
              key={q._id}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium text-slate-800">{q.question}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
                      diffColor[q.difficulty] || "bg-slate-100 text-slate-600"
                    )}
                  >
                    {q.difficulty}
                  </span>
                  <span className="text-xs text-slate-400">{q.marks}m</span>
                </div>
              </div>
              {q.options?.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-1.5 ml-9">
                  {q.options.map((opt, oi) => (
                    <span
                      key={oi}
                      className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs text-slate-600"
                    >
                      {String.fromCharCode(65 + oi)}. {opt.text}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ModalShell>
  );
}

/* ── Main Page ──────────────────────────────────────── */
export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = React.useState([]);
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [filterCourse, setFilterCourse] = React.useState("all");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [modal, setModal] = React.useState(null); // null | "create" | "edit" | "detail" | "delete"
  const [selected, setSelected] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  /* Load quizzes and courses */
  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [coursesRes] = await Promise.all([
        apiFetch("/api/courses?action=instructorCourses&limit=100"),
      ]);
      const allCourses = coursesRes.data?.courses || coursesRes.data || [];
      setCourses(allCourses);

      // Load quizzes per course (or all if admin)
      const quizPromises = allCourses.slice(0, 20).map((c) =>
        apiFetch(`/api/quizzes?action=courseQuizzes&courseId=${c._id}`)
          .then((d) => (d.data || []).map((q) => ({ ...q, courseName: c.title })))
          .catch(() => [])
      );
      const results = await Promise.all(quizPromises);
      setQuizzes(results.flat());
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadData(); }, [loadData]);

  /* Filtered list */
  const filtered = React.useMemo(() => {
    let q = quizzes;
    if (search.trim()) {
      const s = search.toLowerCase();
      q = q.filter(
        (x) =>
          x.title?.toLowerCase().includes(s) ||
          x.courseName?.toLowerCase().includes(s)
      );
    }
    if (filterCourse !== "all")
      q = q.filter((x) => String(x.courseId) === filterCourse || String(x.courseId?._id) === filterCourse);
    if (filterStatus === "published") q = q.filter((x) => x.isPublished);
    if (filterStatus === "draft") q = q.filter((x) => !x.isPublished);
    return q;
  }, [quizzes, search, filterCourse, filterStatus]);

  /* Stats */
  const stats = React.useMemo(() => ({
    total: quizzes.length,
    published: quizzes.filter((q) => q.isPublished).length,
    draft: quizzes.filter((q) => !q.isPublished).length,
    totalQ: quizzes.reduce((s, q) => s + (q.totalQuestions || 0), 0),
  }), [quizzes]);

  /* CRUD */
  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await apiFetch("/api/quizzes?action=createQuiz", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setToast({ msg: "Quiz created successfully!", type: "success" });
      setModal(null);
      loadData();
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    try {
      await apiFetch(`/api/quizzes?action=updateQuiz&quizId=${selected._id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      setToast({ msg: "Quiz updated!", type: "success" });
      setModal(null);
      loadData();
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (quiz) => {
    try {
      await apiFetch(`/api/quizzes?action=updateQuiz&quizId=${quiz._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished: !quiz.isPublished }),
      });
      setToast({
        msg: quiz.isPublished ? "Quiz unpublished" : "Quiz published!",
        type: "success",
      });
      loadData();
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await apiFetch(`/api/quizzes?action=deleteQuiz&quizId=${selected._id}`, {
        method: "DELETE",
      });
      setToast({ msg: "Quiz deleted", type: "success" });
      setModal(null);
      setSelected(null);
      loadData();
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10";

  return (
    <div className="space-y-6">
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Quizzes & Assessments
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Create, manage, and monitor quizzes across all courses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50 transition"
            title="Refresh"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
          <button
            onClick={() => setModal("create")}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition shadow-sm"
          >
            <Plus className="h-4 w-4" /> New Quiz
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Quizzes" value={stats.total} icon={Lightbulb} color="purple" />
        <StatCard label="Published" value={stats.published} icon={CheckCircle2} color="emerald" />
        <StatCard label="Drafts" value={stats.draft} icon={Clock} color="amber" />
        <StatCard label="Total Questions" value={stats.totalQ} icon={HelpCircle} color="blue" />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes by title or course…"
              className={cn(inputCls, "w-full pl-10")}
            />
          </div>
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className={inputCls}
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={inputCls}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            <p className="text-sm text-slate-500">Loading quizzes…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Lightbulb className="h-12 w-12 text-slate-200" />
            <p className="text-sm font-medium text-slate-500">No quizzes found</p>
            <button
              onClick={() => setModal("create")}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition"
            >
              <Plus className="h-4 w-4" /> Create First Quiz
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Quiz
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Course
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Questions
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pass %
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Time Limit
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((quiz) => (
                  <QuizRow
                    key={quiz._id}
                    quiz={quiz}
                    onView={() => { setSelected(quiz); setModal("detail"); }}
                    onEdit={() => { setSelected(quiz); setModal("edit"); }}
                    onDelete={() => { setSelected(quiz); setModal("delete"); }}
                    onTogglePublish={() => handleTogglePublish(quiz)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <ModalShell
        open={modal === "create"}
        title="Create New Quiz"
        onClose={() => setModal(null)}
        width="max-w-2xl"
      >
        <QuizForm
          courses={courses}
          onSave={handleCreate}
          onCancel={() => setModal(null)}
          loading={saving}
        />
      </ModalShell>

      {/* Edit Modal */}
      <ModalShell
        open={modal === "edit"}
        title="Edit Quiz"
        onClose={() => setModal(null)}
        width="max-w-2xl"
      >
        {selected && (
          <QuizForm
            initial={selected}
            courses={courses}
            onSave={handleEdit}
            onCancel={() => setModal(null)}
            loading={saving}
          />
        )}
      </ModalShell>

      {/* Detail Modal */}
      {modal === "detail" && selected && (
        <QuizDetailModal
          quiz={selected}
          onClose={() => { setModal(null); loadData(); }}
          onTogglePublish={(q) => { handleTogglePublish(q); setSelected((p) => ({ ...p, isPublished: !p.isPublished })); }}
          onDeleteQuiz={(q) => { setSelected(q); setModal("delete"); }}
        />
      )}

      {/* Delete Confirm */}
      <ModalShell
        open={modal === "delete"}
        title="Delete Quiz"
        onClose={() => setModal(null)}
        width="max-w-md"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <Trash2 className="h-7 w-7 text-red-500" />
          </div>
          <p className="text-sm text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">{selected?.title}</span>?{" "}
            All questions will also be permanently removed.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setModal(null)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Quiz
            </button>
          </div>
        </div>
      </ModalShell>
    </div>
  );
}

/* ── Quiz Table Row ─────────────────────────────────── */
function QuizRow({ quiz, onView, onEdit, onDelete, onTogglePublish }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <tr className="group hover:bg-violet-50/30 transition">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            <Lightbulb className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{quiz.title}</p>
            <p className="text-xs text-slate-400">{quiz.isFinal ? "Final Exam" : "Regular Quiz"}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="max-w-[180px] truncate text-sm text-slate-600">{quiz.courseName || "—"}</p>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="text-sm font-medium text-slate-700">{quiz.totalQuestions || 0}</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="text-sm text-slate-600">{quiz.passingPercentage}%</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="text-sm text-slate-600">
          {quiz.timeLimit ? `${quiz.timeLimit}m` : "None"}
        </span>
      </td>
      <td className="px-4 py-4 text-center">
        <StatusBadge published={quiz.isPublished} />
      </td>
      <td className="px-4 py-4 text-right">
        <div ref={ref} className="relative inline-block">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 transition opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl">
              <ActionItem icon={Eye} label="View & Questions" onClick={() => { setMenuOpen(false); onView(); }} />
              <ActionItem icon={Edit2} label="Edit Quiz" onClick={() => { setMenuOpen(false); onEdit(); }} />
              <ActionItem
                icon={quiz.isPublished ? Clock : CheckCircle2}
                label={quiz.isPublished ? "Unpublish" : "Publish"}
                onClick={() => { setMenuOpen(false); onTogglePublish(); }}
              />
              <hr className="my-1 border-slate-100" />
              <ActionItem
                icon={Trash2}
                label="Delete"
                onClick={() => { setMenuOpen(false); onDelete(); }}
                danger
              />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

function ActionItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-4 py-2 text-sm transition hover:bg-slate-50",
        danger ? "text-red-600 hover:bg-red-50" : "text-slate-700"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </button>
  );
}
