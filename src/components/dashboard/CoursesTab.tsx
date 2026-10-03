"use client";

import Link from "next/link";
import { frostStyle, goldButtonStyle } from "@/components/dashboard/style";
import { findCategory, findVideoLesson, lessonsOf } from "@/lib/courses-data";
import { useI18n } from "@/lib/i18n";
import { localeNumber } from "@/lib/format";
import { useStore } from "@/lib/store";

type QuizState = "passed" | "pending" | "locked";

const showcase = [
  { categoryId: "hozuri", lessonId: "live-tracy", nextId: "live-manager", percent: 85, quiz: "pending" as const },
  { categoryId: "mozakerah", lessonId: "neg-objection", nextId: "neg-strategy", percent: 62, quiz: "passed" as const },
  { categoryId: "telefoni", lessonId: "phone-first", nextId: "phone-sample", percent: 25, quiz: "pending" as const },
  { categoryId: "free", lessonId: "free-funnel", nextId: "free-funnel", percent: 100, quiz: "passed" as const },
];

export function CoursesTab() {
  const { copy, lang } = useI18n();
  const text = copy.dash;
  const { user } = useStore();
  const passed = user?.passed ?? [];
  const quizLabel: Record<QuizState, string> = {
    passed: text.quizPassed,
    pending: text.quizPending,
    locked: text.quizLocked,
  };

  const cards = showcase.map((item) => {
    const category = findCategory(item.categoryId);
    const lessons = category ? lessonsOf(category) : [];
    const done = lessons.filter((row) => passed.includes(row.lesson.id));
    if (category && done.length > 0) {
      const percent = Math.round((done.length / lessons.length) * 100);
      const last = done[done.length - 1];
      const index = lessons.findIndex((row) => row.lesson.id === last.lesson.id);
      const next = lessons[index + 1]?.lesson ?? last.lesson;
      const quiz: QuizState = percent >= 100 ? "passed" : "pending";
      return {
        key: category.id,
        title: category.title[lang],
        percent,
        last: last.lesson.title[lang],
        href: `/learn/${category.id}/${next.id}`,
        quiz,
      };
    }
    const lesson = findVideoLesson(item.categoryId, item.lessonId);
    return {
      key: item.categoryId,
      title: lesson?.category.title[lang] ?? "",
      percent: item.percent,
      last: lesson?.lesson.title[lang] ?? "",
      href: `/learn/${item.categoryId}/${item.nextId}`,
      quiz: item.quiz,
    };
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{copy.session.courses}</p>
        <h1 className="mt-2 text-2xl font-semibold">{copy.session.courses}</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{text.coursesLead}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <article key={card.key} className="glass flex flex-col rounded-[28px] p-5" style={frostStyle}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <span className="shrink-0 rounded-full border border-[#D4AF37]/50 px-2 py-1 text-[11px] text-[#8C7016] dark:text-[#D4AF37]">
                {quizLabel[card.quiz]}
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{text.lastLesson}</p>
            <p className="mt-1 text-sm font-medium">{card.last}</p>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>{localeNumber(card.percent, lang)}{lang === "fa" ? "٪" : "%"}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#0B132B]/10 dark:bg-white/10">
                <div className="h-full rounded-full bg-[#D4AF37]" style={{ width: `${card.percent}%` }} />
              </div>
            </div>
            <Link href={card.href} className="mt-5 inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-medium" style={goldButtonStyle}>
              {text.resume}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
