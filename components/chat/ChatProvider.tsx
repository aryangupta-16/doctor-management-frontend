"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { chatService, type ChatApiResponse } from "@/services/chat";

export type ChatMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp?: string;
  intent?: string | null;
  riskLevel?: string | null;
  warning?: string | null;
  metadata?: Record<string, any> | null;
};

export type BookingContext = {
  symptoms?: string;
  chiefComplaint?: string;
  structured_symptoms?: string[];
  specialties?: string[];
  city?: string;
};

type ChatContextValue = {
  open: boolean;
  fullscreen: boolean;
  messages: ChatMessage[];
  sessionId?: string;
  sending: boolean;
  initializing: boolean;
  error?: string | null;
  bookingContext?: BookingContext;
  openChat: () => Promise<void>;
  closeChat: () => void;
  minimizeChat: () => void;
  toggleFullscreen: () => void;
  sendMessage: (text: string) => Promise<void>;
  resetChat: () => Promise<void>;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
    return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 11);
}

// No handshake here; first user message will start the session.

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const sessionIdRef = useRef<string | undefined>(undefined);
  const [sending, setSending] = useState(false);
  const [initializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingContext, setBookingContext] = useState<BookingContext>();
  // No pre-session initialization needed.

  const setSession = useCallback((id?: string) => {
    sessionIdRef.current = id;
    setSessionId(id);
  }, []);

  const appendAgentMessage = useCallback((payload: ChatApiResponse) => {
    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role: "agent",
        content: payload.response,
        intent: payload.intent ?? null,
        riskLevel: payload.risk_level ?? null,
        warning: payload.warning ?? null,
        metadata: payload.metadata ?? null,
        timestamp: payload.timestamp,
      },
    ]);
    // Extract booking context from metadata if available
    if (payload.metadata?.booking_context) {
      const ctx = payload.metadata.booking_context;
      setBookingContext({
        symptoms: ctx.symptoms,
        chiefComplaint: ctx.symptoms, // use symptoms as chief complaint
        structured_symptoms: ctx.structured_symptoms,
        specialties: ctx.specialties,
        city: ctx.city,
      });
    }
  }, []);

  // We let the backend issue session_id on first send.

  const openChat = useCallback(async () => {
    setError(null);
    setOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setOpen(false);
    setFullscreen(false);
  }, []);

  const minimizeChat = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setFullscreen((prev) => !prev);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setError(null);
      setSending(true);
      try {
        const ensuredSession = sessionIdRef.current; // may be undefined on first send

        const userMessage = {
          id: createId(),
          role: "user" as const,
          content: trimmed,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);

        const res = await chatService.sendMessage(trimmed, ensuredSession);
        setSession(res.session_id);
        appendAgentMessage(res);
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
      } finally {
        setSending(false);
      }
    },
    [appendAgentMessage, setSession]
  );

  const resetChat = useCallback(async () => {
    setMessages([]);
    setSession(undefined);
    setError(null);
    setFullscreen(false);
    setOpen(true);
    setBookingContext(undefined);
  }, [setSession]);

  const value = useMemo<ChatContextValue>(
    () => ({
      open,
      fullscreen,
      messages,
      sessionId,
      sending,
      initializing,
      error,
      bookingContext,
      openChat,
      closeChat,
      minimizeChat,
      toggleFullscreen,
      sendMessage,
      resetChat,
    }),
    [
      open,
      fullscreen,
      messages,
      sessionId,
      sending,
      initializing,
      error,
      bookingContext,
      openChat,
      closeChat,
      minimizeChat,
      toggleFullscreen,
      sendMessage,
      resetChat,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
