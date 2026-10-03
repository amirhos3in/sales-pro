"use client";

import { useSearchParams } from "next/navigation";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { resolveTab, Sidebar } from "@/components/dashboard/Sidebar";
import { frostStyle } from "@/components/dashboard/style";
import type { AcademyUser } from "@/context/AuthContext";
import { localeNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export function DashboardShell({ user }: { user: AcademyUser }) {
  const params = useSearchParams();
  const tab = resolveTab(params.get("tab"));
  const { copy, lang } = useI18n();

  return (
    <div className="lg:flex lg:items-start lg:gap-4">
      <Sidebar user={user} tab={tab} />
      <div className="mt-4 min-w-0 flex-1 lg:mt-0">
        {tab === "profile" ? <ProfileTab user={user} /> : null}
        {tab === "overview" ? <OverviewTab user={user} /> : null}
        {tab === "wallet" ? (
          <section className="glass rounded-[28px] p-6" style={frostStyle}>
            <h1 className="text-2xl font-semibold">{copy.session.wallet}</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.dash.walletLead}</p>
            <p className="mt-4 text-3xl font-semibold">
              {localeNumber(user.walletBalance, lang)} {copy.dash.toman}
            </p>
          </section>
        ) : null}
        {tab === "courses" ? (
          <section className="glass rounded-[28px] p-6" style={frostStyle}>
            <h1 className="text-2xl font-semibold">{copy.session.courses}</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.dash.coursesLead}</p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
