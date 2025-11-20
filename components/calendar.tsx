"use client";
import { useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { Button } from "./ui/button";

export function MiniCalendar({ onSelect }: { onSelect?: (date: Date) => void }) {
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(new Date(), i)), []);
  const [active, setActive] = useState(0);
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d, i) => (
        <Button
          key={i}
          variant={active === i ? "primary" : "secondary"}
          size="sm"
          className="rounded-2xl"
          onClick={() => {
            setActive(i);
            onSelect?.(d);
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase text-slate-500">{format(d, "EEE")}</span>
            <span className="text-sm font-semibold">{format(d, "d")}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}
