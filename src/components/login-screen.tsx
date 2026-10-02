"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TrackGrid } from "@/components/track-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

export function LoginScreen() {
  const router = useRouter();
  const { user, login } = useStore();
  const [name, setName] = useState("امیرحسین قاری");
  const [email, setEmail] = useState("demo@nexsell.ir");
  const [password, setPassword] = useState("demo");

  function finish() {
    const next = sessionStorage.getItem("nexsell-next") || "/";
    sessionStorage.removeItem("nexsell-next");
    router.push(next);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const error = login(email, password, { name });
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("وارد شدید.");
    finish();
  }

  function demo() {
    const error = login("demo@nexsell.ir", "demo", {
      name: "امیرحسین قاری",
      role: "کارشناس فروش",
      city: "تهران",
    });
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("ورود آزمایشی انجام شد.");
    finish();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <p className="text-sm text-primary">صفحهٔ ورود</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold leading-snug">
          مسیر آموزش را از این چهار آیکون شروع کنید.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          آموزش حضوری، مذاکره، تلفنی و آنلاین. روی هر آیکون بزنید تا سرفصل‌ها باز شود؛
          برای ذخیرهٔ پیشرفت و خرید اشتراک، وارد حساب شوید.
        </p>
        <div className="mt-6">
          <TrackGrid />
        </div>
      </section>

      <form
        onSubmit={submit}
        className="mx-auto max-w-md rounded-3xl bg-card p-5 ring-1 ring-foreground/10"
      >
        <h2 className="text-lg font-semibold">ورود به آکادمی</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {user
            ? `الان با نام ${user.name} وارد شده‌اید. ورود دوباره همین حساب را باز می‌کند.`
            : "حساب آزمایشی روی همین مرورگر می‌ماند. رمز بررسی واقعی نمی‌شود."}
        </p>
        <div className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">نام</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">ایمیل</Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-10 text-left"
              autoComplete="username"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">رمز</Label>
            <Input
              id="password"
              type="password"
              dir="ltr"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 text-left"
              autoComplete="current-password"
            />
          </div>
        </div>
        <Button type="submit" className="mt-4 h-10 w-full">
          ورود
        </Button>
        <Button type="button" variant="outline" className="mt-2 h-10 w-full" onClick={demo}>
          ورود آزمایشی
        </Button>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          نمونه: demo@nexsell.ir و رمز demo. موجودی آزمایشی کیف پول ده میلیون تومان است.
        </p>
      </form>
    </div>
  );
}
