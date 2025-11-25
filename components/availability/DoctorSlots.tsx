"use client";
import { useEffect, useState } from "react";
import { MiniCalendar } from "@/components/calendar";
import { Button } from "@/components/ui/button";
import availabilityService from "@/services/availability";
import consultationService from "@/services/consultation";
import { useRouter } from "next/navigation";

type APISlot = {
  id: string;
  slotStartTime: string;
  slotEndTime: string;
  status: string;
};

export default function DoctorSlots({ doctorId, onSlotSelect }: { doctorId: string; onSlotSelect?: (slot: APISlot) => void }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<APISlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  function extractSlots(res: any): APISlot[] {
    // support multiple response shapes: { count, slots: [...] }, { result: { slots } }, raw array
    const maybe = res?.result ?? res?.data ?? res;
    const arr = maybe?.slots ?? maybe?.result ?? maybe?.data ?? maybe;
    if (Array.isArray(arr)) return arr as APISlot[];
    return [];
  }

  function formatTimeRange(slot: APISlot) {
    try {
      const start = new Date(slot.slotStartTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const end = new Date(slot.slotEndTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return `${start} — ${end}`;
    } catch (e) {
      return slot.slotStartTime;
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().slice(0, 10);
        const res = await availabilityService.getDoctorSlots(doctorId, { date: today });
        const list = extractSlots(res);
        setSlots(list);
      } catch (e) {
        setSlots([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [doctorId]);

  async function handleDateSelect(d: Date) {
    setSelectedDate(d);
    setLoading(true);
    try {
      const date = d.toISOString().slice(0, 10);
      const res = await availabilityService.getDoctorSlots(doctorId, { date });
      const list = extractSlots(res);
      setSlots(list);
    } catch (e) {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  // Booking flow: open a small inline form when user clicks Book
  const [bookingOpen, setBookingOpen] = useState(false);
  const [ConsultationType, setConsultationType] = useState("tele");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const router = useRouter();

  async function handleBook() {
    if (!selectedSlotId) return;
    setBookingLoading(true);
    try {
      const res = await consultationService.book({ slotId: selectedSlotId, ConsultationType, chiefComplaint, symptoms });
      const data = res?.data ?? res?.result ?? res;
      const id = data?.id ?? data?.consultationId ?? data?.consultation?.id ?? null;
      if (id) {
        // navigate to patient consultation detail
        router.push(`/patient/consultation/${id}`);
      } else {
        alert("Booked — but unable to determine consultation id from response.");
      }
    } catch (err: any) {
      alert(err?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
      setBookingOpen(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="mb-3 font-semibold text-slate-900">Select date</div>
        <MiniCalendar onSelect={handleDateSelect} />
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="mb-3 font-semibold text-slate-900">Available slots</div>
        {loading ? (
          <div className="text-sm text-slate-600">Loading slots...</div>
        ) : slots.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {slots.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  if (onSlotSelect) {
                    onSlotSelect(s);
                    setSelectedSlotId(s.id);
                  } else {
                    setSelectedSlotId(s.id);
                  }
                }}
                disabled={s.status !== "AVAILABLE"}
                className={`rounded-xl border px-4 py-2 text-sm text-slate-800 shadow-sm hover:shadow transition-all ${selectedSlotId === s.id ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"} ${s.status !== "AVAILABLE" ? "opacity-60 pointer-events-none" : ""}`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-500">{formatTimeRange(s)}</span>
                  <span className="text-sm font-semibold">{s.status === "AVAILABLE" ? "Available" : s.status}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-600">No slots available for selected date.</div>
        )}
        <div className="mt-4">
          <Button className="w-full" disabled={!selectedSlotId} onClick={() => setBookingOpen(true)}>{selectedSlotId ? `Book slot` : "Select a slot"}</Button>
          {bookingOpen && (
            <div className="mt-3 space-y-3 rounded-xl border border-gray-100 bg-white p-3">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Type</label>
                <select className="w-full rounded-xl border px-3 py-2" value={ConsultationType} onChange={(e) => setConsultationType(e.target.value)}>
                  <option value="Video">Video</option>
                  <option value="Audio"> Audio</option>
                  <option value="Chat">Chat</option>
                  <option value="In_Person">In_Person</option>

                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Chief complaint</label>
                <input className="w-full rounded-xl border px-3 py-2" value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Symptoms</label>
                <input className="w-full rounded-xl border px-3 py-2" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleBook} disabled={bookingLoading}>{bookingLoading ? "Booking..." : "Confirm & Book"}</Button>
                <Button variant="secondary" onClick={() => setBookingOpen(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
