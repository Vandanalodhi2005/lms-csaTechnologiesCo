import { createHash, randomBytes } from "node:crypto";
import dbConnect from "@/lib/db";
import { User } from "@/models";
import { hashPassword, verifyPassword } from "@/lib/password";
import { assertJwtSecret, setAuthCookie, clearAuthCookie, verifyToken } from "@/lib/auth";
import { ROLES } from "@/constants";
import {
  sendFormNotificationToAdmin,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail as sendEmailPasswordReset,
} from "@/lib/email";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000;

function createVerificationToken() {
  return randomBytes(32).toString("hex");
}

function hashVerificationToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function createVerificationUrl(email, token) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = new URL("/auth/verify-email", baseUrl);
  url.searchParams.set("token", token);
  url.searchParams.set("email", email);
  return url.toString();
}

export async function registerUser(userData) {
  await dbConnect();
  const { name, email, password, role } = userData;

  // Prevent admin creation through public registration
  const safeRole =
    role === ROLES.INSTRUCTOR ? ROLES.INSTRUCTOR : ROLES.STUDENT;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("A user with this email already exists");
  }

  const passwordHash = await hashPassword(password);
  const verificationToken = createVerificationToken();
  const emailVerificationToken = hashVerificationToken(verificationToken);
  const emailVerificationSentAt = new Date();

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: safeRole,
    isEmailVerified: false,
    isActive: true,
    emailVerificationToken,
    emailVerificationExpires: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
    emailVerificationSentAt,
  });

  const payload = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  };

  const verificationEmail = await sendVerificationEmail({
    to: email,
    name,
    verificationUrl: createVerificationUrl(email, verificationToken),
  });
  if (!verificationEmail.success) {
    console.error("[Auth Service] Verification email could not be sent.");
    user.emailVerificationSentAt = null;
    await user.save();
  }

  sendFormNotificationToAdmin({
    formType: "User Registration",
    title: `New ${safeRole.toUpperCase()} Account Created: ${name}`,
    data: {
      "Account Type": safeRole.toUpperCase(),
      "Full Name": name,
      "Email Address": email,
      "Account Status": "Awaiting email verification",
      "Registration Time": new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    },
    userEmail: email,
  }).catch((err) => console.error("[Auth Service] Admin notification error:", err.message));

  return {
    payload: { ...payload, isEmailVerified: false },
    verificationEmailSent: verificationEmail.success,
  };
}

export async function loginUser({ email, password }) {
  assertJwtSecret();
  await dbConnect();
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  if (!user.isActive) {
    const error = new Error("Your account has been deactivated");
    error.statusCode = 403;
    throw error;
  }
  if (!user.isEmailVerified) {
    const error = new Error("Please verify your email address before logging in.");
    error.statusCode = 403;
    throw error;
  }
  if (!user.passwordHash) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  user.lastLoginAt = new Date();
  await user.save();
  const payload = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  };
  await setAuthCookie(payload);

  // Send security login notification to admin email
  sendFormNotificationToAdmin({
    formType: "User Login",
    title: `Login Activity: ${user.name} (${user.role})`,
    data: {
      "User Name": user.name,
      "Email Address": user.email,
      "Role": user.role,
      "Login Time": new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    },
    userEmail: user.email,
  }).catch((err) => console.error("[Auth Service] Login alert error:", err.message));

  return payload;
}

export async function logoutUser() {
  clearAuthCookie();
  return true;
}

export async function verifyUserEmail(token) {
  await dbConnect();
  const user = await User.findOne({
    emailVerificationToken: hashVerificationToken(token),
    emailVerificationExpires: { $gt: new Date() },
  });
  if (!user) {
    const error = new Error("Invalid or expired verification token");
    error.statusCode = 400;
    throw error;
  }
  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  user.emailVerificationSentAt = null;
  await user.save();
  sendWelcomeEmail({
    to: user.email,
    name: user.name,
    role: user.role,
  }).then((result) => {
    if (!result.success) {
      console.error("[Auth Service] Welcome email could not be sent.");
    }
  }).catch((error) => {
    console.error("[Auth Service] Welcome email error:", error.message);
  });
  return { id: user._id.toString(), email: user.email, name: user.name };
}

