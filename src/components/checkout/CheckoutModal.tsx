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
      toast.success(fa ? "دسترسی آزمایشی روی همین مرورگر است. پرداخت بانکی نیست." : "Trial access stays in this browser. This is not a bank payment.");
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
          {fa ? "پرداخت بانکی نیست. دسترسی آزمایشی روی همین مرورگر است." : "This is not a bank payment. Trial access stays in this browser."}
        </DialogDescription>
      </DialogHeader>
      {charging ? (
        <p className="text-sm leading-7" data-gateway-step="charge">
          {fa ? "پرداخت بانکی نیست." : "This is not a bank payment."}
        </p>
      ) : (
        <>
          <WalletSplitFields planToman={price} useWallet={useWallet} onToggle={setUseWallet} split={split} />
          <button type="button" className="mt-3 h-11 w-full rounded-2xl text-sm font-medium" style={goldButtonStyle} data-pay-cta onClick={pay}>
            {split.direct
              ? fa
                ? "ثبت دسترسی آزمایشی روی همین مرورگر"
                : "Save trial access in this browser"
              : fa
                ? "ثبت دسترسی آزمایشی روی همین مرورگر"
                : "Save trial access in this browser"}
          </button>
        </>
      )}
    </div>
  );
}
