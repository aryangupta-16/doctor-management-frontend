"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/users/me");
        const payload = res?.data ?? res;
        const u = payload?.data ?? payload?.user ?? payload;
        setUser(u ?? null);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await api.put("/api/users/me", user);
      alert("Saved");
    } catch (e: any) {
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-sm text-slate-600">Loading profile...</div>;
  if (!user) return <div className="text-sm text-red-600">Profile not available.</div>;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">First Name</label>
          <Input value={user.firstName ?? ""} onChange={(e) => setUser({ ...user, firstName: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Last Name</label>
          <Input value={user.lastName ?? ""} onChange={(e) => setUser({ ...user, lastName: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <Input value={user.email ?? ""} onChange={(e) => setUser({ ...user, email: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
          <Input value={user.phoneNumber ?? ""} onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })} />
        </div>
      </div>
      <div className="mt-4">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
      </div>
    </div>
  );
}
