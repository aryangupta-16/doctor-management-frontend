"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import prescriptionService from "@/services/prescription";
import Link from "next/link";

export default function PrescriptionList() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadPrescriptions();
  }, [page, search]);

  async function loadPrescriptions() {
    setLoading(true);
    try {
      const res = await prescriptionService.getMy({ page, search: search || undefined });
      const data = res?.data ?? res;
      // Handle { items, total, page, limit } shape
      const items = data?.items ?? data?.data ?? (Array.isArray(data) ? data : []);
      setPrescriptions(Array.isArray(items) ? items : []);
    } catch (e) {
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex gap-2">
          <Input
            placeholder="Search prescriptions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Button onClick={() => loadPrescriptions()}>Search</Button>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-sm text-slate-600">Loading...</div>
        ) : prescriptions.length ? (
          prescriptions.map((p) => (
            <div key={p.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">Prescription {p.id}</div>
                <div className="text-sm text-slate-600">{new Date(p.createdAt ?? p.date).toLocaleDateString()}</div>
                {p.validUntil && <div className="text-sm text-slate-600">Valid until: {new Date(p.validUntil).toLocaleDateString()}</div>}
              </div>
              <Link href={`/patient/prescriptions/${p.id}`}>
                <Button>View</Button>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-600">No prescriptions found.</div>
        )}
      </div>

      {/* Simple pagination */}
      {prescriptions.length > 0 && (
        <div className="flex gap-2 justify-center">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)} variant="secondary">
            Previous
          </Button>
          <span className="px-4 py-2">Page {page}</span>
          <Button onClick={() => setPage(page + 1)} variant="secondary">
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
