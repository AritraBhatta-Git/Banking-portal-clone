"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  CalendarClock,
  CreditCard,
  Globe2,
  ReceiptText,
  Send,
  Users,
} from "lucide-react";
import { useDataset } from "@/store/hooks";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/common/card";
import { Button, buttonClasses } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { StatusBadge } from "@/components/common/badge";
import { formatCurrency, formatDate } from "@/lib/formatters";

const HUB = [
  {
    href: "/payments/transfers",
    title: "Transfer money",
    body: "Move funds between your demo accounts, one time or on a schedule.",
    icon: ArrowLeftRight,
  },
  {
    href: "/payments/bill-pay",
    title: "Pay bills",
    body: "Pay fictional companies and manage your demo payee list.",
    icon: ReceiptText,
  },
  {
    href: "/payments/activity",
    title: "Payment activity",
    body: "Every scheduled, completed and canceled payment in one ledger.",
    icon: CalendarClock,
  },
  {
    href: "/payments/bill-pay",
    title: "Manage payees",
    body: "Add, edit or remove the companies you pay in this demo.",
    icon: Users,
  },
];

export default function PaymentsPage() {
  const dataset = useDataset();
  const [demoModal, setDemoModal] = useState<"send" | "wire" | null>(null);
  if (!dataset) return null;

  const scheduled = dataset.payments.filter((p) => p.status === "Scheduled");
  const scheduledTotal = scheduled.reduce((sum, p) => sum + p.amount, 0);
  const completed = dataset.payments.filter((p) => p.status === "Completed");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pay & Transfer"
        subtitle="Simulated money movement — nothing leaves your browser"
        actions={
          <Link href="/payments/transfers" className={buttonClasses("primary", "md")}>
            <ArrowLeftRight className="h-4 w-4" aria-hidden /> New transfer
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Scheduled payments</p>
            <p className="mt-1.5 text-2xl font-bold tabular text-brand-950">{scheduled.length}</p>
            <p className="mt-1 text-xs text-slate-500">{formatCurrency(scheduledTotal)} upcoming</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Completed payments</p>
            <p className="mt-1.5 text-2xl font-bold tabular text-brand-950">{completed.length}</p>
            <p className="mt-1 text-xs text-slate-500">lifetime in this demo session</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Saved payees</p>
            <p className="mt-1.5 text-2xl font-bold tabular text-brand-950">{dataset.payees.length}</p>
            <p className="mt-1 text-xs text-slate-500">ready for bill pay</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {HUB.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-pop"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-800">
              <item.icon className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-3 text-base font-semibold text-brand-950 group-hover:text-brand-800">{item.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{item.body}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardBody className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-800">
                <Send className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-brand-950">Send money</h2>
                <p className="text-xs text-slate-500">Person-to-person demo simulation</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setDemoModal("send")}>
              Open demo
            </Button>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-800">
                <Globe2 className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-brand-950">Wire transfer</h2>
                <p className="text-xs text-slate-500">Domestic & international demo simulation</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setDemoModal("wire")}>
              Open demo
            </Button>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Next scheduled payments"
          action={
            <Link href="/payments/activity" className="text-sm font-semibold text-brand-700 hover:underline">
              All activity
            </Link>
          }
        />
        <CardBody className="p-0">
          {scheduled.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">Nothing scheduled yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {scheduled
                .sort((a, b) => (a.date < b.date ? -1 : 1))
                .slice(0, 5)
                .map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <span>
                      <span className="block text-sm font-medium text-slate-800">{p.payeeName}</span>
                      <span className="text-xs text-slate-500">
                        {formatDate(p.date)} · {p.kind} · {p.frequency}
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <StatusBadge status={p.status} />
                      <span className="text-sm font-semibold tabular text-slate-800">{formatCurrency(p.amount)}</span>
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Modal
        open={demoModal !== null}
        onClose={() => setDemoModal(null)}
        title={demoModal === "wire" ? "Wire transfer (demo)" : "Send money (demo)"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDemoModal(null)}>
              Close
            </Button>
            <Link href="/payments/transfers" onClick={() => setDemoModal(null)} className={buttonClasses("primary", "md")}>
              Start a demo transfer
            </Link>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-slate-600">
          {demoModal === "wire"
            ? "Real wire transfers move money through banking networks. This prototype has no network connection, so wires are simulated with the same review-and-confirm workflow as an internal transfer. Use the transfer flow to experience it."
            : "Person-to-person sending is simulated in this prototype. The internal transfer flow demonstrates the same scheduling, review and confirmation experience without moving real money."}
        </p>
        <p className="mt-3 flex items-center gap-2 rounded-md bg-brand-50 px-3 py-2 text-xs text-brand-800">
          <CreditCard className="h-4 w-4" aria-hidden /> Everything stays inside your browser’s demo ledger.
        </p>
      </Modal>
    </div>
  );
}
