"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useDataset } from "@/store/hooks";
import { useBankingStore } from "@/store/banking-store";
import { useToast } from "@/components/common/toast";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/common/card";
import { Button, buttonClasses } from "@/components/common/button";
import { Field, SelectInput, TextInput } from "@/components/common/field";

interface ProfileForm {
  displayName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  preferredContact: "Email" | "Phone" | "Mail";
}

export default function ProfilePage() {
  const dataset = useDataset();
  const updateProfile = useBankingStore((s) => s.updateProfile);
  const { toast } = useToast();

  const [form, setForm] = useState<ProfileForm | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (dataset && !form) {
      const p = dataset.profile;
      setForm({
        displayName: p.displayName,
        email: p.email,
        phone: p.phone,
        addressLine1: p.addressLine1,
        addressLine2: p.addressLine2,
        city: p.city,
        state: p.state,
        zip: p.zip,
        preferredContact: p.preferredContact,
      });
    }
  }, [dataset, form]);

  if (!dataset || !form) return null;

  const set = (patch: Partial<ProfileForm>) => setForm((f) => (f ? { ...f, ...patch } : f));

  const save = () => {
    const next: Record<string, string> = {};
    if (!form.displayName.trim()) next.displayName = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!form.phone.trim()) next.phone = "Enter a phone number.";
    if (!form.addressLine1.trim()) next.addressLine1 = "Enter a street address.";
    if (!form.city.trim()) next.city = "Enter a city.";
    if (!form.state.trim()) next.state = "Enter a state.";
    if (!/^\d{5}(-\d{4})?$/.test(form.zip.trim())) next.zip = "Enter a 5-digit ZIP code.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    updateProfile({ ...form, displayName: form.displayName.trim() });
    toast("Profile updated for this demo session.");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Profile"
        subtitle="Your demo contact information and preferences"
        actions={
          <Link href="/security" className={buttonClasses("secondary", "md")}>
            <ShieldCheck className="h-4 w-4" aria-hidden /> Security settings
          </Link>
        }
      />

      <Card>
        <CardHeader title="Contact information" subtitle="Changes persist in your browser for this demo session" />
        <CardBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="p-name" error={errors.displayName}>
              <TextInput id="p-name" value={form.displayName} invalid={Boolean(errors.displayName)} onChange={(e) => set({ displayName: e.target.value })} />
            </Field>
            <Field label="User ID" htmlFor="p-userid" hint="User IDs are fixed in this demo">
              <TextInput id="p-userid" value={dataset.profile.userId} disabled readOnly />
            </Field>
            <Field label="Email" htmlFor="p-email" error={errors.email}>
              <TextInput id="p-email" type="email" value={form.email} invalid={Boolean(errors.email)} onChange={(e) => set({ email: e.target.value })} />
            </Field>
            <Field label="Phone" htmlFor="p-phone" error={errors.phone}>
              <TextInput id="p-phone" type="tel" value={form.phone} invalid={Boolean(errors.phone)} onChange={(e) => set({ phone: e.target.value })} />
            </Field>
          </div>
          <Field label="Address line 1" htmlFor="p-addr1" error={errors.addressLine1}>
            <TextInput id="p-addr1" value={form.addressLine1} invalid={Boolean(errors.addressLine1)} onChange={(e) => set({ addressLine1: e.target.value })} />
          </Field>
          <Field label="Address line 2" htmlFor="p-addr2" optional>
            <TextInput id="p-addr2" value={form.addressLine2} onChange={(e) => set({ addressLine2: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City" htmlFor="p-city" error={errors.city}>
              <TextInput id="p-city" value={form.city} invalid={Boolean(errors.city)} onChange={(e) => set({ city: e.target.value })} />
            </Field>
            <Field label="State" htmlFor="p-state" error={errors.state}>
              <TextInput id="p-state" value={form.state} invalid={Boolean(errors.state)} onChange={(e) => set({ state: e.target.value })} />
            </Field>
            <Field label="ZIP" htmlFor="p-zip" error={errors.zip}>
              <TextInput id="p-zip" value={form.zip} invalid={Boolean(errors.zip)} onChange={(e) => set({ zip: e.target.value })} />
            </Field>
          </div>
          <Field label="Preferred contact method" htmlFor="p-contact">
            <SelectInput id="p-contact" value={form.preferredContact} onChange={(e) => set({ preferredContact: e.target.value as ProfileForm["preferredContact"] })}>
              <option>Email</option>
              <option>Phone</option>
              <option>Mail</option>
            </SelectInput>
          </Field>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                const p = dataset.profile;
                setForm({
                  displayName: p.displayName,
                  email: p.email,
                  phone: p.phone,
                  addressLine1: p.addressLine1,
                  addressLine2: p.addressLine2,
                  city: p.city,
                  state: p.state,
                  zip: p.zip,
                  preferredContact: p.preferredContact,
                });
                setErrors({});
                toast("Changes discarded.", "info");
              }}
            >
              Discard changes
            </Button>
            <Button onClick={save}>Save profile</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Membership" />
        <CardBody>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400">Account holder</dt>
              <dd className="mt-0.5 text-sm font-semibold text-slate-800">{dataset.profile.displayName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400">Member since</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-800">{dataset.profile.memberSince}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400">User ID</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-800">{dataset.profile.userId}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400">Accounts</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-800">{dataset.accounts.length} open</dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}
