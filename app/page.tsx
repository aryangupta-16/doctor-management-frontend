import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">TeleMed Platform</h1>
          <p className="mt-3 text-slate-600">Choose your portal to continue</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardContent>
              <div className="space-y-3">
                <div className="text-xl font-semibold text-slate-900">Patient</div>
                <p className="text-slate-600 text-sm">Search doctors, book slots, manage consultations.</p>
                <Link href="/patient"><Button className="w-full">Go to Patient</Button></Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="space-y-3">
                <div className="text-xl font-semibold text-slate-900">Doctor</div>
                <p className="text-slate-600 text-sm">Manage availability, consultations, and prescriptions.</p>
                <Link href="/doctor"><Button className="w-full" variant="secondary">Go to Doctor</Button></Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="space-y-3">
                <div className="text-xl font-semibold text-slate-900">Admin</div>
                <p className="text-slate-600 text-sm">System stats, manage doctors, patients, and consultations.</p>
                <Link href="/admin"><Button className="w-full" variant="ghost">Go to Admin</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
