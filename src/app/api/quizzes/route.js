import { apiResponse, apiCreated, apiError, handleApiError, validateRequest, apiForbidden, apiUnauthorized } from "@/lib/response";
import { requireAuth, getAuthUser } from "@/lib/auth";
import { quizService, assignmentService } from "@/services";
import {
  createQuizSchema,
  updateQuizSchema,
  createQuestionSchema,
  updateQuestionSchema,
  submitQuizSchema,
  createAssignmentSchema,
  updateAssignmentSchema,
  submitAssignmentSchema,
  gradeAssignmentSchema,
} from "@/validations/quiz.validation";
import { ROLES } from "@/constants";

export async function GET(req) {
  try {
    const user = await getAuthUser();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const quizId = searchParams.get("quizId");
    const assignmentId = searchParams.get("assignmentId");
    const courseId = searchParams.get("courseId");
    const page = parseInt(searchParams.get("page") || 1);
    const limit = parseInt(searchParams.get("limit") || 10);

    if (action === "quiz" && quizId) {
      const includeAnswers =
        user &&
        (user.role === ROLES.ADMIN ||
          user.role === ROLES.SUPER_ADMIN ||
          (await (async () => {
            const q = await (await import("@/models")).Quiz.findById(quizId);
            return q && String(q.courseId);
          })()));
      const quiz = await quizService.getById(quizId, !!includeAnswers);
      return apiResponse(quiz);
    }

    if (action === "courseQuizzes" && courseId) {
      if (!user) return apiUnauthorized();
      const includeUnpublished =
        user.role === ROLES.ADMIN ||
        user.role === ROLES.SUPER_ADMIN;
      const quizzes = await quizService.getCourseQuizzes(courseId, includeUnpublished);
      return apiResponse(quizzes);
    }

    if (action === "studentQuizzes") {
      if (!user) return apiUnauthorized();
      const result = await quizService.getStudentQuizzes(user.id, { page, limit });
      return apiResponse(result);
    }

    if (action === "quizAttempts" && quizId) {
      if (!user) return apiUnauthorized();
      const result = await quizService.getStudentAttempts(user.id, quizId);
      return apiResponse(result);
    }

    if (action === "quizAttempt") {
      if (!user) return apiUnauthorized();
      const attemptId = searchParams.get("attemptId");
      const result = await quizService.getAttempt(attemptId, user.id);
      return apiResponse(result);
    }

    if (action === "assignment" && assignmentId) {
      const result = await assignmentService.getById(assignmentId);
      return apiResponse(result);
    }

    if (action === "courseAssignments" && courseId) {
      if (!user) return apiUnauthorized();
      const includeUnpublished =
        user.role === ROLES.ADMIN ||
        user.role === ROLES.SUPER_ADMIN ||
        user.role === ROLES.INSTRUCTOR;
      const result = await assignmentService.getCourseAssignments(courseId, includeUnpublished);
      return apiResponse(result);
    }

    if (action === "instructorAssignments") {
      if (!user) return apiUnauthorized();
      const result = await assignmentService.getInstructorAssignments(user.id, { page, limit });
      return apiResponse(result);
    }

    if (action === "studentAssignments") {
      if (!user) return apiUnauthorized();
      const result = await assignmentService.getStudentAssignments(user.id, { page, limit });
      return apiResponse(result);
    }

    if (action === "studentSubmissions") {
      if (!user) return apiUnauthorized();
      const result = await assignmentService.getStudentSubmissions(user.id, { page, limit });
      return apiResponse(result);
    }

    if (action === "studentSubmission" && assignmentId) {
      if (!user) return apiUnauthorized();
      const result = await assignmentService.getStudentSubmission(user.id, assignmentId);
      return apiResponse(result);
    }

    if (action === "assignmentSubmissions" && assignmentId) {
      if (!user) return apiUnauthorized();
      const status = searchParams.get("status");
      const search = searchParams.get("search");
      const result = await assignmentService.getSubmissions(assignmentId, user, { page, limit, status, search });
      return apiResponse(result);
    }

    return apiError("Invalid action", 400);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const body = await req.json().catch(() => ({}));

    if (action === "createQuiz") {
      const data = await validateRequest(createQuizSchema, body);
      const quiz = await quizService.create(user, data);
      return apiCreated(quiz, "Quiz created");
    }

    if (action === "addQuestion") {
      const data = await validateRequest(createQuestionSchema, body);
      const question = await quizService.addQuestion(user, data);
      return apiCreated(question, "Question added");
    }

    if (action === "startQuiz") {
      const attempt = await quizService.startAttempt(user.id, body);
      return apiCreated(attempt);
    }

    if (action === "submitQuiz") {
      const data = await validateRequest(submitQuizSchema, body);
      const result = await quizService.submitAttempt(user.id, data);
      return apiResponse(result, "Quiz submitted");
    }

    if (action === "createAssignment") {
      const data = await validateRequest(createAssignmentSchema, body);
      const assignment = await assignmentService.create(user, data);
      return apiCreated(assignment, "Assignment created");
    }

    if (action === "submitAssignment") {
      const data = await validateRequest(submitAssignmentSchema, body);
      const submission = await assignmentService.submit(user.id, data);
      return apiCreated(submission, "Assignment submitted");
    }

    if (action === "gradeAssignment") {
      const data = await validateRequest(gradeAssignmentSchema, body);
      const result = await assignmentService.grade(user, data);
      return apiResponse(result, "Assignment graded");
    }

    return apiError("Invalid action", 400);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const quizId = searchParams.get("quizId");
    const questionId = searchParams.get("questionId");
    const assignmentId = searchParams.get("assignmentId");
    const body = await req.json().catch(() => ({}));

    if (action === "updateQuiz" && quizId) {
      const data = await validateRequest(updateQuizSchema.partial(), body);
      const result = await quizService.update(user, quizId, data);
      return apiResponse(result, "Quiz updated");
    }

    if (action === "updateQuestion" && questionId) {
      const data = await validateRequest(updateQuestionSchema.partial(), body);
      const result = await quizService.updateQuestion(user, questionId, data);
      return apiResponse(result, "Question updated");
    }

    if (action === "updateAssignment" && assignmentId) {
      const data = await validateRequest(updateAssignmentSchema.partial(), body);
      const result = await assignmentService.update(user, assignmentId, data);
      return apiResponse(result, "Assignment updated");
    }

    return apiError("Invalid action", 400);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const quizId = searchParams.get("quizId");
    const questionId = searchParams.get("questionId");
    const assignmentId = searchParams.get("assignmentId");

    if (action === "deleteQuiz" && quizId) {
      await quizService.delete(user, quizId);
      return apiResponse(null, "Quiz deleted");
    }

    if (action === "deleteQuestion" && questionId) {
      await quizService.deleteQuestion(user, questionId);
      return apiResponse(null, "Question deleted");
    }

    if (action === "deleteAssignment" && assignmentId) {
      await assignmentService.delete(user, assignmentId);
      return apiResponse(null, "Assignment deleted");
    }

    return apiError("Invalid action", 400);
  } catch (error) {
    return handleApiError(error);
  }
}
