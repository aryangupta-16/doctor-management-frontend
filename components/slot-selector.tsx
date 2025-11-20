"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function SlotSelector({ slots, onChange }: { slots: string[]; onChange?: (slot: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {slots.map((s) => (
        <button
          key={s}
          onClick={() => { setSelected(s); onChange?.(s); }}
          className={cn(
            "rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-slate-800 shadow-sm hover:shadow transition-all",
            selected === s && "border-blue-500 ring-2 ring-blue-200"
          )}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
