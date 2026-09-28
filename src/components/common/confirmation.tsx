"use client";

import { CheckCircle2, Clock3, Download, Printer } from "lucide-react";
import type { Confirmation } from "@/types/banking";
import { formatCurrency, formatDateLong } from "@/lib/formatters";
import { Button } from "@/components/common/button";

export function ConfirmationPanel({
  confirmation,
  onViewActivity,
  onReturnToAccounts,
}: {
  confirmation: Confirmation;
  onViewActivity: () => void;
  onReturnToAccounts: () => void;
}) {
  const scheduled = confirmation.status === "Scheduled";

  const download = () => {
    const lines = [
      "BANK OF AMERICA — PAYMENT CONFIRMATION (DEMONSTRATION ONLY)",
      "===========================================================",
      `Status:              ${scheduled ? "Payment Scheduled" : "Payment Completed"}`,
      `Type:                ${confirmation.kind}`,
      `Amount:              ${formatCurrency(confirmation.amount)}`,
      `From:                ${confirmation.fromLabel}`,
      `To:                  ${confirmation.toLabel}`,
      `Date:                ${formatDateLong(confirmation.date)}`,
      `Frequency:           ${confirmation.frequency}`,
      `Memo:                ${confirmation.memo || "(none)"}`,
      `Confirmation Number: ${confirmation.confirmationNumber}`,
      "",
      "This document is a fictional demonstration artifact.",
      "No real funds were moved and no real accounts were touched.",
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `boa-confirmation-${confirmation.confirmationNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-2xl animate-rise">
      <div className="rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="flex flex-col items-center gap-3 border-b border-slate-200 bg-brand-50/60 px-6 py-8 text-center">
          <span className="rounded-full bg-emerald-100 p-3 text-emerald-700">
            {scheduled ? <Clock3 className="h-7 w-7" aria-hidden /> : <CheckCircle2 className="h-7 w-7" aria-hidden />}
          </span>
          <h1 className="text-2xl font-bold text-brand-950">
            {scheduled ? "Payment Scheduled" : "Payment Completed"}
          </h1>
          <p className="text-sm text-slate-600">
            {scheduled
              ? "Your demo payment is queued for the delivery date below."
              : "Your demo payment has been processed successfully."}
          </p>
          <p className="text-3xl font-bold tabular text-brand-900">
            {formatCurrency(confirmation.amount)}
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-4 px-6 py-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">From</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{confirmation.fromLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">To</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{confirmation.toLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Date</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">
              {formatDateLong(confirmation.date)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Frequency</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{confirmation.frequency}</dd>
          </div>
          {confirmation.memo && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Memo</dt>
              <dd className="mt-1 text-sm text-slate-700">{confirmation.memo}</dd>
            </div>
          )}
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Confirmation Number
            </dt>
            <dd className="mt-1 font-mono text-sm font-semibold text-brand-800">
              {confirmation.confirmationNumber}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <Button onClick={onViewActivity}>View Activity</Button>
          <Button variant="secondary" onClick={onReturnToAccounts}>
            Return to Accounts
          </Button>
          <Button variant="secondary" onClick={download}>
            <Download className="h-4 w-4" aria-hidden /> Download Confirmation
          </Button>
          <Button variant="ghost" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden /> Print
          </Button>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">
        Demonstration only — no real money was moved and no external service was called.
      </p>
    </div>
  );
}
