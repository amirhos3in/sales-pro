export type Localized = { fa: string; en: string };

export type QuizQuestion = {
  prompt: Localized;
  options: Localized[];
  answer: number;
};

export type VideoLesson = {
  id: string;
  title: Localized;
  summary: Localized;
  aparat: string;
  minutes: number;
  quiz: QuizQuestion[];
};

export type Subtopic = {
  id: string;
  title: Localized;
  lessons: VideoLesson[];
};

export type CourseTier = "pro" | "free";

export type Category = {
  id: string;
  title: Localized;
  description: Localized;
  tierRequired: CourseTier;
  subtopics: Subtopic[];
};

export type Gate =
  | { state: "auth" }
  | { state: "plan" }
  | { state: "sequence"; previous: Localized }
  | { state: "open" };

function text(fa: string, en: string): Localized {
  return { fa, en };
}

function mcq(
  promptFa: string,
  promptEn: string,
  options: Array<[string, string]>,
  answer: number,
): QuizQuestion {
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
): VideoLesson {
  return {
    id,
    title: text(titleFa, titleEn),
    summary: text(summaryFa, summaryEn),
    aparat,
    minutes,
    quiz,
  };
}

export const categories: Category[] = [
  {
    id: "online",
    tierRequired: "pro",
    title: text("آموزش فروش آنلاین", "Online Sales Mastery"),
    description: text(
      "قیف، اعتماد در اینستاگرام و تبدیل توجه به گفتگوی خرید.",
      "Funnels, Instagram trust, and turning attention into a buying conversation.",
    ),
    subtopics: [
      {
        id: "funnel",
        title: text("قیف فروش", "Sales funnel"),
        lessons: [
          lesson(
            "online-lead",
            "لید، پراسپکت و مشتری",
            "Lead, prospect, and customer",
            "تفاوت سه مرحله قیف و اینکه چه عددی نشان می‌دهد فرد به مرحله بعد رفته است.",
            "The three funnel stages and which signal shows someone moved forward.",
            "sdh3pzo",
            6,
            [
              mcq("لید یعنی چه کسی؟", "A lead is someone who…", [
                ["هنوز فقط توجه نشان داده و راه تماس داده", "Has shown attention and a way to reach them"],
                ["قرارداد را امضا کرده است", "Has already signed the contract"],
                ["حتماً همین هفته می‌خرد", "Will definitely buy this week"],
                ["فقط فالوور خام است و هیچ راه تماسی ندارد", "Is a raw follower with no contact path"],
              ], 0),
              mcq("پراسپکت از لید جدا می‌شود وقتی…", "A lead becomes a prospect when…", [
                ["نیاز و زمان خریدش روشن‌تر شده", "Need and timing are clearer"],
                ["پست را لایک کرده", "They liked a post"],
                ["قیمت را نشنیده", "They have not heard the price"],
                ["از پیج خارج شده", "They left the page"],
              ], 0),
              mcq("شاخص عبور در قیف باید…", "A funnel stage metric should be…", [
                ["قابل شمارش و قابل مشاهده باشد", "Countable and observable"],
                ["فقط حس فروشنده باشد", "Only the seller’s feeling"],
                ["هر روز عوض شود", "Change every day"],
                ["مخفی بماند", "Stay hidden"],
              ], 0),
            ],
          ),
          lesson(
            "online-funnel-shape",
            "قیف فروش چیست؟",
            "What a sales funnel is",
            "تعریف قیف، مراحل و یک مثال ساده از آگاهی تا خرید.",
            "The definition, the stages, and a simple path from awareness to purchase.",
            "4Se29",
            4,
            [
              mcq("قیف فروش بالا پهن است چون…", "The top of a funnel is wide because…", [
                ["افراد زیادی وارد آگاهی می‌شوند و تعداد کمتری می‌خرند", "Many people become aware and fewer buy"],
                ["همه باید همزمان بخرند", "Everyone should buy at once"],
                ["قیمت آنجا ارزان‌تر است", "The price is lower there"],
                ["تبلیغ ممنوع است", "Ads are forbidden"],
              ], 0),
              mcq("کار مرحله میانی قیف چیست؟", "The middle of the funnel should…", [
                ["اعتماد و تناسب را روشن کند", "Clarify trust and fit"],
                ["فقط تخفیف بدهد", "Only discount"],
                ["مخاطب را بلاک کند", "Block the audience"],
                ["محصول را پنهان کند", "Hide the product"],
              ], 0),
              mcq("خروجی سالم قیف چیست؟", "A healthy funnel output is…", [
                ["مشتری‌ای که تصمیم را با دلیل گرفته", "A customer who decided for a reason"],
                ["بیشترین لایک", "The most likes"],
                ["طولانی‌ترین ویدیو", "The longest video"],
                ["بستن کامنت‌ها", "Closing comments"],
              ], 0),
            ],
          ),
        ],
      },
      {
        id: "social",
        title: text("فروش در اینستاگرام", "Instagram selling"),
        lessons: [
          lesson(
            "online-trust",
            "اعتماد فالوور",
            "Follower trust",
            "قبل از پیشنهاد خرید، نشانه‌های اعتماد باید در محتوا و دایرکت دیده شود.",
            "Trust signals have to show up in content and DMs before the offer.",
            "Uftz9",
            72,
            [
              mcq("اعتماد قبل از قیمت یعنی…", "Trust before price means…", [
                ["مخاطب دلیل گوش دادن دارد", "The person has a reason to listen"],
                ["اول تخفیف را فریاد بزنید", "Shout the discount first"],
                ["شماره کارت را همان پیام اول بفرستید", "Send payment details in the first message"],
                ["سوال نپرسید", "Never ask a question"],
              ], 0),
              mcq("کدام پیام اعتماد می‌سازد؟", "Which message builds trust?", [
                ["یک نتیجه مشخص از مشتری قبلی، بدون اغراق", "A specific past result, without hype"],
                ["«فقط امروز، وگرنه پشیمون می‌شی»", "“Today only or you will regret it”"],
                ["ده پیام پشت سر هم", "Ten messages in a row"],
                ["درخواست فالو در ازای تخفیف اجباری", "A forced follow-for-discount"],
              ], 0),
              mcq("اگر فالوور سرد است، قدم درست…", "If a follower is cold, the right move is…", [
                ["یک سوال درباره موقعیت خودش", "One question about their situation"],
                ["لینک پرداخت فوری", "An instant payment link"],
                ["حذف او از لیست", "Deleting them"],
                ["تخفیف ۵۰ درصد بدون گفتگو", "A 50% discount with no conversation"],
              ], 0),
            ],
          ),
          lesson(
            "online-offer",
            "از توجه تا پیشنهاد",
            "From attention to the offer",
            "محتوا توجه می‌گیرد؛ پیشنهاد وقتی می‌آید که مسئله مخاطب شنیده شده باشد.",
            "Content earns attention. The offer arrives after their problem is heard.",
            "f337310",
            7,
            [
              mcq("پیشنهاد زود هنگام چه می‌کند؟", "An early offer usually…", [
                ["مکالمه را قبل از فهم مسئله می‌بندد", "Closes the talk before the problem is clear"],
                ["همیشه نرخ تبدیل را بالا می‌برد", "Always raises conversion"],
                ["جایگزین اعتماد است", "Replaces trust"],
                ["قیف را حذف می‌کند", "Removes the funnel"],
              ], 0),
              mcq("پیشنهاد خوب آنلاین…", "A good online offer…", [
                ["به مسئله‌ای که خود مخاطب گفت وصل است", "Connects to a problem they named"],
                ["برای همه یک متن ثابت و طولانی است", "Is one long script for everyone"],
                ["فقط ایموجی است", "Is only emoji"],
                ["قیمت را خط می‌زند بدون دلیل", "Strikes the price with no reason"],
              ], 0),
              mcq("قدم بعد از موافقت اولیه؟", "After a soft yes, next is…", [
                ["جزئیات تحویل، قیمت و قدم پرداخت را روشن کنید", "Clarify delivery, price, and the payment step"],
                ["بحث را رها کنید", "Drop the thread"],
                ["موضوع را عوض کنید", "Change the subject"],
                ["دوباره از صفر معرفی کنید", "Reintroduce yourself from zero"],
              ], 0),
            ],
          ),
        ],
      },
    ],
  },
  {
    id: "hozuri",
    tierRequired: "pro",
    title: text("آموزش فروش حضوری", "In-Person Sales Mastery"),
    description: text(
      "زبان بدن، ورود به جلسه و بستن رو در رو بدون فشار مصنوعی.",
      "Body language, the live meeting, and closing face to face without fake pressure.",
    ),
    subtopics: [
      {
        id: "body",
        title: text("زبان بدن", "Body language"),
        lessons: [
          lesson(
            "live-open",
            "زبان بدن فروش حضوری",
            "Body language in the room",
            "نشستن، فاصله و دست‌ها قبل از آنکه جمله‌ای درباره محصول گفته شود.",
            "Seat, distance, and hands before any product sentence.",
            "ocf64x3",
            1,
            [
              mcq("دست به سینه در شروع جلسه معمولاً…", "Crossed arms at the start usually…", [
                ["فاصله و قضاوت را بیشتر می‌کند", "Increase distance and judgment"],
                ["نشانه قطعی خرید است", "Prove they will buy"],
                ["باید تقلید شود", "Should be copied immediately"],
                ["جایگزین سوال کشف نیاز است", "Replace discovery questions"],
              ], 0),
              mcq("فاصله مناسب حضوری…", "A useful in-person distance…", [
                ["به طرف مقابل اجازه نفس کشیدن می‌دهد", "Lets the other person breathe"],
                ["هرچه نزدیک‌تر همیشه بهتر", "Is always as close as possible"],
                ["پشت میز خیلی بلند پنهان می‌شود", "Hides behind a very tall desk"],
                ["اهمیتی ندارد", "Does not matter"],
              ], 0),
              mcq("تماس چشمی خوب…", "Good eye contact…", [
                ["متناوب است، نه خیره شدن", "Is intermittent, not a stare"],
                ["باید قطع شود", "Should be avoided"],
                ["فقط موقع قیمت باشد", "Happens only at the price"],
                ["نشانه ضعف است", "Is a sign of weakness"],
              ], 0),
            ],
          ),
          lesson(
            "live-importance",
            "چرا زبان بدن فروش را عوض می‌کند",
            "Why body language changes the sale",
            "مخاطب امنیت و صداقت را زودتر از اسلاید می‌خواند.",
            "People read safety and honesty before they read a slide.",
            "d355ud8",
            7,
            [
              mcq("اگر کلام و بدن خلاف هم باشند، مخاطب…", "If words and body disagree, people…", [
                ["بدن را باور می‌کند", "Believe the body"],
                ["همیشه متن را باور می‌کند", "Always believe the script"],
                ["خرید را سریع‌تر قطعی می‌کند", "Close faster automatically"],
                ["قیمت را فراموش می‌کند", "Forget the price"],
              ], 0),
              mcq("آرامش فروشنده به مشتری…", "A calm seller gives the buyer…", [
                ["اجازه فکر کردن بدون تهدید", "Room to think without threat"],
                ["احساس عجله مصنوعی", "A fake sense of rush"],
                ["بی‌تفاوتی به نیازش", "Indifference to their need"],
                ["اجبار به امضا", "Pressure to sign"],
              ], 0),
              mcq("زبان بدن جایگزین چیست نیست؟", "Body language does not replace…", [
                ["سوال تشخیص نیاز", "A discovery question"],
                ["سلام", "A greeting"],
                ["نشستن", "Sitting down"],
                ["نفس", "Breathing"],
              ], 0),
            ],
          ),
        ],
      },
      {
        id: "close-live",
        title: text("بستن جلسه", "Closing the meeting"),
        lessons: [
          lesson(
            "live-tracy",
            "نکاتی برای فروش بیشتر",
            "Notes for selling more",
            "چند عادت قابل تمرین برای جلسه حضوری، از شروع تا درخواست تصمیم.",
            "A few trainable habits for a live meeting, from the open to the decision ask.",
            "k822635",
            6,
            [
              mcq("درخواست تصمیم باید…", "The decision ask should be…", [
                ["مشخص و بعد از جمع‌بندی ارزش باشد", "Specific, and after the value is summarized"],
                ["در ثانیه اول سلام بیاید", "Arrive in the first second"],
                ["مبهم بماند تا مشتری خودش بفهمد", "Stay vague so they guess"],
                ["با تهدید همراه باشد", "Come with a threat"],
              ], 0),
              mcq("اگر مشتری ساکت شد…", "If the buyer goes quiet…", [
                ["یک سوال کوتاه بپرسید، فضا را با حرف اضافه پر نکنید", "Ask one short question instead of filling the silence"],
                ["تخفیف را سه بار تکرار کنید", "Repeat the discount three times"],
                ["جلسه را ترک کنید", "Leave the room"],
                ["محصول دیگری را ناگهان معرفی کنید", "Suddenly pitch another product"],
              ], 0),
              mcq("عادت فروشنده قوی در جلسه…", "A strong live habit is…", [
                ["یادداشت کردن واژه خود مشتری", "Writing down the buyer’s own words"],
                ["حفظ یک متن بدون شنیدن", "Reciting a script without listening"],
                ["قطع کردن حرف مشتری", "Interrupting"],
                ["پنهان کردن قیمت تا آخر بدون زمینه", "Hiding price with no context"],
              ], 0),
            ],
          ),
          lesson(
            "live-manager",
            "زبان بدن مدیر فروش",
            "A sales lead’s body language",
            "حضور مدیر یا فروشنده ارشد چطور فضا را امن یا سنگین می‌کند.",
            "How a senior seller makes the room feel safe or heavy.",
            "b1315gv",
            5,
            [
              mcq("حضور سنگین مدیر معمولاً وقتی آسیب می‌زند که…", "A heavy presence hurts when…", [
                ["مشتری احساس بازجویی کند", "The buyer feels interrogated"],
                ["سلام گرم باشد", "The greeting is warm"],
                ["سوال باز پرسیده شود", "An open question is asked"],
                ["زمان جلسه روشن باشد", "The meeting time is clear"],
              ], 0),
              mcq("اعتبار حضوری از کجا دیده می‌شود؟", "Live authority is easiest to see in…", [
                ["آرامش، نوبت حرف و دقت به جواب", "Calm, turn-taking, and attention to the answer"],
                ["بلند حرف زدن", "Speaking louder"],
                ["ایستادن بالای سر مشتری", "Standing over the buyer"],
                ["تعداد اسلاید", "The slide count"],
              ], 0),
              mcq("پایان جلسه خوب…", "A good meeting ending…", [
                ["قدم بعدی، صاحب آن و زمان را نام می‌برد", "Names the next step, the owner, and the time"],
                ["با جمله «هر وقت خواستی زنگ بزن» رها می‌شود", "Ends with “call whenever”"],
                ["قول تخفیف نانوشته می‌دهد", "Promises an unwritten discount"],
                ["بدون خداحافظی تمام می‌شود", "Stops without a close"],
              ], 0),
            ],
          ),
        ],
      },
    ],
  },
  {
    id: "telefoni",
    tierRequired: "pro",
    title: text("آموزش فروش تلفنی", "Telesales Mastery"),
    description: text(
      "برخورد اول، مکالمه بیمه و نقشه راه تماس سرد تا قرار بعدی.",
      "The first contact, a real call sample, and a path from cold call to the next step.",
    ),
    subtopics: [
      {
        id: "first-call",
        title: text("برخورد اول", "First contact"),
        lessons: [
          lesson(
            "phone-first",
            "اولین برخورد در کال‌سنتر",
            "The first call-center contact",
            "جمله آغاز، اجازه ادامه دادن و تشخیص اینکه طرف مقابل وقت دارد یا نه.",
            "The opening line, permission to continue, and whether they have time.",
            "y135t38",
            8,
            [
              mcq("ثانیه‌های اول تماس باید…", "The first seconds of a call should…", [
                ["نام، دلیل تماس و یک اجازه کوتاه باشد", "Be your name, the reason, and a short permission"],
                ["لیست کامل محصولات باشد", "Be the full product list"],
                ["قیمت نهایی را فریاد بزند", "Shout the final price"],
                ["سکوت مطلق باشد", "Be total silence"],
              ], 0),
              mcq("اگر گفت «وقت ندارم»…", "If they say they have no time…", [
                ["یک زمان مشخص دیگر پیشنهاد دهید", "Offer one specific other time"],
                ["همان لحظه متن را تا آخر بخوانید", "Read the whole script anyway"],
                ["تماس را بدون قرار قطع کنید", "Hang up with no next step"],
                ["تخفیف را دو برابر کنید", "Double the discount"],
              ], 0),
              mcq("لحن برخورد اول…", "The opening tone should be…", [
                ["شمرده و مطمئن، نه عجله‌ای", "Measured and sure, not rushed"],
                ["خیلی آهسته و نامفهوم", "So slow it is unclear"],
                ["بلندتر از مشتری برای تسلط", "Louder than the buyer to dominate"],
                ["شوخی سنگین", "A heavy joke"],
              ], 0),
            ],
          ),
          lesson(
            "phone-sample",
            "نمونه مکالمه فروش تلفنی",
            "A telesales conversation sample",
            "سه حرکت ساده: سوال، بازتاب جمله مشتری، درخواست قدم بعدی.",
            "Three moves: a question, a reflection of their words, and a next-step ask.",
            "l97j30d",
            4,
            [
              mcq("بازتاب جمله مشتری یعنی…", "Reflecting their words means…", [
                ["عبارت خودش را کوتاه برگردانید تا مطمئن شود شنیده شده", "Briefly return their phrase so they feel heard"],
                ["حرفش را اصلاح کنید", "Correct them"],
                ["مکالمه را از نو شروع کنید", "Restart the call"],
                ["فقط بگویید بله بله", "Only saying “yes yes”"],
              ], 0),
              mcq("هدف این نمونه مکالمه…", "The aim of the sample call is…", [
                ["رسیدن به یک قدم بعدی روشن", "Reaching one clear next step"],
                ["صحبت تا تمام شدن شارژ", "Talking until the battery dies"],
                ["حفظ کامل متن بدون انحراف", "Reciting the script with zero deviation"],
                ["قطع سریع", "Hanging up fast"],
              ], 0),
              mcq("سوال خوب تلفنی…", "A good phone question…", [
                ["کوتاه است و جوابش تصمیم را جلو می‌برد", "Is short and its answer moves the decision"],
                ["سه موضوع را یکجا می‌پرسد", "Asks three topics at once"],
                ["بله و خیر اجباری بدون زمینه است", "Is a forced yes/no with no context"],
                ["درباره زندگی خصوصی است", "Is about private life"],
              ], 0),
            ],
          ),
        ],
      },
      {
        id: "phone-system",
        title: text("نقشه راه تماس", "Call roadmap"),
        lessons: [
          lesson(
            "phone-roadmap",
            "نقشه راه فروش تلفنی",
            "The telesales roadmap",
            "از لیست تماس تا پیگیری؛ هر تماس باید وضعیت مشخص داشته باشد.",
            "From the call list to follow-up. Every call needs a status.",
            "kjhf6jl",
            30,
            [
              mcq("وضعیت تماس باید بعد از هر شماره…", "After each number, call status should be…", [
                ["ثبت شود: جواب نداد، قرار شد، یا رد کرد", "Logged: no answer, booked, or declined"],
                ["به حافظه سپرده شود", "Left to memory"],
                ["پاک شود", "Deleted"],
                ["برای همه یکسان «عالی» باشد", "Marked excellent for everyone"],
              ], 0),
              mcq("پیگیری موثر…", "A useful follow-up…", [
                ["به قول همان تماس قبلی اشاره می‌کند", "Refers to the promise from the last call"],
                ["انگار تماس اول است", "Pretends it is the first call"],
                ["هر ساعت یک پیام صوتی بلند است", "Is a long voicemail every hour"],
                ["بدون نام مشتری است", "Omits their name"],
              ], 0),
              mcq("نقشه راه جلوی چه چیزی را می‌گیرد؟", "A roadmap mainly prevents…", [
                ["تماس تصادفی بدون قدم بعدی", "Random calls with no next step"],
                ["سلام کردن", "Saying hello"],
                ["نوشتن نام", "Writing the name"],
                ["قطع تماس مودبانه", "A polite hang-up"],
              ], 0),
            ],
          ),
          lesson(
            "phone-intro",
            "معارفه هنر فروش تلفنی",
            "What telesales skill actually is",
            "تماس موفق اجرای یک جمله نیست؛ ترتیب شنیدن، پیشنهاد و قرار است.",
            "A good call is not one magic line. It is the order of listening, offering, and booking.",
            "bpt696d",
            17,
            [
              mcq("مهارت تلفنی بیشتر از متن، به چه چیزی بند است؟", "Phone skill depends more on…", [
                ["ترتیب شنیدن و درخواست", "The order of listening and asking"],
                ["طولانی بودن معرفی شرکت", "A long company introduction"],
                ["لهجه رسمی مصنوعی", "An artificial formal accent"],
                ["تعداد زنگ", "How many rings"],
              ], 0),
              mcq("معارفه دوره یا محصول باید…", "The introduction of the offer should…", [
                ["کوتاه و متصل به مسئله شنونده باشد", "Be short and tied to the listener’s problem"],
                ["تاریخچه کامل شرکت باشد", "Be the full company history"],
                ["قبل از اجازه ادامه بیاید", "Arrive before permission to continue"],
                ["بدون هیچ سوالی تمام شود", "Finish with no question"],
              ], 0),
              mcq("نشانه تماس ضعیف…", "A weak call shows up as…", [
                ["پایان بدون زمان مشخص بعدی", "An ending with no specific next time"],
                ["یک سوال تشخیص", "One discovery question"],
                ["نام بردن قدم بعدی", "Naming the next step"],
                ["ثبت نتیجه", "Logging the result"],
              ], 0),
            ],
          ),
        ],
      },
    ],
  },
  {
    id: "mozakerah",
    tierRequired: "pro",
    title: text("آموزش مذاکره", "Negotiation Mastery"),
    description: text(
      "اصول امتیاز، مخالفت مشتری و استراتژی قبل از اینکه تخفیف تنها ابزار شود.",
      "Trading concessions, handling objections, and strategy before discount becomes the only tool.",
    ),
    subtopics: [
      {
        id: "principles",
        title: text("اصول مذاکره", "Principles"),
        lessons: [
          lesson(
            "neg-principles",
            "اصول مذاکره فروش",
            "Principles of sales negotiation",
            "امتیاز در برابر امتیاز، و مرز چیزی که بدون تایید داده نمی‌شود.",
            "A concession for a concession, and a line you do not cross without approval.",
            "u83r56k",
            4,
            [
              mcq("امتیاز یک‌طرفه یعنی…", "A one-sided concession means…", [
                ["چیزی داده‌اید و چیزی نگرفته‌اید", "You gave something and received nothing"],
                ["مذاکره حرفه‌ای", "Professional negotiation"],
                ["ساخت اعتماد قطعی", "Guaranteed trust"],
                ["بستن سریع همیشگی", "Always a faster close"],
              ], 0),
              mcq("قبل از جلسه مذاکره باید روشن باشد…", "Before the meeting you should know…", [
                ["کف قیمت یا شرطی که حق رد کردنش را دارید", "The floor you are allowed to refuse"],
                ["فقط نام خریدار", "Only the buyer’s name"],
                ["رنگ لباس", "What to wear"],
                ["تعداد اسلاید", "The slide count"],
              ], 0),
              mcq("تخفیف وقتی ابزار درستی است که…", "A discount is a fair tool when…", [
                ["در برابر تعهد یا حجم یا زمان بسته شود", "It is traded for commitment, volume, or timing"],
                ["از ترس سکوت داده شود", "It is given out of fear of silence"],
                ["اولین جمله باشد", "It is the first sentence"],
                ["سقفی نداشته باشد", "It has no ceiling"],
              ], 0),
            ],
          ),
          lesson(
            "neg-objection",
            "مخالفت مشتری",
            "Buyer objections",
            "مخالفت را انکار نکنید؛ نوعش را جدا کنید و به همان جواب بدهید.",
            "Do not deny the objection. Name its type and answer that.",
            "v43l4f5",
            4,
            [
              mcq("اولین واکنش به «گرانه» بهتر است…", "The first response to “it’s expensive” is better as…", [
                ["یک سوال: نسبت به چه چیزی؟", "A question: compared with what?"],
                ["عذرخواهی و تخفیف فوری", "An apology and an instant discount"],
                ["قطع مذاکره", "Ending the talk"],
                ["تکرار همان قیمت با صدای بلندتر", "Repeating the price louder"],
              ], 0),
              mcq("بعضی مخالفت‌ها در واقع…", "Some objections are actually…", [
                ["درخواست اطلاعات یا زمان‌اند", "A request for information or time"],
                ["توهین شخصی‌اند", "A personal insult"],
                ["پایان قطعی‌اند همیشه", "Always a final no"],
                ["نشانه زبان بدن بد شما نیستند هرگز", "Never about missing information"],
              ], 0),
              mcq("جواب به مخالفت باید…", "An answer to an objection should…", [
                ["کوتاه باشد و به یک قدم برگردد", "Be short and return to one next step"],
                ["یک سخنرانی ده دقیقه‌ای باشد", "Be a ten-minute speech"],
                ["مخالفت را مسخره کند", "Mock the objection"],
                ["موضوع را عوض کند", "Change the subject"],
              ], 0),
            ],
          ),
        ],
      },
      {
        id: "strategy",
        title: text("استراتژی مذاکره", "Strategy"),
        lessons: [
          lesson(
            "neg-strategy",
            "استراتژی مذاکره فروش",
            "Sales negotiation strategy",
            "قبل از عدد، ترتیب پیشنهاد و چیزی که حاضرید مبادله کنید را بچینید.",
            "Before the number, arrange the order of the offer and what you will trade.",
            "qbvpg08",
            45,
            [
              mcq("استراتژی یعنی…", "Strategy here means…", [
                ["ترتیب امتیازها قبل از شروع چانه‌زنی", "The order of concessions before haggling starts"],
                ["بداهه کامل بدون کف", "Total improvisation with no floor"],
                ["تخفیف پلکانی تا رضایت", "A staircase of discounts until they smile"],
                ["سکوت تا آخر جلسه", "Silence until the end"],
              ], 0),
              mcq("لنگر قیمت وقتی خطرناک است که…", "A price anchor is risky when…", [
                ["بدون ارزش پشتیبان و خیلی دور از واقعیت باشد", "It has no value behind it and is far from reality"],
                ["بعد از نیازسنجی بیاید", "It comes after discovery"],
                ["مکتوب شود", "It is written down"],
                ["قابل توضیح باشد", "It can be explained"],
              ], 0),
              mcq("اگر بن‌بست شد…", "In a deadlock…", [
                ["یک متغیر دیگر غیر از قیمت را روی میز بگذارید", "Put a variable other than price on the table"],
                ["همان تخفیف را تکرار کنید", "Repeat the same discount"],
                ["اتهام بزنید", "Accuse them"],
                ["عدد را هر دقیقه کم کنید", "Cut the number every minute"],
              ], 0),
            ],
          ),
          lesson(
            "neg-social",
            "مذاکره در اینستاگرام و تلگرام",
            "Negotiation in Instagram and Telegram",
            "مذاکره نوشتاری هم کف و امتیاز می‌خواهد؛ فقط کوتاه‌تر نوشته می‌شود.",
            "Written negotiation still needs a floor and a trade. It is only typed shorter.",
            "nbrnzg6",
            20,
            [
              mcq("در چت، قیمت را کی بگوییم؟", "In chat, when do you say the price?", [
                ["بعد از یک سوال که مسئله را مشخص کند", "After a question that names the problem"],
                ["پیام اول، بدون سلام", "First message, with no hello"],
                ["بعد از بیست پیام بی‌ربط", "After twenty unrelated messages"],
                ["هرگز", "Never"],
              ], 0),
              mcq("امتیاز نوشتاری را…", "A written concession should be…", [
                ["مشروط و روشن بنویسید", "Written as conditional and explicit"],
                ["با ویس مبهم بگویید", "Left vague in a voice note"],
                ["پاک کنید", "Deleted"],
                ["چند بار بدون شرط تکرار کنید", "Repeated with no condition"],
              ], 0),
              mcq("اگر در دایرکت گفت «فکر می‌کنم»…", "If they type “I’ll think about it”…", [
                ["بپرسید کدام بخش مبهم است و زمان برگشت را ببندید", "Ask which part is unclear and book a return time"],
                ["همان شب پنج پیام تخفیف بفرستید", "Send five discount messages that night"],
                ["او را بلاک کنید", "Block them"],
                ["قیمت را نصف کنید", "Cut the price in half"],
              ], 0),
            ],
          ),
        ],
      },
    ],
  },
  {
    id: "free",
    tierRequired: "free",
    title: text("آموزش‌های رایگان", "Free Training Hub"),
    description: text(
      "برای همه کاربران واردشده باز است و فقط با رد کردن چالش درس قبل جلو می‌رود.",
      "Open to every signed-in learner. Each film unlocks only after the previous challenge.",
    ),
    subtopics: [
      {
        id: "starter",
        title: text("شروع رایگان", "Free start"),
        lessons: [
          lesson(
            "free-expression",
            "فن بیان برای فروش",
            "Expression for selling",
            "یک ورودی کوتاه برای واضح حرف زدن، قبل از مسیرهای اصلی.",
            "A short start on speaking clearly, before the main paths.",
            "d48l8u4",
            3,
            [
              mcq("فن بیان در فروش اول برای چیست؟", "Expression in sales is first for…", [
                ["فهمیده شدن در یک جمله", "Being understood in one sentence"],
                ["زیبا حرف زدن بدون محتوا", "Sounding pretty with no content"],
                ["تند حرف زدن", "Speaking faster"],
                ["حفظ اصطلاح انگلیسی", "Memorizing English jargon"],
              ], 0),
              mcq("جمله واضح فروش…", "A clear sales sentence…", [
                ["یک نتیجه برای مشتری را نام می‌برد", "Names one result for the buyer"],
                ["سه محصول را قاطی می‌کند", "Mixes three products"],
                ["با عذرخواهی شروع می‌شود", "Starts with an apology"],
                ["خیلی بلند است تا جدی به نظر برسد", "Is very long so it sounds serious"],
              ], 0),
              mcq("تمرین فن بیان یعنی…", "Expression practice means…", [
                ["همان جمله را شمرده و قابل فهم بگویید", "Saying the same line at a pace people can follow"],
                ["لحن را هر کلمه عوض کنید", "Changing tone every word"],
                ["از روی متن بدون معنی بخوانید", "Reading with no meaning"],
                ["فقط در جمع تمرین نکنید", "Never practicing out loud"],
              ], 0),
            ],
          ),
          lesson(
            "free-collar",
            "یک نکته زبان بدن",
            "One body-language note",
            "جزئیات ظاهر و اثرش روی برداشت اول، در چند دقیقه.",
            "A few minutes on appearance details and the first impression.",
            "e925n18",
            2,
            [
              mcq("برداشت اول حضوری بیشتر از کجا می‌آید؟", "The first in-person impression comes mostly from…", [
                ["آنچه قبل از توضیح محصول دیده می‌شود", "What is seen before the product explanation"],
                ["پاورقی قرارداد", "The contract footnote"],
                ["تعداد فیچر", "The feature count"],
                ["رنگ لوگو در اسلاید دهم", "The logo color on slide ten"],
              ], 0),
              mcq("جزئیات ظاهر وقتی مهم است که…", "Appearance details matter when…", [
                ["با پیام اعتماد یا بی‌دقتی جور باشند", "They match a message of care or carelessness"],
                ["گران‌ترین لباس باشد", "Only the most expensive clothes count"],
                ["مخاطب نباید ببیند", "The buyer should not look"],
                ["جایگزین کشف نیاز شود", "They replace discovery"],
              ], 0),
              mcq("نکته این درس رایگان…", "The point of this free lesson is…", [
                ["یک اصلاح کوچک قابل اجرا در جلسه بعد", "One small change you can use in the next meeting"],
                ["خرید پلن در همان ویدیو", "Buying a plan inside the film"],
                ["حفظ نظریه طولانی", "Memorizing a long theory"],
                ["نادیده گرفتن مشتری", "Ignoring the buyer"],
              ], 0),
            ],
          ),
          lesson(
            "free-funnel",
            "قیف را خالی نگذارید",
            "Do not let the funnel run dry",
            "مذاکره و فروش وقتی پایدار است که همیشه چند گفتگوی باز داشته باشید.",
            "Selling stays steady when several conversations stay open.",
            "c63651b",
            3,
            [
              mcq("قیف خالی چه نشانه‌ای است؟", "An empty funnel shows…", [
                ["همه تخم‌مرغ‌ها در یک گفتگوست", "Every hope sits in one conversation"],
                ["مهارت کامل مذاکره", "Perfect negotiation skill"],
                ["قیمت درست", "The right price"],
                ["نیاز به تعطیلی", "A need to stop prospecting"],
              ], 0),
              mcq("پر نگه داشتن قیف یعنی…", "Keeping the funnel full means…", [
                ["همزمان چند گفتگو در مرحله‌های مختلف داشته باشید", "Several talks sit in different stages at once"],
                ["فقط به خریدار امروز پیام بدهید", "Messaging only today’s buyer"],
                ["لید جدید را نادیده بگیرید", "Ignoring new leads"],
                ["هر گفتگو را همان روز ببندید یا حذف کنید", "Closing or deleting every talk the same day"],
              ], 0),
              mcq("اگر یک مذاکره سخت شد…", "If one negotiation gets hard…", [
                ["بقیه قیف هنوز باید جلو برود", "The rest of the funnel should still move"],
                ["همه تماس‌ها را متوقف کنید", "Stop every other call"],
                ["تخفیف را به کل لیست بفرستید", "Send a discount to the entire list"],
                ["قیف را پاک کنید", "Wipe the funnel"],
              ], 0),
            ],
          ),
        ],
      },
    ],
  },
];

