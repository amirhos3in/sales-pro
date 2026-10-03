"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/context/AuthContext";

export function DashboardGate() {
  const { ready, isAuthenticated, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAuthenticated) router.replace("/login");
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated || !currentUser) {
    return <div className="h-48 animate-pulse rounded-3xl bg-muted" />;
  }

  return <DashboardShell user={currentUser} />;
}
