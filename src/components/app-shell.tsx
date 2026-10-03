"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  ChartNoAxesCombined,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  UserRound,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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
import { allVideoLessons } from "@/lib/courses-data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useThemeMode } from "@/lib/theme";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, user, logout } = useStore();
  const { ready: authReady, isAuthenticated, currentUser, logout: endSession } = useAuth();
  const { copy, lang, setLang, dir } = useI18n();
  const { theme, toggle } = useThemeMode();
  const [open, setOpen] = useState(false);
  const total = allVideoLessons().length;
  const passed = user?.passed.length ?? 0;
  const percent = total ? Math.round((passed / total) * 100) : 0;

  const nav = [
    { href: "/", label: copy.nav.home },
    { href: "/articles", label: copy.nav.articles },
    { href: "/services", label: copy.nav.services },
    { href: "/support", label: copy.nav.support },
    { href: "/subscription", label: copy.nav.plans },
    { href: "/about", label: copy.nav.about },
    { href: "/contact", label: copy.nav.contact },
  ];
  const menu = [
    { href: "/profile", label: copy.menu.profile, icon: UserRound },
    { href: "/me", label: copy.menu.about, icon: UserRound },
    { href: "/subscription", label: copy.menu.buy, icon: BadgeCheck },
    { href: "/wallet", label: copy.menu.wallet, icon: Wallet },
    { href: "/progress", label: copy.menu.progress, icon: ChartNoAxesCombined },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="print-hide sticky top-0 z-40 border-b border-[color:var(--glass-border)] bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-2xl bg-[#D4AF37] text-sm font-bold text-[#0B132B]">
              {lang === "en" ? "N" : "ن"}
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold">{copy.brand}</span>
              <span className="hidden text-[11px] text-muted-foreground lg:block">
                {copy.brandLine}
              </span>
            </span>
          </Link>

          <nav className="ms-4 hidden min-w-0 items-center gap-0.5 overflow-x-auto md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-xl px-2 py-2 text-sm text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground",
                  isActive(pathname, item.href) && "bg-[#D4AF37] text-[#0B132B] hover:bg-[#D4AF37] hover:text-[#0B132B]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2">
            <div className="flex rounded-full p-0.5 ring-1 ring-[color:var(--glass-border)]">
              {(["fa", "en"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLang(item)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs",
                    lang === item && "bg-[#D4AF37] text-[#0B132B]",
                  )}
                >
                  {item === "fa" ? "فا" : "EN"}
                </button>
              ))}
            </div>
            <Button variant="outline" size="icon" className="rounded-full" onClick={toggle} aria-label={theme}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
            {authReady && isAuthenticated && currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="glass flex items-center gap-2 rounded-full py-1 ps-1 pe-3"
                  style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
                >
                  <Avatar>
                    <AvatarFallback>{currentUser.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-28 truncate text-sm sm:inline">{currentUser.name}</span>
                  <span className="rounded-full bg-[#D4AF37] px-2 py-0.5 text-[10px] font-medium text-[#0B132B]">
                    {currentUser.subscription?.isActive ? copy.session.gold : copy.session.free}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{currentUser.phone}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                      <LayoutDashboard />
                      {copy.session.panel}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/dashboard?tab=wallet")}>
                      <Wallet />
                      {copy.session.wallet}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/dashboard?tab=courses")}>
                      <BookOpen />
                      {copy.session.courses}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      endSession();
                      router.push("/");
                    }}
                  >
                    <LogOut />
                    {copy.session.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : ready && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full py-1 ps-1 pe-3 ring-1 ring-[color:var(--glass-border)] hover:bg-foreground/5">
                  <Avatar>
                    <AvatarFallback>{user.firstName.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-28 truncate text-sm sm:inline">
                    {user.name}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{user.email || user.phone}</DropdownMenuLabel>
                    {menu.map((item) => (
                      <DropdownMenuItem key={item.href} onClick={() => router.push(item.href)}>
                        <item.icon />
                        {item.href === "/progress" ? `${item.label} · ${percent}%` : item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                  >
                    <LogOut />
                    {copy.menu.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="glass inline-flex h-9 items-center rounded-full px-3 text-sm"
                style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
              >
                {copy.session.join}
              </Link>
            )}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen(true)}
              aria-label={copy.menu.menu}
            >
              <Menu />
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={dir === "rtl" ? "right" : "left"} className="w-72">
          <SheetHeader>
            <SheetTitle>{copy.brand}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1 px-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm",
                  isActive(pathname, item.href) ? "bg-[#D4AF37] text-[#0B132B]" : "hover:bg-foreground/5",
                )}
              >
                {item.label}
              </Link>
            ))}
            <p className="mt-4 px-3 text-xs text-muted-foreground">{copy.menu.account}</p>
            {isAuthenticated && currentUser ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-foreground/5">
                  {copy.session.panel}
                </Link>
                <Link href="/dashboard?tab=wallet" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-foreground/5">
                  {copy.session.wallet}
                </Link>
                <Link href="/dashboard?tab=courses" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-foreground/5">
                  {copy.session.courses}
                </Link>
                <button
                  className="rounded-xl px-3 py-2 text-start text-sm text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    endSession();
                    setOpen(false);
                    router.push("/");
                  }}
                >
                  {copy.session.signOut}
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-foreground/5">
                {copy.session.join}
              </Link>
            )}
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm hover:bg-foreground/5"
              >
                {item.href === "/progress" ? `${item.label} · ${percent}%` : item.label}
              </Link>
            ))}
            {user ? (
              <button
                className="rounded-xl px-3 py-2 text-start text-sm text-destructive hover:bg-destructive/10"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                {copy.menu.logout}
              </button>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      <main
        className={cn(
          pathname === "/login" || pathname === "/register"
            ? "flex w-full flex-1 flex-col bg-[#0B132B]"
            : "mx-auto w-full max-w-6xl flex-1 px-4 py-8 pb-28",
        )}
      >
        {children}
      </main>
      <footer className="print-hide border-t border-[color:var(--glass-border)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs leading-6 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{copy.footer.left}</p>
          <p>{copy.footer.right}</p>
        </div>
      </footer>
    </div>
  );
}
