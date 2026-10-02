"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils";
import Button from "@/components/ui/Button.jsx";
import Badge from "@/components/ui/Badge.jsx";
import { initialAdminSettings } from "@/constants/adminSettings.js";
import {
  AlertTriangle,
  Award,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  GraduationCap,
  ImageIcon,
  Info,
  Mail,
  Palette,
  Phone,
  Save,
  Settings2,
  Shield,
  Trash2,
  Undo2,
  Users,
  Wrench,
  X,
} from "lucide-react";

const settingsSections = [
  { key: "general", label: "General", icon: Settings2 },
  { key: "branding", label: "Branding", icon: Palette },
  { key: "users", label: "User & Access", icon: Users },
  { key: "courses", label: "Courses", icon: BookOpen },
  { key: "enrollments", label: "Enrollments", icon: GraduationCap },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "certificates", label: "Certificates", icon: Award },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "maintenance", label: "Maintenance", icon: Wrench },
];

const deepClone = (value) => JSON.parse(JSON.stringify(value));

function ToggleField({ label, description, checked, onChange, disabled = false }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {description ? <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 items-center rounded-full border transition-colors",
          checked ? "border-primary-500 bg-primary-500" : "border-slate-300 bg-slate-200",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

function SettingRow({ title, description, children, required = false }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-slate-900">
            {title}
            {required ? <span className="ml-1 text-red-600">*</span> : null}
          </p>
          {description ? <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, error, type = "text", placeholder, min, max, step, options = {} }) {
  return (
    <div>
      {label ? <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label> : null}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${label}-error` : undefined}
        className={cn(
          "w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10",
          error ? "border-red-300 bg-red-50" : "border-slate-200"
        )}
        {...options}
      />
      {error ? <p id={`${label}-error`} role="alert" className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function SelectField({ label, value, onChange, options, error }) {
  return (
    <div>
      {label ? <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label> : null}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(
          "w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10",
          error ? "border-red-300 bg-red-50" : "border-slate-200"
        )}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p role="alert" className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function TextareaField({ label, value, onChange, error, placeholder, rows = 4 }) {
  return (
    <div>
      {label ? <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label> : null}
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={cn(
          "w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10",
          error ? "border-red-300 bg-red-50" : "border-slate-200"
        )}
      />
      {error ? <p role="alert" className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onClose, variant = "default" }) {
  React.useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", variant === "danger" ? "bg-red-50 text-red-600" : "bg-primary-50 text-primary-600")}>
            {variant === "danger" ? <AlertTriangle className="h-5 w-5" aria-hidden="true" /> : <Info className="h-5 w-5" aria-hidden="true" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" variant={variant === "danger" ? "destructive" : "default"} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSettingsClient() {
  const [savedSettings, setSavedSettings] = React.useState(() => deepClone(initialAdminSettings));
  const [draftSettings, setDraftSettings] = React.useState(() => deepClone(initialAdminSettings));
  const [activeSection, setActiveSection] = React.useState("general");
  const [validationErrors, setValidationErrors] = React.useState({});
  const [showResetConfirmation, setShowResetConfirmation] = React.useState(false);
  const [showClearDemoConfirmation, setShowClearDemoConfirmation] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const [logoPreview, setLogoPreview] = React.useState(draftSettings.branding.logoPreview);
  const [faviconPreview, setFaviconPreview] = React.useState(draftSettings.branding.faviconPreview);

  const hasUnsavedChanges = React.useMemo(() => JSON.stringify(draftSettings) !== JSON.stringify(savedSettings), [draftSettings, savedSettings]);

  React.useEffect(() => {
    setLogoPreview(draftSettings.branding.logoPreview);
    setFaviconPreview(draftSettings.branding.faviconPreview);
  }, [draftSettings.branding.logoPreview, draftSettings.branding.faviconPreview]);

  React.useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = setTimeout(() => setToastMessage(""), 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const updateSetting = (section, key, value) => {
    setDraftSettings((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }));
  };

  const validateSettings = (nextSettings) => {
    const errors = {};

    if (!nextSettings.general.platformName.trim()) {
      errors.general_platformName = "Platform name is required.";
    }
    if (!/^\S+@\S+\.\S+$/.test(nextSettings.general.supportEmail.trim())) {
      errors.general_supportEmail = "Support email must be a valid email format.";
    }
    if (!Number.isFinite(Number(nextSettings.courses.maxTitleLength)) || Number(nextSettings.courses.maxTitleLength) <= 0) {
      errors.courses_maxTitleLength = "Maximum course title length must be a positive integer.";
    }
    if (!Number.isFinite(Number(nextSettings.courses.maxDescriptionLength)) || Number(nextSettings.courses.maxDescriptionLength) <= 0) {
      errors.courses_maxDescriptionLength = "Maximum course description length must be a positive integer.";
    }
    if (!Number.isFinite(Number(nextSettings.enrollments.maxStudents)) || Number(nextSettings.enrollments.maxStudents) <= 0) {
      errors.enrollments_maxStudents = "Maximum students per course must be a positive integer.";
    }
    if (!Number.isFinite(Number(nextSettings.payments.taxPercentage)) || Number(nextSettings.payments.taxPercentage) < 0 || Number(nextSettings.payments.taxPercentage) > 100) {
      errors.payments_taxPercentage = "Tax percentage must be between 0 and 100.";
    }
    if (!Number.isFinite(Number(nextSettings.certificates.completionPercentage)) || Number(nextSettings.certificates.completionPercentage) < 0 || Number(nextSettings.certificates.completionPercentage) > 100) {
      errors.certificates_completionPercentage = "Minimum completion percentage must be between 0 and 100.";
    }
    if (!Number.isFinite(Number(nextSettings.certificates.passingScore)) || Number(nextSettings.certificates.passingScore) < 0 || Number(nextSettings.certificates.passingScore) > 100) {
      errors.certificates_passingScore = "Minimum passing score must be between 0 and 100.";
    }
    if (!nextSettings.security.sessionTimeout) {
      errors.security_sessionTimeout = "Session timeout is required.";
    }
    if (!Number.isFinite(Number(nextSettings.security.maxLoginAttempts)) || Number(nextSettings.security.maxLoginAttempts) <= 0) {
      errors.security_maxLoginAttempts = "Maximum login attempts must be a positive integer.";
    }
    if (nextSettings.maintenance.startDate && nextSettings.maintenance.endDate && new Date(nextSettings.maintenance.endDate) < new Date(nextSettings.maintenance.startDate)) {
      errors.maintenance_endDate = "Maintenance end date must not be before the start date.";
    }

    return errors;
  };

  const handleSave = () => {
    const nextErrors = validateSettings(draftSettings);
    setValidationErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setToastMessage("Please fix the highlighted settings before saving.");
      return;
    }

    setSavedSettings(deepClone(draftSettings));
    setToastMessage("Settings saved successfully.");
  };

  const handleCancel = () => {
    setDraftSettings(deepClone(savedSettings));
    setValidationErrors({});
    setToastMessage("Changes discarded.");
  };

  const handleResetDefaults = () => {
    const defaults = deepClone(initialAdminSettings);
    setSavedSettings(defaults);
    setDraftSettings(defaults);
    setValidationErrors({});
    setShowResetConfirmation(false);
    setToastMessage("Settings restored to defaults.");
  };

  const handleClearDemoData = () => {
    const defaults = deepClone(initialAdminSettings);
    setSavedSettings(defaults);
    setDraftSettings(defaults);
    setLogoPreview(null);
    setFaviconPreview(null);
    setValidationErrors({});
    setShowClearDemoConfirmation(false);
    setToastMessage("Demo settings cleared.");
  };

  const handleBrandFileUpload = (field, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setToastMessage("Only PNG, JPG, JPEG, and WEBP files are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setToastMessage("File size must be under 2MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    if (field === "logo") {
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
      setLogoPreview(objectUrl);
      updateSetting("branding", "logoPreview", objectUrl);
    }

    if (field === "favicon") {
      if (faviconPreview?.startsWith("blob:")) URL.revokeObjectURL(faviconPreview);
      setFaviconPreview(objectUrl);
      updateSetting("branding", "faviconPreview", objectUrl);
    }
    event.target.value = "";
  };

  const removeBrandImage = (field) => {
    if (field === "logo") {
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
      updateSetting("branding", "logoPreview", null);
    }
    if (field === "favicon") {
      if (faviconPreview?.startsWith("blob:")) URL.revokeObjectURL(faviconPreview);
      setFaviconPreview(null);
      updateSetting("branding", "faviconPreview", null);
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-5">
            <SettingRow title="Platform name" description="This is the name shown to users across the EduLearn experience.">
              <InputField
                value={draftSettings.general.platformName}
                onChange={(value) => updateSetting("general", "platformName", value)}
                error={validationErrors.general_platformName}
                placeholder="EduLearn"
              />
            </SettingRow>

            <SettingRow title="Platform description" description="Used in visitor-facing and admin-facing contexts where a short description is shown.">
              <TextareaField
                value={draftSettings.general.platformDescription}
                onChange={(value) => updateSetting("general", "platformDescription", value)}
                placeholder="Professional online learning platform for students and instructors."
                rows={3}
              />
            </SettingRow>

            <SettingRow title="Support details" description="Contact details shown to learners and administrators.">
              <div className="grid gap-3 sm:grid-cols-2">
                <InputField
                  label="Support Email"
                  value={draftSettings.general.supportEmail}
                  onChange={(value) => updateSetting("general", "supportEmail", value)}
                  error={validationErrors.general_supportEmail}
                  placeholder="support@edulearn.example"
                />
                <InputField
                  label="Support Phone"
                  value={draftSettings.general.supportPhone}
                  onChange={(value) => updateSetting("general", "supportPhone", value)}
                  placeholder="+91 00000 00000"
                />
              </div>
            </SettingRow>

            <SettingRow title="Default locale" description="Configured defaults for learner and admin experience.">
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField
                  label="Default Language"
                  value={draftSettings.general.language}
                  onChange={(value) => updateSetting("general", "language", value)}
                  options={[{ value: "English", label: "English" }, { value: "Hindi", label: "Hindi" }]}
                />
                <SelectField
                  label="Default Currency"
                  value={draftSettings.general.currency}
                  onChange={(value) => updateSetting("general", "currency", value)}
                  options={[{ value: "INR", label: "INR" }, { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "GBP", label: "GBP" }]}
                />
                <SelectField
                  label="Timezone"
                  value={draftSettings.general.timezone}
                  onChange={(value) => updateSetting("general", "timezone", value)}
                  options={[{ value: "Asia/Kolkata", label: "Asia/Kolkata" }, { value: "UTC", label: "UTC" }, { value: "America/New_York", label: "America/New_York" }, { value: "Europe/London", label: "Europe/London" }]}
                />
                <SelectField
                  label="Date Format"
                  value={draftSettings.general.dateFormat}
                  onChange={(value) => updateSetting("general", "dateFormat", value)}
                  options={[{ value: "DD/MM/YYYY", label: "DD/MM/YYYY" }, { value: "MM/DD/YYYY", label: "MM/DD/YYYY" }, { value: "YYYY-MM-DD", label: "YYYY-MM-DD" }]}
                />
                <SelectField
                  label="Time Format"
                  value={draftSettings.general.timeFormat}
                  onChange={(value) => updateSetting("general", "timeFormat", value)}
                  options={[{ value: "12 Hour", label: "12 Hour" }, { value: "24 Hour", label: "24 Hour" }]}
                />
              </div>
            </SettingRow>

            <SettingRow title="Maintenance mode" description="This toggles local UI state only and does not put the app into a real maintenance state.">
              <ToggleField
                label="Enable Maintenance Mode"
                description="Show maintenance mode for demo-only presentation"
                checked={draftSettings.general.maintenanceMode}
                onChange={(value) => updateSetting("general", "maintenanceMode", value)}
              />
            </SettingRow>
          </div>
        );

      case "branding":
        return (
          <div className="space-y-5">
            <SettingRow title="Platform logo" description="Upload a local mock logo preview. No external storage is used.">
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Platform logo preview"
                      width={200}
                      height={80}
                      unoptimized
                      className="max-h-24 max-w-full object-contain"
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                        <ImageIcon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">Default EduLearn branding</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                    Choose file
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => handleBrandFileUpload("logo", event)} />
                  </label>
                  <Button type="button" variant="outline" onClick={() => removeBrandImage("logo")}>Remove</Button>
                </div>
                <p className="text-xs text-slate-500">Allowed formats: PNG, JPG, JPEG, WEBP. Max size: 2MB.</p>
              </div>
            </SettingRow>

            <SettingRow title="Favicon" description="Mock preview of your browser tab icon.">
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-lg font-bold text-primary-600">
                  {faviconPreview ? (
                    <Image
                      src={faviconPreview}
                      alt="Favicon preview"
                      width={48}
                      height={48}
                      unoptimized
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    "E"
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                    Choose file
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => handleBrandFileUpload("favicon", event)} />
                  </label>
                  <Button type="button" variant="outline" onClick={() => removeBrandImage("favicon")}>Remove</Button>
                </div>
                <p className="text-xs text-slate-500">Allowed formats: PNG, JPG, JPEG, WEBP. Max size: 2MB.</p>
              </div>
            </SettingRow>

            <SettingRow title="Brand colors" description="Define the visual accent colors used in the admin and learner interfaces.">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Primary Brand Color</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <input
                      type="color"
                      value={draftSettings.branding.primaryColor}
                      onChange={(event) => updateSetting("branding", "primaryColor", event.target.value)}
                      className="h-10 w-12 cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="text-sm font-medium text-slate-700">{draftSettings.branding.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Secondary Brand Color</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <input
                      type="color"
                      value={draftSettings.branding.secondaryColor}
                      onChange={(event) => updateSetting("branding", "secondaryColor", event.target.value)}
                      className="h-10 w-12 cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="text-sm font-medium text-slate-700">{draftSettings.branding.secondaryColor}</span>
                  </div>
                </div>
              </div>
            </SettingRow>

            <SettingRow title="Footer copyright" description="Footer text shown in the public and learner-facing pages.">
              <InputField
                value={draftSettings.branding.footerCopyright}
                onChange={(value) => updateSetting("branding", "footerCopyright", value)}
                placeholder="© 2026 EduLearn. All rights reserved."
              />
            </SettingRow>
          </div>
        );

      case "users":
        return (
          <div className="space-y-5">
            <div className="rounded-[22px] border border-amber-200 bg-amber-50/80 p-4 text-sm leading-6 text-amber-800">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>These settings are currently in demo mode and are not connected to the authentication system.</span>
              </div>
            </div>

            <SettingRow title="Student registration">
              <ToggleField
                label="Allow Student Registration"
                checked={draftSettings.users.allowStudentRegistration}
                onChange={(value) => updateSetting("users", "allowStudentRegistration", value)}
              />
            </SettingRow>
            <SettingRow title="Instructor registration">
              <ToggleField
                label="Allow Instructor Registration"
                checked={draftSettings.users.allowInstructorRegistration}
                onChange={(value) => updateSetting("users", "allowInstructorRegistration", value)}
              />
            </SettingRow>
            <SettingRow title="User verification">
              <ToggleField
                label="Require Email Verification"
                checked={draftSettings.users.requireEmailVerification}
                onChange={(value) => updateSetting("users", "requireEmailVerification", value)}
              />
            </SettingRow>
            <SettingRow title="Course preview access">
              <ToggleField
                label="Allow Guest Course Preview"
                checked={draftSettings.users.allowGuestPreview}
                onChange={(value) => updateSetting("users", "allowGuestPreview", value)}
              />
            </SettingRow>
            <SettingRow title="Session handling">
              <ToggleField
                label="Allow Multiple Student Sessions"
                checked={draftSettings.users.allowMultipleSessions}
                onChange={(value) => updateSetting("users", "allowMultipleSessions", value)}
              />
            </SettingRow>
            <SettingRow title="Default user role" description="Used as a default when new accounts are created in the mock configuration.">
              <SelectField
                value={draftSettings.users.defaultRole}
                onChange={(value) => updateSetting("users", "defaultRole", value)}
                options={[{ value: "Student", label: "Student" }, { value: "Instructor", label: "Instructor" }]}
              />
            </SettingRow>
            <SettingRow title="Access approvals">
              <ToggleField
                label="Admin Approval Required for Instructor"
                checked={draftSettings.users.instructorApproval}
                onChange={(value) => updateSetting("users", "instructorApproval", value)}
              />
            </SettingRow>
            <SettingRow title="User activity">
              <ToggleField
                label="Show User Activity"
                checked={draftSettings.users.showUserActivity}
                onChange={(value) => updateSetting("users", "showUserActivity", value)}
              />
            </SettingRow>
          </div>
        );

      case "courses":
        return (
          <div className="space-y-5">
            <SettingRow title="Course approval">
              <ToggleField
                label="Require Course Approval"
                checked={draftSettings.courses.requireApproval}
                onChange={(value) => updateSetting("courses", "requireApproval", value)}
              />
            </SettingRow>
            <SettingRow title="Publishing permissions">
              <ToggleField
                label="Allow Instructor Course Publishing"
                checked={draftSettings.courses.allowPublishing}
                onChange={(value) => updateSetting("courses", "allowPublishing", value)}
              />
            </SettingRow>
            <SettingRow title="Course reviews">
              <ToggleField
                label="Enable Course Reviews"
                checked={draftSettings.courses.enableReviews}
                onChange={(value) => updateSetting("courses", "enableReviews", value)}
              />
            </SettingRow>
            <SettingRow title="Wishlist">
              <ToggleField
                label="Enable Course Wishlist"
                checked={draftSettings.courses.enableWishlist}
                onChange={(value) => updateSetting("courses", "enableWishlist", value)}
              />
            </SettingRow>
            <SettingRow title="Access control">
              <ToggleField
                label="Allow Free Courses"
                checked={draftSettings.courses.allowFreeCourses}
                onChange={(value) => updateSetting("courses", "allowFreeCourses", value)}
              />
            </SettingRow>
            <SettingRow title="Preview support">
              <ToggleField
                label="Allow Course Preview"
                checked={draftSettings.courses.allowPreview}
                onChange={(value) => updateSetting("courses", "allowPreview", value)}
              />
            </SettingRow>
            <SettingRow title="Course limits" description="Validation ensures these values remain positive integers.">
              <div className="grid gap-3 sm:grid-cols-2">
                <InputField
                  label="Maximum Course Title Length"
                  type="number"
                  value={draftSettings.courses.maxTitleLength}
                  onChange={(value) => updateSetting("courses", "maxTitleLength", Number(value) || 0)}
                  error={validationErrors.courses_maxTitleLength}
                  min={1}
                />
                <InputField
                  label="Maximum Course Description Length"
                  type="number"
                  value={draftSettings.courses.maxDescriptionLength}
                  onChange={(value) => updateSetting("courses", "maxDescriptionLength", Number(value) || 0)}
                  error={validationErrors.courses_maxDescriptionLength}
                  min={1}
                />
              </div>
            </SettingRow>
            <SettingRow title="Default course settings" description="Default values used when creating new course content.">
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField
                  label="Default Course Level"
                  value={draftSettings.courses.defaultLevel}
                  onChange={(value) => updateSetting("courses", "defaultLevel", value)}
                  options={[{ value: "Beginner", label: "Beginner" }, { value: "Intermediate", label: "Intermediate" }, { value: "Advanced", label: "Advanced" }, { value: "All Levels", label: "All Levels" }]}
                />
                <SelectField
                  label="Default Lesson Type"
                  value={draftSettings.courses.defaultLessonType}
                  onChange={(value) => updateSetting("courses", "defaultLessonType", value)}
                  options={[{ value: "Video", label: "Video" }, { value: "Article", label: "Article" }]}
                />
              </div>
            </SettingRow>
            <SettingRow title="Progress tracking">
              <ToggleField
                label="Enable Course Completion Tracking"
                checked={draftSettings.courses.completionTracking}
                onChange={(value) => updateSetting("courses", "completionTracking", value)}
              />
            </SettingRow>
            <SettingRow title="Instructor quality signals">
              <ToggleField
                label="Enable Instructor Ratings"
                checked={draftSettings.courses.instructorRatings}
                onChange={(value) => updateSetting("courses", "instructorRatings", value)}
              />
            </SettingRow>
          </div>
        );

      case "enrollments":
        return (
          <div className="space-y-5">
            <SettingRow title="Enrollment access">
              <ToggleField
                label="Allow Self Enrollment"
                checked={draftSettings.enrollments.allowSelfEnrollment}
                onChange={(value) => updateSetting("enrollments", "allowSelfEnrollment", value)}
              />
            </SettingRow>
            <SettingRow title="Enrollment management">
              <ToggleField
                label="Allow Instructor Enrollment"
                checked={draftSettings.enrollments.allowInstructorEnrollment}
                onChange={(value) => updateSetting("enrollments", "allowInstructorEnrollment", value)}
              />
            </SettingRow>
            <SettingRow title="Confirmation flow">
              <ToggleField
                label="Enable Enrollment Confirmation"
                checked={draftSettings.enrollments.confirmation}
                onChange={(value) => updateSetting("enrollments", "confirmation", value)}
              />
            </SettingRow>
            <SettingRow title="Completion tracking">
              <ToggleField
                label="Enable Course Completion Tracking"
                checked={draftSettings.enrollments.completionTracking}
                onChange={(value) => updateSetting("enrollments", "completionTracking", value)}
              />
            </SettingRow>
            <SettingRow title="Re-enrollment">
              <ToggleField
                label="Allow Course Re-Enrollment"
                checked={draftSettings.enrollments.allowReEnrollment}
                onChange={(value) => updateSetting("enrollments", "allowReEnrollment", value)}
              />
            </SettingRow>
            <SettingRow title="Cancellation">
              <ToggleField
                label="Allow Enrollment Cancellation"
                checked={draftSettings.enrollments.allowCancellation}
                onChange={(value) => updateSetting("enrollments", "allowCancellation", value)}
              />
            </SettingRow>
            <SettingRow title="Enrollment defaults" description="Default enrollment state and student capacity.">
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField
                  label="Default Enrollment Status"
                  value={draftSettings.enrollments.defaultStatus}
                  onChange={(value) => updateSetting("enrollments", "defaultStatus", value)}
                  options={[{ value: "Active", label: "Active" }, { value: "Pending", label: "Pending" }]}
                />
                <InputField
                  label="Maximum Students Per Course"
                  type="number"
                  value={draftSettings.enrollments.maxStudents}
                  onChange={(value) => updateSetting("enrollments", "maxStudents", Number(value) || 0)}
                  error={validationErrors.enrollments_maxStudents}
                  min={1}
                />
              </div>
            </SettingRow>
            <SettingRow title="Enrollment display">
              <div className="space-y-3">
                <ToggleField
                  label="Show Enrollment Count"
                  checked={draftSettings.enrollments.showEnrollmentCount}
                  onChange={(value) => updateSetting("enrollments", "showEnrollmentCount", value)}
                />
                <ToggleField
                  label="Show Course Progress"
                  checked={draftSettings.enrollments.showProgress}
                  onChange={(value) => updateSetting("enrollments", "showProgress", value)}
                />
              </div>
            </SettingRow>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-5">
            <div className="rounded-[22px] border border-amber-200 bg-amber-50/80 p-4 text-sm leading-6 text-amber-800">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Payment gateway integration is not connected in this demo. These values are configuration placeholders only.</span>
              </div>
            </div>

            <SettingRow title="Payment mode" description="Select the mode used for mock payment configuration.">
              <SelectField
                value={draftSettings.payments.mode}
                onChange={(value) => updateSetting("payments", "mode", value)}
                options={[{ value: "Test", label: "Test" }, { value: "Live", label: "Live" }]}
              />
            </SettingRow>

            <SettingRow title="Payment options">
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField
                  label="Currency"
                  value={draftSettings.payments.currency}
                  onChange={(value) => updateSetting("payments", "currency", value)}
                  options={[{ value: "INR", label: "INR" }, { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "GBP", label: "GBP" }]}
                />
                <SelectField
                  label="Payment Provider"
                  value={draftSettings.payments.provider}
                  onChange={(value) => updateSetting("payments", "provider", value)}
                  options={[{ value: "None", label: "None" }, { value: "Razorpay", label: "Razorpay" }, { value: "Stripe", label: "Stripe" }, { value: "PayPal", label: "PayPal" }]}
                />
              </div>
            </SettingRow>

            <SettingRow title="Payments enabled">
              <div className="space-y-3">
                <ToggleField
                  label="Enable Online Payments"
                  checked={draftSettings.payments.enabled}
                  onChange={(value) => updateSetting("payments", "enabled", value)}
                />
                <ToggleField
                  label="Enable Refunds"
                  checked={draftSettings.payments.refunds}
                  onChange={(value) => updateSetting("payments", "refunds", value)}
                />
                <ToggleField
                  label="Tax Enabled"
                  checked={draftSettings.payments.taxEnabled}
                  onChange={(value) => updateSetting("payments", "taxEnabled", value)}
                />
              </div>
            </SettingRow>

            <SettingRow title="Tax configuration">
              <InputField
                label="Tax Percentage"
                type="number"
                value={draftSettings.payments.taxPercentage}
                onChange={(value) => updateSetting("payments", "taxPercentage", Number(value) || 0)}
                error={validationErrors.payments_taxPercentage}
                min={0}
                max={100}
                step={1}
              />
            </SettingRow>
          </div>
        );

      case "certificates":
        return (
          <div className="space-y-5">
            <SettingRow title="Certificate generation">
              <div className="space-y-3">
                <ToggleField
                  label="Enable Certificates"
                  checked={draftSettings.certificates.enabled}
                  onChange={(value) => updateSetting("certificates", "enabled", value)}
                />
                <ToggleField
                  label="Auto Generate Certificate"
                  checked={draftSettings.certificates.autoGenerate}
                  onChange={(value) => updateSetting("certificates", "autoGenerate", value)}
                />
                <ToggleField
                  label="Enable Certificate Verification"
                  checked={draftSettings.certificates.verification}
                  onChange={(value) => updateSetting("certificates", "verification", value)}
                />
              </div>
            </SettingRow>

            <SettingRow title="Completion thresholds" description="Demo values for certificate issuance and passing requirements.">
              <div className="grid gap-3 sm:grid-cols-2">
                <InputField
                  label="Minimum Completion Percentage"
                  type="number"
                  value={draftSettings.certificates.completionPercentage}
                  onChange={(value) => updateSetting("certificates", "completionPercentage", Number(value) || 0)}
                  error={validationErrors.certificates_completionPercentage}
                  min={0}
                  max={100}
                />
                <InputField
                  label="Minimum Passing Score"
                  type="number"
                  value={draftSettings.certificates.passingScore}
                  onChange={(value) => updateSetting("certificates", "passingScore", Number(value) || 0)}
                  error={validationErrors.certificates_passingScore}
                  min={0}
                  max={100}
                />
              </div>
            </SettingRow>

            <SettingRow title="Certificate details">
              <div className="grid gap-3 sm:grid-cols-2">
                <InputField
                  label="Certificate Prefix"
                  value={draftSettings.certificates.prefix}
                  onChange={(value) => updateSetting("certificates", "prefix", value)}
                />
                <InputField
                  label="Certificate ID Format"
                  value={draftSettings.certificates.idFormat}
                  onChange={(value) => updateSetting("certificates", "idFormat", value)}
                />
              </div>
            </SettingRow>

            <SettingRow title="Certificate display">
              <div className="space-y-3">
                <ToggleField
                  label="Show Student Name"
                  checked={draftSettings.certificates.showStudentName}
                  onChange={(value) => updateSetting("certificates", "showStudentName", value)}
                />
                <ToggleField
                  label="Show Instructor Name"
                  checked={draftSettings.certificates.showInstructorName}
                  onChange={(value) => updateSetting("certificates", "showInstructorName", value)}
                />
                <ToggleField
                  label="Show Completion Date"
                  checked={draftSettings.certificates.showCompletionDate}
                  onChange={(value) => updateSetting("certificates", "showCompletionDate", value)}
                />
                <ToggleField
                  label="Show Score"
                  checked={draftSettings.certificates.showScore}
                  onChange={(value) => updateSetting("certificates", "showScore", value)}
                />
              </div>
            </SettingRow>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-5">
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                <span>Notification delivery is currently in demo mode.</span>
              </div>
            </div>

            <SettingRow title="Notification channels">
              <div className="space-y-3">
                <ToggleField label="Email Notifications" checked={draftSettings.notifications.email} onChange={(value) => updateSetting("notifications", "email", value)} />
                <ToggleField label="Course Enrollment Notifications" checked={draftSettings.notifications.enrollment} onChange={(value) => updateSetting("notifications", "enrollment", value)} />
                <ToggleField label="Assignment Notifications" checked={draftSettings.notifications.assignment} onChange={(value) => updateSetting("notifications", "assignment", value)} />
                <ToggleField label="Quiz Notifications" checked={draftSettings.notifications.quiz} onChange={(value) => updateSetting("notifications", "quiz", value)} />
                <ToggleField label="Certificate Notifications" checked={draftSettings.notifications.certificate} onChange={(value) => updateSetting("notifications", "certificate", value)} />
                <ToggleField label="Payment Notifications" checked={draftSettings.notifications.payment} onChange={(value) => updateSetting("notifications", "payment", value)} />
                <ToggleField label="Review Notifications" checked={draftSettings.notifications.review} onChange={(value) => updateSetting("notifications", "review", value)} />
                <ToggleField label="System Notifications" checked={draftSettings.notifications.system} onChange={(value) => updateSetting("notifications", "system", value)} />
                <ToggleField label="Admin Notifications" checked={draftSettings.notifications.admin} onChange={(value) => updateSetting("notifications", "admin", value)} />
                <ToggleField label="Browser Notifications" checked={draftSettings.notifications.browser} onChange={(value) => updateSetting("notifications", "browser", value)} />
              </div>
            </SettingRow>
          </div>
        );

      case "security":
        return (
          <div className="space-y-5">
            <SettingRow title="Password security">
              <ToggleField
                label="Require Strong Passwords"
                checked={draftSettings.security.strongPasswords}
                onChange={(value) => updateSetting("security", "strongPasswords", value)}
              />
            </SettingRow>
            <SettingRow title="Login and verification">
              <ToggleField
                label="Require Email Verification"
                checked={draftSettings.security.emailVerification}
                onChange={(value) => updateSetting("security", "emailVerification", value)}
              />
              <div className="mt-3">
                <ToggleField
                  label="Enable Login Activity Tracking"
                  checked={draftSettings.security.loginTracking}
                  onChange={(value) => updateSetting("security", "loginTracking", value)}
                />
              </div>
            </SettingRow>
            <SettingRow title="Session timeout">
              <div className="space-y-3">
                <ToggleField
                  label="Enable Session Timeout"
                  checked={draftSettings.security.sessionTimeoutEnabled}
                  onChange={(value) => updateSetting("security", "sessionTimeoutEnabled", value)}
                />
                <SelectField
                  label="Session Timeout"
                  value={draftSettings.security.sessionTimeout}
                  onChange={(value) => updateSetting("security", "sessionTimeout", value)}
                  options={[{ value: "15 minutes", label: "15 minutes" }, { value: "30 minutes", label: "30 minutes" }, { value: "1 hour", label: "1 hour" }, { value: "4 hours", label: "4 hours" }, { value: "8 hours", label: "8 hours" }]}
                  error={validationErrors.security_sessionTimeout}
                />
              </div>
            </SettingRow>
            <SettingRow title="Login protection" description="Demo security settings for failed login throttling.">
              <div className="grid gap-3 sm:grid-cols-2">
                <InputField
                  label="Maximum Login Attempts"
                  type="number"
                  value={draftSettings.security.maxLoginAttempts}
                  onChange={(value) => updateSetting("security", "maxLoginAttempts", Number(value) || 0)}
                  error={validationErrors.security_maxLoginAttempts}
                  min={1}
                />
                <InputField
                  label="Lockout Duration"
                  value={draftSettings.security.lockoutDuration}
                  onChange={(value) => updateSetting("security", "lockoutDuration", value)}
                />
              </div>
            </SettingRow>
            <SettingRow title="Two-factor authentication">
              <div className="space-y-3">
                <ToggleField
                  label="Enable 2FA"
                  checked={draftSettings.security.twoFactorEnabled}
                  onChange={(value) => updateSetting("security", "twoFactorEnabled", value)}
                />
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  Security status: <span className="font-semibold text-slate-900">Not connected</span>
                </div>
              </div>
            </SettingRow>
          </div>
        );

      case "maintenance":
        return (
          <div className="space-y-5">
            <SettingRow title="Maintenance mode">
              <ToggleField
                label="Maintenance Mode"
                checked={draftSettings.maintenance.enabled}
                onChange={(value) => updateSetting("maintenance", "enabled", value)}
              />
            </SettingRow>
            <SettingRow title="Maintenance message" description="This message is shown in the demo UI state only.">
              <TextareaField
                value={draftSettings.maintenance.message}
                onChange={(value) => updateSetting("maintenance", "message", value)}
                rows={4}
              />
            </SettingRow>
            <SettingRow title="Scheduled maintenance">
              <div className="space-y-3">
                <ToggleField
                  label="Scheduled Maintenance"
                  checked={draftSettings.maintenance.scheduled}
                  onChange={(value) => updateSetting("maintenance", "scheduled", value)}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <InputField
                    label="Start Date"
                    type="date"
                    value={draftSettings.maintenance.startDate}
                    onChange={(value) => updateSetting("maintenance", "startDate", value)}
                  />
                  <InputField
                    label="End Date"
                    type="date"
                    value={draftSettings.maintenance.endDate}
                    onChange={(value) => updateSetting("maintenance", "endDate", value)}
                    error={validationErrors.maintenance_endDate}
                  />
                </div>
                <ToggleField
                  label="Allow Admin Access During Maintenance"
                  checked={draftSettings.maintenance.allowAdminAccess}
                  onChange={(value) => updateSetting("maintenance", "allowAdminAccess", value)}
                />
              </div>
            </SettingRow>

            <div className="rounded-[22px] border border-red-200 bg-red-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-red-700">Danger Zone</p>
                  <p className="mt-1 text-sm leading-6 text-red-700/90">This button only demonstrates a destructive action in the local demo state.</p>
                </div>
                <Button type="button" variant="destructive" onClick={() => setShowClearDemoConfirmation(true)}>
                  Clear Demo Data
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/admin/dashboard" className="hover:text-primary-600">Admin</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-slate-900">Settings</span>
        </nav>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Admin / Settings</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Admin Settings</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">Manage platform configuration, branding, learning preferences, security options, and system behavior.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={hasUnsavedChanges ? "warning" : "success"}>{hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}</Badge>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={!hasUnsavedChanges}>
              <Undo2 className="h-4 w-4" aria-hidden="true" />
              Cancel Changes
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowResetConfirmation(true)}>
              Reset Changes
            </Button>
            <Button type="button" onClick={handleSave} disabled={!hasUnsavedChanges}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Info className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Demo Configuration</p>
            <p className="mt-1 text-sm text-slate-600">Settings are currently stored locally for demonstration purposes. Backend persistence and production configuration are not connected.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
          <div className="space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.key;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
                    isActive ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="space-y-5">
          {renderSectionContent()}
        </main>
      </div>

      <div className="rounded-[28px] border border-red-200 bg-red-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-red-700">Danger Zone</p>
            <p className="mt-1 text-sm leading-6 text-red-700/90">Only local demo settings can be reset or cleared. No production data is affected.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setShowResetConfirmation(true)}>
              Reset All Settings
            </Button>
            <Button type="button" variant="destructive" onClick={() => setShowClearDemoConfirmation(true)}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Clear Demo Data
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showResetConfirmation}
        title="Reset all settings to their default values?"
        message="This action restores the mock defaults for this page only."
        confirmLabel="Reset Settings"
        onClose={() => setShowResetConfirmation(false)}
        onConfirm={handleResetDefaults}
      />

      <ConfirmModal
        open={showClearDemoConfirmation}
        title="Clear demo settings?"
        message="This action only resets local demo settings. No production data will be deleted."
        confirmLabel="Clear Demo Data"
        variant="danger"
        onClose={() => setShowClearDemoConfirmation(false)}
        onConfirm={handleClearDemoData}
      />

      {toastMessage ? (
        <div className="fixed bottom-5 right-5 z-[60] rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
