"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const services = [
  {
    title: "بازنویسی اسکریپت تیم فروش",
    text: "تماس ورودی، تماس سرد و اعتراض‌های پرتکرار تیم را به چارچوب قابل گفتن تبدیل می‌کنیم.",
  },
  {
    title: "آموزش حضوری پرسنل",
    text: "کارگاه زبان بدن، نیازسنجی و دمو برای تیم فروش مستقیم، همراه رول‌پلی همان سناریوهای شرکت.",
  },
  {
    title: "بهینه‌سازی قیف فروش",
    text: "صفحهٔ فرود، پیشنهاد، سبد رهاشده و مسیر دایرکت را با یک شاخص مشخص اصلاح می‌کنیم.",
  },
  {
    title: "منتورینگ مدیر فروش",
    text: "دو جلسهٔ یک‌به‌یک در ماه برای عارضه‌یابی تیم، شاخص‌ها و معرفی نیروهای برتر دوره.",
  },
];

export function ServicesScreen() {
  const [sent, setSent] = useState(false);
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [need, setNeed] = useState(services[0].title);
  const [detail, setDetail] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (company.trim().length < 2 || phone.trim().length < 8 || detail.trim().length < 8) {
      toast.error("نام شرکت، شماره و شرح نیاز را کامل کنید.");
      return;
    }
    setSent(true);
    toast.success("درخواست سازمانی ثبت شد.");
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">خدمات</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          برای تیم‌ها و فروشگاه‌هایی که به‌جای دورهٔ عمومی، اسکریپت، قیف و آموزش نیروی خودشان را می‌خواهند.
        </p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {services.map((service) => (
          <article key={service.title} className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
            <h2 className="font-semibold">{service.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{service.text}</p>
          </article>
        ))}
      </div>
      <form onSubmit={submit} className="max-w-xl space-y-3 rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="text-lg font-semibold">درخواست بررسی تیم فروش</h2>
        {sent ? (
          <p className="text-sm leading-7">
            درخواست {company} برای «{need}» ثبت شد. در پروتوتایپ، هماهنگی بعدی شبیه‌سازی می‌شود و تماسی برقرار نخواهد شد.
          </p>
        ) : (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="company">نام شرکت</Label>
              <Input id="company" value={company} onChange={(event) => setCompany(event.target.value)} className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">شماره تماس</Label>
              <Input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} className="h-10" dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="need">نوع خدمت</Label>
              <select
                id="need"
                value={need}
                onChange={(event) => setNeed(event.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                {services.map((service) => (
                  <option key={service.title}>{service.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="detail">شرح کوتاه</Label>
              <Textarea id="detail" value={detail} onChange={(event) => setDetail(event.target.value)} className="min-h-28" />
            </div>
            <Button type="submit" className="h-10 px-4">
              ثبت درخواست
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
