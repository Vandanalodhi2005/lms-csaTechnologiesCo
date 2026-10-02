import mongoose from "mongoose";
import { COURSE_STATUS, COURSE_LEVELS } from "@/constants";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title must be less than 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: [300, "Short description must be less than 300 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    thumbnail: {
      type: String,
      default: null,
    },
    thumbnailPublicId: {
      type: String,
      default: null,
      select: false,
    },
    previewVideo: {
      type: String,
      default: null,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      default: null,
    },
    level: {
      type: String,
      enum: Object.values(COURSE_LEVELS),
      default: COURSE_LEVELS.ALL_LEVELS,
    },
    language: {
      type: String,
      default: "English",
    },
    duration: {
      type: Number,
      default: 0,
      min: [0, "Duration cannot be negative"],
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    learningOutcomes: [
      {
        type: String,
        trim: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    targetAudience: [
      {
        type: String,
        trim: true,
      },
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: Object.values(COURSE_STATUS),
      default: COURSE_STATUS.DRAFT,
      index: true,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },
    moduleCount: {
      type: Number,
      default: 0,
    },
    lessonCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    completionRate: {
      type: Number,
      default: 0,
    },
    certificateEnabled: {
      type: Boolean,
      default: true,
    },
    certificateThreshold: {
      type: Number,
      default: 80,
    },
    seoTitle: {
      type: String,
      maxlength: 70,
    },
    seoDescription: {
      type: String,
      maxlength: 160,
    },
    seoKeywords: [String],
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ status: 1, isFeatured: -1, createdAt: -1 });
courseSchema.index({ status: 1, categoryId: 1, price: 1, rating: -1 });
courseSchema.index({ instructorId: 1, status: 1, createdAt: -1 });
courseSchema.index({
  title: "text",
  shortDescription: "text",
  description: "text",
  tags: "text",
});

courseSchema.virtual("effectivePrice").get(function () {
  return this.discountPrice != null ? this.discountPrice : this.price;
});

courseSchema.virtual("isFree").get(function () {
  return this.effectivePrice === 0;
});

courseSchema.virtual("discountPercentage").get(function () {
  if (!this.price || !this.discountPrice || this.discountPrice >= this.price) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
