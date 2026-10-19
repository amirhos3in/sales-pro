export const COURSE_PRICE = 5_000_000;
export const BUNDLE_LIST_PRICE = 20_000_000;
export const BUNDLE_PRICE = 16_000_000;
export const BUNDLE_SAVE = BUNDLE_LIST_PRICE - BUNDLE_PRICE;
export const BUNDLE_GIFT_MINUTES = 500;
export const MINUTE_STEP = 1_000;
export const MIN_MINUTES = 1_000;
export const MAX_MINUTES = 20_000;
export const PRICE_PER_THOUSAND = 3_000_000;

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
};

export const emptyPricing: PricingState = { courses: [], bundle: false, minutes: 0 };

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
    if (!raw) return emptyPricing;
    const parsed = JSON.parse(raw) as Partial<PricingState>;
    const courses = Array.isArray(parsed.courses)
      ? parsed.courses.filter((id): id is PaidCourseId => typeof id === "string" && isCourseId(id))
      : [];
    return {
      courses,
      bundle: Boolean(parsed.bundle),
      minutes: Number.isFinite(parsed.minutes) ? Math.max(0, Math.round(Number(parsed.minutes))) : 0,
    };
  } catch {
    return emptyPricing;
  }
}

export function writePricing(next: PricingState) {
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("salespro-pricing"));
}

export function ownsCourse(state: PricingState, courseId: string) {
  if (courseId === "free") return true;
  if (state.bundle) return true;
  return isCourseId(courseId) && state.courses.includes(courseId);
}

export function buyCourse(courseId: PaidCourseId) {
  const state = readPricing();
  if (state.bundle || state.courses.includes(courseId)) return state;
  const next = { ...state, courses: [...state.courses, courseId] };
  writePricing(next);
  return next;
}

export function buyBundle() {
  const state = readPricing();
  const next: PricingState = {
    courses: PAID_COURSES.map((course) => course.id),
    bundle: true,
    minutes: state.bundle ? state.minutes : state.minutes + BUNDLE_GIFT_MINUTES,
  };
  writePricing(next);
  return next;
}

export function buyMinutes(amount: number) {
  const state = readPricing();
  const next = { ...state, minutes: state.minutes + clampMinutes(amount) };
  writePricing(next);
  return next;
}
