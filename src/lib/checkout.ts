import type { AcademyUser, WalletTx } from "@/context/AuthContext";
import { cashbackForPayment, finalPayablePrice, quoteCashback, type CashbackQuote } from "@/lib/cashback";
import type { RewardAction } from "@/types/wallet";

const PAYMENT_CASHBACK: RewardAction = "payment_cashback";

export function settleCheckout(user: AcademyUser, itemName: string, price: number, useWallet: boolean) {
  const quote: CashbackQuote = quoteCashback(finalPayablePrice(price, price), useWallet ? user.walletBalance : 0);
  const cashback = cashbackForPayment(quote.gatewayAmount, quote.walletAmount);
  const at = new Date().toISOString();
  const transactions: WalletTx[] = [];
  if (cashback > 0) {
    transactions.push({
      id: crypto.randomUUID(),
      kind: "cashback",
      actionType: PAYMENT_CASHBACK,
      amount: cashback,
      at,
      title: `هدیه کش‌بک ۵٪ خرید ${itemName}`,
      status: "success",
    });
  }
  if (quote.walletAmount > 0) {
    transactions.push({
      id: crypto.randomUUID(),
      kind: "plan",
      amount: -quote.walletAmount,
      at,
      title: itemName,
      status: "success",
    });
  }
  return {
    quote,
    patch: {
      walletBalance: user.walletBalance - quote.walletAmount + cashback,
      cashbackEarned: user.cashbackEarned + cashback,
      transactions: [...transactions, ...(user.transactions ?? [])],
    },
  };
}

export function cashbackToast(amountLabel: string, lang: "fa" | "en") {
  if (lang === "fa") return `تبریک! مبلغ ${amountLabel} تومان کش‌بک به کیف پول شما واریز شد.`;
  return `Congrats! ${amountLabel} Toman cashback was added to your wallet.`;
}
