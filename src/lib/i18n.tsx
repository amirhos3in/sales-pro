"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "fa" | "en";

const copy = {
  fa: {
    brand: "نکس‌سل",
    brandLine: "آکادمی مهارت‌های فروش",
    nav: {
      home: "خانه",
      articles: "مقالات",
      services: "خدمات",
      support: "پشتیبانی",
      plans: "اشتراک",
    },
    menu: {
      account: "حساب",
      profile: "اطلاعات من",
      about: "درباره من",
      articles: "مقالات",
      buy: "خرید اشتراک",
      wallet: "کیف پول",
      progress: "درصد پیشرفت",
      logout: "خروج",
      login: "ورود",
      menu: "منو",
    },
    footer: {
      left: "نکس‌سل، آموزش ویدیویی فروش با چالش پایان هر درس.",
      right: "پشتیبانی هوشمند و اپراتور، پایین سمت چپ.",
    },
    home: {
      kicker: "سامانه آموزش ویدیویی",
      title: "هر درس یک فیلم آپارات است و با چالش سه‌سؤالی باز می‌شود.",
      body: "چهار مسیر تخصصی پولی است. آموزش رایگان برای هر کسی که وارد شود باز است و فقط بعد از قبولی چالش قبلی جلو می‌رود.",
      start: "ورود و شروع",
      upgrade: "ارتقای پلن",
      continue: "ادامه یادگیری",
      passed: "چالش‌های قبول‌شده",
      premiumOn: "پلن طلایی یا VIP فعال است",
      premiumOff: "هنوز پلن پولی فعال نیست",
      freeBadge: "رایگان",
      premiumBadge: "ویژه",
      lessons: "درس",
      rulesTitle: "قفل ویدیو چطور باز می‌شود",
      rules: [
        "بدون ورود، پخش دوره قفل است.",
        "مسیرهای اصلی بدون پلن فعال، دکمه ارتقای پلن را نشان می‌دهند.",
        "با پلن فعال، ویدیوی بعدی فقط بعد از قبولی چالش قبلی باز می‌شود.",
      ],
    },
    learn: {
      back: "بازگشت به مسیرها",
      backCategory: "بازگشت به همین مسیر",
      lockedPlan: "این ویدیو داخل پلن طلایی و VIP است.",
      upgrade: "ارتقای پلن",
      lockedSeq: "برای باز شدن این ویدیو، ابتدا باید چالش ویدیوی قبلی را با موفقیت پشت سر بگذارید.",
      previous: "درس قبلی",
      loginNeed: "برای دیدن فیلم و ثبت پیشرفت وارد شوید.",
      login: "ورود با موبایل",
      watched: "تماشای این درس ثبت شد",
      confirm: "تایید مشاهده کامل ویدیو",
      challenge: "ورود به چالش این درس",
      passed: "چالش این درس قبول شد",
      next: "ویدیوی بعدی",
      minutes: "دقیقه",
    },
    quiz: {
      title: "چالش این درس",
      hint: "هر سه سوال باید درست باشد.",
      submit: "ثبت پاسخ‌ها",
      retry: "تلاش مجدد",
      pass: "قبول شدید. ویدیوی بعدی باز شد.",
      fail: "این بار کامل نشد. پاسخ‌ها را دوباره انتخاب کنید.",
      close: "بستن",
      need: "به هر سه سوال جواب بدهید.",
    },
    auth: {
      title: "ورود یا ثبت‌نام",
      body: "نام، موبایل و یک کد آزمایشی. هر کد ۴ تا ۶ رقمی قبول است، مثلاً ۱۲۳۴.",
      first: "نام",
      last: "نام خانوادگی",
      phone: "شماره موبایل",
      email: "ایمیل (اختیاری)",
      send: "دریافت کد",
      otp: "کد تایید",
      verify: "تایید و ورود",
      back: "ویرایش شماره",
      sent: "کد آزمایشی ساخته شد. همان عدد را وارد کنید.",
      invalidName: "نام و نام خانوادگی لازم است.",
      invalidPhone: "شماره موبایل را کامل وارد کنید.",
      invalidOtp: "کد باید ۴ تا ۶ رقم باشد.",
    },
    pay: {
      title: "ارتقای پلن",
      body: "پرداخت آزمایشی است و همان لحظه دسترسی ویدیوهای ویژه را باز می‌کند.",
      gold: "پلن طلایی",
      goldText: "هر چهار مسیر تخصصی، با قفل مرحله‌ای چالش‌ها.",
      vip: "پلن VIP",
      vipText: "همان دسترسی طلایی، با نشان VIP و اولویت پاسخ پشتیبانی.",
      buy: "خرید و ارتقای پلن",
      working: "در حال اتصال به درگاه آزمایشی…",
      done: "پرداخت آزمایشی ثبت شد. پلن شما فعال است.",
      close: "بستن",
      needAuth: "اول با موبایل وارد شوید.",
    },
    support: {
      button: "پشتیبانی",
      title: "پشتیبانی نکس‌سل",
      guest: "برای شروع گفتگو این چند مورد را بنویسید.",
      name: "نام و نام خانوادگی",
      phone: "شماره تماس",
      topic: "موضوع",
      description: "توضیحات",
      start: "ارسال و شروع گفتگو",
      ai: "پشتیبانی هوش مصنوعی",
      human: "پشتیبانی اپراتور",
      placeholder: "پیام شما",
      send: "ارسال",
      typing: "در حال نوشتن…",
      ticketOk:
        "تیکت شما با موفقیت ثبت شد. کارشناسان ما به زودی از طریق تماس یا پیامک پاسخگوی شما خواهند بود.",
      status: "در حال بررسی",
      eta: "زمان تقریبی پاسخ: تا یک روز کاری",
      etaVip: "زمان تقریبی پاسخ: تا دو ساعت کاری",
      empty: "نام، موبایل، موضوع و توضیح را کامل کنید.",
      hello: "سلام. درباره مسیر دوره، قفل ویدیو، پلن یا چالش بپرسید.",
    },
    sub: {
      luxury: "پرداخت آزمایشی طلایی و VIP",
      luxuryBody: "این مسیر درگاه را شبیه‌سازی می‌کند و دسترسی ویدیوهای ویژه را روشن می‌کند.",
      open: "خرید و ارتقای پلن",
    },
    articlesPage: {
      title: "مقالات",
      intro: "یادداشت‌های کوتاه فروش آنلاین، حضوری، تلفنی و مذاکره. هر کدام را تا آخر بخوانید.",
      more: "ادامه مطلب",
      back: "بازگشت به مقالات",
      missing: "مقاله پیدا نشد",
      by: "نویسنده",
    },
  },
  en: {
    brand: "NexSell",
    brandLine: "Sales skills academy",
    nav: {
      home: "Home",
      articles: "Articles",
      services: "Services",
      support: "Support",
      plans: "Plans",
    },
    menu: {
      account: "Account",
      profile: "My details",
      about: "About me",
      articles: "Articles",
      buy: "Buy a plan",
      wallet: "Wallet",
      progress: "Progress",
      logout: "Log out",
      login: "Log in",
      menu: "Menu",
    },
    footer: {
      left: "NexSell video lessons. Each film ends with a three-question challenge.",
      right: "AI and operator support sit at the bottom left.",
    },
    home: {
      kicker: "Video learning system",
      title: "Every lesson is an Aparat film and opens with a three-question challenge.",
      body: "The four specialist paths are paid. Free training is open to anyone signed in, and it moves only after the previous challenge.",
      start: "Sign in and start",
      upgrade: "Upgrade plan",
      continue: "Continue learning",
      passed: "Challenges passed",
      premiumOn: "Gold or VIP is active",
      premiumOff: "No paid plan yet",
      freeBadge: "Free",
      premiumBadge: "Premium",
      lessons: "lessons",
      rulesTitle: "How a video unlocks",
      rules: [
        "Playback stays closed until you sign in.",
        "Without an active plan, a specialist video shows Upgrade plan.",
        "With a plan, the next video opens only after the previous challenge is passed.",
      ],
    },
    learn: {
      back: "All paths",
      backCategory: "Back to this path",
      lockedPlan: "This film sits inside Gold and VIP.",
      upgrade: "Upgrade plan",
      lockedSeq: "Complete the quiz of the previous video to unlock.",
      previous: "Previous lesson",
      loginNeed: "Sign in to watch and save progress.",
      login: "Sign in with mobile",
      watched: "This viewing is saved",
      confirm: "Confirm I finished the video",
      challenge: "Start lesson challenge",
      passed: "This challenge is passed",
      next: "Next video",
      minutes: "min",
    },
    quiz: {
      title: "Lesson challenge",
      hint: "All three answers need to be right.",
      submit: "Submit answers",
      retry: "Retry quiz",
      pass: "Passed. The next video is unlocked.",
      fail: "Not quite. Choose the answers again.",
      close: "Close",
      need: "Answer all three questions.",
    },
    auth: {
      title: "Log in or register",
      body: "Name, mobile, and a practice code. Any 4 to 6 digit code works, for example 1234.",
      first: "First name",
      last: "Last name",
      phone: "Mobile number",
      email: "Email (optional)",
      send: "Get the code",
      otp: "Verification code",
      verify: "Confirm and enter",
      back: "Edit number",
      sent: "A practice code is ready. Enter any 4 to 6 digits.",
      invalidName: "First and last name are required.",
      invalidPhone: "Enter a full mobile number.",
      invalidOtp: "The code must be 4 to 6 digits.",
    },
    pay: {
      title: "Upgrade plan",
      body: "Checkout is simulated and unlocks the specialist films immediately.",
      gold: "Gold plan",
      goldText: "All four specialist paths, still gated by each lesson challenge.",
      vip: "VIP plan",
      vipText: "The same access as Gold, with a VIP mark and faster support.",
      buy: "Buy and upgrade",
      working: "Connecting to the practice gateway…",
      done: "Practice payment saved. Your plan is active.",
      close: "Close",
      needAuth: "Sign in with your mobile first.",
    },
    support: {
      button: "Support",
      title: "NexSell support",
      guest: "Write these details to start the conversation.",
      name: "First and last name",
      phone: "Mobile number",
      topic: "Topic",
      description: "Description",
      start: "Send and start chat",
      ai: "AI support",
      human: "Operator ticket",
      placeholder: "Your message",
      send: "Send",
      typing: "Typing…",
      ticketOk:
        "Your ticket was submitted. Our team will reply by call or SMS.",
      status: "Under Review",
      eta: "Estimated reply: within one business day",
      etaVip: "Estimated reply: within two business hours",
      empty: "Add name, mobile, topic, and a description.",
      hello: "Ask about a path, a locked video, pricing, or the quiz rules.",
    },
    sub: {
      luxury: "Practice Gold and VIP checkout",
      luxuryBody: "This runs the simulated gateway and turns specialist videos on.",
      open: "Buy and upgrade",
    },
    articlesPage: {
      title: "Articles",
      intro: "Short notes on online, in-person, and phone selling, plus negotiation. Open any piece to read it through.",
      more: "Read more",
      back: "Back to articles",
      missing: "Article not found",
      by: "Author",
    },
  },
} as const;

export type Copy = (typeof copy)["fa"];

type I18nValue = {
  lang: Lang;
  dir: "rtl" | "ltr";
  copy: Copy;
  setLang: (lang: Lang) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fa");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = localStorage.getItem("nexsell-lang");
      if (stored === "en" || stored === "fa") setLangState(stored);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang === "en" ? "en" : "fa";
    root.dir = lang === "en" ? "ltr" : "rtl";
    root.classList.toggle("font-en", lang === "en");
    localStorage.setItem("nexsell-lang", lang);
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      dir: lang === "en" ? "ltr" : "rtl",
      copy: copy[lang] as Copy,
      setLang: setLangState,
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
