"use client";

import * as React from "react";
import Link from "next/link";
import {
  Settings,
  Bell,
  Lock,
  ShieldCheck,
  Building,
  Save,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/utils";
import { toast } from "sonner";

export default function InstructorSettingsPage() {
  const [activeTab, setActiveTab] = React.useState("teaching"); // "teaching" | "notifications" | "security" | "tax"

  // Teaching preferences
  const [autoApproveEnrollments, setAutoApproveEnrollments] = React.useState(true);
  const [allowPublicDiscussion, setAllowPublicDiscussion] = React.useState(true);
  const [studentCohortLimit, setStudentCohortLimit] = React.useState("Unlimited");

  // Notification toggles
  const [emailOnSubmission, setEmailOnSubmission] = React.useState(true);
  const [emailOnQnA, setEmailOnQnA] = React.useState(true);
  const [emailOnReview, setEmailOnReview] = React.useState(true);
  const [emailOnPayout, setEmailOnPayout] = React.useState(true);

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(true);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSaveTeaching = (e) => {
    e.preventDefault();
    toast.success("Teaching preferences saved!");
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    toast.success("Notification preferences updated!");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in current and new password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Instructor account password successfully updated!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Instructor Portal Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Teaching & Account Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure teaching policies, student interaction settings, email alerts, and credentials.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/60 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveTab("teaching")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap",
            activeTab === "teaching" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Teaching Preferences
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap",
            activeTab === "notifications" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Alerts & Notifications
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap",
            activeTab === "security" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Password & 2FA
        </button>

        <button
          onClick={() => setActiveTab("tax")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap",
            activeTab === "tax" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Tax & Legal Verification
        </button>
      </div>

      {/* Tab 1: Teaching */}
      {activeTab === "teaching" && (
        <form
          onSubmit={handleSaveTeaching}
          className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6"
        >
          <div>
            <h3 className="text-base font-bold text-slate-900">Classroom Automation Rules</h3>
            <p className="text-xs text-slate-500 mt-1">
              Control enrollment permissions and interaction boundaries for your students.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Auto-Approve Student Enrollments
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Allows students to immediately access curriculum videos once tuition payment is confirmed.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoApproveEnrollments}
                onChange={(e) => setAutoApproveEnrollments(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Allow Public Lesson Comments & Q&A
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Enable students to post questions and collaborate below classroom video lectures.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowPublicDiscussion}
                onChange={(e) => setAllowPublicDiscussion(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Teaching Rules</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Notifications */}
      {activeTab === "notifications" && (
        <form
          onSubmit={handleSaveNotifications}
          className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6"
        >
          <div>
            <h3 className="text-base font-bold text-slate-900">Instructor Alert Channels</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select which notifications trigger an immediate email to your registered address.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  New Assignment Submission Alert
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sends an email with student name and code link whenever a project is submitted.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailOnSubmission}
                onChange={(e) => setEmailOnSubmission(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  New Q&A Question Posted
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Instant alert when a learner asks for help on an active course lecture.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailOnQnA}
                onChange={(e) => setEmailOnQnA(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  New Student Review & Rating
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Notifies you when a student publishes feedback on your courses.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailOnReview}
                onChange={(e) => setEmailOnReview(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Monthly Payout Remittance Confirmation
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Confirmation receipt and PDF tax invoice when bank disbursement completes.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailOnPayout}
                onChange={(e) => setEmailOnPayout(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Notification Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Security */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <form
            onSubmit={handleUpdatePassword}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4"
          >
            <div>
              <h3 className="text-base font-bold text-slate-900">Update Password</h3>
              <p className="text-xs text-slate-500 mt-1">
                Protect your instructor account and financial information with a strong password.
              </p>
            </div>

            <div className="space-y-3 max-w-md">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>

          {/* 2FA */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Two-Factor Authentication (2FA)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Required for instructors with active direct bank deposit payouts.
              </p>
            </div>
            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                toast.success(
                  twoFactorEnabled ? "2FA disabled" : "2FA activated with Google Authenticator"
                );
              }}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                twoFactorEnabled
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              {twoFactorEnabled ? "2FA Active" : "Enable 2FA"}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Tax */}
      {activeTab === "tax" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Tax & Regulatory Compliance</h3>
            <p className="text-xs text-slate-500 mt-1">
              Official verification status for royalty taxation and compliance with local revenue authorities.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-emerald-950">
                  Tax Profile: Fully Verified & Active
                </p>
                <p className="text-[11px] text-emerald-800">
                  PAN: ABCDE1234F • TDS exemption certificate active for FY 2026–27.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] uppercase">
              Verified
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
