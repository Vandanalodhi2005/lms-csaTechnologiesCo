import mongoose from "mongoose";
import { QUESTION_TYPES } from "@/constants";

const quizSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
      maxlength: [200, "Title must be less than 200 characters"],
    },
    description: {
      type: String,
      default: null,
    },
    instructions: {
      type: String,
      default: null,
    },
    timeLimit: {
      type: Number,
      default: 0,
      min: 0,
    },
    passingPercentage: {
      type: Number,
      default: 60,
      min: 0,
      max: 100,
    },
    attemptsAllowed: {
      type: Number,
      default: 3,
      min: 0,
    },
    randomizeQuestions: {
      type: Boolean,
      default: false,
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true,
    },
    shuffleOptions: {
      type: Boolean,
      default: false,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFinal: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

quizSchema.index({ courseId: 1, isPublished: 1 });

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(QUESTION_TYPES),
      default: QUESTION_TYPES.MULTIPLE_CHOICE,
    },
    question: {
      type: String,
      required: [true, "Question text is required"],
    },
    image: {
      type: String,
      default: null,
    },
    options: [
      {
        text: { type: String, required: true },
        image: String,
      },
    ],
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Correct answer is required"],
      select: false,
    },
    marks: {
      type: Number,
      default: 1,
      min: 0,
    },
    negativeMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
    explanation: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ quizId: 1, order: 1 });

export const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
export const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);
export default Quiz;
