import { Card } from "./ui/card";

export function StatsCard({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-sky-400/30 via-blue-500/25 to-indigo-500/10 blur-lg" />
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/90 text-white shadow-[0_10px_30px_rgba(56,189,248,0.7)]">
          {icon}
        </div>
        <div>
          <div className="text-slate-300 text-sm">{label}</div>
          <div className="text-2xl font-semibold text-slate-50">{value}</div>
        </div>
      </div>
    </Card>
  );
}
