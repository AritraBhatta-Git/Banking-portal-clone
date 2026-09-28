"use client";

import { useMemo, useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import type { StatementDoc } from "@/types/banking";
import { useDataset } from "@/store/hooks";
import { useToast } from "@/components/common/toast";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/common/card";
import { Button } from "@/components/common/button";
import { Field, SelectInput } from "@/components/common/field";
import { Modal } from "@/components/common/modal";
import { EmptyState } from "@/components/common/empty-state";
import { formatCurrency, formatDate, formatMonthYear } from "@/lib/formatters";

export default function StatementsPage() {
  const dataset = useDataset();
  const { toast } = useToast();
  const [accountId, setAccountId] = useState("all");
  const [year, setYear] = useState("all");
  const [preview, setPreview] = useState<StatementDoc | null>(null);

  const years = useMemo(() => {
    if (!dataset) return [];
    return [...new Set(dataset.statements.map((s) => new Date(s.statementDate).getUTCFullYear()))].sort((a, b) => b - a);
  }, [dataset]);

  const statements = useMemo(() => {
    if (!dataset) return [];
    return dataset.statements
      .filter((s) => (accountId === "all" ? true : s.accountId === accountId))
      .filter((s) => (year === "all" ? true : new Date(s.statementDate).getUTCFullYear() === Number(year)))
      .sort((a, b) => (a.statementDate === b.statementDate ? 0 : a.statementDate < b.statementDate ? 1 : -1));
  }, [dataset, accountId, year]);

  if (!dataset) return null;

  const accountName = (id: string) => dataset.accounts.find((a) => a.id === id)?.name ?? "Account";

  const download = (s: StatementDoc) => {
    const lines = [
      "BANK OF AMERICA — ACCOUNT STATEMENT (FICTIONAL)",
      "================================================",
      `Account:        ${accountName(s.accountId)}`,
      `Period:         ${formatDate(s.periodStart)} to ${formatDate(s.periodEnd)}`,
      `Statement date: ${formatDate(s.statementDate)}`,
      "",
      `Opening balance:  ${formatCurrency(s.openingBalance)}`,
      `Total deposits:   ${formatCurrency(s.totalDeposits)}`,
      `Total withdrawals:${formatCurrency(s.totalWithdrawals)}`,
      `Closing balance:  ${formatCurrency(s.closingBalance)}`,
      "",
      "This is a generated demonstration document.",
      "No real financial document is represented.",
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `boa-statement-${s.id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("Demo statement downloaded.");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Statements & Documents" subtitle="Monthly demo statements for every account" />

      <Card>
        <CardHeader title="Filter statements" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Account" htmlFor="stmt-account">
            <SelectInput id="stmt-account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              <option value="all">All accounts</option>
              {dataset.accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} {a.maskedNumber}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Year" htmlFor="stmt-year">
            <SelectInput id="stmt-year" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="all">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </SelectInput>
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          {statements.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={FileText}
                title="No statements for this selection"
                message="Try a different account or year — this demo keeps six months of history per account."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <th scope="col" className="px-5 py-3 font-semibold">Statement</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Account</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Period</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Available</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {statements.map((s) => (
                    <tr key={s.id} className="hover:bg-brand-50/50">
                      <td className="px-5 py-3 font-medium text-slate-800">{formatMonthYear(s.periodEnd)} statement</td>
                      <td className="px-5 py-3 text-slate-600">{accountName(s.accountId)}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                        {formatDate(s.periodStart)} – {formatDate(s.periodEnd)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">{formatDate(s.statementDate)}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setPreview(s)}>
                            <Eye className="h-4 w-4" aria-hidden /> View
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => download(s)}>
                            <Download className="h-4 w-4" aria-hidden /> Download
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        open={preview !== null}
        onClose={() => setPreview(null)}
        title={preview ? `${formatMonthYear(preview.periodEnd)} statement preview` : ""}
        subtitle={preview ? `${accountName(preview.accountId)} · ${preview.pages} pages in the full document` : undefined}
        size="lg"
        footer={
          preview && (
            <>
              <Button variant="secondary" onClick={() => setPreview(null)}>
                Close
              </Button>
              <Button onClick={() => download(preview)}>
                <Download className="h-4 w-4" aria-hidden /> Download
              </Button>
            </>
          )
        }
      >
        {preview && (
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Summary</p>
              <dl className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-slate-500">Opening</dt>
                  <dd className="font-semibold tabular text-slate-800">{formatCurrency(preview.openingBalance)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Deposits</dt>
                  <dd className="font-semibold tabular text-emerald-600">+{formatCurrency(preview.totalDeposits)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Withdrawals</dt>
                  <dd className="font-semibold tabular text-slate-800">-{formatCurrency(preview.totalWithdrawals)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Closing</dt>
                  <dd className="font-semibold tabular text-brand-900">{formatCurrency(preview.closingBalance)}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Document preview</p>
              <div className="mt-3 space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-3 rounded bg-slate-100" style={{ width: `${92 - i * 9}%` }} />
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500">
                The full paginated document is simulated. Downloading produces a plain-text
                summary with the same fictional figures.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
