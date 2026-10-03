export type Localized = { fa: string; en: string };

export type ArticleBlock =
  | { type: "p"; text: Localized }
  | { type: "h2"; text: Localized }
  | { type: "ul"; items: Localized[] };

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
  content: ArticleBlock[];
};

const author = {
  name: { fa: "امیرحسین قاری", en: "Amirhossein Ghari" },
  role: { fa: "مدرس و استراتژیست فروش", en: "Sales instructor and strategist" },
};

function t(fa: string, en: string): Localized {
  return { fa, en };
}

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
    coverImage:
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1400&q=80",
    content: [
      {
        type: "p",
        text: t(
          "بیشتر تماس‌های سرد در سلام طولانی می‌میرند. فروشنده نام شرکت و فهرست خدمات را می‌گوید، در حالی که طرف مقابل هنوز نمی‌داند این تماس به کدام درد او مربوط است.",
          "Most cold calls die in a long hello. The seller lists the company and the services while the other person still does not know which pain this call is about.",
        ),
      },
      { type: "h2", text: t("سه تکه قلاب", "The three parts") },
      {
        type: "ul",
        items: [
          t("نام خودتان، نه شعار برند.", "Your name, not a brand slogan."),
          t("یک مسئله مشخص که برای شنونده آشناست.", "One specific problem the listener already recognizes."),
          t("اجازه برای یک سؤال، نه برای یک معرفی پنج‌دقیقه‌ای.", "Permission for one question, not a five-minute introduction."),
        ],
      },
      {
        type: "p",
        text: t(
          "نمونه: «من … هستم. با تیم‌هایی کار می‌کنم که سرنخ دارند ولی به جلسه تبدیل نمی‌شود. اگر شصت ثانیه وقت دارید یک سؤال بپرسم؟» همین. نه تخفیف، نه سابقه شرکت.",
          "A sample: “I’m …. I work with teams that have leads but not meetings. If you have sixty seconds, may I ask one question?” That is the whole open. No discount, no company history.",
        ),
      },
      { type: "h2", text: t("قابل انتقال برای منشی", "Easy for a gatekeeper to repeat") },
      {
        type: "p",
        text: t(
          "خیلی وقت‌ها منشی اولین شنونده است. دلیل تماس باید در یک خط قابل گفتن باشد. اگر نفس کم آوردید، صفت‌ها اضافه است. این هفته قلاب را ضبط کنید و نسخه زیر پانزده ثانیه را نگه دارید.",
          "Often the gatekeeper hears you first. The reason for the call has to fit in one line they can repeat. If you run out of breath, the adjectives are extra. Record the hook this week and keep the version under fifteen seconds.",
        ),
      },
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
    coverImage:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=80",
    content: [
      {
        type: "p",
        text: t(
          "جلسه حضوری وقتی سرد می‌شود که فروشنده بعد از توضیح محصول منتظر معجزه می‌ماند. بستن یعنی قدم بعدی را نام ببرید، نه اینکه دوباره معرفی را از اول بخوانید.",
          "A live meeting cools when the seller waits for a miracle after the product story. Closing means naming the next step, not rereading the introduction.",
        ),
      },
      { type: "h2", text: t("سه مدل، سه شرط", "Three models, three conditions") },
      {
        type: "ul",
        items: [
          t("فرضی: قدم بعدی را طوری بگویید که مسیر روشن باشد و سکوت را تحمل کنید.", "Assumptive: state the next step as the path, and tolerate the silence."),
          t("فوریتی: فقط اگر ظرفیت یا مهلت بودجه واقعاً محدود است.", "Urgent: only when capacity or a budget deadline is actually limited."),
          t("جایگزین: دو گزینه که هر دو برای شما قابل قبول‌اند، نه خرید در برابر فرار.", "Alternative: two options you can both accept, not buy versus escape."),
        ],
      },
      {
        type: "p",
        text: t(
          "نشانه آماده بودن را ببینید. سؤال درباره شروع، پرداخت یا آموزش تیم یعنی از «آیا بخریم» به «چطور شروع کنیم» آمده‌اید. برگشت به تاریخچه شرکت در این لحظه حرارت را می‌کشد.",
          "Watch for the ready signal. A question about start date, payment, or training the team means they moved from “should we buy” to “how do we start.” Going back to company history here kills the heat.",
        ),
      },
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
    coverImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
    content: [
      {
        type: "p",
        text: t(
          "«قیمت بالاست» تا وقتی مرجعش معلوم نشده، جمله خروج است. سؤال کوتاه این است: نسبت به چه چیزی؟",
          "“The price is high” is an exit line until you know the reference. The short question is: compared with what?",
        ),
      },
      { type: "h2", text: t("سه مرجع معمول", "Three usual references") },
      {
        type: "ul",
        items: [
          t("بودجه: دامنه را کوچک کنید، نه ارزش را.", "Budget: shrink the scope, not the value."),
          t("رقیب: معیار مقایسه را عوض کنید.", "A competitor: change the comparison criteria."),
          t("ابهام: نتیجه را عددی کنید.", "Uncertainty: put a number on the result."),
        ],
      },
      {
        type: "p",
        text: t(
          "ساختار ثابت بماند: تأیید کوتاه، یک جمله، یک سؤال. امتیاز مالی اگر لازم شد باید مشروط باشد. امتیاز مجانی، کف جدید مذاکره می‌شود.",
          "Keep the shape: a short acknowledgment, one sentence, one question. If money has to move, attach a condition. A free concession becomes the new floor.",
        ),
      },
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
    coverImage:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1400&q=80",
    content: [
      {
        type: "p",
        text: t(
          "جمله «عالی بود» اثبات نیست. اثبات یعنی نقش آدم، مسئله مشابه، و یک تغییر قابل دیدن.",
          "“It was great” is not proof. Proof is a role, a similar problem, and a change someone can see.",
        ),
      },
      { type: "h2", text: t("کجا بنشیند", "Where it sits") },
      {
        type: "ul",
        items: [
          t("کنار قیمت پلن، نه در بیو.", "Beside the plan price, not in the bio."),
          t("کنار فرم وبینار.", "Beside the webinar form."),
          t("داخل دایرکتی که مشتری گفته «باید فکر کنم».", "Inside the DM where they said “I need to think.”"),
        ],
      },
      {
        type: "p",
        text: t(
          "اگر صفحه دوره زیر ۳ درصد تبدیل می‌شود، قبل از زیاد کردن تبلیغ یک چیز را عوض کنید: عنوان، اثبات، یا تعداد فیلد. هر سه با هم، چیزی یاد نمی‌دهد.",
          "If a course page converts under 3 percent, change one thing before buying more ads: the headline, the proof, or the number of fields. Changing all three teaches you nothing.",
        ),
      },
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
    coverImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    content: [
      {
        type: "p",
        text: t(
          "خریدار حضوری اول امنیت را می‌خواند، بعد محصول را. دست به سینه، فاصله خیلی نزدیک، یا ایستادن بالای سر او، توضیح شما را سنگین می‌کند.",
          "An in-person buyer reads safety first and the product second. Crossed arms, standing too close, or hovering over them makes your explanation feel heavy.",
        ),
      },
      { type: "h2", text: t("سه تنظیم قبل از شروع", "Three settings before you start") },
      {
        type: "ul",
        items: [
          t("بنشینید هم‌سطح، نه بالاتر.", "Sit at the same level, not above them."),
          t("فاصله را طوری بگذارید که هر دو نفس بکشند.", "Leave enough distance that both of you can breathe."),
          t("تماس چشمی متناوب باشد، نه خیره.", "Keep eye contact intermittent, not a stare."),
        ],
      },
      {
        type: "p",
        text: t(
          "واژه خود مشتری را یادداشت کنید و در جمع‌بندی همان را برگردانید. این کار بیشتر از اسلاید اضافه اعتماد می‌سازد.",
          "Write down their own words and return them in the summary. That builds more trust than an extra slide.",
        ),
      },
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
    coverImage:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80",
    content: [
      {
        type: "p",
        text: t(
          "نقشه تماس وقتی کار می‌کند که بعد از هر شماره یک وضعیت بنویسید. حافظه، لیست دیروز را قاطی امروز می‌کند.",
          "A call map works when you write a status after every number. Memory mixes yesterday’s list into today.",
        ),
      },
      { type: "h2", text: t("پیگیری که مزاحم نیست", "Follow-up that is not noise") },
      {
        type: "ul",
        items: [
          t("به قول همان تماس قبلی اشاره کنید.", "Refer to the promise from the last call."),
          t("یک زمان مشخص پیشنهاد دهید، نه «هر وقت خواستید».", "Offer one specific time, not “whenever.”"),
          t("اگر رد کرد، دلیل کوتاه را بنویسید تا دوباره همان در را نکوبید.", "If they decline, note the short reason so you do not knock on the same door."),
        ],
      },
      {
        type: "p",
        text: t(
          "تماس ضعیف معمولاً با جمله «زنگ بزن هر وقت آماده بودی» تمام می‌شود. تماس درست یک صاحب و یک ساعت برای قدم بعدی دارد.",
          "A weak call usually ends with “call whenever you’re ready.” A useful call has an owner and a time for the next step.",
        ),
      },
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
    coverImage:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1400&q=80",
    content: [
      {
        type: "p",
        text: t(
          "مذاکره فروش قبل از عدد شروع می‌شود. باید بدانید چه چیزی را بدون تایید رد می‌کنید و چه امتیازی را فقط در برابر یک چیز دیگر می‌دهید.",
          "A sales negotiation starts before the number. You need to know what you can refuse without approval, and which concession you give only in exchange for something else.",
        ),
      },
      { type: "h2", text: t("مبادله، نه تسلیم", "A trade, not a surrender") },
      {
        type: "ul",
        items: [
          t("تخفیف در برابر پرداخت زودتر.", "A discount in exchange for earlier payment."),
          t("امتیاز آموزشی در برابر معرفی دو تیم دیگر.", "A training extra in exchange for two referrals."),
          t("انعطاف زمان در برابر تعهد حجم.", "Timing flexibility in exchange for a volume commitment."),
        ],
      },
      {
        type: "p",
        text: t(
          "اگر بن‌بست شد، همان تخفیف را تکرار نکنید. یک متغیر دیگر را روی میز بگذارید. در چت هم شرط را روشن بنویسید تا بعداً مبهم نماند.",
          "In a deadlock, do not repeat the same discount. Put another variable on the table. In chat, write the condition clearly so it does not turn vague later.",
        ),
      },
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
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    content: [
      {
        type: "p",
        text: t(
          "بالای قیف پهن است چون خیلی‌ها فقط توجه نشان می‌دهند. پایین قیف باریک است چون عده کمتری تصمیم می‌گیرند. این شکل عیب نیست؛ اگر خالی بماند عیب است.",
          "The top of the funnel is wide because many people only pay attention. The bottom is narrow because fewer decide. That shape is not a flaw. An empty funnel is.",
        ),
      },
      { type: "h2", text: t("یک شاخص برای هر مرحله", "One signal per stage") },
      {
        type: "ul",
        items: [
          t("لید: راه تماس داده است.", "Lead: they left a way to reach them."),
          t("پراسپکت: مسئله و زمان خرید روشن‌تر شده.", "Prospect: the problem and the timing are clearer."),
          t("مشتری: تصمیم را با یک دلیل گرفته، نه فقط لایک.", "Customer: they decided for a reason, not a like."),
        ],
      },
      {
        type: "p",
        text: t(
          "اگر یک مذاکره سخت شد، بقیه قیف باید همچنان جلو برود. همه امید را در یک گفتگو نگذارید و پیشنهاد را قبل از شنیدن مسئله نفرستید.",
          "If one negotiation gets hard, the rest of the funnel should still move. Do not put every hope in one conversation, and do not send the offer before you have heard the problem.",
        ),
      },
    ],
  },
];

export function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug) ?? null;
}
