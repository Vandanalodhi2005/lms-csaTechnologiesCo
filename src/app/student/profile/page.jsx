"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Award,
  BookOpen,
  Clock,
  Flame,
  CheckCircle2,
  Sparkles,
  Camera,
  Share2,
  Lock,
  Shield,
  Bell,
  Trash2,
  ExternalLink,
  Download,
  PlayCircle,
  Star,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar.jsx";
import { toast } from "sonner";

const enrolledCourses = [
  {
    id: 1,
    title: "Full Stack Web Development Masterclass",
    instructor: "Dr. Robert Chen",
    category: "Development",
    progress: 78,
    totalLessons: 36,
    completedLessons: 28,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80",
    status: "In Progress",
    nextLesson: "React Server Components & Suspense",
  },
  {
    id: 2,
    title: "UI/UX Design Systems & Figma Prototyping",
    instructor: "Sarah Wilson",
    category: "Design",
    progress: 100,
    totalLessons: 24,
    completedLessons: 24,
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
    status: "Completed",
    certificateId: "EDU-88219",
  },
  {
    id: 3,
    title: "Python & Data Science Bootcamp",
    instructor: "Michael Brown",
    category: "Data Science",
    progress: 42,
    totalLessons: 35,
    completedLessons: 15,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80",
    status: "In Progress",
    nextLesson: "Data Cleaning with Pandas",
  },
];

const certificatesList = [
  {
    id: "EDU-88219",
    courseTitle: "UI/UX Design Systems & Figma Prototyping",
    instructor: "Sarah Wilson",
    issueDate: "September 28, 2026",
    grade: "Grade: 94%",
    badgeColor: "from-blue-600 to-indigo-600",
  },
  {
    id: "EDU-77402",
    courseTitle: "Modern JavaScript (ES6+) Architecture",
    instructor: "Dr. Robert Chen",
    issueDate: "August 15, 2026",
    grade: "Grade: 98%",
    badgeColor: "from-amber-500 to-orange-600",
  },
];

const badgesList = [
  {
    title: "Course Finisher",
    description: "Completed your first certified course with flying colors.",
    icon: Award,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    earnedDate: "Sep 2026",
  },
  {
    title: "14-Day Streak Master",
    description: "Maintained active study sessions for 14 consecutive days.",
    icon: Flame,
    color: "bg-amber-50 text-amber-600 border-amber-200",
    earnedDate: "Active Now",
  },
  {
    title: "Quiz Whiz",
    description: "Scored 90%+ on three consecutive module quizzes.",
    icon: Sparkles,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    earnedDate: "Oct 2026",
  },
  {
    title: "Code Explorer",
    description: "Submitted 10+ hands-on exercises and coding challenges.",
    icon: GraduationCap,
    color: "bg-purple-50 text-purple-600 border-purple-200",
    earnedDate: "Oct 2026",
  },
];

