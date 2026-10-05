import { Award, BadgeCheck } from "lucide-react";

function formatDisplayDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function CertificatePreview({ certificate }) {
  if (!certificate) return null;

  return (
    <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-6">
      <div className="rounded-[24px] border-[3px] border-[#0F2F5F] bg-white p-3 sm:p-6">
        <div className="rounded-[20px] border border-[#CBD5E1] bg-[#F8FAFC] p-4 sm:p-8">
          <div className="border border-[#D4DDEB] bg-white px-4 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F2F5F] text-white">
                  <Award className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">EduLearn</p>
                  <p className="text-sm text-[#475569]">Certificate of Completion</p>
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-[#D5E7FF] bg-[#EFF6FF] px-2.5 py-1 text-xs font-medium text-[#1D4ED8] sm:flex">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                Demo Record
              </div>
            </div>

            <div className="pt-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748B]">EduLearn</p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl lg:text-4xl">
                Certificate of Completion
              </h2>

              <p className="mt-6 text-sm text-[#475569] sm:text-base">This certificate is proudly presented to</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
                {certificate.student?.name || "Student Name"}
              </p>

              <p className="mt-5 text-sm leading-7 text-[#475569] sm:text-base">
                for successfully completing the course requirements for
              </p>
              <p className="mt-2 text-xl font-bold text-[#0F172A] sm:text-2xl">
                {certificate.course?.title || "Course Title"}
              </p>

              <div className="mt-8 grid gap-4 text-sm text-[#475569] sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">Course completed on</p>
                  <p className="mt-2 text-base font-semibold text-[#0F172A]">
                    {formatDisplayDate(certificate.completionDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">Issue date</p>
                  <p className="mt-2 text-base font-semibold text-[#0F172A]">
                    {formatDisplayDate(certificate.issueDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 border-t border-[#E2E8F0] pt-6 sm:grid-cols-2">
              <div>
                <div className="mb-3 h-px w-24 bg-[#CBD5E1]" aria-hidden="true" />
                <p className="text-sm font-semibold text-[#0F172A]">{certificate.instructor?.name || "Instructor Name"}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#64748B]">Instructor</p>
              </div>

              <div className="text-left sm:text-right">
                <div className="mb-3 ml-auto h-px w-24 bg-[#CBD5E1] sm:ml-0 sm:mr-0" aria-hidden="true" />
                <p className="text-sm font-semibold text-[#0F172A]">EduLearn</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#64748B]">Authorized</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-xs text-[#475569] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-semibold text-[#0F172A]">Certificate ID:</span> {certificate.certificateNumber}
              </div>
              <div>
                <span className="font-semibold text-[#0F172A]">Verification Code:</span> {certificate.verificationCode}
              </div>
            </div>

            {certificate.skills?.length ? (
              <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">Skills Covered</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {certificate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[#D5E7FF] bg-[#EFF6FF] px-2.5 py-1 text-xs font-medium text-[#1D4ED8]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
