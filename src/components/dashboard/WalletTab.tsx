"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { frostStyle, goldButtonStyle } from "@/components/dashboard/style";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth, type AcademyUser, type WalletTx, type WalletTxKind } from "@/context/AuthContext";
import { localeNumber, toman } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { ensureReferralCode, recordReferral, REFERRAL_REWARD } from "@/lib/pricing";
import { usePricing } from "@/lib/use-pricing";

const PRESETS = [200_000, 500_000, 1_000_000];

export function WalletTab({ user }: { user: AcademyUser }) {
  const { copy, lang } = useI18n();
  const text = copy.dash;
  const fa = lang === "fa";
  const { updateProfile } = useAuth();
  const pricing = usePricing();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(PRESETS[0]);
  const rows = user.transactions ?? [];
  const labels: Record<WalletTxKind, string> = {
    plan: text.txPlan,
    cashback: text.txCashback,
    topup: text.txTopup,
  };

  useEffect(() => {
    ensureReferralCode();
  }, []);

  function money(value: number) {
    return localeNumber(value, lang);
  }

  function stamp(value: string) {
    return new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", { dateStyle: "medium" }).format(new Date(value));
  }

  function deposit() {
    const next: WalletTx = {
      id: crypto.randomUUID(),
      kind: "topup",
      amount,
      at: new Date().toISOString(),
      title: fa ? "شارژ اعتبار تومانی" : "Toman credit top-up",
    };
    updateProfile({
      walletBalance: user.walletBalance + amount,
      transactions: [next, ...rows],
    });
    setOpen(false);
    toast.success(text.deposited);
  }

  function refer() {
    recordReferral();
    toast.success(fa ? `${toman(REFERRAL_REWARD)} پاداش معرفی ثبت شد.` : `${toman(REFERRAL_REWARD)} referral reward saved.`);
  }

  return (
    <div className="space-y-4" data-dashboard="wallet">
      <section className="rounded-[28px] bg-[#0B132B] p-6 text-[#F8F1DE]">
        <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{fa ? "کیف دقیقه" : "Minutes wallet"}</p>
        <h1 className="mt-2 text-2xl font-semibold">{fa ? "دقیقهٔ باقی‌مانده کوپایلوت" : "Remaining copilot minutes"}</h1>
        <p className="mt-6 text-4xl font-semibold text-[#D4AF37]" data-minute-balance={pricing.minutes}>
          {money(pricing.minutes)} <span className="text-lg font-medium text-[#F8F1DE]">{fa ? "دقیقه" : "min"}</span>
        </p>
        <p className="mt-3 text-sm leading-7 text-white/70">
          {pricing.bundle
            ? fa
              ? "باندل کامل خریده شده و ۵۰۰ دقیقه هدیه داخل همین موجودی است."
              : "The full bundle is purchased, and the 500-minute gift is inside this balance."
            : fa
              ? "دقیقه جدا از دوره است. هدیهٔ ۵۰۰ دقیقه فقط با خرید باندل اضافه می‌شود."
              : "Minutes are separate from courses. The 500-minute gift is added only with the bundle."}
        </p>
        <Link href="/#copilot-minutes" className="mt-5 inline-flex h-11 items-center rounded-2xl bg-[#D4AF37] px-4 text-sm font-semibold text-[#0B132B]">
          {fa ? "خرید دقیقه با اسلایدر" : "Buy minutes with the slider"}
        </Link>
      </section>

      <section className="glass rounded-[28px] p-6" style={frostStyle}>
        <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{fa ? "وفاداری تومانی" : "Toman loyalty"}</p>
        <h2 className="mt-2 text-xl font-semibold">{text.cashbackEarned}</h2>
        <p className="mt-4 text-3xl font-semibold" data-cashback-toman={pricing.cashbackToman}>
          {money(pricing.cashbackToman)} <span className="text-lg font-medium">{text.toman}</span>
        </p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{text.cashback}</p>
      </section>

      <section className="glass rounded-[28px] p-5" style={frostStyle}>
        <h2 className="text-lg font-semibold">{fa ? "معرفی دوستان" : "Referrals"}</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {fa
            ? `هر معرفی ثبت‌شده ${toman(REFERRAL_REWARD)} به کش‌بک تومانی اضافه می‌کند.`
            : `Each recorded referral adds ${toman(REFERRAL_REWARD)} in toman cashback.`}
        </p>
        <p className="mt-3 font-semibold" dir="ltr" data-referral-code={pricing.referralCode || "—"}>
          {pricing.referralCode || "—"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {fa ? `${money(pricing.referrals)} معرفی ثبت شده` : `${money(pricing.referrals)} referrals recorded`}
        </p>
        <button type="button" className="mt-4 h-11 rounded-2xl px-4 text-sm font-medium" style={goldButtonStyle} onClick={refer}>
          {fa ? "ثبت یک معرفی" : "Record a referral"}
        </button>
      </section>

      <section className="glass rounded-[28px] p-6" style={frostStyle}>
        <p className="text-sm text-muted-foreground">{fa ? "اعتبار تومانی حساب" : "Toman account credit"}</p>
        <p className="mt-1 text-3xl font-semibold">
          {money(user.walletBalance)} <span className="text-lg font-medium">{text.toman}</span>
        </p>
        <button type="button" className="mt-5 h-11 rounded-2xl px-5 text-sm font-medium" style={goldButtonStyle} onClick={() => setOpen(true)}>
          {text.deposit}
        </button>
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
              {rows.map((row) => {
                const signed = row.amount;
                const title = row.title || labels[row.kind];
                return (
                  <tr key={row.id} className="border-t border-[#D4AF37]/20">
                    <td className="px-3 py-3">{title}</td>
                    <td className={`px-3 py-3 font-medium ${signed < 0 ? "text-rose-600 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300"}`}>
                      {signed > 0 ? "+" : ""}
                      {money(signed)} {text.toman}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{stamp(row.at)}</td>
                  </tr>
                );
              })}
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
                {money(preset)} {text.toman}
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
