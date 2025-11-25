"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import prescriptionService from "@/services/prescription";
import { useRouter } from "next/navigation";

export default function PrescriptionForm({ consultationId, initialData }: { consultationId?: string; initialData?: any }) {
  const [medications, setMedications] = useState<Array<{ name: string; dosage: string; duration: string }>>(
    initialData?.medications ?? [{ name: "", dosage: "", duration: "" }]
  );
  const [instructions, setInstructions] = useState(initialData?.instructions ?? "");
  const [validUntil, setValidUntil] = useState(initialData?.validUntil ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function handleSave() {
    if (!consultationId && !initialData?.id) {
      setError("Consultation ID required");
      return;
    }
    if (!medications.some((m) => m.name)) {
      setError("Add at least one medication");
      return;
    }

    setLoading(true);
    try {
      if (initialData?.id) {
        // Update existing
        await prescriptionService.update(initialData.id, { medications, instructions, validUntil });
        setMsg("Prescription updated");
      } else {
        // Create new
        const res = await prescriptionService.createPrescription({ consultationId: consultationId!, medications, instructions, validUntil });
        setMsg("Prescription created");
        setTimeout(() => {
          const id = res?.data?.id ?? res?.id;
          if (id) router.push(`/patient/prescriptions`);
        }, 1000);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to save prescription");
    } finally {
      setLoading(false);
    }
  }

  function addMedication() {
    setMedications([...medications, { name: "", dosage: "", duration: "" }]);
  }

  function removeMedication(idx: number) {
    setMedications(medications.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-red-800">{error}</div>}
      {msg && <div className="rounded-md bg-green-50 p-3 text-green-800">{msg}</div>}

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="font-semibold text-slate-900 mb-4">Medications</div>
        <div className="space-y-3">
          {medications.map((med, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-sm text-slate-700 mb-1">Medicine Name</label>
                <Input
                  placeholder="e.g., Aspirin"
                  value={med.name}
                  onChange={(e) => {
                    const updated = [...medications];
                    updated[idx].name = e.target.value;
                    setMedications(updated);
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-slate-700 mb-1">Dosage</label>
                <Input
                  placeholder="e.g., 500mg"
                  value={med.dosage}
                  onChange={(e) => {
                    const updated = [...medications];
                    updated[idx].dosage = e.target.value;
                    setMedications(updated);
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-slate-700 mb-1">Duration</label>
                <Input
                  placeholder="e.g., 10 days"
                  value={med.duration}
                  onChange={(e) => {
                    const updated = [...medications];
                    updated[idx].duration = e.target.value;
                    setMedications(updated);
                  }}
                />
              </div>
              {medications.length > 1 && (
                <Button variant="secondary" onClick={() => removeMedication(idx)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button className="mt-3" variant="secondary" onClick={addMedication}>
          + Add Medication
        </Button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <label className="block text-sm font-medium text-slate-700 mb-2">Instructions</label>
        <textarea
          className="w-full rounded-xl border p-3"
          rows={4}
          placeholder="e.g., Take with food, avoid dairy products..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <label className="block text-sm font-medium text-slate-700 mb-2">Valid Until</label>
        <Input
          type="date"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Prescription"}
        </Button>
        <Button variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
