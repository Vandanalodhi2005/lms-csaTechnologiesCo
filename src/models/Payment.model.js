import mongoose from "mongoose";
import { PAYMENT_STATUS, PAYMENT_METHODS } from "@/constants";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    orderNumber: {
      type: String,
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
    },
    method: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    gatewayOrderId: {
      type: String,
      index: true,
    },
    gatewayPaymentId: {
      type: String,
      index: true,
    },
    gatewayRefundId: {
      type: String,
      default: null,
    },
    gatewaySignature: {
      type: String,
      default: null,
    },
    gateway: {
      type: String,
      default: null,
    },
    bank: {
      type: String,
      default: null,
    },
    wallet: {
      type: String,
      default: null,
    },
    methodType: {
      type: String,
      default: null,
    },
    transactionFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: null,
    },
    failureReason: {
      type: String,
      default: null,
    },
    failureCode: {
      type: String,
      default: null,
    },
    failureStep: {
      type: String,
      default: null,
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundReason: {
      type: String,
      default: null,
    },
    webhookVerified: {
      type: Boolean,
      default: false,
    },
    webhookReceivedAt: {
      type: Date,
      default: null,
    },
    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
      select: false,
    },
    idempotencyKey: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ studentId: 1, status: 1, createdAt: -1 });
paymentSchema.index({ gatewayPaymentId: 1 }, { sparse: true });
paymentSchema.index({ gatewayOrderId: 1 }, { sparse: true });

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
