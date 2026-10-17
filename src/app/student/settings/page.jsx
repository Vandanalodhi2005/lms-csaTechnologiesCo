"use client";

import * as React from "react";
import Link from "next/link";
import {
  Settings,
  Target,
  Bell,
  Lock,
  CreditCard,
  ShieldCheck,
  Smartphone,
  Mail,
  Save,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Download,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { cn } from "@/utils";
import { toast } from "sonner";

export default function StudentSettingsPage() {
  const [activeTab, setActiveTab] = React.useState("goals"); // "goals" | "notifications" | "security" | "billing"

  // Study goals state
  const [dailyTarget, setDailyTarget] = React.useState("45");
  const [careerTrack, setCareerTrack] = React.useState("Full Stack Web Engineer");
  const [studyDays, setStudyDays] = React.useState({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: false,
    Sun: false,
  });

  // Notification toggles
  const [emailGrades, setEmailGrades] = React.useState(true);
  const [emailAnnouncements, setEmailAnnouncements] = React.useState(true);
  const [emailWeeklyDigest, setEmailWeeklyDigest] = React.useState(false);
  const [pushReminders, setPushReminders] = React.useState(true);

  // Security state
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const toggleDay = (day) => {
    setStudyDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSaveGoals = (e) => {
    e.preventDefault();
    toast.success("Study goals and weekly schedule saved!");
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    toast.success("Notification preferences updated!");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both current and new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Password changed successfully! You will stay logged in on this device.");
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
            <span>Portal Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account & Learning Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure your personalized learning pace, alert channels, two-factor authentication, and billing.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/60 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveTab("goals")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap",
            activeTab === "goals"
              ? "bg-white text-blue-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Target className="w-4 h-4" />
          <span>Study Goals & Pace</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap",
            activeTab === "notifications"
              ? "bg-white text-blue-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts & Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap",
            activeTab === "security"
              ? "bg-white text-blue-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Lock className="w-4 h-4" />
          <span>Password & 2FA</span>
        </button>

        <button
          onClick={() => setActiveTab("billing")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap",
            activeTab === "billing"
              ? "bg-white text-blue-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <CreditCard className="w-4 h-4" />
          <span>Membership & Billing</span>
        </button>
      </div>

      {/* Tab 1: Goals */}
      {activeTab === "goals" && (
        <form
          onSubmit={handleSaveGoals}
          className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6"
        >
          <div>
            <h3 className="text-base font-bold text-slate-900">Personalized Learning Roadmap</h3>
            <p className="text-xs text-slate-500 mt-1">
              Set realistic daily targets to keep your learning streak alive and maintain momentum.
            </p>
          </div>

          {/* Daily study target */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Daily Target Study Time
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {["15", "30", "45", "60", "90"].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDailyTarget(mins)}
                  className={cn(
                    "p-3 rounded-2xl border text-center font-bold text-xs transition-all",
                    dailyTarget === mins
                      ? "bg-blue-50 border-blue-600 text-blue-700 shadow-2xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                  )}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1 opacity-70" />
                  <span>{mins} Mins / Day</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Study Days */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Active Weekly Schedule
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(studyDays).map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "w-12 h-12 rounded-2xl font-bold text-xs transition-all border",
                    studyDays[day]
                      ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Streak reminders will only be delivered on your designated study days.
            </p>
          </div>

          {/* Career Track */}
          <div className="space-y-2 max-w-md">
            <label className="block text-xs font-bold text-slate-800">
              Target Career Role
            </label>
            <select
              value={careerTrack}
              onChange={(e) => setCareerTrack(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Full Stack Web Engineer">Full Stack Web Engineer</option>
              <option value="AI & Machine Learning Specialist">AI & Machine Learning Specialist</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Product UI/UX Designer">Product UI/UX Designer</option>
              <option value="Cloud DevOps Architect">Cloud DevOps Architect</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Goal Preferences</span>
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
            <h3 className="text-base font-bold text-slate-900">Communication Channels</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select which notifications you want delivered to your email inbox and browser.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Grade Releases & Feedback
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Receive an instant email when an instructor grades your assignment or test.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailGrades}
                onChange={(e) => setEmailGrades(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Course Content & Lesson Releases
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Notifies you when new lectures or bonus curriculum files are unlocked.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailAnnouncements}
                onChange={(e) => setEmailAnnouncements(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Weekly Study Streak Digest
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  A Monday morning report summarizing total hours learned and XP earned.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailWeeklyDigest}
                onChange={(e) => setEmailWeeklyDigest(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Browser Push Reminders
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Receive a gentle reminder at your preferred study time when active.
                </p>
              </div>
              <input
                type="checkbox"
                checked={pushReminders}
                onChange={(e) => setPushReminders(e.target.checked)}
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
              <span>Save Channels</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Security */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Change Password Form */}
          <form
            onSubmit={handleUpdatePassword}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4"
          >
            <div>
              <h3 className="text-base font-bold text-slate-900">Update Password</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ensure your student account is using a long, random password to stay secure.
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

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Two-Factor Authentication (2FA)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add an extra layer of security requiring an authenticator app code to sign in.
                </p>
              </div>
              <button
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  if (!twoFactorEnabled) {
                    toast.success("Two-Factor Authentication enabled!");
                  } else {
                    toast.info("Two-Factor Authentication disabled");
                  }
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
        </div>
      )}

      {/* Tab 4: Billing */}
      {activeTab === "billing" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Membership & Invoices</h3>
            <p className="text-xs text-slate-500 mt-1">
              Manage your all-access student subscription and download tax invoices.
            </p>
          </div>

          {/* Current plan card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-blue-500/30 px-2 py-0.5 rounded-full text-blue-200">
                Active Subscription
              </span>
              <h4 className="text-xl font-black">EduLearn All-Access Student Pass</h4>
              <p className="text-xs text-blue-200">
                Renews automatically on Dec 15, 2026 • $199.00 / Year
              </p>
            </div>

            <button
              onClick={() => toast.info("Opening billing portal...")}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all shrink-0"
            >
              Manage Subscription
            </button>
          </div>

          {/* Invoices list */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Invoices
            </h4>

            <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 flex items-center justify-between text-xs transition-all">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-bold text-slate-900">Invoice #EDU-2025-9812</p>
                  <p className="text-slate-400">Dec 15, 2025 • $199.00 (Paid)</p>
                </div>
              </div>
              <button
                onClick={() => toast.success("Downloading PDF Receipt")}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
