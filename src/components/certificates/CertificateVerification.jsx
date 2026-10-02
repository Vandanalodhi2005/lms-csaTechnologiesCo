export default function CertificateVerification({ certificate }) {
  return (
    <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-[#0F172A]">Certificate Verification</h2>
        <span className="inline-flex items-center rounded-full border border-[#BBF7D0] bg-[#ECFDF5] px-2.5 py-1 text-xs font-semibold text-[#166534]">
          Verified
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <p className="text-sm text-[#64748B]">Verification Code</p>
        <p className="mt-2 text-lg font-bold tracking-wide text-[#0F172A]">{certificate.verificationCode}</p>
      </div>

      <p className="mt-4 text-sm leading-7 text-[#475569]">
        This certificate was issued by EduLearn for successful completion of the course.
      </p>
    </section>
  );
}
