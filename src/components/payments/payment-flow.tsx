"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Plus } from "lucide-react";
import type { Confirmation } from "@/types/banking";
import { useDataset } from "@/store/hooks";
import { useBankingStore } from "@/store/banking-store";
import { useToast } from "@/components/common/toast";
import { Card, CardBody, CardHeader } from "@/components/common/card";
import { Button } from "@/components/common/button";
import { Field, SelectInput, TextArea, TextInput } from "@/components/common/field";
import { ConfirmationPanel } from "@/components/common/confirmation";
import { PayeeModal } from "@/components/payments/payee-modal";
import { formatCurrency, formatDateLong, fromInputDate, isoDaysFromToday, toInputDate } from "@/lib/formatters";

export type FlowMode = "transfer" | "billpay";

interface FormState {
  fromAccountId: string;
  toAccountId: string;
  payeeId: string;
  amount: string;
  date: string;
  frequency: "One time" | "Weekly" | "Monthly";
  memo: string;
}

export function PaymentFlow({ mode }: { mode: FlowMode }) {
  const dataset = useDataset();
  const router = useRouter();
  const params = useSearchParams();
  const makeTransfer = useBankingStore((s) => s.makeTransfer);
  const makeBillPayment = useBankingStore((s) => s.makeBillPayment);
  const pushAlert = useBankingStore((s) => s.pushAlert);
  const { toast } = useToast();

  const [step, setStep] = useState<"form" | "review" | "done">("form");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [payeeModalOpen, setPayeeModalOpen] = useState(false);

  const accounts = dataset?.accounts ?? [];
  const payees = dataset?.payees ?? [];

  const [form, setForm] = useState<FormState>(() => ({
    fromAccountId: params.get("from") ?? accounts[0]?.id ?? "",
    toAccountId: params.get("to") ?? accounts[1]?.id ?? "",
    payeeId: payees[0]?.id ?? "",
    amount: "",
    date: toInputDate(isoDaysFromToday(0)),
    frequency: "One time",
    memo: "",
  }));

  const fromAccount = accounts.find((a) => a.id === form.fromAccountId);
  const toAccount = accounts.find((a) => a.id === form.toAccountId);
  const payee = payees.find((p) => p.id === form.payeeId);
  const amount = Number(form.amount);

  const available = useMemo(() => {
    if (!fromAccount) return 0;
    return fromAccount.availableBalance;
  }, [fromAccount]);

  if (!dataset) return null;

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.fromAccountId) next.fromAccountId = "Choose the account to pay from.";
    if (mode === "transfer" && !form.toAccountId) next.toAccountId = "Choose the account to receive the transfer.";
    if (mode === "transfer" && form.toAccountId === form.fromAccountId)
      next.toAccountId = "The from and to accounts must be different.";
    if (mode === "billpay" && !form.payeeId) next.payeeId = "Choose a payee or add a new one.";
    if (!form.amount.trim()) next.amount = "Enter an amount.";
    else if (Number.isNaN(amount) || amount <= 0) next.amount = "Enter a valid amount greater than zero.";
    else if (amount > 1_000_000) next.amount = "Demo transfers are limited to $1,000,000.";
    else if (amount > available)
      next.amount = `Insufficient funds. Available: ${formatCurrency(available)}.`;
    if (!form.date) next.date = "Choose a date.";
    else if (form.date < toInputDate(isoDaysFromToday(0))) next.date = "Choose today or a future date.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitReview = () => {
    if (validate()) setStep("review");
  };

  const confirm = () => {
    const dateIso = fromInputDate(form.date);
    const conf =
      mode === "transfer"
        ? makeTransfer({
            fromAccountId: form.fromAccountId,
            toAccountId: form.toAccountId,
            amount: Math.round(amount * 100) / 100,
            date: dateIso,
            frequency: form.frequency,
            memo: form.memo,
          })
        : makeBillPayment({
            payeeName: payee?.name ?? "Payee",
            fromAccountId: form.fromAccountId,
            amount: Math.round(amount * 100) / 100,
            date: dateIso,
            frequency: form.frequency,
            memo: form.memo,
          });
    setConfirmation(conf);
    setStep("done");
    pushAlert(
      "Payment",
      conf.status === "Scheduled" ? `Payment scheduled: ${conf.toLabel}` : `Payment completed: ${conf.toLabel}`,
      `${formatCurrency(conf.amount)} from ${conf.fromLabel} on ${formatDateLong(conf.date)}. Confirmation ${conf.confirmationNumber}.`,
    );
    toast(conf.status === "Scheduled" ? "Payment scheduled in the demo ledger." : "Payment completed in the demo ledger.");
  };

  if (step === "done" && confirmation) {
    return (
      <ConfirmationPanel
        confirmation={confirmation}
        onViewActivity={() => router.push("/payments/activity")}
        onReturnToAccounts={() => router.push("/accounts")}
      />
    );
  }

  const title = mode === "transfer" ? "Transfer money" : "Pay a bill";
  const subtitle =
    mode === "transfer"
      ? "Move funds between your demo accounts instantly or on a schedule."
      : "Send a demo payment to one of your saved payees.";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>

      <ol className="flex items-center gap-2 text-xs font-semibold" aria-label="Progress">
        {["Details", "Review", "Confirmation"].map((label, i) => {
          const current = (step === "form" && i === 0) || (step === "review" && i === 1);
          const done = (step === "review" && i === 0) || (step === "done" && i <= 1);
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={
                  done
                    ? "flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white"
                    : current
                      ? "flex h-6 w-6 items-center justify-center rounded-full bg-brand-900 text-white"
                      : "flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500"
                }
              >
                {done ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : i + 1}
              </span>
              <span className={current || done ? "text-brand-900" : "text-slate-400"}>{label}</span>
              {i < 2 && <span className="h-px w-6 bg-slate-300" aria-hidden />}
            </li>
          );
        })}
      </ol>

      {step === "form" && (
        <Card>
          <CardHeader title="Payment details" subtitle="All amounts are fictional demo dollars." />
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="From account" htmlFor="from" error={errors.fromAccountId}>
                <SelectInput
                  id="from"
                  value={form.fromAccountId}
                  invalid={Boolean(errors.fromAccountId)}
                  onChange={(e) => set({ fromAccountId: e.target.value })}
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} {a.maskedNumber} — {formatCurrency(a.availableBalance)} available
                    </option>
                  ))}
                </SelectInput>
              </Field>

              {mode === "transfer" ? (
                <Field label="To account" htmlFor="to" error={errors.toAccountId}>
                  <SelectInput
                    id="to"
                    value={form.toAccountId}
                    invalid={Boolean(errors.toAccountId)}
                    onChange={(e) => set({ toAccountId: e.target.value })}
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} {a.maskedNumber}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              ) : (
                <Field label="Payee" htmlFor="payee" error={errors.payeeId}>
                  <div className="flex gap-2">
                    <SelectInput
                      id="payee"
                      value={form.payeeId}
                      invalid={Boolean(errors.payeeId)}
                      onChange={(e) => set({ payeeId: e.target.value })}
                    >
                      <option value="">Select a payee…</option>
                      {payees.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.maskedAccount}
                        </option>
                      ))}
                    </SelectInput>
                    <Button variant="secondary" onClick={() => setPayeeModalOpen(true)} aria-label="Add payee">
                      <Plus className="h-4 w-4" aria-hidden /> Add
                    </Button>
                  </div>
                </Field>
              )}

              <Field label="Amount (USD)" htmlFor="amount" error={errors.amount}>
                <TextInput
                  id="amount"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={form.amount}
                  invalid={Boolean(errors.amount)}
                  onChange={(e) => set({ amount: e.target.value })}
                />
              </Field>

              <Field label={mode === "transfer" ? "Transfer date" : "Deliver by"} htmlFor="date" error={errors.date}>
                <TextInput
                  id="date"
                  type="date"
                  value={form.date}
                  invalid={Boolean(errors.date)}
                  onChange={(e) => set({ date: e.target.value })}
                />
              </Field>

              <Field label="Frequency" htmlFor="frequency">
                <SelectInput
                  id="frequency"
                  value={form.frequency}
                  onChange={(e) => set({ frequency: e.target.value as FormState["frequency"] })}
                >
                  <option>One time</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </SelectInput>
              </Field>
            </div>

            <Field label="Memo" htmlFor="memo" optional>
              <TextArea
                id="memo"
                rows={2}
                placeholder="Optional note for your records"
                value={form.memo}
                onChange={(e) => set({ memo: e.target.value })}
              />
            </Field>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => router.push("/payments")}>
                Cancel
              </Button>
              <Button onClick={submitReview}>
                Review <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {step === "review" && (
        <Card>
          <CardHeader title="Review your payment" subtitle="Confirm the details below. No real money moves." />
          <CardBody className="space-y-4">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-400">From</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-800">
                  {fromAccount?.name} {fromAccount?.maskedNumber}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-400">To</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-800">
                  {mode === "transfer" ? `${toAccount?.name} ${toAccount?.maskedNumber}` : payee?.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-400">Amount</dt>
                <dd className="mt-0.5 text-sm font-semibold tabular text-slate-800">{formatCurrency(amount)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-400">Date</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-800">{formatDateLong(fromInputDate(form.date))}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-400">Frequency</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-800">{form.frequency}</dd>
              </div>
              {form.memo && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-400">Memo</dt>
                  <dd className="mt-0.5 text-sm text-slate-800">{form.memo}</dd>
                </div>
              )}
            </dl>
            <p className="rounded-md bg-brand-50 px-4 py-3 text-xs text-brand-800">
              {fromInputDate(form.date) <= isoDaysFromToday(0)
                ? "This payment posts immediately and updates your demo balances right away."
                : "This payment will appear as Scheduled until its delivery date."}
            </p>
            <div className="flex justify-between gap-2 border-t border-slate-100 pt-4">
              <Button variant="ghost" onClick={() => setStep("form")}>
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </Button>
              <Button onClick={confirm}>Confirm payment</Button>
            </div>
          </CardBody>
        </Card>
      )}

      <PayeeModal open={payeeModalOpen} onClose={() => setPayeeModalOpen(false)} />
    </div>
  );
}
