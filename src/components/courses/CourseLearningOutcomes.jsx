import { CheckCircle2 } from "lucide-react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";

export default function CourseLearningOutcomes({ outcomes = [] }) {
  const hasOutcomes = Array.isArray(outcomes) && outcomes.length > 0;

  return (
    <section aria-labelledby="what-you-learn-heading" id="what-you-learn">
      <Card className="border-[#E2E8F0] shadow-[0_10px_30px_-15px_rgba(15,47,95,0.2)]">
        <CardHeader className="pb-3">
          <CardTitle
            id="what-you-learn-heading"
            className="text-xl sm:text-2xl text-[#0F2F5F]"
          >
            What You&apos;ll Learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasOutcomes ? (
            <ul
              role="list"
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 sm:gap-y-4"
            >
              {outcomes.map((outcome, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    className="h-5 w-5 text-[#16A34A] shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <span className="text-sm sm:text-[15px] text-[#334155] leading-relaxed">
                    {outcome}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#64748B]">
              Learning outcomes are being finalized for this course.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
