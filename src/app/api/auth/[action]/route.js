import { apiResponse, apiError, handleApiError, validateRequest, apiUnauthorized } from "@/lib/response";
import { authService } from "@/services";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, resendVerificationEmailSchema, updateProfileSchema, changePasswordSchema } from "@/validations/auth.validation";
import { getAuthUser, requireAuth, clearAuthCookie } from "@/lib/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req, { params }) {
  try {
    const action = params?.action;
    const body = await req.json().catch(() => ({}));

    if (action === "register") {
      const data = await validateRequest(registerSchema, body);
      const result = await authService.register(data);
      const message = result.verificationEmailSent
        ? "Account created. Check your email for a verification link before logging in."
        : "Account created, but we could not send the verification email. Use the resend option to try again.";
      return apiResponse(
        { ...result.payload, verificationEmailSent: result.verificationEmailSent },
        message
      );
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

    if (action === "resend-verification") {
      const data = await validateRequest(resendVerificationEmailSchema, body);
      const result = await authService.resendVerificationEmail(data.email);
      return apiResponse(result, result.message);
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

    if (action === "avatar") {
      const formData = await req.formData();
      const file = formData.get("avatar");
      if (!file || typeof file.arrayBuffer !== "function") {
        return apiError("Profile photo is required", 400);
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size < 1 || file.size > 5 * 1024 * 1024) {
        return apiError("Choose a JPG, PNG, or WEBP image under 5 MB", 400);
      }

      await dbConnect();
      const uploaded = await uploadImage(Buffer.from(await file.arrayBuffer()), "lms/avatars");
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { avatar: uploaded.secure_url, avatarPublicId: uploaded.public_id },
        { new: true, runValidators: true }
      ).select("avatar");
      if (!updatedUser) return apiError("User not found", 404);
      return apiResponse({ avatar: updatedUser.avatar }, "Profile photo updated");
    }

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
