import { assignments } from "@/constants/assignments.js";

export const assignmentDemoDate = "2026-10-06T12:00:00+05:30";

const routeAssignments = Object.fromEntries(assignments.map((assignment) => [assignment.id, assignment]));

const courses = {
  react: { slug: "react-nextjs-complete-course", title: "React & Next.js Complete Course", category: "Development", instructor: "Sarah Johnson", instructorSlug: "sarah-johnson" },
  javascript: { slug: "javascript-masterclass", title: "JavaScript Masterclass", category: "Development", instructor: "Emily Rodriguez", instructorSlug: "emily-rodriguez" },
  node: { slug: "node-js-express-backend-development", title: "Node.js & Express Backend Development", category: "Development", instructor: "Michael Chen", instructorSlug: "michael-chen" },
  data: { slug: "python-for-data-science-machine-learning", title: "Python for Data Science & Machine Learning", category: "Data Science", instructor: "Daniel Kim", instructorSlug: "daniel-kim" },
  design: { slug: "ui-ux-design-fundamentals-with-figma", title: "UI/UX Design Fundamentals with Figma", category: "Design", instructor: "David Williams", instructorSlug: "david-williams" },
  business: { slug: "business-strategy-entrepreneurship", title: "Business Strategy & Entrepreneurship", category: "Business", instructor: "James Thompson", instructorSlug: "james-thompson" },
};

const seeds = [
  { routeId: "react-project-01", course: "react", title: "Build a Responsive React Dashboard", type: "Project", status: "pending", dueDate: "2026-10-20T18:00:00+05:30", attemptsUsed: 0, attemptsAllowed: 2, maxMarks: 100, lastUpdatedAt: "2026-10-05T09:30:00+05:30" },
  { routeId: "react-api-integration", course: "react", title: "Build a Next.js API Integration", type: "Coding", status: "submitted", dueDate: "2026-10-15T18:00:00+05:30", attemptsUsed: 1, attemptsAllowed: 2, maxMarks: 100, score: 92, submittedAt: "2026-10-05T20:00:00+05:30", lastUpdatedAt: "2026-10-05T20:00:00+05:30" },
  { routeId: "react-capstone", course: "react", title: "Capstone Frontend Project", type: "Project", status: "graded", dueDate: "2026-09-30T18:00:00+05:30", attemptsUsed: 1, attemptsAllowed: 2, maxMarks: 100, score: 86, submittedAt: "2026-10-05T20:00:00+05:30", gradedAt: "2026-10-06T10:00:00+05:30", lastUpdatedAt: "2026-10-06T10:00:00+05:30", feedback: "Strong implementation. Improve component abstraction and loading states." },
  { course: "node", title: "Design a REST API", type: "Coding", status: "overdue", dueDate: "2026-10-03T18:00:00+05:30", attemptsUsed: 0, attemptsAllowed: 2, maxMarks: 100, lastUpdatedAt: "2026-10-01T14:00:00+05:30" },
  { course: "javascript", title: "Functions and Scope Practice", type: "Practical", status: "pending", dueDate: "2026-10-06T18:00:00+05:30", attemptsUsed: 0, attemptsAllowed: 2, maxMarks: 100, lastUpdatedAt: "2026-10-04T11:15:00+05:30" },
  { course: "data", title: "Exploratory Data Analysis", type: "Project", status: "submitted", dueDate: "2026-10-10T18:00:00+05:30", attemptsUsed: 1, attemptsAllowed: 2, maxMarks: 100, score: 98, submittedAt: "2026-10-04T19:30:00+05:30", lastUpdatedAt: "2026-10-04T19:30:00+05:30" },
  { course: "design", title: "Mobile Checkout Wireframes", type: "Practical", status: "graded", dueDate: "2026-10-02T18:00:00+05:30", attemptsUsed: 1, attemptsAllowed: 2, maxMarks: 100, score: 89, submittedAt: "2026-10-02T16:00:00+05:30", gradedAt: "2026-10-04T10:00:00+05:30", lastUpdatedAt: "2026-10-04T10:00:00+05:30", feedback: "Clear flow and thoughtful accessibility details." },
  { course: "business", title: "Market Opportunity Brief", type: "Written", status: "pending", dueDate: "2026-10-07T18:00:00+05:30", attemptsUsed: 0, attemptsAllowed: 1, maxMarks: 100, lastUpdatedAt: "2026-10-03T13:00:00+05:30" },
  { course: "node", title: "Express Middleware Exercise", type: "Coding", status: "graded", dueDate: "2026-10-01T18:00:00+05:30", attemptsUsed: 2, attemptsAllowed: 2, maxMarks: 100, score: 77, submittedAt: "2026-09-30T21:20:00+05:30", gradedAt: "2026-10-02T10:00:00+05:30", lastUpdatedAt: "2026-10-02T10:00:00+05:30", feedback: "Good fundamentals; add more edge-case coverage." },
  { course: "javascript", title: "Async Patterns Quiz Assignment", type: "Quiz-based Assignment", status: "overdue", dueDate: "2026-10-04T18:00:00+05:30", attemptsUsed: 0, attemptsAllowed: 2, maxMarks: 100, lastUpdatedAt: "2026-10-02T12:00:00+05:30" },
  { course: "react", title: "Component State Challenge", type: "Coding", status: "pending", dueDate: "2026-10-11T18:00:00+05:30", attemptsUsed: 0, attemptsAllowed: 2, maxMarks: 100, lastUpdatedAt: "2026-10-05T08:15:00+05:30" },
  { course: "data", title: "Build a Classification Model", type: "Project", status: "submitted", dueDate: "2026-10-12T18:00:00+05:30", attemptsUsed: 1, attemptsAllowed: 2, maxMarks: 100, score: 84, submittedAt: "2026-10-03T17:45:00+05:30", lastUpdatedAt: "2026-10-03T17:45:00+05:30" },
  { course: "design", title: "Design System Components", type: "Practical", status: "graded", dueDate: "2026-09-28T18:00:00+05:30", attemptsUsed: 1, attemptsAllowed: 2, maxMarks: 100, score: 90, submittedAt: "2026-09-27T15:20:00+05:30", gradedAt: "2026-09-29T11:00:00+05:30", lastUpdatedAt: "2026-09-29T11:00:00+05:30", feedback: "Consistent visual language and strong component reuse." },
  { course: "business", title: "Agile Sprint Retrospective", type: "Written", status: "submitted", dueDate: "2026-10-09T18:00:00+05:30", attemptsUsed: 1, attemptsAllowed: 1, maxMarks: 100, score: 88, submittedAt: "2026-10-05T13:00:00+05:30", lastUpdatedAt: "2026-10-05T13:00:00+05:30" },
  { course: "node", title: "Secure API Validation", type: "Coding", status: "pending", dueDate: "2026-10-13T18:00:00+05:30", attemptsUsed: 0, attemptsAllowed: 2, maxMarks: 100, lastUpdatedAt: "2026-10-05T10:40:00+05:30" },
  { course: "javascript", title: "DOM Interaction Mini Project", type: "Project", status: "graded", dueDate: "2026-09-25T18:00:00+05:30", attemptsUsed: 1, attemptsAllowed: 2, maxMarks: 100, score: 95, submittedAt: "2026-09-24T19:15:00+05:30", gradedAt: "2026-09-26T10:30:00+05:30", lastUpdatedAt: "2026-09-26T10:30:00+05:30", feedback: "Excellent interaction details and clean event handling." },
  { course: "data", title: "Data Visualization Report", type: "Written", status: "pending", dueDate: "2026-10-17T18:00:00+05:30", attemptsUsed: 0, attemptsAllowed: 2, maxMarks: 100, lastUpdatedAt: "2026-10-05T15:15:00+05:30" },
  { course: "react", title: "Accessible Form Validation", type: "Practical", status: "graded", dueDate: "2026-09-22T18:00:00+05:30", attemptsUsed: 1, attemptsAllowed: 2, maxMarks: 100, score: 82, submittedAt: "2026-09-21T16:45:00+05:30", gradedAt: "2026-09-23T09:30:00+05:30", lastUpdatedAt: "2026-09-23T09:30:00+05:30", feedback: "Good validation coverage. Consider clearer inline error descriptions." },
  { course: "design", title: "Usability Test Summary", type: "Written", status: "graded", dueDate: "2026-09-20T18:00:00+05:30", attemptsUsed: 1, attemptsAllowed: 1, maxMarks: 100, score: 92, submittedAt: "2026-09-19T18:00:00+05:30", gradedAt: "2026-09-21T12:15:00+05:30", lastUpdatedAt: "2026-09-21T12:15:00+05:30", feedback: "Concise findings with actionable recommendations." },
];

