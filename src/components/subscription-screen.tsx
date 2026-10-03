"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { PricingSection } from "@/components/pricing/PricingSection";
import { useGate } from "@/components/gates";
import { Button, buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { toman } from "@/lib/format";
import { PLANS, type PlanId } from "@/lib/plans";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SubscriptionScreen() {
  const router = useRouter();
  const { ready, user, grantPlan } = useStore();
  const { openPaywall } = useGate();
  const { copy } = useI18n();
  const [pending, setPending] = useState<PlanId | null>(null);
  const selected = PLANS.find((plan) => plan.id === pending) ?? null;

  useEffect(() => {
    function scrollToPlans() {
      if (window.location.hash !== "#pricing-plans") return;
      document.getElementById("pricing-plans")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    scrollToPlans();
    window.addEventListener("hashchange", scrollToPlans);
    return () => window.removeEventListener("hashchange", scrollToPlans);
  }, []);

  return (
    <div className="space-y-6">
      <section className="glass flex flex-col gap-3 rounded-3xl p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{copy.sub.luxury}</h2>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">{copy.sub.luxuryBody}</p>
        </div>
        <Button className="h-11 bg-[#D4AF37] px-4 text-[#0B132B] hover:bg-[#E5C07B]" onClick={() => openPaywall()}>
          {copy.sub.open}
        </Button>
      </section>
      <header>
        <h1 className="text-2xl font-semibold">خرید اشتراک</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          سه دوره اشتراک: ماهانه، ۳ ماهه و سالانه. هر سه دسترسی کامل به چهار دوره آکادمی را باز می‌کنند و ۵٪ مبلغ درگاه به کیف پول برمی‌گردد.
        </p>
        {ready && user ? (
          <p className="mt-2 text-sm">
            موجودی: {toman(user.wallet)}
            {user.plan ? ` · پلن فعال: ${PLANS.find((plan) => plan.id === user.plan)?.name}` : " · هنوز اشتراکی فعال نیست"}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">برای خرید، اول وارد شوید.</p>
        )}
      </header>
      <PricingSection
        onSelect={(planId) => {
          if (!user) {
            sessionStorage.setItem("nexsell-next", "/subscription");
            router.push("/login");
            return;
          }
          setPending(planId);
        }}
      />
      <p className="text-sm text-muted-foreground">
        موجودی کم است؟ از{" "}
        <Link href="/wallet" className={cn(buttonVariants({ variant: "link" }), "h-auto px-1")}>
          کیف پول
        </Link>{" "}
        شارژ آزمایشی بگیرید.
      </p>

      <CheckoutModal
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setPending(null)}
        itemName={selected ? `اشتراک ${selected.name}` : ""}
        price={selected?.price ?? 0}
        onPaid={() => {
          if (selected) grantPlan(selected.id);
        }}
      />
    </div>
  );
}
