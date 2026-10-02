function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function CertificateInfo({ certificate }) {
  const rows = [
    { label: "Certificate ID", value: certificate.certificateNumber },
    { label: "Issue Date", value: formatDate(certificate.issueDate) },
    { label: "Completion Date", value: formatDate(certificate.completionDate) },
    { label: "Course", value: certificate.course?.title },
    { label: "Instructor", value: certificate.instructor?.name },
    { label: "Final Score", value: certificate.score ? `${certificate.score}%` : null },
    { label: "Status", value: certificate.status ? certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1) : null },
  ];

  return (
    <section className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">Certificate Information</h2>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">{row.label}</dt>
            <dd className="mt-2 text-base font-semibold text-[#0F172A]">{row.value || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
