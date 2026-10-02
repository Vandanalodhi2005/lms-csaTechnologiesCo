"use client";

import * as React from "react";
import { cn, getInitials } from "@/utils";
import Image from "next/image";

const avatarSizes = {
  "2xs": "h-6 w-6 text-[10px]",
  xs: "h-7 w-7 text-xs",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-sm",
  xl: "h-14 w-14 text-base",
  "2xl": "h-16 w-16 text-base",
  "3xl": "h-20 w-20 text-lg",
  "4xl": "h-24 w-24 text-xl",
};

const avatarColors = [
  "bg-primary-100 text-primary-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
  "bg-fuchsia-100 text-fuchsia-700",
];

function getAvatarColor(name) {
  if (!name) return avatarColors[0];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
}

export const Avatar = React.forwardRef(function Avatar(
  {
    src,
    alt = "",
    name,
    size = "md",
    className,
    fallback,
    showFallback = true,
    rounded = true,
    ring,
    ...props
  },
  ref
) {
  const [imgError, setImgError] = React.useState(false);
  const colorClass = React.useMemo(() => getAvatarColor(name || fallback), [name, fallback]);
  const hasImage = src && !imgError;

  return (
    <span
      ref={ref}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden font-semibold",
        avatarSizes[size],
        rounded ? "rounded-full" : "rounded-lg",
        ring && "ring-2 ring-white",
        !hasImage && colorClass,
        className
      )}
      {...props}
    >
      {hasImage ? (
        <Image
          src={src}
          alt={alt || name || "Avatar"}
          fill
          sizes="64px"
          onError={() => setImgError(true)}
          className="object-cover"
        />
      ) : showFallback ? (
        <span aria-hidden>{name ? getInitials(name) : fallback || "?"}</span>
      ) : null}
    </span>
  );
});

const AvatarGroup = ({ children, limit = 4, size = "md", className }) => {
  const items = React.Children.toArray(children).filter(Boolean);
  const visible = items.slice(0, limit);
  const hiddenCount = Math.max(0, items.length - limit);
  const ringSize = size === "sm" || size === "xs" || size === "2xs" ? "ring-1" : "ring-2";
  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visible.map((child, idx) =>
        React.cloneElement(child, {
          size,
          className: cn(child.props.className, `${ringSize} ring-white`),
        })
      )}
      {hiddenCount > 0 && (
        <span
          className={cn(
            "relative inline-flex shrink-0 items-center justify-center font-semibold bg-dark-100 text-dark-600 border-2 border-white",
            avatarSizes[size],
            "rounded-full"
          )}
        >
          <span className="text-xs">+{hiddenCount}</span>
        </span>
      )}
    </div>
  );
};

const AvatarFallback = React.forwardRef(function AvatarFallback(
  { className, children, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center font-semibold text-white",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

export { AvatarGroup, AvatarFallback };
export default Avatar;
