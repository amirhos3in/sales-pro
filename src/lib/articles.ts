export type Localized = { fa: string; en: string };

export type ArticleBlock =
  | { type: "p"; text: Localized }
  | { type: "h2"; text: Localized }
  | { type: "h3"; text: Localized }
  | { type: "ul"; items: Localized[] }
  | { type: "note"; title: Localized; text: Localized }
  | { type: "checklist"; title: Localized; items: Localized[] };

export type ArticleRelated = {
  courseId: "online" | "hozuri" | "telefoni" | "mozakerah";
  lessonId?: string;
  lessonCta: Localized;
  courseCta: Localized;
};

export type Article = {
  id: string;
  slug: string;
  title: Localized;
  excerpt: Localized;
  category: Localized;
  author: { name: Localized; role: Localized };
  publishedAt: Localized;
  readTime: Localized;
  coverImage: string;
  visual: "hook" | "closes" | "price" | "proof" | "room" | "status" | "trade" | "funnel";
  related: ArticleRelated;
  content: ArticleBlock[];
};

const author = {
  name: { fa: "امیرحسین قاری", en: "Amirhossein Ghari" },
  role: { fa: "مدرس و استراتژیست فروش", en: "Sales instructor and strategist" },
};

function t(fa: string, en: string): Localized {
  return { fa, en };
}

function p(fa: string, en: string): ArticleBlock {
  return { type: "p", text: t(fa, en) };
}

function h2(fa: string, en: string): ArticleBlock {
  return { type: "h2", text: t(fa, en) };
}

function h3(fa: string, en: string): ArticleBlock {
  return { type: "h3", text: t(fa, en) };
}

function ul(items: Array<[string, string]>): ArticleBlock {
  return { type: "ul", items: items.map(([fa, en]) => t(fa, en)) };
}

function note(titleFa: string, titleEn: string, fa: string, en: string): ArticleBlock {
  return { type: "note", title: t(titleFa, titleEn), text: t(fa, en) };
}

function checklist(titleFa: string, titleEn: string, items: Array<[string, string]>): ArticleBlock {
  return { type: "checklist", title: t(titleFa, titleEn), items: items.map(([fa, en]) => t(fa, en)) };
}

export const articleFilters = [
  { id: "all", label: "همه" },
  { id: "فروش تلفنی", label: "فروش تلفنی" },
  { id: "فروش حضوری", label: "فروش حضوری" },
  { id: "فروش آنلاین", label: "فروش آنلاین" },
  { id: "مذاکره حرفه‌ای", label: "مذاکره حرفه‌ای" },
] as const;

