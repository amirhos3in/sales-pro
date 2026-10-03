"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useGate } from "@/components/gates";
import { useCallQuota } from "@/hooks/useCallQuota";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const MAX_BYTES = 50 * 1024 * 1024;
const ACCEPT = ".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a";

function clock(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function simulatedSeconds(bytes: number) {
  return Math.max(15, Math.min(45 * 60, Math.round(bytes / 16000)));
}

function acceptedFile(file: File) {
  const name = file.name.toLowerCase();
  return name.endsWith(".mp3") || name.endsWith(".wav") || name.endsWith(".m4a");
}

export function AudioUploader({ onAnalyzed }: { onAnalyzed: () => void }) {
  const { copy } = useI18n();
  const text = copy.auditor;
  const { canAnalyze, consumeQuota } = useCallQuota();
  const { openPaywall } = useGate();
  const inputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAt = useRef(0);
  const tickRef = useRef<number>(0);
  const busy = useRef(false);
  const [tab, setTab] = useState<"upload" | "record">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [over, setOver] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [take, setTake] = useState<{ seconds: number; url: string } | null>(null);

  useEffect(() => {
    return () => {
      window.clearInterval(tickRef.current);
      recorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      if (take?.url) URL.revokeObjectURL(take.url);
    };
  }, [take?.url]);

  function chooseFile(next: File | null) {
    if (!next) return;
    if (!acceptedFile(next)) {
      toast.error(text.badType);
      return;
    }
    if (next.size > MAX_BYTES) {
      toast.error(text.badSize);
      return;
    }
    setFile(next);
  }

  async function startRecording() {
    if (recording || !navigator.mediaDevices?.getUserMedia) {
      toast.error(text.micError);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferred = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) =>
        MediaRecorder.isTypeSupported(type),
      );
      const recorder = new MediaRecorder(stream, preferred ? { mimeType: preferred } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        window.clearInterval(tickRef.current);
        const seconds = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        setTake((current) => {
          if (current?.url) URL.revokeObjectURL(current.url);
          return { seconds, url: URL.createObjectURL(blob) };
        });
        setElapsed(seconds);
        setRecording(false);
      };
      recorderRef.current = recorder;
      startedAt.current = Date.now();
      setElapsed(0);
      setRecording(true);
      recorder.start();
      tickRef.current = window.setInterval(() => {
        setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
      }, 250);
    } catch {
      toast.error(text.micError);
    }
  }

  function stopRecording() {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    recorder.stop();
  }

  function clearTake() {
    setTake((current) => {
      if (current?.url) URL.revokeObjectURL(current.url);
      return null;
    });
    setElapsed(0);
  }

  function analyze() {
    if (busy.current) return;
    if (!canAnalyze) {
      openPaywall(text.quotaExceeded);
      return;
    }
    const ready = tab === "upload" ? Boolean(file) : Boolean(take);
    if (!ready) {
      toast.error(text.needAudio);
      return;
    }
    if (!consumeQuota()) {
      openPaywall(text.quotaExceeded);
      return;
    }
    busy.current = true;
    onAnalyzed();
  }

  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#0B132B]/5 p-1 dark:bg-white/5">
        {([
          ["upload", text.uploadTab],
          ["record", text.recordTab],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "h-10 rounded-xl px-3 text-sm",
              tab === id ? "bg-[#D4AF37] text-[#0B132B]" : "text-muted-foreground hover:bg-foreground/5",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "upload" ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setOver(false);
              chooseFile(event.dataTransfer.files[0] ?? null);
            }}
            className={cn(
              "flex min-h-36 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-[#D4AF37]/50 bg-white/35 px-4 py-6 text-center dark:bg-[#0B132B]/40",
              over && "border-[#D4AF37] bg-[#D4AF37]/10",
            )}
          >
            <Upload className="size-5 text-[#D4AF37]" />
            <span className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">{text.drop}</span>
            <span className="mt-3 text-sm font-medium text-[#8C7016] dark:text-[#D4AF37]">{text.browse}</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(event) => {
              chooseFile(event.target.files?.[0] ?? null);
              event.target.value = "";
            }}
          />
          {file ? (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-[#D4AF37]/30 px-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {text.duration}: <span dir="ltr">{clock(simulatedSeconds(file.size))}</span>
                </p>
              </div>
              <button type="button" onClick={() => setFile(null)} className="inline-flex items-center gap-1 text-xs text-muted-foreground" aria-label={text.remove}>
                <X className="size-3.5" />
                {text.remove}
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-[#D4AF37]/25 bg-white/35 px-4 py-6 dark:bg-[#0B132B]/40">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => (recording ? stopRecording() : startRecording())}
              aria-pressed={recording}
              aria-label={recording ? text.stop : text.record}
              className="relative grid size-20 place-items-center"
            >
              <span
                className={cn(
                  "absolute inset-1 rounded-full bg-gradient-to-br from-rose-500 to-violet-500 blur-md",
                  recording ? "animate-ping opacity-80" : "opacity-50",
                )}
              />
              <span className="relative grid size-16 place-items-center rounded-full bg-[#0B132B] text-[#F6F1E4] ring-2 ring-rose-400/80">
                <Mic className="size-5" />
              </span>
            </button>
            <p className="font-mono text-3xl tracking-wider text-[#0B132B] dark:text-[#F3E5AB]" dir="ltr" aria-live="polite">
              {clock(recording ? elapsed : take?.seconds ?? elapsed)}
            </p>
            <button
              type="button"
              onClick={stopRecording}
              disabled={!recording}
              className="inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm ring-1 ring-rose-400/50 disabled:opacity-40"
            >
              <Square className="size-3.5 fill-current" />
              {text.stop}
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">{recording ? text.recording : text.record}</p>
          {take && !recording ? (
            <div className="mt-4 flex justify-center">
              <button type="button" onClick={clearTake} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <X className="size-3.5" />
                {text.remove}
              </button>
            </div>
          ) : null}
        </div>
      )}

      <button
        type="button"
        onClick={analyze}
        className="mt-5 h-11 rounded-2xl px-4 text-sm font-medium"
        style={{ backgroundColor: "#D4AF37", color: "#0B132B" }}
      >
        {text.analyze}
      </button>
    </>
  );
}
