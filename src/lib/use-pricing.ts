"use client";

import { useEffect, useState } from "react";
import { emptyPricing, readPricing, type PricingState } from "@/lib/pricing";

export function usePricing() {
  const [state, setState] = useState<PricingState>(emptyPricing);

  useEffect(() => {
    const load = () => setState(readPricing());
    load();
    window.addEventListener("salespro-pricing", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("salespro-pricing", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return state;
}
