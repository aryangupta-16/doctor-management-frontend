"use client";
import { useEffect, useState } from "react";
import consultationService from "@/services/consultation";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ConsultationList({ role }: { role?: "patient" | "doctor" }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let res;
        if (role === "doctor") {
          res = await consultationService.doctorList({ page, limit });
        } else if (role === "patient") {
          res = await consultationService.patientList({ page, limit });
        } else {
          res = await consultationService.getMy({ page, limit });
        }
        const data = res?.data ?? res;
        setItems(data?.items ?? []);
        setTotal(data?.total ?? 0);
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [role, page]);

  return (
    <div>
      {loading ? (
        <div className="text-sm text-slate-600">Loading consultations...</div>
      ) : (
        <>
          <Table>
            <THead>
              <TR>
                <TH>Consultation #</TH>
                <TH>{role === "doctor" ? "Patient" : "Doctor"}</TH>
                <TH>Date & Time</TH>
                <TH>Status</TH>
                <TH>Type</TH>
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {items.length === 0 ? (
                <TR><TD colSpan={6}>No consultations found</TD></TR>
              ) : items.map((c: any) => (
                <TR key={c.id}>
                  <TD>{c.consultationNumber || c.id}</TD>
                  <TD>
                    {role === "doctor" ? (
                      <>{c.patient?.firstName} {c.patient?.lastName}</>
                    ) : (
                      <>{c.doctor?.user?.firstName} {c.doctor?.user?.lastName}</>
                    )}
                  </TD>
                  <TD>{c.scheduledStartTime ? new Date(c.scheduledStartTime).toLocaleString() : "-"}</TD>
                  <TD>
                    <Badge 
                      label={c.status} 
                      color={
                        c.status === "SCHEDULED" ? "blue" : 
                        c.status === "COMPLETED" ? "green" : 
                        c.status === "IN_PROGRESS" ? "yellow" :
                        c.status === "CANCELLED" ? "red" : "gray"
                      } 
                    />
                  </TD>
                  <TD>{c.consultationType || "-"}</TD>
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
          {total > limit && (
            <div className="flex gap-2 justify-center mt-4">
              <Button variant="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span className="px-4 py-2">Page {page}</span>
              <Button variant="secondary" disabled={page * limit >= total} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
