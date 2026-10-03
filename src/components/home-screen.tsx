"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { categories, lessonsOf, pickText, type Category } from "@/lib/courses-data";
import { useGate } from "@/components/gates";
import { calculateCashback } from "@/lib/cashback";
import { localeNumber } from "@/lib/format";
import { useI18n, type Lang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { CashbackBadge } from "@/components/ui/CashbackBadge";

export function HomeScreen() {
  const { copy, lang } = useI18n();
  const { ready, user } = useStore();
  const { openAuth, openPaywall } = useGate();
  const [buying, setBuying] = useState<Category | null>(null);
  const total = categories.reduce((sum, category) => sum + lessonsOf(category).length, 0);
  const passed = user?.passed.length ?? 0;
  const percent = total ? Math.round((passed / total) * 100) : 0;
  const next = categories
    .flatMap((category) => lessonsOf(category).map((item) => ({ category, lesson: item.lesson })))
    .find((item) => user && !user.passed.includes(item.lesson.id));

  return (
    <div className="space-y-8">
      <section className="glass relative overflow-hidden rounded-[2rem] p-6 shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute -top-16 end-0 size-48 rounded-full bg-[#D4AF37]/20 blur-3xl" />
        <p className="text-xs tracking-[0.18em] text-[#D4AF37]">{copy.home.kicker}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-[1.45] sm:text-4xl">
          {copy.home.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground">{copy.home.body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {ready && user ? (
            <button
              type="button"
              onClick={() => openPaywall()}
              className="h-11 rounded-2xl bg-[#D4AF37] px-4 text-sm font-medium text-[#0B132B]"
            >
              {copy.home.upgrade}
            </button>
          ) : (
            <button
              type="button"
              onClick={openAuth}
              className="h-11 rounded-2xl bg-[#D4AF37] px-4 text-sm font-medium text-[#0B132B]"
            >
              {copy.home.start}
            </button>
          )}
          {next ? (
            <Link
              href={`/learn/${next.category.id}/${next.lesson.id}`}
              className="inline-flex h-11 items-center rounded-2xl px-4 text-sm ring-1 ring-[color:var(--glass-border)]"
            >
              {copy.home.continue}
            </Link>
          ) : null}
        </div>
        {ready && user ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label={copy.home.passed} value={`${passed}/${total}`} />
            <Stat label={copy.menu.progress} value={`${percent}%`} />
            <Stat label={user.premiumTier === "vip" ? "VIP" : user.isPremium ? "Gold" : copy.home.premiumOff} value={user.isPremium ? copy.home.premiumOn : "—"} />
          </div>
        ) : null}
      </section>

      <MetricsStrip />

      <section className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <article key={category.id} className="glass rounded-3xl p-5 shadow-xl">
            <Link href={`/learn/${category.id}`} className="block transition hover:-translate-y-0.5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{pickText(category.title, lang)}</h2>
                <span className="rounded-full border border-[#D4AF37]/40 px-2 py-1 text-[11px] text-[#D4AF37]">
                  {category.premium ? copy.home.premiumBadge : copy.home.freeBadge}
                </span>
              </div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {pickText(category.description, lang)}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {lessonsOf(category).length} {copy.home.lessons}
              </p>
            </Link>
            {category.price > 0 ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {localeNumber(category.price, lang)} {copy.dash.toman}
                  </p>
                  <CashbackBadge amount={calculateCashback(category.price)} className="mt-2" />
                </div>
                <button
                  type="button"
                  className="h-10 rounded-2xl px-4 text-sm font-medium"
                  style={{ backgroundColor: "#D4AF37", color: "#0B132B" }}
                  onClick={() => setBuying(category)}
                >
                  {copy.pay.buyCourse}
                </button>
              </div>
            ) : null}
          </article>
        ))}
      </section>
      <CheckoutModal
        open={Boolean(buying)}
        onOpenChange={(open) => !open && setBuying(null)}
        itemName={buying ? pickText(buying.title, lang) : ""}
        price={buying?.price ?? 0}
      />

      <section className="glass rounded-3xl p-6">
        <h2 className="text-lg font-semibold">{copy.home.rulesTitle}</h2>
        <ol className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
          {copy.home.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

const metrics = [
  { key: "students", value: 5000, prefix: "+", suffix: "", label: "metricStudents" },
  { key: "hours", value: 120, prefix: "+", suffix: "", label: "metricHours" },
  { key: "satisfaction", value: 98, prefix: "", suffix: "%", label: "metricSatisfaction" },
  { key: "teams", value: 300, prefix: "+", suffix: "", label: "metricTeams" },
] as const;

function MetricsStrip() {
  const { copy, lang } = useI18n();
  return (
    <section className="glass relative overflow-hidden rounded-[2rem] p-5 shadow-2xl sm:p-7">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-lg font-semibold">{copy.home.metricsTitle}</h2>
        <p className="text-xs leading-6 text-muted-foreground">{copy.home.metricsHint}</p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.key}
            className="rounded-2xl border border-[#D4AF37]/35 bg-white/40 px-4 py-4 shadow-[inset_0_1px_0_rgba(212,175,55,0.35)] backdrop-blur-md dark:bg-[#0F1C3F]/40"
          >
            <p className="text-2xl font-semibold tracking-tight text-[#0B132B] dark:text-[#F3E5AB] sm:text-3xl">
              <CountUp
                value={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                lang={lang}
              />
            </p>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">{copy.home[metric.label]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CountUp({
  value,
  prefix,
  suffix,
  lang,
}: {
  value: number;
  prefix: string;
  suffix: string;
  lang: Lang;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const percent = suffix === "%";
    const paint = (current: number) => {
      const mark = percent ? (lang === "fa" ? "٪" : "%") : suffix;
      node.textContent = `${prefix}${localeNumber(current, lang)}${mark}`;
    };
    paint(0);
    let frame = 0;
    let started = false;
    const run = () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = reduce ? 1 : Math.min(1, (now - start) / 1300);
        const eased = 1 - (1 - progress) ** 3;
        paint(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !started) {
          started = true;
          run();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [lang, prefix, suffix, value]);

  return <span ref={ref}>{`${prefix}${localeNumber(0, lang)}${suffix === "%" ? (lang === "fa" ? "٪" : "%") : suffix}`}</span>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-foreground/5 px-3 py-3">
      <div className="text-sm font-semibold">{value}</div>
      <div className="mt-1 text-[11px] leading-5 text-muted-foreground">{label}</div>
    </div>
  );
}
