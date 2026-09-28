"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUserId, useHydrated } from "@/store/hooks";
import { FullPageSkeleton } from "@/components/common/skeleton";

export default function HomePage() {
  const hydrated = useHydrated();
  const currentUserId = useCurrentUserId();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    router.replace(currentUserId ? "/dashboard" : "/login");
  }, [hydrated, currentUserId, router]);

  return <FullPageSkeleton />;
}
