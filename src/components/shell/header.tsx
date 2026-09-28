"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CircleHelp,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useBankingStore } from "@/store/banking-store";
import { useDataset, useUnreadAlertCount } from "@/store/hooks";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
}

export function Header({ onOpenSearch, onOpenMobileNav }: HeaderProps) {
  const dataset = useDataset();
  const unread = useUnreadAlertCount();
  const logout = useBankingStore((s) => s.logout);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const initials = dataset
    ? dataset.profile.displayName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
    : "";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-card backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="rounded-md p-2 text-brand-900 hover:bg-brand-50 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" aria-hidden />
        </button>

        <Link href="/dashboard" className="flex items-center gap-2.5" aria-label="Bank of America home">
          <Image src="/logo.png" alt="Bank of America logo" width={40} height={26} priority />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-base font-bold tracking-tight text-brand-900">
              Bank of America
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Online Banking
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-500 transition-colors hover:border-brand-400 hover:text-brand-800 max-md:hidden"
            aria-label="Search transactions, accounts and help"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="w-32 text-left">Search demo data</span>
          </button>
          <button
            type="button"
            onClick={onOpenSearch}
            className="rounded-md p-2 text-brand-900 hover:bg-brand-50 md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" aria-hidden />
          </button>

          <Link
            href="/alerts"
            className="relative rounded-md p-2 text-brand-900 hover:bg-brand-50"
            aria-label={unread > 0 ? `Alerts, ${unread} unread` : "Alerts"}
          >
            <Bell className="h-5 w-5" aria-hidden />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>

          <Link
            href="/help"
            className="rounded-md p-2 text-brand-900 hover:bg-brand-50 max-sm:hidden"
            aria-label="Help and support"
          >
            <CircleHelp className="h-5 w-5" aria-hidden />
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-brand-900 hover:bg-brand-50",
                menuOpen && "bg-brand-50",
              )}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-900 text-xs font-bold text-white">
                {initials || <UserRound className="h-4 w-4" aria-hidden />}
              </span>
              <span className="hidden max-w-28 truncate md:inline">
                {dataset?.profile.firstName ?? "Profile"}
              </span>
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-pop animate-rise"
              >
                <div className="border-b border-slate-100 px-4 py-2">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {dataset?.profile.displayName}
                  </p>
                  <p className="truncate text-xs text-slate-500">{dataset?.profile.email}</p>
                </div>
                <Link
                  role="menuitem"
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50"
                >
                  <UserRound className="h-4 w-4" aria-hidden /> Profile
                </Link>
                <Link
                  role="menuitem"
                  href="/security"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden /> Security
                </Link>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                    router.push("/login");
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-accent-600 hover:bg-accent-50"
                >
                  <LogOut className="h-4 w-4" aria-hidden /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
