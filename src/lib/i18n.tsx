"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

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
      about: "درباره ما",
      contact: "ارتباط با ما",
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
      metricsTitle: "اثر آکادمی",
      metricsHint: "عددها نمونهٔ نمایشی‌اند و با ورود به بخش، نرم می‌شمارند.",
      metricStudents: "دانش‌پذیر فعال",
      metricHours: "ساعت آموزش تخصصی فروش و مذاکره",
      metricSatisfaction: "رضایت فارغ‌التحصیلان",
      metricTeams: "بیزنس و تیم آموزش‌دیده",
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
    aboutPage: {
      kicker: "آکادمی تخصصی فروش و مذاکره",
      title: "فروش آنلاین، حضوری و تلفنی را با مذاکرهٔ دقیق به نتیجه می‌رسانیم.",
      missionTitle: "مأموریت",
      mission:
        "توانمند کردن کسب‌وکارها و متخصصان برای تسلط بر فروش آنلاین، فروش حضوری و فروش تلفنی، همراه با مذاکره در موقعیت‌های حساس.",
      visionTitle: "چشم‌انداز",
      vision:
        "مرجع آموزش فروش و مذاکره؛ جایی که هر تیم با استاندارد روز دنیا و اخلاق حرفه‌ای، گفتگو را به تصمیم روشن تبدیل کند.",
      statement:
        "نکس‌سل جای شعار نیست. هر مسیر تمرین، بازخورد و استانداردی دارد که فروشنده بتواند فردا سر میز، پشت تلفن یا در پیام همان کار را انجام دهد.",
      valuesTitle: "ارزش‌های بنیادین آکادمی",
      values: [
        {
          title: "آموزش عملی و نتیجه‌محور",
          text: "هر درس به یک جمله، یک اعتراض یا یک بستن معامله وصل است؛ نه به اسلاید بدون تمرین.",
        },
        {
          title: "استانداردهای روز دنیا",
          text: "چارچوب فروش و مذاکره با الگوی تیم‌های حرفه‌ای هم‌تراز می‌شود و برای بازار ایران بازنویسی می‌شود.",
        },
        {
          title: "همراهی و پشتیبانی مستمر",
          text: "بعد از تماشای ویدیو، چالش و گفتگوی پشتیبانی کنار مسیر می‌ماند تا تمرین رها نشود.",
        },
        {
          title: "اخلاق حرفه‌ای در مذاکره",
          text: "امتیاز، فشار و بستن معامله بدون پنهان‌کاری و بدون آسیب به اعتماد طرف مقابل پیش می‌رود.",
        },
      ],
      leadTitle: "مدرس و بنیان‌گذار",
      leadName: "امیرحسین قاری",
      leadRole: "استراتژیست فروش و مذاکره‌کننده ارشد",
      leadBadge: "بنیان‌گذار آکادمی",
      leadBio:
        "امیرحسین قاری تیم‌های فروش آنلاین، حضوری و تلفنی را برای گفتگوهای سخت همراهی کرده است. آکادمی نکس‌سل را بر پایهٔ آموزش عملی، استاندارد جهانی و اخلاق مذاکره بنا گذاشته تا مدیر و فروشنده هر دو بدانند قدم بعدی چیست.",
      credentials: [
        "طراحی مسیر فروش آنلاین، حضوری و تلفنی",
        "مربی مذاکره در موقعیت‌های پرمخاطره",
        "نویسندهٔ یادداشت‌های کاربردی آکادمی",
      ],
    },
    contactPage: {
      kicker: "ارتباط با ما",
      title: "کانال مستقیم، بدون فرم اضافه.",
      intro: "آدرس، تلفن، ایمیل و ساعت پاسخگویی همین‌جاست. پیام و تیکت از آیکون پشتیبانی پایین صفحه ثبت می‌شود.",
      hq: "دفتر مرکزی",
      address: "تهران، خیابان ولیعصر، برج فناوری، طبقه ۸",
      phone: "تماس مستقیم",
      phones: [
        { label: "۰۲۱-۸۸۸۸۰۰۰۰", href: "tel:+982188880000" },
        { label: "۰۹۱۲-۰۰۰-۰۰۰۰", href: "tel:+989120000000" },
      ],
      email: "پست الکترونیک",
      emails: [
        { label: "support@academy.com", href: "mailto:support@academy.com" },
        { label: "info@academy.com", href: "mailto:info@academy.com" },
      ],
      hours: "ساعات پاسخگویی",
      hoursText: "شنبه تا چهارشنبه ۹:۰۰ الی ۱۸:۰۰",
      socialTitle: "سوشال مدیا و شبکه‌های اجتماعی",
      socials: [
        { name: "اینستاگرام", handle: "@academy_sales", href: "https://instagram.com/academy_sales", tone: "instagram" },
        { name: "تلگرام", handle: "@academy_support", href: "https://t.me/academy_support", tone: "telegram" },
        { name: "لینکدین", handle: "Academy Sales & Negotiation", href: "https://www.linkedin.com/company/academy-sales-negotiation", tone: "linkedin" },
        {
          name: "یوتیوب / آپارات",
          handle: "Academy Official",
          href: "https://www.youtube.com/@academyofficial",
          aparat: "https://www.aparat.com/academyofficial",
          tone: "video",
        },
      ],
      widgetNote: "برای دریافت پاسخ آنی یا ثبت تیکت، می‌توانید از آیکون پشتیبانی گوشه صفحه استفاده کنید.",
    },
    auditor: {
      kicker: "ممیز تماس هوشمند",
      title: "تحلیل تماس فروش",
      intro: "فایل تماس را بگذارید یا همان‌جا ضبط کنید. هر تحلیل یکی از سه سهمیهٔ امروز را مصرف می‌کند.",
      uploadTab: "بارگذاری فایل صوتی",
      recordTab: "ضبط زنده",
      drop: "فایل mp3، wav یا m4a را اینجا رها کنید یا انتخاب کنید. حداکثر ۵۰ مگابایت.",
      browse: "انتخاب فایل",
      remove: "حذف",
      duration: "مدت تقریبی",
      badType: "فقط فایل mp3، wav یا m4a پذیرفته می‌شود.",
      badSize: "حجم فایل باید حداکثر ۵۰ مگابایت باشد.",
      record: "شروع ضبط",
      recording: "در حال ضبط",
      stop: "توقف",
      micError: "دسترسی به میکروفن ممکن نشد.",
      needAudio: "اول یک فایل انتخاب کنید یا تماسی ضبط کنید.",
      analyze: "شروع تحلیل هوشمند تماس",
      processing: "در حال تحلیل هوشمند تماس…",
      queued: "این تماس برای تحلیل ثبت شد.",
      steps: [
        "در حال تبدیل گفتار به متن",
        "سنجش شاخص‌های رفتاری و لحن صدا",
        "شناسایی اعتراضات مشتری و پاسخ‌های فروشنده",
        "تدوین کارنامه عملکرد و طراحی تمرینات اختصاصی",
      ],
      reportTitle: "کارنامه عملکرد",
      another: "تحلیل تماس جدید",
      level: "سطح پیشرفته",
      strengths: "نقاط قوت",
      weaknesses: "نقاط ضعف و فرصت‌های ازدست‌رفته",
      drills: "تمرینات پیشنهادی اختصاصی",
      copy: "کپی متن گزارش",
      download: "دریافت فایل گزارش",
      copied: "متن گزارش کپی شد.",
      copyFailed: "کپی گزارش ممکن نشد.",
      openLesson: "رفتن به درس آکادمی",
      bars: {
        tone: "لحن",
        listening: "شنوندگی",
        objection: "اعتراضات",
        closing: "بستن قرارداد",
      },
      quotaExceeded:
        "سقف تحلیل رایگان روزانه (۳ تماس) تکمیل شد. برای تحلیل نامحدود و آرشیو تماس‌ها، پلن حرفه‌ای را ارتقا دهید.",
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
      about: "About Us",
      contact: "Contact Us",
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
      metricsTitle: "Academy impact",
      metricsHint: "These figures are display samples and count up as the strip comes into view.",
      metricStudents: "Active Students",
      metricHours: "Hours of Specialized Training",
      metricSatisfaction: "Student Satisfaction Rate",
      metricTeams: "Trained Teams & Businesses",
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
    aboutPage: {
      kicker: "Specialized Sales & Negotiation Academy",
      title: "Online, direct, and telephone sales, closed with high-stakes negotiation.",
      missionTitle: "Mission",
      mission:
        "Empowering businesses and professionals to master online, direct, and telephone sales along with high-stakes negotiation.",
      visionTitle: "Vision",
      vision:
        "A reference academy where every sales team turns a conversation into a clear decision, using current global standards and professional ethics.",
      statement:
        "NexSell is not a slogan deck. Each path is practice, feedback, and a standard a seller can use tomorrow at the table, on the phone, or in a message.",
      valuesTitle: "Core values of the academy",
      values: [
        {
          title: "Actionable Training",
          text: "Every lesson ties to a line, an objection, or a close. Slides without practice do not count.",
        },
        {
          title: "Global Sales Standards",
          text: "Frameworks sit next to professional sales teams, then get rewritten for the markets we actually sell in.",
        },
        {
          title: "Continuous Mentorship",
          text: "After the film, the challenge and the support chat stay on the path so practice is not left alone.",
        },
        {
          title: "Ethical Negotiation",
          text: "Concessions, pressure, and the close move without concealment and without spending the other side’s trust.",
        },
      ],
      leadTitle: "Founder and lead trainer",
      leadName: "Amirhossein Ghari",
      leadRole: "Sales Strategist & Master Negotiator",
      leadBadge: "Academy founder",
      leadBio:
        "Amirhossein Ghari has coached online, direct, and telephone sales teams through hard conversations. He built NexSell on actionable training, global standards, and negotiation ethics so managers and sellers both know the next move.",
      credentials: [
        "Paths for online, in-person, and telephone sales",
        "Coach for high-stakes negotiation",
        "Author of the academy’s field notes",
      ],
    },
    contactPage: {
      kicker: "Contact Us",
      title: "Direct channels, without a second message form.",
      intro: "Address, phone, email, and hours live here. Messages and tickets go through the support icon at the bottom-left.",
      hq: "Headquarters",
      address: "Tehran, Valiasr Street, Technology Tower, Floor 8",
      phone: "Direct Phone Lines",
      phones: [
        { label: "021-88880000", href: "tel:+982188880000" },
        { label: "0912-000-0000", href: "tel:+989120000000" },
      ],
      email: "Email Address",
      emails: [
        { label: "support@academy.com", href: "mailto:support@academy.com" },
        { label: "info@academy.com", href: "mailto:info@academy.com" },
      ],
      hours: "Working Hours",
      hoursText: "Sat–Wed 09:00 – 18:00",
      socialTitle: "Social media",
      socials: [
        { name: "Instagram", handle: "@academy_sales", href: "https://instagram.com/academy_sales", tone: "instagram" },
        { name: "Telegram", handle: "@academy_support", href: "https://t.me/academy_support", tone: "telegram" },
        { name: "LinkedIn", handle: "Academy Sales & Negotiation", href: "https://www.linkedin.com/company/academy-sales-negotiation", tone: "linkedin" },
        {
          name: "YouTube / Aparat",
          handle: "Academy Official",
          href: "https://www.youtube.com/@academyofficial",
          aparat: "https://www.aparat.com/academyofficial",
          tone: "video",
        },
      ],
      widgetNote: "For instant AI answers or tickets, use the support widget at the bottom-left.",
    },
    auditor: {
      kicker: "AI call auditor",
      title: "Sales call analysis",
      intro: "Drop a call recording or record one here. Each analysis uses one of today’s three calls.",
      uploadTab: "Upload audio file",
      recordTab: "Live voice recording",
      drop: "Drop an mp3, wav, or m4a file here, or choose one. Maximum 50MB.",
      browse: "Choose file",
      remove: "Remove",
      duration: "Simulated duration",
      badType: "Only mp3, wav, or m4a files are accepted.",
      badSize: "The file must be 50MB or smaller.",
      record: "Start recording",
      recording: "Recording",
      stop: "Stop",
      micError: "Microphone access was not available.",
      needAudio: "Choose a file or record a call first.",
      analyze: "Analyze Sales Call",
      processing: "Analyzing the sales call…",
      queued: "This call is in for analysis.",
      steps: [
        "Transcribing Call Audio...",
        "Evaluating Tone & Confidence...",
        "Detecting Objections & Closing...",
        "Finalizing Coaching Report...",
      ],
      reportTitle: "Coaching report",
      another: "Analyze Another Call",
      level: "Advanced",
      strengths: "Strengths",
      weaknesses: "Weaknesses and missed chances",
      drills: "Actionable drills",
      copy: "Copy Report",
      download: "Download PDF",
      copied: "Report copied.",
      copyFailed: "Could not copy the report.",
      openLesson: "Open the academy lesson",
      bars: {
        tone: "Tone",
        listening: "Listening",
        objection: "Objections",
        closing: "Closing",
      },
      quotaExceeded:
        "The free daily analysis cap (3 calls) is used up. Upgrade to the professional plan for unlimited analysis and a call archive.",
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
  const hydrated = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (hydrated.current) return;
      hydrated.current = true;
      const stored = localStorage.getItem("nexsell-lang");
      if (stored === "en" || stored === "fa") setLangState(stored);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
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
      setLang: (next) => {
        hydrated.current = true;
        setLangState(next);
      },
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
