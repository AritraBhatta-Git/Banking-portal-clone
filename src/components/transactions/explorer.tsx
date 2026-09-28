"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, FilterX, SearchX } from "lucide-react";
import type { Account, Transaction, TransactionDirection, TransactionStatus } from "@/types/banking";
import { SPEND_CATEGORIES } from "@/types/banking";
import { Field, SelectInput, TextInput } from "@/components/common/field";
import { StatusBadge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { EmptyState } from "@/components/common/empty-state";
import { formatCurrency, formatDate, toInputDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

type SortKey = "newest" | "oldest" | "amount-high" | "amount-low";

export interface ExplorerProps {
  transactions: Transaction[];
  accounts: Account[];
  showAccountFilter?: boolean;
  initialAccountId?: string;
}

export function TransactionExplorer({
  transactions,
  accounts,
  showAccountFilter = false,
  initialAccountId = "all",
}: ExplorerProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [accountId, setAccountId] = useState(initialAccountId);
  const [category, setCategory] = useState("all");
  const [direction, setDirection] = useState<"all" | TransactionDirection>("all");
  const [status, setStatus] = useState<"all" | TransactionStatus>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(0);

  const accountName = (id: string) => accounts.find((a) => a.id === id)?.name ?? "Account";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = transactions.filter((t) => {
      if (showAccountFilter && accountId !== "all" && t.accountId !== accountId) return false;
      if (!showAccountFilter && accountId !== "all" && t.accountId !== accountId) return false;
      if (category !== "all" && t.category !== category) return false;
      if (direction !== "all" && t.direction !== direction) return false;
      if (status !== "all" && t.status !== status) return false;
      if (from && t.date < `${from}T00:00:00.000Z`) return false;
      if (to && t.date > `${to}T23:59:59.999Z`) return false;
      if (q && !`${t.description} ${t.merchant} ${t.category} ${t.type}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const sorted = [...list];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));
        break;
      case "oldest":
        sorted.sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? -1 : 1));
        break;
      case "amount-high":
        sorted.sort((a, b) => b.amount - a.amount);
        break;
      case "amount-low":
        sorted.sort((a, b) => a.amount - b.amount);
        break;
    }
    return sorted;
  }, [transactions, query, accountId, category, direction, status, from, to, sort, showAccountFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const reset = () => {
    setQuery("");
    setAccountId("all");
    setCategory("all");
    setDirection("all");
    setStatus("all");
    setFrom("");
    setTo("");
    setSort("newest");
    setPage(0);
  };

  const hasFilters =
    query !== "" || accountId !== "all" || category !== "all" || direction !== "all" || status !== "all" || from !== "" || to !== "";

  const open = (id: string) => router.push(`/transactions/${id}`);

  return (
    <div>
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card md:grid-cols-2 xl:grid-cols-4">
        <Field label="Search" htmlFor="tx-search">
          <TextInput
            id="tx-search"
            placeholder="Description or merchant"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
          />
        </Field>
        {showAccountFilter && (
          <Field label="Account" htmlFor="tx-account">
            <SelectInput
              id="tx-account"
              value={accountId}
              onChange={(e) => {
                setAccountId(e.target.value);
                setPage(0);
              }}
            >
              <option value="all">All accounts</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} {a.maskedNumber}
                </option>
              ))}
            </SelectInput>
          </Field>
        )}
        <Field label="Category" htmlFor="tx-category">
          <SelectInput
            id="tx-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
            }}
          >
            <option value="all">All categories</option>
            {[...SPEND_CATEGORIES, "Income", "Transfers", "Payments", "Fees", "Interest"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Debit / credit" htmlFor="tx-direction">
          <SelectInput
            id="tx-direction"
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value as typeof direction);
              setPage(0);
            }}
          >
            <option value="all">Both</option>
            <option value="debit">Debits (money out)</option>
            <option value="credit">Credits (money in)</option>
          </SelectInput>
        </Field>
        <Field label="Status" htmlFor="tx-status">
          <SelectInput
            id="tx-status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as typeof status);
              setPage(0);
            }}
          >
            <option value="all">Any status</option>
            {["Posted", "Pending", "Completed", "Scheduled", "Declined"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="From date" htmlFor="tx-from">
          <TextInput
            id="tx-from"
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(0);
            }}
          />
        </Field>
        <Field label="To date" htmlFor="tx-to">
          <TextInput
            id="tx-to"
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(0);
            }}
          />
        </Field>
        <Field label="Sort by" htmlFor="tx-sort">
          <SelectInput
            id="tx-sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortKey);
              setPage(0);
            }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="amount-high">Amount: high to low</option>
            <option value="amount-low">Amount: low to high</option>
          </SelectInput>
        </Field>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500" aria-live="polite">
          {filtered.length} transaction{filtered.length === 1 ? "" : "s"} found
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <FilterX className="h-4 w-4" aria-hidden /> Clear filters
          </Button>
        )}
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        {visible.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={SearchX}
              title="No transactions match your filters"
              message="Try widening the date range, clearing the search box, or choosing a different category."
              action={
                hasFilters ? (
                  <Button variant="secondary" size="sm" onClick={reset}>
                    Clear all filters
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Description</th>
                    {showAccountFilter && <th scope="col" className="px-5 py-3 font-semibold">Account</th>}
                    <th scope="col" className="px-5 py-3 font-semibold">Category</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Amount</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Type</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => open(t.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          open(t.id);
                        }
                      }}
                      tabIndex={0}
                      className="cursor-pointer transition-colors hover:bg-brand-50/60 focus:bg-brand-50"
                    >
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">{formatDate(t.date)}</td>
                      <td className="max-w-64 px-5 py-3">
                        <span className="block truncate font-medium text-slate-800">{t.description}</span>
                        <span className="block truncate text-xs text-slate-500">{t.merchant}</span>
                      </td>
                      {showAccountFilter && <td className="whitespace-nowrap px-5 py-3 text-slate-600">{accountName(t.accountId)}</td>}
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">{t.category}</td>
                      <td
                        className={cn(
                          "whitespace-nowrap px-5 py-3 text-right font-semibold tabular",
                          t.direction === "debit" ? "text-slate-800" : "text-emerald-600",
                        )}
                      >
                        {t.direction === "debit" ? "-" : "+"}
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">{t.type}</td>
                      <td className="whitespace-nowrap px-5 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-right tabular text-slate-600">
                        {formatCurrency(t.balanceAfter)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-slate-100 lg:hidden">
              {visible.map((t) => (
                <li key={t.id}>
                  <button type="button" onClick={() => open(t.id)} className="w-full px-4 py-3 text-left hover:bg-brand-50/60">
                    <span className="flex items-center justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-800">{t.description}</span>
                        <span className="block text-xs text-slate-500">
                          {formatDate(t.date)} · {t.category}
                          {showAccountFilter ? ` · ${accountName(t.accountId)}` : ""}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className={cn("block text-sm font-semibold tabular", t.direction === "debit" ? "text-slate-800" : "text-emerald-600")}>
                          {t.direction === "debit" ? "-" : "+"}
                          {formatCurrency(t.amount)}
                        </span>
                        <StatusBadge status={t.status} />
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
              <p className="text-xs text-slate-500">
                Page {safePage + 1} of {pageCount}
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
                  <ChevronLeft className="h-4 w-4" aria-hidden /> Previous
                </Button>
                <Button variant="secondary" size="sm" disabled={safePage >= pageCount - 1} onClick={() => setPage(safePage + 1)}>
                  Next <ChevronRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
