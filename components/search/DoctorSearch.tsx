"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DoctorCard } from "@/components/doctor-card";
import searchService from "@/services/search";

// Transform API response to DoctorCard format
function transformDoctor(apiDoctor: any) {
  return {
    id: apiDoctor.id,
    name: `Dr. ${apiDoctor.user?.firstName || ""} ${apiDoctor.user?.lastName || ""}`.trim(),
    speciality: apiDoctor.specialtyPrimary || "General Practitioner",
    experience: apiDoctor.yearsOfExperience || 0,
    hospital: "Hospital", // Not in API response, use default
    photo: apiDoctor.user?.profile || "/avatar1.svg",
  };
}

export default function DoctorSearch() {
  const [query, setQuery] = useState("");
  const [speciality, setSpeciality] = useState("all");
  const [location, setLocation] = useState("");
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await searchService.getSpecialities();
        const data = res?.data ?? res?.result ?? res;
        // Handle both array and wrapped { result: [...] } shapes
        const list = data?.items ?? data?.data ?? (Array.isArray(data) ? data : []);
        if (Array.isArray(list)) setSpecialities(list as string[]);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  async function doSearch() {
    setLoading(true);
    try {
      const filters: any = {};
      if (query) filters.q = query;
      if (speciality && speciality !== "all") filters.speciality = speciality;
      if (location) filters.location = location;
      const res = await searchService.searchDoctors(filters);
      const data = res?.data ?? res?.result ?? res;
      // Handle { success, result: { items, ... } } shape
      const items = data?.items ?? data?.data ?? data ?? [];
      const transformed = Array.isArray(items) ? items.map(transformDoctor) : [];
      setResults(transformed);
    } catch (e: any) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    doSearch();
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <Input placeholder="Search by name or speciality" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select value={speciality} onChange={(e) => setSpeciality(e.target.value)}>
            <option value="all">All specialities</option>
            {specialities.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <Button onClick={doSearch}>{loading ? "Searching..." : "Search"}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-sm text-slate-600">Searching...</div>
        ) : results.length ? (
          results.map((d: any) => <DoctorCard key={d.id} doctor={d} />)
        ) : (
          <div className="text-sm text-slate-600">No doctors found.</div>
        )}
      </div>
    </div>
  );
}
