import { Lock, Wifi } from "lucide-react";
import type { CardItem } from "@/types/banking";
import { cn } from "@/lib/utils";

export function CardVisual({ card }: { card: CardItem }) {
  const locked = card.locked;
  return (
    <div
      className={cn(
        "relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl p-5 text-white shadow-pop transition-transform",
        card.accountId.endsWith("-credit")
          ? "bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950"
          : "bg-gradient-to-br from-slate-800 via-slate-900 to-black",
        locked && "grayscale",
      )}
      aria-label={`${card.accountName} ${card.maskedNumber}${locked ? ", locked" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">Bank of America</p>
          <p className="mt-0.5 text-sm font-semibold">{card.accountName}</p>
        </div>
        {locked
          ? <Lock className="h-5 w-5 text-white/80" aria-label="Card locked" />
          : <Wifi className="h-5 w-5 rotate-90 text-white/80" aria-hidden />}
      </div>
      <p className="mt-6 font-mono text-lg tracking-[0.18em]">{card.maskedNumber}</p>
      <div className="mt-4 flex items-end justify-between text-xs">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/60">Card holder</p>
          <p className="font-semibold tracking-wide">{card.holderName}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/60">Expires</p>
          <p className="font-semibold">{card.expiry}</p>
        </div>
        <p className="text-sm font-bold italic tracking-tight">{card.network}</p>
      </div>
      {card.contactless && (
        <Wifi className="absolute right-5 top-16 h-4 w-4 rotate-90 text-white/30" aria-hidden />
      )}
      <p className="absolute bottom-2 right-5 text-[9px] uppercase tracking-widest text-white/40">
        Demo card — not valid
      </p>
    </div>
  );
}
