"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { planById, PLAN_RANK, supportSla, type PlanId } from "@/lib/plans";

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
};

export type UserState = {
  name: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  bio: string;
  goals: string[];
  plan: PlanId | null;
  wallet: number;
  transactions: Tx[];
  completed: string[];
  lastLessonId: string | null;
  tickets: Ticket[];
};

type DB = {
  session: string | null;
  users: Record<string, UserState>;
};

type StoreValue = {
  ready: boolean;
  user: UserState | null;
  login: (
    email: string,
    password: string,
    profile?: Partial<Pick<UserState, "name" | "role" | "city">>,
  ) => string | null;
  logout: () => void;
  updateProfile: (
    patch: Partial<
      Pick<UserState, "name" | "phone" | "city" | "role" | "bio" | "goals">
    >,
  ) => void;
  topUp: (amount: number) => void;
  purchase: (plan: PlanId) => { ok: boolean; message: string };
  setLessonDone: (id: string, done: boolean) => void;
  rememberLesson: (id: string) => void;
  addTicket: (subject: string, body: string) => string | null;
};

const StoreContext = createContext<StoreValue | null>(null);

const emptyDb: DB = { session: null, users: {} };

function freshUser(email: string, name: string): UserState {
  const now = new Date().toISOString();
  return {
    name,
    email,
    phone: "۰۹۱۲۰۰۰۰۰۰۰",
    city: "تهران",
    role: "کارشناس فروش",
    bio: "فروش را بیشتر تجربی یاد گرفته‌ام و می‌خواهم مکالمه، مذاکره و دایرکت را سناریومحور و قابل تمرین جلو ببرم.",
    goals: ["افزایش پورسانت", "تبدیل دایرکت به خرید"],
    plan: null,
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
    lastLessonId: null,
    tickets: [],
  };
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
            setDb({ session: parsed.session ?? null, users: parsed.users });
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
    const patchUser = (email: string, fn: (current: UserState) => UserState) => {
      setDb((prev) => {
        const current = prev.users[email];
        if (!current) return prev;
        return {
          ...prev,
          users: { ...prev.users, [email]: fn(current) },
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
          const created = freshUser(
            email,
            profile?.name?.trim() || "امیرحسین قاری",
          );
          created.role = profile?.role?.trim() || created.role;
          created.city = profile?.city?.trim() || created.city;
          return {
            session: email,
            users: { ...prev.users, [email]: created },
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
      rememberLesson: (id) => {
        if (!db.session) return;
        patchUser(db.session, (current) =>
          current.lastLessonId === id ? current : { ...current, lastLessonId: id },
        );
      },
      addTicket: (subject, body) => {
        if (!user || !db.session) return "برای ثبت درخواست اول وارد شوید.";
        const cleanSubject = subject.trim();
        const cleanBody = body.trim();
        if (cleanSubject.length < 3 || cleanBody.length < 8) {
          return "موضوع و شرح را کامل‌تر بنویسید.";
        }
        const reply = `درخواست شما ثبت شد. ${supportSla(user.plan)} در این پروتوتایپ یک پاسخ نمونه هم کنار درخواست می‌ماند: روی همان سناریو یک جملهٔ جایگزین آماده کنید و در پاسخ بعدی بفرستید.`;
        patchUser(db.session, (current) => ({
          ...current,
          tickets: [
            {
              id: crypto.randomUUID(),
              subject: cleanSubject,
              body: cleanBody,
              reply,
              at: new Date().toISOString(),
            },
            ...current.tickets,
          ],
        }));
        return null;
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
