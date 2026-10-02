import dbConnect from "@/lib/db";
import { User } from "@/models";
import { hashPassword, verifyPassword } from "@/lib/password";
import { setAuthCookie, clearAuthCookie, verifyToken } from "@/lib/auth";
import { generateVerificationCode } from "@/utils";
import { ROLES } from "@/constants";

export async function registerUser(userData) {
  await dbConnect();
  const { name, email, password, role } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("A user with this email already exists");
  }
  const passwordHash = await hashPassword(password);
  const emailVerificationToken = generateVerificationCode();
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: role || ROLES.STUDENT,
    emailVerificationToken,
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  return user.toObject();
}

export async function loginUser({ email, password }) {
  await dbConnect();
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new Error("Invalid email or password");
  }
  if (!user.isActive) {
    throw new Error("Your account has been deactivated");
  }
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password");
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
  return payload;
}

export async function logoutUser() {
  clearAuthCookie();
  return true;
}

export async function verifyUserEmail(token) {
  await dbConnect();
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  });
  if (!user) {
    throw new Error("Invalid or expired verification token");
  }
  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();
  return user.toObject();
}

export async function sendPasswordResetEmail(email) {
  await dbConnect();
  const user = await User.findOne({ email });
  if (!user) {
    return { success: true, message: "If a user with this email exists, a reset link has been sent" };
  }
  const token = generateVerificationCode();
  user.passwordResetToken = token;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();
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
