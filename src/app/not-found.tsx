"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { useCurrentUserId, useHydrated } from "@/store/hooks";

export default function NotFound() {
  const hydrated = useHydrated();
  const currentUserId = useCurrentUserId();
  const home = hydrated && currentUserId ? "/dashboard" : "/login";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-800">
        <Compass className="h-7 w-7" aria-hidden />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-400">Error 404</p>
      <h1 className="mt-2 text-3xl font-bold text-brand-950">We can’t find that page</h1>
      <p className="mt-3 max-w-md text-sm text-slate-600">
        The page you requested doesn’t exist in this demo portal. It may have moved, or the
        link may be out of date.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href={home}
          className="inline-flex h-10 items-center rounded-md bg-brand-900 px-5 text-sm font-semibold text-white hover:bg-brand-800"
        >
          {hydrated && currentUserId ? "Back to dashboard" : "Go to sign in"}
        </Link>
        <Link
          href="/help"
          className="inline-flex h-10 items-center rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-brand-900 hover:bg-brand-50"
        >
          Visit Help Center
        </Link>
      </div>
    </main>
  );
}
