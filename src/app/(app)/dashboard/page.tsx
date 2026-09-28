"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeftRight,
  BellRing,
  CalendarClock,
  Eye,
  EyeOff,
  FileText,
  Lock,
  PieChart,
  ReceiptText,
} from "lucide-react";
import { useDataset } from "@/store/hooks";
import { useBankingStore } from "@/store/banking-store";
import { useToast } from "@/components/common/toast";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/common/card";
import { AccountCard } from "@/components/accounts/account-card";
import { StatusBadge } from "@/components/common/badge";
import { DonutChart } from "@/components/common/charts";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/common/button";
import { accountRoute, categoryTotals, greeting, isPosted, transactionsSince } from "@/lib/banking";
import { formatCurrency, formatDate, formatDateLong, formatRelativeDay, isoDaysFromToday } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Account } from "@/types/banking";

const QUICK_ACTIONS = [
  { href: "/payments/transfers", label: "Transfer money", icon: ArrowLeftRight },
  { href: "/payments/bill-pay", label: "Pay a bill", icon: ReceiptText },
  { href: "/statements", label: "Statements", icon: FileText },
  { href: "/cards", label: "Lock a card", icon: Lock },
  { href: "/spending", label: "Spending insights", icon: PieChart },
];

/** Mini card shown in the top summary row (individual account) */
function SummaryAccountCard({ account }: { account: Account }) {
  const [show, setShow] = useState(false);
  const displayed = show && account.fullAccountNumber
    ? account.fullAccountNumber.replace(/(\d{4})(?=\d)/g, "$1 ")
    : account.maskedNumber;

  return (
    <Card>
      <CardBody className="p-5">
        <p className="truncate text-xs font-medium uppercase tracking-wider text-slate-500">{account.name}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="font-mono text-sm font-semibold text-slate-900">{displayed}</span>
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide account number" : "Show account number"}
            className="rounded p-0.5 text-slate-400 hover:text-brand-700"
          >
            {show ? <EyeOff className="h-3.5 w-3.5" aria-hidden /> : <Eye className="h-3.5 w-3.5" aria-hidden />}
          </button>
        </div>
        <p className="mt-1 text-2xl font-bold tabular text-slate-900">
          {formatCurrency(account.type === "credit" ? account.currentBalance : account.availableBalance)}
        </p>
        {account.type === "credit" && account.minimumPayment != null && account.paymentDueDate && (
          <p className="mt-0.5 text-xs font-medium text-amber-600">
            Min. payment {formatCurrency(account.minimumPayment)} due {formatDate(account.paymentDueDate)}
          </p>
        )}
        <Link
          href={accountRoute(account)}
          className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
        >
          View account <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </CardBody>
    </Card>
  );
}

