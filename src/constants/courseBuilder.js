export const courseBuilderOptions = {
  categories: [
    "Web Development",
    "Programming",
    "Data Science",
    "Design",
    "Business",
    "Marketing",
    "Cloud Computing",
  ],
  levels: ["Beginner", "Intermediate", "Advanced", "All Levels"],
  languages: ["English", "Hindi", "Hinglish"],
  lessonTypes: ["video", "article", "quiz", "assignment"],
  currencies: ["INR"],
};

export const initialCourse = {
  title: "",
  shortDescription: "",
  description: "",
  category: "",
  subcategory: "",
  level: "Beginner",
  language: "English",
  thumbnail: null,
  objectives: ["Students will build complete full-stack applications.", "Students will learn modern React and Next.js workflows."],
  requirements: ["Basic JavaScript knowledge", "A computer with internet access"],
  sections: [
    {
      id: "section-1",
      title: "Introduction",
      description: "Learn the fundamentals before building the project.",
      lessons: [
        {
          id: "lesson-1",
          title: "Welcome to the course",
          type: "video",
          description: "An overview of the learning path and project outcomes.",
          videoUrl: "/videos/react-introduction.mp4",
          duration: 12,
          freePreview: true,
          articleContent: "",
          resources: "",
        },
      ],
    },
  ],
  price: 4999,
  discountPrice: 2999,
  currency: "INR",
  status: "draft",
  visibility: "private",
};

export default courseBuilderOptions;
