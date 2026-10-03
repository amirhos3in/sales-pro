"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useGate } from "@/components/gates";
import { Button, buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toman } from "@/lib/format";
import { PLAN_RANK, PLANS, type PlanId } from "@/lib/plans";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SubscriptionScreen() {
  const router = useRouter();
  const { ready, user, purchase } = useStore();
  const { openPaywall } = useGate();
  const { copy } = useI18n();
  const [pending, setPending] = useState<PlanId | null>(null);
  const selected = PLANS.find((plan) => plan.id === pending) ?? null;

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
          سه سطح برای شروع خودآموز، اجرای حرفه‌ای و منتورینگ سازمانی. مبلغ از کیف پول همین حساب کم می‌شود.
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
      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const active = user?.plan === plan.id;
          const ownedHigher = Boolean(user?.plan && PLAN_RANK[user.plan] > PLAN_RANK[plan.id]);
          return (
            <article
              key={plan.id}
              className={cn(
                "flex flex-col rounded-3xl bg-card p-5 ring-1 ring-foreground/10",
                plan.highlight && "ring-2 ring-primary",
                plan.id === "pro" && "bg-[oklch(0.28_0.045_166)] text-[oklch(0.97_0.015_90)]",
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">پلن {plan.name}</h2>
                {plan.highlight ? (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] text-primary-foreground">
                    پیشنهاد
                  </span>
                ) : null}
              </div>
              <p className={cn("mt-2 min-h-12 text-sm leading-6", plan.id === "pro" ? "text-white/75" : "text-muted-foreground")}>
                {plan.audience}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <span className={cn("text-4xl font-semibold tracking-tight", plan.id === "pro" ? "text-[oklch(0.86_0.09_85)]" : "text-[oklch(0.42_0.1_62)]")}>
                  {plan.compact}
                </span>
                <span className="pb-1 text-sm">میلیون تومان</span>
              </div>
              <p className={cn("mt-1 text-xs", plan.id === "pro" ? "text-white/70" : "text-muted-foreground")}>
                {toman(plan.price)}
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm leading-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check className="mt-1 size-3.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  "mt-5 h-10",
                  plan.id === "pro" && "bg-[oklch(0.9_0.08_85)] text-[oklch(0.25_0.04_60)] hover:bg-[oklch(0.86_0.09_85)]",
                )}
                variant={active ? "outline" : "default"}
                disabled={active || ownedHigher}
                onClick={() => {
                  if (!user) {
                    sessionStorage.setItem("nexsell-next", "/subscription");
                    router.push("/login");
                    return;
                  }
                  setPending(plan.id);
                }}
              >
                {active ? "پلن فعال شما" : ownedHigher ? "پلن پایین‌تر" : "خرید این پلن"}
              </Button>
            </article>
          );
        })}
      </div>
      <p className="text-sm text-muted-foreground">
        موجودی کم است؟ از{" "}
        <Link href="/wallet" className={cn(buttonVariants({ variant: "link" }), "h-auto px-1")}>
          کیف پول
        </Link>{" "}
        شارژ آزمایشی بگیرید.
      </p>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأیید خرید پلن {selected?.name}</DialogTitle>
            <DialogDescription>
              {selected ? `${toman(selected.price)} از کیف پول کسر می‌شود و دسترسی درس‌های این سطح باز می‌شود.` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>
              انصراف
            </Button>
            <Button
              onClick={() => {
                if (!selected) return;
                const result = purchase(selected.id);
                if (result.ok) toast.success(result.message);
                else toast.error(result.message);
                setPending(null);
              }}
            >
              پرداخت از کیف پول
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
