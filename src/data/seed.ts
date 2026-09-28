import type { SecuritySettings, UserDataset } from "@/types/banking";
import { PROFILES } from "@/data/users";
import { buildAccounts } from "@/data/accounts";
import { buildTransactions } from "@/data/transactions";
import { buildPayees } from "@/data/payees";
import { buildPayments } from "@/data/payments";
import { buildAlerts } from "@/data/alerts";
import { buildStatements } from "@/data/statements";
import { buildCards } from "@/data/cards";
import { isoDaysFromToday } from "@/lib/formatters";

function buildSecurity(userId: string): SecuritySettings {
  if (userId === "olson2428") {
    return {
      twoStepEnabled: true,
      passwordLastChanged: isoDaysFromToday(-62),
      trustedDevices: [
        { id: `${userId}-dev-1`, name: "Windows 11 PC · Chrome", lastUsed: isoDaysFromToday(0), current: true },
        { id: `${userId}-dev-2`, name: "iPhone 16 · Mobile App", lastUsed: isoDaysFromToday(-2), current: false },
        { id: `${userId}-dev-3`, name: "iPad Pro · Safari", lastUsed: isoDaysFromToday(-11), current: false },
      ],
      recentLogins: [
        { id: `${userId}-log-1`, date: isoDaysFromToday(0), device: "Windows 11 PC · Chrome", location: "Charlotte, NC", status: "Success" },
        { id: `${userId}-log-2`, date: isoDaysFromToday(-2), device: "iPhone 16 · Mobile App", location: "Charlotte, NC", status: "Success" },
        { id: `${userId}-log-3`, date: isoDaysFromToday(-5), device: "Unknown device · Firefox", location: "Atlanta, GA", status: "Failed" },
        { id: `${userId}-log-4`, date: isoDaysFromToday(-9), device: "Windows 11 PC · Chrome", location: "Charlotte, NC", status: "Success" },
      ],
    };
  }
  if (userId === "Jojo_01") {
    return {
      twoStepEnabled: true,
      passwordLastChanged: isoDaysFromToday(-94),
      trustedDevices: [
        { id: `${userId}-dev-1`, name: "Windows Laptop · Chrome", lastUsed: isoDaysFromToday(0), current: true },
        { id: `${userId}-dev-2`, name: "iPhone 15 · Mobile App", lastUsed: isoDaysFromToday(-1), current: false },
        { id: `${userId}-dev-3`, name: "iPad · Safari", lastUsed: isoDaysFromToday(-9), current: false },
      ],
      recentLogins: [
        { id: `${userId}-log-1`, date: isoDaysFromToday(0), device: "Windows Laptop · Chrome", location: "Charlotte, NC", status: "Success" },
        { id: `${userId}-log-2`, date: isoDaysFromToday(-1), device: "iPhone 15 · Mobile App", location: "Charlotte, NC", status: "Success" },
        { id: `${userId}-log-3`, date: isoDaysFromToday(-3), device: "Unknown device · Firefox", location: "Reno, NV", status: "Failed" },
        { id: `${userId}-log-4`, date: isoDaysFromToday(-7), device: "Windows Laptop · Chrome", location: "Charlotte, NC", status: "Success" },
      ],
    };
  }
  // jojo_02
  return {
    twoStepEnabled: false,
    passwordLastChanged: isoDaysFromToday(-212),
    trustedDevices: [
      { id: `${userId}-dev-1`, name: "MacBook Air · Safari", lastUsed: isoDaysFromToday(0), current: true },
      { id: `${userId}-dev-2`, name: "Pixel 9 · Mobile App", lastUsed: isoDaysFromToday(-4), current: false },
    ],
    recentLogins: [
      { id: `${userId}-log-1`, date: isoDaysFromToday(0), device: "MacBook Air · Safari", location: "Seattle, WA", status: "Success" },
      { id: `${userId}-log-2`, date: isoDaysFromToday(-4), device: "Pixel 9 · Mobile App", location: "Seattle, WA", status: "Success" },
      { id: `${userId}-log-3`, date: isoDaysFromToday(-6), device: "MacBook Air · Safari", location: "Portland, OR", status: "Success" },
      { id: `${userId}-log-4`, date: isoDaysFromToday(-10), device: "Unknown device · Edge", location: "Boise, ID", status: "Failed" },
    ],
  };
}

const BUDGETS: Record<string, UserDataset["budgets"]> = {
  olson2428: [
    { category: "Housing", limit: 2000 },
    { category: "Food", limit: 800 },
    { category: "Shopping", limit: 400 },
    { category: "Transportation", limit: 300 },
    { category: "Utilities", limit: 350 },
    { category: "Entertainment", limit: 150 },
    { category: "Subscriptions", limit: 75 },
    { category: "Health", limit: 100 },
    { category: "Other", limit: 250 },
  ],
  Jojo_01: [
    { category: "Housing", limit: 1900 },
    { category: "Food", limit: 700 },
    { category: "Shopping", limit: 300 },
    { category: "Transportation", limit: 250 },
    { category: "Utilities", limit: 320 },
    { category: "Entertainment", limit: 120 },
    { category: "Subscriptions", limit: 60 },
    { category: "Other", limit: 200 },
  ],
  jojo_02: [
    { category: "Housing", limit: 1500 },
    { category: "Food", limit: 550 },
    { category: "Shopping", limit: 250 },
    { category: "Transportation", limit: 180 },
    { category: "Utilities", limit: 240 },
    { category: "Entertainment", limit: 90 },
    { category: "Subscriptions", limit: 45 },
    { category: "Other", limit: 150 },
  ],
};

function getBudgets(userId: string): UserDataset["budgets"] {
  return (BUDGETS[userId] ?? BUDGETS["Jojo_01"]).map((b) => ({ ...b }));
}

export function buildDataset(userId: string): UserDataset {
  const { transactions } = buildTransactions(userId);
  const profile = PROFILES[userId];
  if (!profile) {
    throw new Error(`Unknown userId: ${userId}`);
  }
  return {
    profile: { ...profile },
    accounts: buildAccounts(userId),
    transactions,
    payees: buildPayees(userId),
    payments: buildPayments(userId),
    alerts: buildAlerts(userId),
    statements: [
      ...buildStatements(userId, "checking"),
      ...buildStatements(userId, "savings"),
      ...buildStatements(userId, "credit"),
    ],
    cards: buildCards(userId),
    security: buildSecurity(userId),
    budgets: getBudgets(userId),
  };
}
