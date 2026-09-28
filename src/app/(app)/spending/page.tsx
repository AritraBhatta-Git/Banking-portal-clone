"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { SpendingCategory } from "@/types/banking";
import { useDataset } from "@/store/hooks";
import { useBankingStore } from "@/store/banking-store";
import { useToast } from "@/components/common/toast";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/common/card";
import { BarChart, DonutChart, ProgressBar } from "@/components/common/charts";
import { Button } from "@/components/common/button";
import { Field, TextInput } from "@/components/common/field";
import { Modal } from "@/components/common/modal";
import { categoryTotals, isPosted, isSpend, monthlySeries, transactionsSince } from "@/lib/banking";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const PERIODS = [
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "Last 6 months", days: 180 },
];

export default function SpendingPage() {
  const dataset = useDataset();
  const setBudget = useBankingStore((s) => s.setBudget);
  const { toast } = useToast();
  const [days, setDays] = useState(30);
  const [editing, setEditing] = useState<SpendingCategory | null>(null);
  const [draftLimit, setDraftLimit] = useState("");
  const [limitError, setLimitError] = useState("");

  const periodTx = useMemo(() => (dataset ? transactionsSince(dataset.transactions, days) : []), [dataset, days]);

  const stats = useMemo(() => {
    const income = periodTx.filter((t) => isPosted(t) && t.direction === "credit" && t.category === "Income").reduce((s, t) => s + t.amount, 0);
    const spend = periodTx.filter((t) => isPosted(t) && isSpend(t)).reduce((s, t) => s + t.amount, 0);
    const transfers = periodTx.filter((t) => isPosted(t) && t.direction === "debit" && t.category === "Transfers").reduce((s, t) => s + t.amount, 0);
    return { income, spend, transfers, remaining: income - spend - transfers };
  }, [periodTx]);

  if (!dataset) return null;

  const categories = categoryTotals(periodTx);
  const trend = monthlySeries(dataset.transactions, 6, "spend");
  const recentSpend = dataset.transactions.filter((t) => isPosted(t) && isSpend(t)).slice(0, 8);
  const editingBudget = dataset.budgets.find((b) => b.category === editing);
  const spentFor = (category: SpendingCategory) =>
    periodTx.filter((t) => isPosted(t) && isSpend(t) && t.category === category).reduce((s, t) => s + t.amount, 0);

  const saveBudget = () => {
    const value = Number(draftLimit);
    if (!draftLimit.trim() || Number.isNaN(value) || value <= 0) {
      setLimitError("Enter a monthly limit greater than zero.");
      return;
    }
    if (editing) {
      setBudget(editing, Math.round(value * 100) / 100);
      toast(`${editing} budget updated to ${formatCurrency(value)}.`);
    }
    setEditing(null);
    setLimitError("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Spending & Budgeting"
        subtitle="Where your demo money goes, and the limits you set for it"
        actions={
          <div role="group" aria-label="Select period" className="flex gap-1 rounded-lg bg-white p-1 ring-1 ring-inset ring-slate-200">
            {PERIODS.map((p) => (
              <button
                key={p.days}
                type="button"
                onClick={() => setDays(p.days)}
                aria-pressed={days === p.days}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  days === p.days ? "bg-brand-900 text-white" : "text-slate-600 hover:bg-brand-50",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Income", value: stats.income, icon: TrendingUp, tone: "text-emerald-600" },
          { label: "Spending", value: stats.spend, icon: TrendingDown, tone: "text-slate-800" },
          { label: "Transfers out", value: stats.transfers, icon: Wallet, tone: "text-slate-800" },
          { label: "Remaining", value: stats.remaining, icon: Wallet, tone: stats.remaining >= 0 ? "text-emerald-600" : "text-accent-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody className="p-5">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                <s.icon className="h-3.5 w-3.5" aria-hidden /> {s.label}
              </p>
              <p className={cn("mt-1.5 text-2xl font-bold tabular", s.tone)}>{formatCurrency(s.value)}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Category breakdown" subtitle={`Debit spending over the ${days === 180 ? "last 6 months" : `last ${days} days`}`} />
          <CardBody>
            {categories.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No spending in this period.</p>
            ) : (
              <DonutChart data={categories.map((c) => ({ label: c.category, value: c.value }))} />
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Spending trend" subtitle="Monthly debit spending, last 6 months" />
          <CardBody>
            <BarChart data={trend} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Budgets" subtitle="Monthly limits per category with current-period progress" />
        <CardBody className="p-0">
          <ul className="divide-y divide-slate-100">
            {dataset.budgets.map((b) => {
              const spent = spentFor(b.category);
              return (
                <li key={b.category} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <div className="w-36">
                    <p className="text-sm font-semibold text-slate-800">{b.category}</p>
                    <p className="text-xs text-slate-500">limit {formatCurrency(b.limit)}</p>
                  </div>
                  <div className="min-w-40 flex-1">
                    <ProgressBar value={spent} max={b.limit} />
                  </div>
                  <p className="w-40 text-right text-sm tabular text-slate-600">
                    {formatCurrency(spent)} spent
                    {spent > b.limit && <span className="block text-xs font-semibold text-accent-600">over budget</span>}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(b.category);
                      setDraftLimit(String(b.limit));
                      setLimitError("");
                    }}
                    aria-label={`Edit ${b.category} budget`}
                  >
                    <Pencil className="h-4 w-4" aria-hidden /> Edit
                  </Button>
                </li>
              );
            })}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Recent spending"
          action={
            <Link href="/transactions" className="text-sm font-semibold text-brand-700 hover:underline">
              All transactions
            </Link>
          }
        />
        <CardBody className="p-0">
          <ul className="divide-y divide-slate-100">
            {recentSpend.map((t) => (
              <li key={t.id}>
                <Link href={`/transactions/${t.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-brand-50/60">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-800">{t.description}</span>
                    <span className="text-xs text-slate-500">
                      {formatDate(t.date)} · {t.category}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold tabular text-slate-800">-{formatCurrency(t.amount)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={`Edit ${editing ?? ""} budget`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={saveBudget}>Save budget</Button>
          </>
        }
      >
        <Field label="Monthly limit (USD)" htmlFor="budget-limit" error={limitError} hint={`Spent so far this period: ${formatCurrency(editing ? spentFor(editing) : 0)}`}>
          <TextInput
            id="budget-limit"
            inputMode="decimal"
            value={draftLimit}
            invalid={Boolean(limitError)}
            onChange={(e) => setDraftLimit(e.target.value)}
          />
        </Field>
        {editingBudget && (
          <p className="mt-3 text-xs text-slate-500">
            Budgets are stored in your demo session and reset when demo data is reset.
          </p>
        )}
      </Modal>
    </div>
  );
}
