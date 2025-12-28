"use client";
import React, { useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { X, RotateCw, MessageCircle, ShieldAlert, Minus } from "lucide-react";
import { useChat } from "./ChatProvider";
import { Button } from "../ui/button";
import { cn } from "@/lib/cn";
import { DoctorCard } from "./DoctorCard";

export function ChatPanel() {
  const {
    open,
    messages,
    sending,
    initializing,
    error,
    closeChat,
    minimizeChat,
    sendMessage,
    resetChat,
  } = useChat();
  const [input, setInput] = React.useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, sending]);

  const statusLabel = useMemo(() => {
    if (initializing) return "Starting session...";
    if (sending) return "Thinking...";
    if (error) return error;
    return "Ask symptoms, get guidance";
  }, [error, initializing, sending]);

  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 z-50 transition-all duration-200",
        open
          ? "opacity-100 translate-x-0"
          : "pointer-events-none opacity-0 translate-x-4"
      )}
    >
      <div className="relative flex h-[640px] w-[460px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:h-[720px] sm:w-[520px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 bg-gradient-to-r from-sky-50 to-white">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <MessageCircle size={18} className="text-sky-600" />
              TeleMed Agent
            </div>
            <div className="text-xs text-slate-500">{statusLabel}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={resetChat}
              className="h-9 px-3"
            >
              <RotateCw size={14} />
              New chat
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={minimizeChat}
              className="h-9 px-2"
              title="Minimize"
            >
              <Minus size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeChat}
              className="h-9 px-2"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        <div
          ref={listRef}
          className="flex-1 overflow-y-auto bg-slate-50/40 px-4 py-3 space-y-3"
        >
          {messages.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
              Tell the agent your symptoms. The first response may include
              safety steps or a follow-up question. Emergency cases will prompt
              helpline guidance (112/108).
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                  msg.role === "user"
                    ? "bg-sky-600 text-white"
                    : "bg-white border border-slate-200 text-slate-800"
                )}
              >
                {msg.role === "agent" ? (
                  <>
                    <ReactMarkdown
                      className="space-y-2 text-sm leading-relaxed [&_p]:my-2 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:my-1"
                      components={{
                        p: ({ children }) => (
                          <p className="whitespace-pre-wrap">{children}</p>
                        ),
                        br: () => <br />,
                      }}
                    >
                      {msg.content.replace(/\\n/g, "\n")}
                    </ReactMarkdown>
                    {msg.metadata?.available_doctors &&
                      Array.isArray(msg.metadata.available_doctors) &&
                      msg.metadata.available_doctors.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {msg.metadata.available_doctors.map((doctor: any) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                          ))}
                        </div>
                      )}
                  </>
                ) : (
                  <span>{msg.content}</span>
                )}
                {msg.warning && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    <ShieldAlert size={14} className="mt-0.5" />
                    <span>{msg.warning}</span>
                  </div>
                )}
                <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                  {msg.intent && <span>{msg.intent}</span>}
                  {msg.riskLevel && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">
                      Risk: {msg.riskLevel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {(sending || initializing) && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm border border-slate-200">
                <span className="h-2 w-2 animate-ping rounded-full bg-sky-500" />
                Typing...
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 border border-rose-100">
                {error}
              </div>
            </div>
          )}
        </div>

        <form
          className="border-t border-slate-200 bg-white p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (sending || initializing) return;
            void sendMessage(input);
            setInput("");
          }}
        >
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe symptoms or ask for guidance"
              className="flex-1 bg-transparent text-sm text-slate-800 outline-none"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || sending || initializing}
            >
              Send
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Safety-first: emergency cases trigger 112/108 guidance.
          </p>
        </form>
      </div>
    </div>
  );
}
