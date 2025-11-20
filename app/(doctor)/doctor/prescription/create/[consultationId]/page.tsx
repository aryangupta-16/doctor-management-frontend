import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function CreatePrescription({ params }: { params: Promise<{ consultationId: string }> }) {
  const { consultationId } = await params;
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-4 text-lg font-semibold text-slate-900">Write Prescription for {consultationId}</div>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input placeholder="Medicine name" />
          <Input placeholder="Dose (e.g., 500mg)" />
          <Input placeholder="Frequency (e.g., 2x)" />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input placeholder="Medicine name" />
          <Input placeholder="Dose (e.g., 10mg)" />
          <Input placeholder="Frequency (e.g., HS)" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Instructions</label>
          <Textarea rows={4} placeholder="General instructions" />
        </div>
        <Button>Save Prescription</Button>
      </div>
    </div>
  );
}
