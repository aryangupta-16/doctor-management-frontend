import { availability } from "@/mock/availability";
import { doctors } from "@/mock/doctors";
import { MiniCalendar } from "@/components/calendar";
import { SlotSelector } from "@/components/slot-selector";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function BookingPage({ params }: { params: Promise<{ doctorId: string }> }) {
  const { doctorId } = await params;
  const doc = doctors.find((d) => d.id === doctorId);
  if (!doc) return notFound();
  const slots = availability[doc.id] ?? [];
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="text-xl font-semibold text-slate-900">Booking with {doc.name}</div>
        <p className="mt-1 text-slate-600">{doc.speciality} • {doc.hospital}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-sm font-semibold text-slate-700">Select Date</div>
            <MiniCalendar />
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-slate-700">Select Slot</div>
            <SlotSelector slots={slots} />
          </div>
        </div>
        <div className="mt-6 rounded-xl bg-blue-50 p-4 text-blue-900 ring-1 ring-blue-100">
          Please confirm your booking details and proceed.
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="font-semibold text-slate-900">Confirmation</div>
        <div className="mt-2 text-sm text-slate-600">A mock confirmation step. Payment flow to be integrated later.</div>
        <Button className="mt-4 w-full">Confirm Booking</Button>
      </div>
    </div>
  );
}
