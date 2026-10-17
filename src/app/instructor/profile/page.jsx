"use client";

import * as React from "react";
import Link from "next/link";
import {
  UserCircle,
  Camera,
  Star,
  Users,
  BookOpen,
  Award,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Save,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Video,
} from "lucide-react";
import { cn } from "@/utils";
import Avatar from "@/components/ui/Avatar.jsx";
import { toast } from "sonner";

export default function InstructorProfilePage() {
  const [name, setName] = React.useState("Dr. Marcus Chen");
  const [headline, setHeadline] = React.useState("Lead Data Scientist & Senior Full Stack Instructor");
  const [bio, setBio] = React.useState(
    "Former Senior Staff Engineer with over 12 years of hands-on experience in machine learning systems, data analytics pipelines, and modern web architectures. Dedicated to empowering the next generation of engineers through rigorous, project-oriented courses."
  );
  const [website, setWebsite] = React.useState("https://marcuschen.dev");
  const [github, setGithub] = React.useState("https://github.com/marcuschen");
  const [linkedin, setLinkedin] = React.useState("https://linkedin.com/in/marcuschen-phd");
  const [introVideo, setIntroVideo] = React.useState("https://youtube.com/watch?v=intro-teaser");

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success("Instructor public profile updated successfully!");
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <UserCircle className="w-3.5 h-3.5" />
            <span>Public Teacher Persona</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Instructor Bio & Credentials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            This information is featured publicly on your course landing pages and graduation certificates.
          </p>
        </div>

        <Link
          href="/courses"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
        >
          <span>Preview Public Page</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative shrink-0">
            <Avatar
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
              name={name}
              size="2xl"
              className="ring-4 ring-blue-50"
            />
            <button
              onClick={() => toast.info("Select new high-resolution portrait...")}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
              title="Change avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                Top Rated Instructor
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">{headline}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1 font-semibold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                4.9 Rating (1.8k reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-blue-600">
                <Users className="w-4 h-4" /> 2,548 Students
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-purple-600">
                <BookOpen className="w-4 h-4" /> 3 Courses
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Bio Form */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6"
      >
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Personal & Teaching Details</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Display Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Professional Headline *
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Instructor Biography & Teaching Experience *
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Introductory Video URL (Optional)
            </label>
            <div className="relative">
              <Video className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={introVideo}
                onChange={(e) => setIntroVideo(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Social & Professional Links</h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Personal Website / Portfolio
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                GitHub Profile
              </label>
              <div className="relative">
                <Github className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                LinkedIn Profile
              </label>
              <div className="relative">
                <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-blue-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Public Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
