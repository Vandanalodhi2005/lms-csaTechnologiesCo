export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container-page py-8 md:py-10 xl:py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-5 w-52 rounded bg-slate-200" />
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 md:p-8 lg:p-10">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-200" />
              <div className="space-y-3">
                <div className="h-5 w-28 rounded-full bg-slate-200" />
                <div className="h-8 w-48 rounded bg-slate-200" />
                <div className="h-4 w-96 rounded bg-slate-200" />
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-24 rounded-2xl bg-slate-100" />
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <div className="h-12 w-full rounded-xl bg-slate-200" />
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-80 rounded-2xl bg-slate-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
