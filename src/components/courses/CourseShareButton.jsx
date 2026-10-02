"use client";

import * as React from "react";
import { Share2, Check, Copy } from "lucide-react";
import { cn } from "@/utils";

export default function CourseShareButton({ className, courseTitle, url }) {
  const [state, setState] = React.useState("idle");
  const timeoutRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const resetState = React.useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setState("idle");
    }, 2500);
  }, []);

  const handleShare = React.useCallback(
    async (e) => {
      e?.preventDefault?.();

      const shareUrl = typeof url === "string" && url.length > 0
        ? url
        : (typeof window !== "undefined" ? window.location.href : "");
      const shareTitle = courseTitle || "Course";

      setState("pending");

      try {
        const canNativeShare =
          typeof navigator !== "undefined" &&
          typeof navigator.share === "function" &&
          typeof navigator.canShare === "function";

        const shareData = {
          title: shareTitle,
          url: shareUrl,
        };

        if (canNativeShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setState("idle");
          return;
        }

        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(shareUrl);
          setState("copied");
          resetState();
          return;
        }

        if (typeof document !== "undefined") {
          const input = document.createElement("textarea");
          input.value = shareUrl;
          input.setAttribute("readonly", "");
          input.style.position = "absolute";
          input.style.left = "-9999px";
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
          setState("copied");
          resetState();
        }
      } catch (err) {
        setState("idle");
      }
    },
    [url, courseTitle, resetState]
  );

  const isCopied = state === "copied";
  const Icon = isCopied ? Check : Copy;

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={state === "pending"}
      aria-live="polite"
      aria-label={isCopied ? "Course link copied to clipboard" : "Share course link"}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 h-10 px-4 rounded-lg font-medium text-sm transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2",
        "border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]",
        isCopied && "border-[#16A34A]/30 bg-[#F0FDF4] text-[#15803D]",
        state === "pending" && "opacity-70 cursor-wait",
        className
      )}
    >
      <Share2 className="h-4 w-4" aria-hidden />
      <span>{isCopied ? "Course link copied" : "Share"}</span>
    </button>
  );
}
