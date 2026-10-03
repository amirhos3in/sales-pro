"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CashbackBadge } from "@/components/ui/CashbackBadge";
import { goldButtonStyle } from "@/components/dashboard/style";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { calculateCashback, quoteCashback, finalPayablePrice } from "@/lib/cashback";
import { cashbackToast, settleCheckout } from "@/lib/checkout";
import { localeNumber } from "@/lib/format";
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
  const { currentUser, updateProfile } = useAuth();
  const router = useRouter();
  const [useWallet, setUseWallet] = useState(true);
  const payable = finalPayablePrice(price, price);
  const walletUsed = useWallet ? currentUser?.walletBalance ?? 0 : 0;
  const quote = quoteCashback(payable, walletUsed);

  function pay() {
    if (!currentUser) {
      toast.error(copy.pay.needAuth);
      router.push("/login");
      return;
    }
    const result = settleCheckout(currentUser, itemName, price, useWallet);
    updateProfile(result.patch);
    onPaid?.();
    if (result.quote.cashback > 0) {
      const amountLabel = lang === "fa"
        ? localeNumber(result.quote.cashback, "fa")
        : localeNumber(result.quote.cashback, "en");
      toast.success(cashbackToast(amountLabel, lang));
    } else {
      toast.success(copy.pay.done);
    }
    onClose?.();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{itemName}</DialogTitle>
        <DialogDescription>
          {copy.sub.finalPrice}: {localeNumber(payable, lang)} {copy.dash.toman}
        </DialogDescription>
      </DialogHeader>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={useWallet}
          onChange={(event) => setUseWallet(event.target.checked)}
          className="size-4 accent-[#D4AF37]"
        />
        <span>{copy.pay.useWallet}</span>
      </label>
      <p className="text-sm text-muted-foreground">
        {copy.sub.fromWallet}: {localeNumber(quote.walletAmount, lang)} {copy.dash.toman}
      </p>
      <p className="text-sm">
        {copy.pay.gatewayDue}: {localeNumber(quote.gatewayAmount, lang)} {copy.dash.toman}
      </p>
      <CashbackBadge amount={calculateCashback(quote.gatewayAmount)} />
      {quote.cashback === 0 ? <p className="text-sm text-muted-foreground">{copy.sub.noCashback}</p> : null}
      <button type="button" className="h-11 rounded-2xl text-sm font-medium" style={goldButtonStyle} onClick={pay}>
        {copy.pay.buy}
      </button>
    </>
  );
}
