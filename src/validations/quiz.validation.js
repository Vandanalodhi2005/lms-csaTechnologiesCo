import { z } from "zod";
import { QUESTION_TYPES } from "@/constants";

export const createQuizSchema = z.object({
  courseId: z.string({ required_error: "Course ID is required" }).trim(),
  moduleId: z.string().trim().optional(),
  lessonId: z.string().trim().optional(),
  title: z
    .string({ required_error: "Quiz title is required" })
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  description: z.string().nullable().optional(),
  instructions: z.string().nullable().optional(),
  timeLimit: z.number().int().min(0).default(0),
  passingPercentage: z.number().min(0).max(100).default(60),
  attemptsAllowed: z.number().int().min(0).default(3),
  randomizeQuestions: z.boolean().default(false),
  showCorrectAnswers: z.boolean().default(true),
  shuffleOptions: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  isFinal: z.boolean().default(false),
});

export const updateQuizSchema = createQuizSchema.partial();

export const createQuestionSchema = z.object({
  quizId: z.string({ required_error: "Quiz ID is required" }).trim(),
  type: z
    .enum(Object.values(QUESTION_TYPES), { required_error: "Question type is required" })
    .default(QUESTION_TYPES.MULTIPLE_CHOICE),
  question: z.string({ required_error: "Question text is required" }).min(2),
  image: z.string().nullable().optional(),
  options: z
    .array(
      z.object({
        text: z.string({ required_error: "Option text is required" }).min(1),
        image: z.string().nullable().optional(),
      })
    )
    .min(2, "At least 2 options are required"),
  correctAnswer: z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))], {
    required_error: "Correct answer is required",
  }),
  marks: z.number().int().min(0).default(1),
  negativeMarks: z.number().min(0).default(0),
  explanation: z.string().nullable().optional(),
  order: z.number().int().min(0).default(0),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

export const updateQuestionSchema = createQuestionSchema.partial();

export const submitQuizSchema = z.object({
  quizId: z.string({ required_error: "Quiz ID is required" }).trim(),
  attemptNumber: z.number().int().min(1).default(1),
  answers: z
    .array(
      z.object({
        questionId: z.string({ required_error: "Question ID is required" }).trim(),
        selectedAnswer: z.union([z.string(), z.number(), z.null(), z.array(z.union([z.string(), z.number()]))]).optional(),
        timeSpent: z.number().int().min(0).optional(),
      })
    )
    .default([]),
  timeSpentSeconds: z.number().int().min(0).default(0),
});

export const createAssignmentSchema = z.object({
  courseId: z.string({ required_error: "Course ID is required" }).trim(),
  moduleId: z.string().trim().optional(),
  lessonId: z.string().trim().optional(),
  title: z
    .string({ required_error: "Assignment title is required" })
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  instructions: z.string({ required_error: "Instructions are required" }).min(10),
  maxMarks: z.number().int().min(1, "Max marks must be at least 1").default(100),
  deadline: z.coerce.date().nullable().optional(),
  allowedFileTypes: z.array(z.string()).default(["application/pdf", "application/zip", "image/jpeg", "image/png"]),
  maxFileSize: z.number().int().min(0).default(50 * 1024 * 1024),
  maxFileCount: z.number().int().min(1).default(5),
  allowLateSubmission: z.boolean().default(false),
  lateSubmissionPenalty: z.number().min(0).max(100).default(0),
  allowResubmission: z.boolean().default(false),
  maxAttempts: z.number().int().min(1).default(1),
  attachments: z
    .array(
      z.object({
        title: z.string().min(1),
        url: z.string().min(1),
        type: z.string().default("file"),
        size: z.number().optional(),
      })
    )
    .default([]),
  isPublished: z.boolean().default(false),
});

export const updateAssignmentSchema = createAssignmentSchema.partial();

export const submitAssignmentSchema = z.object({
  assignmentId: z.string({ required_error: "Assignment ID is required" }).trim(),
  content: z.string().nullable().optional(),
  files: z
    .array(
      z.object({
        title: z.string().min(1),
        url: z.string().min(1),
        type: z.string().default("file"),
        size: z.number().optional(),
        name: z.string().optional(),
      })
    )
    .default([]),
});

export const gradeAssignmentSchema = z.object({
  submissionId: z.string({ required_error: "Submission ID is required" }).trim(),
  obtainedMarks: z
    .number({ required_error: "Obtained marks are required" })
    .min(0, "Marks cannot be negative"),
  feedback: z.string().nullable().optional(),
  rubricScores: z
    .array(
      z.object({
        rubricItem: z.string().min(1),
        maxMarks: z.number().min(0),
        obtainedMarks: z.number().min(0),
        feedback: z.string().optional(),
      })
    )
    .default([]),
});
