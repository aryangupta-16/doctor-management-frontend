// Lightweight fetch wrapper used by frontend services
// Default to local backend on port 8000 when env var is not set
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const AUTH_PREFIX = process.env.NEXT_PUBLIC_AUTH_PREFIX ?? "/api/auth";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
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

async function refreshToken() {
  if (typeof window === "undefined") return null;
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;
  
  try {
    const res = await fetch(`${AUTH_PREFIX}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });
    const text = await res.text();
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (e) {
      // not json
    }
    
    if (res.ok && json?.accessToken) {
      localStorage.setItem("accessToken", json.accessToken);
      if (json.refreshToken) localStorage.setItem("refreshToken", json.refreshToken);
      return json.accessToken;
    }
  } catch (e) {
    // refresh failed
  }
  return null;
}

async function request(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  let token = getAccessToken();
  
  // Check if token is about to expire (within 1 minute) and refresh if needed
  if (token && typeof window !== "undefined") {
    const decoded = decodeJwt(token);
    const exp = decoded?.exp;
    if (typeof exp === "number") {
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = exp - now;
      if (timeUntilExpiry < 60) {
        // Token expires in less than 1 minute, try to refresh
        const newToken = await refreshToken();
        if (newToken) {
          token = newToken;
        }
      }
    }
  }
  
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers, credentials: "include" });
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    // not json
  }
  if (!res.ok) {
    // if Unauthorized — clear tokens and redirect to login so user must re-authenticate
    if (res.status === 401 && typeof window !== "undefined") {
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } finally {
        // use replace to avoid creating a back entry
        window.location.replace("/login");
      }
    }
    const err: any = new Error(json?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.data = json;
    throw err;
  }
  return json;
}

export const api = {
  async get(path: string) {
    return request(path, { method: "GET" });
  },
  async post(path: string, body?: any) {
    return request(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
  },
  async put(path: string, body?: any) {
    return request(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined });
  },
  async patch(path: string, body?: any) {
    return request(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined });
  },
  async del(path: string, body?: any) {
    return request(path, { method: "DELETE", body: body ? JSON.stringify(body) : undefined });
  },
};
