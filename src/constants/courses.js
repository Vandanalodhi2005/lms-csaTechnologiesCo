export const CATEGORIES = Object.freeze([
  "Development",
  "Design",
  "Business",
  "Marketing",
  "Data Science",
  "Photography",
]);

export const COURSE_LEVELS_LIST = Object.freeze([
  "Beginner",
  "Intermediate",
  "Advanced",
]);

export const PRICE_OPTIONS = Object.freeze(["Free", "Paid"]);

export const RATING_OPTIONS = Object.freeze([
  { label: "4+ Stars", value: 4 },
  { label: "3+ Stars", value: 3 },
  { label: "2+ Stars", value: 2 },
]);

export const SORT_OPTIONS = Object.freeze([
  { label: "Most Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low to High", value: "price_low" },
  { label: "Price: High to Low", value: "price_high" },
]);

const INSTRUCTORS = [
  { name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces" },
  { name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces" },
  { name: "Emily Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces" },
  { name: "David Williams", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces" },
  { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces" },
  { name: "James Thompson", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces" },
  { name: "Olivia Martinez", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces" },
  { name: "Daniel Kim", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces" },
];

const INSTRUCTOR_PROFILES = [
  { role: "Senior Full Stack Engineer", bio: "12+ years building production web apps at scale. Previously at Google and Stripe. Loves turning complex concepts into simple, digestible lessons.", students: 42500, courses: 8 },
  { role: "Lead TypeScript Architect", bio: "TypeScript contributor and enterprise consultant with a focus on type-safe systems. Has shipped dozens of production TS apps for Fortune 500 teams.", students: 28900, courses: 6 },
  { role: "JavaScript Educator", bio: "Former bootcamp lead. Believes everyone can learn to code with the right teacher and the right practice.", students: 61200, courses: 11 },
  { role: "Principal Product Designer", bio: "Senior designer at Figma. Builds design systems for teams of all sizes. Award-winning portfolio featured on Awwwards.", students: 18300, courses: 5 },
  { role: "Design Systems Lead", bio: "Design systems architect for unicorn SaaS companies. Teaches scalable, accessible, component-driven design.", students: 12800, courses: 4 },
  { role: "Creative Brand Director", bio: "Brands I've shaped have launched across 40+ countries. I teach brand thinking, not just pretty logos.", students: 9400, courses: 3 },
  { role: "Head of Growth Marketing", bio: "Grew three SaaS products from 0 to 1M+ ARR. Data-driven marketer with a content-first playbook.", students: 24600, courses: 7 },
  { role: "SEO & Content Consultant", bio: "Helped 50+ brands rank on page one for high-intent keywords. My strategy is content, entities, and patience.", students: 15200, courses: 5 },
];

const THUMBNAILS = [
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=500&fit=crop",
];

const TITLES = [
  { title: "Complete React & Next.js Development", cat: "Development", level: "Intermediate" },
  { title: "Advanced TypeScript for Production Apps", cat: "Development", level: "Advanced" },
  { title: "JavaScript Fundamentals: From Zero to Hero", cat: "Development", level: "Beginner" },
  { title: "UI/UX Design Fundamentals with Figma", cat: "Design", level: "Beginner" },
  { title: "Advanced Design Systems & Component Architecture", cat: "Design", level: "Advanced" },
  { title: "Logo Design & Brand Identity Masterclass", cat: "Design", level: "Intermediate" },
  { title: "Digital Marketing Complete Course", cat: "Marketing", level: "Beginner" },
  { title: "SEO Mastery: Rank #1 on Google", cat: "Marketing", level: "Intermediate" },
  { title: "Facebook & Instagram Ads for Growth", cat: "Marketing", level: "Intermediate" },
  { title: "Business Strategy & Entrepreneurship", cat: "Business", level: "Beginner" },
  { title: "Financial Modeling & Valuation", cat: "Business", level: "Advanced" },
  { title: "Project Management with Agile & Scrum", cat: "Business", level: "Intermediate" },
  { title: "Python for Data Science & Machine Learning", cat: "Data Science", level: "Beginner" },
  { title: "Deep Learning with TensorFlow & PyTorch", cat: "Data Science", level: "Advanced" },
  { title: "SQL Mastery: Database Management for Analytics", cat: "Data Science", level: "Intermediate" },
  { title: "DSLR Photography: From Beginner to Pro", cat: "Photography", level: "Beginner" },
  { title: "Portrait Lighting & Studio Photography", cat: "Photography", level: "Advanced" },
  { title: "Mobile Photography & Photo Editing", cat: "Photography", level: "Intermediate" },
  { title: "Node.js & Express Backend Development", cat: "Development", level: "Intermediate" },
  { title: "Mobile App Development with React Native", cat: "Development", level: "Intermediate" },
  { title: "AWS Cloud Practitioner Certification Prep", cat: "Development", level: "Beginner" },
  { title: "Adobe Photoshop for Beginners", cat: "Design", level: "Beginner" },
  { title: "Content Marketing & Copywriting", cat: "Marketing", level: "Beginner" },
  { title: "Leadership & Management Essentials", cat: "Business", level: "Intermediate" },
];

const PRICING = [
  { price: 0 },
  { price: 0 },
  { price: 29, discountPrice: 14 },
  { price: 49 },
  { price: 79, discountPrice: 39 },
  { price: 99 },
  { price: 19, discountPrice: 9 },
  { price: 59 },
  { price: 34 },
  { price: 149, discountPrice: 69 },
  { price: 29 },
  { price: 0 },
  { price: 0 },
  { price: 89, discountPrice: 49 },
  { price: 0 },
  { price: 44, discountPrice: 22 },
  { price: 129 },
  { price: 67 },
  { price: 0 },
  { price: 24 },
  { price: 54 },
  { price: 0 },
  { price: 39 },
  { price: 99, discountPrice: 49 },
];

const REVIEWERS = [
  { name: "Ava Thompson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces" },
  { name: "Liam Davis", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces" },
  { name: "Sophia Wilson", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces" },
  { name: "Noah Brown", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces" },
  { name: "Isabella Garcia", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces" },
  { name: "Ethan Miller", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=faces" },
];

function randFrom(arr, i, salt = 0) {
  return arr[(i + salt) % arr.length];
}

const OUTCOME_SETS = [
  [
    "Build production-grade web applications end-to-end",
    "Architect scalable, modular, and maintainable codebases",
    "Work with real-world APIs and authentication flows",
    "Design responsive, accessible user interfaces",
    "Deploy live applications to production",
    "Implement robust testing & debugging strategies",
  ],
  [
    "Master core language concepts and advanced features",
    "Solve coding challenges with confidence",
    "Write clean, performant, readable code",
    "Understand patterns and idioms used at top companies",
    "Ship your first portfolio projects",
    "Prepare for technical interviews",
  ],
  [
    "Design beautiful, intuitive user experiences",
    "Master the tools professional designers use daily",
    "Create reusable design systems for teams",
    "Prototype and test ideas with real users",
    "Present design work with confidence",
    "Build a portfolio-ready body of work",
  ],
  [
    "Create go-to-market strategies that actually work",
    "Acquire customers through organic & paid channels",
    "Build content engines that compound over time",
    "Analyze data to make better marketing decisions",
    "Write copy that converts visitors into buyers",
    "Run profitable ad campaigns on a budget",
  ],
  [
    "Think critically and strategically about business problems",
    "Build financial models investors can trust",
    "Lead teams and ship projects on schedule",
    "Analyze industries & competitive landscapes",
    "Pitch ideas clearly to stakeholders",
    "Grow a product from idea to scale",
  ],
  [
    "Work with data from raw sources to final insights",
    "Build predictive models with proven techniques",
    "Visualize findings for non-technical audiences",
    "Query databases efficiently with SQL",
    "Validate assumptions statistically",
    "Ship data products to production",
  ],
  [
    "Use your camera with confidence in any light",
    "Compose photographs people actually notice",
    "Edit a polished signature look",
    "Direct subjects to get natural results",
    "Price and sell your work professionally",
    "Build a compelling photography portfolio",
  ],
];

const CATEGORY_SET = {
  Development: 0,
  Design: 2,
  Marketing: 3,
  Business: 4,
  "Data Science": 5,
  Photography: 6,
};

const REQUIREMENT_SETS = [
  [
    "Basic familiarity with HTML and CSS",
    "A computer (Windows, macOS, or Linux) with internet access",
    "Desire to learn and build real projects",
    "No previous programming experience required",
  ],
  [
    "1–2 years of programming experience in the topic",
    "Comfortable reading technical documentation",
    "Familiarity with version control (git)",
    "Willingness to work through challenging exercises",
  ],
  [
    "Advanced knowledge of the core fundamentals",
    "Experience building and shipping real projects",
    "Access to the software and tooling listed in the intro",
    "Curiosity about architecture-level tradeoffs",
  ],
];

const DESCRIPTION_TEMPLATES = {
  Development: [
    "A hands-on, project-driven journey designed to take you from curious beginner to confident, job-ready developer. You'll build several fully-functional applications following the same patterns used by top engineering teams.",
    "Each module blends rigorous computer science fundamentals with modern tooling. Expect weekly projects, code reviews, and refactoring exercises that build real intuition.",
    "We go beyond syntax. You'll learn how senior engineers think — designing for change, testing with intent, and shipping systems that hold up under load.",
  ],
  Design: [
    "A complete design education covering UX research, visual design, and product thinking. You'll leave with a polished case-study portfolio and the mindset of a working product designer.",
    "Lectures are short, the projects are real, and every deliverable is structured to be portfolio-quality immediately. No fluff — just craft.",
    "Learn the frameworks design teams actually use: atomic design systems, accessibility, component libraries, and critique culture.",
  ],
  Marketing: [
    "Practical marketing playbooks you can execute next Monday. We focus on measurable outcomes: traffic, leads, sales. Case studies from SaaS, ecommerce, and education.",
    "A balanced mix of organic content, paid channels, analytics, and positioning. The goal isn't to learn jargon — it's to reliably predict what will grow a business.",
    "Weekly sprints mirror real marketing teams. Ship, measure, iterate. Repeat until the numbers move.",
  ],
  Business: [
    "Turn ambiguous business problems into clear decisions. Build the analytical and leadership toolkit that differentiates top operators from everyone else.",
    "The curriculum mirrors what you'd learn at a top-tier MBA — stripped of filler, applied directly to real case studies.",
    "From financials to org design, from competitive strategy to execution cadence. Everything through the lens of an operator.",
  ],
  "Data Science": [
    "From spreadsheets to production models. Learn to ask the right questions, engineer honest features, and communicate results stakeholders can trust.",
    "Emphasis on the full lifecycle: ingestion → cleaning → EDA → modeling → validation → deployment → monitoring.",
    "Heavy focus on honestly. We teach you what machine learning is good at and — more importantly — where it absolutely is not.",
  ],
  Photography: [
    "Camera mastery plus creative vision. Build the technical foundation and the visual taste to make photos people stop scrolling for.",
    "Every module combines live shoots, critique sessions, and deep edit walkthroughs. Make work you're proud to put your name on.",
    "Studio, natural, and mixed lighting all covered. Color theory, composition, and directing people — taught by working pros.",
  ],
};

function curriculumFor(t, i) {
  const topicNames = {
    Development: [
      "Foundations & Setup",
      "Core Concepts Deep Dive",
      "Working with Data & APIs",
      "Architecture & Patterns",
      "Testing & Quality",
      "Deployment & Production",
      "Capstone Project",
    ],
    Design: [
      "Design Thinking 101",
      "Visual Systems",
      "Typography & Color",
      "Components & Libraries",
      "Prototyping & Interaction",
      "Research & Testing",
      "Portfolio Capstone",
    ],
    Marketing: [
      "Strategy & Positioning",
      "Content Engine",
      "Channel Acquisition",
      "Paid Media Basics",
      "Analytics & Attribution",
      "Conversion Optimization",
      "Go-to-Market Capstone",
    ],
    Business: [
      "Strategic Thinking",
      "Financial Analysis",
      "Operations & GTM",
      "Leadership & Teams",
      "Execution Cadence",
      "Case Studies Deep Dive",
      "Strategy Capstone",
    ],
    "Data Science": [
      "Tools & Workflow",
      "Descriptive Statistics",
      "Data Wrangling",
      "Predictive Modeling",
      "Deep Learning Intro",
      "Evaluation & Bias",
      "Capstone Deployment",
    ],
    Photography: [
      "Camera Mastery",
      "Composition & Light",
      "Studio & Natural Lighting",
      "Portraiture",
      "Editing Workflow",
      "Critique & Portfolio",
      "Final Project",
    ],
  };
  const lessonsTemplate = [
    { title: "Introduction & Roadmap", duration: "06:45", isPreview: true },
    { title: "Core Concepts Explained", duration: "12:20", isPreview: false },
    { title: "Your First Exercise", duration: "14:10", isPreview: false },
    { title: "Common Pitfalls", duration: "09:35", isPreview: false },
    { title: "Worked Example Walkthrough", duration: "18:50", isPreview: false },
    { title: "Checkpoint & Review", duration: "07:10", isPreview: false },
  ];

  const cat = t.cat;
  const sections = (topicNames[cat] || topicNames.Development).map((name, idx) => {
    const offset = (i + idx) % 3;
    const lessonCount = 4 + ((i + idx) % 4);
    const lessons = lessonsTemplate.slice(0, lessonCount).map((l, li) => ({
      id: `s${idx}-l${li}`,
      title: offset === 0 && li === 1 ? `Hands-on: ${l.title.toLowerCase()}` : l.title,
      duration: l.duration,
      isPreview: idx === 0 && li <= 1 ? l.isPreview : false,
    }));
    return {
      id: `section-${idx + 1}`,
      title: `Section ${idx + 1} — ${name}`,
      lessons,
    };
  });
  return sections;
}

function reviewsFor(courseRating, i, count) {
  const n = Math.max(3, count);
  const reviews = [];
  const snippets = [
    "Absolutely worth every minute. The hands-on projects finally made everything click for me.",
    "Best instructor I've had on any platform. Explains the hard stuff without skipping steps.",
    "The pace is perfect — challenging but never overwhelming. I shipped my first project in week 3.",
    "Production-ready content. I was able to apply what I learned at work the following Monday.",
    "Loved the focus on fundamentals rather than trendy APIs. This aged really well.",
    "The community and assignments are top tier. Don't skip the reviews of other students' work.",
  ];
  for (let j = 0; j < n; j++) {
    const base = Math.max(3, Math.round(courseRating));
    const score = Math.max(1, Math.min(5, base + ((i + j * 3) % 3 === 0 ? -1 : 0)));
    const reviewer = randFrom(REVIEWERS, i + j);
    const date = new Date(2026, 7, 28 - ((i * 5 + j * 11) % 120));
    reviews.push({
      id: `r-${i}-${j}`,
      author: reviewer.name,
      avatar: reviewer.avatar,
      rating: score,
      date: date.toISOString(),
      comment: randFrom(snippets, i + j * 2),
    });
  }
  return reviews;
}

function makeCourse(i) {
  const t = TITLES[i % TITLES.length];
  const p = PRICING[i % PRICING.length];
  const isFree = p.price === 0;
  const effective = isFree ? 0 : p.discountPrice ?? p.price;
  const ratingMin = t.level === "Beginner" ? 3.8 : t.level === "Intermediate" ? 4.2 : 4.5;
  const rating = Math.min(5, ratingMin + ((i * 7) % 10) / 20);
  const reviewCount = 23 + ((i * 137) % 900);
  const duration = 90 + ((i * 67) % 900);
  const lessons = 12 + ((i * 11) % 90);
  const enrollment = 250 + ((i * 2143) % 14000);
  const inst = INSTRUCTORS[i % INSTRUCTORS.length];
  const instProfile = INSTRUCTOR_PROFILES[i % INSTRUCTOR_PROFILES.length];
  const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const levelIdx = t.level === "Beginner" ? 0 : t.level === "Intermediate" ? 1 : 2;
  const catSetIdx = CATEGORY_SET[t.cat] ?? 0;
  const outcomes = OUTCOME_SETS[catSetIdx] ?? OUTCOME_SETS[0];
  const requirements = REQUIREMENT_SETS[levelIdx] ?? REQUIREMENT_SETS[0];
  const descriptionParagraphs = DESCRIPTION_TEMPLATES[t.cat] ?? DESCRIPTION_TEMPLATES.Development;

  return {
    _id: `course-${String(i + 1).padStart(3, "0")}`,
    id: `course-${String(i + 1).padStart(3, "0")}`,
    slug,
    title: t.title,
    category: t.cat,
    categoryId: { _id: `cat-${t.cat.toLowerCase()}`, name: t.cat },
    instructor: inst.name,
    instructorId: { _id: `inst-${i}`, name: inst.name, avatar: inst.avatar, slug: `${inst.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` },
    instructorAvatar: inst.avatar,
    instructorRole: instProfile.role,
    instructorBio: instProfile.bio,
    instructorStudents: instProfile.students + (i % 3) * 1200,
    instructorCourses: instProfile.courses + (i % 4),
    thumbnail: THUMBNAILS[i % THUMBNAILS.length],
    rating: Math.round(rating * 10) / 10,
    reviewCount,
    level: t.level,
    duration,
    lessons,
    price: p.price,
    discountPrice: p.discountPrice,
    originalPrice: p.price,
    effectivePrice: effective,
    isFree,
    students: enrollment,
    enrollmentCount: enrollment,
    popularity: ((enrollment + reviewCount) * (rating / 5)) | 0,
    createdAt: new Date(2026, 8, 28 - ((i * 3) % 200)).toISOString(),
    shortDescription: `Master ${t.title.toLowerCase()} with hands-on projects, expert guidance, and lifetime access.`,
    description: descriptionParagraphs.map((text, idx) =>
      idx === 1
        ? `${text} ${t.title} is structured around ${descriptionParagraphs[2] || "real-world projects"}`.slice(0, 360) + "."
        : text
    ),
    learningOutcomes: outcomes,
    requirements,
    curriculum: curriculumFor(t, i),
    reviews: reviewsFor(rating, i, Math.min(6, 4 + (i % 3))),
  };
}

const COURSES = Array.from({ length: 24 }, (_, i) => makeCourse(i));

export { COURSES };
export default COURSES;
