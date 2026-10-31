import { articles } from "@/lib/articles";
import { OBJECTIONS, counterFor } from "@/lib/copilot/playbook";
import { categories, lessonsOf, type Category } from "@/lib/courses-data";
import { BUNDLE_LIST_PRICE, BUNDLE_PRICE, BUNDLE_SAVE, COURSE_PRICE, PRICE_PER_THOUSAND } from "@/lib/pricing";
import { SERVICE_OFFERS, quoteService, serviceBreakdown } from "@/lib/service-pricing";

export const fa = new Intl.NumberFormat("fa-IR");

export function toman(value: number) {
  return `${fa.format(value)} تومان`;
}

function revealAttrs(delayMs = 0) {
  return `data-reveal data-delay="${delayMs}"`;
}

function bundleOfferCopy() {
  return `<p class="mt-2 max-w-2xl text-sm leading-7 text-cream/80">برای کسی که می‌خواهد فروش را یاد بگیرد، فروشش را بالاتر ببرد و در مسیر فروش جلو برود.</p>
    <p class="mt-2 max-w-2xl text-sm leading-7 text-cream/75">هر چهار مسیر با هم است: فروش آنلاین، فروش حضوری، فروش تلفنی و اصول مذاکره. هر درس ویدیو دارد و با کوییز تمام می‌شود.</p>
    <p class="mt-3 text-sm leading-7 text-cream/70">خرید جدا <span class="line-through decoration-cream/40">${toman(BUNDLE_LIST_PRICE)}</span>. با هم <span class="font-semibold text-gold">${toman(BUNDLE_PRICE)}</span>؛ ${toman(BUNDLE_SAVE)} کمتر.</p>`;
}

function esc(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const NAV = [
  ["/", "خانه", "home"],
  ["/academy/", "آموزش", "academy"],
  ["/demo/", "دستیار", "copilot"],
  ["/articles/", "مقالات", "articles"],
  ["/services/", "خدمات", "services"],
  ["/support/", "پشتیبانی", "support"],
  ["/about/", "درباره ما", "about"],
  ["/contact/", "ارتباط با ما", "contact"],
] as const;

export function layout(base: string, active: string, title: string, body: string) {
  const href = (path: string) => `${base}${path}`;
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl" class="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${href("/lenis.css")}" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { theme: { extend: {
      fontFamily: { sans: ["Vazirmatn", "Tahoma", "sans-serif"] },
      colors: { navy: "#0B132B", gold: "#D4AF37", cream: "#F6F1E4" }
    } } }
  </script>
  <style>
    html { scroll-behavior: auto; }
    body {
      background: #0B132B;
      color: #F6F1E4;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
    .glass { background: rgba(15, 28, 63, 0.55); border: 1px solid rgba(212, 175, 55, 0.22); backdrop-filter: blur(16px); }
    .view { display: none; }
    .view.active { display: block; }
    [data-reveal] {
      opacity: 0;
      transform: translateY(1.5rem);
      filter: blur(2px);
      transition: opacity 700ms ease-out, transform 700ms ease-out, filter 700ms ease-out;
      transition-delay: var(--reveal-delay, 0ms);
    }
    [data-reveal].is-revealed {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0);
    }
    @keyframes voice-pulse {
      0% { box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.75); }
      100% { box-shadow: 0 0 0 12px rgba(248, 113, 113, 0); }
    }
    [data-voice-toggle][data-state="recording"] [data-voice-pulse] {
      animation: voice-pulse 1.1s ease-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      [data-reveal] { opacity: 1; transform: none; filter: none; transition: none; }
      [data-voice-toggle][data-state="recording"] [data-voice-pulse] { animation: none; }
    }
    #cart-drawer, #service-order, #checkout-order {
      border: 1px solid rgba(212, 175, 55, 0.35);
      background: #0B132B;
      color: #F6F1E4;
      padding: 0;
    }
    #cart-drawer {
      margin: 0;
      margin-inline-start: auto;
      height: 100vh;
      max-height: 100vh;
      width: min(26rem, 100vw);
    }
    #service-order, #checkout-order {
      width: min(40rem, calc(100vw - 1.5rem));
      max-height: min(90vh, 52rem);
      margin: auto;
      border-radius: 1.5rem;
    }
    #cart-drawer::backdrop, #service-order::backdrop, #checkout-order::backdrop { background: rgba(0, 0, 0, 0.66); }
    @media (max-width: 640px) {
      #service-order, #checkout-order { width: 100vw; max-height: 100vh; height: 100vh; border-radius: 0; }
    }
  </style>
</head>
<body class="min-h-screen font-sans antialiased" data-base="${esc(base)}">
  <header class="sticky top-0 z-40 border-b border-gold/20 bg-navy/80 backdrop-blur-xl">
    <div class="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
      <a href="${href("/")}" class="flex items-center gap-2">
        <span class="grid size-9 place-items-center rounded-2xl bg-gold text-sm font-bold text-navy">ن</span>
        <span class="leading-tight">
          <span class="block text-sm font-bold">نکس‌سل</span>
          <span class="hidden text-[11px] text-cream/60 lg:block">آکادمی مهارت‌های فروش</span>
        </span>
      </a>
      <nav class="ms-4 hidden min-w-0 items-center gap-0.5 overflow-x-auto md:flex">
        ${NAV.map(([path, label, id]) => `<a href="${href(path)}" class="shrink-0 rounded-xl px-2 py-2 text-sm ${active === id ? "bg-gold text-navy" : "text-cream/70 hover:bg-white/5 hover:text-cream"}">${label}</a>`).join("")}
      </nav>
      <div class="ms-auto flex items-center gap-2">
        <button type="button" data-open-cart class="relative grid size-10 place-items-center rounded-full ring-1 ring-gold/30" aria-label="سبد خرید">
          <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M3 4h2l2.2 11h11.3l1.8-8H7"/></svg>
          <span data-cart-count class="absolute -top-1 start-0 hidden min-w-5 rounded-full bg-gold px-1 text-center text-[10px] font-bold leading-5 text-navy">۰</span>
        </button>
        <a data-auth-guest href="${href("/login/")}" class="rounded-full px-3 py-1.5 text-xs ring-1 ring-gold/30">ورود آزمایشی</a>
        <a data-auth-user="chip" href="${href("/dashboard/")}" class="items-center gap-2 rounded-full py-1 ps-1 pe-3 text-xs ring-1 ring-gold/30 sm:text-sm" hidden>
          <span data-header-letter class="grid size-7 place-items-center rounded-full bg-gold text-xs font-bold text-navy">ن</span>
          <span data-header-name class="max-w-28 truncate">کاربر</span>
        </a>
        <button type="button" data-menu class="rounded-xl px-3 py-2 text-sm ring-1 ring-gold/30 md:hidden">منو</button>
      </div>
    </div>
    <div data-mobile-nav data-lenis-prevent class="hidden max-h-[70vh] overflow-y-auto border-t border-white/10 px-4 py-3 md:hidden">
      <button type="button" data-open-cart class="block w-full rounded-xl px-3 py-2 text-start text-sm text-cream/80">سبد خرید <span data-cart-count>۰</span></button>
      <a data-auth-guest href="${href("/login/")}" class="block rounded-xl px-3 py-2 text-sm text-cream/80">ورود آزمایشی</a>
      <div data-auth-user="menu" class="mb-2 border-b border-white/10 pb-2" hidden>
        <p class="px-3 py-2 text-sm font-semibold"><span data-header-name>کاربر</span></p>
        <a href="${href("/dashboard/")}" class="block rounded-xl px-3 py-2 text-sm text-cream/80">پنل کاربری</a>
        <button type="button" data-sign-out class="block w-full rounded-xl px-3 py-2 text-start text-sm text-cream/70">خروج از حساب</button>
      </div>
      ${NAV.map(([path, label]) => `<a href="${href(path)}" class="block rounded-xl px-3 py-2 text-sm text-cream/80">${label}</a>`).join("")}
    </div>
  </header>
  <main class="mx-auto w-full max-w-6xl px-4 py-8">${body}</main>
  <footer class="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-cream/50 sm:flex-row sm:justify-between">
    <p>نکس‌سل، آموزش ویدیویی فروش با چالش پایان هر درس.</p>
  </footer>
  ${commerceShell(base)}
  <script id="objections" type="application/json">${JSON.stringify(OBJECTIONS)}</script>
  <script src="${href("/lenis.min.js")}"></script>
  <script src="${href("/client.js")}"></script>
