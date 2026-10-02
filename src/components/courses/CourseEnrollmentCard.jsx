"use client";

import * as React from "react";
import Image from "next/image";
import {
  Play,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  FileText,
  Lock,
} from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import CourseWishlistButton from "@/components/courses/CourseWishlistButton.jsx";
import CourseShareButton from "@/components/courses/CourseShareButton.jsx";
import { cn, calculateDiscountPercentage } from "@/utils";

const BENEFITS = [
  { icon: ShieldCheck, label: "Lifetime access" },
  { icon: FileText, label: "Certificate of completion" },
  { icon: Smartphone, label: "Mobile and desktop access" },
  { icon: Lock, label: "Course resources download" },
];

export default function CourseEnrollmentCard({ course }) {
  const [showNotice, setShowNotice] = React.useState(false);
  const [enrolling, setEnrolling] = React.useState(false);

  const handleEnrollment = React.useCallback((e) => {
    e?.preventDefault?.();
    setEnrolling(true);
    window.setTimeout(() => {
      setEnrolling(false);
      setShowNotice(true);
    }, 600);
  }, []);

  if (!course) return null;

  const price = typeof course.price === "number" ? course.price : 0;
  const effectivePrice =
    typeof course.discountPrice === "number" ? course.discountPrice : price;
  const isFree = effectivePrice === 0;
  const discount = calculateDiscountPercentage(price, course.discountPrice);

  return (
    <aside aria-label="Course enrollment card" className="w-full">
      <Card className="border-[#E2E8F0] shadow-[0_10px_30px_-15px_rgba(15,47,95,0.2)] overflow-hidden">
        <div className="relative aspect-[16/10] bg-[#F1F5F9] overflow-hidden">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover"
            />
          ) : null}
          <button
            type="button"
            onClick={() => setShowNotice(true)}
            aria-label="Open course preview (coming soon)"
            className="absolute inset-0 group"
          >
            <span className="absolute inset-0 bg-gradient-to-t from-[#0F2F5F]/40 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="relative inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/95 backdrop-blur shadow-xl ring-1 ring-black/5 group-hover:scale-105 transition-transform">
                <Play
                  className="h-6 w-6 sm:h-7 sm:w-7 text-[#0F2F5F] translate-x-0.5"
                  fill="#0F2F5F"
                  aria-hidden
                />
              </span>
            </span>
          </button>
        </div>

        <CardContent className="p-5 sm:p-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-end gap-2 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold text-[#0F172A] tabular-nums leading-none">
                {isFree ? (
                  <span className="text-[#16A34A]">Free</span>
                ) : (
                  `$${effectivePrice}`
                )}
              </span>
              {!isFree && price > effectivePrice ? (
                <span className="text-lg text-[#94A3B8] line-through tabular-nums">
                  ${price}
                </span>
              ) : null}
              {!isFree && discount > 0 ? (
                <Badge variant="danger" size="sm">
                  -{discount}% OFF
                </Badge>
              ) : null}
            </div>
            {!isFree ? (
              <div className="text-xs text-[#64748B]">
                or 3 monthly payments of{" "}
                <span className="font-semibold text-[#0F172A] tabular-nums">
                  ${Math.ceil(effectivePrice / 3)}
                </span>
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Button
              variant="default"
              size="lg"
              className="w-full h-12 text-base font-semibold"
              onClick={handleEnrollment}
              loading={enrolling}
              disabled={enrolling}
            >
              {isFree ? "Enroll Free" : "Enroll Now"}
            </Button>
            {showNotice ? (
              <div
                role="status"
                className="rounded-lg border border-[#2563EB]/20 bg-[#EFF6FF] px-3 py-2 text-xs sm:text-sm text-[#1D4ED8] leading-relaxed"
              >
                Enrollment will be available soon. This button is a placeholder
                for a future payment integration.
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <CourseWishlistButton />
              <CourseShareButton courseTitle={course.title} />
            </div>
          </div>

          <div className="border-t border-[#E2E8F0] pt-5 space-y-3">
            <div className="text-sm font-semibold text-[#0F172A]">
              This course includes:
            </div>
            <ul role="list" className="space-y-2.5">
              {BENEFITS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-2.5 text-sm text-[#334155]">
                  <CheckCircle2
                    className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
