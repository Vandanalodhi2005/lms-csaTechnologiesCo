import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
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
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      unique: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
      default: Date.now,
    },
    certificateUrl: {
      type: String,
      default: null,
    },
    certificatePublicId: {
      type: String,
      default: null,
      select: false,
    },
    grade: {
      type: String,
      default: null,
    },
    percentage: {
      type: Number,
      default: null,
    },
    progress: {
      type: Number,
      default: 100,
    },
    template: {
      type: String,
      default: "default",
    },
    customizations: {
      backgroundColor: String,
      textColor: String,
      accentColor: String,
      logo: String,
      signature: String,
      signatureName: String,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    revokedReason: {
      type: String,
      default: null,
    },
    sharedCount: {
      type: Number,
      default: 0,
    },
    verifiedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
certificateSchema.index({ studentId: 1, issueDate: -1 });

export default mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);
