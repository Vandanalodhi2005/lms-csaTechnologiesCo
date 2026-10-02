import mongoose from "mongoose";
import { SUBMISSION_STATUS } from "@/constants";

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: Object.values(SUBMISSION_STATUS),
      default: SUBMISSION_STATUS.SUBMITTED,
      index: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: null,
    },
    files: [
      {
        title: String,
        url: String,
        publicId: String,
        type: String,
        size: Number,
        name: String,
      },
    ],
    gradedAt: {
      type: Date,
      default: null,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    obtainedMarks: {
      type: Number,
      default: null,
    },
    maxMarks: {
      type: Number,
      default: null,
    },
    percentage: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: null,
    },
    rubricScores: [
      {
        rubricItem: String,
        maxMarks: Number,
        obtainedMarks: Number,
        feedback: String,
      },
    ],
    plagarismScore: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ assignmentId: 1, studentId: 1, attemptNumber: 1 }, { unique: true });
submissionSchema.index({ assignmentId: 1, status: 1, createdAt: -1 });
submissionSchema.index({ studentId: 1, courseId: 1, submittedAt: -1 });

export default mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
