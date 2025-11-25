"use client";
import { useEffect, useState } from "react";
import adminService from "@/services/admin";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Doctor = {
  id: string;
  firstName?: string;
  lastName?: string;
  speciality?: string;
  yearsOfExperience?: number;
  email?: string;
};

export default function PendingDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await adminService.getPendingDoctors();
      const data = res?.data ?? res?.result ?? res;
      setDoctors(data?.data ?? data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleApprove(id: string) {
    setProcessing(id);
    try {
      await adminService.approveDoctor(id);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(id: string) {
    const reason = window.prompt("Reason for rejection");
    if (!reason) return;
    setProcessing(id);
    try {
      await adminService.rejectDoctor(id, reason);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  }

  if (loading) return <div>Loading pending doctors...</div>;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Pending Doctors</h2>
      <Table>
        <THead>
          <TR>
            <TH>ID</TH>
            <TH>Name</TH>
            <TH>Speciality</TH>
            <TH>Experience</TH>
            <TH></TH>
          </TR>
        </THead>
        <TBody>
          {doctors.length === 0 && (
            <TR><TD colSpan={5}>No pending doctors</TD></TR>
          )}
          {doctors.map((d) => (
            <TR key={d.id}>
              <TD>{d.id}</TD>
              <TD>{`${d.firstName ?? ""} ${d.lastName ?? ""}`.trim()}</TD>
              <TD>{d.speciality ?? "-"}</TD>
              <TD>{d.yearsOfExperience ?? "-"}</TD>
              <TD className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" onClick={() => handleReject(d.id)} disabled={!!processing}>{processing===d.id?"Processing...":"Reject"}</Button>
                  <Button size="sm" onClick={() => handleApprove(d.id)} disabled={!!processing}>{processing===d.id?"Processing...":"Approve"}</Button>
                </div>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
