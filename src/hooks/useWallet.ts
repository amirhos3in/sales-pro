"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { burstConfetti } from "@/components/wallet/confetti";
import { useAuth, type WalletTx } from "@/context/AuthContext";
import { cashbackForPayment } from "@/lib/cashback";
import { PLANS, planById, type Plan, type PlanId } from "@/lib/plans";
import { coveredPlan, redeemWithWallet } from "@/lib/redeem";
import { FALLBACK_RATE } from "@/lib/currency-rate";
import { useStore } from "@/lib/store";
import type { LiveCurrencyRate, Milestone, Transaction, WalletBalance } from "@/types/wallet";
import { useCurrencyRate } from "@/hooks/useCurrencyRate";

export type WalletPlan = Pick<Plan, "id" | "name" | "price">;

/** 1 تومان = 10 ریال. */
const TOMAN_TO_IRR = 10;

export const LIVE_RATE: LiveCurrencyRate = FALLBACK_RATE;

const EMPTY_TX: readonly WalletTx[] = [];

export function tomanToUsd(toman: number, rate: LiveCurrencyRate = LIVE_RATE) {
  if (!Number.isFinite(toman) || rate.usdToIrr <= 0) return 0;
  return (Math.max(0, toman) * TOMAN_TO_IRR) / rate.usdToIrr;
}

export function walletBalanceFromToman(toman: number, rate: LiveCurrencyRate = LIVE_RATE, expiresAt?: string): WalletBalance {
  const safe = Number.isFinite(toman) ? Math.max(0, toman) : 0;
  const balance: WalletBalance = {
    usd: tomanToUsd(safe, rate),
    irr: Math.round(safe * TOMAN_TO_IRR),
  };
  if (expiresAt) balance.expiresAt = expiresAt;
  return balance;
}

function milestonesFor(toman: number, plans: readonly WalletPlan[], rate: LiveCurrencyRate): Milestone[] {
  return plans.map((plan) => ({
    id: plan.id,
    targetUsd: tomanToUsd(plan.price, rate),
    label: plan.name,
    unlocked: toman >= plan.price,
  }));
}

function rewardTransactions(rows: readonly WalletTx[], rate: LiveCurrencyRate): Transaction[] {
  return rows.flatMap((row) => {
    const actionType = row.actionType ?? (row.kind === "cashback" ? "payment_cashback" : null);
    if (!actionType) return [];
    const entry: Transaction = {
      id: row.id,
      actionType,
      amountUsd: tomanToUsd(Math.abs(row.amount), rate),
      createdAt: row.date ?? row.at,
    };
    if (row.expiresAt) entry.expiresAt = row.expiresAt;
    return [entry];
  });
}

export function walletSnapshot(
  walletBalance: number,
  plans: readonly WalletPlan[] = PLANS,
  transactions: readonly WalletTx[] = EMPTY_TX,
  rate: LiveCurrencyRate = LIVE_RATE,
) {
  const balanceToman = Number.isFinite(walletBalance) ? Math.max(0, walletBalance) : 0;
  const maxTarget = plans.reduce((highest, plan) => Math.max(highest, plan.price), 0);
  const progressPercent = maxTarget > 0 ? Math.min(100, Math.round((balanceToman / maxTarget) * 100)) : 0;
  const unlockedPlans = plans.filter((plan) => balanceToman >= plan.price);
  const balance = walletBalanceFromToman(balanceToman, rate);
  return {
    walletBalance: balanceToman,
    balance,
    plans,
    milestones: milestonesFor(balanceToman, plans, rate),
    rate,
    rewardTransactions: rewardTransactions(transactions, rate),
    maxTarget,
    progressPercent,
    unlockedPlans,
  };
}

export function useWallet() {
  const { currentUser } = useAuth();
  const { rate } = useCurrencyRate();
  const walletBalance = currentUser?.walletBalance ?? 0;
  const transactions = currentUser?.transactions ?? EMPTY_TX;
  return useMemo(() => walletSnapshot(walletBalance, PLANS, transactions, rate), [walletBalance, transactions, rate]);
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
