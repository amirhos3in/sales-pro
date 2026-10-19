"use client";

import Link from "next/link";
import { PricingTracks } from "@/components/pricing/PricingTracks";
import { useGate } from "@/components/gates";
import { Button, buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { toman } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SubscriptionScreen() {
  const { ready, user } = useStore();
  const { openPaywall } = useGate();
  const { copy, lang } = useI18n();
  const fa = lang === "fa";

  return (
    <div className="space-y-6">
      <section className="glass flex flex-col gap-3 rounded-3xl p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{fa ? "دو مسیر جدا برای خرید" : "Two separate ways to buy"}</h2>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            {fa
              ? "دوره‌ها و باندل یک مسیرند. دقیقهٔ کوپایلوت مسیر دیگری است و با اسلایدر حساب می‌شود."
              : "Courses and the bundle are one track. Copilot minutes are another, priced with the slider."}
          </p>
        </div>
        <Button className="h-11 bg-[#D4AF37] px-4 text-[#0B132B] hover:bg-[#E5C07B]" onClick={() => openPaywall()}>
          {copy.sub.open}
        </Button>
      </section>
      <header>
        <h1 className="text-2xl font-semibold">{fa ? "دوره‌ها و دقیقهٔ هوش مصنوعی" : "Courses and AI minutes"}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          {fa
            ? "هر دوره تخصصی ۵ میلیون تومان است. باندل چهار دوره ۱۶ میلیون تومان است و ۵۰۰ دقیقه کوپایلوت هدیه می‌دهد. دقیقهٔ اضافه را جدا، از هزار تا بیست هزار، بخرید."
            : "Each specialist course is 5,000,000 Tomans. The four-course bundle is 16,000,000 Tomans and gifts 500 copilot minutes. Extra minutes are bought separately, from 1,000 to 20,000."}
        </p>
        {ready && user ? (
          <p className="mt-2 text-sm">
            {fa ? "موجودی کیف پول" : "Wallet"}: {toman(user.wallet)}
          </p>
        ) : null}
      </header>
      <PricingTracks />
      <p className="text-sm text-muted-foreground">
        {fa ? "موجودی کم است؟ از" : "Need balance? Use the"}{" "}
        <Link href="/wallet" className={cn(buttonVariants({ variant: "link" }), "h-auto px-1")}>
          {fa ? "کیف پول" : "wallet"}
        </Link>{" "}
        {fa ? "شارژ آزمایشی بگیرید." : "for a practice top-up."}
      </p>
    </div>
  );
}
