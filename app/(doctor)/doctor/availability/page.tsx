import { availability } from "@/mock/availability";
import { Button } from "@/components/ui/button";

export default function DoctorAvailability() {
  const myId = "d1"; // mock current doctor
  const slots = availability[myId] ?? [];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="mb-4 text-lg font-semibold text-slate-900">Weekly Availability</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {slots.map((s) => (
            <label key={s} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
              <input type="checkbox" defaultChecked className="rounded" />
              {s}
            </label>
          ))}
        </div>
        <Button className="mt-4">Save</Button>
      </div>
    </div>
  );
}
