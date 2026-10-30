"use client";

import Link from "next/link";
import { frostStyle } from "@/components/dashboard/style";
import { continueHref } from "@/components/courses/CourseCard";
import type { AcademyUser } from "@/context/AuthContext";
import { categories, lessonsOf, pickText } from "@/lib/courses-data";
import { localeNumber, toman } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { BUNDLE_PRICE, COURSE_PRICE, ownsCourse, PAID_COURSES } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { usePricing } from "@/lib/use-pricing";

export function MyCoursesTab({ user }: { user: AcademyUser }) {
  const { lang } = useI18n();
  const fa = lang === "fa";
  const pricing = usePricing();
  const { user: learner } = useStore();
  const passed = learner?.passed ?? [];
  const watched = learner?.watched ?? [];
  const tracks = PAID_COURSES.flatMap((course) => {
    const category = categories.find((item) => item.id === course.id);
    return category ? [{ course, category }] : [];
  });

  return (
    <div className="space-y-4" data-dashboard="courses">
      <div>
        <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{fa ? "دوره‌های من" : "My courses"}</p>
        <h1 className="mt-2 text-2xl font-semibold">{fa ? "وضعیت خرید دوره‌ها" : "Purchased courses"}</h1>
        <p className="mt-1 text-sm text-muted-foreground" dir="ltr" data-account-phone={user.phone}>
          {user.phone}
        </p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {fa
            ? `هر مسیر ${toman(COURSE_PRICE)}. هر چهار مسیر، ${toman(BUNDLE_PRICE)}. یکی رایگان است. دسترسی آزمایشی روی همین مرورگر است و پرداخت بانکی نیست.`
            : `Each path is ${toman(COURSE_PRICE)}. All four paths are ${toman(BUNDLE_PRICE)}, and one is free. Trial access stays in this browser. This is not a bank payment.`}
        </p>
      </div>

      <article className="rounded-[28px] bg-[#0B132B] p-5 text-[#F8F1DE]" data-bundle-owned={pricing.bundle ? "yes" : "no"}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold">{fa ? "باندل کامل" : "Full bundle"}</h2>
          <span className="rounded-full bg-[#D4AF37] px-2.5 py-1 text-[11px] font-semibold text-[#0B132B]">
            {pricing.bundle
              ? fa
                ? "دسترسی آزمایشی روی همین مرورگر است"
                : "Trial access stays in this browser"
              : fa
                ? `هر چهار مسیر، ${toman(BUNDLE_PRICE)}. یکی رایگان است`
                : `All four paths, ${toman(BUNDLE_PRICE)}. One is free`}
          </span>
        </div>
        {pricing.bundle ? null : (
          <Link href="/#courses" className="mt-4 inline-flex h-11 items-center rounded-2xl bg-[#D4AF37] px-4 text-sm font-semibold text-[#0B132B]">
            {fa ? "خرید باندل و دریافت هدیه" : "Buy the bundle and claim the gift"}
          </Link>
        )}
      </article>

      <div className="grid gap-3 sm:grid-cols-2">
        {tracks.map(({ course, category }) => {
          const owned = ownsCourse(pricing, course.id);
          const lessons = lessonsOf(category);
          const videos = lessons.filter((row) => watched.includes(row.lesson.id)).length;
          const quizzes = lessons.filter((row) => passed.includes(row.lesson.id)).length;
          const videoPercent = lessons.length ? Math.round((videos / lessons.length) * 100) : 0;
          const quizPercent = lessons.length ? Math.round((quizzes / lessons.length) * 100) : 0;
          return (
            <article key={course.id} className="glass flex flex-col rounded-[28px] p-5" style={frostStyle} data-course={course.id} data-owned={owned ? "yes" : "no"}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">{pickText(category.title, lang)}</h2>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${owned ? "bg-[#D4AF37] text-[#0B132B]" : "bg-[#0B132B]/10 text-muted-foreground"}`}>
                  {owned ? (fa ? "دسترسی آزمایشی" : "Trial access") : fa ? "قفل" : "Locked"}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{toman(COURSE_PRICE)}</p>
              {owned ? (
                <>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {fa ? `ویدیوهای دیده‌شده: ${localeNumber(videos, lang)} از ${localeNumber(lessons.length, lang)}` : `Videos watched: ${localeNumber(videos, lang)} of ${localeNumber(lessons.length, lang)}`}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#0B132B]/10 dark:bg-white/10" data-video-progress={videoPercent}>
                    <div className="h-full rounded-full bg-[#D4AF37]" style={{ width: `${videoPercent}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {fa ? `چالش‌های قبول‌شده: ${localeNumber(quizzes, lang)} از ${localeNumber(lessons.length, lang)}` : `Quizzes passed: ${localeNumber(quizzes, lang)} of ${localeNumber(lessons.length, lang)}`}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#0B132B]/10 dark:bg-white/10" data-quiz-progress={quizPercent}>
                    <div className="h-full rounded-full bg-[#F3E5AB]" style={{ width: `${quizPercent}%` }} />
                  </div>
                  <Link href={continueHref(category, passed)} className="mt-5 inline-flex h-10 items-center justify-center rounded-2xl border-2 border-[#D4AF37] bg-[#0B132B] px-4 text-sm font-medium text-[#D4AF37]">
                    {fa ? "ورود به دوره و مشاهده ویدیوها" : "Enter the course and watch"}
                  </Link>
                </>
              ) : (
                <Link href="/#courses" className="mt-5 inline-flex h-10 items-center justify-center rounded-2xl bg-[#0B132B] px-4 text-sm font-medium text-[#F3E5AB]">
                  {fa ? `ثبت‌نام این دوره (${toman(COURSE_PRICE)})` : "Buy this course"}
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
