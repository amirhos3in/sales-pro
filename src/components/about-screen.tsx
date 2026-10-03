"use client";

import { Compass, Gem, Handshake, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const valueIcons = [Gem, Compass, Handshake, ShieldCheck];

export function AboutScreen() {
  const { copy } = useI18n();
  const page = copy.aboutPage;

  return (
    <div className="space-y-8">
      <section className="glass relative overflow-hidden rounded-[2rem] p-6 shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute -top-20 end-0 size-56 rounded-full bg-[#D4AF37]/20 blur-3xl" />
        <p className="text-xs tracking-[0.18em] text-[#D4AF37]">{page.kicker}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-[1.45] sm:text-4xl">{page.title}</h1>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <article className="rounded-3xl border border-[#D4AF37]/35 bg-white/45 p-5 shadow-[inset_0_1px_0_rgba(212,175,55,0.35)] backdrop-blur-md dark:bg-[#0F1C3F]/45">
            <h2 className="text-sm font-semibold text-[#8C7016] dark:text-[#D4AF37]">{page.missionTitle}</h2>
            <p className="mt-2 text-sm leading-8 text-muted-foreground">{page.mission}</p>
          </article>
          <article className="rounded-3xl border border-[#D4AF37]/35 bg-white/45 p-5 shadow-[inset_0_1px_0_rgba(212,175,55,0.35)] backdrop-blur-md dark:bg-[#0F1C3F]/45">
            <h2 className="text-sm font-semibold text-[#8C7016] dark:text-[#D4AF37]">{page.visionTitle}</h2>
            <p className="mt-2 text-sm leading-8 text-muted-foreground">{page.vision}</p>
          </article>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-8">{page.statement}</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">{page.valuesTitle}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {page.values.map((value, index) => {
            const Icon = valueIcons[index] ?? Gem;
            return (
              <article key={value.title} className="glass rounded-3xl p-5 shadow-xl">
                <span className="grid size-10 place-items-center rounded-2xl border border-[#D4AF37]/40 text-[#D4AF37]">
                  <Icon className="size-4" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{value.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="glass rounded-[2rem] p-6 shadow-2xl sm:p-8">
        <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{page.leadTitle}</p>
        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="grid size-20 shrink-0 place-items-center rounded-3xl border border-[#D4AF37]/50 bg-[#D4AF37]/15 text-xl font-semibold text-[#8C7016] dark:text-[#F3E5AB]">
            {page.leadName.slice(0, 1)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold">{page.leadName}</h2>
              <span className="rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 px-2.5 py-1 text-[11px] text-[#8C7016] dark:text-[#D4AF37]">
                {page.leadBadge}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#8C7016] dark:text-[#D4AF37]">{page.leadRole}</p>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-muted-foreground">{page.leadBio}</p>
            <ul className="mt-4 space-y-2 text-sm leading-7">
              {page.credentials.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
