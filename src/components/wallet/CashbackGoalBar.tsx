"use client";

import { useEffect, useId, useState } from "react";
import { Check, Lock } from "lucide-react";
import { useWallet, useWalletRedeem } from "@/hooks/useWallet";
import { localeNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { planById, type PlanId } from "@/lib/plans";
import { coveredPlan } from "@/lib/redeem";
import { useAuth } from "@/context/AuthContext";
import { goldGlassButton } from "@/components/wallet/gold-glass";
import { WalletRedeemDialog } from "@/components/wallet/WalletRedeemDialog";
import { cn } from "@/lib/utils";

const glass = {
  backgroundColor: "rgba(15, 28, 63, 0.4)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

export function CashbackGoalBar() {
  const { lang } = useI18n();
  const { currentUser } = useAuth();
  const redeem = useWalletRedeem();
  const [pendingId, setPendingId] = useState<PlanId | null>(null);
  const { walletBalance, plans, maxTarget, progressPercent, unlockedPlans } = useWallet();
  const unlockedIds = new Set(unlockedPlans.map((plan) => plan.id));
  const fill = progressPercent;
  const [shown, setShown] = useState(0);
  const [hoverId, setHoverId] = useState<PlanId | null>(null);
  const [pinnedId, setPinnedId] = useState<PlanId | null>(null);
  const openId = pinnedId ?? hoverId;
  const tipId = useId();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(fill));
    return () => cancelAnimationFrame(frame);
  }, [fill]);

  return (
    <section className="px-1 pb-2 pt-1">
      <div dir="ltr" className="relative mx-3 mt-8 mb-10 h-3">
        <div
          className="absolute inset-0 overflow-hidden rounded-full border border-white/10 bg-white/5"
          style={glass}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${shown}%`,
              background: "linear-gradient(90deg, #D4AF37 0%, #7928CA 100%)",
            }}
          />
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 z-10 size-4 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
          style={{ left: `${shown}%` }}
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#D4AF37]/70" />
          <span className="absolute inset-0.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.9)]" />
        </span>
        {plans.map((plan) => {
          const percent = maxTarget > 0 ? (plan.price / maxTarget) * 100 : 0;
          const reached = unlockedIds.has(plan.id);
          const canRedeem = reached && !coveredPlan(currentUser, plan.id);
          const open = openId === plan.id;
          const remain = Math.max(0, plan.price - walletBalance);
          const remainLabel = localeNumber(remain, lang);
          const tip = reached
            ? lang === "fa"
              ? `🎉 آماده فعال‌سازی پلن ${plan.name} بدون پرداخت ریالی!`
              : `Ready to activate the ${plan.name} plan with no rial payment!`
            : lang === "fa"
              ? `مانده تا فعال‌سازی رایگان این پلن: ${remainLabel} تومان`
              : `${remainLabel} Toman left before this plan is free`;
          return (
            <span
              key={plan.id}
              className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${percent}%` }}
              onMouseEnter={() => setHoverId(plan.id)}
              onMouseLeave={() => setHoverId((current) => (current === plan.id ? null : current))}
            >
              <button
                type="button"
                className="grid size-7 place-items-center rounded-full"
                aria-label={plan.name}
                aria-expanded={open}
                aria-describedby={open ? tipId : undefined}
                onClick={() => setPinnedId((current) => (current === plan.id ? null : plan.id))}
              >
                {reached ? (
                  <span className="grid size-7 place-items-center rounded-full bg-[#D4AF37] text-[#0B132B] shadow-[0_0_16px_rgba(212,175,55,0.85)]">
                    <Check className="size-3.5" />
                  </span>
                ) : (
                  <span
                    className="grid size-7 place-items-center rounded-full border border-white/15 text-[#F6F1E4]"
                    style={glass}
                  >
                    <Lock className="size-3" />
                  </span>
                )}
              </button>
              <span className={cn("absolute start-1/2 top-8 w-16 -translate-x-1/2 text-center text-[10px] leading-4 text-[#0B132B] dark:text-[#F6F1E4]/80")}>
                {plan.name}
              </span>
              {open ? (
                <span
                  id={tipId}
                  role="tooltip"
                  className="absolute bottom-10 z-30 w-56 rounded-2xl border border-[#D4AF37]/45 p-3 text-xs leading-6 text-[#F6F1E4] shadow-2xl"
                  style={{
                    backgroundColor: "rgba(15, 28, 63, 0.95)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    left: percent > 78 ? "auto" : percent < 22 ? "0" : "50%",
                    right: percent > 78 ? "0" : "auto",
                    transform: percent > 78 || percent < 22 ? undefined : "translateX(-50%)",
                  }}
                >
                  <span className="block">{tip}</span>
                  {canRedeem ? (
                    <button
                      type="button"
                      className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-xl px-2 text-[11px] font-medium"
                      style={goldGlassButton}
                      onClick={() => setPendingId(plan.id)}
                    >
                      فعال‌سازی ۱۰۰٪ رایگان با اعتبار کیف پول
                    </button>
                  ) : null}
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
      <WalletRedeemDialog
        plan={pendingId ? planById(pendingId) : null}
        open={Boolean(pendingId)}
        onClose={() => setPendingId(null)}
        onConfirm={() => {
          if (pendingId && redeem(pendingId)) setPendingId(null);
        }}
      />
    </section>
  );
}
