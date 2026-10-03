"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { AccountGate } from "@/components/account-gate";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { categories, lessonsOf, pickText } from "@/lib/courses-data";
import { useI18n } from "@/lib/i18n";
import { faDate, faNumber, faPercent, toman } from "@/lib/format";
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

export function AboutMeScreen() {
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
  const { lang } = useI18n();
  if (!user) return null;
  const total = categories.reduce((sum, category) => sum + lessonsOf(category).length, 0);
  const done = user.passed.length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">درصد پیشرفت</h1>
        <p className="mt-2 text-4xl font-semibold">{faPercent(percent)}</p>
        <p className="text-sm text-muted-foreground">
          {faNumber(done)} درس از {faNumber(total)}
          {user.isPremium ? ` · ${user.premiumTier === "vip" ? "VIP" : "Gold"}` : " · بدون اشتراک فعال"}
        </p>
      </header>
      <div className="[&_[data-slot=progress-track]]:h-2">
        <Progress value={percent}>
          <ProgressLabel>چالش‌های قبول‌شده</ProgressLabel>
          <ProgressValue />
        </Progress>
      </div>
      <div className="grid gap-3">
        {categories.map((category) => {
          const lessons = lessonsOf(category).map((item) => item.lesson.id);
          const passed = lessons.filter((id) => user.passed.includes(id)).length;
          const share = lessons.length ? Math.round((passed / lessons.length) * 100) : 0;
          return (
            <Link
              key={category.id}
              href={`/learn/${category.id}`}
              className="glass rounded-3xl p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-medium">{pickText(category.title, lang)}</span>
                <span className="text-sm text-muted-foreground">
                  {faNumber(passed)} / {faNumber(lessons.length)}
                </span>
              </div>
              <div className="[&_[data-slot=progress-track]]:h-2">
                <Progress value={share} />
              </div>
            </Link>
          );
        })}
      </div>
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
