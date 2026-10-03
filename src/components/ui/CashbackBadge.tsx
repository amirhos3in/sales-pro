"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function persianDigits(value: string) {
  return value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

export function formatPrice(amount: number, lang: "fa" | "en" = "fa") {
  const grouped = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return lang === "fa" ? persianDigits(grouped) : grouped;
}

export function CashbackBadge({ amount, className }: { amount: number; className?: string }) {
  const { copy, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const tipId = useId();
  const label = `+ ${formatPrice(amount, lang)} ${copy.dash.cashbackGift}`;

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  if (amount <= 0) return null;

  return (
    <span
      ref={rootRef}
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 shadow-[0_0_12px_rgba(212,175,55,0.15)] dark:text-amber-200"
        style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        aria-describedby={open ? tipId : undefined}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Sparkles className="size-3.5 animate-pulse text-[#D4AF37] drop-shadow-[0_0_6px_rgba(212,175,55,0.9)]" />
        {label}
      </button>
      {open ? (
        <span
          id={tipId}
          role="tooltip"
          className="absolute start-0 top-full z-30 mt-2 w-64 rounded-2xl border border-[#D4AF37]/45 bg-[#0F1C3F]/95 p-3 text-xs leading-6 text-[#F6F1E4] shadow-2xl backdrop-blur-xl"
          style={{
            backgroundColor: "rgba(15, 28, 63, 0.95)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {copy.dash.cashbackTip}
        </span>
      ) : null}
    </span>
  );
}