</body>
</html>`;
}

function commerceShell(_base: string) {
  return `<dialog id="cart-drawer" aria-labelledby="cart-title">
    <div class="flex h-full max-h-[100vh] flex-col">
      <div class="flex items-center justify-between gap-3 border-b border-white/10 p-4">
        <h2 id="cart-title" class="text-lg font-semibold">سبد خرید</h2>
        <button type="button" data-cart-close class="h-10 rounded-full px-3 text-sm ring-1 ring-white/20" aria-label="بستن سبد">بستن</button>
      </div>
      <div data-cart-toast-slot class="px-4 pt-3"></div>
      <div data-cart-body class="min-h-0 flex-1 overflow-y-auto p-4" data-lenis-prevent></div>
      <div data-cart-footer class="border-t border-white/10 p-4"></div>
    </div>
  </dialog>
  <dialog id="service-order" aria-labelledby="service-order-title">
    <form data-service-form class="flex max-h-[min(90vh,52rem)] flex-col">
      <div class="flex items-start justify-between gap-3 border-b border-white/10 p-5">
        <div>
          <p class="text-xs text-gold">سفارش خدمت</p>
          <h2 id="service-order-title" data-service-title class="mt-1 text-xl font-semibold"></h2>
        </div>
        <button type="button" data-service-close class="grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-white/20" aria-label="بستن">×</button>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto p-5" data-lenis-prevent>
        <div data-service-fields class="grid gap-3"></div>
        <p data-service-error class="mt-3 text-sm text-rose-300" role="alert"></p>
      </div>
      <div class="flex flex-wrap gap-2 border-t border-white/10 p-5">
        <button type="submit" data-service-next class="h-11 flex-1 rounded-2xl bg-gold text-sm font-semibold text-navy">ادامه و مشاهده خلاصه</button>
        <button type="button" data-service-back class="hidden h-11 rounded-2xl px-4 text-sm ring-1 ring-white/20">بازگشت</button>
        <button type="button" data-service-confirm class="hidden h-11 flex-1 rounded-2xl bg-gold text-sm font-semibold text-navy">تأیید و افزودن به سبد خرید</button>
      </div>
    </form>
  </dialog>
  <dialog id="checkout-order" aria-labelledby="checkout-title">
    <form data-checkout-form class="flex max-h-[min(90vh,52rem)] flex-col">
      <div class="flex items-start justify-between gap-3 border-b border-white/10 p-5">
        <h2 id="checkout-title" class="text-xl font-semibold">ثبت دسترسی آزمایشی</h2>
        <button type="button" data-checkout-close class="grid size-10 place-items-center rounded-full ring-1 ring-white/20" aria-label="بستن">×</button>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto p-5" data-lenis-prevent>
        <div data-checkout-fields class="grid gap-3">
          <label class="text-sm">نام و نام خانوادگی<input name="name" class="mt-1 h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-3" /></label>
          <label class="text-sm">شماره موبایل<input name="phone" dir="ltr" inputmode="numeric" class="mt-1 h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-3 text-left" placeholder="0912xxxxxxx" /></label>
          <label class="text-sm">یادداشت (اختیاری)<textarea name="notes" class="mt-1 min-h-20 w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2"></textarea></label>
          <p data-checkout-error class="text-sm text-rose-300" role="alert"></p>
        </div>
        <div data-checkout-done class="hidden"></div>
      </div>
      <div data-checkout-actions class="border-t border-white/10 p-5">
        <div data-checkout-summary class="mb-3 rounded-2xl border border-white/10 p-3 text-sm"></div>
        <button type="submit" class="h-12 w-full rounded-2xl bg-gold text-sm font-semibold text-navy">ثبت دسترسی آزمایشی روی همین مرورگر</button>
      </div>
    </form>
  </dialog>
  <div id="cart-toast" class="fixed top-20 inset-x-4 z-[80] mx-auto hidden max-w-lg items-center gap-3 rounded-2xl bg-navy px-4 py-3 text-sm text-cream ring-1 ring-gold/40" role="status">
    <p data-toast-text class="flex-1"></p>
    <button type="button" data-toast-cart class="shrink-0 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy">مشاهده سبد</button>
  </div>`;
}

function voiceChat() {
  const samples = ["قیمت بالاست", "تخفیف بدید", "باید فکر کنم"];
  return `<div data-voice-chat class="mt-5">
    <label class="mb-4 flex items-start gap-3 rounded-2xl border border-gold/30 bg-white/5 p-3 text-sm leading-7">
      <input data-voice-consent type="checkbox" class="mt-1 size-4 accent-gold" />
      <span>فایل صوت فقط برای تحلیل همان جلسه است و بدون تأیید ذخیره نمی‌شود. این ضبط جدا از دسترسی دوره است.</span>
    </label>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label class="block min-w-0 flex-1 text-sm">
        <span class="text-cream/70">متن گفتگو</span>
        <textarea data-voice-input rows="2" class="mt-1 w-full resize-y rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold" placeholder="بنویسید یا با میکروفن بگویید"></textarea>
      </label>
      <div class="flex flex-wrap items-center gap-2">
        <button type="button" data-voice-toggle aria-pressed="false" data-state="idle" class="inline-flex h-11 items-center gap-2 rounded-2xl bg-gold px-4 text-sm font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-50">
          <svg data-voice-mic viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Z"/><path d="M19 11a7 7 0 0 1-14 0"/><path d="M12 18v3"/></svg>
          <svg data-voice-stop viewBox="0 0 24 24" class="hidden size-4" fill="currentColor" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>
          <span data-voice-pulse class="hidden size-2 rounded-full bg-red-400"></span>
          <span data-voice-label>شروع صحبت</span>
        </button>
        <button type="button" data-voice-send class="h-11 rounded-2xl px-4 text-sm ring-1 ring-gold/40">ارسال</button>
      </div>
    </div>
    <p data-voice-live class="mt-2 min-h-6 text-sm text-gold" aria-live="polite"></p>
    <p data-voice-toast class="mt-1 hidden text-sm text-rose-300" role="status"></p>
    <div class="mt-3 flex flex-wrap gap-2">
      ${samples.map((sample) => `<button type="button" data-sample-objection="${esc(sample)}" class="h-10 rounded-full px-3 text-xs ring-1 ring-gold/30">${esc(sample)}</button>`).join("")}
    </div>
  </div>`;
}

const COURSE_MARK: Record<string, string> = {
  online: "آنلاین",
  hozuri: "حضوری",
  telefoni: "تلفنی",
  mozakerah: "مذاکره",
  free: "رایگان",
};

function durationLabel(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours > 0 && rest > 0) return `${fa.format(hours)} ساعت و ${fa.format(rest)} دقیقه آموزش`;
  if (hours > 0) return `${fa.format(hours)} ساعت آموزش`;
  return `${fa.format(minutes)} دقیقه آموزش`;
}

function courseCatalog() {
  return categories.map((category) => {
    const rows = lessonsOf(category);
    return {
      id: category.id,
      title: category.title.fa,
      description: category.description.fa,
      paid: category.tierRequired === "pro",
      lessons: rows.map((row) => ({ id: row.lesson.id, title: row.lesson.title.fa })),
    };
  });
}

function homeCourseCards(base: string) {
  return categories.map((category, index) => {
    const count = lessonsOf(category).length;
    const paid = category.tierRequired === "pro";
    const enter = `${base}/learn/${category.id}/`;
    return `<article ${revealAttrs(index * 80)} class="glass flex flex-col rounded-3xl p-5" data-course="${category.id}" data-paid="${paid ? "yes" : "no"}">
      <h2 class="text-lg font-semibold"><a href="${enter}" class="hover:text-gold">${esc(category.title.fa)}</a></h2>
      <p class="mt-2 flex-1 text-sm leading-7 text-cream/70">${esc(category.description.fa)}</p>
      ${paid ? `<p class="mt-3 text-2xl font-semibold text-gold">${toman(COURSE_PRICE)}</p>` : `<p class="mt-3 text-sm text-emerald-300">آموزش رایگان</p>`}
      <a href="${enter}" class="mt-3 inline-flex text-sm text-gold">دیدن ${fa.format(count)} درس</a>
      <div class="mt-4">
        ${paid ? `<button type="button" data-buy="${category.id}" class="h-11 w-full rounded-2xl bg-cream text-sm font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-60">افزودن به سبد</button>`
          : `<a href="${enter}" class="inline-flex h-11 w-full items-center justify-center rounded-2xl border-2 border-gold bg-navy text-sm font-semibold text-gold">مشاهده ویدیوها</a>`}
      </div>
    </article>`;
  }).join("");
}

function academyCourseCards(base: string) {
  return categories.map((category, index) => {
    const rows = lessonsOf(category);
    const minutes = rows.reduce((sum, row) => sum + row.lesson.minutes, 0);
    const paid = category.tierRequired === "pro";
    const first = rows[0]?.lesson.id;
    const enter = first ? `${base}/learn/${category.id}/${first}/` : `${base}/learn/${category.id}/`;
    const freeBadge = paid ? "" : `<span class="rounded-full bg-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-200">رایگان</span>`;
    const actions = paid
      ? `<div data-card-price><p class="text-2xl font-semibold text-gold">${toman(COURSE_PRICE)}</p></div>
        <div data-card-progress class="hidden">
          <div class="flex items-center justify-between gap-2 text-xs">
            <p data-card-fraction>۰ از ${fa.format(rows.length)} درس تکمیل‌شده</p>
            <span data-card-status="learning" class="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-gold">در حال یادگیری</span>
            <span data-card-status="done" class="hidden shrink-0 rounded-full bg-gold px-2 py-0.5 text-navy">تکمیل‌شده</span>
          </div>
          <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true"><div data-card-bar class="h-full rounded-full bg-gold" style="width:0%"></div></div>
        </div>
        <div class="mt-3 grid gap-2">
          <button type="button" data-card-overview class="h-11 rounded-2xl bg-gold text-sm font-semibold text-navy" aria-haspopup="dialog">مشاهده سرفصل‌ها و معرفی</button>
          <button type="button" data-card-buy data-buy="${category.id}" class="h-11 rounded-2xl text-sm ring-1 ring-gold/40">افزودن به سبد</button>
          <a data-card-resume href="${enter}" class="hidden h-11 items-center justify-center rounded-2xl bg-gold text-sm font-semibold text-navy">ادامه یادگیری</a>
        </div>`
      : `<div data-card-progress class="hidden">
          <div class="flex items-center justify-between gap-2 text-xs">
            <p data-card-fraction>۰ از ${fa.format(rows.length)} درس تکمیل‌شده</p>
            <span data-card-status="learning" class="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-gold">در حال یادگیری</span>
            <span data-card-status="done" class="hidden shrink-0 rounded-full bg-gold px-2 py-0.5 text-navy">تکمیل‌شده</span>
          </div>
          <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true"><div data-card-bar class="h-full rounded-full bg-gold" style="width:0%"></div></div>
        </div>
        <div class="mt-3 grid gap-2">
          <a data-card-guest href="${base}/login/" class="inline-flex h-11 items-center justify-center rounded-2xl bg-gold text-sm font-semibold text-navy">ورود آزمایشی برای شروع</a>
          <a data-card-resume href="${enter}" class="hidden h-11 items-center justify-center rounded-2xl bg-gold text-sm font-semibold text-navy">شروع یادگیری</a>
        </div>`;
    return `<article ${revealAttrs(index * 80)} class="glass flex cursor-pointer flex-col overflow-hidden rounded-3xl" data-course-card="${category.id}" data-paid="${paid ? "yes" : "no"}" data-card-mode="${paid ? "locked" : "login"}">
      <div class="flex items-start justify-between gap-3 bg-[#10182E] px-5 py-5">
        <span class="grid size-14 shrink-0 place-items-center rounded-2xl bg-gold text-sm font-bold text-navy">${esc(COURSE_MARK[category.id] || "ن")}</span>
        <div class="flex flex-wrap justify-end gap-1.5">
          ${freeBadge}
          <span class="rounded-full border border-gold/40 px-2 py-1 text-[11px] text-cream">دارای آزمون سنجش</span>
        </div>
      </div>
      <div class="flex flex-1 flex-col p-5">
        <h2 class="text-lg font-semibold">${esc(category.title.fa)}</h2>
        <p class="mt-2 text-sm leading-7 text-cream/70">${esc(category.description.fa)}</p>
        <ul class="mt-3 flex flex-wrap gap-2 text-[11px] text-cream/60">
          <li class="rounded-full bg-white/5 px-2.5 py-1">${durationLabel(minutes)}</li>
          <li class="rounded-full bg-white/5 px-2.5 py-1">${fa.format(rows.length)} درس</li>
          <li class="rounded-full bg-white/5 px-2.5 py-1">ویدیویی + کوییز گیمیفای‌شده</li>
        </ul>
        <div class="mt-4 border-t border-white/10 pt-4">${actions}</div>
      </div>
    </article>`;
  }).join("");
}

function courseOverview() {
  return `<dialog id="course-overview" aria-labelledby="course-overview-title">
    <div class="flex max-h-[min(90vh,52rem)] flex-col sm:max-h-[min(90vh,52rem)]">
      <div class="flex items-start justify-between gap-3 border-b border-white/10 p-5">
        <div>
          <p class="text-xs text-gold">معرفی دوره</p>
          <h2 id="course-overview-title" data-ov-title class="mt-1 text-xl font-semibold"></h2>
        </div>
        <button type="button" data-overview-close class="grid size-10 shrink-0 place-items-center rounded-full text-lg ring-1 ring-white/20" aria-label="بستن">×</button>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto p-5" data-lenis-prevent>
        <p data-ov-desc class="text-sm leading-7 text-cream/70"></p>
        <p class="mt-4 text-sm font-medium text-gold">درس اول هر مسیر بدون سبد دیده می‌شود. قبولی در ۲ سوال از ۳ سوال درس بعد را باز می‌کند.</p>
        <ol data-ov-lessons class="mt-3 space-y-2"></ol>
      </div>
      <div class="border-t border-white/10 p-5">
        <button type="button" data-buy data-ov-buy class="h-12 w-full rounded-2xl bg-gold text-sm font-semibold text-navy">افزودن به سبد</button>
        <p class="mt-2 text-center text-xs leading-6 text-cream/60">پرداخت بانکی نیست. دسترسی روی همین مرورگر می‌ماند.</p>
        <p data-ov-price class="mt-2 text-center text-xs text-cream/50"></p>
      </div>
    </div>
  </dialog>`;
}

function paidHomeCards(base: string) {
  return homeCourseCards(base).replace(
    /<article[^>]*data-paid="no"[\s\S]*?<\/article>/,
    "",
  );
}

function productPresent(base: string) {
  const objects = [
    ["card-phone.webp", "گوشی تیره با موج طلایی روی صفحهٔ تماس", "فروش تلفنی", "تماس‌هایی که انرژی زیادی می‌گیرند، اما بدون ثبت سفارش یا زمان پیگیری مشخص تمام می‌شوند."],
    ["card-objection.webp", "حباب گفتگو پشت یک سپر شفاف با لبهٔ طلایی", "مدیریت اعتراض‌ها", "لحظه‌ای که مشتری روی قیمت یا محصول ایراد می‌گذارد و کارشناس فروش جوابی برای کنترل مکالمه ندارد."],
    ["card-meeting.webp", "میز تیره با پوشه و نشان طلایی", "جلسات حضوری", "جلسات طولانی و ارائه‌های فنی خسته‌کننده که بدون تعهد خرید و قرارداد به پایان می‌رسند."],
    ["card-chat.webp", "حباب گفتگو با رد پیام‌های کم‌رنگ", "فروش در پیام‌رسان‌ها", "چت‌ها و دایرکت‌هایی که فقط تا مرحله استعلام قیمت جلو می‌آیند و بعد از آن بی‌پاسخ رها می‌شوند."],
  ] as const;
  const tiles = objects.map(([file, alt, title, line]) => `<figure class="bg-[#070B18] p-3 sm:p-4">
      <img src="${base}/present/${file}" alt="${esc(alt)}" width="800" height="800" class="aspect-square w-full rounded-2xl object-cover" />
      <figcaption class="mt-3 text-sm font-semibold text-cream">${title}</figcaption>
      <p class="mt-1 text-xs leading-6 text-cream/70">${line}</p>
    </figure>`).join("");
  return `<section ${revealAttrs(40)} aria-labelledby="present-title" class="mt-8 overflow-hidden rounded-[2rem] border border-gold/30 bg-[#070B18]">
    <div class="grid lg:grid-cols-2">
      <div class="p-6 sm:p-8">
        <p class="text-xs tracking-[0.18em] text-gold">یک موقعیت آشنا</p>
        <h2 id="present-title" class="mt-3 text-2xl font-semibold leading-[1.5] text-cream sm:text-3xl">مشتری پیام می‌دهد، تماس می‌گیرد، اما در قدم آخر خرید نمی‌کند.</h2>
        <p class="mt-4 text-sm leading-8 text-cream/80">مشکل بیشتر تیم‌ها کمبود مشتری یا تبلیغات ضعیف نیست؛ از دست رفتن مشتری در دقایق پایانی گفتگو است: مشتری می‌گوید «قیمت بالاست» و تماس قفل می‌شود. مذاکره تلفنی گرم شروع می‌شود، اما بدون تعیین تکلیف قطع می‌شود. در جلسات حضوری هم توضیحات زیادی داده می‌شود، اما در نهایت مشتری با یک «فکر می‌کنم و خبر می‌دهم» جلسه را ترک می‌کند.</p>
        <p class="mt-4 rounded-2xl border border-gold/35 bg-white/5 px-4 py-3 text-sm font-semibold leading-8 text-cream">فروش شانسی نیست. اگر ساختار گفتگو و پاسخ به اعتراض‌ها از قبل مشخص نباشد، هر روز بخشی از فروش قطعی خود را از دست می‌دهید.</p>
      </div>
      <div class="grid grid-cols-2 border-t border-gold/20 lg:border-t-0 lg:border-s">${tiles}</div>
    </div>
  </section>`;
}

function offerChecks(points: readonly string[]) {
  return `<ul class="mt-4 space-y-2">${points.map((point) => `<li class="flex items-start gap-2 text-sm leading-7 text-cream/80"><svg viewBox="0 0 24 24" class="mt-1 size-4 shrink-0 text-gold" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12.5 9.2 17 19 7" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${point}</span></li>`).join("")}</ul>`;
}

function offerBlock(options: { id: string; flip: boolean; badge: string; title: string; body: string; points: readonly string[]; cta: string; href: string; mockup: string }) {
  const copyOrder = options.flip ? "order-2" : "order-2 lg:order-1";
  const mockOrder = options.flip ? "order-1" : "order-1 lg:order-2";
  return `<article id="${options.id}" ${revealAttrs(options.flip ? 80 : 40)} class="scroll-mt-24 overflow-hidden rounded-[2rem] border border-white/10 bg-[#070B18] p-5 sm:p-8">
    <div class="flex flex-col gap-6 lg:flex-row lg:items-center">
      <div class="${copyOrder} min-w-0 flex-1">
        <p class="inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">${options.badge}</p>
        <h2 class="mt-4 text-2xl font-semibold leading-[1.5] text-cream">${options.title}</h2>
        <p class="mt-3 text-sm leading-8 text-cream/75">${options.body}</p>
        ${offerChecks(options.points)}
        <a href="${options.href}" class="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gold px-5 text-sm font-semibold text-navy sm:w-auto">${options.cta}</a>
      </div>
      <div class="${mockOrder} min-w-0 flex-1" aria-hidden="true">${options.mockup}</div>
    </div>
  </article>`;
}

function trainingMockup() {
  const lessons = [
    ["فروش تلفنی", "انجام شد"],
    ["اعتراض قیمت", "در حال تمرین"],
    ["بستن جلسه", "قفل"],
  ];
  return `<div class="rounded-[1.5rem] border border-gold/25 bg-navy p-4 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
    <div class="flex items-center justify-between gap-3">
      <p class="text-sm font-semibold">داشبورد درس</p>
      <div class="text-center">
        <div class="relative grid size-16 place-items-center">
          <svg viewBox="0 0 36 36" class="size-16">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(246,241,228,0.12)" stroke-width="3"></circle>
            <circle cx="18" cy="18" r="15" fill="none" stroke="#D4AF37" stroke-width="3" stroke-linecap="round" stroke-dasharray="94.2" stroke-dashoffset="30" transform="rotate(-90 18 18)"></circle>
          </svg>
          <span class="absolute text-[10px] font-semibold text-gold">۶۸٪</span>
        </div>
        <p class="mt-1 text-[10px] text-cream/50">تکمیل شده</p>
      </div>
    </div>
    <ul class="mt-3 space-y-2">${lessons.map(([name, state]) => `<li class="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm"><span>${name}</span><span class="text-xs text-gold">${state}</span></li>`).join("")}</ul>
    <div class="mt-3 rounded-2xl border border-gold/30 bg-[#070B18] p-3">
      <p class="text-xs text-gold">سناریو</p>
      <p class="mt-1 text-sm">قیمت بالاست</p>
      <span class="mt-3 inline-flex h-8 items-center rounded-full bg-gold px-3 text-xs font-semibold text-navy">پخش تمرین</span>
    </div>
  </div>`;
}

function copilotMockup() {
  const bars = [35, 62, 48, 80, 44, 28, 70, 52, 38, 66];
  return `<div class="rounded-[1.5rem] border border-gold/25 bg-navy p-4 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
    <div class="flex items-center justify-between text-sm">
      <p class="font-semibold">تماس زنده</p>
      <p class="font-semibold text-gold" dir="ltr">03:42</p>
    </div>
    <div class="mt-4 flex h-12 items-end justify-center gap-1">${bars.map((height) => `<span class="inline-block w-1.5 shrink-0 rounded-full bg-gold" style="height:${Math.round(height * 0.46)}px"></span>`).join("")}</div>
    <div class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
      <p class="text-xs text-cream/50">اعتراض شنیده‌شده</p>
      <p class="mt-1 text-sm">«قیمت شما بالاست»</p>
    </div>
    <div class="mt-3 rounded-2xl border border-gold/40 bg-gold/10 p-3">
      <p class="text-xs font-semibold text-gold">پاسخ پیشنهادی</p>
      <p class="mt-1 text-sm leading-7">اگر مقایسه با هزینهٔ نخریدن باشد، کدام بخش برایتان سنگین است؟</p>
    </div>
  </div>`;
}

function servicesMockup() {
  const rows = [
    ["پیگیری قیمت", "باز"],
    ["معرفی محصول", "قرار"],
    ["تمدید قرارداد", "در مذاکره"],
  ];
  const checks = ["اسکریپت تماس سرد", "جواب اعتراض قیمت", "قرار جلسهٔ بعد"];
  return `<div class="rounded-[1.5rem] border border-gold/25 bg-navy p-4 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
    <p class="text-[11px] text-cream/45">نمونهٔ رابط</p>
    <p class="mt-2 text-2xl font-semibold text-gold" dir="ltr">+۳۴٪</p>
    <p class="text-xs text-cream/60">افزایش نرخ بستن</p>
    <ul class="mt-4 space-y-2">${rows.map(([name, state]) => `<li class="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm"><span>${name}</span><span class="text-xs text-gold">${state}</span></li>`).join("")}</ul>
    <ul class="mt-3 space-y-1.5">${checks.map((item) => `<li class="flex items-center gap-2 text-xs text-cream/70"><span class="size-3 rounded-sm border border-gold/50"></span>${item}</li>`).join("")}</ul>
  </div>`;
}

function offeringLanes(base: string) {
  return `<section aria-label="آموزش، دستیار و خدمات" class="mt-8 space-y-6">
    ${offerBlock({
      id: "training-section",
      flip: false,
      badge: "مسیر رشد مهارت",
      title: "تبدیل سرنخ‌های سرد به مشتریان وفادار با متد عملی",
      body: "دوره‌های پروژه‌محور و مبتنی بر سناریوهای واقعی بازار ایران؛ از مذاکره تلفنی و شکستن مقاومت قیمت تا مدیریت پیشرفته اعتراض‌ها. هر سرفصل همراه با ارزیابی عملی و تمرین گام‌به‌گام طراحی شده است.",
      points: [
        "دسترسی به درس‌ها بر اساس آزمون‌های عملی",
        "سناریوهای واقعی مکالمات شکست‌خورده و اصلاح‌شده",
        "تمرین متنی و صوتی قبل از ورود به جلسه واقعی",
      ],
      cta: "مشاهده سرفصل‌ها و شروع یادگیری",
      href: "#courses",
      mockup: trainingMockup(),
    })}
    ${offerBlock({
      id: "copilot-section",
      flip: true,
      badge: "دستیار هوشمند لحظه‌ای",
      title: "راهنمای ثانیه‌به‌ثانیه در حین تماس؛ بدون جا انداختن هیچ اعتراضی",
      body: "در میانه مکالمه با مشتری سردرگم نمی‌شوید. دستیار هوشمند، صحبت‌های مشتری را تحلیل می‌کند، الگوی اعتراض را تشخیص می‌دهد و بهترین پاسخ متقاعدکننده را بلافاصله روی نمایشگر شما ظاهر می‌کند.",
      points: [
        "تحلیل لحن و مقاومت مشتری در لحظه تماس",
        "پیشنهاد عبارات طلایی برای قطعی کردن فروش",
        "بازخورد آنی پس از اتمام هر مکالمه کاری",
      ],
      cta: "تست زنده و شارژ دستیار هوشمند",
      href: `${base}/demo/`,
      mockup: copilotMockup(),
    })}
    ${offerBlock({
      id: "services-section",
      flip: false,
      badge: "سیستم‌سازی سازمانی",
      title: "بازنویسی اسکریپت و کوچینگ فروش؛ وقتی کار از یک نفر بزرگ‌تر شده است",
      body: "اگر تیم فروش شما به تارگت‌های مشخص نمی‌رسد یا هر بازاریاب به شیوه متفاوتی پاسخ می‌دهد، وقت سیستم‌سازی است. ما اسکریپت‌ها را بازنویسی کرده و با کارگاه‌های عملی و منتورینگ هفتگی، نرخ بستن معاملات تیم شما را بالا می‌بریم.",
      points: [
        "بازنویسی دقیق فرآیند تماس و دایرکت‌های ورودی",
        "کارگاه حضوری و تمرین روی پرونده‌های فعال شرکت",
        "نظارت و آنالیز هفتگی کیفیت مکالمات فروشندگان",
      ],
      cta: "ثبت درخواست خدمات و مشاوره تیم",
      href: `${base}/services/`,
      mockup: servicesMockup(),
    })}
  </section>`;
}

export function homePage(base: string) {
  return layout(base, "home", "نکس‌سل | آکادمی فروش", `
    <section ${revealAttrs(0)} class="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-10">
      <p class="text-xs tracking-[0.18em] text-gold">نکس‌سل</p>
      <h1 class="mt-3 max-w-3xl text-3xl font-semibold leading-[1.45] text-cream sm:text-4xl">آکادمی فروش نکس‌سل</h1>
      <p class="mt-4 max-w-2xl text-sm leading-8 text-cream">چهار مسیر فروش: آنلاین، حضوری، تلفنی و مذاکره.</p>
    </section>
    ${productPresent(base)}
    ${offeringLanes(base)}
    <section id="courses" class="mt-8 scroll-mt-24">
      <h2 class="text-xl font-semibold">چهار مسیر فروش</h2>
      <p class="mt-2 max-w-2xl text-sm leading-7 text-cream/70">پرداخت بانکی نیست. دسترسی روی همین مرورگر می‌ماند. درس اول هر مسیر بدون سبد دیده می‌شود.</p>
      <div class="mt-4 grid gap-4 md:grid-cols-2">${paidHomeCards(base)}</div>
      <section class="glass relative mt-8 overflow-hidden rounded-[2rem] p-5 sm:p-7" aria-label="اثر آکادمی">
        <div class="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        <div class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 class="text-lg font-semibold">اثر آکادمی</h2>
          <p class="text-xs leading-6 text-cream/60">عددها نمونهٔ نمایشی‌اند و با ورود به بخش، نرم می‌شمارند.</p>
        </div>
        <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article class="rounded-2xl border border-gold/35 bg-white/5 px-4 py-4">
            <p class="text-2xl font-semibold text-[#F3E5AB] sm:text-3xl"><span data-count="5000" data-prefix="+" data-suffix="">+۵٬۰۰۰</span></p>
            <p class="mt-2 text-xs leading-6 text-cream/70">دانش‌پذیر فعال</p>
          </article>
          <article class="rounded-2xl border border-gold/35 bg-white/5 px-4 py-4">
            <p class="text-2xl font-semibold text-[#F3E5AB] sm:text-3xl"><span data-count="120" data-prefix="+" data-suffix="">+۱۲۰</span></p>
            <p class="mt-2 text-xs leading-6 text-cream/70">ساعت آموزش تخصصی فروش و مذاکره</p>
          </article>
          <article class="rounded-2xl border border-gold/35 bg-white/5 px-4 py-4">
            <p class="text-2xl font-semibold text-[#F3E5AB] sm:text-3xl"><span data-count="98" data-prefix="" data-suffix="٪">۹۸٪</span></p>
            <p class="mt-2 text-xs leading-6 text-cream/70">رضایت فارغ‌التحصیلان</p>
          </article>
          <article class="rounded-2xl border border-gold/35 bg-white/5 px-4 py-4">
            <p class="text-2xl font-semibold text-[#F3E5AB] sm:text-3xl"><span data-count="300" data-prefix="+" data-suffix="">+۳۰۰</span></p>
            <p class="mt-2 text-xs leading-6 text-cream/70">بیزنس و تیم آموزش‌دیده</p>
          </article>
        </div>
      </section>
      <article class="mt-4 rounded-[28px] border border-gold/40 bg-navy p-5 sm:p-6">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div class="min-w-0">
            <h2 class="text-lg font-semibold leading-8 text-cream">آکادمی جامع، <span class="text-gold">${toman(BUNDLE_PRICE)}</span></h2>
            ${bundleOfferCopy()}
          </div>
          <button type="button" id="buy-bundle" class="h-11 w-full shrink-0 rounded-2xl bg-cream px-5 text-sm font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">افزودن به سبد</button>
        </div>
      </article>
      <p class="mt-4 text-sm text-cream/50"><a class="text-cream/70" href="${base}/demo/">دستیار پشت خط جدا از آموزش است و از همان صفحه می‌شود باهاش کار کرد.</a></p>
    </section>
  `);
}

function aiMinutesOffer() {
  return `<section id="ai-minutes" class="scroll-mt-24 rounded-[28px] border border-gold/40 bg-navy p-5 sm:p-6">
      <h2 class="text-2xl font-semibold">تحلیل تماس تیم</h2>
      <p class="mt-3 text-sm leading-7 text-cream/70">هر ۱٬۰۰۰ دقیقه، <span class="text-gold">${toman(PRICE_PER_THOUSAND)}</span>. نوار را بکشید تا مبلغ همان مقدار را ببینید.</p>
      <div class="mt-5">
        <div class="flex items-end justify-between gap-3">
          <p class="text-3xl font-semibold" data-selected-minutes>۱٬۰۰۰ دقیقه</p>
          <p class="text-lg font-semibold text-gold" data-minute-price>${toman(PRICE_PER_THOUSAND)}</p>
        </div>
        <input id="minute-slider" type="range" min="1000" max="20000" step="1000" value="1000" aria-label="انتخاب دقیقهٔ تحلیل تماس" class="mt-4 h-2 w-full cursor-pointer accent-[#D4AF37]" />
        <div class="mt-2 flex justify-between text-xs text-cream/50">
          <span>۱٬۰۰۰ دقیقه</span>
          <span>۲۰٬۰۰۰ دقیقه</span>
        </div>
      </div>
      <button type="button" id="buy-minutes" class="mt-5 inline-flex h-12 items-center rounded-2xl bg-cream px-5 text-sm font-semibold text-navy">افزودن به سبد</button>
      <p class="mt-3 text-xs leading-6 text-cream/60">پرداخت بانکی نیست. دسترسی روی همین مرورگر می‌ماند.</p>
    </section>`;
}

export function minutesPage(base: string) {
  const target = `${base}/services/#ai-minutes`;
  return `<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="${target}"><title>دقیقهٔ هوش مصنوعی | نکس‌سل</title></head><body><p><a href="${target}">دقیقهٔ هوش مصنوعی در بخش خدمات است.</a></p></body></html>`;
}

