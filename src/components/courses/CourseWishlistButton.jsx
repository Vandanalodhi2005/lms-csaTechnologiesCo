"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/utils";

export default function CourseWishlistButton({
  courseId,
  initialWishlisted = false,
  className,
  onToggle,
}) {
  const [wishlisted, setWishlisted] = React.useState(initialWishlisted);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    async function loadWishlistState() {
      try {
        const response = await fetch(`/api/users?action=isInWishlist&courseId=${encodeURIComponent(courseId)}`, { cache: "no-store" });
        const result = await response.json();
        if (response.ok && result.success && !cancelled) setWishlisted(Boolean(result.data));
      } catch {
        if (!cancelled) setError("Could not load wishlist status.");
      }
    }
    loadWishlistState();
    return () => { cancelled = true; };
  }, [courseId]);

  const handleClick = async (event) => {
    event?.preventDefault?.();
    if (loading || !courseId) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/users?action=toggleWishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Sign in to save courses to your wishlist.");
      const next = Boolean(result.data?.wishlisted);
      setWishlisted(next);
      onToggle?.(next);
    } catch (requestError) {
      setError(requestError.message || "Could not update your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || !courseId}
        aria-pressed={wishlisted}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 h-10 px-4 rounded-lg font-medium text-sm transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          wishlisted
            ? "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]"
            : "border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]",
          className
        )}
      >
        <Heart
          className={cn("h-4 w-4 transition-all", wishlisted && "fill-current")}
          aria-hidden
        />
        <span>{loading ? "Saving…" : wishlisted ? "Added to Wishlist" : "Add to Wishlist"}</span>
      </button>
      {error ? <span className="mt-1 block text-xs text-red-700" role="alert">{error}</span> : null}
    </div>
  );
}
