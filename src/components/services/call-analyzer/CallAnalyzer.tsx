"use client";

import { useState } from "react";
import { AnalysisLoading } from "@/components/services/call-analyzer/AnalysisLoading";
import { AnalysisReport } from "@/components/services/call-analyzer/AnalysisReport";
import { AudioUploader } from "@/components/services/call-analyzer/AudioUploader";
import { QuotaBadge } from "@/components/QuotaBadge";
import { useI18n } from "@/lib/i18n";

type View = "input" | "loading" | "report";

export function CallAnalyzer() {
  const { copy } = useI18n();
  const text = copy.auditor;
  const [view, setView] = useState<View>("input");

  if (view === "report") {
    return <AnalysisReport onAnother={() => setView("input")} />;
  }

  return (
    <section
      className="glass call-auditor relative overflow-hidden rounded-[2rem] p-5 shadow-2xl sm:p-7"
      style={{ backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)" }}
    >
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-xl">
          <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{text.kicker}</p>
          <h2 className="mt-2 text-xl font-semibold">{text.title}</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{text.intro}</p>
        </div>
        <QuotaBadge />
      </div>
      {view === "loading" ? (
        <AnalysisLoading onComplete={() => setView("report")} />
      ) : (
        <AudioUploader onAnalyzed={() => setView("loading")} />
      )}
    </section>
  );
}
