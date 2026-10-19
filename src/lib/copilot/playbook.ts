export type ObjectionId = "discount" | "price" | "think" | "authority" | "timing" | "competitor" | "trust";

export type Objection = {
  id: ObjectionId;
  tag: string;
  patterns: string[];
  technique: string;
  lines: string[];
};

export const OBJECTIONS: Objection[] = [
  {
    id: "discount",
    tag: "درخواست تخفیف",
    patterns: ["تخفیف", "کمتر حساب", "چند درصد", "ارزون‌تر حساب"],
    technique: "امتیاز مشروط",
    lines: [
      "تخفیف را به حجم گره بزنید، به التماس نه. اگر این ماه دو دوره را با هم ببندیم، همان‌جا عدد را تنظیم می‌کنم.",
      "عدد را همین‌جا خالی پایین نمی‌آورم. بگویید اگر پرداخت این هفته قطعی است، چه امتیازی برای شما معامله را می‌بندد؟",
    ],
  },
  {
    id: "price",
    tag: "اعتراض به قیمت",
    patterns: ["قیمت", "گرون", "گران", "بالاست", "زیاد", "هزینه"],
    technique: "قیمت در برابر هزینهٔ نخریدن",
    lines: [
      "حق دارید روی عدد بمانید. اگر این اعتراض هر ماه یک قرارداد را از دستتان بگیرد، قیمت دوره کنار آن چه عددی می‌شود؟",
      "گران یعنی نسبت به نتیجه. اگر فقط یک تماس این ماه با همین جواب بسته شود، این عدد برمی‌گردد یا نه؟",
    ],
  },
  {
    id: "think",
    tag: "باید فکر کنم",
    patterns: ["فکر کنم", "فکر کنم.", "باید فکر", "بگذارید فکر", "مشورت"],
    technique: "مبهم را مشخص کن",
    lines: [
      "حتماً. کدام بخش مبهم است: خود نتیجه، زمان اجرا، یا عدد؟ همان یکی را الان روشن کنیم.",
      "فکر کردن منطقی است. اگر تا فردا ظهر جواب نرسد، فرض را بر توقف می‌گذارم یا یک زمان مشخص برای برگشت ببندیم؟",
    ],
  },
  {
    id: "authority",
    tag: "تصمیم‌گیرنده کس دیگری است",
    patterns: ["مدیر", "شریک", "همسر", "باید بپرسم", "تصمیم با"],
    technique: "قرار سه‌نفره",
    lines: [
      "درست است که تنها تصمیم نگیرید. همان کسی که امضا می‌کند را پای یک تماس پانزده‌دقیقه‌ای بیاوریم، چه زمانی هر دو آزادید؟",
      "پس من با شما قانع‌کردن را تمام نمی‌کنم. بگویید تصمیم‌گیرنده بیشتر روی قیمت حساس است یا روی نتیجه؟",
    ],
  },
  {
    id: "timing",
    tag: "الان وقتش نیست",
    patterns: ["وقت ندار", "سرم شلوغ", "بعدا", "الان نه", "هفته بعد"],
    technique: "قرار کوچک",
    lines: [
      "قبول. آموزش را الان فشار نمی‌دهم. یک تماس دوازده‌دقیقه‌ای برای بستن فقط قدم بعدی، پنجشنبه یا یکشنبه؟",
      "اگر این هفته شلوغ است، موضوع را باز نمی‌گذارم. چه روزی خودتان زنگ می‌زنید که من پیگیری اضافی نکنم؟",
    ],
  },
  {
    id: "competitor",
    tag: "مقایسه با جای دیگر",
    patterns: ["جای دیگه", "جای دیگر", "رقیب", "ارزان‌تر", "ارزون‌تر دید"],
    technique: "تفاوت قابل‌لمس",
    lines: [
      "مقایسه درست است. آن پیشنهاد ارزان‌تر، موقع اعتراض پشت خط جواب آماده هم می‌دهد یا فقط ویدیو است؟",
      "اگر فقط قیمت را کنار هم بگذاریم، ارزان‌تر برنده‌ است. شما تماس زنده می‌خواهید یا یک دورهٔ ضبط‌شده؟",
    ],
  },
  {
    id: "trust",
    tag: "اطمینان نداشتن",
    patterns: ["مطمئن نیست", "ضمانت", "کلاه", "قبلاً بد", "اعتماد"],
    technique: "ریسک را کوچک کن",
    lines: [
      "بی‌اعتمادی منطقی است. به‌جای قول کلی، یک هفته با سهمیهٔ محدود کوپایلوت جلو می‌رویم و اگر به کارت جواب نرسیدید، ادامه نمی‌دهیم.",
      "نمی‌خواهم باور کنید. یک اعتراض واقعی خودتان را همین حالا بگویید. اگر جواب به درد تماس نخورد، همین‌جا تمامش می‌کنیم.",
    ],
  },
];

export type CounterCard = {
  matched: boolean;
  id: ObjectionId | null;
  tag: string;
  technique: string;
  say: string;
  variant: number;
};

function normalize(text: string) {
  return text.replace(/\u200c/g, " ").replace(/[؟?!.،,]/g, " ").replace(/\s+/g, " ").trim();
}

export function matchObjection(text: string): Objection | null {
  const hay = normalize(text);
  if (!hay) return null;
  for (const item of OBJECTIONS) {
    if (item.patterns.some((pattern) => hay.includes(pattern))) return item;
  }
  return null;
}

export function counterFor(text: string, variant = 0): CounterCard {
  const hit = matchObjection(text);
  if (!hit) {
    return {
      matched: false,
      id: null,
      tag: "",
      technique: "",
      say: "",
      variant: 0,
    };
  }
  const index = ((variant % hit.lines.length) + hit.lines.length) % hit.lines.length;
  return {
    matched: true,
    id: hit.id,
    tag: hit.tag,
    technique: hit.technique,
    say: hit.lines[index] ?? hit.lines[0],
    variant: index,
  };
}
