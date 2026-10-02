import { Star } from "lucide-react";
import Card, { CardContent } from "@/components/ui/Card.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import Rating from "@/components/ui/Rating.jsx";
import { formatDate, cn } from "@/utils";

export default function CourseReviews({ course }) {
  const reviews = Array.isArray(course?.reviews) ? course.reviews : [];
  const overallRating = typeof course?.rating === "number" ? course.rating : 0;
  const totalReviews = typeof course?.reviewCount === "number" ? course.reviewCount : reviews.length;

  const distribution = buildDistribution(reviews, overallRating, totalReviews);

  return (
    <section aria-labelledby="reviews-heading" id="reviews" className="space-y-5">
      <h2
        id="reviews-heading"
        className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F2F5F]"
      >
        Student Reviews
      </h2>

      <Card className="border-[#E2E8F0] shadow-[0_10px_30px_-15px_rgba(15,47,95,0.2)]">
        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-10">
            <div className="flex flex-col items-center lg:items-start gap-2 text-center lg:text-left">
              <div className="text-5xl sm:text-6xl font-bold text-[#0F2F5F] tabular-nums leading-none">
                {overallRating.toFixed(1)}
              </div>
              <Rating value={overallRating} size="md" readOnly />
              <div className="text-sm text-[#64748B]">
                {totalReviews.toLocaleString()} review{totalReviews === 1 ? "" : "s"}
              </div>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const pct = distribution[stars] || 0;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-10 text-sm text-[#0F172A]">
                      <span className="tabular-nums font-semibold">{stars}</span>
                      <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    </div>
                    <div
                      className="flex-1 h-2 rounded-full bg-[#E2E8F0] overflow-hidden"
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${stars} star reviews: ${pct}%`}
                    >
                      <div
                        className="h-full bg-[#F59E0B] rounded-full transition-[width] duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-xs text-[#64748B] tabular-nums">
                      {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {reviews.length > 0 ? (
        <ul role="list" className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id}>
              <Card className="border-[#E2E8F0]">
                <CardContent className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={review.avatar}
                      name={review.author}
                      size="lg"
                      ring
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="font-semibold text-[#0F172A] truncate">
                          {review.author}
                        </div>
                        <div className="text-xs text-[#64748B]">
                          {review.date ? formatDate(review.date) : null}
                        </div>
                      </div>
                      <Rating
                        value={review.rating || 0}
                        size="sm"
                        readOnly
                        showValue
                      />
                    </div>
                  </div>
                  {review.comment ? (
                    <p
                      className={cn(
                        "text-sm sm:text-[15px] text-[#334155] leading-7 pl-0 sm:pl-14"
                      )}
                    >
                      {review.comment}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Card className="border-[#E2E8F0]">
          <CardContent className="p-8 text-center space-y-2">
            <div className="text-base font-semibold text-[#0F2F5F]">
              No reviews yet
            </div>
            <p className="text-sm text-[#64748B]">
              Be the first to share your experience after enrolling in this course.
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

function buildDistribution(reviews, overallRating, totalReviews) {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (reviews.length > 0) {
    reviews.forEach((r) => {
      const s = Math.max(1, Math.min(5, Math.round(r.rating || 0)));
      counts[s] += 1;
    });
    const total = reviews.length;
    const result = {};
    for (let s = 1; s <= 5; s++) {
      result[s] = Math.round((counts[s] / total) * 100);
    }
    return result;
  }

  const roundedBase = Math.max(1, Math.min(5, Math.round(overallRating)));
  const weights = {
    5: roundedBase >= 4 ? 65 : roundedBase >= 3 ? 40 : 15,
    4: roundedBase >= 4 ? 22 : roundedBase >= 3 ? 30 : 25,
    3: roundedBase >= 4 ? 8 : roundedBase >= 3 ? 18 : 30,
    2: roundedBase >= 4 ? 3 : roundedBase >= 3 ? 8 : 20,
    1: roundedBase >= 4 ? 2 : roundedBase >= 3 ? 4 : 10,
  };
  return weights;
}
