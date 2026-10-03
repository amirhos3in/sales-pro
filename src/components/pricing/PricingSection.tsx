"use client";

import { PlanCard } from "@/components/pricing/PlanCard";
import { PLANS, type PlanId } from "@/lib/plans";

export function PricingSection({ onSelect }: { onSelect: (planId: PlanId) => void }) {
  return (
    <div id="pricing-plans" className="grid scroll-mt-24 gap-4 lg:grid-cols-3">
      {PLANS.map((plan) => (
        <PlanCard key={plan.id} plan={plan} onCheckout={onSelect} />
      ))}
    </div>
  );
}
