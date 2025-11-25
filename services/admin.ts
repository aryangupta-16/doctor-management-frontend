import { api } from "./api";

const ADMIN_PREFIX = process.env.NEXT_PUBLIC_ADMIN_PREFIX ?? "http://localhost:8000/api/admin";

function base(path: string) {
  return `${ADMIN_PREFIX}${path}`;
}

export const adminService = {
  async getDashboardStats() {
    return api.get(base(`/dashboard/stats`));
  },
  async getPendingDoctors(page?: number, limit?: number) {
    const q = [] as string[];
    if (typeof page !== "undefined") q.push(`page=${page}`);
    if (typeof limit !== "undefined") q.push(`limit=${limit}`);
    const url = q.length ? `${base(`/doctors/pending`)}?${q.join("&")}` : base(`/doctors/pending`);
    return api.get(url);
  },
  async approveDoctor(doctorId: string) {
    return api.post(base(`/doctors/${doctorId}/approve`));
  },
  async rejectDoctor(doctorId: string, reason: string) {
    return api.post(base(`/doctors/${doctorId}/reject`), { reason });
  },
  async listUsers(params?: { role?: string; isActive?: boolean; search?: string; page?: number; limit?: number }) {
    const q: string[] = [];
    if (params?.role) q.push(`role=${encodeURIComponent(params.role)}`);
    if (typeof params?.isActive !== "undefined") q.push(`isActive=${params.isActive}`);
    if (params?.search) q.push(`search=${encodeURIComponent(params.search)}`);
    if (typeof params?.page !== "undefined") q.push(`page=${params.page}`);
    if (typeof params?.limit !== "undefined") q.push(`limit=${params.limit}`);
    const url = q.length ? `${base(`/users`)}?${q.join("&")}` : base(`/users`);
    return api.get(url);
  },
  async suspendUser(userId: string, reason: string) {
    return api.post(base(`/users/${userId}/suspend`), { reason });
  },
  async reactivateUser(userId: string) {
    return api.post(base(`/users/${userId}/reactivate`));
  },
  async consultationsAnalytics(params?: { startDate?: string; endDate?: string; speciality?: string }) {
    const q: string[] = [];
    if (params?.startDate) q.push(`startDate=${encodeURIComponent(params.startDate)}`);
    if (params?.endDate) q.push(`endDate=${encodeURIComponent(params.endDate)}`);
    if (params?.speciality) q.push(`speciality=${encodeURIComponent(params.speciality)}`);
    const url = q.length ? `${base(`/analytics/consultations`)}?${q.join("&")}` : base(`/analytics/consultations`);
    return api.get(url);
  },
  async revenueAnalytics(params?: { startDate?: string; endDate?: string }) {
    const q: string[] = [];
    if (params?.startDate) q.push(`startDate=${encodeURIComponent(params.startDate)}`);
    if (params?.endDate) q.push(`endDate=${encodeURIComponent(params.endDate)}`);
    const url = q.length ? `${base(`/analytics/revenue`)}?${q.join("&")}` : base(`/analytics/revenue`);
    return api.get(url);
  },
  async doctorsAnalytics() {
    return api.get(base(`/analytics/doctors`));
  },
  async getAuditLogs(params?: { userId?: string; action?: string; entityType?: string; startDate?: string; endDate?: string; page?: number; limit?: number }) {
    const q: string[] = [];
    if (params?.userId) q.push(`userId=${encodeURIComponent(params.userId)}`);
    if (params?.action) q.push(`action=${encodeURIComponent(params.action)}`);
    if (params?.entityType) q.push(`entityType=${encodeURIComponent(params.entityType)}`);
    if (params?.startDate) q.push(`startDate=${encodeURIComponent(params.startDate)}`);
    if (params?.endDate) q.push(`endDate=${encodeURIComponent(params.endDate)}`);
    if (typeof params?.page !== "undefined") q.push(`page=${params.page}`);
    if (typeof params?.limit !== "undefined") q.push(`limit=${params.limit}`);
    const url = q.length ? `${base(`/audit-logs`)}?${q.join("&")}` : base(`/audit-logs`);
    return api.get(url);
  },
};

export default adminService;
