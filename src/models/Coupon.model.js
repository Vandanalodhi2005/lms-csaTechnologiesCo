import mongoose from "mongoose";
import { COUPON_TYPES } from "@/constants";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
      maxlength: [30, "Coupon code must be less than 30 characters"],
    },
    type: {
      type: String,
      enum: Object.values(COUPON_TYPES),
      default: COUPON_TYPES.PERCENTAGE,
      required: true,
    },
    value: {
      type: Number,
      required: [true, "Discount value is required"],
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    usageLimit: {
      type: Number,
      default: null,
      min: 0,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    perUserLimit: {
      type: Number,
      default: 1,
      min: 1,
    },
    usedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      default: null,
    },
    applicableCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    applicableInstructors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    excludeCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

couponSchema.virtual("isExpired").get(function () {
  return this.validUntil && new Date() > this.validUntil;
});

couponSchema.virtual("isDepleted").get(function () {
  return this.usageLimit && this.usageCount >= this.usageLimit;
});

couponSchema.virtual("isValid").get(function () {
  return this.isActive && !this.isExpired && !this.isDepleted;
});

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
