"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { useGate } from "@/components/gates";
import { Button } from "@/components/ui/button";
import {
  findVideoLesson,
  lessonGate,
  nextLessonId,
  pickText,
} from "@/lib/courses-data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function LessonPlayer({
  categoryId,
  lessonId,
}: {
  categoryId: string;
  lessonId: string;
}) {
  const { copy, lang } = useI18n();
  const { ready, user, markWatched, passQuiz } = useStore();
  const { openAuth, openPaywall } = useGate();
  const [quizOpen, setQuizOpen] = useState(false);
  const [answers, setAnswers] = useState<number[]>([-1, -1, -1]);
  const [result, setResult] = useState<"pass" | "fail" | null>(null);
  const found = findVideoLesson(categoryId, lessonId);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!String(event.origin).includes("aparat.com")) return;
      const raw = typeof event.data === "string" ? event.data : JSON.stringify(event.data ?? "");
      if (/ended|complete|finish/i.test(raw)) markWatched(lessonId);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [lessonId, markWatched]);

  if (!found) {
    return <p className="text-sm text-muted-foreground">{copy.learn.back}</p>;
  }

  const { category, subtopic, lesson } = found;
  const gate = lessonGate(category, lesson.id, user, user?.passed ?? []);
  const watched = Boolean(user?.watched.includes(lesson.id));
  const passed = Boolean(user?.passed.includes(lesson.id));
  const upcoming = nextLessonId(category, lesson.id);

  function submitQuiz() {
    if (answers.some((value) => value < 0)) {
      toast.error(copy.quiz.need);
      return;
    }
    const ok = lesson.quiz.every((question, index) => question.answer === answers[index]);
    if (ok) {
      passQuiz(lesson.id);
      setResult("pass");
      navigator.vibrate?.(18);
      return;
    }
    setResult("fail");
  }

  return (
    <div className="space-y-5">
      <Link href={`/learn/${category.id}`} className="text-sm text-[#D4AF37]">
        {copy.learn.backCategory}
      </Link>
      <header>
        <p className="text-xs text-muted-foreground">{pickText(subtopic.title, lang)}</p>
        <h1 className="mt-1 text-2xl font-semibold">{pickText(lesson.title, lang)}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          {pickText(lesson.summary, lang)} · {lesson.minutes} {copy.learn.minutes}
        </p>
      </header>

      {!ready ? <div className="h-72 animate-pulse rounded-3xl bg-foreground/5" /> : null}

      {ready && gate.state === "auth" ? (
        <LockCard
          title={copy.learn.loginNeed}
          action={copy.learn.login}
          onClick={openAuth}
        />
      ) : null}

      {ready && gate.state === "plan" ? (
        <LockCard
          title={copy.learn.lockedPlan}
          action={copy.learn.upgrade}
          onClick={openPaywall}
        />
      ) : null}

      {ready && gate.state === "sequence" ? (
        <LockCard
          title={`${copy.learn.lockedSeq} ${copy.learn.previous}: ${pickText(gate.previous, lang)}`}
        />
      ) : null}

      {ready && gate.state === "open" ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-[color:var(--glass-border)] shadow-2xl">
            <div className="relative aspect-video bg-[#0B132B]">
              <iframe
                title={pickText(lesson.title, lang)}
                src={`https://www.aparat.com/video/video/embed/videohash/${lesson.aparat}/vt/frame`}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
          {passed || watched ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3 rounded-3xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-3"
            >
              <span className="grid size-10 place-items-center rounded-full bg-[#D4AF37] text-lg text-[#0B132B]">✓</span>
              <span className="text-sm">{passed ? copy.learn.passed : copy.learn.watched}</span>
            </motion.div>
          ) : (
            <Button
              className="h-11 bg-[#D4AF37] px-4 text-[#0B132B] hover:bg-[#E5C07B]"
              onClick={() => markWatched(lesson.id)}
            >
              <Check />
              {copy.learn.confirm}
            </Button>
          )}
          {watched && !passed ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Button
                className="h-11 bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] px-4 text-white"
                onClick={() => {
                  setAnswers([-1, -1, -1]);
                  setResult(null);
                  setQuizOpen(true);
                }}
              >
                {copy.learn.challenge}
              </Button>
            </motion.div>
          ) : null}
          {passed && upcoming ? (
            <Link href={`/learn/${category.id}/${upcoming}`} className="inline-flex text-sm text-[#D4AF37]">
              {copy.learn.next}
            </Link>
          ) : null}
        </div>
      ) : null}

      <AnimatePresence>
        {quizOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center bg-[#0B132B]/60 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuizOpen(false)}
          >
            <motion.div
              role="dialog"
              className="glass max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl p-6 shadow-2xl"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <h2 className="text-xl font-semibold">{copy.quiz.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{copy.quiz.hint}</p>
              {result === "pass" ? (
                <div className="mt-6 space-y-4 text-center">
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#D4AF37] text-2xl text-[#0B132B]">✓</div>
                  <p>{copy.quiz.pass}</p>
                  <Button className="h-10 bg-[#D4AF37] text-[#0B132B]" onClick={() => setQuizOpen(false)}>
                    {copy.quiz.close}
                  </Button>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {lesson.quiz.map((question, questionIndex) => (
                    <fieldset key={pickText(question.prompt, lang)} className="space-y-2">
                      <legend className="text-sm font-medium">
                        {questionIndex + 1}. {pickText(question.prompt, lang)}
                      </legend>
                      {question.options.map((option, optionIndex) => (
                        <label key={pickText(option, lang)} className="flex items-start gap-2 rounded-2xl px-2 py-2 text-sm ring-1 ring-[color:var(--glass-border)]">
                          <input
                            type="radio"
                            name={`q-${questionIndex}`}
                            checked={answers[questionIndex] === optionIndex}
                            onChange={() =>
                              setAnswers((current) =>
                                current.map((value, index) => (index === questionIndex ? optionIndex : value)),
                              )
                            }
                          />
                          <span>{pickText(option, lang)}</span>
                        </label>
                      ))}
                    </fieldset>
                  ))}
                  {result === "fail" ? <p className="text-sm text-destructive">{copy.quiz.fail}</p> : null}
                  <div className="flex flex-wrap gap-2">
                    <Button className="h-10 bg-[#D4AF37] text-[#0B132B]" onClick={submitQuiz}>
                      {result === "fail" ? copy.quiz.retry : copy.quiz.submit}
                    </Button>
                    <Button variant="outline" className="h-10" onClick={() => setQuizOpen(false)}>
                      {copy.quiz.close}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function LockCard({
  title,
  action,
  onClick,
}: {
  title: string;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="glass flex flex-col items-start gap-4 rounded-3xl p-6 shadow-2xl">
      <span className="grid size-12 place-items-center rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37]">
        <Lock />
      </span>
      <p className="max-w-xl text-sm leading-7">{title}</p>
      {action && onClick ? (
        <Button className="h-11 bg-[#D4AF37] px-4 text-[#0B132B] hover:bg-[#E5C07B]" onClick={onClick}>
          {action}
        </Button>
      ) : null}
    </div>
  );
}
