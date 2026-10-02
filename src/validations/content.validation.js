import { z } from "zod";

export const createModuleSchema = z.object({
  courseId: z.string({ required_error: "Course ID is required" }).trim(),
  title: z
    .string({ required_error: "Module title is required" })
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  description: z.string().max(1000).nullable().optional(),
  order: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(false),
  isFinalAssessment: z.boolean().default(false),
});

export const updateModuleSchema = createModuleSchema.partial();

export const reorderModulesSchema = z.object({
  modules: z.array(
    z.object({
      id: z.string().trim(),
      order: z.number().int().min(0),
    })
  ),
});

export const createLessonSchema = z.object({
  courseId: z.string({ required_error: "Course ID is required" }).trim(),
  moduleId: z.string({ required_error: "Module ID is required" }).trim(),
  title: z
    .string({ required_error: "Lesson title is required" })
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  description: z.string().nullable().optional(),
  type: z
    .enum(["video", "text", "pdf", "audio", "quiz", "assignment", "external"])
    .default("video"),
  order: z.number().int().min(0).default(0),
  duration: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(false),
  isFree: z.boolean().default(false),
  videoUrl: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  pdfUrl: z.string().nullable().optional(),
  audioUrl: z.string().nullable().optional(),
  externalUrl: z.string().nullable().optional(),
  quizId: z.string().trim().nullable().optional(),
  assignmentId: z.string().trim().nullable().optional(),
  resources: z
    .array(
      z.object({
        title: z.string({ required_error: "Resource title is required" }).min(1),
        url: z.string({ required_error: "Resource URL is required" }),
        type: z.string().default("file"),
        size: z.number().optional(),
      })
    )
    .default([]),
  minProgressPercent: z.number().min(0).max(100).default(100),
});

export const updateLessonSchema = createLessonSchema.partial();

export const reorderLessonsSchema = z.object({
  lessons: z.array(
    z.object({
      id: z.string().trim(),
      order: z.number().int().min(0),
    })
  ),
});

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  description: z.string().max(500).nullable().optional(),
  icon: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  parentId: z.string().trim().nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();
