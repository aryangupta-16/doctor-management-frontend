
"use client";
import { useEffect, useState } from "react";
import { StatsCard } from "@/components/stats-card";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/services/api";

export default function DoctorDashboard() {
  const [today, setToday] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ today: 0, week: 0, patients: 0 });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Get today's date range
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const startDate = start.toISOString();
        const endDate = end.toISOString();
        // Fetch today's consultations
        const res = await api.get(`/api/consultation/doctor/list?status=SCHEDULED&startDate=${startDate}&endDate=${endDate}`);
        const data = res?.data ?? res;
        setToday(data?.items ?? []);
        setStats((s) => ({ ...s, today: data?.total ?? 0 }));
        // TODO: Replace with real API for week/patients stats if available
        setStats((s) => ({ ...s, week: 0, patients: 0 }));
      } catch (e) {
        setToday([]);
        setStats({ today: 0, week: 0, patients: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard label="Today" value={stats.today} />
        <StatsCard label="This Week" value={stats.week} />
        <StatsCard label="Patients" value={stats.patients} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="text-sm text-slate-600">Loading...</div>
              ) : today.length === 0 ? (
                <div className="text-sm text-slate-600">No consultations today.</div>
              ) : today.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div>
                    <div className="font-semibold text-slate-900">{c.scheduledStartTime ? new Date(c.scheduledStartTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}</div>
                    <div className="text-sm text-slate-600">Consultation {c.consultationNumber || c.id}</div>
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
