import ReviewManagementClient from "@/components/admin/reviews/ReviewManagementClient.jsx";

export const metadata = {
  title: "Review Management | EduLearn Admin",
  description: "Manage EduLearn student reviews, ratings, and moderation.",
};

export default function AdminReviewsPage() {
  return <ReviewManagementClient />;
}
