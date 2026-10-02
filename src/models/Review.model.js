import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      default: null,
      maxlength: [200, "Title must be less than 200 characters"],
    },
    comment: {
      type: String,
      default: null,
      maxlength: [2000, "Comment must be less than 2000 characters"],
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    notHelpfulCount: {
      type: Number,
      default: 0,
    },
    helpfulBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        helpful: Boolean,
      },
    ],
    instructorResponse: {
      type: String,
      default: null,
    },
    instructorRespondedAt: {
      type: Date,
      default: null,
    },
    reportedCount: {
      type: Number,
      default: 0,
    },
    reports: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ courseId: 1, studentId: 1 }, { unique: true });
reviewSchema.index({ courseId: 1, isApproved: 1, rating: -1, createdAt: -1 });
reviewSchema.index({ studentId: 1, createdAt: -1 });

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
