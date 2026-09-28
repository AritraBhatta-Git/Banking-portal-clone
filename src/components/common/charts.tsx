"use client";

import { useId } from "react";
import type { SpendingCategory } from "@/types/banking";
import { formatCurrency } from "@/lib/formatters";

export const CATEGORY_COLORS: Record<SpendingCategory, string> = {
  Housing: "#012169",
  Food: "#e31837",
  Shopping: "#5a86c2",
  Transportation: "#27518f",
  Utilities: "#8cadd8",
  Entertainment: "#9c0e24",
  Subscriptions: "#3767ab",
  Health: "#b9cde9",
  Other: "#64748b",
  Income: "#059669",
  Transfers: "#0ea5e9",
  Fees: "#f59e0b",
  Interest: "#10b981",
  Payments: "#7c3aed",
};

export interface Datum {
  label: string;
  value: number;
  color?: string;
}

export function DonutChart({ data, centerLabel }: { data: Datum[]; centerLabel?: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0" role="img" aria-label="Spending by category chart">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="22" />
        {total > 0 &&
          data.map((d) => {
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const el = (
              <circle
                key={d.label}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={d.color ?? CATEGORY_COLORS[d.label as SpendingCategory] ?? "#64748b"}
                strokeWidth="22"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 80 80)"
              />
            );
            offset += dash;
            return el;
          })}
        <text x="80" y="76" textAnchor="middle" className="fill-slate-500" fontSize="10">
          {centerLabel ?? "Total"}
        </text>
        <text x="80" y="92" textAnchor="middle" className="fill-brand-950" fontSize="14" fontWeight="700">
          {formatCurrency(total)}
        </text>
      </svg>
      <ul className="min-w-[10rem] flex-1 space-y-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: d.color ?? CATEGORY_COLORS[d.label as SpendingCategory] ?? "#64748b" }}
                aria-hidden
              />
              {d.label}
            </span>
            <span className="font-medium tabular text-slate-800">{formatCurrency(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarChart({ data, height = 160 }: { data: Datum[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const gradientId = useId();
  return (
    <div>
      <div className="flex items-end gap-2" style={{ height }} role="img" aria-label="Monthly spending trend chart">
        {data.map((d) => (
          <div key={d.label} className="group flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] font-medium tabular text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
              {formatCurrency(d.value)}
            </span>
            <div
              className="w-full rounded-t-md bg-brand-700 transition-colors group-hover:bg-brand-900"
              style={{ height: `${Math.max((d.value / max) * 100, 2)}%` }}
              title={`${d.label}: ${formatCurrency(d.value)}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-2">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[10px] text-slate-500">
            {d.label}
          </span>
        ))}
      </div>
      <svg width="0" height="0" aria-hidden>
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="0%" stopColor="#012169" />
            <stop offset="100%" stopColor="#3767ab" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function ProgressBar({ value, max, tone }: { value: number; max: number; tone?: "ok" | "warn" | "over" }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const resolved = tone ?? (value > max ? "over" : value > max * 0.85 ? "warn" : "ok");
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className={
          resolved === "over"
            ? "h-full rounded-full bg-accent-500"
            : resolved === "warn"
              ? "h-full rounded-full bg-amber-500"
              : "h-full rounded-full bg-brand-700"
        }
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
