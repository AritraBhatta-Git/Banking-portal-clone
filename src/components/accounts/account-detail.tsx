"use client";

import Link from "next/link";
import { ArrowLeft, CreditCard, FileText, ArrowLeftRight } from "lucide-react";
import type { AccountType } from "@/types/banking";
import { useDataset } from "@/store/hooks";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/common/card";
import { Badge, StatusBadge } from "@/components/common/badge";
import { Button, buttonClasses } from "@/components/common/button";
import { ProgressBar } from "@/components/common/charts";
import { EmptyState } from "@/components/common/empty-state";
import { TransactionExplorer } from "@/components/transactions/explorer";
import { formatCurrency, formatDate } from "@/lib/formatters";

const TITLES: Record<AccountType, string> = {
  checking: "Checking account",
  savings: "Savings account",
  credit: "Credit card account",
};

export function AccountDetail({ type }: { type: AccountType }) {
  const dataset = useDataset();
  if (!dataset) return null;

  const account = dataset.accounts.find((a) => a.type === type);
  if (!account) {
    return (
      <EmptyState
        title="Account not found"
        message="This demo profile does not include the requested account."
        action={
          <Link href="/accounts" className="text-sm font-semibold text-brand-700 hover:underline">
            Back to accounts
          </Link>
        }
      />
    );
  }

  const transactions = dataset.transactions.filter((t) => t.accountId === account.id);
  const utilization =
    account.creditLimit !== undefined ? (account.currentBalance / account.creditLimit) * 100 : 0;

  const stats: Array<{ label: string; value: string }> = [
    { label: "Current balance", value: formatCurrency(account.currentBalance) },
    {
      label: type === "credit" ? "Available credit" : "Available balance",
      value: formatCurrency(account.availableBalance),
    },
  ];
  if (type === "checking") {
    stats.push(
      { label: "Account holder", value: dataset.profile.displayName },
      { label: "Routing number", value: account.routingNumber ?? "—" },
      { label: "Account type", value: "Interest-free checking" },
    );
  }
  if (type === "savings") {
    stats.push(
      { label: "Account holder", value: dataset.profile.displayName },
      { label: "Routing number", value: account.routingNumber ?? "—" },
      { label: "APY", value: `${account.apy?.toFixed(2)}%` },
      { label: "Interest earned YTD", value: formatCurrency(account.interestEarnedYtd ?? 0) },
    );
  }
  if (type === "credit") {
    stats.push(
      { label: "Account holder", value: dataset.profile.displayName },
      { label: "Credit limit", value: formatCurrency(account.creditLimit ?? 0) },
      { label: "Minimum payment", value: formatCurrency(account.minimumPayment ?? 0) },
      { label: "Payment due", value: formatDate(account.paymentDueDate ?? "") },
      { label: "APR", value: `${account.apr?.toFixed(2)}%` },
    );
  }
  stats.push({ label: "Opened", value: formatDate(account.openedDate) });

  return (
    <div className="space-y-6">
      <PageHeader
        title={account.name}
        subtitle={`${TITLES[type]} · ${account.maskedNumber}`}
        actions={
          <>
            <Badge tone={account.status === "Open" ? "green" : "slate"}>{account.status}</Badge>
            <Link href="/accounts" className={buttonClasses("ghost", "md")}>
              <ArrowLeft className="h-4 w-4" aria-hidden /> All accounts
            </Link>
            <Link href="/statements" className={buttonClasses("secondary", "md")}>
              <FileText className="h-4 w-4" aria-hidden /> Statements
            </Link>
            {type === "credit" ? (
              <Link
                href={`/payments/transfers?to=${account.id}`}
                className={buttonClasses("primary", "md")}
              >
                <CreditCard className="h-4 w-4" aria-hidden /> Make a payment
              </Link>
            ) : (
              <Link
                href={`/payments/transfers?from=${account.id}`}
                className={buttonClasses("primary", "md")}
              >
                <ArrowLeftRight className="h-4 w-4" aria-hidden /> Transfer
              </Link>
            )}
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.slice(0, 4).map((s) => (
          <Card key={s.label}>
            <CardBody className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{s.label}</p>
              <p className="mt-1.5 text-xl font-bold tabular text-brand-950">{s.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {type === "credit" && (
        <Card>
          <CardHeader title="Credit utilization" subtitle="How much of your demo limit is in use" />
          <CardBody>
            <ProgressBar value={utilization} max={100} tone={utilization > 85 ? "over" : utilization > 60 ? "warn" : "ok"} />
            <p className="mt-2 text-sm text-slate-600">
              {utilization.toFixed(1)}% utilized · {formatCurrency(account.availableBalance)} of{" "}
              {formatCurrency(account.creditLimit ?? 0)} still available
            </p>
            {account.rewardsPoints !== undefined && (
              <p className="mt-1 text-sm text-slate-600">
                Rewards balance: <span className="font-semibold">{account.rewardsPoints.toLocaleString("en-US")} points</span>
              </p>
            )}
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader title="Account details" />
        <CardBody>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">{s.label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-800">{s.value}</dd>
              </div>
            ))}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">Last activity</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-800">{formatDate(account.lastActivityDate)}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-brand-950">Transaction history</h2>
        <TransactionExplorer transactions={transactions} accounts={dataset.accounts} />
      </div>

      <p className="text-xs text-slate-400">
        Pending items reduce your available balance until they post. All figures are fictional demo data.{" "}
        <StatusBadge status="Pending" /> <StatusBadge status="Posted" />
      </p>
    </div>
  );
}
