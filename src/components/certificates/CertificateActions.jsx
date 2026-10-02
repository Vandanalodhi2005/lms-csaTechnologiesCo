"use client";

import { useState } from "react";
import { Check, Copy, Download, Share2, Printer } from "lucide-react";

export default function CertificateActions({ certificate }) {
  const [status, setStatus] = useState("");

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "EduLearn Certificate",
          text: `View my certificate for ${certificate?.course?.title || "EduLearn Course"}`,
          url: shareUrl,
        });
        setStatus("Shared successfully.");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setStatus("Certificate link copied.");
    } catch (error) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setStatus("Certificate link copied.");
      } catch {
        setStatus("Unable to share right now.");
      }
    }
  };

  return (
    <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print Certificate
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2F5F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#143A72]"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download / Print
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Share Certificate
        </button>
      </div>

      {status ? (
        <p className="mt-4 inline-flex items-center gap-2 text-sm text-[#0F172A]" aria-live="polite">
          {status === "Certificate link copied." || status === "Shared successfully." ? (
            <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4 text-slate-500" aria-hidden="true" />
          )}
          <span>{status}</span>
        </p>
      ) : null}
    </div>
  );
}
