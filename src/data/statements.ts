import type { AccountType, StatementDoc } from "@/types/banking";
import { isoDaysFromToday, monthKey, monthLabel } from "@/lib/formatters";

const PERIODS: { offset: number; daysAgo: number }[] = [
  { offset: 0, daysAgo: 6 },
  { offset: 1, daysAgo: 36 },
  { offset: 2, daysAgo: 67 },
  { offset: 3, daysAgo: 97 },
  { offset: 4, daysAgo: 128 },
  { offset: 5, daysAgo: 158 },
];

const AMOUNTS: Record<string, Record<AccountType, { opening: number; closing: number; deposits: number; withdrawals: number }>> = {
  olson2428: {
    checking: { opening: 9210.0, closing: 10830.5, deposits: 11461.5, withdrawals: 9841.0 },
    savings: { opening: 17100.0, closing: 18340.0, deposits: 2300.0, withdrawals: 60.0 },
    credit: { opening: 842.31, closing: 1224.8, deposits: 500.0, withdrawals: 882.49 },
  },
  Jojo_01: {
    checking: { opening: 6210.44, closing: 7842.1, deposits: 9361.35, withdrawals: 7729.69 },
    savings: { opening: 16890.12, closing: 18250.0, deposits: 1402.1, withdrawals: 42.22 },
    credit: { opening: 1240.8, closing: 968.42, deposits: 400.0, withdrawals: 127.62 },
  },
  jojo_02: {
    checking: { opening: 3980.2, closing: 4215.55, deposits: 7922.25, withdrawals: 7686.9 },
    savings: { opening: 25310.4, closing: 26480.9, deposits: 1205.94, withdrawals: 35.44 },
    credit: { opening: 705.16, closing: 612.3, deposits: 250.0, withdrawals: 157.14 },
  },
};

export function buildStatements(userId: string, accountType: AccountType): StatementDoc[] {
  const amounts = AMOUNTS[userId]?.[accountType];
  if (!amounts) return [];
  return PERIODS.map((p, i) => {
    const periodStart = isoDaysFromToday(-p.daysAgo - 30);
    const periodEnd = isoDaysFromToday(-p.daysAgo);
    return {
      id: `${userId}-${accountType}-stmt-${monthKey(periodEnd)}`,
      userId,
      accountId: `${userId}-${accountType}`,
      periodStart,
      periodEnd,
      openingBalance: amounts.opening + i * 12.5,
      closingBalance: amounts.closing + i * 12.5,
      totalDeposits: amounts.deposits,
      totalWithdrawals: amounts.withdrawals,
      statementDate: periodEnd,
      pages: 4 + ((i * 3) % 5),
    };
  });
}

export function statementTitle(doc: StatementDoc): string {
  return `${monthLabel(doc.periodEnd)} Statement`;
}
