"use client";

import { toast } from "sonner";
import { toman } from "@/lib/format";
import {
  BUNDLE_PRICE,
  buyBundle,
  buyCourse,
  COURSE_PRICE,
  ownsCourse,
  PAID_COURSES,
  type PaidCourseId,
} from "@/lib/pricing";
import { usePricing } from "@/lib/use-pricing";
import { useI18n } from "@/lib/i18n";

const trialNote = {
  fa: "دسترسی آزمایشی روی همین مرورگر است. پرداخت بانکی نیست.",
  en: "Trial access stays in this browser. This is not a bank payment.",
};

export function PricingTracks({ showCourses = true }: { showCourses?: boolean }) {
  const { lang } = useI18n();
  const state = usePricing();
  const fa = lang === "fa";

  function purchaseCourse(id: PaidCourseId) {
    buyCourse(id);
    toast.success(trialNote[lang]);
  }

  function purchaseBundle() {
    buyBundle();
    toast.success(trialNote[lang]);
  }

  if (!showCourses) return null;

  return (
    <div className="space-y-8" data-pricing-tracks>
      <section id="courses" className="scroll-mt-24 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">{fa ? "قیمت چهار مسیر" : "Price of the four paths"}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            {fa ? "هر مسیر یک عدد کنار خودش دارد." : "Each path has one number beside it."}
          </p>
        </div>

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
                <button
                  type="button"
                  disabled={owned}
                  onClick={() => purchaseCourse(course.id)}
                  className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl bg-[#0B132B] px-4 text-sm font-medium text-[#F3E5AB] disabled:opacity-60"
                >
                  {owned ? (fa ? "در سبد" : "In the cart") : fa ? "افزودن به سبد" : "Add to cart"}
                </button>
              </article>
            );
          })}
        </div>

        <article className="rounded-[28px] bg-[#0B132B] p-5 text-[#F8F1DE] shadow-xl sm:p-6" data-offer="bundle">
          <p className="text-lg font-semibold leading-8">
            {fa ? "هر چهار مسیر، " : "All four paths, "}
            <span className="text-[#D4AF37]" data-bundle-price={BUNDLE_PRICE}>{toman(BUNDLE_PRICE)}</span>
            {fa ? ". یکی رایگان است." : ". One is free."}
          </p>
          <button
            type="button"
            disabled={state.bundle}
            onClick={purchaseBundle}
            className="mt-5 inline-flex h-12 items-center rounded-2xl bg-[#D4AF37] px-5 text-sm font-semibold text-[#0B132B] disabled:opacity-60"
          >
            {state.bundle ? (fa ? "در سبد" : "In the cart") : fa ? "افزودن به سبد" : "Add to cart"}
          </button>
        </article>
      </section>
    </div>
  );
}
