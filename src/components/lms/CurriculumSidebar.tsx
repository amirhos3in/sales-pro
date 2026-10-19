"use client";

import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { useCourseAccess } from "@/components/courses/CourseCard";
import { findCategory, lessonGate, lessonsOf, pickText } from "@/lib/courses-data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function CurriculumSidebar({ categoryId, lessonId }: { categoryId: string; lessonId: string }) {
  const { lang } = useI18n();
  const { user, courseOpen, authenticated } = useCourseAccess();
  const category = findCategory(categoryId);
  if (!category) return null;
  const rows = lessonsOf(category);
  const passed = user?.passed ?? [];

  return (
    <aside className="rounded-[28px] border border-[color:var(--glass-border)] p-4" data-curriculum>
      <h2 className="text-sm font-semibold">{pickText(category.title, lang)}</h2>
      <ol className="mt-3 space-y-1">
        {rows.map((row, index) => {
          const gate = lessonGate(category, row.lesson.id, user, passed, {
            authenticated,
            subscriptionActive: courseOpen(category.id),
          });
          const done = passed.includes(row.lesson.id);
          const status = done ? "completed" : row.lesson.id === lessonId ? "active" : gate.state === "open" ? "ready" : "locked";
          return (
            <li key={row.lesson.id}>
              <Link
                href={`/learn/${category.id}/${row.lesson.id}`}
                data-curriculum-lesson={row.lesson.id}
                data-lesson-status={status}
                className={cn(
                  "flex items-start gap-2 rounded-2xl px-2 py-2 text-sm",
                  status === "active" && "bg-[#D4AF37]/15",
                  status === "locked" && "text-muted-foreground",
                )}
              >
                {done ? <Check className="mt-0.5 size-4 text-emerald-500" /> : status === "locked" ? <Lock className="mt-0.5 size-4" /> : <span className="mt-0.5 w-4 text-xs">{(index + 1).toLocaleString("fa-IR")}</span>}
                <span>{pickText(row.lesson.title, lang)}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