export default function StudentProfilePage() {
  const [activeTab, setActiveTab] = React.useState("personal");
  const [isSaving, setIsSaving] = React.useState(false);
  const [previewCert, setPreviewCert] = React.useState(null);

  // Profile Form state
  const [profile, setProfile] = React.useState({
    fullName: "Alex Morgan",
    displayName: "Alex",
    username: "alex_morgan",
    email: "alex.morgan@edulearn.com",
    phone: "+1 (555) 234-5678",
    bio: "Passionate aspiring Full-Stack Developer & UI/UX enthusiast. Currently learning Next.js, TypeScript, and TailwindCSS on EduLearn.",
    occupation: "Computer Science Student & Junior Developer",
    education: "Undergraduate (B.S. in Computer Science)",
    location: "New York, USA",
    goal: "Become a proficient Full-Stack Software Engineer by late 2026.",
    website: "https://alexmorgan.dev",
    github: "https://github.com/alexmorgan",
    linkedin: "https://linkedin.com/in/alexmorgan",
    twitter: "https://twitter.com/alex_codes",
  });

  // Password state
  const [passwords, setPasswords] = React.useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });

  // Notification settings
  const [notifications, setNotifications] = React.useState({
    courseUpdates: true,
    quizReminders: true,
    assignmentGrading: true,
    weeklyReport: true,
    marketing: false,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    toast.success("Profile updated successfully!");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwords.newPass.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    toast.success("Password changed successfully!");
    setPasswords({ current: "", newPass: "", confirmPass: "" });
  };

  const copyShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Public profile link copied to clipboard!");
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn font-sans">
      
      {/* Profile Header Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Cover Banner */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 relative flex items-end justify-end p-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/20" />
          <button
            onClick={() => toast.info("Cover photo upload dialog opened")}
            className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white backdrop-blur text-xs font-semibold shadow-xs transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Change Cover</span>
          </button>
        </div>

        {/* Profile Identity Row */}
        <div className="px-6 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 relative z-10">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative inline-block">
                <Avatar
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                  name={profile.fullName}
                  size="3xl"
                  className="w-28 h-28 sm:w-32 sm:h-32 ring-4 ring-white shadow-xl rounded-3xl object-cover"
                />
                <button
                  onClick={() => toast.info("Avatar upload modal opened")}
                  className="absolute bottom-1 right-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all active:scale-95"
                  title="Update profile picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {profile.fullName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Student
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  @{profile.username} • {profile.occupation}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Joined January 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
              <button
                onClick={copyShareLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Share</span>
              </button>
              <button
                onClick={() => setActiveTab("personal")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
              >
                <User className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-100">
            <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl text-center">
              <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">6</p>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">Enrolled</p>
            </div>
            <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl text-center">
              <p className="text-xl sm:text-2xl font-bold text-emerald-600 tracking-tight">2</p>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">Completed</p>
            </div>
            <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl text-center">
              <p className="text-xl sm:text-2xl font-bold text-blue-600 tracking-tight">3</p>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">Certificates</p>
            </div>
            <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl text-center">
              <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">142h</p>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">Hours Studied</p>
            </div>
            <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-2xl text-center">
              <p className="text-xl sm:text-2xl font-bold text-amber-600 tracking-tight flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                14d
              </p>
              <p className="text-[11px] font-medium text-amber-700 mt-0.5">Streak</p>
            </div>
            <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl text-center">
              <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">89.4%</p>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">Avg Score</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="px-6 sm:px-8 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: "personal", label: "Personal Information", icon: User },
            { id: "courses", label: "My Learning", icon: BookOpen },
            { id: "certificates", label: "Certificates", icon: Award },
            { id: "badges", label: "Achievements", icon: Sparkles },
            { id: "security", label: "Account & Security", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3.5 px-3 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Personal Details */}
      {activeTab === "personal" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">General Information</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Update your personal details, public bio, and location.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={profile.displayName}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all pr-20"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-[10px] font-bold text-emerald-600">
                    Verified
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bio / Headline
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={profile.bio}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Location (City, Country)
                </label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Education Level
                </label>
                <input
                  type="text"
                  name="education"
                  value={profile.education}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Learning Goal & Target
                </label>
                <input
                  type="text"
                  name="goal"
                  value={profile.goal}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Social Links Panel */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Social Profiles & Portfolio</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Connect your social accounts to display on your student transcript.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Personal Website / Portfolio
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    name="website"
                    value={profile.website}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  GitHub Profile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Github className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    name="github"
                    value={profile.github}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Twitter / X Handle
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Twitter className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    name="twitter"
                    value={profile.twitter}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: My Learning & Enrolled Courses */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Enrolled Courses</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Track your ongoing progress, continue modules, and download course assets.
                </p>
              </div>
              <Link
                href="/courses"
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Explore more courses →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 relative overflow-hidden bg-slate-100">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === "Completed"
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-blue-600 text-white shadow-xs"
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          {c.category}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 mt-0.5 line-clamp-1">
                          {c.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Instructor: {c.instructor}</p>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-600">Progress</span>
                          <span className="text-slate-900">{c.progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              c.progress === 100 ? "bg-emerald-500" : "bg-blue-600"
                            }`}
                            style={{ width: `${c.progress}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {c.completedLessons} of {c.totalLessons} lessons completed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    {c.status === "Completed" ? (
                      <button
                        onClick={() => {
                          setPreviewCert({
                            id: c.certificateId,
                            courseTitle: c.title,
                            instructor: c.instructor,
                            issueDate: "September 28, 2026",
                            grade: "96%",
                          });
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Award className="w-4 h-4" />
                        <span>View Certificate</span>
                      </button>
                    ) : (
                      <Link
                        href={`/learn/${c.id}`}
                        className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-black text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Continue Lesson</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Certificates */}
      {activeTab === "certificates" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Earned Certifications</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Official certificates of completion that you can share with employers or on LinkedIn.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {certificatesList.map((cert) => (
                <div
                  key={cert.id}
                  className="border border-slate-200 rounded-3xl p-6 bg-gradient-to-br from-white to-slate-50 shadow-2xs hover:shadow-md transition-all space-y-4 relative"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                      ID: {cert.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {cert.courseTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Instructor: {cert.instructor}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                      <span>Issued: {cert.issueDate}</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-600">{cert.grade}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setPreviewCert(cert)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-black text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => toast.success(`Certificate ${cert.id} downloaded!`)}
                      className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Badges & Achievements */}
      {activeTab === "badges" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Student Honors & Badges</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Earn badges as you hit milestones, finish modules, and ace quizzes.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {badgesList.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.title}
                    className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all text-center flex flex-col items-center justify-between"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-3 shadow-xs ${b.color}`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900">{b.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {b.description}
                      </p>
                    </div>

                    <span className="mt-4 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                      {b.earnedDate}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Account & Security */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Password Update Card */}
          <form onSubmit={handlePasswordChange} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Ensure your account is using a long, randomized password to stay secure.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.newPass}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwords.confirmPass}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirmPass: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
              >
                Update Password
              </button>
            </div>
          </form>

          {/* Notifications Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Control which email & push alerts you receive about your courses.
              </p>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              {[
                { key: "courseUpdates", label: "Course Updates & Announcements", desc: "Get notified when instructors publish new lessons or content." },
                { key: "quizReminders", label: "Quiz & Assessment Reminders", desc: "Receive alerts for upcoming deadlines and study checkpoints." },
                { key: "assignmentGrading", label: "Assignment Grading Results", desc: "Instant notification when an instructor grades your submissions." },
                { key: "weeklyReport", label: "Weekly Learning Summary", desc: "A personalized weekly report on your study hours and streak." },
              ].map((item) => (
                <div key={item.key} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setNotifications((n) => ({ ...n, [item.key]: checked }));
                      toast.success(`${item.label} updated`);
                    }}
                    className="w-5 h-5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-50/50 rounded-3xl border border-rose-200/80 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-700">
              <Trash2 className="w-5 h-5" />
              <h2 className="text-base font-bold">Danger Zone</h2>
            </div>
            <p className="text-xs sm:text-sm text-rose-600/90 leading-relaxed">
              Deactivating your account will pause your certificates and course progress. This action can be reversed within 30 days.
            </p>
            <button
              onClick={() => toast.error("Account deactivation requires administrator confirmation.")}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
            >
              Deactivate Student Account
            </button>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setPreviewCert(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
            >
              ✕
            </button>

            <div className="border-8 border-double border-slate-200 p-8 text-center space-y-4 bg-radial from-white to-slate-50/50 rounded-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Certificate of Completion</p>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mt-2">
                  {profile.fullName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">has successfully completed all requirements for</p>
                <h4 className="text-lg font-bold text-blue-600 mt-2">{previewCert.courseTitle}</h4>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-200/80">
                <div>
                  <p className="font-semibold text-slate-700">{previewCert.instructor}</p>
                  <p className="text-[10px]">Lead Instructor</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700">EduLearn Academy</p>
                  <p className="text-[10px]">Credential #{previewCert.id}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setPreviewCert(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.success("Certificate downloaded!");
                  setPreviewCert(null);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
