"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ChevronDown, Lock, Play } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  PASS_MARK,
  PATH_KEY,
  PLAN_LABEL,
  TRACKS,
  accessPlanFromSubscription,
  courseOpen,
  emptyPath,
  lessonPhase,
  overallProgress,
  passedScore,
  readPath,
  sampleHalfway,
  scoreOf,
  trackProgress,
  type AccessPlan,
  type AcademyLesson,
  type AcademyTrack,
  type PathState,
  type TrackId,
} from "@/lib/academy-path";
import { cn } from "@/lib/utils";

const PREVIEW: AccessPlan[] = ["none", "eco", "plus", "pro"];

function fa(value: number) {
  return value.toLocaleString("fa-IR");
}

function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#0B132B]/10 dark:bg-white/10">
      <div className="h-full rounded-full bg-[#D4AF37] transition-[width]" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function AcademyPath() {
  const { ready: authReady, isAuthenticated, currentUser } = useAuth();
  const [path, setPath] = useState<PathState>({});
  const [stored, setStored] = useState(false);
  const [plan, setPlan] = useState<AccessPlan | null>(null);
  const [pinned, setPinned] = useState(false);
  const [openTrack, setOpenTrack] = useState<TrackId | null>("online");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ id: string; score: number; passed: boolean } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPath(readPath(localStorage.getItem(PATH_KEY)));
      setStored(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!stored) return;
    localStorage.setItem(PATH_KEY, JSON.stringify(path));
  }, [path, stored]);

  useEffect(() => {
    if (!authReady || pinned) return;
    const subscription = currentUser?.subscription;
    const next = isAuthenticated
      ? accessPlanFromSubscription(Boolean(subscription?.isActive), subscription?.planType)
      : "eco";
    const timer = setTimeout(() => setPlan(next), 0);
    return () => clearTimeout(timer);
  }, [authReady, isAuthenticated, currentUser, pinned]);

  const activePlan = plan ?? "eco";
  const overall = overallProgress(path, activePlan);

  function choosePlan(next: AccessPlan) {
    setPinned(true);
    setPlan(next);
    setActiveId(null);
    setQuizId(null);
    setResult(null);
  }

  function begin(lesson: AcademyLesson) {
    setActiveId(lesson.id);
    setQuizId(null);
    setResult(null);
    setAnswers([]);
    setPath((current) => {
      const row = current[lesson.id];
      if (row) return current;
      return { ...current, [lesson.id]: { progress: 25, passed: false } };
    });
  }

  function openQuiz(lesson: AcademyLesson) {
    setQuizId(lesson.id);
    setActiveId(lesson.id);
    setAnswers([]);
    setResult(null);
    setPath((current) => {
      const row = current[lesson.id];
      if (row?.passed) return current;
      return { ...current, [lesson.id]: { progress: Math.max(row?.progress ?? 0, 60), passed: false, score: row?.score } };
    });
  }

  function submit(lesson: AcademyLesson) {
    const correct = lesson.quiz.filter((item, index) => answers[index] === item.answer).length;
    const score = scoreOf(correct, lesson.quiz.length);
    const ok = passedScore(score);
    setPath((current) => {
      const row = current[lesson.id];
      const stayPassed = Boolean(row?.passed);
      return {
        ...current,
        [lesson.id]: {
          progress: ok || stayPassed ? 100 : Math.max(row?.progress ?? 0, 60),
          score,
          passed: ok || stayPassed,
        },
      };
    });
    setResult({ id: lesson.id, score, passed: ok });
    setQuizId(null);
  }

  return (
    <section dir="rtl" className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12" data-academy-ready={stored && plan !== null ? "true" : "false"}>
      <header className="rounded-[28px] border border-[color:var(--glass-border)] bg-background/70 p-5 shadow-sm backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.16em] text-[#D4AF37]">مسیر مهارت فروش</p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">آکادمی فروش نکس‌سل</h1>
            <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
              چهار دوره، به ترتیب. هر مرحله بعد از قبولی در آزمون مرحلهٔ قبل باز می‌شود.
            </p>
          </div>
          <Link
            href="/#courses"
            data-upgrade
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37] px-4 text-sm font-semibold text-[#0B132B]"
          >
            ارتقا پلن
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#0B132B] px-3 py-1 text-xs font-medium text-[#F3E5AB]" data-academy-plan={activePlan}>
            پلن فعلی: {PLAN_LABEL[activePlan]}
          </span>
          <span className="text-sm text-muted-foreground" data-overall-label>
            پیشرفت کل: {fa(overall.done)} از {fa(overall.total)} مرحله · {fa(overall.percent)}٪
          </span>
        </div>
        <div className="mt-3" data-overall-progress={overall.percent}>
          <Bar value={overall.percent} />
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">پیش‌نمایش پلن برای آزمون دسترسی. اشتراک خریداری‌شده عوض نمی‌شود.</p>
          <div className="flex flex-wrap gap-2">
            {PREVIEW.map((item) => (
              <button
                key={item}
                type="button"
                data-plan-switch={item}
                onClick={() => choosePlan(item)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs ring-1 ring-[color:var(--glass-border)]",
                  activePlan === item ? "bg-[#0B132B] text-[#F3E5AB]" : "hover:bg-foreground/5",
                )}
              >
                {PLAN_LABEL[item]}
              </button>
            ))}
            <button
              type="button"
              data-path-reset
              onClick={() => {
                setPath(emptyPath());
                setActiveId(null);
                setQuizId(null);
                setResult(null);
              }}
              className="rounded-full px-3 py-1.5 text-xs ring-1 ring-[color:var(--glass-border)] hover:bg-foreground/5"
            >
              شروع تازه
            </button>
            <button
              type="button"
              data-path-sample
              onClick={() => {
                setPath(sampleHalfway());
                setOpenTrack("online");
                setActiveId(null);
                setQuizId(null);
                setResult(null);
              }}
              className="rounded-full px-3 py-1.5 text-xs ring-1 ring-[color:var(--glass-border)] hover:bg-foreground/5"
            >
              نمونه نیمه‌کاره
            </button>
          </div>
        </div>
      </header>

      <div className="mt-4 space-y-3">
        {plan === null || !stored ? (
          <p className="rounded-[28px] border border-[color:var(--glass-border)] px-5 py-8 text-sm text-muted-foreground" data-academy-loading>
            در حال خواندن مسیر آموزش...
          </p>
        ) : null}
        {plan !== null && stored
          ? TRACKS.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            plan={activePlan}
            path={path}
            open={openTrack === track.id}
            onToggle={() => setOpenTrack((current) => (current === track.id ? null : track.id))}
            activeId={activeId}
            quizId={quizId}
            answers={answers}
            result={result}
            onBegin={begin}
            onQuiz={openQuiz}
            onAnswer={(index, choice) => {
              setAnswers((current) => {
                const next = current.slice();
                next[index] = choice;
                return next;
              });
            }}
            onSubmit={submit}
          />
        ))
          : null}
      </div>
    </section>
  );
}

