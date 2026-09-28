"use client";

import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/common/modal";

const POLICIES: Record<string, { title: string; body: string }> = {
  privacy: {
    title: "Privacy overview",
    body: "Bank of America Online Banking is a frontend prototype. It stores only fictional demo data in your browser's local storage. No personal information is collected, transmitted, or shared, and no real banking credentials should ever be entered here.",
  },
  security: {
    title: "Security overview",
    body: "This prototype demonstrates banking workflows only. Authentication is simulated in the browser with demo credentials and provides no real security. Never reuse real passwords in a demonstration environment.",
  },
  terms: {
    title: "Terms of use",
    body: "This demonstration application is provided as-is for portfolio and evaluation purposes. All accounts, balances, transactions, payees and documents are fictional. No financial services are offered and no money can be moved.",
  },
  accessibility: {
    title: "Accessibility statement",
    body: "The prototype follows accessible markup practices: semantic landmarks, labelled form controls, visible focus states, keyboard-operable menus and modals, and color contrast aligned with WCAG AA guidance.",
  },
};

export function Footer() {
  const [policy, setPolicy] = useState<string | null>(null);
  const active = policy ? POLICIES[policy] : null;

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="text-sm font-bold text-brand-900">Bank of America</p>
            <p className="mt-0.5 text-xs text-slate-400">Online Banking — Demonstration Environment</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Demonstration / prototype only. Not a real financial institution and not
              affiliated with any bank. All accounts, balances, transactions, payees and
              documents shown are fictional. No real money can be moved and no real
              credentials are collected.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-3">
            {(Object.keys(POLICIES) as Array<keyof typeof POLICIES>).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPolicy(key)}
                className="text-left text-slate-600 underline-offset-4 hover:text-brand-800 hover:underline"
              >
                {POLICIES[key].title.replace(" overview", "").replace(" statement", "")}
              </button>
            ))}
            <Link href="/help" className="text-slate-600 underline-offset-4 hover:text-brand-800 hover:underline">
              Help
            </Link>
            <Link href="/help" className="text-slate-600 underline-offset-4 hover:text-brand-800 hover:underline">
              Contact
            </Link>
            <Link href="/security" className="text-slate-600 underline-offset-4 hover:text-brand-800 hover:underline">
              Security center
            </Link>
          </nav>
        </div>
        <p className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} Bank of America — frontend demonstration only. Member FDIC · fictional data only.
        </p>
      </div>

      <Modal open={Boolean(active)} onClose={() => setPolicy(null)} title={active?.title ?? ""}>
        <p className="text-sm leading-relaxed text-slate-600">{active?.body}</p>
      </Modal>
    </footer>
  );
}
