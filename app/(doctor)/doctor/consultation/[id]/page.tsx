import { notFound } from "next/navigation";
import { consultations } from "@/mock/consultations";
import { Button } from "@/components/ui/button";

export default async function DoctorConsultationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = consultations.find((x) => x.id === id);
  if (!c) return notFound();
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="text-xl font-semibold text-slate-900">Consultation {c.id}</div>
        <div className="mt-1 text-slate-600">{c.date} • {c.time}</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="font-semibold text-slate-900">Patient</div>
            <div className="text-slate-600 text-sm">{c.patientId}</div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="font-semibold text-slate-900">Doctor</div>
            <div className="text-slate-600 text-sm">{c.doctorId}</div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button>Start Call</Button>
          <Button variant="secondary" asChild>
            <a href={`/doctor/prescription/create/${c.id}`}>Write Prescription</a>
          </Button>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="font-semibold text-slate-900 mb-2">Notes</div>
        <p className="text-slate-700 text-sm">Add structured notes here in the future.</p>
      </div>
    </div>
  );
}
