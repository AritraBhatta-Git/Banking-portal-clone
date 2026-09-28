"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { authenticate, readRememberedId, writeRememberedId } from "@/lib/auth";
import { useBankingStore } from "@/store/banking-store";
import { useCurrentUserId, useHydrated } from "@/store/hooks";
import { Button } from "@/components/common/button";
import { Checkbox, Field, TextInput } from "@/components/common/field";
import { Modal } from "@/components/common/modal";
import { FullPageSkeleton } from "@/components/common/skeleton";

type InfoModal = "forgot-id" | "forgot-pass" | "enroll" | null;

export default function LoginPage() {
  const hydrated = useHydrated();
  const currentUserId = useCurrentUserId();
  const login = useBankingStore((s) => s.login);
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState<InfoModal>(null);

  useEffect(() => {
    if (hydrated && currentUserId) router.replace("/dashboard");
  }, [hydrated, currentUserId, router]);

  useEffect(() => {
    const remembered = readRememberedId();
    if (remembered) {
      setUserId(remembered);
      setRemember(true);
    }
  }, []);

  if (!hydrated) return <FullPageSkeleton />;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = authenticate(userId, password);
    if (!result.ok) {
      setError(result.error ?? "Sign in failed.");
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      writeRememberedId(remember ? userId.trim() : null);
      login(userId.trim());
      router.push("/dashboard");
    }, 450);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <span className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Bank of America logo" width={44} height={29} priority />
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-brand-900">Bank of America</span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Online Banking
              </span>
            </span>
          </span>
          <nav aria-label="Login help" className="flex items-center gap-4 text-sm font-medium text-brand-800">
            <button type="button" onClick={() => setInfo("enroll")} className="hover:underline max-sm:hidden">
              Not enrolled?
            </button>
            <Link href="/help" className="hover:underline">
              Help &amp; Support
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-16">
        {/* Left marketing column */}
        <section className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800 ring-1 ring-inset ring-brand-200">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Demonstration environment
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">
            Welcome to Bank of America Online Banking
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Securely manage your accounts, make payments, and monitor your finances —
            all from one place. This is a frontend-only demonstration with fictional data.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              ["Accounts at a glance", "Checking, savings and credit cards with real-time demo balances."],
              ["Pay & transfer", "Simulated internal transfers and bill pay with confirmations."],
              ["Insights & controls", "Spending breakdowns, budgets, card locks and alerts."],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-900 text-white">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-800">{title}</span>
                  <span className="block text-sm text-slate-500">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Right sign-in card */}
        <section className="w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-semibold text-brand-950">Sign in to Online Banking</h2>
            <p className="mt-1 text-sm text-slate-500">Enter your User ID and Passcode to continue.</p>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-md border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
              <Field label="User ID" htmlFor="user-id">
                <TextInput
                  id="user-id"
                  name="userid"
                  autoComplete="username"
                  placeholder="Enter your User ID"
                  value={userId}
                  invalid={Boolean(error)}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </Field>
              <Field label="Passcode" htmlFor="password">
                <div className="relative">
                  <TextInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your passcode"
                    className="pr-10"
                    value={password}
                    invalid={Boolean(error)}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide passcode" : "Show passcode"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                  </button>
                </div>
              </Field>
              <div className="flex items-center justify-between">
                <Checkbox id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} label="Remember User ID" />
                <button
                  type="button"
                  onClick={() => setInfo("forgot-pass")}
                  className="text-sm font-medium text-brand-800 hover:underline"
                >
                  Forgot passcode?
                </button>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Signing in…" : "Sign in"}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => setInfo("forgot-id")} className="font-medium text-brand-800 hover:underline">
                  Forgot User ID?
                </button>
                <button type="button" onClick={() => setInfo("enroll")} className="font-medium text-brand-800 hover:underline">
                  Not enrolled?
                </button>
              </div>
            </form>

            <p className="mt-4 flex items-start gap-2 text-xs text-slate-500">
              <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              This prototype never contacts a real bank and never collects real credentials.
              Authentication is simulated entirely in your browser.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Bank of America — frontend demonstration only. Not a real bank.</p>
          <nav aria-label="Legal" className="flex gap-4">
            <Link href="/help" className="hover:text-brand-800 hover:underline">Privacy</Link>
            <Link href="/help" className="hover:text-brand-800 hover:underline">Security</Link>
            <Link href="/help" className="hover:text-brand-800 hover:underline">Terms</Link>
            <Link href="/help" className="hover:text-brand-800 hover:underline">Accessibility</Link>
            <Link href="/help" className="hover:text-brand-800 hover:underline">Help</Link>
          </nav>
        </div>
      </footer>

      {/* Help modals — no credentials displayed */}
      <Modal open={info === "forgot-id"} onClose={() => setInfo(null)} title="Forgot User ID">
        <p className="text-sm leading-relaxed text-slate-600">
          If you have forgotten your User ID, please contact customer support or visit your nearest
          branch with a valid photo ID. In this demonstration, User IDs are case-sensitive — make
          sure caps lock is off before trying again.
        </p>
      </Modal>
      <Modal open={info === "forgot-pass"} onClose={() => setInfo(null)} title="Forgot passcode">
        <p className="text-sm leading-relaxed text-slate-600">
          To reset your passcode, you will need to verify your identity through our secure
          identity verification process. For this demonstration, please use the passcode provided
          to you when your demo account was set up.
        </p>
      </Modal>
      <Modal open={info === "enroll"} onClose={() => setInfo(null)} title="Enroll in Online Banking">
        <p className="text-sm leading-relaxed text-slate-600">
          To enroll in Online Banking, you will need your Bank of America account number and
          Social Security Number. This demonstration environment does not support new enrollment —
          please use the credentials provided with your demo account.
        </p>
      </Modal>
    </div>
  );
}
