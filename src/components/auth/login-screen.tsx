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

export function LoginScreen() {
  const { copy } = useI18n();
  const text = copy.session;
  const { ready, isAuthenticated, login } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const timer = useOtpTimer(step === "otp");

  useEffect(() => {
    if (ready && isAuthenticated) router.replace("/dashboard");
  }, [ready, isAuthenticated, router]);

  function requestCode(event?: FormEvent) {
    event?.preventDefault();
    if (!validPhone(phone)) {
      toast.error(text.invalidPhone);
      return;
    }
    setStep("otp");
    timer.restart();
    toast.success(text.codeSent);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const error = login(phone, otp);
    if (error === "phone") {
      toast.error(text.invalidPhone);
      return;
    }
    if (error === "otp") {
      toast.error(text.invalidOtp);
      return;
    }
    toast.success(text.loginSuccess);
    router.push("/dashboard");
  }

  return (
    <AuthStage>
      <FrostCard>
        <p className="text-xs tracking-[0.18em] text-[#D4AF37]">{text.join}</p>
        <h1 className="mt-2 text-2xl font-semibold">{text.loginTitle}</h1>
        <p className="mt-2 text-sm leading-7 opacity-80">{step === "phone" ? text.loginLead : text.otpHint}</p>
        {step === "phone" ? (
          <form onSubmit={requestCode} className="mt-6 space-y-4">
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
            <button type="submit" className="h-12 w-full rounded-2xl text-sm font-medium" style={{ backgroundColor: "#D4AF37", color: "#0B132B" }}>
              {text.requestCode}
            </button>
          </form>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <p dir="ltr" className="text-center text-sm tracking-wide opacity-80">{phone}</p>
            <OtpBoxes value={otp} onChange={setOtp} label={text.otp} />
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
            <button type="submit" className="h-12 w-full rounded-2xl text-sm font-medium" style={{ backgroundColor: "#D4AF37", color: "#0B132B" }}>
              {text.submitLogin}
            </button>
            <button type="button" className="text-sm opacity-80" onClick={() => setStep("phone")}>
              {text.changePhone}
            </button>
          </form>
        )}
        <Link href="/register" className="mt-6 block text-sm text-[#8C7016] dark:text-[#D4AF37]">
          {text.noAccount}
        </Link>
      </FrostCard>
    </AuthStage>
  );
}
