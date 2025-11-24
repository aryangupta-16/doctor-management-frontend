// Lightweight fetch wrapper used by frontend services
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

async function request(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const token = getAccessToken();
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
  async del(path: string, body?: any) {
    return request(path, { method: "DELETE", body: body ? JSON.stringify(body) : undefined });
  },
};
