export const ROLES = Object.freeze({
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  CONTENT_MANAGER: "content_manager",
  SUPPORT_AGENT: "support_agent",
  ORG_ADMIN: "organization_admin",
});

export const COURSE_STATUS = Object.freeze({
  DRAFT: "draft",
  PENDING: "pending",
  PUBLISHED: "published",
  REJECTED: "rejected",
  ARCHIVED: "archived",
});

export const LESSON_TYPES = Object.freeze({
  VIDEO: "video",
  TEXT: "text",
  PDF: "pdf",
  AUDIO: "audio",
  QUIZ: "quiz",
  ASSIGNMENT: "assignment",
  EXTERNAL: "external",
  LIVE_CLASS: "live_class",
  INTERACTIVE: "interactive",
  CODING_EXERCISE: "coding_exercise",
});

export const QUESTION_TYPES = Object.freeze({
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE: "true_false",
});

export const SUBMISSION_STATUS = Object.freeze({
  PENDING: "pending",
  SUBMITTED: "submitted",
  GRADED: "graded",
  LATE: "late",
});

export const ORDER_STATUS = Object.freeze({
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
});

export const PAYMENT_STATUS = Object.freeze({
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  REFUNDED: "refunded",
});

export const PAYMENT_METHODS = Object.freeze({
  RAZORPAY: "razorpay",
  STRIPE: "stripe",
});

export const COURSE_LEVELS = Object.freeze({
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ALL_LEVELS: "All Levels",
});

export const NOTIFICATION_TYPES = Object.freeze({
  ENROLLMENT: "enrollment",
  COURSE_APPROVED: "course_approved",
  COURSE_REJECTED: "course_rejected",
  ASSIGNMENT_GRADED: "assignment_graded",
  QUIZ_COMPLETED: "quiz_completed",
  CERTIFICATE_ISSUED: "certificate_issued",
  NEW_REVIEW: "new_review",
  PAYMENT_SUCCESS: "payment_success",
  GENERAL: "general",
});

export const COUPON_TYPES = Object.freeze({
  PERCENTAGE: "percentage",
  FIXED: "fixed",
});

export const SORT_OPTIONS = Object.freeze({
  POPULAR: "popular",
  NEWEST: "newest",
  RATING: "rating",
  PRICE_LOW: "price_low",
  PRICE_HIGH: "price_high",
});

export const COOKIE_NAME = "lms-session";

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const ALLOWED_FILE_TYPES = {
  IMAGE: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  DOCUMENT: ["application/pdf"],
  VIDEO: ["video/mp4", "video/webm"],
  AUDIO: ["audio/mpeg", "audio/wav"],
  ASSIGNMENT: ["application/pdf", "application/zip", "image/jpeg", "image/png"],
};

export const MAX_FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024,
  VIDEO: 500 * 1024 * 1024,
  DOCUMENT: 25 * 1024 * 1024,
  ASSIGNMENT: 50 * 1024 * 1024,
};
