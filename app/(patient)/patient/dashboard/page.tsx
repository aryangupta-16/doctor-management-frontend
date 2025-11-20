import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DoctorCard } from "@/components/doctor-card";
import { StatsCard } from "@/components/stats-card";
import LineChart from "@/components/charts/LineChart";
import { consultations } from "@/mock/consultations";
import { doctors } from "@/mock/doctors";
import { prescriptions } from "@/mock/prescriptions";
import Link from "next/link";

export default function PatientDashboard() {
  const upcoming = consultations.filter((c) => c.status === "Scheduled").slice(0, 3);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard label="Upcoming" value={upcoming.length} />
        <StatsCard label="Doctors" value={doctors.length} />
        <StatsCard label="Prescriptions" value={prescriptions.length} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Doctors</CardTitle>
          <Link href="/patient/doctors"><Button variant="secondary">Browse All</Button></Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input placeholder="Search by name or speciality" />
            <Input placeholder="Location" />
            <Button>Search</Button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4">
            {doctors.slice(0, 3).map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcoming.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div>
                    <div className="font-semibold text-slate-900">{c.date} • {c.time}</div>
                    <div className="text-sm text-slate-600">Consultation ID: {c.id}</div>
                  </div>
                  <Link href={`/patient/consultation/${c.id}`}><Button>View</Button></Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
