"use client";

import { Suspense } from "react";
import { PaymentFlow } from "@/components/payments/payment-flow";
import { FullPageSkeleton } from "@/components/common/skeleton";

export default function TransfersPage() {
  return (
    <Suspense fallback={<FullPageSkeleton />}>
      <PaymentFlow mode="transfer" />
    </Suspense>
  );
}
