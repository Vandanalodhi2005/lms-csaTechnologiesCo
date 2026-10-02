import { z } from "zod";
import { COURSE_STATUS, COURSE_LEVELS } from "@/constants";

export const createCourseSchema = z.object({
  title: z
    .string({ required_error: "Course title is required" })
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  shortDescription: z
    .string({ required_error: "Short description is required" })
    .min(10, "Short description must be at least 10 characters")
    .max(300, "Short description must be less than 300 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .min(50, "Description must be at least 50 characters"),
  categoryId: z.string({ required_error: "Category is required" }).trim(),
  subcategoryId: z.string().trim().optional(),
  price: z
    .number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
    .min(0, "Price cannot be negative"),
  discountPrice: z
    .number({ invalid_type_error: "Discount price must be a number" })
    .min(0, "Discount price cannot be negative")
    .optional()
    .nullable(),
  level: z
    .enum(Object.values(COURSE_LEVELS), { invalid_type_error: "Invalid course level" })
    .default(COURSE_LEVELS.ALL_LEVELS),
  language: z.string().trim().default("English"),
  requirements: z.array(z.string().trim()).default([]),
  learningOutcomes: z.array(z.string().trim()).default([]),
  targetAudience: z.array(z.string().trim()).default([]),
  tags: z.array(z.string().trim()).default([]),
  faqs: z
    .array(
      z.object({
        question: z.string({ required_error: "FAQ question is required" }).min(2),
        answer: z.string({ required_error: "FAQ answer is required" }).min(2),
      })
    )
    .default([]),
});

export const updateCourseSchema = createCourseSchema.partial();

export const courseStatusSchema = z
  .object({
    status: z.enum(Object.values(COURSE_STATUS), { required_error: "Status is required" }),
    rejectionReason: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.status === COURSE_STATUS.REJECTED && (!value.rejectionReason || !value.rejectionReason.trim())) {
      ctx.addIssue({
        path: ["rejectionReason"],
        code: z.ZodIssueCode.custom,
        message: "Rejection reason is required",
      });
    }
  });

export const searchCoursesSchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  subcategory: z.string().trim().optional(),
  level: z.enum(Object.values(COURSE_LEVELS)).optional(),
  minPrice: z.string().transform((v) => (v ? Number(v) : undefined)).optional(),
  maxPrice: z.string().transform((v) => (v ? Number(v) : undefined)).optional(),
  minRating: z.string().transform((v) => (v ? Number(v) : undefined)).optional(),
  language: z.string().trim().optional(),
  duration: z.enum(["short", "medium", "long"]).optional(),
  sort: z.enum(["popular", "newest", "rating", "price_low", "price_high"]).default("popular"),
  page: z.string().transform((v) => Math.max(1, Number(v) || 1)).default("1"),
  limit: z
    .string()
    .transform((v) => Math.min(100, Math.max(1, Number(v) || 10)))
    .default("10"),
  isFeatured: z.enum(["true", "false"]).optional(),
  isFree: z.enum(["true", "false"]).optional(),
});

export const submitForReviewSchema = z.object({
  courseId: z.string({ required_error: "Course ID is required" }),
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
