import COURSES from "@/constants/courses.js";

const categoryDefinitions = [
  {
    id: "development",
    slug: "development",
    name: "Development",
    description: "Build modern websites and applications.",
    icon: "Code2",
  },
  {
    id: "design",
    slug: "design",
    name: "Design",
    description: "Learn UI, UX and visual design.",
    icon: "Palette",
  },
  {
    id: "business",
    slug: "business",
    name: "Business",
    description: "Grow strategic thinking and leadership skills.",
    icon: "BriefcaseBusiness",
  },
  {
    id: "marketing",
    slug: "marketing",
    name: "Marketing",
    description: "Master growth, content, and digital campaigns.",
    icon: "Megaphone",
  },
  {
    id: "photography",
    slug: "photography",
    name: "Photography",
    description: "Capture stronger visuals through lighting and editing.",
    icon: "Camera",
  },
  {
    id: "data-science",
    slug: "data-science",
    name: "Data Science",
    description: "Analyze data, build models, and unlock insights.",
    icon: "Database",
  },
];

export function formatCompactNumber(value) {
  const numericValue = Number(value) || 0;

  if (numericValue >= 1000000) {
    return `${(numericValue / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (numericValue >= 1000) {
    return `${(numericValue / 1000).toFixed(numericValue >= 10000 ? 0 : 1).replace(/\.0$/, "")}K`;
  }

  return String(numericValue);
}

export const categories = categoryDefinitions.map((category) => {
  const matchingCourses = COURSES.filter((course) => course.category === category.name);
  const courseCount = matchingCourses.length;
  const studentCount = matchingCourses.reduce(
    (total, course) => total + Number(course.enrollmentCount || course.students || 0),
    0
  );

  return {
    ...category,
    courseCount,
    studentCount,
  };
});

export const popularCategorySlugs = [
  "development",
  "design",
  "business",
  "marketing",
  "data-science",
];

export const CATEGORY_STATS = [
  { value: "6+", label: "Categories" },
  { value: "100+", label: "Courses" },
  { value: "25K+", label: "Students" },
  { value: "50+", label: "Instructors" },
];

export default categories;
