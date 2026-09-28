"use client";

import { useEffect, useState } from "react";
import type { Payee } from "@/types/banking";
import { useBankingStore } from "@/store/banking-store";
import { useToast } from "@/components/common/toast";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/common/button";
import { Field, SelectInput, TextInput } from "@/components/common/field";

const CATEGORIES = ["Utilities", "Rent", "Insurance", "Phone", "Internet", "Other"];

interface Props {
  open: boolean;
  onClose: () => void;
  existing?: Payee | null;
}

export function PayeeModal({ open, onClose, existing }: Props) {
  const addPayee = useBankingStore((s) => s.addPayee);
  const updatePayee = useBankingStore((s) => s.updatePayee);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [maskedAccount, setMaskedAccount] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setName(existing?.name ?? "");
    setMaskedAccount(existing?.maskedAccount ?? "");
    setAddress(existing?.address ?? "");
    setCategory(existing?.category ?? CATEGORIES[0]);
    setEmail(existing?.email ?? "");
    setErrors({});
  }, [open, existing]);

  const submit = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Enter the payee name.";
    if (!maskedAccount.trim()) next.maskedAccount = "Enter the account or policy number as shown on the bill.";
    if (!address.trim()) next.address = "Enter the payee address.";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const payload = {
      name: name.trim(),
      maskedAccount: maskedAccount.trim(),
      address: address.trim(),
      category,
      email: email.trim(),
    };
    if (existing) {
      updatePayee(existing.id, payload);
      toast(`Payee “${payload.name}” updated.`);
    } else {
      addPayee(payload);
      toast(`Payee “${payload.name}” added to your demo payees.`);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={existing ? "Edit payee" : "Add a payee"}
      subtitle="Fictional companies only — this is a simulation."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>{existing ? "Save changes" : "Add payee"}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Payee name" htmlFor="payee-name" error={errors.name}>
          <TextInput id="payee-name" value={name} invalid={Boolean(errors.name)} onChange={(e) => setName(e.target.value)} placeholder="e.g. Northstar Electric" />
        </Field>
        <Field label="Account number" htmlFor="payee-account" error={errors.maskedAccount} hint="Stored masked in this demo, e.g. •••• 4410">
          <TextInput id="payee-account" value={maskedAccount} invalid={Boolean(errors.maskedAccount)} onChange={(e) => setMaskedAccount(e.target.value)} placeholder="•••• 4410" />
        </Field>
        <Field label="Address" htmlFor="payee-address" error={errors.address}>
          <TextInput id="payee-address" value={address} invalid={Boolean(errors.address)} onChange={(e) => setAddress(e.target.value)} placeholder="PO Box 100, Springfield, ST 00000" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" htmlFor="payee-category">
            <SelectInput id="payee-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Email" htmlFor="payee-email" optional error={errors.email}>
            <TextInput id="payee-email" type="email" value={email} invalid={Boolean(errors.email)} onChange={(e) => setEmail(e.target.value)} placeholder="billing@example.demo" />
          </Field>
        </div>
      </div>
    </Modal>
  );
}
