import { Card } from "./ui/card";

export function StatsCard({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
          {icon}
        </div>
        <div>
          <div className="text-slate-500 text-sm">{label}</div>
          <div className="text-2xl font-semibold text-slate-900">{value}</div>
        </div>
      </div>
    </Card>
  );
}
