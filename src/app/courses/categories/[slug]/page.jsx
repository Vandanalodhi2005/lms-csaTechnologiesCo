import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  BriefcaseBusiness,
  Camera,
  Code2,
  Database,
  Home,
  Megaphone,
  Palette,
  Star,
  Users,
} from "lucide-react";
import Header from "@/components/layout/Header.jsx";
import Footer from "@/components/layout/Footer.jsx";
import CategoryCourseSearch from "@/components/categories/CategoryCourseSearch.jsx";
import Button from "@/components/ui/Button.jsx";
import { categories } from "@/constants/categories.js";
import COURSES from "@/constants/courses.js";

const iconMap = {
  Code2,
  Palette,
  BriefcaseBusiness,
  Megaphone,
  Camera,
  Database,
};

function findCategory(slug) {
  if (!slug) return null;

  const value = String(slug).trim();

  return (
    categories.find(
      (category) =>
        category.slug === value ||
        category.id === value ||
        category.name.toLowerCase() === value.toLowerCase().replace(/-/g, " ")
    ) || null
  );
}

function getIcon(category) {
  const Icon = iconMap[category?.icon] || Code2;
  return <Icon className="h-7 w-7" aria-hidden="true" />;
}

export async function generateMetadata({ params }) {
  const category = findCategory(params?.slug);

  if (!category) {
    return {
      title: "Category Not Found | EduLearn",
      description: "This category could not be found.",
    };
  }

  return {
    title: `${category.name} Courses | EduLearn`,
    description: `Explore EduLearn ${category.name} courses and learn practical skills through expert-led training.`,
    keywords: [category.name, "EduLearn", "online learning", "course category"],
    openGraph: {
      title: `${category.name} Courses | EduLearn`,
      description: category.description,
      type: "website",
      url: `/courses/categories/${category.slug}`,
      siteName: "EduLearn",
    },
  };
}

export default async function CategoryDetailsPage({ params }) {
  const category = findCategory(params?.slug);

  if (!category) {
    notFound();
  }

  const categoryCourses = COURSES.filter((course) => course.category === category.name);
  const totalStudents = categoryCourses.reduce((sum, course) => sum + Number(course.students || course.enrollmentCount || 0), 0);
  const instructorCount = new Set(categoryCourses.map((course) => course.instructor)).size;
  const averageRating =
    categoryCourses.length > 0
      ? (categoryCourses.reduce((sum, course) => sum + Number(course.rating || 0), 0) / categoryCourses.length).toFixed(1)
      : "0.0";

  const stats = [
    { label: "Courses", value: categoryCourses.length },
    { label: "Students", value: totalStudents >= 1000 ? `${(totalStudents / 1000).toFixed(totalStudents >= 10000 ? 0 : 1).replace(/\.0$/, "")}K` : String(totalStudents) },
    { label: "Instructors", value: instructorCount },
    { label: "Average Rating", value: `${averageRating}` },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="container-page py-8 md:py-10 xl:py-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <li>
              <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-[#2563EB]">
                <Home className="h-4 w-4" aria-hidden="true" />
                <span>Home</span>
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/courses" className="transition-colors hover:text-[#2563EB]">
                Courses
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/courses/categories" className="transition-colors hover:text-[#2563EB]">
                Categories
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-slate-700">
              {category.name}
            </li>
          </ol>
        </nav>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB] shadow-sm">
                {getIcon(category)}
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1D4ED8]">
                  Course category
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    {category.name}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Button asChild size="lg" className="h-11 rounded-xl bg-[#0F2F5F] text-white hover:bg-[#143A72]">
                <Link href="/courses">Browse All Courses</Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  {stat.label === "Courses" ? <BookOpen className="h-4 w-4" aria-hidden="true" /> : null}
                  {stat.label === "Students" ? <Users className="h-4 w-4" aria-hidden="true" /> : null}
                  {stat.label === "Instructors" ? <Users className="h-4 w-4" aria-hidden="true" /> : null}
                  {stat.label === "Average Rating" ? <Star className="h-4 w-4" aria-hidden="true" /> : null}
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <CategoryCourseSearch category={category} courses={categoryCourses} />

        <section className="mt-10 rounded-[28px] bg-[#0F2F5F] px-6 py-8 text-white shadow-sm md:px-8 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Continue learning</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                Ready to Start Learning?
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">
                Explore more courses and build skills that help you grow your career with {category.name.toLowerCase()} expertise.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-11 rounded-xl bg-white text-[#0F2F5F] hover:bg-slate-100">
                <Link href="/courses">Browse All Courses</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
