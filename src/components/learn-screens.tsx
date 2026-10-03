"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Lock, Play } from "lucide-react";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { CashbackBadge } from "@/components/ui/CashbackBadge";
import {
  findCategory,
  lessonGate,
  lessonsOf,
  pickText,
} from "@/lib/courses-data";
import { calculateCashback } from "@/lib/cashback";
import { localeNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function CategoryScreen({ categoryId }: { categoryId: string }) {
  const { copy, lang } = useI18n();
  const { user } = useStore();
  const [open, setOpen] = useState(false);
  const category = findCategory(categoryId);
  if (!category) return null;
  const passed = user?.passed ?? [];

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-[#D4AF37]">
        {copy.learn.back}
      </Link>
      <header className="glass rounded-3xl p-6 shadow-2xl">
        <p className="text-xs tracking-wide text-[#D4AF37]">
          {category.premium ? copy.home.premiumBadge : copy.home.freeBadge}
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{pickText(category.title, lang)}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          {pickText(category.description, lang)}
        </p>
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
              onClick={() => setOpen(true)}
            >
              {copy.pay.buyCourse}
            </button>
          </div>
        ) : null}
      </header>
      <CheckoutModal
        open={open}
        onOpenChange={setOpen}
        itemName={pickText(category.title, lang)}
        price={category.price}
      />
      {category.subtopics.map((subtopic) => (
        <section key={subtopic.id} className="space-y-3">
          <h2 className="text-lg font-semibold">{pickText(subtopic.title, lang)}</h2>
          <div className="grid gap-3">
            {subtopic.lessons.map((lesson) => {
              const gate = lessonGate(category, lesson.id, user, passed);
              const done = passed.includes(lesson.id);
              return (
                <Link
                  key={lesson.id}
                  href={`/learn/${category.id}/${lesson.id}`}
                  className="glass flex items-center gap-3 rounded-3xl p-4 shadow-xl transition hover:-translate-y-0.5"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37]">
                    {done ? <Check /> : gate.state === "open" ? <Play /> : <Lock />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium">{pickText(lesson.title, lang)}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      {lesson.minutes} {copy.learn.minutes}
                      {gate.state === "plan" ? ` · ${copy.learn.upgrade}` : ""}
                      {gate.state === "sequence" ? ` · ${copy.learn.lockedSeq}` : ""}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
      <p className="text-xs text-muted-foreground">
        {lessonsOf(category).length} {copy.home.lessons}
      </p>
    </div>
  );
}
