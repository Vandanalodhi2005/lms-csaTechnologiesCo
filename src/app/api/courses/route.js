import { apiResponse, apiCreated, apiError, handleApiError, validateRequest, apiForbidden, apiNotFound, apiUnauthorized } from "@/lib/response";
import { getAuthUser, requireAuth } from "@/lib/auth";
import { courseService, contentService, paymentService } from "@/services";
import { createCourseSchema, updateCourseSchema, searchCoursesSchema, submitForReviewSchema, courseStatusSchema, createCategorySchema, updateCategorySchema } from "@/validations/course.validation";
import { createModuleSchema, updateModuleSchema, reorderModulesSchema, createLessonSchema, updateLessonSchema, reorderLessonsSchema } from "@/validations/content.validation";
import { ROLES, COURSE_STATUS } from "@/constants";
import { canEditCourse } from "@/lib/permissions";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const courseId = searchParams.get("id");
    const slug = searchParams.get("slug");
    const userId = (await getAuthUser()) || null;

    if (action === "categories") {
      const categories = await courseService.getAllCategories();
      return apiResponse(categories);
    }

    if (action === "category" && slug) {
      const category = await courseService.getCategoryBySlug(slug);
      return apiResponse(category);
    }

    if (action === "getById" && courseId) {
      const course = await courseService.getCourseById(courseId, userId);
      return apiResponse(course);
    }

    if (action === "curriculum" && courseId) {
      const includeUnpublished = userId && (
        userId.role === ROLES.ADMIN ||
        userId.role === ROLES.SUPER_ADMIN ||
        String(course.instructorId) === String(userId.id)
      );
      const curriculum = await contentService.getCourseCurriculum(courseId, includeUnpublished);
      return apiResponse(curriculum);
    }

    if (action === "instructorCourses") {
      if (!userId) return apiUnauthorized();
      const page = parseInt(searchParams.get("page") || 1);
      const limit = parseInt(searchParams.get("limit") || 10);
      const status = searchParams.get("status");
      const result = await courseService.getInstructorCourses(userId.id, { page, limit, status });
      return apiResponse(result);
    }

    if (action === "related" && courseId) {
      const limit = parseInt(searchParams.get("limit") || 4);
      const courses = await courseService.getRelated(courseId, limit);
      return apiResponse(courses);
    }

    if (action === "featured") {
      const limit = parseInt(searchParams.get("limit") || 8);
      const courses = await courseService.getFeatured(limit);
      return apiResponse(courses);
    }

    if (action === "popular") {
      const limit = parseInt(searchParams.get("limit") || 8);
      const courses = await courseService.getPopular(limit);
      return apiResponse(courses);
    }

    if (action === "newest") {
      const limit = parseInt(searchParams.get("limit") || 8);
      const courses = await courseService.getNewest(limit);
      return apiResponse(courses);
    }

    if (slug) {
      const course = await courseService.getBySlug(slug, userId);
      return apiResponse(course);
    }

    const query = Object.fromEntries(searchParams.entries());
    const result = await courseService.list(query);
    return apiResponse(result);
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

    if (action === "createCategory") {
      if (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN) return apiForbidden();
      const data = await validateRequest(createCategorySchema, body);
      const category = await courseService.createCategory(data);
      return apiCreated(category, "Category created");
    }

    if (action === "updateStatus") {
      if (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN) return apiForbidden();
      const data = await validateRequest(courseStatusSchema, body);
      const result = await courseService.adminUpdateStatus(user, data.courseId || body.courseId, data);
      return apiResponse(result, "Course status updated");
    }

    if (action === "submitForReview") {
      const data = await validateRequest(submitForReviewSchema, body);
      const result = await courseService.submitForReview(user, data.courseId);
      return apiResponse(result, "Course submitted for review");
    }

    if (action === "createModule") {
      const data = await validateRequest(createModuleSchema, body);
      const result = await contentService.createModule(user, data);
      return apiCreated(result, "Module created");
    }

    if (action === "reorderModules") {
      const data = await validateRequest(reorderModulesSchema, body);
      const result = await contentService.reorderModules(user, data.courseId, data.modules);
      return apiResponse(result, "Modules reordered");
    }

    if (action === "createLesson") {
      const data = await validateRequest(createLessonSchema, body);
      const result = await contentService.createLesson(user, data);
      return apiCreated(result, "Lesson created");
    }

    if (action === "reorderLessons") {
      const data = await validateRequest(reorderLessonsSchema, body);
      const result = await contentService.reorderLessons(user, data.moduleId, data.lessons);
      return apiResponse(result, "Lessons reordered");
    }

    const data = await validateRequest(createCourseSchema, body);
    const course = await courseService.create(user, data);
    return apiCreated(course, "Course created");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const courseId = searchParams.get("id");
    const moduleId = searchParams.get("moduleId");
    const lessonId = searchParams.get("lessonId");
    const categoryId = searchParams.get("categoryId");
    const body = await req.json().catch(() => ({}));

    if (action === "updateCategory" && categoryId) {
      if (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN) return apiForbidden();
      const data = await validateRequest(updateCategorySchema, body);
      // Quick manual update since we have the service create fn only
      const { Category } = await import("@/models");
      await import("@/lib/db").default();
      const updated = await Category.findByIdAndUpdate(categoryId, data, { new: true, runValidators: true });
      if (!updated) return apiNotFound("Category not found");
      return apiResponse(updated.toObject(), "Category updated");
    }

    if (action === "updateModule" && moduleId) {
      const data = await validateRequest(updateModuleSchema.partial(), body);
      const result = await contentService.updateModule(user, moduleId, data);
      return apiResponse(result, "Module updated");
    }

    if (action === "updateLesson" && lessonId) {
      const data = await validateRequest(updateLessonSchema.partial(), body);
      const result = await contentService.updateLesson(user, lessonId, data);
      return apiResponse(result, "Lesson updated");
    }

    if (courseId) {
      const data = await validateRequest(updateCourseSchema, body);
      const result = await courseService.update(user, courseId, data);
      return apiResponse(result, "Course updated");
    }

    return apiError("Missing required parameters", 400);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const courseId = searchParams.get("id");
    const moduleId = searchParams.get("moduleId");
    const lessonId = searchParams.get("lessonId");
    const categoryId = searchParams.get("categoryId");

    if (action === "deleteCategory" && categoryId) {
      if (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN) return apiForbidden();
      const { Category } = await import("@/models");
      await import("@/lib/db").default();
      await Category.findByIdAndDelete(categoryId);
      return apiResponse(null, "Category deleted");
    }

    if (action === "deleteModule" && moduleId) {
      await contentService.deleteModule(user, moduleId);
      return apiResponse(null, "Module deleted");
    }

    if (action === "deleteLesson" && lessonId) {
      await contentService.deleteLesson(user, lessonId);
      return apiResponse(null, "Lesson deleted");
    }

    if (courseId) {
      await courseService.delete(user, courseId);
      return apiResponse(null, "Course deleted");
    }

    return apiError("Missing required parameters", 400);
  } catch (error) {
    return handleApiError(error);
  }
}
