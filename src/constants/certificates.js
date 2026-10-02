export const certificates = [
  {
    id: "cert-001",
    certificateNumber: "EDU-2026-0001",
    student: {
      name: "Vandana Sharma",
    },
    course: {
      title: "Full Stack Web Development",
      slug: "full-stack-web-development",
      duration: "12 Weeks",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=900&fit=crop",
    },
    instructor: {
      name: "John Doe",
      title: "Senior Full Stack Developer",
    },
    completionDate: "2026-09-28",
    issueDate: "2026-09-29",
    score: 92,
    status: "verified",
    verificationCode: "EDU-VERIFY-92A7K",
    description:
      "This certificate is awarded in recognition of successfully completing the Full Stack Web Development course.",
    skills: ["React", "Next.js", "Node.js", "MongoDB", "REST APIs"],
  },
  {
    id: "cert-002",
    certificateNumber: "EDU-2026-0002",
    student: {
      name: "Aarav Mehta",
    },
    course: {
      title: "UI/UX Design Fundamentals",
      slug: "uiux-design-fundamentals-with-figma",
      duration: "8 Weeks",
      thumbnail:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=900&fit=crop",
    },
    instructor: {
      name: "David Williams",
      title: "Principal Product Designer",
    },
    completionDate: "2026-08-12",
    issueDate: "2026-08-13",
    score: 95,
    status: "verified",
    verificationCode: "EDU-VERIFY-7Q4M2",
    description:
      "This certificate recognizes the successful completion of a user-centered design and design systems course.",
    skills: ["Figma", "UI Design", "UX Research", "Design Systems", "Accessibility"],
  },
  {
    id: "cert-003",
    certificateNumber: "EDU-2026-0003",
    student: {
      name: "Nisha Gupta",
    },
    course: {
      title: "Digital Marketing Mastery",
      slug: "digital-marketing-complete-course",
      duration: "10 Weeks",
      thumbnail:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=900&fit=crop",
    },
    instructor: {
      name: "James Thompson",
      title: "Head of Growth Marketing",
    },
    completionDate: "2026-07-09",
    issueDate: "2026-07-10",
    score: 89,
    status: "verified",
    verificationCode: "EDU-VERIFY-5K9LT",
    description:
      "This certificate is awarded for successful completion of the course and practical application of digital growth strategies.",
    skills: ["SEO", "Content Strategy", "Analytics", "Paid Media", "Conversion"],
  },
];

export default certificates;
