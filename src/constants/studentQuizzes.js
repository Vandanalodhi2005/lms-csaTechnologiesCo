import COURSES from "@/constants/courses.js";
import { instructors } from "@/constants/instructors.js";
import { quizzes } from "@/constants/quizzes.js";

export const quizDemoDate = "2026-10-06T12:00:00+05:30";

const courseByKey = {
  react: COURSES.find((course) => course.title.includes("React & Next.js")),
  javascript: COURSES.find((course) => course.slug === "javascript-fundamentals-from-zero-to-hero"),
  node: COURSES.find((course) => course.title.includes("Node.js & Express")),
  design: COURSES.find((course) => course.title.includes("UI/UX Design Fundamentals")),
  data: COURSES.find((course) => course.title.includes("Python for Data Science")),
  business: COURSES.find((course) => course.title.includes("Business Strategy")),
};

const quizById = Object.fromEntries(quizzes.map((quiz) => [quiz.id, quiz]));

const quizSeeds = [
  { routeId: "javascript-basics", course: "javascript", title: "JavaScript Fundamentals Quiz", status: "available", dueDate: "2026-10-07T10:00:00+05:30", attemptsUsed: 0 },
  { course: "javascript", title: "Functions & Scope Assessment", status: "in-progress", dueDate: "2026-10-09T10:00:00+05:30", attemptsUsed: 1, bestScore: 0, completedAt: null },
  { course: "javascript", title: "JavaScript Functions", status: "passed", dueDate: "2026-10-10T10:00:00+05:30", attemptsUsed: 1, bestScore: 92, completedAt: "2026-10-05T19:30:00+05:30" },
  { course: "react", title: "React State & Events Quiz", status: "failed", dueDate: "2026-10-02T10:00:00+05:30", attemptsUsed: 2, bestScore: 64, completedAt: "2026-10-04T17:20:00+05:30" },
  { course: "node", title: "Node.js Fundamentals", status: "passed", dueDate: "2026-10-12T10:00:00+05:30", attemptsUsed: 2, bestScore: 86, completedAt: "2026-10-05T12:10:00+05:30" },
  { course: "design", title: "Figma Layout Principles", status: "available", dueDate: "2026-10-08T10:00:00+05:30", attemptsUsed: 0 },
  { course: "react", title: "React Hooks Review", status: "passed", dueDate: "2026-10-14T10:00:00+05:30", attemptsUsed: 1, bestScore: 95, completedAt: "2026-10-03T16:30:00+05:30" },
  { course: "business", title: "Business Strategy Checkpoint", status: "overdue", dueDate: "2026-10-04T10:00:00+05:30", attemptsUsed: 0 },
  { course: "javascript", title: "Promises & Async", status: "passed", dueDate: "2026-10-11T10:00:00+05:30", attemptsUsed: 2, bestScore: 81, completedAt: "2026-10-03T12:30:00+05:30" },
  { course: "data", title: "Pandas Essentials Quiz", status: "available", dueDate: "2026-10-13T10:00:00+05:30", attemptsUsed: 0 },
  { course: "node", title: "Express Routing Quiz", status: "failed", dueDate: "2026-10-01T10:00:00+05:30", attemptsUsed: 2, bestScore: 68, completedAt: "2026-10-02T14:30:00+05:30" },
  { course: "react", title: "Component Architecture", status: "passed", dueDate: "2026-10-15T10:00:00+05:30", attemptsUsed: 1, bestScore: 89, completedAt: "2026-10-02T12:00:00+05:30" },
  { course: "javascript", title: "DOM Events Quick Quiz", status: "available", dueDate: "2026-10-16T10:00:00+05:30", attemptsUsed: 0 },
  { course: "design", title: "Accessibility Foundations", status: "passed", dueDate: "2026-09-28T10:00:00+05:30", attemptsUsed: 2, bestScore: 93, completedAt: "2026-10-01T18:15:00+05:30" },
  { course: "data", title: "Data Cleaning Concepts", status: "passed", dueDate: "2026-09-25T10:00:00+05:30", attemptsUsed: 2, bestScore: 98, completedAt: "2026-09-30T16:40:00+05:30" },
  { course: "node", title: "API Error Handling", status: "passed", dueDate: "2026-09-22T10:00:00+05:30", attemptsUsed: 2, bestScore: 84, completedAt: "2026-09-29T15:50:00+05:30" },
  { course: "react", title: "React Fundamentals Quiz", status: "passed", dueDate: "2026-09-20T10:00:00+05:30", attemptsUsed: 1, bestScore: 91, completedAt: "2026-09-28T11:00:00+05:30" },
  { course: "javascript", title: "Array Methods Review", status: "passed", dueDate: "2026-09-18T10:00:00+05:30", attemptsUsed: 1, bestScore: 87, completedAt: "2026-09-27T13:10:00+05:30" },
];

