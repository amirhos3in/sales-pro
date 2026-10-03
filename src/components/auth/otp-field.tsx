"use client";

import { ClipboardEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { englishDigits } from "@/lib/store";

export function formatClock(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function useOtpTimer(running: boolean) {
  const [left, setLeft] = useState(119);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return {
    left,
    label: formatClock(left),
    restart() {
      setLeft(119);
    },
  };
}

export function OtpBoxes({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (next: string) => void;
  label: string;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const chars = Array.from({ length: 5 }, (_, index) => value[index] ?? "");

  function write(next: string) {
    onChange(englishDigits(next).replace(/\D/g, "").slice(0, 5));
  }

  function onInput(index: number, raw: string) {
    const digits = englishDigits(raw).replace(/\D/g, "");
    if (digits.length > 1) {
      const merged = (value.slice(0, index) + digits).replace(/\D/g, "").slice(0, 5);
      write(merged);
      refs.current[Math.min(merged.length, 4)]?.focus();
      return;
    }
    const next = chars.map((char, charIndex) => (charIndex === index ? digits : char)).join("");
    write(next);
    if (digits && index < 4) refs.current[index + 1]?.focus();
  }

  function onKey(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !chars[index] && index > 0) {
      const next = chars.map((char, charIndex) => (charIndex === index - 1 ? "" : char)).join("");
      write(next);
      refs.current[index - 1]?.focus();
    }
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>) {
    const digits = englishDigits(event.clipboardData.getData("text")).replace(/\D/g, "");
    if (digits.length < 2) return;
    event.preventDefault();
    write(digits);
    refs.current[Math.min(digits.length, 4)]?.focus();
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium">{label}</p>
      <div dir="ltr" className="flex justify-between gap-2">
        {chars.map((char, index) => (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`${label} ${index + 1}`}
            maxLength={index === 0 ? 5 : 1}
            value={char}
            onChange={(event) => onInput(index, event.target.value)}
            onKeyDown={(event) => onKey(index, event)}
            onPaste={onPaste}
            className="h-14 min-w-0 flex-1 rounded-2xl border border-[#D4AF37]/45 bg-white/85 text-center text-xl text-[#0B132B] outline-none focus:border-[#D4AF37] dark:bg-[#0B132B]/60 dark:text-[#F6F1E4]"
          />
        ))}
      </div>
    </div>
  );
}
