import { Circle } from "lucide-react";

export default function CourseRequirements({ requirements = [] }) {
  const hasRequirements = Array.isArray(requirements) && requirements.length > 0;

  return (
    <section aria-labelledby="requirements-heading" id="requirements" className="space-y-4">
      <h2
        id="requirements-heading"
        className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F2F5F]"
      >
        Requirements
      </h2>
      {hasRequirements ? (
        <ul role="list" className="space-y-3">
          {requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="inline-flex h-5 w-5 items-center justify-center shrink-0 mt-0.5"
                aria-hidden
              >
                <Circle className="h-1.5 w-1.5 fill-[#2563EB] text-[#2563EB]" />
              </span>
              <span className="text-sm sm:text-[15px] text-[#334155] leading-relaxed">
                {req}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#64748B]">
          No specific prerequisites. This course is designed for all learners ready to begin.
        </p>
      )}
    </section>
  );
}
