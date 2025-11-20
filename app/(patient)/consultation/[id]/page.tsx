import { notFound } from "next/navigation";
import { consultations } from "@/mock/consultations";
import { Button } from "@/components/ui/button";

export default async function ConsultationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = consultations.find((x) => x.id === id);
  if (!c) return notFound();
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="text-xl font-semibold text-slate-900">Consultation {c.id}</div>
        <div className="mt-1 text-slate-600">{c.date} • {c.time}</div>
        <div className="mt-4 flex gap-2">
          <Button>Join Call</Button>
          <Button variant="secondary">View Prescription</Button>
        </div>
      </div>
    </div>
  );
}
