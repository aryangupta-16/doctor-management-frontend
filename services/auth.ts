import { api } from "./api";

const AUTH_PREFIX = process.env.NEXT_PUBLIC_AUTH_PREFIX ?? "http://localhost:8000/api/auth";

function base(path: string) {
  return `${AUTH_PREFIX}${path}`;
}

function decodeJwt(token: string | null) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function saveTokens(accessToken: string, refreshToken?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
}

function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

export const auth = {
  async register(payload: { email: string; password: string; firstName?: string; lastName?: string }) {
    // register returns success + data (id, email)
    return api.post(base("/register"), payload);
  },
  async registerDoctor(payload: { email: string; password: string; firstName?: string; lastName?: string }) {
    return api.post(base("/register-doctor"), payload);
  },
  async login(payload: { email: string; password: string }) {
    const res = await api.post(base("/login"), payload);
    // sample response: { success: true, data: { accessToken, refreshToken, user } }
    const data = res?.data ?? res;
    if (data?.accessToken) {
      saveTokens(data.accessToken, data.refreshToken);
      if (data.user && typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(data.user));
      const decoded = decodeJwt(data.accessToken);
      const roleClaim = decoded?.roles ?? decoded?.role ?? null;
      const role = typeof roleClaim === "string" ? roleClaim.toLowerCase() : null;
      return { user: data.user ?? null, role, accessToken: data.accessToken };
    }
    return data;
  },
  async refresh() {
    if (typeof window === "undefined") return null;
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;
    const res = await api.post(base("/refresh"), { refreshToken });
    const data = res?.data ?? res;
    if (data?.accessToken) {
      saveTokens(data.accessToken, data.refreshToken ?? refreshToken);
      return data.accessToken;
    }
    return null;
  },
  async logout() {
    if (typeof window === "undefined") return;
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await api.post(base("/logout"), { refreshToken });
    } catch (e) {
      // ignore errors
    }
    clearTokens();
  },
  async forgotPassword(email: string) {
    return api.post(base("/forgot-password"), { email });
  },
  async resetPassword(token: string, newPassword: string) {
    return api.post(base("/reset-password"), { token, newPassword });
  },
  async verifyEmail(query: string) {
    // `verify-email` may use query params; caller should build the path
    return api.get(`${base("/verify-email")}${query ? `?${query}` : ""}`);
  },
  async resendVerification(email: string) {
    return api.post(base("/resend-verification"), { email });
  },
  getUser() {
    if (typeof window === "undefined") return null;
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  },
  getRole() {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("accessToken");
    const decoded = decodeJwt(token);
    // if token has expired, clear stored tokens and return null
    const exp = decoded?.exp;
    if (typeof exp === "number") {
      const now = Math.floor(Date.now() / 1000);
      if (now >= exp) {
        clearTokens();
        return null;
      }
    }
    const roleClaim = decoded?.roles ?? decoded?.role ?? null;
    return typeof roleClaim === "string" ? roleClaim.toLowerCase() : null;
  },
  clear: clearTokens,
};

export default auth;
