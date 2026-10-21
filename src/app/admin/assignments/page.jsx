"use client";

import * as React from "react";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Edit2,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
  Upload,
  ToggleLeft,
  ToggleRight,
  Award,
  AlertTriangle,
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

function toInputDate(d) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date)) return "";
  return date.toISOString().split("T")[0];
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

/* ── Stat Card ──────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
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

/* ── Status Badge ───────────────────────────────────── */
function StatusBadge({ published, deadline }) {
  const isPast = deadline && new Date(deadline) < new Date();
  if (!published)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
        <Clock className="h-3 w-3" /> Draft
      </span>
    );
  if (isPast)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
        <AlertTriangle className="h-3 w-3" /> Closed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      <CheckCircle2 className="h-3 w-3" /> Active
    </span>
  );
}

/* ── Assignment Form ────────────────────────────────── */
function AssignmentForm({ initial, courses, onSave, onCancel, loading }) {
  const [form, setForm] = React.useState({
    courseId: "",
    title: "",
    instructions: "",
    maxMarks: 100,
    deadline: "",
    maxAttempts: 1,
    allowLateSubmission: false,
    lateSubmissionPenalty: 0,
    allowResubmission: false,
    maxFileCount: 5,
    maxFileSize: 52428800, // 50MB
    allowedFileTypes: ["application/pdf", "application/zip", "image/jpeg", "image/png"],
    isPublished: false,
    ...initial,
    deadline: toInputDate(initial?.deadline),
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.courseId) return alert("Please select a course");
    if (!form.title.trim()) return alert("Title is required");
    if (!form.instructions.trim()) return alert("Instructions are required");
    const payload = {
      ...form,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    };
    onSave(payload);
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10";
  const labelCls = "mb-1.5 block text-sm font-medium text-slate-700";
  const toggleCls = (val) =>
    cn(
      "flex cursor-pointer select-none items-center gap-2 text-sm font-medium",
      val ? "text-orange-700" : "text-slate-600"
    );

  const FILE_TYPE_OPTIONS = [
    { value: "application/pdf", label: "PDF" },
    { value: "application/zip", label: "ZIP / Archive" },
    { value: "image/jpeg", label: "JPEG Image" },
    { value: "image/png", label: "PNG Image" },
    { value: "text/plain", label: "Text File" },
    { value: "application/msword", label: "Word Doc" },
  ];

  const toggleFileType = (val) => {
    const current = form.allowedFileTypes || [];
    const next = current.includes(val) ? current.filter((f) => f !== val) : [...current, val];
    set("allowedFileTypes", next);
  };

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
        <label className={labelCls}>Assignment Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. React Hooks Exercise"
          className={inputCls}
          required
        />
      </div>

      {/* Instructions */}
      <div>
        <label className={labelCls}>Instructions *</label>
        <textarea
          value={form.instructions}
          onChange={(e) => set("instructions", e.target.value)}
          placeholder="Detailed instructions for students. Include requirements, submission format, etc."
          rows={5}
          className={cn(inputCls, "resize-none")}
          required
        />
      </div>

      {/* Marks, Deadline, Attempts */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>
            <span className="flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-slate-400" /> Max Marks *
            </span>
          </label>
          <input
            type="number"
            min={1}
            value={form.maxMarks}
            onChange={(e) => set("maxMarks", Number(e.target.value))}
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className={labelCls}>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" /> Deadline
            </span>
          </label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => set("deadline", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Max Attempts</label>
          <input
            type="number"
            min={1}
            value={form.maxAttempts}
            onChange={(e) => set("maxAttempts", Number(e.target.value))}
            className={inputCls}
          />
        </div>
      </div>

      {/* File Settings */}
      <div>
        <label className={labelCls}>Allowed File Types</label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {FILE_TYPE_OPTIONS.map(({ value, label }) => {
            const checked = (form.allowedFileTypes || []).includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleFileType(value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  checked
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Max Files per Submission</label>
          <input
            type="number"
            min={1}
            value={form.maxFileCount}
            onChange={(e) => set("maxFileCount", Number(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Max File Size (MB)</label>
          <input
            type="number"
            min={1}
            value={Math.round(form.maxFileSize / 1024 / 1024)}
            onChange={(e) => set("maxFileSize", Number(e.target.value) * 1024 * 1024)}
            className={inputCls}
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Submission Settings</p>
        {[
          ["allowLateSubmission", "Allow late submissions"],
          ["allowResubmission", "Allow resubmission"],
          ["isPublished", "Publish assignment immediately"],
        ].map(([key, label]) => (
          <label key={key} className={toggleCls(form[key])}>
            <button
              type="button"
              onClick={() => set(key, !form[key])}
              role="switch"
              aria-checked={form[key]}
            >
              {form[key] ? (
                <ToggleRight className="h-5 w-5 text-orange-600" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-slate-400" />
              )}
            </button>
            {label}
          </label>
        ))}

        {form.allowLateSubmission && (
          <div className="mt-3 pl-7">
            <label className={labelCls}>Late Submission Penalty (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={form.lateSubmissionPenalty}
              onChange={(e) => set("lateSubmissionPenalty", Number(e.target.value))}
              className={cn(inputCls, "max-w-[180px]")}
            />
          </div>
        )}
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
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60 transition"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {initial?._id ? "Update Assignment" : "Create Assignment"}
        </button>
      </div>
    </form>
  );
}

/* ── Assignment Detail Modal ────────────────────────── */
function AssignmentDetailModal({ assignment, onClose, onEdit, onTogglePublish, onDelete }) {
  const [submissions, setSubmissions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    if (!assignment?._id) return;
    setLoading(true);
    apiFetch(`/api/quizzes?action=assignmentSubmissions&assignmentId=${assignment._id}&limit=20`)
      .then((d) => setSubmissions(d.data?.submissions || d.data || []))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, [assignment?._id]);

  const statusBadge = {
    submitted: "bg-blue-50 text-blue-700",
    graded: "bg-emerald-50 text-emerald-700",
    late: "bg-amber-50 text-amber-700",
    pending: "bg-slate-100 text-slate-600",
  };

  return (
    <ModalShell open width="max-w-3xl" title={assignment.title} onClose={onClose}>
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      {/* Info bar */}
      <div className="mb-5 flex flex-wrap gap-3 rounded-2xl bg-orange-50 p-4">
        <StatusBadge published={assignment.isPublished} deadline={assignment.deadline} />
        <span className="text-xs text-slate-600 flex items-center gap-1">
          <Award className="h-3.5 w-3.5 text-orange-500" /> {assignment.maxMarks} marks
        </span>
        {assignment.deadline && (
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-orange-500" /> Due:{" "}
            {formatDate(assignment.deadline)}
          </span>
        )}
        <span className="text-xs text-slate-600 flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-orange-500" />{" "}
          {assignment.totalSubmissions || 0} submissions
        </span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => onEdit(assignment)}
            className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onTogglePublish(assignment)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
              assignment.isPublished
                ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            )}
          >
            {assignment.isPublished ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => { onDelete(assignment); onClose(); }}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-5 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Instructions</p>
        <p className="text-sm text-slate-700 whitespace-pre-wrap">{assignment.instructions}</p>
      </div>

      {/* Submission settings */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          ["Attempts Allowed", assignment.maxAttempts],
          ["Max File Size", `${Math.round((assignment.maxFileSize || 52428800) / 1024 / 1024)} MB`],
          ["Max Files", assignment.maxFileCount || 5],
        ].map(([label, val]) => (
          <div key={label} className="rounded-xl border border-slate-100 bg-white p-3 text-center">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-base font-bold text-slate-800">{val}</p>
          </div>
        ))}
      </div>

      {/* Submissions */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-800">
          Submissions ({submissions.length})
        </h4>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-10 text-center">
          <Upload className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">No submissions yet</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
          {submissions.map((sub) => (
            <div
              key={sub._id}
              className="flex items-center justify-between py-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {sub.studentId?.name || sub.studentId?.email || "Student"}
                </p>
                <p className="text-xs text-slate-400">
                  Submitted {formatDate(sub.submittedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {sub.grade != null && (
                  <span className="text-xs font-bold text-slate-700">
                    {sub.grade}/{assignment.maxMarks}
                  </span>
                )}
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                    statusBadge[sub.status] || "bg-slate-100 text-slate-600"
                  )}
                >
                  {sub.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ModalShell>
  );
}

/* ── Main Page ──────────────────────────────────────── */
export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = React.useState([]);
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [filterCourse, setFilterCourse] = React.useState("all");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [modal, setModal] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  /* Load data */
  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const coursesRes = await apiFetch("/api/courses?action=instructorCourses&limit=100");
      const allCourses = coursesRes.data?.courses || coursesRes.data || [];
      setCourses(allCourses);

      // Load assignments for each course
      const assignPromises = allCourses.slice(0, 20).map((c) =>
        apiFetch(`/api/quizzes?action=courseAssignments&courseId=${c._id}`)
          .then((d) => (d.data || []).map((a) => ({ ...a, courseName: c.title })))
          .catch(() => [])
      );
      const results = await Promise.all(assignPromises);
      setAssignments(results.flat());
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadData(); }, [loadData]);

  /* Filtered */
  const filtered = React.useMemo(() => {
    let a = assignments;
    if (search.trim()) {
      const s = search.toLowerCase();
      a = a.filter(
        (x) =>
          x.title?.toLowerCase().includes(s) ||
          x.courseName?.toLowerCase().includes(s)
      );
    }
    if (filterCourse !== "all")
      a = a.filter((x) => String(x.courseId) === filterCourse || String(x.courseId?._id) === filterCourse);
    if (filterStatus === "published") a = a.filter((x) => x.isPublished);
    if (filterStatus === "draft") a = a.filter((x) => !x.isPublished);
    if (filterStatus === "active")
      a = a.filter((x) => x.isPublished && (!x.deadline || new Date(x.deadline) > new Date()));
    if (filterStatus === "closed")
      a = a.filter((x) => x.deadline && new Date(x.deadline) < new Date());
    return a;
  }, [assignments, search, filterCourse, filterStatus]);

  /* Stats */
  const stats = React.useMemo(() => ({
    total: assignments.length,
    active: assignments.filter(
      (a) => a.isPublished && (!a.deadline || new Date(a.deadline) > new Date())
    ).length,
    totalSubmissions: assignments.reduce((s, a) => s + (a.totalSubmissions || 0), 0),
    graded: assignments.reduce((s, a) => s + (a.gradedSubmissions || 0), 0),
  }), [assignments]);

  /* CRUD */
  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await apiFetch("/api/quizzes?action=createAssignment", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setToast({ msg: "Assignment created successfully!", type: "success" });
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
      await apiFetch(`/api/quizzes?action=updateAssignment&assignmentId=${selected._id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      setToast({ msg: "Assignment updated!", type: "success" });
      setModal(null);
      loadData();
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (assignment) => {
    try {
      await apiFetch(
        `/api/quizzes?action=updateAssignment&assignmentId=${assignment._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isPublished: !assignment.isPublished,
            publishedAt: !assignment.isPublished ? new Date().toISOString() : null,
          }),
        }
      );
      setToast({
        msg: assignment.isPublished ? "Assignment unpublished" : "Assignment published!",
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
      await apiFetch(
        `/api/quizzes?action=deleteAssignment&assignmentId=${selected._id}`,
        { method: "DELETE" }
      );
      setToast({ msg: "Assignment deleted", type: "success" });
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
    "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10";

  return (
    <div className="space-y-6">
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assignments</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Create, manage, and review course assignments and student submissions.
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
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 transition shadow-sm"
          >
            <Plus className="h-4 w-4" /> New Assignment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Assignments" value={stats.total} icon={ClipboardList} color="orange" />
        <StatCard label="Active Now" value={stats.active} icon={CheckCircle2} color="emerald" />
        <StatCard label="Total Submissions" value={stats.totalSubmissions} icon={Upload} color="blue" />
        <StatCard label="Graded" value={stats.graded} icon={Award} color="red" />
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
              placeholder="Search assignments by title or course…"
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
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className="text-sm text-slate-500">Loading assignments…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <ClipboardList className="h-12 w-12 text-slate-200" />
            <p className="text-sm font-medium text-slate-500">No assignments found</p>
            <button
              onClick={() => setModal("create")}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 transition"
            >
              <Plus className="h-4 w-4" /> Create First Assignment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Assignment</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Course</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Max Marks</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Submissions</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Deadline</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((assignment) => (
                  <AssignmentRow
                    key={assignment._id}
                    assignment={assignment}
                    onView={() => { setSelected(assignment); setModal("detail"); }}
                    onEdit={() => { setSelected(assignment); setModal("edit"); }}
                    onDelete={() => { setSelected(assignment); setModal("delete"); }}
                    onTogglePublish={() => handleTogglePublish(assignment)}
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
        title="Create New Assignment"
        onClose={() => setModal(null)}
        width="max-w-2xl"
      >
        <AssignmentForm
          courses={courses}
          onSave={handleCreate}
          onCancel={() => setModal(null)}
          loading={saving}
        />
      </ModalShell>

      {/* Edit Modal */}
      <ModalShell
        open={modal === "edit"}
        title="Edit Assignment"
        onClose={() => setModal(null)}
        width="max-w-2xl"
      >
        {selected && (
          <AssignmentForm
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
        <AssignmentDetailModal
          assignment={selected}
          onClose={() => { setModal(null); loadData(); }}
          onEdit={(a) => { setSelected(a); setModal("edit"); }}
          onTogglePublish={(a) => {
            handleTogglePublish(a);
            setSelected((p) => ({ ...p, isPublished: !p.isPublished }));
          }}
          onDelete={(a) => { setSelected(a); setModal("delete"); }}
        />
      )}

      {/* Delete Confirm */}
      <ModalShell
        open={modal === "delete"}
        title="Delete Assignment"
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
            All submissions will also be permanently removed.
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
              Delete Assignment
            </button>
          </div>
        </div>
      </ModalShell>
    </div>
  );
}

/* ── Assignment Row ─────────────────────────────────── */
function AssignmentRow({ assignment, onView, onEdit, onDelete, onTogglePublish }) {
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

  const isPast = assignment.deadline && new Date(assignment.deadline) < new Date();

  return (
    <tr className="group hover:bg-orange-50/20 transition">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              isPast ? "bg-red-100" : "bg-orange-100"
            )}
          >
            <ClipboardList
              className={cn("h-4 w-4", isPast ? "text-red-500" : "text-orange-600")}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{assignment.title}</p>
            <p className="text-xs text-slate-400">
              {assignment.allowResubmission ? "Resubmission allowed" : "Single submission"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="max-w-[160px] truncate text-sm text-slate-600">
          {assignment.courseName || "—"}
        </p>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="text-sm font-medium text-slate-700">{assignment.maxMarks}</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="text-sm text-slate-600">
          {assignment.totalSubmissions || 0}
        </span>
        {(assignment.gradedSubmissions || 0) > 0 && (
          <span className="ml-1 text-xs text-emerald-600">
            ({assignment.gradedSubmissions} graded)
          </span>
        )}
      </td>
      <td className="px-4 py-4 text-center">
        <span
          className={cn(
            "text-sm",
            isPast ? "font-medium text-red-500" : "text-slate-600"
          )}
        >
          {formatDate(assignment.deadline)}
        </span>
      </td>
      <td className="px-4 py-4 text-center">
        <StatusBadge published={assignment.isPublished} deadline={assignment.deadline} />
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
            <div className="absolute right-0 top-full z-30 mt-1 w-48 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl">
              <ActionItem icon={Eye} label="View & Submissions" onClick={() => { setMenuOpen(false); onView(); }} />
              <ActionItem icon={Edit2} label="Edit Assignment" onClick={() => { setMenuOpen(false); onEdit(); }} />
              <ActionItem
                icon={assignment.isPublished ? Clock : CheckCircle2}
                label={assignment.isPublished ? "Unpublish" : "Publish"}
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
