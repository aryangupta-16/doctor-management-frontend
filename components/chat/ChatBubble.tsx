"use client";
import { MessageCircle } from "lucide-react";
import { useChat } from "./ChatProvider";
import { cn } from "@/lib/cn";

export function ChatBubble() {
  const { open, openChat, messages } = useChat();
  const unreadCount = messages.length;

  if (open) return null;

  return (
    <button
      onClick={() => void openChat()}
      className={cn(
        "fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center",
        "animate-[subtle-fade-up_280ms_ease-out]"
      )}
      aria-label="Open chat"
    >
      <MessageCircle size={24} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-xs font-semibold flex items-center justify-center border-2 border-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}
