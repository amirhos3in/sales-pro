import { Suspense } from "react";
import { DashboardGate } from "@/components/dashboard-gate";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="h-48 animate-pulse rounded-3xl bg-muted" />}>
      <DashboardGate />
    </Suspense>
  );
}
