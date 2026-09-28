import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AlertCategory,
  Confirmation,
  Payee,
  Payment,
  SpendingCategory,
  Transaction,
  TransactionStatus,
  UserDataset,
  UserProfile,
} from "@/types/banking";
import { buildDataset } from "@/data/seed";
import { confirmationNumber, uid } from "@/lib/utils";
import { isoDaysFromToday, startOfTodayUtc } from "@/lib/formatters";

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export interface TransferInput {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
  frequency: Payment["frequency"];
  memo: string;
}

export interface BillPayInput {
  payeeName: string;
  fromAccountId: string;
  amount: number;
  date: string;
  frequency: Payment["frequency"];
  memo: string;
}

interface BankingState {
  currentUserId: string | null;
  datasets: Record<string, UserDataset>;
  login: (userId: string) => void;
  logout: () => void;
  resetDemoData: (userId: string) => void;
  makeTransfer: (input: TransferInput) => Confirmation;
  makeBillPayment: (input: BillPayInput) => Confirmation;
  cancelPayment: (paymentId: string) => void;
  addPayee: (payee: Omit<Payee, "id" | "userId">) => void;
  updatePayee: (payeeId: string, patch: Partial<Omit<Payee, "id" | "userId">>) => void;
  deletePayee: (payeeId: string) => void;
  markAlertRead: (alertId: string, read: boolean) => void;
  markAllAlertsRead: () => void;
  setCardLocked: (cardId: string, locked: boolean) => void;
  requestCardReplacement: (cardId: string) => void;
  setCardAlerts: (cardId: string, enabled: boolean) => void;
  setCardLimit: (cardId: string, limit: number) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  setTwoStep: (enabled: boolean) => void;
  removeTrustedDevice: (deviceId: string) => void;
  logoutAllSessions: () => void;
  recordPasswordChange: () => void;
  setBudget: (category: SpendingCategory, limit: number) => void;
  pushAlert: (
    category: AlertCategory,
    title: string,
    message: string,
    severity?: "info" | "warning" | "critical",
  ) => void;
}

function makeTx(
  userId: string,
  accountId: string,
  fields: {
    date: string;
    description: string;
    merchant: string;
    category: SpendingCategory;
    amount: number;
    direction: "debit" | "credit";
    type: string;
    status: TransactionStatus;
    balanceAfter: number;
    method: string;
    reference?: string;
  },
): Transaction {
  return {
    id: uid("tx"),
    userId,
    accountId,
    reference: fields.reference ?? uid("REF").toUpperCase(),
    ...fields,
  };
}

