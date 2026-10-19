"use client";

import Link from "next/link";
import { AudioLines } from "lucide-react";

export function CopilotPaywall({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#0B132B]/70 p-4 backdrop-blur-md" onClick={onClose}>
      <div
        role="dialog"
        aria-labelledby="copilot-paywall-title"
        dir="rtl"
        className="w-full max-w-lg rounded-[28px] bg-[#070B18] p-6 text-[#F8F1DE] shadow-2xl"
        data-copilot-paywall
        onClick={(event) => event.stopPropagation()}
      >
        <span className="grid size-12 place-items-center rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37]">
          <AudioLines />
        </span>
        <h2 id="copilot-paywall-title" className="mt-4 text-2xl font-semibold">این درس با اشتراک باز می‌شود</h2>
        <p className="mt-3 text-sm leading-8 text-white/75">
          آکادمی مسیر را قفل می‌کند تا هر ویدیو بعد از آزمون باز شود. دلیل اصلی اشتراک، دستیار زندهٔ پشت خط است: اعتراض را می‌شنود و یک جملهٔ آماده برای گفتن نشان می‌دهد.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/80">
          <li>آکادمی تنها: دوره‌های پولی، بدون دقیقهٔ کوپایلوت</li>
          <li>آکادمی + کوپایلوت: همان درس‌ها به‌علاوه ۳۰۰ دقیقه شنیدن زنده</li>
          <li>سازمانی: ۲۰۰۰ دقیقه و چند کاربر</li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/subscription#pricing-plans" className="inline-flex h-11 items-center rounded-2xl bg-[#D4AF37] px-4 text-sm font-semibold text-[#0B132B]">
            مشاهده پلن‌ها
          </Link>
          <Link href="/dashboard/copilot" className="inline-flex h-11 items-center rounded-2xl bg-white/10 px-4 text-sm">
            امتحان دستیار
          </Link>
          <button type="button" onClick={onClose} className="inline-flex h-11 items-center px-3 text-sm text-white/70">
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
