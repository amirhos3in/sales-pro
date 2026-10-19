const KEY = "salespro-lms-v1";

const q = (prompt, options, answer, why) => ({ prompt, options, answer, why });

const TRACKS = [
  {
    id: "online",
    title: "فروش آنلاین",
    paid: true,
    blurb: "قیف، اعتماد و رساندن توجه به پیشنهاد.",
    lessons: [
      lesson("online-lead", "لید، پراسپکت و مشتری", "sdh3pzo", 6, "تفاوت سه مرحله قیف و عددی که عبور را نشان می‌دهد.", [
        q("لید یعنی چه کسی؟", ["هنوز فقط توجه نشان داده و راه تماس داده", "قرارداد را امضا کرده است", "حتماً همین هفته می‌خرد"], 0, "لید توجه به‌علاوه یک راه تماس است، نه خرید قطعی."),
        q("پراسپکت از لید جدا می‌شود وقتی…", ["نیاز و زمان خریدش روشن‌تر شده", "فقط پست را لایک کرده", "از پیج خارج شده"], 0, "پراسپکت یعنی نیاز و زمان، نه یک لایک."),
        q("شاخص عبور در قیف باید…", ["قابل شمارش و قابل مشاهده باشد", "فقط حس فروشنده باشد", "هر روز عوض شود"], 0, "اگر نشمارید، نمی‌دانید گلوگاه کجاست."),
      ]),
      lesson("online-funnel", "قیف فروش چیست؟", "4Se29", 4, "از آگاهی تا خرید، بالا پهن است و پایین تنگ.", [
        q("قیف بالا پهن است چون…", ["افراد زیادی آگاه می‌شوند و تعداد کمتری می‌خرند", "همه باید همزمان بخرند", "قیمت آنجا ارزان‌تر است"], 0, "ریزش بین مرحله‌ها طبیعی است و باید دیده شود."),
        q("کار مرحله میانی قیف چیست؟", ["اعتماد و تناسب را روشن کند", "فقط تخفیف بدهد", "مخاطب را بلاک کند"], 0, "وسط قیف جای فهمیدن تناسب است."),
        q("خروجی سالم قیف چیست؟", ["مشتری‌ای که تصمیم را با دلیل گرفته", "بیشترین لایک", "طولانی‌ترین ویدیو"], 0, "لایک خروجی قیف نیست."),
      ]),
      lesson("online-trust", "اعتماد فالوور", "Uftz9", 8, "قبل از قیمت، مخاطب باید دلیل گوش دادن داشته باشد.", [
        q("اعتماد قبل از قیمت یعنی…", ["مخاطب دلیل گوش دادن دارد", "اول تخفیف را فریاد بزنید", "شماره کارت را پیام اول بفرستید"], 0, "بدون دلیل شنیدن، قیمت فقط مقاومت می‌سازد."),
        q("کدام پیام اعتماد می‌سازد؟", ["یک نتیجه مشخص، بدون اغراق", "فقط امروز، وگرنه پشیمان می‌شی", "ده پیام پشت سر هم"], 0, "نتیجهٔ مشخص از فشار ساختگی قابل‌اعتمادتر است."),
        q("اگر فالوور سرد است، قدم درست…", ["یک سوال درباره موقعیت خودش", "لینک پرداخت فوری", "تخفیف پنجاه درصد بدون گفتگو"], 0, "سوال، گفتگو را باز می‌کند."),
      ]),
      lesson("online-offer", "از توجه تا پیشنهاد", "f337310", 7, "پیشنهاد وقتی می‌آید که مسئله شنیده شده باشد.", [
        q("پیشنهاد زودهنگام چه می‌کند؟", ["مکالمه را قبل از فهم مسئله می‌بندد", "همیشه نرخ تبدیل را بالا می‌برد", "جایگزین اعتماد است"], 0, "پیشنهاد بدون مسئله، قطع گفتگوست."),
        q("توجه را محتوا می‌گیرد. پیشنهاد را کی بدهیم؟", ["بعد از شنیدن مسئله مخاطب", "در همان ثانیه اول", "فقط زیر پست، بدون دایرکت"], 0, "ترتیب: توجه، مسئله، بعد پیشنهاد."),
        q("نشانه آماده‌بودن برای پیشنهاد چیست؟", ["مخاطب مسئله خودش را با مثال گفته", "فقط ایموجی فرستاده", "هنوز نام شما را نپرسیده و رفته"], 0, "مثال شخصی یعنی مسئله شنیده شده است."),
      ]),
    ],
  },
  {
    id: "live",
    title: "فروش حضوری",
    paid: true,
    blurb: "زبان بدن و برداشت اول، قبل از توضیح محصول.",
    lessons: [
      lesson("live-open", "زبان بدن فروش حضوری", "ocf64x3", 8, "بدن باز و روبه‌رو، قبل از جملهٔ اول اعتماد می‌سازد.", [
        q("کدام ترکیب به مقاومت نزدیک‌تر است؟", ["تکیه به عقب و دست‌های بسته", "خم شدن کوتاه به جلو و سوال", "یادداشت برداشتن از قیمت"], 0, "بدن بسته معمولاً یعنی فاصله، نه موافقت."),
        q("زبان بدن خودتان اول باید…", ["روبه‌رو، باز و بدون گوشی در دست باشد", "پشت میز قایم شود", "مدام به در نگاه کند"], 0, "مشتری بدن شما را زودتر از اسلاید می‌خواند."),
        q("اگر مشتری به جلو خم شد…", ["فضا برای ادامهٔ گفتگو بازتر است", "باید فوراً تخفیف داد", "جلسه را تمام کنید"], 0, "خم شدن به جلو یک نشانهٔ تمایل است."),
      ]),
      lesson("live-importance", "چرا زبان بدن فروش را عوض می‌کند", "d355ud8", 6, "ناهماهنگی حرف و بدن، جملهٔ درست را بی‌اثر می‌کند.", [
        q("وقتی حرف و بدن یکی نیست…", ["مشتری بدن را باور می‌کند", "مشتری فقط قیمت را می‌شنود", "اثر زبان بدن صفر است"], 0, "تناقض، اعتماد را سوراخ می‌کند."),
        q("اصلاح مفید در جلسه چیست؟", ["یک عادت کوچک مثل زمین گذاشتن گوشی", "حفظ ده قانون همزمان", "لبخند ثابت تا پایان"], 0, "یک اصلاح قابل‌اجرا بهتر از فهرست طولانی است."),
        q("زبان بدن جایگزین چیست نیست؟", ["جایگزین کشف نیاز نیست", "جایگزین سلام است", "جایگزین محصول است"], 0, "بدن در را باز می‌کند؛ نیاز را سوال کشف می‌کند."),
      ]),
      lesson("live-tracy", "نکاتی برای فروش بیشتر", "k822635", 7, "فروش بیشتر از شلوغ کردن پیشنهاد نمی‌آید.", [
        q("فروش بیشتر حضوری از کجا شروع می‌شود؟", ["فهم یک درد مشخص در همان جلسه", "خواندن کاتالوگ کامل", "سه تخفیف پشت سر هم"], 0, "درد مشخص، مسیر پیشنهاد را کوتاه می‌کند."),
        q("کدام کار فروش را بیشتر نمی‌کند؟", ["فهرست ویژگی بدون فایده برای همین مشتری", "وصل کردن فایده به درد جلسه", "گرفتن تایید روی قدم بعدی"], 0, "ویژگیِ بی‌فایده فقط زمان می‌سوزاند."),
        q("بستن حضوری یعنی…", ["قدم بعدی، مسئول و زمان مشخص شود", "مشتری سکوت کند و شما تخفیف بدهید", "کارت ویزیت پخش شود"], 0, "بدون قدم بعدی، جلسه تمام نشده است."),
      ]),
      lesson("live-manager", "زبان بدن مدیر فروش", "b1315gv", 6, "مدیر با آرامش جلسه را نگه می‌دارد، نه با عجله.", [
        q("عجلهٔ مدیر چه پیامی می‌دهد؟", ["ناامنی یا بی‌توجهی به مشتری", "تسلط کامل", "احترام بیشتر"], 0, "شتاب، فضا را برای حرف مشتری می‌بندد."),
        q("وقتی کارشناس از مسیر خارج شد، مدیر…", ["با یک سوال جلسه را به مسئله برمی‌گرداند", "جلوی مشتری او را اصلاح تند می‌کند", "تخفیف را وسط حرف می‌اندازد"], 0, "اصلاح باید مسئله را برگرداند، نه آبرو را بسوزاند."),
        q("نشانهٔ جلسهٔ در اختیار مدیر چیست؟", ["هر دو طرف همان قدم بعدی را تکرار می‌کنند", "فقط مدیر حرف زده", "مشتری به ساعت نگاه می‌کند و جواب نداده"], 0, "تکرار قدم بعدی یعنی توافق شنیده شده است."),
      ]),
    ],
  },
  {
    id: "phone",
    title: "فروش تلفنی",
    paid: true,
    blurb: "برخورد اول، نمونه مکالمه و نقشهٔ تماس.",
    lessons: [
      lesson("phone-first", "اولین برخورد در کال‌سنتر", "y135t38", 6, "ده ثانیهٔ اول دلیل تماس است، نه معرفی طولانی.", [
        q("شروع تماس سرد بهتر است با…", ["دلیل کوتاه تماس و یک سوال مرتبط", "خواندن معرفی کامل شرکت", "اعلام قیمت"], 0, "مخاطب اول باید بفهمد چرا زنگ زده‌اید."),
        q("کدام شروع ضعیف است؟", ["خواندن کاتالوگ در جملهٔ اول", "پرسیدن یک سوال از موقعیت او", "گفتن نام و دلیل یک‌خطی"], 0, "کاتالوگ در ثانیهٔ اول تماس را می‌بندد."),
        q("قلاب گرفته وقتی…", ["طرف مقابل به سوال اول جواب می‌دهد", "شما سه دقیقه بی‌وقفه حرف زده‌اید", "تماس قطع شده"], 0, "جواب یعنی مکالمه شروع شده است."),
      ]),
      lesson("phone-sample", "نمونه مکالمه فروش تلفنی", "l97j30d", 8, "نمونه نقشه است، نه متنی که خط‌به‌خط خوانده شود.", [
        q("اسکریپت پویا یعنی…", ["سوال بعدی از حرف خود مشتری می‌آید", "باید حتماً به خط اول برگشت", "تخفیف را در هر شاخه گفت"], 0, "شاخه را جواب مشتری انتخاب می‌کند."),
        q("اگر مشتری وسط حرف پرید…", ["همان موضوع او را ادامه دهید", "از خط اول دوباره بخوانید", "تماس را قطع کنید"], 0, "برگشت به متن، شنیدن را خراب می‌کند."),
        q("پایان یک نمونهٔ خوب چیست؟", ["قدم بعدی با دو زمان مشخص", "«بعداً خبر می‌دهیم» بدون تاریخ", "خواندن دوباره مزایا"], 0, "بدون زمان، تماس رها شده است."),
      ]),
      lesson("phone-roadmap", "نقشه راه فروش تلفنی", "kjhf6jl", 7, "تماس یک مسیر است: قلاب، کشف، جواب، قرار.", [
        q("ترتیب سالم تماس کدام است؟", ["قلاب، کشف نیاز، جواب، قرار", "قیمت، خداحافظ، معرفی", "تخفیف، تخفیف، قطع"], 0, "قرار آخر مسیر است نه اول آن."),
        q("کشف نیاز در تماس یعنی…", ["یک سوال که موقعیت را روشن کند", "حدس زدن شغل از روی صدا", "فرستادن کاتالوگ"], 0, "بدون سوال، نقشه کور است."),
        q("نقشه وقتی درست است که…", ["بتوانید بگویید تماس در کدام مرحله مانده", "همه تماس‌ها یک متن ثابت داشته باشند", "هیچ اعتراضی پیش نیاید"], 0, "دانستن مرحله، قدم بعدی را معلوم می‌کند."),
      ]),
      lesson("phone-intro", "معارفه هنر فروش تلفنی", "bpt696d", 5, "فروش تلفنی مهارت شنیدن در زمان کوتاه است.", [
        q("هنر فروش تلفنی اول چیست؟", ["شنیدن و کوتاه جواب دادن", "بلندتر حرف زدن از مشتری", "حفظ متن طولانی"], 0, "تماس جای نمایش صدا نیست."),
        q("لحن مناسب نزدیک چیست؟", ["کمی آرام‌تر از سرعت مشتری", "انرژی مصنوعی و یکنواخت", "تندی برای جدی به‌نظر رسیدن"], 0, "سرعت نزدیک، فهم را بالا می‌برد."),
        q("معارفهٔ طولانی در ابتدا…", ["دلیل تماس را گم می‌کند", "اعتماد را تضمین می‌کند", "جایگزین سوال است"], 0, "معرفی کوتاه کافی است."),
      ]),
    ],
  },
  {
    id: "deal",
    title: "اصول مذاکره",
    paid: true,
    blurb: "اصول، مخالفت، استراتژی و گفتگوی پیام‌رسان.",
    lessons: [
      lesson("neg-principles", "اصول مذاکره فروش", "u83r56k", 8, "قبل از امتیاز، حد خروج و خواستهٔ اصلی را بدانید.", [
        q("قبل از جلسه باید روشن باشد…", ["حد امتیاز و دلیل هر امتیاز", "فقط امید به رابطه", "بیشترین تخفیف ممکن"], 0, "بدون حد، امتیازها بی‌دلیل می‌ریزند."),
        q("امتیاز درست کدام است؟", ["مشروط به یک خواستهٔ مشخص", "رایگان و پشت سر هم", "برای تمام کردن سکوت"], 0, "امتیازِ بدون مبادله، مذاکره نیست."),
        q("اگر از نقطهٔ خروج رد شدید…", ["محترمانه جمع کنید", "بمانید و باز هم امتیاز بدهید", "قیمت را نصف کنید"], 0, "ماندن بعد از حد، ضرر را بزرگ می‌کند."),
      ]),
      lesson("neg-objection", "مخالفت مشتری", "v43l4f5", 7, "مخالفت را تکرار کنید و فقط همان را جواب دهید.", [
        q("اولین واکنش به مخالفت…", ["کوتاه تکرار کنید تا مطمئن شوید درست شنیده‌اید", "فوراً تخفیف بدهید", "بحث را شخصی کنید"], 0, "تکرار یعنی شنیدن، نه تسلیم."),
        q("«باید فکر کنم» را چطور باز کنیم؟", ["بپرسید کدام بخش مبهم است", "پنج پیام تخفیف بفرستید", "مکالمه را تمام‌شده بدانید"], 0, "فکر کردن اغلب یک ابهام مشخص است."),
        q("همهٔ مخالفت‌ها…", ["یک جواب آماده ندارند", "با تخفیف حل می‌شوند", "یعنی مشتری رفته است"], 0, "قیمت، زمان و اولویت جواب جدا دارند."),
      ]),
      lesson("neg-strategy", "استراتژی مذاکره فروش", "qbvpg08", 8, "استراتژی یعنی متغیرها را بشناسید، نه فقط چانه روی قیمت.", [
        q("بن‌بست را با چه چیزی بشکنیم؟", ["عوض کردن متغیر زمان، حجم یا شرط", "فقط بالا و پایین کردن قیمت", "قطع مذاکره با عصبانیت"], 0, "قیمت تنها پیچ معامله نیست."),
        q("لنگر قیمت بهتر است…", ["با یک معیار همراه باشد", "عدد خیلی دور و بدون توضیح باشد", "آخر جلسه و یواشکی گفته شود"], 0, "لنگرِ بی‌معیار اعتماد را می‌سوزاند."),
        q("استراتژی خوب قبل از میز…", ["هدف طرف مقابل را از هدف اعلامی جدا می‌کند", "فرض می‌کند فقط قیمت مهم است", "امتیازها را از قبل خرج می‌کند"], 0, "هدف واقعی اغلب غیر از جملهٔ اول است."),
      ]),
      lesson("neg-social", "مذاکره در اینستاگرام و تلگرام", "nbrnzg6", 6, "پیام‌رسان هم مذاکره است؛ نوشته جای عجله نیست.", [
        q("در دایرکت پیشنهاد را کی بفرستیم؟", ["بعد از فهم نیاز در چند پیام", "همان پیام اول با لینک پرداخت", "بعد از ده استیکر"], 0, "زمینهٔ نوشته باید قبل از لینک باشد."),
        q("اگر نوشت «گرونه»…", ["بپرسید نسبت به کدام نتیجه گران است", "فوراً پنجاه درصد کم کنید", "او را بلاک کنید"], 0, "گرانی بدون معیار، هنوز اطلاعات است."),
        q("بستن در پیام یعنی…", ["قدم بعدی، زمان و نتیجه روشن باشد", "فقط یک ایموجی تایید", "دیدن پیام بدون جواب"], 0, "دیدن پیام، توافق نیست."),
      ]),
    ],
  },
  {
    id: "free",
    title: "آموزش رایگان و مقدماتی",
    paid: false,
    blurb: "سه درس برای شروع. بدون اشتراک، با همان قفل آزمون.",
    lessons: [
      lesson("free-expression", "فن بیان برای فروش", "d48l8u4", 3, "یک جملهٔ واضح، قبل از هر مسیر تخصصی.", [
        q("فن بیان در فروش اول برای چیست؟", ["فهمیده شدن در یک جمله", "زیبا حرف زدن بدون محتوا", "تند حرف زدن"], 0, "اگر نفهمند، لحن زیبا فروشی نیست."),
        q("جمله واضح فروش…", ["یک نتیجه برای مشتری را نام می‌برد", "سه محصول را قاطی می‌کند", "با عذرخواهی شروع می‌شود"], 0, "یک نتیجه کافی و روشن است."),
        q("تمرین فن بیان یعنی…", ["همان جمله را شمرده و قابل فهم بگویید", "لحن را هر کلمه عوض کنید", "از روی متن بدون معنی بخوانید"], 0, "شمرده گفتن، تمرین اصلی است."),
      ]),
      lesson("free-collar", "یک نکته زبان بدن", "e925n18", 2, "جزئیات ظاهر، برداشت اول را می‌سازد.", [
        q("برداشت اول حضوری بیشتر از کجا می‌آید؟", ["آنچه قبل از توضیح محصول دیده می‌شود", "پاورقی قرارداد", "رنگ لوگو در اسلاید دهم"], 0, "دیدن، زودتر از شنیدن قضاوت می‌شود."),
        q("جزئیات ظاهر وقتی مهم است که…", ["با پیام دقت یا بی‌دقتی جور باشند", "فقط گران‌ترین لباس باشد", "جایگزین کشف نیاز شود"], 0, "ظاهر پیام است، نه کل فروش."),
        q("نکته این درس رایگان…", ["یک اصلاح کوچک برای جلسه بعد", "خرید پلن داخل ویدیو", "حفظ نظریه طولانی"], 0, "یک تغییر کوچک قابل‌اجرا هدف درس است."),
      ]),
      lesson("free-funnel", "قیف را خالی نگذارید", "c63651b", 3, "فروش پایدار چند گفتگوی باز می‌خواهد.", [
        q("قیف خالی چه نشانه‌ای است؟", ["همه امیدها در یک گفتگوست", "مهارت کامل مذاکره", "قیمت درست"], 0, "یک گفتگو، قیف نیست."),
        q("کار این هفته چیست؟", ["چند گفتگوی باز را روی کاغذ بشمارید", "فقط منتظر تماس ورودی بمانید", "قیف را فراموش کنید"], 0, "شمردن گفتگوها قیف را واقعی می‌کند."),
        q("پایداری فروش یعنی…", ["همیشه چند فرصت در مرحله‌های مختلف باشد", "یک قرارداد بزرگ در سال", "تعطیل کردن جذب"], 0, "مرحله‌های مختلف، افت یک معامله را جبران می‌کنند."),
      ]),
    ],
  },
];

