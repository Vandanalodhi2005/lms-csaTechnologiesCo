import { Suspense } from "react";
import Header from "@/components/layout/Header.jsx";
import Footer from "@/components/layout/Footer.jsx";
import InstructorSearch from "@/components/instructors/InstructorSearch.jsx";
import { instructors } from "@/constants/instructors.js";

export const metadata = {
  title: "Meet Our Instructors | EduLearn",
  description:
    "Learn from experienced instructors and industry experts through EduLearn courses.",
};

export default function InstructorsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="container-page py-8 md:py-10 xl:py-12">
        <Suspense
          fallback={
            <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8 lg:p-10">
              <div className="animate-pulse space-y-5">
                <div className="h-4 w-32 rounded-full bg-[#E2E8F0]" />
                <div className="h-10 w-3/4 rounded bg-[#E2E8F0]" />
                <div className="h-4 w-full rounded bg-[#E2E8F0]" />
                <div className="h-4 w-2/3 rounded bg-[#E2E8F0]" />
              </div>
            </div>
          }
        >
          <InstructorSearch instructors={instructors} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
