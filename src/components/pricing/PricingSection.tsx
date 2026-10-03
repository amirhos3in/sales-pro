"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CashbackBadge } from "@/components/ui/CashbackBadge";
import { toman } from "@/lib/format";
import { PLAN_RANK, PLANS, type PlanId } from "@/lib/plans";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function PricingSection({ onSelect }: { onSelect: (planId: PlanId) => void }) {
  const { user } = useStore();

  return (
    <div id="pricing-plans" className="grid scroll-mt-24 gap-4 lg:grid-cols-3">
      {PLANS.map((plan) => {
        const cashbackAmount = Math.round(plan.price * 0.05);
        const active = user?.plan === plan.id;
        const ownedHigher = Boolean(user?.plan && PLAN_RANK[user.plan] > PLAN_RANK[plan.id]);
        return (
          <article
            key={plan.id}
            className={cn(
              "flex flex-col rounded-3xl bg-card p-5 ring-1 ring-foreground/10",
              plan.highlight && "ring-2 ring-primary",
              plan.id === "pro" && "bg-[oklch(0.28_0.045_166)] text-[oklch(0.97_0.015_90)]",
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">اشتراک {plan.name}</h2>
              {plan.highlight ? (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] text-primary-foreground">
                  پیشنهاد
                </span>
              ) : null}
            </div>
            <p className={cn("mt-2 min-h-12 text-sm leading-6", plan.id === "pro" ? "text-white/75" : "text-muted-foreground")}>
              {plan.audience}
            </p>
            <div className="mt-4 flex items-end gap-2">
              <span className={cn("text-4xl font-semibold tracking-tight", plan.id === "pro" ? "text-[oklch(0.86_0.09_85)]" : "text-[oklch(0.42_0.1_62)]")}>
                {plan.compact}
              </span>
              <span className="pb-1 text-sm">میلیون تومان</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <p className={cn("text-xs", plan.id === "pro" ? "text-white/70" : "text-muted-foreground")}>
                {toman(plan.price)}
              </p>
              <CashbackBadge amount={cashbackAmount} />
            </div>
            <ul className="mt-4 flex-1 space-y-2 text-sm leading-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <Check className="mt-1 size-3.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className={cn(
                "mt-5 h-10",
                plan.id === "pro" && "bg-[oklch(0.9_0.08_85)] text-[oklch(0.25_0.04_60)] hover:bg-[oklch(0.86_0.09_85)]",
              )}
              variant={active ? "outline" : "default"}
              disabled={active || ownedHigher}
              onClick={() => onSelect(plan.id)}
            >
              {active ? "پلن فعال شما" : ownedHigher ? "پلن پایین‌تر" : "خرید این پلن"}
            </Button>
          </article>
        );
      })}
    </div>
  );
}