function lesson(id, title, aparat, minutes, summary, quiz) {
  return { id, title, aparat, minutes, summary, quiz };
}

const fa = (value) => value.toLocaleString("fa-IR");
const $ = (selector) => document.querySelector(selector);

function emptyState() {
  return { phone: null, users: {} };
}

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "");
    if (!parsed || typeof parsed !== "object") return emptyState();
    return { phone: parsed.phone || null, users: parsed.users || {} };
  } catch {
    return emptyState();
  }
}

function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

let state = load();

function current() {
  if (!state.phone) return null;
  return state.users[state.phone] || null;
}

function ensureUser(phone) {
  if (!state.users[phone]) {
    state.users[phone] = { phone, plan: "free", passed: [], watched: [] };
  }
  state.phone = phone;
  save(state);
}

function lessonIndex(track, id) {
  return track.lessons.findIndex((item) => item.id === id);
}

function findLesson(id) {
  for (const track of TRACKS) {
    const item = track.lessons.find((lesson) => lesson.id === id);
    if (item) return { track, lesson: item };
  }
  return null;
}

function statusOf(track, index) {
  const user = current();
  const item = track.lessons[index];
  if (!user) return "locked";
  if (track.paid && user.plan !== "vip") return "locked";
  if (index > 0 && !user.passed.includes(track.lessons[index - 1].id)) return "locked";
  if (user.passed.includes(item.id)) return "done";
  if (user.watched.includes(item.id)) return "learning";
  return "ready";
}

