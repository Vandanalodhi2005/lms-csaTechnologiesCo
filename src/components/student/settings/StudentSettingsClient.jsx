"use client";

import * as React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import StudentMobileNav from "@/components/dashboard/StudentMobileNav.jsx";
import StudentSidebar from "@/components/dashboard/StudentSidebar.jsx";
import { student } from "@/constants/studentDashboard.js";
import { studentSettings } from "@/constants/studentSettings.js";
import { cn } from "@/utils";
import {
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Eye,
  Globe2,
  LockKeyhole,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Save,
  ShieldCheck,
  Sun,
  UserRound,
  X,
} from "lucide-react";

const sections = [
  { id: "general", label: "General", icon: UserRound },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "learning", label: "Learning", icon: CircleHelp },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "privacy", label: "Privacy", icon: Eye },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "account", label: "Account", icon: LockKeyhole },
];

const notificationOptions = [
  { key: "courseUpdates", label: "Course Updates", description: "Receive updates related to your enrolled courses." },
  { key: "enrollmentUpdates", label: "Enrollment Updates", description: "Get notices about course enrollment activity." },
  { key: "assignmentReminders", label: "Assignment Reminders", description: "Receive reminders about upcoming assignment deadlines." },
  { key: "quizReminders", label: "Quiz Reminders", description: "Get reminders about upcoming course quizzes." },
  { key: "certificateNotifications", label: "Certificate Notifications", description: "Be notified when a course completion record is available." },
  { key: "instructorAnnouncements", label: "Instructor Announcements", description: "Receive announcements from course instructors." },
  { key: "platformAnnouncements", label: "Platform Announcements", description: "Get important EduLearn platform updates." },
  { key: "marketingEmails", label: "Marketing Emails", description: "Receive promotional and marketing messages (demo setting only)." },
];

const privacyOptions = [
  { key: "showLearningActivity", label: "Show Learning Activity", description: "Allow learning activity to appear on your demo profile." },
  { key: "showCourseCompletion", label: "Show Course Completion", description: "Display completed course milestones in your demo profile." },
  { key: "showCertificates", label: "Show Certificates on Profile", description: "Display earned certificate records on your demo profile." },
  { key: "allowInstructorMessages", label: "Allow Instructor Messages", description: "Allow instructors to contact you through the learning platform." },
  { key: "personalizedRecommendations", label: "Personalized Course Recommendations", description: "Use learning preferences to shape demo course recommendations." },
];

const cloneSettings = (value) => JSON.parse(JSON.stringify(value));

function ToggleSetting({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0"><p className="text-sm font-semibold text-slate-900">{label}</p><p className="mt-1 text-sm leading-5 text-slate-600">{description}</p></div>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cn("relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2", checked ? "border-blue-700 bg-blue-700" : "border-slate-300 bg-slate-200")}>
        <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform", checked ? "translate-x-6" : "translate-x-1")} />
      </button>
    </div>
  );
}

