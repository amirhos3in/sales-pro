"use client";

import { useState } from "react";
import { Mic, Square } from "lucide-react";
import { counterFor, type CounterCard } from "@/lib/copilot/playbook";
import { platformHttp } from "@/lib/copilot/endpoint";

const samples = ["قیمت بالاست", "تخفیف بدید", "باید فکر کنم"];

type SpeechWindow = Window & {
  webkitSpeechRecognition?: new () => SpeechHandle;
  SpeechRecognition?: new () => SpeechHandle;
};

type SpeechHandle = {
  lang: string;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export function LiveDemo() {
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [card, setCard] = useState<CounterCard | null>(null);
  const [note, setNote] = useState("");

  async function show(text: string) {
    const started = performance.now();
    setHeard(text);
    try {
      const response = await fetch(platformHttp("/api/platform/counter"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        setCard((await response.json()) as CounterCard);
        setNote(`${Math.round(performance.now() - started)} میلی‌ثانیه`);
        return;
      }
    } catch {
      // The public page still answers from the local playbook.
    }
    setCard(counterFor(text));
    setNote("پاسخ محلی");
  }

  function listen() {
    const root = window as SpeechWindow;
    const Ctor = root.SpeechRecognition || root.webkitSpeechRecognition;
    if (!Ctor) {
      setNote("مرورگر تشخیص گفتار ندارد. یکی از جمله‌های آماده را بزنید.");
      return;
    }
    const recognition = new Ctor();
    recognition.lang = "fa-IR";
    recognition.interimResults = false;
    setListening(true);
    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript ?? "";
      if (text) void show(text);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  }

  return (
    <section dir="rtl" className="glass rounded-[2rem] p-6 shadow-2xl sm:p-8" data-live-demo>
      <p className="text-xs tracking-[0.16em] text-[#D4AF37]">دموی زنده، بدون ورود</p>
      <h2 className="mt-2 text-2xl font-semibold">یک اعتراض بگویید، جواب پشت‌خط را ببینید</h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
        میکروفن را روشن کنید یا یکی از اعتراض‌های رایج را بزنید. فیلتر قصد فقط روی اعتراض و سؤال خرید جواب می‌سازد.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-demo-mic
          onClick={listening ? () => setListening(false) : listen}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#D4AF37] px-4 text-sm font-semibold text-[#0B132B]"
        >
          {listening ? <Square className="size-4" /> : <Mic className="size-4" />}
          {listening ? "در حال شنیدن" : "حرف بزنید"}
        </button>
        {samples.map((sample) => (
          <button
            key={sample}
            type="button"
            data-sample-objection={sample}
            onClick={() => void show(sample)}
            className="h-10 rounded-full px-3 text-xs ring-1 ring-[color:var(--glass-border)]"
          >
            {sample}
          </button>
        ))}
      </div>
      {heard ? <p className="mt-4 text-sm text-muted-foreground">شنیده شد: {heard}</p> : null}
      {card?.matched ? (
        <article className="mt-4 rounded-3xl bg-[#0B132B] p-5 text-[#F8F1DE]" data-counter-card>
          <p className="text-sm text-[#F3A6A6]" data-objection-tag>
            🔴 {card.tag}
          </p>
          <p className="mt-3 text-xs text-[#D4AF37]">تکنیک: {card.technique}</p>
          <p className="mt-2 text-lg font-medium leading-8" data-counter-say>
            بگو: {card.say}
          </p>
          {note ? <p className="mt-3 text-xs text-white/60">{note}</p> : null}
        </article>
      ) : null}
      {card && !card.matched ? <p className="mt-4 text-sm">هنوز اعتراض روشنی نشنیدم. قیمت، تخفیف یا «باید فکر کنم» را بگویید.</p> : null}
    </section>
  );
}
