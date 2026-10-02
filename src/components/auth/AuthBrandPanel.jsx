import Link from "next/link";
import Image from "next/image";
import { BookOpen, CheckCircle2, GraduationCap, Award, Globe, Users } from "lucide-react";

const FEATURES = [
  { icon: GraduationCap, text: "Learn at your own pace" },
  { icon: Award, text: "Get certified" },
  { icon: Globe, text: "Access from anywhere" },
  { icon: Users, text: "Learn from expert instructors" },
];

export default function AuthBrandPanel() {
  return (
    <div className="relative hidden lg:flex lg:flex-col lg:justify-between w-full h-full overflow-hidden rounded-3xl bg-[#0F2F5F] p-10 xl:p-14 text-white isolate">
      <div className="absolute inset-0 -z-10 opacity-70" aria-hidden="true"
        style={{
          background:
            "radial-gradient(1200px 500px at 10% 0%, rgba(37,99,235,0.35) 0%, rgba(15,47,95,0) 60%), radial-gradient(900px 600px at 100% 100%, rgba(22,163,74,0.18) 0%, rgba(15,47,95,0) 55%)",
        }}
      />
      <div className="absolute -top-28 -left-24 w-80 h-80 rounded-full bg-[#2563EB]/30 blur-3xl -z-10" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#16A34A]/20 blur-3xl -z-10" aria-hidden="true" />
      <div className="absolute bottom-16 left-10 h-40 w-40 rounded-[2rem] border border-white/10 rotate-12 -z-10" aria-hidden="true" />
      <div className="absolute top-24 right-16 h-24 w-24 rounded-2xl border border-white/10 -rotate-12 -z-10" aria-hidden="true" />

      <div>
        <Link href="/" aria-label="EduLearn home" className="inline-flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0F2F5F] shadow-lg shadow-black/10">
            <BookOpen className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            Edu<span className="text-[#60A5FA]">Learn</span>
          </span>
        </Link>
      </div>

      <div className="my-10 xl:my-16 max-w-md">
        <h2 className="text-3xl xl:text-4xl font-extrabold leading-[1.1] tracking-tight">
          Your Learning Journey
          <br />
          <span className="text-[#60A5FA]">Starts Here</span>
        </h2>
        <p className="mt-5 text-[#CBD5E1] text-base leading-relaxed">
          Learn new skills, achieve your goals, and grow with expert-led courses.
        </p>

        <ul className="mt-8 space-y-4">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/10">
                <CheckCircle2 className="h-4.5 w-4.5 text-[#86EFAC]" style={{ height: 18, width: 18 }} strokeWidth={2.4} />
              </span>
              <span className="text-sm font-medium text-white/90">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces",
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
              "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces",
            ].map((src) => (
              <div
                key={src}
                className="relative h-9 w-9 rounded-full border-2 border-[#0F2F5F] overflow-hidden bg-white/10"
              >
                <Image src={src} alt="" aria-hidden="true" fill sizes="36px" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">10K+ Learners</p>
            <p className="text-xs text-white/60">already enrolled</p>
          </div>
        </div>
        <div className="text-right leading-tight">
          <p className="text-sm font-bold text-[#FCD34D]">4.8/5</p>
          <p className="text-xs text-white/60">Average rating</p>
        </div>
      </div>
    </div>
  );
}
