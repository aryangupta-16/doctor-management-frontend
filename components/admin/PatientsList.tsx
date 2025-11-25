"use client";
import { useEffect, useState } from "react";
import adminService from "@/services/admin";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import Link from "next/link";

type Patient = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
};

export default function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  async function load(p: number) {
    setLoading(true);
    try {
      const res = await adminService.listUsers({ role: "PATIENT", page: p, limit });
      const data = res?.data ?? res?.result ?? res;
      setPatients(data?.items ?? data?.data ?? []);
      setTotal(data?.total ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(page); }, [page]);

  if (loading) return <div>Loading patients...</div>;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Patients</h2>
      <Table>
        <THead>
          <TR>
            <TH>ID</TH>
            <TH>Name</TH>
            <TH>Email</TH>
            <TH>Phone</TH>
            <TH></TH>
          </TR>
        </THead>
        <TBody>
          {patients.length === 0 && (
            <TR><TD>No patients found</TD></TR>
          )}
          {patients.map((p) => (
            <TR key={p.id}>
              <TD>{p.id}</TD>
              <TD>{`${p.firstName ?? ""} ${p.lastName ?? ""}`.trim()}</TD>
              <TD>{p.email ?? "-"}</TD>
              <TD>{p.phoneNumber ?? "-"}</TD>
              <TD className="text-right">
                <Link className="text-blue-600" href={`/admin/patient/${p.id}`}>View</Link>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
      <div className="mt-4 flex items-center justify-between text-sm">
        <div>Page {page} of {Math.ceil(total / limit)}</div>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border disabled:opacity-50">Prev</button>
          <button disabled={page * limit >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
