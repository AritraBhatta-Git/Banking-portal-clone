import type { PaymentStatus, TransactionStatus } from "@/types/banking";
import { cn } from "@/lib/utils";

type Tone = "green" | "amber" | "blue" | "red" | "slate" | "navy";

const TONES: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  red: "bg-accent-50 text-accent-700 ring-accent-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
  navy: "bg-brand-50 text-brand-800 ring-brand-200",
};

export function Badge({ tone = "slate", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function statusTone(status: TransactionStatus | PaymentStatus): Tone {
  switch (status) {
    case "Posted":
    case "Completed":
      return "green";
    case "Pending":
      return "amber";
    case "Scheduled":
      return "blue";
    case "Declined":
    case "Canceled":
      return "red";
    default:
      return "slate";
  }
}

export function StatusBadge({ status }: { status: TransactionStatus | PaymentStatus }) {
  return <Badge tone={statusTone(status)}>{status}</Badge>;
}
