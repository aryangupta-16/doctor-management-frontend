import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 shadow-sm outline-none transition-all",
        "placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200",
        props.className
      )}
    />
  );
}
