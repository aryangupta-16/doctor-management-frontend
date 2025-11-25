"use client";
import { useEffect, useState } from "react";
import consultationService from "@/services/consultation";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ConsultationList({ role }: { role?: "patient" | "doctor" }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await consultationService.getMy();
        const data = res?.data ?? res?.result ?? res;
        // expect array or object with items
        const arr = Array.isArray(data) ? data : data?.items ?? data?.consultations ?? [];
        setItems(arr);
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [role]);

  return (
    <div>
      {loading ? (
        <div className="text-sm text-slate-600">Loading consultations...</div>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>ID</TH>
              <TH>Date</TH>
              <TH>Time</TH>
              <TH>Status</TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {items.map((c: any) => (
              <TR key={c.id}>
                <TD>{c.id}</TD>
                <TD>{c.date ?? c.slotDate ?? new Date(c.slotStartTime).toLocaleDateString()}</TD>
                <TD>{c.time ?? (c.slotStartTime ? new Date(c.slotStartTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : "-")}</TD>
                <TD><Badge label={c.status ?? c.consultationStatus ?? 'Unknown'} color={c.status === 'Scheduled' || c.status === 'AVAILABLE' ? 'blue' : c.status === 'Completed' ? 'green' : 'gray'} /></TD>
                <TD className="text-right">
                  <Link
                    className="text-blue-600"
                    href={`${role === "doctor" ? "/doctor/consultation" : "/patient/consultation"}/${c.id}`}
                  >
                    View
                  </Link>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