export function demoPage(base: string) {
  return layout(base, "copilot", "دستیار | نکس‌سل", `
    <section ${revealAttrs(0)} class="rounded-[28px] bg-[#070B18] p-4 sm:p-6" data-live-demo>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs tracking-[0.16em] text-gold">پشت خط</p>
          <h1 class="mt-2 text-2xl font-semibold sm:text-3xl">دستیار</h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-cream/70">جملهٔ مشتری را بگویید یا بنویسید. دستیار اعتراض را نام می‌برد و یک جمله برای گفتن همان لحظه می‌دهد.</p>
        </div>
        <div class="rounded-3xl border border-gold/40 bg-navy px-4 py-3">
          <p class="text-xs text-cream/60">موجودی همین مرورگر</p>
          <p class="mt-1 text-2xl font-semibold text-gold"><span data-assistant-balance>۰</span> <span class="text-sm font-medium text-cream">دقیقه</span></p>
          <a href="${base}/services/#ai-minutes" class="mt-2 inline-flex text-xs text-gold">افزودن دقیقه</a>
        </div>
      </div>
      <p class="mt-4 text-sm leading-7 text-cream/70">هر پاسخ متنی ۱ دقیقه کم می‌کند. صحبت زنده، طول همان شنیدن را به دقیقهٔ بالا گرد می‌کند و کمتر از ۱ دقیقه حساب نمی‌شود.</p>
      <p data-assistant-lock class="mt-3 hidden rounded-2xl border border-gold/30 bg-white/5 px-3 py-3 text-sm leading-7">موجودی دقیقه تمام شده. تا وقتی از بخش خدمات دقیقه اضافه نکنید، دستیار جواب نمی‌دهد.</p>
      ${voiceChat()}
      <div data-counter class="mt-4 hidden rounded-3xl bg-navy p-5"></div>
    </section>
  `);
}

