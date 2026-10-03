"use client";

import { useSearchParams } from "next/navigation";
import { CallAuditsTab } from "@/components/dashboard/CallAuditsTab";
import { CoursesTab } from "@/components/dashboard/CoursesTab";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { resolveTab, Sidebar } from "@/components/dashboard/Sidebar";
import { TicketsTab } from "@/components/dashboard/TicketsTab";
import { WalletTab } from "@/components/dashboard/WalletTab";
import type { AcademyUser } from "@/context/AuthContext";

export function DashboardShell({ user }: { user: AcademyUser }) {
  const params = useSearchParams();
  const tab = resolveTab(params.get("tab"));

  return (
    <div className="lg:flex lg:items-start lg:gap-4">
      <Sidebar user={user} tab={tab} />
      <div className="mt-4 min-w-0 flex-1 lg:mt-0">
        {tab === "profile" ? <ProfileTab user={user} /> : null}
        {tab === "overview" ? <OverviewTab user={user} /> : null}
        {tab === "wallet" ? <WalletTab user={user} /> : null}
        {tab === "courses" ? <CoursesTab /> : null}
        {tab === "audits" ? <CallAuditsTab /> : null}
        {tab === "tickets" ? <TicketsTab /> : null}
      </div>
    </div>
  );
}