export default function DashboardPage() {
  const dataset = useDataset();
  const markAlertRead = useBankingStore((s) => s.markAlertRead);
  const cancelPayment = useBankingStore((s) => s.cancelPayment);
  const { toast } = useToast();

  // Eye state for the hero card account/routing numbers
  const [showAcct, setShowAcct] = useState(false);
  const [showRoute, setShowRoute] = useState(false);

  if (!dataset) return null;

  const { accounts, transactions, alerts, payments, profile } = dataset;
  const depositAccounts = accounts.filter((a) => a.type !== "credit");
  const credit = accounts.find((a) => a.type === "credit");
  const checking = accounts.find((a) => a.type === "checking");
  const totalAvailable = depositAccounts.reduce((sum, a) => sum + a.availableBalance, 0);

  // Numbers shown in hero card (primary checking account)
  const heroAcctNum = checking
    ? showAcct && checking.fullAccountNumber
      ? checking.fullAccountNumber.replace(/(\d{4})(?=\d)/g, "$1 ")
      : checking.maskedNumber
    : null;
  const heroRouting = checking?.routingNumber ?? null;
  const heroRoutingDisplay = showRoute ? heroRouting : (heroRouting ? "•••• •••• " + heroRouting.slice(-3) : null);

  const recent = transactions.filter(isPosted).slice(0, 8);
  const unread = alerts.filter((a) => !a.read).slice(0, 3);
  const scheduled = payments
    .filter((p) => p.status === "Scheduled")
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(0, 3);
  const monthSpend = categoryTotals(transactionsSince(transactions, 30)).slice(0, 6);
  const accountName = (id: string) => accounts.find((a) => a.id === id)?.name ?? "Account";

  return (
    <div className="space-y-6">
      {/* Greeting + date */}
      <PageHeader
        title={`${greeting()}, ${profile.displayName}`}
        subtitle={formatDateLong(isoDaysFromToday(0))}
        actions={undefined}
      />

      {/* Summary row: Total available hero + each account card */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Hero: Total available — white card, all black text */}
        <Card className="border-slate-300 bg-white">
          <CardBody className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Total available
            </p>
            <p className="mt-2 text-3xl font-bold tabular text-slate-900">
              {formatCurrency(totalAvailable)}
            </p>

            {/* Account number row */}
            {heroAcctNum && (
              <div className="mt-3 flex items-center gap-2">
                <span className="min-w-0">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Account no.
                  </span>
                  <span className="font-mono text-sm font-semibold text-slate-900">
                    {heroAcctNum}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowAcct((v) => !v)}
                  aria-label={showAcct ? "Hide account number" : "Show account number"}
                  className="ml-1 shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  {showAcct
                    ? <EyeOff className="h-3.5 w-3.5" aria-hidden />
                    : <Eye className="h-3.5 w-3.5" aria-hidden />}
                </button>
              </div>
            )}

            {/* Routing number row */}
            {heroRoutingDisplay && (
              <div className="mt-2 flex items-center gap-2">
                <span className="min-w-0">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Routing no.
                  </span>
                  <span className="font-mono text-sm font-semibold text-slate-900">
                    {heroRoutingDisplay}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowRoute((v) => !v)}
                  aria-label={showRoute ? "Hide routing number" : "Show routing number"}
                  className="ml-1 shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  {showRoute
                    ? <EyeOff className="h-3.5 w-3.5" aria-hidden />
                    : <Eye className="h-3.5 w-3.5" aria-hidden />}
                </button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Per-deposit-account summary cards */}
        {depositAccounts.map((a) => (
          <SummaryAccountCard key={a.id} account={a} />
        ))}

        {/* Credit card summary card */}
        {credit && <SummaryAccountCard account={credit} />}
      </div>

      {/* Full account cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            transactions={transactions.filter((t) => t.accountId === account.id)}
          />
        ))}
      </div>

      {/* Recent transactions + quick actions + alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent transactions"
            subtitle="Latest posted activity across all accounts"
            action={
              <Link href="/transactions" className="text-sm font-semibold text-brand-700 hover:underline">
                View all
              </Link>
            }
          />
          <CardBody className="p-0">
            <ul className="divide-y divide-slate-100">
              {recent.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/transactions/${t.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-brand-50/60"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-800">{t.description}</span>
                      <span className="text-xs text-slate-500">
                        {formatDate(t.date)} · {accountName(t.accountId)}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <StatusBadge status={t.status} />
                      <span
                        className={cn(
                          "w-24 text-right text-sm font-semibold tabular",
                          t.direction === "debit" ? "text-slate-800" : "text-emerald-600",
                        )}
                      >
                        {t.direction === "debit" ? "-" : "+"}
                        {formatCurrency(t.amount)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Quick actions" />
            <CardBody className="grid grid-cols-1 gap-2 p-4">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-900"
                >
                  <action.icon className="h-4 w-4 text-brand-700" aria-hidden />
                  {action.label}
                  <ArrowRight className="ml-auto h-4 w-4 text-slate-300" aria-hidden />
                </Link>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Alerts"
              action={
                <Link href="/alerts" className="text-sm font-semibold text-brand-700 hover:underline">
                  View all
                </Link>
              }
            />
            <CardBody className="p-4">
              {unread.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-500">You&apos;re all caught up.</p>
              ) : (
                <ul className="space-y-3">
                  {unread.map((a) => (
                    <li key={a.id} className="rounded-lg border border-slate-200 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                        <BellRing className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">{a.message}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-slate-400">{formatRelativeDay(a.date)}</span>
                        <Button variant="ghost" size="sm" onClick={() => markAlertRead(a.id, true)}>
                          Mark read
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Scheduled payments + spending snapshot */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Scheduled payments"
            subtitle="Upcoming transfers and bill payments"
            action={
              <Link href="/payments/activity" className="text-sm font-semibold text-brand-700 hover:underline">
                Payment activity
              </Link>
            }
          />
          <CardBody className="p-4">
            {scheduled.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="Nothing scheduled"
                message="Set up a transfer or bill payment and it will appear here."
                action={
                  <Link href="/payments/transfers" className="text-sm font-semibold text-brand-700 hover:underline">
                    Schedule a transfer
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-slate-100">
                {scheduled.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-800">{p.payeeName}</span>
                      <span className="text-xs text-slate-500">
                        {formatDate(p.date)} · {p.kind} · {p.frequency}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-semibold tabular text-slate-800">
                        {formatCurrency(p.amount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          cancelPayment(p.id);
                          toast(`Scheduled payment to ${p.payeeName} canceled.`, "info");
                        }}
                      >
                        Cancel
                      </Button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Spending snapshot"
            subtitle="Last 30 days by category"
            action={
              <Link href="/spending" className="text-sm font-semibold text-brand-700 hover:underline">
                Full insights
              </Link>
            }
          />
          <CardBody>
            {monthSpend.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                No spending recorded in this period.
              </p>
            ) : (
              <DonutChart
                data={monthSpend.map((s) => ({ label: s.category, value: s.value }))}
                centerLabel="30 days"
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