export function academyPage(base: string) {
  const catalog = JSON.stringify(courseCatalog()).replaceAll("<", "\\u003c");
  return layout(base, "academy", "آموزش | نکس‌سل", `
    <style>
      #course-overview {
        width: min(40rem, calc(100vw - 1.5rem));
        max-height: min(90vh, 52rem);
        margin: auto;
        padding: 0;
        border: 1px solid rgba(212, 175, 55, 0.35);
        border-radius: 1.5rem;
        background: #0B132B;
        color: #F6F1E4;
      }
      #course-overview::backdrop { background: rgba(0, 0, 0, 0.66); }
      @media (max-width: 640px) {
        #course-overview { width: 100vw; max-height: 100vh; height: 100vh; border-radius: 0; }
      }
    </style>
    <header ${revealAttrs(0)}>
      <p class="text-xs tracking-[0.16em] text-gold">مسیر مرحله‌به‌مرحله</p>
      <h1 class="mt-2 text-3xl font-semibold">آموزش</h1>
      <p class="mt-3 max-w-2xl text-sm leading-7 text-cream/70">درس اول هر مسیر بدون سبد دیده می‌شود. بقیهٔ درس‌ها بعد از افزودن به سبد باز می‌شوند. پرداخت بانکی نیست. دسترسی روی همین مرورگر می‌ماند.</p>
    </header>
    <div class="mt-6 grid gap-4 md:grid-cols-2">${academyCourseCards(base)}</div>
    ${courseOverview()}
    <script id="course-catalog" type="application/json">${catalog}</script>
  `);
}

