import { articles } from "@/lib/articles";
import { OBJECTIONS, counterFor } from "@/lib/copilot/playbook";
import { categories, lessonsOf, type Category } from "@/lib/courses-data";
import { BUNDLE_GIFT_MINUTES, BUNDLE_LIST_PRICE, BUNDLE_PRICE, COURSE_PRICE } from "@/lib/pricing";

export const fa = new Intl.NumberFormat("fa-IR");

export function toman(value: number) {
  return `${fa.format(value)} تومان`;
}

function revealAttrs(delayMs = 0) {
  return `data-reveal data-delay="${delayMs}"`;
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
  ["/dashboard/copilot/", "دستیار", "copilot"],
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
        <a href="${href("/#courses")}" class="shrink-0 rounded-xl px-2 py-2 text-sm text-cream/70 hover:bg-white/5">اشتراک</a>
      </nav>
      <div class="ms-auto flex items-center gap-2">
        <a data-auth-guest href="${href("/login/")}" class="rounded-full px-3 py-1.5 text-xs ring-1 ring-gold/30">ورود / عضویت</a>
        <a data-auth-user="chip" href="${href("/dashboard/")}" class="items-center gap-2 rounded-full py-1 ps-1 pe-3 text-xs ring-1 ring-gold/30 sm:text-sm" hidden>
          <span data-header-letter class="grid size-7 place-items-center rounded-full bg-gold text-xs font-bold text-navy">ن</span>
          <span data-header-name class="max-w-28 truncate">کاربر</span>
        </a>
        <button type="button" data-menu class="rounded-xl px-3 py-2 text-sm ring-1 ring-gold/30 md:hidden">منو</button>
      </div>
    </div>
    <div data-mobile-nav data-lenis-prevent class="hidden max-h-[70vh] overflow-y-auto border-t border-white/10 px-4 py-3 md:hidden">
      <a data-auth-guest href="${href("/login/")}" class="block rounded-xl px-3 py-2 text-sm text-cream/80">ورود / عضویت</a>
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
    <p>ساخته‌شده با Node.js.</p>
  </footer>
  <script id="objections" type="application/json">${JSON.stringify(OBJECTIONS)}</script>
  <script src="${href("/lenis.min.js")}"></script>
  <script src="${href("/client.js")}"></script>
</body>
</html>`;
}

function voiceChat() {
  const samples = ["قیمت بالاست", "تخفیف بدید", "باید فکر کنم"];
  return `<div data-voice-chat class="mt-5">
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

function courseCards(base: string) {
  return categories.map((category, index) => {
    const count = lessonsOf(category).length;
    const paid = category.tierRequired === "pro";
    const enter = `${base}/learn/${category.id}/`;
    return `<article ${revealAttrs(index * 80)} class="glass flex flex-col rounded-3xl p-5" data-course="${category.id}" data-paid="${paid ? "yes" : "no"}">
      <h2 class="text-lg font-semibold"><a href="${enter}" class="hover:text-gold">${esc(category.title.fa)}</a></h2>
      <p class="mt-2 flex-1 text-sm leading-7 text-cream/70">${esc(category.description.fa)}</p>
      ${paid ? `<p class="mt-3 text-2xl font-semibold text-gold">${toman(COURSE_PRICE)}</p>` : `<p class="mt-3 text-sm text-emerald-300">آموزش رایگان</p>`}
      <p class="mt-2 text-xs text-cream/50">${fa.format(count)} درس</p>
      <div class="mt-4">
        ${paid ? `<button type="button" data-buy="${category.id}" class="h-11 w-full rounded-2xl bg-cream text-sm font-semibold text-navy">ثبت‌نام این دوره (${toman(COURSE_PRICE)})</button>
        <a data-enter="${category.id}" href="${enter}" class="hidden h-11 w-full items-center justify-center rounded-2xl border-2 border-gold bg-navy text-sm font-semibold text-gold">ورود به دوره و مشاهده ویدیوها</a>`
          : `<a href="${enter}" class="inline-flex h-11 w-full items-center justify-center rounded-2xl border-2 border-gold bg-navy text-sm font-semibold text-gold">مشاهده ویدیوها</a>`}
      </div>
    </article>`;
  }).join("");
}

export function homePage(base: string) {
  return layout(base, "home", "نکس‌سل | آکادمی تخصصی مهارت‌های فروش", `
    <section ${revealAttrs(0)} class="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-10">
      <p class="text-xs tracking-[0.18em] text-gold">سامانه آموزش ویدیویی</p>
      <h1 class="mt-3 max-w-3xl text-3xl font-semibold leading-[1.45] sm:text-4xl">دستیار زنده فروش پشت خط، به‌علاوه آکادمی گیمیفای‌شده.</h1>
      <p class="mt-4 max-w-2xl text-sm leading-8 text-cream/70">کوپایلوت اعتراض تماس را می‌شنود و یک جملهٔ آماده برای گفتن نشان می‌دهد. درس‌ها ویدیوی آپارات‌اند و فقط با قبولی حداقل دو سؤال از سه سؤال باز می‌شوند.</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <a href="${base}/login/" class="inline-flex h-11 items-center rounded-2xl bg-gold px-4 text-sm font-medium text-navy">ورود و شروع</a>
        <a href="${base}/academy/" class="inline-flex h-11 items-center rounded-2xl px-4 text-sm ring-1 ring-gold/30">مسیر آموزش</a>
      </div>
    </section>
    <section ${revealAttrs(80)} class="glass mt-8 rounded-[2rem] p-6 sm:p-8" data-live-demo>
      <p class="text-xs tracking-[0.16em] text-gold">دموی زنده، بدون ورود</p>
      <p class="mt-3 inline-flex rounded-2xl border border-gold/50 bg-navy px-4 py-2 text-sm font-semibold" data-ai-minutes>دقایق باقی‌مانده: ۰ دقیقه</p>
      <h2 class="mt-3 text-2xl font-semibold">یک اعتراض بگویید، جواب پشت‌خط را ببینید</h2>
      ${voiceChat()}
      <div data-counter class="mt-4 hidden rounded-3xl bg-navy p-5"></div>
    </section>
    <section ${revealAttrs(120)} id="copilot-minutes" class="mt-8 rounded-[28px] border border-gold/40 bg-navy p-5 sm:p-6">
      <p class="text-xs tracking-[0.16em] text-gold">مسیر کوپایلوت</p>
      <h2 class="mt-2 text-2xl font-semibold">دقیقهٔ هوش مصنوعی، جدا از دوره</h2>
      <p class="mt-2 text-sm leading-7 text-cream/70">هر ۱٬۰۰۰ دقیقه ۳٬۰۰۰٬۰۰۰ تومان. اسلایدر را بکشید تا مبلغ همان لحظه عوض شود.</p>
      <p class="mt-4 text-sm text-gold">موجودی فعلی: <span data-minute-balance>۰</span> دقیقه</p>
      <div class="mt-5 flex items-end justify-between gap-3">
        <p class="text-3xl font-semibold" data-selected-minutes>۱٬۰۰۰ دقیقه</p>
        <p class="text-lg font-semibold text-gold" data-minute-price>۳٬۰۰۰٬۰۰۰ تومان</p>
      </div>
      <input id="minute-slider" type="range" min="1000" max="20000" step="1000" value="1000" class="mt-4 h-2 w-full cursor-pointer accent-gold" aria-label="انتخاب دقیقه کوپایلوت" />
      <button type="button" id="buy-minutes" class="mt-5 inline-flex h-12 items-center rounded-2xl bg-gold px-5 text-sm font-semibold text-navy">خرید اعتبار هوش مصنوعی</button>
    </section>
    <section class="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      ${[["+", "۵٬۰۰۰", "دانش‌پذیر فعال"], ["+", "۱۲۰", "ساعت آموزش"], ["٪", "۹۸", "رضایت"], ["+", "۳۰۰", "تیم آموزش‌دیده"]].map(([pre, num, label], index) => `<article ${revealAttrs(index * 70)} class="rounded-2xl border border-gold/35 bg-white/5 px-4 py-4"><p class="text-2xl font-semibold text-gold">${pre === "+" ? "+" : ""}${num}${pre === "٪" ? "٪" : ""}</p><p class="mt-2 text-xs text-cream/60">${label}</p></article>`).join("")}
    </section>
    <section id="courses" class="mt-8 space-y-4">
      <article ${revealAttrs(40)} id="bundle" class="rounded-[28px] bg-navy p-5 text-cream shadow-xl ring-1 ring-gold/40 sm:p-7" data-offer="bundle">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-xl font-semibold sm:text-2xl">پکیج جامع ۴ دوره تخصصی فروش و مذاکره</h2>
          <span class="rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-navy">۵۰۰ دقیقه کوپایلوت هوش مصنوعی هدیه رایگان</span>
        </div>
        <p class="mt-3 max-w-2xl text-sm leading-7 text-white/70">فروش آنلاین، حضوری، تلفنی و مذاکره با هم باز می‌شوند. به‌جای ${toman(BUNDLE_LIST_PRICE)}، ${toman(BUNDLE_PRICE)} می‌پردازید.</p>
        <div class="mt-4 flex flex-wrap items-end gap-3">
          <p class="text-3xl font-semibold text-gold">${toman(BUNDLE_PRICE)}</p>
          <p class="pb-1 text-sm text-white/45 line-through">${toman(BUNDLE_LIST_PRICE)}</p>
          <p class="pb-1 text-sm text-gold">۴ میلیون تومان سود خرید یکجا</p>
        </div>
        <button type="button" id="buy-bundle" class="mt-5 inline-flex h-12 items-center rounded-2xl bg-gold px-5 text-sm font-semibold text-navy">خرید یکجای تمام دوره‌ها</button>
      </article>
      <div class="grid gap-4 md:grid-cols-2">${courseCards(base)}</div>
    </section>
    <p class="mt-6 text-xs text-cream/40">هدیهٔ باندل ${fa.format(BUNDLE_GIFT_MINUTES)} دقیقه است و فقط یک‌بار به موجودی اضافه می‌شود.</p>
  `);
}

export function academyPage(base: string) {
  const tracks = categories.map((category, index) => {
    const rows = lessonsOf(category);
    return `<article ${revealAttrs(Math.min(index, 6) * 80)} class="glass rounded-3xl p-5">
      <h2 class="text-lg font-semibold">${esc(category.title.fa)}</h2>
      <p class="mt-2 text-sm text-cream/70">${esc(category.description.fa)}</p>
      <ol class="mt-4 space-y-2 text-sm">
        ${rows.map((row, index) => `<li><a class="text-gold" href="${base}/learn/${category.id}/${row.lesson.id}/">${fa.format(index + 1)}. ${esc(row.lesson.title.fa)}</a></li>`).join("")}
      </ol>
    </article>`;
  }).join("");
  return layout(base, "academy", "آموزش | نکس‌سل", `<header ${revealAttrs(0)}><p class="text-xs tracking-[0.16em] text-gold">مسیر مرحله‌به‌مرحله</p><h1 class="mt-2 text-3xl font-semibold">آموزش</h1></header><div class="mt-6 grid gap-4">${tracks}</div>`);
}

export function copilotPage(base: string) {
  return layout(base, "copilot", "دستیار زنده فروش | نکس‌سل", `
    <section ${revealAttrs(0)} class="min-h-[70vh] rounded-[28px] bg-[#070B18] p-4 sm:p-6" data-copilot-hud>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-xs tracking-[0.18em] text-gold">دستیار زنده فروش</p>
          <h1 class="mt-2 text-2xl font-semibold sm:text-3xl">پشت خط، جواب را آماده ببینید</h1>
        </div>
        <p class="rounded-2xl border border-gold/50 bg-white/5 px-4 py-3 text-sm" data-ai-minutes>دقایق باقی‌مانده: ۰ دقیقه</p>
      </div>
      ${voiceChat()}
      <div data-counter class="mt-6 hidden rounded-[28px] border border-gold/40 bg-[#10182E] p-5"></div>
      <p class="mt-6 text-sm leading-7 text-white/60">موجودی از کیف پول همین مرورگر خوانده می‌شود. اگر باندل خریده باشید و موجودی خالی باشد، ۵۰۰ دقیقهٔ هدیه نشان داده می‌شود.</p>
    </section>
  `);
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

export function servicesPage(base: string) {
  const items = [
    ["بازنویسی اسکریپت تیم فروش", "تماس ورودی، تماس سرد و اعتراض‌های پرتکرار تیم را به چارچوب قابل گفتن تبدیل می‌کنیم."],
    ["آموزش حضوری پرسنل", "کارگاه زبان بدن، نیازسنجی و دمو برای تیم فروش مستقیم."],
    ["بهینه‌سازی قیف فروش", "صفحهٔ فرود، پیشنهاد و مسیر دایرکت را با یک شاخص مشخص اصلاح می‌کنیم."],
    ["منتورینگ مدیر فروش", "دو جلسهٔ یک‌به‌یک در ماه برای عارضه‌یابی تیم و شاخص‌ها."],
  ];
  return layout(base, "services", "خدمات | نکس‌سل", `<header ${revealAttrs(0)}><h1 class="text-3xl font-semibold">خدمات تیم فروش</h1></header><div class="mt-6 grid gap-4 md:grid-cols-2">${items.map(([title, text], index) => `<article ${revealAttrs(index * 80)} class="glass rounded-3xl p-5"><h2 class="font-semibold">${title}</h2><p class="mt-2 text-sm leading-7 text-cream/70">${text}</p></article>`).join("")}</div><p ${revealAttrs(160)} class="mt-6 text-sm text-cream/60">درخواست را از <a class="text-gold" href="${base}/contact/">ارتباط با ما</a> بفرستید.</p>`);
}

export function supportPage(base: string) {
  return layout(base, "support", "پشتیبانی | نکس‌سل", `<header ${revealAttrs(0)}><h1 class="text-3xl font-semibold">پشتیبانی</h1></header><form ${revealAttrs(80)} data-ticket data-lenis-prevent class="glass mt-6 grid max-w-xl gap-3 rounded-3xl p-5"><label class="text-sm">موضوع<input name="title" required class="mt-1 h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-3" /></label><label class="text-sm">شرح<textarea name="body" required class="mt-1 min-h-28 w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2"></textarea></label><button class="h-11 rounded-2xl bg-gold font-semibold text-navy">ثبت تیکت</button><p data-ticket-note class="text-sm text-cream/70"></p></form>`);
}

export function aboutPage(base: string) {
  return layout(base, "about", "درباره ما | نکس‌سل", `<header ${revealAttrs(0)}><p class="text-xs tracking-[0.18em] text-gold">آکادمی تخصصی فروش و مذاکره</p><h1 class="mt-3 max-w-3xl text-3xl font-semibold leading-[1.45]">فروش آنلاین، حضوری و تلفنی را با مذاکرهٔ دقیق به نتیجه می‌رسانیم.</h1></header><div class="mt-6 grid gap-3 md:grid-cols-2"><article ${revealAttrs(80)} class="glass rounded-3xl p-5"><h2 class="text-gold">مأموریت</h2><p class="mt-2 text-sm leading-8 text-cream/75">توانمند کردن کسب‌وکارها برای تسلط بر فروش آنلاین، حضوری و تلفنی، همراه با مذاکره در موقعیت‌های حساس.</p></article><article ${revealAttrs(160)} class="glass rounded-3xl p-5"><h2 class="text-gold">چشم‌انداز</h2><p class="mt-2 text-sm leading-8 text-cream/75">مرجع آموزش فروش و مذاکره؛ جایی که هر تیم گفتگو را به تصمیم روشن تبدیل کند.</p></article></div>`);
}

export function contactPage(base: string) {
  return layout(base, "contact", "ارتباط با ما | نکس‌سل", `<header ${revealAttrs(0)}><h1 class="text-3xl font-semibold">کانال مستقیم، بدون فرم اضافه.</h1></header><div class="mt-6 grid gap-4 md:grid-cols-2"><article ${revealAttrs(80)} class="glass rounded-3xl p-5"><h2>دفتر مرکزی</h2><p class="mt-2 text-sm text-cream/70">تهران، خیابان ولیعصر، برج فناوری، طبقه ۸</p></article><article ${revealAttrs(160)} class="glass rounded-3xl p-5"><h2>تماس</h2><p class="mt-2 text-sm" dir="ltr">021-88880000</p><p class="text-sm" dir="ltr">support@academy.com</p><p class="mt-2 text-sm text-cream/60">شنبه تا چهارشنبه ۹ تا ۱۸</p></article></div>`);
}

export function subscriptionPage(base: string) {
  return layout(base, "home", "خرید دوره | نکس‌سل", `<section ${revealAttrs(0)}><h1 class="text-3xl font-semibold">دو مسیر خرید</h1><p class="mt-3 max-w-2xl text-sm leading-8 text-cream/70">دوره‌ها و باندل جدا از دقیقهٔ کوپایلوت فروخته می‌شوند. هر دوره ${toman(COURSE_PRICE)} است و باندل ${toman(BUNDLE_PRICE)}.</p><p class="mt-6"><a class="inline-flex h-11 items-center rounded-2xl bg-gold px-4 font-semibold text-navy" href="${base}/#courses">رفتن به دوره‌ها</a> <a class="ms-2 inline-flex h-11 items-center rounded-2xl px-4 ring-1 ring-gold/40" href="${base}/#copilot-minutes">دقیقهٔ کوپایلوت</a></p></section>`);
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
    <a data-buy-link="${category.id}" href="${base}/#courses" class="mt-5 inline-flex h-10 items-center justify-center rounded-2xl bg-cream px-4 text-sm font-medium text-navy">ثبت‌نام این دوره (${toman(COURSE_PRICE)})</a>
  </article>`).join("");
  const courseStatus = categories.filter((category) => category.tierRequired === "pro").map((category) => `<li class="flex items-center justify-between rounded-2xl border border-gold/30 px-3 py-3 text-sm" data-course-status="${category.id}"><span>${esc(category.title.fa)}</span><span data-owned-label class="text-cream/50">خریداری نشده</span></li>`).join("");
  const audits = [
    ["call-82", "۱۴۰۵/۷/۹", "تماس پیگیری قیمت", "۸۲", "شروع تماس دلیل مشخصی داشت. نام خریدار را درست گفتید و قبل از معرفی محصول، یک جمله دربارهٔ نتیجهٔ تماس گفتید."],
    ["call-74", "۱۴۰۵/۷/۲", "تماس معرفی محصول", "۷۴", "لحن شروع آرام بود و نام خریدار را درست گفتید."],
    ["call-91", "۱۴۰۵/۶/۲۷", "مذاکره تمدید قرارداد", "۹۱", "بستن تماس روز و صاحب قدم بعدی را مشخص کرد."],
  ].map(([id, at, title, score, strength]) => `<article class="glass rounded-[28px] p-5" data-audit="${id}">
    <div class="flex flex-wrap items-start justify-between gap-3"><div><h2 class="text-lg font-semibold">${title}</h2><p class="mt-1 text-xs text-cream/50">${at}</p></div><p class="text-sm font-semibold text-gold">امتیاز ${score} / ۱۰۰</p></div>
    <p class="mt-3 text-sm leading-7 text-cream/70">${strength}</p>
    <button type="button" data-audit-toggle class="mt-4 h-10 rounded-2xl bg-gold px-4 text-sm font-medium text-navy">مشاهده کارنامه</button>
    <div data-audit-report class="mt-4 hidden space-y-2 rounded-2xl border border-gold/30 p-4 text-sm leading-7">
      <p>لحن و اعتمادبه‌نفس: ۸۸</p><p>گوش دادن فعال: ۷۲</p><p>مدیریت اعتراض: ۸۵</p><p>بستن و دعوت به اقدام: ۶۸</p>
      <p class="text-cream/70">${strength}</p>
    </div>
  </article>`).join("");
  return layout(base, "home", "پنل کاربری | نکس‌سل", `
    <div data-user-panel data-initial-tab="${esc(initialTab)}" class="lg:flex lg:items-start lg:gap-4">
      <div class="glass -mx-4 flex gap-2 overflow-x-auto px-4 py-2 lg:hidden" data-lenis-prevent>
        ${PANEL_TABS.map(([id, label]) => tabLink(id, label, true)).join("")}
        <a href="${base}/dashboard/copilot/" class="flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-sm">دستیار</a>
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
          <a href="${base}/dashboard/copilot/" class="mt-2 flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm">دستیار زنده</a>
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
              <span data-status-badge="long" class="rounded-full bg-gold px-3 py-1 text-xs font-medium text-navy">هنوز دوره‌ای خریداری نشده</span>
              <span data-gift-badge class="hidden rounded-full border border-gold/60 px-3 py-1 text-xs text-gold">۵۰۰ دقیقه هدیه فعال است</span>
            </div>
          </section>
          <div class="grid gap-3 sm:grid-cols-3">
            <article class="glass rounded-[24px] p-4"><p class="text-sm text-cream/60">دوره‌های فعال</p><p class="mt-3 text-2xl font-semibold" data-owned-count>۰</p><p class="mt-1 text-xs text-cream/50" data-owned-hint>از ۴ دوره تخصصی</p></article>
            <article class="glass rounded-[24px] p-4"><p class="text-sm text-cream/60">دقیقهٔ باقی‌مانده کوپایلوت</p><p class="mt-3 text-2xl font-semibold" data-minute-balance>۰</p><p class="mt-1 text-xs text-cream/50" data-minute-hint>هدیه فقط با باندل</p></article>
            <article class="glass rounded-[24px] p-4"><p class="text-sm text-cream/60">کش‌بک تومانی</p><p class="mt-3 text-2xl font-semibold" data-cashback>۰</p><p class="mt-1 text-xs text-cream/50">۵٪ خرید و پاداش معرفی</p></article>
          </div>
          <section class="glass rounded-[28px] p-5">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 class="text-lg font-semibold">وضعیت دوره‌ها</h2>
              <a href="${base}/#courses" class="inline-flex h-10 items-center justify-center rounded-2xl bg-gold px-4 text-sm font-medium text-navy">خرید دوره یا باندل</a>
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
            <label class="block space-y-1.5 text-sm"><span class="flex items-center gap-2">شماره موبایل <span class="rounded-full border border-gold/50 px-2 py-0.5 text-[10px] text-gold">تایید شده</span></span><input name="phone" dir="ltr" inputmode="tel" class="h-11 w-full rounded-2xl border border-gold/35 bg-white/5 px-3 text-left text-sm outline-none focus:border-gold" /></label>
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
            <h1 class="mt-2 text-2xl font-semibold">وضعیت خرید دوره‌ها</h1>
            <p class="mt-1 text-sm text-cream/60" dir="ltr" data-phone-line>—</p>
            <p class="mt-2 text-sm leading-7 text-cream/60">هر دوره ${toman(COURSE_PRICE)} است. باندل چهار دوره ${toman(BUNDLE_PRICE)} است و ${fa.format(BUNDLE_GIFT_MINUTES)} دقیقه کوپایلوت هدیه می‌دهد.</p>
          </div>
          <article class="rounded-[28px] bg-navy p-5 ring-1 ring-gold/30" data-bundle-card>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-lg font-semibold">باندل کامل</h2>
              <span data-bundle-label class="rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-navy">خریداری نشده · ۱۶ میلیون تومان به‌جای ۲۰ میلیون</span>
            </div>
            <a data-bundle-buy href="${base}/#courses" class="mt-4 inline-flex h-11 items-center rounded-2xl bg-gold px-4 text-sm font-semibold text-navy">خرید باندل و دریافت هدیه</a>
          </article>
          <div class="grid gap-3 sm:grid-cols-2">${cards}</div>
        </section>
        <section data-tab="wallet" class="view space-y-4">
          <section class="rounded-[28px] bg-navy p-6 ring-1 ring-gold/30">
            <p class="text-xs tracking-[0.16em] text-gold">کیف دقیقه</p>
            <h1 class="mt-2 text-2xl font-semibold">کیف پول دقایق کوپایلوت هوش مصنوعی</h1>
            <p class="mt-6 text-4xl font-semibold text-gold"><span data-minute-balance>۰</span> <span class="text-lg font-medium text-cream">دقیقه</span></p>
            <p class="mt-3 text-sm" data-ai-minutes>دقایق باقی‌مانده: ۰ دقیقه</p>
            <p class="mt-3 text-sm leading-7 text-cream/70" data-wallet-lead>دقیقه جدا از دوره است. هدیهٔ ۵۰۰ دقیقه فقط با خرید باندل اضافه می‌شود.</p>
            <div class="mt-6">
              <div class="flex items-end justify-between gap-3">
                <p data-selected-minutes class="text-2xl font-semibold">۱٬۰۰۰ دقیقه</p>
                <p data-minute-price class="text-lg font-semibold text-gold">۳٬۰۰۰٬۰۰۰ تومان</p>
              </div>
              <input id="minute-slider" type="range" min="1000" max="20000" step="1000" value="1000" class="mt-4 h-2 w-full cursor-pointer accent-gold" aria-label="انتخاب دقیقه کوپایلوت" />
              <div class="mt-2 flex justify-between text-xs text-cream/50"><span>۱٬۰۰۰ دقیقه</span><span>۲۰٬۰۰۰ دقیقه</span></div>
            </div>
            <button type="button" id="buy-minutes" class="mt-5 inline-flex h-12 items-center rounded-2xl bg-gold px-5 text-sm font-semibold text-navy">خرید اعتبار هوش مصنوعی</button>
            <p data-minute-note class="mt-3 text-sm text-gold" role="status"></p>
          </section>
          <section class="glass rounded-[28px] p-6">
            <p class="text-xs tracking-[0.16em] text-gold">وفاداری تومانی</p>
            <h2 class="mt-2 text-xl font-semibold">کش‌بک جمع‌شده</h2>
            <p class="mt-4 text-3xl font-semibold"><span data-cashback>۰</span> <span class="text-lg font-medium">تومان</span></p>
            <p class="mt-3 text-sm leading-7 text-cream/60">با هر خرید دوره یا دقیقه، ۵٪ از مبلغ پرداختی به کش‌بک تومانی همین حساب اضافه می‌شود.</p>
          </section>
          <section class="glass rounded-[28px] p-5">
            <h2 class="text-lg font-semibold">معرفی دوستان</h2>
            <p class="mt-2 text-sm leading-7 text-cream/60">هر معرفی ثبت‌شده ${toman(200000)} به کش‌بک تومانی اضافه می‌کند.</p>
            <p class="mt-3 font-semibold" dir="ltr" data-referral-code>—</p>
            <p class="mt-1 text-sm text-cream/60"><span data-referral-count>۰</span> معرفی ثبت شده</p>
            <button type="button" data-refer class="mt-4 h-11 rounded-2xl bg-gold px-4 text-sm font-medium text-navy">ثبت یک معرفی</button>
          </section>
          <section class="glass rounded-[28px] p-6">
            <p class="text-sm text-cream/60">اعتبار تومانی حساب</p>
            <p class="mt-1 text-3xl font-semibold"><span data-wallet-balance>۰</span> <span class="text-lg font-medium">تومان</span></p>
            <button type="button" data-deposit-open class="mt-5 h-11 rounded-2xl bg-gold px-5 text-sm font-medium text-navy">افزایش اعتبار کیف پول</button>
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
          <div><h1 class="text-2xl font-semibold">تحلیل‌های تماس من</h1><p class="mt-2 text-sm leading-7 text-cream/60">کارنامه‌هایی که از تحلیل تماس ساخته شده‌اند.</p></div>
          <div class="grid gap-3">${audits}</div>
        </section>
        <section data-tab="tickets" class="view space-y-4">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div><h1 class="text-2xl font-semibold">تیکت‌ها و پشتیبانی</h1><p class="mt-2 text-sm leading-7 text-cream/60">وضعیت درخواست‌های پشتیبانی شما.</p></div>
            <a href="#new-ticket" class="inline-flex h-11 items-center rounded-2xl bg-gold px-4 text-sm font-medium text-navy">ثبت تیکت جدید</a>
          </div>
          <div data-live-tickets class="grid gap-3"></div>
          <article class="glass flex flex-wrap items-center justify-between gap-3 rounded-[28px] p-5"><div><p class="text-xs text-cream/50">TK-2401</p><h2 class="mt-1 font-semibold">دسترسی ویدیوی مذاکره بعد از خرید دوره</h2><p class="mt-1 text-xs text-cream/50">۱۴۰۵/۷/۹</p></div><span class="rounded-full bg-gold px-3 py-1 text-xs font-medium text-navy">در حال بررسی</span></article>
          <article class="glass flex flex-wrap items-center justify-between gap-3 rounded-[28px] p-5"><div><p class="text-xs text-cream/50">TK-2388</p><h2 class="mt-1 font-semibold">کد تایید برای ورود به پنل</h2><p class="mt-1 text-xs text-cream/50">۱۴۰۵/۶/۳۱</p></div><span class="rounded-full bg-gold px-3 py-1 text-xs font-medium text-navy">پاسخ داده شده</span></article>
          <article class="glass flex flex-wrap items-center justify-between gap-3 rounded-[28px] p-5"><div><p class="text-xs text-cream/50">TK-2310</p><h2 class="mt-1 font-semibold">رسید کش‌بک خرید دوره</h2><p class="mt-1 text-xs text-cream/50">۱۴۰۵/۶/۱۳</p></div><span class="rounded-full bg-gold px-3 py-1 text-xs font-medium text-navy">بسته شده</span></article>
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
      ${category.tierRequired === "pro" ? `<button type="button" data-buy="${category.id}" class="h-11 rounded-2xl bg-cream px-4 text-sm font-semibold text-navy">ثبت‌نام این دوره (${toman(COURSE_PRICE)})</button>` : ""}
    </div>
    <ol class="mt-6 space-y-3">${rows.map((row, index) => `<li ${revealAttrs(Math.min(index, 6) * 50)} class="glass rounded-2xl px-4 py-3"><a href="${base}/learn/${category.id}/${row.lesson.id}/" class="font-semibold">${fa.format(index + 1)}. ${esc(row.lesson.title.fa)}</a><p class="mt-1 text-xs text-cream/60">${esc(row.lesson.summary.fa)}</p></li>`).join("")}</ol>
  `);
}

export function learnLessonPage(base: string, categoryId: string, lessonId: string) {
  const category = findCategory(categoryId);
  if (!category) return null;
  const row = lessonsOf(category).find((item) => item.lesson.id === lessonId);
  if (!row) return null;
  const quiz = row.lesson.quiz.slice(0, 3).map((question, qIndex) => `<fieldset class="rounded-2xl border border-white/10 p-3" data-answer="${question.answer}">
    <legend class="px-1 text-sm font-semibold">${esc(question.prompt.fa)}</legend>
    ${question.options.map((option, oIndex) => `<label class="mt-2 flex items-center gap-2 text-sm"><input type="radio" name="q${qIndex}" value="${oIndex}" class="accent-gold" /><span>${esc(option.fa)}</span></label>`).join("")}
  </fieldset>`).join("");
  return layout(base, "academy", `${row.lesson.title.fa} | نکس‌سل`, `
    <header ${revealAttrs(0)}><a href="${base}/learn/${category.id}/" class="text-sm text-gold">بازگشت به ${esc(category.title.fa)}</a>
    <h1 class="mt-3 text-2xl font-semibold sm:text-3xl">${esc(row.lesson.title.fa)}</h1></header>
    <p class="mt-2 text-sm leading-7 text-cream/70">${esc(row.lesson.summary.fa)}</p>
    <div ${revealAttrs(80)} class="mt-4 aspect-video overflow-hidden rounded-2xl bg-black" data-course-gate="${category.id}" data-free="${category.tierRequired === "free" ? "yes" : "no"}">
      <iframe class="h-full w-full" title="ویدیوی آپارات" allowfullscreen data-aparat="${esc(row.lesson.aparat)}"></iframe>
      <p data-locked class="grid h-full place-items-center p-6 text-center text-sm">برای تماشای این درس، همین دوره را ثبت‌نام کنید.</p>
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
  return `<div class="grid grid-cols-2 gap-2">${item("login", "/login/", "ورود")}${item("register", "/register/", "عضویت")}</div>`;
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
    <p class="text-xs leading-6 text-cream/60">هر کد ۵ رقمی قبول است، مثلاً ۱۲۳۴۵.</p>
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
        <p class="text-xs tracking-[0.18em] text-gold">ورود / عضویت</p>
        <h1 class="mt-2 text-2xl font-semibold">ورود</h1>
        <p class="mt-2 text-sm leading-7 text-cream/70">شماره موبایل را وارد کنید. کد پنج‌رقمی فقط بعد از تایید شماره ارسال می‌شود.</p>
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
  return layout(base, "home", "عضویت | نکس‌سل", `
    <form data-auth="register" class="glass mx-auto w-full max-w-[420px] space-y-4 rounded-[28px] p-6 sm:p-8">
      ${authTabs(base, "register")}
      <div>
        <p class="text-xs tracking-[0.18em] text-gold">ورود / عضویت</p>
        <h1 class="mt-2 text-2xl font-semibold">عضویت</h1>
        <p class="mt-2 text-sm leading-7 text-cream/70">حساب آکادمی را با همین شماره می‌سازید. کد تایید بعد از تایید شماره می‌آید.</p>
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
