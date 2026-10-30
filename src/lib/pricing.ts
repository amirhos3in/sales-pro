export const COURSE_PRICE = 5_000_000;
export const BUNDLE_LIST_PRICE = 20_000_000;
export const BUNDLE_PRICE = 15_000_000;
export const BUNDLE_SAVE = BUNDLE_LIST_PRICE - BUNDLE_PRICE;
export const BUNDLE_GIFT_MINUTES = 500;
export const MINUTE_STEP = 1_000;
export const MIN_MINUTES = 1_000;
export const MAX_MINUTES = 20_000;
export const PRICE_PER_THOUSAND = 3_000_000;
export const CASHBACK_RATE = 0.05;
export const REFERRAL_REWARD = 200_000;

export const PAID_COURSES = [
  { id: "online", fa: "فروش آنلاین", en: "Online Sales" },
  { id: "hozuri", fa: "فروش حضوری", en: "In-Person Sales" },
  { id: "telefoni", fa: "فروش تلفنی", en: "Telephone Sales" },
  { id: "mozakerah", fa: "اصول مذاکره", en: "Negotiation" },
] as const;

export type PaidCourseId = (typeof PAID_COURSES)[number]["id"];

export type PricingState = {
  courses: PaidCourseId[];
  bundle: boolean;
  minutes: number;
  cashbackToman: number;
  referrals: number;
  referralCode: string;
};

export const emptyPricing: PricingState = {
  courses: [],
  bundle: false,
  minutes: 0,
  cashbackToman: 0,
  referrals: 0,
  referralCode: "",
};

const KEY = "salespro-pricing-v1";

export function minutesPrice(minutes: number) {
  const steps = Math.round(clampMinutes(minutes) / MINUTE_STEP);
  return steps * PRICE_PER_THOUSAND;
}

export function clampMinutes(minutes: number) {
  const snapped = Math.round(minutes / MINUTE_STEP) * MINUTE_STEP;
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, snapped));
}

function isCourseId(value: string): value is PaidCourseId {
  return PAID_COURSES.some((course) => course.id === value);
}

export function readPricing(): PricingState {
  if (typeof window === "undefined") return emptyPricing;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const extra = Number(localStorage.getItem("aiMinutes"));
      if (Number.isFinite(extra) && extra > 0) return { ...emptyPricing, minutes: Math.round(extra) };
      return emptyPricing;
    }
    const parsed = JSON.parse(raw) as Partial<PricingState>;
    const courses = Array.isArray(parsed.courses)
      ? parsed.courses.filter((id): id is PaidCourseId => typeof id === "string" && isCourseId(id))
      : [];
    let minutes = Number.isFinite(parsed.minutes) ? Math.max(0, Math.round(Number(parsed.minutes))) : 0;
    if (minutes === 0) {
      const extra = localStorage.getItem("aiMinutes");
      const parsedExtra = extra == null || extra === "" ? Number.NaN : Number(extra);
      if (Number.isFinite(parsedExtra)) minutes = Math.max(0, Math.round(parsedExtra));
    }
    return {
      courses,
      bundle: Boolean(parsed.bundle),
      minutes,
      cashbackToman: Number.isFinite(parsed.cashbackToman) ? Math.max(0, Math.round(Number(parsed.cashbackToman))) : 0,
      referrals: Number.isFinite(parsed.referrals) ? Math.max(0, Math.round(Number(parsed.referrals))) : 0,
      referralCode: typeof parsed.referralCode === "string" ? parsed.referralCode : "",
    };
  } catch {
    return emptyPricing;
  }
}

export function writePricing(next: PricingState) {
  localStorage.setItem(KEY, JSON.stringify(next));
  localStorage.setItem("aiMinutes", String(next.minutes));
  window.dispatchEvent(new Event("salespro-pricing"));
}

export function remainingCopilotMinutes(state: PricingState) {
  const minutes = Number.isFinite(state.minutes) ? Math.max(0, Math.round(state.minutes)) : 0;
  return minutes;
}

export function ownsCourse(state: PricingState, courseId: string) {
  if (courseId === "free") return true;
  if (state.bundle) return true;
  return isCourseId(courseId) && state.courses.includes(courseId);
}

function addCashback(state: PricingState, price: number) {
  return state.cashbackToman + Math.round(price * CASHBACK_RATE);
}

export function buyCourse(courseId: PaidCourseId) {
  const state = readPricing();
  if (state.bundle || state.courses.includes(courseId)) return state;
  const next = {
    ...state,
    courses: [...state.courses, courseId],
    cashbackToman: addCashback(state, COURSE_PRICE),
  };
  writePricing(next);
  return next;
}

export function buyBundle() {
  const state = readPricing();
  if (state.bundle) return state;
  const next: PricingState = {
    ...state,
    courses: PAID_COURSES.map((course) => course.id),
    bundle: true,
    minutes: state.minutes,
    cashbackToman: addCashback(state, BUNDLE_PRICE),
  };
  writePricing(next);
  return next;
}

export function buyMinutes(amount: number) {
  const state = readPricing();
  const bought = clampMinutes(amount);
  const next = {
    ...state,
    minutes: state.minutes + bought,
    cashbackToman: addCashback(state, minutesPrice(bought)),
  };
  writePricing(next);
  return next;
}

export function ensureReferralCode() {
  const state = readPricing();
  if (state.referralCode) return state;
  const next = { ...state, referralCode: `NX${Math.floor(1000 + Math.random() * 9000)}` };
  writePricing(next);
  return next;
}

export function recordReferral() {
  const state = ensureReferralCode();
  const next = {
    ...state,
    referrals: state.referrals + 1,
    cashbackToman: state.cashbackToman + REFERRAL_REWARD,
  };
  writePricing(next);
  return next;
}
