"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/lib/i18n";

export function DashboardGate() {
  const { ready, isAuthenticated, currentUser } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const { copy } = useI18n();
  const tab = params.get("tab");
  const title = tab === "wallet" ? copy.session.wallet : tab === "courses" ? copy.session.courses : copy.session.dashboard;

  useEffect(() => {
    if (ready && !isAuthenticated) router.replace("/login");
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated || !currentUser) {
    return <div className="h-48 animate-pulse rounded-3xl bg-muted" />;
  }

  return (
    <section className="glass rounded-[2rem] p-6 shadow-2xl">
      <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{copy.session.panel}</p>
      <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {currentUser.name} · {currentUser.plan === "vip" ? copy.session.gold : copy.session.free}
      </p>
    </section>
  );
}
