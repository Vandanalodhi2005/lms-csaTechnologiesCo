"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Card from "@/components/ui/Card.jsx";

export default function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="border-[#0F172A]/10 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 text-left p-5 hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <h4 className="font-semibold text-[#0F172A] pr-4">{q}</h4>
        <div className="flex-shrink-0 mt-0.5">
          {open ? (
            <ChevronUp className="h-5 w-5 text-[#2563EB]" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#0F172A]/40" />
          )}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 -mt-2">
          <p className="text-[#0F172A]/65 leading-relaxed">{a}</p>
        </div>
      )}
    </Card>
  );
}
