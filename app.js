const KEY = "salespro-state-v1";
const COURSE_PRICE = 5_000_000;
const BUNDLE_PRICE = 16_000_000;
const GIFT_MINUTES = 500;
const STEP = 1_000;
const RATE = 3_000_000;

const COURSES = [
  {
    id: "online",
    title: "آموزش فروش آنلاین",
    blurb: "قیف، اعتماد در اینستاگرام و تبدیل توجه به گفتگوی خرید.",
    lessons: [
      lesson("online-lead", "لید، پراسپکت و مشتری", "sdh3pzo", "تفاوت سه مرحله قیف و عددی که عبور را نشان می‌دهد.", "لید یعنی چه کسی؟", ["هنوز فقط توجه نشان داده", "قرارداد را امضا کرده", "حتماً همین هفته می‌خرد"], 0),
      lesson("online-trust", "اعتماد فالوور", "Uftz9", "اعتماد قبل از پیشنهاد ساخته می‌شود، نه با تخفیف ناگهانی.", "اعتماد در صفحه از کجا شروع می‌شود؟", ["شاهد و ثبات پیام", "تخفیف همان ساعت اول", "پنهان کردن قیمت برای همیشه"], 0)
    ]
  },
  {
    id: "hozuri",
    title: "آموزش فروش حضوری",
    blurb: "زبان بدن، ورود به جلسه و بستن رو در رو.",
    lessons: [
      lesson("live-open", "زبان بدن فروش حضوری", "ocf64x3", "نشستن و دست‌ها قبل از حرف زدن درباره محصول.", "دست به سینه در شروع جلسه معمولاً…", ["فاصله می‌سازد", "معنی اعتماد فوری است", "جایگزین سؤال کشف نیاز است"], 0),
      lesson("live-tracy", "نکاتی برای فروش بیشتر", "k822635", "بستن جلسه بعد از فهم نیاز است، نه قبل از آن.", "بستن خوب جلسه یعنی…", ["قدم بعدی روشن است", "تخفیف بدون دلیل داده شده", "مشتری حرف نزده"], 0)
    ]
  },
  {
    id: "telefoni",
    title: "آموزش فروش تلفنی",
    blurb: "برخورد اول، نمونه مکالمه و نقشه راه تماس.",
    lessons: [
      lesson("phone-first", "اولین برخورد در کال‌سنتر", "y135t38", "نام، دلیل تماس و یک اجازه کوتاه.", "ثانیه‌های اول تماس باید…", ["نام و دلیل و اجازه باشد", "قیمت را همان اول بگوید", "سکوت طولانی باشد"], 0),
      lesson("phone-roadmap", "نقشه راه فروش تلفنی", "kjhf6jl", "هر تماس یک خروجی مشخص دارد: قرار، اطلاعات، یا پایان محترمانه.", "خروجی سالم یک تماس چیست؟", ["قدم بعدی با زمان", "فقط طول تماس", "خواندن اسکریپت بدون گوش دادن"], 0)
    ]
  },
  {
    id: "mozakerah",
    title: "آموزش مذاکره",
    blurb: "امتیاز در برابر امتیاز، قبل از اینکه تخفیف تنها ابزار شود.",
    lessons: [
      lesson("neg-principles", "اصول مذاکره فروش", "u83r56k", "امتیاز در برابر امتیاز، و مرزی که بدون تایید داده نمی‌شود.", "امتیاز یک‌طرفه یعنی…", ["چیزی داده‌اید و چیزی نگرفته‌اید", "مذاکره حرفه‌ای", "پایان موفق معامله"], 0),
      lesson("neg-objection", "مخالفت مشتری", "v43l4f5", "مخالفت را اول بفهمید، بعد جواب بدهید.", "اولین کار با مخالفت چیست؟", ["فهمیدن دلیل واقعی", "تخفیف فوری", "قطع تماس"], 0)
    ]
  }
];

function lesson(id, title, aparat, summary, question, options, answer) {
  const extra = [
    ["قدم بعدی باید…", ["مشخص و قابل مشاهده باشد", "مبهم بماند", "فقط به حس فروشنده تکیه کند"], 0],
    ["کدام کار این مرحله را خراب می‌کند؟", ["شتاب برای تخفیف بدون کشف نیاز", "یک سؤال تشخیصی", "جمع‌بندی کوتاه"], 0]
  ];
  return {
    id,
    title,
    aparat,
    summary,
    quiz: [{ q: question, options, answer }, ...extra.map(([q, opts, ans]) => ({ q, options: opts, answer: ans }))]
  };
}

