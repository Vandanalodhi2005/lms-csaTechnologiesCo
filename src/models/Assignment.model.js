import mongoose from "mongoose";
import { ALLOWED_FILE_TYPES } from "@/constants";

const assignmentSchema = new mongoose.Schema(
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
      default: null,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      default: null,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
      maxlength: [200, "Title must be less than 200 characters"],
    },
    instructions: {
      type: String,
      required: [true, "Instructions are required"],
    },
    maxMarks: {
      type: Number,
      required: true,
      min: 1,
      default: 100,
    },
    deadline: {
      type: Date,
      default: null,
    },
    allowedFileTypes: {
      type: [String],
      default: ALLOWED_FILE_TYPES.ASSIGNMENT,
    },
    maxFileSize: {
      type: Number,
      default: 50 * 1024 * 1024,
    },
    maxFileCount: {
      type: Number,
      default: 5,
    },
    allowLateSubmission: {
      type: Boolean,
      default: false,
    },
    lateSubmissionPenalty: {
      type: Number,
      default: 0,
    },
    allowResubmission: {
      type: Boolean,
      default: false,
    },
    maxAttempts: {
      type: Number,
      default: 1,
    },
    attachments: [
      {
        title: String,
        url: String,
        type: String,
        size: Number,
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    gradedSubmissions: {
      type: Number,
      default: 0,
    },
    averageGrade: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

assignmentSchema.index({ courseId: 1, isPublished: 1, deadline: 1 });
assignmentSchema.index({ instructorId: 1, createdAt: -1 });

export default mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
