import type { Category, QuizQuestion } from "./courses-data";

function text(fa: string, en: string) {
  return { fa, en };
}

function mcq(promptFa: string, promptEn: string, options: Array<[string, string]>, answer: number): QuizQuestion {
  return {
    prompt: text(promptFa, promptEn),
    options: options.map(([fa, en]) => text(fa, en)),
    answer,
  };
}

function lesson(
  id: string,
  titleFa: string,
  titleEn: string,
  summaryFa: string,
  summaryEn: string,
  aparat: string,
  minutes: number,
  quiz: QuizQuestion[],
) {
  return {
    id,
    title: text(titleFa, titleEn),
    summary: text(summaryFa, summaryEn),
    aparat,
    minutes,
    quiz,
  };
}

export const FREE_MINI_IDS = ["mini-price", "mini-open", "mini-think"] as const;

export const FREE_MINI_PRACTICE: Record<(typeof FREE_MINI_IDS)[number], string> = {
  "mini-price": "مشتری می‌گوید: «قیمت شما بالاست.» قبل از هر عدد تازه بپرسید این مقایسه با کدام گزینه است، و هزینهٔ ماندن در وضعیت فعلی برای او چیست.",
  "mini-open": "جملهٔ اول را بلند بگویید و زمان بگیرید. باید در حدود ده ثانیه تمام شود: نام شما، دلیل تماس، و یک اجازهٔ کوتاه برای ادامه.",
  "mini-think": "مشتری می‌گوید: «باید فکر کنم.» بپرسید کدام بخش مبهم است و همان‌جا یک زمان برگشت را با هم ببندید. تخفیف و پیام پیاپی را برای این مکث نگه دارید.",
};

export const FREE_MINI_VISUAL: Record<(typeof FREE_MINI_IDS)[number], { file: string; alt: string; chip: string }> = {
  "mini-price": {
    file: "free-price.webp",
    alt: "ترازوی تیره با برچسب طلایی سبک و سپر اوبسیدین سنگین‌تر",
    chip: "همراه با کوییز ارزیابی",
  },
  "mini-open": {
    file: "free-open.webp",
    alt: "گوشی شناور با قفل باز ساخته‌شده از موج صدای طلایی",
    chip: "تمرین عملی",
  },
  "mini-think": {
    file: "free-think.webp",
    alt: "حباب شیشه‌ای ترک‌خورده با کلید طلایی و ساعت شنی خوابیده",
    chip: "همراه با کوییز ارزیابی",
  },
};