function emptyState() {
  return { phone: "", courses: [], bundle: false, minutes: 0, cashback: 0, passed: [], watched: [] };
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw || typeof raw !== "object") return emptyState();
    return {
      phone: typeof raw.phone === "string" ? raw.phone : "",
      courses: Array.isArray(raw.courses) ? raw.courses.filter((id) => COURSES.some((course) => course.id === id)) : [],
      bundle: Boolean(raw.bundle),
      minutes: Number.isFinite(raw.minutes) ? Math.max(0, Math.round(raw.minutes)) : 0,
      cashback: Number.isFinite(raw.cashback) ? Math.max(0, Math.round(raw.cashback)) : 0,
      passed: Array.isArray(raw.passed) ? raw.passed.filter((id) => typeof id === "string") : [],
      watched: Array.isArray(raw.watched) ? raw.watched.filter((id) => typeof id === "string") : []
    };
  } catch {
    return emptyState();
  }
}

let state = load();
let activeCourse = null;
let activeLesson = null;

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
  render();
}

function fa(value) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function toman(value) {
  return `${fa(value)} تومان`;
}

function owns(id) {
  return state.bundle || state.courses.includes(id);
}

function findCourse(id) {
  return COURSES.find((course) => course.id === id);
}

function findLesson(course, lessonId) {
  return course.lessons.find((item) => item.id === lessonId);
}

function toast(message) {
  const node = document.querySelector("#toast");
  node.textContent = message;
  node.classList.remove("hidden");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.add("hidden"), 2400);
}

