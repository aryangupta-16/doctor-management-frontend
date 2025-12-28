"use client";
import { MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useChat } from "./ChatProvider";

export function ChatLauncher({ label = "Chat with us" }: { label?: string }) {
  const { openChat } = useChat();
  return (
    <Button
      variant="secondary"
      onClick={() => void openChat()}
      className="rounded-2xl"
    >
      <MessageCircle size={16} />
      {label}
    </Button>
  );
}
