"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { lessonsOf, pickText, type Category, type CourseTier } from "@/lib/courses-data";
import { toman } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import {
  BUNDLE_GIFT_MINUTES,
  BUNDLE_LIST_PRICE,
  BUNDLE_PRICE,
  BUNDLE_SAVE,
  buyBundle,
  buyCourse,
  COURSE_PRICE,
  emptyPricing,
  ownsCourse,
  PAID_COURSES,
  readPricing,
  type PaidCourseId,
  type PricingState,
} from "@/lib/pricing";
import { normalizeSubscription } from "@/lib/subscription";
import { useStore } from "@/lib/store";

const frost = { backdropFilter: "blur(16px) saturate(1.6)" };
const goldButton = { backgroundColor: "#D4AF37", color: "#0B132B" };

export function useCourseAccess() {
  const { user } = useStore();
  const { currentUser, isAuthenticated } = useAuth();
  const [pricing, setPricing] = useState<PricingState>(emptyPricing);
  const academy = normalizeSubscription(currentUser?.subscription);
  const learner = normalizeSubscription(user?.subscription);
  const legacyOpen = academy.isActive || learner.isActive;

  useEffect(() => {
    const load = () => setPricing(readPricing());
    load();
    window.addEventListener("salespro-pricing", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("salespro-pricing", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return {
    user,
    pricing,
    subscribed: legacyOpen,
    courseOpen: (courseId: string) => courseId === "free" || legacyOpen || ownsCourse(pricing, courseId),
    authenticated: isAuthenticated || Boolean(user),
    passed: user?.passed ?? [],
  };
}

export function continueHref(category: Category, passed: string[]) {
  const lessons = lessonsOf(category);
  const next = lessons.find((item) => !passed.includes(item.lesson.id)) ?? lessons[0];
  return next ? `/learn/${category.id}/${next.lesson.id}` : `/learn/${category.id}`;
}

function isPaidCourse(id: string): id is PaidCourseId {
  return PAID_COURSES.some((course) => course.id === id);
}

export function CourseStatusBadge({ tier }: { tier: CourseTier }) {
  const { copy } = useI18n();
  if (tier !== "free") return null;
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full border border-emerald-400/45 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-200"
      style={frost}
    >
      {copy.home.freeTrack}
    </span>
  );
}

export function CourseCta({ category }: { category: Category }) {
  const { lang } = useI18n();
  const { pricing, passed } = useCourseAccess();
  const fa = lang === "fa";
  const paid = isPaidCourse(category.id);
  const owned = !paid || ownsCourse(pricing, category.id);

  if (owned) {
    return (
      <Link
        href={continueHref(category, passed)}
        className="inline-flex h-11 w-full items-center justify-center rounded-2xl px-4 text-sm font-semibold"
        style={goldButton}
        data-course-action="enter"
      >
        {paid ? (fa ? "ورود به دوره و مشاهده ویدیوها" : "Enter the course and watch") : fa ? "مشاهده ویدیوها" : "Watch the videos"}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[#0B132B] px-4 text-sm font-semibold text-[#F3E5AB]"
      data-course-action="buy"
      onClick={() => {
        buyCourse(category.id as PaidCourseId);
        toast.success(fa ? `«${pickText(category.title, lang)}» ثبت شد و روی همین مرورگر باز است.` : "This course is now open in this browser.");
      }}
    >
      {fa ? "ثبت‌نام این دوره" : "Enroll in this course"}
    </button>
  );
}

export function BundleBanner() {
  const { lang } = useI18n();
  const { pricing } = useCourseAccess();
  const fa = lang === "fa";

  return (
    <article id="bundle" className="rounded-[28px] bg-[#0B132B] p-5 text-[#F8F1DE] shadow-xl sm:p-7" data-offer="bundle">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-semibold sm:text-2xl">{fa ? "باندل کامل چهار دوره تخصصی" : "Full bundle of the four specialist courses"}</h2>
        <span className="rounded-full bg-[#D4AF37] px-2.5 py-1 text-[11px] font-semibold text-[#0B132B]">
          {fa ? `هدیه: ${BUNDLE_GIFT_MINUTES.toLocaleString("fa-IR")} دقیقه رایگان کوپایلوت` : `Gift: ${BUNDLE_GIFT_MINUTES.toLocaleString("en-US")} free copilot minutes`}
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
        {fa
          ? "فروش آنلاین، حضوری، تلفنی و مذاکره با هم باز می‌شوند. به‌جای ۲۰ میلیون، ۱۶ میلیون تومان؛ ۴ میلیون تومان کمتر، به‌علاوه هدیهٔ دقیقه."
          : "Online, in-person, telephone, and negotiation open together: 16 million instead of 20 million Tomans, plus the minute gift."}
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <p className="text-3xl font-semibold text-[#D4AF37] sm:text-4xl" data-bundle-price={BUNDLE_PRICE}>
          {toman(BUNDLE_PRICE)}
        </p>
        <p className="pb-1 text-sm text-white/50 line-through">{toman(BUNDLE_LIST_PRICE)}</p>
        <p className="pb-1 text-sm text-[#D4AF37]">{fa ? `${toman(BUNDLE_SAVE)} تخفیف` : `${toman(BUNDLE_SAVE)} off`}</p>
      </div>
      <button
        type="button"
        disabled={pricing.bundle}
        onClick={() => {
          const already = readPricing().bundle;
          buyBundle();
          toast.success(already ? (fa ? "باندل از قبل فعال است." : "The bundle is already active.") : fa ? "باندل فعال شد و ۵۰۰ دقیقه کوپایلوت هدیه اضافه شد." : "The bundle is active, with 500 gifted minutes.");
        }}
        className="mt-5 inline-flex h-12 items-center rounded-2xl bg-[#D4AF37] px-5 text-sm font-semibold text-[#0B132B] disabled:opacity-60"
      >
        {pricing.bundle ? (fa ? "باندل فعال است" : "Bundle active") : fa ? "خرید باندل کامل" : "Buy the full bundle"}
      </button>
    </article>
  );
}

export function CourseCard({ category }: { category: Category }) {
  const { copy, lang } = useI18n();
  return (
    <article className="glass flex flex-col rounded-3xl p-5 shadow-xl" data-course={category.id}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">
          <Link href={`/learn/${category.id}`} className="transition hover:text-[#D4AF37]">
            {pickText(category.title, lang)}
          </Link>
        </h2>
        <CourseStatusBadge tier={category.tierRequired} />
      </div>
      <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">
        {pickText(category.description, lang)}
      </p>
      {category.tierRequired === "pro" ? (
        <p className="mt-3 text-2xl font-semibold text-[#0B132B] dark:text-[#F3E5AB]" data-course-price={COURSE_PRICE}>
          {toman(COURSE_PRICE)}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-muted-foreground">
        {lessonsOf(category).length} {copy.home.lessons}
      </p>
      <div className="mt-4">
        <CourseCta category={category} />
      </div>
    </article>
  );
}
