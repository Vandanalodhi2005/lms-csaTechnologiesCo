import COURSES from "@/constants/courses.js";
import { instructors } from "@/constants/instructors.js";

const catalogCourse = COURSES.find((course) => course.slug === "javascript-fundamentals-from-zero-to-hero");
const instructor = instructors.find((item) => item.slug === catalogCourse?.instructorId?.slug);

const sectionOutline = [
  {
    id: "section-1",
    title: "JavaScript Foundations",
    description: "Get comfortable with the language, its syntax, and how JavaScript runs in the browser.",
    lessons: ["JavaScript and the Web", "Setting Up Your Workspace", "Values and Expressions", "Writing Your First Script", "Using the Console", "How JavaScript Executes"],
  },
  {
    id: "section-2",
    title: "Variables, Types & Control Flow",
    description: "Work with data, make decisions, and repeat tasks with clear, predictable code.",
    lessons: ["Variables and Constants", "Primitive Data Types", "Type Conversion", "Comparison and Logic", "Conditional Statements", "Loops and Iteration"],
  },
  {
    id: "section-3",
    title: "Functions & Reusable Code",
    description: "Build reusable functions and understand how values move through your programs.",
    lessons: ["Function Declarations", "Parameters and Return Values", "Arrow Functions", "Default Parameters", "Higher Order Functions", "Callback Functions"],
  },
  {
    id: "section-4",
    title: "Objects & Arrays",
    description: "Model real information with objects and transform collections with array methods.",
    lessons: ["Object Literals", "Reading and Updating Properties", "Arrays and Indexes", "Mapping and Filtering", "Destructuring Data", "Working with JSON"],
  },
  {
    id: "section-5",
    title: "The Browser & the DOM",
    description: "Connect JavaScript to page elements and respond to user input.",
    lessons: ["Understanding the DOM", "Selecting Page Elements", "Updating the Interface", "Events and Event Objects", "Forms and Validation", "Building an Interactive Widget"],
  },
  {
    id: "section-6",
    title: "Advanced Functions & Scope",
    description: "Explore lexical scope, closures, and the patterns that make functions powerful.",
    lessons: ["Lexical Scope", "The Scope Chain", "Closures in JavaScript", "Closures in Practical UI Code", "Function Composition", "Section Review: Closures"],
  },
  {
    id: "section-7",
    title: "Asynchronous JavaScript",
    description: "Handle asynchronous work with promises, async functions, and robust error handling.",
    lessons: ["The Event Loop", "Promises from First Principles", "Chaining Promises", "Async and Await", "Handling Async Errors", "Fetching and Transforming Data"],
  },
  {
    id: "section-8",
    title: "Modules & Capstone Project",
    description: "Organize a larger codebase and bring the course concepts together in a final project.",
    lessons: ["ES Modules", "Organizing a Small Application", "Debugging Techniques", "Testing Core Behavior", "Capstone: Plan and Build", "Capstone: Polish and Review"],
  },
];

const lessonTypes = ["video", "article", "video", "quiz", "video", "assignment"];
const lessonDurations = ["14 min", "9 min", "18 min", "8 min", "16 min", "22 min"];
let lessonNumber = 0;

const sections = sectionOutline.map((section, sectionIndex) => {
  const lessons = section.lessons.map((title, lessonIndex) => {
    lessonNumber += 1;
    const isCompleted = lessonNumber <= 34;
    const isCurrent = lessonNumber === 35;
    const isLocked = lessonNumber > 40;
    return {
      id: `lesson-${String(lessonNumber).padStart(2, "0")}`,
      number: lessonNumber,
      title,
      type: isCurrent ? "video" : lessonTypes[lessonIndex],
      duration: lessonDurations[(lessonIndex + sectionIndex) % lessonDurations.length],
      completed: isCompleted,
      current: isCurrent,
      locked: isLocked,
      description: `${title} with focused examples and practical JavaScript exercises.`,
    };
  });
  const completedLessons = lessons.filter((lesson) => lesson.completed).length;

  return {
    ...section,
    lessons,
    completedLessons,
    totalLessons: lessons.length,
    progress: Math.round((completedLessons / lessons.length) * 100),
  };
});

const flatLessons = sections.flatMap((section) => section.lessons);
const completedLessons = flatLessons.filter((lesson) => lesson.completed).length;

export const studentCourseLearning = {
  slug: "javascript-masterclass",
  title: "JavaScript Masterclass",
  description: "Master JavaScript from fundamentals to advanced concepts through practical projects, clear explanations, and hands-on exercises.",
  shortDescription: catalogCourse?.shortDescription || "Build a strong JavaScript foundation with practical, project-based lessons.",
  category: catalogCourse?.category || "Development",
  thumbnail: catalogCourse?.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop",
  instructor: {
    name: instructor?.name || "Emily Rodriguez",
    slug: instructor?.slug || "emily-rodriguez",
    avatar: instructor?.avatar || "",
    title: instructor?.role || "JavaScript Educator",
    rating: instructor?.rating || 4.9,
    students: instructor?.studentCount || 61200,
    courses: instructor?.courseCount || 11,
    bio: instructor?.bio || "A JavaScript educator focused on making practical programming concepts clear and approachable.",
  },
  rating: catalogCourse?.rating || 4.9,
  reviewCount: catalogCourse?.reviewCount || 245,
  level: catalogCourse?.level || "Intermediate",
  language: "English",
  totalLessons: flatLessons.length,
  completedLessons,
  remainingLessons: flatLessons.length - completedLessons,
  progress: Math.round((completedLessons / flatLessons.length) * 100),
  totalDuration: "18h 40m",
  learningHours: 12.4,
  certificateCount: 1,
  lastActivity: "Today at 8:40 PM",
  lastAccessedLesson: flatLessons.find((lesson) => lesson.current),
  sections,
  resources: [
    { id: "resource-1", title: "JavaScript Cheat Sheet", detail: "Reference guide · PDF" },
    { id: "resource-2", title: "Source Code", detail: "Lesson examples · ZIP" },
    { id: "resource-3", title: "Practice Files", detail: "Exercises · ZIP" },
    { id: "resource-4", title: "Course Notes", detail: "Study notes · PDF" },
    { id: "resource-5", title: "Project Starter Files", detail: "Capstone materials · ZIP" },
  ],
  activities: [
    { id: "activity-1", title: "Completed Closures in JavaScript", lessonId: "lesson-34", time: "Today, 8:40 PM", type: "completed" },
    { id: "activity-2", title: "Completed Higher Order Functions", lessonId: "lesson-30", time: "Yesterday, 7:15 PM", type: "completed" },
    { id: "activity-3", title: "Completed Callback Functions", lessonId: "lesson-29", time: "Oct 03, 2026", type: "completed" },
    { id: "activity-4", title: "Reviewed Scope Chain notes", lessonId: "lesson-28", time: "Oct 02, 2026", type: "reviewed" },
  ],
};

export function getStudentCourseLearning(courseSlug) {
  return courseSlug === studentCourseLearning.slug ? studentCourseLearning : null;
}