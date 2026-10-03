"use client";

import { useState } from "react";
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
import { useSplitCheckout, WalletSplitFields } from "@/components/pricing/SubscriptionModal";
import { useI18n } from "@/lib/i18n";

export function CheckoutModal({
  open,
  onOpenChange,
  itemName,
  price,
  onPaid,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  price: number;
  onPaid?: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open ? (
          <CheckoutForm itemName={itemName} price={price} onPaid={onPaid} onClose={() => onOpenChange(false)} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export function CheckoutForm({
  itemName,
  price,
  onPaid,
  onClose,
}: {
  itemName: string;
  price: number;
  onPaid?: () => void;
  onClose?: () => void;
}) {
  const { copy, lang } = useI18n();
  const { currentUser } = useAuth();
  const router = useRouter();
  const { quote, settle } = useSplitCheckout();
  const [useWallet, setUseWallet] = useState(true);
  const [charging, setCharging] = useState(false);
  const split = quote(price, useWallet);
  const fa = lang === "fa";

  function pay() {
    if (!currentUser) {
      toast.error(copy.pay.needAuth);
      router.push("/login");
      return;
    }
    if (split.direct) {
      const result = settle(price, useWallet, itemName);
      if (!result.ok) {
        toast.error(fa ? "موجودی کیف پول کافی نیست." : "The wallet balance is not enough.");
        return;
      }
      onPaid?.();
      toast.success(fa ? "با موجودی کیف پول فعال شد." : "Activated from your wallet.");
      onClose?.();
      return;
    }
    setCharging(true);
    window.setTimeout(() => {
      const result = settle(price, useWallet, itemName);
      if (!result.ok) {
        toast.error(fa ? "موجودی کیف پول کافی نیست." : "The wallet balance is not enough.");
        setCharging(false);
        return;
      }
      onPaid?.();
      toast.success(copy.pay.done);
      onClose?.();
    }, 500);
  }

  return (
    <div data-gateway-visited={charging ? "true" : "false"}>
      <DialogHeader>
        <DialogTitle>{itemName}</DialogTitle>
        <DialogDescription>
          {fa ? "پرداخت ترکیبی از کیف پول دلاری و درگاه" : "Split the payment between your dollar wallet and the gateway."}
        </DialogDescription>
      </DialogHeader>
      {charging ? (
        <p className="text-sm leading-7" data-gateway-step="charge">
          {fa ? "در حال پرداخت باقی‌مانده در درگاه…" : "Paying the remainder at the gateway…"}
        </p>
      ) : (
        <>
          <WalletSplitFields planToman={price} useWallet={useWallet} onToggle={setUseWallet} split={split} />
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
