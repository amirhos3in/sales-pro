"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { englishDigits, phoneKey, validPhone } from "@/lib/store";
import { inactiveSubscription, normalizeSubscription, type SubscriptionStatus } from "@/lib/subscription";

const KEY = "academy_user_session";

export type AcademyPlan = "free" | "vip";

export type WalletTxKind = "plan" | "cashback" | "topup";

export type WalletTx = {
  id: string;
  kind: WalletTxKind;
  amount: number;
  at: string;
  title?: string;
  status?: "success";
};

export type AcademyUser = {
  name: string;
  phone: string;
  email?: string;
  jobTitle: string;
  bio: string;
  plan: AcademyPlan;
  subscription: SubscriptionStatus;
  walletBalance: number;
  cashbackEarned: number;
  avatarId?: string;
  transactions?: WalletTx[];
};

export type AcademySession = {
  isAuthenticated: boolean;
  currentUser: AcademyUser | null;
};

type AuthError = "name" | "phone" | "otp" | null;

type AuthValue = AcademySession & {
  ready: boolean;
  login: (phone: string, otp: string) => AuthError;
  register: (name: string, phone: string, jobTitle: string, otp: string) => AuthError;
  logout: () => void;
  updateProfile: (data: Partial<AcademyUser>) => void;
};

const emptySession: AcademySession = { isAuthenticated: false, currentUser: null };

const seedProfile = {
  name: "امیرحسین قاری",
  email: "demo@nexsell.ir",
  jobTitle: "استراتژیست فروش",
  bio: "فروش آنلاین، حضوری و تلفنی را با مذاکرهٔ دقیق تمرین می‌کنم.",
  plan: "vip" as const,
  subscription: {
    isActive: true,
    planType: "quarterly" as const,
    expiresAt: "2026-12-31T23:59:59.000Z",
  },
  walletBalance: 2_450_000,
  cashbackEarned: 297_100,
  transactions: [
    { id: "tx-topup", kind: "topup" as const, amount: 1_000_000, at: "2026-09-28T09:00:00", title: "شارژ کیف پول", status: "success" as const },
    { id: "tx-cash", kind: "cashback" as const, amount: 297_100, at: "2026-09-12T11:30:00", title: "هدیه ۵٪ کش‌بک خرید اشتراک سالانه", status: "success" as const },
    { id: "tx-plan", kind: "plan" as const, amount: -4_728_000, at: "2026-09-12T11:20:00", title: "خرید اشتراک ۳ ماهه", status: "success" as const },
  ],
};

const AuthContext = createContext<AuthValue | null>(null);

function readSession(): AcademySession {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptySession;
    const parsed = JSON.parse(raw) as Partial<AcademySession>;
    const user = parsed.currentUser;
    if (!parsed.isAuthenticated || !user || typeof user.phone !== "string" || typeof user.name !== "string") {
      return emptySession;
    }
    return { isAuthenticated: true, currentUser: withSubscription(user) };
  } catch {
    return emptySession;
  }
}

function otpCode(value: string) {
  return englishDigits(value).replace(/\D/g, "");
}

function withSubscription(user: AcademyUser): AcademyUser {
  if (user.subscription) return { ...user, subscription: normalizeSubscription(user.subscription) };
  if (user.plan === "vip") {
    return {
      ...user,
      subscription: { isActive: true, planType: "quarterly", expiresAt: "2026-12-31T23:59:59.000Z" },
    };
  }
  return { ...user, subscription: inactiveSubscription };
}

function seededUser(patch: Partial<AcademyUser> & { phone: string }): AcademyUser {
  return withSubscription({
    ...seedProfile,
    ...patch,
    phone: patch.phone,
    name: patch.name?.trim() || seedProfile.name,
    jobTitle: patch.jobTitle?.trim() || seedProfile.jobTitle,
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AcademySession>(emptySession);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (hydrated.current) return;
      hydrated.current = true;
      setSession(readSession());
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(KEY, JSON.stringify(session));
  }, [session]);

  const value = useMemo<AuthValue>(() => {
    function checkOtp(phone: string, otp: string): AuthError {
      if (!validPhone(phoneKey(phone))) return "phone";
      if (!/^\d{5}$/.test(otpCode(otp))) return "otp";
      return null;
    }

    return {
      ...session,
      ready,
      login: (phone, otp) => {
        const error = checkOtp(phone, otp);
        if (error) return error;
        hydrated.current = true;
        setReady(true);
        setSession({
          isAuthenticated: true,
          currentUser: seededUser({ phone: phoneKey(phone) }),
        });
        return null;
      },
      register: (name, phone, jobTitle, otp) => {
        if (name.trim().length < 2 || jobTitle.trim().length < 2) return "name";
        const error = checkOtp(phone, otp);
        if (error) return error;
        hydrated.current = true;
        setReady(true);
        setSession({
          isAuthenticated: true,
          currentUser: seededUser({
            name: name.trim(),
            phone: phoneKey(phone),
            jobTitle: jobTitle.trim(),
          }),
        });
        return null;
      },
      logout: () => {
        hydrated.current = true;
        setReady(true);
        setSession(emptySession);
      },
      updateProfile: (data) => {
        hydrated.current = true;
        setSession((current) => {
          if (!current.currentUser) return current;
          return {
            isAuthenticated: true,
            currentUser: { ...current.currentUser, ...data },
          };
        });
      },
    };
  }, [ready, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
