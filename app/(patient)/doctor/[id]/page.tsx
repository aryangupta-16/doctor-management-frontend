"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import DoctorSlots from "@/components/availability/DoctorSlots";

type UserData = {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
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

export default function DoctorProfile() {
  const params = useParams();
  const userId = params?.id as string;
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-sm text-slate-600">Loading doctor profile...</div>;
  if (!user || !user.doctor) return <div className="text-sm text-red-600">Doctor not found.</div>;

  const doctor = user.doctor;
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center gap-4">
          {user.profilePicture ? (
            <Image src={user.profilePicture} alt={fullName} width={80} height={80} className="h-20 w-20 rounded-2xl object-cover" />
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-slate-200 flex items-center justify-center text-2xl font-semibold text-slate-600">
              {user.firstName[0]}{user.lastName[0]}
            </div>
          )}
          <div>
            <div className="text-2xl font-semibold text-slate-900">{fullName}</div>
            <div className="text-slate-600">
              {doctor.specialtyPrimary} • {doctor.yearsOfExperience} years
            </div>
            {doctor.isVerified && <Badge label="Verified" color="green" />}
          </div>
        </div>
        
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm text-slate-500">Consultation Fee</div>
            <div className="font-medium text-slate-900">₹{doctor.consultationFee || "N/A"}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Duration</div>
            <div className="font-medium text-slate-900">{doctor.consultationDuration || "N/A"} mins</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Rating</div>
            <div className="font-medium text-slate-900">{doctor.averageRating || "N/A"} ⭐ ({doctor.totalReviews || 0} reviews)</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Total Consultations</div>
            <div className="font-medium text-slate-900">{doctor.totalConsultations || 0}</div>
          </div>
          {doctor.languagesSpoken && doctor.languagesSpoken.length > 0 && (
            <div className="sm:col-span-2">
              <div className="text-sm text-slate-500">Languages</div>
              <div className="font-medium text-slate-900">{doctor.languagesSpoken.join(", ")}</div>
            </div>
          )}
          {doctor.specialtiesSecondary && doctor.specialtiesSecondary.length > 0 && (
            <div className="sm:col-span-2">
              <div className="text-sm text-slate-500">Additional Specialties</div>
              <div className="font-medium text-slate-900">{doctor.specialtiesSecondary.join(", ")}</div>
            </div>
          )}
        </div>

        {doctor.bio && (
          <div className="mt-6">
            <div className="text-sm text-slate-500 mb-2">About</div>
            <div className="text-slate-700">{doctor.bio}</div>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="mb-3 font-semibold text-slate-900">Select date & time</div>
          <DoctorSlots doctorId={doctor.id} />
        </div>
      </div>
    </div>
  );
}
