import COURSES from "@/constants/courses.js";

const findCourse = (match) => COURSES.find((course) => match(course.title)) || COURSES[0];

const courseRecords = [
  {
    match: (title) => title.includes("JavaScript Fundamentals"),
    displayTitle: "JavaScript Masterclass",
    instructorName: "Emily Rodriguez",
    instructorTitle: "JavaScript Educator",
    completionDate: "2026-09-28",
    issueDate: "2026-09-28",
    score: 92,
    duration: "18h 40m",
    lessonsCompleted: 48,
    totalLessons: 48,
    quizzesCompleted: 8,
    totalQuizzes: 8,
    assignmentsCompleted: 6,
    totalAssignments: 6,
    skills: ["JavaScript", "ES6+", "Async/Await", "DOM", "APIs"],
  },
  {
    match: (title) => title.includes("Complete React & Next.js"),
    displayTitle: "React & Next.js Complete Guide",
    instructorName: "Sarah Johnson",
    instructorTitle: "Senior Full Stack Engineer",
    completionDate: "2026-08-12",
    issueDate: "2026-08-12",
    score: 95,
    duration: "22h 15m",
    lessonsCompleted: 42,
    totalLessons: 42,
    quizzesCompleted: 10,
    totalQuizzes: 10,
    assignmentsCompleted: 7,
    totalAssignments: 7,
    skills: ["React", "Next.js", "Components", "State", "Routing"],
  },
  {
    match: (title) => title.includes("Node.js & Express"),
    displayTitle: "Node.js Masterclass",
    instructorName: "Michael Chen",
    instructorTitle: "Backend Engineering Instructor",
    completionDate: "2026-06-20",
    issueDate: "2026-06-20",
    score: 90,
    duration: "16h 30m",
    lessonsCompleted: 36,
    totalLessons: 36,
    quizzesCompleted: 8,
    totalQuizzes: 8,
    assignmentsCompleted: 6,
    totalAssignments: 6,
    skills: ["Node.js", "Express", "REST APIs", "Validation", "Middleware"],
  },
  {
    match: (title) => title.includes("Python for Data Science"),
    displayTitle: "Python for Data Science",
    instructorName: "Daniel Kim",
    instructorTitle: "Data Science Instructor",
    completionDate: "2025-12-18",
    issueDate: "2025-12-18",
    score: 88,
    duration: "20h 10m",
    lessonsCompleted: 40,
    totalLessons: 40,
    quizzesCompleted: 9,
    totalQuizzes: 9,
    assignmentsCompleted: 5,
    totalAssignments: 5,
    skills: ["Python", "Pandas", "Data Cleaning", "Visualization", "Modeling"],
  },
  {
    match: (title) => title.includes("UI/UX Design Fundamentals"),
    displayTitle: "UI/UX Design Fundamentals",
    instructorName: "David Williams",
    instructorTitle: "Principal Product Designer",
    completionDate: "2025-08-17",
    issueDate: "2025-08-17",
    score: 94,
    duration: "14h 25m",
    lessonsCompleted: 32,
    totalLessons: 32,
    quizzesCompleted: 6,
    totalQuizzes: 6,
    assignmentsCompleted: 5,
    totalAssignments: 5,
    skills: ["Figma", "UI Design", "UX Research", "Prototyping", "Accessibility"],
  },
  {
    match: (title) => title.includes("Business Strategy"),
    displayTitle: "Business Strategy Essentials",
    instructorName: "James Thompson",
    instructorTitle: "Business Strategy Instructor",
    completionDate: "2024-11-05",
    issueDate: "2024-11-05",
    score: 91,
    duration: "11h 50m",
    lessonsCompleted: 28,
    totalLessons: 28,
    quizzesCompleted: 7,
    totalQuizzes: 7,
    assignmentsCompleted: 4,
    totalAssignments: 4,
    skills: ["Strategy", "Market Analysis", "Planning", "Leadership", "Growth"],
  },
];

export const studentCertificates = courseRecords.map((record, index) => {
  const catalogCourse = findCourse(record.match);
  const certificateNumber = `EDU-CERT-${record.issueDate.slice(0, 4)}-${String(124 + index).padStart(5, "0")}`;

  return {
    id: `cert-${String(index + 1).padStart(3, "0")}`,
    certificateId: certificateNumber,
    certificateNumber,
    title: "Certificate of Completion",
    description: `This certificate recognizes successful completion of ${record.displayTitle}. This is a demonstration certificate record.`,
    student: { name: "Vandana Sharma" },
    course: {
      title: record.displayTitle,
      catalogTitle: catalogCourse?.title || record.displayTitle,
      slug: catalogCourse?.slug || "courses",
      duration: record.duration,
      thumbnail: catalogCourse?.thumbnail || "",
      lessonsCompleted: record.lessonsCompleted,
      totalLessons: record.totalLessons,
      quizzesCompleted: record.quizzesCompleted,
      totalQuizzes: record.totalQuizzes,
      assignmentsCompleted: record.assignmentsCompleted,
      totalAssignments: record.totalAssignments,
    },
    instructor: { name: record.instructorName, title: record.instructorTitle },
    completionDate: record.completionDate,
    issueDate: record.issueDate,
    score: record.score,
    status: "demo",
    verificationCode: `EDU-VERIFY-${["8F2K9A", "4M7D2P", "6R3W1B", "9C5H8T", "2J7L4N", "5Q1X8D"][index]}`,
    progress: 100,
    skills: record.skills,
  };
});

export function calculateCertificateStats(certificates = studentCertificates, now = new Date()) {
  const year = now.getFullYear();
  const latestCertificate = certificates.reduce((latest, certificate) => {
    if (!latest || new Date(certificate.issueDate) > new Date(latest.issueDate)) return certificate;
    return latest;
  }, null);

  return {
    total: certificates.length,
    coursesCompleted: new Set(certificates.map((certificate) => certificate.course.slug)).size,
    thisYear: certificates.filter((certificate) => new Date(`${certificate.issueDate}T00:00:00Z`).getUTCFullYear() === year).length,
    latestCertificate,
  };
}