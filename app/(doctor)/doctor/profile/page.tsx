"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

export default function DoctorProfileEdit() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [doc, setDoc] = useState<any>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Fetch from /api/doctors/me which returns { success: true, doctor: {...} }
        const dres = await api.get("/api/doctors/me");
        const payload = dres?.doctor ?? dres?.data?.doctor ?? dres?.data ?? dres;
        setDoc(payload ?? null);
      } catch (e) {
        // ignore errors (unauthenticated or not found)
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave() {
    if (!doc) return;
    setSaving(true);
    try {
      await api.put(`/api/doctors/me`, doc);
      alert("Saved");
    } catch (e: any) {
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-sm text-slate-600">Loading doctor profile...</div>;
  if (!doc) return <div className="text-sm text-red-600">Doctor profile not available.</div>;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">Doctor Profile</h2>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Personal Information */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">First Name</label>
          <Input value={doc.user?.firstName ?? ""} onChange={(e) => setDoc({ ...doc, user: { ...(doc.user ?? {}), firstName: e.target.value } })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Last Name</label>
          <Input value={doc.user?.lastName ?? ""} onChange={(e) => setDoc({ ...doc, user: { ...(doc.user ?? {}), lastName: e.target.value } })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <Input type="email" disabled value={doc.user?.email ?? ""} className="bg-slate-50" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
          <Input type="tel" disabled value={doc.user?.phoneNumber ?? ""} className="bg-slate-50" />
        </div>

        {/* Professional Information */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">License Number</label>
          <Input value={doc.licenseNumber ?? ""} onChange={(e) => setDoc({ ...doc, licenseNumber: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Primary Specialty</label>
          <Input value={doc.specialtyPrimary ?? ""} onChange={(e) => setDoc({ ...doc, specialtyPrimary: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Secondary Specialties (comma separated)</label>
          <Input 
            value={(doc.specialtiesSecondary ?? []).join(", ")} 
            onChange={(e) => setDoc({ ...doc, specialtiesSecondary: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} 
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Years of Experience</label>
          <Input type="number" value={String(doc.yearsOfExperience ?? "")} onChange={(e) => setDoc({ ...doc, yearsOfExperience: Number(e.target.value) })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Consultation Fee</label>
          <Input type="number" value={doc.consultationFee ?? ""} onChange={(e) => setDoc({ ...doc, consultationFee: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Consultation Duration (min)</label>
          <Input type="number" value={String(doc.consultationDuration ?? "")} onChange={(e) => setDoc({ ...doc, consultationDuration: Number(e.target.value) })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Languages Spoken (comma separated)</label>
          <Input 
            value={(doc.languagesSpoken ?? []).join(", ")} 
            onChange={(e) => setDoc({ ...doc, languagesSpoken: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} 
          />
        </div>

        {/* Bio */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Bio</label>
          <Textarea rows={4} value={doc.bio ?? ""} onChange={(e) => setDoc({ ...doc, bio: e.target.value })} />
        </div>

        {/* Education */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Education (JSON format)</label>
          <Textarea 
            rows={3} 
            value={JSON.stringify(doc.education ?? [], null, 2)} 
            onChange={(e) => {
              try {
                setDoc({ ...doc, education: JSON.parse(e.target.value) });
              } catch {
                // Keep previous value if invalid JSON
              }
            }} 
            placeholder='[{"year": 2015, "degree": "MBBS", "college": "Medical College"}]'
          />
        </div>

        {/* Certifications */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Certifications (JSON format)</label>
          <Textarea 
            rows={3} 
            value={JSON.stringify(doc.certifications ?? [], null, 2)} 
            onChange={(e) => {
              try {
                setDoc({ ...doc, certifications: JSON.parse(e.target.value) });
              } catch {
                // Keep previous value if invalid JSON
              }
            }} 
            placeholder='[{"name": "Medical Council Registration", "year": 2017}]'
          />
        </div>

        {/* Read-only Statistics */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Verification Status</label>
          <Input 
            disabled 
            value={doc.isVerified ? "Verified" : "Not Verified"} 
            className="bg-slate-50"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Average Rating</label>
          <Input disabled value={doc.averageRating ?? "N/A"} className="bg-slate-50" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Total Consultations</label>
          <Input disabled value={String(doc.totalConsultations ?? 0)} className="bg-slate-50" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Total Reviews</label>
          <Input disabled value={String(doc.totalReviews ?? 0)} className="bg-slate-50" />
        </div>
      </div>

      <Button className="mt-6" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
