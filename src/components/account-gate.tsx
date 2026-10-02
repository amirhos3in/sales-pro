"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

export function AccountGate({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { ready, user } = useStore();
  if (!ready) {
    return <div className="h-48 animate-pulse rounded-3xl bg-muted" />;
  }
  if (!user) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl bg-card p-6 text-center ring-1 ring-foreground/10">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          این بخش به حساب شما وصل است. با ورود آزمایشی همان داده‌ها روی این مرورگر می‌ماند.
        </p>
        <Link
          href="/login"
          className={cn(buttonVariants(), "mt-4 h-10 px-4")}
        >
          ورود
        </Link>
      </div>
    );
  }
  return children;
}