function TrackCard({
  track,
  plan,
  path,
  open,
  onToggle,
  activeId,
  quizId,
  answers,
  result,
  onBegin,
  onQuiz,
  onAnswer,
  onSubmit,
}: {
  track: AcademyTrack;
  plan: AccessPlan;
  path: PathState;
  open: boolean;
  onToggle: () => void;
  activeId: string | null;
  quizId: string | null;
  answers: number[];
  result: { id: string; score: number; passed: boolean } | null;
  onBegin: (lesson: AcademyLesson) => void;
  onQuiz: (lesson: AcademyLesson) => void;
  onAnswer: (index: number, choice: number) => void;
  onSubmit: (lesson: AcademyLesson) => void;
}) {
  const unlocked = courseOpen(plan, track);
  const progress = trackProgress(track, path);

  if (!unlocked) {
    return (
      <article
        data-track={track.id}
        data-locked="true"
        className="rounded-[28px] border border-dashed border-foreground/15 bg-foreground/[0.03] p-5 text-muted-foreground"
      >
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-foreground/10" title="این دوره با خرید پلن مناسب فعال می‌شود">
            <Lock className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-foreground/70">{track.title}</h2>
            <p className="mt-1 text-sm leading-7" data-lock-copy>
              این دوره با خرید پلن مناسب فعال می‌شود
            </p>
            <p className="mt-1 text-xs">نیاز به پلن {PLAN_LABEL[track.required]}</p>
          </div>
        </div>
        <Link
          href="/#courses"
          data-track-upgrade={track.id}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-2xl bg-[#0B132B] px-4 text-sm font-medium text-[#F3E5AB]"
        >
          ارتقا
        </Link>
      </article>
    );
  }

  return (
    <article data-track={track.id} data-locked="false" className="overflow-hidden rounded-[28px] border border-[color:var(--glass-border)] bg-background/80">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-start gap-3 p-5 text-start">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#D4AF37]/20 text-[#0B132B] dark:text-[#F3E5AB]">
          {progress.percent === 100 ? <Check className="size-4" /> : <Play className="size-4" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-3">
            <span className="text-lg font-semibold">{track.title}</span>
            <ChevronDown className={cn("size-4 shrink-0 transition", open && "rotate-180")} />
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">{track.subtitle}</span>
          <span className="mt-3 block text-xs text-muted-foreground">
            {fa(progress.done)} از {fa(progress.total)} · {fa(progress.percent)}٪
          </span>
          <span className="mt-2 block">
            <Bar value={progress.percent} />
          </span>
        </span>
      </button>
      {open ? (
        <ol className="space-y-2 border-t border-[color:var(--glass-border)] px-4 py-4 sm:px-5">
          {track.lessons.map((lesson, index) => {
            const phase = lessonPhase(track, index, path, plan);
            const row = path[lesson.id];
            const studying = activeId === lesson.id;
            return (
              <li
                key={lesson.id}
                data-lesson={lesson.id}
                data-phase={phase}
                className={cn(
                  "rounded-2xl border p-4",
                  phase === "sequence" && "border-dashed border-foreground/15 bg-foreground/[0.03] text-muted-foreground",
                  phase === "ready" && "border-[#D4AF37]/50 bg-[#D4AF37]/10",
                  phase === "progress" && "border-[#D4AF37]/40",
                  phase === "passed" && "border-emerald-500/30 bg-emerald-500/5",
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {fa(index + 1)}. {lesson.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{fa(lesson.minutes)} دقیقه</p>
                  </div>
                  {phase === "sequence" ? (
                    <p className="flex items-center gap-2 text-xs leading-6" data-sequence-copy>
                      <Lock className="size-3.5 shrink-0" aria-hidden />
                      پس از قبولی در آزمون مرحله قبل باز می‌شود
                    </p>
                  ) : null}
                  {phase === "ready" ? (
                    <button
                      type="button"
                      data-start={lesson.id}
                      onClick={() => onBegin(lesson)}
                      className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#D4AF37] px-4 text-sm font-semibold text-[#0B132B]"
                    >
                      شروع مرحله
                    </button>
                  ) : null}
                  {phase === "progress" ? (
                    <button
                      type="button"
                      data-continue={lesson.id}
                      onClick={() => onBegin(lesson)}
                      className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#0B132B] px-4 text-sm font-medium text-[#F3E5AB]"
                    >
                      ادامه آموزش
                    </button>
                  ) : null}
                  {phase === "passed" ? (
                    <div className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500" aria-hidden />
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        تکمیل‌شده
                      </span>
                      <button type="button" data-review={lesson.id} onClick={() => onBegin(lesson)} className="text-xs underline-offset-4 hover:underline">
                        مرور
                      </button>
                    </div>
                  ) : null}
                </div>
                {phase === "progress" ? (
                  <div className="mt-3" data-lesson-progress={row?.progress ?? 0}>
                    <Bar value={row?.progress ?? 0} />
                  </div>
                ) : null}
                {studying && phase !== "sequence" ? (
                  <div className="mt-4 border-t border-[color:var(--glass-border)] pt-4">
                    <p className="text-sm leading-7">{lesson.summary}</p>
                    {result?.id === lesson.id ? (
                      <p className="mt-3 text-sm" data-quiz-score={result.score} data-quiz-passed={result.passed ? "true" : "false"}>
                        {result.passed
                          ? `قبول شدید با نمرهٔ ${fa(result.score)}. حد قبولی ${fa(PASS_MARK)}٪ است و مرحلهٔ بعد باز شد.`
                          : `نمرهٔ شما ${fa(result.score)} است. حد قبولی ${fa(PASS_MARK)}٪ است. این مرحله هنوز باز می‌ماند تا دوباره آزمون بدهید.`}
                      </p>
                    ) : null}
                    {quizId === lesson.id ? (
                      <form
                        className="mt-4 space-y-4"
                        data-quiz={lesson.id}
                        onSubmit={(event) => {
                          event.preventDefault();
                          if (answers.length < lesson.quiz.length || answers.some((item) => item === undefined)) return;
                          onSubmit(lesson);
                        }}
                      >
                        {lesson.quiz.map((item, qIndex) => (
                          <fieldset key={item.prompt} className="space-y-2">
                            <legend className="text-sm font-medium">
                              {fa(qIndex + 1)}. {item.prompt}
                            </legend>
                            {item.options.map((option, choice) => (
                              <label key={option} className="flex cursor-pointer items-start gap-2 text-sm leading-6">
                                <input
                                  type="radio"
                                  name={`${lesson.id}-${qIndex}`}
                                  className="mt-1"
                                  checked={answers[qIndex] === choice}
                                  onChange={() => onAnswer(qIndex, choice)}
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </fieldset>
                        ))}
                        <button
                          type="submit"
                          data-quiz-submit={lesson.id}
                          disabled={lesson.quiz.some((_, qIndex) => answers[qIndex] === undefined)}
                          className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#D4AF37] px-4 text-sm font-semibold text-[#0B132B] disabled:opacity-50"
                        >
                          ثبت آزمون
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        data-open-quiz={lesson.id}
                        onClick={() => onQuiz(lesson)}
                        className="mt-4 inline-flex h-10 items-center justify-center rounded-2xl bg-[#0B132B] px-4 text-sm font-medium text-[#F3E5AB]"
                      >
                        شرکت در آزمون
                      </button>
                    )}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : null}
    </article>
  );
}
