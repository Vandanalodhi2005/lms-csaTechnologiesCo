import { apiResponse, apiCreated, apiError, handleApiError, validateRequest, apiForbidden, apiNotFound } from "@/lib/response";
import { getAuthUser, requireAuth } from "@/lib/auth";
import { authService, paymentService, enrollmentService } from "@/services";
import { ROLES } from "@/constants";
import { paginate } from "@/utils";
import { createReviewSchema, applyCouponSchema } from "@/validations/payment.validation";
import { updateProgressSchema } from "@/validations/payment.validation";

export async function GET(req) {
  try {
    const user = await getAuthUser();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const page = parseInt(searchParams.get("page") || 1);
    const limit = parseInt(searchParams.get("limit") || 10);

    if (action === "instructors") {
      const result = await authService.getInstructors({ page, limit });
      return apiResponse(result);
    }

    if (action === "instructorById") {
      const id = searchParams.get("id");
      const instructor = await authService.getInstructor(id);
      return apiResponse(instructor);
    }

    if (action === "users") {
      if (!user || (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN)) return apiForbidden();
      const role = searchParams.get("role");
      const search = searchParams.get("search");
      const isActive = searchParams.get("isActive");
      const result = await authService.adminGetAllUsers({
        page,
        limit,
        role,
        search,
        isActive: isActive != null ? isActive === "true" : undefined,
      });
      return apiResponse(result);
    }

    if (action === "wishlist") {
      if (!user) return apiResponse({ wishlist: [], total: 0 });
      const result = await paymentService.getWishlist(user.id, { page, limit });
      return apiResponse(result);
    }

    if (action === "isInWishlist") {
      const courseId = searchParams.get("courseId");
      if (!user) return apiResponse(false);
      const inWishlist = await paymentService.isInWishlist(user.id, courseId);
      return apiResponse(inWishlist);
    }

    if (action === "reviews") {
      const courseId = searchParams.get("courseId");
      const rating = searchParams.get("rating");
      const result = await paymentService.getCourseReviews(courseId, { page, limit, rating });
      return apiResponse(result);
    }

    if (action === "enrollments") {
      if (!user) return apiForbidden();
      const courseId = searchParams.get("courseId");
      if (courseId) {
        if (user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN) {
          const search = searchParams.get("search");
          const result = await enrollmentService.getCourseStudents(courseId, { page, limit, search });
          return apiResponse(result);
        }
        const enrollment = await enrollmentService.get(user.id, courseId);
        return apiResponse(enrollment);
      }
      if (user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN) {
        const result = await enrollmentService.adminGetAll({ page, limit });
        return apiResponse(result);
      }
      const isCompleted = searchParams.get("isCompleted");
      const result = await enrollmentService.getStudentEnrollments(user.id, {
        page,
        limit,
        isCompleted: isCompleted != null ? isCompleted === "true" : undefined,
      });
      return apiResponse(result);
    }

    if (action === "progress") {
      if (!user) return apiForbidden();
      const courseId = searchParams.get("courseId");
      const result = await enrollmentService.getProgress(user.id, courseId);
      return apiResponse(result);
    }

    if (action === "orders") {
      if (!user) return apiForbidden();
      if (user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN) {
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        const result = await paymentService.adminGetAllOrders({ page, limit, status, search });
        return apiResponse(result);
      }
      const result = await paymentService.getStudentOrders(user.id, { page, limit });
      return apiResponse(result);
    }

    if (action === "coupons") {
      if (!user || (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN)) return apiForbidden();
      const isActive = searchParams.get("isActive");
      const result = await paymentService.getAllCoupons(user, {
        page,
        limit,
        isActive: isActive != null ? isActive === "true" : undefined,
      });
      return apiResponse(result);
    }

    if (action === "analytics") {
      if (!user || (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN)) return apiForbidden();
      const result = await paymentService.getPlatformAnalytics();
      return apiResponse(result);
    }

    if (action === "verifyCertificate") {
      const code = searchParams.get("code");
      const result = await enrollmentService.verifyCertificate(code);
      return apiResponse(result);
    }

    if (action === "certificates") {
      if (!user) return apiForbidden();
      const result = await enrollmentService.getStudentCertificates(user.id, { page, limit });
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

    if (action === "toggleWishlist") {
      const { courseId } = body;
      const isIn = await paymentService.isInWishlist(user.id, courseId);
      if (isIn) {
        await paymentService.removeFromWishlist(user.id, courseId);
        return apiResponse({ added: false, wishlisted: false }, "Removed from wishlist");
      } else {
        const res = await paymentService.addToWishlist(user.id, courseId);
        return apiResponse({ added: true, wishlisted: true }, "Added to wishlist");
      }
    }

    if (action === "review") {
      const data = await validateRequest(createReviewSchema, body);
      const review = await paymentService.createReview(user.id, data);
      return apiCreated(review, data._id ? "Review updated" : "Review submitted");
    }

    if (action === "createOrder") {
      const { createOrderSchema } = await import("@/validations/payment.validation");
      const { createOrderSchema: _ } = {};
      const order = await paymentService.createOrder(user.id, body);
      return apiCreated(order, "Order created");
    }

    if (action === "verifyPayment") {
      const { verifyPaymentSchema } = await import("@/validations/payment.validation");
      const result = await paymentService.verifyPayment(user.id, body);
      return apiResponse(result, "Payment verified");
    }

    if (action === "applyCoupon") {
      const data = await validateRequest(applyCouponSchema, body);
      const course = await import("@/models").then((m) => m.Course);
      const db = await import("@/lib/db");
      await db.default();
      const courseDoc = await course.findById(data.courseId);
      if (!courseDoc) return apiNotFound("Course not found");
      const coupon = await paymentService.validateCoupon(data.code, data.courseId, user.id);
      const originalAmount = courseDoc.discountPrice != null ? courseDoc.discountPrice : courseDoc.price;
      const discount = await paymentService.calculateDiscount(coupon, originalAmount);
      return apiResponse({
        coupon: { id: coupon._id, code: coupon.code, type: coupon.type, value: coupon.value },
        originalAmount,
        discountAmount: discount,
        finalAmount: Math.max(0, originalAmount - discount),
      }, "Coupon applied");
    }

    if (action === "createCoupon") {
      if (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN) return apiForbidden();
      const { createCouponSchema } = await import("@/validations/payment.validation");
      const data = await validateRequest(createCouponSchema, body);
      const coupon = await paymentService.createCoupon(user, data);
      return apiCreated(coupon, "Coupon created");
    }

    if (action === "progress") {
      const data = await validateRequest(updateProgressSchema, body);
      const result = await enrollmentService.updateProgress(user.id, data);
      return apiResponse(result, "Progress updated");
    }

    if (action === "refund") {
      if (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN) return apiForbidden();
      const { refundOrderSchema } = await import("@/validations/payment.validation");
      const result = await paymentService.refundOrder(user, body);
      return apiResponse(result, "Refund processed");
    }

    if (action === "updateUser") {
      if (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN) return apiForbidden();
      const userId = body.userId;
      const updates = { ...body };
      delete updates.userId;
      const result = await authService.adminUpdateUser(userId, updates);
      return apiResponse(result, "User updated");
    }

    return apiError("Invalid action", 400);
  } catch (error) {
    return handleApiError(error);
  }
}