export const articles: Article[] = [
  {
    id: "art-01",
    slug: "fifteen-second-hook",
    title: t("قلاب ۱۵ ثانیه؛ قبل از آنکه منشی قطع کند", "The 15-second hook, before the gatekeeper hangs up"),
    excerpt: t(
      "جمله اول تماس سرد سه تکه دارد: نام، مسئله او، و اجازه یک سؤال.",
      "The first line of a cold call has three parts: your name, their problem, and permission for one question.",
    ),
    category: t("فروش تلفنی", "Telesales"),
    author,
    publishedAt: t("۱۴ اسفند ۱۴۰۳", "March 4, 2025"),
    readTime: t("۶ دقیقه", "6 min"),
    coverImage: "",
    visual: "hook",
    related: {
      courseId: "telefoni",
      lessonId: "phone-first",
      lessonCta: t("رفتن به درس برخورد اول", "Open the first-contact lesson"),
      courseCta: t("مشاهده دوره فروش تلفنی", "View the telesales course"),
    },
    content: [
      p(
        "بیشتر تماس‌های سرد در سلام طولانی می‌میرند. فروشنده نام شرکت، شهر، سال تأسیس و فهرست خدمات را پشت سر هم می‌گوید، در حالی که طرف مقابل هنوز نمی‌داند این زنگ به کدام کار امروز او مربوط است. منشی یا خود مدیر، حق دارد قطع کند. او صف تماس دارد و جمله‌ای که مسئله را نشان ندهد، برایش مزاحمت است نه فرصت.",
        "Most cold calls die in a long hello. The seller lists the company and the services before the listener knows which job this call is about.",
      ),
      p(
        "قلاب پانزده‌ثانیه برای این است که تماس را زنده نگه دارد، نه اینکه محصول را بفروشد. فروش در جمله اول اتفاق نمی‌افتد. اگر شنونده بفهمد کی زنگ زده، چرا این موضوع به کار او می‌خورد، و اینکه فقط برای یک سؤال اجازه می‌خواهید، معمولاً به جای قطع کردن می‌گوید «بفرمایید». همین یک کلمه، در تماس سرد برد است.",
        "The fifteen-second hook keeps the call alive. It does not sell the product. Name, reason, and permission for one question are enough.",
      ),
      h2("چرا جمله اول قطع می‌شود", "Why the first line gets cut"),
      p(
        "در بازار ایران خیلی از شماره‌ها اول به منشی، مسئول دفتر یا همکار خط می‌رسند. این آدم قرار نیست خرید کند. کارش این است که تماس را یا وصل کند یا تمام کند. اگر دلیل تماس در یک خط قابل تکرار نباشد، او چیزی برای گفتن به مدیر ندارد. «آقای محمدی از یک شرکت آموزشی زنگ زده، می‌خواست معرفی کند» معمولاً به «بگویید ایمیل بفرستند» ختم می‌شود.",
        "In many Iranian offices the first listener is a gatekeeper. If the reason does not fit in one line, they have nothing useful to pass on.",
      ),
      p(
        "جمله بد این شکلی است: «سلام وقت بخیر، مزاحم شدم، از مجموعه نکس‌سل تماس می‌گیرم، ما سال‌هاست در حوزه آموزش فروش فعالیت داریم و خدمات متنوعی برای تیم‌ها داریم، اگر اجازه بدهید کمی در مورد پکیج‌ها توضیح بدهم.» نفس کم می‌آید، موضوع مشخص نیست، و اجازه برای یک معرفی طولانی گرفته شده نه برای یک سؤال. شنونده هنوز نمی‌داند مسئله خودش کجای این حرف است.",
        "A weak open lists the company history and asks permission for a long pitch. The listener still does not hear their own problem.",
      ),
      h2("سه تکه قلاب", "Three parts of the hook"),
      h3("نام، نه شعار", "Your name, not a slogan"),
      p(
        "نام خودتان را بگویید و اگر لازم است نام مجموعه را در حد یک کلمه کنارش بگذارید. شعار برند، رتبه، و «اولین و بزرگ‌ترین» در ثانیه اول جا ندارد. مدیر یک کلینیک یا صاحب یک عمده‌فروشی در مولوی، با اسم آدم حرف می‌زند نه با بروشور. اگر بعداً پرسید از کجا زنگ زدید، همان‌جا اسم مجموعه را کامل کنید.",
        "Say your name. Save the brand slogan. People talk to a person first.",
      ),
      h3("یک مسئله آشنا", "One familiar problem"),
      p(
        "مسئله باید چیزی باشد که شنونده همین هفته با آن درگیر است، نه ویژگی محصول شما. برای یک درمانگاه: نوبت‌ها پر است ولی خیلی از تماس‌ها به مراجعه تبدیل نمی‌شود. برای یک تیم فروش مصالح: استعلام زیاد است و جواب قیمت در واتساپ می‌ماند. برای یک نمایندگی بیمه: تمدیدها هر سال از دست می‌رود چون کسی سر وقت زنگ نمی‌زند. یک مسئله، نه سه تا.",
        "Name one problem they already recognize: missed appointments, quotes that die in chat, renewals nobody calls about.",
      ),
      h3("اجازه برای یک سؤال", "Permission for one question"),
      p(
        "آخر قلاب، اجازه است. نه اجازه ارائه. اجازه یک سؤال. سؤال یعنی شنونده هنوز صاحب وقت خودش است. نمونه: «من سارا هستم از نکس‌سل. با تیم‌هایی کار می‌کنم که سرنخ دارند ولی به جلسه نمی‌رسند. اگر شصت ثانیه وقت دارید یک سؤال بپرسم؟» بعد سکوت. سکوت بخشی از قلاب است. اگر همان لحظه توضیح را شروع کنید، اجازه‌ای که گرفتید را خودتان پس می‌گیرید.",
        "End with permission for one question, then wait. Do not spend the permission on a speech.",
      ),
      note(
        "فشار نسازید",
        "Do not invent pressure",
        "نگویید «فقط امروز فرصت دارید» یا «اگر همین حالا جواب ندهید جا را از دست می‌دهید». در تماس سرد هنوز مسئله را نشنیده‌اید. فوریت ساختگی، قلاب را از یک سؤال محترمانه به مزاحمت تبدیل می‌کند.",
        "Do not invent a deadline in the first sentence. You have not heard their problem yet.",
      ),
      h2("قابل گفتن برای منشی", "Easy for a gatekeeper to repeat"),
      p(
        "قلاب را طوری بنویسید که منشی بتواند همان را به مدیر بگوید. یک خط کافی است: «در مورد تماس‌هایی زنگ زده که به مراجعه تبدیل نمی‌شوند و خواست یک سؤال بپرسد.» اگر خط شما از این بلندتر شد، صفت اضافه است. «جامع، تخصصی، تحول‌آفرین، مبتنی بر هوش مصنوعی» هیچ‌کدام به منشی کمک نمی‌کند تصمیم بگیرد وصل کند یا نه.",
        "Write a line the gatekeeper can repeat. Extra adjectives do not help them decide.",
      ),
      p(
        "اگر مدیر خودش جواب داد، همان قلاب را نگه دارید و فقط اسم مخاطب را درست صدا کنید. عوض کردن متن به خاطر اینکه «مدیر است» معمولاً یعنی برمی‌گردید به معرفی شرکت. مدیر هم همان مشکل را دارد: وقت کم. تفاوت این است که او می‌تواند همان لحظه به سؤال شما جواب بدهد.",
        "If the manager answers, keep the same hook. Do not switch into a company introduction.",
      ),
      h2("سؤال بعد از اجازه", "The question after they say yes"),
      p(
        "سؤالی که بعد از «بفرمایید» می‌آید باید درباره وضعیت خود او باشد، نه درباره علاقه به محصول. برای کلینیک: «تماس‌های بی‌پاسخ را خود پزشک برمی‌گرداند یا کسی در پذیرش؟» برای مصالح: «استعلام‌هایی که همان روز بسته نمی‌شوند را کجا یادداشت می‌کنید؟» جواب این سؤال، ادامه تماس را می‌سازد. اگر جواب داد «خودمان زنگ می‌زنیم ولی معمولاً یادمان می‌رود»، شما دیگر لازم نیست ویژگی بفروشید. مسئله را خودش گفته.",
        "The next question is about their situation, not about interest in your product.",
      ),
      p(
        "اگر گفت وقت ندارد، قلاب را تکرار نکنید. یک زمان مشخص پیشنهاد بدهید: «چهارشنبه ساعت ده صبح، پنج دقیقه، مناسب است؟» «هر وقت خواستید» قرار نیست. قرار یعنی روز و ساعت. اگر آن را هم نخواست، تماس را مودبانه ببندید و وضعیت را بنویسید. اصرار در همان تماس، قلاب خوب را خراب می‌کند.",
        "If they have no time, offer one specific slot. Do not say “whenever.”",
      ),
      checklist(
        "قبل از لیست امروز",
        "Before today's list",
        [
          ["قلاب را بلند بخوانید. اگر از پانزده ثانیه گذشت، یک صفت را خط بزنید.", "Read it aloud. If it passes fifteen seconds, cut one adjective."],
          ["مسئله را با زبان همان صنف بنویسید، نه با نام محصول.", "Write the problem in their trade’s words, not your product name."],
          ["جمله اجازه را جدا تمرین کنید و بعد از آن مکث کنید.", "Practice the permission line and the pause after it."],
          ["یک خط برای منشی داشته باشید که بدون شما هم قابل گفتن باشد.", "Keep one line a gatekeeper can repeat without you."],
          ["اگر وقت نداشتند، فقط یک زمان جایگزین پیشنهاد بدهید.", "If they are busy, offer one other time and stop."],
        ],
      ),
      h2("جمع‌بندی", "Close"),
      p(
        "قلاب پانزده‌ثانیه سه تکه است: نام، یک مسئله آشنا، و اجازه یک سؤال. معرفی شرکت، تخفیف و سابقه را برای وقتی بگذارید که شنونده خودش پرسید. این هفته همان جمله را ضبط کنید، نسخه کوتاه‌تر را نگه دارید، و در ده تماس اول فقط همان را بگویید تا ببینید کجا قطع می‌شوید و کجا اجازه می‌گیرید.",
        "Name, one familiar problem, permission for one question. Save the company story for when they ask.",
      ),
    ],
  },
  {
    id: "art-02",
    slug: "three-closes",
    title: t("سه بستن که جلسه حضوری را معطل نمی‌گذارد", "Three closes that keep a live meeting moving"),
    excerpt: t(
      "بستن فرضی، فوریتی و جایگزین؛ به شرطی که فوریت ساختگی نباشد.",
      "Assumptive, urgent, and alternative closes, only when the urgency is real.",
    ),
    category: t("فروش حضوری", "In-person sales"),
    author,
    publishedAt: t("۲۸ بهمن ۱۴۰۳", "February 16, 2025"),
    readTime: t("۵ دقیقه", "5 min"),
    coverImage: "",
    visual: "closes",
    related: {
      courseId: "hozuri",
      lessonCta: t("رفتن به درس فروش حضوری", "Open an in-person lesson"),
      courseCta: t("مشاهده دوره فروش حضوری", "View the in-person sales course"),
    },
    content: [
      p(
        "جلسه حضوری وقتی سرد می‌شود که فروشنده بعد از توضیح محصول منتظر معجزه می‌ماند. اسلاید تمام شده، چای آمده، و کسی قدم بعدی را نام نبرده. مشتری مؤدبانه می‌گوید «فکر می‌کنم و خبر می‌دهم» و جلسه بدون صاحب و بدون زمان تمام می‌شود. بستن یعنی همان لحظه بگویید قدم بعدی چیست، نه اینکه معرفی را از اول بخوانید.",
        "A live meeting cools when nobody names the next step. Closing means saying what happens next.",
      ),
      p(
        "سه مدل بستن در جلسه رو در رو به کار می‌آید: فرضی، فوریتی و جایگزین. هر سه به یک شرط زنده‌اند. فرضی وقتی است که مسیر خرید روشن شده. فوریتی فقط وقتی است که محدودیت واقعی وجود دارد. جایگزین وقتی است که دو راه پیش پای مشتری می‌گذارید و هر دو برای شما قابل انجام است. اگر این شرط‌ها نباشد، هر سه مدل به فشار تبدیل می‌شوند.",
        "Assumptive, urgent, and alternative closes each have a condition. Without it, they become pressure.",
      ),
      h2("بستن فرضی", "The assumptive close"),
      p(
        "در بستن فرضی، به‌جای «می‌خواهید شروع کنیم؟» قدم عملی را می‌گویید. صاحب یک فروشگاه پوشاک در پاسداران که اندازه تیم و زمان آموزش را خودش گفته، آماده شنیدن قدم بعدی است: «پس سه‌شنبه آینده، دو ساعت، در خود فروشگاه، با همان چهار نفر فروش. ساعت یازده مناسب است؟» فرض این نیست که او حق ندارد نه بگوید. فرض این است که گفتگو از «آیا اصلاً؟» رسیده به «کی و کجا».",
        "State the practical next step once they have described the fit: day, place, and who attends.",
      ),
      p(
        "سکوت بعد از این جمله را پر نکنید. خیلی از فروشنده‌ها از سکوت می‌ترسند و سریع تخفیف یا یک ویژگی تازه می‌آورند. سکوت اغلب یعنی مشتری دارد تقویم را در ذهنش ورق می‌زند. اگر مخالفت داشت، همان را بشنوید. اگر گفت سه‌شنبه نمی‌شود، روز دیگری را از خودش بپرسید، نه اینکه کل پیشنهاد را پس بگیرید.",
        "Do not fill the silence with a discount. Ask for another day if that one fails.",
      ),
      h2("بستن فوریتی، فقط اگر واقعی باشد", "Urgency only when it is real"),
      p(
        "فوریت وقتی درست است که محدودیت از بیرون آمده باشد و بتوانید همان را نشان بدهید. ظرفیت کارگاه این ماه دو تیم دیگر را جا نمی‌دهد. بودجه تبلیغ مشتری تا آخر خرداد باید خرج شود و خودش این را گفته. کالا در انبار تا پنجشنبه موجود است و بعد باید سفارش تازه بدهید. این‌ها را روشن بگویید، با عدد و تاریخ.",
        "Real urgency has a date or a capacity you can point to, ideally one the buyer already named.",
      ),
      p(
        "فوریت ساختگی این‌هاست: «فقط تا آخر امروز این قیمت هست» در حالی که فردا هم همان قیمت را می‌دهید. «اگر الان امضا نکنید جا را از دست می‌دهید» وقتی هیچ ظرفیت محدودی نیست. «مدیر گفته تخفیف فقط سر این میز است.» مشتری حضوری این لحن را بلد است. بار دوم که ببیند فوریت دروغ بوده، حرف درست شما را هم باور نمی‌کند. اگر محدودیت ندارید، از این مدل استفاده نکنید. بستن فرضی یا جایگزین کافی است.",
        "Fake urgency is a deadline you will ignore tomorrow. Leave this close unused when nothing is actually limited.",
      ),
      note(
        "نشانه آماده بودن",
        "A ready signal",
        "سؤال درباره شروع، نحوه تسویه، یا آموزش تیم یعنی مشتری از «بخریم یا نه» رسیده به «چطور شروع کنیم». برگشتن به تاریخچه شرکت در این لحظه حرارت جلسه را می‌کشد.",
        "Questions about start date, payment, or training mean they moved to how, not whether.",
      ),
      h2("بستن جایگزین", "The alternative close"),
      p(
        "دو گزینه بدهید که هر دو برای شما قابل قبول باشد. نه «خرید یا خداحافظ». برای یک شرکت پخش مواد غذایی: «آموزش را یک‌روزه برای سرپرست‌ها می‌خواهید، یا دو نیم‌روز جدا برای خود ویزیتورها؟» هر دو مسیر را می‌توانید انجام بدهید. انتخاب بین آن‌ها از انتخاب بین بله و فرار سبک‌تر است، چون مشتری دارد شکل کار را انتخاب می‌کند نه اینکه احساس کند در گوشه قرار گرفته.",
        "Offer two options you can both deliver. Not buy versus escape.",
      ),
      p(
        "گزینه‌ها باید هم‌وزن باشند. اگر یکی واقعاً همان چیزی است که می‌خواهید بفروشید و دیگری را عمداً بد چیده‌اید، مشتری متوجه می‌شود. همچنین هر دو گزینه باید به اطلاعات همین جلسه وصل باشند. اگر او گفته نیروهای تازه‌کارش مشکل دارند، یکی از گزینه‌ها باید همان را پوشش بدهد نه یک پکیج بی‌ربط.",
        "Both options should be honest and tied to what they said in the meeting.",
      ),
      h3("کدام مدل را کی بیاورید", "Which one, when"),
      p(
        "اگر هنوز مسئله و حدود کار روشن نشده، هیچ بستنی نزنید. اول جمع‌بندی کنید: «پس گره اصلی این است که ویزیتور قیمت را می‌گوید و پیگیری نمی‌کند.» اگر تأیید کرد، بستن فرضی. اگر یک محدودیت واقعی روی میز است، همان را کنار فرض بگویید. اگر بین دو شکل تحویل مردد است، جایگزین. استفاده از هر سه در یک جمله، جلسه را شلوغ می‌کند.",
        "Summarize the problem first. Then use one close, not all three in one sentence.",
      ),
      checklist(
        "آخر جلسه",
        "At the end of the meeting",
        [
          ["قدم بعدی را با روز، جا و نفرات بگویید.", "Name the next step with day, place, and people."],
          ["اگر فوریت می‌گویید، تاریخ یا ظرفیت واقعی‌اش را هم بگویید.", "If you mention urgency, name the real date or capacity."],
          ["دو گزینه را فقط وقتی بدهید که هر دو را می‌توانید انجام دهید.", "Offer two options only when you can deliver both."],
          ["بعد از پیشنهاد، سکوت را با تخفیف پر نکنید.", "Do not cover the silence with a discount."],
          ["اگر نه بود، دلیل را یادداشت کنید و قرار ساختگی نگذارید.", "If they decline, write the reason and do not invent a follow-up."],
        ],
      ),
      h2("جمع‌بندی", "Close"),
      p(
        "جلسه حضوری با یک جمله معطل نمی‌ماند: قدم بعدی روشن. بستن فرضی مسیر را نام می‌برد، بستن فوریتی فقط محدودیت واقعی را می‌گوید، و بستن جایگزین دو راه قابل انجام جلوی مشتری می‌گذارد. فوریتی که فردا هم تکرارش می‌کنید، ابزار فروش نیست. اعتماد همان جلسه را خرج می‌کند.",
        "Name the next step. Use urgency only when the limit is real. Two honest options beat a fake deadline.",
      ),
    ],
  },
  {
    id: "art-03",
    slug: "price-objection",
    title: t("وقتی می‌گوید قیمت بالاست", "When they say the price is high"),
    excerpt: t(
      "تخفیف اولین جواب نیست. اول بفهمید قیمت نسبت به چیست.",
      "A discount is not the first answer. First learn what the price is being compared with.",
    ),
    category: t("مذاکره حرفه‌ای", "Negotiation"),
    author,
    publishedAt: t("۹ بهمن ۱۴۰۳", "January 28, 2025"),
    readTime: t("۵ دقیقه", "5 min"),
    coverImage: "",
    visual: "price",
    related: {
      courseId: "mozakerah",
      lessonId: "neg-objection",
      lessonCta: t("رفتن به درس مخالفت مشتری", "Open the objection lesson"),
      courseCta: t("مشاهده دوره مذاکره", "View the negotiation course"),
    },
    content: [
      p(
        "«قیمت بالاست» تا وقتی مرجعش معلوم نشده، جمله خروج است. ممکن است بودجه‌اش نرسد، ممکن است شما را با همسایه ارزان‌تر مقایسه کند، یا اصلاً نداند در ازای این عدد چه چیزی می‌گیرد. هر سه با یک جواب تخفیف، اشتباه یکی می‌شوند. اول باید بفهمید قیمت را با چه چیزی مقایسه می‌کند و از نظر او ارزش یعنی چه.",
        "“The price is high” is an exit line until you know the reference. A discount treats three different problems as one.",
      ),
      h2("اول مرجع را پیدا کنید", "Find the reference first"),
      p(
        "سؤال کوتاه این است: «نسبت به چه چیزی؟» لحن باید کنجکاو باشد نه تدافعی. اگر عذرخواهی کنید و همان لحظه عدد را پایین بیاورید، دو چیز را قبول کرده‌اید: اینکه قیمت واقعاً بی‌دلیل بالا بوده، و اینکه امتیاز بدون هیچ تعهدی داده می‌شود. مشتری دفعه بعد از همان نقطه شروع می‌کند.",
        "Ask “compared with what?” Do not apologize and cut the number in the same breath.",
      ),
      p(
        "بعضی‌ها سؤال را این‌طور می‌شنوند که باید قیمت را توجیه کنید. توجیه طولانی، همان تخفیف است با کلمات بیشتر. یک تأیید کوتاه کافی است: «حق دارید که عدد را با چیزی بسنجید.» بعد سؤال. مکث کنید تا خودش مرجع را بگوید. اگر ساکت ماند، دو گزینه بدهید: «با بودجه خودتان می‌سنجید یا با پیشنهادی که از جای دیگر دارید؟»",
        "A short acknowledgment, then the question. If they stay quiet, offer two possible references.",
      ),
      h2("سه مرجع معمول", "Three usual references"),
      h3("بودجه", "Budget"),
      p(
        "اگر گفت «بیشتر از این نمی‌توانیم کنار بگذاریم»، مسئله ارزش نیست. دامنه کار را کوچک کنید، نه احترام به کار را. برای یک کارخانه کوچک در اطراف کرج که آموزش حضوری می‌خواهد: به‌جای دو روز برای همه پرسنل، یک روز برای سرپرست‌ها. یا بخش پیگیری بعد از جلسه را بردارید و فقط کارگاه را بگذارید. عدد کوچک‌تر شده چون حجم کوچک‌تر شده، نه چون کار قبلی را ارزان کردید.",
        "If it is budget, shrink the scope. Do not cheapen the same work.",
      ),
      h3("رقیب", "A competitor"),
      p(
        "اگر گفت «جای دیگر ارزان‌تر گفته»، معیار مقایسه را روشن کنید. ساعت آموزش، تعداد نفر، اینکه تمرین و بازخورد هست یا فقط اسلاید، پشتیبانی بعد از جلسه. نگویید رقیب بد است. بپرسید در آن پیشنهاد چه چیزی تحویل می‌شود. خیلی وقت‌ها قیمت پایین‌تر، جلسه سخنرانی است و قیمت شما کارگاه با تمرین روی تماس واقعی خودشان. تا این فرق گفته نشود، عددها قابل مقایسه نیستند.",
        "Ask what the other offer includes. Do not attack the competitor.",
      ),
      h3("ابهام", "Uncertainty"),
      p(
        "گاهی «گران است» یعنی «نمی‌دانم به درد ما می‌خورد یا نه». اینجا تخفیف، ابهام را برنمی‌دارد. نتیجه را مشخص کنید. صاحب یک پیج لوازم خانگی که می‌گوید دوره آنلاین گران است، معمولاً نمی‌داند بعد از دوره فروشنده‌اش در دایرکت چه جمله‌ای متفاوت می‌گوید. یک خروجی قابل دیدن نام ببرید: «تا آخر ماه، هر گفتگوی قیمت باید یک شاهد از مشتری مشابه کنارش داشته باشد.» اگر این خروجی برایش مهم نبود، مسئله قیمت نیست و نباید با تخفیف نگهش دارید.",
        "If they cannot picture the result, name one visible outcome. A discount does not remove uncertainty.",
      ),
      note(
        "امتیاز را مجانی ندهید",
        "Do not give the concession free",
        "اگر بعد از روشن شدن مرجع لازم شد عدد تکان بخورد، آن را به یک تعهد وصل کنید: پرداخت زودتر، تعداد نفر بیشتر، یا زمان محدود برای همان دامنه. امتیاز بدون مقابل، کف تازه مذاکره می‌شود.",
        "If the number must move, tie it to a commitment. A free cut becomes the new floor.",
      ),
      h2("یک ساختار ثابت", "One fixed shape"),
      p(
        "شکل جواب را حفظ کنید تا در جلسه عجله نکنید: تأیید کوتاه، یک جمله که مرجع را جدا می‌کند، یک سؤال. نمونه برای مقایسه با رقیب: «می‌فهمم که عدد را کنار پیشنهاد دیگری می‌گذارید. در آن پیشنهاد تمرین روی تماس خود تیم هست یا فقط سرفصل؟» نمونه برای بودجه: «پس سقف این فصل مشخص است. اگر دامنه را به سرپرست‌ها محدود کنیم، در همان سقف جا می‌شود؟»",
        "Keep the shape: a short acknowledgment, one sentence that separates the reference, one question.",
      ),
      p(
        "اگر سه بار همان «گرانه» را بدون مرجع جدید تکرار کرد، احتمالاً تصمیمش نه است و بهانه قیمت را نگه داشته. دوباره تخفیف ندهید. بپرسید اگر عدد کنار می‌رفت، آیا همین دامنه را می‌خواست یا اصل کار را نمی‌خواهد. جواب صادقانه، بهتر از یک جلسه طولانی است که با امتیاز یک‌طرفه تمام شود.",
        "If they repeat the line with no new reference, ask whether they want the work at all. Do not keep cutting.",
      ),
      checklist(
        "وقتی عدد را شنید و مکث کرد",
        "When they pause on the number",
        [
          ["بپرسید قیمت را با چه چیزی مقایسه می‌کند.", "Ask what they are comparing the price with."],
          ["بودجه را با کم کردن دامنه جواب بدهید، نه با ارزان کردن همان کار.", "Answer a budget limit by narrowing scope."],
          ["رقیب را با محتوای تحویل مقایسه کنید، نه با تحقیر.", "Compare the other offer by what is delivered."],
          ["ابهام را با یک خروجی قابل دیدن روشن کنید.", "Answer uncertainty with one visible outcome."],
          ["اگر امتیاز مالی دادید، تعهد مقابلش را همان‌جا بگویید.", "If money moves, name the commitment in the same breath."],
        ],
      ),
      h2("جمع‌بندی", "Close"),
      p(
        "قیمت بالا یک معنی ندارد. یا با بودجه سنجیده می‌شود، یا با پیشنهاد دیگری، یا با ابهامی که ارزش را نامرئی کرده. تا مرجع معلوم نشده، تخفیف اولین جواب است و معمولاً جواب غلط. سؤال «نسبت به چه چیزی؟» کوتاه است، ولی مسیر مذاکره را از حدس به حرف خود مشتری برمی‌گرداند.",
        "High price means budget, a rival offer, or uncertainty. Ask what it is compared with before you discount.",
      ),
    ],
  },
  {
    id: "art-04",
    slug: "dm-proof",
    title: t("اثبات اجتماعی کنار قیمت، نه در بیو", "Social proof next to the price, not in the bio"),
    excerpt: t(
      "اثبات باید شبیه موقعیت خریدار باشد و همان‌جایی بنشیند که دست روی دکمه مردد می‌ماند.",
      "Proof should look like the buyer’s situation and sit where their hand hesitates.",
    ),
    category: t("فروش آنلاین", "Online sales"),
    author,
    publishedAt: t("۲۲ دی ۱۴۰۳", "January 11, 2025"),
    readTime: t("۴ دقیقه", "4 min"),
    coverImage: "",
    visual: "proof",
    related: {
      courseId: "online",
      lessonId: "online-trust",
      lessonCta: t("رفتن به درس اعتماد فالوور", "Open the trust lesson"),
      courseCta: t("مشاهده دوره فروش آنلاین", "View the online sales course"),
    },
    content: [
      p(
        "جمله «عالی بود، پیشنهاد می‌کنم» اثبات نیست. اسم ندارد، موقعیت ندارد، و معلوم نیست چه چیزی تغییر کرده. مخاطب پیج وقتی به قیمت می‌رسد، به بیو برنمی‌گردد تا شعار شما را بخواند. همان‌جا که عدد را می‌بیند مردد می‌ماند: زیر پست قیمت، کنار دکمه ثبت‌نام، یا داخل دایرکتی که نوشته «باید فکر کنم».",
        "“It was great” is not proof. The buyer hesitates where the price sits, not in the bio.",
      ),
      h2("اثبات یعنی سه تکه", "Proof has three parts"),
      p(
        "یک شاهد به درد می‌خورد اگر نقش آدم، مسئله مشابه، و یک تغییر قابل دیدن داشته باشد. «مریم، مسئول فروش یک فروشگاه کفش در رشت. قبلاً سایز و موجودی را در دایرکت دیر جواب می‌دادند و مشتری می‌رفت. حالا قبل از قیمت، موجودی همان مدل را می‌فرستند و گفتگو ادامه پیدا می‌کند.» این جمله قابل تصور است. «افزایش چشمگیر فروش» قابل تصور نیست و لازم هم نیست ادعا شود.",
        "A useful witness has a role, a similar problem, and a change someone can picture. Skip unsourced leaps.",
      ),
      p(
        "شاهد باید شبیه همان کسی باشد که الان دارد قیمت را می‌خواند. نظر یک برند بزرگ برای فروشنده اینستاگرامی که تنها کار می‌کند، فاصله دارد. نظر یک مغازه محلی برای مدیر یک تیم دوازده‌نفره هم فاصله دارد. دو یا سه شاهد برای دو موقعیت کافی است. ده اسکرین‌shot از «ممنون» که هیچ مسئله‌ای در آن نیست، صفحه را شلوغ می‌کند و اعتماد نمی‌سازد.",
        "Match the witness to the reader. A pile of thank-you screenshots with no problem does not help.",
      ),
      h2("کجا بنشیند", "Where it sits"),
      p(
        "اثبات را بگذارید کنار تصمیم، نه در بخش معرفی. زیر قیمت پلن، یک شاهد از کسی که همان پلن را گرفته. کنار فرم وبینار، یک جمله از کسی که در وبینار قبلی سؤال مشابه داشته. داخل دایرکت، وقتی مشتری گفت «گران است» یا «فکر می‌کنم»، همان لحظه یک شاهد هم‌صنف بفرستید، نه لینک بیو.",
        "Put proof beside the decision: under the price, next to the form, inside the DM where they hesitate.",
      ),
      p(
        "بیو جای معرفی کوتاه شماست. اگر بهترین شاهد فقط آنجاست، کسی که از تبلیغ یا استوری آمده و مستقیم به قیمت رسیده آن را نمی‌بیند. هایلایت «نظرات» هم اگر از مسیر قیمت دور باشد، دیر به چشم می‌آید. مسیر را کوتاه کنید: از دیدن قیمت تا دیدن یک آدم مشابه، بیشتر از یک حرکت لازم نباشد.",
        "The bio is a late stop. The path from price to a similar person should be one move.",
      ),
      h3("در دایرکت چه بفرستید", "What to send in the DM"),
      p(
        "متن شاهد را کوتاه بفرستید و به حرف خود مشتری وصل کنید. اگر گفته برای تیم سه‌نفره می‌خواهد: «یک فروشگاه لوازم تحریر در اصفهان هم سه نفره بود. مسئله‌شان این بود که قیمت را می‌گفتند و موجودی را جداگانه چک می‌کردند. حالا هر دو را در یک پیام می‌فرستند.» بعد بپرسید مسئله او کدام است. شاهد را رها نکنید به امید اینکه خودش نتیجه بگیرد، و آن را هم با «پس همین الان ثبت‌نام کن» خراب نکنید. اگر خواست عکس گفتگو را ببیند، همان بخشی را بفرستید که مسئله و تغییر در آن هست، نه کل چت را. اسم را فقط با اجازه بنویسید. اگر اجازه ندارید، نقش و شهر کافی است: «مسئول فروش یک فروشگاه کفش در رشت». مشتری باید بتواند موقعیت را تصور کند، نه اینکه زندگی خصوصی کسی را بخواند.",
        "Tie the witness to what they just said, then ask which part matches. Do not jump to a push.",
      ),
      note(
        "اغراق نکنید",
        "Do not exaggerate",
        "نتیجه‌ای را که خود مشتری نگفته ننویسید. اگر فقط گفته روند جواب دادن مرتب شده، همان را بنویسید. عدد فروش، درصد رشد، و «بهترین تصمیم زندگی‌ام» اگر منبع و اجازه نداشته باشد، شاهد را به تبلیغ تبدیل می‌کند.",
        "Write only the change they actually described. Do not invent a sales figure.",
      ),
      h2("یک چیز را عوض کنید", "Change one thing"),
      p(
        "اگر صفحه دوره یا پست قیمت گفتگو راه نمی‌اندازد، قبل از زیاد کردن بودجه تبلیغ، یک چیز را عوض کنید: عنوان، جای اثبات، یا تعداد فیلد فرم. هر سه با هم، چیزی یادتان نمی‌دهد. یک هفته شاهد را از هایلایت بیاورید کنار قیمت و ببینید سؤال‌های دایرکت عوض شده یا نه. اگر هنوز فقط «قیمت چنده» می‌آید و بعد قطع می‌شود، مسئله جای شاهد نیست و باید خود پیشنهاد را روشن کنید.",
        "Change the headline, the proof placement, or the form. Not all three at once, or you learn nothing.",
      ),
      checklist(
        "شاهد این هفته",
        "This week's proof",
        [
          ["برای هر پلن، یک آدم با نقش و مسئله مشابه داشته باشید.", "For each plan, keep one person with a role and a similar problem."],
          ["تغییر را همان‌طور که خودشان گفته‌اند بنویسید.", "Describe the change in their words."],
          ["شاهد را کنار قیمت و داخل دایرکت مردد بگذارید، نه فقط در بیو.", "Place it beside the price and in the hesitant DM."],
          ["از اسکرین‌شات تشکر خالی به‌عنوان اثبات استفاده نکنید.", "Do not treat an empty thank-you as proof."],
          ["اجازه نشر اسم یا شهر را گرفته باشید.", "Ask before you publish a name or city."],
        ],
      ),
      h2("جمع‌بندی", "Close"),
      p(
        "اثبات اجتماعی وقتی کار می‌کند که خریدار خودش را در آن ببیند و لازم نباشد برای پیداکردنش از صفحه قیمت خارج شود. نقش، مسئله، تغییر. کنار عدد، نه در بیو. بدون درصد ساختگی و بدون عجله برای بستن فروش در همان پیام.",
        "Role, problem, change. Beside the number, not in the bio. No invented percentage.",
      ),
    ],
  },
  {
    id: "art-05",
    slug: "open-room",
    title: t("اتاق جلسه را قبل از اسلاید باز کنید", "Open the room before the slides"),
    excerpt: t(
      "زبان بدن و جای نشستن، برداشت امنیت را زودتر از هر جمله‌ای می‌سازد.",
      "Body language and where you sit build a sense of safety before any sentence does.",
    ),
    category: t("فروش حضوری", "In-person sales"),
    author,
    publishedAt: t("۵ دی ۱۴۰۳", "December 25, 2024"),
    readTime: t("۶ دقیقه", "6 min"),
    coverImage: "",
    visual: "room",
    related: {
      courseId: "hozuri",
      lessonId: "live-open",
      lessonCta: t("رفتن به درس زبان بدن", "Open the body-language lesson"),
      courseCta: t("مشاهده دوره فروش حضوری", "View the in-person sales course"),
    },
    content: [
      p(
        "خریدار حضوری اول امنیت را می‌خواند، بعد محصول را. قبل از اینکه اسلاید اول بیاید، نشستن شما، فاصله‌تان، و اینکه دست‌تان کجاست یک برداشت ساخته. اگر آن برداشت سنگین باشد، توضیح خوب هم سخت شنیده می‌شود. اتاق جلسه را باز کردن یعنی این برداشت را عمداً بچینید، نه اینکه به چیدمان تصادفی دفتر مشتری تن بدهید و بعد با حرف زیاد جبران کنید.",
        "The buyer reads safety before the product. Seat, distance, and hands land before the first slide.",
      ),
      h2("قبل از اینکه وارد شوید", "Before you walk in"),
      p(
        "ده دقیقه زودتر برسید، نه برای اینکه در راهرو معطل بمانید و اضطراب را نشان دهید. برای اینکه بدانید جلسه کجاست، چند نفر می‌آیند، و پرده یا نور اتاق چطور است. اگر ارائه دارید، فایل را قبل از سلام باز نکنید. سلام و نشستن بر اسلاید مقدم است. فروشنده‌ای که هنوز کیف را زمین نگذاشته پروژکتور را روشن می‌کند، به مشتری می‌گوید متن از آدم مهم‌تر است.",
        "Arrive with enough time to see the room. Do not open the slides before you sit down and say hello.",
      ),
      p(
        "لباس و وسیله را شلوغ نکنید. در خیلی از جلسه‌های ایرانی، میز کوچک است و جا برای کاتالوگ، لپ‌تاپ و دو لیوان کم می‌ماند. یک دفتر برای یادداشت واژه خود مشتری کافی است. انبوه برگه، جلسه را به جلسه تحویل سند شبیه می‌کند نه گفتگو.",
        "Keep the table clear. A notebook for their words beats a stack of brochures.",
      ),
      h2("سه تنظیم قبل از شروع حرف", "Three settings before you talk"),
      h3("هم‌سطح بنشینید", "Sit at the same level"),
      p(
        "اگر مشتری نشسته و شما ایستاده‌اید، حتی با نیت خوب که «مزاحم صندلی نشوم»، از بالا حرف می‌زنید. بنشینید. اگر تنها صندلی، پشت میز مدیریت و روبه‌روی اوست، همان خوب است. اگر می‌توانید زاویه را کمی بچرخانید که دقیقاً حالت بازجویی نباشد، بهتر. بالاتر نشستن یا ایستادن بالای سر او، توضیح محصول را به ابلاغ تبدیل می‌کند.",
        "Sit. Standing over a seated buyer turns the explanation into an announcement.",
      ),
      h3("فاصله را قابل نفس کشیدن بگذارید", "Leave room to breathe"),
      p(
        "در دفترهای کوچک تهران و شهرستان، میزها نزدیک‌اند و آدم وسوسه می‌شود برای «صمیمی شدن» خم شود طرف مشتری. صمیمیت با خم شدن روی میز ساخته نمی‌شود. فاصله‌ای بگذارید که هر دو بتوانند به کاغذ نگاه کنند بدون اینکه آرنج‌ها گره بخورد. اگر او کمی عقب رفت، شما جلوتر نروید. عقب رفتن اغلب یعنی فاصله کم بوده.",
        "Do not lean in to seem friendly. If they shift back, you were too close.",
      ),
      h3("تماس چشمی متناوب", "Intermittent eye contact"),
      p(
        "خیره شدن موقع گفتن قیمت، فشار است. نگاه نکردن هم، خواندن از روی متن است. نگاه کنید، به دفتر برگردید، دوباره نگاه کنید. وقتی او حرف می‌زند، نگاهتان بیشتر پیش او بماند تا پیش اسلاید. اسلاید نباید رقیب صورت مشتری باشد.",
        "Look, then look at the notes, then look again. The slide should not compete with their face.",
      ),
      note(
        "دست به سینه را تقلید نکنید",
        "Do not copy crossed arms",
        "اگر مشتری دست به سینه نشست، فوری مثل او نشینید و فکر نکنید این یعنی همراهی. معمولاً یعنی هنوز گرم نشده. دست خودتان باز باشد، یک سؤال کوتاه بپرسید، و اسلاید را عقب بیندازید تا جواب بدهد.",
        "Crossed arms are not a cue to mirror. Ask one short question and wait on the slides.",
      ),
      h2("اسلاید چه وقت بیاید", "When the slides may start"),
      p(
        "اسلاید را وقتی باز کنید که مسئله را از زبان خودش شنیده‌اید. حتی یک جمله: «پس گره اصلی این است که جلسه‌ها طولانی می‌شود و قرارداد همان‌روز بسته نمی‌شود.» اگر تأیید کرد، اسلاید مربوط به همان گره را بیاورید نه معرفی پنج‌ساله‌ شرکت را. اتاق را باز کردن یعنی ترتیب: آدم، مسئله، بعد تصویر.",
        "Open the deck after they have named the problem, and show only the slide that matches it.",
      ),
      p(
        "واژه خود مشتری را یادداشت کنید و در جمع‌بندی همان را برگردانید. اگر گفت «پس‌فردا ویزیتورهای جدید می‌آیند و هنوز جواب قیمت را بلد نیستند»، در پایان نگویید «پس نیاز به توانمندسازی منابع انسانی دارید». بگویید: «پس این دو ساعت را می‌گذاریم روی جواب قیمت برای همان ویزیتورهای پس‌فردا.» این جمله بیشتر از اسلاید اضافه اعتماد می‌سازد، چون نشان می‌دهد شنیده‌اید.",
        "Return their own words in the summary. That builds more trust than an extra slide.",
      ),
      checklist(
        "ورود به اتاق",
        "Entering the room",
        [
          ["قبل از پروژکتور، سلام و نشستن.", "Hello and a seat before the projector."],
          ["هم‌سطح مشتری، نه ایستاده بالای سر او.", "Same level, not standing over them."],
          ["اگر عقب نشست، فاصله را بیشتر کنید.", "If they lean back, give them space."],
          ["موقع حرف او، نگاهتان پیش اسلاید نماند.", "When they speak, do not watch the slide."],
          ["یک واژه از حرف خودش را در جمع‌بندی برگردانید.", "Return one of their phrases in the summary."],
        ],
      ),
      h2("جمع‌بندی", "Close"),
      p(
        "اتاق جلسه قبل از محتوا قضاوت می‌شود. جای نشستن، فاصله، و نوبت اسلاید برداشت امنیت را می‌سازند. اگر این سه تا نامرتب باشد، متن خوب هم سنگین به نظر می‌رسد. جلسه را با شنیدن باز کنید، اسلاید را به همان مسئله وصل کنید، و با واژه‌های خود مشتری ببندید.",
        "Seat, distance, and the timing of the slides shape safety. Open by listening, then show only what matches.",
      ),
    ],
  },
  {
    id: "art-06",
    slug: "next-call",
    title: t("هر تماس باید یک وضعیت داشته باشد", "Every call needs a status"),
    excerpt: t(
      "جواب نداد، قرار شد، یا رد کرد. بدون ثبت، پیگیری تبدیل به حدس می‌شود.",
      "No answer, booked, or declined. Without a log, follow-up becomes a guess.",
    ),
    category: t("فروش تلفنی", "Telesales"),
    author,
    publishedAt: t("۱۸ آذر ۱۴۰۳", "December 8, 2024"),
    readTime: t("۴ دقیقه", "4 min"),
    coverImage: "",
    visual: "status",
    related: {
      courseId: "telefoni",
      lessonId: "phone-roadmap",
      lessonCta: t("رفتن به درس نقشه راه تماس", "Open the call-roadmap lesson"),
      courseCta: t("مشاهده دوره فروش تلفنی", "View the telesales course"),
    },
    content: [
      p(
        "نقشه تماس وقتی کار می‌کند که بعد از هر شماره یک وضعیت بنویسید. حافظه، لیست دیروز را با امروز قاطی می‌کند. فروشنده‌ای که پنجاه شماره زده و فقط «چندتاشون گفتن بعداً» یادش است، فردا دوباره همان‌ها را مثل تماس اول صدا می‌کند. مشتری این را می‌فهمد. پیگیری بدون حافظه، مزاحمت است.",
        "A call map works only if every number gets a status. Memory mixes yesterday into today.",
      ),
      h2("سه وضعیت کافی است", "Three statuses are enough"),
      p(
        "لیست را با وضعیت‌های زیاد شلوغ نکنید. سه تا تقریباً همه تماس‌های روز را پوشش می‌دهد. جواب نداد: کسی برنداشت یا گفت الان نمی‌شود و زمانی نداد. قرار شد: یک روز و ساعت برای تماس یا جلسه بعدی هست. رد کرد: گفته این موضوع را نمی‌خواهد، یا صریحاً خواسته دیگر زنگ نزنید. اگر وسط این‌ها ماند، هنوز قرار نشده و باید یا زمان بگیرد یا در رد قرار بگیرد. «جالب بود» وضعیت نیست.",
        "No answer, booked, or declined. “It was interesting” is not a status.",
      ),
      p(
        "برای جواب نداد، تعداد زنگ را هم بنویسید ولی عدد را بهانه تماس مجدد بی‌برنامه نکنید. اگر سه بار در ساعت‌های مختلف جواب نداد، بار چهارم را با یک پیام کوتاه شروع کنید که زمان پیشنهاد می‌دهد، نه با همان متن معرفی. اگر باز هم نبود، همان ردیف را از لیست زنده خارج کنید تا جا برای شماره‌هایی بماند که واقعاً قرار دارند.",
        "After a few missed calls at different times, send one message with a suggested time or take the row off the live list.",
      ),
      h2("قرار یعنی صاحب و ساعت", "A booking has an owner and a time"),
      p(
        "تماس ضعیف معمولاً با «زنگ بزن هر وقت آماده بودی» تمام می‌شود. این جمله هم به مشتری فشار نمی‌آورد، هم هیچ قراری نمی‌سازد. هر دو طرف راحت می‌شوند و هیچ‌کدام نمی‌داند قدم بعدی مال کیست. تماس درست یک صاحب و یک ساعت دارد: «پنجشنبه ده و نیم خودم زنگ می‌زنم، همان موضوع موجودی انبار.» صاحب می‌تواند شما باشید یا او. مهم این است که اسم داشته باشد.",
        "“Call whenever” is not a next step. Name who calls and at what time.",
      ),
      p(
        "اگر او باید چیزی بفرستد، همان را در وضعیت بنویسید: «قرار شد لیست قیمت رقبا را تا سه‌شنبه در واتساپ بفرستد.» پیگیری پنجشنبه بدون این یادداشت، تبدیل می‌شود به «سلام یادتون هست تماس گرفته بودم؟» که هیچ اهرمی جز حافظه مبهم ندارد. با یادداشت، پیگیری این است: «قرار بود لیست قیمت را بفرستید. اگر هنوز آماده نیست، یک زمان دیگر برای همان می‌گذاریم.»",
        "Write what they promised to send. Follow up on that promise, not on a vague hello.",
      ),
      h2("رد را پاک نکنید", "Do not delete a no"),
      p(
        "رد کردن را از لیست حذف نکنید. دلیل کوتاه را کنارش بنویسید: بودجه تا سال بعد بسته است، خودشان تیم آموزش دارند، یا موضوع به واحد دیگری مربوط نیست. این یادداشت جلوی کوبیدن دوباره همان در را می‌گیرد. همکار شیفت بعد اگر دلیل را نبیند، فردا همان معرفی را تکرار می‌کند و مشتری حق دارد عصبانی شود.",
        "Keep the no, with a short reason, so the next shift does not knock on the same door.",
      ),
      p(
        "رد موقت با رد موضوع فرق دارد. «این ماه نخرید» رد موقت است و تاریخ برگشت می‌خواهد. «اصلاً این خدمت را نمی‌خواهیم» رد موضوع است و نباید هفته بعد با تخفیف برگردد. تخفیف روی یک نه روشن، وضعیت را عوض نمی‌کند. فقط نشان می‌دهد حرف قبلی او را نخوانده‌اید.",
        "“Not this month” needs a return date. “We do not want this” should not come back as a discount.",
      ),
      note(
        "ابزار مهم نیست",
        "The tool does not matter",
        "دفتر، شیت، یا هر جدولی که تیم الان دارد کافی است. ستون‌های لازم: شماره، نام، وضعیت، تاریخ قدم بعدی، یک خط یادداشت. عوض کردن نرم‌افزار بدون این پنج ستون، پیگیری را دقیق نمی‌کند. اگر دو نفر روی یک لیست کار می‌کنند، وضعیت را همان لحظه بنویسند نه آخر شیفت. شیفت عصر نباید حدس بزند تماس صبح به کجا رسیده. یک خط یادداشت از یک نرم‌افزار تازه مهم‌تر است، به شرطی که همکار بعدی بتواند بدون پرسیدن آن را بخواند.",
        "A notebook is enough if it has name, status, next date, and one line of notes.",
      ),
      checklist(
        "آخر هر تماس",
        "After every call",
        [
          ["یکی از سه وضعیت را همان لحظه بنویسید، نه آخر شیفت.", "Log one of the three statuses immediately."],
          ["اگر قرار شد، روز، ساعت و صاحب قدم بعدی را بنویسید.", "For a booking, write day, time, and owner."],
          ["اگر رد کرد، دلیل یک‌خطی را نگه دارید.", "For a no, keep a one-line reason."],
          ["«هر وقت خواستید» را به‌عنوان قرار ثبت نکنید.", "Do not log “whenever” as a booking."],
          ["پیگیری را با همان یادداشت شروع کنید، نه با معرفی دوباره.", "Start the follow-up from the note, not from the pitch."],
        ],
      ),
      h2("جمع‌بندی", "Close"),
      p(
        "هر تماس باید وقتی تمام شود که یک وضعیت داشته باشد: جواب نداد، قرار شد، یا رد کرد. بدون این ثبت، لیست فردا از حدس ساخته می‌شود و مشتری صدای کسی را می‌شنود که مکالمه قبلی را یادش نیست. قرار یعنی زمان و صاحب. رد یعنی دلیل. بقیه جمله، پیگیری نیست.",
        "No answer, booked, or declined. A booking has a time and an owner. A no has a reason.",
      ),
    ],
  },
  {
    id: "art-07",
    slug: "trade-concession",
    title: t("امتیاز بدهید، ولی تنها ندهید", "Give a concession, never alone"),
    excerpt: t(
      "تخفیف بدون تعهد، حجم یا زمان، فقط کف مذاکره را پایین می‌آورد.",
      "A discount without commitment, volume, or timing only lowers the floor.",
    ),
    category: t("مذاکره حرفه‌ای", "Negotiation"),
    author,
    publishedAt: t("۲ آذر ۱۴۰۳", "November 22, 2024"),
    readTime: t("۶ دقیقه", "6 min"),
    coverImage: "",
    visual: "trade",
    related: {
      courseId: "mozakerah",
      lessonId: "neg-principles",
      lessonCta: t("رفتن به درس اصول مذاکره", "Open the negotiation-principles lesson"),
      courseCta: t("مشاهده دوره مذاکره", "View the negotiation course"),
    },
    content: [
      p(
        "مذاکره فروش قبل از عدد شروع می‌شود. باید بدانید چه چیزی را بدون تأیید رد می‌کنید و چه امتیازی را فقط در برابر چیز دیگری می‌دهید. اگر این دو خط روشن نباشد، هر سکوت مشتری تبدیل به تخفیف می‌شود. امتیاز یک‌طرفه، سخاوت به نظر می‌رسد و در عمل کف مذاکره را پایین می‌آورد. دفعه بعد، گفتگو از همان قیمت تازه‌شروع می‌شود.",
        "Know what you can refuse and what you trade. A one-sided concession lowers the floor for next time.",
      ),
      h2("قبل از جلسه دو خط بنویسید", "Write two lines before the meeting"),
      p(
        "خط اول کف است: پایین‌ترین قیمت یا کوتاه‌ترین دامنه‌ای که حق دارید بدون تماس با مدیر قبول کنید. خط دوم فهرست مبادله است: چیزهایی که می‌توانید بدهید و چیزهایی که در عوض می‌خواهید. این فهرست را سر میز اختراع نکنید. وقتی مشتری نگاه می‌کند، اختراع یعنی یا زیاد می‌دهید یا چیزی می‌گویید که بعد نمی‌توانید انجام دهید.",
        "Write the floor and the trade list before you sit down. Do not invent them while they watch.",
      ),
      p(
        "برای یک قرارداد آموزش تیم فروش، فهرست می‌تواند این باشد. می‌دهیم: یک ساعت جلسه اضافه برای سرپرست، یا جا‌به‌جایی تاریخ کارگاه در همان ماه. می‌گیریم: پرداخت قبل از شروع، یا اضافه شدن نفرات شیفت دوم. چیزی که نمی‌دهیم: تخفیف روی همان دامنه بدون هیچ تعهدی. اگر مدیر باید تخفیف عمیق‌تر را تأیید کند، همان‌جا بگویید «این را باید ببرم» نه اینکه سر میز قول بدهید.",
        "List what you can give, what you want back, and what you will not give alone.",
      ),
      h2("مبادله، نه تسلیم", "A trade, not a surrender"),
      p(
        "امتیاز وقتی معنا دارد که طرف مقابل هم چیزی را قطعی کند. تخفیف در برابر پرداخت زودتر. ساعت آموزشی اضافه در برابر معرفی یک تیم دیگر که واقعاً تصمیم‌گیرش مشخص است. انعطاف تاریخ در برابر تعهد تعداد نفر. هیچ‌کدام از این‌ها فریب نیست، به شرطی که هر دو طرف بدانند چه می‌دهند و چه می‌گیرند و بتوانند نه بگویند.",
        "A discount for earlier payment, extra time for a real referral, date flexibility for a headcount. Both sides can still say no.",
      ),
      p(
        "جمله را کامل بگویید. «اگر پرداخت قبل از کارگاه انجام شود، همان ده درصد را لحاظ می‌کنم.» نه «باشد، ده درصد ولش». جمله دوم هیچ تعهدی نگرفته. مشتری هم بدحساب نیست لزوماً. شما خودتان شرط را حذف کرده‌اید. در پیام واتساپ هم شرط را در همان پیام بنویسید. ویس مبهم «یه چیزی روش حساب می‌کنم» بعداً دو برداشت می‌سازد.",
        "Say the whole sentence: the concession and the condition. Write it in the same chat message.",
      ),
      h3("وقتی فقط تخفیف می‌خواهد", "When they only want a discount"),
      p(
        "اگر گفت «فقط قیمت را کم کن، بقیه اوکی است»، دامنه و زمان و پرداخت را دوباره جدا کنید. شاید «بقیه» برای او یعنی همان چیزی که برای شما هزینه دارد. بپرسید کدام را می‌تواند قطعی کند. اگر هیچ‌کدام را نه، امتیاز مالی ندهید. می‌توانید دامنه را کوچک کنید تا عدد در بودجه بماند، به شرطی که کار کمتر را روشن گفته باشید. کوچک کردن دامنه مبادله است. ارزان کردن همان کار، تسلیم است.",
        "If they want only a lower price, ask which commitment they can make. Shrinking scope is a trade. Cheapening the same work is not.",
      ),
      note(
        "امتیاز را قسطی ندهید",
        "Do not drip the concession",
        "اگر قرار است ده درصد در برابر پرداخت زودتر باشد، همان را یک بار بگویید. نیمی الان و نیمی بعد از سکوت بعدی، یعنی مشتری یاد می‌گیرد هر مکث یک قسط تخفیف است.",
        "Offer the trade once. A second cut after the next silence teaches them to wait.",
      ),
      h2("بن‌بست", "Deadlock"),
      p(
        "اگر قبول نکرد، همان تخفیف را با صدای آرام‌تر تکرار نکنید. یک متغیر دیگر را روی میز بگذارید یا مکث را تمام کنید. «اگر پرداخت زودتر ممکن نیست، می‌توانیم تاریخ را به ماه بعد ببریم و قیمت همان بماند.» این هنوز مبادله است. اگر هیچ متغیری برای او مهم نیست و فقط عدد پایین‌تر می‌خواهد، جلسه را با همان کف ببندید یا محترمانه تمام کنید. ادامه دادن بدون مبادله، کف را در عمل پایین‌تر از خطی می‌برد که نوشته بودید.",
        "Do not repeat the same discount. Put another variable on the table, or stop at the floor you wrote.",
      ),
      p(
        "در مذاکره نوشتاری هم همین است. پیام کوتاه باشد ولی شرط را حذف نکنید چون «چت جای رسمیت نیست». اتفاقاً چت جای سوءتفاهم است. «۱۰٪ اگر تا پنجشنبه تسویه شود» از «چشم تخفیف لحاظ شد» قابل پیگیری‌تر است. اگر خواستید بعداً استثنا بگذارید، همان پیام را اصلاح کنید نه اینکه یک ویس خلافش بفرستید.",
        "In chat, keep the condition in writing. A short voice note that contradicts it creates two versions.",
      ),
      checklist(
        "سر میز یا در چت",
        "At the table or in chat",
        [
          ["کف و فهرست مبادله را قبل از گفتگو بنویسید.", "Write the floor and the trade list beforehand."],
          ["هر امتیاز را با تعهد، حجم یا زمان جفت کنید.", "Pair every concession with commitment, volume, or timing."],
          ["شرط را در همان جمله یا همان پیام بیاورید.", "Put the condition in the same sentence or message."],
          ["اگر سکوت شد، قسط دوم تخفیف ندهید.", "Do not add a second cut just because they went quiet."],
          ["در بن‌بست، متغیر دیگری پیشنهاد بدهید یا همان کف را نگه دارید.", "In a deadlock, change a variable or hold the floor."],
        ],
      ),
      h2("جمع‌بندی", "Close"),
      p(
        "امتیاز بدهید، ولی تنها ندهید. تخفیف، زمان، یا کار اضافه وقتی معنا دارد که طرف مقابل هم پرداخت، تعداد، یا یک تعهد روشن را قطعی کند. بدون این مبادله، عدد جدید فقط نقطه شروع مذاکره بعدی است. کف را قبل از جلسه بنویسید و سر میز از آن پایین‌تر نروید فقط چون سکوت سنگین شده.",
        "Trade the concession for a commitment. The new number should not become next meeting’s starting point.",
      ),
    ],
  },
  {
    id: "art-08",
    slug: "funnel-signal",
    title: t("قیف را با یک عدد قابل دیدن جلو ببرید", "Move the funnel with one number you can see"),
    excerpt: t(
      "لید، پراسپکت و مشتری وقتی معنا دارند که شاخص عبورشان شمرده شود.",
      "Lead, prospect, and customer mean something only when the handoff between them is countable.",
    ),
    category: t("فروش آنلاین", "Online sales"),
    author,
    publishedAt: t("۱۵ آبان ۱۴۰۳", "November 5, 2024"),
    readTime: t("۵ دقیقه", "5 min"),
    coverImage: "",
    visual: "funnel",
    related: {
      courseId: "online",
      lessonId: "online-lead",
      lessonCta: t("رفتن به درس قیف فروش", "Open the funnel lesson"),
      courseCta: t("مشاهده دوره فروش آنلاین", "View the online sales course"),
    },
    content: [
      p(
        "بالای قیف پهن است چون خیلی‌ها فقط توجه نشان می‌دهند. پایین قیف باریک است چون عده کمتری تصمیم می‌گیرند. این شکل عیب نیست. عیب این است که تیم نداند هر آدم در کدام طبقه است و با چه نشانه‌ای به طبقه بعد رفته. بدون یک عدد قابل دیدن، «پیج خوب شده» و «فروش ضعیف است» هر دو حس‌اند و نمی‌شود فهمید گره کجاست.",
        "A wide top and a narrow bottom are normal. The flaw is not knowing which signal moves someone down.",
      ),
      h2("سه طبقه، سه معنی", "Three stages, three meanings"),
      p(
        "لید کسی است که توجه نشان داده و یک راه تماس گذاشته: شماره در فرم، دایرکت با سؤال مشخص، یا ثبت در وبینار. فالوور خام که هیچ راهی برای حرف زدن نگذاشته، هنوز لید نیست. پراسپکت کسی است که مسئله و حدود زمانش روشن‌تر شده. مثلاً گفته برای نوروز موجودی کم می‌آورد و تا آخر بهمن باید تصمیم بگیرد. مشتری کسی است که تصمیم را گرفته و قدم تحویل یا پرداخت را پذیرفته، نه کسی که فقط پست را ذخیره کرده.",
        "A lead left a way to talk. A prospect has a clearer problem and timing. A customer accepted the next delivery or payment step.",
      ),
      p(
        "این تعریف‌ها را برای کسب‌وکار خودتان یک خطی کنید و همان را نگه دارید. اگر هر فروشنده معنی پراسپکت را عوض کند، عدد هفته قابل جمع نیست. برای یک پیج لباس: لید یعنی سایز و شهر را نوشته. پراسپکت یعنی مدل را انتخاب کرده و مانده روی هزینه ارسال یا زمان رسیدن. مشتری یعنی سفارش را قطعی کرده. برای یک خدمت B2B: لید یعنی شماره مدیر، پراسپکت یعنی جلسه مسئله، مشتری یعنی توافق روی دامنه و زمان شروع.",
        "Write a one-line definition for your own shop and keep it. Otherwise the weekly count cannot be added up.",
      ),
      h2("برای هر عبور یک شاخص", "One signal per handoff"),
      p(
        "شاخص باید قابل شمارش باشد و دو نفر با دیدنش به یک نتیجه برسند. «حس می‌کنم گرم شده» شاخص نیست. «شماره را در فرم گذاشت» شاخص است. «گفت تا جمعه با شریک حرف می‌زند» شاخص زمان است. «لینک پرداخت را باز کرد» به‌تنهایی شاخص خرید نیست، مگر اینکه در تعریف شما فقط همین باشد و تیم همان را بشمارد. مهم ثبات است، نه انتخاب پیچیده‌ترین عدد.",
        "A signal is countable and two people would agree they saw it. A feeling is not a signal.",
      ),
      p(
        "برای هر طبقه فقط یک شاخص اصلی انتخاب کنید. لید: تعداد راه‌های تماس تازه این هفته. عبور به پراسپکت: تعداد گفتگوهایی که مسئله و زمان در آن‌ها نوشته شده. عبور به مشتری: تعداد تصمیم‌های قطعی، نه تعداد لایک. اگر سه شاخص برای یک طبقه داشته باشید، هر بار آن را که بهتر به نظر می‌رسد گزارش می‌دهید و گره پنهان می‌ماند.",
        "One main signal per stage. Three signals invite you to report whichever looks better.",
      ),
      h3("عدد را کجا ببینید", "Where the number lives"),
      p(
        "لازم نیست داشبورد پیچیده باشد. یک جدول هفته: ورودی تازه، گفتگوی دارای مسئله، تصمیم قطعی. اگر ورودی زیاد است و گفتگوی دارای مسئله کم، گره بالای قیف است: محتوا توجه گرفته ولی سؤال یا فرم، مسئله را بیرون نمی‌کشد. اگر گفتگو زیاد است و تصمیم کم، گره پایین است: پیشنهاد، قیمت، یا شاهد کنار تصمیم روشن نیست. این دو گره درمان متفاوت دارند. زیاد کردن تبلیغ، فقط وقتی ورودی واقعاً کم است به کار می‌آید.",
        "A weekly table is enough: new contacts, conversations with a problem, firm decisions. The gap tells you where the funnel stalls.",
      ),
      note(
        "یک گفتگو کل قیف نیست",
        "One conversation is not the funnel",
        "اگر یک مذاکره سخت شد، بقیه مسیر باید همچنان جلو برود. همه امید را در یک دایرکت نگذارید و برای نجات همان گفتگو، پیشنهاد را قبل از شنیدن مسئله برای همه نفرستید.",
        "If one thread gets hard, keep the rest moving. Do not send the offer to everyone before hearing the problem.",
      ),
      h2("چه چیزی عدد را خراب می‌کند", "What corrupts the count"),
      p(
        "شمارش لایک به‌جای راه تماس، قیف را پهن و توخالی نشان می‌دهد. پاک کردن گفتگوهای بی‌نتیجه از جدول، گره را قایم می‌کند. عوض کردن تعریف مشتری وسط ماه، این هفته را با هفته قبل غیرقابل مقایسه می‌کند. یک تعریف را حداقل یک ماه ثابت نگه دارید، حتی اگر ناقص به نظر برسد. ناقصِ ثابت، از دقیقِ هرروزعوض‌شونده قابل فهم‌تر است.",
        "Likes are not contacts. Deleting failed threads hides the gap. Keep one definition for a month.",
      ),
      p(
        "عدد را برای سرزنش فروشنده جمع نکنید. اگر شاخص عبور پایین است، اول ببینید تعریف مرحله با کار واقعی او می‌خواند یا نه. ممکن است مسئله را بشنود ولی جایی برای نوشتنش نداشته باشد. ابزار را ساده کنید، بعد از روی عدد حرف بزنید. عدد قابل دیدن باید به یک تغییر کوچک در کار هفته بعد وصل شود: سؤال فرم را عوض کنید، یا شاهد را کنار قیمت بگذارید، یا وضعیت تماس را اجباری کنید. نه هر سه را با هم.",
        "Use the number to change one thing next week, not to scold. Do not change three parts of the path at once.",
      ),
      checklist(
        "جمع‌بندی هفته",
        "The weekly count",
        [
          ["لید، پراسپکت و مشتری را هر کدام در یک خط تعریف کنید.", "Define each stage in one line."],
          ["برای هر عبور فقط یک نشانه قابل شمارش انتخاب کنید.", "Pick one countable signal per handoff."],
          ["لایک و ذخیره را به‌جای راه تماس نشمارید.", "Do not count likes as contacts."],
          ["جدول را از گفتگوی بی‌نتیجه خالی نکنید.", "Do not delete the threads that stalled."],
          ["هفته بعد فقط یک گره را تغییر دهید.", "Change one stuck point next week, not three."],
        ],
      ),
      h2("جمع‌بندی", "Close"),
      p(
        "قیف با شکلش جلو نمی‌رود. با یک عدد قابل دیدن جلو می‌رود: چند نفر راه تماس دادند، چند نفر مسئله و زمانشان روشن شد، چند نفر تصمیم را گرفتند. این عددها را ثابت تعریف کنید، کنار هم بگذارید، و هر هفته فقط همان طبقه‌ای را دست بزنید که عبور در آن ایستاده. توجه بیشتر، جایگزین این شمارش نیست.",
        "The funnel moves by a visible count: contacts, clearer problems, decisions. Change the stage where the handoff stops.",
      ),
    ],
  },
];

export function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug) ?? null;
}