function openModal(id) {
  const node = document.getElementById(id);
  node.classList.remove("hidden");
  node.classList.add("grid");
}

function closeModal(id) {
  const node = document.getElementById(id);
  node.classList.add("hidden");
  node.classList.remove("grid");
}

function renderNav() {
  const user = current();
  const host = $("#nav-user");
  if (!user) {
    host.innerHTML = '<button type="button" id="nav-login" class="h-10 rounded-full bg-gold px-4 text-sm font-bold text-navy">ورود / ثبت‌نام سریع</button>';
    $("#nav-login").onclick = () => openModal("auth-modal");
    return;
  }
  const badge = user.plan === "vip" ? "اشتراک ویژه" : "رایگان";
  host.innerHTML = `
    <span class="hidden text-xs text-white/70 sm:inline">${user.phone}</span>
    <span class="rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-navy">${badge}</span>
    <button type="button" id="nav-logout" class="h-10 rounded-full px-3 text-sm ring-1 ring-white/20">خروج</button>`;
  $("#nav-logout").onclick = () => {
    state.phone = null;
    save(state);
    render();
  };
}

function renderTracks() {
  const root = $("#tracks");
  root.innerHTML = TRACKS.map((track) => {
    const cards = track.lessons.map((item, index) => {
      const status = statusOf(track, index);
      const label = status === "done" ? "تکمیل‌شده ✅" : status === "learning" ? "در حال یادگیری ▶️" : status === "ready" ? "آماده پخش ▶️" : "قفل‌شده 🔒";
      const muted = status === "locked" ? "opacity-60" : "";
      return `<button type="button" data-lesson="${item.id}" class="lift flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-start ${muted}">
        <span><span class="block text-sm font-semibold">${fa(index + 1)}. ${item.title}</span><span class="mt-1 block text-xs text-white/50">${fa(item.minutes)} دقیقه</span></span>
        <span class="shrink-0 text-xs">${label}</span>
      </button>`;
    }).join("");
    const tag = track.paid ? "ویژه" : "رایگان";
    return `<article class="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
      <div class="flex items-start justify-between gap-3">
        <div><h2 class="text-xl font-bold">${track.title}</h2><p class="mt-1 text-sm text-white/60">${track.blurb}</p></div>
        <span class="rounded-full bg-white/10 px-3 py-1 text-xs">${tag} · ${fa(track.lessons.length)} درس</span>
      </div>
      <div class="mt-4 grid gap-2">${cards}</div>
    </article>`;
  }).join("");
  root.querySelectorAll("[data-lesson]").forEach((button) => {
    button.onclick = () => onLesson(button.getAttribute("data-lesson"));
  });
}

