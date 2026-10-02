import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, UserRound } from "lucide-react";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function CertificateCourseSummary({ certificate }) {
  return (
    <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold text-[#0F172A]">Course Information</h2>

      <div className="mt-5 overflow-hidden rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="relative h-36 w-full">
          <Image
            src={certificate.course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=900&fit=crop"}
            alt={certificate.course?.title || "Course thumbnail"}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-[#0F172A]">{certificate.course?.title}</h3>

          <div className="mt-4 space-y-3 text-sm text-[#475569]">
            <div className="flex items-center gap-3">
              <UserRound className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
              <span>{certificate.instructor?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock3 className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
              <span>{certificate.course?.duration || "12 Weeks"}</span>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
              <span>{formatDate(certificate.completionDate)}</span>
            </div>
          </div>

          <Link
            href={`/courses/${certificate.course?.slug || "course"}`}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0F2F5F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#143A72]"
          >
            View Course
          </Link>
        </div>
      </div>
    </section>
  );
}
