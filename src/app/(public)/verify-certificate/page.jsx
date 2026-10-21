"use client";
import { useState } from "react";
import Link from "next/link";
import { Award, Search, CheckCircle, XCircle, Calendar, User, BookOpen, ExternalLink, Shield, Printer } from "lucide-react";

// Mock certificate data for demonstration
export default function CertificateVerificationPage() {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/users?action=verifyCertificate&code=${encodeURIComponent(certId.trim())}`, { cache: "no-store" });
      const payload = await response.json();
      if (response.status === 404) {
        setResult({ valid: false, certificateId: certId.trim() });
        return;
      }
      if (!response.ok || !payload.success) throw new Error(payload.message || "Certificate verification is unavailable.");
      const certificate = payload.data;
      setResult({
        valid: true,
        studentName: certificate.studentName || certificate.studentId?.name,
        course: certificate.courseName || certificate.courseId?.title,
        instructor: certificate.instructorName || certificate.instructorId?.name,
        completionDate: certificate.completionDate ? new Date(certificate.completionDate).toLocaleDateString() : "Not available",
        grade: certificate.grade || (certificate.percentage != null ? `${certificate.percentage}%` : "Completed"),
        certificateId: certificate.certificateId,
      });
    } catch (verifyError) {
      setError(verifyError.message || "Certificate verification is unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-900 py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Award className="w-7 h-7 text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Certificate Verification
          </h1>
          <p className="text-slate-400 text-lg mb-10">
            Verify an EduLearn certificate using its verification code.
          </p>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <label htmlFor="certificate-verification-code" className="sr-only">Certificate verification code</label>
            <input
              id="certificate-verification-code"
              type="text"
              placeholder="Enter verification code"
              value={certId}
              onChange={(e) => { setCertId(e.target.value); setResult(null); }}
              className="flex-1 px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <button
              type="submit"
              disabled={loading || !certId.trim()}
              className="px-6 py-4 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold rounded-2xl transition flex items-center justify-center gap-2 flex-shrink-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Search className="w-4 h-4" /> Verify</>
              )}
            </button>
          </form>

          <p className="text-slate-500 text-xs mt-4"><Shield className="w-3.5 h-3.5 inline mr-1" />Enter the verification code printed on the certificate.</p>
          {error ? <p role="alert" className="mx-auto mt-3 max-w-xl rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-800">{error}</p> : null}
        </div>
      </section>

      {/* Result */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-2xl">
          {result && result.valid && (
            <div className="bg-white rounded-3xl border-2 border-green-500 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                <h2 className="text-xl font-bold">Certificate Verified ✓</h2>
                <p className="text-green-200 text-sm mt-1">This is an authentic EduLearn certificate</p>
              </div>

              {/* Details */}
              <div className="p-8 space-y-5">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-full px-4 py-1.5 text-sm font-semibold">
                    <Award className="w-4 h-4" />
                    Certificate of Completion — {result.grade}
                  </div>
                </div>

                {[
                  { icon: User, label: "Student Name", value: result.studentName },
                  { icon: BookOpen, label: "Course", value: result.course },
                  { icon: User, label: "Instructor", value: result.instructor },
                  { icon: Calendar, label: "Completion Date", value: result.completionDate },
                  { icon: Award, label: "Certificate ID", value: result.certificateId },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">{item.label}</p>
                      <p className="text-slate-900 font-semibold">{item.value}</p>
                    </div>
                  </div>
                ))}

                <div className="text-center pt-2">
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Course on EduLearn
                  </Link>
                  <button type="button" onClick={() => window.print()} className="ml-4 inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <Printer className="h-4 w-4" aria-hidden="true" />Print certificate
                  </button>
                </div>
              </div>
            </div>
          )}

          {result && !result.valid && (
            <div className="bg-white rounded-3xl border-2 border-red-300 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 text-white text-center">
                <XCircle className="w-12 h-12 mx-auto mb-3" />
                <h2 className="text-xl font-bold">Certificate Not Found</h2>
                <p className="text-red-200 text-sm mt-1">We could not verify this certificate</p>
              </div>
              <div className="p-8 text-center">
                <p className="text-slate-600 mb-2">
                  No certificate was found with verification code: <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">{result.certificateId}</code>
                </p>
                <p className="text-slate-400 text-sm mb-6">
                  Please check the verification code and try again.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline">
                  Report an Issue
                </Link>
              </div>
            </div>
          )}

          {/* Info cards */}
          {!result && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
              {[
                { icon: Award, title: "Verified Credentials", desc: "Every EduLearn certificate has a unique ID that can be verified here." },
                { icon: Shield, title: "Tamper-Proof", desc: "Our certificates are digitally signed and cannot be forged or altered." },
                { icon: ExternalLink, title: "LinkedIn Ready", desc: "Share verified certificates directly on LinkedIn with one click." },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <card.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{card.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
