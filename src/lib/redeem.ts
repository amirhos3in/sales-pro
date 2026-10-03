import type { AcademyUser, WalletTx } from "@/context/AuthContext";
import { PLAN_RANK, planById, type PlanId } from "@/lib/plans";
import { subscriptionForPlan, type PlanType } from "@/lib/subscription";

const typeRank: Record<PlanType, PlanId> = {
  monthly: "eco",
  quarterly: "plus",
  yearly: "pro",
};

export function coveredPlan(user: AcademyUser | null, planId: PlanId) {
  const current = user?.subscription?.isActive ? user.subscription.planType : null;
  if (!current) return false;
  return PLAN_RANK[typeRank[current]] >= PLAN_RANK[planId];
}

export function redeemWithWallet(user: AcademyUser, planId: PlanId) {
  const plan = planById(planId);
  const now = new Date().toISOString();
  const entry: WalletTx = {
    id: crypto.randomUUID(),
    kind: "plan",
    type: "DEBIT",
    title: "خرید اشتراک با کیف پول",
    amount: plan.price,
    date: now,
    at: now,
    status: "success",
  };
  return {
    plan,
    patch: {
      walletBalance: user.walletBalance - plan.price,
      plan: "vip" as const,
      subscription: subscriptionForPlan(plan.id, new Date(now)),
      transactions: [entry, ...(user.transactions ?? [])],
    },
  };
}
