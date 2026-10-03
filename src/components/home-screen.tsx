"use client";

import Link from "next/link";
import { categories, lessonsOf, pickText } from "@/lib/courses-data";
import { useGate } from "@/components/gates";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function HomeScreen() {
  const { copy, lang } = useI18n();
  const { ready, user } = useStore();
  const { openAuth, openPaywall } = useGate();
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
              onClick={openPaywall}
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

      <section className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/learn/${category.id}`}
            className="glass rounded-3xl p-5 shadow-xl transition hover:-translate-y-0.5"
          >
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
        ))}
      </section>

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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-foreground/5 px-3 py-3">
      <div className="text-sm font-semibold">{value}</div>
      <div className="mt-1 text-[11px] leading-5 text-muted-foreground">{label}</div>
    </div>
  );
}
