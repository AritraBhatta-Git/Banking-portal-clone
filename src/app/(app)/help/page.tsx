"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ChevronDown, LifeBuoy, Search, Send, ShieldCheck } from "lucide-react";
import { useDataset } from "@/store/hooks";
import { useToast } from "@/components/common/toast";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/common/card";
import { Button, buttonClasses } from "@/components/common/button";
import { Field, SelectInput, TextArea, TextInput } from "@/components/common/field";
import { EmptyState } from "@/components/common/empty-state";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Is this a real bank?",
    a: "No. Bank of America Online Banking (this demo) is a frontend prototype. Every account, balance, transaction, payee and statement is fictional, and nothing you do here can move real money or contact a real financial institution.",
  },
  {
    q: "How do I transfer money between my accounts?",
    a: "Open Pay & Transfer → Transfer money, choose the from and to accounts, enter an amount and date, review the details and confirm. Immediate transfers update your demo balances right away; future-dated ones appear under Scheduled payments.",
  },
  {
    q: "How do I pay a bill?",
    a: "Open Pay & Transfer → Pay bills, pick a payee (or add a new one), enter the amount and delivery date, then review and confirm. You can cancel a scheduled payment from Payment activity at any time.",
  },
  {
    q: "Where are my statements?",
    a: "Statements & Documents lists six months of demo statements per account. Use View for an on-screen preview or Download for a plain-text summary you can keep.",
  },
  {
    q: "What happens when I lock a card?",
    a: "Locking is simulated: the card switches to a Locked state, the card visual grays out, and a security alert is added to your inbox. Unlock it any time from the Cards page.",
  },
  {
    q: "Can I change my sign-in passcode?",
    a: "The demo sign-in passcode is specific to each profile. The Security page simulates a passcode change and records it in your session audit trail.",
  },
  {
    q: "How do I reset the demo data?",
    a: "Clearing this site’s local storage in your browser resets every balance, transaction and setting back to the original seeded demo data.",
  },
  {
    q: "Why do some transactions show as Pending?",
    a: "Pending items reduce your available balance but not your current balance, exactly like a real ledger. They are fictional holds included to demonstrate the difference.",
  },
];

const TOPICS = [
  { label: "Transfers & payments", href: "/payments" },
  { label: "Account details", href: "/accounts" },
  { label: "Statements & documents", href: "/statements" },
  { label: "Cards & locking", href: "/cards" },
  { label: "Alerts & notifications", href: "/alerts" },
  { label: "Security center", href: "/security" },
];

export default function HelpPage() {
  const dataset = useDataset();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [topic, setTopic] = useState(TOPICS[0].label);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [sent, setSent] = useState(false);

  const faqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q));
  }, [query]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 10) {
      setMessageError("Tell us a little more — at least 10 characters.");
      return;
    }
    setMessageError("");
    setSent(true);
    toast("Support request recorded in the demo.");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Help & Support" subtitle="Answers, topics and a simulated support desk" />

      <Card>
        <CardBody className="p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <TextInput
              aria-label="Search help articles"
              className="h-11 pl-9"
              placeholder="Search help — try “lock”, “statement”, “transfer”…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <Link
                key={t.label}
                href={t.href}
                className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-800 ring-1 ring-inset ring-brand-200 hover:bg-brand-100"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Frequently asked questions" subtitle={`${faqs.length} article${faqs.length === 1 ? "" : "s"}`} />
          <CardBody className="p-0">
            {faqs.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="No matching articles"
                  message={`Nothing in the demo help center matches “${query}”. Try a different word or contact the simulated support desk.`}
                  action={
                    <Button variant="secondary" size="sm" onClick={() => setQuery("")}>
                      Clear search
                    </Button>
                  }
                />
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {faqs.map((f, i) => {
                  const open = openFaq === i;
                  return (
                    <li key={f.q}>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : i)}
                        aria-expanded={open}
                        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-brand-50/60"
                      >
                        <span className="text-sm font-semibold text-slate-800">{f.q}</span>
                        <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")} aria-hidden />
                      </button>
                      {open && <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{f.a}</p>}
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Contact support" subtitle="Simulated — nothing is sent anywhere" />
            <CardBody>
              {sent ? (
                <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
                  <p className="font-semibold">Request received</p>
                  <p className="mt-1">
                    A demo specialist will “reply” instantly: everything you need lives in this
                    prototype. Reference BOA-HELP-{dataset?.profile.userId.slice(-4).toUpperCase()}.
                  </p>
                  <Button variant="secondary" size="sm" className="mt-3" onClick={() => { setSent(false); setMessage(""); }}>
                    Send another request
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4" noValidate>
                  <Field label="Topic" htmlFor="help-topic">
                    <SelectInput id="help-topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
                      {TOPICS.map((t) => (
                        <option key={t.label}>{t.label}</option>
                      ))}
                      <option>Something else</option>
                    </SelectInput>
                  </Field>
                  <Field label="How can we help?" htmlFor="help-message" error={messageError}>
                    <TextArea
                      id="help-message"
                      rows={4}
                      value={message}
                      invalid={Boolean(messageError)}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your question about the demo portal…"
                    />
                  </Field>
                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4" aria-hidden /> Submit request
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-5">
              <ShieldCheck className="h-6 w-6 text-brand-700" aria-hidden />
              <p className="mt-2 text-sm font-semibold text-slate-800">Security center</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Review sign-in activity, manage trusted devices and control two-step
                verification from the security page.
              </p>
              <Link href="/security" className={buttonClasses("secondary", "sm", "mt-3")}>
                Open security center
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-5">
              <LifeBuoy className="h-6 w-6 text-brand-700" aria-hidden />
              <p className="mt-2 text-sm font-semibold text-slate-800">Demo ground rules</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-500">
                <li>Never enter real banking credentials here.</li>
                <li>All merchants and payees are fictional.</li>
                <li>Data lives only in your browser.</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
