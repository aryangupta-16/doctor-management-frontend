"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import consultationService from "@/services/consultation";
import prescriptionService from "@/services/prescription";
import { auth } from "@/services/auth";
import DoctorSlots from "@/components/availability/DoctorSlots";

type Consultation = any;

export default function ConsultationDetail({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [prescription, setPrescription] = useState<any>(null);
  const [loadingPrescription, setLoadingPrescription] = useState(false);

  // UI states for actions
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [newSlotId, setNewSlotId] = useState<string | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState("");

  const [completeOpen, setCompleteOpen] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  const role = auth.getRole();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await consultationService.getById(id);
        const data = res?.data ?? res?.result ?? res;
        setConsultation(data?.data ?? data ?? null);
        
        // Load associated prescription if exists
        setLoadingPrescription(true);
        try {
          const pRes = await prescriptionService.getByConsultation(id);
          const pData = pRes?.data ?? pRes;
          setPrescription(pData ?? null);
        } catch (e) {
          // Prescription may not exist, that's ok
        } finally {
          setLoadingPrescription(false);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load consultation");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleCancel() {
    try {
      await consultationService.cancel(id, cancelReason);
      setMsg("Consultation cancelled");
      setCancelOpen(false);
      // reload
      const r = await consultationService.getById(id);
      const d = r?.data ?? r?.result ?? r;
      setConsultation(d?.data ?? d ?? null);
    } catch (e: any) {
      setError(e?.message || "Cancel failed");
    }
  }

  async function handleReschedule() {
    if (!newSlotId) {
      setError("Select a new slot");
      return;
    }
    try {
      await consultationService.reschedule(id, newSlotId, rescheduleReason);
      setMsg("Reschedule request sent");
      setRescheduleOpen(false);
      const r = await consultationService.getById(id);
      const d = r?.data ?? r?.result ?? r;
      setConsultation(d?.data ?? d ?? null);
    } catch (e: any) {
      setError(e?.message || "Reschedule failed");
    }
  }

  async function handleStart() {
    try {
      await consultationService.start(id);
      setMsg("Consultation started");
      const r = await consultationService.getById(id);
      const d = r?.data ?? r?.result ?? r;
      setConsultation(d?.data ?? d ?? null);
    } catch (e: any) {
      setError(e?.message || "Start failed");
    }
  }

  async function handleComplete() {
    try {
      await consultationService.complete(id, { diagnosis, doctorNotes });
      setMsg("Consultation completed");
      setCompleteOpen(false);
      const r = await consultationService.getById(id);
      const d = r?.data ?? r?.result ?? r;
      setConsultation(d?.data ?? d ?? null);
    } catch (e: any) {
      setError(e?.message || "Complete failed");
    }
  }

  function onSlotPicked(slot: any) {
    setNewSlotId(slot.id);
  }

  if (loading) return <div className="text-sm text-slate-600">Loading consultation...</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!consultation) return <div className="text-sm text-slate-600">No consultation found.</div>;

  return (
    <div className="space-y-4">
      {msg && <div className="rounded-md bg-green-50 p-3 text-green-800">{msg}</div>}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="text-xl font-semibold text-slate-900">Consultation {consultation.id}</div>
        <div className="mt-1 text-slate-600">{new Date(consultation.slot?.slotStartTime ?? consultation.startTime ?? consultation.date).toLocaleString()}</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="font-semibold text-slate-900">Patient</div>
            <div className="text-slate-600 text-sm">{consultation.patientId ?? consultation.patient?.id ?? consultation.patient?.name}</div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="font-semibold text-slate-900">Doctor</div>
            <div className="text-slate-600 text-sm">{consultation.doctorId ?? consultation.doctor?.id ?? consultation.doctor?.name}</div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {role === "patient" && (
            <>
              <Button onClick={() => setCancelOpen(true)}>Cancel</Button>
              <Button variant="secondary" onClick={() => setRescheduleOpen(true)}>Reschedule</Button>
            </>
          )}
          {role === "doctor" && (
            <>
              <Button onClick={handleStart}>Start</Button>
              <Button variant="secondary" onClick={() => setCompleteOpen(true)}>Complete</Button>
              <Link href={`/doctor/prescription/create/${consultation.id}`}>
                <Button variant="secondary">Write Prescription</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Cancel UI */}
      {cancelOpen && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="font-semibold text-slate-900 mb-2">Cancel Consultation</div>
          <textarea className="w-full rounded-xl border p-2" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Reason (optional)" />
          <div className="mt-3 flex gap-2">
            <Button onClick={handleCancel}>Confirm Cancel</Button>
            <Button variant="secondary" onClick={() => setCancelOpen(false)}>Close</Button>
          </div>
        </div>
      )}

      {/* Reschedule UI */}
      {rescheduleOpen && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="font-semibold text-slate-900 mb-2">Reschedule Consultation</div>
          <div className="text-sm text-slate-600 mb-3">Pick an available slot from the doctor.</div>
          {consultation.doctorId ? (
            <DoctorSlots doctorId={String(consultation.doctorId)} onSlotSelect={onSlotPicked} />
          ) : consultation.doctor?.id ? (
            <DoctorSlots doctorId={String(consultation.doctor.id)} onSlotSelect={onSlotPicked} />
          ) : (
            <div className="text-sm text-slate-600">Doctor information unavailable.</div>
          )}
          <div className="mt-3">
            <textarea className="w-full rounded-xl border p-2" value={rescheduleReason} onChange={(e) => setRescheduleReason(e.target.value)} placeholder="Reason (optional)" />
            <div className="mt-3 flex gap-2">
              <Button onClick={handleReschedule}>Send Reschedule</Button>
              <Button variant="secondary" onClick={() => setRescheduleOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Complete UI for doctor */}
      {completeOpen && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="font-semibold text-slate-900 mb-2">Complete Consultation</div>
          <div className="mb-2">
            <label className="block text-sm text-slate-700 mb-1">Diagnosis</label>
            <input className="w-full rounded-xl border px-3 py-2" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
          </div>
          <div className="mb-2">
            <label className="block text-sm text-slate-700 mb-1">Notes</label>
            <textarea className="w-full rounded-xl border p-2" value={doctorNotes} onChange={(e) => setDoctorNotes(e.target.value)} />
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={handleComplete}>Complete</Button>
            <Button variant="secondary" onClick={() => setCompleteOpen(false)}>Close</Button>
          </div>
        </div>
      )}

      {/* Simple show of notes */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="font-semibold text-slate-900 mb-2">Notes</div>
        <div className="text-sm text-slate-700">{consultation.doctorNotes ?? consultation.notes ?? "No notes yet."}</div>
      </div>

      {/* Prescription section */}
      {loadingPrescription ? (
        <div className="text-sm text-slate-600">Loading prescription...</div>
      ) : prescription ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="font-semibold text-slate-900 mb-2">Prescription</div>
          <div className="text-sm text-slate-700 mb-3">A prescription has been created for this consultation.</div>
          <Link href={`/patient/prescriptions/${prescription.id}`}>
            <Button>View Prescription</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