export function copilotPage(base: string) {
  return demoPage(base);
}

export function articlesPage(base: string) {
  const cards = articles.map((article, index) => `<a ${revealAttrs(Math.min(index, 6) * 70)} href="${base}/articles/${article.slug}/" class="glass block rounded-3xl p-5">
    <p class="text-xs text-gold">${esc(article.category.fa)} · ${esc(article.readTime.fa)}</p>
    <h2 class="mt-2 text-lg font-semibold">${esc(article.title.fa)}</h2>
    <p class="mt-2 text-sm leading-7 text-cream/70">${esc(article.excerpt.fa)}</p>
  </a>`).join("");
  return layout(base, "articles", "مقالات | نکس‌سل", `<header ${revealAttrs(0)}><h1 class="text-3xl font-semibold">مقالات</h1></header><div class="mt-6 grid gap-4">${cards}</div>`);
}

export function articlePage(base: string, slug: string) {
  const article = articles.find((item) => item.slug === slug);
  if (!article) return null;
  const blocks = article.content.map((block) => {
    if (block.type === "h2") return `<h2 class="mt-6 text-xl font-semibold">${esc(block.text.fa)}</h2>`;
    if (block.type === "ul") return `<ul class="mt-3 list-disc space-y-2 pe-5 text-sm leading-7 text-cream/80">${block.items.map((item) => `<li>${esc(item.fa)}</li>`).join("")}</ul>`;
    return `<p class="mt-3 text-sm leading-8 text-cream/80">${esc(block.text.fa)}</p>`;
  }).join("");
  return layout(base, "articles", `${article.title.fa} | نکس‌سل`, `<article ${revealAttrs(0)}><a href="${base}/articles/" class="text-sm text-gold">بازگشت به مقالات</a><h1 class="mt-3 text-3xl font-semibold">${esc(article.title.fa)}</h1><p class="mt-2 text-sm text-cream/50">${esc(article.author.name.fa)} · ${esc(article.publishedAt.fa)}</p>${blocks}</article>`);
}

function serviceSelect(param: { id: string; label: string; options: Array<{ id: string; label: string }> }) {
  const options = param.options
    .map((option, index) => `<option value="${esc(option.id)}"${index === 0 ? " selected" : ""}>${esc(option.label)}</option>`)
    .join("");
  return `<label class="block text-sm">${esc(param.label)}<select data-service-param="${esc(param.id)}" class="mt-1 h-11 w-full rounded-2xl border border-white/15 bg-[#0B132B] px-3 text-sm text-cream outline-none focus:border-gold">${options}</select></label>`;
}

function serviceRateList(offer: (typeof SERVICE_OFFERS)[number]) {
  return offer.params
    .map((param) => {
      const rates = param.options.map((option) => {
        if (param.scale) return `${esc(option.label)}: جمع بقیه × ${fa.format(option.factor ?? 1)}`;
        return `${esc(option.label)} ${option.amount ? esc(toman(option.amount)) : "بدون مبلغ اضافه"}`;
      }).join("، ");
      return `<li><span class="text-cream/50">${esc(param.label)}:</span> ${rates}</li>`;
    })
    .join("");
}

export function servicesPage(base: string) {
  const model = JSON.stringify(SERVICE_OFFERS).replaceAll("<", "\\u003c");
  const cards = SERVICE_OFFERS.map((offer, index) => {
    const quote = quoteService(offer, {});
    return `<article ${revealAttrs(index * 80)} data-service-card="${esc(offer.id)}" class="glass flex flex-col rounded-3xl p-5">
      <h2 class="font-semibold">${esc(offer.title)}</h2>
      <p class="mt-2 text-sm leading-7 text-cream/70">${esc(offer.text)}</p>
      <div class="mt-4 grid gap-3">${offer.params.map(serviceSelect).join("")}</div>
      <p class="mt-4 text-2xl font-semibold text-gold" data-service-price>${toman(quote.total)}</p>
      <p class="mt-2 text-xs leading-6 text-cream/60" data-service-breakdown>${esc(serviceBreakdown(quote.lines, toman))}</p>
      <details class="mt-3 text-xs leading-6 text-cream/70">
        <summary class="cursor-pointer text-gold">جدول پارامترهای این خدمت</summary>
        <ul class="mt-2 space-y-1">${serviceRateList(offer)}</ul>
      </details>
      <button type="button" data-add-service="${esc(offer.id)}" class="mt-4 h-11 rounded-2xl bg-gold text-sm font-semibold text-navy">افزودن به سبد</button>
    </article>`;
  }).join("");
  return layout(base, "services", "خدمات | نکس‌سل", `<header ${revealAttrs(0)}><h1 class="text-3xl font-semibold">خدمات تیم فروش</h1><p class="mt-3 max-w-2xl text-sm leading-7 text-cream/70">قیمت هر خدمت جمع پارامترهای همان کارت است. کارگاه حضوری تیم فروش و منتورینگ مدیر فروش پارامتر زمان دوره دارند و مبلغ با همان زمان عوض می‌شود. تحلیل تماس تیم پایین همین صفحه با نوار دقیقه حساب می‌شود.</p></header><div class="mt-6 grid gap-4 md:grid-cols-2">${cards}</div><div class="mt-8">${aiMinutesOffer()}</div><script id="service-pricing" type="application/json">${model}</script>`);
}

function supportForm() {
  return `<p class="mt-3 max-w-2xl text-sm leading-7 text-cream/70">همین فرم تنها کانال پیام است. درخواست روی همین مرورگر می‌ماند. پاسخ واقعی از سرور نمی‌آید و تماسی برقرار نمی‌شود.</p><form data-ticket data-lenis-prevent class="glass mt-6 grid max-w-xl gap-3 rounded-3xl p-5"><label class="text-sm">موضوع<input name="title" required class="mt-1 h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-3" /></label><label class="text-sm">شرح<textarea name="body" required class="mt-1 min-h-28 w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2"></textarea></label><button class="h-11 rounded-2xl bg-gold font-semibold text-navy">ثبت تیکت</button><p data-ticket-note class="text-sm text-cream/70"></p></form>`;
}

export function supportPage(base: string) {
  return layout(base, "support", "پشتیبانی | نکس‌سل", `<header ${revealAttrs(0)}><h1 class="text-3xl font-semibold">پشتیبانی</h1>${supportForm()}</header>`);
}

export function aboutPage(base: string) {
  return layout(base, "about", "درباره ما | نکس‌سل", `<header ${revealAttrs(0)}><p class="text-xs tracking-[0.18em] text-gold">آکادمی فروش نکس‌سل</p><h1 class="mt-3 max-w-3xl text-3xl font-semibold leading-[1.45]">چهار مسیر ویدیویی فروش، با چالش پایان هر درس.</h1><p class="mt-3 max-w-2xl text-sm leading-8 text-cream/75">آنلاین، حضوری، تلفنی و مذاکره. هر مسیر ${toman(COURSE_PRICE)}. آکادمی جامع، ${toman(BUNDLE_PRICE)}. پرداخت بانکی نیست. دسترسی روی همین مرورگر می‌ماند.</p><a class="mt-5 inline-flex text-sm text-gold" href="${base}/support/">پیام از صفحهٔ پشتیبانی</a></header>`);
}

