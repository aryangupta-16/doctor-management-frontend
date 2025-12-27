import { api } from "./api";

const CONSULT_PREFIX = process.env.NEXT_PUBLIC_CONSULTATION_PREFIX ?? "/api/consultation";

function base(path: string) {
  return `${CONSULT_PREFIX}${path}`;
}

export const consultationService = {
  // Admin endpoints
  adminGetAll(query?: { page?: number; limit?: number; status?: string; patientId?: string; doctorId?: string; startDate?: string; endDate?: string }) {
    const qs = new URLSearchParams();
    if (query?.page) qs.set("page", String(query.page));
    if (query?.limit) qs.set("limit", String(query.limit));
    if (query?.status) qs.set("status", query.status);
    if (query?.patientId) qs.set("patientId", query.patientId);
    if (query?.doctorId) qs.set("doctorId", query.doctorId);
    if (query?.startDate) qs.set("startDate", query.startDate);
    if (query?.endDate) qs.set("endDate", query.endDate);
    const q = qs.toString() ? `?${qs.toString()}` : "";
    return api.get(base(`/admin/all${q}`));
  },

  // Doctor endpoints
  doctorList(query?: { page?: number; limit?: number; status?: string; startDate?: string; endDate?: string }) {
    const qs = new URLSearchParams();
    if (query?.page) qs.set("page", String(query.page));
    if (query?.limit) qs.set("limit", String(query.limit));
    if (query?.status) qs.set("status", query.status);
    if (query?.startDate) qs.set("startDate", query.startDate);
    if (query?.endDate) qs.set("endDate", query.endDate);
    const q = qs.toString() ? `?${qs.toString()}` : "";
    return api.get(base(`/doctor/list${q}`));
  },
  doctorPending(query?: { page?: number; limit?: number }) {
    const qs = new URLSearchParams();
    if (query?.page) qs.set("page", String(query.page));
    if (query?.limit) qs.set("limit", String(query.limit));
    const q = qs.toString() ? `?${qs.toString()}` : "";
    return api.get(base(`/doctor/pending${q}`));
  },

  // Patient endpoints
  patientList(query?: { page?: number; limit?: number; status?: string; doctorId?: string; startDate?: string; endDate?: string }) {
    const qs = new URLSearchParams();
    if (query?.page) qs.set("page", String(query.page));
    if (query?.limit) qs.set("limit", String(query.limit));
    if (query?.status) qs.set("status", query.status);
    if (query?.doctorId) qs.set("doctorId", query.doctorId);
    if (query?.startDate) qs.set("startDate", query.startDate);
    if (query?.endDate) qs.set("endDate", query.endDate);
    const q = qs.toString() ? `?${qs.toString()}` : "";
    return api.get(base(`/patient/list${q}`));
  },

  // Shared endpoints
  upcoming(query?: { page?: number; limit?: number }) {
    const qs = new URLSearchParams();
    if (query?.page) qs.set("page", String(query.page));
    if (query?.limit) qs.set("limit", String(query.limit));
    const q = qs.toString() ? `?${qs.toString()}` : "";
    return api.get(base(`/upcoming${q}`));
  },
  completed(query?: { page?: number; limit?: number; startDate?: string; endDate?: string }) {
    const qs = new URLSearchParams();
    if (query?.page) qs.set("page", String(query.page));
    if (query?.limit) qs.set("limit", String(query.limit));
    if (query?.startDate) qs.set("startDate", query.startDate);
    if (query?.endDate) qs.set("endDate", query.endDate);
    const q = qs.toString() ? `?${qs.toString()}` : "";
    return api.get(base(`/completed${q}`));
  },

  // Legacy endpoint (for backward compatibility)
  getMy(query?: { status?: string; page?: number; limit?: number }) {
    const qs = new URLSearchParams();
    if (query?.status) qs.set("status", String(query.status));
    if (query?.page) qs.set("page", String(query.page));
    if (query?.limit) qs.set("limit", String(query.limit));
    const q = qs.toString() ? `?${qs.toString()}` : "";
    return api.get(base(`/my${q}`));
  },

  // Get by ID
  getById(id: string) {
    return api.get(base(`/${id}`));
  },

  // Booking
  book(payload: { slotId: string; consultationType?: string; chiefComplaint?: string; symptoms?: string | string[] }) {
    return api.post(base(`/book`), payload);
  },

  // Actions
  start(id: string) {
    return api.post(base(`/${id}/start`), {});
  },
  complete(id: string, payload: { diagnosis?: string; doctorNotes?: string; followUpRequired?: boolean; folllowUpDate?: string }) {
    return api.post(base(`/${id}/complete`), payload);
  },
  cancel(id: string, reason: string) {
    return api.post(base(`/${id}/cancel`), { reason });
  },
  reschedule(id: string, newSlotId: string, reason: string) {
    return api.post(base(`/${id}/reschedule`), { newSlotId, reason });
  },
  updateNotes(id: string, doctorNotes: string) {
    return api.patch(base(`/${id}/notes`), { doctorNotes });
  },
};

export default consultationService;
