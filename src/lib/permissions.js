import { ROLES, NOTIFICATION_TYPES, COURSE_STATUS } from "@/constants";

export const PERMISSIONS = Object.freeze({
  COURSE: {
    CREATE: "course:create",
    READ: "course:read",
    UPDATE: "course:update",
    DELETE: "course:delete",
    PUBLISH: "course:publish",
    APPROVE: "course:approve",
  },
  USER: {
    CREATE: "user:create",
    READ: "user:read",
    UPDATE: "user:update",
    DELETE: "user:delete",
  },
  ENROLLMENT: {
    CREATE: "enrollment:create",
    READ: "enrollment:read",
    MANAGE: "enrollment:manage",
  },
  PAYMENT: {
    READ: "payment:read",
    MANAGE: "payment:manage",
    REFUND: "payment:refund",
  },
  CONTENT: {
    CREATE: "content:create",
    UPDATE: "content:update",
    DELETE: "content:delete",
  },
  ANALYTICS: {
    READ: "analytics:read",
    PLATFORM: "analytics:platform",
  },
  REVIEW: {
    CREATE: "review:create",
    MANAGE: "review:manage",
  },
});

const rolePermissions = {
  [ROLES.STUDENT]: [
    PERMISSIONS.COURSE.READ,
    PERMISSIONS.ENROLLMENT.CREATE,
    PERMISSIONS.REVIEW.CREATE,
  ],
  [ROLES.INSTRUCTOR]: [
    PERMISSIONS.COURSE.CREATE,
    PERMISSIONS.COURSE.READ,
    PERMISSIONS.COURSE.UPDATE,
    PERMISSIONS.COURSE.DELETE,
    PERMISSIONS.CONTENT.CREATE,
    PERMISSIONS.CONTENT.UPDATE,
    PERMISSIONS.CONTENT.DELETE,
    PERMISSIONS.ENROLLMENT.READ,
    PERMISSIONS.ANALYTICS.READ,
  ],
  [ROLES.ADMIN]: Object.values(PERMISSIONS).flatMap((obj) => Object.values(obj)),
};

export function hasPermission(role, permission) {
  const perms = rolePermissions[role] || [];
  return perms.includes(permission);
}

export function getRolePermissions(role) {
  return rolePermissions[role] || [];
}

export function isStudent(role) {
  return role === ROLES.STUDENT;
}

export function isInstructor(role) {
  return role === ROLES.INSTRUCTOR;
}

export function isAdmin(role) {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}

export function canEditCourse(user, course) {
  if (isAdmin(user?.role)) return true;
  if (isInstructor(user?.role) && course?.instructorId?.toString() === user?.id?.toString())
    return true;
  return false;
}

export function canViewCourse(user, course) {
  if (course?.status === COURSE_STATUS.PUBLISHED) return true;
  if (!user) return false;
  if (isAdmin(user.role)) return true;
  if (isInstructor(user.role) && course?.instructorId?.toString() === user?.id?.toString())
    return true;
  return false;
}

export const notificationPermissions = {
  [NOTIFICATION_TYPES.ENROLLMENT]: [ROLES.INSTRUCTOR, ROLES.ADMIN],
  [NOTIFICATION_TYPES.COURSE_APPROVED]: [ROLES.INSTRUCTOR, ROLES.ADMIN],
  [NOTIFICATION_TYPES.ASSIGNMENT_GRADED]: [ROLES.STUDENT],
  [NOTIFICATION_TYPES.QUIZ_COMPLETED]: [ROLES.STUDENT],
  [NOTIFICATION_TYPES.CERTIFICATE_ISSUED]: [ROLES.STUDENT],
  [NOTIFICATION_TYPES.NEW_REVIEW]: [ROLES.INSTRUCTOR, ROLES.ADMIN],
  [NOTIFICATION_TYPES.PAYMENT_SUCCESS]: [ROLES.INSTRUCTOR, ROLES.ADMIN],
};