export function contactPage(base: string) {
  return layout(base, "contact", "ارتباط با ما | نکس‌سل", `<header ${revealAttrs(0)}><h1 class="text-3xl font-semibold">ارتباط، همان پشتیبانی است.</h1>${supportForm()}</header>`);
}

export function subscriptionPage(base: string) {
  const paths = categories.filter((category) => category.tierRequired === "pro").map((category, index) => {
    const count = lessonsOf(category).length;
    const enter = `${base}/learn/${category.id}/`;
    return `<article ${revealAttrs(index * 40)} class="glass flex flex-col rounded-3xl p-5" data-course="${category.id}" data-paid="yes">
      <h2 class="text-lg font-semibold">${esc(category.title.fa)}</h2>
      <p class="mt-2 flex-1 text-sm leading-7 text-cream/70">${esc(category.description.fa)}</p>
      <p class="mt-3 text-2xl font-semibold text-gold">${toman(COURSE_PRICE)}</p>
      <a href="${enter}" class="mt-3 inline-flex text-sm text-gold">دیدن ${fa.format(count)} درس</a>
      <button type="button" data-buy="${category.id}" class="mt-4 h-11 w-full rounded-2xl bg-cream text-sm font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-60">افزودن به سبد</button>
    </article>`;
  }).join("");
  return layout(base, "pricing", "قیمت | نکس‌سل", `
    <header>
      <h1 class="text-3xl font-semibold text-cream">قیمت چهار مسیر</h1>
      <p class="mt-3 max-w-2xl text-sm leading-8 text-cream">هر مسیر یک عدد کنار خودش دارد. پرداخت بانکی نیست. دسترسی روی همین مرورگر می‌ماند. درس اول هر مسیر بدون سبد دیده می‌شود.</p>
    </header>
    <div class="mt-6 grid gap-4 md:grid-cols-2">${paths}</div>
    <article class="mt-4 rounded-[28px] border border-gold/40 bg-navy p-5 sm:p-6">
      <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0">
          <h2 class="text-lg font-semibold leading-8 text-cream">آکادمی جامع، <span class="text-gold">${toman(BUNDLE_PRICE)}</span></h2>
          ${bundleOfferCopy()}
        </div>
        <button type="button" id="buy-bundle" class="h-11 w-full shrink-0 rounded-2xl bg-cream px-5 text-sm font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">افزودن به سبد</button>
      </div>
    </article>
  `);
}

const AVATARS = [
  { id: "navy", background: "#0B132B", color: "#D4AF37" },
  { id: "gold", background: "#D4AF37", color: "#0B132B" },
  { id: "ink", background: "#1C2541", color: "#F6F1E4" },
  { id: "sand", background: "#F3E5AB", color: "#0B132B" },
  { id: "pine", background: "#1F4D3A", color: "#F3E5AB" },
  { id: "wine", background: "#6E2B3A", color: "#F6F1E4" },
];

const PANEL_TABS = [
  ["overview", "پیشخوان"],
  ["profile", "پروفایل من"],
  ["courses", "دوره‌های من"],
  ["wallet", "کیف پول"],
  ["audits", "تحلیل‌های تماس من"],
  ["tickets", "تیکت‌ها"],
] as const;

