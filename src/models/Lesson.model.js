import mongoose from "mongoose";
import { LESSON_TYPES } from "@/constants";

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
      maxlength: [200, "Title must be less than 200 characters"],
    },
    description: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: Object.values(LESSON_TYPES),
      default: LESSON_TYPES.VIDEO,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    videoPublicId: {
      type: String,
      default: null,
      select: false,
    },
    videoDuration: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      default: null,
    },
    pdfUrl: {
      type: String,
      default: null,
    },
    pdfPublicId: {
      type: String,
      default: null,
      select: false,
    },
    audioUrl: {
      type: String,
      default: null,
    },
    audioPublicId: {
      type: String,
      default: null,
      select: false,
    },
    externalUrl: {
      type: String,
      default: null,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      default: null,
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      default: null,
    },
    resources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, default: "file" },
        size: Number,
      },
    ],
    viewCount: {
      type: Number,
      default: 0,
    },
    minProgressPercent: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

lessonSchema.index({ moduleId: 1, order: 1 });
lessonSchema.index({ courseId: 1, order: 1 });
lessonSchema.index({ courseId: 1, moduleId: 1, order: 1 });

export default mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema);
