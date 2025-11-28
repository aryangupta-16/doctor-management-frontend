"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

type ProfileShape = {
  id?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  profile?: any;
  role?: string;
};

export default function PatientProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<ProfileShape>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/users/me");
        const payload = res?.data ?? res;
        const u = payload?.data ?? payload?.user ?? payload;
        setUser(u ?? {});
      } catch (e) {
        // swallow — unauthenticated or error
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      // try to update profile if endpoint exists
      const body = { firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber, profile: user.profile };
      await api.put("/api/users/me", body);
      alert("Profile saved");
    } catch (e: any) {
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-sm text-slate-600">Loading profile...</div>;

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

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Blood Group</label>
          <Input value={user.profile?.bloodGroup ?? ""} onChange={(e) => setUser({ ...user, profile: { ...(user.profile ?? {}), bloodGroup: e.target.value } })} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Height (cm)</label>
          <Input value={String(user.profile?.height ?? "")} onChange={(e) => setUser({ ...user, profile: { ...(user.profile ?? {}), height: Number(e.target.value) } })} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Weight (kg)</label>
          <Input value={String(user.profile?.weight ?? "")} onChange={(e) => setUser({ ...user, profile: { ...(user.profile ?? {}), weight: Number(e.target.value) } })} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
          <Textarea rows={3} value={user.profile?.addressLine1 ?? ""} onChange={(e) => setUser({ ...user, profile: { ...(user.profile ?? {}), addressLine1: e.target.value } })} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Allergies (comma separated)</label>
          <Input value={(user.profile?.allergies ?? []).map((a: any) => a.name).join(", ")} onChange={(e) => setUser({ ...user, profile: { ...(user.profile ?? {}), allergies: e.target.value.split(",").map(s => ({ name: s.trim() })) } })} />
        </div>
      </div>
      <Button className="mt-4" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
    </div>
  );
}
