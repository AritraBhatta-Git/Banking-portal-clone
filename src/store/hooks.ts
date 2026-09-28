"use client";

import { useEffect, useState } from "react";
import { useBankingStore } from "@/store/banking-store";
import type { UserDataset } from "@/types/banking";

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(useBankingStore.persist.hasHydrated());
    const unsubscribe = useBankingStore.persist.onFinishHydration(() => setHydrated(true));
    return unsubscribe;
  }, []);
  return hydrated;
}

export function useCurrentUserId() {
  return useBankingStore((s) => s.currentUserId);
}

export function useDataset(): UserDataset | null {
  return useBankingStore((s) =>
    s.currentUserId ? (s.datasets[s.currentUserId] ?? null) : null,
  );
}

export function useUnreadAlertCount() {
  return useBankingStore((s) => {
    const d = s.currentUserId ? s.datasets[s.currentUserId] : null;
    if (!d) return 0;
    return d.alerts.filter((a) => !a.read).length;
  });
}
