"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { AccountGate } from "@/components/account-gate";
import { progressOf } from "@/components/app-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { allLessons, lessonKey, tracks } from "@/lib/curriculum";
import { faDate, faNumber, faPercent, toman } from "@/lib/format";
import { planById } from "@/lib/plans";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const goalOptions = [
  "افزایش پورسانت",
  "تبدیل دایرکت به خرید",
  "ورود به بازار کار فروش",
  "آموزش تیم کال‌سنتر",
];

const topUps = [1_000_000, 3_000_000, 5_000_000];

export function ProfileScreen() {
  return (
    <AccountGate title="اطلاعات من">
      <ProfileForm />
    </AccountGate>
  );
}

function ProfileForm() {
  const { user, updateProfile } = useStore();
  if (!user) return null;
  return <ProfileFields key={user.email} user={user} updateProfile={updateProfile} />;
}

function ProfileFields({
  user,
  updateProfile,
}: {
  user: NonNullable<ReturnType<typeof useStore>["user"]>;
  updateProfile: ReturnType<typeof useStore>["updateProfile"];
}) {
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone,
    city: user.city,
    role: user.role,
  });

  function save(event: FormEvent) {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      toast.error("نام را کامل‌تر بنویسید.");
      return;
    }
    updateProfile(form);
    toast.success("اطلاعات ذخیره شد.");
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-xl space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">اطلاعات من</h1>
        <p className="mt-2 text-sm text-muted-foreground">این مشخصات روی همین مرورگر ذخیره می‌شود.</p>
      </header>
      <Field label="نام" value={form.name} onChange={(name) => setForm({ ...form, name })} />
      <div className="space-y-1.5">
        <Label>ایمیل</Label>
        <Input value={user.email} dir="ltr" disabled className="h-10 text-left" />
      </div>
      <Field label="موبایل" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
      <Field label="شهر" value={form.city} onChange={(city) => setForm({ ...form, city })} />
      <Field label="نقش شغلی" value={form.role} onChange={(role) => setForm({ ...form, role })} />
      <Button type="submit" className="h-10 px-4">
        ذخیره
      </Button>
    </form>
  );
}

export function AboutScreen() {
  return (
    <AccountGate title="درباره من">
      <AboutForm />
    </AccountGate>
  );
}

function AboutForm() {
  const { user, updateProfile } = useStore();
  if (!user) return null;
  return <AboutFields key={user.email} user={user} updateProfile={updateProfile} />;
}

function AboutFields({
  user,
  updateProfile,
}: {
  user: NonNullable<ReturnType<typeof useStore>["user"]>;
  updateProfile: ReturnType<typeof useStore>["updateProfile"];
}) {
  const [bio, setBio] = useState(user.bio);
  const [goals, setGoals] = useState<string[]>(user.goals);

  function toggle(goal: string) {
    setGoals((current) =>
      current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal],
    );
  }

  return (
    <form
      className="mx-auto max-w-xl space-y-4"
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        if (bio.trim().length < 12) {
          toast.error("دربارهٔ خودتان چند جمله بنویسید.");
          return;
        }
        updateProfile({ bio, goals });
        toast.success("دربارهٔ من ذخیره شد.");
      }}
    >
      <header>
        <h1 className="text-2xl font-semibold">درباره من</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {user.name} · {user.role} · {user.city}
        </p>
      </header>
      <div className="space-y-1.5">
        <Label htmlFor="bio">معرفی کوتاه</Label>
        <Textarea id="bio" value={bio} onChange={(event) => setBio(event.target.value)} className="min-h-36" />
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">هدف حضور در آکادمی</legend>
        {goalOptions.map((goal) => (
          <label key={goal} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={goals.includes(goal)}
              onChange={() => toggle(goal)}
              className="size-4 accent-[oklch(0.34_0.07_164)]"
            />
            {goal}
          </label>
        ))}
      </fieldset>
      <Button type="submit" className="h-10 px-4">
        ذخیره
      </Button>
    </form>
  );
}

export function WalletScreen() {
  return (
    <AccountGate title="کیف پول">
      <WalletBody />
    </AccountGate>
  );
}

