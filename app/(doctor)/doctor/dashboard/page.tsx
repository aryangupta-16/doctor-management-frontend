import { StatsCard } from "@/components/stats-card";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import { consultations } from "@/mock/consultations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DoctorDashboard() {
  const today = consultations.filter((c) => c.status === "Scheduled").slice(0, 5);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard label="Today" value={today.length} />
        <StatsCard label="This Week" value={12} />
        <StatsCard label="Patients" value={34} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {today.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div>
                    <div className="font-semibold text-slate-900">{c.time}</div>
                    <div className="text-sm text-slate-600">Consultation {c.id}</div>
                  </div>
                  <button className="text-blue-600">Open</button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <BarChart />
          <PieChart />
        </div>
      </div>
    </div>
  );
}
