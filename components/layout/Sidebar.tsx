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
    <aside className="sticky top-0 h-[calc(100vh)] w-64 shrink-0 border-r border-gray-100 bg-white/70 p-4 backdrop-blur">
      <div className="mb-6 text-xl font-semibold text-slate-900">{title}</div>
      <div className="space-y-1">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-gray-100",
            pathname === it.href && "bg-gray-100 text-slate-900 font-semibold"
          )}>
            {it.icon}
            {it.label}
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
          className="w-full rounded-xl bg-red-50 text-red-700 px-3 py-2 text-sm font-medium"
          disabled={processing}
        >
          {processing ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
