
"use client";
import { useEffect, useState } from "react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { api } from "@/services/api";

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/consultation/admin/all?page=${page}&limit=${limit}`);
        const data = res?.data ?? res;
        setConsultations(data?.items ?? data?.data?.items ?? []);
        setTotal(data?.total ?? data?.data?.total ?? 0);
      } catch (e) {
        setConsultations([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  return (
    <div>
      <Table>
        <THead>
          <TR>
            <TH>ID</TH>
            <TH>Doctor</TH>
            <TH>Patient</TH>
            <TH>Date</TH>
            <TH>Time</TH>
            <TH>Status</TH>
          </TR>
        </THead>
        <TBody>
          {loading ? (
            <TR><TD colSpan={6}>Loading...</TD></TR>
          ) : consultations.length === 0 ? (
            <TR><TD colSpan={6}>No consultations found</TD></TR>
          ) : consultations.map((c) => (
            <TR key={c.id}>
              <TD>{c.consultationNumber || c.id}</TD>
              <TD>{c.doctor?.user?.firstName} {c.doctor?.user?.lastName} <span className="text-xs text-slate-500">({c.doctor?.specialtyPrimary})</span></TD>
              <TD>{c.patient?.firstName} {c.patient?.lastName}</TD>
              <TD>{c.scheduledStartTime ? new Date(c.scheduledStartTime).toLocaleDateString() : "-"}</TD>
              <TD>{c.scheduledStartTime ? new Date(c.scheduledStartTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}</TD>
              <TD>{c.status}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
      {/* Simple pagination */}
      {total > limit && (
        <div className="flex gap-2 justify-center mt-4">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded bg-gray-100">Prev</button>
          <span className="px-4 py-2">Page {page}</span>
          <button disabled={page * limit >= total} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded bg-gray-100">Next</button>
        </div>
      )}
    </div>
  );
}
