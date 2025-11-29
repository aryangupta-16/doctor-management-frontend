"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/services/auth";

export function Sidebar({ items, title }: { items: { href: string; label: string; icon?: React.ReactNode }[]; title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  return (
    <aside className="sticky top-4 h-[calc(100vh-2rem)] w-64 shrink-0 rounded-3xl border border-white/5 bg-slate-900/60 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-2xl animate-[subtle-fade-up_320ms_ease-out]">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm font-medium uppercase tracking-[0.16em] text-slate-400">{title}</div>
        <div className="h-7 w-7 rounded-2xl bg-gradient-to-br from-sky-400/70 via-blue-500/80 to-indigo-500/80 shadow-[0_0_0_1px_rgba(148,163,184,0.3)]" />
      </div>
      <div className="space-y-1">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className={cn(
            "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800/70 hover:text-slate-50",
            pathname === it.href && "bg-slate-800/90 text-slate-50 shadow-[0_0_0_1px_rgba(148,163,184,0.5)]"
          )}>
            <span className="text-slate-400 group-hover:text-sky-300">
              {it.icon}
            </span>
            <span className="truncate">
              {it.label}
            </span>
          </Link>
        ))}
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
          className="w-full rounded-2xl bg-gradient-to-r from-rose-500/90 via-rose-500 to-orange-500/90 px-3 py-2.5 text-sm font-medium text-white shadow-[0_18px_45px_rgba(190,18,60,0.55)] transition hover:brightness-105 disabled:opacity-60"
          disabled={processing}
        >
          {processing ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
