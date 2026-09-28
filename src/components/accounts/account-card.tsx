"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CreditCard, Eye, EyeOff, Landmark, PiggyBank } from "lucide-react";
import type { Account, Transaction } from "@/types/banking";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { accountRoute } from "@/lib/banking";
import { formatCurrency, formatDate, formatRelativeDay } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const TYPE_META = {
  checking: { label: "Checking", icon: Landmark },
  savings: { label: "Savings", icon: PiggyBank },
  credit: { label: "Credit Card", icon: CreditCard },
};

export function AccountCard({ account, transactions }: { account: Account; transactions: Transaction[] }) {
  const [quickView, setQuickView] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const meta = TYPE_META[account.type];
  const Icon = meta.icon;
  const recent = transactions.slice(0, 5);

  // Build the displayed account number
  const displayedNumber = showNumber && account.fullAccountNumber
    ? account.fullAccountNumber.replace(/(\d{4})(?=\d)/g, "$1 ")
    : account.maskedNumber;

  return (
    <>
      <article
        className={cn(
          "flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-pop",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-800">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-brand-950">{account.name}</h3>
              {/* Account number row with eye toggle */}
              <div className="mt-0.5 flex items-center gap-1.5">
                <p className="font-mono text-xs text-slate-500">{displayedNumber}</p>
                <button
                  type="button"
                  onClick={() => setShowNumber((v) => !v)}
                  aria-label={showNumber ? "Hide account number" : "Show account number"}
                  className="rounded p-0.5 text-slate-400 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {showNumber
                    ? <EyeOff className="h-3.5 w-3.5" aria-hidden />
                    : <Eye className="h-3.5 w-3.5" aria-hidden />}
                </button>
              </div>
              {/* Routing number for deposit accounts */}
              {account.type !== "credit" && account.routingNumber && (
                <p className="text-[11px] text-slate-400">Routing: {account.routingNumber}</p>
              )}
            </div>
          </div>
          <Badge tone="navy">{meta.label}</Badge>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {account.type === "credit" ? "Current balance" : "Available balance"}
          </p>
          <p className="mt-1 text-2xl font-bold tabular text-brand-950">
            {formatCurrency(account.type === "credit" ? account.currentBalance : account.availableBalance)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {account.type === "credit"
              ? `${formatCurrency(account.availableBalance)} available of ${formatCurrency(account.creditLimit ?? 0)} limit`
              : `Current balance ${formatCurrency(account.currentBalance)}`}
          </p>
          {account.type === "credit" && account.minimumPayment != null && account.paymentDueDate && (
            <p className="mt-0.5 text-xs font-medium text-amber-600">
              Min. payment {formatCurrency(account.minimumPayment)} due {formatDate(account.paymentDueDate)}
            </p>
          )}
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          Recent activity {formatRelativeDay(account.lastActivityDate).toLowerCase()}
        </p>

        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
          <Button variant="secondary" size="sm" onClick={() => setQuickView(true)}>
            Quick view
          </Button>
          <Link
            href={accountRoute(account)}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-brand-900 px-3 text-xs font-semibold text-white hover:bg-brand-800"
          >
            View account <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </article>

      <Modal
        open={quickView}
        onClose={() => setQuickView(false)}
        title={account.name}
        subtitle={`${meta.label} · ${account.maskedNumber}`}
        footer={
          <Link href={accountRoute(account)} onClick={() => setQuickView(false)} className={cn("inline-flex h-9 items-center rounded-md bg-brand-900 px-4 text-sm font-semibold text-white hover:bg-brand-800")}>
            Open full details
          </Link>
        }
      >
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-400">Current balance</dt>
            <dd className="mt-0.5 font-semibold tabular text-slate-800">{formatCurrency(account.currentBalance)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-400">Available balance</dt>
            <dd className="mt-0.5 font-semibold tabular text-slate-800">{formatCurrency(account.availableBalance)}</dd>
          </div>
          {account.routingNumber && account.type !== "credit" && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400">Routing number</dt>
              <dd className="mt-0.5 font-mono font-semibold text-slate-800">{account.routingNumber}</dd>
            </div>
          )}
          {account.apy !== undefined && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400">APY</dt>
              <dd className="mt-0.5 font-semibold text-slate-800">{account.apy.toFixed(2)}%</dd>
            </div>
          )}
          {account.creditLimit !== undefined && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400">Credit limit</dt>
              <dd className="mt-0.5 font-semibold text-slate-800">{formatCurrency(account.creditLimit)}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-400">Opened</dt>
            <dd className="mt-0.5 text-slate-800">{formatDate(account.openedDate)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-400">Status</dt>
            <dd className="mt-0.5 text-slate-800">{account.status}</dd>
          </div>
        </dl>
        <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">Latest activity</p>
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {recent.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span className="min-w-0">
                <span className="block truncate font-medium text-slate-700">{t.description}</span>
                <span className="text-xs text-slate-500">{formatDate(t.date)}</span>
              </span>
              <span className={cn("shrink-0 font-semibold tabular", t.direction === "debit" ? "text-slate-800" : "text-emerald-600")}>
                {t.direction === "debit" ? "-" : "+"}
                {formatCurrency(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
