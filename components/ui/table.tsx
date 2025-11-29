import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Table({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 shadow-[0_12px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl", className)}>
      <table className="min-w-full divide-y divide-slate-800/70">{children}</table>
    </div>
  );
}
export function THead({ children }: { children?: ReactNode }) {
  return <thead className="bg-slate-900/80">{children}</thead>;
}
export function TBody({ children }: { children?: ReactNode }) {
  return <tbody className="divide-y divide-slate-800/60">{children}</tbody>;
}
export function TR({ children }: { children?: ReactNode }) {
  return <tr className="transition-colors hover:bg-slate-800/60">{children}</tr>;
}
export function TH({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn("px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300", className)}>{children}</th>;
}
export function TD({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("px-6 py-4 text-sm text-slate-100", className)}>{children}</td>;
}
