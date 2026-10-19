export const QUIZ_SIZE = 3;
export const QUIZ_PASS_AT = 2;

export type AccessTier = "free" | "lms" | "pro_copilot" | "enterprise";
export type LessonTrack = "free" | "paid";
export type AccessState = "auth" | "plan" | "sequence" | "open";

export function quizPassed(correct: number) {
  return correct >= QUIZ_PASS_AT;
}

export function quotaForTier(tier: AccessTier) {
  if (tier === "pro_copilot") return 300 * 60;
  if (tier === "enterprise") return 2000 * 60;
  if (tier === "free") return 3 * 60;
  return 0;
}

export function tierFromPlan(plan: "eco" | "plus" | "pro" | null | undefined, active: boolean): AccessTier {
  if (!active || !plan) return "free";
  if (plan === "eco") return "lms";
  if (plan === "plus") return "pro_copilot";
  return "enterprise";
}

export function lessonAccess(input: {
  signedIn: boolean;
  track: LessonTrack;
  tier: AccessTier;
  subscriptionActive: boolean;
  isFirst: boolean;
  previousPassed: boolean;
}): AccessState {
  if (!input.signedIn) return "auth";
  const paidOpen = input.subscriptionActive && input.tier !== "free";
  if (input.track === "paid" && !paidOpen) return "plan";
  if (!input.isFirst && !input.previousPassed) return "sequence";
  return "open";
}
