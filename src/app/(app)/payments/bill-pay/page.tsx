"use client";

import { Suspense, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Payee } from "@/types/banking";
import { useDataset } from "@/store/hooks";
import { useBankingStore } from "@/store/banking-store";
import { useToast } from "@/components/common/toast";
import { PaymentFlow } from "@/components/payments/payment-flow";
import { PayeeModal } from "@/components/payments/payee-modal";
import { Card, CardBody, CardHeader } from "@/components/common/card";
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { EmptyState } from "@/components/common/empty-state";
import { FullPageSkeleton } from "@/components/common/skeleton";

function BillPayInner() {
  const dataset = useDataset();
  const deletePayee = useBankingStore((s) => s.deletePayee);
  const { toast } = useToast();
  const [editing, setEditing] = useState<Payee | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<Payee | null>(null);

  if (!dataset) return null;

  return (
    <div className="space-y-8">
      <PaymentFlow mode="billpay" />

      <Card>
        <CardHeader
          title="Your payees"
          subtitle="Companies you can pay in this demo"
          action={
            <Button variant="secondary" size="sm" onClick={() => setAdding(true)}>
              <Plus className="h-4 w-4" aria-hidden /> Add payee
            </Button>
          }
        />
        <CardBody className="p-0">
          {dataset.payees.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No payees yet"
                message="Add a fictional company to start scheduling bill payments."
                action={
                  <Button size="sm" onClick={() => setAdding(true)}>
                    <Plus className="h-4 w-4" aria-hidden /> Add your first payee
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <th scope="col" className="px-5 py-3 font-semibold">Payee</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Account</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Category</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Address</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataset.payees.map((p) => (
                    <tr key={p.id} className="hover:bg-brand-50/50">
                      <td className="px-5 py-3">
                        <span className="block font-medium text-slate-800">{p.name}</span>
                        <span className="text-xs text-slate-500">{p.email || "—"}</span>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{p.maskedAccount}</td>
                      <td className="px-5 py-3 text-slate-600">{p.category}</td>
                      <td className="max-w-56 truncate px-5 py-3 text-slate-600">{p.address}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}>
                            <Pencil className="h-4 w-4" aria-hidden /> Edit
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleting(p)} aria-label={`Delete ${p.name}`}>
                            <Trash2 className="h-4 w-4 text-accent-600" aria-hidden /> Delete
                          </Button>
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

      <PayeeModal open={adding} onClose={() => setAdding(false)} />
      <PayeeModal open={editing !== null} onClose={() => setEditing(null)} existing={editing} />

      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Delete payee"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>
              Keep payee
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleting) {
                  deletePayee(deleting.id);
                  toast(`Payee “${deleting.name}” removed.`, "info");
                }
                setDeleting(null);
              }}
            >
              Delete payee
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Remove <span className="font-semibold">{deleting?.name}</span> from your demo payees?
          Scheduled payments already created will remain in your payment activity.
        </p>
      </Modal>
    </div>
  );
}

export default function BillPayPage() {
  return (
    <Suspense fallback={<FullPageSkeleton />}>
      <BillPayInner />
    </Suspense>
  );
}
