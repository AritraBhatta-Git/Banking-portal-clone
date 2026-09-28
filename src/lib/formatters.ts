const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(value: number) {
  return USD.format(value);
}

export function formatSignedCurrency(value: number, direction: "debit" | "credit") {
  const sign = direction === "debit" ? "-" : "+";
  return `${sign}${USD.format(Math.abs(value))}`;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateLong(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatMonthYear(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function monthLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatRelativeDay(iso: string) {
  const today = startOfTodayUtc();
  const day = new Date(iso);
  day.setUTCHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - day.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 0) return `In ${Math.abs(diff)} days`;
  return `${diff} days ago`;
}

export function startOfTodayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function isoDaysFromToday(offsetDays: number) {
  const base = startOfTodayUtc();
  base.setUTCDate(base.getUTCDate() + offsetDays);
  return base.toISOString();
}

export function toInputDate(iso: string) {
  return iso.slice(0, 10);
}

export function fromInputDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

export function monthKey(iso: string) {
  return iso.slice(0, 7);
}

export function maskAccountNumber(masked: string) {
  return masked;
}

export function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}
