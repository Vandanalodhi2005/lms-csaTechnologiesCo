export const courseLessons = {
  "react-nextjs-complete-course": {
    course: {
      slug: "react-nextjs-complete-course",
      title: "React & Next.js Complete Course",
      category: "Development",
      level: "Beginner",
      durationLabel: "12h 40m",
      lessonCount: 7,
      instructorName: "Sarah Johnson",
      instructorSlug: "sarah-johnson",
      instructorRole: "Senior Full Stack Engineer",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1600&h=900&fit=crop",
    },
    sections: [
      {
        sectionId: "section-01",
        sectionTitle: "Getting Started",
        lessons: [
          {
            id: "lesson-01",
            title: "Introduction to React",
            duration: "12:35",
            type: "video",
            videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            poster:
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=675&fit=crop",
            description:
              "In this lesson, you'll learn the fundamentals of React and understand how components work together to build modern user interfaces.",
            isPreview: true,
            isLocked: false,
            isCompleted: true,
          },
          {
            id: "lesson-02",
            title: "Setting Up Your React Project",
            duration: "15:22",
            type: "video",
            videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            poster:
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop",
            description:
              "Get your development environment ready, install the right tools, and create a clean starter project with a fast local workflow.",
            isPreview: false,
            isLocked: false,
            isCompleted: false,
          },
          {
            id: "lesson-03",
            title: "Components and Props",
            duration: "17:10",
            type: "video",
            videoUrl: "",
            poster:
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=675&fit=crop",
            description:
              "Break down the building blocks of React and see how reusable components can share structure, behavior, and data.",
            isPreview: false,
            isLocked: true,
            isCompleted: false,
          },
        ],
      },
      {
        sectionId: "section-02",
        sectionTitle: "React Fundamentals",
        lessons: [
          {
            id: "lesson-04",
            title: "State and Events",
            duration: "21:45",
            type: "video",
            videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            poster:
              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=675&fit=crop",
            description:
              "Learn why state matters in user interfaces and how event handlers drive interactive behavior in React applications.",
            isPreview: false,
            isLocked: false,
            isCompleted: true,
          },
          {
            id: "lesson-05",
            title: "Rendering Lists and Keys",
            duration: "14:03",
            type: "video",
            videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            poster:
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=675&fit=crop",
            description:
              "Map data to UI, understand efficient list rendering, and avoid common mistakes when working with dynamic collections.",
            isPreview: false,
            isLocked: false,
            isCompleted: false,
          },
          {
            id: "lesson-06",
            title: "Hooks in Practice",
            duration: "18:29",
            type: "video",
            videoUrl: "",
            poster:
              "https://images.unsplash.com/photo-1516321165241-4aa89a48be28?w=1200&h=675&fit=crop",
            description:
              "Exercise practical hooks patterns for managing state, effects, and reusable logic while keeping components readable.",
            isPreview: false,
            isLocked: true,
            isCompleted: false,
          },
        ],
      },
      {
        sectionId: "section-03",
        sectionTitle: "Next.js Foundations",
        lessons: [
          {
            id: "lesson-07",
            title: "Routing and Layouts",
            duration: "19:15",
            type: "video",
            videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            poster:
              "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=675&fit=crop",
            description:
              "Organize your app with route segments, layouts, and nested navigation patterns that make your product easier to scale.",
            isPreview: false,
            isLocked: false,
            isCompleted: false,
          },
        ],
      },
    ],
  },
};

export const allCourseLessons = courseLessons;
