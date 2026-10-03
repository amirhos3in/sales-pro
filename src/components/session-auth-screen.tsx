"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/lib/i18n";

export function SessionAuthScreen() {
  const { copy } = useI18n();
  const text = copy.session;
  const { ready, isAuthenticated, login, register } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (ready && isAuthenticated) router.replace("/dashboard");
  }, [ready, isAuthenticated, router]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const error = mode === "login" ? login(phone, otp) : register(name, phone, jobTitle, otp);
    if (error === "name") {
      toast.error(text.invalidName);
      return;
    }
    if (error === "phone") {
      toast.error(text.invalidPhone);
      return;
    }
    if (error === "otp") {
      toast.error(text.invalidOtp);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-lg">
      <form onSubmit={submit} className="glass space-y-4 rounded-[2rem] p-6 shadow-2xl">
        <h1 className="text-2xl font-semibold">{mode === "login" ? text.loginTitle : text.registerTitle}</h1>
        <p className="text-sm leading-7 text-muted-foreground">{text.otpHint}</p>
        {mode === "register" ? (
          <>
            <label className="block space-y-1.5 text-sm">
              <span>{text.name}</span>
              <input value={name} onChange={(event) => setName(event.target.value)} className="h-11 w-full rounded-xl border border-[#D4AF37]/30 bg-white/70 px-3 dark:bg-[#0B132B]/60" />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>{text.job}</span>
              <input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} className="h-11 w-full rounded-xl border border-[#D4AF37]/30 bg-white/70 px-3 dark:bg-[#0B132B]/60" />
            </label>
          </>
        ) : null}
        <label className="block space-y-1.5 text-sm">
          <span>{text.phone}</span>
          <input dir="ltr" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="09120000000" className="h-11 w-full rounded-xl border border-[#D4AF37]/30 bg-white/70 px-3 text-left dark:bg-[#0B132B]/60" />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span>{text.otp}</span>
          <input dir="ltr" inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value)} className="h-11 w-full rounded-xl border border-[#D4AF37]/30 bg-white/70 px-3 text-left tracking-[0.3em] dark:bg-[#0B132B]/60" />
        </label>
        <button type="submit" className="h-11 w-full rounded-2xl text-sm font-medium" style={{ backgroundColor: "#D4AF37", color: "#0B132B" }}>
          {mode === "login" ? text.submitLogin : text.submitRegister}
        </button>
        <button
          type="button"
          className="text-sm text-[#8C7016] dark:text-[#D4AF37]"
          onClick={() => setMode((current) => (current === "login" ? "register" : "login"))}
        >
          {mode === "login" ? text.switchRegister : text.switchLogin}
        </button>
      </form>
    </div>
  );
}
