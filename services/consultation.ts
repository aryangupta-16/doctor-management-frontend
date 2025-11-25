import { api } from "./api";

const CONSULT_PREFIX = process.env.NEXT_PUBLIC_CONSULTATION_PREFIX ?? "http://localhost:8000/api/consultation";

function base(path: string) {
  return `${CONSULT_PREFIX}${path}`;
}

export const consultationService = {
  book(payload: { slotId: string; ConsultationType?: string; chiefComplaint?: string; symptoms?: string }) {
    return api.post(base(`/book`), payload);
  },
  getMy(query?: { status?: string; page?: number; limit?: number }) {
    const qs = new URLSearchParams();
    if (query?.status) qs.set("status", String(query.status));
    if (query?.page) qs.set("page", String(query.page));
    if (query?.limit) qs.set("limit", String(query.limit));
    const q = qs.toString() ? `?${qs.toString()}` : "";
    return api.get(base(`/my${q}`));
  },
  getById(id: string) {
    return api.get(base(`/${id}`));
  },
  cancel(id: string, reason: string) {
    return api.post(base(`/${id}/cancel`), { reason });
  },
  reschedule(id: string, newSlotId: string, reason: string) {
    return api.post(base(`/${id}/reschedule`), { newSlotId, reason });
  },
  start(id: string) {
    return api.post(base(`/${id}/start`));
  },
  complete(id: string, payload: { diagnosis?: string; doctorNotes?: string; followUpRequired?: boolean; folllowUpDate?: string }) {
    return api.post(base(`/${id}/complete`), payload);
  },
  updateNotes(id: string, doctorNotes: string) {
    return api.put(base(`/${id}/notes`), { doctorNotes });
  },
};

export default consultationService;
