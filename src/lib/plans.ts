export type PlanId = "eco" | "plus" | "pro";

export const PLAN_RANK: Record<PlanId, number> = {
  eco: 1,
  plus: 2,
  pro: 3,
};

export type Plan = {
  id: PlanId;
  name: string;
  compact: string;
  price: number;
  audience: string;
  highlight?: boolean;
  features: string[];
};

const fullAcademyAccess = "دسترسی کامل و بدون محدودیت به تمام دوره‌های ۴ گانه آکادمی";

export const PLANS: Plan[] = [
  {
    id: "eco",
    name: "ماهانه",
    compact: "۲٫۴۵۶",
    price: 2_456_000,
    audience: "پایه، برای شروع یک‌ماهه و تمرین روزانه",
    features: [
      fullAcademyAccess,
      "۳ آنالیز هوش مصنوعی فروش در روز",
      "قالب‌ها و چک‌لیست‌های پایه: اسکریپت اولیه تماس و فرم گزارش ساده",
      "پشتیبانی سیستمی با تیکت؛ پاسخ تا ۴۸ ساعت کاری",
      "کوئیز پایان فصل و گواهی دیجیتال مقدماتی",
    ],
  },
  {
    id: "plus",
    name: "۳ ماهه",
    compact: "۴٫۷۲۸",
    price: 4_728_000,
    audience: "یک فصل تمرین، مناسب کارشناسان فروش",
    highlight: true,
    features: [
      fullAcademyAccess,
      "۱۰ آنالیز هوش مصنوعی فروش در روز",
      "یک وبینار یا جلسه پرسش‌وپاسخ زنده در هر ماه",
      "اکسل تارگت، تمپلیت CRM و اسکریپت‌های حرفه‌ای مذاکره",
      "تیکت و چت اختصاصی با پاسخ زیر ۱۲ ساعت",
      "یک جلسه ۳۰ دقیقه‌ای بررسی ساختار فروش، هر ماه",
    ],
  },
  {
    id: "pro",
    name: "سالانه",
    compact: "۵٫۹۴۲",
    price: 5_942_000,
    audience: "منتورینگ سالانه و سقف باز تحلیل تماس",
    features: [
      fullAcademyAccess,
      "آنالیز نامحدود هوش مصنوعی فروش در روز",
      "دو جلسه اختصاصی یک‌به‌یک در ماه برای کوچینگ و عارضه‌یابی",
      "بازبینی قیف فروش و متن پیشنهاد تجاری کسب‌وکار شما",
      "لایسنس تیمی برای ۳ تا ۵ کاربر و داشبورد شاخص‌های فروش",
      "پشتیبانی اولویت‌دار؛ پاسخ آنی در کانال اختصاصی",
    ],
  },
];

export function planById(id: PlanId) {
  return PLANS.find((plan) => plan.id === id)!;
}

export function supportSla(plan: PlanId | null) {
  if (plan === "pro") return "پاسخ آنی از کانال اختصاصی VIP";
  if (plan === "plus") return "تیکت و چت اختصاصی، زیر ۱۲ ساعت";
  if (plan === "eco") return "تیکت سیستمی، تا ۴۸ ساعت کاری";
  return "بعد از تهیه اشتراک، زمان پاسخ مطابق پلن شماست";
}
