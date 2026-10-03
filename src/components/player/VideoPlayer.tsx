"use client";

import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function VideoPlayer({
  title,
  src,
  locked,
}: {
  title: string;
  src: string;
  locked: boolean;
}) {
  const router = useRouter();
  const { copy } = useI18n();

  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl border border-[color:var(--glass-border)] bg-[#0B132B] shadow-2xl">
      <iframe
        title={title}
        src={src}
        className={locked ? "absolute inset-0 h-full w-full scale-105 blur-md" : "absolute inset-0 h-full w-full"}
        allow={locked ? undefined : "autoplay; fullscreen"}
        allowFullScreen={!locked}
        tabIndex={locked ? -1 : undefined}
        aria-hidden={locked}
      />
      {locked ? (
        <div className="absolute inset-0 grid place-items-center bg-[#0B132B]/55 p-4 backdrop-blur-md">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscription-lock-title"
            className="glass w-full max-w-md rounded-3xl p-6 text-center shadow-2xl"
            style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
          >
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37]">
              <Lock />
            </span>
            <p id="subscription-lock-title" className="mt-4 text-sm leading-7">
              {copy.learn.subscriptionLock}
            </p>
            <button
              type="button"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-medium"
              style={{ backgroundColor: "#D4AF37", color: "#0B132B" }}
              onClick={() => router.push("/subscription#pricing-plans")}
            >
              {copy.learn.viewPlans}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
