import Link from "next/link";

const rows = [
  {
    id: "lms",
    name: "فقط آکادمی",
    price: "۲٬۴۵۶٬۰۰۰ تومان / ماه",
    points: ["چهار مسیر ویدیویی آپارات", "آزمون سه‌سؤالی و قفل مرحله", "بدون دقیقهٔ دستیار زنده"],
    href: "/subscription#pricing-plans",
    cta: "شروع آکادمی",
  },
  {
    id: "copilot",
    name: "آکادمی + کوپایلوت",
    price: "۴٬۷۲۸٬۰۰۰ تومان / فصل",
    points: ["همهٔ درس‌های پولی", "۳۰۰ دقیقه شنیدن زنده در ماه", "کارت جواب آمادهٔ گفتن پشت خط"],
    href: "/dashboard/copilot",
    cta: "امتحان دستیار",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "سازمانی",
    price: "۵٬۹۴۲٬۰۰۰ تومان / سال",
    points: ["چند کاربر فروش", "۲۰۰۰ دقیقه کوپایلوت", "بازبینی قیف و اسکریپت تیم"],
    href: "/contact",
    cta: "گفتگو با ما",
  },
];

export function PricingCompare() {
  return (
    <section dir="rtl" className="space-y-4" data-pricing-compare>
      <div>
        <h2 className="text-2xl font-semibold">شفاف: درس تنها، یا درس به‌علاوه دقیقهٔ زنده</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">پرداخت آزمایشی همان مسیر اشتراک فعلی است. دقیقهٔ کوپایلوت به پلن فصلی و سالانه وصل می‌شود.</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {rows.map((row) => (
          <article
            key={row.id}
            data-plan-tier={row.id}
            className={`flex flex-col rounded-[28px] border p-5 ${row.highlight ? "border-[#D4AF37] bg-[#0B132B] text-[#F8F1DE]" : "border-[color:var(--glass-border)]"}`}
          >
            <h3 className="text-lg font-semibold">{row.name}</h3>
            <p className={`mt-2 text-sm ${row.highlight ? "text-[#D4AF37]" : "text-muted-foreground"}`}>{row.price}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm leading-7">
              {row.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link
              href={row.href}
              className={`mt-5 inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-medium ${row.highlight ? "bg-[#D4AF37] text-[#0B132B]" : "bg-[#0B132B] text-[#F3E5AB]"}`}
            >
              {row.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
