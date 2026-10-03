import { isRewardAction, type RewardAction, type Transaction } from "@/types/wallet";

export const CASHBACK_TTL_MS = 90 * 24 * 60 * 60 * 1000;
export const WALLET_STORAGE_KEY = "nexsell-wallet-usd-v1";

/** One-time prototype rewards. Gateway cashback is not claimed through this table. */
export const ACTION_REWARD_USD = {
  ai_first_audit: 1,
  course_completion: 1.5,
  referral_bonus: 5,
} as const satisfies Partial<Record<RewardAction, number>>;

const ONE_TIME: readonly RewardAction[] = ["ai_first_audit", "course_completion", "referral_bonus"];

export type WalletEntry = Transaction;

export type WalletPersist = {
  transactions: WalletEntry[];
  claimedActions: RewardAction[];
};

export function emptyWallet(): WalletPersist {
  return { transactions: [], claimedActions: [] };
}

export function roundUsd(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

/** Five percent of the gateway amount, in dollars. Wallet-only payments are zero. */
export function cashbackUsd(gatewayUsd: number) {
  if (!Number.isFinite(gatewayUsd) || gatewayUsd <= 0) return 0;
  return roundUsd(gatewayUsd * 0.05);
}

export function isExpired(entry: Pick<Transaction, "expiresAt" | "expired">, now = Date.now()) {
  if (entry.expired) return true;
  if (!entry.expiresAt) return false;
  const at = Date.parse(entry.expiresAt);
  return Number.isFinite(at) && at <= now;
}

export function gcWallet(state: WalletPersist, now = Date.now()): WalletPersist {
  let changed = false;
  const transactions = state.transactions.map((entry) => {
    if (entry.expired || !isExpired(entry, now)) return entry;
    changed = true;
    return { ...entry, expired: true };
  });
  return changed ? { ...state, transactions } : state;
}

export function walletUsdOf(state: WalletPersist, now = Date.now()) {
  const current = gcWallet(state, now);
  const total = current.transactions.reduce((sum, entry) => (entry.expired ? sum : sum + entry.amountUsd), 0);
  return roundUsd(total);
}

function rewardAmount(actionType: RewardAction) {
  if (actionType === "payment_cashback") return null;
  return ACTION_REWARD_USD[actionType];
}

export function claimReward(state: WalletPersist, actionType: RewardAction, now = Date.now()) {
  const current = gcWallet(state, now);
  const amountUsd = rewardAmount(actionType);
  if (amountUsd == null || current.claimedActions.includes(actionType)) {
    return { state: current, ok: false as const };
  }
  const createdAt = new Date(now).toISOString();
  const entry: WalletEntry = {
    id: crypto.randomUUID(),
    actionType,
    amountUsd,
    createdAt,
  };
  return {
    ok: true as const,
    state: {
      transactions: [entry, ...current.transactions],
      claimedActions: [...current.claimedActions, actionType],
    },
  };
}

export function grantGatewayCashback(state: WalletPersist, gatewayUsd: number, now = Date.now()) {
  const current = gcWallet(state, now);
  const amountUsd = cashbackUsd(gatewayUsd);
  if (amountUsd <= 0) return { state: current, ok: false as const };
  const createdAt = new Date(now).toISOString();
  const entry: WalletEntry = {
    id: crypto.randomUUID(),
    actionType: "payment_cashback" as const,
    amountUsd,
    createdAt,
    expiresAt: new Date(now + CASHBACK_TTL_MS).toISOString(),
  };
  return {
    ok: true as const,
    state: {
      ...current,
      transactions: [entry, ...current.transactions],
    },
  };
}

function isEntry(value: unknown): value is WalletEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<WalletEntry>;
  return (
    typeof entry.id === "string" &&
    entry.id.length > 0 &&
    typeof entry.actionType === "string" &&
    isRewardAction(entry.actionType) &&
    typeof entry.amountUsd === "number" &&
    Number.isFinite(entry.amountUsd) &&
    entry.amountUsd > 0 &&
    typeof entry.createdAt === "string" &&
    (entry.expiresAt === undefined || typeof entry.expiresAt === "string") &&
    (entry.expired === undefined || typeof entry.expired === "boolean")
  );
}

export function readWallet(raw: string | null, now = Date.now()): WalletPersist {
  if (!raw) return emptyWallet();
  try {
    const parsed = JSON.parse(raw) as Partial<WalletPersist>;
    const transactions = Array.isArray(parsed.transactions) ? parsed.transactions.filter(isEntry) : [];
    const claimedActions = Array.isArray(parsed.claimedActions)
      ? parsed.claimedActions.filter((action): action is RewardAction => typeof action === "string" && (ONE_TIME as readonly string[]).includes(action))
      : [];
    return gcWallet({ transactions, claimedActions: [...new Set(claimedActions)] }, now);
  } catch {
    return emptyWallet();
  }
}
