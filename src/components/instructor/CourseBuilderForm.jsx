"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Check,
  ChevronRight,
  Circle,
  Eye,
  FileImage,
  GripVertical,
  ImageIcon,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";
import Select from "@/components/ui/Select.jsx";
import Textarea from "@/components/ui/Textarea.jsx";
import Badge from "@/components/ui/Badge.jsx";
import { courseBuilderOptions, initialCourse } from "@/constants/courseBuilder.js";

const MAX_OBJECTIVES = 10;
const MAX_REQUIREMENTS = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const stepLabels = ["Basic Information", "Curriculum", "Pricing", "Review & Publish"];

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

function createSection() {
  return {
    id: createId("section"),
    title: "",
    description: "",
    lessons: [createLesson()],
  };
}

function createLesson() {
  return {
    id: createId("lesson"),
    title: "",
    type: "video",
    description: "",
    videoUrl: "",
    duration: 10,
    freePreview: false,
    articleContent: "",
    resources: "",
  };
}

function formatDuration(totalMinutes) {
  if (!totalMinutes || Number(totalMinutes) <= 0) return "0 min";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getValidationState(field, errors) {
  return errors[field] ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]";
}

export default function CourseBuilderForm() {
  const [form, setForm] = useState(initialCourse);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [publishMessage, setPublishMessage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedKey = "eduLearn-course-builder-draft";
    try {
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm({ ...initialCourse, ...parsed, sections: parsed.sections?.length ? parsed.sections : [createSection()] });
      }
    } catch {
      // Ignore localStorage read errors.
    }
  }, []);

  useEffect(() => {
    const key = "eduLearn-course-builder-draft";
    if (isDirty) {
      try {
        localStorage.setItem(key, JSON.stringify(form));
      } catch {
        // Ignore localStorage write errors.
      }
    }
  }, [form, isDirty]);

  const currentStep = 1;
  const totalLessons = useMemo(
    () => form.sections.reduce((count, section) => count + (section.lessons?.length || 0), 0),
    [form.sections]
  );

  const totalDurationMinutes = useMemo(
    () => form.sections.reduce((total, section) => total + (section.lessons || []).reduce((sum, lesson) => sum + Number(lesson.duration || 0), 0), 0),
    [form.sections]
  );

  const discountPercentage = useMemo(() => {
    if (!Number(form.price) || !Number(form.discountPrice) || Number(form.discountPrice) >= Number(form.price)) {
      return 0;
    }
    return Math.round(((Number(form.price) - Number(form.discountPrice)) / Number(form.price)) * 100);
  }, [form.price, form.discountPrice]);

  const checklist = useMemo(
    () => [
      { label: "Course title added", done: Boolean(form.title.trim()) },
      { label: "Description added", done: Boolean(form.shortDescription.trim() && form.description.trim()) },
      { label: "Thumbnail uploaded", done: Boolean(form.thumbnail?.url || form.thumbnail) },
      { label: "Category selected", done: Boolean(form.category) },
      { label: "Learning objectives added", done: form.objectives.filter((item) => item.trim()).length > 0 },
      { label: "Curriculum created", done: form.sections.length > 0 && form.sections.some((section) => (section.lessons || []).length > 0) },
      { label: "Pricing configured", done: Number(form.price) >= 0 },
    ],
    [form]
  );

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setIsDirty(true);
    setStatusMessage("");
    setPublishMessage("");
  };

  const addListItem = (listName, defaultValue) => {
    setForm((prev) => ({
      ...prev,
      [listName]: [...prev[listName], defaultValue],
    }));
    setIsDirty(true);
  };

  const removeListItem = (listName, index) => {
    setForm((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((_, itemIndex) => itemIndex !== index),
    }));
    setIsDirty(true);
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, createSection()],
    }));
    setIsDirty(true);
  };

  const deleteSection = (sectionIndex) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== sectionIndex),
    }));
    setIsDirty(true);
  };

  const updateSection = (sectionIndex, field, value) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) => (
        index === sectionIndex ? { ...section, [field]: value } : section
      )),
    }));
    setIsDirty(true);
  };

  const addLessonToSection = (sectionIndex) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, lessons: [...(section.lessons || []), createLesson()] } : section
      ),
    }));
    setIsDirty(true);
  };

  const updateLessonInSection = (sectionIndex, lessonIndex, field, value) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sectionKey) => {
        if (sectionKey !== sectionIndex) return section;
        return {
          ...section,
          lessons: section.lessons.map((lesson, lessonKey) =>
            lessonKey === lessonIndex ? { ...lesson, [field]: value } : lesson
          ),
        };
      }),
    }));
    setIsDirty(true);
  };

  const deleteLessonFromSection = (sectionIndex, lessonIndex) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) => {
        if (index !== sectionIndex) return section;
        return {
          ...section,
          lessons: section.lessons.filter((_, itemIndex) => itemIndex !== lessonIndex),
        };
      }),
    }));
    setIsDirty(true);
  };

  const moveLesson = (sectionIndex, lessonIndex, direction) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) => {
        if (index !== sectionIndex) return section;
        const lessons = [...(section.lessons || [])];
        const newIndex = lessonIndex + direction;
        if (newIndex < 0 || newIndex >= lessons.length) return section;
        const [movedItem] = lessons.splice(lessonIndex, 1);
        lessons.splice(newIndex, 0, movedItem);
        return { ...section, lessons };
      }),
    }));
    setIsDirty(true);
  };

  const handleFileSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, thumbnail: "Please upload a PNG, JPG, or WEBP image." }));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, thumbnail: "Image must be 5MB or smaller." }));
      event.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      thumbnail: { name: file.name, size: file.size, url },
    }));
    setErrors((prev) => ({ ...prev, thumbnail: undefined }));
    setIsDirty(true);
    setStatusMessage("");
    setPublishMessage("");
    event.target.value = "";
  };

  const handleRemoveThumbnail = () => {
    setForm((prev) => ({
      ...prev,
      thumbnail: null,
    }));
    setErrors((prev) => ({ ...prev, thumbnail: undefined }));
    setIsDirty(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveDraft = () => {
    setStatusMessage("Draft saved locally.");
    setPublishMessage("");
    setIsDirty(false);
    try {
      localStorage.setItem("eduLearn-course-builder-draft", JSON.stringify(form));
    } catch {
      // Ignore localStorage save errors.
    }
  };

  const validateCourse = () => {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = "Course title is required.";
    if (!form.shortDescription.trim()) nextErrors.shortDescription = "Short description is required.";
    if (!form.description.trim()) nextErrors.description = "Course description is required.";
    if (!form.category) nextErrors.category = "Please select a category.";
    if (!form.level) nextErrors.level = "Please select a level.";
    if (!form.thumbnail) nextErrors.thumbnail = "Course thumbnail is required.";
    if (form.objectives.filter((item) => item.trim()).length === 0) nextErrors.objectives = "Add at least one learning objective.";
    if (form.sections.length === 0) nextErrors.sections = "Add at least one section.";
    if (form.sections.some((section) => !section.lessons || section.lessons.length === 0)) {
      nextErrors.sections = "Add at least one lesson in each section.";
    }
    if (Number(form.price) < 0) nextErrors.price = "Course price cannot be negative.";
    if (Number(form.discountPrice) < 0) nextErrors.discountPrice = "Discount price cannot be negative.";
    if (Number(form.discountPrice) > Number(form.price)) nextErrors.discountPrice = "Discount price cannot exceed regular price.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePublish = () => {
    if (!validateCourse()) {
      setPublishMessage("Please fix the highlighted fields before publishing.");
      return;
    }

    setPublishMessage("Course is ready to publish. Publishing will be connected to the backend later.");
    setStatusMessage("");
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-[#64748B]">
            <li>
              <Link href="/instructor/dashboard" className="hover:text-[#2563EB]">Instructor Dashboard</Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li>
              <Link href="/instructor/courses" className="hover:text-[#2563EB]">Courses</Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li aria-current="page" className="font-medium text-[#0F172A]">Create Course</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">Course Builder</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] md:text-4xl">Create New Course</h1>
            <p className="mt-2 text-sm leading-6 text-[#475569] md:text-base">Build and publish a complete course for your students.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="default" onClick={handleSaveDraft} className="gap-2">
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Draft
            </Button>
            <Button variant="outline" size="default" onClick={handlePreview} className="gap-2">
              <Eye className="h-4 w-4" aria-hidden="true" />
              Preview
            </Button>
            <Button size="default" onClick={handlePublish} className="gap-2 bg-[#0F2F5F] hover:bg-[#143A72]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Publish Course
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {stepLabels.map((step, index) => {
            const isCurrent = index === currentStep - 1;
            const isDone = index < currentStep - 1;
            return (
              <div key={step} className="flex items-center gap-2 text-sm">
                <div
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                    isDone
                      ? "border-[#BBF7D0] bg-[#ECFDF5] text-[#166534]"
                      : isCurrent
                        ? "border-[#D5E7FF] bg-[#EFF6FF] text-[#2563EB]"
                        : "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]"
                  }`}
                >
                  {index + 1}
                </div>
                <span className={isCurrent ? "font-semibold text-[#0F172A]" : "text-[#64748B]"}>{step}</span>
                {index < stepLabels.length - 1 && <ChevronRight className="h-4 w-4 text-[#94A3B8]" aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_380px]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <FileImage className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Course basics</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Course Information</h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#0F172A]" htmlFor="course-title">
                  Course Title
                </label>
                <Input
                  id="course-title"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className={getValidationState("title", errors)}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? "course-title-error" : undefined}
                  placeholder="Full Stack Web Development"
                />
                {errors.title ? <p id="course-title-error" className="mt-2 text-sm text-red-600">{errors.title}</p> : null}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#0F172A]" htmlFor="short-description">
                  Short Description
                </label>
                <Textarea
                  id="short-description"
                  rows={3}
                  value={form.shortDescription}
                  onChange={(event) => updateField("shortDescription", event.target.value)}
                  className={getValidationState("shortDescription", errors)}
                  aria-invalid={Boolean(errors.shortDescription)}
                  aria-describedby={errors.shortDescription ? "short-description-error" : undefined}
                  maxLength={160}
                  placeholder="Master React, Next.js, Node.js and MongoDB by building real-world applications."
                />
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-[#64748B]">
                  <span>{form.shortDescription.trim().length}/160</span>
                  {errors.shortDescription ? <span className="text-red-600">{errors.shortDescription}</span> : null}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#0F172A]" htmlFor="description">
                  Course Description
                </label>
                <Textarea
                  id="description"
                  rows={6}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className={getValidationState("description", errors)}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  placeholder="Explain what students will learn and what makes this course valuable."
                />
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-[#64748B]">
                  <span>{form.description.trim().length} characters</span>
                  {errors.description ? <span className="text-red-600">{errors.description}</span> : null}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#0F172A]" htmlFor="course-category">
                  Category
                </label>
                <Select
                  id="course-category"
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  className={getValidationState("category", errors)}
                  aria-invalid={Boolean(errors.category)}
                >
                  <option value="">Select category</option>
                  {courseBuilderOptions.categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
                {errors.category ? <p className="mt-2 text-sm text-red-600">{errors.category}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#0F172A]" htmlFor="course-subcategory">
                  Subcategory
                </label>
                <Input
                  id="course-subcategory"
                  value={form.subcategory}
                  onChange={(event) => updateField("subcategory", event.target.value)}
                  placeholder="Frontend, Backend, UI Design"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#0F172A]" htmlFor="course-level">
                  Level
                </label>
                <Select
                  id="course-level"
                  value={form.level}
                  onChange={(event) => updateField("level", event.target.value)}
                  className={getValidationState("level", errors)}
                  aria-invalid={Boolean(errors.level)}
                >
                  {courseBuilderOptions.levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </Select>
                {errors.level ? <p className="mt-2 text-sm text-red-600">{errors.level}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#0F172A]" htmlFor="course-language">
                  Language
                </label>
                <Select
                  id="course-language"
                  value={form.language}
                  onChange={(event) => updateField("language", event.target.value)}
                >
                  {courseBuilderOptions.languages.map((language) => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </Select>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <Upload className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Visual asset</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Course Thumbnail</h2>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="rounded-[22px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  {form.thumbnail?.url ? (
                    <div className="relative w-full overflow-hidden rounded-[18px] border border-[#E2E8F0] bg-white">
                      <Image
                        src={form.thumbnail.url}
                        alt={form.thumbnail.name || "Course thumbnail preview"}
                        width={1200}
                        height={675}
                        unoptimized
                        className="h-52 w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center rounded-[18px] border border-[#E2E8F0] bg-white text-[#64748B]">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-10 w-10" aria-hidden="true" />
                        <p className="mt-3 text-sm font-medium">Upload course thumbnail</p>
                      </div>
                    </div>
                  )}

                  <div className="w-full">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleFileSelection}
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full justify-center gap-2"
                    >
                      <Upload className="h-4 w-4" aria-hidden="true" />
                      Upload Course Thumbnail
                    </Button>
                  </div>

                  <div className="text-xs leading-6 text-[#64748B]">
                    <p>PNG, JPG or WEBP</p>
                    <p>Recommended size: 1280 × 720</p>
                    <p>Maximum file size: 5MB</p>
                  </div>
                </div>
                {errors.thumbnail ? <p className="mt-3 text-sm text-red-600">{errors.thumbnail}</p> : null}
              </div>

              {form.thumbnail?.url ? (
                <div className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">Selected file</p>
                  <p className="mt-3 line-clamp-2 text-sm font-medium text-[#0F172A]">{form.thumbnail.name}</p>
                  <p className="mt-1 text-xs text-[#64748B]">{Math.round((form.thumbnail.size || 0) / 1024)} KB</p>
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FAFC]"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <Check className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Course outcomes</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">What Students Will Learn</h2>
              </div>
            </div>

            <div className="space-y-3">
              {form.objectives.map((objective, index) => (
                <div key={`objective-${index}`} className="flex items-center gap-3">
                  <Input
                    value={objective}
                    onChange={(event) => {
                      const nextObjectives = [...form.objectives];
                      nextObjectives[index] = event.target.value;
                      updateField("objectives", nextObjectives);
                    }}
                    placeholder="Students will build full-stack applications."
                    className={errors.objectives ? "border-red-300" : ""}
                  />
                  <button
                    type="button"
                    aria-label="Remove objective"
                    onClick={() => removeListItem("objectives", index)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#F8FAFC]"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => addListItem("objectives", "")}
                disabled={form.objectives.length >= MAX_OBJECTIVES}
                className="gap-2"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Objective
              </Button>
              {errors.objectives ? <p className="text-sm text-red-600">{errors.objectives}</p> : null}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <ListBulletIcon />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Prerequisites</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Requirements</h2>
              </div>
            </div>

            <div className="space-y-3">
              {form.requirements.map((requirement, index) => (
                <div key={`requirement-${index}`} className="flex items-center gap-3">
                  <Input
                    value={requirement}
                    onChange={(event) => {
                      const nextRequirements = [...form.requirements];
                      nextRequirements[index] = event.target.value;
                      updateField("requirements", nextRequirements);
                    }}
                    placeholder="Basic JavaScript knowledge"
                  />
                  <button
                    type="button"
                    aria-label="Remove requirement"
                    onClick={() => removeListItem("requirements", index)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#F8FAFC]"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => addListItem("requirements", "")}
                disabled={form.requirements.length >= MAX_REQUIREMENTS}
                className="gap-2"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Requirement
              </Button>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                  <BookOpenIcon />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Course structure</p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Course Curriculum</h2>
                </div>
              </div>

              <Button type="button" variant="outline" onClick={addSection} className="gap-2">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Section
              </Button>
            </div>

            <p className="mb-4 text-sm text-[#64748B]">Organize your course into sections and lessons.</p>

            <div className="space-y-5">
              {form.sections.map((section, sectionIndex) => (
                <div key={section.id} className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#64748B] shadow-sm">
                        <GripVertical className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">Section {sectionIndex + 1}</p>
                        <p className="text-sm text-[#475569]">{section.title || "Untitled Section"}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => addLessonToSection(sectionIndex)} className="gap-1">
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        Add Lesson
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => deleteSection(sectionIndex)} className="gap-1 text-red-600 hover:text-red-700">
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-[#0F172A]">Section Title</label>
                      <Input
                        value={section.title}
                        onChange={(event) => updateSection(sectionIndex, "title", event.target.value)}
                        placeholder="Introduction to Full Stack Development"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-[#0F172A]">Section Description</label>
                      <Textarea
                        rows={2}
                        value={section.description}
                        onChange={(event) => updateSection(sectionIndex, "description", event.target.value)}
                        placeholder="Learn the fundamentals before building the project."
                      />
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {(section.lessons || []).map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="rounded-[18px] border border-[#E2E8F0] bg-white p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                              <GripVertical className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">Lesson {lessonIndex + 1}</p>
                              <p className="text-sm font-medium text-[#0F172A]">{lesson.title || "Untitled lesson"}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => moveLesson(sectionIndex, lessonIndex, -1)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2 text-xs font-medium text-[#475569] hover:bg-[#F8FAFC]"
                              aria-label="Move lesson up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                              Up
                            </button>
                            <button
                              type="button"
                              onClick={() => moveLesson(sectionIndex, lessonIndex, 1)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2 text-xs font-medium text-[#475569] hover:bg-[#F8FAFC]"
                              aria-label="Move lesson down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                              Down
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteLessonFromSection(sectionIndex, lessonIndex)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                              aria-label="Delete lesson"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-[#0F172A]">Lesson Title</label>
                            <Input
                              value={lesson.title}
                              onChange={(event) => updateLessonInSection(sectionIndex, lessonIndex, "title", event.target.value)}
                              placeholder="Introduction to React"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-[#0F172A]">Lesson Type</label>
                            <Select
                              value={lesson.type}
                              onChange={(event) => updateLessonInSection(sectionIndex, lessonIndex, "type", event.target.value)}
                            >
                              {courseBuilderOptions.lessonTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </Select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-[#0F172A]">Description</label>
                            <Textarea
                              rows={3}
                              value={lesson.description}
                              onChange={(event) => updateLessonInSection(sectionIndex, lessonIndex, "description", event.target.value)}
                              placeholder="Short lesson summary and learning objective."
                            />
                          </div>

                          {lesson.type === "video" && (
                            <div className="md:col-span-2">
                              <label className="mb-2 block text-sm font-medium text-[#0F172A]">Video URL</label>
                              <Input
                                value={lesson.videoUrl}
                                onChange={(event) => updateLessonInSection(sectionIndex, lessonIndex, "videoUrl", event.target.value)}
                                placeholder="/videos/react-introduction.mp4 or https://example.com/video.mp4"
                              />
                            </div>
                          )}

                          {lesson.type === "article" && (
                            <div className="md:col-span-2">
                              <label className="mb-2 block text-sm font-medium text-[#0F172A]">Article Content</label>
                              <Textarea
                                rows={4}
                                value={lesson.articleContent}
                                onChange={(event) => updateLessonInSection(sectionIndex, lessonIndex, "articleContent", event.target.value)}
                                placeholder="Write the article content or outline here."
                              />
                            </div>
                          )}

                          {lesson.type === "quiz" && (
                            <div className="md:col-span-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm text-[#475569]">
                              Quiz will be configured in the Quiz Builder.
                            </div>
                          )}

                          {lesson.type === "assignment" && (
                            <div className="md:col-span-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm text-[#475569]">
                              Assignment will be configured in the Assignment Builder.
                            </div>
                          )}

                          <div>
                            <label className="mb-2 block text-sm font-medium text-[#0F172A]">Duration (minutes)</label>
                            <Input
                              type="number"
                              min="1"
                              value={lesson.duration}
                              onChange={(event) => updateLessonInSection(sectionIndex, lessonIndex, "duration", Number(event.target.value) || 0)}
                              aria-invalid={Number(lesson.duration) <= 0}
                            />
                          </div>

                          <div className="flex items-end">
                            <label className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-sm text-[#0F172A]">
                              <span>Free preview</span>
                              <input
                                type="checkbox"
                                checked={lesson.freePreview}
                                onChange={(event) => updateLessonInSection(sectionIndex, lessonIndex, "freePreview", event.target.checked)}
                                className="h-4 w-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Publishing setup</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Pricing</h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#0F172A]" htmlFor="course-price">
                  Course Price
                </label>
                <Input
                  id="course-price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => updateField("price", Number(event.target.value) || 0)}
                  className={getValidationState("price", errors)}
                  aria-invalid={Boolean(errors.price)}
                />
                {errors.price ? <p className="mt-2 text-sm text-red-600">{errors.price}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#0F172A]" htmlFor="discount-price">
                  Discount Price
                </label>
                <Input
                  id="discount-price"
                  type="number"
                  min="0"
                  value={form.discountPrice}
                  onChange={(event) => updateField("discountPrice", Number(event.target.value) || 0)}
                  className={getValidationState("discountPrice", errors)}
                  aria-invalid={Boolean(errors.discountPrice)}
                />
                {errors.discountPrice ? <p className="mt-2 text-sm text-red-600">{errors.discountPrice}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#0F172A]" htmlFor="course-currency">
                  Currency
                </label>
                <Select
                  id="course-currency"
                  value={form.currency}
                  onChange={(event) => updateField("currency", event.target.value)}
                >
                  {courseBuilderOptions.currencies.map((currency) => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#0F172A]" htmlFor="course-status">
                  Publishing Status
                </label>
                <Select
                  id="course-status"
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="ready">Ready to Publish</option>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#0F172A]" htmlFor="course-visibility">
                  Course Visibility
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-sm text-[#0F172A]">
                    <span>Private</span>
                    <input
                      type="radio"
                      name="visibility"
                      checked={form.visibility === "private"}
                      onChange={() => updateField("visibility", "private")}
                      className="h-4 w-4 text-[#2563EB]"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-sm text-[#0F172A]">
                    <span>Public</span>
                    <input
                      type="radio"
                      name="visibility"
                      checked={form.visibility === "public"}
                      onChange={() => updateField("visibility", "public")}
                      className="h-4 w-4 text-[#2563EB]"
                    />
                  </label>
                </div>
                <p className="mt-3 text-xs text-[#64748B]">
                  {form.visibility === "private"
                    ? "Only authorized users can access the course."
                    : "Course can appear in the EduLearn catalog once published."}
                </p>
              </div>
            </div>

            {Number(form.price) > 0 && Number(form.discountPrice) > 0 ? (
              <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-sm text-[#64748B]">Price preview</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#0F172A]">{formatCurrency(form.price)}</span>
                  <span className="text-lg text-[#64748B] line-through">{formatCurrency(form.discountPrice)}</span>
                </div>
                <Badge variant="info" className="mt-3">{discountPercentage}% OFF</Badge>
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                  <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Summary</p>
                  <h2 className="mt-1 text-xl font-bold text-[#0F172A]">Course Summary</h2>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-[#475569]">
                <div className="flex items-start justify-between gap-3">
                  <span>Course title</span>
                  <span className="max-w-[150px] text-right font-semibold text-[#0F172A]">{form.title || "Untitled course"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Category</span>
                  <span className="font-semibold text-[#0F172A]">{form.category || "—"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Level</span>
                  <span className="font-semibold text-[#0F172A]">{form.level}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Language</span>
                  <span className="font-semibold text-[#0F172A]">{form.language}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Sections</span>
                  <span className="font-semibold text-[#0F172A]">{form.sections.length}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Lessons</span>
                  <span className="font-semibold text-[#0F172A]">{totalLessons}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Duration</span>
                  <span className="font-semibold text-[#0F172A]">{formatDuration(totalDurationMinutes)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Price</span>
                  <span className="font-semibold text-[#0F172A]">{formatCurrency(form.discountPrice || form.price || 0)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Status</span>
                  <span className="font-semibold text-[#0F172A]">{form.status === "ready" ? "Ready to Publish" : "Draft"}</span>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#16A34A]">
                  <Check className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Checklist</p>
                  <h2 className="mt-1 text-xl font-bold text-[#0F172A]">Before Publishing</h2>
                </div>
              </div>

              <ul className="mt-5 space-y-3 text-sm">
                {checklist.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-[#475569]">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full ${item.done ? "bg-[#ECFDF5] text-[#166534]" : "bg-[#F8FAFC] text-[#64748B]"}`}>
                      {item.done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Circle className="h-2.5 w-2.5 fill-current" aria-hidden="true" />}
                    </span>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </section>

            {(statusMessage || publishMessage) && (
              <div className={`rounded-[22px] border p-4 text-sm ${publishMessage ? "border-[#BBF7D0] bg-[#ECFDF5] text-[#166534]" : "border-[#D5E7FF] bg-[#EFF6FF] text-[#1D4ED8]"}`}>
                {statusMessage || publishMessage}
              </div>
            )}

            {isDirty ? (
              <div className="rounded-[22px] border border-[#FDE68A] bg-[#FFFBEB] p-4 text-sm text-[#92400E]">
                Unsaved changes pending.
              </div>
            ) : null}
          </div>
        </aside>
      </div>

      {previewOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-2xl md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl font-bold text-[#0F172A]">Course Preview</h3>
              <button type="button" onClick={() => setPreviewOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]" aria-label="Close preview">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                {form.thumbnail?.url ? (
                  <Image
                    src={form.thumbnail.url}
                    alt={form.title || "Course preview"}
                    width={1200}
                    height={675}
                    unoptimized
                    className="h-52 w-full rounded-[20px] object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]">
                    No thumbnail selected
                  </div>
                )}

                <h4 className="mt-5 text-3xl font-bold tracking-tight text-[#0F172A]">{form.title || "Course title"}</h4>
                <p className="mt-3 text-sm leading-7 text-[#475569]">{form.shortDescription || "Add a short description to showcase your course."}</p>

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#475569]">
                  <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1.5">{form.category || "Category"}</span>
                  <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1.5">{form.level}</span>
                  <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1.5">{form.language}</span>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h5 className="text-lg font-bold text-[#0F172A]">About this course</h5>
                    <p className="mt-2 text-sm leading-7 text-[#475569]">{form.description || "Course description will appear here."}</p>
                  </div>
                  <div>
                    <h5 className="text-lg font-bold text-[#0F172A]">Curriculum</h5>
                    <div className="mt-3 space-y-3">
                      {form.sections.map((section, idx) => (
                        <div key={section.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                          <p className="text-sm font-semibold text-[#0F172A]">{section.title || `Section ${idx + 1}`}</p>
                          <ul className="mt-2 space-y-1 text-sm text-[#475569]">
                            {(section.lessons || []).map((lesson, lessonIndex) => (
                              <li key={lesson.id} className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" aria-hidden="true" />
                                {lesson.title || `Lesson ${lessonIndex + 1}`} - {lesson.type}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Instructor</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB] font-semibold">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F172A]">John Doe</p>
                    <p className="text-sm text-[#64748B]">Senior Full Stack Developer</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-4">
                  <p className="text-sm text-[#64748B]">Course price</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A]">{formatCurrency(form.discountPrice || form.price || 0)}</p>
                  {Number(form.price) > 0 && Number(form.discountPrice) > 0 && Number(form.discountPrice) < Number(form.price) ? (
                    <p className="mt-2 text-sm text-[#64748B] line-through">{formatCurrency(form.price)}</p>
                  ) : null}
                </div>

                <div className="mt-6">
                  <h5 className="text-lg font-bold text-[#0F172A]">Learning objectives</h5>
                  <ul className="mt-3 space-y-2 text-sm text-[#475569]">
                    {form.objectives.filter((objective) => objective.trim()).map((objective) => (
                      <li key={objective} className="flex items-start gap-2">
                        <Check className="mt-1 h-4 w-4 text-[#16A34A]" aria-hidden="true" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ListBulletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M8 6h12M8 12h12M8 18h12" />
      <circle cx="4" cy="6" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H20v16.5H5.5A2.5 2.5 0 0 0 3 22V5.5Z" />
      <path d="M3 18.5c2.5-1.3 5.6-1.3 8 0" />
      <path d="M3 14.5c2.5-1.3 5.6-1.3 8 0" />
    </svg>
  );
}
