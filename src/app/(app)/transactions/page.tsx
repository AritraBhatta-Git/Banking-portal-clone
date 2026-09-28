"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useDataset } from "@/store/hooks";
import { PageHeader } from "@/components/common/card";
import { TransactionExplorer } from "@/components/transactions/explorer";
import { TableSkeleton } from "@/components/common/empty-state";

function TransactionsInner() {
  const dataset = useDataset();
  const params = useSearchParams();
  const initialAccountId = params.get("account") ?? "all";
  if (!dataset) return <TableSkeleton rows={8} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        subtitle="Search, filter and sort every demo transaction across your accounts"
      />
      <TransactionExplorer
        transactions={dataset.transactions}
        accounts={dataset.accounts}
        showAccountFilter
        initialAccountId={initialAccountId}
      />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={8} />}>
      <TransactionsInner />
    </Suspense>
  );
}
