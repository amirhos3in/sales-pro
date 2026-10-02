"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Lock } from "lucide-react";
import { toast } from "sonner";
import { TrackIconBadge } from "@/components/track-grid";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  canAccess,
  findLesson,
  findModule,
  findTrack,
  lessonKey,
  modulePlan,
  trackLessons,
  tracks,
} from "@/lib/curriculum";
import { faNumber } from "@/lib/format";
import { planById, type PlanId } from "@/lib/plans";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const planLabel: Record<PlanId, string> = {
  eco: "اکو",
  plus: "پلاس",
  pro: "پرو",
};

export function TrackScreen({ slug }: { slug: string }) {
  const track = findTrack(slug);
  const { user } = useStore();
  if (!track) return <Missing />;
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ href: "/login", label: "مسیرها" }, { label: track.title }]} />
      <header className="flex items-start gap-4">
        <TrackIconBadge icon={track.icon} />
        <div>
          <h1 className="text-2xl font-semibold">{track.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            {track.description}
          </p>
        </div>
      </header>
      <div className="grid gap-3">
        {track.modules.map((module, index) => {
          const done = module.lessons.filter((lesson) =>
            user?.completed.includes(lessonKey(track.slug, module.slug, lesson.slug)),
          ).length;
          return (
            <Link
              key={module.slug}
              href={`/courses/${track.slug}/${module.slug}`}
              className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10 transition hover:ring-primary/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  سرفصل {faNumber(index + 1)}
                </span>
                <Badge variant="secondary">{planLabel[modulePlan(module)]}</Badge>
              </div>
              <h2 className="mt-2 text-lg font-semibold">{module.title}</h2>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">{module.summary}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {faNumber(done)} از {faNumber(module.lessons.length)} درس تمام شده
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function ModuleScreen({
  trackSlug,
  moduleSlug,
}: {
  trackSlug: string;
  moduleSlug: string;
}) {
  const track = findTrack(trackSlug);
  const courseModule = track ? findModule(track, moduleSlug) : undefined;
  const { user } = useStore();
  if (!track || !courseModule) return <Missing />;
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/login", label: "مسیرها" },
          { href: `/courses/${track.slug}`, label: track.title },
          { label: courseModule.title },
        ]}
      />
      <header>
        <Badge variant="secondary">{planLabel[modulePlan(courseModule)]}</Badge>
        <h1 className="mt-3 text-2xl font-semibold leading-snug">{courseModule.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          {courseModule.summary}
        </p>
      </header>
      <ol className="space-y-3">
        {courseModule.lessons.map((lesson, index) => {
          const id = lessonKey(track.slug, courseModule.slug, lesson.slug);
          const open = canAccess(lesson, user?.plan ?? null);
          const done = user?.completed.includes(id);
          return (
            <li key={lesson.slug}>
              <Link
                href={`/courses/${track.slug}/${courseModule.slug}/${lesson.slug}`}
                className="flex items-start gap-3 rounded-3xl bg-card p-4 ring-1 ring-foreground/10 transition hover:ring-primary/40"
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full text-xs",
                    done
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-4" /> : faNumber(index + 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium leading-7">{lesson.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{faNumber(lesson.minutes)} دقیقه</span>
                    {lesson.preview ? <Badge variant="outline">پیش‌نمایش رایگان</Badge> : null}
                    {open ? null : (
                      <span className="inline-flex items-center gap-1">
                        <Lock className="size-3" />
                        پلن {planLabel[lesson.minPlan]}
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function LessonScreen({
  trackSlug,
  moduleSlug,
  lessonSlug,
}: {
  trackSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}) {
  const router = useRouter();
  const track = findTrack(trackSlug);
  const courseModule = track ? findModule(track, moduleSlug) : undefined;
  const lesson = courseModule ? findLesson(courseModule, lessonSlug) : undefined;
  const { ready, user, setLessonDone, rememberLesson } = useStore();
  const id = lesson ? lessonKey(trackSlug, moduleSlug, lesson.slug) : "";
  const open = lesson ? canAccess(lesson, user?.plan ?? null) : false;
  const done = Boolean(user?.completed.includes(id));

  useEffect(() => {
    if (ready && user && open && id) rememberLesson(id);
  }, [ready, user, open, id, rememberLesson]);

  if (!track || !courseModule || !lesson) return <Missing />;

  const siblings = trackLessons(track);
  const index = siblings.findIndex((item) => item.lesson.slug === lesson.slug && item.module.slug === courseModule.slug);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: `/courses/${track.slug}`, label: track.title },
          { href: `/courses/${track.slug}/${courseModule.slug}`, label: courseModule.title },
          { label: "درس" },
        ]}
      />
      <header>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">پلن {planLabel[lesson.minPlan]}</Badge>
          <Badge variant="outline">{faNumber(lesson.minutes)} دقیقه</Badge>
        </div>
        <h1 className="mt-3 text-2xl font-semibold leading-snug">{lesson.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-8">{lesson.lead}</p>
      </header>

      {open ? (
        <div className="space-y-4">
          <ul className="space-y-2">
            {lesson.points.map((point) => (
              <li key={point} className="rounded-2xl bg-card px-4 py-3 text-sm leading-7 ring-1 ring-foreground/10">
                {point}
              </li>
            ))}
          </ul>
          <section className="rounded-3xl bg-[oklch(0.28_0.045_166)] p-5 text-[oklch(0.97_0.015_90)]">
            <h2 className="text-sm font-medium text-[oklch(0.82_0.08_85)]">{lesson.scriptTitle}</h2>
            <div className="mt-3 space-y-3">
              {lesson.script.map((line) => (
                <p key={line} className="text-sm leading-8">
                  {line}
                </p>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-4 h-9 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(lesson.script.join("\n"));
                  toast.success("متن آماده کپی شد.");
                } catch {
                  toast.error("کپی در این مرورگر ممکن نشد.");
                }
              }}
            >
              کپی متن آماده
            </Button>
          </section>
          <section className="rounded-3xl bg-secondary/80 p-5">
            <h2 className="font-medium">تمرین</h2>
            <p className="mt-2 text-sm leading-7">{lesson.practice}</p>
          </section>
          {lesson.quiz ? <Quiz quiz={lesson.quiz} /> : null}
          <div className="flex flex-wrap gap-2">
            {user ? (
              <Button
                className="h-10 px-4"
                variant={done ? "outline" : "default"}
                onClick={() => {
                  setLessonDone(id, !done);
                  toast.success(done ? "تکمیل این درس برداشته شد." : "درس تمام‌شده ثبت شد.");
                }}
              >
                {done ? "برداشتن علامت تکمیل" : "این درس را تمام کردم"}
              </Button>
            ) : (
              <Button
                className="h-10 px-4"
                onClick={() => {
                  sessionStorage.setItem("nexsell-next", window.location.pathname);
                  router.push("/login");
                }}
              >
                ورود برای ثبت پیشرفت
              </Button>
            )}
          </div>
        </div>
      ) : (
        <section className="rounded-3xl bg-card p-6 ring-1 ring-foreground/10">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="size-4" />
            این درس در پلن {planById(lesson.minPlan).name} باز می‌شود
          </div>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            عنوان و مسیر را می‌بینید. متن، اسکریپت و تمرین بعد از فعال شدن پلن{" "}
            {planLabel[lesson.minPlan]} یا بالاتر در دسترس است. پیش‌نمایش رایگان، درس اول هر مسیر است.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/subscription" className={cn(buttonVariants(), "h-10 px-4")}>
              مشاهدهٔ اشتراک
            </Link>
            {user ? null : (
              <Button
                variant="outline"
                className="h-10 px-4"
                onClick={() => {
                  sessionStorage.setItem("nexsell-next", window.location.pathname);
                  router.push("/login");
                }}
              >
                ورود
              </Button>
            )}
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-4">
        {prev ? (
          <Link
            href={`/courses/${track.slug}/${prev.module.slug}/${prev.lesson.slug}`}
            className="inline-flex items-center gap-1 text-sm"
          >
            <ChevronRight className="size-4" />
            درس قبل
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/courses/${track.slug}/${next.module.slug}/${next.lesson.slug}`}
            className="text-sm"
          >
            درس بعد
          </Link>
        ) : (
          <Link href={`/courses/${track.slug}`} className="text-sm">
            بازگشت به مسیر
          </Link>
        )}
      </div>
    </div>
  );
}

function Quiz({
  quiz,
}: {
  quiz: { question: string; options: string[]; answer: number };
}) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <section className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
      <h2 className="font-medium">کوئیز کوتاه</h2>
      <p className="mt-2 text-sm leading-7">{quiz.question}</p>
      <div className="mt-3 space-y-2">
        {quiz.options.map((option, index) => {
          const state =
            picked === null
              ? ""
              : index === quiz.answer
                ? "ring-primary bg-primary/10"
                : index === picked
                  ? "ring-destructive/40 bg-destructive/10"
                  : "";
          return (
            <button
              key={option}
              type="button"
              className={cn(
                "block w-full rounded-2xl px-4 py-3 text-start text-sm ring-1 ring-foreground/10",
                state,
              )}
              onClick={() => setPicked(index)}
            >
              {option}
            </button>
          );
        })}
      </div>
      {picked === null ? null : (
        <p className="mt-3 text-sm">
          {picked === quiz.answer ? "درست است." : "این گزینه دقیق نیست. پاسخ مشخص‌شده را ببینید."}
        </p>
      )}
    </section>
  );
}

function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
          {index > 0 ? <span>/</span> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function Missing() {
  return (
    <div className="rounded-3xl bg-card p-6 ring-1 ring-foreground/10">
      <h1 className="text-xl font-semibold">این مسیر پیدا نشد</h1>
      <p className="mt-2 text-sm text-muted-foreground">از چهار آیکون صفحهٔ ورود یکی را انتخاب کنید.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tracks.map((track) => (
          <Link key={track.slug} href={`/courses/${track.slug}`} className={cn(buttonVariants({ variant: "outline" }), "h-9")}>
            {track.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
