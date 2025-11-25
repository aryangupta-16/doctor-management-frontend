"use client";
import React, { useEffect, useState } from "react";
import { DoctorCard } from "@/components/doctor-card";
import searchService from "@/services/search";

// Transform API response to DoctorCard format
function transformDoctor(apiDoctor: any) {
  return {
    id: apiDoctor.id,
    name: `Dr. ${apiDoctor.user?.firstName || ""} ${apiDoctor.user?.lastName || ""}`.trim(),
    speciality: apiDoctor.specialtyPrimary || "General Practitioner",
    experience: apiDoctor.yearsOfExperience || 0,
    hospital: "Hospital",
    photo: apiDoctor.user?.profile || "/avatar1.svg",
  };
}

export default function FeaturedDoctors({ limit = 3 }: { limit?: number }) {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await searchService.getFeatured(limit);
        const data = res?.data ?? res?.result ?? res;
        // Handle { success, result: { items, ... } } shape
        const items = data?.items ?? data?.data ?? data ?? [];
        const transformed = Array.isArray(items) ? items.map(transformDoctor) : [];
        setDoctors(transformed);
      } catch (e) {
        setDoctors([]);
      }
    })();
  }, [limit]);

  if (!doctors.length) return <div className="text-sm text-slate-600">No featured doctors.</div>;

  return (
    <div className="grid grid-cols-1 gap-4">
      {doctors.map((d) => <DoctorCard key={d.id} doctor={d} />)}
    </div>
  );
}
