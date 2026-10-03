"use client";

import Link from "next/link";
import { frostStyle, goldButtonStyle } from "@/components/dashboard/style";
import { continueHref } from "@/components/courses/CourseCard";
import type { AcademyUser } from "@/context/AuthContext";
import { categories, lessonsOf, pickText } from "@/lib/courses-data";
import { localeNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { normalizeSubscription } from "@/lib/subscription";
import { useStore } from "@/lib/store";

const premiumIds = ["online", "hozuri", "telefoni", "mozakerah"] as const;

export function MyCoursesTab({ user }: { user: AcademyUser }) {
  const { copy, lang } = useI18n();
  const text = copy.dash;
  const { user: learner } = useStore();
  const passed = learner?.passed ?? [];
  const subscription = normalizeSubscription(user.subscription);
  const tracks = premiumIds.flatMap((id) => {
    const category = categories.find((item) => item.id === id);
    return category ? [category] : [];
  });
  const lessonCount = tracks.reduce((sum, category) => sum + lessonsOf(category).length, 0);
  const doneCount = tracks.reduce(
    (sum, category) => sum + lessonsOf(category).filter((row) => passed.includes(row.lesson.id)).length,
    0,
  );
  const overall = lessonCount ? Math.round((doneCount / lessonCount) * 100) : 0;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{copy.session.courses}</p>
        <h1 className="mt-2 text-2xl font-semibold">{copy.session.courses}</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{text.coursesLead}</p>
      </div>

      {subscription.isActive ? (
        <>
          <section className="glass rounded-[28px] p-5" style={frostStyle}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium">{text.overallProgress}</h2>
              <span className="text-sm font-semibold text-[#D4AF37]">
                {localeNumber(overall, lang)}
                {lang === "fa" ? "٪" : "%"}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#0B132B]/10 dark:bg-white/10">
              <div className="h-full rounded-full bg-[#D4AF37]" style={{ width: `${overall}%` }} />
            </div>
          </section>
          <div className="grid gap-3 sm:grid-cols-2">
            {tracks.map((category) => {
              const lessons = lessonsOf(category);
              const done = lessons.filter((row) => passed.includes(row.lesson.id)).length;
              const percent = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
              return (
                <article key={category.id} className="glass flex flex-col rounded-[28px] p-5" style={frostStyle}>
                  <h2 className="text-lg font-semibold">{pickText(category.title, lang)}</h2>
                  <p className="mt-4 text-sm text-muted-foreground">{text.overallProgress}</p>
                  <div className="mt-2">
                    <div className="mb-1 text-xs text-muted-foreground">
                      {localeNumber(percent, lang)}
                      {lang === "fa" ? "٪" : "%"}
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#0B132B]/10 dark:bg-white/10">
                      <div className="h-full rounded-full bg-[#D4AF37]" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                  <Link
                    href={continueHref(category, passed)}
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-medium"
                    style={goldButtonStyle}
                  >
                    {text.continueLearning}
                  </Link>
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <section className="rounded-[28px] p-6 shadow-xl" style={{ background: "linear-gradient(135deg, #D4AF37 0%, #F3E5AB 100%)", color: "#0B132B" }}>
          <h2 className="text-lg font-semibold">{text.renewTitle}</h2>
          <p className="mt-2 text-sm leading-7">{text.renewBody}</p>
          <Link
            href="/subscription#pricing-plans"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B132B] px-4 text-sm font-medium text-[#F3E5AB]"
          >
            {text.renewCta}
          </Link>
        </section>
      )}
    </div>
  );
}
