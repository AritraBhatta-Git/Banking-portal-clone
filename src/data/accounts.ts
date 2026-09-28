import type { Account, AccountType } from "@/types/banking";
import { isoDaysFromToday } from "@/lib/formatters";
import { buildTransactions, OPENING_BALANCES } from "@/data/transactions";

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

const META: Record<
  string,
  Record<AccountType, { name: string; maskedNumber: string; fullAccountNumber?: string; routingNumber: string; opened: number }>
> = {
  olson2428: {
    checking: { name: "Everyday Checking", maskedNumber: "•••• 2189", fullAccountNumber: "827978652189", routingNumber: "891728789", opened: -3285 },
    savings: { name: "Premier Savings", maskedNumber: "•••• 2190", fullAccountNumber: "827978652190", routingNumber: "891728789", opened: -3285 },
    credit: { name: "Platinum Rewards Credit Card", maskedNumber: "•••• 4471", fullAccountNumber: "827978654471", routingNumber: "891728789", opened: -2190 },
  },
  Jojo_01: {
    checking: { name: "Everyday Checking", maskedNumber: "•••• 7094", fullAccountNumber: "823917094001", routingNumber: "123456789", opened: -2380 },
    savings: { name: "Premier Savings", maskedNumber: "•••• 3821", fullAccountNumber: "823913821002", routingNumber: "123456789", opened: -2380 },
    credit: { name: "Platinum Rewards Credit Card", maskedNumber: "•••• 6158", fullAccountNumber: "823916158003", routingNumber: "123456789", opened: -1460 },
  },
  jojo_02: {
    checking: { name: "Core Checking", maskedNumber: "•••• 4512", fullAccountNumber: "819114512001", routingNumber: "123456789", opened: -1830 },
    savings: { name: "High-Yield Savings", maskedNumber: "•••• 9263", fullAccountNumber: "819119263002", routingNumber: "123456789", opened: -1830 },
    credit: { name: "Travel Rewards Credit Card", maskedNumber: "•••• 3307", fullAccountNumber: "819113307003", routingNumber: "123456789", opened: -980 },
  },
};

function buildUserAccounts(userId: string): Account[] {
  const { transactions, closing } = buildTransactions(userId);
  const meta = META[userId] ?? META["Jojo_01"];

  const pendingHold: Record<AccountType, number> = { checking: 0, savings: 0, credit: 0 };
  const lastActivity: Record<AccountType, string> = {
    checking: isoDaysFromToday(0),
    savings: isoDaysFromToday(0),
    credit: isoDaysFromToday(0),
  };
  for (const t of transactions) {
    const key = t.accountId.split("-").pop() as AccountType;
    if (t.status === "Pending" && t.direction === "debit") {
      pendingHold[key] = round2(pendingHold[key] + t.amount);
    }
    if (t.date < lastActivity[key] && (t.status === "Posted" || t.status === "Completed")) {
      lastActivity[key] = t.date;
    }
  }

  const creditLimitMap: Record<string, number> = {
    olson2428: 15000,
    Jojo_01: 12000,
    jojo_02: 8000,
  };
  const creditLimit = creditLimitMap[userId] ?? 12000;

  const apyMap: Record<string, number> = {
    olson2428: 4.25,
    Jojo_01: 4.1,
    jojo_02: 4.35,
  };

  const interestYtdMap: Record<string, number> = {
    olson2428: 521.44,
    Jojo_01: 412.88,
    jojo_02: 618.34,
  };

  const aprMap: Record<string, number> = {
    olson2428: 19.99,
    Jojo_01: 21.24,
    jojo_02: 23.49,
  };

  const rewardsMap: Record<string, number> = {
    olson2428: 38420,
    Jojo_01: 24810,
    jojo_02: 11240,
  };

  // Payment due date: olson2428 → Oct 10 (12 days from Sep 28), Jojo_01 → 12 days, jojo_02 → 18 days
  const dueDateOffsetMap: Record<string, number> = {
    olson2428: 12,
    Jojo_01: 12,
    jojo_02: 18,
  };

  const checking: Account = {
    id: `${userId}-checking`,
    userId,
    name: meta.checking.name,
    type: "checking",
    maskedNumber: meta.checking.maskedNumber,
    fullAccountNumber: meta.checking.fullAccountNumber,
    currentBalance: round2(closing.checking),
    availableBalance: round2(closing.checking - pendingHold.checking),
    openedDate: isoDaysFromToday(meta.checking.opened),
    status: "Open",
    routingNumber: meta.checking.routingNumber,
    lastActivityDate: lastActivity.checking,
  };

  const savings: Account = {
    id: `${userId}-savings`,
    userId,
    name: meta.savings.name,
    type: "savings",
    maskedNumber: meta.savings.maskedNumber,
    fullAccountNumber: meta.savings.fullAccountNumber,
    currentBalance: round2(closing.savings),
    availableBalance: round2(closing.savings - pendingHold.savings),
    openedDate: isoDaysFromToday(meta.savings.opened),
    status: "Open",
    routingNumber: meta.savings.routingNumber,
    apy: apyMap[userId] ?? 4.1,
    interestEarnedYtd: interestYtdMap[userId] ?? 412.88,
    lastActivityDate: lastActivity.savings,
  };

  const credit: Account = {
    id: `${userId}-credit`,
    userId,
    name: meta.credit.name,
    type: "credit",
    maskedNumber: meta.credit.maskedNumber,
    fullAccountNumber: meta.credit.fullAccountNumber,
    currentBalance: round2(closing.credit),
    availableBalance: round2(creditLimit - closing.credit - pendingHold.credit),
    openedDate: isoDaysFromToday(meta.credit.opened),
    status: "Open",
    routingNumber: meta.credit.routingNumber,
    creditLimit,
    minimumPayment: round2(Math.max(35, closing.credit * 0.03)),
    paymentDueDate: isoDaysFromToday(dueDateOffsetMap[userId] ?? 12),
    apr: aprMap[userId] ?? 21.24,
    rewardsPoints: rewardsMap[userId] ?? 24810,
    lastActivityDate: lastActivity.credit,
  };

  return [checking, savings, credit];
}

export function buildAccounts(userId: string): Account[] {
  return buildUserAccounts(userId);
}
