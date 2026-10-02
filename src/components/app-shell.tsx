"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BadgeCheck,
  ChartNoAxesCombined,
  LogOut,
  Menu,
  Newspaper,
  UserRound,
  Wallet,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { allLessons, lessonKey } from "@/lib/curriculum";
import { faPercent } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "خانه" },
  { href: "/services", label: "خدمات" },
  { href: "/support", label: "پشتیبانی" },
  { href: "/subscription", label: "اشتراک" },
];

const menu = [
  { href: "/profile", label: "اطلاعات من", icon: UserRound },
  { href: "/about", label: "درباره من", icon: UserRound },
  { href: "/articles", label: "مقالات", icon: Newspaper },
  { href: "/subscription", label: "خرید اشتراک", icon: BadgeCheck },
  { href: "/wallet", label: "کیف پول", icon: Wallet },
  { href: "/progress", label: "درصد پیشرفت", icon: ChartNoAxesCombined },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function progressOf(completed: string[]) {
  const lessons = allLessons();
  const known = new Set(
    lessons.map(({ track, module, lesson }) =>
      lessonKey(track.slug, module.slug, lesson.slug),
    ),
  );
  const done = completed.filter((id) => known.has(id)).length;
  const percent = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  return { done, total: lessons.length, percent };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, user, logout } = useStore();
  const [open, setOpen] = useState(false);
  const progress = progressOf(user?.completed ?? []);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              ن
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold">نکس‌سل</span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">
                آکادمی مهارت‌های فروش
              </span>
            </span>
          </Link>

          <nav className="ms-6 hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  isActive(pathname, item.href) &&
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2">
            {ready && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-2 rounded-full py-1 ps-1 pe-3 ring-1 ring-foreground/10 hover:bg-muted"
                >
                  <Avatar>
                    <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-28 truncate text-sm sm:inline">
                    {user.name}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                    {menu.map((item) => (
                      <DropdownMenuItem
                        key={item.href}
                        onClick={() => router.push(item.href)}
                      >
                        <item.icon />
                        {item.href === "/progress"
                          ? `درصد پیشرفت · ${faPercent(progress.percent)}`
                          : item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      logout();
                      router.push("/login");
                    }}
                  >
                    <LogOut />
                    خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="h-9 px-3"
                onClick={() => router.push("/login")}
              >
                ورود
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen(true)}
              aria-label="منو"
            >
              <Menu />
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle>نکس‌سل</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1 px-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  isActive(pathname, item.href)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
            <p className="mt-4 px-3 text-xs text-muted-foreground">حساب</p>
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <button
                className="rounded-lg px-3 py-2 text-start text-sm text-destructive hover:bg-destructive/10"
                onClick={() => {
                  logout();
                  setOpen(false);
                  router.push("/login");
                }}
              >
                خروج
              </button>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <footer className="border-t border-foreground/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs leading-6 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>نکس‌سل، آکادمی تخصصی مهارت‌های فروش. سناریومحور، از تماس تا دایرکت.</p>
          <p>پشتیبانی انسانی و دستیار هوش مصنوعی در یک‌جا.</p>
        </div>
      </footer>
    </div>
  );
}