export function pickText(value: Localized, lang: "fa" | "en") {
  return value[lang];
}

export function findCategory(id: string) {
  return categories.find((category) => category.id === id) ?? null;
}

export function lessonsOf(category: Category) {
  return category.subtopics.flatMap((subtopic) =>
    subtopic.lessons.map((item) => ({ subtopic, lesson: item })),
  );
}

export function allVideoLessons() {
  return categories.flatMap((category) =>
    lessonsOf(category).map((item) => ({ category, ...item })),
  );
}

export function findVideoLesson(categoryId: string, lessonId: string) {
  const category = findCategory(categoryId);
  if (!category) return null;
  const row = lessonsOf(category).find((item) => item.lesson.id === lessonId);
  if (!row) return null;
  return { category, ...row };
}

export function lessonGate(
  category: Category,
  lessonId: string,
  user: { isPremium: boolean } | null,
  passed: string[],
  subscribed = false,
): Gate {
  const unlocked = Boolean(user?.isPremium) || subscribed;
  if (!user && !subscribed) return { state: "auth" };
  if (category.tierRequired === "pro" && !unlocked) return { state: "plan" };
  const list = lessonsOf(category);
  const index = list.findIndex((item) => item.lesson.id === lessonId);
  if (index > 0) {
    const previous = list[index - 1]?.lesson;
    if (previous && !passed.includes(previous.id)) {
      return { state: "sequence", previous: previous.title };
    }
  }
  return { state: "open" };
}

export function nextLessonId(category: Category, lessonId: string) {
  const list = lessonsOf(category);
  const index = list.findIndex((item) => item.lesson.id === lessonId);
  return list[index + 1]?.lesson.id ?? null;
}

export function learnStaticParams() {
  return allVideoLessons().map(({ category, lesson }) => ({
    category: category.id,
    lesson: lesson.id,
  }));
}
