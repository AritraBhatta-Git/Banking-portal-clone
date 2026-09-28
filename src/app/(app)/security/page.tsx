"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { KeyRound, LogOut, MonitorSmartphone, ShieldCheck, Trash2 } from "lucide-react";
import { DEMO_USERS } from "@/data/users";
import { useDataset, useCurrentUserId } from "@/store/hooks";
import { useBankingStore } from "@/store/banking-store";
import { useToast } from "@/components/common/toast";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/common/card";
import { Button, buttonClasses } from "@/components/common/button";
import { Field, TextInput, Toggle } from "@/components/common/field";
import { Badge, StatusBadge } from "@/components/common/badge";
import { Modal } from "@/components/common/modal";
import { formatDate, formatRelativeDay } from "@/lib/formatters";

export default function SecurityPage() {
  const dataset = useDataset();
  const currentUserId = useCurrentUserId();
  const setTwoStep = useBankingStore((s) => s.setTwoStep);
  const removeTrustedDevice = useBankingStore((s) => s.removeTrustedDevice);
  const logoutAllSessions = useBankingStore((s) => s.logoutAllSessions);
  const recordPasswordChange = useBankingStore((s) => s.recordPasswordChange);
  const pushAlert = useBankingStore((s) => s.pushAlert);
  const { toast } = useToast();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoutOpen, setLogoutOpen] = useState(false);

  if (!dataset) return null;

  const demoPassword = DEMO_USERS.find((u) => u.userId === currentUserId)?.password ?? "";

  const changePassword = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (current !== demoPassword) nextErrors.current = "Current passcode does not match this demo profile.";
    if (next.length < 8) nextErrors.next = "New passcode must be at least 8 characters.";
    if (next === current) nextErrors.next = "New passcode must be different from the current one.";
    if (confirm !== next) nextErrors.confirm = "Passcodes do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    recordPasswordChange();
    pushAlert("Security", "Passcode changed", "Your demo passcode change was recorded in this session. The original sign-in passcode remains active for demo continuity.");
    toast("Passcode change recorded for this demo session.");
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security"
        subtitle="Demo controls that mirror a real banking security center"
        actions={
          <Link href="/profile" className={buttonClasses("secondary", "md")}>
            Back to profile
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-brand-900 text-white">
          <CardBody className="p-5">
            <ShieldCheck className="h-6 w-6 text-brand-200" aria-hidden />
            <p className="mt-2 text-sm font-semibold">Security status</p>
            <p className="mt-1 text-xs text-brand-200">
              {dataset.security.twoStepEnabled
                ? "Two-step verification is on. Good job."
                : "Enable two-step verification to strengthen this demo profile."}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <KeyRound className="h-6 w-6 text-brand-700" aria-hidden />
            <p className="mt-2 text-sm font-semibold text-slate-800">Passcode age</p>
            <p className="mt-1 text-xs text-slate-500">Last changed {formatDate(dataset.security.passwordLastChanged)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <MonitorSmartphone className="h-6 w-6 text-brand-700" aria-hidden />
            <p className="mt-2 text-sm font-semibold text-slate-800">Trusted devices</p>
            <p className="mt-1 text-xs text-slate-500">{dataset.security.trustedDevices.length} device(s) remembered</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Change passcode" subtitle="Simulated — the demo sign-in passcode is unchanged in this session" />
          <CardBody>
            <form onSubmit={changePassword} className="space-y-4" noValidate>
              <Field label="Current passcode" htmlFor="sec-current" error={errors.current}>
                <TextInput id="sec-current" type="password" autoComplete="current-password" value={current} invalid={Boolean(errors.current)} onChange={(e) => setCurrent(e.target.value)} />
              </Field>
              <Field label="New passcode" htmlFor="sec-new" error={errors.next} hint="At least 8 characters">
                <TextInput id="sec-new" type="password" autoComplete="new-password" value={next} invalid={Boolean(errors.next)} onChange={(e) => setNext(e.target.value)} />
              </Field>
              <Field label="Confirm new passcode" htmlFor="sec-confirm" error={errors.confirm}>
                <TextInput id="sec-confirm" type="password" autoComplete="new-password" value={confirm} invalid={Boolean(errors.confirm)} onChange={(e) => setConfirm(e.target.value)} />
              </Field>
              <Button type="submit">Update passcode</Button>
            </form>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Two-step verification" subtitle="Add a simulated second factor at sign-in" />
            <CardBody>
              <Toggle
                id="two-step"
                checked={dataset.security.twoStepEnabled}
                onChange={(v) => {
                  setTwoStep(v);
                  pushAlert("Security", v ? "Two-step verification enabled" : "Two-step verification disabled", v ? "Demo sign-ins will now show a simulated verification step." : "Your demo profile no longer requires a second factor.");
                  toast(v ? "Two-step verification enabled." : "Two-step verification disabled.", v ? "success" : "warning");
                }}
                label="Require a verification code"
                description="Codes are simulated and never sent anywhere"
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Trusted devices"
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setLogoutOpen(true)}
                >
                  <LogOut className="h-4 w-4" aria-hidden /> Log out all sessions
                </Button>
              }
            />
            <CardBody className="p-0">
              <ul className="divide-y divide-slate-100">
                {dataset.security.trustedDevices.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <span>
                      <span className="block text-sm font-medium text-slate-800">{d.name}</span>
                      <span className="text-xs text-slate-500">Last used {formatRelativeDay(d.lastUsed).toLowerCase()}</span>
                    </span>
                    {d.current ? (
                      <Badge tone="green">This device</Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeTrustedDevice(d.id);
                          toast(`${d.name} removed from trusted devices.`, "info");
                        }}
                        aria-label={`Remove ${d.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-accent-600" aria-hidden /> Remove
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Recent sign-in activity" subtitle="Simulated audit trail for this demo profile" />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Device</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Location</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataset.security.recentLogins.map((l) => (
                  <tr key={l.id} className="hover:bg-brand-50/50">
                    <td className="whitespace-nowrap px-5 py-3 text-slate-600">{formatDate(l.date)}</td>
                    <td className="px-5 py-3 text-slate-800">{l.device}</td>
                    <td className="px-5 py-3 text-slate-600">{l.location}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={l.status === "Success" ? "Completed" : "Declined"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Log out all sessions"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setLogoutOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                logoutAllSessions();
                setLogoutOpen(false);
                toast("All other demo sessions were signed out. This session stays active.");
              }}
            >
              Log out other sessions
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          This removes every trusted device except the one you are using now and adds a new
          entry to the sign-in audit trail. Your current session remains signed in.
        </p>
      </Modal>
    </div>
  );
}
