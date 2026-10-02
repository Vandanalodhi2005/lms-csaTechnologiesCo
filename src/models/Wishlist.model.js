import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
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
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
wishlistSchema.index({ studentId: 1, createdAt: -1 });

export default mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
