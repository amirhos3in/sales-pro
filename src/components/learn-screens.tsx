"use client";

import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";
import { CourseCta, CourseStatusBadge, useCourseAccess } from "@/components/courses/CourseCard";
import {
  findCategory,
  lessonGate,
  lessonsOf,
  pickText,
} from "@/lib/courses-data";
import { useI18n } from "@/lib/i18n";

export function CategoryScreen({ categoryId }: { categoryId: string }) {
  const { copy, lang } = useI18n();
  const { user, subscribed, authenticated, passed } = useCourseAccess();
  const category = findCategory(categoryId);
  if (!category) return null;

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-[#D4AF37]">
        {copy.learn.back}
      </Link>
      <header className="glass rounded-3xl p-6 shadow-2xl">
        <CourseStatusBadge tier={category.tierRequired} />
        <h1 className="mt-3 text-3xl font-semibold">{pickText(category.title, lang)}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          {pickText(category.description, lang)}
        </p>
        <div className="mt-4">
          <CourseCta category={category} />
        </div>
      </header>
      {category.subtopics.map((subtopic) => (
        <section key={subtopic.id} className="space-y-3">
          <h2 className="text-lg font-semibold">{pickText(subtopic.title, lang)}</h2>
          <div className="grid gap-3">
            {subtopic.lessons.map((lesson) => {
              const gate = lessonGate(category, lesson.id, user, passed, {
                authenticated,
                subscriptionActive: subscribed,
              });
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
