import { apiResponse, apiError, handleApiError, validateRequest, apiUnauthorized } from "@/lib/response";
import { authService } from "@/services";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, updateProfileSchema, changePasswordSchema } from "@/validations/auth.validation";
import { getAuthUser, requireAuth, clearAuthCookie } from "@/lib/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export async function POST(req, { params }) {
  try {
    const action = params?.action;
    const body = await req.json().catch(() => ({}));

    if (action === "register") {
      const data = await validateRequest(registerSchema, body);
      const user = await authService.register(data);
      return apiResponse({ user: { id: user._id, email: user.email, name: user.name } }, "Registration successful. Please verify your email.");
    }

    if (action === "login") {
      const data = await validateRequest(loginSchema, body);
      const user = await authService.login(data);
      return apiResponse(user, "Login successful");
    }

    if (action === "logout") {
      await authService.logout();
      clearAuthCookie();
      return apiResponse(null, "Logged out successfully");
    }

    if (action === "forgot-password") {
      const data = await validateRequest(forgotPasswordSchema, body);
      const result = await authService.forgotPassword(data.email);
      return apiResponse(result);
    }

    if (action === "reset-password") {
      const data = await validateRequest(resetPasswordSchema, body);
      const result = await authService.resetPassword(data);
      return apiResponse(result, "Password reset successful");
    }

    if (action === "verify-email") {
      const data = await validateRequest(verifyEmailSchema, body);
      const user = await authService.verifyEmail(data.token);
      return apiResponse(user, "Email verified successfully");
    }

    return apiError("Invalid auth action", 404);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(req, { params }) {
  try {
    const action = params?.action;
    if (action === "me") {
      const user = await getAuthUser();
      if (!user) return apiUnauthorized();
      const userData = await authService.getCurrentUser(user.id);
      return apiResponse(userData);
    }
    return apiError("Invalid auth action", 404);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req) {
  try {
    const user = await requireAuth();
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const body = await req.json().catch(() => ({}));

    if (action === "profile") {
      const data = await validateRequest(updateProfileSchema, body);
      const updated = await authService.updateProfile(user.id, data);
      return apiResponse(updated, "Profile updated successfully");
    }

    if (action === "password") {
      const data = await validateRequest(changePasswordSchema, body);
      const result = await authService.changePassword(user.id, data);
      return apiResponse(result, "Password changed successfully");
    }

    return apiError("Invalid action", 400);
  } catch (error) {
    return handleApiError(error);
  }
}
