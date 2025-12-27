"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import adminService from "@/services/admin";

type UserData = {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  profilePicture?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    preferredLanguage?: string;
  };
};

export default function AdminPatientDetail() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await api.get(`/api/users/${userId}`);
        const data = res?.data ?? res;
        setUser(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  async function handleSuspend() {
    if (!user || !confirm("Are you sure you want to suspend this patient?")) return;
    setActionLoading(true);
    try {
      const reason = prompt("Enter suspension reason:");
      if (!reason) return;
      await adminService.suspendUser(user.id, reason);
      alert("Patient suspended");
      router.push("/admin/patients");
    } catch (e: any) {
      alert(e?.message || "Failed to suspend patient");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReactivate() {
    if (!user || !confirm("Are you sure you want to reactivate this patient?")) return;
    setActionLoading(true);
    try {
      await adminService.reactivateUser(user.id);
      alert("Patient reactivated");
      setUser({ ...user, isActive: true });
    } catch (e: any) {
      alert(e?.message || "Failed to reactivate patient");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <div className="text-sm text-slate-600">Loading patient details...</div>;
  if (!user) return <div className="text-sm text-red-600">Patient not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Patient Details</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.back()}>Back</Button>
          {user.isActive ? (
            <Button onClick={handleSuspend} disabled={actionLoading}>
              {actionLoading ? "Processing..." : "Suspend Patient"}
            </Button>
          ) : (
            <Button onClick={handleReactivate} disabled={actionLoading}>
              {actionLoading ? "Processing..." : "Reactivate Patient"}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
          <Badge label={user.isActive ? "Active" : "Suspended"} color={user.isActive ? "green" : "red"} />
          <Badge label={user.role} color="blue" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm text-slate-500">Full Name</div>
            <div className="font-medium text-slate-900">{`${user.firstName} ${user.lastName}`}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Email</div>
            <div className="font-medium text-slate-900">{user.email}</div>
            {user.emailVerified && <Badge label="Verified" color="green" />}
          </div>
          <div>
            <div className="text-sm text-slate-500">Phone</div>
            <div className="font-medium text-slate-900">{user.phoneNumber}</div>
            {user.phoneVerified && <Badge label="Verified" color="green" />}
          </div>
          <div>
            <div className="text-sm text-slate-500">Date of Birth</div>
            <div className="font-medium text-slate-900">
              {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Gender</div>
            <div className="font-medium text-slate-900">{user.gender || "N/A"}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Joined</div>
            <div className="font-medium text-slate-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {user.profile && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Address Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-slate-500">Address</div>
              <div className="font-medium text-slate-900">
                {user.profile.addressLine1 || "N/A"}
                {user.profile.addressLine2 && `, ${user.profile.addressLine2}`}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500">City</div>
              <div className="font-medium text-slate-900">{user.profile.city || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">State</div>
              <div className="font-medium text-slate-900">{user.profile.state || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Pincode</div>
              <div className="font-medium text-slate-900">{user.profile.pincode || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Country</div>
              <div className="font-medium text-slate-900">{user.profile.country || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Preferred Language</div>
              <div className="font-medium text-slate-900">{user.profile.preferredLanguage || "N/A"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
