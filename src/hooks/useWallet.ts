"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { burstConfetti } from "@/components/wallet/confetti";
import { useAuth } from "@/context/AuthContext";
import { cashbackForPayment } from "@/lib/cashback";
import { PLANS, planById, type Plan, type PlanId } from "@/lib/plans";
import { coveredPlan, redeemWithWallet } from "@/lib/redeem";
import { useStore } from "@/lib/store";

export type WalletPlan = Pick<Plan, "id" | "name" | "price">;

export function walletSnapshot(walletBalance: number, plans: readonly WalletPlan[] = PLANS) {
  const balance = Number.isFinite(walletBalance) ? Math.max(0, walletBalance) : 0;
  const maxTarget = plans.reduce((highest, plan) => Math.max(highest, plan.price), 0);
  const progressPercent = maxTarget > 0 ? Math.min(100, Math.round((balance / maxTarget) * 100)) : 0;
  const unlockedPlans = plans.filter((plan) => balance >= plan.price);
  return {
    walletBalance: balance,
    plans,
    maxTarget,
    progressPercent,
    unlockedPlans,
  };
}

export function useWallet() {
  const { currentUser } = useAuth();
  const walletBalance = currentUser?.walletBalance ?? 0;
  return useMemo(() => walletSnapshot(walletBalance), [walletBalance]);
}

export function useWalletRedeem() {
  const { currentUser, updateProfile } = useAuth();
  const { grantPlan, user: learner } = useStore();

  return function redeem(planId: PlanId) {
    if (!currentUser || currentUser.walletBalance < planById(planId).price) return false;
    if (coveredPlan(currentUser, planId)) {
      toast.success("این پلن همین حالا فعال است.");
      return false;
    }
    const { plan, patch } = redeemWithWallet(currentUser, planId);
    updateProfile(patch);
    if (learner) grantPlan(plan.id);
    toast.success(`اشتراک ${plan.name} با موجودی کیف پول فعال شد.`);
    burstConfetti();
    return true;
  };
}

export { cashbackForPayment };
