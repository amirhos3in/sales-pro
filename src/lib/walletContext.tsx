"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  WALLET_STORAGE_KEY,
  claimReward,
  emptyWallet,
  gcWallet,
  grantGatewayCashback,
  readWallet,
  walletUsdOf,
  type WalletEntry,
  type WalletPersist,
} from "@/lib/wallet-engine";
import type { RewardAction } from "@/types/wallet";

type WalletContextValue = {
  ready: boolean;
  walletUsd: number;
  transactions: WalletEntry[];
  claimedActions: RewardAction[];
  claimActionReward: (actionType: RewardAction) => boolean;
  recordGatewayCashback: (gatewayUsd: number) => boolean;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletPersist>(emptyWallet);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const loaded = readWallet(localStorage.getItem(WALLET_STORAGE_KEY));
      stateRef.current = loaded;
      setState(loaded);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const claimActionReward = useCallback((actionType: RewardAction) => {
    const result = claimReward(stateRef.current, actionType);
    stateRef.current = result.state;
    setState(result.state);
    return result.ok;
  }, []);

  const recordGatewayCashback = useCallback((gatewayUsd: number) => {
    const result = grantGatewayCashback(stateRef.current, gatewayUsd);
    stateRef.current = result.state;
    setState(result.state);
    return result.ok;
  }, []);

  const value = useMemo<WalletContextValue>(() => {
    const collected = gcWallet(state);
    return {
      ready,
      walletUsd: walletUsdOf(collected),
      transactions: collected.transactions,
      claimedActions: collected.claimedActions,
      claimActionReward,
      recordGatewayCashback,
    };
  }, [claimActionReward, ready, recordGatewayCashback, state]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWalletContext() {
  const value = useContext(WalletContext);
  if (!value) throw new Error("useWalletContext must be used inside WalletProvider");
  return value;
}
