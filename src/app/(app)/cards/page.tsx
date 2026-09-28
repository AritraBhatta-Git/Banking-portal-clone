"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Gift, Lock, LockOpen, ReceiptText, RefreshCw, SlidersHorizontal } from "lucide-react";
import type { CardItem } from "@/types/banking";
import { useDataset } from "@/store/hooks";
import { useBankingStore } from "@/store/banking-store";
import { useToast } from "@/components/common/toast";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/common/card";
import { Button, buttonClasses } from "@/components/common/button";
import { Badge } from "@/components/common/badge";
import { Modal } from "@/components/common/modal";
import { Toggle, Field, TextInput } from "@/components/common/field";
import { CardVisual } from "@/components/cards/card-visual";
import { formatCurrency } from "@/lib/formatters";

export default function CardsPage() {
  const dataset = useDataset();
  const setCardLocked = useBankingStore((s) => s.setCardLocked);
  const requestCardReplacement = useBankingStore((s) => s.requestCardReplacement);
  const setCardAlerts = useBankingStore((s) => s.setCardAlerts);
  const setCardLimit = useBankingStore((s) => s.setCardLimit);
  const pushAlert = useBankingStore((s) => s.pushAlert);
  const { toast } = useToast();

  const [details, setDetails] = useState<CardItem | null>(null);
  const [rewards, setRewards] = useState<CardItem | null>(null);
  const [replacing, setReplacing] = useState<CardItem | null>(null);
  const [limitFor, setLimitFor] = useState<CardItem | null>(null);
  const [limitDraft, setLimitDraft] = useState("");
  const [limitError, setLimitError] = useState("");
  const [revealCvv, setRevealCvv] = useState(false);

  if (!dataset) return null;

  const saveLimit = () => {
    const value = Number(limitDraft);
    if (!limitDraft.trim() || Number.isNaN(value) || value <= 0 || value > 100000) {
      setLimitError("Enter a limit between $1 and $100,000.");
      return;
    }
    if (limitFor) {
      setCardLimit(limitFor.id, Math.round(value));
      toast(`Monthly limit for ${limitFor.accountName} set to ${formatCurrency(value)}.`);
    }
    setLimitFor(null);
    setLimitError("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cards"
        subtitle="Manage your debit and credit cards"
        actions={
          <Link href="/transactions" className={buttonClasses("secondary", "md")}>
            <ReceiptText className="h-4 w-4" aria-hidden /> Card transactions
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {dataset.cards.map((card) => {
          const account = dataset.accounts.find((a) => a.id === card.accountId);
          return (
            <Card key={card.id}>
              <CardBody className="space-y-4 p-5">
                <CardVisual card={card} />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-brand-950">{card.accountName}</p>
                    <p className="text-xs text-slate-500">
                      {card.network} · expires {card.expiry} ·{" "}
                      {card.digitalWallet ? "In digital wallet" : "Not in wallet"}
                    </p>
                  </div>
                  <Badge
                    tone={
                      card.locked
                        ? "red"
                        : card.status === "Replacement requested"
                          ? "amber"
                          : "green"
                    }
                  >
                    {card.locked ? "Locked" : card.status}
                  </Badge>
                </div>

                {account?.type === "credit" && (
                  <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    Balance {formatCurrency(account.currentBalance)} · limit{" "}
                    {formatCurrency(account.creditLimit ?? 0)} · rewards{" "}
                    {(account.rewardsPoints ?? 0).toLocaleString("en-US")} pts
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={card.locked ? "danger" : "secondary"}
                    size="sm"
                    onClick={() => {
                      setCardLocked(card.id, !card.locked);
                      pushAlert(
                        "Security",
                        card.locked
                          ? `Card unlocked: ${card.accountName}`
                          : `Card locked: ${card.accountName}`,
                        card.locked
                          ? `Your ${card.accountName} ending ${card.maskedNumber.slice(-4)} can be used again.`
                          : `Your ${card.accountName} ending ${card.maskedNumber.slice(-4)} is locked. New purchases will be declined.`,
                        card.locked ? "info" : "warning",
                      );
                      toast(
                        card.locked
                          ? `${card.accountName} unlocked.`
                          : `${card.accountName} locked. New purchases will be declined.`,
                        card.locked ? "success" : "warning",
                      );
                    }}
                  >
                    {card.locked
                      ? <LockOpen className="h-4 w-4" aria-hidden />
                      : <Lock className="h-4 w-4" aria-hidden />}
                    {card.locked ? "Unlock card" : "Lock card"}
                  </Button>

                  <Button variant="secondary" size="sm" onClick={() => setReplacing(card)}>
                    <RefreshCw className="h-4 w-4" aria-hidden /> Replace card
                  </Button>

                  <Link
                    href={`/transactions?account=${card.accountId}`}
                    className={buttonClasses("secondary", "sm")}
                  >
                    <ReceiptText className="h-4 w-4" aria-hidden /> Transactions
                  </Link>

                  {account?.type === "credit" ? (
                    <Link
                      href={`/payments/transfers?to=${card.accountId}`}
                      className={buttonClasses("secondary", "sm")}
                    >
                      Make payment
                    </Link>
                  ) : (
                    <Link
                      href={`/payments/transfers?from=${card.accountId}`}
                      className={buttonClasses("secondary", "sm")}
                    >
                      Transfer from
                    </Link>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setDetails(card); setRevealCvv(false); }}
                  >
                    <Eye className="h-4 w-4" aria-hidden /> Card details
                  </Button>

                  <Button variant="ghost" size="sm" onClick={() => setRewards(card)}>
                    <Gift className="h-4 w-4" aria-hidden /> Rewards &amp; deals
                  </Button>
                </div>

                <div className="rounded-lg border border-slate-200 p-3">
                  <Toggle
                    id={`alerts-${card.id}`}
                    checked={card.alertsEnabled}
                    onChange={(v) => {
                      setCardAlerts(card.id, v);
                      toast(v ? "Purchase alerts enabled." : "Purchase alerts disabled.", "info");
                    }}
                    label="Purchase alerts"
                    description="Notify me on every purchase"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLimitFor(card);
                      setLimitDraft(String(card.spendingLimitMonthly));
                      setLimitError("");
                    }}
                    className="mt-3 flex items-center gap-2 text-xs font-semibold text-brand-700 hover:underline"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
                    Monthly spending limit: {formatCurrency(card.spendingLimitMonthly)}
                  </button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Card details modal */}
      <Modal
        open={details !== null}
        onClose={() => setDetails(null)}
        title="Card details"
        subtitle="Full numbers are never displayed in this demo"
      >
        {details && (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(
              [
                ["Card", details.accountName],
                ["Network", details.network],
                ["Number", details.maskedNumber],
                ["Expires", details.expiry],
                ["Holder", details.holderName],
                ["Status", details.locked ? "Locked" : details.status],
                ["Contactless", details.contactless ? "Enabled" : "Disabled"],
                ["Digital wallet", details.digitalWallet ? "Enrolled" : "Not enrolled"],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wider text-slate-400">{label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-800">{value}</dd>
              </div>
            ))}
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400">Security code</dt>
              <dd className="mt-0.5 flex items-center gap-2 text-sm font-medium text-slate-800">
                <span className="font-mono">{revealCvv ? details.cvv : "•••"}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRevealCvv((v) => !v)}
                  aria-label={revealCvv ? "Hide security code" : "Reveal security code"}
                >
                  {revealCvv
                    ? <EyeOff className="h-4 w-4" aria-hidden />
                    : <Eye className="h-4 w-4" aria-hidden />}
                </Button>
              </dd>
            </div>
          </dl>
        )}
      </Modal>

      {/* Rewards modal */}
      <Modal
        open={rewards !== null}
        onClose={() => setRewards(null)}
        title="Rewards &amp; deals"
        subtitle="Fictional rewards for the demo card"
      >
        {rewards && (
          <div className="space-y-4">
            <div className="rounded-lg bg-brand-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Rewards balance
              </p>
              <p className="mt-1 text-2xl font-bold tabular text-brand-950">
                {(
                  dataset.accounts.find((a) => a.id === rewards.accountId)?.rewardsPoints ?? 0
                ).toLocaleString("en-US")}{" "}
                points
              </p>
              <p className="mt-1 text-xs text-brand-700">
                ≈{" "}
                {formatCurrency(
                  (dataset.accounts.find((a) => a.id === rewards.accountId)?.rewardsPoints ?? 0) /
                    100,
                )}{" "}
                statement credit
              </p>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                "3% back on groceries at demo merchants",
                "2% back on fuel and transit",
                "1% back on everything else",
                "No foreign transaction fees in the demo world",
              ].map((perk) => (
                <li key={perk} className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-brand-600" aria-hidden /> {perk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      {/* Replace card modal */}
      <Modal
        open={replacing !== null}
        onClose={() => setReplacing(null)}
        title="Replace card"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReplacing(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (replacing) {
                  requestCardReplacement(replacing.id);
                  pushAlert(
                    "Account",
                    `Replacement card requested: ${replacing.accountName}`,
                    "A replacement card arrives in 5–7 business days. The current card stays active until then.",
                  );
                  toast("Replacement card requested.");
                }
                setReplacing(null);
              }}
            >
              Request replacement
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Request a replacement for{" "}
          <span className="font-semibold">{replacing?.accountName}</span>? The card status
          will change to &quot;Replacement requested&quot; and an alert will be added to your inbox.
        </p>
      </Modal>

      {/* Spending limit modal */}
      <Modal
        open={limitFor !== null}
        onClose={() => setLimitFor(null)}
        title="Monthly spending limit"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setLimitFor(null)}>
              Cancel
            </Button>
            <Button onClick={saveLimit}>Save limit</Button>
          </>
        }
      >
        <Field label="Limit (USD)" htmlFor="card-limit" error={limitError}>
          <TextInput
            id="card-limit"
            inputMode="numeric"
            value={limitDraft}
            invalid={Boolean(limitError)}
            onChange={(e) => setLimitDraft(e.target.value)}
          />
        </Field>
      </Modal>
    </div>
  );
}
