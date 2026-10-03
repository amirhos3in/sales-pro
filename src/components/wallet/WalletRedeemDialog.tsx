"use client";

import { toman } from "@/lib/format";
import type { Plan } from "@/lib/plans";
import { goldGlassButton } from "@/components/wallet/gold-glass";

export function WalletRedeemDialog({
  plan,
  open,
  onClose,
  onConfirm,
}: {
  plan: Plan | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open || !plan) return null;
  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[#0B132B]/60 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="glass w-full max-w-md rounded-[28px] p-6 shadow-2xl"
        style={{ backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)" }}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-sm leading-8">
          آیا مایلید پلن {plan.name} به ارزش {toman(plan.price)} را با استفاده از موجودی کیف پول خود فعال کنید؟
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="h-11 flex-1 rounded-2xl px-4 text-sm font-medium" style={goldGlassButton} onClick={onConfirm}>
            تأیید و فعال‌سازی
          </button>
          <button type="button" className="h-11 rounded-2xl px-4 text-sm ring-1 ring-white/20" onClick={onClose}>
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}
