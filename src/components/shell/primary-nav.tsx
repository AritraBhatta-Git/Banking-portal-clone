"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/accounts", label: "Accounts" },
  { href: "/payments", label: "Pay & Transfer" },
  { href: "/statements", label: "Statements & Documents" },
  { href: "/spending", label: "Spending & Budgeting" },
  { href: "/cards", label: "Cards" },
  { href: "/alerts", label: "Alerts" },
  { href: "/profile", label: "Profile & Security" },
];

export function isActive(pathname: string, href: string) {
  if (href === "/accounts") {
    return pathname === "/accounts" || pathname.startsWith("/accounts/") || pathname.startsWith("/transactions");
  }
  if (href === "/profile") {
    return pathname.startsWith("/profile") || pathname.startsWith("/security");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PrimaryNav({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className={cn("border-b border-slate-200 bg-white", className)}>
      <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block border-b-2 px-3 py-3 text-sm font-semibold whitespace-nowrap transition-colors",
                  active
                    ? "border-brand-900 text-brand-900"
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-brand-800",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
