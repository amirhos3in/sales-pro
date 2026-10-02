"use client";

import Link from "next/link";
import { ArrowLeft, BadgeCheck, Wallet } from "lucide-react";
import { TrackGrid } from "@/components/track-grid";
import { buttonVariants } from "@/components/ui/button";
import { allLessons, findTrack, lessonKey, tracks } from "@/lib/curriculum";
import { faNumber, faPercent, toman } from "@/lib/format";
import { planById } from "@/lib/plans";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { progressOf } from "@/components/app-shell";

const advantages = [
  {
    title: "سناریومحور",
    text: "جمله، لحن و واکنش لحظه‌ای؛ بدون تئوری اضافه.",
  },
  {
    title: "چرخه کامل فروش",
    text: "تماس، جلسه حضوری، دایرکت، ایمیل و قیف در یک مسیر.",
  },
  {
    title: "قابل اجرا همان روز",
    text: "اسکریپت و قالب را برمی‌دارید و در تماس یا چت بعدی استفاده می‌کنید.",
  },
];

export function HomeScreen() {
  const { ready, user } = useStore();
  const progress = progressOf(user?.completed ?? []);
  const nextLesson = pickNext(user?.completed ?? [], user?.lastLessonId ?? null);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] bg-[oklch(0.28_0.045_166)] text-[oklch(0.97_0.015_90)]">
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-xs tracking-[0.18em] text-[oklch(0.82_0.08_85)]">
              آکادمی تخصصی مهارت‌های فروش
            </p>
            <h1 className="mt-3 max-w-xl text-3xl font-semibold leading-[1.45] sm:text-4xl">
              فروشندهٔ سنتی را به متخصص فروش با نرخ تبدیل بالا تبدیل کنید.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-[oklch(0.9_0.02_90)]">
              چهار مسیر، از زبان بدن و مذاکره تا تماس سرد و بستن دایرکت. هر درس یک
              جملهٔ آماده و یک تمرین دارد که همان روز قابل گفتن است.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/login" className={cn(buttonVariants(), "h-10 bg-[oklch(0.9_0.08_85)] px-4 text-[oklch(0.25_0.04_60)] hover:bg-[oklch(0.86_0.09_85)]")}>
                شروع از صفحهٔ ورود
              </Link>
              <Link
                href="/subscription"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-10 border-white/20 bg-transparent px-4 text-white hover:bg-white/10 hover:text-white",
                )}
              >
                پلن‌های اکو، پلاس و پرو
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["۴", "مسیر آموزشی"],
              ["۳ تا ۵٪", "هدف تبدیل صفحه"],
              ["۳ پلن", "از خودآموز تا سازمان"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white/8 px-2 py-4 ring-1 ring-white/10">
                <div className="text-lg font-semibold">{value}</div>
                <div className="mt-1 text-[11px] leading-5 text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {ready && user ? (
        <section className="grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
            <p className="text-xs text-muted-foreground">سلام</p>
            <p className="mt-1 text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </div>
          <div className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <BadgeCheck className="size-3.5" />
              اشتراک
            </p>
            <p className="mt-1 text-lg font-semibold">
              {user.plan ? `پلن ${planById(user.plan).name}` : "هنوز پلنی فعال نیست"}
            </p>
            <Link href="/subscription" className="text-sm text-primary">
              خرید اشتراک
            </Link>
          </div>
          <div className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Wallet className="size-3.5" />
              کیف پول و پیشرفت
            </p>
            <p className="mt-1 text-lg font-semibold">{toman(user.wallet)}</p>
            <Link href="/progress" className="text-sm text-primary">
              پیشرفت {faPercent(progress.percent)} · {faNumber(progress.done)} از {faNumber(progress.total)} درس
            </Link>
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">مسیرهای آموزشی</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              همان چهار آیکون صفحهٔ ورود. هر کدام را باز کنید تا سرفصل و درس‌ها را ببینید.
            </p>
          </div>
        </div>
        <TrackGrid />
      </section>

      {nextLesson ? (
        <Link
          href={nextLesson.href}
          className="flex items-center justify-between gap-4 rounded-3xl bg-card p-5 ring-1 ring-foreground/10"
        >
          <div>
            <p className="text-xs text-muted-foreground">ادامهٔ یادگیری</p>
            <p className="mt-1 font-semibold">{nextLesson.title}</p>
            <p className="text-sm text-muted-foreground">{nextLesson.track}</p>
          </div>
          <ArrowLeft className="size-5 text-primary" />
        </Link>
      ) : null}

      <section className="grid gap-3 md:grid-cols-3">
        {advantages.map((item) => (
          <article key={item.title} className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl bg-secondary/70 p-6">
        <h2 className="text-xl font-semibold">برای چه کسی است؟</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium">فردی</h3>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              فروشنده و بازاریاب تلفنی، ادمین و پیج‌دار، و کارشناس تازه‌وارد که می‌خواهد کامنت و دایرکت را به خرید قطعی برساند.
            </p>
          </div>
          <div>
            <h3 className="font-medium">سازمانی</h3>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              فروشگاه اینترنتی و تیم کال‌سنتر که به اسکریپت، قیف و آموزش نیرو نیاز دارد. جزئیات در بخش خدمات است.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {tracks.map((track) => (
            <span key={track.slug} className="rounded-full bg-card px-3 py-1 ring-1 ring-foreground/10">
              {track.title}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function pickNext(completed: string[], lastId: string | null) {
  const lessons = allLessons();
  if (lastId) {
    const found = lessons.find(
      ({ track, module, lesson }) =>
        lessonKey(track.slug, module.slug, lesson.slug) === lastId,
    );
    if (found) {
      return {
        href: `/courses/${found.track.slug}/${found.module.slug}/${found.lesson.slug}`,
        title: found.lesson.title,
        track: found.track.title,
      };
    }
  }
  const pending = lessons.find(({ track, module, lesson }) => {
    return !completed.includes(lessonKey(track.slug, module.slug, lesson.slug));
  });
  if (!pending) return null;
  const track = findTrack(pending.track.slug);
  return {
    href: `/courses/${pending.track.slug}/${pending.module.slug}/${pending.lesson.slug}`,
    title: pending.lesson.title,
    track: track?.title ?? "",
  };
}
