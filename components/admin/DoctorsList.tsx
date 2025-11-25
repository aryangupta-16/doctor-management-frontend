"use client";
import { useEffect, useState } from "react";
import adminService from "@/services/admin";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import Link from "next/link";

type Doctor = {
  id: string;
  firstName?: string;
  lastName?: string;
  speciality?: string;
  yearsOfExperience?: number;
  email?: string;
  isActive?: boolean;
};

export default function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  async function load(p: number) {
    setLoading(true);
    try {
      const res = await adminService.listUsers({ role: "DOCTOR", page: p, limit });
      const data = res?.data ?? res?.result ?? res;
      setDoctors(data?.items ?? data?.data ?? []);
      setTotal(data?.total ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(page); }, [page]);

  if (loading) return <div>Loading doctors...</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Doctors</h2>
        <Link href="/admin/doctors/pending" className="text-sm text-blue-600">View Pending Doctors</Link>
      </div>
      <Table>
        <THead>
          <TR>
            <TH>ID</TH>
            <TH>Name</TH>
            <TH>Speciality</TH>
            <TH>Experience</TH>
            <TH>Email</TH>
            <TH></TH>
          </TR>
        </THead>
        <TBody>
          {doctors.length === 0 && (
            <TR><TD>No doctors found</TD></TR>
          )}
          {doctors.map((d) => (
            <TR key={d.id}>
              <TD>{d.id}</TD>
              <TD>{`${d.firstName ?? ""} ${d.lastName ?? ""}`.trim()}</TD>
              <TD>{d.speciality ?? "-"}</TD>
              <TD>{d.yearsOfExperience ?? "-"}</TD>
              <TD>{d.email ?? "-"}</TD>
              <TD className="text-right">
                <Link className="text-blue-600" href={`/admin/doctor/${d.id}`}>View</Link>
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
