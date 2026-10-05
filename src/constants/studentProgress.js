import { studentCourses } from "@/constants/studentCourses.js";
import { studentCourseLearning } from "@/constants/studentCourseLearning.js";

const learningHoursByCourse = [9.8, 0, 18.2, 8.5, 12.1, 0, 9.1, 6.4, 2.8, 0, 7.2];

const courseProgress = [
  {
    id: "ENR-JS-001",
    courseId: "COURSE-JS-001",
    courseSlug: studentCourseLearning.slug,
    title: studentCourseLearning.title,
    category: studentCourseLearning.category,
    thumbnail: studentCourseLearning.thumbnail,
    instructor: studentCourseLearning.instructor.name,
    instructorAvatar: studentCourseLearning.instructor.avatar,
    completedLessons: studentCourseLearning.completedLessons,
    totalLessons: studentCourseLearning.totalLessons,
    progress: studentCourseLearning.progress,
    status: "In Progress",
    lastActivity: "Today, 8:40 PM",
    lastActivityAt: "2026-10-06T20:40:00",
    learningHours: studentCourseLearning.learningHours,
  },
  ...studentCourses.slice(1).map((course, index) => ({
    id: course.id,
    courseId: course.courseId,
    courseSlug: course.slug,
    title: course.title,
    category: course.category,
    thumbnail: course.thumbnail,
    instructor: course.instructor.name,
    instructorAvatar: course.instructor.avatar,
    completedLessons: course.completedLessons,
    totalLessons: course.totalLessons,
    progress: course.progress,
    status: course.status,
    lastActivity: course.lastAccessedAt
      ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(course.lastAccessedAt))
      : "Not started",
    lastActivityAt: course.lastAccessedAt,
    learningHours: learningHoursByCourse[index] ?? 0,
  })),
];

const totals = courseProgress.reduce((result, course) => {
  result.totalLessons += course.totalLessons;
  result.completedLessons += course.completedLessons;
  result.learningHours += course.learningHours;
  if (course.status === "Completed") result.completedCourses += 1;
  else if (course.status === "In Progress") result.inProgressCourses += 1;
  else result.notStartedCourses += 1;
  return result;
}, {
  totalLessons: 0,
  completedLessons: 0,
  learningHours: 0,
  completedCourses: 0,
  inProgressCourses: 0,
  notStartedCourses: 0,
});

export const studentProgress = {
  summary: {
    totalCourses: courseProgress.length,
    completedCourses: totals.completedCourses,
    lessonsCompleted: totals.completedLessons,
    totalLessons: totals.totalLessons,
    learningHours: Number(totals.learningHours.toFixed(1)),
  },
  overall: {
    percentage: Math.round((totals.completedLessons / totals.totalLessons) * 100),
    completedLessons: totals.completedLessons,
    totalLessons: totals.totalLessons,
    completedCourses: totals.completedCourses,
    inProgressCourses: totals.inProgressCourses,
    notStartedCourses: totals.notStartedCourses,
  },
  activityRanges: {
    week: {
      label: "This Week",
      averageDays: 7,
      values: [
        { day: "Mon", hours: 1.0 },
        { day: "Tue", hours: 1.2 },
        { day: "Wed", hours: 0.8 },
        { day: "Thu", hours: 1.5 },
        { day: "Fri", hours: 1.1 },
        { day: "Sat", hours: 1.4 },
        { day: "Sun", hours: 0.5 },
      ],
    },
    month: {
      label: "This Month",
      averageDays: 30,
      values: [
        { day: "Week 1", hours: 8.2 },
        { day: "Week 2", hours: 10.1 },
        { day: "Week 3", hours: 9.4 },
        { day: "Week 4", hours: 6.8 },
        { day: "Week 5", hours: 3.1 },
      ],
    },
    quarter: {
      label: "Last 3 Months",
      averageDays: 92,
      values: [
        { day: "Aug", hours: 38.4 },
        { day: "Sep", hours: 42.7 },
        { day: "Oct", hours: 12.1 },
      ],
    },
    year: {
      label: "This Year",
      averageDays: 279,
      values: [
        { day: "Jan-Mar", hours: 132.5 },
        { day: "Apr-Jun", hours: 148.2 },
        { day: "Jul-Sep", hours: 125.4 },
        { day: "Oct", hours: 12.1 },
      ],
    },
    all: {
      label: "All Time",
      averageDays: 365,
      values: [
        { day: "2023", hours: 94.6 },
        { day: "2024", hours: 178.2 },
        { day: "2025", hours: 185.7 },
        { day: "2026", hours: 418.4 },
      ],
    },
  },
  streak: {
    currentDays: 7,
    bestDays: 18,
    learningDaysThisMonth: 21,
    week: [
      { day: "M", active: true },
      { day: "T", active: true },
      { day: "W", active: true },
      { day: "T", active: true },
      { day: "F", active: true },
      { day: "S", active: true },
      { day: "S", active: false },
    ],
  },
  courseProgress,
  quizPerformance: {
    attempted: 24,
    passed: 20,
    averageScore: 84,
    bestScore: 98,
    recentResults: [
      { id: "quiz-1", title: "JavaScript Functions", score: 92 },
      { id: "quiz-2", title: "Promises & Async", score: 86 },
      { id: "quiz-3", title: "React Hooks", score: 78 },
    ],
  },
  assignmentPerformance: {
    submitted: 18,
    graded: 16,
    averageScore: 88,
    pending: 2,
    recent: [
      { id: "assignment-1", title: "React Project", score: 92 },
      { id: "assignment-2", title: "Node.js API", score: 86 },
      { id: "assignment-3", title: "MongoDB Assignment", score: 90 },
    ],
  },
  recentActivity: [
    { id: "activity-1", title: "Closures in JavaScript", course: "JavaScript Masterclass", time: "Today, 8:40 PM", type: "Completed", icon: "completed" },
    { id: "activity-2", title: "Higher Order Functions", course: "JavaScript Masterclass", time: "Yesterday", type: "Completed", icon: "completed" },
    { id: "activity-3", title: "Node.js Event Loop", course: "Node.js & Express Backend Development", time: "2 days ago", type: "Watched", icon: "watched" },
    { id: "activity-4", title: "MongoDB Aggregation", course: "MongoDB for Developers", time: "3 days ago", type: "Completed", icon: "completed" },
  ],
  certificates: {
    earned: 4,
    latestTitle: "JavaScript Masterclass",
    issuedAt: "2026-09-28",
  },
  learningGoal: {
    weeklyHours: 10,
    completedHours: 7.5,
  },
};