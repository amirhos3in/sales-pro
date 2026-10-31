import { articleFilters, articles, type Article, type ArticleBlock } from "@/lib/articles";
import { OBJECTIONS, counterFor } from "@/lib/copilot/playbook";
import { categories, findCategory, lessonsOf, type Category } from "@/lib/courses-data";
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
  ["/assistant/", "دستیار", "copilot"],
  ["/articles/", "مقالات", "articles"],
  ["/services/", "خدمات", "services"],
  ["/support/", "پشتیبانی", "support"],
  ["/about/", "درباره ما", "about"],
  ["/contact/", "ارتباط با ما", "contact"],
] as const;

export function layout(base: string, active: string, title: string, body: string, head = "") {
  const href = (path: string) => `${base}${path}`;
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl" class="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23D4AF37'/%3E%3C/svg%3E" />
  ${head}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700;900&display=swap" rel="stylesheet" />
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
    [hidden] { display: none !important; }
    a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, summary:focus-visible {
      outline: 2px solid #D4AF37;
      outline-offset: 3px;
    }
    summary::-webkit-details-marker { display: none; }
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
    [data-quote-scroller] {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      scrollbar-width: none;
      overscroll-behavior-x: contain;
      -webkit-overflow-scrolling: touch;
    }
    [data-quote-scroller]::-webkit-scrollbar { display: none; }
    [data-quote-card] { flex: 0 0 100%; scroll-snap-align: start; }
    @media (min-width: 1024px) {
      [data-quote-card] { flex-basis: calc((100% - 1rem) / 2); }
    }
    @media (min-width: 1280px) {
      [data-quote-card] { flex-basis: calc((100% - 2rem) / 3); }
    }
    [data-impact-stars] [data-star] { color: rgba(246, 241, 228, 0.28); }
    [data-impact-stars] [data-star][data-on="yes"] {
      color: #D4AF37;
      filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.55));
    }
    @media (prefers-reduced-motion: reduce) {
      [data-reveal] { opacity: 1; transform: none; filter: none; transition: none; }
      [data-voice-toggle][data-state="recording"] [data-voice-pulse] { animation: none; }
      [data-quote-scroller] { scroll-behavior: auto; }
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
        <a data-auth-guest href="${href("/login/")}" class="rounded-full px-3 py-1.5 text-xs ring-1 ring-gold/30">ورود</a>
        <a data-auth-user="chip" href="${href("/dashboard/")}" class="items-center gap-2 rounded-full py-1 ps-1 pe-3 text-xs ring-1 ring-gold/30 sm:text-sm" hidden>
          <span data-header-letter class="grid size-7 place-items-center rounded-full bg-gold text-xs font-bold text-navy">ن</span>
          <span data-header-name class="max-w-28 truncate">کاربر</span>
        </a>
        <button type="button" data-menu class="rounded-xl px-3 py-2 text-sm ring-1 ring-gold/30 md:hidden">منو</button>
      </div>
    </div>
    <div data-mobile-nav data-lenis-prevent class="hidden max-h-[70vh] overflow-y-auto border-t border-white/10 px-4 py-3 md:hidden">
      <button type="button" data-open-cart class="block w-full rounded-xl px-3 py-2 text-start text-sm text-cream/80">سبد خرید <span data-cart-count>۰</span></button>
      <a data-auth-guest href="${href("/login/")}" class="block rounded-xl px-3 py-2 text-sm text-cream/80">ورود</a>
      <div data-auth-user="menu" class="mb-2 border-b border-white/10 pb-2" hidden>
        <p class="px-3 py-2 text-sm font-semibold"><span data-header-name>کاربر</span></p>
        <a href="${href("/dashboard/")}" class="block rounded-xl px-3 py-2 text-sm text-cream/80">پنل کاربری</a>
        <button type="button" data-sign-out class="block w-full rounded-xl px-3 py-2 text-start text-sm text-cream/70">خروج از حساب</button>
      </div>
      ${NAV.map(([path, label]) => `<a href="${href(path)}" class="block rounded-xl px-3 py-2 text-sm text-cream/80">${label}</a>`).join("")}
    </div>
  </header>
  <main class="mx-auto w-full max-w-6xl px-4 py-8">${body}</main>
  <footer class="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
    <p class="text-xs leading-6 text-cream/50">نکس‌سل، آموزش ویدیویی فروش با چالش پایان هر درس.</p>
    <nav aria-label="همکاری سازمانی" class="grid gap-2 text-sm">
      <p class="text-xs text-gold">همکاری و قرارداد</p>
      <a class="text-cream/80" href="${href("/contact/")}">ارتباط با ما</a>
      <a class="text-cream/80" href="${href("/services/")}">خدمات تیم فروش</a>
    </nav>
    <nav aria-label="پشتیبانی کاربران" class="grid gap-2 text-sm">
      <p class="text-xs text-gold">پشتیبانی و سؤال‌های رایج</p>
      <a class="text-cream/80" href="${href("/support/")}">مرکز پشتیبانی</a>
      <a class="text-cream/80" href="${href("/support/#faq")}">سؤال‌های رایج</a>
    </nav>
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
        <h2 id="checkout-title" class="text-xl font-semibold">ثبت سفارش</h2>
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
        <button type="submit" class="h-12 w-full rounded-2xl bg-gold text-sm font-semibold text-navy">ثبت سفارش</button>
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

const ACADEMY_PATHS = [
  {
    id: "telefoni",
    title: "آموزش فروش تلفنی",
    text: "تکنیک‌های ۳۰ ثانیه طلایی، عبور مقتدرانه از گیت‌کیپر و سناریوهای تماس سرد بدون رد شدن عجولانه.",
    visual: "academy-phone.webp",
    alt: "هدست تیره کنار کارت هولوگرام طلایی و موج صدا",
    step: "فروش تلفنی",
    note: "ورود به مکالمه و ۳۰ ثانیه اول",
  },
  {
    id: "online",
    title: "آموزش فروش آنلاین",
    text: "تبدیل فالوور و لید چت به خریدار قطعی، نگه‌داشت حرارت دایرکت و سناریوهای پیگیری بدون ایجاد حس مزاحمت.",
    visual: "academy-online.webp",
    alt: "گوشی شیشه‌ای تیره با حباب گفتگو و حلقه‌های قیف طلایی",
    step: "فروش آنلاین",
    note: "مدیریت دایرکت و حفظ گرمای چت",
  },
  {
    id: "hozuri",
    title: "آموزش فروش حضوری",
    text: "تسلط بر اتمسفر جلسه، زبان بدن مقتدرانه و بستن قرارداد در همان جلسه بدون نیاز به تخفیف‌های عجیب.",
    visual: "academy-meet.webp",
    alt: "میز تیره با منشور هندسی و صفحهٔ نورانی طلایی",
    step: "فروش حضوری",
    note: "کنترل جلسه و بستن رو در رو",
  },
  {
    id: "mozakerah",
    title: "آموزش مذاکره حرفه‌ای",
    text: "استراتژی امتیازدهی مشروط، خلع سلاح اعتراض «قیمت بالاست» و تکنیک‌های بستن فرضی.",
    visual: "academy-negotiate.webp",
    alt: "ترازوی فلزی تیره با دو مکعب و هستهٔ نورانی طلایی",
    step: "اصول مذاکره",
    note: "مدیریت امتیاز و قراردادهای بزرگ",
  },
] as const;

function academyCourseCards(base: string) {
  return ACADEMY_PATHS.map((path, index) => {
    const category = findCategory(path.id);
    if (!category) return "";
    const rows = lessonsOf(category);
    const minutes = rows.reduce((sum, row) => sum + row.lesson.minutes, 0);
    const first = rows[0]?.lesson.id;
    const enter = first ? `${base}/learn/${category.id}/${first}/` : `${base}/learn/${category.id}/`;
    const syllabus = rows.map((row, lessonIndex) => {
      const href = `${base}/learn/${category.id}/${row.lesson.id}/`;
      const mark = lessonIndex === 0
        ? `<span class="shrink-0 rounded-full bg-gold/15 px-2 py-1 text-[11px] font-semibold text-gold">رایگان برای تست</span>`
        : `<span class="shrink-0 text-[11px] text-cream/45">ادامهٔ مسیر</span>`;
      return `<li><a href="${href}" class="flex items-start justify-between gap-3 rounded-2xl px-2 py-2 text-sm leading-7 hover:bg-white/5"><span><span class="text-gold">${fa.format(lessonIndex + 1)}.</span> ${esc(row.lesson.title.fa)}</span>${mark}</a></li>`;
    }).join("");
    return `<article id="course-${path.id}" ${revealAttrs(index * 60)} class="flex scroll-mt-24 flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#070B18]" data-course-card="${category.id}" data-paid="yes" data-card-mode="locked">
      <div class="relative aspect-video overflow-hidden border-b border-white/10 bg-[#070B18] shadow-[inset_0_0_48px_rgba(212,175,55,0.16)]">
        <img src="${base}/present/${path.visual}" width="1280" height="720" alt="${esc(path.alt)}" class="h-full w-full object-cover" />
      </div>
      <div class="flex flex-1 flex-col p-5">
        <ul class="flex flex-wrap gap-2 text-[11px] text-cream/70">
          <li class="rounded-full border border-white/10 px-2.5 py-1">مقدماتی تا پیشرفته</li>
          <li class="rounded-full border border-white/10 px-2.5 py-1">${durationLabel(minutes)}</li>
          <li class="rounded-full border border-white/10 px-2.5 py-1">ویدیو + کوییز تعاملی</li>
        </ul>
        <h2 class="mt-4 text-xl font-semibold">${esc(path.title)}</h2>
        <p class="mt-2 text-sm leading-7 text-cream/75">${esc(path.text)}</p>
        <details class="academy-syllabus mt-4 border-t border-white/10 pt-3">
          <summary class="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold">
            <span>سرفصل‌های منتخب</span>
            <svg class="academy-chev size-4 shrink-0 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </summary>
          <ol class="mt-2">${syllabus}</ol>
        </details>
        <div class="mt-4 border-t border-white/10 pt-4">
          <div data-card-price><p class="text-2xl font-semibold text-gold">${toman(COURSE_PRICE)}</p></div>
          <div data-card-progress class="hidden">
            <div class="flex items-center justify-between gap-2 text-xs">
              <p data-card-fraction>۰ از ${fa.format(rows.length)} درس تکمیل‌شده</p>
              <span data-card-status="learning" class="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-gold">در حال یادگیری</span>
              <span data-card-status="done" class="hidden shrink-0 rounded-full bg-gold px-2 py-0.5 text-navy">تکمیل‌شده</span>
            </div>
            <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true"><div data-card-bar class="h-full rounded-full bg-gold" style="width:0%"></div></div>
          </div>
          <div class="mt-3 grid gap-2">
            <a data-card-start data-start-href="${enter}" data-start-label="مشاهده سرفصل‌ها و شروع درس اول" href="${enter}" class="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-l from-[#F3E5AB] to-gold px-4 text-center text-sm font-semibold text-navy">مشاهده سرفصل‌ها و شروع درس اول</a>
            <button type="button" data-card-buy data-buy="${category.id}" class="h-11 rounded-2xl border border-white/10 text-sm">افزودن به سبد</button>
          </div>
        </div>
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
        <p class="mt-4 text-sm font-medium text-gold">درس اول هر مسیر بدون سبد دیده می‌شود. بقیهٔ درس‌ها بعد از افزودن همان مسیر به سبد باز می‌شوند. چالش هر درس با دو پاسخ درست از سه سؤال قبول می‌شود.</p>
        <ol data-ov-lessons class="mt-3 space-y-2"></ol>
      </div>
      <div class="border-t border-white/10 p-5">
        <button type="button" data-buy data-ov-buy class="h-12 w-full rounded-2xl bg-gold text-sm font-semibold text-navy">افزودن به سبد</button>
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
    <p class="text-2xl font-semibold text-gold" dir="ltr">+۳۴٪</p>
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
      href: `${base}/assistant/`,
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

const IMPACT_STAR = `<svg viewBox="0 0 24 24" class="size-4" fill="currentColor" aria-hidden="true"><path d="M12 2.6 14.8 8.7l6.6.8-4.8 4.5 1.3 6.5L12 17.4 6.1 20.5l1.3-6.5L2.6 9.5l6.6-.8L12 2.6z"/></svg>`;

function academyImpact(base: string) {
  const before = [
    "قطع تماس‌های سرد توسط منشی‌ها در کمتر از ۱۵ ثانیه",
    "دادن تخفیف سریع و عجولانه در مواجهه با اعتراض «قیمت بالاست»",
    "جلسات حضوری طولانی که با «بررسی می‌کنیم تماس می‌گیریم» بی‌نتیجه می‌مانند",
    "پیگیری‌های پیامکی اصرارگونه که ارزش برند را پایین می‌آورد",
  ];
  const after = [
    "قلاب‌های ۱۵ ثانیه‌ای هدفمند برای عبور مقتدرانه از گیت‌کیپر",
    "دفاع از ارزش محصول و تکنیک‌های مهار اعتراض به قیمت بدون باختن حاشیه سود",
    "بستن قطعی جلسه با تعیین گام بعدی شفاف و زمان‌بندی‌شده",
    "سناریوهای پیگیری ارزش‌محور که احساس پیگیری مشاوره‌ای ایجاد می‌کنند",
  ];
  const mark = (tone: "before" | "after") => tone === "before"
    ? `<svg viewBox="0 0 24 24" class="mt-1 size-4 shrink-0 text-rose-200/70" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke-linecap="round"/></svg>`
    : `<svg viewBox="0 0 24 24" class="mt-1 size-4 shrink-0 text-gold" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12.5 9.2 17 19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const column = (tone: "before" | "after", title: string, items: string[]) => `<article class="rounded-[1.75rem] p-5 ${tone === "before" ? "border border-rose-200/25 bg-[#070B18]" : "border border-gold bg-[#070B18] shadow-[0_0_36px_rgba(212,175,55,0.16)]"}">
    <h3 class="text-lg font-semibold">${title}</h3>
    <ul class="mt-4 grid gap-3">${items.map((item) => `<li class="flex items-start gap-2 text-sm leading-7 text-cream/80">${mark(tone)}<span>${item}</span></li>`).join("")}</ul>
  </article>`;
  const quotes = [
    ["ع", "#0B132B", "#D4AF37", "علیرضا کریمی", "مدیر فروش تجهیزات پزشکی", "قبل از نکس‌سل، تیم ما همیشه در جلسه دوم به بعد به بن‌بست می‌خورد و مشتریان سر قیمت چک‌وچانه می‌زدند. سناریوهای بستن جلسه حضوری باعث شد بدون تخفیف‌های عجیب، قراردادها را در همان جلسه دوم نهایی کنیم."],
    ["س", "#D4AF37", "#0B132B", "سارا منصوری", "سرپرست فروش تلفنی (خدمات B2B)", "بزرگ‌ترین دردسر ما تماس سرد بود. منشی‌ها یا قطع می‌کردند یا می‌گفتند رزومه بفرستید. تکنیک قلاب تماس باعث شد میانگین زمان مکالمه بچه‌ها از ۲۰ ثانیه به ۳ دقیقه برسد."],
    ["م", "#1C2541", "#F6F1E4", "مهدی سلطانی", "مدیر بازرگانی قطعات صنعتی", "دستیار صوتی و سناریوهای اعتراض به قیمت مثل یک آچارفرانسه برای تیم ما بودند. قبلاً فروشنده‌های جدید تا ۲ ماه ضرر می‌زدند، الان در هفته اول مسلط مکالمه می‌کنند."],
    ["ن", "#F3E5AB", "#0B132B", "نیما پرویزی", "بنیان‌گذار استارتاپ خدمات دیجیتال", "سیستم پیگیری پیامکی و دایرکتی نکس‌سل دقیقاً همان گره کوری بود که لیدهای ما در آن گیر می‌کردند. نرخ تبدیل دایرکت‌ها بیش از دو برابر رشد کرد."],
  ] as const;
  const quoteCards = quotes.map(([letter, bg, fg, name, role, text]) => `<article data-quote-card class="flex h-auto flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
    <p class="flex gap-0.5 text-gold" aria-label="۵ از ۵">${IMPACT_STAR.repeat(5)}</p>
    <blockquote class="mt-4 flex-1 text-sm leading-8 text-cream/85">${esc(text)}</blockquote>
    <footer class="mt-5 flex items-center gap-3">
      <span class="grid size-12 shrink-0 place-items-center rounded-full text-sm font-bold" style="background:${bg};color:${fg}" aria-hidden="true">${letter}</span>
      <div>
        <p class="text-sm font-semibold">${esc(name)}</p>
        <p class="text-xs leading-6 text-cream/60">${esc(role)}</p>
      </div>
    </footer>
  </article>`).join("");
  const stars = [1, 2, 3, 4, 5].map((value) => `<button type="button" role="radio" data-star="${value}" aria-checked="false" aria-label="${fa.format(value)} از ۵" class="grid size-10 place-items-center rounded-full">${IMPACT_STAR.replace('class="size-4"', 'class="size-6"')}</button>`).join("");
  return `<section class="relative mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#070B18] p-5 sm:p-7" aria-label="اثر آکادمی" data-impact>
    <div class="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
    <p class="text-xs tracking-[0.18em] text-gold">اثر آکادمی</p>
    <h2 class="mt-2 text-2xl font-semibold">قبل و بعد از نکس‌سل</h2>
    <div class="mt-5 grid gap-4 lg:grid-cols-2">
      ${column("before", "فروش سنتی و بدون ساختار", before)}
      ${column("after", "سیستم فروش مدرن نکس‌سل", after)}
    </div>
    <h2 class="mt-8 text-xl font-semibold">بنچ‌مارک‌ها و نتایج کلیدی بازار</h2>
    <div class="mt-4 grid gap-4 lg:grid-cols-2">
      <article class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
        <h3 class="text-lg font-semibold">تیم‌های بازرگانی و فروش سازمانی</h3>
        <p class="mt-3 text-sm leading-8 text-cream/75">کوتاه شدن چرخه مذاکره و تصمیم‌گیری مشتریان شرکتی از ۴ هفته به زیر ۱۰ روز با سناریوهای مهار بهانه‌ها و بستن فرضی.</p>
      </article>
      <article class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
        <h3 class="text-lg font-semibold">مراکز تماس و فروشگاه‌های تخصصی</h3>
        <p class="mt-3 text-sm leading-8 text-cream/75">افزایش نرخ تبدیل لیدهای تماس سرد به پیش‌فاکتور با استفاده از سناریوی بازنویسی‌شده مکالمه در ۳۰ ثانیه ابتدایی.</p>
      </article>
    </div>
    <h2 class="mt-8 text-xl font-semibold">شاخص‌های اثرگذاری</h2>
    <div class="mt-4 grid gap-3 md:grid-cols-3">
      <article class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
        <svg viewBox="0 0 24 24" class="size-6 text-gold" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 14c2.2-1 3.4-3.2 4.2-6.2.6 2.2 2 3.6 4.2 4.2C10.2 13 8.4 14.2 6.8 16.4 6 15.2 5.2 14.4 4 14z"/><path d="M12 13.2c1.6-3.4 3.6-5.2 7-6.2-1 3.4-2.8 5.4-6.2 7L12 13.2z" stroke-linejoin="round"/></svg>
        <p class="mt-4 flex items-baseline gap-2 text-3xl font-semibold text-[#F3E5AB]"><span dir="ltr" data-count="3.2" data-decimals="1">۳٫۲</span><span class="text-xl">برابر</span></p>
        <p class="mt-2 text-sm leading-7 text-cream/70">افزایش نگه‌داشت مشتری پای مکالمه در ۳۰ ثانیه اول تماس سرد</p>
      </article>
      <article class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
        <svg viewBox="0 0 24 24" class="size-6 text-gold" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 8h6l2 3 3-6 2 4h3" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 14l-3 4" stroke-linecap="round"/></svg>
        <p class="mt-4 text-3xl font-semibold text-[#F3E5AB]" dir="ltr" data-count="55" data-prefix="−" data-suffix="٪">−۵۵٪</p>
        <p class="mt-2 text-sm leading-7 text-cream/70">کاهش ریزش لیدها در مرحله اعلام قیمت و پیش‌فاکتور</p>
      </article>
      <article class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
        <svg viewBox="0 0 24 24" class="size-6 text-gold" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16" stroke-linecap="round"/></svg>
        <p class="mt-4 flex items-baseline gap-2 text-3xl font-semibold text-[#F3E5AB]"><span dir="ltr" data-count="14">۱۴</span><span class="text-xl">روز</span></p>
        <p class="mt-2 text-sm leading-7 text-cream/70">میانگین زمان تسلط تیم فروش بر سناریوهای پاسخ به اعتراضات</p>
      </article>
    </div>
    <div class="mt-8" data-impact-quotes>
      <div class="flex items-end justify-between gap-3">
        <h2 class="text-xl font-semibold">نظر تیم‌ها</h2>
        <div class="flex gap-2">
          <button type="button" data-quote-prev class="grid size-10 place-items-center rounded-full border border-white/10 text-cream" aria-label="نظر قبلی"><svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button type="button" data-quote-next class="grid size-10 place-items-center rounded-full border border-white/10 text-cream" aria-label="نظر بعدی"><svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>
      </div>
      <div class="mt-4" data-quote-scroller data-lenis-prevent tabindex="0" aria-label="اسلایدر نظرات">${quoteCards}</div>
      <div class="mt-4 flex justify-center gap-2" data-quote-dots></div>
    </div>
    <form data-impact-rate class="mt-4 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5" data-impact-stars>
      <p class="text-sm font-semibold leading-7">شما چه امتیازی به اثربخشی این سناریوها می‌دهید؟</p>
      <div class="mt-3 flex" role="radiogroup" aria-label="امتیاز اثربخشی سناریوها">${stars}</div>
      <p data-impact-rate-note class="mt-3 min-h-6 text-sm leading-7 text-gold" role="status"></p>
    </form>
    <section class="mt-4 rounded-[1.75rem] border border-gold/30 bg-gold/10 p-5 sm:p-6">
      <p class="text-lg font-semibold leading-8">آماده‌اید سیستم فروش تیم‌تان را بر پایه این نتایج بازسازی کنید؟</p>
      <div class="mt-4 flex flex-col gap-2 sm:flex-row">
        <a href="${base}/academy/" class="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-l from-[#F3E5AB] to-gold px-5 text-sm font-semibold text-navy">مشاهده دوره‌ها و سناریوهای عملیاتی</a>
        <a href="${base}/contact/#b2b" class="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 px-5 text-sm font-semibold text-cream">درخواست ارزیابی عملکرد فروش</a>
      </div>
    </section>
  </section>`;
}

export function homePage(base: string) {
  return layout(base, "home", "نکس‌سل | آکادمی فروش", `
    <section ${revealAttrs(0)} class="relative overflow-hidden rounded-[2rem] border border-gold/25 bg-[#070B18] px-6 py-16 text-center sm:px-10 sm:py-24">
      <div class="pointer-events-none absolute inset-0" style="background: radial-gradient(ellipse at center, rgba(212,175,55,0.16) 0%, transparent 70%)"></div>
      <div class="relative mx-auto flex max-w-4xl flex-col items-center">
        <p class="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs text-[#F3E5AB] shadow-[0_0_18px_rgba(212,175,55,0.18)] sm:text-sm">
          <span class="size-1.5 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]"></span>
          ✦ پلتفرم جامع مهارت، دستیار هوشمند و خدمات فروش
        </p>
        <h1 class="mt-6 text-3xl font-black leading-[1.25] text-cream sm:text-5xl lg:text-6xl">مکالمه را شما شروع کنید؛ <span class="bg-gradient-to-l from-[#F6F1E4] to-[#D4AF37] bg-clip-text text-transparent">بستن قطعی قرارداد</span> با سیستم نکس‌سل.</h1>
        <p class="mt-4 max-w-2xl text-base leading-8 text-cream/60 sm:text-lg">تلفنی، حضوری، آنلاین یا جلسات سنگین مذاکره. با آموزش‌های سناریومحور، دستیار هوش مصنوعی لحظه تماس و سیستم‌سازی تیم، نرخ تبدیل مکالمات کاری خود را افزایش دهید.</p>
        <a data-auth-guest href="${base}/login/" class="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#F3E5AB] to-gold px-8 text-sm font-semibold text-navy shadow-[0_0_24px_rgba(212,175,55,0.35)] transition hover:brightness-110">
          <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 19c1.4-3 3.6-4.5 7-4.5s5.6 1.5 7 4.5" stroke-linecap="round"/></svg>
          ورود / ثبت‌نام
        </a>
        <a data-auth-user href="${base}/assistant/" hidden class="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#F3E5AB] to-gold px-8 text-sm font-semibold text-navy shadow-[0_0_24px_rgba(212,175,55,0.35)] transition hover:brightness-110">
          <svg viewBox="0 0 24 24" class="size-4" fill="currentColor" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 10-14h-7l0-6z"/></svg>
          دسترسی سریع به دستیار هوش مصنوعی
        </a>
        <ul class="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-cream/55 sm:text-sm">
          ${["فروش تلفنی", "فروش حضوری", "فروش آنلاین", "اصول مذاکره"].map((label) => `<li class="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1"><svg viewBox="0 0 24 24" class="size-3.5 text-gold" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12.5 9.2 17 19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>${label}</li>`).join("")}
        </ul>
      </div>
    </section>
    ${productPresent(base)}
    ${offeringLanes(base)}
    <section id="courses" class="mt-8 scroll-mt-24">
      <h2 class="text-xl font-semibold">چهار مسیر فروش</h2>
      <p class="mt-2 max-w-2xl text-sm leading-7 text-cream/70">درس اول هر مسیر بدون سبد دیده می‌شود.</p>
      <div class="mt-4 grid gap-4 md:grid-cols-2">${paidHomeCards(base)}</div>
      ${academyImpact(base)}
      <article class="mt-4 rounded-[28px] border border-gold/40 bg-navy p-5 sm:p-6">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div class="min-w-0">
            <h2 class="text-lg font-semibold leading-8 text-cream">آکادمی جامع، <span class="text-gold">${toman(BUNDLE_PRICE)}</span></h2>
            ${bundleOfferCopy()}
          </div>
          <button type="button" id="buy-bundle" class="h-11 w-full shrink-0 rounded-2xl bg-cream px-5 text-sm font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">افزودن به سبد</button>
        </div>
      </article>
      <p class="mt-4 text-sm text-cream/50"><a class="text-cream/70" href="${base}/assistant/">دستیار پشت خط جدا از آموزش است و از همان صفحه می‌شود باهاش کار کرد.</a></p>
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
    </section>`;
}

export function minutesPage(base: string) {
  const target = `${base}/services/#ai-minutes`;
  return `<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="${target}"><title>دقیقهٔ هوش مصنوعی | نکس‌سل</title></head><body><p><a href="${target}">دقیقهٔ هوش مصنوعی در بخش خدمات است.</a></p></body></html>`;
}

export function demoPage(base: string) {
  const preview = [
    { id: "price", label: "قیمت بالاتر است", hear: "مشتری می‌گوید: «قیمت شما نسبت به بقیه همکاران بالاتر است!»" },
    { id: "think", label: "«باید فکر کنم»", hear: "مشتری می‌گوید: «باید فکر کنم»" },
    { id: "authority", label: "«با شریکم مشورت کنم»", hear: "مشتری می‌گوید: «با شریکم مشورت کنم»" },
  ].map((item, index) => {
    const hit = OBJECTIONS.find((row) => row.id === item.id);
    const say = hit?.lines[0] || "";
    const chip = hit?.tag || "";
    const on = index === 0;
    return `<button type="button" role="tab" data-preview-tab aria-selected="${on ? "true" : "false"}" data-hear="${esc(item.hear)}" data-say="${esc(say)}" data-chip="${esc(chip)}" class="h-10 rounded-full px-3 text-xs ${on ? "bg-gold font-semibold text-navy" : "text-cream/80 ring-1 ring-white/10"}">${esc(item.label)}</button>`;
  });
  const first = OBJECTIONS.find((row) => row.id === "price");
  const steps = [
    ["گوش دادن / تایپ لحظه‌ای", "در زمان مکالمه تلفنی یا چت، اعتراض یا بهانه مشتری نوشته یا گفته می‌شود؛ مثل «قیمت بالاست» یا «باید فکر کنم»."],
    ["محاسبه و پردازش هوشمند", "دستیار از سناریوهای آمادهٔ اعتراض، زاویهٔ پاسخ را انتخاب می‌کند و تکنیک همان بهانه را نام می‌برد."],
    ["اعلام جمله طلایی", "فروشنده همان جمله را پشت خط می‌گوید، بدون اینکه مکث طولانی وسط مکالمه بیفتد."],
  ];
  const stepIcons = [
    `<svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Z"/><path d="M19 11a7 7 0 0 1-14 0"/><path d="M12 18v3" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 3h6M9 21h6M3 9v6M21 9v6" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 7h9a4 4 0 0 1 0 8H8" stroke-linecap="round"/><path d="M8 12h8a3 3 0 0 1 0 6H6" stroke-linecap="round"/></svg>`,
  ];
  const description = "دستیار فروش پشت خط. اعتراض مشتری را بگویید تا جملهٔ همان لحظه را ببینید. دقیقه جدا از دوره‌هاست.";
  return layout(base, "copilot", "دستیار فروش | نکس‌سل", `
    <style>
      [data-preview-say] { transition: opacity 220ms ease, transform 220ms ease; }
      [data-assistant-preview].is-switching [data-preview-hear],
      [data-assistant-preview].is-switching [data-preview-say] { opacity: 0; transform: translateY(6px); }
    </style>
    <section ${revealAttrs(0)} class="grid items-center gap-6 overflow-hidden rounded-[2rem] border border-white/10 bg-[#070B18] p-5 sm:p-8 lg:grid-cols-2" data-live-demo>
      <div>
        <p class="text-xs tracking-[0.18em] text-gold">پشت خط</p>
        <h1 class="mt-3 text-3xl font-semibold leading-[1.45] sm:text-4xl">هوش مصنوعی دستیار فروش (پشت خط مکالمه)</h1>
        <p class="mt-4 text-sm leading-8 text-cream/80 sm:text-base">اعتراض که آمد، مکث تمام؛ جمله‌ی درست، دقیقاً در همان ثانیه‌ای که مشتری بهانه‌تراشی می‌کند روی صفحه ظاهر می‌شود.</p>
        <p class="mt-3 text-sm leading-7 text-cream/60">دقیقهٔ دستیار جدا از دوره‌هاست و روی همین مرورگر در لحظه فعال می‌شود.</p>
        <div class="mt-5 inline-flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <p class="text-xs text-cream/60">موجودی دقیقه</p>
          <p class="mt-1 text-2xl font-semibold text-gold"><span data-assistant-balance>۰</span> <span class="text-sm font-medium text-cream">دقیقه</span></p>
          <a href="${base}/services/#ai-minutes" class="mt-2 inline-flex text-xs text-gold">افزودن دقیقه</a>
        </div>
      </div>
      <figure class="relative">
        <div class="pointer-events-none absolute -inset-8 -z-10 rounded-full" style="background: radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)"></div>
        <img src="${base}/present/assistant-module.webp" width="1280" height="720" alt="ماژول شیشه‌ای تیره با موج صدای طلایی و کارت‌های شناور" class="w-full rounded-[1.75rem] border border-white/10 object-cover shadow-[0_0_48px_rgba(212,175,55,0.16)]" />
        <p class="absolute top-3 end-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#070B18]/80 px-3 py-1 text-[11px] text-cream backdrop-blur"><span class="size-1.5 rounded-full bg-gold" aria-hidden="true"></span>در حال آنالیز مکالمه...</p>
        <p class="absolute bottom-3 start-3 rounded-full border border-gold/40 bg-[#070B18]/80 px-3 py-1 text-[11px] text-[#F3E5AB] backdrop-blur">پاسخ بهینه آماده شد (۰.۳ ثانیه)</p>
      </figure>
    </section>
    <ul class="mt-4 grid gap-2 sm:grid-cols-3">
      <li class="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm"><span class="size-2 shrink-0 rounded-full bg-emerald-400" aria-hidden="true"></span>میکروفن فعال</li>
      <li class="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm" data-preview-chip>${esc(first?.tag || "")}</li>
      <li class="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm">زمان جلسه <span dir="ltr" class="font-semibold text-gold">۰۳:۴۲</span></li>
    </ul>
    <section class="mt-8" aria-labelledby="assistant-steps">
      <h2 id="assistant-steps" class="text-xl font-semibold">سه قدم پشت خط</h2>
      <ol class="mt-4 grid gap-3 md:grid-cols-3">
        ${steps.map(([title, text], index) => `<li class="rounded-[1.75rem] border border-white/10 bg-[#070B18] p-5">
          <span class="grid size-10 place-items-center rounded-2xl bg-gold/15 text-gold">${stepIcons[index]}</span>
          <p class="mt-4 text-xs text-gold">${fa.format(index + 1)}</p>
          <h3 class="mt-1 text-base font-semibold">${title}</h3>
          <p class="mt-2 text-sm leading-7 text-cream/70">${text}</p>
        </li>`).join("")}
      </ol>
    </section>
    <section class="mt-8 rounded-[2rem] border border-white/10 bg-[#070B18] p-5 sm:p-6" data-assistant-preview aria-labelledby="assistant-preview">
      <h2 id="assistant-preview" class="text-xl font-semibold">پیش‌نمایش پاسخ</h2>
      <p class="mt-2 text-sm leading-7 text-cream/60">این سه بهانه دقیقه کم نمی‌کند. پاسخ، همان جملهٔ آمادهٔ دستیار برای آن اعتراض است.</p>
      <div class="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="بهانه‌های نمونه">${preview.join("")}</div>
      <p data-preview-hear class="mt-5 text-sm leading-8 text-cream/80">مشتری می‌گوید: «قیمت شما نسبت به بقیه همکاران بالاتر است!»</p>
      <blockquote data-preview-say class="mt-3 rounded-[1.5rem] border border-gold/40 bg-gold/10 p-4 text-sm leading-8 text-cream shadow-[0_0_32px_rgba(212,175,55,0.12)]">${esc(first?.lines[0] || "")}</blockquote>
      <div class="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" data-preview-copy class="h-11 rounded-2xl bg-gold px-4 text-sm font-semibold text-navy">کپی سریع پاسخ</button>
        <p data-preview-copy-note class="text-sm text-gold" role="status"></p>
      </div>
    </section>
    <section class="mt-8 rounded-[2rem] border border-white/10 bg-[#070B18] p-5 sm:p-6">
      <h2 class="text-xl font-semibold">استفاده با دقیقهٔ خودتان</h2>
      <p class="mt-3 text-sm leading-7 text-cream/70">هر پاسخ متنی ۱ دقیقه کم می‌کند. صحبت زنده، طول همان شنیدن را به دقیقهٔ بالا گرد می‌کند و کمتر از ۱ دقیقه حساب نمی‌شود.</p>
      <p data-assistant-lock class="mt-3 hidden rounded-2xl border border-gold/30 bg-white/5 px-3 py-3 text-sm leading-7">موجودی دقیقه تمام شده. تا وقتی از بخش خدمات دقیقه اضافه نکنید، دستیار جواب نمی‌دهد.</p>
      ${voiceChat()}
      <div data-counter class="mt-4 hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5"></div>
    </section>
  `, `<meta name="description" content="${esc(description)}" /><meta property="og:title" content="دستیار فروش | نکس‌سل" /><meta property="og:description" content="${esc(description)}" /><meta property="og:locale" content="fa_IR" />`);
}

export function academyPage(base: string) {
  const catalog = JSON.stringify(courseCatalog()).replaceAll("<", "\\u003c");
  const savePercent = Math.round((BUNDLE_SAVE / BUNDLE_LIST_PRICE) * 100);
  const steps = ACADEMY_PATHS.map((path, index) => `<li class="min-w-[13.5rem] flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
    <a href="#course-${path.id}" class="block">
      <span class="grid size-8 place-items-center rounded-full bg-gold text-sm font-bold text-navy">${fa.format(index + 1)}</span>
      <p class="mt-3 text-sm font-semibold">${esc(path.step)}</p>
      <p class="mt-1 text-xs leading-6 text-cream/60">${esc(path.note)}</p>
    </a>
  </li>`).join("");
  const description = "چهار مسیر تخصصی فروش تلفنی، آنلاین، حضوری و مذاکره. هر درس ویدیو و کوییز دارد و درس اول بدون سبد باز است.";
  return layout(base, "academy", "آکادمی عملیاتی فروش نکس‌سل", `
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
      .academy-syllabus .academy-chev { transition: transform 280ms ease; }
      .academy-syllabus[open] .academy-chev { transform: rotate(180deg); }
      .academy-syllabus::details-content {
        height: 0;
        overflow: hidden;
        opacity: 0;
        transition: height 280ms ease, opacity 280ms ease, content-visibility 280ms allow-discrete;
      }
      .academy-syllabus[open]::details-content {
        height: auto;
        opacity: 1;
      }
    </style>
    <header ${revealAttrs(0)} class="overflow-hidden rounded-[2rem] border border-white/10 bg-[#070B18] px-5 py-8 sm:px-8">
      <p class="text-xs tracking-[0.18em] text-gold">آکادمی</p>
      <h1 class="mt-3 text-3xl font-semibold leading-[1.45] sm:text-4xl">آکادمی عملیاتی فروش نکس‌سل</h1>
      <p class="mt-3 max-w-3xl text-sm leading-8 text-cream/75 sm:text-base">چهار مسیر تخصصی بدون اتلاف وقت و اضافه‌گویی؛ هر درس همراه با ویدیوی کاربردی و کوییز سناریومحور برای تثبیت مهارت.</p>
      <ol class="mt-6 flex gap-3 overflow-x-auto pb-1" data-lenis-prevent aria-label="مسیر پیشرفت">${steps}</ol>
    </header>
    <div class="mt-6 grid gap-4 md:grid-cols-2">${academyCourseCards(base)}</div>
    <section class="mt-6 rounded-[2rem] border border-gold bg-[#070B18] p-5 shadow-[0_0_42px_rgba(212,175,55,0.16)] sm:p-7">
      <p class="inline-flex rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-[#F3E5AB]">پیشنهاد اقتصادی و کامل (۴ دوره در ۱ پکیج)</p>
      <h2 class="mt-4 text-2xl font-semibold">پکیج جامع ۴ مسیر فروش نکس‌سل</h2>
      <p class="mt-3 max-w-3xl text-sm leading-8 text-cream/75">دسترسی یکجا به دوره‌های آنلاین، حضوری، تلفنی و مذاکره. هر درس ویدیوی همان مهارت را دارد و با کوییز سناریومحور تمام می‌شود.</p>
      <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-8">
        <p class="text-sm text-cream/60">قیمت تکی دوره‌ها: <span class="line-through decoration-cream/40">${toman(BUNDLE_LIST_PRICE)}</span></p>
        <p class="text-sm">قیمت خرید یکجا: <span class="text-2xl font-semibold text-gold">${toman(BUNDLE_PRICE)}</span> <span class="text-cream/70">(${fa.format(savePercent)}٪ صرفه‌جویی اقتصادی)</span></p>
      </div>
      <ul class="mt-5 grid gap-2 text-sm leading-7 text-cream/80 sm:grid-cols-3">
        <li class="rounded-2xl border border-white/10 px-3 py-3">۴ دوره جامع و کاربردی</li>
        <li class="rounded-2xl border border-white/10 px-3 py-3">هر درس ویدیو و کوییز سناریومحور دارد</li>
        <li class="rounded-2xl border border-white/10 px-3 py-3">درس اول هر مسیر بدون سبد باز است</li>
      </ul>
      <button type="button" id="buy-bundle" class="mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-l from-[#F3E5AB] to-gold px-5 text-sm font-semibold text-navy">ثبت‌نام پکیج جامع با تخفیف ${fa.format(BUNDLE_SAVE / 1_000_000)} میلیونی</button>
    </section>
    <section class="mt-6" aria-labelledby="quiz-method">
      <h2 id="quiz-method" class="text-xl font-semibold">روش تمرین و کوییز</h2>
      <div class="mt-4 grid gap-3 md:grid-cols-3">
        <article class="rounded-[1.75rem] border border-white/10 bg-[#070B18] p-5">
          <h3 class="text-base font-semibold">آزمون‌های سناریومحور</h3>
          <p class="mt-2 text-sm leading-7 text-cream/70">هر درس سه سؤال از موقعیت همان مکالمه دارد، نه از تعریف‌های حفظی.</p>
        </article>
        <article class="rounded-[1.75rem] border border-white/10 bg-[#070B18] p-5">
          <h3 class="text-base font-semibold">شرط قبولی چالش</h3>
          <p class="mt-2 text-sm leading-7 text-cream/70">دو پاسخ درست از سه سؤال، چالش همان درس را قبول می‌کند. ویدیوی درس‌های بعدی بعد از افزودن همان مسیر به سبد باز می‌شود.</p>
        </article>
        <article class="rounded-[1.75rem] border border-white/10 bg-[#070B18] p-5">
          <h3 class="text-base font-semibold">پیشرفت روی همین مرورگر</h3>
          <p class="mt-2 text-sm leading-7 text-cream/70">تماشا و قبولی چالش در همین مرورگر می‌ماند و درصدش در پنل کاربری دیده می‌شود.</p>
        </article>
      </div>
    </section>
    <p class="mt-6 text-sm text-cream/60"><a class="text-gold" href="${base}/learn/free/">آموزش‌های رایگان</a> جدا از این چهار مسیر است.</p>
    ${courseOverview()}
    <script id="course-catalog" type="application/json">${catalog}</script>
  `, `<meta name="description" content="${esc(description)}" /><meta property="og:title" content="آکادمی عملیاتی فروش نکس‌سل" /><meta property="og:description" content="${esc(description)}" /><meta property="og:locale" content="fa_IR" />`);
}

export function copilotPage(base: string) {
  return demoPage(base);
}

function articleArt(kind: Article["visual"]) {
  const glow = `<defs><radialGradient id="g-${kind}" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#D4AF37" stop-opacity="0.28"/><stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/></radialGradient></defs><rect width="320" height="320" fill="#070B18"/><circle cx="160" cy="150" r="120" fill="url(#g-${kind})"/>`;
  const scenes: Record<Article["visual"], string> = {
    hook: `${glow}<rect x="138" y="92" width="44" height="78" rx="16" fill="none" stroke="#D4AF37" stroke-width="3"/><path d="M146 110h28M150 162c8 18 22 18 28 0" fill="none" stroke="#F6F1E4" stroke-width="2"/><path d="M118 132c-16 8-22 28-14 44M202 132c16 8 22 28 14 44" fill="none" stroke="#D4AF37" stroke-width="2"/>`,
    closes: `${glow}<path d="M70 210 V120 q40-50 50 0 V210" fill="none" stroke="#D4AF37" stroke-width="3"/><path d="M135 210 V100 q40-60 50 0 V210" fill="none" stroke="#F6F1E4" stroke-width="3"/><path d="M200 210 V120 q40-50 50 0 V210" fill="none" stroke="#D4AF37" stroke-width="3"/><path d="M58 214h204" stroke="#D4AF37" stroke-opacity="0.45"/>`,
    price: `${glow}<path d="M70 150h70l20-28 20 28h70" fill="none" stroke="#D4AF37" stroke-width="3"/><circle cx="118" cy="188" r="26" fill="none" stroke="#F6F1E4" stroke-width="3"/><circle cx="202" cy="176" r="18" fill="none" stroke="#D4AF37" stroke-width="3"/><path d="M160 122 V86" stroke="#F3E5AB" stroke-width="3"/><circle cx="160" cy="76" r="6" fill="#D4AF37"/>`,
    proof: `${glow}<rect x="58" y="96" width="110" height="128" rx="16" fill="none" stroke="#D4AF37" stroke-width="3"/><path d="M78 132h70M78 154h52" stroke="#F6F1E4" stroke-opacity="0.8"/><rect x="168" y="124" width="96" height="64" rx="14" fill="#D4AF37" fill-opacity="0.16" stroke="#F3E5AB"/><text x="216" y="162" text-anchor="middle" fill="#F6F1E4" font-size="18" font-family="Vazirmatn, Tahoma, sans-serif">قیمت</text>`,
    room: `${glow}<rect x="78" y="150" width="164" height="18" rx="4" fill="#D4AF37" fill-opacity="0.85"/><rect x="96" y="168" width="10" height="42" fill="#F6F1E4" fill-opacity="0.7"/><rect x="214" y="168" width="10" height="42" fill="#F6F1E4" fill-opacity="0.7"/><rect x="108" y="118" width="36" height="28" rx="8" fill="none" stroke="#F3E5AB"/><rect x="176" y="118" width="36" height="28" rx="8" fill="none" stroke="#D4AF37"/><rect x="124" y="70" width="72" height="40" rx="6" fill="none" stroke="#D4AF37" stroke-opacity="0.45"/>`,
    status: `${glow}<rect x="78" y="92" width="168" height="36" rx="10" fill="none" stroke="#D4AF37"/><rect x="78" y="142" width="168" height="36" rx="10" fill="none" stroke="#F6F1E4" stroke-opacity="0.8"/><rect x="78" y="192" width="168" height="36" rx="10" fill="none" stroke="#D4AF37" stroke-opacity="0.7"/><circle cx="104" cy="110" r="6" fill="#D4AF37"/><path d="M98 160h12M110 160l-6 8" stroke="#F3E5AB" stroke-width="2"/><path d="M98 210 l8 8 M106 210 l-8 8" stroke="#D4AF37" stroke-width="2"/>`,
    trade: `${glow}<path d="M78 132h120" stroke="#D4AF37" stroke-width="3"/><path d="M184 120 l16 12 l-16 12" fill="none" stroke="#D4AF37" stroke-width="3"/><path d="M242 188 H122" stroke="#F6F1E4" stroke-width="3"/><path d="M136 176 l-16 12 l16 12" fill="none" stroke="#F6F1E4" stroke-width="3"/><circle cx="96" cy="132" r="16" fill="none" stroke="#F3E5AB"/><rect x="214" y="170" width="28" height="28" rx="6" fill="none" stroke="#D4AF37"/>`,
    funnel: `${glow}<path d="M78 78h164l-28 48H106z" fill="#D4AF37" fill-opacity="0.18" stroke="#D4AF37"/><path d="M106 138h108l-22 42H128z" fill="none" stroke="#F6F1E4"/><path d="M128 192h64l-14 36h-36z" fill="#D4AF37" fill-opacity="0.45" stroke="#F3E5AB"/>`,
  };
  return `<svg viewBox="0 0 320 320" overflow="hidden" class="h-full w-full" role="img" aria-hidden="true">${scenes[kind]}</svg>`;
}

function articleBlocks(blocks: ArticleBlock[]) {
  return blocks.map((block) => {
    if (block.type === "h2") return `<h2 class="mt-10 text-xl font-semibold text-cream">${esc(block.text.fa)}</h2>`;
    if (block.type === "h3") return `<h3 class="mt-6 text-lg font-semibold text-[#F3E5AB]">${esc(block.text.fa)}</h3>`;
    if (block.type === "ul") {
      return `<ul class="mt-4 space-y-2 pe-5 text-base leading-8 text-cream/80">${block.items.map((item) => `<li class="list-disc">${esc(item.fa)}</li>`).join("")}</ul>`;
    }
    if (block.type === "checklist") {
      return `<section class="mt-6 rounded-3xl border border-gold/30 bg-white/5 p-5"><h2 class="text-base font-semibold text-gold">${esc(block.title.fa)}</h2><ul class="mt-3 space-y-2">${block.items.map((item) => `<li class="flex items-start gap-2 text-sm leading-7 text-cream/85"><svg viewBox="0 0 24 24" class="mt-1 size-4 shrink-0 text-gold" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12.5 9.2 17 19 7" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${esc(item.fa)}</span></li>`).join("")}</ul></section>`;
    }
    if (block.type === "note") {
      return `<aside class="mt-6 rounded-3xl border border-gold/40 bg-gold/10 p-5"><p class="text-sm font-semibold text-gold">${esc(block.title.fa)}</p><p class="mt-2 text-sm leading-8 text-cream/85">${esc(block.text.fa)}</p></aside>`;
    }
    return `<p class="mt-4 text-base leading-9 text-cream/85">${esc(block.text.fa)}</p>`;
  }).join("");
}

function articlePreview(article: Article) {
  if (!article.related.lessonId) return false;
  const category = findCategory(article.related.courseId);
  if (!category) return false;
  return lessonsOf(category)[0]?.lesson.id === article.related.lessonId;
}

function articleCta(base: string, article: Article) {
  const courseHref = `${base}/learn/${article.related.courseId}/`;
  const lessonHref = article.related.lessonId ? `${base}/learn/${article.related.courseId}/${article.related.lessonId}/` : courseHref;
  const preview = articlePreview(article);
  const href = preview ? lessonHref : courseHref;
  const label = preview ? article.related.lessonCta.fa : article.related.courseCta.fa;
  const lessonAttr = article.related.lessonId ? ` data-lesson="${esc(article.related.lessonId)}" data-preview="${preview ? "yes" : "no"}"` : "";
  return `<a data-article-cta data-course="${esc(article.related.courseId)}"${lessonAttr} data-lesson-label="${esc(article.related.lessonCta.fa)}" data-course-label="${esc(article.related.courseCta.fa)}" href="${href}" class="inline-flex h-12 items-center justify-center rounded-2xl bg-gold px-5 text-sm font-semibold text-navy">${esc(label)}</a>`;
}

function articleMeta(title: string, description: string) {
  return `<meta name="description" content="${esc(description)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:locale" content="fa_IR" />
  <meta property="og:type" content="article" />`;
}

export function articlesPage(base: string) {
  const filters = articleFilters.map((filter, index) => `<button type="button" data-article-filter="${esc(filter.id)}" aria-pressed="${index === 0 ? "true" : "false"}" class="h-10 rounded-full px-4 text-sm ${index === 0 ? "bg-gold font-semibold text-navy" : "text-cream/80 ring-1 ring-gold/30"}">${esc(filter.label)}</button>`).join("");
  const cards = articles.map((article) => `<article data-article-card data-category="${esc(article.category.fa)}" data-visual="${esc(article.visual)}" class="overflow-hidden rounded-[1.75rem] border border-gold/25 bg-[#070B18] shadow-[0_0_40px_rgba(212,175,55,0.07)] sm:aspect-square">
    <a href="${base}/articles/${article.slug}/" class="flex h-full flex-col rounded-[1.75rem] sm:relative">
      <div class="aspect-square w-full shrink-0 sm:absolute sm:inset-0">${articleArt(article.visual)}</div>
      <div class="flex flex-1 flex-col gap-2 p-4 sm:relative sm:z-10 sm:mt-auto sm:bg-gradient-to-t sm:from-[#070B18] sm:via-[#070B18]/95 sm:to-transparent sm:pt-24">
        <div class="flex flex-wrap items-center gap-2 text-xs text-cream/70">
          <span class="rounded-full border border-gold/40 px-2 py-1 text-[#F3E5AB]">${esc(article.category.fa)}</span>
          <span>${esc(article.readTime.fa)}</span>
        </div>
        <h2 class="text-base font-semibold leading-7 text-cream sm:line-clamp-3">${esc(article.title.fa)}</h2>
        <p class="text-sm leading-7 text-cream/70 sm:line-clamp-2">${esc(article.excerpt.fa)}</p>
        <span class="mt-auto inline-flex pt-2 text-sm font-semibold text-gold">خواندن مقاله</span>
      </div>
    </a>
  </article>`).join("");
  const description = "یادداشت‌های فروش تلفنی، حضوری، آنلاین و مذاکره. هر مقاله یک روش را باز می‌کند و به درس مرتبط وصل است.";
  return layout(base, "articles", "مقالات | نکس‌سل", `
    <header>
      <p class="text-xs tracking-[0.18em] text-gold">نکس‌سل</p>
      <h1 class="mt-3 text-3xl font-semibold text-cream sm:text-4xl">مقالات</h1>
      <p class="mt-3 max-w-2xl text-sm leading-8 text-cream/70 sm:text-base">${description}</p>
      <div class="mt-6 flex flex-wrap gap-2" role="group" aria-label="دسته‌بندی مقاله‌ها">${filters}</div>
    </header>
    <div data-article-grid class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">${cards}</div>
    <p data-article-empty class="mt-8 text-sm text-cream/70" hidden>در این دسته مقاله‌ای نیست.</p>
  `, articleMeta("مقالات | نکس‌سل", description));
}

export function articlePage(base: string, slug: string) {
  const article = articles.find((item) => item.slug === slug);
  if (!article) return null;
  const related = articles.filter((item) => item.slug !== article.slug && item.category.fa === article.category.fa).concat(
    articles.filter((item) => item.slug !== article.slug && item.category.fa !== article.category.fa),
  ).slice(0, 3);
  const relatedCards = related.map((item) => `<a href="${base}/articles/${item.slug}/" class="rounded-2xl border border-gold/25 bg-[#070B18] p-4">
    <p class="text-xs text-gold">${esc(item.category.fa)} · ${esc(item.readTime.fa)}</p>
    <p class="mt-2 text-sm font-semibold leading-7">${esc(item.title.fa)}</p>
  </a>`).join("");
  const title = `${article.title.fa} | نکس‌سل`;
  return layout(base, "articles", title, `
    <article class="mx-auto max-w-3xl">
      <nav aria-label="مسیر" class="text-sm text-cream/60">
        <ol class="flex flex-wrap items-center gap-2">
          <li><a class="text-gold" href="${base}/">خانه</a></li>
          <li aria-hidden="true">/</li>
          <li><a class="text-gold" href="${base}/articles/">مقالات</a></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" class="text-cream/80">${esc(article.title.fa)}</li>
        </ol>
      </nav>
      <header class="mt-6">
        <div class="flex flex-wrap items-center gap-2 text-sm text-cream/70">
          <span class="rounded-full border border-gold/40 px-2 py-1 text-[#F3E5AB]">${esc(article.category.fa)}</span>
          <span>${esc(article.readTime.fa)}</span>
        </div>
        <h1 class="mt-4 text-3xl font-semibold leading-[1.45] text-cream sm:text-4xl">${esc(article.title.fa)}</h1>
        <p class="mt-3 text-sm text-cream/55">${esc(article.author.name.fa)} · ${esc(article.publishedAt.fa)}</p>
      </header>
      <div class="mt-6 aspect-square overflow-hidden rounded-[1.75rem] border border-gold/25 bg-[#070B18] sm:aspect-[16/9]">${articleArt(article.visual)}</div>
      <div class="mt-2">${articleBlocks(article.content)}</div>
      <div class="mt-10 rounded-[1.75rem] border border-gold/35 bg-[#070B18] p-5 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <p class="text-sm leading-7 text-cream/75">همین مهارت را در دوره مرتبط ادامه دهید.</p>
        <div class="mt-4 sm:mt-0 sm:shrink-0">${articleCta(base, article)}</div>
      </div>
      <div class="mt-8 flex flex-wrap gap-3 text-sm">
        <a class="text-gold" href="${base}/articles/">بازگشت به مقالات</a>
      </div>
      <section class="mt-8" aria-labelledby="related-articles">
        <h2 id="related-articles" class="text-lg font-semibold">مقاله‌های مرتبط</h2>
        <div class="mt-3 grid gap-3 sm:grid-cols-3">${relatedCards}</div>
      </section>
    </article>
  `, articleMeta(title, article.excerpt.fa));
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

const fieldClass = "mt-1 h-12 w-full rounded-2xl border border-white/15 bg-[#0B132B] px-3 text-sm text-cream outline-none focus:border-gold";

export function aboutPage(base: string) {
  const values = [
    ["نتیجه بر جایگاه", "تمرکز روی بستن فاکتور است، نه اصطلاحات دهان‌پرکن.", `<path d="M4 16V8M9 16V4M14 16v-5M19 16V6" stroke-linecap="round"/>`],
    ["سناریوی بومی", "تکنیک‌ها برای رفتار واقعی خریدار در بازار ایران نوشته شده‌اند.", `<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/>`],
    ["همراهی هوشمند", "دستیار در لحظهٔ چالش، سرنخ جواب را می‌دهد.", `<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3"/>`],
  ];
  const cards = values.map(([title, text, icon]) => `<article class="rounded-3xl border border-white/10 bg-white/5 p-5">
    <span class="grid size-11 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold"><svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${icon}</svg></span>
    <h2 class="mt-4 text-lg font-semibold">${title}</h2>
    <p class="mt-2 text-sm leading-7 text-cream/75">${text}</p>
  </article>`).join("");
  const description = "نکس‌سل آموزش موقعیت‌محور، سناریوی بازار ایران، دستیار مکالمه و منتورینگ میدانی را کنار هم می‌گذارد.";
  return layout(base, "about", "درباره ما | نکس‌سل", `
    <section class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#070B18] px-5 py-10 sm:px-10 sm:py-14">
      <div class="pointer-events-none absolute -top-16 start-0 h-56 w-56 rounded-full bg-gold/20 blur-3xl"></div>
      <div class="relative grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p class="text-xs tracking-[0.18em] text-gold">درباره نکس‌سل</p>
          <h1 class="mt-3 text-3xl font-semibold leading-[1.45] text-cream sm:text-4xl">فروش یک نظریه دانشگاهی نیست؛ مهارتی زنده زیر فشار مکالمه است.</h1>
          <p class="mt-5 text-sm leading-8 text-cream/75 sm:text-base">بیشتر دوره‌های فروش پر از انگیزه‌های لحظه‌ای و فرمول‌های ترجمه‌شده غربی هستند که در اولین مکالمه با مشتری ایرانی از کار می‌افتند. فروشندگان با تکنیک‌های حفظی پای تماس می‌نشینند و با اولین اعتراض، سردرگم می‌شوند.</p>
          <p class="mt-4 text-sm leading-8 text-cream/85 sm:text-base">ما نکس‌سل را برای حذف این فاصله ساختیم: ترکیب آموزش موقعیت‌محور، سناریوهای بومی بازار ایران، دستیار مکالمه هوش مصنوعی در حین تماس، و منتورینگ میدانی. معیار موفقیت ما نمره آزمون نیست؛ نرخ نهایی تبدیل فاکتورهای شماست.</p>
        </div>
        <div class="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#070B18] shadow-[0_0_48px_rgba(212,175,55,0.12)]">
          <img src="${base}/present/about-manifest.webp" width="1152" height="864" alt="قیف شیشه‌ای و نمودار طلایی روی صفحهٔ تیره" class="aspect-[4/3] h-auto w-full object-cover" />
        </div>
      </div>
    </section>
    <div class="mt-6 grid gap-4 md:grid-cols-3">${cards}</div>
    <section class="mt-6 rounded-[2rem] border border-gold/30 bg-[#070B18] px-5 py-8 text-center sm:px-10">
      <h2 class="text-2xl font-semibold leading-[1.5]">سیستم فروش شما در کدام مرحله گیر کرده است؟</h2>
      <a href="${base}/contact/#b2b" class="mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-gold px-6 text-sm font-semibold text-navy">ارزیابی و مشاهده خدمات</a>
    </section>
  `, `<meta name="description" content="${esc(description)}" /><meta property="og:title" content="درباره ما | نکس‌سل" /><meta property="og:description" content="${esc(description)}" /><meta property="og:locale" content="fa_IR" />`);
}

const CHANNELS = {
  phone: "",
  whatsapp: "",
  telegram: "",
  email: "",
  address: "",
};

function directHref(kind: "phone" | "whatsapp" | "telegram" | "email") {
  if (kind === "phone" && CHANNELS.phone) return `tel:${CHANNELS.phone}`;
  if (kind === "whatsapp" && CHANNELS.whatsapp) return `https://wa.me/${CHANNELS.whatsapp.replace(/\D/g, "")}`;
  if (kind === "telegram" && CHANNELS.telegram) return `https://t.me/${CHANNELS.telegram.replace(/^@/, "")}`;
  if (kind === "email" && CHANNELS.email) return `mailto:${CHANNELS.email}`;
  return "";
}

export function contactPage(base: string) {
  const kinds = ["بازنویسی اسکریپت تیم", "کارگاه حضوری", "منتورینگ مدیر فروش", "اشتراک سازمانی دستیار"];
  const options = [`<option value="" disabled selected>نوع همکاری را انتخاب کنید</option>`]
    .concat(kinds.map((label) => `<option value="${esc(label)}">${esc(label)}</option>`))
    .join("");
  const emailLine = CHANNELS.email ? `<p class="text-sm leading-7">ایمیل سازمانی: <a class="text-gold" dir="ltr" href="${esc(directHref("email"))}">${esc(CHANNELS.email)}</a></p>` : "";
  const addressLine = CHANNELS.address ? `<p class="text-sm leading-7">آدرس دفتر: ${esc(CHANNELS.address)}</p>` : "";
  const phoneLine = CHANNELS.phone ? `<p class="text-sm leading-7">تلفن قراردادها: <a class="text-gold" dir="ltr" href="${esc(directHref("phone"))}">${esc(CHANNELS.phone)}</a></p>` : "";
  const description = "درخواست همکاری سازمانی نکس‌سل برای بازنویسی اسکریپت، کارگاه حضوری، منتورینگ و اشتراک دستیار.";
  return layout(base, "contact", "ارتباط با ما | نکس‌سل", `
    <header>
      <p class="text-xs tracking-[0.18em] text-gold">همکاری سازمانی</p>
      <h1 class="mt-3 max-w-3xl text-3xl font-semibold leading-[1.45] sm:text-4xl">ارزیابی سیستم فروش و درخواست همکاری سازمانی</h1>
      <p class="mt-3 max-w-2xl text-sm leading-8 text-cream/75 sm:text-base">اگر برای بازنویسی اسکریپت تیم، کارگاه حضوری، یا مهندسی قیف فروش نیاز به همراهی دارید، اطلاعات اولیه را ثبت کنید تا در کمتر از ۴ ساعت کاری با شما هماهنگ شویم.</p>
    </header>
    <div class="mt-8 grid items-start gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
      <form id="b2b" data-b2b novalidate data-lenis-prevent class="scroll-mt-24 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_0_40px_rgba(212,175,55,0.08)] sm:p-6">
        <div class="grid gap-3">
          <label class="text-sm">نام و نام خانوادگی<input name="name" autocomplete="name" class="${fieldClass}" /></label>
          <label class="text-sm">شماره تماس مستقیم / موبایل<input name="phone" dir="ltr" inputmode="tel" autocomplete="tel" placeholder="09xxxxxxxxx" class="${fieldClass} text-left" /></label>
          <label class="text-sm">نام مجموعه یا حوزه کسب‌وکار<input name="company" autocomplete="organization" class="${fieldClass}" /></label>
          <label class="text-sm">نوع همکاری مورد نظر<select name="kind" class="${fieldClass}">${options}</select></label>
          <label class="text-sm">تعداد کارشناسان فروش تیم<input name="teamSize" inputmode="numeric" min="1" placeholder="مثلاً ۸" class="${fieldClass}" /></label>
          <label class="text-sm">توضیح کوتاه درباره وضعیت فعلی و گلوگاه فروش<textarea name="body" rows="5" class="mt-1 min-h-32 w-full rounded-2xl border border-white/15 bg-[#0B132B] px-3 py-3 text-sm leading-7 outline-none focus:border-gold"></textarea></label>
        </div>
        <button type="submit" class="mt-4 h-12 w-full rounded-2xl bg-gold text-sm font-semibold text-navy sm:w-auto sm:px-6">ثبت درخواست و هماهنگی جلسه</button>
        <p data-b2b-note class="mt-3 text-sm leading-7 text-cream/80" role="status"></p>
      </form>
      <aside class="grid gap-3">
        <section class="rounded-[1.75rem] border border-white/10 bg-[#070B18] p-5">
          <h2 class="text-lg font-semibold">امور قراردادها</h2>
          <p class="mt-3 text-sm leading-7 text-cream/75">ساعات پاسخگویی: شنبه تا چهارشنبه، ۹ تا ۱۸.</p>
          ${phoneLine}
          ${emailLine}
          ${addressLine}
        </section>
        <a href="${base}/support/" class="rounded-[1.75rem] border border-gold/30 bg-gold/10 p-5">
          <p class="text-sm leading-7 text-cream/80">دانشجوی دوره‌ها هستید یا مشکل فنی دارید؟</p>
          <p class="mt-2 text-sm font-semibold text-gold">ورود به مرکز پشتیبانی کاربران</p>
        </a>
      </aside>
    </div>
  `, `<meta name="description" content="${esc(description)}" /><meta property="og:title" content="ارتباط با ما | نکس‌سل" /><meta property="og:description" content="${esc(description)}" /><meta property="og:locale" content="fa_IR" />`);
}

export function supportPage(base: string) {
  const telegram = directHref("telegram");
  const phone = directHref("phone");
  const whatsapp = directHref("whatsapp");
  const talk = [phone, whatsapp].filter(Boolean);
  const cards = [
    {
      title: "پشتیبانی تلگرام",
      text: "پاسخگویی سریع زیر ۱۵ دقیقه.",
      href: telegram || "#ticket",
      label: telegram ? "گفتگوی تلگرام" : "ثبت موضوع تلگرام",
      external: Boolean(telegram),
      subject: "هماهنگی تلگرام",
    },
    {
      title: "پشتیبانی تلفنی و واتساپ",
      text: "ویژه مشکلات پرداخت و دسترسی.",
      href: talk[0] || "#ticket",
      label: phone ? "تماس تلفنی" : whatsapp ? "واتساپ" : "ثبت مشکل دسترسی",
      external: Boolean(talk[0]),
      subject: "مشکل پرداخت یا دسترسی",
    },
    {
      title: "ارسال تیکت سریع",
      text: "موبایل، موضوع و پیام. همین صفحه کافی است.",
      href: "#ticket",
      label: "رفتن به فرم تیکت",
      external: false,
      subject: "",
    },
  ];
  const cardHtml = cards.map((card) => `<article class="flex flex-col rounded-[1.75rem] border border-white/10 bg-[#070B18] p-5">
    <h2 class="text-lg font-semibold">${card.title}</h2>
    <p class="mt-2 flex-1 text-sm leading-7 text-cream/70">${card.text}</p>
    <a href="${card.href}" ${card.external ? `target="_blank" rel="noopener"` : `data-fill-subject="${esc(card.subject)}"`} class="mt-4 inline-flex h-12 items-center justify-center rounded-2xl bg-gold px-4 text-sm font-semibold text-navy">${card.label}</a>
  </article>`).join("");
  const faqs = [
    ["دستیار صوتی با چه پلتفرم‌ها و تماس‌هایی سازگار است؟", "دستیار روی صفحهٔ خودش در نکس‌سل کار می‌کند. جمله را می‌نویسید یا با میکروفن فارسی می‌گویید و جواب همان لحظه می‌آید. به سانترال تلفن یا نرم‌افزار تماس جدا وصل نیست."],
    ["آیا بازنویسی سناریو و خدمات منتورینگ شامل ضمانت نتیجه است؟", "ضمانت عددی فروش ندارد. خروجی، سناریو، کارگاه یا همراهی روی مکالمهٔ همان تیم است و دامنه را قبل از شروع در پیشنهاد همان خدمت می‌بینید."],
    ["نحوه تماشای ویدیوها و دسترسی به کوییزها", "از صفحهٔ آموزش وارد هر مسیر شوید. درس اول هر مسیر بدون سبد باز است. بقیهٔ درس‌ها بعد از افزودن همان مسیر به سبد دیده می‌شوند. زیر ویدیو تماشا را علامت می‌زنید و از سه سؤال، دست‌کم به دو تا درست جواب می‌دهید تا چالش آن درس قبول شود."],
  ];
  const faq = faqs.map(([q, a]) => `<details class="rounded-2xl border border-white/10 bg-[#070B18] px-4 py-3">
    <summary class="cursor-pointer text-sm font-semibold leading-7">${q}</summary>
    <p class="mt-3 text-sm leading-8 text-cream/75">${a}</p>
  </details>`).join("");
  const description = "پشتیبانی حساب، لایسنس دستیار و دوره‌های نکس‌سل.";
  return layout(base, "support", "پشتیبانی | نکس‌سل", `
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs tracking-[0.18em] text-gold">کاربران آکادمی</p>
        <h1 class="mt-3 text-3xl font-semibold leading-[1.45] sm:text-4xl">مرکز پشتیبانی و پاسخگویی نکس‌سل</h1>
        <p class="mt-3 max-w-2xl text-sm leading-8 text-cream/75 sm:text-base">دسترسی به حساب کاربری، سوالات فنی لایسنس دستیار، و راهنمایی دوره‌های آموزشی.</p>
      </div>
      <p class="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 text-sm text-emerald-200"><span class="size-2 rounded-full bg-emerald-400" aria-hidden="true"></span>کلیه سرورها و سرویس‌های دستیار آنلاین است</p>
    </header>
    <div class="mt-8 grid gap-3 md:grid-cols-3">${cardHtml}</div>
    <form id="ticket" data-support-ticket novalidate data-lenis-prevent class="scroll-mt-24 mt-6 max-w-xl rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
      <h2 class="text-lg font-semibold">تیکت سریع</h2>
      <div class="mt-4 grid gap-3">
        <label class="text-sm">موبایل<input name="phone" dir="ltr" inputmode="tel" autocomplete="tel" placeholder="09xxxxxxxxx" class="${fieldClass} text-left" /></label>
        <label class="text-sm">موضوع<input name="subject" class="${fieldClass}" /></label>
        <label class="text-sm">پیام<textarea name="body" rows="4" class="mt-1 min-h-28 w-full rounded-2xl border border-white/15 bg-[#0B132B] px-3 py-3 text-sm leading-7 outline-none focus:border-gold"></textarea></label>
      </div>
      <button type="submit" class="mt-4 h-12 w-full rounded-2xl bg-gold text-sm font-semibold text-navy sm:w-auto sm:px-6">ارسال</button>
      <p data-support-note class="mt-3 text-sm leading-7 text-cream/80" role="status"></p>
    </form>
    <section id="faq" class="mt-8 scroll-mt-24" aria-labelledby="support-faq">
      <h2 id="support-faq" class="text-xl font-semibold">سؤال‌های رایج</h2>
      <div class="mt-4 grid gap-3">${faq}</div>
    </section>
  `, `<meta name="description" content="${esc(description)}" /><meta property="og:title" content="پشتیبانی | نکس‌سل" /><meta property="og:description" content="${esc(description)}" /><meta property="og:locale" content="fa_IR" />`);
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
      <p class="mt-3 max-w-2xl text-sm leading-8 text-cream">هر مسیر یک عدد کنار خودش دارد. درس اول هر مسیر بدون سبد دیده می‌شود.</p>
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
  ["courses", "دوره‌های من"],
  ["wallet", "کیف پول و کش‌بک"],
  ["audits", "تحلیل‌های تماس"],
  ["tickets", "پشتیبانی و تیکت‌ها"],
] as const;

function dashboardPage(base: string, initialTab = "overview") {
  const tabLink = (id: string, label: string, compact: boolean) =>
    `<a href="${base}/dashboard/?tab=${id}" data-tab-link="${id}" class="${compact ? "shrink-0 px-3 py-2" : "px-3 py-2.5"} flex items-center gap-2 rounded-2xl text-sm">${label}</a>`;
  const micIcon = `<svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/><path d="M8 21h8"/></svg>`;
  const waveIcon = `<svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/></svg>`;
  const cards = categories.filter((category) => category.tierRequired === "pro").map((category) => `<article class="dash-card flex flex-col rounded-[28px] p-5" data-dash-course="${category.id}" data-lessons="${lessonsOf(category).map((row) => row.lesson.id).join(",")}">
    <div class="flex items-start justify-between gap-3"><h2 class="text-lg font-semibold">${esc(category.title.fa)}</h2><span data-lock class="rounded-full bg-white/10 px-2.5 py-1 text-[11px]">قفل</span></div>
    <p class="mt-2 text-sm leading-6 text-cream/60" data-course-summary>${esc(category.description.fa)}</p>
    <p class="mt-3 text-sm text-cream/70" data-course-price>${toman(COURSE_PRICE)}</p>
    <div data-progress-block hidden>
      <p class="text-sm text-cream/70" data-video-line>درصد تکمیل ویدیوها: ۰٪</p>
      <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div data-video-bar class="h-full rounded-full bg-gold" style="width:0%"></div></div>
      <p class="mt-3 text-sm text-cream/70" data-quiz-line>چالش‌ها و کوییزهای پاس‌شده: ۰</p>
      <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div data-quiz-bar class="h-full rounded-full bg-cream" style="width:0%"></div></div>
    </div>
    <a data-enter="${category.id}" href="${base}/learn/${category.id}/" class="mt-5 flex h-10 items-center justify-center rounded-2xl border-2 border-gold bg-navy px-4 text-sm font-medium text-gold" hidden>ورود سریع به آخرین درس</a>
    <a data-buy-link="${category.id}" href="${base}/subscription/" class="mt-5 flex h-10 items-center justify-center rounded-2xl bg-cream px-4 text-sm font-medium text-navy">فعال‌سازی دوره</a>
  </article>`).join("");
  return layout(base, "home", "پنل کاربری | نکس‌سل", `
    <style>
      .dash-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(16px); }
      #logout-dialog, #ticket-dialog {
        width: min(32rem, calc(100vw - 1.5rem));
        max-height: min(90vh, 40rem);
        margin: auto;
        overflow: auto;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 1.5rem;
        background: #070B18;
        color: #F6F1E4;
        padding: 1.25rem;
      }
      #logout-dialog::backdrop, #ticket-dialog::backdrop { background: rgba(0,0,0,0.66); }
    </style>
    <div data-user-panel data-initial-tab="${esc(initialTab)}" class="lg:flex lg:items-start lg:gap-4">
      <div class="sticky top-16 z-30 -mx-4 border-b border-white/10 bg-[#0B132B]/95 px-4 py-2 backdrop-blur lg:hidden">
        <div class="flex gap-2 overflow-x-auto" data-lenis-prevent>
          ${PANEL_TABS.map(([id, label]) => tabLink(id, label, true)).join("")}
          <a href="${base}/assistant/" class="flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-sm">دستیار</a>
        </div>
        <div class="mt-2 flex items-center gap-2">
          <span data-avatar class="grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold" style="background:#0B132B;color:#D4AF37">ن</span>
          <div class="min-w-0">
            <p data-account-name class="truncate text-sm font-semibold">کاربر</p>
            <p data-phone-line class="truncate text-xs text-cream/60" dir="ltr">—</p>
          </div>
          <a href="${base}/dashboard/?tab=profile" data-tab-link="profile" class="ms-auto shrink-0 rounded-2xl px-3 py-2 text-xs">پروفایل</a>
          <button type="button" data-sign-out class="shrink-0 rounded-2xl px-3 py-2 text-xs text-rose-400 hover:text-rose-300">خروج از حساب کاربری</button>
        </div>
      </div>
      <aside class="glass hidden w-64 shrink-0 rounded-[28px] p-3 lg:sticky lg:top-24 lg:block">
        <nav class="flex flex-col gap-1" aria-label="بخش‌های پنل">
          ${PANEL_TABS.map(([id, label]) => tabLink(id, label, false)).join("")}
          <a href="${base}/assistant/" class="mt-2 flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm">دستیار</a>
        </nav>
        <div class="mt-4 border-t border-white/10 pt-4">
          <div class="flex items-center gap-3">
            <span data-avatar class="grid size-12 shrink-0 place-items-center rounded-full text-lg font-semibold" style="background:#0B132B;color:#D4AF37">ن</span>
            <div class="min-w-0">
              <p data-account-name class="truncate text-sm font-semibold">کاربر</p>
              <p data-phone-line class="truncate text-xs text-cream/60" dir="ltr">—</p>
            </div>
          </div>
          <a href="${base}/dashboard/?tab=profile" data-tab-link="profile" class="mt-3 flex items-center rounded-2xl px-3 py-2 text-sm text-cream/80">پروفایل</a>
          <button type="button" data-sign-out class="mt-1 w-full rounded-2xl px-3 py-2 text-start text-sm text-rose-400 hover:text-rose-300">خروج از حساب کاربری</button>
        </div>
      </aside>
      <div class="mt-4 min-w-0 flex-1 lg:mt-0">
        <section data-tab="overview" class="view active space-y-4">
          <section class="rounded-[28px] bg-[#070B18] p-6 ring-1 ring-gold/30">
            <p class="text-xs tracking-[0.16em] text-gold">پیشخوان</p>
            <h1 class="mt-2 text-2xl font-semibold sm:text-3xl">سلام، <span data-profile-name>کاربر عزیز</span></h1>
            <p class="mt-3 text-sm text-cream/70">شماره همراه: <span data-phone-line dir="ltr">—</span></p>
            <a href="${base}/assistant/" class="mt-5 inline-flex h-11 items-center rounded-2xl bg-gold px-4 text-sm font-medium text-navy">ورود سریع به دستیار فروش</a>
          </section>
          <div class="grid gap-3 sm:grid-cols-2">
            <article class="dash-card rounded-[24px] p-4">
              <p class="text-sm text-cream/60">دوره‌های فعال</p>
              <p class="mt-3 text-2xl font-semibold"><span data-owned-count>۰</span> <span class="text-base font-medium text-cream/70">از ۴ دوره</span></p>
              <div class="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div data-owned-bar class="h-full rounded-full bg-gold" style="width:0%"></div></div>
              <a href="${base}/academy/" class="mt-4 inline-flex text-sm text-gold">مشاهده دوره‌های آکادمی</a>
            </article>
            <article class="dash-card rounded-[24px] p-4">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm text-cream/60">کیف دقیقه کوپایلوت</p>
                <span class="grid size-10 place-items-center rounded-2xl bg-gold/15 text-gold shadow-[0_0_24px_rgba(212,175,55,0.45)]">${micIcon}</span>
              </div>
              <p class="mt-3 text-2xl font-semibold"><span data-minute-balance>۰</span> <span class="text-base font-medium text-cream/70">دقیقه فعال</span></p>
              <a href="${base}/services/#ai-minutes" class="mt-4 inline-flex h-10 items-center rounded-2xl bg-gold px-4 text-sm font-medium text-navy">شارژ سریع دقایق</a>
            </article>
            <article class="dash-card rounded-[24px] p-4">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="text-sm text-cream/60">باشگاه وفاداری و کش‌بک</p>
                <span class="rounded-full bg-gold px-2.5 py-1 text-[11px] font-medium text-navy">۵٪ بازگشت وجه از خریدها</span>
              </div>
              <p class="mt-3 text-2xl font-semibold"><span data-cashback>۰</span> <span class="text-base font-medium text-cream/70">تومان</span></p>
              <a href="${base}/dashboard/?tab=wallet" data-tab-link="wallet" class="mt-4 inline-flex text-sm text-gold">جزئیات کیف پول</a>
            </article>
            <article class="dash-card rounded-[24px] p-4">
              <p class="text-sm text-cream/60">تیکت‌های ثبت‌شده</p>
              <p class="mt-3 text-2xl font-semibold"><span data-ticket-count>۰</span> <span class="text-base font-medium text-cream/70">تیکت ثبت‌شده</span></p>
              <a href="${base}/dashboard/?tab=tickets" data-tab-link="tickets" class="mt-4 inline-flex text-sm text-gold">مشاهده تیکت‌ها</a>
            </article>
          </div>
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
            <p class="text-xs tracking-[0.16em] text-gold">آموزش</p>
            <h1 class="mt-2 text-2xl font-semibold">دوره‌های من</h1>
            <p class="mt-2 text-sm leading-7 text-cream/60">مسیرهای فعال همین حساب، و مسیرهایی که هنوز باز نشده‌اند. هر مسیر ${toman(COURSE_PRICE)}. آکادمی جامع، ${toman(BUNDLE_PRICE)}.</p>
          </div>
          <article data-courses-empty class="dash-card rounded-[28px] p-6">
            <h2 class="text-lg font-semibold">هنوز دوره‌ای فعال نکرده‌اید</h2>
            <p class="mt-2 text-sm leading-7 text-cream/60">چهار مسیر یادگیری در آکادمی آماده است. درس اول هر مسیر بدون سبد باز است.</p>
            <a href="${base}/academy/" class="mt-5 inline-flex h-11 items-center rounded-2xl bg-gold px-4 text-sm font-medium text-navy">مشاهده چهار مسیر یادگیری</a>
          </article>
          <div data-course-active-wrap hidden>
            <h2 class="text-lg font-semibold">دوره‌های من</h2>
            <div data-course-active class="mt-3 grid gap-3 sm:grid-cols-2"></div>
          </div>
          <div data-course-locked-wrap>
            <h2 class="text-lg font-semibold">سایر دوره‌ها</h2>
            <div data-course-locked class="mt-3 grid gap-3 sm:grid-cols-2">${cards}</div>
          </div>
          <article class="rounded-[28px] bg-[#070B18] p-5 ring-1 ring-gold/30" data-bundle-card>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-lg font-semibold">آکادمی جامع</h2>
              <span data-bundle-label class="rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-navy">آکادمی جامع، ${toman(BUNDLE_PRICE)}</span>
            </div>
            ${bundleOfferCopy()}
            <button type="button" id="buy-bundle" data-bundle-buy class="mt-4 inline-flex h-11 items-center rounded-2xl bg-cream px-4 text-sm font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-60">افزودن به سبد</button>
          </article>
        </section>
        <section data-tab="wallet" class="view space-y-4">
          <div>
            <p class="text-xs tracking-[0.16em] text-gold">کیف پول</p>
            <h1 class="mt-2 text-2xl font-semibold">کیف پول و اعتبار</h1>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <article class="dash-card rounded-[28px] p-5">
              <p class="text-sm text-cream/60">اعتبار نقد و کش‌بک</p>
              <p class="mt-4 text-3xl font-semibold"><span data-wallet-balance>۰</span> <span class="text-base font-medium">تومان</span></p>
              <p class="mt-2 text-sm text-cream/70">کش‌بک خریدها: <span data-cashback>۰</span> تومان</p>
              <p class="mt-3 text-xs leading-6 text-cream/50">این دو مانده در همین مرورگر ذخیره شده‌اند و هنگام پرداخت از مبلغ سبد کم نمی‌شوند. کش‌بک، ۵٪ خرید دوره و دقیقه است.</p>
              <button type="button" data-deposit-open class="mt-5 h-11 rounded-2xl bg-gold px-5 text-sm font-medium text-navy">افزایش اعتبار</button>
            </article>
            <article class="dash-card rounded-[28px] p-5">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm text-cream/60">اعتبار زمانی دستیار</p>
                <span class="grid size-10 place-items-center rounded-2xl bg-gold/15 text-gold shadow-[0_0_24px_rgba(212,175,55,0.45)]">${micIcon}</span>
              </div>
              <p class="mt-4 text-3xl font-semibold text-gold"><span data-minute-balance>۰</span> <span class="text-base font-medium text-cream">دقیقه</span></p>
              <p class="mt-3 text-xs leading-6 text-cream/50">دقیقه‌های باقی‌مانده برای پاسخ دستیار. هر پاسخ متنی یک دقیقه از همین مانده کم می‌کند.</p>
              <a href="${base}/services/#ai-minutes" class="mt-5 inline-flex h-11 items-center rounded-2xl bg-gold px-5 text-sm font-medium text-navy">شارژ دقایق</a>
            </article>
          </div>
          <section class="dash-card overflow-hidden rounded-[28px]">
            <h2 class="px-5 pt-5 text-lg font-semibold">تاریخچه تراکنش‌ها</h2>
            <div class="overflow-x-auto px-2 pb-4" data-lenis-prevent>
              <table class="w-full min-w-[40rem] text-sm">
                <thead><tr class="text-cream/50"><th class="px-3 py-3 text-start font-medium">شناسه / عنوان تراکنش</th><th class="px-3 py-3 text-start font-medium">تاریخ و ساعت</th><th class="px-3 py-3 text-start font-medium">مبلغ</th><th class="px-3 py-3 text-start font-medium">وضعیت</th><th class="px-3 py-3 text-start font-medium">رسید</th></tr></thead>
                <tbody data-tx-body></tbody>
              </table>
              <div data-tx-empty class="px-3 py-8 text-center">
                <p class="mx-auto grid size-14 place-items-center rounded-full bg-white/5 text-gold">${waveIcon}</p>
                <p class="mt-3 text-sm text-cream/60">هنوز تراکنشی در سیستم ثبت نشده است</p>
              </div>
            </div>
          </section>
        </section>
        <section data-tab="audits" class="view space-y-4">
          <div>
            <p class="text-xs tracking-[0.16em] text-gold">دستیار</p>
            <h1 class="mt-2 text-2xl font-semibold">تحلیل‌های تماس</h1>
            <p class="mt-2 text-sm leading-7 text-cream/60">نمای تماس‌هایی که از دستیار گذشته باشند. در این مرورگر تماسی ذخیره نمی‌شود.</p>
          </div>
          <article class="dash-card rounded-[28px] px-6 py-10 text-center">
            <p class="mx-auto grid size-16 place-items-center rounded-full bg-gold/15 text-gold shadow-[0_0_28px_rgba(212,175,55,0.4)]">${micIcon}</p>
            <p class="mx-auto mt-4 max-w-md text-sm leading-7 text-cream/70">هنوز تماسی برای تحلیل ارسال نشده است. از صفحهٔ دستیار، اعتراض را بگویید یا بنویسید.</p>
            <a href="${base}/assistant/" class="mt-5 inline-flex h-11 items-center rounded-2xl bg-gold px-5 text-sm font-medium text-navy">رفتن به دستیار</a>
          </article>
        </section>
        <section data-tab="tickets" class="view space-y-4">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p class="text-xs tracking-[0.16em] text-gold">پشتیبانی</p>
              <h1 class="mt-2 text-2xl font-semibold">تیکت‌ها و پشتیبانی</h1>
            </div>
            <button type="button" data-ticket-open class="inline-flex h-11 items-center rounded-2xl bg-gold px-4 text-sm font-medium text-navy">+ ثبت تیکت جدید</button>
          </div>
          <div class="flex gap-2 overflow-x-auto" data-lenis-prevent>
            <button type="button" data-ticket-filter="all" class="shrink-0 rounded-full px-3 py-1.5 text-sm ring-1 ring-white/15">همه تیکت‌ها</button>
            <button type="button" data-ticket-filter="open" class="shrink-0 rounded-full px-3 py-1.5 text-sm ring-1 ring-white/15">در حال بررسی</button>
            <button type="button" data-ticket-filter="answered" class="shrink-0 rounded-full px-3 py-1.5 text-sm ring-1 ring-white/15">پاسخ داده شده</button>
            <button type="button" data-ticket-filter="closed" class="shrink-0 rounded-full px-3 py-1.5 text-sm ring-1 ring-white/15">بسته شده</button>
          </div>
          <div data-live-tickets class="grid gap-3"></div>
          <article data-ticket-empty class="dash-card rounded-[28px] p-6 text-center">
            <p class="text-sm leading-7 text-cream/70">تیکت فعالی ندارید. نیاز به راهنمایی دارید؟ تیکت جدید ارسال کنید.</p>
            <button type="button" data-ticket-open class="mt-4 inline-flex h-11 items-center rounded-2xl bg-gold px-4 text-sm font-medium text-navy">+ ثبت تیکت جدید</button>
          </article>
          <p data-ticket-filter-empty class="text-sm text-cream/50" hidden>در این وضعیت تیکتی نیست.</p>
          <p data-ticket-toast class="text-sm text-cream/70" role="status"></p>
        </section>
      </div>
    </div>
    <dialog id="ticket-dialog" data-lenis-prevent aria-labelledby="ticket-dialog-title">
      <form id="new-ticket" data-panel-ticket class="grid gap-3">
        <h2 id="ticket-dialog-title" class="text-lg font-semibold">ثبت تیکت جدید</h2>
        <p class="text-sm leading-7 text-cream/60">موضوع در همین مرورگر ذخیره می‌شود.</p>
        <label class="text-sm">موضوع<input name="title" required class="mt-1 h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-3 outline-none focus:border-gold" /></label>
        <div class="flex gap-2">
          <button class="h-11 flex-1 rounded-2xl bg-gold text-sm font-semibold text-navy">ثبت تیکت</button>
          <button type="button" data-ticket-close class="h-11 rounded-2xl px-4 text-sm ring-1 ring-white/20">بستن</button>
        </div>
        <p data-ticket-note class="text-sm text-cream/70" role="status"></p>
      </form>
    </dialog>
    <dialog id="logout-dialog" data-lenis-prevent aria-labelledby="logout-dialog-title">
      <h2 id="logout-dialog-title" class="text-lg font-semibold">آیا مطمئن هستید که می‌خواهید خارج شوید؟</h2>
      <p class="mt-3 text-sm leading-7 text-cream/70">برای دسترسی مجدد به دوره‌ها و اعتبارات دستیار، باید دوباره با شماره همراه خود وارد شوید.</p>
      <div class="mt-5 flex flex-wrap gap-2">
        <button type="button" data-logout-confirm class="h-11 rounded-2xl bg-rose-500 px-4 text-sm font-medium text-white">بله، خروج از حساب</button>
        <button type="button" data-logout-cancel class="h-11 rounded-2xl px-4 text-sm ring-1 ring-white/20">انصراف</button>
      </div>
    </dialog>
    <div data-deposit class="fixed inset-0 z-50 hidden items-center justify-center bg-black/60 p-4">
      <div class="w-full max-w-md rounded-3xl bg-[#070B18] p-5 text-cream ring-1 ring-white/10" role="dialog" aria-modal="true" aria-labelledby="deposit-title">
        <h2 id="deposit-title" class="text-lg font-semibold">شارژ کیف پول</h2>
        <p class="mt-2 text-sm leading-7 text-cream/70">مبلغ را انتخاب کنید. این رقم فقط در همین مرورگر به اعتبار حساب اضافه می‌شود.</p>
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
      ${category.tierRequired === "pro" ? `<button type="button" data-buy="${category.id}" class="h-11 rounded-2xl bg-cream px-4 text-sm font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-60">افزودن به سبد</button>` : ""}
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
  return `<div class="grid grid-cols-2 gap-2">${item("login", "/login/", "ورود")}${item("register", "/register/", "ثبت‌نام")}</div>`;
}

function otpFields() {
  return `<div data-auth-otp class="hidden space-y-4">
    <p class="text-sm leading-7 text-cream/80">کد تایید را برای <span data-auth-sent-phone dir="ltr" class="font-semibold text-gold"></span> وارد کنید.</p>
    <div>
      <p class="mb-3 text-sm font-medium">کد تایید</p>
      <div dir="ltr" class="flex justify-between gap-2">
        ${[0, 1, 2, 3, 4].map((index) => `<input data-otp-digit inputmode="numeric" autocomplete="${index === 0 ? "one-time-code" : "off"}" aria-label="رقم ${fa.format(index + 1)} کد تایید" maxlength="${index === 0 ? 5 : 1}" class="h-14 min-w-0 flex-1 rounded-2xl border border-gold/40 bg-white/5 text-center text-xl outline-none focus:border-gold" />`).join("")}
      </div>
    </div>
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
        <p class="text-xs tracking-[0.18em] text-gold">ورود</p>
        <h1 class="mt-2 text-2xl font-semibold">ورود</h1>
        <p class="mt-2 text-sm leading-7 text-cream/70">شماره موبایل را وارد کنید و کد تایید را بنویسید.</p>
      </div>
      <label class="block text-sm">شماره موبایل<input data-auth-phone name="phone" dir="ltr" inputmode="tel" autocomplete="tel" placeholder="09xxxxxxxxx" class="${authField} text-left" /></label>
      <button type="button" data-auth-request class="h-12 w-full rounded-2xl bg-gold text-sm font-medium text-navy">تایید شماره و دریافت کد</button>
      ${otpFields()}
      <button type="button" data-auth-finish class="hidden h-12 w-full rounded-2xl bg-gold text-sm font-medium text-navy">ورود</button>
      <button type="button" data-auth-edit class="hidden text-sm text-cream/70">ویرایش شماره</button>
      <p data-auth-note class="text-sm text-cream/80" role="status"></p>
      <a href="${base}/register/" class="block text-sm text-gold">حساب کاربری ندارید؟ ثبت‌نام کنید</a>
    </form>
  `);
}

export function registerPage(base: string) {
  return layout(base, "home", "ثبت‌نام | نکس‌سل", `
    <form data-auth="register" class="glass mx-auto w-full max-w-[420px] space-y-4 rounded-[28px] p-6 sm:p-8">
      ${authTabs(base, "register")}
      <div>
        <p class="text-xs tracking-[0.18em] text-gold">ثبت‌نام</p>
        <h1 class="mt-2 text-2xl font-semibold">ثبت‌نام</h1>
        <p class="mt-2 text-sm leading-7 text-cream/70">نام، شغل و شماره را وارد کنید.</p>
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
