(function () {
  const KEY = "salespro-pricing-v1";
  const PROGRESS = "nexsell-progress-v1";
  const SESSION = "academy_user_session";
  const COURSE_PRICE = 5000000;
  const BUNDLE_PRICE = 16000000;
  const GIFT = 500;
  const STEP = 1000;
  const RATE = 3000000;
  const PAID = ["online", "hozuri", "telefoni", "mozakerah"];
  const base = document.body.dataset.base || "";

  const fa = new Intl.NumberFormat("fa-IR");
  function toman(value) {
    return fa.format(value) + " تومان";
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
    if (state.minutes > 0) return state.minutes;
    if (state.bundle) return GIFT;
    return 0;
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
    const phone = session && session.currentUser ? session.currentUser.phone : "";
    const name = session && session.currentUser ? session.currentUser.name : "";
    document.querySelectorAll("[data-phone-line]").forEach((node) => {
      node.textContent = phone || "—";
    });
    document.querySelectorAll("[data-profile-name]").forEach((node) => {
      node.textContent = name || "—";
    });

    document.querySelectorAll("[data-course]").forEach((card) => {
      const id = card.dataset.course;
      const paid = card.dataset.paid !== "no";
      const open = !paid || owns(state, id);
      const buy = card.querySelector("[data-buy]");
      const enter = card.querySelector("[data-enter]");
      if (buy) buy.classList.toggle("hidden", open);
      if (enter) {
        enter.classList.toggle("hidden", !open);
        enter.classList.toggle("inline-flex", open);
      }
    });

    const bundle = document.querySelector("#buy-bundle");
    if (bundle) {
      bundle.disabled = state.bundle;
      bundle.textContent = state.bundle ? "باندل فعال است" : "خرید یکجای تمام دوره‌ها";
    }

    document.querySelectorAll("[data-dash-course]").forEach((card) => {
      const id = card.dataset.dashCourse;
      const open = owns(state, id);
      const lessons = card.parentElement ? Array.from(document.querySelectorAll("[data-lesson]")).length : 0;
      const lock = card.querySelector("[data-lock]");
      if (lock) {
        lock.textContent = open ? "خریداری شده" : "قفل";
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
      const open = gate.dataset.free === "yes" || owns(state, gate.dataset.courseGate);
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

  function paintTabs() {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") === "courses" || params.get("tab") === "wallet" ? params.get("tab") : "overview";
    document.querySelectorAll("[data-tab]").forEach((node) => {
      node.classList.toggle("active", node.dataset.tab === tab);
    });
    if (typeof mountReveal === "function") mountReveal();
  }

  function buyCourse(id) {
    const state = readPricing();
    if (owns(state, id) || !PAID.includes(id)) return;
    state.courses.push(id);
    state.cashbackToman += Math.round(COURSE_PRICE * 0.05);
    writePricing(state);
  }

  function buyBundle() {
    const state = readPricing();
    if (state.bundle) return;
    state.bundle = true;
    state.courses = PAID.slice();
    state.minutes += GIFT;
    state.cashbackToman += Math.round(BUNDLE_PRICE * 0.05);
    writePricing(state);
  }

  function buyMinutes(slider) {
    const amount = Number(slider.value);
    const state = readPricing();
    state.minutes += amount;
    state.cashbackToman += Math.round((amount / STEP) * RATE * 0.05);
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
    const menu = event.target.closest("[data-menu]");
    if (menu) {
      document.querySelector("[data-mobile-nav]").classList.toggle("hidden");
      return;
    }
    const buy = event.target.closest("[data-buy]");
    if (buy) {
      buyCourse(buy.dataset.buy);
      return;
    }
    if (event.target.closest("#buy-bundle")) {
      buyBundle();
      return;
    }
    const minutes = event.target.closest("#buy-minutes");
    if (minutes) {
      const slider = minutes.parentElement.querySelector("#minute-slider");
      if (slider) buyMinutes(slider);
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

  const login = document.querySelector("[data-login]");
  if (login) {
    login.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(login);
      const phone = String(data.get("phone") || "").trim();
      const name = String(data.get("name") || "").trim();
      const otp = String(data.get("otp") || "").trim();
      const note = login.querySelector("[data-login-note]");
      if (!/^09\d{9}$/.test(phone) || name.length < 2 || !/^\d{4,6}$/.test(otp)) {
        note.textContent = "نام، شمارهٔ ۱۱ رقمی و کد ۴ تا ۶ رقمی را کامل کنید.";
        return;
      }
      localStorage.setItem(SESSION, JSON.stringify({
        isAuthenticated: true,
        currentUser: { name, phone, jobTitle: "", bio: "", plan: "free", walletBalance: 0, cashbackEarned: 0, transactions: [] },
      }));
      location.href = base + "/dashboard/";
    });
  }

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
  render();
})();
