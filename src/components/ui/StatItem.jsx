import { cn } from "@/utils";

export default function StatItem({ value, label, icon: Icon, className }) {
  return (
    <div className={cn("flex flex-col items-start sm:items-center gap-2", className)}>
      <div className="flex items-baseline gap-2">
        {Icon && <Icon className="h-6 w-6 text-[#2563EB]" aria-hidden="true" />}
        <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] tabular-nums">
          {value}
        </span>
      </div>
      <span className="text-sm text-[#64748B]">{label}</span>
    </div>
  );
}
