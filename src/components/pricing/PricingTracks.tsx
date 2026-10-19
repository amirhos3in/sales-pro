"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { toman } from "@/lib/format";
import {
  BUNDLE_GIFT_MINUTES,
  BUNDLE_LIST_PRICE,
  BUNDLE_PRICE,
  BUNDLE_SAVE,
  buyBundle,
  buyCourse,
  buyMinutes,
  clampMinutes,
  COURSE_PRICE,
  emptyPricing,
  MAX_MINUTES,
  MIN_MINUTES,
  MINUTE_STEP,
  minutesPrice,
  ownsCourse,
  PAID_COURSES,
  readPricing,
  type PaidCourseId,
  type PricingState,
} from "@/lib/pricing";
import { useI18n } from "@/lib/i18n";

function usePricing() {
  const [state, setState] = useState<PricingState>(emptyPricing);

  useEffect(() => {
    const load = () => setState(readPricing());
    load();
    window.addEventListener("salespro-pricing", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("salespro-pricing", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return state;
}

export function PricingTracks() {
  const { lang } = useI18n();
  const state = usePricing();
  const fa = lang === "fa";
  const [selectedMinutes, setSelectedMinutes] = useState(MIN_MINUTES);
  const minuteTotal = minutesPrice(selectedMinutes);

  useEffect(() => {
    function scrollToTrack() {
      const id = window.location.hash.replace("#", "");
      if (id !== "courses" && id !== "copilot-minutes") return;
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    scrollToTrack();
    window.addEventListener("hashchange", scrollToTrack);
    return () => window.removeEventListener("hashchange", scrollToTrack);
  }, []);

  function purchaseCourse(id: PaidCourseId, title: string) {
    buyCourse(id);
    toast.success(fa ? `«${title}» روی همین مرورگر فعال شد.` : `${title} is now active in this browser.`);
  }

  function purchaseBundle() {
    const already = readPricing().bundle;
    buyBundle();
    toast.success(
      already
        ? fa
          ? "باندل از قبل فعال است."
          : "The bundle is already active."
        : fa
          ? "باندل فعال شد و ۵۰۰ دقیقه کوپایلوت هدیه به موجودی اضافه شد."
          : "The bundle is active, with 500 gifted copilot minutes.",
    );
  }

  function purchaseMinutes() {
    const amount = clampMinutes(selectedMinutes);
    buyMinutes(amount);
    toast.success(fa ? `${amount.toLocaleString("fa-IR")} دقیقه به موجودی کوپایلوت اضافه شد.` : `${amount.toLocaleString("en-US")} copilot minutes were added.`);
  }

  return (
    <div className="space-y-8" data-pricing-tracks>
      <section id="courses" className="scroll-mt-24 space-y-4">
        <div>
          <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{fa ? "مسیر دوره‌ها" : "Course track"}</p>
          <h2 className="mt-2 text-2xl font-semibold">{fa ? "دوره‌های تخصصی و باندل کامل" : "Specialist courses and the full bundle"}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            {fa
              ? "هر دوره جدا فروخته می‌شود. باندل چهار دوره، ۴ میلیون تومان ارزان‌تر است و ۵۰۰ دقیقه کوپایلوت هدیه دارد."
              : "Each course is sold on its own. The four-course bundle saves 4,000,000 Tomans and includes 500 gifted copilot minutes."}
          </p>
        </div>

        <article className="rounded-[28px] bg-[#0B132B] p-5 text-[#F8F1DE] shadow-xl sm:p-6" data-offer="bundle">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold">{fa ? "باندل کامل چهار دوره" : "Full bundle of all four courses"}</h3>
            <span className="rounded-full bg-[#D4AF37] px-2.5 py-1 text-[11px] font-semibold text-[#0B132B]">
              {fa ? `هدیه: ${BUNDLE_GIFT_MINUTES.toLocaleString("fa-IR")} دقیقه کوپایلوت رایگان` : `Gift: ${BUNDLE_GIFT_MINUTES.toLocaleString("en-US")} free copilot minutes`}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
            {fa
              ? "فروش آنلاین، حضوری، تلفنی و مذاکره با هم باز می‌شوند. این هدیه فقط روی باندل است و به قیمت دوره‌ها وصل نیست."
              : "Online, in-person, telephone, and negotiation open together. The gift sits only on the bundle, separate from course prices."}
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
            disabled={state.bundle}
            onClick={purchaseBundle}
            className="mt-5 inline-flex h-12 items-center rounded-2xl bg-[#D4AF37] px-5 text-sm font-semibold text-[#0B132B] disabled:opacity-60"
          >
            {state.bundle ? (fa ? "باندل فعال است" : "Bundle active") : fa ? "خرید باندل و دریافت هدیه" : "Buy the bundle and claim the gift"}
          </button>
        </article>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {PAID_COURSES.map((course) => {
            const owned = ownsCourse(state, course.id);
            const title = fa ? course.fa : course.en;
            return (
              <article key={course.id} className="flex flex-col rounded-[28px] border border-[color:var(--glass-border)] bg-card p-5" data-course={course.id}>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-3 text-2xl font-semibold text-[#0B132B] dark:text-[#F3E5AB]" data-course-price={COURSE_PRICE}>
                  {toman(COURSE_PRICE)}
                </p>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {fa ? "دسترسی دائمی به همین دوره، بدون دقیقهٔ کوپایلوت." : "Lasting access to this course only, with no copilot minutes included."}
                </p>
                <button
                  type="button"
                  disabled={owned}
                  onClick={() => purchaseCourse(course.id, title)}
                  className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B132B] px-4 text-sm font-medium text-[#F3E5AB] disabled:opacity-60"
                >
                  {owned ? (fa ? "خریداری شده" : "Purchased") : fa ? "خرید این دوره" : "Buy this course"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section id="copilot-minutes" className="scroll-mt-24 rounded-[28px] border border-[#D4AF37]/40 bg-[#0B132B] p-5 text-[#F8F1DE] sm:p-6" data-offer="minutes">
        <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{fa ? "مسیر کوپایلوت" : "Copilot track"}</p>
        <h2 className="mt-2 text-2xl font-semibold">{fa ? "دقیقهٔ هوش مصنوعی، جدا از دوره" : "AI minutes, separate from courses"}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70">
          {fa
            ? "مثل اشتراک مصرفی: هر ۱٬۰۰۰ دقیقه ۳٬۰۰۰٬۰۰۰ تومان. اسلایدر را بکشید تا مبلغ همان لحظه عوض شود."
            : "Usage-based, like a modern AI plan: 3,000,000 Tomans per 1,000 minutes. The price follows the slider."}
        </p>
        <p className="mt-4 text-sm text-[#D4AF37]" data-minute-balance={state.minutes}>
          {fa ? `موجودی فعلی: ${state.minutes.toLocaleString("fa-IR")} دقیقه` : `Current balance: ${state.minutes.toLocaleString("en-US")} minutes`}
        </p>
        <div className="mt-5">
          <div className="flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold sm:text-4xl" data-selected-minutes={selectedMinutes}>
              {fa ? `${selectedMinutes.toLocaleString("fa-IR")} دقیقه` : `${selectedMinutes.toLocaleString("en-US")} min`}
            </p>
            <p className="text-lg font-semibold text-[#D4AF37]" data-minute-price={minuteTotal}>
              {toman(minuteTotal)}
            </p>
          </div>
          <input
            type="range"
            min={MIN_MINUTES}
            max={MAX_MINUTES}
            step={MINUTE_STEP}
            value={selectedMinutes}
            aria-label={fa ? "انتخاب دقیقهٔ کوپایلوت" : "Choose copilot minutes"}
            onChange={(event) => setSelectedMinutes(clampMinutes(Number(event.target.value)))}
            className="mt-4 h-2 w-full cursor-pointer accent-[#D4AF37]"
          />
          <div className="mt-2 flex justify-between text-xs text-white/50">
            <span>{fa ? "۱٬۰۰۰ دقیقه" : "1,000 min"}</span>
            <span>{fa ? "۲۰٬۰۰۰ دقیقه" : "20,000 min"}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={purchaseMinutes}
          className="mt-5 inline-flex h-12 items-center rounded-2xl bg-[#D4AF37] px-5 text-sm font-semibold text-[#0B132B]"
        >
          {fa ? "افزودن این دقیقه‌ها به موجودی" : "Add these minutes to the balance"}
        </button>
      </section>
    </div>
  );
}
