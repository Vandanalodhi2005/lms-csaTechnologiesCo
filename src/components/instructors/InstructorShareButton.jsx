"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import Button from "@/components/ui/Button.jsx";

export default function InstructorShareButton({ name, slug }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/instructors/${slug}`
        : `/instructors/${slug}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${name} | EduLearn`,
          text: `Learn from ${name} on EduLearn.`,
          url: shareUrl,
        });
        return;
      } catch (error) {
        // Ignore share cancellation and fall back to clipboard.
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="h-11 rounded-xl border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-slate-50"
      onClick={handleShare}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-600" />
          Copied
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share Profile
        </>
      )}
    </Button>
  );
}
