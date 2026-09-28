"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "subtle";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-900 text-white hover:bg-brand-800 active:bg-brand-950 shadow-sm disabled:bg-slate-300",
  secondary:
    "bg-white text-brand-900 border border-slate-300 hover:border-brand-400 hover:bg-brand-50 active:bg-brand-100",
  ghost: "text-brand-800 hover:bg-brand-50 active:bg-brand-100",
  danger: "bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800",
  subtle: "bg-brand-50 text-brand-800 hover:bg-brand-100 active:bg-brand-200",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra?: string) {
  return cn(
    "inline-flex items-center justify-center rounded-md font-semibold transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-70",
    VARIANTS[variant],
    SIZES[size],
    extra,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
});
