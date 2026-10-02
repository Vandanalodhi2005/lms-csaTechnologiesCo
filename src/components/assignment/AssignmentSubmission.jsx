"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  FileUp,
  Paperclip,
  UploadCloud,
  X,
} from "lucide-react";

function formatFileSize(bytes = 0) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function fileMatchesAllowed(file, assignment) {
  if (!assignment?.allowedExtensions?.length && !assignment?.allowedFileTypes?.length) {
    return true;
  }

  const fileName = file.name || "";
  const extension = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")).toLowerCase() : "";
  const mimeType = file.type || "";
  const allowedExtensions = assignment.allowedExtensions || [];
  const allowedTypes = assignment.allowedFileTypes || [];

  const extensionAllowed = allowedExtensions.includes(extension);
  const typeAllowed = mimeType ? allowedTypes.includes(mimeType) : false;

  return extensionAllowed || typeAllowed;
}

export default function AssignmentSubmission({ assignment, course }) {
  const fileInputRef = useRef(null);
  const [textResponse, setTextResponse] = useState(assignment?.textResponse || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [textError, setTextError] = useState("");
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionPhase, setSubmissionPhase] = useState(
    assignment?.status === "graded" ? "graded" : assignment?.status === "submitted" ? "submitted" : "form"
  );

  const maxFileSizeBytes = (assignment?.maxFileSizeMB || 10) * 1024 * 1024;
  const minTextLength = assignment?.textResponseMinLength || 0;
  const maxTextLength = assignment?.textResponseMaxLength || 2000;
  const remainingAttempts = Math.max(0, (assignment?.attemptsAllowed || 1) - (assignment?.attemptsUsed || 0));

  const validateText = (value) => {
    if (!assignment?.requiresTextResponse) return "";
    const trimmed = value.trim();

    if (!trimmed) return "Please enter your submission.";
    if (trimmed.length < minTextLength) {
      return `Please enter at least ${minTextLength} characters.`;
    }
    if (trimmed.length > maxTextLength) {
      return `Your submission must be ${maxTextLength} characters or fewer.`;
    }

    return "";
  };

  const validateFile = (file) => {
    if (!assignment?.requiresFile) return "";
    if (!file) return "Please upload your project file.";

    if (!fileMatchesAllowed(file, assignment)) {
      return "This file type is not supported.";
    }

    if (file.size > maxFileSizeBytes) {
      return `File size must be ${assignment.maxFileSizeMB} MB or smaller.`;
    }

    return "";
  };

  const handleFileSelection = (file) => {
    if (!file) return;
    const error = validateFile(file);

    if (error) {
      setSelectedFile(null);
      setFileError(error);
      return;
    }

    setSelectedFile(file);
    setFileError("");
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    handleFileSelection(file);
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFileError("");
    resetFileInput();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    handleFileSelection(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextTextError = validateText(textResponse);
    const nextFileError = validateFile(selectedFile);

    setTextError(nextTextError);
    setFileError(nextFileError);

    if (nextTextError || nextFileError) return;

    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionPhase("confirmation");
    }, 600);
  };

  const handleViewSubmission = () => {
    setSubmissionPhase("submitted");
  };

  if (assignment?.status === "graded" || submissionPhase === "graded") {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Assignment Graded</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Score: {assignment.score || 86} / 100</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Score</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{assignment.percentage || 86}%</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Graded On</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{assignment.gradedAt || "October 09, 2026"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-2 text-base font-semibold text-emerald-700">Graded</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900">Grader Feedback</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {assignment.feedback || "No instructor feedback yet."}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  if (assignment?.status === "submitted" || submissionPhase === "submitted") {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Assignment Submitted</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Submitted on {assignment.submittedAt || "October 15, 2026"}</h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Status</p>
            <p className="mt-1 text-sm text-slate-600">Under Review</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">File</p>
            <p className="mt-1 text-sm text-slate-600">{selectedFile?.name || assignment.submittedFileName || "No file selected."}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Text Response</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {textResponse || assignment.textResponse || "No submission yet."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Course
          </Link>

          {remainingAttempts > 0 ? (
            <button
              type="button"
              onClick={() => setSubmissionPhase("form")}
              className="inline-flex items-center justify-center rounded-xl bg-[#0F2F5F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#153c7f]"
            >
              Resubmit
            </button>
          ) : (
            <span className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400">
              No additional attempts remaining.
            </span>
          )}
        </div>
      </div>
    );
  }

  if (submissionPhase === "confirmation") {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Submission</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Assignment Submitted Successfully</h2>
          </div>
        </div>

        <p className="mt-5 text-base leading-7 text-slate-600">
          Your assignment has been submitted successfully.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Submitted</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{assignment.submittedAt || "October 15, 2026"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-2 text-base font-semibold text-slate-900">Under Review</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Course
          </Link>
          <button
            type="button"
            onClick={handleViewSubmission}
            className="inline-flex items-center justify-center rounded-xl bg-[#0F2F5F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#153c7f]"
          >
            View Submission
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <FileUp className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Submission</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Submit Your Assignment</h2>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="submission" className="mb-2 block text-sm font-semibold text-slate-700">
            Your Submission
          </label>
          <textarea
            id="submission"
            name="submission"
            value={textResponse}
            onChange={(event) => {
              setTextResponse(event.target.value);
              setTextError(validateText(event.target.value));
            }}
            rows={7}
            placeholder="Explain your approach, challenges, or implementation details..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>{textResponse.length} / {maxTextLength} characters</span>
            {textError ? (
              <span className="inline-flex items-center gap-1 text-rose-600">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{textError}</span>
              </span>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="assignment-file" className="mb-2 block text-sm font-semibold text-slate-700">
            Upload Your Project
          </label>

          <div
            role="button"
            tabIndex={0}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={[
              "rounded-2xl border-2 border-dashed p-5 text-center transition",
              isDragging ? "border-blue-400 bg-blue-50" : "border-slate-300 bg-slate-50",
            ].join(" ")}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
              <UploadCloud className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-800">Drag and drop your files here</p>
            <p className="mt-1 text-sm text-slate-500">or browse from your device</p>

            <input
              id="assignment-file"
              ref={fileInputRef}
              type="file"
              accept={assignment?.allowedExtensions?.join(",") || undefined}
              onChange={handleInputChange}
              className="sr-only"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#0F2F5F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#153c7f]"
            >
              Choose File
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Allowed:</span>
            {(assignment?.allowedExtensions || [".zip", ".pdf"]).map((extension) => (
              <span key={extension} className="rounded-full border border-slate-200 bg-white px-2 py-1">
                {extension.replace(".", "").toUpperCase()}
              </span>
            ))}
            <span className="rounded-full border border-slate-200 bg-white px-2 py-1">
              Max {assignment?.maxFileSizeMB || 10} MB
            </span>
          </div>

          {fileError ? (
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-rose-600">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {fileError}
            </p>
          ) : null}

          {selectedFile ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                    <Paperclip className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type || "Unknown file type"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeSelectedFile}
                  aria-label="Remove selected file"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-[#0F2F5F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#153c7f] disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      </div>
    </form>
  );
}
