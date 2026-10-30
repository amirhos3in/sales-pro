(function () {
  const KEY = "salespro-pricing-v1";
  const PROGRESS = "nexsell-progress-v1";
  const SESSION = "academy_user_session";
  const COURSE_PRICE = 5000000;
  const BUNDLE_PRICE = 15000000;
  const STEP = 1000;
  const RATE = 3000000;
  const PAID = ["online", "hozuri", "telefoni", "mozakerah"];
  const base = document.body.dataset.base || "";
  const AVATARS = {
    navy: ["#0B132B", "#D4AF37"],
    gold: ["#D4AF37", "#0B132B"],
    ink: ["#1C2541", "#F6F1E4"],
    sand: ["#F3E5AB", "#0B132B"],
    pine: ["#1F4D3A", "#F3E5AB"],
    wine: ["#6E2B3A", "#F6F1E4"],
  };
  const TABS = ["overview", "profile", "courses", "wallet", "audits", "tickets"];

  const fa = new Intl.NumberFormat("fa-IR");
  function toman(value) {
    return fa.format(value) + " تومان";
  }

  function escText(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function emptyPricing() {
    return { courses: [], bundle: false, minutes: 0, cashbackToman: 0, referrals: 0, referralCode: "" };
  }

  function readPricing() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        const extra = Number(localStorage.getItem("aiMinutes"));
        return Number.isFinite(extra) && extra > 0 ? { ...emptyPricing(), minutes: Math.round(extra) } : emptyPricing();
      }
      const parsed = JSON.parse(raw);
      let minutes = Number.isFinite(parsed.minutes) ? Math.max(0, Math.round(parsed.minutes)) : 0;
      if (minutes === 0) {
        const extra = Number(localStorage.getItem("aiMinutes"));
        if (Number.isFinite(extra) && extra > 0) minutes = Math.round(extra);
      }
      return {
        courses: Array.isArray(parsed.courses) ? parsed.courses.filter((id) => PAID.includes(id)) : [],
        bundle: Boolean(parsed.bundle),
        minutes,
        cashbackToman: Number.isFinite(parsed.cashbackToman) ? Math.max(0, Math.round(parsed.cashbackToman)) : 0,
        referrals: Number.isFinite(parsed.referrals) ? parsed.referrals : 0,
        referralCode: typeof parsed.referralCode === "string" ? parsed.referralCode : "",
      };
    } catch {
      return emptyPricing();
    }
  }

  function writePricing(next) {
    localStorage.setItem(KEY, JSON.stringify(next));
    localStorage.setItem("aiMinutes", String(next.minutes));
    render();
  }

  function remaining(state) {
    return state.minutes > 0 ? state.minutes : 0;
  }

  function owns(state, id) {
    return id === "free" || state.bundle || state.courses.includes(id);
  }

  function readProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(PROGRESS) || "{}");
      return {
        watched: Array.isArray(raw.watched) ? raw.watched : [],
        passed: Array.isArray(raw.passed) ? raw.passed : [],
      };
    } catch {
      return { watched: [], passed: [] };
    }
  }

  function writeProgress(next) {
    localStorage.setItem(PROGRESS, JSON.stringify(next));
    render();
  }

  function readSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION) || "null");
    } catch {
      return null;
    }
  }

  function writeSession(session) {
    localStorage.setItem(SESSION, JSON.stringify(session));
    render();
  }

  function currentTab() {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get("tab");
    if (TABS.includes(fromQuery)) return fromQuery;
    const seeded = document.querySelector("[data-user-panel]");
    if (seeded && TABS.includes(seeded.dataset.initialTab)) return seeded.dataset.initialTab;
    const path = location.pathname.replace(/\/$/, "");
    if (path.endsWith("/profile") || path.endsWith("/me")) return "profile";
    return "overview";
  }

  const panelPath = location.pathname.replace(/\/$/, "");
  if (panelPath.endsWith("/dashboard")) {
    const session = readSession();
    if (!session || !session.isAuthenticated || !session.currentUser) {
      location.replace(base + "/login/");
      return;
    }
  }

  function render() {
    const state = readPricing();
    const progress = readProgress();
    const left = remaining(state);
    document.querySelectorAll("[data-ai-minutes]").forEach((node) => {
      node.textContent = "دقایق باقی‌مانده: " + fa.format(left) + " دقیقه";
      node.dataset.aiMinutes = String(left);
    });
    document.querySelectorAll("[data-minute-balance]").forEach((node) => {
      node.textContent = fa.format(state.minutes);
    });
    document.querySelectorAll("[data-cashback]").forEach((node) => {
      node.textContent = fa.format(state.cashbackToman);
    });
    document.querySelectorAll("[data-owned-count]").forEach((node) => {
      node.textContent = fa.format(PAID.filter((id) => owns(state, id)).length);
    });
    const session = readSession();
    const user = session && session.currentUser ? session.currentUser : null;
    const phone = user ? user.phone : "";
    const name = user ? user.name : "";
    document.querySelectorAll("[data-phone-line]").forEach((node) => {
      node.textContent = phone || "—";
    });
    document.querySelectorAll("[data-profile-name], [data-account-name]").forEach((node) => {
      node.textContent = name || "—";
    });
    const signedIn = Boolean(session && session.isAuthenticated && user && name);
    document.querySelectorAll("[data-auth-guest]").forEach((node) => {
      node.hidden = signedIn;
    });
    document.querySelectorAll("[data-auth-user]").forEach((node) => {
      node.hidden = !signedIn;
      if (node.dataset.authUser === "chip") node.style.display = signedIn ? "inline-flex" : "none";
    });
    document.querySelectorAll("[data-header-name]").forEach((node) => {
      node.textContent = name || "کاربر";
    });
    document.querySelectorAll("[data-header-letter]").forEach((node) => {
      node.textContent = (name || "ن").slice(0, 1);
    });
    const ownedCount = PAID.filter((id) => owns(state, id)).length;
    const status = state.bundle ? "هر چهار مسیر" : ownedCount ? fa.format(ownedCount) + " مسیر" : "بدون دوره";
    const statusLong = state.bundle ? "هر چهار مسیر" : ownedCount ? fa.format(ownedCount) + " مسیر با دسترسی آزمایشی" : "هنوز دسترسی آزمایشی ثبت نشده";
    document.querySelectorAll("[data-status-badge]").forEach((node) => {
      node.textContent = node.dataset.statusBadge === "short" ? status : statusLong;
    });
    document.querySelectorAll("[data-gift-badge]").forEach((node) => node.remove());
    document.querySelectorAll("[data-owned-hint]").forEach((node) => {
      node.textContent = state.bundle ? "باندل کامل" : "از ۴ دوره تخصصی";
    });
    document.querySelectorAll("[data-minute-hint]").forEach((node) => {
      node.textContent = "جدا از دوره";
    });
    document.querySelectorAll("[data-wallet-lead]").forEach((node) => {
      node.textContent = "تحلیل تماس تیم جدا از دوره است.";
    });
    document.querySelectorAll("[data-hello]").forEach((node) => {
      node.textContent = new Date().getHours() < 17 ? "صبح بخیر" : "عصر بخیر";
    });
    document.querySelectorAll("[data-course-status]").forEach((row) => {
      const active = owns(state, row.dataset.courseStatus);
      const label = row.querySelector("[data-owned-label]");
      if (!label) return;
      label.textContent = active ? "دسترسی آزمایشی" : "ثبت نشده";
      label.className = active ? "text-gold" : "text-cream/50";
    });
    document.querySelectorAll("[data-bundle-label]").forEach((node) => {
      node.textContent = state.bundle ? "دسترسی آزمایشی هر چهار مسیر روی همین مرورگر است" : "هر چهار مسیر، " + toman(BUNDLE_PRICE);
    });
    document.querySelectorAll("[data-bundle-buy]").forEach((node) => node.classList.toggle("hidden", state.bundle));
    const codeNode = document.querySelector("[data-referral-code]");
    if (codeNode) {
      if (!state.referralCode && document.querySelector("[data-user-panel]")) {
        state.referralCode = "NX" + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem(KEY, JSON.stringify(state));
      }
      codeNode.textContent = state.referralCode || "—";
    }
    document.querySelectorAll("[data-referral-count]").forEach((node) => {
      node.textContent = fa.format(state.referrals || 0);
    });
    document.querySelectorAll("[data-wallet-balance]").forEach((node) => {
      node.textContent = fa.format(user && user.walletBalance ? user.walletBalance : 0);
    });
    paintAvatar(user);
    paintTransactions(user);
    paintLiveTickets(user);
    paintProfile(user);

    paintAcademyCards(state, progress, signedIn);

    document.querySelectorAll("[data-course]").forEach((card) => {
      const id = card.dataset.course;
      const paid = card.dataset.paid !== "no";
      const open = !paid || owns(state, id);
      const enter = card.querySelector("[data-enter]");
      if (enter) {
        enter.classList.toggle("hidden", !open);
        enter.classList.toggle("inline-flex", open);
      }
    });
    paintPathButtons();
    paintMinuteOffer();

    document.querySelectorAll("[data-dash-course]").forEach((card) => {
      const id = card.dataset.dashCourse;
      const open = owns(state, id);
      const lessons = card.parentElement ? Array.from(document.querySelectorAll("[data-lesson]")).length : 0;
      const lock = card.querySelector("[data-lock]");
      if (lock) {
        lock.textContent = open ? "دسترسی آزمایشی" : "قفل";
        lock.className = open ? "rounded-full bg-gold px-2 py-1 text-[11px] font-semibold text-navy" : "rounded-full bg-white/10 px-2 py-1 text-[11px]";
      }
      const enter = card.querySelector("[data-enter]");
      const buy = card.querySelector("[data-buy-link]");
      if (enter) {
        enter.classList.toggle("hidden", !open);
        enter.classList.toggle("inline-flex", open);
      }
      if (buy) buy.classList.toggle("hidden", open);
    });

    document.querySelectorAll("[data-course-gate]").forEach((gate) => {
      const open = gate.dataset.free === "yes" || gate.dataset.preview === "yes" || owns(state, gate.dataset.courseGate);
      const frame = gate.querySelector("iframe");
      const locked = gate.querySelector("[data-locked]");
      if (!frame) return;
      if (open) {
        const src = "https://www.aparat.com/video/video/embed/videohash/" + frame.dataset.aparat + "/vt/frame";
        if (frame.getAttribute("src") !== src) frame.setAttribute("src", src);
        frame.classList.remove("hidden");
        if (locked) locked.classList.add("hidden");
      } else {
        frame.removeAttribute("src");
        frame.classList.add("hidden");
        if (locked) locked.classList.remove("hidden");
      }
    });

    paintSlider();
    paintDashboardProgress(progress);
    paintTotals(progress);
    paintTabs();
    paintCart();
  }

  function paintDashboardProgress(progress) {
    document.querySelectorAll("[data-dash-course]").forEach((card) => {
      const unique = (card.dataset.lessons || "").split(",").filter(Boolean);
      const total = unique.length || 1;
      const videos = unique.filter((lessonId) => progress.watched.includes(lessonId)).length;
      const quizzes = unique.filter((lessonId) => progress.passed.includes(lessonId)).length;
      const videoLine = card.querySelector("[data-video-line]");
      const quizLine = card.querySelector("[data-quiz-line]");
      const videoBar = card.querySelector("[data-video-bar]");
      const quizBar = card.querySelector("[data-quiz-bar]");
      if (videoLine) videoLine.textContent = "ویدیوهای دیده‌شده: " + fa.format(videos) + " از " + fa.format(unique.length);
      if (quizLine) quizLine.textContent = "چالش‌های قبول‌شده: " + fa.format(quizzes) + " از " + fa.format(unique.length);
      if (videoBar) videoBar.style.width = Math.round((videos / total) * 100) + "%";
      if (quizBar) quizBar.style.width = Math.round((quizzes / total) * 100) + "%";
    });
  }

  function paintTotals(progress) {
    const totalNode = document.querySelector("[data-progress-total]");
    const total = totalNode ? Number(String(totalNode.textContent).replace(/[^\d]/g, "")) : 0;
    const done = progress.passed.length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const percentNode = document.querySelector("[data-progress-percent]");
    const doneNode = document.querySelector("[data-progress-done]");
    if (percentNode) percentNode.textContent = fa.format(percent) + "٪";
    if (doneNode) doneNode.textContent = fa.format(done);
  }

  function paintSlider() {
    document.querySelectorAll("#minute-slider").forEach((slider) => {
      const amount = Number(slider.value);
      const wrap = slider.parentElement;
      const selected = wrap && wrap.querySelector("[data-selected-minutes]");
      const price = wrap && wrap.querySelector("[data-minute-price]");
      if (selected) selected.textContent = fa.format(amount) + " دقیقه";
      if (price) {
        price.textContent = toman((amount / STEP) * RATE);
        price.dataset.minutePrice = String((amount / STEP) * RATE);
      }
    });
  }

  function paintAvatar(user) {
    const id = user && AVATARS[user.avatarId] ? user.avatarId : "navy";
    const colors = AVATARS[id];
    const letter = user && user.name ? user.name.slice(0, 1) : "ن";
    document.querySelectorAll("span[data-avatar]").forEach((node) => {
      node.textContent = letter;
      node.style.background = colors[0];
      node.style.color = colors[1];
    });
    document.querySelectorAll("[data-avatar-pick]").forEach((node) => {
      node.classList.toggle("ring-2", node.dataset.avatarPick === id);
      node.classList.toggle("ring-gold", node.dataset.avatarPick === id);
      node.setAttribute("aria-pressed", node.dataset.avatarPick === id ? "true" : "false");
    });
  }

  function paintTransactions(user) {
    const body = document.querySelector("[data-tx-body]");
    const empty = document.querySelector("[data-tx-empty]");
    if (!body) return;
    const rows = user && Array.isArray(user.transactions) ? user.transactions : [];
    const stamp = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" });
    body.innerHTML = rows.map((row) => {
      const signed = Number(row.amount) || 0;
      const tone = signed < 0 ? "text-rose-300" : "text-emerald-300";
      const when = row.at ? stamp.format(new Date(row.at)) : "";
      return "<tr class=\"border-t border-gold/20\"><td class=\"px-3 py-3\">" + escText(row.title || "تراکنش") + "</td><td class=\"px-3 py-3 font-medium " + tone + "\">" + (signed > 0 ? "+" : "") + fa.format(signed) + " تومان</td><td class=\"px-3 py-3 text-cream/60\">" + escText(when) + "</td></tr>";
    }).join("");
    if (empty) empty.classList.toggle("hidden", rows.length > 0);
  }

  function paintLiveTickets(user) {
    const list = document.querySelector("[data-live-tickets]");
    if (!list) return;
    const rows = user && Array.isArray(user.tickets) ? user.tickets : [];
    list.innerHTML = rows.map((ticket) => "<article class=\"glass flex flex-wrap items-center justify-between gap-3 rounded-[28px] p-5\"><div><p class=\"text-xs text-cream/50\">" + escText(ticket.id) + "</p><h2 class=\"mt-1 font-semibold\">" + escText(ticket.subject) + "</h2></div><span class=\"rounded-full bg-gold px-3 py-1 text-xs font-medium text-navy\">روی همین مرورگر</span></article>").join("");
    const empty = document.querySelector("[data-ticket-empty]");
    if (empty) empty.classList.toggle("hidden", rows.length > 0);
  }

  function paintProfile(user) {
    const form = document.querySelector("[data-profile-form]");
    if (!form || form.dataset.ready === "yes" || !user) return;
    form.elements.name.value = user.name || "";
    form.elements.phone.value = user.phone || "";
    form.elements.email.value = user.email || "";
    form.elements.jobTitle.value = user.jobTitle || "";
    form.elements.bio.value = user.bio || "";
    form.dataset.picked = user.avatarId || "navy";
    form.dataset.ready = "yes";
  }

  function paintTabs() {
    const tab = currentTab();
    document.querySelectorAll("[data-tab]").forEach((node) => {
      node.classList.toggle("active", node.dataset.tab === tab);
    });
    document.querySelectorAll("[data-tab-link]").forEach((node) => {
      const on = node.dataset.tabLink === tab;
      node.classList.toggle("bg-gold", on);
      node.classList.toggle("text-navy", on);
      node.classList.toggle("font-medium", on);
      if (on) node.setAttribute("aria-current", "page");
      else node.removeAttribute("aria-current");
    });
    if (typeof mountReveal === "function") mountReveal();
  }

  function readCatalog() {
    const node = document.querySelector("#course-catalog");
    if (!node) return [];
    try {
      const parsed = JSON.parse(node.textContent || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function paintAcademyCards(state, progress, signedIn) {
    const catalog = readCatalog();
    document.querySelectorAll("[data-course-card]").forEach((card) => {
      const id = card.dataset.courseCard;
      const meta = catalog.find((item) => item.id === id);
      const paid = card.dataset.paid !== "no";
      const owned = paid && (state.bundle || state.courses.includes(id));
      const lessons = meta && Array.isArray(meta.lessons) ? meta.lessons : [];
      const total = lessons.length;
      const done = lessons.filter((lesson) => progress.passed.includes(lesson.id)).length;
      const percent = total ? Math.round((done / total) * 100) : 0;
      const next = lessons.find((lesson) => !progress.passed.includes(lesson.id)) || lessons[0];
      const resumeHref = next ? base + "/learn/" + id + "/" + next.id + "/" : base + "/learn/" + id + "/";
      const showLearn = paid ? owned : signedIn;
      const showLocked = paid && !owned;
      const showGuest = !paid && !signedIn;
      card.dataset.cardMode = showLocked ? "locked" : showLearn ? "learn" : "login";
      const price = card.querySelector("[data-card-price]");
      const progressBox = card.querySelector("[data-card-progress]");
      const overview = card.querySelector("[data-card-overview]");
      const buy = card.querySelector("[data-card-buy]");
      const resume = card.querySelector("[data-card-resume]");
      const guest = card.querySelector("[data-card-guest]");
      if (price) price.classList.toggle("hidden", !showLocked);
      if (progressBox) progressBox.classList.toggle("hidden", !showLearn);
      if (overview) overview.classList.toggle("hidden", !showLocked);
      if (buy) buy.classList.toggle("hidden", !showLocked);
      if (guest) guest.classList.toggle("hidden", !showGuest);
      if (resume) {
        resume.classList.toggle("hidden", !showLearn);
        resume.classList.toggle("inline-flex", showLearn);
        resume.href = resumeHref;
        if (!paid) resume.textContent = done > 0 ? "ادامه یادگیری" : "شروع یادگیری";
      }
      const fraction = card.querySelector("[data-card-fraction]");
      if (fraction) fraction.textContent = fa.format(done) + " از " + fa.format(total) + " درس تکمیل‌شده - " + fa.format(percent) + "٪";
      const learning = card.querySelector('[data-card-status="learning"]');
      const complete = card.querySelector('[data-card-status="done"]');
      if (learning) learning.classList.toggle("hidden", percent === 100);
      if (complete) complete.classList.toggle("hidden", percent !== 100);
      const bar = card.querySelector("[data-card-bar]");
      if (bar) {
        bar.style.width = percent + "%";
        const track = bar.parentElement;
        if (track) {
          track.setAttribute("role", "progressbar");
          track.setAttribute("aria-valuenow", String(percent));
          track.setAttribute("aria-valuemin", "0");
          track.setAttribute("aria-valuemax", "100");
          track.setAttribute("aria-label", "پیشرفت دوره");
        }
      }
    });
  }

  function openOverview(id) {
    const dialog = document.querySelector("#course-overview");
    const meta = readCatalog().find((item) => item.id === id);
    if (!dialog || !meta) return;
    const title = dialog.querySelector("[data-ov-title]");
    const desc = dialog.querySelector("[data-ov-desc]");
    const list = dialog.querySelector("[data-ov-lessons]");
    const buy = dialog.querySelector("[data-ov-buy]");
    const price = dialog.querySelector("[data-ov-price]");
    if (title) title.textContent = meta.title || "";
    if (desc) desc.textContent = meta.description || "";
    if (list) {
      const lessons = Array.isArray(meta.lessons) ? meta.lessons : [];
      list.innerHTML = lessons.map((lesson, index) => {
        const mark = index === 0 ? "بدون سبد" : "قفل";
        return '<li class="flex items-center justify-between gap-3 rounded-2xl border border-white/10 px-3 py-3 text-sm"><span>' + fa.format(index + 1) + ". " + escText(lesson.title) + '</span><span class="text-xs text-cream/50">' + mark + "</span></li>";
      }).join("");
    }
    if (buy) buy.dataset.buy = id;
    if (price) price.textContent = toman(COURSE_PRICE);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeOverview() {
    const dialog = document.querySelector("#course-overview");
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  const CART_KEY = "nexsell-cart-v1";
  const ORDERS_KEY = "nexsell-orders-v1";
  const COURSE_TITLES = {
    online: "آموزش فروش آنلاین",
    hozuri: "آموزش فروش حضوری",
    telefoni: "آموزش فروش تلفنی",
    mozakerah: "آموزش مذاکره",
  };
  const SERVICES = {
    script: {
      title: "بازنویسی اسکریپت تیم فروش",
      fields: [
        { name: "team", label: "اندازه تیم فروش", type: "text", placeholder: "مثلاً ۸ نفر" },
        { name: "calls", label: "نوع تماس", type: "select", options: ["تماس ورودی", "تماس سرد", "هر دو"] },
        { name: "objections", label: "اعتراض‌های پرتکرار", type: "textarea", placeholder: "قیمت، تخفیف، باید فکر کنم" },
        { name: "deadline", label: "بازۀ تحویل", type: "text", placeholder: "مثلاً تا پایان ماه" },
      ],
    },
    workshop: {
      title: "آموزش حضوری پرسنل",
      fields: [
        { name: "headcount", label: "تعداد شرکت‌کننده‌ها", type: "text", placeholder: "مثلاً ۱۲ نفر" },
        { name: "city", label: "شهر برگزاری", type: "text", placeholder: "تهران" },
        { name: "topics", label: "موضوع‌های لازم", type: "textarea", placeholder: "زبان بدن، نیازسنجی، دمو" },
        { name: "when", label: "بازۀ زمانی کارگاه", type: "text", placeholder: "هفته سوم آبان" },
      ],
    },
    funnel: {
      title: "بهینه‌سازی قیف فروش",
      fields: [
        { name: "channel", label: "کانال اصلی", type: "select", options: ["اینستاگرام", "سایت", "تماس تلفنی", "چند کانال"] },
        { name: "offer", label: "پیشنهاد فعلی", type: "textarea", placeholder: "محصول یا خدمتی که می‌فروشید" },
        { name: "metric", label: "شاخصی که باید بهتر شود", type: "text", placeholder: "مثلاً نرخ پاسخ دایرکت" },
        { name: "deadline", label: "مهلت", type: "text", placeholder: "مثلاً ۳۰ روز" },
      ],
    },
    mentor: {
      title: "منتورینگ مدیر فروش",
      fields: [
        { name: "role", label: "نقش شما", type: "text", placeholder: "مدیر فروش" },
        { name: "team", label: "اندازه تیم", type: "text", placeholder: "مثلاً ۵ نفر" },
        { name: "pain", label: "مسئله اصلی تیم", type: "textarea", placeholder: "کجا معامله می‌ایستد؟" },
        { name: "start", label: "شروع همکاری", type: "text", placeholder: "ماه آینده" },
      ],
    },
  };
  let serviceId = "";
  let serviceStep = "form";
  let serviceAnswers = [];
  let toastTimer = 0;

  function digits(value) {
    return String(value || "").replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace(/[^\d]/g, "");
  }

  function clampMinutePick(value) {
    const snapped = Math.round(Number(value) / STEP) * STEP;
    return Math.min(20000, Math.max(STEP, snapped || STEP));
  }

  function minuteCost(amount) {
    return (clampMinutePick(amount) / STEP) * RATE;
  }

  function readCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
      return { items: Array.isArray(parsed.items) ? parsed.items : [] };
    } catch {
      return { items: [] };
    }
  }

  function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify({ items: cart.items }));
    paintCart();
    paintPathButtons();
    paintMinuteOffer();
  }

  function paintPathButtons() {
    const items = readCart().items;
    const held = new Set(items.filter((item) => item.type === "course").map((item) => item.courseId));
    document.querySelectorAll("[data-buy]").forEach((buy) => {
      const id = buy.dataset.buy;
      if (!PAID.includes(id)) return;
      const inCart = held.has(id);
      buy.disabled = inCart;
      buy.textContent = inCart ? "در سبد" : "افزودن به سبد";
    });
    const bundleHeld = items.some((item) => item.type === "bundle");
    document.querySelectorAll("#buy-bundle").forEach((bundle) => {
      bundle.disabled = bundleHeld;
      bundle.textContent = bundleHeld ? "در سبد" : "افزودن به سبد";
    });
  }

  function paintMinuteOffer() {
    const held = readCart().items.find((item) => item.type === "copilot_minutes");
    const slider = document.querySelector("#minute-slider");
    if (held && slider && document.activeElement !== slider) slider.value = String(held.minutes);
    paintSlider();
    document.querySelectorAll("#buy-minutes").forEach((button) => {
      button.disabled = false;
      button.textContent = held ? "به‌روزرسانی سبد" : "افزودن به سبد";
    });
  }

  function parkToast(insideCart) {
    const node = document.querySelector("#cart-toast");
    const slot = document.querySelector("[data-cart-toast-slot]");
    if (!node) return;
    if (insideCart && slot) {
      node.classList.remove("fixed", "top-20", "inset-x-4", "z-[80]", "mx-auto", "max-w-lg");
      slot.appendChild(node);
      return;
    }
    node.classList.add("fixed", "top-20", "inset-x-4", "z-[80]", "mx-auto", "max-w-lg");
    document.body.appendChild(node);
  }

  function showDialog(id) {
    const dialog = document.querySelector(id);
    if (!dialog) return null;
    if (typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
    return dialog;
  }

  function hideDialog(id) {
    const dialog = document.querySelector(id);
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
  }

  function toast(message, withCart) {
    const node = document.querySelector("#cart-toast");
    if (!node) return;
    const text = node.querySelector("[data-toast-text]");
    const button = node.querySelector("[data-toast-cart]");
    if (text) text.textContent = message;
    if (button) button.hidden = !withCart;
    node.classList.remove("hidden");
    node.classList.add("flex");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      node.classList.add("hidden");
      node.classList.remove("flex");
      parkToast(false);
    }, 4200);
  }

  function addCourse(id) {
    if (!PAID.includes(id)) return;
    const state = readPricing();
    if (owns(state, id)) {
      toast("دسترسی آزمایشی این مسیر روی همین مرورگر است.", false);
      return;
    }
    const cart = readCart();
    if (cart.items.some((item) => item.type === "bundle")) {
      toast("پکیج جامع این دوره را شامل می‌شود.", true);
      return;
    }
    if (cart.items.some((item) => item.type === "course" && item.courseId === id)) {
      toast("این دوره همین حالا در سبد است.", true);
      return;
    }
    cart.items.push({
      type: "course",
      id: "course:" + id,
      courseId: id,
      title: COURSE_TITLES[id] || id,
      price: COURSE_PRICE,
    });
    writeCart(cart);
    closeOverview();
    toast("به سبد اضافه شد.", false);
    openCart();
  }

  function addBundle() {
    const state = readPricing();
    if (state.bundle) {
      toast("دسترسی آزمایشی هر چهار مسیر روی همین مرورگر است.", false);
      return;
    }
    const cart = readCart();
    if (cart.items.some((item) => item.type === "bundle")) {
      toast("پکیج جامع همین حالا در سبد است.", true);
      return;
    }
    cart.items = cart.items.filter((item) => item.type !== "course");
    cart.items.unshift({
      type: "bundle",
      id: "bundle",
      title: "هر چهار مسیر",
      price: BUNDLE_PRICE,
    });
    writeCart(cart);
    toast("به سبد اضافه شد.", false);
    openCart();
  }

  function addMinutes(amount) {
    const minutes = clampMinutePick(amount);
    const cart = readCart();
    const existing = cart.items.find((item) => item.type === "copilot_minutes");
    const next = {
      type: "copilot_minutes",
      id: "copilot",
      title: "تحلیل تماس تیم",
      minutes,
      price: minuteCost(minutes),
    };
    if (existing) {
      existing.minutes = next.minutes;
      existing.price = next.price;
      existing.title = next.title;
    } else cart.items.push(next);
    writeCart(cart);
    toast(existing ? "مقدار تحلیل تماس در سبد به‌روز شد." : "به سبد اضافه شد.", false);
    openCart();
  }

  function removeCartItem(id) {
    const cart = readCart();
    cart.items = cart.items.filter((item) => item.id !== id);
    writeCart(cart);
  }

  function changeMinutes(delta) {
    const cart = readCart();
    const item = cart.items.find((entry) => entry.type === "copilot_minutes");
    if (!item) return;
    item.minutes = clampMinutePick(item.minutes + delta);
    item.price = minuteCost(item.minutes);
    writeCart(cart);
  }

  function clearCart() {
    writeCart({ items: [] });
  }

  function pricedTotal(items) {
    return items.reduce((sum, item) => sum + (item.type === "service" ? 0 : Number(item.price) || 0), 0);
  }

  function openCart() {
    hideDialog("#service-order");
    hideDialog("#checkout-order");
    paintCart();
    const toastNode = document.querySelector("#cart-toast");
    parkToast(Boolean(toastNode && !toastNode.classList.contains("hidden")));
    showDialog("#cart-drawer");
  }

  function paintCart() {
    const items = readCart().items;
    document.querySelectorAll("[data-cart-count]").forEach((node) => {
      node.textContent = fa.format(items.length);
      if (node.classList.contains("absolute")) node.classList.toggle("hidden", items.length === 0);
    });
    const body = document.querySelector("[data-cart-body]");
    const footer = document.querySelector("[data-cart-footer]");
    if (!body || !footer) return;
    if (!items.length) {
      body.innerHTML = '<div class="rounded-2xl border border-white/10 p-4 text-sm leading-7 text-cream/70"><p>سبد خرید خالی است.</p><div class="mt-3 flex flex-wrap gap-2"><a class="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy" href="' + base + '/academy/">دوره‌ها</a><a class="rounded-full px-3 py-1 text-xs ring-1 ring-gold/40" href="' + base + '/services/">خدمات</a></div></div>';
      footer.innerHTML = "";
      return;
    }
    const groups = [
      ["course", "دوره‌ها"],
      ["bundle", "پکیج"],
      ["copilot_minutes", "کوپایلوت"],
      ["service", "خدمات"],
    ];
    body.innerHTML = groups.map(([type, label]) => {
      const rows = items.filter((item) => item.type === type);
      if (!rows.length) return "";
      return '<section class="mb-4"><h3 class="text-xs text-gold">' + label + "</h3>" + rows.map(cartRow).join("") + "</section>";
    }).join("");
    const payable = pricedTotal(items);
    const pending = items.some((item) => item.type === "service");
    footer.innerHTML = '<div class="space-y-1 text-sm"><p class="flex justify-between"><span>جمع</span><span>' + toman(payable) + "</span></p>" +
      '<p class="text-xs leading-6 text-cream/60">پرداخت بانکی نیست. دسترسی روی همین مرورگر می‌ماند.</p>' +
      (pending ? '<p class="text-xs leading-6 text-cream/60">خدمات سفارشی نیازمند بررسی و برآورد قیمت‌اند و در این مبلغ نیستند.</p>' : "") +
      '</div><button type="button" data-open-checkout class="mt-3 h-12 w-full rounded-2xl bg-gold text-sm font-semibold text-navy">ثبت دسترسی آزمایشی روی همین مرورگر</button>';
  }

  function cartRow(item) {
    const price = item.type === "service"
      ? "نیازمند بررسی و برآورد قیمت"
      : toman(item.price);
    const meta = item.type === "copilot_minutes"
        ? '<div class="mt-2 flex items-center gap-2 text-xs"><button type="button" data-minute-step="-1000" class="grid size-8 place-items-center rounded-full ring-1 ring-gold/40" aria-label="کم کردن دقیقه">−</button><span>' + fa.format(item.minutes) + ' دقیقه</span><button type="button" data-minute-step="1000" class="grid size-8 place-items-center rounded-full ring-1 ring-gold/40" aria-label="زیاد کردن دقیقه">+</button></div>'
        : "";
    const details = item.type === "service"
      ? '<details class="mt-2 text-xs text-cream/70"><summary class="cursor-pointer text-gold">مشاهده جزئیات سفارش</summary><ul class="mt-2 space-y-1">' + (item.answers || []).map((row) => "<li><span class=\"text-cream/50\">" + escText(row.label) + ":</span> " + escText(row.value) + "</li>").join("") + "</ul></details>"
      : "";
    return '<article class="mt-2 rounded-2xl border border-white/10 p-3"><div class="flex items-start justify-between gap-3"><div><p class="text-sm font-semibold">' + escText(item.title) + "</p>" + meta + details + '</div><div class="text-end"><p class="text-xs text-gold">' + price + '</p><button type="button" data-cart-remove="' + escText(item.id) + '" class="mt-2 text-xs text-cream/50">حذف</button></div></div></article>';
  }

  function fieldControl(field) {
    const common = ' name="' + field.name + '" class="mt-1 w-full rounded-2xl border border-white/15 bg-white/5 px-3 text-sm outline-none focus:border-gold"';
    if (field.type === "textarea") return '<textarea' + common + ' rows="3" placeholder="' + escText(field.placeholder || "") + '"></textarea>';
    if (field.type === "select") return '<select' + common + '><option value="">انتخاب کنید</option>' + field.options.map((option) => '<option>' + escText(option) + "</option>").join("") + "</select>";
    return '<input' + common + ' placeholder="' + escText(field.placeholder || "") + '" />';
  }

  function openService(id) {
    const service = SERVICES[id];
    if (!service) return;
    serviceId = id;
    serviceStep = "form";
    const title = document.querySelector("[data-service-title]");
    const box = document.querySelector("[data-service-fields]");
    const error = document.querySelector("[data-service-error]");
    if (title) title.textContent = service.title;
    if (error) error.textContent = "";
    if (box) {
      box.innerHTML = service.fields.map((field) => '<label class="block text-sm">' + escText(field.label) + fieldControl(field) + '<span data-field-error="' + field.name + '" class="mt-1 block text-xs text-rose-300"></span></label>').join("");
    }
    paintServiceStep();
    showDialog("#service-order");
  }

  function paintServiceStep() {
    const next = document.querySelector("[data-service-next]");
    const back = document.querySelector("[data-service-back]");
    const confirm = document.querySelector("[data-service-confirm]");
    const summary = serviceStep === "summary";
    if (next) next.classList.toggle("hidden", summary);
    if (back) back.classList.toggle("hidden", !summary);
    if (confirm) confirm.classList.toggle("hidden", !summary);
  }

  function readServiceAnswers() {
    const form = document.querySelector("[data-service-form]");
    const service = SERVICES[serviceId];
    if (!form || !service) return { ok: false, rows: [] };
    let ok = true;
    const rows = service.fields.map((field) => {
      const input = form.elements[field.name];
      const value = input ? String(input.value || "").trim() : "";
      const error = form.querySelector('[data-field-error="' + field.name + '"]');
      if (!value) {
        ok = false;
        if (error) error.textContent = "این مورد را تکمیل کنید.";
      } else if (error) error.textContent = "";
      return { name: field.name, label: field.label, value };
    });
    const error = document.querySelector("[data-service-error]");
    if (error) error.textContent = ok ? "" : "موارد مشخص‌شده را کامل کنید.";
    return { ok, rows };
  }

  function showServiceSummary() {
    const result = readServiceAnswers();
    if (!result.ok) return;
    serviceAnswers = result.rows;
    const box = document.querySelector("[data-service-fields]");
    if (box) {
      box.innerHTML = '<p class="text-sm font-semibold">خلاصه اطلاعات</p><ul class="mt-3 space-y-2 text-sm">' + result.rows.map((row) => "<li class=\"rounded-2xl border border-white/10 px-3 py-2\"><span class=\"text-cream/50\">" + escText(row.label) + "</span><p class=\"mt-1\">" + escText(row.value) + "</p></li>").join("") + "</ul>";
    }
    serviceStep = "summary";
    paintServiceStep();
  }

  function confirmService() {
    const service = SERVICES[serviceId];
    if (!service || serviceStep !== "summary" || !serviceAnswers.length) return;
    const cart = readCart();
    cart.items.push({
      type: "service",
      id: "service:" + serviceId + ":" + Date.now(),
      serviceId,
      title: service.title,
      price: 0,
      priceStatus: "quote",
      answers: serviceAnswers,
    });
    writeCart(cart);
    hideDialog("#service-order");
    toast("سفارش خدمت به سبد اضافه شد.", true);
  }

  function openCheckout() {
    const items = readCart().items;
    if (!items.length) return;
    const fields = document.querySelector("[data-checkout-fields]");
    const done = document.querySelector("[data-checkout-done]");
    const actions = document.querySelector("[data-checkout-actions]");
    const summary = document.querySelector("[data-checkout-summary]");
    const error = document.querySelector("[data-checkout-error]");
    if (fields) fields.classList.remove("hidden");
    if (done) {
      done.classList.add("hidden");
      done.innerHTML = "";
    }
    if (actions) actions.classList.remove("hidden");
    if (error) error.textContent = "";
    const session = readSession();
    const form = document.querySelector("[data-checkout-form]");
    if (form && session && session.currentUser) {
      if (!form.elements.name.value) form.elements.name.value = session.currentUser.name || "";
      if (!form.elements.phone.value) form.elements.phone.value = session.currentUser.phone || "";
    }
    if (summary) {
      const pending = items.some((item) => item.type === "service");
      summary.innerHTML = items.map((item) => '<p class="flex justify-between gap-3 py-1"><span>' + escText(item.title) + "</span><span>" + (item.type === "service" ? "برآورد بعدی" : toman(item.price)) + "</span></p>").join("") +
        '<p class="mt-2 flex justify-between border-t border-white/10 pt-2 font-semibold"><span>جمع</span><span>' + toman(pricedTotal(items)) + "</span></p>" +
        (pending ? '<p class="mt-2 text-xs leading-6 text-cream/60">حداقل یک خدمت نیازمند بررسی و برآورد قیمت است.</p>' : "");
    }
    hideDialog("#cart-drawer");
    showDialog("#checkout-order");
  }

  function placeOrder(form) {
    const error = document.querySelector("[data-checkout-error]");
    const name = form.elements.name.value.trim();
    const phone = digits(form.elements.phone.value);
    const notes = form.elements.notes.value.trim();
    if (name.length < 2) {
      if (error) error.textContent = "نام را کامل بنویسید.";
      return;
    }
    if (!/^09\d{9}$/.test(phone)) {
      if (error) error.textContent = "شماره موبایل را با ۰۹ و ۱۱ رقم وارد کنید.";
      return;
    }
    const items = readCart().items;
    if (!items.length) {
      if (error) error.textContent = "سبد خرید خالی است.";
      return;
    }
    const pending = items.some((item) => item.type === "service");
    const order = {
      id: "ORD-" + Math.floor(10000 + Math.random() * 90000),
      at: new Date().toISOString(),
      name,
      phone,
      notes,
      items,
      total: pricedTotal(items),
      status: pending ? "pending_review" : "browser_access",
      message: pending ? "درخواست بررسی روی همین مرورگر ماند. پرداخت بانکی انجام نشده است." : "دسترسی آزمایشی روی همین مرورگر ذخیره شد. پرداخت بانکی انجام نشده است.",
    };
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    grantPurchase(items);
    clearCart();
    const fields = document.querySelector("[data-checkout-fields]");
    const done = document.querySelector("[data-checkout-done]");
    const actions = document.querySelector("[data-checkout-actions]");
    if (fields) fields.classList.add("hidden");
    if (actions) actions.classList.add("hidden");
    if (done) {
      done.classList.remove("hidden");
      done.innerHTML = '<p class="text-lg font-semibold text-gold">' + order.message + "</p>";
    }
  }

  function grantPurchase(items) {
    const state = readPricing();
    const ordered = items.slice().sort((a, b) => (a.type === "bundle" ? -1 : b.type === "bundle" ? 1 : 0));
    ordered.forEach((item) => {
      if (item.type === "bundle" && !state.bundle) {
        state.bundle = true;
        state.courses = PAID.slice();
        state.cashbackToman += Math.round(BUNDLE_PRICE * 0.05);
      }
      if (item.type === "course" && !state.bundle && !state.courses.includes(item.courseId)) {
        state.courses.push(item.courseId);
        state.cashbackToman += Math.round(COURSE_PRICE * 0.05);
      }
      if (item.type === "copilot_minutes") {
        state.minutes += clampMinutePick(item.minutes);
        state.cashbackToman += Math.round(minuteCost(item.minutes) * 0.05);
      }
    });
    writePricing(state);
  }

  function paintCounter(card, fallback) {
    const box = document.querySelector("[data-counter]");
    if (!box) return;
    box.classList.remove("hidden");
    if (!card || !card.matched) {
      box.innerHTML = "<p class=\"text-sm\">هنوز اعتراض روشنی نشنیدم. قیمت، تخفیف یا «باید فکر کنم» را بگویید.</p>";
      return;
    }
    box.innerHTML = "<p class=\"text-sm text-[#F3A6A6]\">🔴 " + card.tag + "</p><p class=\"mt-3 text-xs text-gold\">تکنیک: " + card.technique + "</p><p class=\"mt-2 text-lg leading-8\" data-counter-say>بگو: " + (card.say || (card.lines && card.lines[0]) || fallback || "") + "</p>";
  }

  function reply(text) {
    let book = [];
    try {
      book = JSON.parse(document.querySelector("#objections").textContent || "[]");
    } catch {
      book = [];
    }
    const hit = book.find((item) => item.patterns.some((pattern) => text.includes(pattern)));
    paintCounter(hit ? { matched: true, tag: hit.tag, technique: hit.technique, say: hit.lines[0] } : null, text);
  }

  function ask(text) {
    const clean = String(text || "").trim();
    if (!clean) return;
    fetch((base || "") + "/api/copilot/counter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: clean }),
    }).then((response) => response.ok ? response.json() : null).then((card) => {
      if (!card || !card.matched) reply(clean);
      else paintCounter(card, clean);
    }).catch(() => reply(clean));
  }

  document.addEventListener("click", (event) => {
    const dialog = document.querySelector("#course-overview");
    if (dialog && event.target === dialog) {
      closeOverview();
      return;
    }
    if (event.target.closest("[data-overview-close]")) {
      closeOverview();
      return;
    }
    const overview = event.target.closest("[data-card-overview]");
    if (overview) {
      const card = overview.closest("[data-course-card]");
      if (card) openOverview(card.dataset.courseCard);
      return;
    }
    const academyCard = event.target.closest("[data-course-card]");
    if (academyCard && !event.target.closest("a, button")) {
      if (academyCard.dataset.cardMode === "locked") openOverview(academyCard.dataset.courseCard);
      else if (academyCard.dataset.cardMode === "learn") {
        const resume = academyCard.querySelector("[data-card-resume]");
        if (resume) location.href = resume.href;
      } else if (academyCard.dataset.cardMode === "login") {
        const guest = academyCard.querySelector("[data-card-guest]");
        if (guest) location.href = guest.href;
      }
      return;
    }
    const menu = event.target.closest("[data-menu]");
    if (menu) {
      document.querySelector("[data-mobile-nav]").classList.toggle("hidden");
      return;
    }
    if (event.target.closest("[data-open-cart], [data-toast-cart]")) {
      const toastNode = document.querySelector("#cart-toast");
      const menu = document.querySelector("[data-mobile-nav]");
      if (toastNode) toastNode.hidden = true;
      if (menu) menu.classList.add("hidden");
      openCart();
      return;
    }
    if (event.target.closest("[data-cart-close]") || event.target.id === "cart-drawer") {
      hideDialog("#cart-drawer");
      parkToast(false);
      return;
    }
    const remove = event.target.closest("[data-cart-remove]");
    if (remove) {
      removeCartItem(remove.dataset.cartRemove);
      return;
    }
    const step = event.target.closest("[data-minute-step]");
    if (step) {
      changeMinutes(Number(step.dataset.minuteStep));
      return;
    }
    if (event.target.closest("[data-open-checkout]")) {
      openCheckout();
      return;
    }
    if (event.target.closest("[data-checkout-close]") || event.target.id === "checkout-order") {
      hideDialog("#checkout-order");
      return;
    }
    const orderService = event.target.closest("[data-order-service]");
    if (orderService) {
      openService(orderService.dataset.orderService);
      return;
    }
    if (event.target.closest("[data-service-close]") || event.target.id === "service-order") {
      hideDialog("#service-order");
      return;
    }
    if (event.target.closest("[data-service-back]")) {
      openService(serviceId);
      return;
    }
    if (event.target.closest("[data-service-confirm]")) {
      confirmService();
      return;
    }
    const buy = event.target.closest("[data-buy]");
    if (buy) {
      addCourse(buy.dataset.buy);
      return;
    }
    if (event.target.closest("#buy-bundle")) {
      addBundle();
      return;
    }
    if (event.target.closest("#buy-minutes")) {
      const slider = document.querySelector("#minute-slider");
      addMinutes(slider ? Number(slider.value) : 1000);
      return;
    }
    const tabLink = event.target.closest("[data-tab-link]");
    if (tabLink) {
      event.preventDefault();
      const url = new URL(base + "/dashboard/", location.origin);
      url.searchParams.set("tab", tabLink.dataset.tabLink);
      history.pushState({}, "", url);
      paintTabs();
      return;
    }
    const avatar = event.target.closest("[data-avatar-pick]");
    if (avatar) {
      const form = document.querySelector("[data-profile-form]");
      if (form) form.dataset.picked = avatar.dataset.avatarPick;
      const current = readSession();
      paintAvatar({
        name: form && form.elements.name.value ? form.elements.name.value : current && current.currentUser ? current.currentUser.name : "",
        avatarId: avatar.dataset.avatarPick,
      });
      return;
    }
    if (event.target.closest("[data-audit-toggle]")) {
      const card = event.target.closest("[data-audit]");
      const report = card && card.querySelector("[data-audit-report]");
      if (report) report.classList.toggle("hidden");
      return;
    }
    if (event.target.closest("[data-refer]")) {
      const state = readPricing();
      if (!state.referralCode) state.referralCode = "NX" + Math.floor(1000 + Math.random() * 9000);
      state.referrals += 1;
      state.cashbackToman += 200000;
      writePricing(state);
      const note = document.querySelector("[data-panel-note]");
      if (note) note.textContent = toman(200000) + " پاداش معرفی ثبت شد.";
      return;
    }
    if (event.target.closest("[data-deposit-open]")) {
      const dialog = document.querySelector("[data-deposit]");
      if (dialog) {
        dialog.dataset.amount = dialog.dataset.amount || "200000";
        dialog.classList.remove("hidden");
        dialog.classList.add("flex");
      }
      return;
    }
    if (event.target.closest("[data-deposit-close]")) {
      const dialog = document.querySelector("[data-deposit]");
      if (dialog) {
        dialog.classList.add("hidden");
        dialog.classList.remove("flex");
      }
      return;
    }
    const preset = event.target.closest("[data-deposit-amount]");
    if (preset) {
      const dialog = document.querySelector("[data-deposit]");
      if (dialog) dialog.dataset.amount = preset.dataset.depositAmount;
      document.querySelectorAll("[data-deposit-amount]").forEach((node) => {
        const on = node === preset;
        node.classList.toggle("bg-gold", on);
        node.classList.toggle("text-navy", on);
      });
      return;
    }
    if (event.target.closest("[data-deposit-confirm]")) {
      const dialog = document.querySelector("[data-deposit]");
      const amount = Number(dialog && dialog.dataset.amount) || 200000;
      const session = readSession();
      if (session && session.currentUser) {
        session.currentUser.walletBalance = (Number(session.currentUser.walletBalance) || 0) + amount;
        session.currentUser.transactions = [{
          id: String(Date.now()),
          amount,
          at: new Date().toISOString(),
          title: "شارژ اعتبار تومانی",
        }].concat(session.currentUser.transactions || []);
        writeSession(session);
      }
      if (dialog) {
        dialog.classList.add("hidden");
        dialog.classList.remove("flex");
      }
      const note = document.querySelector("[data-panel-note]");
      if (note) note.textContent = "اعتبار به کیف پول اضافه شد.";
      return;
    }
    if (event.target.closest("[data-sign-out]")) {
      localStorage.removeItem(SESSION);
      location.href = base + "/login/";
      return;
    }
    const sample = event.target.closest("[data-sample-objection]");
    if (sample) {
      const text = sample.dataset.sampleObjection;
      const field = document.querySelector("[data-voice-input]");
      if (field) field.value = text;
      ask(text);
    }
  });

  document.addEventListener("input", (event) => {
    if (event.target && event.target.id === "minute-slider") paintSlider();
  });

  const quiz = document.querySelector("[data-quiz]");
  if (quiz) {
    quiz.addEventListener("submit", (event) => {
      event.preventDefault();
      const result = quiz.querySelector("[data-quiz-result]");
      if (!quiz.querySelector("[name=watched]").checked) {
        result.textContent = "اول تماشای ویدیو را علامت بزنید.";
        return;
      }
      const progress = readProgress();
      const lessonId = quiz.dataset.lesson;
      if (!progress.watched.includes(lessonId)) progress.watched.push(lessonId);
      let correct = 0;
      quiz.querySelectorAll("fieldset").forEach((field, index) => {
        const picked = quiz.querySelector('input[name="q' + index + '"]:checked');
        if (picked && Number(picked.value) === Number(field.dataset.answer)) correct += 1;
      });
      if (correct >= 2) {
        if (!progress.passed.includes(lessonId)) progress.passed.push(lessonId);
        result.textContent = fa.format(correct) + " از ۳ درست بود. چالش قبول شد.";
      } else {
        result.textContent = fa.format(correct) + " از ۳ درست بود. حداقل دو پاسخ درست لازم است.";
      }
      writeProgress(progress);
    });
  }

  function englishDigits(value) {
    return String(value || "")
      .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
      .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
  }

  function phoneKey(value) {
    const digits = englishDigits(value).replace(/\D/g, "");
    if (digits.startsWith("98") && digits.length >= 12) return "0" + digits.slice(2);
    if (digits.length === 10 && digits.startsWith("9")) return "0" + digits;
    return digits;
  }

  function readAccounts() {
    try {
      const parsed = JSON.parse(localStorage.getItem("nexsell-accounts-v1") || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeAccounts(accounts) {
    localStorage.setItem("nexsell-accounts-v1", JSON.stringify(accounts));
  }

  function blankUser(phone, extra) {
    return {
      name: "کاربر نکس‌سل",
      phone,
      email: "",
      jobTitle: "",
      bio: "",
      avatarId: "navy",
      plan: "free",
      walletBalance: 0,
      cashbackEarned: 0,
      transactions: [],
      tickets: [],
      ...extra,
    };
  }

  function mountAuth() {
    const root = document.querySelector("[data-auth]");
    if (!root) return;
    const existing = readSession();
    if (existing && existing.isAuthenticated && existing.currentUser) {
      location.replace(base + "/dashboard/");
      return;
    }
    const mode = root.dataset.auth;
    const phoneInput = root.querySelector("[data-auth-phone]");
    const otpStep = root.querySelector("[data-auth-otp]");
    const note = root.querySelector("[data-auth-note]");
    const sentPhone = root.querySelector("[data-auth-sent-phone]");
    const timerNode = root.querySelector("[data-otp-timer]");
    const resend = root.querySelector("[data-otp-resend]");
    const finish = root.querySelector("[data-auth-finish]");
    const edit = root.querySelector("[data-auth-edit]");
    const terms = root.querySelector("[data-auth-terms]");
    const boxes = Array.from(root.querySelectorAll("[data-otp-digit]"));
    let confirmed = "";
    let left = 0;
    let timerId = 0;

    function say(message) {
      if (note) note.textContent = message;
    }

    function clock(total) {
      const minutes = String(Math.floor(total / 60)).padStart(2, "0");
      const seconds = String(total % 60).padStart(2, "0");
      return minutes + ":" + seconds;
    }

    function startTimer() {
      window.clearInterval(timerId);
      left = 119;
      if (timerNode) timerNode.textContent = clock(left);
      if (resend) resend.disabled = true;
      timerId = window.setInterval(() => {
        left = Math.max(0, left - 1);
        if (timerNode) timerNode.textContent = clock(left);
        if (resend) resend.disabled = left > 0;
        if (left === 0) window.clearInterval(timerId);
      }, 1000);
    }

    function showCodeStep(message) {
      otpStep.classList.remove("hidden");
      finish.classList.remove("hidden");
      edit.classList.remove("hidden");
      if (terms) {
        terms.classList.remove("hidden");
        terms.classList.add("flex");
      }
      if (sentPhone) sentPhone.textContent = confirmed;
      say(message);
      startTimer();
      if (boxes[0]) boxes[0].focus();
    }

    function sendCode(again) {
      const phone = phoneKey(phoneInput.value);
      if (!/^09\d{9}$/.test(phone)) {
        say("شماره موبایل را کامل وارد کنید.");
        return;
      }
      confirmed = phone;
      showCodeStep(again ? "کد تایید دوباره برای همین شماره ارسال شد." : "کد تایید برای همین شماره ارسال شد.");
    }

    function hideCodeStep() {
      confirmed = "";
      window.clearInterval(timerId);
      otpStep.classList.add("hidden");
      finish.classList.add("hidden");
      edit.classList.add("hidden");
      if (terms) {
        terms.classList.add("hidden");
        terms.classList.remove("flex");
      }
      boxes.forEach((box) => { box.value = ""; });
      say("");
      phoneInput.focus();
    }

    function otpValue() {
      return boxes.map((box) => englishDigits(box.value).replace(/\D/g, "")).join("").slice(0, 5);
    }

    function enter() {
      if (!confirmed) {
        say("اول شماره را تایید کنید تا کد تایید ارسال شود.");
        return;
      }
      const otp = otpValue();
      if (!/^\d{5}$/.test(otp)) {
        say("کد باید ۵ رقم باشد.");
        return;
      }
      const accounts = readAccounts();
      let user = accounts[confirmed] ? { ...accounts[confirmed], phone: confirmed } : blankUser(confirmed);
      if (mode === "register") {
        const name = String(new FormData(root).get("name") || "").trim();
        const jobTitle = String(new FormData(root).get("jobTitle") || "").trim();
        const accepted = root.querySelector("[name=terms]");
        if (name.length < 2 || jobTitle.length < 2) {
          say("نام و حوزه فعالیت را کامل بنویسید.");
          return;
        }
        if (!accepted || !accepted.checked) {
          say("پذیرش قوانین و مقررات لازم است.");
          return;
        }
        user = { ...user, name, jobTitle, phone: confirmed };
        accounts[confirmed] = user;
        writeAccounts(accounts);
      } else if (accounts[confirmed]) {
        user = { ...accounts[confirmed], phone: confirmed };
      }
      localStorage.setItem(SESSION, JSON.stringify({ isAuthenticated: true, currentUser: user }));
      location.href = base + "/dashboard/";
    }

    root.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!confirmed) sendCode(false);
      else enter();
    });
    root.querySelector("[data-auth-request]").addEventListener("click", () => sendCode(false));
    finish.addEventListener("click", enter);
    edit.addEventListener("click", hideCodeStep);
    resend.addEventListener("click", () => {
      if (left > 0 || !confirmed) return;
      sendCode(true);
    });
    boxes.forEach((box, index) => {
      box.addEventListener("input", () => {
        const value = englishDigits(box.value).replace(/\D/g, "");
        if (value.length > 1) {
          const chars = value.slice(0, 5).split("");
          boxes.forEach((item, itemIndex) => { item.value = chars[itemIndex] || ""; });
          boxes[Math.min(chars.length, boxes.length - 1)].focus();
          return;
        }
        box.value = value.slice(0, 1);
        if (value && boxes[index + 1]) boxes[index + 1].focus();
      });
      box.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && !box.value && boxes[index - 1]) boxes[index - 1].focus();
      });
    });
  }

  mountAuth();

  const ticket = document.querySelector("[data-ticket]");
  if (ticket) {
    ticket.addEventListener("submit", (event) => {
      event.preventDefault();
      ticket.querySelector("[data-ticket-note]").textContent = "تیکت روی همین مرورگر ثبت شد. پاسخ واقعی از سرور نمی‌آید.";
      ticket.reset();
    });
  }

  function mountVoice() {
    const chat = document.querySelector("[data-voice-chat]");
    if (!chat) return;
    const toggle = chat.querySelector("[data-voice-toggle]");
    const label = chat.querySelector("[data-voice-label]");
    const micIcon = chat.querySelector("[data-voice-mic]");
    const stopIcon = chat.querySelector("[data-voice-stop]");
    const pulse = chat.querySelector("[data-voice-pulse]");
    const input = chat.querySelector("[data-voice-input]");
    const live = chat.querySelector("[data-voice-live]");
    const toast = chat.querySelector("[data-voice-toast]");
    const send = chat.querySelector("[data-voice-send]");
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let listening = false;
    let finalText = "";
    let interimText = "";
    let endError = "";
    let userStop = false;
    let endTimer = 0;

    function toastMessage(message) {
      toast.textContent = message;
      toast.classList.toggle("hidden", !message);
    }

    function setIdle() {
      listening = false;
      toggle.disabled = false;
      toggle.dataset.state = "idle";
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-busy", "false");
      toggle.classList.add("bg-gold", "text-navy");
      toggle.classList.remove("bg-rose-600", "text-white");
      label.textContent = "شروع صحبت";
      micIcon.classList.remove("hidden");
      stopIcon.classList.add("hidden");
      pulse.classList.add("hidden");
    }

    function setRecording() {
      listening = true;
      toggle.disabled = false;
      toggle.dataset.state = "recording";
      toggle.setAttribute("aria-pressed", "true");
      toggle.setAttribute("aria-busy", "false");
      toggle.classList.remove("bg-gold", "text-navy");
      toggle.classList.add("bg-rose-600", "text-white");
      label.textContent = "توقف";
      micIcon.classList.add("hidden");
      stopIcon.classList.remove("hidden");
      pulse.classList.remove("hidden");
    }

    function setLoading() {
      toggle.disabled = true;
      toggle.dataset.state = "loading";
      toggle.setAttribute("aria-busy", "true");
      label.textContent = "در حال توقف";
    }

    function deliver(text) {
      const clean = String(text || "").replace(/\s+/g, " ").trim();
      if (!clean) {
        toastMessage("گفتار تشخیص داده نشد. جمله را دوباره واضح بگویید.");
        return;
      }
      toastMessage("");
      const current = input.value.trim();
      input.value = current ? current + " " + clean : clean;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      ask(clean);
    }

    function finishSession() {
      window.clearTimeout(endTimer);
      const spoken = finalText.trim() || (userStop ? interimText.trim() : "");
      const error = endError;
      const stoppedByUser = userStop;
      finalText = "";
      interimText = "";
      endError = "";
      userStop = false;
      live.textContent = "";
      setIdle();
      if (spoken) deliver(spoken);
      else if (!error && stoppedByUser) toastMessage("گفتار تشخیص داده نشد. جمله را دوباره واضح بگویید.");
    }

    if (!Ctor) {
      toggle.disabled = true;
      toggle.dataset.state = "disabled";
      toggle.setAttribute("aria-disabled", "true");
      toastMessage("این مرورگر تشخیص گفتار ندارد. متن را بنویسید و ارسال کنید.");
    } else {
      recognition = new Ctor();
      recognition.lang = "fa-IR";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let interim = "";
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const piece = event.results[index][0] ? event.results[index][0].transcript : "";
          if (event.results[index].isFinal) finalText += piece + " ";
          else interim += piece;
        }
        interimText = interim;
        live.textContent = (interim || finalText).trim();
      };

      recognition.onnomatch = () => {
        toastMessage("گفتار تشخیص داده نشد. جمله را دوباره بگویید.");
      };

      recognition.onerror = (event) => {
        const code = event && event.error;
        endError = code || "unknown";
        if (code === "not-allowed" || code === "service-not-allowed") {
          toastMessage("دسترسی میکروفن بسته است. اجازهٔ میکروفن را در تنظیمات مرورگر باز کنید.");
        } else if (code === "no-speech") {
          toastMessage("صدایی شنیده نشد. دوباره شروع کنید و واضح‌تر حرف بزنید.");
        } else if (code === "audio-capture") {
          toastMessage("میکروفنی پیدا نشد.");
        } else if (code !== "aborted") {
          toastMessage("ضبط گفتار قطع شد. یک بار دیگر تلاش کنید.");
        }
      };

      recognition.onend = () => {
        finishSession();
      };
    }

    async function allowMicrophone() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return true;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch {
        toastMessage("دسترسی میکروفن داده نشد. اجازه را بدهید و دوباره شروع کنید.");
        setIdle();
        return false;
      }
    }

    toggle.addEventListener("click", async () => {
      if (!recognition) return;
      if (listening) {
        userStop = true;
        setLoading();
        window.clearTimeout(endTimer);
        endTimer = window.setTimeout(() => {
          if (toggle.dataset.state === "loading") finishSession();
        }, 1600);
        try {
          recognition.stop();
        } catch {
          finishSession();
        }
        return;
      }
      const consent = chat.querySelector("[data-voice-consent]");
      if (!consent || !consent.checked) {
        toastMessage("فایل صوت فقط برای تحلیل همان جلسه است و بدون تأیید ذخیره نمی‌شود.");
        return;
      }
      toastMessage("");
      finalText = "";
      const allowed = await allowMicrophone();
      if (!allowed) return;
      try {
        recognition.start();
        setRecording();
        live.textContent = "در حال شنیدن…";
      } catch {
        setIdle();
        toastMessage("ضبط همین حالا در جریان است یا میکروفن در دسترس نیست.");
      }
    });

    send.addEventListener("click", () => {
      const text = input.value.trim();
      if (!text) {
        toastMessage("اول متنی بنویسید یا صحبت را شروع کنید.");
        return;
      }
      toastMessage("");
      ask(text);
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        send.click();
      }
    });
  }

  const serviceForm = document.querySelector("[data-service-form]");
  if (serviceForm) {
    serviceForm.addEventListener("submit", (event) => {
      event.preventDefault();
      showServiceSummary();
    });
  }
  const checkoutForm = document.querySelector("[data-checkout-form]");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();
      placeOrder(checkoutForm);
    });
  }

  const profileForm = document.querySelector("[data-profile-form]");
  if (profileForm) {
    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const session = readSession();
      const note = profileForm.querySelector("[data-profile-note]");
      if (!session || !session.currentUser) return;
      const name = profileForm.elements.name.value.trim();
      const phone = profileForm.elements.phone.value.trim();
      const email = profileForm.elements.email.value.trim();
      const jobTitle = profileForm.elements.jobTitle.value.trim();
      const bio = profileForm.elements.bio.value.trim();
      if (name.length < 2 || jobTitle.length < 2) {
        note.textContent = "نام و حوزه فعالیت را کامل بنویسید.";
        return;
      }
      if (!/^09\d{9}$/.test(phone)) {
        note.textContent = "شماره موبایل را کامل وارد کنید.";
        return;
      }
      if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        note.textContent = "ایمیل را درست وارد کنید.";
        return;
      }
      session.currentUser = {
        ...session.currentUser,
        name,
        phone,
        email,
        jobTitle,
        bio,
        avatarId: profileForm.dataset.picked || session.currentUser.avatarId || "navy",
      };
      note.textContent = "تغییرات ذخیره شد.";
      writeSession(session);
    });
  }

  const panelTicket = document.querySelector("[data-panel-ticket]");
  if (panelTicket) {
    panelTicket.addEventListener("submit", (event) => {
      event.preventDefault();
      const session = readSession();
      const title = String(new FormData(panelTicket).get("title") || "").trim();
      const note = panelTicket.querySelector("[data-ticket-note]");
      if (!session || !session.currentUser || title.length < 2) {
        if (note) note.textContent = "موضوع تیکت را بنویسید.";
        return;
      }
      const stamp = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date());
      session.currentUser.tickets = [{ id: "TK-" + String(Date.now()).slice(-4), subject: title, at: stamp }].concat(session.currentUser.tickets || []);
      panelTicket.reset();
      if (note) note.textContent = "تیکت روی همین مرورگر ثبت شد. پاسخ واقعی از سرور نمی‌آید.";
      writeSession(session);
    });
  }

  window.addEventListener("popstate", () => {
    if (document.querySelector("[data-user-panel]")) paintTabs();
  });

  mountVoice();

  function mountSmoothScroll() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof window.Lenis !== "function") return;
    const lenis = new window.Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    window.lenis = lenis;
    function frame(time) {
      lenis.raf(time);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = document.getElementById(url.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    });
    const menu = document.querySelector("[data-menu]");
    if (menu) {
      menu.addEventListener("click", () => {
        const open = !document.querySelector("[data-mobile-nav]").classList.contains("hidden");
        if (open) lenis.stop();
        else lenis.start();
      });
    }
  }

  function mountReveal() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = document.querySelectorAll("[data-reveal]:not(.is-revealed)");
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-revealed"));
      return;
    }
    if (!mountReveal.observer) {
      mountReveal.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          mountReveal.observer.unobserve(entry.target);
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    }
    nodes.forEach((node) => {
      const delay = Number(node.dataset.delay || 0);
      node.style.setProperty("--reveal-delay", (Number.isFinite(delay) ? delay : 0) + "ms");
      mountReveal.observer.observe(node);
    });
  }

  mountSmoothScroll();
  mountReveal();
  const cartDrawer = document.querySelector("#cart-drawer");
  if (cartDrawer) cartDrawer.addEventListener("close", () => parkToast(false));
  render();
})();
