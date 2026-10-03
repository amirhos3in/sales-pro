"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { lessonsOf, pickText, type Category, type CourseTier } from "@/lib/courses-data";
import { useI18n } from "@/lib/i18n";
import { normalizeSubscription } from "@/lib/subscription";
import { useStore } from "@/lib/store";

const frost = { backdropFilter: "blur(16px) saturate(1.6)" };
const goldButton = { backgroundColor: "#D4AF37", color: "#0B132B" };

export function useCourseAccess() {
  const { user } = useStore();
  const { currentUser, isAuthenticated } = useAuth();
  const academy = normalizeSubscription(currentUser?.subscription);
  const learner = normalizeSubscription(user?.subscription);
  return {
    user,
    subscribed: academy.isActive || learner.isActive,
    authenticated: isAuthenticated || Boolean(user),
    passed: user?.passed ?? [],
  };
}

export function continueHref(category: Category, passed: string[]) {
  const lessons = lessonsOf(category);
  const next = lessons.find((item) => !passed.includes(item.lesson.id)) ?? lessons[0];
  return next ? `/learn/${category.id}/${next.lesson.id}` : `/learn/${category.id}`;
}

export function CourseStatusBadge({ tier }: { tier: CourseTier }) {
  const { copy } = useI18n();
  if (tier === "free") {
    return (
      <span
        className="inline-flex shrink-0 items-center rounded-full border border-emerald-400/45 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-200"
        style={frost}
      >
        {copy.home.freeTrack}
      </span>
    );
  }
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium"
      style={{
        ...frost,
        borderColor: "rgba(212, 175, 55, 0.5)",
        background: "rgba(212, 175, 55, 0.16)",
        color: "#D4AF37",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), 0 0 16px rgba(212,175,55,0.18)",
      }}
    >
      <Lock className="size-3" aria-hidden />
      {copy.home.memberTrack}
    </span>
  );
}

export function CourseCta({ category }: { category: Category }) {
  const { copy } = useI18n();
  const router = useRouter();
  const { subscribed, passed } = useCourseAccess();
  const open = category.tierRequired === "free" || subscribed;

  if (open) {
    return (
      <Link
        href={continueHref(category, passed)}
        className="inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-medium"
        style={goldButton}
      >
        {copy.home.watchContinue}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-medium"
      style={goldButton}
      onClick={() => {
        const node = document.getElementById("pricing-plans");
        if (node) {
          node.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        router.push("/subscription#pricing-plans");
      }}
    >
      {copy.home.upgradeUnlock}
    </button>
  );
}

export function CourseCard({ category }: { category: Category }) {
  const { copy, lang } = useI18n();
  return (
    <article className="glass flex flex-col rounded-3xl p-5 shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">
          <Link href={`/learn/${category.id}`} className="transition hover:text-[#D4AF37]">
            {pickText(category.title, lang)}
          </Link>
        </h2>
        <CourseStatusBadge tier={category.tierRequired} />
      </div>
      <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">
        {pickText(category.description, lang)}
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        {lessonsOf(category).length} {copy.home.lessons}
      </p>
      <div className="mt-4">
        <CourseCta category={category} />
      </div>
    </article>
  );
}
