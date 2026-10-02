import COURSES from "@/constants/courses.js";

export const student = {
  id: "student-001",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces",
};

export const dashboardStats = {
  enrolledCourses: 8,
  completedCourses: 3,
  learningHours: 42,
  certificates: 3,
};

export const enrolledCourses = [
  {
    id: "course-001",
    slug: COURSES[0]?.slug || "react-nextjs-complete-course",
    title: COURSES[0]?.title || "React & Next.js Complete Course",
    instructor: COURSES[0]?.instructor || "John Doe",
    category: COURSES[0]?.category || "Development",
    thumbnail: COURSES[0]?.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    progress: 68,
    completedLessons: 34,
    totalLessons: 50,
    status: "in-progress",
  },
  {
    id: "course-002",
    slug: COURSES[1]?.slug || "advanced-typescript-for-production-apps",
    title: COURSES[1]?.title || "Advanced TypeScript for Production Apps",
    instructor: COURSES[1]?.instructor || "Sarah Johnson",
    category: COURSES[1]?.category || "Development",
    thumbnail: COURSES[1]?.thumbnail || "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=500&fit=crop",
    progress: 100,
    completedLessons: 42,
    totalLessons: 42,
    status: "completed",
  },
  {
    id: "course-003",
    slug: COURSES[2]?.slug || "javascript-fundamentals-from-zero-to-hero",
    title: COURSES[2]?.title || "JavaScript Fundamentals: From Zero to Hero",
    instructor: COURSES[2]?.instructor || "Emily Rodriguez",
    category: COURSES[2]?.category || "Development",
    thumbnail: COURSES[2]?.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    progress: 0,
    completedLessons: 0,
    totalLessons: 36,
    status: "not-started",
  },
  {
    id: "course-004",
    slug: COURSES[3]?.slug || "uiux-design-fundamentals-with-figma",
    title: COURSES[3]?.title || "UI/UX Design Fundamentals with Figma",
    instructor: COURSES[3]?.instructor || "David Williams",
    category: COURSES[3]?.category || "Design",
    thumbnail: COURSES[3]?.thumbnail || "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop",
    progress: 82,
    completedLessons: 29,
    totalLessons: 35,
    status: "in-progress",
  },
  {
    id: "course-005",
    slug: COURSES[4]?.slug || "advanced-design-systems-component-architecture",
    title: COURSES[4]?.title || "Advanced Design Systems & Component Architecture",
    instructor: COURSES[4]?.instructor || "Priya Patel",
    category: COURSES[4]?.category || "Design",
    thumbnail: COURSES[4]?.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop",
    progress: 100,
    completedLessons: 20,
    totalLessons: 20,
    status: "completed",
  },
  {
    id: "course-006",
    slug: COURSES[5]?.slug || "logo-design-brand-identity-masterclass",
    title: COURSES[5]?.title || "Logo Design & Brand Identity Masterclass",
    instructor: COURSES[5]?.instructor || "David Williams",
    category: COURSES[5]?.category || "Design",
    thumbnail: COURSES[5]?.thumbnail || "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop",
    progress: 42,
    completedLessons: 16,
    totalLessons: 38,
    status: "in-progress",
  },
  {
    id: "course-007",
    slug: COURSES[6]?.slug || "digital-marketing-complete-course",
    title: COURSES[6]?.title || "Digital Marketing Complete Course",
    instructor: COURSES[6]?.instructor || "James Thompson",
    category: COURSES[6]?.category || "Marketing",
    thumbnail: COURSES[6]?.thumbnail || "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop",
    progress: 0,
    completedLessons: 0,
    totalLessons: 24,
    status: "not-started",
  },
  {
    id: "course-008",
    slug: COURSES[7]?.slug || "seo-mastery-rank-1-on-google",
    title: COURSES[7]?.title || "SEO Mastery: Rank #1 on Google",
    instructor: COURSES[7]?.instructor || "Olivia Martinez",
    category: COURSES[7]?.category || "Marketing",
    thumbnail: COURSES[7]?.thumbnail || "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800&h=500&fit=crop",
    progress: 76,
    completedLessons: 25,
    totalLessons: 33,
    status: "in-progress",
  },
];

export const recentActivities = [
  { id: "activity-1", title: "Completed JavaScript Functions lesson", timeLabel: "2 hours ago", type: "completed" },
  { id: "activity-2", title: "Watched React Hooks lesson", timeLabel: "Yesterday", type: "watched" },
  { id: "activity-3", title: "Completed JavaScript Quiz", timeLabel: "2 days ago", type: "completed" },
  { id: "activity-4", title: "Started Next.js Routing", timeLabel: "3 days ago", type: "started" },
];

export const upcomingActivities = [
  { id: "upcoming-1", title: "JavaScript Quiz", date: "Tomorrow", detail: "10 Questions" },
  { id: "upcoming-2", title: "React Assignment", date: "Friday", detail: "Due in 3 days" },
  { id: "upcoming-3", title: "Next.js Assessment", date: "Sunday", detail: "Module review" },
];

export const assignmentSummary = {
  pending: 2,
  completed: 5,
};

export const quizSummary = {
  pending: 1,
  completed: 8,
};

export const learningGoal = {
  current: 6,
  target: 10,
  percentage: 60,
};

const studentDashboardData = {
  student,
  dashboardStats,
  enrolledCourses,
  recentActivities,
  upcomingActivities,
  assignmentSummary,
  quizSummary,
  learningGoal,
};

export { studentDashboardData };
export default studentDashboardData;
