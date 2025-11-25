import { api } from "./api";

const AVAIL_PREFIX = process.env.NEXT_PUBLIC_AVAILABILITY_PREFIX ?? "http://localhost:8000/api/availability";

function base(path: string) {
  return `${AVAIL_PREFIX}${path}`;
}

export const availabilityService = {
  createSchedule(payload: { dayOfWeek: number; startTime: string; endTime: string }) {
    return api.post(base(`/schedule`), payload);
  },
  getSchedule() {
    return api.get(base(`/schedule`));
  },
  updateSchedule(scheduleId: string, payload: { dayOfWeek?: number; startTime?: string; endTime?: string; isActive?: boolean }) {
    return api.put(base(`/schedule/${scheduleId}`), payload);
  },
  deleteSchedule(scheduleId: string) {
    return api.del(base(`/schedule/${scheduleId}`));
  },
  generateSlots(payload: { startDate: string; endDate: string; slotDuration: number }) {
    return api.post(base(`/slots/generate`), payload);
  },
  getSlots(query?: { date?: string; status?: string; startDate?: string; endDate?: string }) {
    const qs = new URLSearchParams();
    if (query?.date) qs.set("date", String(query.date));
    if (query?.status) qs.set("status", String(query.status));
    if (query?.startDate) qs.set("startDate", String(query.startDate));
    if (query?.endDate) qs.set("endDate", String(query.endDate));
    const q = qs.toString() ? `?${qs.toString()}` : "";
    return api.get(base(`/slots${q}`));
  },
  blockSlots(payload: { slotIds: string[]; reason?: string }) {
    return api.post(base(`/block`), payload);
  },
  getDoctorSlots(doctorId: string, query?: { date?: string; startDate?: string; endDate?: string; limit?: number }) {
    const qs = new URLSearchParams();
    if (query?.date) qs.set("date", String(query.date));
    if (query?.startDate) qs.set("startDate", String(query.startDate));
    if (query?.endDate) qs.set("endDate", String(query.endDate));
    if (query?.limit) qs.set("limit", String(query.limit));
    const q = qs.toString() ? `?${qs.toString()}` : "";
    return api.get(base(`/doctor/${doctorId}${q}`));
  },
};

export default availabilityService;
