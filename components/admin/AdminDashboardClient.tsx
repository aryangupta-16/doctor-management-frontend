"use client";
import { useEffect, useState } from "react";
import adminService from "@/services/admin";
import { StatsCard } from "@/components/stats-card";
import BarChart from "@/components/charts/BarChart";

type Stats = { doctors?: number; patients?: number; consultations?: number };

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await adminService.getDashboardStats();
        const data = res?.data ?? res?.result ?? res;
        if (mounted) setStats(data?.data ?? data ?? { doctors: 0, patients: 0, consultations: 0 });
      } catch (e: any) {
        console.error(e);
        if (mounted) setError(e?.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-4">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard label="Doctors" value={stats?.doctors ?? 0} />
        <StatsCard label="Patients" value={stats?.patients ?? 0} />
        <StatsCard label="Consultations" value={stats?.consultations ?? 0} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 font-semibold">System Overview</div>
          <BarChart />
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 font-semibold">Quick Actions</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">Add Doctor</div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">View Patients</div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">Consultations</div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">Reports</div>
          </div>
        </div>
      </div>
    </div>
  );
}
