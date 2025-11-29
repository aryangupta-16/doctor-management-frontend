import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-2 text-sm text-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.9)] outline-none transition-all",
        "placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40",
        props.className
      )}
    />
  );
}
