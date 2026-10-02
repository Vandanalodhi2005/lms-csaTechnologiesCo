import { z } from "zod";
import { PAYMENT_METHODS, COUPON_TYPES } from "@/constants";

export const createOrderSchema = z.object({
  courseId: z.string({ required_error: "Course ID is required" }).trim(),
  couponCode: z.string().trim().nullable().optional(),
  paymentMethod: z.enum(Object.values(PAYMENT_METHODS)).default(PAYMENT_METHODS.RAZORPAY),
  billingDetails: z
    .object({
      name: z.string().trim().optional(),
      email: z.string().email().trim().optional(),
      phone: z.string().trim().optional(),
      address: z.string().trim().optional(),
      city: z.string().trim().optional(),
      state: z.string().trim().optional(),
      country: z.string().trim().optional(),
      pincode: z.string().trim().optional(),
    })
    .optional(),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string({ required_error: "Order ID is required" }).trim(),
  razorpay_order_id: z.string().trim().optional(),
  razorpay_payment_id: z.string().trim().optional(),
  razorpay_signature: z.string().trim().optional(),
});

export const createCouponSchema = z.object({
  code: z
    .string({ required_error: "Coupon code is required" })
    .min(3, "Code must be at least 3 characters")
    .max(30, "Code must be less than 30 characters")
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9_-]+$/, "Code can only contain letters, numbers, hyphens, and underscores"),
  type: z.enum(Object.values(COUPON_TYPES), { required_error: "Coupon type is required" }),
  value: z
    .number({ required_error: "Discount value is required" })
    .min(0, "Value cannot be negative"),
  maxDiscountAmount: z.number().min(0).nullable().optional(),
  minOrderAmount: z.number().min(0).default(0),
  description: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  usageLimit: z.number().int().min(0).nullable().optional(),
  perUserLimit: z.number().int().min(1).default(1),
  validFrom: z.coerce.date().default(() => new Date()),
  validUntil: z.coerce.date().nullable().optional(),
  applicableCourses: z.array(z.string().trim()).default([]),
  applicableCategories: z.array(z.string().trim()).default([]),
  applicableInstructors: z.array(z.string().trim()).default([]),
  excludeCourses: z.array(z.string().trim()).default([]),
  isPublic: z.boolean().default(false),
});

export const updateCouponSchema = createCouponSchema.partial();

export const applyCouponSchema = z.object({
  courseId: z.string({ required_error: "Course ID is required" }).trim(),
  code: z
    .string({ required_error: "Coupon code is required" })
    .trim()
    .toUpperCase(),
});

export const createReviewSchema = z.object({
  courseId: z.string({ required_error: "Course ID is required" }).trim(),
  rating: z
    .number({ required_error: "Rating is required" })
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  title: z.string().trim().max(200).nullable().optional(),
  comment: z.string().trim().max(2000).nullable().optional(),
  isAnonymous: z.boolean().default(false),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().trim().max(200).nullable().optional(),
  comment: z.string().trim().max(2000).nullable().optional(),
  isAnonymous: z.boolean().optional(),
});

export const refundOrderSchema = z.object({
  orderId: z.string({ required_error: "Order ID is required" }).trim(),
  refundAmount: z.number().min(0).optional(),
  refundReason: z.string().trim().min(3, "Reason must be at least 3 characters"),
});

export const updateProgressSchema = z.object({
  courseId: z.string({ required_error: "Course ID is required" }).trim(),
  lessonId: z.string({ required_error: "Lesson ID is required" }).trim(),
  progressPercent: z.number().min(0).max(100).optional(),
  isCompleted: z.boolean().optional(),
  videoWatchedSeconds: z.number().int().min(0).optional(),
  videoTotalSeconds: z.number().int().min(0).optional(),
  lastPosition: z.number().int().min(0).optional(),
});
