import type { Account, SpendingCategory, Transaction } from "@/types/banking";
import { SPEND_CATEGORIES } from "@/types/banking";
import { isoDaysFromToday, monthKey, monthLabel } from "@/lib/formatters";

export function accountRoute(account: Pick<Account, "type">) {
  return account.type === "credit" ? "/accounts/credit-card" : `/accounts/${account.type}`;
}

export function isPosted(t: Transaction) {
  return t.status === "Posted" || t.status === "Completed";
}

export function isSpend(t: Transaction) {
  return t.direction === "debit" && (SPEND_CATEGORIES as string[]).includes(t.category);
}

export function categoryTotals(txs: Transaction[]): Array<{ category: SpendingCategory; value: number }> {
  const map = new Map<SpendingCategory, number>();
  for (const t of txs) {
    if (!isPosted(t) || !isSpend(t)) continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  return [...map.entries()]
    .map(([category, value]) => ({ category, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);
}

export function transactionsSince(txs: Transaction[], days: number) {
  const since = isoDaysFromToday(-days);
  return txs.filter((t) => t.date >= since);
}

export function monthlySeries(txs: Transaction[], months: number, mode: "spend" | "income") {
  const now = new Date();
  const buckets: Array<{ key: string; label: string; value: number }> = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    buckets.push({ key: monthKey(d.toISOString()), label: monthLabel(d.toISOString()), value: 0 });
  }
  const index = new Map(buckets.map((b) => [b.key, b]));
  for (const t of txs) {
    if (!isPosted(t)) continue;
    const bucket = index.get(monthKey(t.date));
    if (!bucket) continue;
    if (mode === "spend" && isSpend(t)) bucket.value += t.amount;
    if (mode === "income" && t.direction === "credit" && t.category === "Income") bucket.value += t.amount;
  }
  return buckets.map((b) => ({ label: b.label, value: Math.round(b.value * 100) / 100 }));
}

export function signedAmount(t: Transaction) {
  return t.direction === "debit" ? -t.amount : t.amount;
}

export function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
