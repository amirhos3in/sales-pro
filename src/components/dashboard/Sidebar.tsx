"use client";

import Link from "next/link";
import { BookOpen, Headset, LayoutDashboard, PhoneCall, UserRound, Wallet } from "lucide-react";
import { avatarChoice, frostStyle } from "@/components/dashboard/style";
import type { AcademyUser } from "@/context/AuthContext";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type DashTab = "overview" | "profile" | "courses" | "wallet" | "audits" | "tickets";

export function resolveTab(value: string | null): DashTab {
  if (value === "profile" || value === "courses" || value === "wallet" || value === "overview" || value === "audits" || value === "tickets") return value;
  return "overview";
}

export function Sidebar({ user, tab }: { user: AcademyUser; tab: DashTab }) {
  const { copy } = useI18n();
  const portrait = avatarChoice(user.avatarId);
  const items = [
    { id: "overview" as const, href: "/dashboard?tab=overview", label: copy.dash.overview, icon: LayoutDashboard },
    { id: "profile" as const, href: "/dashboard?tab=profile", label: copy.dash.profile, icon: UserRound },
    { id: "courses" as const, href: "/dashboard?tab=courses", label: copy.session.courses, icon: BookOpen },
    { id: "wallet" as const, href: "/dashboard?tab=wallet", label: copy.session.wallet, icon: Wallet },
    { id: "audits" as const, href: "/dashboard?tab=audits", label: copy.dash.audits, icon: PhoneCall },
    { id: "tickets" as const, href: "/dashboard?tab=tickets", label: copy.dash.tickets, icon: Headset },
  ];

  const links = (pill: boolean) =>
    items.map((item) => {
      const Icon = item.icon;
      const active = tab === item.id;
      return (
        <Link
          key={item.id}
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex items-center gap-2 rounded-2xl text-sm transition",
            pill ? "shrink-0 px-3 py-2" : "px-3 py-2.5",
            active ? "bg-[#D4AF37] text-[#0B132B]" : "hover:bg-foreground/5",
          )}
        >
          <Icon className="size-4" />
          {item.label}
        </Link>
      );
    });

  return (
    <>
      <div className="glass -mx-4 flex gap-2 overflow-x-auto px-4 py-2 lg:hidden" style={frostStyle}>
        {links(true)}
      </div>
      <aside className="glass hidden w-64 shrink-0 rounded-[28px] p-4 lg:block" style={frostStyle}>
        <div className="flex items-center gap-3">
          <span
            className="grid size-12 shrink-0 place-items-center rounded-full text-lg font-semibold"
            style={{ background: portrait.background, color: portrait.color }}
          >
            {user.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.jobTitle}</p>
          </div>
        </div>
        <p className="mt-3 inline-flex rounded-full bg-[#D4AF37] px-2.5 py-1 text-[11px] font-medium text-[#0B132B]">
          {user.plan === "vip" ? copy.dash.vipPlan : copy.dash.freePlan}
        </p>
        <nav className="mt-5 flex flex-col gap-1">{links(false)}</nav>
      </aside>
    </>
  );
}