function renderPlanNote() {
  const user = current();
  $("#plan-note").textContent = user?.plan === "vip" ? "اشتراک ویژه روی همین مرورگر فعال است." : "این دکمه پرداخت واقعی نیست و فقط برای آزمون قفل‌ها پلن را ویژه می‌کند.";
}

function render() {
  renderNav();
  renderTracks();
  renderPlanNote();
}

let activeId = null;
let quizPick = [];

function onLesson(id) {
  const found = findLesson(id);
  if (!found) return;
  const user = current();
  if (!user) {
    openModal("auth-modal");
    return;
  }
  const index = lessonIndex(found.track, id);
  if (found.track.paid && user.plan !== "vip") {
    openModal("paywall-modal");
    return;
  }
  if (index > 0 && !user.passed.includes(found.track.lessons[index - 1].id)) return;
  activeId = id;
  $("#player-title").textContent = found.lesson.title;
  $("#player-summary").textContent = found.lesson.summary;
  $("#player-frame").src = `https://www.aparat.com/video/video/embed/videohash/${found.lesson.aparat}/vt/frame`;
  const done = $("#player-done");
  done.checked = user.passed.includes(id) || user.watched.includes(id);
  syncQuizButton();
  openModal("player-modal");
}

function syncQuizButton() {
  const button = $("#open-quiz");
  const ready = $("#player-done").checked;
  button.disabled = !ready;
}

