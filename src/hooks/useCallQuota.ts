"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export const CALL_QUOTA_KEY = "sales_ai_daily_calls";
export const DAILY_CALL_QUOTA = 3;

export type CallQuota = {
  count: number;
  date: string;
};

const serverQuota: CallQuota = { count: 0, date: "" };

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedToday = "";
let cachedQuota: CallQuota = serverQuota;

export function todayKey(now = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function parseCallQuota(raw: string | null): CallQuota | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CallQuota>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      count: typeof parsed.count === "number" ? parsed.count : 0,
      date: typeof parsed.date === "string" ? parsed.date : "",
    };
  } catch {
    return null;
  }
}

export function normalizeQuota(stored: CallQuota | null, today: string): CallQuota {
  if (!stored || stored.date !== today) return { count: 0, date: today };
  const count = Number.isFinite(stored.count) ? Math.floor(stored.count) : 0;
  return { count: Math.min(DAILY_CALL_QUOTA, Math.max(0, count)), date: today };
}

export function remainingOf(quota: CallQuota) {
  return Math.max(0, DAILY_CALL_QUOTA - quota.count);
}

export function applyConsume(stored: CallQuota | null, today: string) {
  const current = normalizeQuota(stored, today);
  if (current.count >= DAILY_CALL_QUOTA) return { quota: current, ok: false as const };
  return { quota: { count: current.count + 1, date: today }, ok: true as const };
}

function readStored() {
  if (typeof window === "undefined") return null;
  return parseCallQuota(localStorage.getItem(CALL_QUOTA_KEY));
}

function writeStored(quota: CallQuota) {
  localStorage.setItem(CALL_QUOTA_KEY, JSON.stringify(quota));
  cachedRaw = JSON.stringify(quota);
  cachedToday = quota.date;
  cachedQuota = quota;
}

function emit() {
  for (const listener of listeners) listener();
}

function getSnapshot() {
  const today = todayKey();
  const raw = localStorage.getItem(CALL_QUOTA_KEY);
  if (raw === cachedRaw && today === cachedToday) return cachedQuota;
  cachedRaw = raw;
  cachedToday = today;
  cachedQuota = normalizeQuota(parseCallQuota(raw), today);
  return cachedQuota;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === CALL_QUOTA_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCallQuota() {
  const quota = useSyncExternalStore(subscribe, getSnapshot, () => serverQuota);
  const remainingCalls = remainingOf(quota);
  const canAnalyze = remainingCalls > 0;

  useEffect(() => {
    const today = todayKey();
    const normalized = normalizeQuota(readStored(), today);
    const raw = localStorage.getItem(CALL_QUOTA_KEY);
    if (raw !== JSON.stringify(normalized)) {
      writeStored(normalized);
      emit();
    }
  }, []);

  const consumeQuota = useCallback(() => {
    const result = applyConsume(readStored(), todayKey());
    if (!result.ok) return false;
    writeStored(result.quota);
    emit();
    return true;
  }, []);

  return { remainingCalls, canAnalyze, consumeQuota };
}
