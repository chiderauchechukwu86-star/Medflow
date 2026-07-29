import { LucideIcon } from "lucide-react";
import Card from "./Card";

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "teal",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "teal" | "sky" | "amber" | "coral" | "green";
}) {
  const accentMap: Record<string, string> = {
    teal: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    sky: "bg-sky-500/10 text-sky-500",
    amber: "bg-vital-amber/10 text-vital-amber",
    coral: "bg-vital-coral/10 text-vital-coral",
    green: "bg-vital-green/10 text-vital-green",
  };

  return (
    <Card className="flex items-center gap-4" hoverable>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accentMap[accent]}`}>
        <Icon size={21} strokeWidth={1.9} />
      </div>
      <div>
        <p className="font-data text-[1.7rem] font-semibold leading-none tracking-tight">{value}</p>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">{label}</p>
      </div>
    </Card>
  );
}
