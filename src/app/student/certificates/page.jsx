"use client";

import * as React from "react";
import Link from "next/link";
import {
  Award,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  X,
  Printer,
  Copy,
  Linkedin,
} from "lucide-react";
import { cn } from "@/utils";
import { toast } from "sonner";

const CERTIFICATES = [
  {
    id: "EDU-TS-89412",
    title: "Full Stack Web Development Masterclass",
    instructor: "Sarah Jenkins & The EduLearn Engineering Faculty",
    issueDate: "October 12, 2026",
    credentialId: "EDU-TS-89412-2026",
    hours: "48 Hours",
    grade: "Grade: 98% (Distinction)",
    category: "Software Engineering",
    description: "Demonstrated master-level proficiency in React Server Components, Next.js 14, Node.js microservices, and database architecture.",
  },
  {
    id: "EDU-RN-77301",
    title: "React Native & Expo: Cross-Platform Mobile Architect",
    instructor: "Liam O'Connor & Mobile Guild",
    issueDate: "September 28, 2026",
    credentialId: "EDU-RN-77301-2026",
    hours: "36 Hours",
    grade: "Grade: 95% (Honors)",
    category: "Mobile Engineering",
    description: "Successfully built and deployed production iOS and Android applications with native animation drivers and state persistence.",
  },
  {
    id: "EDU-UX-60293",
    title: "Advanced UI/UX Design System with Figma 2026",
    instructor: "Elena Rostova",
    issueDate: "September 15, 2026",
    credentialId: "EDU-UX-60293-2026",
    hours: "28 Hours",
    grade: "Grade: 100% (High Distinction)",
    category: "Product Design",
    description: "Mastered tokenized design architectures, accessibility compliance (WCAG 2.1 AAA), and design-to-code component handoff.",
  },
];

export default function StudentCertificatesPage() {
  const [selectedCert, setSelectedCert] = React.useState(null);

  const copyCredentialLink = (certId) => {
    navigator.clipboard?.writeText(`https://edulearn.platform/verify/${certId}`);
    toast.success("Verification link copied to clipboard!");
  };

  const shareToLinkedIn = (title) => {
    toast.success(`Generated LinkedIn certification share link for ${title}`);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Accreditations & Honors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Earned Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official verified graduation diplomas with cryptographic hash verification and LinkedIn integration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toast.success("Exporting all credentials transcript summary (PDF)...");
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Official Transcript</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Earned Credentials</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">3 Certificates</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">100% Verified & Active</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-600 mt-2">1 Program</p>
          <p className="text-[11px] text-slate-500 mt-1">Python & Data Science Bootcamp</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Verification Rate</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">Accredited</p>
          <p className="text-[11px] text-slate-500 mt-1">Recognized by global hiring partners</p>
        </div>
      </div>

      {/* Certificate Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CERTIFICATES.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-3xl border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
          >
            {/* Visual Certificate Miniature */}
            <div className="p-6 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white relative flex flex-col items-center text-center justify-center min-h-[160px] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/30 text-amber-300 flex items-center justify-center mb-3 shadow-lg">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                EduLearn Certified
              </p>
              <h3 className="font-bold text-sm text-white mt-1 px-4 line-clamp-1">
                {cert.title}
              </h3>
              <p className="text-[10px] text-slate-300 mt-1">Issued to Alex Morgan</p>
            </div>

            {/* Certificate Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{cert.category}</span>
                  <span>{cert.issueDate}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {cert.title}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {cert.description}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-600 font-semibold">{cert.id}</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {cert.grade}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-500/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Official Diploma</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      toast.success(`Downloading high-res PDF for ${cert.id}`);
                    }}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => shareToLinkedIn(cert.title)}
                    className="flex-1 py-2 rounded-xl bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">
                  Official Verification ID: {selectedCert.credentialId}
                </span>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Diploma Canvas */}
            <div className="p-6 sm:p-10 overflow-y-auto bg-[#FDFCF7] text-slate-900">
              <div className="border-4 border-double border-amber-600/40 rounded-3xl p-6 sm:p-10 text-center relative bg-white shadow-inner space-y-6">
                {/* Crest & Title */}
                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center mx-auto shadow-md">
                    <Award className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-black tracking-wider text-slate-900 uppercase">
                    Certificate of Graduation
                  </h2>
                  <p className="text-xs uppercase font-sans tracking-widest text-slate-400">
                    EduLearn International Academy of Technology
                  </p>
                </div>

                {/* Recipient */}
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-serif italic">This is proudly presented to</p>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-blue-900 underline decoration-amber-400 decoration-2 underline-offset-8">
                    Alex Morgan
                  </h3>
                </div>

                {/* Course Completed */}
                <div className="max-w-xl mx-auto space-y-2 text-xs sm:text-sm text-slate-600">
                  <p>
                    for successfully demonstrating mastery and completing all rigorous theoretical and practical requirements for:
                  </p>
                  <p className="font-bold text-slate-900 text-base sm:text-lg">
                    {selectedCert.title}
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    {selectedCert.description}
                  </p>
                </div>

                {/* Signatures & Seal Row */}
                <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 items-end text-center">
                  <div className="space-y-1">
                    <p className="font-serif italic font-bold text-slate-800 text-sm">
                      Sarah Jenkins
                    </p>
                    <div className="h-0.5 bg-slate-300 w-24 mx-auto" />
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">
                      Faculty Director
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-600 font-bold text-[9px] uppercase tracking-tighter shadow-sm bg-amber-50">
                      Accredited
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono mt-1">
                      {selectedCert.id}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800 text-xs">
                      {selectedCert.issueDate}
                    </p>
                    <div className="h-0.5 bg-slate-300 w-24 mx-auto" />
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">
                      Date Issued
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => copyCredentialLink(selectedCert.id)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Verification URL</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => toast.success("Downloading PDF Diploma")}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
