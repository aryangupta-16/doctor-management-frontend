import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-[0_14px_55px_rgba(15,23,42,0.95)] backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:-inset-px before:rounded-[1.25rem] before:bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.22),transparent_55%),radial-gradient(circle_at_120%_10%,rgba(129,140,248,0.26),transparent_60%)] before:opacity-70",
        "[&>*]:relative [&>*]:z-10",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between">{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-semibold text-slate-50">{children}</h3>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("text-slate-200", className)}>{children}</div>;
}
