"use client";

import { useMemo, useState } from "react";
import { CalendarX2 } from "lucide-react";
import type { Payment, PaymentStatus } from "@/types/banking";
import { useDataset } from "@/store/hooks";
import { useBankingStore } from "@/store/banking-store";
import { useToast } from "@/components/common/toast";
import { Card, CardBody, PageHeader } from "@/components/common/card";
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { StatusBadge } from "@/components/common/badge";
import { EmptyState } from "@/components/common/empty-state";
import { formatCurrency, formatDate, formatDateLong } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const TABS: Array<"All" | PaymentStatus> = ["All", "Scheduled", "Completed", "Canceled"];

export default function PaymentActivityPage() {
  const dataset = useDataset();
  const cancelPayment = useBankingStore((s) => s.cancelPayment);
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [detail, setDetail] = useState<Payment | null>(null);
  const [canceling, setCanceling] = useState<Payment | null>(null);

  const payments = useMemo(() => {
    if (!dataset) return [];
    const list = tab === "All" ? dataset.payments : dataset.payments.filter((p) => p.status === tab);
    return [...list].sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));
  }, [dataset, tab]);

  if (!dataset) return null;

  const accountName = (id?: string) => dataset.accounts.find((a) => a.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <PageHeader title="Payment activity" subtitle="Scheduled, completed and canceled demo payments" />

      <div role="tablist" aria-label="Filter payments by status" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              tab === t ? "bg-brand-900 text-white" : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-brand-50",
            )}
          >
            {t}
            <span className="ml-1.5 text-xs opacity-70">
              {t === "All" ? dataset.payments.length : dataset.payments.filter((p) => p.status === t).length}
            </span>
          </button>
        ))}
      </div>

      <Card>
        <CardBody className="p-0">
          {payments.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={CalendarX2}
                title={`No ${tab === "All" ? "" : `${tab.toLowerCase()} `}payments`}
                message="Create a transfer or bill payment and it will show up here instantly."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Type</th>
                    <th scope="col" className="px-5 py-3 font-semibold">To</th>
                    <th scope="col" className="px-5 py-3 font-semibold">From</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Amount</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Frequency</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-brand-50/50">
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">{formatDate(p.date)}</td>
                      <td className="px-5 py-3 text-slate-600">{p.kind}</td>
                      <td className="px-5 py-3 font-medium text-slate-800">{p.payeeName}</td>
                      <td className="px-5 py-3 text-slate-600">{accountName(p.fromAccountId)}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-right font-semibold tabular text-slate-800">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{p.frequency}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setDetail(p)}>
                            Details
                          </Button>
                          {p.status === "Scheduled" && (
                            <Button variant="ghost" size="sm" onClick={() => setCanceling(p)}>
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal open={detail !== null} onClose={() => setDetail(null)} title="Payment details" subtitle={detail?.confirmationNumber}>
        {detail && (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ["Type", detail.kind],
              ["Status", detail.status],
              ["To", detail.payeeName],
              ["From", accountName(detail.fromAccountId)],
              ["To account", detail.toAccountId ? accountName(detail.toAccountId) : "—"],
              ["Amount", formatCurrency(detail.amount)],
              ["Date", formatDateLong(detail.date)],
              ["Frequency", detail.frequency],
              ["Memo", detail.memo || "—"],
              ["Confirmation", detail.confirmationNumber],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wider text-slate-400">{label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={canceling !== null}
        onClose={() => setCanceling(null)}
        title="Cancel scheduled payment"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCanceling(null)}>
              Keep payment
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (canceling) {
                  cancelPayment(canceling.id);
                  toast(`Payment to ${canceling.payeeName} canceled.`, "info");
                }
                setCanceling(null);
              }}
            >
              Cancel payment
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Cancel the {formatCurrency(canceling?.amount ?? 0)} payment to{" "}
          <span className="font-semibold">{canceling?.payeeName}</span> scheduled for{" "}
          {canceling ? formatDateLong(canceling.date) : ""}? The scheduled entry will be removed
          from your transaction history.
        </p>
      </Modal>
    </div>
  );
}
