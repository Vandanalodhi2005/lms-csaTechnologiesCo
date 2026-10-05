"use client";

import * as React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import ProgressBar from "@/components/ui/ProgressBar.jsx";
import StudentMobileNav from "@/components/dashboard/StudentMobileNav.jsx";
import StudentSidebar from "@/components/dashboard/StudentSidebar.jsx";
import { studentProfile } from "@/constants/studentProfile.js";
import { cn } from "@/utils";
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  MapPin,
  Pencil,
  Plus,
  Save,
  UserRound,
  X,
} from "lucide-react";

const cloneProfile = (profile) => JSON.parse(JSON.stringify(profile));

function formatDate(dateValue, options = {}) {
  if (!dateValue) return "Not provided";
  const date = new Date(`${dateValue}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC", ...options }).format(date);
}

function ProfileField({ id, label, value, onChange, error, type = "text", optional = false, maxLength }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-900">{label}{optional ? <span className="ml-1 font-normal text-slate-500">(optional)</span> : null}</label>
      <input id={id} type={type} value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={cn("mt-2 min-h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2", error ? "border-red-300 focus:border-red-500 focus:ring-red-500/15" : "border-slate-200 focus:border-primary-500 focus:ring-primary-500/15")} />
      {error ? <p id={`${id}-error`} className="mt-1 text-xs font-medium text-red-700">{error}</p> : null}
    </div>
  );
}

function ReadonlyField({ label, value }) {
  return <div className="min-w-0"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-900">{value || "Not provided"}</dd></div>;
}

function ConfirmDiscardDialog({ onKeepEditing, onDiscard }) {
  const dialogRef = React.useRef(null);
  const keepRef = React.useRef(null);

  React.useEffect(() => {
    const priorFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    keepRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onKeepEditing();
        return;
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll("button:not([disabled])"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); priorFocus?.focus?.(); };
  }, [onKeepEditing]);

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="discard-profile-title" className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"><h2 id="discard-profile-title" className="text-xl font-bold text-slate-900">Discard your unsaved changes?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Your profile edits will be restored to the last saved local state.</p><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button ref={keepRef} type="button" variant="outline" onClick={onKeepEditing}>Keep Editing</Button><Button type="button" variant="destructive" onClick={onDiscard}>Discard Changes</Button></div></section></div>;
}

export default function StudentProfileClient() {
  const [savedProfile, setSavedProfile] = React.useState(() => cloneProfile(studentProfile));
  const [draft, setDraft] = React.useState(() => cloneProfile(studentProfile));
  const [savedAvatarPreview, setSavedAvatarPreview] = React.useState(null);
  const [avatarPreview, setAvatarPreview] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [discardDialogOpen, setDiscardDialogOpen] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [skillInput, setSkillInput] = React.useState("");
  const [toastMessage, setToastMessage] = React.useState("");
  const [profileError, setProfileError] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const avatarUrlsRef = React.useRef(new Set());

  const avatarChanged = avatarPreview !== savedAvatarPreview;
  const hasUnsavedChanges = JSON.stringify(draft) !== JSON.stringify(savedProfile) || avatarChanged;
  const profileName = `${draft.firstName} ${draft.lastName}`.trim();

  React.useEffect(() => {
    if (!toastMessage) return undefined;
    const timeout = window.setTimeout(() => setToastMessage(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  React.useEffect(() => () => {
    avatarUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    avatarUrlsRef.current.clear();
  }, []);

  const revokeAvatarUrl = (url) => {
    if (url?.startsWith("blob:") && avatarUrlsRef.current.has(url)) {
      URL.revokeObjectURL(url);
      avatarUrlsRef.current.delete(url);
    }
  };

  const updateField = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const updateLearning = (field, value) => setDraft((current) => ({ ...current, learning: { ...current.learning, [field]: value } }));

  const validateProfile = () => {
    const nextErrors = {};
    const firstName = draft.firstName.trim();
    const lastName = draft.lastName.trim();
    const email = draft.email.trim();
    if (firstName.length < 2 || firstName.length > 50) nextErrors.firstName = "First name must be 2-50 characters.";
    if (lastName.length < 2 || lastName.length > 50) nextErrors.lastName = "Last name must be 2-50 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    if (draft.phone && !/^\+?[\d\s().-]{7,20}$/.test(draft.phone)) nextErrors.phone = "Enter a valid phone number or leave this field blank.";
    if (draft.location.length > 100) nextErrors.location = "Location must be 100 characters or fewer.";
    if (draft.bio.length > 500) nextErrors.bio = "About Me must be 500 characters or fewer.";
    if (draft.dateOfBirth && Number.isNaN(new Date(`${draft.dateOfBirth}T00:00:00Z`).getTime())) nextErrors.dateOfBirth = "Enter a valid date.";
    if (draft.skills.length > 15 || draft.skills.some((skill) => !skill.trim() || skill.trim().length > 30)) nextErrors.skills = "Skills must be 1-30 characters, with no more than 15 entries.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const startEditing = () => { setErrors({}); setIsEditing(true); };

  const requestCancel = () => {
    if (hasUnsavedChanges) {
      setDiscardDialogOpen(true);
      return;
    }
    if (avatarPreview !== savedAvatarPreview) revokeAvatarUrl(avatarPreview);
    setDraft(cloneProfile(savedProfile));
    setAvatarPreview(savedAvatarPreview);
    setErrors({});
    setIsEditing(false);
  };

  const discardChanges = () => {
    if (avatarPreview !== savedAvatarPreview) revokeAvatarUrl(avatarPreview);
    setDraft(cloneProfile(savedProfile));
    setAvatarPreview(savedAvatarPreview);
    setErrors({});
    setIsEditing(false);
    setDiscardDialogOpen(false);
  };

  const saveProfile = () => {
    if (!validateProfile()) return;
    if (savedAvatarPreview !== avatarPreview) revokeAvatarUrl(savedAvatarPreview);
    const snapshot = cloneProfile({ ...draft, firstName: draft.firstName.trim(), lastName: draft.lastName.trim(), email: draft.email.trim(), phone: draft.phone.trim(), location: draft.location.trim(), bio: draft.bio.trim() });
    setSavedProfile(snapshot);
    setDraft(snapshot);
    setSavedAvatarPreview(avatarPreview);
    setIsEditing(false);
    setToastMessage("Profile updated successfully for this session.");
  };

  const chooseAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({ ...current, avatar: "Please upload a JPG, PNG, or WEBP image under 5MB." }));
      event.target.value = "";
      return;
    }
    if (avatarPreview !== savedAvatarPreview) revokeAvatarUrl(avatarPreview);
    const localPreview = URL.createObjectURL(file);
    avatarUrlsRef.current.add(localPreview);
    setAvatarPreview(localPreview);
    setErrors((current) => ({ ...current, avatar: "" }));
  };

  const removeAvatar = () => {
    if (avatarPreview !== savedAvatarPreview) revokeAvatarUrl(avatarPreview);
    setAvatarPreview(null);
  };

  const addSkill = () => {
    const candidate = skillInput.trim();
    if (!candidate) return;
    if (candidate.length > 30) { setErrors((current) => ({ ...current, skills: "Skill names must be 30 characters or fewer." })); return; }
    if (draft.skills.some((skill) => skill.toLowerCase() === candidate.toLowerCase())) { setErrors((current) => ({ ...current, skills: "That skill is already listed." })); return; }
    if (draft.skills.length >= 15) { setErrors((current) => ({ ...current, skills: "You can add up to 15 skills." })); return; }
    updateField("skills", [...draft.skills, candidate]);
    setSkillInput("");
    setErrors((current) => ({ ...current, skills: "" }));
  };

  const completedProfileFields = [Boolean(draft.firstName), Boolean(draft.lastName), Boolean(draft.email), Boolean(avatarPreview), Boolean(draft.location), Boolean(draft.bio), draft.skills.length > 0].filter(Boolean).length;
  const profileCompletion = Math.round((completedProfileFields / 7) * 100);

  if (profileError) {
    return <div className="min-h-screen bg-[#F8FAFC]"><Header /><div className="container-page py-12"><EmptyState icon="error" title="Profile information is currently unavailable." action={<Button type="button" onClick={() => setProfileError(false)}>Retry</Button>} /></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <div className="container-page py-6 md:py-8 xl:py-10">
        <div className="flex min-w-0 gap-6">
          <aside className="hidden w-72 shrink-0 lg:block"><StudentSidebar currentPath="/dashboard/profile" /></aside>
          <main className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between gap-3 lg:hidden"><StudentMobileNav currentPath="/dashboard/profile" /><Avatar src={avatarPreview} alt={profileName} name={profileName} size="sm" /></div>
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500"><Link href="/dashboard" className="hover:text-primary-600">Dashboard</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page" className="font-medium text-slate-900">Profile</span></nav>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Learner account</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">My Profile</h1><p className="mt-2 text-sm leading-6 text-slate-600">Manage your personal information and learning profile.</p></div>{!isEditing ? <Button type="button" onClick={startEditing} leftIcon={<Pencil className="h-4 w-4" />}>Edit Profile</Button> : null}</div>

            {toastMessage ? <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span>{toastMessage}</span><button type="button" onClick={() => setToastMessage("")} aria-label="Dismiss success message" className="rounded p-1 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"><X className="h-4 w-4" aria-hidden="true" /></button></div> : null}

            <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="profile-header-heading">
              <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4"><Avatar src={avatarPreview} name={profileName} alt={profileName} size="4xl" className="ring-4 ring-blue-50" /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 id="profile-header-heading" className="text-2xl font-bold text-slate-900">{profileName}</h2><Badge variant="info">Student / Learner</Badge></div><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{draft.bio || "Add a short introduction to your learning profile."}</p><p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500"><span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden="true" />{draft.location || "Location not provided"}</span><span>Member since {formatDate(savedProfile.memberSince, { month: "long", year: "numeric" })}</span></p></div></div>
                <div className="flex flex-wrap gap-2"><Link href="/dashboard/certificates" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500"><Award className="h-4 w-4" aria-hidden="true" />View Certificates</Link>{!isEditing ? <Button type="button" onClick={startEditing} leftIcon={<Pencil className="h-4 w-4" />}>Edit Profile</Button> : null}</div>
              </div>
            </section>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6 sm:gap-4">{[{ label: "Courses Enrolled", value: savedProfile.statistics.enrolledCourses, icon: BookOpen }, { label: "Courses Completed", value: savedProfile.statistics.completedCourses, icon: CheckCircle2 }, { label: "Lessons Completed", value: savedProfile.statistics.completedLessons, icon: GraduationCap }, { label: "Learning Hours", value: `${savedProfile.statistics.learningHours}h`, icon: Clock3 }, { label: "Certificates", value: savedProfile.statistics.certificates, icon: Award, href: "/dashboard/certificates" }, { label: "Average Quiz Score", value: `${savedProfile.statistics.averageQuizScore}%`, icon: Check }].map((stat) => { const Icon = stat.icon; const content = <article className="h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs leading-4 text-slate-500">{stat.label}</p><p className="mt-2 text-xl font-bold tabular-nums text-slate-900">{stat.value}</p></div><Icon className="h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" /></div></article>; return stat.href ? <Link key={stat.label} href={stat.href} className="rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">{content}</Link> : <div key={stat.label}>{content}</div>; })}</div>

            <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <div className="min-w-0 space-y-6">
                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="personal-info-heading">
                  <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Profile details</p><h2 id="personal-info-heading" className="mt-1 text-xl font-bold text-slate-900">Personal Information</h2></div><UserRound className="h-5 w-5 text-slate-400" aria-hidden="true" /></div>

                  {isEditing ? <>
                    <div className="mt-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center"><Avatar src={avatarPreview} name={profileName} alt={profileName} size="2xl" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">Profile Photo</p><p className="mt-1 text-xs text-slate-500">Local preview only · JPG, JPEG, PNG, or WEBP · up to 5MB</p><div className="mt-3 flex flex-wrap gap-2"><Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>Change Photo</Button>{avatarPreview ? <Button type="button" size="sm" variant="ghost" onClick={removeAvatar}>Remove Photo</Button> : null}<input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseAvatar} className="sr-only" aria-label="Choose profile photo" /></div>{errors.avatar ? <p role="alert" className="mt-2 text-xs font-medium text-red-700">{errors.avatar}</p> : null}</div></div>
                    <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                      <ProfileField id="profile-first-name" label="First Name" value={draft.firstName} onChange={(value) => updateField("firstName", value)} error={errors.firstName} maxLength={50} />
                      <ProfileField id="profile-last-name" label="Last Name" value={draft.lastName} onChange={(value) => updateField("lastName", value)} error={errors.lastName} maxLength={50} />
                      <ProfileField id="profile-email" label="Email" type="email" value={draft.email} onChange={(value) => updateField("email", value)} error={errors.email} />
                      <ProfileField id="profile-phone" label="Phone" value={draft.phone} onChange={(value) => updateField("phone", value)} error={errors.phone} optional />
                      <ProfileField id="profile-location" label="Location" value={draft.location} onChange={(value) => updateField("location", value)} error={errors.location} optional maxLength={100} />
                      <ProfileField id="profile-birth-date" label="Date of Birth" type="date" value={draft.dateOfBirth} onChange={(value) => updateField("dateOfBirth", value)} error={errors.dateOfBirth} optional />
                      <div><label htmlFor="profile-gender" className="block text-sm font-semibold text-slate-900">Gender <span className="font-normal text-slate-500">(optional)</span></label><select id="profile-gender" value={draft.gender} onChange={(event) => updateField("gender", event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15">{["Prefer not to say", "Female", "Male", "Non-binary", "Self-describe"].map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
                    </div>
                    <div className="mt-5"><label htmlFor="profile-bio" className="block text-sm font-semibold text-slate-900">About Me</label><textarea id="profile-bio" value={draft.bio} maxLength={500} onChange={(event) => updateField("bio", event.target.value)} rows={4} aria-describedby="profile-bio-count" className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15" /><p id="profile-bio-count" className="mt-1 text-right text-xs text-slate-500">{draft.bio.length} / 500</p>{errors.bio ? <p role="alert" className="text-xs font-medium text-red-700">{errors.bio}</p> : null}</div>
                    <div className="mt-5"><div className="flex items-end justify-between gap-2"><div><h3 className="text-sm font-semibold text-slate-900">Skills &amp; Interests</h3><p className="mt-1 text-xs text-slate-500">Up to 15 skills, 30 characters each.</p></div><span className="text-xs text-slate-500">{draft.skills.length}/15</span></div><div className="mt-3 flex flex-col gap-2 sm:flex-row"><label htmlFor="profile-add-skill" className="sr-only">Add a skill</label><input id="profile-add-skill" value={skillInput} maxLength={30} onChange={(event) => setSkillInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addSkill(); } }} placeholder="Add a skill" className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15" /><Button type="button" variant="outline" onClick={addSkill} leftIcon={<Plus className="h-4 w-4" />}>Add Skill</Button></div>{errors.skills ? <p role="alert" className="mt-2 text-xs font-medium text-red-700">{errors.skills}</p> : null}<div className="mt-3 flex flex-wrap gap-2">{draft.skills.map((skill) => <span key={skill} className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">{skill}<button type="button" onClick={() => updateField("skills", draft.skills.filter((item) => item !== skill))} aria-label={`Remove ${skill}`} className="rounded-full p-0.5 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-primary-500"><X className="h-3 w-3" aria-hidden="true" /></button></span>)}</div></div>
                  </> : <>
                    <dl className="mt-5 grid min-w-0 grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2"><ReadonlyField label="First Name" value={savedProfile.firstName} /><ReadonlyField label="Last Name" value={savedProfile.lastName} /><ReadonlyField label="Email" value={savedProfile.email} /><ReadonlyField label="Phone" value={savedProfile.phone} /><ReadonlyField label="Location" value={savedProfile.location} /><ReadonlyField label="Date of Birth" value={formatDate(savedProfile.dateOfBirth, { month: "long" })} /><ReadonlyField label="Gender" value={savedProfile.gender} /></dl><div className="mt-6 border-t border-slate-100 pt-5"><h3 className="text-sm font-semibold text-slate-900">About Me</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{savedProfile.bio}</p></div><div className="mt-5"><h3 className="text-sm font-semibold text-slate-900">Skills &amp; Interests</h3><div className="mt-3 flex flex-wrap gap-2">{savedProfile.skills.map((skill) => <Badge key={skill} variant="info">{skill}</Badge>)}</div></div>
                  </>}
                </section>

                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="learning-info-heading"><div className="flex items-center gap-3"><span className="rounded-xl bg-blue-50 p-2.5 text-blue-700"><BriefcaseBusiness className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Study preferences</p><h2 id="learning-info-heading" className="text-xl font-bold text-slate-900">Learning Information</h2></div></div>{isEditing ? <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><label htmlFor="learning-goal" className="block text-sm font-semibold text-slate-900">Learning Goal</label><input id="learning-goal" value={draft.learning.goal} onChange={(event) => updateLearning("goal", event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15" /></div><div><label htmlFor="learning-level" className="block text-sm font-semibold text-slate-900">Current Level</label><select id="learning-level" value={draft.learning.level} onChange={(event) => updateLearning("level", event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15">{["Beginner", "Intermediate", "Advanced"].map((value) => <option key={value}>{value}</option>)}</select></div><div><label htmlFor="learning-style" className="block text-sm font-semibold text-slate-900">Preferred Learning Style</label><select id="learning-style" value={draft.learning.preferredStyle} onChange={(event) => updateLearning("preferredStyle", event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15">{["Video + Practical Projects", "Video", "Reading", "Practice", "Mixed"].map((value) => <option key={value}>{value}</option>)}</select></div><div><label htmlFor="learning-weekly-goal" className="block text-sm font-semibold text-slate-900">Weekly Learning Goal</label><select id="learning-weekly-goal" value={draft.learning.weeklyGoal} onChange={(event) => updateLearning("weeklyGoal", Number(event.target.value))} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15">{[5, 10, 15, 20].map((value) => <option key={value} value={value}>{value} hours</option>)}</select></div><div className="sm:col-span-2"><p className="text-sm font-semibold text-slate-900">Preferred Categories</p><div className="mt-2 flex flex-wrap gap-2">{["Web Development", "JavaScript", "Backend Development", "Design", "Data Science"].map((category) => { const checked = draft.learning.preferredCategories.includes(category); return <label key={category} className={cn("inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-3 text-xs font-medium focus-within:ring-2 focus-within:ring-primary-500", checked ? "border-blue-200 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600")}><input type="checkbox" checked={checked} onChange={(event) => updateLearning("preferredCategories", event.target.checked ? [...draft.learning.preferredCategories, category] : draft.learning.preferredCategories.filter((item) => item !== category))} className="h-3.5 w-3.5 accent-blue-700" />{category}</label>; })}</div></div></div> : <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"><ReadonlyField label="Learning Goal" value={savedProfile.learning.goal} /><ReadonlyField label="Current Level" value={savedProfile.learning.level} /><ReadonlyField label="Preferred Learning Style" value={savedProfile.learning.preferredStyle} /><ReadonlyField label="Weekly Learning Goal" value={`${savedProfile.learning.weeklyGoal} hours`} /><div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preferred Categories</dt><dd className="mt-2 flex flex-wrap gap-2">{savedProfile.learning.preferredCategories.map((category) => <Badge key={category} variant="secondary">{category}</Badge>)}</dd></div></dl>}</section>
              </div>

              <aside className="min-w-0 space-y-6">
                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="profile-completion-heading"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Profile strength</p><h2 id="profile-completion-heading" className="mt-1 text-lg font-bold text-slate-900">Profile Completion</h2></div><span className="text-2xl font-bold text-slate-900">{profileCompletion}%</span></div><div className="mt-4" role="progressbar" aria-label="Profile completion" aria-valuenow={profileCompletion} aria-valuemin={0} aria-valuemax={100}><ProgressBar value={profileCompletion} size="md" /></div><ul className="mt-4 space-y-2 text-sm">{[{ label: "First name", complete: Boolean(draft.firstName) }, { label: "Last name", complete: Boolean(draft.lastName) }, { label: "Email", complete: Boolean(draft.email) }, { label: "Profile photo", complete: Boolean(avatarPreview) }, { label: "Location", complete: Boolean(draft.location) }, { label: "Bio", complete: Boolean(draft.bio) }, { label: "Skills", complete: draft.skills.length > 0 }].map((item) => <li key={item.label} className="flex items-center gap-2"><span className={cn("flex h-5 w-5 items-center justify-center rounded-full", item.complete ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400")}>{item.complete ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <span aria-hidden="true">·</span>}</span><span className={item.complete ? "text-slate-700" : "text-slate-500"}>{item.label}</span>{item.complete ? <span className="sr-only">Complete</span> : <span className="sr-only">Incomplete</span>}</li>)}</ul></section>

                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="account-info-heading"><div className="flex items-center gap-3"><span className="rounded-xl bg-slate-100 p-2.5 text-slate-700"><UserRound className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Account</p><h2 id="account-info-heading" className="text-lg font-bold text-slate-900">Account Information</h2></div></div><dl className="mt-4 space-y-3"><AccountLine label="Account Type" value={savedProfile.role} /><AccountLine label="Member Since" value={formatDate(savedProfile.memberSince, { month: "long", year: "numeric" })} /><AccountLine label="Account Status" value={savedProfile.accountStatus} /><AccountLine label="Email Verification" value={savedProfile.emailVerified ? "Verified" : "Not Verified"} /><AccountLine label="Last Profile Update" value="October 6, 2026" /></dl><p className="mt-4 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-900">Demo profile information. Account services are not connected.</p></section>

                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="activity-heading"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Learning timeline</p><h2 id="activity-heading" className="mt-1 text-lg font-bold text-slate-900">Recent Activity</h2></div><Clock3 className="h-4 w-4 text-slate-400" aria-hidden="true" /></div><ol className="mt-4 space-y-4">{savedProfile.recentActivity.map((activity) => <li key={activity.id} className="flex gap-3"><span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /></span><div className="min-w-0"><p className="text-sm font-medium text-slate-900">{activity.title}</p><p className="mt-1 text-xs text-slate-500">{activity.date}</p></div></li>)}</ol></section>
              </aside>
            </div>

            {isEditing ? <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 bg-[#F8FAFC]/95 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-600">{hasUnsavedChanges ? "Unsaved profile changes" : "Edit your profile using the fields above"}</p><div className="grid grid-cols-2 gap-2"><Button type="button" variant="outline" onClick={requestCancel}>Cancel</Button><Button type="button" onClick={saveProfile} leftIcon={<Save className="h-4 w-4" />}>Save Changes</Button></div></div> : null}
          </main>
        </div>
      </div>
      {discardDialogOpen ? <ConfirmDiscardDialog onKeepEditing={() => setDiscardDialogOpen(false)} onDiscard={discardChanges} /> : null}
    </div>
  );
}

function AccountLine({ label, value }) {
  return <div className="flex items-start justify-between gap-3 text-sm"><dt className="text-slate-500">{label}</dt><dd className="text-right font-medium text-slate-900">{value}</dd></div>;
}