function activateVip() {
  const user = current();
  if (!user) {
    closeModal("paywall-modal");
    openModal("auth-modal");
    return;
  }
  user.plan = "vip";
  save(state);
  closeModal("paywall-modal");
  render();
}

function burst() {
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.classList.remove("hidden");
  const colors = ["#D4AF37", "#F8F1DE", "#FFFFFF", "#E5C07B"];
  const pieces = Array.from({ length: 90 }, () => ({
    x: canvas.width * 0.5,
    y: canvas.height * 0.35,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -12 - 2,
    g: 0.25,
    s: 6 + Math.random() * 6,
    c: colors[Math.floor(Math.random() * colors.length)],
  }));
  const start = performance.now();
  function frame(now) {
    if (now - start > 1600) {
      canvas.classList.add("hidden");
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((piece) => {
      piece.vy += piece.g;
      piece.x += piece.vx;
      piece.y += piece.vy;
      ctx.fillStyle = piece.c;
      ctx.fillRect(piece.x, piece.y, piece.s, piece.s * 0.6);
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function openQuiz() {
  quizPick = [];
  drawQuiz(0, null);
  openModal("quiz-modal");
}

function drawQuiz(step, picked) {
  const found = findLesson(activeId);
  const card = $("#quiz-card");
  if (step >= found.lesson.quiz.length) {
    const correct = found.lesson.quiz.filter((item, index) => quizPick[index] === item.answer).length;
    const passed = correct >= 2;
    card.innerHTML = `
      <h2 class="text-xl font-bold">${passed ? "قبول شدید" : "این بار کامل نشد"}</h2>
      <p class="mt-3 text-sm leading-7">${fa(correct)} از ${fa(3)}</p>
      <p class="mt-2 text-sm leading-7">${passed ? "درس تکمیل شد و مرحلهٔ بعد باز می‌شود." : "حداقل ۲ پاسخ درست برای باز شدن درس بعدی لازم است"}</p>
      <div class="mt-5 flex gap-2">
        ${passed ? "" : '<button type="button" id="quiz-retry" class="h-11 rounded-2xl bg-navy px-4 text-sm font-bold text-gold">تلاش مجدد</button>'}
        <button type="button" id="quiz-close" class="h-11 rounded-2xl px-4 text-sm">بستن</button>
      </div>`;
    if (passed) {
      const user = current();
      if (!user.passed.includes(activeId)) user.passed.push(activeId);
      if (!user.watched.includes(activeId)) user.watched.push(activeId);
      save(state);
      burst();
      render();
    }
    $("#quiz-close").onclick = () => closeModal("quiz-modal");
    const retry = $("#quiz-retry");
    if (retry) retry.onclick = () => openQuiz();
    return;
  }
  const item = found.lesson.quiz[step];
  const options = item.options.map((option, index) => {
    let tone = "border-navy/15";
    if (picked !== null) {
      if (index === item.answer) tone = "border-emerald-600 bg-emerald-50";
      else if (index === picked) tone = "border-red-600 bg-red-50";
    }
    return `<button type="button" data-choice="${index}" class="block w-full rounded-2xl border px-3 py-3 text-start text-sm ${tone}" ${picked !== null ? "disabled" : ""}>${option}</button>`;
  }).join("");
  card.innerHTML = `
    <p class="text-xs text-navy/50">سوال ${fa(step + 1)} از ${fa(3)}</p>
    <h2 class="mt-2 text-lg font-bold">${item.prompt}</h2>
    <div class="mt-4 space-y-2">${options}</div>
    ${picked !== null ? `<p class="mt-3 text-sm leading-7">${item.why}</p><button type="button" id="quiz-next" class="mt-4 h-11 rounded-2xl bg-navy px-4 text-sm font-bold text-gold">${step === 2 ? "دیدن نتیجه" : "سوال بعد"}</button>` : ""}`;
  card.querySelectorAll("[data-choice]").forEach((button) => {
    button.onclick = () => {
      quizPick[step] = Number(button.getAttribute("data-choice"));
      drawQuiz(step, quizPick[step]);
    };
  });
  const next = $("#quiz-next");
  if (next) next.onclick = () => drawQuiz(step + 1, null);
}

function digits(value) {
  return value.replace(/[۰-۹]/g, (char) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(char))).replace(/\D/g, "");
}

function animateStats() {
  const nodes = document.querySelectorAll("[data-count]");
  const run = () => {
    nodes.forEach((node) => {
      const target = Number(node.dataset.count);
      const prefix = node.dataset.prefix || "";
      const suffix = node.dataset.suffix || "";
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / 900);
        node.textContent = prefix + fa(Math.round(target * progress)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };
  const stats = $("#stats");
  if (!("IntersectionObserver" in window)) {
    run();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      run();
      observer.disconnect();
    }
  }, { threshold: 0.4 });
  observer.observe(stats);
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  animateStats();
  $("#cta-start").onclick = () => {
    if (current()) document.getElementById("tracks").scrollIntoView();
    else openModal("auth-modal");
  };
  $("#start-free").onclick = () => $("#cta-start").click();
  $("#buy-plan").onclick = activateVip;
  $("#paywall-buy").onclick = activateVip;
  $("#player-done").onchange = () => {
    const user = current();
    if ($("#player-done").checked && user && !user.watched.includes(activeId)) {
      user.watched.push(activeId);
      save(state);
      render();
    }
    syncQuizButton();
  };
  $("#open-quiz").onclick = openQuiz;
  $("#auth-form").onsubmit = (event) => {
    event.preventDefault();
    const phone = digits($("#auth-phone").value);
    const otp = digits($("#auth-otp").value);
    const error = $("#auth-error");
    if (phone.length < 10) {
      error.textContent = "شماره موبایل را کامل وارد کنید.";
      error.classList.remove("hidden");
      return;
    }
    if (!/^\d{4}$/.test(otp)) {
      error.textContent = "کد تایید باید ۴ رقم باشد.";
      error.classList.remove("hidden");
      return;
    }
    error.classList.add("hidden");
    ensureUser(phone);
    closeModal("auth-modal");
    render();
  };
  document.querySelectorAll("[data-close]").forEach((button) => {
    button.onclick = () => closeModal(button.getAttribute("data-close"));
  });
  window.addEventListener("message", (event) => {
    if (!String(event.origin).includes("aparat.com")) return;
    const raw = typeof event.data === "string" ? event.data : JSON.stringify(event.data || "");
    if (/ended|complete|finish/i.test(raw)) {
      $("#player-done").checked = true;
      $("#player-done").dispatchEvent(new Event("change"));
    }
  });
});
