import type { PlanId } from "@/lib/plans";

export type PlanType = "monthly" | "quarterly" | "yearly";

export type SubscriptionStatus = {
  isActive: boolean;
  planType: PlanType | null;
  expiresAt: string | null;
};

export const inactiveSubscription: SubscriptionStatus = {
  isActive: false,
  planType: null,
  expiresAt: null,
};

const months: Record<PlanType, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

export function planTypeFromId(id: PlanId): PlanType {
  if (id === "eco") return "monthly";
  if (id === "plus") return "quarterly";
  return "yearly";
}

export function subscriptionForPlan(plan: PlanId, from = new Date()): SubscriptionStatus {
  const planType = planTypeFromId(plan);
  const expires = new Date(from);
  expires.setMonth(expires.getMonth() + months[planType]);
  return { isActive: true, planType, expiresAt: expires.toISOString() };
}

export function normalizeSubscription(
  raw: Partial<SubscriptionStatus> | null | undefined,
  now = Date.now(),
): SubscriptionStatus {
  if (!raw?.isActive || (raw.planType !== "monthly" && raw.planType !== "quarterly" && raw.planType !== "yearly")) {
    return inactiveSubscription;
  }
  if (raw.expiresAt && Number.isFinite(Date.parse(raw.expiresAt)) && Date.parse(raw.expiresAt) <= now) {
    return { isActive: false, planType: raw.planType, expiresAt: raw.expiresAt };
  }
  return { isActive: true, planType: raw.planType, expiresAt: raw.expiresAt ?? null };
}
