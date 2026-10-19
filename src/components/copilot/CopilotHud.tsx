"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, RefreshCw, Square } from "lucide-react";
import { downsampleTo16k, openCallStream, pcmToBase64 } from "@/lib/copilot/capture";
import { ensurePlatformSession, platformWs, readPlatformToken } from "@/lib/copilot/endpoint";
import { counterFor, type CounterCard } from "@/lib/copilot/playbook";
import { useAuth } from "@/context/AuthContext";
import { tierFromPlan } from "@/lib/lms/rules";

type Phase = "idle" | "listening" | "analyzing" | "ready";
type Source = "voip" | "ambient";

const samples = ["قیمت بالاست", "تخفیف بدید", "باید فکر کنم"];

type SpeechWindow = Window & {
  webkitSpeechRecognition?: new () => SpeechHandle;
  SpeechRecognition?: new () => SpeechHandle;
};

type SpeechHandle = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
};

function guestPhone() {
  const key = "nexsell-guest-phone";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const phone = `09${Math.floor(100000000 + Math.random() * 899999999)}`;
  localStorage.setItem(key, phone);
  return phone;
}

function clock(total: number) {
  const safe = Math.max(0, total);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes.toLocaleString("fa-IR")}:${seconds.toLocaleString("fa-IR").padStart(2, "۰")}`;
}

export function CopilotHud() {
  const { currentUser } = useAuth();
  const [source, setSource] = useState<Source>("ambient");
  const [phase, setPhase] = useState<Phase>("idle");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [card, setCard] = useState<CounterCard | null>(null);
  const [heard, setHeard] = useState("");
  const [error, setError] = useState("");
  const [live, setLive] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<SpeechHandle | null>(null);
  const heardRef = useRef("");

  function bindSocket(socket: WebSocket) {
    socketRef.current = socket;
    socket.onmessage = (event) => {
      const message = JSON.parse(String(event.data)) as {
        type?: string;
        phase?: Phase;
        remainingSeconds?: number;
        text?: string;
        message?: string;
        tag?: string;
        technique?: string;
        say?: string;
        variant?: number;
        id?: CounterCard["id"];
      };
      if (message.type === "status" && message.phase) setPhase(message.phase);
      if (message.type === "quota" && typeof message.remainingSeconds === "number") setRemaining(message.remainingSeconds);
      if (message.type === "transcript" && message.text) setHeard(message.text);
      if (message.type === "objection") {
        setCard({
          matched: true,
          id: message.id ?? null,
          tag: message.tag ?? "",
          technique: message.technique ?? "",
          say: message.say ?? "",
          variant: message.variant ?? 0,
        });
      }
      if (message.type === "error" && message.message) setError(message.message);
    };
  }

  function openSocket() {
    const token = readPlatformToken();
    if (!token) return null;
    const existing = socketRef.current;
    if (existing && (existing.readyState === WebSocket.OPEN || existing.readyState === WebSocket.CONNECTING)) return existing;
    const socket = new WebSocket(platformWs(token));
    bindSocket(socket);
    return socket;
  }

  function deliver(text: string) {
    heardRef.current = text;
    setHeard(text);
    const socket = openSocket();
    if (socket) {
      const send = () => socket.send(JSON.stringify({ type: "transcript", text }));
      if (socket.readyState === WebSocket.OPEN) send();
      else socket.addEventListener("open", send, { once: true });
      return;
    }
    const local = counterFor(text);
    setCard(local);
    setPhase(local.matched ? "ready" : "listening");
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const plan = currentUser?.subscription?.isActive
        ? currentUser.subscription.planType === "monthly"
          ? "eco"
          : currentUser.subscription.planType === "quarterly"
            ? "plus"
            : "pro"
        : null;
      void ensurePlatformSession({
        phone: currentUser?.phone || guestPhone(),
        name: currentUser?.name || "مهمان کوپایلوت",
        plan,
        active: Boolean(plan),
      })
        .then((session) => {
          const quota = session.subscription;
          if (quota) setRemaining(Math.max(0, (quota.quotaSeconds ?? 0) - (quota.usedSeconds ?? 0)));
        })
        .catch(() => setError("سرویس کوپایلوت در دسترس نیست. جواب تمرینی روی همین صفحه می‌ماند."));
    }, 0);
    return () => clearTimeout(timer);
  }, [currentUser]);

  function stop() {
    setLive(false);
    setPhase("idle");
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioRef.current?.close();
    audioRef.current = null;
    socketRef.current?.close();
    socketRef.current = null;
  }

  async function start() {
    setError("");
    setCard(null);
    const socket = openSocket();
    try {
      const stream = await openCallStream(source);
      streamRef.current = stream;
      const audio = new AudioContext();
      audioRef.current = audio;
      await audio.audioWorklet.addModule("/pcm-worklet.js");
      const node = new AudioWorkletNode(audio, "pcm-downsampler");
      const mic = audio.createMediaStreamSource(stream);
      node.port.onmessage = (event: MessageEvent<Float32Array>) => {
        const pcm = downsampleTo16k(event.data, audio.sampleRate);
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "audio", pcm: pcmToBase64(pcm), source }));
        }
      };
      const sink = audio.createGain();
      sink.gain.value = 0;
      mic.connect(node);
      node.connect(sink);
      sink.connect(audio.destination);
      setLive(true);
      setPhase("listening");
    } catch {
      setError(source === "voip" ? "صدای سیستم فقط با اشتراک‌گذاری صدای تب یا سیستم باز می‌شود." : "اجازهٔ میکروفن داده نشد.");
    }
    const root = window as SpeechWindow;
    const Ctor = root.SpeechRecognition || root.webkitSpeechRecognition;
    if (Ctor) {
      const recognition = new Ctor();
      recognition.lang = "fa-IR";
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const text = event.results[event.results.length - 1]?.[0]?.transcript ?? "";
        if (!text) return;
        deliver(text);
      };
      recognition.onerror = () => undefined;
      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        recognitionRef.current = null;
      }
    }
  }

  function regenerate() {
    const text = heardRef.current || heard;
    const socket = socketRef.current;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "regenerate" }));
      return;
    }
    if (!text) return;
    setCard(counterFor(text, (card?.variant ?? 0) + 1));
  }

  const tier = currentUser?.subscription?.isActive
    ? tierFromPlan(
        currentUser.subscription.planType === "monthly" ? "eco" : currentUser.subscription.planType === "quarterly" ? "plus" : "pro",
        true,
      )
    : "free";

  return (
    <section dir="rtl" className="min-h-[70vh] rounded-[28px] bg-[#070B18] p-4 text-[#F8F1DE] sm:p-6" data-copilot-hud>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.18em] text-[#D4AF37]">دستیار زنده فروش</p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">پشت خط، جواب را آماده ببینید</h1>
        </div>
        <p className="rounded-2xl bg-white/5 px-4 py-3 text-sm" data-quota>
          باقی‌مانده این ماه: {remaining === null ? "…" : clock(remaining)}
          <span className="mt-1 block text-xs text-white/50">پلن دسترسی: {tier === "free" ? "آزمایشی" : tier === "lms" ? "فقط آکادمی" : tier === "pro_copilot" ? "کوپایلوت" : "سازمانی"}</span>
        </p>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2" role="group" aria-label="منبع صدا">
        {([
          ["voip", "تماس سیستمی / VoIP"],
          ["ambient", "تماس محیطی موبایل"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            data-source={id}
            aria-pressed={source === id}
            onClick={() => {
              if (!live) setSource(id);
            }}
            className={`h-12 rounded-2xl text-sm ${source === id ? "bg-[#D4AF37] text-[#0B132B]" : "bg-white/5"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs" data-copilot-status={phase}>
          <span className={`size-2 rounded-full ${phase === "ready" ? "bg-emerald-400" : phase === "idle" ? "bg-white/40" : "animate-pulse bg-[#D4AF37]"}`} />
          {phase === "listening" ? "در حال شنیدن" : phase === "analyzing" ? "در حال تحلیل" : phase === "ready" ? "جواب آماده است" : "آماده"}
        </span>
        {live ? (
          <button type="button" onClick={stop} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-[#0B132B]">
            <Square className="size-4" /> پایان
          </button>
        ) : (
          <button type="button" data-copilot-start onClick={() => void start()} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#D4AF37] px-4 text-sm font-semibold text-[#0B132B]">
            <Mic className="size-4" /> شروع گوش دادن
          </button>
        )}
        <button type="button" data-regenerate onClick={regenerate} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white/10 px-4 text-sm">
          <RefreshCw className="size-4" /> جواب دیگر
        </button>
        {samples.map((sample) => (
          <button key={sample} type="button" data-sample-objection={sample} onClick={() => deliver(sample)} className="h-10 rounded-full bg-white/10 px-3 text-xs">
            {sample}
          </button>
        ))}
      </div>

      {heard ? <p className="mt-4 text-sm text-white/70">شنیده شد: {heard}</p> : null}
      {error ? <p className="mt-3 text-sm text-[#F3A6A6]">{error}</p> : null}

      {card?.matched ? (
        <article className="mt-6 rounded-[28px] border border-[#D4AF37]/40 bg-[#10182E] p-5" data-flash-card>
          <p className="text-sm text-[#F3A6A6]" data-objection-tag>🔴 {card.tag}</p>
          <p className="mt-4 text-sm text-[#D4AF37]">تکنیک: {card.technique}</p>
          <p className="mt-2 text-2xl font-semibold leading-10" data-counter-say>بگو: {card.say}</p>
        </article>
      ) : (
        <p className="mt-8 text-sm leading-7 text-white/60">
          گوشی را روی بلندگو بگذارید یا صدای تماس سیستمی را به اشتراک بگذارید. تا وقتی قیمت، تخفیف، فکر کردن یا مقایسه با جای دیگر شنیده نشود، مدل زبانی صدا زده نمی‌شود.
        </p>
      )}
    </section>
  );
}
