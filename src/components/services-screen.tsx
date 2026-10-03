"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { CallAnalyzer } from "@/components/services/call-analyzer/CallAnalyzer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
      <header className="print-hide">
        <h1 className="text-2xl font-semibold">خدمات</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          برای تیم‌ها و فروشگاه‌هایی که به‌جای دورهٔ عمومی، اسکریپت، قیف و آموزش نیروی خودشان را می‌خواهند.
        </p>
      </header>
      <CallAnalyzer />
      <div className="print-hide grid gap-3 md:grid-cols-2">
        {services.map((service) => (
          <article key={service.title} className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
            <h2 className="font-semibold">{service.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{service.text}</p>
          </article>
        ))}
      </div>
      <form onSubmit={submit} className="print-hide max-w-xl space-y-3 rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
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
              <Label id="need-label">نوع خدمت</Label>
              <ServicePicker value={need} onChange={setNeed} />
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

function ServicePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = services.find((service) => service.title === value) ?? services[0];

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-labelledby="need-label"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-2xl border border-[#0F1C3F]/12 bg-white/80 px-3 text-sm text-[#0B132B] backdrop-blur-md dark:border-[#D4AF37]/30 dark:bg-[#0F1C3F]/90 dark:text-slate-100"
      >
        <span className="truncate text-start">{selected.title}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-[#B89020] transition", open && "rotate-180")} />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-labelledby="need-label"
          className="absolute z-30 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-[#0F1C3F]/12 bg-white/90 p-1.5 shadow-[0_10px_30px_-10px_rgba(15,28,63,0.18)] backdrop-blur-md dark:border-[#D4AF37]/30 dark:bg-[#0B132B]/95"
        >
          {services.map((service) => {
            const active = service.title === selected.title;
            return (
              <li key={service.title} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(service.title);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full rounded-xl px-3 py-2.5 text-start transition",
                    "text-[#0B132B] hover:bg-[#0F1C3F]/8",
                    "dark:text-slate-100 dark:hover:bg-[#1C2541]",
                    active && "bg-[#D4AF37]/15 text-[#8C7016] dark:bg-[#D4AF37]/15 dark:text-[#D4AF37]",
                  )}
                >
                  <span className="block text-sm font-medium">{service.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{service.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
