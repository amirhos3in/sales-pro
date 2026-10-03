"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const tones = {
  instagram: "hover:border-[#E1306C]/70 hover:bg-[#E1306C]/12",
  telegram: "hover:border-[#2AABEE]/70 hover:bg-[#2AABEE]/12",
  linkedin: "hover:border-[#0A66C2]/70 hover:bg-[#0A66C2]/12",
  video: "hover:border-[#FF0033]/60 hover:bg-[#FF0033]/10",
} as const;

export function ContactScreen() {
  const { copy } = useI18n();
  const page = copy.contactPage;

  return (
    <div className="space-y-8">
      <section className="glass relative overflow-hidden rounded-[2rem] p-6 shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute -top-16 start-0 size-48 rounded-full bg-[#D4AF37]/15 blur-3xl" />
        <p className="text-xs tracking-[0.18em] text-[#D4AF37]">{page.kicker}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-[1.45] sm:text-4xl">{page.title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground">{page.intro}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="glass rounded-3xl p-5 shadow-xl">
          <span className="grid size-10 place-items-center rounded-2xl border border-[#D4AF37]/40 text-[#D4AF37]">
            <MapPin className="size-4" />
          </span>
          <h2 className="mt-4 text-base font-semibold">{page.hq}</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{page.address}</p>
        </article>

        <article className="glass rounded-3xl p-5 shadow-xl">
          <span className="grid size-10 place-items-center rounded-2xl border border-[#D4AF37]/40 text-[#D4AF37]">
            <Phone className="size-4" />
          </span>
          <h2 className="mt-4 text-base font-semibold">{page.phone}</h2>
          <div className="mt-3 flex flex-col items-start gap-2">
            {page.phones.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-[#8C7016] underline-offset-4 hover:underline dark:text-[#D4AF37]">
                {item.label}
              </a>
            ))}
          </div>
        </article>

        <article className="glass rounded-3xl p-5 shadow-xl">
          <span className="grid size-10 place-items-center rounded-2xl border border-[#D4AF37]/40 text-[#D4AF37]">
            <Mail className="size-4" />
          </span>
          <h2 className="mt-4 text-base font-semibold">{page.email}</h2>
          <div className="mt-3 flex flex-col items-start gap-2">
            {page.emails.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-[#8C7016] underline-offset-4 hover:underline dark:text-[#D4AF37]">
                {item.label}
              </a>
            ))}
          </div>
        </article>

        <article className="glass rounded-3xl p-5 shadow-xl">
          <span className="grid size-10 place-items-center rounded-2xl border border-[#D4AF37]/40 text-[#D4AF37]">
            <Clock className="size-4" />
          </span>
          <h2 className="mt-4 text-base font-semibold">{page.hours}</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{page.hoursText}</p>
        </article>
      </section>

      <section>
        <h2 className="text-lg font-semibold">{page.socialTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {page.socials.map((social) =>
            "aparat" in social ? (
              <div key={social.tone} className={cn("glass rounded-3xl p-4 shadow-xl transition", tones[social.tone])}>
                <p className="text-sm font-semibold">{social.name}</p>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{social.handle}</p>
                <div className="mt-3 flex gap-3 text-xs">
                  <a href={social.href} target="_blank" rel="noreferrer" className="text-[#8C7016] underline-offset-4 hover:underline dark:text-[#D4AF37]">
                    YouTube
                  </a>
                  <a href={social.aparat} target="_blank" rel="noreferrer" className="text-[#8C7016] underline-offset-4 hover:underline dark:text-[#D4AF37]">
                    Aparat
                  </a>
                </div>
              </div>
            ) : (
              <a
                key={social.tone}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className={cn("glass rounded-3xl p-4 shadow-xl transition", tones[social.tone])}
              >
                <p className="text-sm font-semibold">{social.name}</p>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{social.handle}</p>
              </a>
            ),
          )}
        </div>
      </section>

      <p className="glass rounded-3xl px-5 py-4 text-sm leading-8 text-muted-foreground">{page.widgetNote}</p>
    </div>
  );
}
