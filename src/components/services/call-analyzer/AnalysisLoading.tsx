"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const PHASE_MS = 700;
const HOLD_MS = 200;
const BARS = [
  { delay: "0s", duration: "0.92s" },
  { delay: "0.14s", duration: "1.18s" },
  { delay: "0.05s", duration: "0.84s" },
  { delay: "0.22s", duration: "1.28s" },
  { delay: "0.08s", duration: "0.98s" },
  { delay: "0.18s", duration: "1.12s" },
  { delay: "0.03s", duration: "0.88s" },
  { delay: "0.26s", duration: "1.22s" },
  { delay: "0.11s", duration: "1.02s" },
  { delay: "0.2s", duration: "1.3s" },
  { delay: "0.06s", duration: "0.9s" },
  { delay: "0.16s", duration: "1.08s" },
  { delay: "0.01s", duration: "0.96s" },
];

export function AnalysisLoading({ onComplete }: { onComplete: () => void }) {
  const { copy } = useI18n();
  const steps = copy.auditor.steps;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timers = steps.map((_, index) =>
      window.setTimeout(() => setActive(index), index * PHASE_MS),
    );
    const markDone = window.setTimeout(() => setActive(steps.length), steps.length * PHASE_MS);
    const done = window.setTimeout(onComplete, steps.length * PHASE_MS + HOLD_MS);
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(markDone);
      window.clearTimeout(done);
    };
  }, [onComplete, steps]);

  return (
    <div className="mt-6">
      <div className="flex h-24 items-center justify-center gap-1.5" aria-hidden="true">
        {BARS.map((bar) => (
          <span
            key={bar.delay}
            className="call-wave-bar h-16 w-1.5 rounded-full bg-gradient-to-t from-[#2563EB] via-[#22D3EE] to-[#8B5CF6] shadow-[0_0_14px_rgba(139,92,246,0.75)]"
            style={{ animationDelay: bar.delay, animationDuration: bar.duration }}
          />
        ))}
      </div>
      <ol className="mt-6 space-y-2" aria-live="polite">
        {steps.map((label, index) => {
          const done = index < active;
          const current = index === active;
          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                current && "bg-[#8B5CF6]/10 ring-1 ring-[#6366F1]/40",
                !current && !done && "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border text-[11px] transition",
                  done && "border-[#22D3EE] bg-[#2563EB] text-white",
                  current && "border-[#8B5CF6] text-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.65)]",
                  !done && !current && "border-foreground/15",
                )}
              >
                {done ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span>{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
