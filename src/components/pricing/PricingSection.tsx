"use client";

import { PlanCard } from "@/components/pricing/PlanCard";
import { CashbackGoalBar } from "@/components/wallet/CashbackGoalBar";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/hooks/useWallet";
import { PLANS, PLANS_OFFER_ACTIVE, type PlanId } from "@/lib/plans";
import type { Milestone } from "@/types/wallet";

export function PricingSection({ onSelect }: { onSelect: (planId: PlanId) => void }) {
  const { ready, isAuthenticated } = useAuth();
  const { milestones } = useWallet();
  const ranked: Milestone[] = [...milestones].sort((left, right) => right.targetUsd - left.targetUsd);
  const best = ranked.find((milestone) => milestone.unlocked);

  if (!PLANS_OFFER_ACTIVE) {
    return (
      <div id="pricing-plans" className="scroll-mt-24">
        <p className="text-sm leading-7 text-muted-foreground">پلن‌های ماهانه، سه‌ماهه و سالانه پیشنهاد فعال نیستند.</p>
      </div>
    );
  }

  return (
    <div id="pricing-plans" className="scroll-mt-24 space-y-4">
      {ready && isAuthenticated ? (
        <section className="glass rounded-3xl p-4 shadow-xl">
          {best ? (
            <p className="text-sm font-medium leading-7">
              شما با کیف پول خود می‌توانید {best.label} را رایگان فعال کنید.
            </p>
          ) : null}
          <CashbackGoalBar compact />
        </section>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onCheckout={onSelect} />
        ))}
      </div>
    </div>
  );
}
