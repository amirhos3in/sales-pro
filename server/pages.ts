import { articles } from "@/lib/articles";
import { OBJECTIONS, counterFor } from "@/lib/copilot/playbook";
import { categories, lessonsOf, type Category } from "@/lib/courses-data";
import { BUNDLE_GIFT_MINUTES, BUNDLE_LIST_PRICE, BUNDLE_PRICE, COURSE_PRICE } from "@/lib/pricing";

export const fa = new Intl.NumberFormat("fa-IR");

export function toman(value: number) {
  return `${fa.format(value)} تومان`;
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
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { theme: { extend: {
      fontFamily: { sans: ["Vazirmatn", "Tahoma", "sans-serif"] },
      colors: { navy: "#0B132B", gold: "#D4AF37", cream: "#F6F1E4" }
    } } }
  </script>
  <style>
    body { background: #0B132B; color: #F6F1E4; }
    .glass { background: rgba(15, 28, 63, 0.55); border: 1px solid rgba(212, 175, 55, 0.22); backdrop-filter: blur(16px); }
    .view { display: none; }
    .view.active { display: block; }
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
        <a href="${href("/login/")}" class="rounded-full px-3 py-1.5 text-xs ring-1 ring-gold/30">ورود / عضویت</a>
        <button type="button" data-menu class="rounded-xl px-3 py-2 text-sm ring-1 ring-gold/30 md:hidden">منو</button>
      </div>
    </div>
    <div data-mobile-nav class="hidden border-t border-white/10 px-4 py-3 md:hidden">
      ${NAV.map(([path, label]) => `<a href="${href(path)}" class="block rounded-xl px-3 py-2 text-sm text-cream/80">${label}</a>`).join("")}
    </div>
  </header>
  <main class="mx-auto w-full max-w-6xl px-4 py-8">${body}</main>
  <footer class="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-cream/50 sm:flex-row sm:justify-between">
    <p>نکس‌سل، آموزش ویدیویی فروش با چالش پایان هر درس.</p>
    <p>ساخته‌شده با Node.js.</p>
  </footer>
  <script id="objections" type="application/json">${JSON.stringify(OBJECTIONS)}</script>
  <script src="${href("/client.js")}"></script>
</body>
</html>`;
}

function courseCards(base: string) {
  return categories.map((category) => {
    const count = lessonsOf(category).length;
    const paid = category.tierRequired === "pro";
    const enter = `${base}/learn/${category.id}/`;
    return `<article class="glass flex flex-col rounded-3xl p-5" data-course="${category.id}" data-paid="${paid ? "yes" : "no"}">
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
    <section class="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-10">
      <p class="text-xs tracking-[0.18em] text-gold">سامانه آموزش ویدیویی</p>
      <h1 class="mt-3 max-w-3xl text-3xl font-semibold leading-[1.45] sm:text-4xl">دستیار زنده فروش پشت خط، به‌علاوه آکادمی گیمیفای‌شده.</h1>
      <p class="mt-4 max-w-2xl text-sm leading-8 text-cream/70">کوپایلوت اعتراض تماس را می‌شنود و یک جملهٔ آماده برای گفتن نشان می‌دهد. درس‌ها ویدیوی آپارات‌اند و فقط با قبولی حداقل دو سؤال از سه سؤال باز می‌شوند.</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <a href="${base}/login/" class="inline-flex h-11 items-center rounded-2xl bg-gold px-4 text-sm font-medium text-navy">ورود و شروع</a>
        <a href="${base}/academy/" class="inline-flex h-11 items-center rounded-2xl px-4 text-sm ring-1 ring-gold/30">مسیر آموزش</a>
      </div>
    </section>
    <section class="glass mt-8 rounded-[2rem] p-6 sm:p-8" data-live-demo>
      <p class="text-xs tracking-[0.16em] text-gold">دموی زنده، بدون ورود</p>
      <p class="mt-3 inline-flex rounded-2xl border border-gold/50 bg-navy px-4 py-2 text-sm font-semibold" data-ai-minutes>دقایق باقی‌مانده: ۰ دقیقه</p>
      <h2 class="mt-3 text-2xl font-semibold">یک اعتراض بگویید، جواب پشت‌خط را ببینید</h2>
      <div class="mt-5 flex flex-wrap gap-2">
        ${["قیمت بالاست", "تخفیف بدید", "باید فکر کنم"].map((sample) => `<button type="button" data-sample-objection="${esc(sample)}" class="h-10 rounded-full px-3 text-xs ring-1 ring-gold/30">${esc(sample)}</button>`).join("")}
      </div>
      <div data-counter class="mt-4 hidden rounded-3xl bg-navy p-5"></div>
    </section>
    <section id="copilot-minutes" class="mt-8 rounded-[28px] border border-gold/40 bg-navy p-5 sm:p-6">
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
      ${[["+", "۵٬۰۰۰", "دانش‌پذیر فعال"], ["+", "۱۲۰", "ساعت آموزش"], ["٪", "۹۸", "رضایت"], ["+", "۳۰۰", "تیم آموزش‌دیده"]].map(([pre, num, label]) => `<article class="rounded-2xl border border-gold/35 bg-white/5 px-4 py-4"><p class="text-2xl font-semibold text-gold">${pre === "+" ? "+" : ""}${num}${pre === "٪" ? "٪" : ""}</p><p class="mt-2 text-xs text-cream/60">${label}</p></article>`).join("")}
    </section>
    <section id="courses" class="mt-8 space-y-4">
      <article id="bundle" class="rounded-[28px] bg-navy p-5 text-cream shadow-xl ring-1 ring-gold/40 sm:p-7" data-offer="bundle">
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
  const tracks = categories.map((category) => {
    const rows = lessonsOf(category);
    return `<article class="glass rounded-3xl p-5">
      <h2 class="text-lg font-semibold">${esc(category.title.fa)}</h2>
      <p class="mt-2 text-sm text-cream/70">${esc(category.description.fa)}</p>
      <ol class="mt-4 space-y-2 text-sm">
        ${rows.map((row, index) => `<li><a class="text-gold" href="${base}/learn/${category.id}/${row.lesson.id}/">${fa.format(index + 1)}. ${esc(row.lesson.title.fa)}</a></li>`).join("")}
      </ol>
    </article>`;
  }).join("");
  return layout(base, "academy", "آموزش | نکس‌سل", `<p class="text-xs tracking-[0.16em] text-gold">مسیر مرحله‌به‌مرحله</p><h1 class="mt-2 text-3xl font-semibold">آموزش</h1><div class="mt-6 grid gap-4">${tracks}</div>`);
}

export function copilotPage(base: string) {
  return layout(base, "copilot", "دستیار زنده فروش | نکس‌سل", `
    <section class="min-h-[70vh] rounded-[28px] bg-[#070B18] p-4 sm:p-6" data-copilot-hud>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-xs tracking-[0.18em] text-gold">دستیار زنده فروش</p>
          <h1 class="mt-2 text-2xl font-semibold sm:text-3xl">پشت خط، جواب را آماده ببینید</h1>
        </div>
        <p class="rounded-2xl border border-gold/50 bg-white/5 px-4 py-3 text-sm" data-ai-minutes>دقایق باقی‌مانده: ۰ دقیقه</p>
      </div>
      <div class="mt-5 flex flex-wrap gap-2">
        ${["قیمت بالاست", "تخفیف بدید", "باید فکر کنم"].map((sample) => `<button type="button" data-sample-objection="${esc(sample)}" class="h-10 rounded-full bg-white/10 px-3 text-xs">${esc(sample)}</button>`).join("")}
        <button type="button" data-demo-mic class="inline-flex h-11 items-center rounded-2xl bg-gold px-4 text-sm font-semibold text-navy">حرف بزنید</button>
      </div>
      <div data-counter class="mt-6 hidden rounded-[28px] border border-gold/40 bg-[#10182E] p-5"></div>
      <p class="mt-6 text-sm leading-7 text-white/60">موجودی از کیف پول همین مرورگر خوانده می‌شود. اگر باندل خریده باشید و موجودی خالی باشد، ۵۰۰ دقیقهٔ هدیه نشان داده می‌شود.</p>
    </section>
  `);
}

export function articlesPage(base: string) {
  const cards = articles.map((article) => `<a href="${base}/articles/${article.slug}/" class="glass block rounded-3xl p-5">
    <p class="text-xs text-gold">${esc(article.category.fa)} · ${esc(article.readTime.fa)}</p>
    <h2 class="mt-2 text-lg font-semibold">${esc(article.title.fa)}</h2>
    <p class="mt-2 text-sm leading-7 text-cream/70">${esc(article.excerpt.fa)}</p>
  </a>`).join("");
  return layout(base, "articles", "مقالات | نکس‌سل", `<h1 class="text-3xl font-semibold">مقالات</h1><div class="mt-6 grid gap-4">${cards}</div>`);
}

export function articlePage(base: string, slug: string) {
  const article = articles.find((item) => item.slug === slug);
  if (!article) return null;
  const blocks = article.content.map((block) => {
    if (block.type === "h2") return `<h2 class="mt-6 text-xl font-semibold">${esc(block.text.fa)}</h2>`;
    if (block.type === "ul") return `<ul class="mt-3 list-disc space-y-2 pe-5 text-sm leading-7 text-cream/80">${block.items.map((item) => `<li>${esc(item.fa)}</li>`).join("")}</ul>`;
    return `<p class="mt-3 text-sm leading-8 text-cream/80">${esc(block.text.fa)}</p>`;
  }).join("");
  return layout(base, "articles", `${article.title.fa} | نکس‌سل`, `<a href="${base}/articles/" class="text-sm text-gold">بازگشت به مقالات</a><h1 class="mt-3 text-3xl font-semibold">${esc(article.title.fa)}</h1><p class="mt-2 text-sm text-cream/50">${esc(article.author.name.fa)} · ${esc(article.publishedAt.fa)}</p>${blocks}`);
}

export function servicesPage(base: string) {
  const items = [
    ["بازنویسی اسکریپت تیم فروش", "تماس ورودی، تماس سرد و اعتراض‌های پرتکرار تیم را به چارچوب قابل گفتن تبدیل می‌کنیم."],
    ["آموزش حضوری پرسنل", "کارگاه زبان بدن، نیازسنجی و دمو برای تیم فروش مستقیم."],
    ["بهینه‌سازی قیف فروش", "صفحهٔ فرود، پیشنهاد و مسیر دایرکت را با یک شاخص مشخص اصلاح می‌کنیم."],
    ["منتورینگ مدیر فروش", "دو جلسهٔ یک‌به‌یک در ماه برای عارضه‌یابی تیم و شاخص‌ها."],
  ];
  return layout(base, "services", "خدمات | نکس‌سل", `<h1 class="text-3xl font-semibold">خدمات تیم فروش</h1><div class="mt-6 grid gap-4 md:grid-cols-2">${items.map(([title, text]) => `<article class="glass rounded-3xl p-5"><h2 class="font-semibold">${title}</h2><p class="mt-2 text-sm leading-7 text-cream/70">${text}</p></article>`).join("")}</div><p class="mt-6 text-sm text-cream/60">درخواست را از <a class="text-gold" href="${base}/contact/">ارتباط با ما</a> بفرستید.</p>`);
}

export function supportPage(base: string) {
  return layout(base, "support", "پشتیبانی | نکس‌سل", `<h1 class="text-3xl font-semibold">پشتیبانی</h1><form data-ticket class="glass mt-6 grid max-w-xl gap-3 rounded-3xl p-5"><label class="text-sm">موضوع<input name="title" required class="mt-1 h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-3" /></label><label class="text-sm">شرح<textarea name="body" required class="mt-1 min-h-28 w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2"></textarea></label><button class="h-11 rounded-2xl bg-gold font-semibold text-navy">ثبت تیکت</button><p data-ticket-note class="text-sm text-cream/70"></p></form>`);
}

export function aboutPage(base: string) {
  return layout(base, "about", "درباره ما | نکس‌سل", `<p class="text-xs tracking-[0.18em] text-gold">آکادمی تخصصی فروش و مذاکره</p><h1 class="mt-3 max-w-3xl text-3xl font-semibold leading-[1.45]">فروش آنلاین، حضوری و تلفنی را با مذاکرهٔ دقیق به نتیجه می‌رسانیم.</h1><div class="mt-6 grid gap-3 md:grid-cols-2"><article class="glass rounded-3xl p-5"><h2 class="text-gold">مأموریت</h2><p class="mt-2 text-sm leading-8 text-cream/75">توانمند کردن کسب‌وکارها برای تسلط بر فروش آنلاین، حضوری و تلفنی، همراه با مذاکره در موقعیت‌های حساس.</p></article><article class="glass rounded-3xl p-5"><h2 class="text-gold">چشم‌انداز</h2><p class="mt-2 text-sm leading-8 text-cream/75">مرجع آموزش فروش و مذاکره؛ جایی که هر تیم گفتگو را به تصمیم روشن تبدیل کند.</p></article></div>`);
}

export function contactPage(base: string) {
  return layout(base, "contact", "ارتباط با ما | نکس‌سل", `<h1 class="text-3xl font-semibold">کانال مستقیم، بدون فرم اضافه.</h1><div class="mt-6 grid gap-4 md:grid-cols-2"><article class="glass rounded-3xl p-5"><h2>دفتر مرکزی</h2><p class="mt-2 text-sm text-cream/70">تهران، خیابان ولیعصر، برج فناوری، طبقه ۸</p></article><article class="glass rounded-3xl p-5"><h2>تماس</h2><p class="mt-2 text-sm" dir="ltr">021-88880000</p><p class="text-sm" dir="ltr">support@academy.com</p><p class="mt-2 text-sm text-cream/60">شنبه تا چهارشنبه ۹ تا ۱۸</p></article></div>`);
}

export function subscriptionPage(base: string) {
  return layout(base, "home", "خرید دوره | نکس‌سل", `<h1 class="text-3xl font-semibold">دو مسیر خرید</h1><p class="mt-3 max-w-2xl text-sm leading-8 text-cream/70">دوره‌ها و باندل جدا از دقیقهٔ کوپایلوت فروخته می‌شوند. هر دوره ${toman(COURSE_PRICE)} است و باندل ${toman(BUNDLE_PRICE)}.</p><p class="mt-6"><a class="inline-flex h-11 items-center rounded-2xl bg-gold px-4 font-semibold text-navy" href="${base}/#courses">رفتن به دوره‌ها</a> <a class="ms-2 inline-flex h-11 items-center rounded-2xl px-4 ring-1 ring-gold/40" href="${base}/#copilot-minutes">دقیقهٔ کوپایلوت</a></p>`);
}

export function dashboardPage(base: string) {
  const cards = categories.filter((category) => category.tierRequired === "pro").map((category) => `<article class="glass rounded-[28px] p-5" data-dash-course="${category.id}" data-lessons="${lessonsOf(category).map((row) => row.lesson.id).join(",")}">
    <div class="flex items-start justify-between gap-3"><h2 class="font-semibold">${esc(category.title.fa)}</h2><span data-lock class="rounded-full bg-white/10 px-2 py-1 text-[11px]">قفل</span></div>
    <p class="mt-3 text-xs text-cream/60" data-video-line>ویدیوهای دیده‌شده: ۰</p>
    <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div data-video-bar class="h-full bg-gold" style="width:0%"></div></div>
    <p class="mt-3 text-xs text-cream/60" data-quiz-line>چالش‌های قبول‌شده: ۰</p>
    <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div data-quiz-bar class="h-full bg-cream" style="width:0%"></div></div>
    <a data-enter="${category.id}" href="${base}/learn/${category.id}/" class="mt-4 hidden h-10 items-center justify-center rounded-2xl border-2 border-gold bg-navy px-4 text-sm font-semibold text-gold">ورود به دوره و مشاهده ویدیوها</a>
    <a data-buy-link="${category.id}" href="${base}/#courses" class="mt-4 inline-flex h-10 items-center rounded-2xl bg-cream px-4 text-sm font-semibold text-navy">ثبت‌نام این دوره (${toman(COURSE_PRICE)})</a>
  </article>`).join("");
  return layout(base, "home", "پنل کاربری | نکس‌سل", `
    <p class="text-xs tracking-[0.16em] text-gold">پنل کاربری</p>
    <h1 class="mt-2 text-3xl font-semibold">حساب، دوره‌ها و کیف دقیقه</h1>
    <div class="mt-4 flex gap-2 text-sm"><a href="${base}/dashboard/" data-tab-link="overview" class="rounded-xl bg-gold px-3 py-2 text-navy">نمای کلی</a><a href="${base}/dashboard/?tab=courses" data-tab-link="courses" class="rounded-xl px-3 py-2 ring-1 ring-gold/30">دوره‌های من</a><a href="${base}/dashboard/?tab=wallet" data-tab-link="wallet" class="rounded-xl px-3 py-2 ring-1 ring-gold/30">کیف پول</a></div>
    <section data-tab="overview" class="view active mt-6"><p class="text-sm text-cream/70">شمارهٔ ذخیره‌شده: <span data-phone-line dir="ltr">—</span></p><p class="mt-3 text-sm">دوره‌های فعال: <span data-owned-count>۰</span> از ۴</p></section>
    <section data-tab="courses" class="view mt-6"><h2 class="text-lg font-semibold">دوره‌های من</h2><div class="mt-4 grid gap-3 sm:grid-cols-2">${cards}</div></section>
    <section data-tab="wallet" class="view mt-6 rounded-[28px] border border-gold/40 p-5">
      <h2 class="text-lg font-semibold">کیف پول دقایق کوپایلوت هوش مصنوعی</h2>
      <p class="mt-4 text-4xl font-semibold text-gold"><span data-minute-balance>۰</span> دقیقه</p>
      <p class="mt-3 text-sm" data-ai-minutes>دقایق باقی‌مانده: ۰ دقیقه</p>
      <div class="mt-5 flex items-end justify-between"><p data-selected-minutes class="text-2xl font-semibold">۱٬۰۰۰ دقیقه</p><p data-minute-price class="text-gold">۳٬۰۰۰٬۰۰۰ تومان</p></div>
      <input id="minute-slider" type="range" min="1000" max="20000" step="1000" value="1000" class="mt-4 h-2 w-full accent-gold" aria-label="انتخاب دقیقه کوپایلوت" />
      <button type="button" id="buy-minutes" class="mt-5 h-12 rounded-2xl bg-gold px-5 text-sm font-semibold text-navy">خرید اعتبار هوش مصنوعی</button>
      <p class="mt-4 text-sm">کش‌بک تومانی: <span data-cashback>۰</span> تومان</p>
    </section>
  `);
}

function findCategory(id: string) {
  return categories.find((category) => category.id === id) ?? null;
}

export function learnCategoryPage(base: string, id: string) {
  const category = findCategory(id);
  if (!category) return null;
  const rows = lessonsOf(category);
  return layout(base, "academy", `${category.title.fa} | نکس‌سل`, `
    <p class="text-xs text-gold">${category.tierRequired === "free" ? "آموزش رایگان" : toman(COURSE_PRICE)}</p>
    <h1 class="mt-2 text-3xl font-semibold">${esc(category.title.fa)}</h1>
    <p class="mt-3 text-sm leading-7 text-cream/70">${esc(category.description.fa)}</p>
    <div class="mt-4" data-course="${category.id}">
      ${category.tierRequired === "pro" ? `<button type="button" data-buy="${category.id}" class="h-11 rounded-2xl bg-cream px-4 text-sm font-semibold text-navy">ثبت‌نام این دوره (${toman(COURSE_PRICE)})</button>` : ""}
    </div>
    <ol class="mt-6 space-y-3">${rows.map((row, index) => `<li class="glass rounded-2xl px-4 py-3"><a href="${base}/learn/${category.id}/${row.lesson.id}/" class="font-semibold">${fa.format(index + 1)}. ${esc(row.lesson.title.fa)}</a><p class="mt-1 text-xs text-cream/60">${esc(row.lesson.summary.fa)}</p></li>`).join("")}</ol>
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
    <a href="${base}/learn/${category.id}/" class="text-sm text-gold">بازگشت به ${esc(category.title.fa)}</a>
    <h1 class="mt-3 text-2xl font-semibold sm:text-3xl">${esc(row.lesson.title.fa)}</h1>
    <p class="mt-2 text-sm leading-7 text-cream/70">${esc(row.lesson.summary.fa)}</p>
    <div class="mt-4 aspect-video overflow-hidden rounded-2xl bg-black" data-course-gate="${category.id}" data-free="${category.tierRequired === "free" ? "yes" : "no"}">
      <iframe class="h-full w-full" title="ویدیوی آپارات" allowfullscreen data-aparat="${esc(row.lesson.aparat)}"></iframe>
      <p data-locked class="grid h-full place-items-center p-6 text-center text-sm">برای تماشای این درس، همین دوره را ثبت‌نام کنید.</p>
    </div>
    <form data-quiz data-lesson="${esc(row.lesson.id)}" class="mt-5 space-y-3">
      <label class="flex items-center gap-2 text-sm"><input name="watched" type="checkbox" class="size-4 accent-gold" /> ویدیو را دیدم</label>
      ${quiz}
      <button type="submit" class="h-11 rounded-2xl bg-gold px-4 text-sm font-semibold text-navy">ثبت چالش</button>
      <p data-quiz-result class="text-sm"></p>
    </form>
  `);
}

export function loginPage(base: string) {
  return layout(base, "home", "ورود | نکس‌سل", `<h1 class="text-3xl font-semibold">ورود با موبایل</h1><p class="mt-2 text-sm text-cream/70">هر کد ۵ رقمی قبول است. پرداخت واقعی انجام نمی‌شود.</p><form data-login class="mt-6 grid max-w-md gap-3"><input name="name" placeholder="نام" class="h-11 rounded-2xl border border-white/15 bg-white/5 px-3" /><input name="phone" dir="ltr" placeholder="09120000000" class="h-11 rounded-2xl border border-white/15 bg-white/5 px-3 text-left" /><input name="otp" dir="ltr" placeholder="12345" class="h-11 rounded-2xl border border-white/15 bg-white/5 px-3 text-left" /><button class="h-11 rounded-2xl bg-gold font-semibold text-navy">تایید و ورود</button><p data-login-note class="text-sm"></p></form>`);
}

export function progressPage(base: string) {
  return layout(base, "academy", "پیشرفت | نکس‌سل", `<h1 class="text-3xl font-semibold">درصد پیشرفت</h1><p class="mt-4 text-4xl font-semibold text-gold" data-progress-percent>۰٪</p><p class="mt-2 text-sm text-cream/70"><span data-progress-done>۰</span> چالش از <span data-progress-total>${fa.format(categories.reduce((sum, category) => sum + lessonsOf(category).length, 0))}</span> درس</p><a class="mt-6 inline-flex text-gold" href="${base}/academy/">ادامهٔ مسیر</a>`);
}

export function profilePage(base: string) {
  return layout(base, "home", "حساب | نکس‌سل", `<h1 class="text-3xl font-semibold">اطلاعات من</h1><p class="mt-4 text-sm">نام: <span data-profile-name>—</span></p><p class="mt-2 text-sm" dir="ltr">موبایل: <span data-phone-line>—</span></p><p class="mt-6"><a class="text-gold" href="${base}/dashboard/">رفتن به پنل کاربری</a></p>`);
}

export function notFoundPage(base: string) {
  return layout(base, "home", "پیدا نشد | نکس‌سل", `<h1 class="text-3xl font-semibold">این صفحه پیدا نشد.</h1><a class="mt-4 inline-flex text-gold" href="${base}/">بازگشت به خانه</a>`);
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
