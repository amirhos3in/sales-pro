"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { goldButtonStyle } from "@/components/dashboard/style";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useCurrencyRate } from "@/hooks/useCurrencyRate";
import { deductionToman, gatewayToman, quoteSplitPay, spendableDeduction, type SplitPay } from "@/lib/split-pay";
import { localeNumber } from "@/lib/format";
import type { Plan, PlanId } from "@/lib/plans";
import { subscriptionForPlan } from "@/lib/subscription";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useWalletContext } from "@/lib/walletContext";
import { cn } from "@/lib/utils";

function formatUsd(value: number, lang: "fa" | "en") {
  return new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function useSplitCheckout() {
  const { walletUsd, payFromWallet, recordGatewayCashback } = useWalletContext();
  const { rate } = useCurrencyRate();
  const { currentUser, updateProfile } = useAuth();
  const { user: learner, grantPlan } = useStore();

  function quote(planToman: number, useWallet: boolean) {
    return quoteSplitPay(planToman, walletUsd, rate.usdToIrr, useWallet);
  }

  function settle(planToman: number, useWallet: boolean, label: string, planId?: PlanId) {
    const split = quote(planToman, useWallet);
    if (!currentUser) return { ok: false as const, reason: "auth" as const, split };
    const deduction = spendableDeduction(split);
    if (deduction > 0 && !payFromWallet(deduction, label)) {
      return { ok: false as const, reason: "wallet" as const, split };
    }
    if (!split.direct && split.remainingUsd > 0) recordGatewayCashback(split.remainingUsd);
    if (planId) {
      updateProfile({ plan: "vip", subscription: subscriptionForPlan(planId) });
      if (learner) grantPlan(planId);
    }
    return { ok: true as const, split };
  }

  return { quote, settle, walletUsd };
}

export function WalletSplitFields({
  planToman,
  useWallet,
  onToggle,
  split,
}: {
  planToman: number;
  useWallet: boolean;
  onToggle: (next: boolean) => void;
  split: SplitPay;
}) {
  const { lang } = useI18n();
  const fa = lang === "fa";
  const { walletUsd } = useWalletContext();
  const { usdToIrr, formatFa, rate } = useCurrencyRate();
  const balanceIrr = usdToIrr(walletUsd);
  const balanceToman = Math.round(balanceIrr / 10);
  const money = (value: number) => (fa ? formatFa(Math.round(value)) : localeNumber(Math.round(value), "en"));

  return (
    <div className="space-y-3">
      <button
        type="button"
        role="switch"
        aria-checked={useWallet}
        data-wallet-toggle
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#D4AF37]/40 p-3 text-start"
        onClick={() => onToggle(!useWallet)}
      >
        <span>
          <span className="block text-sm font-medium">{fa ? "استفاده از موجودی کیف پول" : "Use wallet balance"}</span>
          <span className="mt-1 block text-xs text-muted-foreground" dir="ltr" data-wallet-equivalent>
            {formatUsd(walletUsd, "en")} USD · {fa ? formatFa(balanceIrr) : localeNumber(balanceIrr, "en")} IRR · {fa ? formatFa(balanceToman) : localeNumber(balanceToman, "en")} TMN
          </span>
        </span>
        <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition", useWallet ? "bg-[#D4AF37]" : "bg-foreground/15")}>
          <span className={cn("absolute top-0.5 size-5 rounded-full bg-white transition", useWallet ? "start-5" : "start-0.5")} />
        </span>
      </button>
      <div className="space-y-1 text-sm leading-7">
        <p>
          {fa ? "قیمت پلن" : "Plan price"}: {money(planToman)} {fa ? "تومان" : "Toman"}
          <span className="ms-2 text-muted-foreground" dir="ltr">
            ({formatUsd(split.planUsd, lang)} USD)
          </span>
        </p>
        <p>
          {fa ? "کسر از کیف پول" : "Wallet deduction"}: {money(deductionToman(split, rate.usdToIrr))} {fa ? "تومان" : "Toman"}
          <span className="ms-2 text-muted-foreground" dir="ltr">
            ({formatUsd(split.walletDeduction, lang)} USD)
          </span>
        </p>
        <p data-gateway-toman={gatewayToman(split)} data-remaining-usd={split.remainingUsd} data-pay-mode={split.direct ? "direct" : "gateway"}>
          {fa ? "مبلغ قابل پرداخت در درگاه" : "Gateway amount"}: {money(gatewayToman(split))} {fa ? "تومان" : "Toman"}
        </p>
      </div>
    </div>
  );
}

export function SubscriptionModal({
  open,
  onOpenChange,
  plan,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && plan ? <SubscriptionForm plan={plan} onClose={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function SubscriptionForm({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const { copy, lang } = useI18n();
  const { currentUser } = useAuth();
  const router = useRouter();
  const { quote, settle } = useSplitCheckout();
  const [useWallet, setUseWallet] = useState(true);
  const [phase, setPhase] = useState<"form" | "gateway">("form");
  const [gatewayVisited, setGatewayVisited] = useState(false);
  const split = quote(plan.price, useWallet);
  const settled = useRef(false);
  const fa = lang === "fa";

  function complete() {
    if (settled.current) return;
    const result = settle(plan.price, useWallet, `اشتراک ${plan.name}`, plan.id);
    if (!result.ok) {
      if (result.reason === "auth") {
        toast.error(copy.pay.needAuth);
        router.push("/login");
      } else {
        toast.error(fa ? "موجودی کیف پول کافی نیست." : "The wallet balance is not enough.");
      }
      setPhase("form");
      return;
    }
    settled.current = true;
    toast.success(result.split.direct ? (fa ? "اشتراک با موجودی کیف پول فعال شد." : "The plan is active from your wallet.") : copy.pay.done);
    onClose();
  }

  useEffect(() => {
    if (phase !== "gateway") return;
    const timer = window.setTimeout(() => complete(), 500);
    return () => window.clearTimeout(timer);
  }, [phase]);

  function pay() {
    if (!currentUser) {
      toast.error(copy.pay.needAuth);
      router.push("/login");
      return;
    }
    if (split.direct) {
      complete();
      return;
    }
    setGatewayVisited(true);
    setPhase("gateway");
  }

  return (
    <div data-gateway-visited={gatewayVisited ? "true" : "false"} data-plan={plan.id}>
      <DialogHeader>
        <DialogTitle>{fa ? `اشتراک ${plan.name}` : plan.name}</DialogTitle>
        <DialogDescription>
          {fa ? "پرداخت ترکیبی از کیف پول دلاری و درگاه" : "Split the plan between your dollar wallet and the gateway."}
        </DialogDescription>
      </DialogHeader>
      {phase === "gateway" ? (
        <p className="text-sm leading-7" data-gateway-step="charge">
          {fa
            ? `در حال انتقال ${formatUsd(split.remainingUsd, lang)} دلار باقی‌مانده به درگاه…`
            : `Sending the remaining ${formatUsd(split.remainingUsd, lang)} USD to the gateway…`}
        </p>
      ) : (
        <>
          <WalletSplitFields planToman={plan.price} useWallet={useWallet} onToggle={setUseWallet} split={split} />
          <button type="button" className="mt-3 h-11 w-full rounded-2xl text-sm font-medium" style={goldButtonStyle} data-pay-cta onClick={pay}>
            {split.direct
              ? fa
                ? "فعال‌سازی مستقیم با موجودی کیف پول"
                : "Activate directly with wallet balance"
              : fa
                ? "پرداخت باقی‌مانده در درگاه"
                : "Pay the remainder at the gateway"}
          </button>
        </>
      )}
    </div>
  );
}
