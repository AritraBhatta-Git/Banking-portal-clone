"use client";

import Link from "next/link";
import { ArrowLeft, Download, ReceiptText } from "lucide-react";
import { useDataset } from "@/store/hooks";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/common/card";
import { StatusBadge } from "@/components/common/badge";
import { EmptyState } from "@/components/common/empty-state";
import { Button, buttonClasses } from "@/components/common/button";
import { accountRoute } from "@/lib/banking";
import { formatCurrency, formatDateLong } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function TransactionDetailView({ transactionId }: { transactionId: string }) {
  const dataset = useDataset();
  if (!dataset) return null;

  const tx = dataset.transactions.find((t) => t.id === transactionId);
  if (!tx) {
    return (
      <EmptyState
        icon={ReceiptText}
        title="Transaction not found"
        message="This transaction does not exist in the current demo session. It may belong to another demo profile."
        action={
          <Link href="/transactions" className={buttonClasses("secondary", "md")}>
            Back to transactions
          </Link>
        }
      />
    );
  }

  const account = dataset.accounts.find((a) => a.id === tx.accountId);

  const download = () => {
    const lines = [
      "BANK OF AMERICA — TRANSACTION RECEIPT (FICTIONAL)",
      "==================================================",
      `Description:   ${tx.description}`,
      `Merchant:      ${tx.merchant}`,
      `Date:          ${formatDateLong(tx.date)}`,
      `Amount:        ${tx.direction === "debit" ? "-" : "+"}${formatCurrency(tx.amount)}`,
      `Category:      ${tx.category}`,
      `Type:          ${tx.type}`,
      `Status:        ${tx.status}`,
      `Account:       ${account?.name ?? "Unknown"} ${account?.maskedNumber ?? ""}`,
      `Method:        ${tx.method}`,
      `Reference:     ${tx.reference}`,
      `Balance after: ${formatCurrency(tx.balanceAfter)}`,
      "",
      "Fictional demonstration data — no real transaction occurred.",
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `boa-receipt-${tx.reference}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const rows: Array<[string, React.ReactNode]> = [
    ["Merchant", tx.merchant],
    ["Date", formatDateLong(tx.date)],
    [
      "Amount",
      <span className={cn("font-semibold tabular", tx.direction === "debit" ? "text-slate-800" : "text-emerald-600")}>
        {tx.direction === "debit" ? "-" : "+"}
        {formatCurrency(tx.amount)}
      </span>,
    ],
    ["Category", tx.category],
    ["Status", <StatusBadge status={tx.status} />],
    ["Account", account ? `${account.name} ${account.maskedNumber}` : "—"],
    ["Payment method", tx.method],
    ["Reference number", <span className="font-mono text-xs">{tx.reference}</span>],
    ["Balance after transaction", formatCurrency(tx.balanceAfter)],
    ["Type", tx.type],
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={tx.description}
        subtitle={formatDateLong(tx.date)}
        actions={
          <>
            <Button variant="secondary" onClick={download}>
              <Download className="h-4 w-4" aria-hidden /> Download receipt
            </Button>
            <Link href="/transactions" className={buttonClasses("ghost", "md")}>
              <ArrowLeft className="h-4 w-4" aria-hidden /> All transactions
            </Link>
          </>
        }
      />

      <Card>
        <CardHeader title="Transaction details" subtitle="Everything we recorded for this demo entry" />
        <CardBody className="p-0">
          <dl className="divide-y divide-slate-100">
            {rows.map(([label, value]) => (
              <div key={label} className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-slate-500">{label}</dt>
                <dd className="text-sm text-slate-800 sm:col-span-2">{value}</dd>
              </div>
            ))}
          </dl>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Something look wrong? In a real portal you would dispute this transaction here.
          </p>
          <div className="flex gap-2">
            {account && (
              <Link href={accountRoute(account)} className={buttonClasses("secondary", "sm")}>
                View {account.name}
              </Link>
            )}
            <Link href="/help" className={buttonClasses("secondary", "sm")}>
              Get help
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
