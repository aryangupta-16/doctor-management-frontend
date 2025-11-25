"use client";
import { useEffect, useState } from "react";
import adminService from "@/services/admin";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
};

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [processing, setProcessing] = useState<string | null>(null);
  const limit = 20;

  async function load(p: number) {
    setLoading(true);
    try {
      const res = await adminService.listUsers({ page: p, limit });
      const data = res?.data ?? res?.result ?? res;
      setUsers(data?.items ?? data?.data ?? []);
      setTotal(data?.total ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(page); }, [page]);

  async function handleSuspend(id: string) {
    const reason = window.prompt("Reason for suspension");
    if (!reason) return;
    setProcessing(id);
    try {
      await adminService.suspendUser(id, reason);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: false } : u));
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  }

  async function handleReactivate(id: string) {
    setProcessing(id);
    try {
      await adminService.reactivateUser(id);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: true } : u));
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  }

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Users Management</h2>
      <Table>
        <THead>
          <TR>
            <TH>ID</TH>
            <TH>Name</TH>
            <TH>Email</TH>
            <TH>Role</TH>
            <TH>Status</TH>
            <TH></TH>
          </TR>
        </THead>
        <TBody>
          {users.length === 0 && (
            <TR><TD>No users found</TD></TR>
          )}
          {users.map((u) => (
            <TR key={u.id}>
              <TD>{u.id}</TD>
              <TD>{`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()}</TD>
              <TD>{u.email ?? "-"}</TD>
              <TD>{u.role ?? "-"}</TD>
              <TD>{u.isActive ? "Active" : "Suspended"}</TD>
              <TD className="text-right">
                <div className="flex justify-end gap-2">
                  {u.isActive ? (
                    <Button size="sm" onClick={() => handleSuspend(u.id)} disabled={!!processing}>{processing === u.id ? "Processing..." : "Suspend"}</Button>
                  ) : (
                    <Button size="sm" onClick={() => handleReactivate(u.id)} disabled={!!processing}>{processing === u.id ? "Processing..." : "Reactivate"}</Button>
                  )}
                </div>
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
