import type { LiveCurrencyRate } from "@/types/wallet";

/** Spec fallback when the project rate API is missing, fails, or times out. */
export const FALLBACK_USD_TO_IRR = 270_000;

export const FALLBACK_RATE: LiveCurrencyRate = {
  usdToIrr: FALLBACK_USD_TO_IRR,
  lastUpdated: "2026-10-03T00:00:00.000Z",
};

export const CURRENCY_RATE_PATH = "/api/rates/usd-irr";
export const RATE_TTL_MS = 15 * 60 * 1000;
export const RATE_TIMEOUT_MS = 4_000;

const STORAGE_KEY = "nexsell-usd-irr-v1";

export type RateSource = "fallback" | "cache" | "live";

export type ResolvedRate = {
  rate: LiveCurrencyRate;
  source: RateSource;
};

type MemoryEntry = {
  rate: LiveCurrencyRate;
  cachedAt: number;
  source: "cache" | "live";
};

type StoredRate = LiveCurrencyRate & { cachedAt: number };

let memory: MemoryEntry | null = null;
let inflight: Promise<ResolvedRate> | null = null;

export function clearCurrencyCache() {
  memory = null;
  inflight = null;
  try {
    storage()?.removeItem(STORAGE_KEY);
  } catch {
    /* ignore private-mode storage failures */
  }
}

function storage(): Storage | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    return null;
  }
}

function isRate(value: unknown): value is LiveCurrencyRate {
  if (!value || typeof value !== "object") return false;
  const rate = value as Partial<LiveCurrencyRate>;
  return typeof rate.usdToIrr === "number" && Number.isFinite(rate.usdToIrr) && rate.usdToIrr > 0 && typeof rate.lastUpdated === "string" && rate.lastUpdated.length > 0;
}

/** Half-up rounding for rial amounts. $1.5 at the fallback rate is 405,000 IRR. */
export function usdToIrrAmount(amountUsd: number, usdToIrrRate: number = FALLBACK_USD_TO_IRR) {
  if (!Number.isFinite(amountUsd) || !Number.isFinite(usdToIrrRate) || usdToIrrRate <= 0) return 0;
  return Math.round(amountUsd * usdToIrrRate);
}

export function irrToUsdAmount(amountIrr: number, usdToIrrRate: number = FALLBACK_USD_TO_IRR) {
  if (!Number.isFinite(amountIrr) || !Number.isFinite(usdToIrrRate) || usdToIrrRate <= 0) return 0;
  return amountIrr / usdToIrrRate;
}

/** Thousands separators and Persian digits. Rials and tomans are shown as whole numbers. */
export function formatFaNumber(value: number) {
  const rounded = Number.isFinite(value) ? Math.round(value) : 0;
  return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(rounded);
}

function readStorage(now: number): MemoryEntry | null {
  const raw = storage()?.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredRate>;
    const cachedAt = parsed.cachedAt;
    if (!isRate(parsed) || typeof cachedAt !== "number" || now - cachedAt > RATE_TTL_MS) return null;
    return {
      rate: { usdToIrr: parsed.usdToIrr, lastUpdated: parsed.lastUpdated },
      cachedAt,
      source: "cache",
    };
  } catch {
    return null;
  }
}

export function readFreshRate(now = Date.now()): MemoryEntry | null {
  if (memory && now - memory.cachedAt <= RATE_TTL_MS) return memory;
  memory = null;
  const stored = readStorage(now);
  if (!stored) return null;
  memory = stored;
  return stored;
}

function remember(rate: LiveCurrencyRate, now = Date.now()) {
  memory = { rate, cachedAt: now, source: "live" };
  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify({ ...rate, cachedAt: now }));
  } catch {
    /* ignore quota errors */
  }
}

export async function fetchProjectRate(fetchImpl: typeof fetch = fetch, timeoutMs = RATE_TIMEOUT_MS): Promise<LiveCurrencyRate> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(CURRENCY_RATE_PATH, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`currency rate ${response.status}`);
    const body = (await response.json()) as Partial<LiveCurrencyRate>;
    if (!isRate(body)) throw new Error("currency rate invalid");
    return { usdToIrr: body.usdToIrr, lastUpdated: body.lastUpdated };
  } finally {
    clearTimeout(timer);
  }
}

export async function resolveCurrencyRate(fetchImpl: typeof fetch = fetch, now = Date.now()): Promise<ResolvedRate> {
  const cached = readFreshRate(now);
  if (cached) return { rate: cached.rate, source: cached.source };
  if (!inflight) {
    inflight = fetchProjectRate(fetchImpl)
      .then((rate) => {
        remember(rate, Date.now());
        return { rate, source: "live" as const };
      })
      .catch(() => ({ rate: FALLBACK_RATE, source: "fallback" as const }))
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}