function dashboardPage(base: string, initialTab = "overview") {
  const tabLink = (id: string, label: string, compact: boolean) =>
    `<a href="${base}/dashboard/?tab=${id}" data-tab-link="${id}" class="${compact ? "shrink-0 px-3 py-2" : "px-3 py-2.5"} flex items-center gap-2 rounded-2xl text-sm">${label}</a>`;
  const cards = categories.filter((category) => category.tierRequired === "pro").map((category) => `<article class="glass flex flex-col rounded-[28px] p-5" data-dash-course="${category.id}" data-lessons="${lessonsOf(category).map((row) => row.lesson.id).join(",")}">
    <div class="flex items-start justify-between gap-3"><h2 class="text-lg font-semibold">${esc(category.title.fa)}</h2><span data-lock class="rounded-full bg-white/10 px-2.5 py-1 text-[11px]">قفل</span></div>
    <p class="mt-2 text-sm text-cream/60">${toman(COURSE_PRICE)}</p>
    <p class="mt-4 text-sm text-cream/60" data-video-line>ویدیوهای دیده‌شده: ۰</p>
    <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div data-video-bar class="h-full rounded-full bg-gold" style="width:0%"></div></div>
    <p class="mt-3 text-sm text-cream/60" data-quiz-line>چالش‌های قبول‌شده: ۰</p>
    <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div data-quiz-bar class="h-full rounded-full bg-cream" style="width:0%"></div></div>
    <a data-enter="${category.id}" href="${base}/learn/${category.id}/" class="mt-5 hidden h-10 items-center justify-center rounded-2xl border-2 border-gold bg-navy px-4 text-sm font-medium text-gold">ورود به دوره و مشاهده ویدیوها</a>
    <a data-buy-link="${category.id}" href="${base}/subscription/" class="mt-5 inline-flex h-10 items-center justify-center rounded-2xl bg-cream px-4 text-sm font-medium text-navy">افزودن به سبد</a>
  </article>`).join("");
  const courseStatus = categories.filter((category) => category.tierRequired === "pro").map((category) => `<li class="flex items-center justify-between rounded-2xl border border-gold/30 px-3 py-3 text-sm" data-course-status="${category.id}"><span>${esc(category.title.fa)}</span><span data-owned-label class="text-cream/50">ثبت نشده</span></li>`).join("");
  return layout(base, "home", "پنل کاربری | نکس‌سل", `
    <div data-user-panel data-initial-tab="${esc(initialTab)}" class="lg:flex lg:items-start lg:gap-4">
      <div class="glass -mx-4 flex gap-2 overflow-x-auto px-4 py-2 lg:hidden" data-lenis-prevent>
        ${PANEL_TABS.map(([id, label]) => tabLink(id, label, true)).join("")}
          <a href="${base}/demo/" class="flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-sm">دموی دستیار</a>
      </div>
      <aside class="glass hidden w-64 shrink-0 rounded-[28px] p-4 lg:block">
        <div class="flex items-center gap-3">
          <span data-avatar class="grid size-12 shrink-0 place-items-center rounded-full text-lg font-semibold" style="background:#0B132B;color:#D4AF37">ن</span>
          <div class="min-w-0">
            <p data-account-name class="truncate text-sm font-semibold">—</p>
            <p data-phone-line class="truncate text-xs text-cream/60" dir="ltr">—</p>
          </div>
        </div>
        <p data-status-badge="short" class="mt-3 inline-flex rounded-full bg-gold px-2.5 py-1 text-[11px] font-medium text-navy">بدون دوره</p>
        <p class="mt-2 text-xs text-cream/60"><span data-minute-balance>۰</span> دقیقه کوپایلوت</p>
        <nav class="mt-5 flex flex-col gap-1">
          ${PANEL_TABS.map(([id, label]) => tabLink(id, label, false)).join("")}
          <a href="${base}/demo/" class="mt-2 flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm">دموی دستیار</a>
        </nav>
        <button type="button" data-sign-out class="mt-4 w-full rounded-2xl px-3 py-2 text-start text-sm text-cream/70 ring-1 ring-white/15">خروج از حساب</button>
      </aside>
      <div class="mt-4 min-w-0 flex-1 lg:mt-0">
        <section data-tab="overview" class="view active space-y-4">
          <section class="rounded-[28px] bg-navy p-6 ring-1 ring-gold/30">
            <p class="text-xs tracking-[0.16em] text-gold">پنل کاربری</p>
            <h1 class="mt-2 text-2xl font-semibold sm:text-3xl"><span data-hello>سلام</span> <span data-profile-name>—</span></h1>
            <p class="mt-3 text-sm text-cream/70">موبایل: <span data-phone-line dir="ltr">—</span></p>
            <div class="mt-5 flex flex-wrap items-center gap-2">
              <span data-status-badge="long" class="rounded-full bg-gold px-3 py-1 text-xs font-medium text-navy">هنوز دسترسی آزمایشی ثبت نشده</span>
            </div>
          </section>
          <div class="grid gap-3 sm:grid-cols-3">
            <article class="glass rounded-[24px] p-4"><p class="text-sm text-cream/60">دوره‌های فعال</p><p class="mt-3 text-2xl font-semibold" data-owned-count>۰</p><p class="mt-1 text-xs text-cream/50" data-owned-hint>از ۴ دوره تخصصی</p></article>
            <article class="glass rounded-[24px] p-4"><p class="text-sm text-cream/60">دقیقهٔ تحلیل تماس</p><p class="mt-3 text-2xl font-semibold" data-minute-balance>۰</p><p class="mt-1 text-xs text-cream/50" data-minute-hint>جدا از دوره</p></article>
            <article class="glass rounded-[24px] p-4"><p class="text-sm text-cream/60">کش‌بک تومانی</p><p class="mt-3 text-2xl font-semibold" data-cashback>۰</p><p class="mt-1 text-xs text-cream/50">۵٪ دسترسی آزمایشی همین مرورگر</p></article>
          </div>
          <section class="glass rounded-[28px] p-5">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 class="text-lg font-semibold">وضعیت دوره‌ها</h2>
              <a href="${base}/subscription/" class="inline-flex h-10 items-center justify-center rounded-2xl bg-gold px-4 text-sm font-medium text-navy">صفحهٔ قیمت</a>
            </div>
            <ul class="mt-4 grid gap-2 sm:grid-cols-2">${courseStatus}</ul>
          </section>
        </section>
        <section data-tab="profile" class="view">
          <form data-profile-form class="glass space-y-5 rounded-[28px] p-6">
            <div><p class="text-xs tracking-[0.16em] text-gold">پروفایل من</p><h1 class="mt-2 text-2xl font-semibold">اطلاعات و پروفایل من</h1></div>
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span data-avatar class="grid size-20 place-items-center rounded-full text-2xl font-semibold" style="background:#0B132B;color:#D4AF37">ن</span>
              <div>
                <p class="text-sm font-medium">انتخاب تصویر</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  ${AVATARS.map((item) => `<button type="button" data-avatar-pick="${item.id}" aria-label="${item.id}" class="size-8 rounded-full ring-offset-2 ring-offset-navy" style="background:${item.background}"></button>`).join("")}
                </div>
              </div>
            </div>
            <label class="block space-y-1.5 text-sm">نام و نام خانوادگی<input name="name" class="h-11 w-full rounded-2xl border border-gold/35 bg-white/5 px-3 text-sm outline-none focus:border-gold" /></label>
            <label class="block space-y-1.5 text-sm">شماره موبایل<input name="phone" dir="ltr" inputmode="tel" class="h-11 w-full rounded-2xl border border-gold/35 bg-white/5 px-3 text-left text-sm outline-none focus:border-gold" /></label>
            <label class="block space-y-1.5 text-sm">ایمیل<input name="email" dir="ltr" type="email" class="h-11 w-full rounded-2xl border border-gold/35 bg-white/5 px-3 text-left text-sm outline-none focus:border-gold" /></label>
            <label class="block space-y-1.5 text-sm">حوزه فعالیت / شغل<input name="jobTitle" class="h-11 w-full rounded-2xl border border-gold/35 bg-white/5 px-3 text-sm outline-none focus:border-gold" /></label>
            <label class="block space-y-1.5 text-sm">درباره من / بیوگرافی کاری<textarea name="bio" rows="5" placeholder="تجربه فروش، حوزه مذاکره یا نوع مشتریانی که با آن‌ها کار می‌کنید." class="w-full rounded-2xl border border-gold/35 bg-white/5 px-3 py-3 text-sm leading-7 outline-none focus:border-gold"></textarea></label>
            <button type="submit" class="h-11 rounded-2xl bg-gold px-5 text-sm font-medium text-navy">ذخیره تغییرات</button>
            <p data-profile-note class="text-sm text-cream/70" role="status"></p>
          </form>
        </section>
        <section data-tab="courses" class="view space-y-4">
          <div>
            <p class="text-xs tracking-[0.16em] text-gold">دوره‌های من</p>
            <h1 class="mt-2 text-2xl font-semibold">وضعیت دسترسی آزمایشی</h1>
            <p class="mt-1 text-sm text-cream/60" dir="ltr" data-phone-line>—</p>
            <p class="mt-2 text-sm leading-7 text-cream/60">هر مسیر ${toman(COURSE_PRICE)}. آکادمی جامع، ${toman(BUNDLE_PRICE)}.</p>
          </div>
          <article class="rounded-[28px] bg-navy p-5 ring-1 ring-gold/30" data-bundle-card>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-lg font-semibold">آکادمی جامع</h2>
              <span data-bundle-label class="rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-navy">آکادمی جامع، ${toman(BUNDLE_PRICE)}</span>
            </div>
            ${bundleOfferCopy()}
            <button type="button" id="buy-bundle" data-bundle-buy class="mt-4 inline-flex h-11 items-center rounded-2xl bg-cream px-4 text-sm font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-60">افزودن به سبد</button>
          </article>
          <div class="grid gap-3 sm:grid-cols-2">${cards}</div>
        </section>
        <section data-tab="wallet" class="view space-y-4">
          <section class="rounded-[28px] bg-navy p-6 ring-1 ring-gold/30">
            <p class="text-xs tracking-[0.16em] text-gold">کیف دقیقه</p>
            <h1 class="mt-2 text-2xl font-semibold">کیف پول دقایق کوپایلوت هوش مصنوعی</h1>
            <p class="mt-6 text-4xl font-semibold text-gold"><span data-minute-balance>۰</span> <span class="text-lg font-medium text-cream">دقیقه</span></p>
            <p class="mt-3 text-sm leading-7 text-cream/70" data-wallet-lead>تحلیل تماس تیم جدا از دوره است.</p>
            <a href="${base}/services/#ai-minutes" class="mt-5 inline-flex h-12 items-center rounded-2xl bg-gold px-5 text-sm font-semibold text-navy">تحلیل تماس تیم در خدمات</a>
          </section>
          <section class="glass rounded-[28px] p-6">
            <p class="text-xs tracking-[0.16em] text-gold">وفاداری تومانی</p>
            <h2 class="mt-2 text-xl font-semibold">کش‌بک جمع‌شده</h2>
            <p class="mt-4 text-3xl font-semibold"><span data-cashback>۰</span> <span class="text-lg font-medium">تومان</span></p>
            <p class="mt-3 text-sm leading-7 text-cream/60">با هر دسترسی آزمایشی دوره یا دقیقه، ۵٪ از همان مبلغ به کش‌بک همین مرورگر اضافه می‌شود. پرداخت بانکی نیست.</p>
          </section>
          <section class="glass rounded-[28px] p-6">
            <p class="text-sm text-cream/60">اعتبار تومانی حساب</p>
            <p class="mt-1 text-3xl font-semibold"><span data-wallet-balance>۰</span> <span class="text-lg font-medium">تومان</span></p>
            <button type="button" data-deposit-open class="mt-5 h-11 rounded-2xl bg-gold px-5 text-sm font-medium text-navy">افزایش آزمایشی موجودی همین مرورگر</button>
          </section>
          <section class="glass overflow-hidden rounded-[28px]">
            <h2 class="px-5 pt-5 text-lg font-semibold">تراکنش‌ها</h2>
            <div class="overflow-x-auto px-2 pb-4">
              <table class="w-full min-w-[28rem] text-sm">
                <thead><tr class="text-cream/50"><th class="px-3 py-3 text-start font-medium">تراکنش‌ها</th><th class="px-3 py-3 text-start font-medium">مبلغ</th><th class="px-3 py-3 text-start font-medium">تاریخ</th></tr></thead>
                <tbody data-tx-body></tbody>
              </table>
              <p data-tx-empty class="px-3 text-sm text-cream/50">هنوز تراکنشی ثبت نشده است.</p>
            </div>
          </section>
        </section>
        <section data-tab="audits" class="view space-y-4">
          <div><h1 class="text-2xl font-semibold">تحلیل‌های تماس من</h1><p class="mt-2 text-sm leading-7 text-cream/60">تماسی اینجا ثبت نشده است. ضبط تازه فقط در دموی دستیار است و بدون تأیید ذخیره نمی‌شود.</p><a class="mt-4 inline-flex text-sm text-gold" href="${base}/demo/">رفتن به دموی دستیار</a></div>
        </section>
        <section data-tab="tickets" class="view space-y-4">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div><h1 class="text-2xl font-semibold">تیکت‌ها و پشتیبانی</h1><p class="mt-2 text-sm leading-7 text-cream/60">تیکت روی همین مرورگر می‌ماند. پاسخ واقعی از سرور نمی‌آید و تماسی برقرار نمی‌شود.</p></div>
            <a href="#new-ticket" class="inline-flex h-11 items-center rounded-2xl bg-gold px-4 text-sm font-medium text-navy">ثبت تیکت جدید</a>
          </div>
          <div data-live-tickets class="grid gap-3"></div>
          <p data-ticket-empty class="text-sm text-cream/50">هنوز تیکتی روی همین مرورگر نیست.</p>
          <form id="new-ticket" data-panel-ticket class="glass grid gap-3 rounded-[28px] p-5">
            <label class="text-sm">موضوع<input name="title" required class="mt-1 h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-3" /></label>
            <button class="h-11 rounded-2xl bg-gold font-semibold text-navy">ثبت تیکت</button>
            <p data-ticket-note class="text-sm text-cream/70" role="status"></p>
          </form>
        </section>
      </div>
    </div>
    <div data-deposit class="fixed inset-0 z-50 hidden items-center justify-center bg-black/60 p-4">
      <div class="w-full max-w-md rounded-3xl bg-navy p-5 text-cream ring-1 ring-gold/40" role="dialog" aria-modal="true" aria-labelledby="deposit-title">
        <h2 id="deposit-title" class="text-lg font-semibold">شارژ آزمایشی کیف پول</h2>
        <p class="mt-2 text-sm text-cream/70">مبلغ را انتخاب کنید. پرداخت واقعی انجام نمی‌شود.</p>
        <div class="mt-4 grid gap-2">
          ${[200000, 500000, 1000000].map((amount) => `<button type="button" data-deposit-amount="${amount}" class="h-11 rounded-2xl border border-gold/40 text-sm">${toman(amount)}</button>`).join("")}
        </div>
        <div class="mt-4 flex gap-2">
          <button type="button" data-deposit-confirm class="h-11 flex-1 rounded-2xl bg-gold text-sm font-medium text-navy">افزودن به کیف پول</button>
          <button type="button" data-deposit-close class="h-11 rounded-2xl px-4 text-sm ring-1 ring-white/20">بستن</button>
        </div>
      </div>
    </div>
    <p data-panel-note class="sr-only" role="status"></p>
  `);
}

export { dashboardPage };

function findCategory(id: string) {
  return categories.find((category) => category.id === id) ?? null;
}

export function learnCategoryPage(base: string, id: string) {
  const category = findCategory(id);
  if (!category) return null;
  const rows = lessonsOf(category);
  return layout(base, "academy", `${category.title.fa} | نکس‌سل`, `
    <header ${revealAttrs(0)}>
    <p class="text-xs text-gold">${category.tierRequired === "free" ? "آموزش رایگان" : toman(COURSE_PRICE)}</p>
    <h1 class="mt-2 text-3xl font-semibold">${esc(category.title.fa)}</h1>
    <p class="mt-3 text-sm leading-7 text-cream/70">${esc(category.description.fa)}</p>
    </header>
    <div class="mt-4" data-course="${category.id}">
      ${category.tierRequired === "pro" ? `<p class="mb-3 text-sm leading-7 text-cream/70">پرداخت بانکی نیست. دسترسی روی همین مرورگر می‌ماند.</p><button type="button" data-buy="${category.id}" class="h-11 rounded-2xl bg-cream px-4 text-sm font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-60">افزودن به سبد</button>` : ""}
    </div>
    <ol class="mt-6 space-y-3">${rows.map((row, index) => `<li ${revealAttrs(Math.min(index, 6) * 50)} class="glass rounded-2xl px-4 py-3"><a href="${base}/learn/${category.id}/${row.lesson.id}/" class="font-semibold">${fa.format(index + 1)}. ${esc(row.lesson.title.fa)}</a><p class="mt-1 text-xs text-cream/60">${esc(row.lesson.summary.fa)}</p>${category.tierRequired === "pro" && index === 0 ? `<p class="mt-1 text-xs text-gold">این درس بدون سبد دیده می‌شود.</p>` : ""}</li>`).join("")}</ol>
  `);
}