function SettingField({ id, label, value, onChange, options, description }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-900">{label}</label>
      {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}

function RadioCards({ name, label, description, value, options, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-900">{label}</legend>
      {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option.value} className={cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-primary-500", value === option.value ? "border-blue-300 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700")}>
            <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="h-4 w-4 accent-blue-700" />
            <span className="font-medium">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SettingsDialog({ modal, onClose, onDeleteFeedback, deleteConfirmed, setDeleteConfirmed, modalFeedback }) {
  const dialogRef = React.useRef(null);
  const closeRef = React.useRef(null);

  React.useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll("button:not([disabled]), input:not([disabled])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  const copy = {
    export: { title: "Export My Data", message: "Your data export will be available once the account backend is connected.", close: "Close" },
    deactivate: { title: "Deactivate Account", message: "Account deactivation is currently unavailable in demo mode.", close: "Close" },
    password: { title: "Change Password", message: "Password management will be available when authentication is connected.", close: "Close" },
    twoFactor: { title: "Configure 2FA", message: "Two-factor authentication can be configured when authentication is connected.", close: "Close" },
  };
  const dialogCopy = copy[modal] || { title: "Delete Account", message: "Account deletion is permanently destructive and will be handled by the production account service.", close: "Cancel" };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="settings-dialog-title" className="w-full max-w-lg rounded-t-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Demo account</p><h2 id="settings-dialog-title" className="mt-1 text-xl font-bold text-slate-900">{dialogCopy.title}</h2></div><button ref={closeRef} type="button" onClick={onClose} aria-label="Close dialog" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500"><X className="h-4 w-4" aria-hidden="true" /></button></div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{dialogCopy.message}</p>
        {modal === "delete" ? <div className="mt-4 space-y-3"><label className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900"><input type="checkbox" checked={deleteConfirmed} onChange={(event) => setDeleteConfirmed(event.target.checked)} className="mt-0.5 h-4 w-4 accent-red-700" /><span>I understand that account deletion cannot be undone.</span></label><p role="status" className="text-sm font-medium text-slate-700">{modalFeedback || "Deletion unavailable in demo mode."}</p><Button type="button" variant="destructive" disabled={!deleteConfirmed} onClick={onDeleteFeedback} className="w-full">Deletion unavailable in demo mode</Button></div> : null}
        <div className="mt-6 flex justify-end"><Button type="button" onClick={onClose}>{dialogCopy.close}</Button></div>
      </section>
    </div>
  );
}

function SectionCard({ title, description, children, id }) {
  return <section aria-labelledby={`${id}-heading`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 id={`${id}-heading`} className="text-lg font-bold text-slate-900">{title}</h2>{description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}</div>{children}</section>;
}

export default function StudentSettingsClient() {
  const [draft, setDraft] = React.useState(() => cloneSettings(studentSettings));
  const [savedSettings, setSavedSettings] = React.useState(() => cloneSettings(studentSettings));
  const [activeSection, setActiveSection] = React.useState("general");
  const [pendingSection, setPendingSection] = React.useState(null);
  const [modal, setModal] = React.useState("");
  const [deleteConfirmed, setDeleteConfirmed] = React.useState(false);
  const [modalFeedback, setModalFeedback] = React.useState("");
  const [toastMessage, setToastMessage] = React.useState("");

  const hasUnsavedChanges = JSON.stringify(draft) !== JSON.stringify(savedSettings);

  React.useEffect(() => {
    if (!toastMessage) return undefined;
    const timeout = window.setTimeout(() => setToastMessage(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  React.useEffect(() => {
    if (!hasUnsavedChanges) return undefined;
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsavedChanges]);

  const updateField = (section, key, value) => {
    setDraft((current) => ({ ...current, [section]: { ...current[section], [key]: value } }));
  };

  const requestSectionChange = (nextSection) => {
    if (nextSection === activeSection) return;
    if (hasUnsavedChanges) {
      setPendingSection(nextSection);
      return;
    }
    setActiveSection(nextSection);
  };

  const discardAndChangeSection = () => {
    setDraft(cloneSettings(savedSettings));
    setActiveSection(pendingSection);
    setPendingSection(null);
  };

  const saveSettings = () => {
    const snapshot = cloneSettings(draft);
    setSavedSettings(snapshot);
    setDraft(snapshot);
    setToastMessage("Settings saved for this session.");
  };

  const resetSettings = () => {
    setDraft(cloneSettings(savedSettings));
    setToastMessage("Changes reset to the last saved session state.");
  };

  const openModal = (name) => {
    setDeleteConfirmed(false);
    setModalFeedback("");
    setModal(name);
  };

  const closeModal = () => {
    setModal("");
    setDeleteConfirmed(false);
    setModalFeedback("");
  };

  const navButtonClass = (section) => cn("flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500", activeSection === section.id ? "bg-blue-50 text-blue-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900");
  const inputClass = "mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <div className="container-page py-6 md:py-8 xl:py-10">
        <div className="flex min-w-0 gap-6">
          <aside className="hidden w-72 shrink-0 lg:block"><StudentSidebar currentPath="/dashboard/settings" /></aside>
          <main className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between gap-3 lg:hidden"><StudentMobileNav currentPath="/dashboard/settings" /><Avatar src={student.avatar} alt={student.name} name={student.name} size="sm" /></div>
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500"><Link href="/dashboard" className="hover:text-primary-600">Dashboard</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page" className="font-medium text-slate-900">Settings</span></nav>
            <div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Your account</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Settings</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Manage your account preferences, notifications, learning preferences, and privacy settings.</p></div>

            {toastMessage ? <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span>{toastMessage}</span><button type="button" onClick={() => setToastMessage("")} aria-label="Dismiss message" className="rounded p-1 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"><X className="h-4 w-4" aria-hidden="true" /></button></div> : null}

            <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">These preferences are demo-only and saved for this browser session only. No account service is connected.</div>

            <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
              <aside className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-6 lg:self-start" aria-label="Settings sections">
                <nav className="hidden space-y-1 lg:block">{sections.map((section) => { const Icon = section.icon; return <button key={section.id} type="button" aria-current={activeSection === section.id ? "page" : undefined} onClick={() => requestSectionChange(section.id)} className={navButtonClass(section)}><Icon className="h-4 w-4" aria-hidden="true" />{section.label}</button>; })}</nav>
                <div className="lg:hidden"><label htmlFor="settings-section" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Settings section</label><select id="settings-section" value={activeSection} onChange={(event) => requestSectionChange(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15">{sections.map((section) => <option key={section.id} value={section.id}>{section.label}</option>)}</select></div>
              </aside>

              <div className="min-w-0 space-y-5">
                {activeSection === "general" ? <SectionCard id="general" title="General Settings" description="Choose language, regional formats, and currency for your demo account."><div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                  <SettingField id="setting-language" label="Language" value={draft.general.language} onChange={(value) => updateField("general", "language", value)} options={[{ value: "en", label: "English" }, { value: "hi", label: "Hindi" }, { value: "es", label: "Spanish" }]} />
                  <SettingField id="setting-timezone" label="Timezone" value={draft.general.timezone} onChange={(value) => updateField("general", "timezone", value)} options={[{ value: "Asia/Kolkata", label: "Asia/Kolkata" }, { value: "America/Los_Angeles", label: "America/Los Angeles" }, { value: "Europe/London", label: "Europe/London" }, { value: "UTC", label: "UTC" }]} />
                  <SettingField id="setting-date-format" label="Date Format" value={draft.general.dateFormat} onChange={(value) => updateField("general", "dateFormat", value)} options={[{ value: "DD/MM/YYYY", label: "DD/MM/YYYY" }, { value: "MM/DD/YYYY", label: "MM/DD/YYYY" }, { value: "YYYY-MM-DD", label: "YYYY-MM-DD" }]} />
                  <SettingField id="setting-time-format" label="Time Format" value={draft.general.timeFormat} onChange={(value) => updateField("general", "timeFormat", value)} options={[{ value: "12-hour", label: "12-hour" }, { value: "24-hour", label: "24-hour" }]} />
                  <SettingField id="setting-currency" label="Currency" value={draft.general.currency} onChange={(value) => updateField("general", "currency", value)} options={[{ value: "INR", label: "INR (₹)" }, { value: "USD", label: "USD ($)" }, { value: "EUR", label: "EUR (€)" }]} />
                </div></SectionCard> : null}

                {activeSection === "notifications" ? <>
                  <SectionCard id="notifications" title="Notification Preferences" description="Choose which demo notifications you would like to receive. These controls do not send email or push messages."><div className="divide-y divide-slate-100">{notificationOptions.map((option) => <ToggleSetting key={option.key} label={option.label} description={option.description} checked={draft.notifications[option.key]} onChange={(value) => updateField("notifications", option.key, value)} />)}</div></SectionCard>
                  <SectionCard id="frequency" title="Notification Frequency" description="Select how often demo notifications would be grouped."><fieldset><legend className="sr-only">Notification Frequency</legend><div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{[{ value: "immediately", label: "Immediately" }, { value: "daily", label: "Daily Summary" }, { value: "weekly", label: "Weekly Summary" }, { value: "never", label: "Never" }].map((option) => <label key={option.value} className={cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-primary-500", draft.notifications.frequency === option.value ? "border-blue-300 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700")}><input type="radio" name="notification-frequency" value={option.value} checked={draft.notifications.frequency === option.value} onChange={() => updateField("notifications", "frequency", option.value)} className="h-4 w-4 accent-blue-700" />{option.label}</label>)}</div></fieldset></SectionCard>
                </> : null}

                {activeSection === "learning" ? <SectionCard id="learning" title="Learning Preferences" description="Set demo preferences for course recommendations and study goals."><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><SettingField id="learning-style" label="Preferred Learning Style" value={draft.learning.preferredStyle} onChange={(value) => updateField("learning", "preferredStyle", value)} options={[{ value: "video", label: "Video" }, { value: "reading", label: "Reading" }, { value: "practice", label: "Practice" }, { value: "mixed", label: "Mixed" }]} /><SettingField id="learning-goal" label="Weekly Learning Goal" value={String(draft.learning.weeklyGoal)} onChange={(value) => updateField("learning", "weeklyGoal", Number(value))} options={[5, 10, 15, 20].map((value) => ({ value: String(value), label: `${value} hours` }))} /><SettingField id="learning-difficulty" label="Preferred Difficulty" value={draft.learning.difficulty} onChange={(value) => updateField("learning", "difficulty", value)} options={[{ value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "advanced", label: "Advanced" }]} /></div><div className="mt-4 divide-y divide-slate-100 border-t border-slate-100 pt-1"><ToggleSetting label="Autoplay Lessons" description="Automatically continue to the next lesson in the demo player." checked={draft.learning.autoplayLessons} onChange={(value) => updateField("learning", "autoplayLessons", value)} /><ToggleSetting label="Show Course Recommendations" description="Show demo course suggestions based on your selected preferences." checked={draft.learning.courseRecommendations} onChange={(value) => updateField("learning", "courseRecommendations", value)} /></div></SectionCard> : null}

                {activeSection === "appearance" ? <SectionCard id="appearance" title="Appearance" description="Choose a display preference for this settings demo. This does not change the global EduLearn theme."><fieldset><legend className="text-sm font-semibold text-slate-900">Theme</legend><p className="mt-1 text-xs text-slate-500">Theme selection is stored as local UI state only.</p><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">{[{ value: "light", label: "Light", icon: Sun }, { value: "dark", label: "Dark", icon: Moon }, { value: "system", label: "System", icon: Monitor }].map((option) => { const Icon = option.icon; return <button key={option.value} type="button" aria-pressed={draft.appearance.theme === option.value} onClick={() => updateField("appearance", "theme", option.value)} className={cn("flex min-h-16 items-center gap-3 rounded-xl border px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500", draft.appearance.theme === option.value ? "border-blue-300 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}><Icon className="h-5 w-5" aria-hidden="true" />{option.label}</button>; })}</div></fieldset><div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-900"><span className="font-semibold">Accent color</span><span className="ml-2">EduLearn blue</span><span className="ml-3 inline-block h-4 w-4 translate-y-1 rounded-full bg-blue-600" aria-label="EduLearn blue" /></div></SectionCard> : null}

                {activeSection === "privacy" ? <SectionCard id="privacy" title="Privacy" description="Control how demo profile and learning information is displayed."><div className="mb-5"><SettingField id="profile-visibility" label="Profile Visibility" description="Choose who can see your demo learner profile." value={draft.privacy.profileVisibility} onChange={(value) => updateField("privacy", "profileVisibility", value)} options={[{ value: "public", label: "Public" }, { value: "students", label: "Students Only" }, { value: "private", label: "Private" }]} /></div><div className="divide-y divide-slate-100">{privacyOptions.map((option) => <ToggleSetting key={option.key} label={option.label} description={option.description} checked={draft.privacy[option.key]} onChange={(value) => updateField("privacy", option.key, value)} />)}</div></SectionCard> : null}

                {activeSection === "security" ? <><SectionCard id="security" title="Security" description="Security actions are informational only in this demo."><div className="divide-y divide-slate-100"><SecurityItem title="Password" description="Last changed: Not available in demo" action="Change Password" onClick={() => openModal("password")} /><SecurityItem title="Two-Factor Authentication" description="Status: Not Configured" action="Configure 2FA" onClick={() => openModal("twoFactor")} /><div className="py-4"><p className="text-sm font-semibold text-slate-900">Active Sessions</p><p className="mt-1 text-sm text-slate-600">Authentication service not connected</p><Badge variant="secondary" className="mt-3">No session data available</Badge></div></div></SectionCard><div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Security settings shown here are currently demo settings. Production authentication and security controls must be enforced on the server.</div></> : null}

                {activeSection === "account" ? <SectionCard id="account" title="Account Management" description="Account actions are unavailable in this frontend demo."><dl className="grid grid-cols-1 gap-3 sm:grid-cols-2"><AccountValue label="Account Type" value={draft.account.type} /><AccountValue label="Account Status" value={draft.account.status} /><AccountValue label="Member Since" value={new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${draft.account.memberSince}T00:00:00Z`))} /><AccountValue label="Email Verification" value={draft.account.emailVerified ? "Verified" : "Not Verified"} /></dl><div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3"><Button type="button" variant="outline" onClick={() => openModal("export")}>Export My Data</Button><Button type="button" variant="outline" onClick={() => openModal("deactivate")}>Deactivate Account</Button><Button type="button" variant="destructive" onClick={() => openModal("delete")}>Delete Account</Button></div></SectionCard> : null}
              </div>
            </div>

            <div className="sticky bottom-0 z-20 mt-6 flex flex-col gap-3 border-t border-slate-200 bg-[#F8FAFC]/95 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-600">{hasUnsavedChanges ? <span className="font-medium text-amber-800">You have unsaved changes.</span> : "Changes are saved for this session only."}</p><div className="grid grid-cols-2 gap-2 sm:flex"><Button type="button" variant="outline" onClick={resetSettings} disabled={!hasUnsavedChanges} leftIcon={<RotateCcw className="h-4 w-4" />}>Reset</Button><Button type="button" onClick={saveSettings} disabled={!hasUnsavedChanges} leftIcon={<Save className="h-4 w-4" />}>Save Changes</Button></div></div>
          </main>
        </div>
      </div>

      {pendingSection ? <ConfirmationDialog title="You have unsaved changes." description="Keep editing this section or discard your changes before switching sections." onClose={() => setPendingSection(null)}><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => setPendingSection(null)}>Keep Editing</Button><Button type="button" variant="destructive" onClick={discardAndChangeSection}>Discard Changes</Button></div></ConfirmationDialog> : null}
      {modal ? <SettingsDialog modal={modal} onClose={closeModal} onDeleteFeedback={() => setModalFeedback("Account deletion is unavailable in demo mode.")} deleteConfirmed={deleteConfirmed} setDeleteConfirmed={setDeleteConfirmed} modalFeedback={modalFeedback} /> : null}
    </div>
  );
}

function SecurityItem({ title, description, action, onClick }) {
  return <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-slate-900">{title}</p><p className="mt-1 text-sm text-slate-600">{description}</p></div><Button type="button" variant="outline" onClick={onClick}>{action}</Button></div>;
}

function AccountValue({ label, value }) {
  return <div className="rounded-xl bg-slate-50 p-3"><dt className="text-xs font-medium text-slate-500">{label}</dt><dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd></div>;
}

function ConfirmationDialog({ title, description, children, onClose }) {
  const dialogRef = React.useRef(null);
  const closeRef = React.useRef(null);
  React.useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll("button:not([disabled])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); previousFocus?.focus?.(); };
  }, [onClose]);

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="confirmation-title" className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between gap-3"><div><h2 id="confirmation-title" className="text-xl font-bold text-slate-900">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></div><button ref={closeRef} type="button" onClick={onClose} aria-label="Close dialog" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500"><X className="h-4 w-4" aria-hidden="true" /></button></div>{children}</section></div>;
}