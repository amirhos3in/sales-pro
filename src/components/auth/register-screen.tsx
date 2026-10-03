"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthStage, FrostCard, authFieldClass } from "@/components/auth/auth-stage";
import { OtpBoxes, useOtpTimer } from "@/components/auth/otp-field";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/lib/i18n";
import { validPhone } from "@/lib/store";

export function RegisterScreen() {
  const { copy } = useI18n();
  const text = copy.session;
  const { ready, isAuthenticated, register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [otp, setOtp] = useState("");
  const [terms, setTerms] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const timer = useOtpTimer(codeSent);

  useEffect(() => {
    if (ready && isAuthenticated) router.replace("/dashboard");
  }, [ready, isAuthenticated, router]);

  function requestCode() {
    if (!validPhone(phone)) {
      toast.error(text.invalidPhone);
      return;
    }
    setCodeSent(true);
    timer.restart();
    toast.success(text.codeSent);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!terms) {
      toast.error(text.termsRequired);
      return;
    }
    const error = register(name, phone, jobTitle, otp);
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
    toast.success(text.welcome);
    router.push("/dashboard");
  }

  return (
    <AuthStage>
      <FrostCard>
        <p className="text-xs tracking-[0.18em] text-[#D4AF37]">{copy.brand}</p>
        <h1 className="mt-2 text-2xl font-semibold">{text.registerTitle}</h1>
        <p className="mt-2 text-sm leading-7 opacity-80">{text.registerLead}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block space-y-2 text-sm">
            <span className="font-medium">{text.name}</span>
            <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className={authFieldClass} />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-medium">{text.phone}</span>
            <input
              dir="ltr"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={text.phonePlaceholder}
              className={`${authFieldClass} text-left`}
            />
          </label>
          <button type="button" className="text-sm text-[#8C7016] dark:text-[#D4AF37]" onClick={requestCode}>
            {text.requestCode}
          </button>
          {codeSent ? (
            <div className="flex items-center justify-between gap-3 text-sm">
              <span dir="ltr" className="font-mono text-base tabular-nums text-[#D4AF37]">{timer.label}</span>
              <button
                type="button"
                disabled={timer.left > 0}
                className="text-[#8C7016] disabled:opacity-40 dark:text-[#D4AF37]"
                onClick={() => {
                  timer.restart();
                  toast.success(text.codeSent);
                }}
              >
                {text.resend}
              </button>
            </div>
          ) : null}
          <label className="block space-y-2 text-sm">
            <span className="font-medium">{text.job}</span>
            <input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} className={authFieldClass} />
          </label>
          <OtpBoxes value={otp} onChange={setOtp} label={text.otp} />
          <p className="text-xs leading-6 opacity-70">{text.otpHint}</p>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={terms}
              onChange={(event) => setTerms(event.target.checked)}
              className="mt-1 size-4 accent-[#D4AF37]"
            />
            <span>{text.terms}</span>
          </label>
          <button type="submit" className="h-12 w-full rounded-2xl text-sm font-medium" style={{ backgroundColor: "#D4AF37", color: "#0B132B" }}>
            {text.submitRegister}
          </button>
        </form>
        <Link href="/login" className="mt-6 block text-sm text-[#8C7016] dark:text-[#D4AF37]">
          {text.hasAccount}
        </Link>
      </FrostCard>
    </AuthStage>
  );
}
