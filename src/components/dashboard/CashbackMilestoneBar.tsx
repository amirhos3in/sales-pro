"use client";

import { useId, useState } from "react";
import { Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { goldGlassButton } from "@/components/wallet/gold-glass";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/lib/i18n";
import type { PlanId } from "@/lib/plans";
import { coveredPlan } from "@/lib/redeem";
import { subscriptionForPlan } from "@/lib/subscription";
import { useStore } from "@/lib/store";
import { ACTION_REWARD_USD } from "@/lib/wallet-engine";
import { useWalletContext } from "@/lib/walletContext";
import type { RewardAction } from "@/types/wallet";
import { cn } from "@/lib/utils";

const GOAL_USD = 50;

const MILESTONES = [
  { id: "monthly", targetUsd: 25, label: "اشتراک ۱ ماهه", planId: "eco" },
  { id: "quarterly", targetUsd: 40, label: "اشتراک ۳ ماهه", planId: "plus" },
  { id: "yearly", targetUsd: 50, label: "اشتراک طلایی سالانه", planId: "pro" },
] as const satisfies readonly { id: string; targetUsd: number; label: string; planId: PlanId }[];

const MISSIONS = [
  { action: "referral_bonus", fa: "دعوت از همکاران", en: "Invite colleagues", amount: "+$5" },
  { action: "course_completion", fa: "اتمام اولین آزمون", en: "Finish the first quiz", amount: "+$1.5" },
  { action: "ai_first_audit", fa: "تست صوت در AI", en: "AI voice test", amount: "+$1" },
] as const satisfies readonly { action: RewardAction; fa: string; en: string; amount: string }[];

const navyGlass = {
  backgroundColor: "rgba(11, 19, 43, 0.78)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(212, 175, 55, 0.4)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
};

function dollar(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function CashbackMilestoneBar() {
  const { lang } = useI18n();
  const fa = lang === "fa";
  const { currentUser, updateProfile } = useAuth();
  const { user: learner, grantPlan } = useStore();
  const { ready, walletUsd, claimedActions, claimActionReward, payFromWallet } = useWalletContext();
  const progress = Math.min(Math.max(walletUsd, 0) / GOAL_USD, 1);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<(typeof MILESTONES)[number]["id"] | null>(null);
  const tipBase = useId();
  const openId = pinnedId ?? hoverId;
  const pending = MILESTONES.find((milestone) => milestone.id === pendingId) ?? null;

  function claimMission(action: (typeof MISSIONS)[number]["action"]) {
    const ok = claimActionReward(action);
    if (!ok) {
      toast.error(fa ? "این مأموریت قبلاً انجام شده." : "This mission is already complete.");
      return;
    }
    toast.success(fa ? "پاداش مأموریت به کیف پول دلاری نشست." : "Mission reward added to your dollar wallet.");
  }

  function activate() {
    if (!pending || !currentUser) return;
    if (coveredPlan(currentUser, pending.planId)) {
      toast.success(fa ? "این اشتراک همین حالا فعال است." : "This plan is already active.");
      setPendingId(null);
      return;
    }
    const paid = payFromWallet(pending.targetUsd, pending.label);
    if (!paid) {
      toast.error(fa ? "موجودی دلاری برای فعال‌سازی کافی نیست." : "The dollar balance does not cover this plan.");
      return;
    }
    updateProfile({ plan: "vip", subscription: subscriptionForPlan(pending.planId) });
    if (learner) grantPlan(pending.planId);
    toast.success(fa ? `${pending.label} با موجودی کیف پول فعال شد.` : `${pending.label} is now active from your wallet.`);
    setPendingId(null);
    setPinnedId(null);
  }

  return (
    <section className="rounded-[28px] p-5 text-[#F6F1E4]" style={navyGlass} data-milestone-progress={progress} data-milestone-balance={walletUsd}>
      <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{fa ? "هدف دلاری" : "Dollar goal"}</p>
      <p className="mt-2 text-sm leading-7">
        {fa ? `پیشرفت تا سقف ${dollar(GOAL_USD)}` : `Progress toward ${dollar(GOAL_USD)}`}
        <span className="ms-2 font-semibold text-[#D4AF37]" dir="ltr">
          {dollar(Math.min(walletUsd, GOAL_USD))}
        </span>
      </p>
      <div dir="ltr" className="relative mx-6 mt-8 mb-14 h-3">
        <div className="absolute inset-0 overflow-hidden rounded-full border border-[#D4AF37]/30 bg-white/5" style={navyGlass}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg, #D4AF37 0%, #F3E5AB 100%)" }}
          />
        </div>
        {MILESTONES.map((milestone) => {
          const unlocked = walletUsd >= milestone.targetUsd;
          const percent = (milestone.targetUsd / GOAL_USD) * 100;
          const open = openId === milestone.id;
          const remain = Math.max(0, milestone.targetUsd - walletUsd);
          const tipId = `${tipBase}-${milestone.id}`;
          return (
            <span
              key={milestone.id}
              className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${percent}%` }}
              data-milestone={milestone.id}
              data-unlocked={unlocked ? "true" : "false"}
              onMouseEnter={() => setHoverId(milestone.id)}
              onMouseLeave={() => setHoverId((current) => (current === milestone.id ? null : current))}
            >
              <button
                type="button"
                className="grid size-8 place-items-center rounded-full"
                data-milestone-toggle={milestone.id}
                aria-label={milestone.label}
                aria-expanded={open}
                aria-describedby={open ? tipId : undefined}
                onClick={() => setPinnedId((current) => (current === milestone.id ? null : milestone.id))}
              >
                {unlocked ? (
                  <span className="grid size-8 place-items-center rounded-full bg-[#D4AF37] text-[#0B132B] shadow-[0_0_16px_rgba(212,175,55,0.85)]">
                    <Check className="size-4" />
                  </span>
                ) : (
                  <span className="grid size-8 place-items-center rounded-full border border-[#D4AF37]/50 text-[#F6F1E4]" style={navyGlass}>
                    <Lock className="size-3.5" />
                  </span>
                )}
              </button>
              <span className="absolute start-1/2 top-9 w-24 -translate-x-1/2 text-center text-[11px] leading-5 text-[#F6F1E4]/85" dir={fa ? "rtl" : "ltr"}>
                {milestone.label}
              </span>
              {open ? (
                <span
                  id={tipId}
                  role="tooltip"
                  dir={fa ? "rtl" : "ltr"}
                  className="absolute bottom-12 z-30 w-60 rounded-2xl border border-[#D4AF37]/50 p-3 text-start text-xs leading-6 text-[#F6F1E4] shadow-2xl"
                  style={{
                    ...navyGlass,
                    left: percent > 72 ? "auto" : percent < 28 ? "0" : "50%",
                    right: percent > 72 ? "0" : "auto",
                    transform: percent > 72 || percent < 28 ? undefined : "translateX(-50%)",
                  }}
                >
                  {unlocked ? (
                    <>
                      <span className="block">{fa ? `تبریک! ${milestone.label} برای شما رایگان شد` : `${milestone.label} is now free for you.`}</span>
                      <button
                        type="button"
                        data-activate={milestone.id}
                        className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-xl px-2 text-[11px] font-medium"
                        style={goldGlassButton}
                        onClick={() => setPendingId(milestone.id)}
                      >
                        {fa ? "فعال‌سازی" : "Activate"}
                      </button>
                    </>
                  ) : (
                    <span className="block">
                      {fa ? "تنها " : "Only "}
                      <span dir="ltr" className="font-semibold text-[#D4AF37]">
                        {dollar(remain)}
                      </span>
                      {fa ? " تا تمدید کاملاً رایگان این اشتراک" : " until this plan is completely free"}
                    </span>
                  )}
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
      <div className="mt-2 border-t border-[#D4AF37]/25 pt-4">
        <p className="text-sm font-medium text-[#D4AF37]">{fa ? "مأموریت‌های سریع" : "Quick missions"}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {MISSIONS.map((mission) => {
            const claimed = claimedActions.includes(mission.action);
            return (
              <button
                key={mission.action}
                type="button"
                data-mission={mission.action}
                disabled={!ready || claimed}
                onClick={() => claimMission(mission.action)}
                className={cn("h-11 rounded-2xl px-3 text-sm font-medium disabled:opacity-45", claimed && "line-through")}
                style={goldGlassButton}
              >
                {fa ? mission.fa : mission.en} ({mission.amount})
                <span className="sr-only">{ACTION_REWARD_USD[mission.action]}</span>
              </button>
            );
          })}
        </div>
      </div>
      {pending ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-[#0B132B]/60 p-4 backdrop-blur-md" onClick={() => setPendingId(null)}>
          <div
            role="dialog"
            aria-modal="true"
            data-wallet-pay-dialog={pending.id}
            dir={fa ? "rtl" : "ltr"}
            className="w-full max-w-md rounded-[28px] p-6 text-[#F6F1E4] shadow-2xl"
            style={navyGlass}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-sm leading-8">
              {fa
                ? `${pending.label} با پرداخت کامل ${dollar(pending.targetUsd)} از کیف پول دلاری فعال می‌شود و به درگاه نمی‌روید.`
                : `${pending.label} activates with a full wallet payment of ${dollar(pending.targetUsd)}. No gateway charge.`}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" data-confirm-wallet-pay className="h-11 flex-1 rounded-2xl px-4 text-sm font-medium" style={goldGlassButton} onClick={activate}>
                {fa ? "فعال‌سازی" : "Activate"}
              </button>
              <button type="button" className="h-11 rounded-2xl px-4 text-sm ring-1 ring-[#D4AF37]/40" onClick={() => setPendingId(null)}>
                {fa ? "انصراف" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