function WalletBody() {
  const { user, topUp } = useStore();
  if (!user) return null;
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">کیف پول</h1>
        <p className="mt-2 text-4xl font-semibold text-[oklch(0.42_0.1_62)]">{toman(user.wallet)}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          شارژ این صفحه آزمایشی است و پرداخت بانکی واقعی انجام نمی‌شود.
        </p>
      </header>
      <div className="flex flex-wrap gap-2">
        {topUps.map((amount) => (
          <Button
            key={amount}
            variant="outline"
            className="h-10"
            onClick={() => {
              topUp(amount);
              toast.success("موجودی آزمایشی اضافه شد.");
            }}
          >
            افزایش {toman(amount)}
          </Button>
        ))}
        <Link href="/subscription" className={cn(buttonVariants(), "h-10 px-4")}>
          خرید اشتراک
        </Link>
      </div>
      <div className="space-y-2">
        {user.transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3 ring-1 ring-foreground/10">
            <div>
              <p className="text-sm font-medium">{tx.title}</p>
              <p className="text-xs text-muted-foreground">{faDate(tx.at)}</p>
            </div>
            <p className={tx.amount < 0 ? "text-sm text-destructive" : "text-sm text-primary"}>
              {tx.amount < 0 ? "−" : "+"}
              {toman(Math.abs(tx.amount))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProgressScreen() {
  return (
    <AccountGate title="درصد پیشرفت">
      <ProgressBody />
    </AccountGate>
  );
}

function ProgressBody() {
  const { user } = useStore();
  if (!user) return null;
  const progress = progressOf(user.completed);
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">درصد پیشرفت</h1>
        <p className="mt-2 text-4xl font-semibold">{faPercent(progress.percent)}</p>
        <p className="text-sm text-muted-foreground">
          {faNumber(progress.done)} درس از {faNumber(progress.total)}
          {user.plan ? ` · پلن ${planById(user.plan).name}` : " · بدون اشتراک فعال"}
        </p>
      </header>
      <div className="[&_[data-slot=progress-track]]:h-2">
        <Progress value={progress.percent}>
          <ProgressLabel>کل مسیرها</ProgressLabel>
          <ProgressValue />
        </Progress>
      </div>
      <div className="grid gap-3">
        {tracks.map((track) => {
          const lessons = track.modules.flatMap((module) =>
            module.lessons.map((lesson) => lessonKey(track.slug, module.slug, lesson.slug)),
          );
          const done = lessons.filter((id) => user.completed.includes(id)).length;
          const percent = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
          return (
            <Link
              key={track.slug}
              href={`/courses/${track.slug}`}
              className="rounded-3xl bg-card p-4 ring-1 ring-foreground/10"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-medium">{track.title}</span>
                <span className="text-sm text-muted-foreground">
                  {faNumber(done)} / {faNumber(lessons.length)}
                </span>
              </div>
              <div className="[&_[data-slot=progress-track]]:h-2">
                <Progress value={percent} />
              </div>
            </Link>
          );
        })}
      </div>
      {progress.done === 0 ? (
        <p className="text-sm text-muted-foreground">
          هنوز درسی تمام نشده. از{" "}
          <Link href="/login" className="text-primary">
            آیکون‌های مسیر
          </Link>{" "}
          شروع کنید و در پایان درس علامت تکمیل بزنید.
        </p>
      ) : (
        <RecentDone completed={user.completed} />
      )}
    </div>
  );
}

function RecentDone({ completed }: { completed: string[] }) {
  const items = allLessons()
    .filter(({ track, module, lesson }) =>
      completed.includes(lessonKey(track.slug, module.slug, lesson.slug)),
    )
    .slice(0, 6);
  return (
    <div>
      <h2 className="font-medium">درس‌های تمام‌شده</h2>
      <ul className="mt-2 space-y-2">
        {items.map(({ track, module, lesson }) => (
          <li key={lesson.slug}>
            <Link
              href={`/courses/${track.slug}/${module.slug}/${lesson.slug}`}
              className="block rounded-2xl bg-card px-4 py-3 text-sm ring-1 ring-foreground/10"
            >
              <span className="text-muted-foreground">{track.title} · </span>
              {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} className="h-10" />
    </div>
  );
}
