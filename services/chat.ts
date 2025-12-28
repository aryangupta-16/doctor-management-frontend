export type ChatApiResponse = {
  response: string;
  session_id: string;
  intent?: string | null;
  risk_level?: string | null;
  active_graph?: string | null;
  message_count?: number;
  timestamp?: string;
  metadata?: Record<string, any> | null;
  warning?: string | null;
};

const CHAT_BASE = process.env.NEXT_PUBLIC_CHAT_API_URL ?? "http://localhost:8001";

async function chatRequest(body: { message: string; session_id?: string | null }) {
  const res = await fetch(`${CHAT_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    // response not json
  }

  if (!res.ok) {
    const err: any = new Error(json?.message || res.statusText || "Chat request failed");
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json as ChatApiResponse;
}

export const chatService = {
  // Optional connectivity check; does not invoke the agent
  health: async () => {
    try {
      const res = await fetch(`${CHAT_BASE}/health`, { method: "GET" });
      return res.ok;
    } catch {
      return false;
    }
  },
  // Send a chat message. If sessionId is undefined, backend will start a session.
  sendMessage: async (message: string, sessionId?: string) =>
    chatRequest(sessionId ? { message, session_id: sessionId } : { message }),
};
