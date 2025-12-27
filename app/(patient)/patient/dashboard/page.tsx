
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/stats-card";
import LineChart from "@/components/charts/LineChart";
import FeaturedDoctors from "@/components/search/FeaturedDoctors";
import Link from "next/link";
import { api } from "@/services/api";

export default function PatientDashboard() {
  const [stats, setStats] = useState({ upcoming: 0, doctors: 0, prescriptions: 0 });
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Fetch upcoming consultations
        const res = await api.get("/api/consultation/upcoming?page=1&limit=3");
        const data = res?.data ?? res;
        const items = data?.items ?? [];
        setUpcoming(items);
        
        // Fetch stats (doctors, prescriptions)
        try {
          const doctorsRes = await api.get("/api/search/doctors?page=1&limit=1");
          const doctorsData = doctorsRes?.data ?? doctorsRes?.result ?? doctorsRes;
          const doctorsCount = doctorsData?.total ?? doctorsData?.items?.length ?? 0;
          
          const prescriptionsRes = await api.get("/api/prescriptions/my?page=1&limit=1");
          const prescriptionsData = prescriptionsRes?.data ?? prescriptionsRes;
          const prescriptionsCount = prescriptionsData?.total ?? prescriptionsData?.items?.length ?? 0;
          
          setStats({ upcoming: data?.total ?? items.length, doctors: doctorsCount, prescriptions: prescriptionsCount });
        } catch (statsErr) {
          setStats({ upcoming: data?.total ?? items.length, doctors: 0, prescriptions: 0 });
        }
      } catch (e) {
        setUpcoming([]);
        setStats({ upcoming: 0, doctors: 0, prescriptions: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard label="Upcoming" value={stats.upcoming} />
        <StatsCard label="Doctors" value={stats.doctors} />
        <StatsCard label="Prescriptions" value={stats.prescriptions} />
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
            <FeaturedDoctors limit={3} />
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
              {loading ? (
                <div className="text-sm text-slate-600">Loading...</div>
              ) : upcoming.length === 0 ? (
                <div className="text-sm text-slate-600">No upcoming consultations.</div>
              ) : upcoming.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {c.scheduledStartTime ? new Date(c.scheduledStartTime).toLocaleString([], { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : "-"}
                    </div>
                    <div className="text-sm text-slate-600">
                      Dr. {c.doctor?.user?.firstName} {c.doctor?.user?.lastName}
                    </div>
                    <div className="text-xs text-slate-500">{c.doctor?.specialtyPrimary}</div>
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
