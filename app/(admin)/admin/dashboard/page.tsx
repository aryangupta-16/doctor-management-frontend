import { StatsCard } from "@/components/stats-card";
import BarChart from "@/components/charts/BarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard label="Doctors" value={18} />
        <StatsCard label="Patients" value={120} />
        <StatsCard label="Consultations" value={56} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">Add Doctor</div>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">View Patients</div>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">Consultations</div>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">Reports</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
