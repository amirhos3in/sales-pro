"use client";

import { toast } from "sonner";
import { frostStyle, goldButtonStyle } from "@/components/dashboard/style";
import { useWalletContext } from "@/lib/walletContext";
import { ACTION_REWARD_USD } from "@/lib/wallet-engine";
import { useI18n } from "@/lib/i18n";
import type { RewardAction } from "@/types/wallet";

const CLAIMS = ["ai_first_audit", "course_completion", "referral_bonus"] as const satisfies readonly RewardAction[];

const LABELS: Record<(typeof CLAIMS)[number], { fa: string; en: string }> = {
  ai_first_audit: { fa: "اولین تحلیل هوش مصنوعی", en: "First AI audit" },
  course_completion: { fa: "تکمیل دوره", en: "Course completion" },
  referral_bonus: { fa: "دعوت دوست", en: "Referral" },
};

function rewardLabel(action: RewardAction, fa: boolean) {
  if (action === "payment_cashback") return fa ? "کش‌بک ۵٪ درگاه" : "5% gateway cashback";
  return fa ? LABELS[action].fa : LABELS[action].en;
}

function formatUsd(value: number, lang: "fa" | "en") {
  return new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function UsdWalletCard() {
  const { lang } = useI18n();
  const { ready, walletUsd, transactions, claimedActions, claimActionReward } = useWalletContext();
  const fa = lang === "fa";

  function claim(action: (typeof CLAIMS)[number]) {
    const ok = claimActionReward(action);
    if (!ok) return;
    const amount = formatUsd(ACTION_REWARD_USD[action], lang);
    toast.success(fa ? `${amount} دلار به کیف پول اضافه شد.` : `${amount} USD added to your wallet.`);
  }

  return (
    <section className="glass rounded-[28px] p-5" style={frostStyle} data-wallet-ready={ready ? "true" : "false"}>
      <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{fa ? "پاداش دلاری" : "Dollar rewards"}</p>
      <p className="mt-2 text-sm text-muted-foreground">{fa ? "موجودی قابل استفاده" : "Available balance"}</p>
      <p className="mt-1 text-3xl font-semibold" data-wallet-usd={walletUsd}>
        {formatUsd(walletUsd, lang)} <span className="text-lg font-medium">{fa ? "دلار" : "USD"}</span>
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {CLAIMS.map((action) => {
          const claimed = claimedActions.includes(action);
          return (
            <button
              key={action}
              type="button"
              data-reward={action}
              disabled={!ready || claimed}
              onClick={() => claim(action)}
              className="h-11 rounded-2xl px-3 text-sm font-medium disabled:opacity-50"
              style={goldButtonStyle}
            >
              {fa ? LABELS[action].fa : LABELS[action].en}
              <span className="ms-1 text-xs">+{formatUsd(ACTION_REWARD_USD[action], lang)}</span>
            </button>
          );
        })}
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {transactions.length === 0 ? <li className="text-muted-foreground">{fa ? "هنوز پاداش دلاری ثبت نشده." : "No dollar rewards yet."}</li> : null}
        {transactions.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between gap-3 border-t border-[#D4AF37]/20 pt-2" data-reward-tx={entry.actionType} data-expired={entry.expired ? "true" : "false"}>
            <span className={entry.expired ? "text-muted-foreground line-through" : ""}>
              {rewardLabel(entry.actionType, fa)}
              {entry.expired ? (fa ? " · منقضی" : " · expired") : null}
            </span>
            <span className="font-medium">{formatUsd(entry.amountUsd, lang)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
