export type Bilingual = {
  fa: string;
  en: string;
};

export type AuditSubMetric = {
  key: "tone" | "listening" | "objection" | "closing";
  label: Bilingual;
  score: number;
};

export type AuditWeakness = Bilingual & {
  timestamp: string;
};

export type AuditDrill = Bilingual & {
  href?: string;
};

export type CallAudit = {
  overallScore: number;
  subMetrics: readonly AuditSubMetric[];
  strengths: readonly Bilingual[];
  weaknesses: readonly AuditWeakness[];
  drills: readonly AuditDrill[];
};

export const objectionLessonHref = "/learn/mozakerah/neg-objection";

export const mockAnalysisData: CallAudit = {
  overallScore: 82,
  subMetrics: [
    { key: "tone", label: { fa: "لحن و اعتمادبه‌نفس", en: "Tone & Confidence" }, score: 88 },
    { key: "listening", label: { fa: "گوش دادن فعال", en: "Active Listening" }, score: 72 },
    { key: "objection", label: { fa: "مدیریت اعتراض", en: "Objection Handling" }, score: 85 },
    { key: "closing", label: { fa: "بستن و دعوت به اقدام", en: "Closing & CTA" }, score: 68 },
  ],
  strengths: [
    {
      fa: "شروع تماس دلیل مشخصی داشت. نام خریدار را درست گفتید و قبل از معرفی محصول، یک جمله دربارهٔ نتیجهٔ تماس گفتید؛ شنونده لازم نبود حدس بزند چرا زنگ زده‌اید.",
      en: "The opening had a clear reason. You used the buyer’s name and stated the outcome of the call before the product, so they did not have to guess why you rang.",
    },
    {
      fa: "وقتی نام رقیب آمد، همان لحظه از قیمت دفاع نکردید. اول پرسیدید کدام بخش پیشنهاد آن‌ها برای خریدار مهم است و بعد تفاوت را به همان معیار وصل کردید.",
      en: "When a competitor came up, you did not defend price immediately. You asked which part of their offer mattered, then tied the difference to that criterion.",
    },
    {
      fa: "روی سوال قیمت، سرعت حرف زدن پایین آمد و صدا بالا نرفت. مکث کوتاه قبل از عدد، لحن را مطمئن نگه داشت و عجلهٔ تخفیف را نشان نداد.",
      en: "On the price question your pace dropped and your voice did not climb. The short pause before the number kept the tone steady and did not signal a rush to discount.",
    },
  ],
  weaknesses: [
    {
      timestamp: "01:42",
      fa: "وسط شرح تجربهٔ ناموفق خریدار با تأمین‌کنندهٔ قبلی، حرف او را قطع کردید. بقیهٔ داستان و معیاری که از آن شکست مانده بود شنیده نشد.",
      en: "You cut in while the buyer was describing a failed vendor. The rest of that story, and the criterion left behind by the failure, never got said.",
    },
    {
      timestamp: "04:18",
      fa: "به «گرونه» با فهرست قابلیت جواب دادید. سوال «نسبت به چه چیزی؟» پرسیده نشد و اعتراض قیمت بدون مقایسهٔ مشخص بسته شد.",
      en: "You answered “it’s expensive” with a feature list. “Compared with what?” was never asked, so the price objection closed without a concrete comparison.",
    },
    {
      timestamp: "07:55",
      fa: "تماس با «خبر می‌دم» تمام شد. نه روز، نه صاحب اقدام، نه تصمیم مشخصی روی میز نماند.",
      en: "The call ended on “I’ll let you know.” No day, no owner, and no single decision stayed on the table.",
    },
  ],
  drills: [
    {
      href: objectionLessonHref,
      fa: "قطعهٔ ۰۴:۱۸ را دوباره بشنوید. یک سوال مقایسه و یک مبادله بنویسید: امتیاز فقط در برابر تعهد، حجم یا زمان. بعد درس «مخالفت مشتری» را در مسیر مذاکرهٔ آکادمی تا چالش آخر ببینید.",
      en: "Replay 04:18. Write one comparison question and one trade: a concession only for commitment, volume, or timing. Then take the academy lesson “Buyer objections” on the negotiation path through its challenge.",
    },
    {
      fa: "یک بستن ۴۵ ثانیه‌ای ضبط کنید که فقط سه چیز دارد: روز مشخص، نام صاحب قدم بعدی، و تصمیمی که در آن تماس باید گرفته شود. جملهٔ «خبر می‌دم» را حذف کنید.",
      en: "Record a 45-second close with only three things: a named day, the owner of the next step, and the decision that call must make. Delete “I’ll let you know.”",
    },
    {
      fa: "از ۰۱:۴۲، جملهٔ خریدار را قبل از هر واقعیت محصول در یک خط برگردانید. ضبط را تا وقتی نگه دارید که آن خط، حرف خود خریدار باشد نه خلاصهٔ شما.",
      en: "From 01:42, give the buyer’s sentence back in one line before any product fact. Keep the take until that line is their wording, not your summary.",
    },
  ],
};
