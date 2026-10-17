"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  MessageSquare,
  AlertCircle,
  Trash2,
  Check,
  Settings,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { cn } from "@/utils";
import { toast } from "sonner";

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Assignment Graded: Interactive Kanban with Zustand",
    description: "Sarah Jenkins graded your project: 98/100 (A+) with personalized feedback on your drag-and-drop state management.",
    type: "grade",
    timestamp: "15 minutes ago",
    read: false,
    link: "/student/assignments",
  },
  {
    id: "notif-2",
    title: "Reminder: Next.js 14 Deep Dive Quiz Due in 48 Hours",
    description: "Don't forget to complete your Module 3 assessment to stay eligible for your term certificate.",
    type: "deadline",
    timestamp: "2 hours ago",
    read: false,
    link: "/student/quizzes",
  },
  {
    id: "notif-3",
    title: "New Lecture Published: Parallel Routes & Intercepting Modals",
    description: "A new video lecture and downloadable code samples are now live in Full Stack Web Development Masterclass.",
    type: "course",
    timestamp: "Yesterday",
    read: false,
    link: "/student/learning",
  },
  {
    id: "notif-4",
    title: "Official Certificate Issued: TypeScript & Enterprise Architecture",
    description: "Your verified completion diploma (ID: EDU-TS-89412) is now available for download and LinkedIn sharing.",
    type: "certificate",
    timestamp: "2 days ago",
    read: false,
    link: "/student/certificates",
  },
  {
    id: "notif-5",
    title: "Instructor Replied to your Q&A Question",
    description: "Dr. Marcus Chen replied: 'For time-series resampling, always ensure your index is a valid datetime format.'",
    type: "discussion",
    timestamp: "3 days ago",
    read: true,
    link: "/student/learning",
  },
  {
    id: "notif-6",
    title: "14-Day Study Streak Achievement Unlocked!",
    description: "You've earned the 'Dedicated Scholar' badge and +150 XP for consistent daily learning.",
    type: "achievement",
    timestamp: "4 days ago",
    read: true,
    link: "/student/profile?tab=badges",
  },
];

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = React.useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = React.useState("all"); // "all" | "unread" | "grade" | "deadline" | "course"

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "grade") return n.type === "grade";
    if (filter === "deadline") return n.type === "deadline";
    if (filter === "course") return n.type === "course";
    return true;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.info("Notification dismissed");
  };

  const getIcon = (type) => {
    switch (type) {
      case "grade":
        return <Award className="w-5 h-5 text-emerald-600" />;
      case "deadline":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "course":
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case "certificate":
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case "discussion":
        return <MessageSquare className="w-5 h-5 text-sky-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "grade":
        return "bg-emerald-50";
      case "deadline":
        return "bg-amber-50";
      case "course":
        return "bg-blue-50";
      case "certificate":
        return "bg-purple-50";
      case "discussion":
        return "bg-sky-50";
      default:
        return "bg-slate-100";
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts & Updates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications & Announcements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay in sync with grading feedback, upcoming test dates, and curriculum releases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Mark all as read ({unreadCount})</span>
            </button>
          )}

          <Link
            href="/student/settings"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Notification Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
            filter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={cn(
            "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
            filter === "unread" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("grade")}
          className={cn(
            "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
            filter === "grade" ? "bg-white text-emerald-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Grades & Feedback
        </button>
        <button
          onClick={() => setFilter("deadline")}
          className={cn(
            "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
            filter === "deadline" ? "bg-white text-amber-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Deadlines & Quizzes
        </button>
        <button
          onClick={() => setFilter("course")}
          className={cn(
            "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
            filter === "course" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Course Material
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No notifications here</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You're all caught up! Check back later when new course material or assignment grades are published.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs divide-y divide-slate-100">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "p-5 flex items-start gap-4 transition-colors group",
                !notif.read ? "bg-blue-50/30 hover:bg-blue-50/50" : "hover:bg-slate-50/60"
              )}
            >
              {/* Type Icon */}
              <div
                className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs",
                  getBgColor(notif.type)
                )}
              >
                {getIcon(notif.type)}
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4
                      className={cn(
                        "text-xs sm:text-sm font-bold text-slate-900",
                        !notif.read && "text-blue-950 font-black"
                      )}
                    >
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {notif.description}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <Link
                    href={notif.link}
                    onClick={() => markAsRead(notif.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs text-slate-400 hover:text-slate-700 font-medium"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => deleteNotification(notif.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all shrink-0"
                title="Dismiss"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