export const studentAssignments = seeds.map((seed, index) => {
  const course = courses[seed.course];
  const routeAssignment = seed.routeId ? routeAssignments[seed.routeId] : null;
  const routeAvailable = Boolean(routeAssignment);
  const dueDate = seed.dueDate;

  return {
    id: routeAssignment?.id || `demo-assignment-${String(index + 1).padStart(3, "0")}`,
    assignmentId: `ASG-${String(1001 + index)}`,
    routeAssignmentId: routeAssignment?.id || null,
    routeAvailable,
    title: seed.title,
    course,
    instructor: { name: course.instructor, slug: course.instructorSlug },
    type: seed.type,
    description: routeAssignment?.description || `${seed.title} helps you apply concepts from ${course.title} in a focused practical task.`,
    instructions: routeAssignment?.instructions || `Complete the ${seed.type.toLowerCase()} task and submit a clear summary of your approach.`,
    objectives: routeAssignment?.objectives || ["Apply the course concepts to a realistic task.", "Organize your work clearly.", "Review your result against the stated requirements."],
    dueDate,
    maxMarks: seed.maxMarks,
    attemptsAllowed: seed.attemptsAllowed,
    attemptsUsed: seed.attemptsUsed,
    status: seed.status,
    score: seed.score ?? routeAssignment?.score ?? null,
    submittedAt: seed.submittedAt || (routeAssignment?.submittedAt ? "2026-10-05T20:00:00+05:30" : null),
    gradedAt: seed.gradedAt || null,
    lastUpdatedAt: seed.lastUpdatedAt,
    feedback: seed.feedback || routeAssignment?.feedback || "",
    submissionRoute: routeAvailable ? `/learn/${routeAssignment.courseSlug}/assignment/${routeAssignment.id}` : null,
  };
});

export function getAssignmentStatusCounts(items = studentAssignments) {
  return items.reduce((counts, item) => {
    counts.all += 1;
    counts[item.status] = (counts[item.status] || 0) + 1;
    return counts;
  }, { all: 0, pending: 0, submitted: 0, graded: 0, overdue: 0 });
}

export function getAssignmentPerformance(items = studentAssignments) {
  const graded = items.filter((item) => item.status === "graded" && typeof item.score === "number");
  const submitted = items.filter((item) => item.status === "submitted" || item.status === "graded");
  return {
    submitted: submitted.length,
    graded: graded.length,
    averageScore: graded.length ? Math.round(graded.reduce((sum, item) => sum + item.score, 0) / graded.length) : 0,
    highestScore: graded.length ? Math.max(...graded.map((item) => item.score)) : 0,
    pending: items.filter((item) => item.status === "pending").length,
    overdue: items.filter((item) => item.status === "overdue").length,
  };
}