import { api } from "./api";

const PRESCRIPTION_PREFIX = process.env.NEXT_PUBLIC_PRESCRIPTION_PREFIX ?? "http://localhost:8000/api/prescriptions";

function base(path: string) {
  return `${PRESCRIPTION_PREFIX}${path}`;
}

export const prescriptionService = {
  // Create a new prescription (doctor only)
  createPrescription(payload: { consultationId: string; medications: any[]; instructions?: string; validUntil?: string }) {
    return api.post(base(""), payload);
  },

  // Get current user's prescriptions (patient or doctor)
  getMy(query?: { page?: number; limit?: number; search?: string }) {
    const qs = new URLSearchParams();
    if (query?.page) qs.set("page", String(query.page));
    if (query?.limit) qs.set("limit", String(query.limit));
    if (query?.search) qs.set("search", query.search);
    const q = qs.toString() ? `?${qs.toString()}` : "";
    return api.get(base(`/my${q}`));
  },

  // Get prescription by ID
  getById(id: string) {
    return api.get(base(`/${id}`));
  },

  // Get prescription by consultation ID
  getByConsultation(consultationId: string) {
    return api.get(base(`/consultation/${consultationId}`));
  },

  // Update prescription (doctor only)
  update(id: string, payload: { medications?: any[]; instructions?: string; validUntil?: string }) {
    return api.patch(base(`/${id}`), payload);
  },

  // Delete prescription (doctor only)
  delete(id: string) {
    return api.del(base(`/${id}`));
  },

  // Download prescription
  download(id: string) {
    return api.get(base(`/${id}/download`));
  },
};

export default prescriptionService;