export async function resendVerificationEmail(email) {
  await dbConnect();
  const user = await User.findOne({ email }).select(
    "+emailVerificationToken +emailVerificationExpires +emailVerificationSentAt"
  );
  if (!user || user.isEmailVerified) {
    return { success: true, message: "If this account needs verification, an email will be sent shortly." };
  }

  const now = Date.now();
  if (
    user.emailVerificationSentAt &&
    now - user.emailVerificationSentAt.getTime() < VERIFICATION_RESEND_COOLDOWN_MS
  ) {
    return { success: true, message: "If this account needs verification, an email will be sent shortly." };
  }

  const verificationToken = createVerificationToken();
  user.emailVerificationToken = hashVerificationToken(verificationToken);
  user.emailVerificationExpires = new Date(now + VERIFICATION_TOKEN_TTL_MS);
  user.emailVerificationSentAt = new Date(now);
  await user.save();

  const result = await sendVerificationEmail({
    to: user.email,
    name: user.name,
    verificationUrl: createVerificationUrl(user.email, verificationToken),
  });
  if (!result.success) {
    user.emailVerificationSentAt = null;
    await user.save();
    const error = new Error("Unable to send the verification email. Please try again later.");
    error.statusCode = 503;
    throw error;
  }

  return { success: true, message: "If this account needs verification, an email will be sent shortly." };
}

export async function sendPasswordResetEmail(email) {
  await dbConnect();
  const user = await User.findOne({ email });
  if (!user) {
    return { success: true, message: "If a user with this email exists, a reset link has been sent" };
  }
  const token = randomBytes(32).toString("hex");
  user.passwordResetToken = token;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`;

  // Send real email via nodemailer
  await sendEmailPasswordReset({
    to: user.email,
    name: user.name,
    resetUrl,
    token,
  }).catch((err) => console.error("[Auth Service] Password reset email error:", err.message));

  // Also notify admin
  sendFormNotificationToAdmin({
    formType: "Password Reset Request",
    title: `Password Reset Requested by ${user.name}`,
    data: {
      "User Name": user.name,
      "Email Address": user.email,
      "Reset Token": token,
      "Time Requested": new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    },
    userEmail: user.email,
  }).catch((err) => console.error("[Auth Service] Reset notification error:", err.message));

  return {
    success: true,
    message: "If a user with this email exists, a reset link has been sent",
    token,
  };
}

export async function resetPassword({ token, password }) {
  await dbConnect();
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  });
  if (!user) {
    throw new Error("Invalid or expired password reset token");
  }
  user.passwordHash = await hashPassword(password);
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();
  return { success: true };
}

export async function getCurrentUser(userId) {
  await dbConnect();
  const user = await User.findById(userId).select("-passwordHash");
  if (!user) {
    throw new Error("User not found");
  }
  return user.toObject();
}

export async function updateUserProfile(userId, updates) {
  await dbConnect();
  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-passwordHash");
  if (!user) {
    throw new Error("User not found");
  }
  return user.toObject();
}

export async function changeUserPassword(userId, { currentPassword, newPassword }) {
  await dbConnect();
  const user = await User.findById(userId).select("+passwordHash");
  if (!user) {
    throw new Error("User not found");
  }
  const isValid = await verifyPassword(currentPassword, user.passwordHash);
  if (!isValid) {
    throw new Error("Current password is incorrect");
  }
  user.passwordHash = await hashPassword(newPassword);
  await user.save();
  return { success: true };
}

export async function getInstructorList({ page = 1, limit = 10 } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const [instructors, total] = await Promise.all([
    User.find({
      role: ROLES.INSTRUCTOR,
      isActive: true,
      instructorApproved: true,
    })
      .select("name avatar bio socialLinks stats")
      .sort({ "stats.coursesCreated": -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments({ role: ROLES.INSTRUCTOR, isActive: true, instructorApproved: true }),
  ]);
  return { instructors, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getInstructorBySlug(id) {
  await dbConnect();
  const instructor = await User.findById(id)
    .select("name avatar bio phone socialLinks stats createdAt instructorApproved isActive role")
    .lean();
  if (!instructor || instructor.role !== ROLES.INSTRUCTOR || !instructor.isActive) {
    throw new Error("Instructor not found");
  }
  return instructor;
}

export async function adminGetAllUsers({ page = 1, limit = 10, role, search, isActive } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const query = {};
  if (role) query.role = role;
  if (typeof isActive !== "undefined") query.isActive = isActive;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  const [users, total] = await Promise.all([
    User.find(query)
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);
  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function adminUpdateUser(userId, updates) {
  await dbConnect();
  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-passwordHash");
  if (!user) throw new Error("User not found");
  return user.toObject();
}
