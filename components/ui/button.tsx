"use client";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium tracking-tight transition-all outline-none focus-visible:ring-2 ring-offset-2 ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-[0_18px_45px_rgba(30,64,175,0.65)] hover:shadow-[0_20px_55px_rgba(30,64,175,0.85)] hover:brightness-110 ring-blue-400/60",
        secondary:
          "border border-slate-700/70 bg-slate-900/40 text-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.8)] hover:bg-slate-800/70 hover:border-slate-500/80 ring-sky-400/40",
        ghost: "bg-transparent text-slate-100 hover:bg-slate-800/70",
      },
      size: {
        sm: "px-3 py-1.5 text-sm rounded-lg",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
