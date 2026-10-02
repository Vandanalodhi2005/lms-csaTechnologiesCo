import * as React from "react";
import { cn } from "@/utils";

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-dark-100", className)}
      {...props}
    />
  );
};

const SkeletonCard = ({ className }) => (
  <div className={cn("rounded-xl border border-dark-100 bg-white p-6 space-y-4", className)}>
    <div className="space-y-2">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <Skeleton className="h-32 w-full rounded-lg" />
    <div className="grid grid-cols-3 gap-3">
      <Skeleton className="h-8 rounded-lg" />
      <Skeleton className="h-8 rounded-lg" />
      <Skeleton className="h-8 rounded-lg" />
    </div>
  </div>
);

const SkeletonText = ({ lines = 3, className }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-4 rounded"
        style={{ width: `${lines === 1 ? "100%" : i === lines - 1 ? "50%" : `${100 - (i * 10)}%`}` }}
      />
    ))}
  </div>
);

const SkeletonAvatar = ({ size = "md", className }) => {
  const sizes = { sm: "h-8 w-8", md: "h-12 w-12", lg: "h-16 w-16" };
  return <Skeleton className={cn("rounded-full", sizes[size], className)} />;
};

const SkeletonTableRow = ({ columns = 5 }) => (
  <tr className="border-b border-dark-100">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton
          className="h-4 rounded"
          style={{ width: `${Math.random() * 50 + 30}%` }}
        />
      </td>
    ))}
  </tr>
);

export { SkeletonCard, SkeletonText, SkeletonAvatar, SkeletonTableRow };
export default Skeleton;
