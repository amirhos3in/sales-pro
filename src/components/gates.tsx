"use client";

import { createContext, useContext, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

type GateValue = {
  openAuth: () => void;
  openPaywall: (notice?: string) => void;
};

const GateContext = createContext<GateValue | null>(null);

export function useGate() {
  const value = useContext(GateContext);
  if (!value) throw new Error("useGate must be used inside GateProvider");
  return value;
}

export function GateProvider({ children }: { children: React.ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [payNotice, setPayNotice] = useState<string | null>(null);

  return (
    <GateContext.Provider
      value={{
        openAuth: () => setAuthOpen(true),
        openPaywall: (notice) => {
          setPayNotice(typeof notice === "string" ? notice : null);
          setPayOpen(true);
        },
      }}
    >
      {children}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <PaywallModal
        key={payOpen ? "pay-open" : "pay-closed"}
        open={payOpen}
        notice={payNotice}
        onClose={() => {
          setPayOpen(false);
          setPayNotice(null);
        }}
      />
    </GateContext.Provider>
  );
}

function Overlay({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-[#0B132B]/60 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            className="glass max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 shadow-2xl"
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28 }}
            onClick={(event) => event.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function AuthPanel({ onDone }: { onDone?: () => void }) {
  const { copy } = useI18n();
  const { verifyOtp } = useStore();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  function send(event: React.FormEvent) {
    event.preventDefault();
    const probe = verifyOtp({ firstName, lastName, phone, email, code: "000" });
    if (probe === "name") {
      toast.error(copy.auth.invalidName);
      return;
    }
    if (probe === "phone") {
      toast.error(copy.auth.invalidPhone);
      return;
    }
    setStep("otp");
    toast.success(copy.auth.sent);
  }

  function confirm(event: React.FormEvent) {
    event.preventDefault();
    const error = verifyOtp({ firstName, lastName, phone, email, code });
    if (error === "name") {
      toast.error(copy.auth.invalidName);
      return;
    }
    if (error === "phone") {
      toast.error(copy.auth.invalidPhone);
      return;
    }
    if (error === "otp") {
      toast.error(copy.auth.invalidOtp);
      return;
    }
    toast.success(copy.auth.verify);
    onDone?.();
  }

  if (step === "otp") {
    return (
      <form onSubmit={confirm} className="space-y-3">
        <h2 className="text-xl font-semibold">{copy.auth.title}</h2>
        <p className="text-sm leading-7 text-muted-foreground">{copy.auth.sent}</p>
        <label className="block space-y-1.5 text-sm">
          <span>{copy.auth.otp}</span>
          <Input
            inputMode="numeric"
            dir="ltr"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="h-11 text-left tracking-[0.3em]"
          />
        </label>
        <Button type="submit" className="h-11 w-full bg-[#D4AF37] text-[#0B132B] hover:bg-[#E5C07B]">
          {copy.auth.verify}
        </Button>
        <button type="button" className="text-sm text-muted-foreground" onClick={() => setStep("form")}>
          {copy.auth.back}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={send} className="space-y-3">
      <h2 className="text-xl font-semibold">{copy.auth.title}</h2>
      <p className="text-sm leading-7 text-muted-foreground">{copy.auth.body}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span>{copy.auth.first}</span>
          <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="h-11" />
        </label>
        <label className="space-y-1.5 text-sm">
          <span>{copy.auth.last}</span>
          <Input value={lastName} onChange={(event) => setLastName(event.target.value)} className="h-11" />
        </label>
      </div>
      <label className="block space-y-1.5 text-sm">
        <span>{copy.auth.phone}</span>
        <Input
          dir="ltr"
          inputMode="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="h-11 text-left"
          placeholder="09120000000"
        />
      </label>
      <label className="block space-y-1.5 text-sm">
        <span>{copy.auth.email}</span>
        <Input
          dir="ltr"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 text-left"
        />
      </label>
      <Button type="submit" className="h-11 w-full bg-[#D4AF37] text-[#0B132B] hover:bg-[#E5C07B]">
        {copy.auth.send}
      </Button>
    </form>
  );
}

function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { copy } = useI18n();
  return (
    <Overlay open={open} onClose={onClose}>
      <div className="mb-3 flex justify-end">
        <button type="button" onClick={onClose} aria-label={copy.pay.close} className="rounded-full p-1 text-muted-foreground">
          <X className="size-4" />
        </button>
      </div>
      <AuthPanel onDone={onClose} />
    </Overlay>
  );
}

function PaywallModal({
  open,
  notice,
  onClose,
}: {
  open: boolean;
  notice?: string | null;
  onClose: () => void;
}) {
  const { copy, lang } = useI18n();
  const fa = lang === "fa";
  const tracks = [
    {
      href: "/#courses",
      title: fa ? "دوره‌ها و باندل کامل" : "Courses and the full bundle",
      body: fa
        ? "هر دوره ۵ میلیون تومان. باندل چهار دوره ۱۶ میلیون تومان، با هدیهٔ ۵۰۰ دقیقه کوپایلوت."
        : "Each course is 5,000,000 Tomans. The four-course bundle is 16,000,000, with 500 gifted copilot minutes.",
    },
    {
      href: "/#copilot-minutes",
      title: fa ? "دقیقهٔ کوپایلوت" : "Copilot minutes",
      body: fa
        ? "جدا از قیمت دوره. با اسلایدر، از ۱٬۰۰۰ تا ۲۰٬۰۰۰ دقیقه، هر هزار دقیقه ۳ میلیون تومان."
        : "Separate from course prices. The slider runs from 1,000 to 20,000 minutes at 3,000,000 Tomans per thousand.",
    },
  ];

  return (
    <Overlay open={open} onClose={onClose}>
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{fa ? "خرید را از کدام مسیر شروع کنیم؟" : "Which purchase track?"}</h2>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            {notice ||
              (fa
                ? "دوره و دقیقهٔ هوش مصنوعی دو خرید جدا هستند. یکی را انتخاب کنید."
                : "Courses and AI minutes are two separate purchases. Pick one.")}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label={copy.pay.close}>
          <X className="size-4 text-muted-foreground" />
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {tracks.map((track) => (
          <Link
            key={track.href}
            href={track.href}
            onClick={onClose}
            className="block rounded-2xl border border-[#D4AF37]/50 bg-[#0B132B] p-4 text-[#F8F1DE]"
          >
            <span className="block font-semibold">{track.title}</span>
            <span className="mt-1 block text-sm leading-6 text-white/70">{track.body}</span>
          </Link>
        ))}
      </div>
    </Overlay>
  );
}
