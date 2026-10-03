/** Single source of truth for reward actions. */
export const REWARD_ACTIONS = [
  "ai_first_audit",
  "course_completion",
  "referral_bonus",
  "payment_cashback",
] as const;

export type RewardAction = (typeof REWARD_ACTIONS)[number];

export type WalletBalance = {
  usd: number;
  irr: number;
  expiresAt?: string;
};

export type Milestone = {
  id: string;
  targetUsd: number;
  label: string;
  unlocked: boolean;
};

export type LiveCurrencyRate = {
  usdToIrr: number;
  lastUpdated: string;
};

export type Transaction = {
  id: string;
  actionType: RewardAction;
  amountUsd: number;
  createdAt: string;
  expiresAt?: string;
  /** Set by expiry collection. Expired rows stay for the report and do not count toward balance. */
  expired?: boolean;
};

export function isRewardAction(value: string): value is RewardAction {
  return (REWARD_ACTIONS as readonly string[]).includes(value);
}
