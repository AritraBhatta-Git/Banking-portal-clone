"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  CircleHelp,
  CreditCard,
  FileText,
  Landmark,
  ReceiptText,
  Search,
} from "lucide-react";
import { Modal } from "@/components/common/modal";
import { useDataset } from "@/store/hooks";
import { formatCurrency, formatDate } from "@/lib/formatters";

const HELP_TOPICS = [
  { label: "How do I transfer money between accounts?", href: "/payments/transfers" },
  { label: "How do I pay a bill or add a payee?", href: "/payments/bill-pay" },
  { label: "Where can I download statements?", href: "/statements" },
  { label: "How do I lock a lost or stolen card?", href: "/cards" },
  { label: "How do I enable two-step verification?", href: "/security" },
  { label: "How do I update my contact information?", href: "/profile" },
];

interface Result {
  group: string;
  label: string;
  detail: string;
  href: string;
  icon: "tx" | "account" | "payment" | "statement" | "help";
}

const ICONS = {
  tx: ReceiptText,
  account: Landmark,
  payment: CreditCard,
  statement: FileText,
  help: CircleHelp,
};

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dataset = useDataset();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!dataset || q.length < 2) return [];
    const out: Result[] = [];

    for (const t of dataset.transactions) {
      if (
        t.description.toLowerCase().includes(q) ||
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      ) {
        out.push({
          group: "Transactions",
          label: t.description,
          detail: `${formatDate(t.date)} · ${formatCurrency(t.amount)}`,
          href: `/transactions/${t.id}`,
          icon: "tx",
        });
      }
      if (out.filter((r) => r.group === "Transactions").length >= 5) break;
    }

    for (const a of dataset.accounts) {
      if (a.name.toLowerCase().includes(q) || a.type.includes(q)) {
        out.push({
          group: "Accounts",
          label: a.name,
          detail: `${a.maskedNumber} · ${formatCurrency(a.currentBalance)}`,
          href: `/accounts/${a.type === "credit" ? "credit-card" : a.type}`,
          icon: "account",
        });
      }
    }

    for (const p of dataset.payments) {
      if (p.payeeName.toLowerCase().includes(q)) {
        out.push({
          group: "Payments",
          label: `${p.kind} — ${p.payeeName}`,
          detail: `${formatDate(p.date)} · ${formatCurrency(p.amount)} · ${p.status}`,
          href: "/payments/activity",
          icon: "payment",
        });
      }
    }

    for (const s of dataset.statements) {
      const account = dataset.accounts.find((a) => a.id === s.accountId);
      const label = `${account?.name ?? "Account"} statement`;
      if (label.toLowerCase().includes(q) || account?.name.toLowerCase().includes(q)) {
        out.push({
          group: "Statements",
          label,
          detail: `Period ending ${formatDate(s.periodEnd)}`,
          href: "/statements",
          icon: "statement",
        });
      }
      if (out.filter((r) => r.group === "Statements").length >= 3) break;
    }

    for (const h of HELP_TOPICS) {
      if (h.label.toLowerCase().includes(q)) {
        out.push({ group: "Help", label: h.label, detail: "Help topic", href: h.href, icon: "help" });
      }
    }

    return out.slice(0, 18);
  }, [dataset, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Result[]>();
    for (const r of results) {
      map.set(r.group, [...(map.get(r.group) ?? []), r]);
    }
    return [...map.entries()];
  }, [results]);

  return (
    <Modal open={open} onClose={onClose} title="Search" subtitle="Transactions, accounts, payments, statements and help">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “payroll”, “Metro Market”, “statement”…"
          aria-label="Search demo data"
          className="h-11 w-full rounded-md border border-slate-300 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="mt-4 max-h-96 overflow-y-auto">
        {query.trim().length < 2 && (
          <p className="py-8 text-center text-sm text-slate-500">
            Type at least two characters to search your demo data.
          </p>
        )}
        {query.trim().length >= 2 && results.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            No matches for “{query}”. Try a merchant, category or account name.
          </p>
        )}
        {groups.map(([group, items]) => (
          <div key={group} className="mb-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{group}</p>
            <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200">
              {items.map((r, i) => {
                const Icon = ICONS[r.icon];
                return (
                  <li key={`${r.href}-${i}`}>
                    <Link
                      href={r.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-brand-50"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-brand-700" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-800">{r.label}</span>
                        <span className="block truncate text-xs text-slate-500">{r.detail}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Modal>
  );
}
