import Link from "next/link";
import Header from "@/components/layout/Header.jsx";
import Footer from "@/components/layout/Footer.jsx";
import CategorySearch from "@/components/categories/CategorySearch.jsx";
import { categories as allCategories } from "@/constants/categories.js";

export const metadata = {
  title: "Course Categories | EduLearn",
  description:
    "Explore EduLearn course categories and discover courses across development, design, business, marketing, photography and data science.",
  keywords: [
    "course categories",
    "development",
    "design",
    "business",
    "marketing",
    "photography",
    "data science",
    "EduLearn",
  ],
};

export default function CourseCategoriesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="container-page py-8 md:py-10 xl:py-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <li>
              <Link href="/" className="transition-colors hover:text-[#2563EB]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/courses" className="transition-colors hover:text-[#2563EB]">
                Courses
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-slate-700">
              Categories
            </li>
          </ol>
        </nav>

        <CategorySearch categories={allCategories} />
      </main>

      <Footer />
    </div>
  );
}
