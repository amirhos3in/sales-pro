"use client";

import { DAILY_CALL_QUOTA, useCallQuota } from "@/hooks/useCallQuota";
import { localeNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export function QuotaBadge() {
  const { lang } = useI18n();
  const { remainingCalls } = useCallQuota();
  const remaining = localeNumber(remainingCalls, lang);
  const total = localeNumber(DAILY_CALL_QUOTA, lang);
  const label =
    lang === "fa"
      ? `سهمیه امروز شما: ${remaining} از ${total} تماس باقی مانده`
      : `Today's Quota: ${remaining} of ${total} calls remaining`;

  return (
    <p className="inline-flex items-center rounded-full border border-[#D4AF37] bg-white/70 px-3.5 py-1.5 text-xs leading-5 text-[#0B132B] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-md dark:bg-[#0F1C3F]/55 dark:text-[#F3E5AB]">
      {label}
    </p>
  );
}
