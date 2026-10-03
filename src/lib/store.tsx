"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { planById, PLAN_RANK, supportSla, type PlanId } from "@/lib/plans";
import {
  inactiveSubscription,
  normalizeSubscription,
  planTypeFromId,
  subscriptionForPlan,
  type SubscriptionStatus,
} from "@/lib/subscription";

const KEY = "nexsell-db-v1";

export type Tx = {
  id: string;
  title: string;
  amount: number;
  at: string;
};

export type Ticket = {
  id: string;
  subject: string;
  body: string;
  reply: string;
  at: string;
  status: "review";
};

export type PremiumTier = "gold" | "vip";

export type UserState = {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  bio: string;
  goals: string[];
  plan: PlanId | null;
  subscription: SubscriptionStatus;
  isPremium: boolean;
  premiumTier: PremiumTier | null;
  wallet: number;
  transactions: Tx[];
  completed: string[];
  watched: string[];
  passed: string[];
  lastLessonId: string | null;
  tickets: Ticket[];
};

type DB = {
  session: string | null;
  users: Record<string, UserState>;
};

export type OtpInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  code: string;
};

type StoreValue = {
  ready: boolean;
  user: UserState | null;
  login: (
    email: string,
    password: string,
    profile?: Partial<Pick<UserState, "name" | "role" | "city">>,
  ) => string | null;
  verifyOtp: (input: OtpInput) => string | null;
  logout: () => void;
  updateProfile: (
    patch: Partial<
      Pick<UserState, "name" | "phone" | "city" | "role" | "bio" | "goals">
    >,
  ) => void;
  topUp: (amount: number) => void;
  purchase: (plan: PlanId) => { ok: boolean; message: string };
  grantPlan: (plan: PlanId) => void;
  activatePremium: (tier: PremiumTier) => string | null;
  setLessonDone: (id: string, done: boolean) => void;
  markWatched: (id: string) => void;
  passQuiz: (id: string) => void;
  rememberLesson: (id: string) => void;
  addTicket: (subject: string, body: string) => { error: string | null; id: string | null };
};

const StoreContext = createContext<StoreValue | null>(null);

const emptyDb: DB = { session: null, users: {} };

export function englishDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export function phoneKey(value: string) {
  const digits = englishDigits(value).replace(/\D/g, "");
  if (digits.startsWith("98") && digits.length >= 12) return `0${digits.slice(2)}`;
  if (digits.length === 10 && digits.startsWith("9")) return `0${digits}`;
  return digits;
}

export function validPhone(value: string) {
  return /^09\d{9}$/.test(phoneKey(value));
}

function fullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim();
}

function normalizeUser(raw: Partial<UserState>): UserState {
  const firstName = raw.firstName?.trim() || raw.name?.trim().split(/\s+/)[0] || "کاربر";
  const lastName =
    raw.lastName?.trim() ||
    raw.name?.trim().split(/\s+/).slice(1).join(" ") ||
    "";
  const plan = raw.plan ?? null;
  const subscription = raw.subscription
    ? normalizeSubscription(raw.subscription)
    : plan
      ? { isActive: true, planType: planTypeFromId(plan), expiresAt: "2026-12-31T23:59:59.000Z" }
      : raw.isPremium
        ? {
            isActive: true,
            planType: raw.premiumTier === "vip" ? "yearly" as const : "quarterly" as const,
            expiresAt: "2026-12-31T23:59:59.000Z",
          }
        : inactiveSubscription;
  return {
    name: fullName(firstName, lastName) || raw.name || "کاربر",
    firstName,
    lastName,
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    city: raw.city ?? "تهران",
    role: raw.role ?? "کارشناس فروش",
    bio: raw.bio ?? "",
    goals: raw.goals ?? [],
    plan,
    subscription,
    isPremium: subscription.isActive,
    premiumTier: raw.premiumTier ?? (plan === "pro" ? "vip" : plan ? "gold" : null),
    wallet: raw.wallet ?? 10_000_000,
    transactions: raw.transactions ?? [],
    completed: raw.completed ?? [],
    watched: raw.watched ?? [],
    passed: raw.passed ?? [],
    lastLessonId: raw.lastLessonId ?? null,
    tickets: (raw.tickets ?? []).map((ticket) => ({
      ...ticket,
      status: "review" as const,
    })),
  };
}

