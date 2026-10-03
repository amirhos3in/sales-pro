"use client";

import { useState } from "react";
import { toast } from "sonner";
import { frostStyle, goldButtonStyle } from "@/components/dashboard/style";
import { CashbackBadge } from "@/components/ui/CashbackBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CashbackGoalBar } from "@/components/wallet/CashbackGoalBar";
import { useAuth, type AcademyUser, type WalletTx, type WalletTxKind } from "@/context/AuthContext";
import { settleCheckout } from "@/lib/checkout";
import { localeNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { PLAN_RANK, planById, type PlanId } from "@/lib/plans";
import { subscriptionForPlan } from "@/lib/subscription";
import { useStore } from "@/lib/store";

const PRESETS = [200_000, 500_000, 1_000_000];

export function WalletTab({ user }: { user: AcademyUser }) {
  const { copy, lang } = useI18n();
  const text = copy.dash;
  const { updateProfile } = useAuth();
  const { grantPlan, user: learner } = useStore();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(PRESETS[0]);
  const rows = user.transactions ?? [];
  const labels: Record<WalletTxKind, string> = {
    plan: text.txPlan,
    cashback: text.txCashback,
    topup: text.txTopup,
  };

  function stamp(value: string) {
    return new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", { dateStyle: "medium" }).format(new Date(value));
  }

  function activateFromBalance(planId: PlanId) {
    const plan = planById(planId);
    if (user.walletBalance < plan.price) return;
    const currentType = user.subscription?.isActive ? user.subscription.planType : null;
    const currentRank = currentType ? PLAN_RANK[currentType === "monthly" ? "eco" : currentType === "quarterly" ? "plus" : "pro"] : 0;
    if (currentRank >= PLAN_RANK[planId]) {
      toast.success(lang === "fa" ? "این پلن همین حالا فعال است." : "This plan is already active.");
      return;
    }
    const result = settleCheckout(user, `اشتراک ${plan.name}`, plan.price, true);
    updateProfile({
      ...result.patch,
      plan: "vip",
      subscription: subscriptionForPlan(plan.id),
    });
    if (learner) grantPlan(plan.id);
    toast.success(lang === "fa" ? `اشتراک ${plan.name} با موجودی کیف پول فعال شد.` : `${plan.name} is now active from your wallet.`);
  }

  function deposit() {
    const next: WalletTx = {
      id: crypto.randomUUID(),
      kind: "topup",
      amount,
      at: new Date().toISOString(),
    };
    updateProfile({
      walletBalance: user.walletBalance + amount,
      transactions: [next, ...rows],
    });
    setOpen(false);
    toast.success(text.deposited);
  }

  return (
    <div className="space-y-4">
      <section className="glass rounded-[28px] p-6" style={frostStyle}>
        <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{text.walletTitle}</p>
        <h1 className="mt-2 text-2xl font-semibold">{copy.session.wallet}</h1>
        <p className="mt-6 text-sm text-muted-foreground">{text.statWallet}</p>
        <p className="mt-1 text-4xl font-semibold">
          {localeNumber(user.walletBalance, lang)} <span className="text-lg font-medium">{text.toman}</span>
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {text.cashbackEarned}: {localeNumber(user.cashbackEarned, lang)} {text.toman}
        </p>
        <CashbackBadge amount={user.cashbackEarned} className="mt-3" />
        <div className="mt-6">
          <CashbackGoalBar onActivate={activateFromBalance} />
        </div>
        <button type="button" className="mt-2 h-11 rounded-2xl px-5 text-sm font-medium" style={goldButtonStyle} onClick={() => setOpen(true)}>
          {text.deposit}
        </button>
      </section>

      <section className="rounded-[28px] p-5" style={{ background: "linear-gradient(135deg, #D4AF37 0%, #F3E5AB 100%)", color: "#0B132B" }}>
        <p className="text-sm font-semibold">{text.txCashback}</p>
        <p className="mt-2 text-sm leading-7">{text.cashback}</p>
      </section>

      <section className="glass overflow-hidden rounded-[28px]" style={frostStyle}>
        <h2 className="px-5 pt-5 text-lg font-semibold">{text.txTitle}</h2>
        <div className="overflow-x-auto px-2 pb-2">
          <table className="w-full min-w-[28rem] text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="px-3 py-3 text-start font-medium">{text.txTitle}</th>
                <th className="px-3 py-3 text-start font-medium">{text.txAmount}</th>
                <th className="px-3 py-3 text-start font-medium">{text.txWhen}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[#D4AF37]/20">
                  <td className="px-3 py-3">
                    <span>{row.title || labels[row.kind]}</span>
                    {row.status === "success" ? (
                      <span className="ms-2 rounded-full bg-[#D4AF37] px-2 py-0.5 text-[10px] font-medium text-[#0B132B]">
                        {copy.pay.txSuccess}
                      </span>
                    ) : null}
                  </td>
                  <td className={`px-3 py-3 font-medium ${row.amount < 0 ? "text-rose-600 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300"}`}>
                    {row.amount > 0 ? "+" : ""}
                    {localeNumber(row.amount, lang)} {text.toman}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{stamp(row.at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{text.depositTitle}</DialogTitle>
            <DialogDescription>{text.depositHint}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={amount === preset}
                onClick={() => setAmount(preset)}
                className="h-11 rounded-2xl border border-[#D4AF37]/40 text-sm"
                style={amount === preset ? goldButtonStyle : undefined}
              >
                {localeNumber(preset, lang)} {text.toman}
              </button>
            ))}
          </div>
          <button type="button" className="h-11 rounded-2xl text-sm font-medium" style={goldButtonStyle} onClick={deposit}>
            {text.depositConfirm}
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
