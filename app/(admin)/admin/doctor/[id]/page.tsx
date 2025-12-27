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
  doctor?: {
    id: string;
    licenseNumber?: string;
    specialtyPrimary?: string;
    specialtiesSecondary?: string[];
    yearsOfExperience?: number;
    consultationFee?: string;
    consultationDuration?: number;
    bio?: string;
    languagesSpoken?: string[];
    isVerified?: boolean;
    averageRating?: string;
    totalConsultations?: number;
    totalReviews?: number;
  };
};

export default function AdminDoctorDetail() {
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
    if (!user || !confirm("Are you sure you want to suspend this doctor?")) return;
    setActionLoading(true);
    try {
      const reason = prompt("Enter suspension reason:");
      if (!reason) return;
      await adminService.suspendUser(user.id, reason);
      alert("Doctor suspended");
      router.push("/admin/doctors");
    } catch (e: any) {
      alert(e?.message || "Failed to suspend doctor");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReactivate() {
    if (!user || !confirm("Are you sure you want to reactivate this doctor?")) return;
    setActionLoading(true);
    try {
      await adminService.reactivateUser(user.id);
      alert("Doctor reactivated");
      setUser({ ...user, isActive: true });
    } catch (e: any) {
      alert(e?.message || "Failed to reactivate doctor");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleApprove() {
    if (!user?.doctor || !confirm("Are you sure you want to approve this doctor?")) return;
    setActionLoading(true);
    try {
      await adminService.approveDoctor(user.doctor.id);
      alert("Doctor approved");
      if (user.doctor) {
        setUser({ ...user, doctor: { ...user.doctor, isVerified: true } });
      }
    } catch (e: any) {
      alert(e?.message || "Failed to approve doctor");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <div className="text-sm text-slate-600">Loading doctor details...</div>;
  if (!user) return <div className="text-sm text-red-600">Doctor not found.</div>;

  const doctor = user.doctor;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Doctor Details</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.back()}>Back</Button>
          {doctor && !doctor.isVerified && (
            <Button onClick={handleApprove} disabled={actionLoading}>
              {actionLoading ? "Processing..." : "Approve Doctor"}
            </Button>
          )}
          {user.isActive ? (
            <Button onClick={handleSuspend} disabled={actionLoading}>
              {actionLoading ? "Processing..." : "Suspend Doctor"}
            </Button>
          ) : (
            <Button onClick={handleReactivate} disabled={actionLoading}>
              {actionLoading ? "Processing..." : "Reactivate Doctor"}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
          <Badge label={user.isActive ? "Active" : "Suspended"} color={user.isActive ? "green" : "red"} />
          <Badge label={user.role} color="blue" />
          {doctor?.isVerified && <Badge label="Verified" color="green" />}
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

      {doctor && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Professional Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-slate-500">License Number</div>
              <div className="font-medium text-slate-900">{doctor.licenseNumber || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Primary Specialty</div>
              <div className="font-medium text-slate-900">{doctor.specialtyPrimary || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Years of Experience</div>
              <div className="font-medium text-slate-900">{doctor.yearsOfExperience || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Consultation Fee</div>
              <div className="font-medium text-slate-900">₹{doctor.consultationFee || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Consultation Duration</div>
              <div className="font-medium text-slate-900">{doctor.consultationDuration || "N/A"} mins</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Average Rating</div>
              <div className="font-medium text-slate-900">{doctor.averageRating || "N/A"} ⭐</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Total Consultations</div>
              <div className="font-medium text-slate-900">{doctor.totalConsultations || 0}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Total Reviews</div>
              <div className="font-medium text-slate-900">{doctor.totalReviews || 0}</div>
            </div>
            {doctor.specialtiesSecondary && doctor.specialtiesSecondary.length > 0 && (
              <div className="sm:col-span-2">
                <div className="text-sm text-slate-500">Secondary Specialties</div>
                <div className="font-medium text-slate-900">{doctor.specialtiesSecondary.join(", ")}</div>
              </div>
            )}
            {doctor.languagesSpoken && doctor.languagesSpoken.length > 0 && (
              <div className="sm:col-span-2">
                <div className="text-sm text-slate-500">Languages Spoken</div>
                <div className="font-medium text-slate-900">{doctor.languagesSpoken.join(", ")}</div>
              </div>
            )}
            {doctor.bio && (
              <div className="sm:col-span-2">
                <div className="text-sm text-slate-500">Bio</div>
                <div className="font-medium text-slate-900">{doctor.bio}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
