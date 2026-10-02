"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatCurrency, formatDuration, truncateText, calculateDiscountPercentage } from "@/utils";
import {
  PlayCircle,
  Users,
  Clock,
  Star,
  Heart,
  BookOpen,
  Award,
} from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Avatar, { AvatarGroup } from "@/components/ui/Avatar.jsx";
import Rating from "@/components/ui/Rating.jsx";
import Button from "@/components/ui/Button.jsx";
import { COURSE_LEVELS } from "@/constants";

const levelStyles = {
  [COURSE_LEVELS.BEGINNER]: "success",
  [COURSE_LEVELS.INTERMEDIATE]: "warning",
  [COURSE_LEVELS.ADVANCED]: "danger",
  [COURSE_LEVELS.ALL_LEVELS]: "default",
};

export default function CourseCard({
  course,
  variant = "default",
  showWishlist = true,
  wishlisted = false,
  onToggleWishlist,
  progress,
  progressPercent,
  lastLessonId,
  className,
  showInstructor = true,
  compact = false,
}) {
  const effectivePrice = course.discountPrice != null ? course.discountPrice : course.price;
  const discount = calculateDiscountPercentage(course.price, course.discountPrice);
  const isFree = effectivePrice === 0;
  const instructor = course.instructorId || { name: course.instructor };
  const category = course.categoryId || { name: course.category };

  if (variant === "home") {
    return (
      <article
        className={cn(
          "group rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col",
          className
        )}
      >
        <Link
          href={`/courses/${course.slug || course._id}`}
          className="relative block bg-[#F1F5F9] aspect-[16/10] overflow-hidden"
        >
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#EFF6FF] via-white to-[#F8FAFC]">
              <BookOpen className="h-14 w-14 text-[#BFDBFE]" />
            </div>
          )}
        </Link>
        <div className="p-4 sm:p-5 flex flex-col flex-1 gap-2.5">
          {category?.name && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#2563EB]">
                {category.name}
              </span>
            </div>
          )}
          <Link href={`/courses/${course.slug || course._id}`} className="group/link">
            <h3 className="font-semibold text-[#0F172A] leading-snug line-clamp-2 group-hover/link:text-[#2563EB] transition-colors">
              {course.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-[#F59E0B]">
              <Star className="h-4 w-4 fill-[#F59E0B]" />
              <span className="font-semibold text-[#0F172A] tabular-nums">
                {(course.rating || 0).toFixed(1)}
              </span>
            </div>
            {typeof course.reviewCount === "number" && (
              <span className="text-[#64748B]">({course.reviewCount})</span>
            )}
          </div>
          {showInstructor && instructor?.name && (
            <div className="text-sm text-[#64748B] truncate">By {instructor.name}</div>
          )}
          <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#E2E8F0]">
            <div className="text-xl font-bold text-[#0F172A] tabular-nums">
              {isFree ? (
                <span className="text-[#16A34A]">Free</span>
              ) : (
                <>${effectivePrice}</>
              )}
            </div>
            <Button
              asChild
              size="sm"
              variant="default"
              className="text-xs h-8 px-3"
            >
              <Link href={`/courses/${course.slug || course._id}`}>Enroll Now</Link>
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <Card
      hoverable
      className={cn(
        "group overflow-hidden flex flex-col",
        compact && "flex-row",
        className
      )}
    >
      <Link
        href={`/courses/${course.slug || course._id}`}
        className={cn(
          "relative overflow-hidden block bg-dark-100",
          compact ? "w-44 sm:w-56 shrink-0" : "aspect-[16/10]"
        )}
      >
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 via-primary-50 to-white">
            <BookOpen className="h-14 w-14 text-primary-200" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[85%]">
          {category.name && (
            <Badge variant="default" size="sm" className="bg-white/95 text-dark-700 backdrop-blur border-white shadow-sm">
              {category.name}
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="danger" size="sm">
              -{discount}% OFF
            </Badge>
          )}
          {isFree && (
            <Badge variant="success" size="sm">
              FREE
            </Badge>
          )}
        </div>

        {showWishlist && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist?.(course);
            }}
            className={cn(
              "absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-all backdrop-blur",
              wishlisted
                ? "bg-danger-50 text-danger hover:bg-danger hover:text-white"
                : "bg-white/90 text-dark-500 hover:bg-white hover:text-danger shadow-sm"
            )}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
          </button>
        )}

        {!compact && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
            <div className="h-14 w-14 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-xl scale-75 group-hover:scale-100 transition-transform">
              <PlayCircle className="h-7 w-7 text-primary-600 fill-primary-600/20" />
            </div>
          </div>
        )}

        {typeof progressPercent !== "undefined" && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-dark-200/50">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </Link>

      <CardContent className={cn(
        "flex flex-col flex-1 gap-3",
        compact ? "p-4 sm:p-5" : "p-5"
      )}>
        <div className="flex items-center gap-2.5 flex-wrap text-xs text-dark-500">
          {course.level && (
            <Badge variant={levelStyles[course.level] || "secondary"} size="sm" rounded="md" dot>
              {course.level}
            </Badge>
          )}
          {typeof course.duration === "number" && course.duration > 0 && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(course.duration)}
            </span>
          )}
          {typeof course.enrollmentCount === "number" && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course.enrollmentCount.toLocaleString()}
            </span>
          )}
        </div>

        <Link href={`/courses/${course.slug || course._id}`} className="group/link">
          <h3 className={cn(
            "font-semibold tracking-tight text-dark-900 group-hover/link:text-primary-700 transition-colors leading-snug",
            compact ? "text-sm sm:text-base line-clamp-2" : "text-base sm:text-lg line-clamp-2"
          )}>
            {course.title}
          </h3>
        </Link>

        {!compact && course.shortDescription && (
          <p className="text-sm text-dark-500 line-clamp-2 leading-relaxed -mt-1">
            {truncateText(course.shortDescription, 90)}
          </p>
        )}

        {showInstructor && instructor.name && (
          <div className="flex items-center gap-2 -mt-0.5">
            <Avatar src={instructor.avatar} name={instructor.name} size="xs" />
            <span className="text-sm text-dark-600 truncate">{instructor.name}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Rating
            value={course.rating || 0}
            size="sm"
            readOnly
            showValue
          />
          {typeof course.reviewCount === "number" && (
            <span className="text-xs text-dark-500">
              ({course.reviewCount.toLocaleString()})
            </span>
          )}
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between gap-3 border-t border-dark-100 pt-3">
          <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap">
            {isFree ? (
              <span className="text-lg sm:text-xl font-bold text-success">Free</span>
            ) : (
              <>
                <span className="text-lg sm:text-xl font-bold text-dark-900 tabular-nums">
                  {formatCurrency(effectivePrice)}
                </span>
                {discount > 0 && (
                  <span className="text-sm text-dark-400 line-through tabular-nums">
                    {formatCurrency(course.price)}
                  </span>
                )}
              </>
            )}
          </div>

          {typeof progressPercent !== "undefined" ? (
            <Button
              size="sm"
              asChild
              className="shrink-0"
            >
              <Link href={`/student/learning/${course._id}${lastLessonId ? `/lesson/${lastLessonId}` : ""}`}>
                {progressPercent >= 100 ? (
                  <>
                    <Award className="h-4 w-4" />
                    Review
                  </>
                ) : progressPercent > 0 ? (
                  "Continue"
                ) : (
                  "Start"
                )}
              </Link>
            </Button>
          ) : (
            <Button size="sm" asChild className="shrink-0">
              <Link href={`/courses/${course.slug || course._id}`}>
                View Details
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
