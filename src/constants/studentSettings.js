export const studentSettings = {
  general: {
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12-hour",
    currency: "INR",
  },
  notifications: {
    courseUpdates: true,
    enrollmentUpdates: true,
    assignmentReminders: true,
    quizReminders: true,
    certificateNotifications: true,
    instructorAnnouncements: true,
    platformAnnouncements: true,
    marketingEmails: false,
    frequency: "immediately",
  },
  learning: {
    preferredStyle: "mixed",
    weeklyGoal: 10,
    difficulty: "intermediate",
    autoplayLessons: true,
    courseRecommendations: true,
  },
  appearance: {
    theme: "system",
  },
  privacy: {
    profileVisibility: "students",
    showLearningActivity: true,
    showCourseCompletion: true,
    showCertificates: true,
    allowInstructorMessages: true,
    personalizedRecommendations: true,
  },
  security: {
    twoFactorEnabled: false,
  },
  account: {
    type: "Student",
    status: "Active",
    memberSince: "2026-01-10",
    emailVerified: true,
  },
};