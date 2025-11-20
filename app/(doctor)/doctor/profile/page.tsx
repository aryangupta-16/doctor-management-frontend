import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function DoctorProfileEdit() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
          <Input defaultValue="Dr. Aisha Kapoor" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Speciality</label>
          <Input defaultValue="Cardiologist" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Experience (years)</label>
          <Input defaultValue="12" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Hospital</label>
          <Input defaultValue="City Care Hospital" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Bio</label>
          <Textarea rows={4} placeholder="Short bio" />
        </div>
      </div>
      <Button className="mt-4">Save Changes</Button>
    </div>
  );
}