function freshUser(phone: string, firstName: string, lastName: string, email: string): UserState {
  const now = new Date().toISOString();
  return normalizeUser({
    firstName,
    lastName,
    email,
    phone,
    city: "تهران",
    role: "کارشناس فروش",
    bio: "",
    goals: [],
    plan: null,
    isPremium: false,
    premiumTier: null,
    wallet: 10_000_000,
    transactions: [
      {
        id: crypto.randomUUID(),
        title: "اعتبار آزمایشی پروتوتایپ",
        amount: 10_000_000,
        at: now,
      },
    ],
    completed: [],
    watched: [],
    passed: [],
    lastLessonId: null,
    tickets: [],
  });
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(emptyDb);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as DB;
          if (parsed && typeof parsed === "object" && parsed.users) {
            const users = Object.fromEntries(
              Object.entries(parsed.users).map(([key, user]) => [key, normalizeUser(user)]),
            );
            setDb({ session: parsed.session ?? null, users });
          }
        }
      } catch {
        localStorage.removeItem(KEY);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(db));
  }, [db, ready]);

  const user = db.session ? (db.users[db.session] ?? null) : null;

  const value = useMemo<StoreValue>(() => {
    const patchUser = (key: string, fn: (current: UserState) => UserState) => {
      setDb((prev) => {
        const current = prev.users[key];
        if (!current) return prev;
        return {
          ...prev,
          users: { ...prev.users, [key]: fn(current) },
        };
      });
    };

    return {
      ready,
      user,
      login: (emailRaw, password, profile) => {
        const email = emailRaw.trim().toLowerCase();
        if (!email.includes("@") || password.trim().length < 4) {
          return "ایمیل معتبر و رمز حداقل ۴ نویسه لازم است.";
        }
        setDb((prev) => {
          if (prev.users[email]) return { ...prev, session: email };
          const created = freshUser("", profile?.name?.trim() || "امیرحسین", "قاری", email);
          created.role = profile?.role?.trim() || created.role;
          created.city = profile?.city?.trim() || created.city;
          created.name = profile?.name?.trim() || created.name;
          return {
            session: email,
            users: { ...prev.users, [email]: created },
          };
        });
        return null;
      },
      verifyOtp: (input) => {
        const firstName = input.firstName.trim();
        const lastName = input.lastName.trim();
        const phone = phoneKey(input.phone);
        const email = input.email.trim().toLowerCase();
        const code = englishDigits(input.code).replace(/\D/g, "");
        if (firstName.length < 2 || lastName.length < 2) return "name";
        if (!validPhone(phone)) return "phone";
        if (!/^\d{4,6}$/.test(code)) return "otp";
        setDb((prev) => {
          const existing = prev.users[phone];
          if (existing) {
            const next = normalizeUser({
              ...existing,
              firstName,
              lastName,
              name: fullName(firstName, lastName),
              email: email || existing.email,
              phone,
            });
            return { session: phone, users: { ...prev.users, [phone]: next } };
          }
          return {
            session: phone,
            users: {
              ...prev.users,
              [phone]: freshUser(phone, firstName, lastName, email),
            },
          };
        });
        return null;
      },
      logout: () => setDb((prev) => ({ ...prev, session: null })),
      updateProfile: (patch) => {
        if (!db.session) return;
        patchUser(db.session, (current) => ({ ...current, ...patch }));
      },
      topUp: (amount) => {
        if (!db.session || amount <= 0) return;
        patchUser(db.session, (current) => ({
          ...current,
          wallet: current.wallet + amount,
          transactions: [
            {
              id: crypto.randomUUID(),
              title: "افزایش موجودی آزمایشی",
              amount,
              at: new Date().toISOString(),
            },
            ...current.transactions,
          ],
        }));
      },
      purchase: (plan) => {
        if (!user || !db.session) {
          return { ok: false, message: "برای خرید اشتراک اول وارد شوید." };
        }
        if (user.plan && PLAN_RANK[user.plan] >= PLAN_RANK[plan]) {
          return {
            ok: false,
            message: "این پلن یا پلن بالاتر همین حالا برای شما فعال است.",
          };
        }
        const selected = planById(plan);
        if (user.wallet < selected.price) {
          return { ok: false, message: "موجودی کیف پول برای این پلن کافی نیست." };
        }
        patchUser(db.session, (current) => ({
          ...current,
          plan,
          subscription: subscriptionForPlan(plan),
          isPremium: true,
          premiumTier: plan === "pro" ? "vip" : "gold",
          wallet: current.wallet - selected.price,
          transactions: [
            {
              id: crypto.randomUUID(),
              title: `خرید اشتراک ${selected.name}`,
              amount: -selected.price,
              at: new Date().toISOString(),
            },
            ...current.transactions,
          ],
        }));
        return { ok: true, message: `پلن ${selected.name} فعال شد.` };
      },
      grantPlan: (plan) => {
        if (!db.session) return;
        patchUser(db.session, (current) => ({
          ...current,
          plan,
          subscription: subscriptionForPlan(plan),
          isPremium: true,
          premiumTier: plan === "pro" ? "vip" : "gold",
        }));
      },
      activatePremium: (tier) => {
        if (!db.session || !user) return "auth";
        const plan: PlanId = tier === "vip" ? "pro" : user.plan === "pro" ? "pro" : "plus";
        patchUser(db.session, (current) => ({
          ...current,
          isPremium: true,
          premiumTier: tier,
          plan,
          subscription: subscriptionForPlan(plan),
          transactions: [
            {
              id: crypto.randomUUID(),
              title: tier === "vip" ? "فعال‌سازی آزمایشی VIP" : "فعال‌سازی آزمایشی پلن طلایی",
              amount: 0,
              at: new Date().toISOString(),
            },
            ...current.transactions,
          ],
        }));
        return null;
      },
      setLessonDone: (id, done) => {
        if (!db.session) return;
        patchUser(db.session, (current) => ({
          ...current,
          lastLessonId: id,
          completed: done
            ? Array.from(new Set([...current.completed, id]))
            : current.completed.filter((item) => item !== id),
        }));
      },
      markWatched: (id) => {
        if (!db.session) return;
        patchUser(db.session, (current) => ({
          ...current,
          lastLessonId: id,
          watched: Array.from(new Set([...current.watched, id])),
        }));
      },
      passQuiz: (id) => {
        if (!db.session) return;
        patchUser(db.session, (current) => ({
          ...current,
          lastLessonId: id,
          watched: Array.from(new Set([...current.watched, id])),
          passed: Array.from(new Set([...current.passed, id])),
          completed: Array.from(new Set([...current.completed, id])),
        }));
      },
      rememberLesson: (id) => {
        if (!db.session) return;
        patchUser(db.session, (current) =>
          current.lastLessonId === id ? current : { ...current, lastLessonId: id },
        );
      },
      addTicket: (subject, body) => {
        if (!user || !db.session) {
          return { error: "برای ثبت درخواست اول وارد شوید.", id: null };
        }
        const cleanSubject = subject.trim();
        const cleanBody = body.trim();
        if (cleanSubject.length < 3 || cleanBody.length < 8) {
          return { error: "موضوع و شرح را کامل‌تر بنویسید.", id: null };
        }
        const id = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
        const reply = `درخواست شما ثبت شد. ${supportSla(user.plan)} شناسه: #${id}`;
        patchUser(db.session, (current) => ({
          ...current,
          tickets: [
            {
              id,
              subject: cleanSubject,
              body: cleanBody,
              reply,
              at: new Date().toISOString(),
              status: "review",
            },
            ...current.tickets,
          ],
        }));
        return { error: null, id };
      },
    };
  }, [db.session, ready, user]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore باید داخل StoreProvider باشد.");
  return value;
}
