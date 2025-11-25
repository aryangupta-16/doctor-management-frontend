"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import prescriptionService from "@/services/prescription";
import { useRouter } from "next/navigation";

export default function PrescriptionDetail({ id }: { id: string }) {
  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await prescriptionService.getById(id);
        const data = res?.data ?? res;
        setPrescription(data ?? null);
      } catch (e: any) {
        setError(e?.message || "Failed to load prescription");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleDownload() {
    try {
      const res = await prescriptionService.download(id);
      const data = res?.data ?? res;
      // If backend returns a URL or file path, open it
      if (data?.url) {
        window.open(data.url, "_blank");
      } else if (data?.file) {
        // Handle direct file data if needed
        console.log("Download data:", data);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to download");
    }
  }

  if (loading) return <div className="text-sm text-slate-600">Loading prescription...</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!prescription) return <div className="text-sm text-slate-600">Prescription not found.</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="text-xl font-semibold text-slate-900 mb-2">Prescription</div>
        <div className="text-sm text-slate-600">ID: {prescription.id}</div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="font-semibold text-slate-900 mb-3">Medications</div>
        <div className="space-y-2">
          {prescription.medications && prescription.medications.length > 0 ? (
            prescription.medications.map((med: any, idx: number) => (
              <div key={idx} className="text-sm text-slate-700">
                <strong>{med.name}</strong> - {med.dosage} for {med.duration}
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-600">No medications.</div>
          )}
        </div>
      </div>

      {prescription.instructions && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="font-semibold text-slate-900 mb-2">Instructions</div>
          <div className="text-sm text-slate-700 whitespace-pre-wrap">{prescription.instructions}</div>
        </div>
      )}

      {prescription.validUntil && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="font-semibold text-slate-900 mb-2">Valid Until</div>
          <div className="text-sm text-slate-700">{new Date(prescription.validUntil).toLocaleDateString()}</div>
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleDownload}>Download</Button>
        <Button variant="secondary" onClick={() => router.back()}>
          Back
        </Button>
      </div>
    </div>
  );
}
