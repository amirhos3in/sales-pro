"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { cashbackForPayment } from "@/lib/cashback";
import { PLANS, type Plan } from "@/lib/plans";

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

export { cashbackForPayment };
