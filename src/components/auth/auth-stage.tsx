"use client";

import { useThemeMode } from "@/lib/theme";

export function AuthStage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-1 items-center justify-center px-4 py-14"
      style={{
        backgroundColor: "#0B132B",
        backgroundImage:
          "radial-gradient(ellipse 58% 42% at 50% 12%, rgba(212,175,55,0.2), transparent 64%), radial-gradient(ellipse 36% 28% at 88% 100%, rgba(99,102,241,0.16), transparent 70%)",
      }}
    >
      {children}
    </div>
  );
}

export function FrostCard({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeMode();
  const light = theme === "light";
  return (
    <div
      className="auth-card w-full max-w-[420px] rounded-[28px] p-6 sm:p-8"
      style={{
        background: light ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.08)",
        color: light ? "#0B132B" : "#F6F1E4",
        backdropFilter: "blur(40px) saturate(1.8)",
        WebkitBackdropFilter: "blur(40px) saturate(1.8)",
        border: "1px solid rgba(212, 175, 55, 0.38)",
        boxShadow: "0 30px 80px -28px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.35)",
      }}
    >
      {children}
    </div>
  );
}

export const authFieldClass =
  "h-12 w-full rounded-2xl border border-[#D4AF37]/40 bg-white/85 px-3 text-base text-[#0B132B] outline-none placeholder:text-[#3E4D6B] focus:border-[#D4AF37] dark:bg-[#0B132B]/55 dark:text-[#F6F1E4] dark:placeholder:text-[#C8C0AA]";