export function learnLessonPage(base: string, categoryId: string, lessonId: string) {
  const category = findCategory(categoryId);
  if (!category) return null;
  const row = lessonsOf(category).find((item) => item.lesson.id === lessonId);
  if (!row) return null;
  const preview = category.tierRequired === "pro" && lessonsOf(category)[0]?.lesson.id === row.lesson.id;
  const quiz = row.lesson.quiz.slice(0, 3).map((question, qIndex) => `<fieldset class="rounded-2xl border border-white/10 p-3" data-answer="${question.answer}">
    <legend class="px-1 text-sm font-semibold">${esc(question.prompt.fa)}</legend>
    ${question.options.map((option, oIndex) => `<label class="mt-2 flex items-center gap-2 text-sm"><input type="radio" name="q${qIndex}" value="${oIndex}" class="accent-gold" /><span>${esc(option.fa)}</span></label>`).join("")}
  </fieldset>`).join("");
  return layout(base, "academy", `${row.lesson.title.fa} | نکس‌سل`, `
    <header ${revealAttrs(0)}><a href="${base}/learn/${category.id}/" class="text-sm text-gold">بازگشت به ${esc(category.title.fa)}</a>
    <h1 class="mt-3 text-2xl font-semibold sm:text-3xl">${esc(row.lesson.title.fa)}</h1></header>
    <p class="mt-2 text-sm leading-7 text-cream/70">${esc(row.lesson.summary.fa)}</p>
    <div ${revealAttrs(80)} class="mt-4 aspect-video overflow-hidden rounded-2xl bg-black" data-course-gate="${category.id}" data-free="${category.tierRequired === "free" ? "yes" : "no"}" data-preview="${preview ? "yes" : "no"}">
      <iframe class="h-full w-full" title="ویدیوی آپارات" allowfullscreen data-aparat="${esc(row.lesson.aparat)}"></iframe>
      <p data-locked class="grid h-full place-items-center p-6 text-center text-sm">برای دیدن این درس، همین مسیر را به سبد اضافه کنید.</p>
    </div>
    <form ${revealAttrs(140)} data-quiz data-lesson="${esc(row.lesson.id)}" class="mt-5 space-y-3">
      <label class="flex items-center gap-2 text-sm"><input name="watched" type="checkbox" class="size-4 accent-gold" /> ویدیو را دیدم</label>
      ${quiz}
      <button type="submit" class="h-11 rounded-2xl bg-gold px-4 text-sm font-semibold text-navy">ثبت چالش</button>
      <p data-quiz-result class="text-sm"></p>
    </form>
  `);
}

function authTabs(base: string, mode: "login" | "register") {
  const item = (id: "login" | "register", href: string, label: string) =>
    `<a href="${base}${href}" class="flex h-11 items-center justify-center rounded-2xl text-sm ${mode === id ? "bg-gold font-semibold text-navy" : "text-cream/80 ring-1 ring-gold/30"}">${label}</a>`;
  return `<div class="grid grid-cols-2 gap-2">${item("login", "/login/", "ورود آزمایشی")}${item("register", "/register/", "عضویت آزمایشی")}</div>`;
}

function otpFields() {
  return `<div data-auth-otp class="hidden space-y-4">
    <p class="text-sm leading-7 text-cream/80">کد تایید برای <span data-auth-sent-phone dir="ltr" class="font-semibold text-gold"></span> ارسال شد. این ارسال نمادین است و پیامک واقعی نمی‌رود.</p>
    <div>
      <p class="mb-3 text-sm font-medium">کد تایید پیامکی</p>
      <div dir="ltr" class="flex justify-between gap-2">
        ${[0, 1, 2, 3, 4].map((index) => `<input data-otp-digit inputmode="numeric" autocomplete="${index === 0 ? "one-time-code" : "off"}" aria-label="رقم ${fa.format(index + 1)} کد تایید" maxlength="${index === 0 ? 5 : 1}" class="h-14 min-w-0 flex-1 rounded-2xl border border-gold/40 bg-white/5 text-center text-xl outline-none focus:border-gold" />`).join("")}
      </div>
    </div>
    <p class="text-xs leading-6 text-cream/60">ورود آزمایشی: هر کد ۵ رقمی قبول است، مثلاً ۱۲۳۴۵. این کد پلن یا پرداختی فعال نمی‌کند.</p>
    <div class="flex items-center justify-between gap-3 text-sm">
      <span data-otp-timer dir="ltr" class="font-mono text-base tabular-nums text-gold">01:59</span>
      <button type="button" data-otp-resend disabled class="text-gold disabled:opacity-40">ارسال دوباره</button>
    </div>
  </div>`;
}

const authField = "mt-1 h-12 w-full rounded-2xl border border-gold/35 bg-white/5 px-3 text-sm outline-none focus:border-gold";

export function loginPage(base: string) {
  return layout(base, "home", "ورود | نکس‌سل", `
    <form data-auth="login" class="glass mx-auto w-full max-w-[420px] space-y-4 rounded-[28px] p-6 sm:p-8">
      ${authTabs(base, "login")}
      <div>
        <p class="text-xs tracking-[0.18em] text-gold">ورود آزمایشی</p>
        <h1 class="mt-2 text-2xl font-semibold">ورود آزمایشی</h1>
        <p class="mt-2 text-sm leading-7 text-cream/70">شماره موبایل را وارد کنید. کد پنج‌رقمی فقط بعد از تایید شماره، به‌صورت نمادین، روی همین صفحه می‌آید. پیامک واقعی نمی‌رود.</p>
      </div>
      <label class="block text-sm">شماره موبایل<input data-auth-phone name="phone" dir="ltr" inputmode="tel" autocomplete="tel" placeholder="09xxxxxxxxx" class="${authField} text-left" /></label>
      <button type="button" data-auth-request class="h-12 w-full rounded-2xl bg-gold text-sm font-medium text-navy">تایید شماره و دریافت کد</button>
      ${otpFields()}
      <button type="button" data-auth-finish class="hidden h-12 w-full rounded-2xl bg-gold text-sm font-medium text-navy">ورود آزمایشی</button>
      <button type="button" data-auth-edit class="hidden text-sm text-cream/70">ویرایش شماره</button>
      <p data-auth-note class="text-sm text-cream/80" role="status"></p>
      <a href="${base}/register/" class="block text-sm text-gold">حساب کاربری ندارید؟ ثبت‌نام کنید</a>
    </form>
  `);
}

export function registerPage(base: string) {
  return layout(base, "home", "عضویت | نکس‌سل", `
    <form data-auth="register" class="glass mx-auto w-full max-w-[420px] space-y-4 rounded-[28px] p-6 sm:p-8">
      ${authTabs(base, "register")}
      <div>
        <p class="text-xs tracking-[0.18em] text-gold">عضویت آزمایشی</p>
        <h1 class="mt-2 text-2xl font-semibold">عضویت آزمایشی</h1>
        <p class="mt-2 text-sm leading-7 text-cream/70">حساب آکادمی روی همین مرورگر می‌ماند. کد تایید بعد از تایید شماره، نمادین است و پلن فعال نمی‌کند.</p>
      </div>
      <label class="block text-sm">نام و نام خانوادگی<input name="name" autocomplete="name" class="${authField}" /></label>
      <label class="block text-sm">شماره موبایل<input data-auth-phone name="phone" dir="ltr" inputmode="tel" autocomplete="tel" placeholder="09xxxxxxxxx" class="${authField} text-left" /></label>
      <label class="block text-sm">حوزه فعالیت / شغل<input name="jobTitle" class="${authField}" /></label>
      <button type="button" data-auth-request class="h-12 w-full rounded-2xl bg-gold text-sm font-medium text-navy">تایید شماره و دریافت کد</button>
      ${otpFields()}
      <label data-auth-terms class="hidden items-start gap-3 text-sm"><input name="terms" type="checkbox" class="mt-1 size-4 accent-gold" /><span>قوانین و مقررات را می‌پذیرم</span></label>
      <button type="button" data-auth-finish class="hidden h-12 w-full rounded-2xl bg-gold text-sm font-medium text-navy">ثبت‌نام و ورود</button>
      <button type="button" data-auth-edit class="hidden text-sm text-cream/70">ویرایش شماره</button>
      <p data-auth-note class="text-sm text-cream/80" role="status"></p>
      <a href="${base}/login/" class="block text-sm text-gold">قبلاً ثبت‌نام کرده‌اید؟ ورود به حساب</a>
    </form>
  `);
}

export function progressPage(base: string) {
  return layout(base, "academy", "پیشرفت | نکس‌سل", `<section ${revealAttrs(0)}><h1 class="text-3xl font-semibold">درصد پیشرفت</h1><p class="mt-4 text-4xl font-semibold text-gold" data-progress-percent>۰٪</p><p class="mt-2 text-sm text-cream/70"><span data-progress-done>۰</span> چالش از <span data-progress-total>${fa.format(categories.reduce((sum, category) => sum + lessonsOf(category).length, 0))}</span> درس</p><a class="mt-6 inline-flex text-gold" href="${base}/academy/">ادامهٔ مسیر</a></section>`);
}

export function profilePage(base: string) {
  return dashboardPage(base, "profile");
}

export function notFoundPage(base: string) {
  return layout(base, "home", "پیدا نشد | نکس‌سل", `<section ${revealAttrs(0)}><h1 class="text-3xl font-semibold">این صفحه پیدا نشد.</h1><a class="mt-4 inline-flex text-gold" href="${base}/">بازگشت به خانه</a></section>`);
}

export function answerCounter(text: string, variant = 0) {
  return counterFor(text, variant);
}

export function categoryIds() {
  return categories.map((category) => category.id);
}

export function lessonPairs() {
  return categories.flatMap((category) => lessonsOf(category).map((row) => ({ category: category.id, lesson: row.lesson.id })));
}

export function articleSlugs() {
  return articles.map((article) => article.slug);
}

export type PageCategory = Category;