const questionCount = [12, 15, 20, 10, 18, 14];
const durationMinutes = [12, 15, 20, 10, 18, 14];

export const studentQuizzes = quizSeeds.map((seed, index) => {
  const courseData = courseByKey[seed.course];
  const sourceQuiz = seed.routeId ? quizById[seed.routeId] : null;
  const courseSlug = sourceQuiz?.courseSlug || courseData?.slug || "javascript-fundamentals-from-zero-to-hero";
  const instructor = instructors.find((item) => item.slug === courseData?.instructorId?.slug);
  const course = {
    slug: courseSlug,
    title: courseData?.title || "JavaScript Fundamentals: From Zero to Hero",
  };
  const instructorData = {
    name: instructor?.name || courseData?.instructor || "Course Instructor",
    slug: instructor?.slug || courseData?.instructorId?.slug || "",
  };
  const bestScore = seed.bestScore ?? null;
  const passingScore = sourceQuiz?.passingScore || 70;
  const routeAvailable = Boolean(sourceQuiz && courseData?.slug === sourceQuiz.courseSlug);

  return {
    id: `student-quiz-${String(index + 1).padStart(3, "0")}`,
    quizId: sourceQuiz?.id || `QUIZ-${String(101 + index)}`,
    routeQuizId: routeAvailable ? sourceQuiz.id : null,
    routeAvailable,
    title: seed.title,
    course,
    instructor: instructorData,
    category: courseData?.category || "Development",
    difficulty: ["Beginner", "Intermediate", "Advanced"][index % 3],
    questions: sourceQuiz?.questions.length || questionCount[index % questionCount.length],
    duration: sourceQuiz?.timeLimit || durationMinutes[index % durationMinutes.length],
    passingScore,
    attemptsAllowed: sourceQuiz?.attemptsAllowed || 2,
    attemptsUsed: seed.attemptsUsed,
    bestScore,
    status: seed.status,
    dueDate: seed.dueDate,
    completedAt: seed.completedAt || null,
  };
});

export function getQuizStatusCounts(items = studentQuizzes) {
  return items.reduce((counts, quiz) => {
    counts.all += 1;
    counts[quiz.status] = (counts[quiz.status] || 0) + 1;
    if (["passed", "failed", "completed"].includes(quiz.status)) counts.completed += 1;
    return counts;
  }, { all: 0, available: 0, "in-progress": 0, completed: 0, passed: 0, failed: 0, overdue: 0 });
}

export function getQuizPerformance(items = studentQuizzes) {
  const attempted = items.filter((quiz) => quiz.attemptsUsed > 0).reduce((sum, quiz) => sum + quiz.attemptsUsed, 0);
  const scored = items.filter((quiz) => typeof quiz.bestScore === "number");
  const passed = items.filter((quiz) => quiz.status === "passed").length;
  const failed = items.filter((quiz) => quiz.status === "failed").length;
  return {
    attempted,
    passed,
    failed,
    averageScore: scored.length ? Math.round(scored.reduce((sum, quiz) => sum + quiz.bestScore, 0) / scored.length) : 0,
    highestScore: scored.length ? Math.max(...scored.map((quiz) => quiz.bestScore)) : 0,
    passRate: passed + failed ? Math.round((passed / (passed + failed)) * 100) : 0,
  };
}

export function getCourseQuizPerformance(items = studentQuizzes) {
  const grouped = items.filter((quiz) => typeof quiz.bestScore === "number").reduce((result, quiz) => {
    const key = quiz.course.slug;
    if (!result[key]) result[key] = { slug: key, title: quiz.course.title, totalScore: 0, count: 0 };
    result[key].totalScore += quiz.bestScore;
    result[key].count += 1;
    return result;
  }, {});

  return Object.values(grouped).map((course) => ({
    ...course,
    average: Math.round(course.totalScore / course.count),
  }));
}