import mongoose from "mongoose";
import { ROLES } from "@/constants";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be less than 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.STUDENT,
      index: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    avatarPublicId: {
      type: String,
      default: null,
      select: false,
    },
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    bio: {
      type: String,
      default: null,
      maxlength: [1000, "Bio must be less than 1000 characters"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
      select: false,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    instructorApproved: {
      type: Boolean,
      default: false,
    },
    socialLinks: {
      website: String,
      twitter: String,
      linkedin: String,
      youtube: String,
      github: String,
    },
    stats: {
      coursesCreated: { type: Number, default: 0 },
      coursesEnrolled: { type: Number, default: 0 },
      certificates: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.passwordHash;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.avatarPublicId;
        return ret;
      },
    },
  }
);

userSchema.virtual("isInstructorApproved").get(function () {
  return this.role === ROLES.INSTRUCTOR && this.instructorApproved;
});

export default mongoose.models.User || mongoose.model("User", userSchema);