export const useBankingStore = create<BankingState>()(
  persist(
    (set, get) => {
      const mutate = (fn: (d: UserDataset) => UserDataset) => {
        const userId = get().currentUserId;
        if (!userId) return;
        const dataset = get().datasets[userId];
        if (!dataset) return;
        set((state) => ({
          datasets: { ...state.datasets, [userId]: fn(dataset) },
        }));
      };

      const ensureDataset = (userId: string) => {
        if (!get().datasets[userId]) {
          set((state) => ({
            datasets: { ...state.datasets, [userId]: buildDataset(userId) },
          }));
        }
      };

      const accountLabel = (d: UserDataset, accountId: string) =>
        d.accounts.find((a) => a.id === accountId)?.name ?? "Unknown account";

      const applyTransfer = (d: UserDataset, input: TransferInput, conf: string): UserDataset => {
        const immediate = new Date(input.date) <= startOfTodayUtc();
        const status: TransactionStatus = immediate ? "Completed" : "Scheduled";
        const from = d.accounts.find((a) => a.id === input.fromAccountId);
        const to = d.accounts.find((a) => a.id === input.toAccountId);
        if (!from || !to) return d;

        const accounts = d.accounts.map((a) => {
          if (immediate && a.id === input.fromAccountId) {
            const delta = a.type === "credit" ? input.amount : -input.amount;
            return {
              ...a,
              currentBalance: round2(a.currentBalance + delta),
              availableBalance: round2(a.availableBalance + delta),
              lastActivityDate: input.date,
            };
          }
          if (immediate && a.id === input.toAccountId) {
            const delta = a.type === "credit" ? -input.amount : input.amount;
            return {
              ...a,
              currentBalance: round2(a.currentBalance + delta),
              availableBalance: round2(a.availableBalance + delta),
              lastActivityDate: input.date,
            };
          }
          return a;
        });

        const newTxs: Transaction[] = [
          makeTx(d.profile.userId, input.fromAccountId, {
            date: input.date,
            description: `TRANSFER TO ${to.name.toUpperCase()}`,
            merchant: "Bank of America",
            category: "Transfers",
            amount: input.amount,
            direction: "debit",
            type: "Internal Transfer",
            status,
            balanceAfter: from.currentBalance,
            method: "Online transfer",
            reference: conf,
          }),
          makeTx(d.profile.userId, input.toAccountId, {
            date: input.date,
            description: `TRANSFER FROM ${from.name.toUpperCase()}`,
            merchant: "Bank of America",
            category: "Transfers",
            amount: input.amount,
            direction: "credit",
            type: "Internal Transfer",
            status,
            balanceAfter: to.currentBalance,
            method: "Online transfer",
            reference: conf,
          }),
        ];

        const payment: Payment = {
          id: uid("pay"),
          userId: d.profile.userId,
          kind: "Transfer",
          payeeName: to.name,
          fromAccountId: input.fromAccountId,
          toAccountId: input.toAccountId,
          amount: input.amount,
          date: input.date,
          frequency: input.frequency,
          memo: input.memo,
          status: immediate ? "Completed" : "Scheduled",
          confirmationNumber: conf,
        };

        return {
          ...d,
          accounts,
          transactions: [...newTxs, ...d.transactions].sort((a, b) =>
            a.date === b.date ? 0 : a.date < b.date ? 1 : -1,
          ),
          payments: [payment, ...d.payments],
        };
      };

      const applyBillPay = (d: UserDataset, input: BillPayInput, conf: string): UserDataset => {
        const immediate = new Date(input.date) <= startOfTodayUtc();
        const status: TransactionStatus = immediate ? "Completed" : "Scheduled";
        const from = d.accounts.find((a) => a.id === input.fromAccountId);
        if (!from) return d;

        const accounts = immediate
          ? d.accounts.map((a) =>
              a.id === input.fromAccountId
                ? {
                    ...a,
                    currentBalance: round2(
                      a.currentBalance + (a.type === "credit" ? input.amount : -input.amount),
                    ),
                    availableBalance: round2(
                      a.availableBalance + (a.type === "credit" ? input.amount : -input.amount),
                    ),
                    lastActivityDate: input.date,
                  }
                : a,
            )
          : d.accounts;

        const tx = makeTx(d.profile.userId, input.fromAccountId, {
          date: input.date,
          description: `BILL PAYMENT ${input.payeeName.toUpperCase()}`,
          merchant: input.payeeName,
          category: "Payments",
          amount: input.amount,
          direction: "debit",
          type: "Bill Payment",
          status,
          balanceAfter: from.currentBalance,
          method: "Online bill pay",
          reference: conf,
        });

        const payment: Payment = {
          id: uid("pay"),
          userId: d.profile.userId,
          kind: "Bill Pay",
          payeeName: input.payeeName,
          fromAccountId: input.fromAccountId,
          amount: input.amount,
          date: input.date,
          frequency: input.frequency,
          memo: input.memo,
          status: immediate ? "Completed" : "Scheduled",
          confirmationNumber: conf,
        };

        return {
          ...d,
          accounts,
          transactions: [tx, ...d.transactions].sort((a, b) =>
            a.date === b.date ? 0 : a.date < b.date ? 1 : -1,
          ),
          payments: [payment, ...d.payments],
        };
      };

      return {
        currentUserId: null,
        datasets: {},

        login: (userId) => {
          ensureDataset(userId);
          set({ currentUserId: userId });
        },

        logout: () => set({ currentUserId: null }),

        resetDemoData: (userId) => {
          set((state) => ({
            datasets: { ...state.datasets, [userId]: buildDataset(userId) },
          }));
        },

        makeTransfer: (input) => {
          const conf = confirmationNumber();
          mutate((d) => applyTransfer(d, input, conf));
          const d = get().datasets[get().currentUserId ?? ""];
          return {
            confirmationNumber: conf,
            kind: "Transfer",
            amount: input.amount,
            fromLabel: d ? accountLabel(d, input.fromAccountId) : "",
            toLabel: d ? accountLabel(d, input.toAccountId) : "",
            date: input.date,
            frequency: input.frequency,
            memo: input.memo,
            status: new Date(input.date) <= startOfTodayUtc() ? "Completed" : "Scheduled",
          };
        },

        makeBillPayment: (input) => {
          const conf = confirmationNumber();
          mutate((d) => applyBillPay(d, input, conf));
          const d = get().datasets[get().currentUserId ?? ""];
          return {
            confirmationNumber: conf,
            kind: "Bill Pay",
            amount: input.amount,
            fromLabel: d ? accountLabel(d, input.fromAccountId) : "",
            toLabel: input.payeeName,
            date: input.date,
            frequency: input.frequency,
            memo: input.memo,
            status: new Date(input.date) <= startOfTodayUtc() ? "Completed" : "Scheduled",
          };
        },

        cancelPayment: (paymentId) => {
          mutate((d) => {
            const payment = d.payments.find((p) => p.id === paymentId);
            if (!payment || payment.status !== "Scheduled") return d;
            return {
              ...d,
              payments: d.payments.map((p) =>
                p.id === paymentId ? { ...p, status: "Canceled" as const } : p,
              ),
              transactions: d.transactions.filter(
                (t) =>
                  !(
                    t.reference === payment.confirmationNumber &&
                    t.status === "Scheduled"
                  ),
              ),
            };
          });
        },

        addPayee: (payee) => {
          mutate((d) => ({
            ...d,
            payees: [
              ...d.payees,
              { ...payee, id: uid("payee"), userId: d.profile.userId },
            ],
          }));
        },

        updatePayee: (payeeId, patch) => {
          mutate((d) => ({
            ...d,
            payees: d.payees.map((p) => (p.id === payeeId ? { ...p, ...patch } : p)),
          }));
        },

        deletePayee: (payeeId) => {
          mutate((d) => ({
            ...d,
            payees: d.payees.filter((p) => p.id !== payeeId),
          }));
        },

        markAlertRead: (alertId, read) => {
          mutate((d) => ({
            ...d,
            alerts: d.alerts.map((a) => (a.id === alertId ? { ...a, read } : a)),
          }));
        },

        markAllAlertsRead: () => {
          mutate((d) => ({
            ...d,
            alerts: d.alerts.map((a) => ({ ...a, read: true })),
          }));
        },

        setCardLocked: (cardId, locked) => {
          mutate((d) => ({
            ...d,
            cards: d.cards.map((c) =>
              c.id === cardId
                ? { ...c, locked, status: locked ? ("Locked" as const) : ("Active" as const) }
                : c,
            ),
          }));
        },

        requestCardReplacement: (cardId) => {
          mutate((d) => ({
            ...d,
            cards: d.cards.map((c) =>
              c.id === cardId ? { ...c, status: "Replacement requested" as const } : c,
            ),
          }));
        },

        setCardAlerts: (cardId, enabled) => {
          mutate((d) => ({
            ...d,
            cards: d.cards.map((c) => (c.id === cardId ? { ...c, alertsEnabled: enabled } : c)),
          }));
        },

        setCardLimit: (cardId, limit) => {
          mutate((d) => ({
            ...d,
            cards: d.cards.map((c) =>
              c.id === cardId ? { ...c, spendingLimitMonthly: limit } : c,
            ),
          }));
        },

        updateProfile: (patch) => {
          mutate((d) => ({ ...d, profile: { ...d.profile, ...patch } }));
        },

        setTwoStep: (enabled) => {
          mutate((d) => ({ ...d, security: { ...d.security, twoStepEnabled: enabled } }));
        },

        removeTrustedDevice: (deviceId) => {
          mutate((d) => ({
            ...d,
            security: {
              ...d.security,
              trustedDevices: d.security.trustedDevices.filter((t) => t.id !== deviceId),
            },
          }));
        },

        logoutAllSessions: () => {
          mutate((d) => ({
            ...d,
            security: {
              ...d.security,
              trustedDevices: d.security.trustedDevices.filter((t) => t.current),
              recentLogins: [
                {
                  id: uid("log"),
                  date: isoDaysFromToday(0),
                  device: "Current session",
                  location: "This device",
                  status: "Success" as const,
                },
                ...d.security.recentLogins,
              ],
            },
          }));
        },

        recordPasswordChange: () => {
          mutate((d) => ({
            ...d,
            security: { ...d.security, passwordLastChanged: isoDaysFromToday(0) },
          }));
        },

        setBudget: (category, limit) => {
          mutate((d) => ({
            ...d,
            budgets: d.budgets.map((b) => (b.category === category ? { ...b, limit } : b)),
          }));
        },

        pushAlert: (category, title, message, severity = "info") => {
          mutate((d) => ({
            ...d,
            alerts: [
              {
                id: uid("al"),
                userId: d.profile.userId,
                category,
                title,
                message,
                date: isoDaysFromToday(0),
                read: false,
                severity,
              },
              ...d.alerts,
            ],
          }));
        },
      };
    },
    {
      name: "boa-banking-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUserId: state.currentUserId,
        datasets: state.datasets,
      }),
    },
  ),
);
