import Link from "next/link";
import { ArrowRight, Star, Users, BookOpen } from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import Button from "@/components/ui/Button.jsx";

export default function CourseInstructor({ course }) {
  if (!course) return null;

  const instructor = course.instructorId || {};
  const name = instructor.name || course.instructor || "Course Instructor";
  const avatar = instructor.avatar || course.instructorAvatar;
  const role = course.instructorRole || "Course Instructor";
  const bio = course.instructorBio || "";
  const students = typeof course.instructorStudents === "number" ? course.instructorStudents : 0;
  const coursesCount = typeof course.instructorCourses === "number" ? course.instructorCourses : 1;
  const rating = typeof course.rating === "number" ? course.rating : 0;
  const profileSlug = instructor.slug || instructor._id;
  const profileHref = profileSlug ? `/instructors/${profileSlug}` : "#";

  return (
    <section aria-labelledby="instructor-heading" id="instructor">
      <h2
        id="instructor-heading"
        className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F2F5F] mb-4"
      >
        Your Instructor
      </h2>
      <Card className="border-[#E2E8F0] shadow-[0_10px_30px_-15px_rgba(15,47,95,0.2)]">
        <CardContent className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row gap-5">
            <Avatar
              src={avatar}
              name={name}
              size="3xl"
              ring
              className="ring-[#EFF6FF] sm:shrink-0"
            />
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#0F172A]">
                  {name}
                </h3>
                <p className="text-sm text-[#2563EB] font-medium">{role}</p>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#475569]">
                <div className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="font-semibold text-[#0F172A] tabular-nums">
                    {rating.toFixed(1)} Instructor Rating
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#2563EB]" />
                  <span className="tabular-nums">{students.toLocaleString()} Students</span>
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-[#2563EB]" />
                  <span className="tabular-nums">{coursesCount} Courses</span>
                </div>
              </div>

              {bio ? (
                <p className="text-sm sm:text-[15px] text-[#334155] leading-7 whitespace-pre-line">
                  {bio}
                </p>
              ) : null}
            </div>
          </div>

          <div className="pt-2">
            <Button
              asChild
              variant="outline"
              size="default"
              className="group"
            >
              <Link href={profileHref} aria-label={`View profile for ${name}`}>
                View Instructor Profile
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
