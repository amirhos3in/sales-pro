"use client";

import { PricingTracks } from "@/components/pricing/PricingTracks";

export function SubscriptionScreen() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-[#F6F1E4]">قیمت چهار مسیر</h1>
        <p className="mt-3 max-w-2xl text-sm leading-8 text-[#F6F1E4]">هر مسیر یک عدد کنار خودش دارد.</p>
      </header>
      <PricingTracks />
    </div>
  );
}
