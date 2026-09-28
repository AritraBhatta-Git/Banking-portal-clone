"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeftRight, ReceiptText } from "lucide-react";
import { useDataset } from "@/store/hooks";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/common/card";
import { AccountCard } from "@/components/accounts/account-card";
import { buttonClasses } from "@/components/common/button";
import { formatCurrency } from "@/lib/formatters";

export default function AccountsPage() {
  const dataset = useDataset();
  const [showAcct, setShowAcct] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [showTableNumbers, setShowTableNumbers] = useState(false);

  if (!dataset) return null;

  const { accounts, transactions, profile } = dataset;
  const deposits = accounts.filter((a) => a.type !== "credit");
  const checking = accounts.find((a) => a.type === "checking");
  const totalAvailable = deposits.reduce((sum, a) => sum + a.availableBalance, 0);
  const totalCreditBalance = accounts
    .filter((a) => a.type === "credit")
    .reduce((sum, a) => sum + a.currentBalance, 0);

  // Hero card numbers (primary checking)
  const heroAcctNum = checking
    ? showAcct && checking.fullAccountNumber
      ? checking.fullAccountNumber.replace(/(\d{4})(?=\d)/g, "$1 ")
      : checking.maskedNumber
    : null;
  const heroRouting = checking?.routingNumber ?? null;
  const heroRoutingDisplay = heroRouting
    ? showRoute
      ? heroRouting
      : "•••• •••• " + heroRouting.slice(-3)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        subtitle={`Account holder: ${profile.displayName}`}
        actions={
          <>
            <Link href="/transactions" className={buttonClasses("secondary", "md")}>
              <ReceiptText className="h-4 w-4" aria-hidden /> All transactions
            </Link>
            <Link href="/payments/transfers" className={buttonClasses("primary", "md")}>
              <ArrowLeftRight className="h-4 w-4" aria-hidden /> Transfer money
            </Link>
          </>
        }
      />

      {/* Summary tiles */}
      <div className="grid gap-4 sm:grid-cols-2">

        {/* Hero card — white background, all black text, account + routing with eye */}
        <Card className="border-slate-300 bg-white">
          <CardBody className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Total available balance
            </p>
            <p className="mt-2 text-3xl font-bold tabular text-slate-900">
              {formatCurrency(totalAvailable)}
            </p>
            <p className="mt-1 text-xs text-slate-500">Checking + savings deposit accounts</p>

            {/* Account number */}
            {heroAcctNum && (
              <div className="mt-4 flex items-center gap-2">
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

            {/* Routing number */}
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

        {/* Credit card tile */}
        <Card>
          <CardBody className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Total credit card balance
            </p>
            <p className="mt-2 text-3xl font-bold tabular text-slate-900">
              {formatCurrency(totalCreditBalance)}
            </p>
            <p className="mt-1 text-xs text-slate-500">Amount currently owed on credit cards</p>
          </CardBody>
        </Card>
      </div>

      {/* Account cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            transactions={transactions.filter((t) => t.accountId === account.id)}
          />
        ))}
      </div>

      {/* Account summary table */}
      <Card>
        <CardHeader
          title="Account summary"
          subtitle="Balances and account details"
          action={
            <button
              type="button"
              onClick={() => setShowTableNumbers((v) => !v)}
              className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-300 hover:text-brand-800"
            >
              {showTableNumbers
                ? <><EyeOff className="h-3.5 w-3.5" aria-hidden /> Hide numbers</>
                : <><Eye className="h-3.5 w-3.5" aria-hidden /> Show account numbers</>}
            </button>
          }
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-5 py-3 font-semibold">Account</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Type</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Account number</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Routing number</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Current</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Available</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map((a) => {
                  const displayNum = showTableNumbers && a.fullAccountNumber
                    ? a.fullAccountNumber.replace(/(\d{4})(?=\d)/g, "$1 ")
                    : a.maskedNumber;
                  return (
                    <tr key={a.id} className="hover:bg-brand-50/50">
                      <td className="px-5 py-3 font-medium text-slate-800">{a.name}</td>
                      <td className="px-5 py-3 capitalize text-slate-600">{a.type}</td>
                      <td className="px-5 py-3 font-mono text-slate-800">{displayNum}</td>
                      <td className="px-5 py-3 font-mono text-slate-700">
                        {a.type !== "credit" ? (a.routingNumber ?? "—") : "—"}
                      </td>
                      <td className="px-5 py-3 text-right tabular text-slate-800">
                        {formatCurrency(a.currentBalance)}
                      </td>
                      <td className="px-5 py-3 text-right tabular text-slate-800">
                        {formatCurrency(a.availableBalance)}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{a.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
