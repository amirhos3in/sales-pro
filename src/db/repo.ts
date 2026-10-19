import { and, asc, eq } from "drizzle-orm";
import type { AppDatabase } from "@/db/client";
import { courses, lessonProgress, lessons, quizChoices, quizQuestions, sessions, subscriptions, users } from "@/db/schema";
import { categories, lessonsOf } from "@/lib/courses-data";
import { quizPassed, quotaForTier, tierFromPlan, type AccessTier } from "@/lib/lms/rules";

function now() {
  return new Date().toISOString();
}

function id() {
  return crypto.randomUUID();
}

export async function seedCurriculum(db: AppDatabase) {
  const existing = await db.select({ id: courses.id }).from(courses).limit(1);
  if (existing.length) return;
  for (const [courseIndex, category] of categories.entries()) {
    const track = category.tierRequired === "free" ? "free" : "paid";
    await db.insert(courses).values({
      id: category.id,
      title: category.title.fa,
      track,
      position: courseIndex,
    });
    const rows = lessonsOf(category);
    for (const [lessonIndex, row] of rows.entries()) {
      await db.insert(lessons).values({
        id: row.lesson.id,
        courseId: category.id,
        title: row.lesson.title.fa,
        aparatId: row.lesson.aparat,
        track,
        position: lessonIndex,
        minutes: row.lesson.minutes,
      });
      for (const [questionIndex, question] of row.lesson.quiz.entries()) {
        const questionId = `${row.lesson.id}-q${questionIndex}`;
        await db.insert(quizQuestions).values({
          id: questionId,
          lessonId: row.lesson.id,
          prompt: question.prompt.fa,
          position: questionIndex,
        }).onConflictDoNothing();
        for (const [choiceIndex, choice] of question.options.entries()) {
          await db.insert(quizChoices).values({
            id: `${questionId}-c${choiceIndex}`,
            questionId,
            label: choice.fa,
            position: choiceIndex,
            correct: choiceIndex === question.answer,
          }).onConflictDoNothing();
        }
      }
    }
  }
}

export async function openSession(
  db: AppDatabase,
  input: { phone: string; name: string; email?: string | null; plan?: "eco" | "plus" | "pro" | null; active?: boolean },
) {
  const phone = input.phone.replace(/\D/g, "");
  const tier = tierFromPlan(input.plan ?? null, Boolean(input.active && input.plan));
  const found = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  let user = found[0];
  if (!user) {
    user = {
      id: id(),
      phone,
      name: input.name.trim() || "کاربر نکس‌سل",
      email: input.email ?? null,
      role: "learner",
      createdAt: now(),
    };
    await db.insert(users).values(user);
  }
  const subs = await db.select().from(subscriptions).where(eq(subscriptions.userId, user.id)).limit(1);
  const allowance = quotaForTier(tier);
  if (!subs[0]) {
    await db.insert(subscriptions).values({
      id: id(),
      userId: user.id,
      tier,
      active: tier !== "free" || allowance > 0,
      quotaSeconds: allowance,
      usedSeconds: 0,
      periodEnd: null,
    });
  } else if (input.plan && (allowance > subs[0].quotaSeconds || subs[0].tier !== tier)) {
    await db
      .update(subscriptions)
      .set({ tier, active: true, quotaSeconds: Math.max(subs[0].quotaSeconds, allowance) })
      .where(eq(subscriptions.id, subs[0].id));
  }
  const token = id();
  await db.insert(sessions).values({ token, userId: user.id, createdAt: now() });
  return { token, userId: user.id };
}

export async function userByToken(db: AppDatabase, token: string) {
  const rows = await db
    .select({ user: users, subscription: subscriptions })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .leftJoin(subscriptions, eq(subscriptions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);
  return rows[0] ?? null;
}

export async function spendSeconds(db: AppDatabase, userId: string, seconds: number) {
  const rows = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  const sub = rows[0];
  if (!sub) return { remaining: 0, allowed: false };
  const remaining = Math.max(0, sub.quotaSeconds - sub.usedSeconds);
  if (remaining <= 0 || !sub.active) return { remaining: 0, allowed: false };
  const used = Math.min(seconds, remaining);
  await db
    .update(subscriptions)
    .set({ usedSeconds: sub.usedSeconds + used })
    .where(eq(subscriptions.id, sub.id));
  return { remaining: remaining - used, allowed: true };
}

export async function gradeLesson(db: AppDatabase, userId: string, lessonId: string, answers: number[]) {
  const lessonRows = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  const lesson = lessonRows[0];
  if (!lesson) return { error: "lesson" as const };
  const courseRows = await db.select().from(courses).where(eq(courses.id, lesson.courseId));
  const ordered = await db.select().from(lessons).where(eq(lessons.courseId, lesson.courseId)).orderBy(asc(lessons.position));
  const index = ordered.findIndex((item) => item.id === lessonId);
  const previous = index > 0 ? ordered[index - 1] : null;
  if (previous) {
    const prevProgress = await db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, previous.id)))
      .limit(1);
    if (!prevProgress[0]?.passed) return { error: "sequence" as const };
  }
  const sub = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  const tier = (sub[0]?.tier ?? "free") as AccessTier;
  if (lesson.track === "paid" && tier === "free") return { error: "plan" as const };
  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.lessonId, lessonId))
    .orderBy(asc(quizQuestions.position));
  let correct = 0;
  for (const [questionIndex, question] of questions.entries()) {
    const choices = await db
      .select()
      .from(quizChoices)
      .where(eq(quizChoices.questionId, question.id))
      .orderBy(asc(quizChoices.position));
    const picked = answers[questionIndex];
    if (choices[picked]?.correct) correct += 1;
  }
  const passed = quizPassed(correct);
  const current = await db
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)))
    .limit(1);
  const row = {
    userId,
    lessonId,
    attempts: (current[0]?.attempts ?? 0) + 1,
    bestCorrect: Math.max(current[0]?.bestCorrect ?? 0, correct),
    passed: Boolean(current[0]?.passed) || passed,
    unlocked: true,
    updatedAt: now(),
  };
  if (current[0]) {
    await db.update(lessonProgress).set(row).where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)));
  } else {
    await db.insert(lessonProgress).values(row);
  }
  const next = ordered[index + 1];
  if (passed && next) {
    const nextRow = await db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, next.id)))
      .limit(1);
    if (!nextRow[0]) {
      await db.insert(lessonProgress).values({
        userId,
        lessonId: next.id,
        attempts: 0,
        bestCorrect: 0,
        passed: false,
        unlocked: true,
        updatedAt: now(),
      });
    } else if (!nextRow[0].unlocked) {
      await db
        .update(lessonProgress)
        .set({ unlocked: true, updatedAt: now() })
        .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, next.id)));
    }
  }
  return {
    correct,
    total: questions.length,
    passed,
    nextLessonId: passed ? next?.id ?? null : null,
    courseId: courseRows[0]?.id ?? lesson.courseId,
  };
}
