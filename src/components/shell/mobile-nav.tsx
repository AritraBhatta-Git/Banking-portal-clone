"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { NAV_ITEMS, isActive } from "@/components/shell/primary-nav";
import { useBankingStore } from "@/store/banking-store";
import { useDataset } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const dataset = useDataset();
  const logout = useBankingStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div className="absolute inset-0 bg-brand-950/50 animate-fade-in" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-white shadow-pop">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <span className="flex items-center gap-2">
            <Image src="/logo.png" alt="Bank of America logo" width={34} height={22} />
            <span className="text-sm font-bold text-brand-900">Bank of America</span>
          </span>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Close menu">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto py-2">
          <Link
            href="/dashboard"
            onClick={onClose}
            className={cn(
              "block px-4 py-3 text-sm font-semibold",
              pathname === "/dashboard" ? "bg-brand-50 text-brand-900" : "text-slate-700 hover:bg-slate-50",
            )}
          >
            Dashboard
          </Link>
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block px-4 py-3 text-sm font-semibold",
                  active ? "bg-brand-50 text-brand-900" : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/help"
            onClick={onClose}
            className={cn(
              "block px-4 py-3 text-sm font-semibold",
              pathname === "/help" ? "bg-brand-50 text-brand-900" : "text-slate-700 hover:bg-slate-50",
            )}
          >
            Help & Support
          </Link>
        </nav>
        <div className="border-t border-slate-200 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-800">{dataset?.profile.displayName}</p>
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
              router.push("/login");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-accent-600 hover:bg-accent-50"
          >
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
