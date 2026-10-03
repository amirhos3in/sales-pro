export type CashbackQuote = {
  finalPrice: number;
  walletAmount: number;
  gatewayAmount: number;
  cashback: number;
};

function toman(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.floor(value);
}

/**
 * Five percent cashback is earned only on money paid through the gateway.
 * Wallet credit never generates cashback, even when it covers the whole price.
 */
export function cashbackForPayment(gatewayPayment: number, walletPayment = 0): number {
  void walletPayment;
  if (!Number.isFinite(gatewayPayment) || gatewayPayment <= 0) return 0;
  return Math.floor(gatewayPayment * 0.05);
}

/** Five percent of the bank-gateway amount, rounded down. Wallet-only payments return 0. */
export function calculateCashback(payableGatewayAmount: number): number {
  return cashbackForPayment(payableGatewayAmount, 0);
}

/**
 * The payable amount is the discounted price.
 * The crossed-out original price is not part of the result.
 */
export function finalPayablePrice(originalPrice: number, discountedPrice: number): number {
  void originalPrice;
  return toman(discountedPrice);
}

/** Applies wallet funds first. Cashback is calculated only on the gateway remainder. */
export function quoteCashback(discountedPrice: number, walletUsed: number): CashbackQuote {
  const finalPrice = toman(discountedPrice);
  const walletAmount = Math.min(finalPrice, toman(walletUsed));
  const gatewayAmount = finalPrice - walletAmount;
  return {
    finalPrice,
    walletAmount,
    gatewayAmount,
    cashback: cashbackForPayment(gatewayAmount, walletAmount),
  };
}
