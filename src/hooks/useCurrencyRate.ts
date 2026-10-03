"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FALLBACK_RATE,
  formatFaNumber,
  irrToUsdAmount,
  resolveCurrencyRate,
  usdToIrrAmount,
  type RateSource,
} from "@/lib/currency-rate";
import type { LiveCurrencyRate } from "@/types/wallet";

export function useCurrencyRate() {
  const [rate, setRate] = useState<LiveCurrencyRate>(FALLBACK_RATE);
  const [source, setSource] = useState<RateSource>("fallback");

  useEffect(() => {
    let cancelled = false;
    resolveCurrencyRate().then((resolved) => {
      if (cancelled) return;
      setRate(resolved.rate);
      setSource(resolved.source);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const usdToIrr = useCallback((amount: number) => usdToIrrAmount(amount, rate.usdToIrr), [rate.usdToIrr]);
  const irrToUsd = useCallback((amount: number) => irrToUsdAmount(amount, rate.usdToIrr), [rate.usdToIrr]);
  const formatFa = useCallback((amount: number) => formatFaNumber(amount), []);

  return { rate, source, usdToIrr, irrToUsd, formatFa };
}
