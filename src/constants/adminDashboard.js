export const adminDashboardData = {
  admin: {
    name: "Admin User",
    role: "Platform Administrator",
    email: "admin@edulearn.io",
  },

  stats: {
    totalUsers: 18420,
    totalStudents: 16850,
    totalInstructors: 420,
    totalCourses: 685,
    publishedCourses: 542,
    pendingApprovals: 18,
    enrollments: 42680,
    revenue: 2485000,
  },

  revenue: {
    summary: {
      thisMonth: 485000,
      thisYear: 2485000,
      previousMonth: 442000,
    },
    months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    values: [320000, 385000, 410000, 445000, 442000, 485000],
  },

  userGrowth: {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    students: [2450, 2680, 2940, 3210, 3470, 3840],
    instructors: [110, 132, 146, 166, 188, 210],
  },

  courseOverview: {
    total: 685,
    published: 542,
    draft: 81,
    pending: 18,
    archived: 44,
  },

  pendingApprovals: [
    {
      id: 1,
      title: "Full Stack Web Development",
      instructor: "John Doe",
      submitted: "Submitted Sep 30",
      status: "Pending Review",
    },
    {
      id: 2,
      title: "React Masterclass",
      instructor: "Sarah Wilson",
      submitted: "Submitted Sep 29",
      status: "Pending Review",
    },
    {
      id: 3,
      title: "Data Analytics Bootcamp",
      instructor: "Michael Brown",
      submitted: "Submitted Sep 28",
      status: "Pending Review",
    },
  ],

  recentUsers: [
    {
      id: 1,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "Student",
      joined: "Sep 30, 2026",
      status: "Active",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      role: "Instructor",
      joined: "Sep 29, 2026",
      status: "Active",
    },
    {
      id: 3,
      name: "Emily Johnson",
      email: "emily@example.com",
      role: "Student",
      joined: "Sep 28, 2026",
      status: "Pending",
    },
    {
      id: 4,
      name: "Mark Taylor",
      email: "mark@example.com",
      role: "Admin",
      joined: "Sep 27, 2026",
      status: "Active",
    },
    {
      id: 5,
      name: "Alicia Green",
      email: "alicia@example.com",
      role: "Student",
      joined: "Sep 26, 2026",
      status: "Suspended",
    },
    {
      id: 6,
      name: "Daniel Kim",
      email: "daniel@example.com",
      role: "Instructor",
      joined: "Sep 25, 2026",
      status: "Pending",
    },
  ],

  recentCourses: [
    {
      id: 1,
      title: "Full Stack Web Development",
      instructor: "John Doe",
      category: "Web Development",
      students: 1250,
      status: "Published",
      created: "Sep 30, 2026",
    },
    {
      id: 2,
      title: "React & Next.js Masterclass",
      instructor: "Sarah Wilson",
      category: "Programming",
      students: 820,
      status: "Pending Review",
      created: "Sep 29, 2026",
    },
    {
      id: 3,
      title: "JavaScript Fundamentals",
      instructor: "Michael Brown",
      category: "Programming",
      students: 380,
      status: "Draft",
      created: "Sep 27, 2026",
    },
  ],

  recentEnrollments: [
    {
      id: 1,
      student: "Emily Johnson",
      course: "Full Stack Web Development",
      date: "Sep 30, 2026",
      amount: 2999,
      status: "Completed",
    },
    {
      id: 2,
      student: "David Lee",
      course: "React & Next.js Masterclass",
      date: "Sep 29, 2026",
      amount: 2499,
      status: "Completed",
    },
    {
      id: 3,
      student: "Sophia Patel",
      course: "JavaScript Fundamentals",
      date: "Sep 27, 2026",
      amount: 1799,
      status: "Pending",
    },
  ],

  recentActivity: [
    { id: 1, text: "New instructor registered.", time: "5 minutes ago", type: "user" },
    { id: 2, text: "New course submitted for review.", time: "2 hours ago", type: "course" },
    { id: 3, text: "Student enrolled in Full Stack Web Development.", time: "Yesterday", type: "enrollment" },
    { id: 4, text: "New course review received.", time: "2 days ago", type: "review" },
    { id: 5, text: "Certificate issued.", time: "3 days ago", type: "certificate" },
  ],

  rating: {
    average: 4.8,
    totalReviews: 2840,
    distribution: [
      { label: "5 Stars", percent: 86 },
      { label: "4 Stars", percent: 9 },
      { label: "3 Stars", percent: 3 },
      { label: "2 Stars", percent: 1 },
      { label: "1 Star", percent: 1 },
    ],
  },

  quickActions: [
    { label: "Add User", href: "/admin/users" },
    { label: "Add Instructor", href: "/admin/instructors" },
    { label: "Review Courses", href: "/admin/courses" },
    { label: "View Payments", href: "/admin/payments" },
    { label: "View Reports", href: "/admin/reports" },
    { label: "Send Notification", href: "/admin/notifications" },
  ],

  systemStatus: [
    { name: "Platform", status: "Operational" },
    { name: "Course Services", status: "Operational" },
    { name: "Authentication", status: "Operational" },
    { name: "Payments", status: "Mock Mode" },
  ],

  alerts: [
    { id: 1, text: "18 courses are waiting for approval.", href: "/admin/courses" },
    { id: 2, text: "5 instructor profiles need review.", href: "/admin/instructors" },
    { id: 3, text: "12 reports were submitted this week.", href: "/admin/reports" },
  ],
};
