"use client";

import Link from "next/link";
import { Copy, FileDown, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { localeNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { mockAnalysisData, type CallAudit } from "@/lib/mockAnalysisData";

function reportPlain(audit: CallAudit, lang: "fa" | "en", labels: {
  title: string;
  level: string;
  strengths: string;
  weaknesses: string;
  drills: string;
  bars: Record<CallAudit["subMetrics"][number]["key"], string>;
}) {
  const mark = lang === "fa" ? "٪" : "%";
  const lines = [
    labels.title,
    `${localeNumber(audit.overallScore, lang)} / ${localeNumber(100, lang)} — ${labels.level}`,
    "",
    ...audit.subMetrics.map(
      (metric) => `${labels.bars[metric.key]}: ${localeNumber(metric.score, lang)}${mark}`,
    ),
    "",
    labels.strengths,
    ...audit.strengths.map((item) => `- ${item[lang]}`),
    "",
    labels.weaknesses,
    ...audit.weaknesses.map((item) => `- ${item.timestamp} ${item[lang]}`),
    "",
    labels.drills,
    ...audit.drills.map((item) => `- ${item[lang]}`),
  ];
  return lines.join("\n");
}

function ScoreGauge({ value, score, total, level }: { value: number; score: string; total: string; level: string }) {
  const radius = 52;
  const length = 2 * Math.PI * radius;
  const offset = length * (1 - Math.min(100, value) / 100);
  return (
    <div className="relative grid size-40 place-items-center">
      <svg viewBox="0 0 140 140" className="size-40 -rotate-90" aria-hidden="true">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-[#0B132B]/10 dark:text-white/15" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-semibold text-[#0B132B] dark:text-[#F3E5AB]">{score}</p>
        <p className="text-xs text-muted-foreground">/ {total}</p>
        <p className="mt-1 text-xs font-medium text-[#8C7016] dark:text-[#D4AF37]">{level}</p>
      </div>
    </div>
  );
}

export function AnalysisReport({
  audit = mockAnalysisData,
  onAnother,
}: {
  audit?: CallAudit;
  onAnother: () => void;
}) {
  const { copy, lang } = useI18n();
  const text = copy.auditor;
  const score = localeNumber(audit.overallScore, lang);
  const total = localeNumber(100, lang);
  const mark = lang === "fa" ? "٪" : "%";

  async function copyReport() {
    const body = reportPlain(audit, lang, {
      title: text.reportTitle,
      level: text.level,
      strengths: text.strengths,
      weaknesses: text.weaknesses,
      drills: text.drills,
      bars: text.bars,
    });
    try {
      await navigator.clipboard.writeText(body);
      toast.success(text.copied);
    } catch {
      toast.error(text.copyFailed);
    }
  }

  return (
    <section
      className="call-report glass call-auditor relative overflow-hidden rounded-[2rem] p-5 shadow-2xl sm:p-7"
      style={{ backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{text.kicker}</p>
          <h2 className="mt-2 text-xl font-semibold">{text.reportTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {score} / {total} — {text.level}
          </p>
        </div>
        <ScoreGauge value={audit.overallScore} score={score} total={total} level={text.level} />
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {audit.subMetrics.map((metric) => (
          <li key={metric.key} className="rounded-2xl border border-[#D4AF37]/35 bg-white/40 px-3 py-3 dark:bg-[#0B132B]/45">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span>{text.bars[metric.key]}</span>
              <span className="font-semibold text-[#8C7016] dark:text-[#F3E5AB]">
                {localeNumber(metric.score, lang)}
                {mark}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#0B132B]/10 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#D4AF37]"
                style={{ width: `${metric.score}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section>
          <h3 className="text-sm font-semibold">{text.strengths}</h3>
          <ul className="mt-3 space-y-2">
            {audit.strengths.map((item) => (
              <li
                key={item.en}
                className="rounded-2xl border border-emerald-600/30 bg-emerald-500/10 px-3 py-3 text-sm leading-7 text-[#0B132B] dark:border-[#D4AF37]/40 dark:bg-[#D4AF37]/10 dark:text-[#F6F1E4]"
              >
                {item[lang]}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-sm font-semibold">{text.weaknesses}</h3>
          <ul className="mt-3 space-y-2">
            {audit.weaknesses.map((item) => (
              <li
                key={item.timestamp}
                className="rounded-2xl border border-rose-400/40 bg-amber-500/10 px-3 py-3 text-sm leading-7 text-[#0B132B] dark:text-[#F6F1E4]"
              >
                <span dir="ltr" className="mb-1 inline-block rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-200">
                  {item.timestamp}
                </span>
                <p>{item[lang]}</p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-sm font-semibold">{text.drills}</h3>
          <ul className="mt-3 space-y-2">
            {audit.drills.map((item) => (
              <li key={item.en} className="glass rounded-2xl px-3 py-3 text-sm leading-7">
                <p>{item[lang]}</p>
                {item.href ? (
                  <Link href={item.href} className="mt-2 inline-flex text-xs font-medium text-[#8C7016] underline-offset-4 hover:underline dark:text-[#D4AF37]">
                    {text.openLesson}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="print-hide mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={copyReport} className="inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm ring-1 ring-[#D4AF37]/50">
          <Copy className="size-4" />
          {text.copy}
        </button>
        <button type="button" onClick={() => window.print()} className="inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm ring-1 ring-[#D4AF37]/50">
          <FileDown className="size-4" />
          {text.download}
        </button>
        <button
          type="button"
          onClick={onAnother}
          className="inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-medium"
          style={{ backgroundColor: "#D4AF37", color: "#0B132B" }}
        >
          <RotateCcw className="size-4" />
          {text.another}
        </button>
      </div>
    </section>
  );
}
