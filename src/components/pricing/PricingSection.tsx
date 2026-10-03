"use client";

import { PlanCard } from "@/components/pricing/PlanCard";
import { CashbackGoalBar } from "@/components/wallet/CashbackGoalBar";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/hooks/useWallet";
import { PLANS, type PlanId } from "@/lib/plans";

export function PricingSection({ onSelect }: { onSelect: (planId: PlanId) => void }) {
  const { ready, isAuthenticated } = useAuth();
  const { unlockedPlans } = useWallet();
  const best = [...unlockedPlans].sort((left, right) => right.price - left.price)[0];

  return (
    <div id="pricing-plans" className="scroll-mt-24 space-y-4">
      {ready && isAuthenticated ? (
        <section className="glass rounded-3xl p-4 shadow-xl">
          {best ? (
            <p className="text-sm font-medium leading-7">
              شما با کیف پول خود می‌توانید {best.name} را رایگان فعال کنید.
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