function show(name) {
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  document.querySelector(`#view-${name}`).classList.add("active");
  if (name === "home") location.hash = "courses";
  if (name === "dashboard") location.hash = "dashboard";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function progressOf(course) {
  const total = course.lessons.length;
  const videos = course.lessons.filter((item) => state.watched.includes(item.id)).length;
  const quizzes = course.lessons.filter((item) => state.passed.includes(item.id)).length;
  return {
    videos,
    quizzes,
    total,
    videoPercent: Math.round((videos / total) * 100),
    quizPercent: Math.round((quizzes / total) * 100)
  };
}

function renderCourses() {
  const root = document.querySelector("#courses");
  root.innerHTML = COURSES.map((course) => {
    const owned = owns(course.id);
    return `
      <article class="flex flex-col rounded-[28px] border border-white/10 p-5" data-course="${course.id}">
        <h2 class="text-lg font-bold">${course.title}</h2>
        <p class="mt-2 flex-1 text-sm leading-7 text-white/70">${course.blurb}</p>
        <p class="mt-4 text-2xl font-bold text-gold" data-course-price="${COURSE_PRICE}">${toman(COURSE_PRICE)}</p>
        <p class="mt-1 text-xs text-white/50">${fa(course.lessons.length)} درس ویدیویی</p>
        ${owned
          ? `<button type="button" data-enter="${course.id}" class="mt-4 h-11 rounded-2xl border-2 border-gold bg-navy text-sm font-bold text-gold">ورود به دوره و مشاهده ویدیوها</button>`
          : `<button type="button" data-buy="${course.id}" class="mt-4 h-11 rounded-2xl bg-cream text-sm font-bold text-navy">ثبت‌نام این دوره (${toman(COURSE_PRICE)})</button>`}
      </article>`;
  }).join("");
}

function renderDashboard() {
  document.querySelector("#phone").value = state.phone;
  document.querySelector("#phone-line").textContent = state.phone ? `موبایل ثبت‌شده: ${state.phone}` : "هنوز شماره‌ای ذخیره نشده است.";
  document.querySelector("#minute-balance").textContent = fa(state.minutes);
  document.querySelector("#cashback").textContent = fa(state.cashback);
  document.querySelector("#my-courses").innerHTML = COURSES.map((course) => {
    const owned = owns(course.id);
    const progress = progressOf(course);
    return `
      <article class="rounded-[24px] border border-white/10 p-4" data-owned="${owned ? "yes" : "no"}" data-dash-course="${course.id}">
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-bold">${course.title}</h3>
          <span class="rounded-full px-2 py-1 text-[11px] font-bold ${owned ? "bg-gold text-navy" : "bg-white/10 text-white/60"}">${owned ? "خریداری شده" : "قفل"}</span>
        </div>
        ${owned ? `
          <p class="mt-3 text-xs text-white/60">ویدیوهای دیده‌شده: ${fa(progress.videos)} از ${fa(progress.total)}</p>
          <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10" data-video-progress="${progress.videoPercent}"><div class="h-full bg-gold" style="width:${progress.videoPercent}%"></div></div>
          <p class="mt-3 text-xs text-white/60">چالش‌های قبول‌شده: ${fa(progress.quizzes)} از ${fa(progress.total)}</p>
          <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10" data-quiz-progress="${progress.quizPercent}"><div class="h-full bg-cream" style="width:${progress.quizPercent}%"></div></div>
          <button type="button" data-enter="${course.id}" class="mt-4 h-10 rounded-2xl border-2 border-gold bg-navy px-4 text-sm font-bold text-gold">ورود به دوره و مشاهده ویدیوها</button>
        ` : `<p class="mt-3 text-sm text-white/60">برای باز شدن ویدیوها این دوره را ثبت‌نام کنید.</p>
          <button type="button" data-buy="${course.id}" class="mt-4 h-10 rounded-2xl bg-cream px-4 text-sm font-bold text-navy">ثبت‌نام این دوره (${toman(COURSE_PRICE)})</button>`}
      </article>`;
  }).join("");
}

function renderBundle() {
  const button = document.querySelector("#buy-bundle");
  button.disabled = state.bundle;
  button.textContent = state.bundle ? "باندل فعال است" : "خرید یکجای تمام دوره‌ها";
  button.classList.toggle("opacity-60", state.bundle);
}

function renderSlider() {
  const slider = document.querySelector("#minute-slider");
  const amount = Number(slider.value);
  document.querySelector("#minute-selected").textContent = `${fa(amount)} دقیقه`;
  document.querySelector("#minute-price").textContent = toman((amount / STEP) * RATE);
  document.querySelector("#minute-price").dataset.minutePrice = String((amount / STEP) * RATE);
}

function renderPlayer() {
  const course = findCourse(activeCourse);
  if (!course) return;
  document.querySelector("#player-title").textContent = course.title;
  document.querySelector("#player-lessons").innerHTML = course.lessons.map((item, index) => {
    const passed = state.passed.includes(item.id);
    return `<button type="button" data-lesson="${item.id}" class="rounded-2xl border border-white/10 px-4 py-3 text-start text-sm ${activeLesson === item.id ? "border-gold" : ""}">
      <span class="font-bold">${fa(index + 1)}. ${item.title}</span>
      <span class="mt-1 block text-xs text-white/60">${passed ? "چالش قبول شده" : "آماده پخش"}</span>
    </button>`;
  }).join("");
  const current = findLesson(course, activeLesson) || course.lessons[0];
  activeLesson = current.id;
  const stage = document.querySelector("#lesson-stage");
  stage.classList.remove("hidden");
  document.querySelector("#lesson-title").textContent = current.title;
  document.querySelector("#lesson-summary").textContent = current.summary;
  const frame = document.querySelector("#lesson-frame");
  const src = `https://www.aparat.com/video/video/embed/videohash/${current.aparat}/vt/frame`;
  if (frame.src !== src) frame.src = src;
  document.querySelector("#lesson-watched").checked = state.watched.includes(current.id);
  document.querySelector("#quiz-result").textContent = state.passed.includes(current.id) ? "این چالش را قبلاً قبول کرده‌اید." : "";
  document.querySelector("#quiz").innerHTML = current.quiz.map((item, qIndex) => `
    <fieldset class="rounded-2xl border border-white/10 p-3">
      <legend class="px-1 text-sm font-semibold">${item.q}</legend>
      ${item.options.map((option, oIndex) => `
        <label class="mt-2 flex items-center gap-2 text-sm">
          <input type="radio" name="q${qIndex}" value="${oIndex}" class="accent-gold" />
          <span>${option}</span>
        </label>`).join("")}
    </fieldset>`).join("");
}

function render() {
  renderCourses();
  renderBundle();
  renderDashboard();
  renderSlider();
  if (document.querySelector("#view-player").classList.contains("active") && activeCourse) renderPlayer();
}

function addCashback(price) {
  state.cashback += Math.round(price * 0.05);
}

function buyCourse(id) {
  if (owns(id)) return;
  state.courses.push(id);
  addCashback(COURSE_PRICE);
  save();
  toast("ثبت‌نام دوره روی همین مرورگر ذخیره شد.");
}

function buyBundle() {
  if (state.bundle) return;
  state.bundle = true;
  state.courses = COURSES.map((course) => course.id);
  state.minutes += GIFT_MINUTES;
  addCashback(BUNDLE_PRICE);
  save();
  toast("باندل فعال شد و ۵۰۰ دقیقه هدیه به موجودی اضافه شد.");
}

function buyMinutes() {
  const amount = Number(document.querySelector("#minute-slider").value);
  const price = (amount / STEP) * RATE;
  state.minutes += amount;
  addCashback(price);
  save();
  toast(`${fa(amount)} دقیقه به کیف کوپایلوت اضافه شد.`);
}

function openCourse(id) {
  if (!owns(id)) {
    show("home");
    return;
  }
  activeCourse = id;
  activeLesson = findCourse(id).lessons[0].id;
  show("player");
  renderPlayer();
}

function submitQuiz() {
  const course = findCourse(activeCourse);
  const current = findLesson(course, activeLesson);
  if (!document.querySelector("#lesson-watched").checked) {
    document.querySelector("#quiz-result").textContent = "اول تماشای ویدیو را علامت بزنید.";
    return;
  }
  if (!state.watched.includes(current.id)) state.watched.push(current.id);
  let correct = 0;
  current.quiz.forEach((item, index) => {
    const picked = document.querySelector(`input[name="q${index}"]:checked`);
    if (picked && Number(picked.value) === item.answer) correct += 1;
  });
  const result = document.querySelector("#quiz-result");
  if (correct >= 2) {
    if (!state.passed.includes(current.id)) state.passed.push(current.id);
    save();
    result.textContent = `${fa(correct)} از ${fa(3)} درست بود. چالش قبول شد و نوار پیشرفت دوره جلو رفت.`;
  } else {
    save();
    result.textContent = `${fa(correct)} از ${fa(3)} درست بود. حداقل دو پاسخ درست لازم است.`;
  }
}

document.addEventListener("click", (event) => {
  const go = event.target.closest("[data-go]");
  if (go) {
    event.preventDefault();
    show(go.dataset.go);
    return;
  }
  const buy = event.target.closest("[data-buy]");
  if (buy) {
    buyCourse(buy.dataset.buy);
    return;
  }
  const enter = event.target.closest("[data-enter]");
  if (enter) {
    openCourse(enter.dataset.enter);
    return;
  }
  const lessonButton = event.target.closest("[data-lesson]");
  if (lessonButton) {
    activeLesson = lessonButton.dataset.lesson;
    renderPlayer();
  }
});

document.querySelector("#buy-bundle").addEventListener("click", buyBundle);
document.querySelector("#buy-minutes").addEventListener("click", buyMinutes);
document.querySelector("#minute-slider").addEventListener("input", renderSlider);
document.querySelector("#quiz-submit").addEventListener("click", submitQuiz);
document.querySelector("#lesson-watched").addEventListener("change", () => {
  if (!activeLesson) return;
  const checked = document.querySelector("#lesson-watched").checked;
  if (checked && !state.watched.includes(activeLesson)) state.watched.push(activeLesson);
  if (!checked) state.watched = state.watched.filter((id) => id !== activeLesson);
  localStorage.setItem(KEY, JSON.stringify(state));
  renderDashboard();
});
document.querySelector("#save-phone").addEventListener("click", () => {
  const phone = document.querySelector("#phone").value.trim();
  if (!/^09\d{9}$/.test(phone)) {
    toast("شماره را با ۰۹ و ۱۱ رقم وارد کنید.");
    return;
  }
  state.phone = phone;
  save();
  toast("شماره ذخیره شد.");
});

window.addEventListener("hashchange", () => {
  if (location.hash === "#dashboard") show("dashboard");
});

render();
if (location.hash === "#dashboard") show("dashboard");
