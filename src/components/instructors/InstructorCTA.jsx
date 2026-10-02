import Link from "next/link";
import Button from "@/components/ui/Button.jsx";

export default function InstructorCTA() {
  return (
    <section className="rounded-[30px] bg-[#0F2F5F] px-6 py-8 text-white shadow-sm md:px-8 md:py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-100">
            Teach with us
          </p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Share Your Knowledge With the World
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">
            Join EduLearn as an instructor and help students develop practical skills for their careers.
          </p>
        </div>

        <Link href="/auth/register">
          <Button variant="outline" className="h-11 rounded-xl border-white bg-white text-[#0F2F5F] hover:bg-slate-100">
            Become an Instructor
          </Button>
        </Link>
      </div>
    </section>
  );
}
