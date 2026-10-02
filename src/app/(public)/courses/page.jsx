import CourseListing from "@/components/courses/CourseListing.jsx";

export const metadata = {
  title: "Browse Courses | EduLearn",
  description:
    "Explore expert-led online courses in development, design, business, marketing, data science, photography, and more with EduLearn. Start learning today.",
  keywords:
    "online courses, e-learning, development courses, design courses, business education, data science, photography tutorials, EduLearn",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: { canonical: "/courses" },
  openGraph: {
    title: "Browse Courses | EduLearn",
    description:
      "Explore expert-led online courses in development, design, business, marketing, data science, and more with EduLearn.",
    type: "website",
    url: "/courses",
    siteName: "EduLearn",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "EduLearn Browse Courses" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Courses | EduLearn",
    description:
      "Explore expert-led online courses in development, design, business, marketing, data science, and more with EduLearn.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function CoursesPage() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10 xl:py-12">
        <CourseListing />
      </div>
    </div>
  );
}
