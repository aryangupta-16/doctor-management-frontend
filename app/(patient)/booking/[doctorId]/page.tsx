
import { notFound } from "next/navigation";
import DoctorSlots from "@/components/availability/DoctorSlots";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
export default async function BookingPage({ params }: { params: { doctorId: string } }) {
  const { doctorId } = await params;
  let doc = null;
  try {
    const res = await api.get(`http://localhost:8000/api/doctors/${doctorId}`);
    doc = res?.doctor ?? res?.data?.doctor ?? null;
  } catch (e) {
    console.log("Error fetching doctor:", e);
  }
  if (!doc) return notFound();
  const fullName = doc.user ? `${doc.user.firstName} ${doc.user.lastName}` : doc.name || "Doctor";
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="text-xl font-semibold text-slate-900">Booking with {fullName}</div>
        <p className="mt-1 text-slate-600">{doc.specialtyPrimary}{doc.hospital ? ` • ${doc.hospital}` : ""}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-sm font-semibold text-slate-700">Select Date</div>
            {/* DoctorSlots includes the calendar and slot list */}
            <DoctorSlots doctorId={doc.id} />
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-slate-700">Select Slot</div>
            {/* slot selector is inside DoctorSlots; keep this column for additional booking info if needed */}
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
