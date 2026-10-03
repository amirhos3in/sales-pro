"use client";

import { useState } from "react";
import { AnalysisReport } from "@/components/services/call-analyzer/AnalysisReport";
import { frostStyle, goldButtonStyle } from "@/components/dashboard/style";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { localeNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { auditHistory, type AuditRecord } from "@/lib/call-audit-history";

export function CallAuditsTab() {
  const { copy, lang } = useI18n();
  const text = copy.dash;
  const [selected, setSelected] = useState<AuditRecord | null>(null);

  function stamp(value: string) {
    return new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", { dateStyle: "medium" }).format(new Date(value));
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{text.audits}</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{text.auditsLead}</p>
      </div>
      <div className="grid gap-3">
        {auditHistory.map((item) => (
          <article key={item.id} className="glass rounded-[28px] p-5" style={frostStyle}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{item.title[lang]}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{stamp(item.at)}</p>
              </div>
              <p className="text-sm font-semibold text-[#8C7016] dark:text-[#D4AF37]">
                {text.score} {localeNumber(item.audit.overallScore, lang)} / {localeNumber(100, lang)}
              </p>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted-foreground">{item.audit.strengths[0]?.[lang]}</p>
            <button type="button" className="mt-4 h-10 rounded-2xl px-4 text-sm font-medium" style={goldButtonStyle} onClick={() => setSelected(item)}>
              {text.viewReport}
            </button>
          </article>
        ))}
      </div>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selected?.title[lang]}</DialogTitle>
          </DialogHeader>
          {selected ? <AnalysisReport audit={selected.audit} onAnother={() => setSelected(null)} /> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
