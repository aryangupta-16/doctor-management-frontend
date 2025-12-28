"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/services/auth";
import { ChatLauncher } from "@/components/chat/ChatLauncher";

export function Sidebar({
  items,
  title,
}: {
  items: { href: string; label: string; icon?: React.ReactNode }[];
  title: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  return (
    <aside className="sticky top-4 h-[calc(100vh-2rem)] w-64 shrink-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm animate-[subtle-fade-up_320ms_ease-out]">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
          {title}
        </div>
        <div className="h-7 w-7 rounded-2xl bg-sky-100 text-sky-700 grid place-items-center text-xs font-semibold">
          TM
        </div>
      </div>
      <div className="space-y-1">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100",
              pathname === it.href &&
                "bg-slate-100 text-slate-900 border border-slate-200"
            )}
          >
            <span className="text-slate-400 group-hover:text-sky-600">
              {it.icon}
            </span>
            <span className="truncate">{it.label}</span>
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <ChatLauncher label="Chat with us" />
      </div>
      <div className="mt-6">
        <button
          onClick={async () => {
            setProcessing(true);
            try {
              await auth.logout();
            } finally {
              setProcessing(false);
              router.push("/login");
            }
          }}
          className="w-full rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
          disabled={processing}
        >
          {processing ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
