"use client";

import Link from "next/link";
import { frostStyle, goldButtonStyle } from "@/components/dashboard/style";
import type { AcademyUser } from "@/context/AuthContext";
import { DAILY_CALL_QUOTA, useCallQuota } from "@/hooks/useCallQuota";
import { categories, lessonsOf } from "@/lib/courses-data";
import { localeNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

const VIP_EXPIRES = "2026-12-31T12:00:00";

function coursesInProgress(passed: string[]) {
  return categories.filter((category) => {
    const ids = lessonsOf(category).map((item) => item.lesson.id);
    const done = ids.filter((id) => passed.includes(id)).length;
    return done > 0 && done < ids.length;
  }).length;
}

export function OverviewTab({ user }: { user: AcademyUser }) {
  const { copy, lang } = useI18n();
  const text = copy.dash;
  const { user: learner } = useStore();
  const { remainingCalls } = useCallQuota();
  const hour = new Date().getHours();
  const hello = hour < 17 ? text.morning : text.evening;
  const learning = coursesInProgress(learner?.passed ?? []);
  const analyses = DAILY_CALL_QUOTA - remainingCalls;
  const active = Boolean(user.subscription?.isActive);
  const expiry = new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", { dateStyle: "long" }).format(
    new Date(user.subscription?.expiresAt ?? VIP_EXPIRES),
  );
  const stats = [
    { label: text.statCourses, value: localeNumber(learning, lang) },
    { label: text.statAnalyses, value: localeNumber(analyses, lang), hint: text.analysesToday },
    {
      label: text.statQuota,
      value: `${localeNumber(remainingCalls, lang)} ${text.of} ${localeNumber(DAILY_CALL_QUOTA, lang)} ${text.calls}`,
    },
    { label: text.statWallet, value: `${localeNumber(user.walletBalance, lang)} ${text.toman}` },
  ];

  return (
    <div className="space-y-4">
      <section className="glass rounded-[28px] p-6" style={frostStyle}>
        <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{text.overviewTitle}</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          {hello} {user.name}
        </h1>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex w-fit rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-medium text-[#0B132B]">
            {active ? text.vipPlan : text.freePlan}
          </span>
          <div className="glass flex flex-1 flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between" style={frostStyle}>
            <div>
              <p className="text-xs text-[#D4AF37]">{text.expiry}</p>
              <p className="mt-1 text-sm font-medium">{active ? expiry : text.noPlan}</p>
            </div>
            <Link href="/subscription" className="inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-medium" style={goldButtonStyle}>
              {copy.home.upgrade}
            </Link>
          </div>
        </div>
      </section>
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((item) => (
          <article key={item.label} className="glass rounded-[24px] p-4" style={frostStyle}>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold">{item.value}</p>
            {item.hint ? <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
