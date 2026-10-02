export default function CourseDescription({ description = [] }) {
  const paragraphs = Array.isArray(description) ? description : [description];
  const hasContent = paragraphs.some((p) => p && typeof p === "string" && p.length > 0);

  return (
    <section aria-labelledby="description-heading" id="description" className="space-y-4">
      <h2
        id="description-heading"
        className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F2F5F]"
      >
        Course Description
      </h2>
      <div className="space-y-4 text-[#334155] text-sm sm:text-[15px] leading-7 sm:leading-8">
        {hasContent ? (
          paragraphs.filter(Boolean).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))
        ) : (
          <p className="text-[#64748B]">
            A detailed course description is on its way. In the meantime, check out the
            curriculum below to get a sense of what&apos;s covered.
          </p>
        )}
      </div>
    </section>
  );
}
