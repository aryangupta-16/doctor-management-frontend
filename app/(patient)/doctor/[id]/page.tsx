import Image from "next/image";
import { notFound } from "next/navigation";
import { doctors } from "@/mock/doctors";
import { MiniCalendar } from "@/components/calendar";
import { SlotSelector } from "@/components/slot-selector";
import { Button } from "@/components/ui/button";
import DoctorSlots from "@/components/availability/DoctorSlots";

export default async function DoctorProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = doctors.find((d) => d.id === id);
  if (!doc) return notFound();
  // slots are loaded client-side by DoctorSlots component
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center gap-4">
          <Image src={doc.photo} alt={doc.name} width={80} height={80} className="h-20 w-20 rounded-2xl object-cover" />
          <div>
            <div className="text-2xl font-semibold text-slate-900">{doc.name}</div>
            <div className="text-slate-600">{doc.speciality} • {doc.experience} years</div>
            <div className="text-slate-500 text-sm">{doc.hospital}</div>
          </div>
        </div>
        <div className="mt-6 text-slate-700">
          <p>Experienced {doc.speciality} providing compassionate tele-consultations.</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="mb-3 font-semibold text-slate-900">Select date</div>
            {/* date selection handled in DoctorSlots */}
            <DoctorSlots doctorId={doc.id} />
        </div>
          {/* slot selector moved inside DoctorSlots; booking action can be handled there or in a separate flow */}
      </div>
    </div>
  );
}
