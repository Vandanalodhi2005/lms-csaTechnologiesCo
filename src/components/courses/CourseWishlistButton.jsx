"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/utils";

export default function CourseWishlistButton({
  initialWishlisted = false,
  className,
  onToggle,
}) {
  const [wishlisted, setWishlisted] = React.useState(initialWishlisted);

  const handleClick = React.useCallback(
    (e) => {
      e?.preventDefault?.();
      setWishlisted((prev) => {
        const next = !prev;
        onToggle?.(next);
        return next;
      });
    },
    [onToggle]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={wishlisted}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 h-10 px-4 rounded-lg font-medium text-sm transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2",
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
      <span>{wishlisted ? "Added to Wishlist" : "Add to Wishlist"}</span>
    </button>
  );
}
