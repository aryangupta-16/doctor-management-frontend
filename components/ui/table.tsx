import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Table({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
      <table className="min-w-full divide-y divide-slate-200">{children}</table>
    </div>
  );
}
export function THead({ children }: { children?: ReactNode }) {
  return <thead className="bg-slate-50">{children}</thead>;
}
export function TBody({ children }: { children?: ReactNode }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>;
}
export function TR({ children }: { children?: ReactNode }) {
  return <tr className="transition-colors hover:bg-slate-50">{children}</tr>;
}
export function TH({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn("px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500", className)}>{children}</th>;
}
export function TD({ children, className, colSpan }: { children?: ReactNode; className?: string; colSpan?: number }) {
  return <td colSpan={colSpan} className={cn("px-6 py-4 text-sm text-slate-800", className)}>{children}</td>;
}