export const FREE_MINIS: Category[] = [
  {
    id: "mini-price",
    tierRequired: "free",
    title: text("مهار سریع اعتراض «قیمت شما بالاست!»", "Fast track for “your price is high”"),
    description: text(
      "۳ تکنیک فوری برای تغییر بازی زمانی که مشتری در ثانیه‌های اول مکالمه بهانه قیمت می‌آورد.",
      "Three moves for the moment a buyer objects to price in the first seconds.",
    ),
    subtopics: [
      {
        id: "price-track",
        title: text("اعتراض قیمت", "Price objection"),
        lessons: [
          lesson(
            "mini-price-compare",
            "نسبت به چه چیزی؟",
            "Compared with what?",
            "اولین جواب، تخفیف نیست. مقایسه را از زبان خودش مشخص کنید.",
            "The first reply is not a discount. Name the comparison in their words.",
            "v43l4f5",
            4,
            [
              mcq("اولین واکنش به «قیمت شما بالاست» بهتر است…", "The first response to a high-price objection is better as…", [
                ["یک سوال: این مقایسه با کدام گزینه است؟", "A question: compared with which option?"],
                ["عذرخواهی و کم کردن عدد", "An apology and a lower number"],
                ["قطع مکالمه", "Ending the talk"],
                ["تکرار همان قیمت با صدای بلندتر", "Repeating the price louder"],
              ], 0),
              mcq("تا وقتی مقایسه روشن نشده…", "Until the comparison is clear…", [
                ["تخفیف فقط حدس شماست", "A discount is only your guess"],
                ["باید نصف قیمت را بدهید", "You must cut the price in half"],
                ["مشتری اشتباه می‌کند و باید اصلاح شود", "The buyer is wrong and must be corrected"],
                ["صحبت درباره ارزش ممنوع است", "Talking about value is forbidden"],
              ], 0),
              mcq("جواب کوتاه به اعتراض قیمت باید…", "A short price answer should…", [
                ["به یک سوال یا یک قدم برگردد", "Return to one question or one next step"],
                ["یک سخنرانی درباره تاریخ شرکت باشد", "Be a speech about company history"],
                ["مخالفت را مسخره کند", "Mock the objection"],
                ["موضوع را عوض کند", "Change the subject"],
              ], 0),
            ],
          ),
          lesson(
            "mini-price-trade",
            "ارزش، در برابر امتیاز رایگان",
            "Value against a free concession",
            "اگر چیزی کم می‌کنید، در برابر تعهد، حجم یا زمان باشد؛ نه از ترس سکوت.",
            "If you concede, trade it for commitment, volume, or timing. Not for silence.",
            "u83r56k",
            4,
            [
              mcq("امتیاز یک‌طرفه یعنی…", "A one-sided concession means…", [
                ["عدد را داده‌اید و چیزی نگرفته‌اید", "You gave the number and received nothing"],
                ["اعتماد قطعی ساخته شده", "Trust is guaranteed"],
                ["فروش حرفه‌ای تمام شده", "The sale is professionally finished"],
                ["مشتری حتماً برمی‌گردد", "The buyer will surely return"],
              ], 0),
              mcq("تخفیف وقتی ابزار درستی است که…", "A discount is a fair tool when…", [
                ["به یک تعهد مشخص وصل شود", "It is tied to a specific commitment"],
                ["اولین جمله مکالمه باشد", "It is the first sentence"],
                ["سقف نداشته باشد", "It has no ceiling"],
                ["به‌خاطر مکث مشتری داده شود", "It is given because the buyer paused"],
              ], 0),
              mcq("قبل از کم کردن قیمت باید روشن باشد…", "Before lowering the price you should know…", [
                ["کفی که حق رد کردنش را دارید", "The floor you are allowed to refuse"],
                ["فقط نام مشتری", "Only the buyer’s name"],
                ["رنگ اسلاید", "The slide color"],
                ["تعداد رقبا در اینترنت", "How many competitors are online"],
              ], 0),
            ],
          ),
          lesson(
            "mini-price-timing",
            "عدد را قبل از مسئله نگویید",
            "Do not name the number before the problem",
            "پیشنهاد و تخفیف وقتی معنا دارد که مسئله مشتری شنیده شده باشد.",
            "An offer and a discount mean something only after their problem is heard.",
            "f337310",
            7,
            [
              mcq("پیشنهاد زودهنگام معمولاً…", "An early offer usually…", [
                ["مکالمه را قبل از فهم مسئله می‌بندد", "Closes the talk before the problem is clear"],
                ["همیشه فروش را قطعی می‌کند", "Always closes the sale"],
                ["اعتراض قیمت را حذف می‌کند", "Removes the price objection"],
                ["جای سوال کشف نیاز را می‌گیرد و بهتر است", "Should replace discovery"],
              ], 0),
              mcq("اگر همان اول گفت «گرانه» و شما مسئله را نپرسیده‌اید…", "If they say it is expensive before you know the problem…", [
                ["اول بپرسید این قیمت جلوی کدام کار را گرفته", "Ask which job this price is blocking"],
                ["فوراً یک پله قیمت را کم کنید", "Drop one price step immediately"],
                ["کاتالوگ کامل را بفرستید", "Send the full catalog"],
                ["مکالمه را تمام‌شده حساب کنید", "Treat the talk as finished"],
              ], 0),
              mcq("قدم بعد از شنیدن مسئله…", "The step after hearing the problem is…", [
                ["یک پیشنهاد مرتبط با همان مسئله", "One offer tied to that problem"],
                ["سه محصول بی‌ربط", "Three unrelated products"],
                ["سکوت تا مشتری خسته شود", "Silence until they are tired"],
                ["تخفیف بدون شرط", "An unconditional discount"],
              ], 0),
            ],
          ),
        ],
      },
    ],
  },
  {
    id: "mini-open",
    tierRequired: "free",
    title: text("قلاب طلایی در ۱۰ ثانیه اول تماس سرد", "A golden hook in the first 10 seconds"),
    description: text(
      "چگونه مکالمه را شروع کنیم تا تلفن قطع نشود و کنجکاوی مشتری از همان جمله اول تحریک شود.",
      "How to open so the call is not cut, and curiosity starts with the first sentence.",
    ),
    subtopics: [
      {
        id: "open-track",
        title: text("شروع تماس", "The opening"),
        lessons: [
          lesson(
            "mini-open-hook",
            "ده ثانیه اول",
            "The first ten seconds",
            "نام، دلیل تماس و یک اجازهٔ کوتاه. نه لیست محصول و نه قیمت.",
            "Your name, the reason for the call, and a short permission. Not a catalog and not the price.",
            "y135t38",
            8,
            [
              mcq("ثانیه‌های اول تماس سرد باید…", "The first seconds of a cold call should…", [
                ["نام، دلیل تماس و یک اجازهٔ کوتاه باشد", "Be your name, the reason, and a short permission"],
                ["لیست کامل محصولات باشد", "Be the full product list"],
                ["قیمت نهایی را اعلام کند", "Announce the final price"],
                ["با سکوت شروع شود", "Start with silence"],
              ], 0),
              mcq("اگر گفت «وقت ندارم»…", "If they say they have no time…", [
                ["یک زمان مشخص دیگر پیشنهاد دهید", "Offer one specific other time"],
                ["متن را تا آخر بخوانید", "Read the whole script anyway"],
                ["بدون قرار قطع کنید", "Hang up with no next step"],
                ["همان لحظه تخفیف بدهید", "Offer a discount on the spot"],
              ], 0),
              mcq("لحن جملهٔ اول…", "The opening tone should be…", [
                ["شمرده و مطمئن، نه عجله‌ای", "Measured and sure, not rushed"],
                ["بلندتر از مشتری", "Louder than the buyer"],
                ["پر از شوخی", "Full of jokes"],
                ["آن‌قدر آهسته که دلیل تماس گم شود", "So slow the reason disappears"],
              ], 0),
            ],
          ),
          lesson(
            "mini-open-clear",
            "یک جمله که فهمیده شود",
            "One sentence they can follow",
            "قلاب وقتی کار می‌کند که در یک جمله فهمیده شود، نه در یک پاراگراف.",
            "The hook works when it is understood in one sentence, not a paragraph.",
            "d48l8u4",
            3,
            [
              mcq("فن بیان در جملهٔ اول تماس برای چیست؟", "Expression in the first line is for…", [
                ["فهمیده شدن دلیل تماس", "Being understood about why you called"],
                ["زیبا حرف زدن بدون محتوا", "Sounding pretty with no content"],
                ["تند خواندن متن", "Reading the script faster"],
                ["استفاده از اصطلاح انگلیسی", "Using English jargon"],
              ], 0),
              mcq("جملهٔ واضح شروع…", "A clear opening sentence…", [
                ["یک دلیل برای این تماس را نام می‌برد", "Names one reason for this call"],
                ["سه محصول را قاطی می‌کند", "Mixes three products"],
                ["با عذرخواهی طولانی شروع می‌شود", "Starts with a long apology"],
                ["عمداً مبهم می‌ماند", "Stays vague on purpose"],
              ], 0),
              mcq("تمرین این درس یعنی…", "Practice for this lesson means…", [
                ["همان جمله را شمرده و قابل فهم بگویید", "Saying the same line at a pace people can follow"],
                ["هر بار لحن را عوض کنید", "Changing tone every time"],
                ["از روی متن بدون معنی بخوانید", "Reading with no meaning"],
                ["جمله را بلندتر از ده ثانیه کنید", "Stretching the line past ten seconds"],
              ], 0),
            ],
          ),
          lesson(
            "mini-open-sample",
            "سوال، بازتاب، قدم بعد",
            "Question, reflection, next step",
            "بعد از قلاب، سه حرکت: یک سوال، برگرداندن حرف خودش، و درخواست یک قدم.",
            "After the hook: one question, a reflection of their words, and one next-step ask.",
            "l97j30d",
            4,
            [
              mcq("بازتاب جمله مشتری یعنی…", "Reflecting their words means…", [
                ["عبارت خودش را کوتاه برگردانید", "Briefly return their own phrase"],
                ["حرفش را اصلاح کنید", "Correct them"],
                ["مکالمه را از نو شروع کنید", "Restart the call"],
                ["فقط بگویید بله بله", "Only saying yes yes"],
              ], 0),
              mcq("هدف این سه حرکت…", "The aim of these three moves is…", [
                ["رسیدن به یک قدم بعدی روشن", "Reaching one clear next step"],
                ["طولانی کردن تماس تا هر قیمت", "Stretching the call at any cost"],
                ["حفظ متن بدون انحراف", "Reciting the script with no deviation"],
                ["قطع سریع", "Hanging up fast"],
              ], 0),
              mcq("سوال خوب بعد از قلاب…", "A good question after the hook…", [
                ["کوتاه است و جوابش تصمیم را جلو می‌برد", "Is short and its answer moves the decision"],
                ["سه موضوع را یکجا می‌پرسد", "Asks three topics at once"],
                ["درباره زندگی خصوصی است", "Is about private life"],
                ["فقط بله یا خیر اجباری است", "Is only a forced yes or no"],
              ], 0),
            ],
          ),
          lesson(
            "mini-open-who",
            "قبل از شماره‌گیری، طرف کیست؟",
            "Who are you calling?",
            "قلاب روی کسی که فقط یک شماره است نمی‌نشیند. بدانید هنوز در مرحله توجه است یا نیازش روشن‌تر شده.",
            "A hook misses if they are only a number. Know whether they are still just attention or a clearer need.",
            "sdh3pzo",
            6,
            [
              mcq("لید یعنی چه کسی؟", "A lead is someone who…", [
                ["توجه نشان داده و راه تماس داده", "Has shown attention and a way to reach them"],
                ["قرارداد را امضا کرده", "Has signed the contract"],
                ["حتماً همین تماس را می‌خرد", "Will definitely buy on this call"],
                ["هیچ راه تماسی ندارد", "Has no way to be reached"],
              ], 0),
              mcq("اگر فقط یک شماره بدون زمینه دارید…", "If you only have a number and no context…", [
                ["جملهٔ اول باید دلیل تماس را خیلی کوتاه بگوید", "The first line has to state the reason very briefly"],
                ["معرفی کامل شرکت را بخوانید", "Read the full company introduction"],
                ["قیمت را همان اول بگویید", "Say the price first"],
                ["فرض کنید آماده خرید است", "Assume they are ready to buy"],
              ], 0),
              mcq("قلاب وقتی کنجکاوی می‌سازد که…", "The hook creates curiosity when…", [
                ["به موقعیت همان آدم وصل باشد، نه به متن عمومی", "It connects to that person, not a generic script"],
                ["برای همهٔ لیست یکسان و بلند باشد", "It is long and identical for the whole list"],
                ["با تخفیف شروع شود", "It starts with a discount"],
                ["نام مشتری را حذف کند", "It omits their name"],
              ], 0),
            ],
          ),
        ],
      },
    ],
  },
  {
    id: "mini-think",
    tierRequired: "free",
    title: text("پایان بلاتکلیفی: مهار بهانه «باید فکر کنم»", "Ending the stall: “I need to think”"),
    description: text(
      "سه پاسخ برای وقتی که مشتری مکث می‌کند: مانع واقعی را پیدا کنید و یک زمان برگشت ببندید، بدون تعقیب و بدون تخفیف فوری.",
      "Three replies when the buyer stalls: find the real block and book a return time, without chasing or an instant discount.",
    ),
    subtopics: [
      {
        id: "think-track",
        title: text("مکث مشتری", "The stall"),
        lessons: [
          lesson(
            "mini-think-room",
            "فکر کردن را با فشار جواب ندهید",
            "Do not answer thinking with pressure",
            "مکث، تهدید نیست. اگر بدن و لحنتان عجله را نشان دهد، «فکر می‌کنم» طولانی‌تر می‌شود.",
            "A pause is not a threat. If your tone rushes them, the stall lasts longer.",
            "d355ud8",
            7,
            [
              mcq("اگر مشتری گفت «باید فکر کنم» و شما عجله کنید…", "If they need to think and you rush…", [
                ["مکث را به مقاومت تبدیل می‌کنید", "You turn the pause into resistance"],
                ["معمولاً همان لحظه امضا می‌گیرد", "You usually get a signature immediately"],
                ["مانع واقعی خودش روشن می‌شود", "The real block explains itself"],
                ["نیازی به سوال بعدی نیست", "No further question is needed"],
              ], 0),
              mcq("آرامش در این لحظه به مشتری…", "Calm at this moment gives the buyer…", [
                ["اجازهٔ فکر کردن بدون تهدید", "Room to think without threat"],
                ["احساس بازجویی", "A sense of interrogation"],
                ["اجبار به تخفیف", "Pressure to demand a discount"],
                ["دلیل قطع تماس", "A reason to hang up"],
              ], 0),
              mcq("لحن درست بعد از «فکر می‌کنم»…", "The right tone after “I’ll think about it”…", [
                ["کوتاه، آرام، و یک سوال مشخص", "Short, calm, and one specific question"],
                ["بلند و پیاپی", "Loud and repeated"],
                ["طعنه‌آمیز", "Sarcastic"],
                ["سکوت تا قطع تماس", "Silence until they hang up"],
              ], 0),
            ],
          ),
          lesson(
            "mini-think-next",
            "یک زمان برگشت، نه یک تخفیف",
            "A return time, not a discount",
            "تصمیم را مبهم رها نکنید. بپرسید کدام بخش مانده و همان‌جا زمان برگشت را ببندید.",
            "Do not leave the decision vague. Ask what is left and book the return time there.",
            "k822635",
            6,
            [
              mcq("درخواست بعد از «فکر می‌کنم» باید…", "The ask after “I’ll think about it” should be…", [
                ["مشخص باشد: کدام بخش، و چه زمانی برمی‌گردیم", "Be specific: which part, and when we return"],
                ["در حد «هر وقت خواستید زنگ بزنید» بماند", "Stay at “call whenever you want”"],
                ["با تخفیف تازه همراه باشد", "Come with a fresh discount"],
                ["به معرفی محصول جدید بپرد", "Jump to a new product"],
              ], 0),
              mcq("اگر بعد از این جمله ساکت شد…", "If they go quiet after that line…", [
                ["یک سوال کوتاه بپرسید و سکوت را با حرف اضافه پر نکنید", "Ask one short question instead of filling the silence"],
                ["تخفیف را سه بار تکرار کنید", "Repeat the discount three times"],
                ["تماس را بدون قرار قطع کنید", "Hang up with no appointment"],
                ["محصول دیگری را ناگهان معرفی کنید", "Suddenly pitch another product"],
              ], 0),
              mcq("پیگیری این مکث وقتی درست است که…", "Follow-up on this stall is useful when…", [
                ["به همان بخش مبهم و زمان توافق‌شده اشاره کند", "It refers to the unclear part and the agreed time"],
                ["انگار تماس اول است", "It pretends to be the first call"],
                ["هر ساعت یک پیام تخفیف باشد", "It is a discount message every hour"],
                ["نام مشتری را نداشته باشد", "It omits their name"],
              ], 0),
            ],
          ),
          lesson(
            "mini-think-funnel",
            "یک مکث، کل قیف را نگه نمی‌دارد",
            "One stall does not freeze the funnel",
            "تا جواب این مشتری می‌آید، بقیهٔ گفتگوها باید جلو بروند.",
            "While this buyer is thinking, the other conversations still have to move.",
            "c63651b",
            3,
            [
              mcq("«باید فکر کنم» دربارهٔ یک مشتری یعنی…", "“I need to think” from one buyer means…", [
                ["همان گفتگو منتظر یک زمان برگشت است، نه کل کار شما", "That talk waits for a return time, not your whole work"],
                ["باید همهٔ تماس‌ها را متوقف کنید", "You should stop every other call"],
                ["قیف را پاک کنید", "You should wipe the funnel"],
                ["به همه تخفیف بدهید", "You should discount everyone"],
              ], 0),
              mcq("تا زمان برگشت…", "Until the return time…", [
                ["گفتگوهای دیگر همچنان جلو می‌روند", "Other conversations still move"],
                ["فقط همین مشتری را پیامک کنید", "You only message this buyer"],
                ["لیست را کنار بگذارید", "You set the list aside"],
                ["فرض کنید فروش قطعی است", "You assume the sale is closed"],
              ], 0),
              mcq("اگر این مذاکره سخت شد…", "If this one negotiation gets hard…", [
                ["بقیهٔ قیف هنوز باید جلو برود", "The rest of the funnel should still move"],
                ["همه را متوقف کنید", "Stop everyone"],
                ["تخفیف را به کل لیست بفرستید", "Send a discount to the entire list"],
                ["پیگیری را پاک کنید", "Delete the follow-up"],
              ], 0),
            ],
          ),
        ],
      },
    ],
  },
];
