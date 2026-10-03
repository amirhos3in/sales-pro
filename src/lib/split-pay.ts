import { irrToUsdAmount, usdToIrrAmount } from "@/lib/currency-rate";
import { cashbackUsd, roundUsd } from "@/lib/wallet-engine";

const TOMAN_TO_IRR = 10;

export type SplitPay = {
  planUsd: number;
  walletDeduction: number;
  remainingUsd: number;
  finalPayableIrr: number;
  finalPayableToman: number;
  direct: boolean;
  cashbackUsd: number;
};

/** Wallet covers the plan up to the dollar balance. Cashback is only on the gateway remainder. */
export function quoteSplitPay(planToman: number, walletUsd: number, usdToIrrRate: number, useWallet: boolean): SplitPay {
  const safeToman = Number.isFinite(planToman) ? Math.max(0, planToman) : 0;
  const planUsd = irrToUsdAmount(safeToman * TOMAN_TO_IRR, usdToIrrRate);
  const available = useWallet && Number.isFinite(walletUsd) ? Math.max(0, walletUsd) : 0;
  const walletDeduction = Math.min(available, planUsd);
  const remainingUsd = planUsd - walletDeduction;
  const finalPayableIrr = usdToIrrAmount(remainingUsd, usdToIrrRate);
  const direct = remainingUsd === 0 || finalPayableIrr === 0;
  return {
    planUsd,
    walletDeduction,
    remainingUsd,
    finalPayableIrr,
    finalPayableToman: finalPayableIrr / TOMAN_TO_IRR,
    direct,
    cashbackUsd: direct ? 0 : cashbackUsd(remainingUsd),
  };
}

export function gatewayToman(split: SplitPay) {
  return Math.round(split.finalPayableToman);
}

export function deductionToman(split: SplitPay, usdToIrrRate: number) {
  return Math.round(usdToIrrAmount(split.walletDeduction, usdToIrrRate) / TOMAN_TO_IRR);
}

export function spendableDeduction(split: SplitPay) {
  return roundUsd(split.walletDeduction);
}
