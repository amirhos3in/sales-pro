"use client";

import Link from "next/link";
import { frostStyle, goldButtonStyle } from "@/components/dashboard/style";
import type { AcademyUser } from "@/context/AuthContext";
import { localeNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { BUNDLE_GIFT_MINUTES, ownsCourse, PAID_COURSES } from "@/lib/pricing";
import { usePricing } from "@/lib/use-pricing";

export function OverviewTab({ user }: { user: AcademyUser }) {
  const { lang } = useI18n();
  const pricing = usePricing();
  const fa = lang === "fa";
  const hour = new Date().getHours();
  const hello = hour < 17 ? (fa ? "صبح بخیر" : "Good morning") : fa ? "عصر بخیر" : "Good evening";
  const owned = PAID_COURSES.filter((course) => ownsCourse(pricing, course.id));
  const stats = [
    {
      label: fa ? "دوره‌های فعال" : "Active courses",
      value: localeNumber(owned.length, lang),
      hint: pricing.bundle ? (fa ? "باندل کامل" : "Full bundle") : fa ? "از ۴ دوره تخصصی" : "of 4 specialist courses",
    },
    {
      label: fa ? "دقیقهٔ باقی‌مانده کوپایلوت" : "Copilot minutes left",
      value: localeNumber(pricing.minutes, lang),
      hint: pricing.bundle ? (fa ? `شامل هدیهٔ ${localeNumber(BUNDLE_GIFT_MINUTES, lang)} دقیقه` : `Includes the ${localeNumber(BUNDLE_GIFT_MINUTES, lang)}-minute gift`) : fa ? "هدیه فقط با باندل" : "The gift comes with the bundle",
    },
    {
      label: fa ? "کش‌بک تومانی" : "Toman cashback",
      value: localeNumber(pricing.cashbackToman, lang),
      hint: fa ? "۵٪ خرید و پاداش معرفی" : "5% of purchases plus referrals",
    },
  ];

  return (
    <div className="space-y-4" data-dashboard="overview">
      <section className="rounded-[28px] bg-[#0B132B] p-6 text-[#F8F1DE]" style={frostStyle}>
        <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{fa ? "پنل کاربری" : "Account"}</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          {hello} {user.name}
        </h1>
        <p className="mt-3 text-sm text-white/70" data-account-phone={user.phone}>
          {fa ? "موبایل" : "Mobile"}: <span dir="ltr">{user.phone}</span>
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-medium text-[#0B132B]">
            {pricing.bundle ? (fa ? "باندل کامل" : "Full bundle") : owned.length ? (fa ? `${localeNumber(owned.length, lang)} دوره فعال` : `${owned.length} active courses`) : fa ? "هنوز دوره‌ای خریداری نشده" : "No course purchased yet"}
          </span>
          {pricing.bundle ? (
            <span className="rounded-full border border-[#D4AF37]/60 px-3 py-1 text-xs text-[#D4AF37]">
              {fa ? "۵۰۰ دقیقه هدیه فعال است" : "500 gifted minutes are active"}
            </span>
          ) : null}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((item) => (
          <article key={item.label} className="glass rounded-[24px] p-4" style={frostStyle} data-stat={item.label}>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
          </article>
        ))}
      </div>

      <section className="glass rounded-[28px] p-5" style={frostStyle}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">{fa ? "وضعیت دوره‌ها" : "Course status"}</h2>
          <Link href="/#courses" className="inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-medium" style={goldButtonStyle}>
            {fa ? "خرید دوره یا باندل" : "Buy a course or the bundle"}
          </Link>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {PAID_COURSES.map((course) => {
            const active = ownsCourse(pricing, course.id);
            return (
              <li key={course.id} className="flex items-center justify-between rounded-2xl border border-[#D4AF37]/30 px-3 py-3 text-sm" data-owned={active ? "yes" : "no"} data-course={course.id}>
                <span>{fa ? course.fa : course.en}</span>
                <span className={active ? "text-[#D4AF37]" : "text-muted-foreground"}>{active ? (fa ? "فعال" : "Active") : fa ? "خریداری نشده" : "Not purchased"}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
