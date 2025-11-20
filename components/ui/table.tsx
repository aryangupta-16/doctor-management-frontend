import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Table({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm", className)}>
      <table className="min-w-full divide-y divide-gray-100">{children}</table>
    </div>
  );
}
export function THead({ children }: { children?: ReactNode }) {
  return <thead className="bg-gray-50/70">{children}</thead>;
}
export function TBody({ children }: { children?: ReactNode }) {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>;
}
export function TR({ children }: { children?: ReactNode }) {
  return <tr className="hover:bg-gray-50/60 transition-colors">{children}</tr>;
}
export function TH({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn("px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600", className)}>{children}</th>;
}
export function TD({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("px-6 py-4 text-sm text-slate-800", className)}>{children}</td>;
}
