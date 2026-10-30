export type ServiceOption = {
  id: string;
  label: string;
  amount: number;
};

export type ServiceParam = {
  id: string;
  label: string;
  options: ServiceOption[];
};

export type ServiceOffer = {
  id: string;
  title: string;
  text: string;
  params: ServiceParam[];
};

export type ServiceLine = {
  name: string;
  label: string;
  value: string;
  amount: number;
};

export const SERVICE_OFFERS: ServiceOffer[] = [
  {
    id: "script",
    title: "بازنویسی اسکریپت تیم فروش",
    text: "چارچوب گفتن برای تماس ورودی، تماس سرد و اعتراض‌های پرتکرار. اندازه تیم، نوع تماس و تعداد چارچوب مبلغ را عوض می‌کند.",
    params: [
      {
        id: "team",
        label: "اندازه تیم",
        options: [
          { id: "5", label: "۱ تا ۵ نفر", amount: 4_000_000 },
          { id: "15", label: "۶ تا ۱۵ نفر", amount: 6_000_000 },
          { id: "40", label: "۱۶ تا ۴۰ نفر", amount: 8_000_000 },
        ],
      },
      {
        id: "calls",
        label: "نوع تماس",
        options: [
          { id: "in", label: "فقط تماس ورودی", amount: 0 },
          { id: "out", label: "فقط تماس سرد", amount: 0 },
          { id: "both", label: "ورودی و سرد", amount: 2_000_000 },
        ],
      },
      {
        id: "frames",
        label: "تعداد چارچوب",
        options: [
          { id: "1", label: "یک چارچوب", amount: 0 },
          { id: "3", label: "سه چارچوب", amount: 2_000_000 },
          { id: "6", label: "شش چارچوب", amount: 5_000_000 },
        ],
      },
    ],
  },
  {
    id: "workshop",
    title: "آموزش حضوری پرسنل",
    text: "کارگاه زبان بدن، نیازسنجی و دمو برای سناریوهای همان تیم. مدت، تعداد نفر و محل برگزاری مبلغ را عوض می‌کند.",
    params: [
      {
        id: "duration",
        label: "مدت کارگاه",
        options: [
          { id: "half", label: "نیم‌روز", amount: 8_000_000 },
          { id: "day", label: "یک روز", amount: 12_000_000 },
          { id: "two", label: "دو روز", amount: 20_000_000 },
        ],
      },
      {
        id: "people",
        label: "تعداد شرکت‌کننده",
        options: [
          { id: "8", label: "تا ۸ نفر", amount: 0 },
          { id: "16", label: "۹ تا ۱۶ نفر", amount: 2_000_000 },
          { id: "30", label: "۱۷ تا ۳۰ نفر", amount: 4_000_000 },
        ],
      },
      {
        id: "place",
        label: "محل برگزاری",
        options: [
          { id: "tehran", label: "تهران", amount: 0 },
          { id: "other", label: "شهر دیگر", amount: 3_000_000 },
        ],
      },
    ],
  },
  {
    id: "funnel",
    title: "بهینه‌سازی قیف فروش",
    text: "اصلاح صفحهٔ فرود، پیشنهاد و مسیر دایرکت. تعداد کانال و عمق مسیر مبلغ را عوض می‌کند.",
    params: [
      {
        id: "channels",
        label: "تعداد کانال",
        options: [
          { id: "1", label: "یک کانال", amount: 6_000_000 },
          { id: "2", label: "دو کانال", amount: 8_000_000 },
          { id: "3", label: "سه کانال یا بیشتر", amount: 11_000_000 },
        ],
      },
      {
        id: "depth",
        label: "عمق اصلاح",
        options: [
          { id: "land", label: "فقط صفحهٔ فرود", amount: 0 },
          { id: "offer", label: "فرود و پیشنهاد", amount: 2_000_000 },
          { id: "full", label: "فرود، پیشنهاد و مسیر دایرکت", amount: 4_000_000 },
        ],
      },
    ],
  },
  {
    id: "mentor",
    title: "منتورینگ مدیر فروش",
    text: "جلسهٔ یک‌به‌یک برای عارضه‌یابی تیم و شاخص‌ها. تعداد جلسه در ماه و اندازه تیم مبلغ را عوض می‌کند.",
    params: [
      {
        id: "sessions",
        label: "جلسه در ماه",
        options: [
          { id: "1", label: "۱ جلسه", amount: 5_000_000 },
          { id: "2", label: "۲ جلسه", amount: 9_000_000 },
          { id: "4", label: "۴ جلسه", amount: 16_000_000 },
        ],
      },
      {
        id: "team",
        label: "اندازه تیم",
        options: [
          { id: "5", label: "تا ۵ نفر", amount: 0 },
          { id: "15", label: "۶ تا ۱۵ نفر", amount: 2_000_000 },
          { id: "40", label: "۱۶ تا ۴۰ نفر", amount: 4_000_000 },
        ],
      },
    ],
  },
];

export function quoteService(offer: ServiceOffer, picks: Record<string, string>) {
  const lines: ServiceLine[] = offer.params.map((param) => {
    const chosen = param.options.find((option) => option.id === picks[param.id]) ?? param.options[0];
    return {
      name: param.id,
      label: param.label,
      value: chosen.label,
      amount: chosen.amount,
    };
  });
  return {
    lines,
    total: lines.reduce((sum, line) => sum + line.amount, 0),
  };
}

export function serviceBreakdown(lines: Array<{ value: string; amount: number }>, format: (amount: number) => string) {
  return lines.map((line) => (line.amount > 0 ? `${line.value} · ${format(line.amount)}` : line.value)).join(" + ");
}
