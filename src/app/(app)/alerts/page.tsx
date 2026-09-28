"use client";

import { useMemo, useState } from "react";
import { BellOff, CheckCheck, MailOpen } from "lucide-react";
import type { AlertCategory } from "@/types/banking";
import { useDataset } from "@/store/hooks";
import { useBankingStore } from "@/store/banking-store";
import { useToast } from "@/components/common/toast";
import { Card, CardBody, PageHeader } from "@/components/common/card";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/common/badge";
import { EmptyState } from "@/components/common/empty-state";
import { Checkbox } from "@/components/common/field";
import { formatRelativeDay, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<"All" | AlertCategory> = ["All", "Security", "Transaction", "Payment", "Account", "General"];

export default function AlertsPage() {
  const dataset = useDataset();
  const markAlertRead = useBankingStore((s) => s.markAlertRead);
  const markAllAlertsRead = useBankingStore((s) => s.markAllAlertsRead);
  const { toast } = useToast();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const alerts = useMemo(() => {
    if (!dataset) return [];
    return dataset.alerts
      .filter((a) => (category === "All" ? true : a.category === category))
      .filter((a) => (unreadOnly ? !a.read : true))
      .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));
  }, [dataset, category, unreadOnly]);

  if (!dataset) return null;

  const unreadTotal = dataset.alerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        subtitle={unreadTotal > 0 ? `${unreadTotal} unread notification${unreadTotal === 1 ? "" : "s"}` : "You’re all caught up"}
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              markAllAlertsRead();
              toast("All alerts marked as read.");
            }}
            disabled={unreadTotal === 0}
          >
            <CheckCheck className="h-4 w-4" aria-hidden /> Mark all as read
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              category === c ? "bg-brand-900 text-white" : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-brand-50",
            )}
          >
            {c}
          </button>
        ))}
        <Checkbox
          id="unread-only"
          className="ml-auto"
          checked={unreadOnly}
          onChange={(e) => setUnreadOnly(e.target.checked)}
          label="Unread only"
        />
      </div>

      {alerts.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="No alerts here"
          message={unreadOnly ? "Nothing unread in this category." : "This category has no alerts right now."}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCategory("All");
                setUnreadOnly(false);
              }}
            >
              Show everything
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {alerts.map((a) => {
            const open = openId === a.id;
            return (
              <li key={a.id}>
                <Card className={cn(!a.read && "border-brand-300 ring-1 ring-brand-100")}>
                  <CardBody className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenId(open ? null : a.id);
                          if (!a.read) markAlertRead(a.id, true);
                        }}
                        aria-expanded={open}
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="flex flex-wrap items-center gap-2">
                          {!a.read && <span className="h-2 w-2 rounded-full bg-accent-500" aria-label="Unread" />}
                          <span className="text-sm font-semibold text-slate-800">{a.title}</span>
                          <Badge tone={a.severity === "critical" ? "red" : a.severity === "warning" ? "amber" : "navy"}>
                            {a.category}
                          </Badge>
                        </span>
                        <span className={cn("mt-1 block text-sm text-slate-600", !open && "line-clamp-1")}>{a.message}</span>
                      </button>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span className="text-xs text-slate-400" title={formatDate(a.date)}>
                          {formatRelativeDay(a.date)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            markAlertRead(a.id, !a.read);
                            toast(a.read ? "Alert marked as unread." : "Alert marked as read.", "info");
                          }}
                        >
                          <MailOpen className="h-4 w-4" aria-hidden /> Mark {a.read ? "unread" : "read"}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
